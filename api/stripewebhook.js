// Stripe webhook receiver. Verifies the Stripe-Signature header, then
// forwards the (already-trusted) event to the Apps Script CRM with a
// shared secret so Apps Script can skip its own signature check.
//
// Required Vercel environment variables:
//   STRIPE_SECRET_KEY              sk_live_... or sk_test_...
//   STRIPE_WEBHOOK_SECRET          whsec_... (from the Stripe webhook endpoint)
//   APPS_SCRIPT_URL                https://script.google.com/macros/s/.../exec
//   APPS_SCRIPT_SHARED_SECRET      same value as STRIPE_WEBHOOK_FORWARD_SECRET in Apps Script

import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

const FORWARD_TYPES = new Set([
  'checkout.session.completed',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  const sharedSecret = process.env.APPS_SCRIPT_SHARED_SECRET;

  if (!stripeSecret || !webhookSecret || !appsScriptUrl || !sharedSecret) {
    console.error('stripe-webhook: missing one or more required env vars');
    return res.status(500).send('Server not configured');
  }

  const stripe = new Stripe(stripeSecret);
  const sig = req.headers['stripe-signature'];
  let raw;
  try { raw = await readRawBody(req); }
  catch (e) { return res.status(400).send('Could not read body'); }

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    console.warn('stripe-webhook: signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Acknowledge fast — Stripe times out after 5s. Forward to Apps Script
  // asynchronously and don't block the 200 response on it. If the forward
  // fails, Apps Script can be re-synced manually since the source of truth
  // is always Stripe (and we dedupe by event_id on the CRM side).
  if (FORWARD_TYPES.has(event.type)) {
    forwardToAppsScript(appsScriptUrl, sharedSecret, event).catch(err => {
      console.error('stripe-webhook: forward to Apps Script failed:', err.message);
    });
  }

  return res.status(200).json({ received: true, type: event.type });
}

async function forwardToAppsScript(url, sharedSecret, event) {
  const payload = {
    action: 'stripe_event',
    data: {
      shared_secret: sharedSecret,
      event_id: event.id,
      type: event.type,
      payload: event.data && event.data.object ? event.data.object : {},
    },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`Apps Script returned ${res.status}`);
  }
}
