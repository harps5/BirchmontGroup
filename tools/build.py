#!/usr/bin/env python3
"""Static site generator for birchmontgroup.ca.

Edit content here, then run:  python3 tools/build.py
Shared header/footer/meta live in one place so every page stays consistent.
This folder is excluded from deploys via .vercelignore.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.birchmontgroup.ca"
BOOK = "https://cal.com/birchmont-discovery"
EMAIL = "info@birchmontgroup.ca"
YEAR = 2026

# ---------------------------------------------------------------- pricing
PKGS = {
    "workshop":   {"name": "AI Kickstart Workshop", "kind": "Learn", "price": "$1,250", "pre": "", "post": "",
                   "num": 1250, "time": "Half day", "short": "Get your whole team using AI confidently and safely, in one session."},
    "assessment": {"name": "AI Opportunity Assessment", "kind": "Find", "price": "$2,500", "pre": "", "post": "",
                   "num": 2500, "time": "2 weeks", "short": "A ranked, costed roadmap of where AI will pay off in your business."},
    "sprint":     {"name": "Automation Sprint", "kind": "Build", "price": "$7,500", "pre": "from", "post": "",
                   "num": 7500, "time": "4&ndash;6 weeks", "short": "Your highest-value workflow, automated, live and handed over."},
    "partner":    {"name": "AI Partner", "kind": "Grow", "price": "$1,500", "pre": "from", "post": "/mo",
                   "num": 1500, "time": "Ongoing", "short": "Your fractional AI team: keep it running, keep it improving."},
}

def price_html(k, cls="price__amt"):
    p = PKGS[k]
    pre = f"<small>{p['pre']}</small>" if p["pre"] else ""
    post = f"<small>{p['post']}</small>" if p["post"] else ""
    return f'<div class="{cls}">{pre}<b>{p["price"]}</b>{post}</div>'

def price_text(k):
    p = PKGS[k]
    return (p["pre"] + " " if p["pre"] else "") + p["price"] + p["post"]

# ---------------------------------------------------------------- icons
ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CHECK = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CROSS = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'

ICONS = {
    "clock": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    "bolt": '<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z"/>',
    "shield": '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.3-4.5"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6 8.5-6"/>',
    "doc": '<path d="M6.5 3h7.5l4.5 4.5V19a2 2 0 01-2 2h-10a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M13.5 3v5h5M8.5 13h7M8.5 16.5h5"/>',
    "chart": '<path d="M4 20V4M4 20h16"/><path d="M8 15l3.5-4 3 2.5L19.5 8"/>',
    "sparkle": '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    "target": '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    "scale": '<path d="M12 3v18M5 21h14M4 8h16M7 8l-3 7a3 3 0 006 0zM17 8l-3 7a3 3 0 006 0z"/>',
    "key": '<circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8L20 3M16.5 6.5l2.5 2.5M14 9l2 2"/>',
    "tag": '<path d="M3.5 12.2V4.5a1 1 0 011-1h7.7l8.3 8.3a1.5 1.5 0 010 2.1l-6.6 6.6a1.5 1.5 0 01-2.1 0z"/><circle cx="8" cy="8" r="1.5"/>',
    "calendar": '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    "pin": '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "people": '<circle cx="9" cy="8" r="3.2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14.6c2.3.2 4 1.6 4.5 4.4"/>',
    "briefcase": '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7M3 12.5h18"/>',
    "hammer": '<path d="M14 6l4 4M3.5 20.5l9-9M11 4.5l3-1.5 6.5 6.5-1.5 3-2-.5-5-5z"/>',
    "home": '<path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
    "cross": '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
    "cup": '<path d="M5 8h11v6a5 5 0 01-5 5h-1a5 5 0 01-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 010 5H16M8 2.5v3M11.5 2.5v3"/>',
    "truck": '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    "store": '<path d="M4 9.5V20h16V9.5"/><path d="M3 9.5L5 4h14l2 5.5a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0z"/>',
    "wheat": '<path d="M12 21V9M12 13c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4zM12 13c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4zM12 9c-2 0-3.2-1.2-3.2-3.2C10.8 5.8 12 7 12 9zM12 9c2 0 3.2-1.2 3.2-3.2C13.2 5.8 12 7 12 9z"/>',
    "star": '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
    "map": '<path d="M9 4.5l-5 2v13l5-2 6 2 5-2v-13l-5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
    "check": '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.3l2.4 2.4 4.6-5"/>',
}

def icon(name, size=22):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')

# ---------------------------------------------------------------- chrome
NAV = [("/packages/", "Packages"), ("/#how", "How it works"), ("/scorecard/", "Scorecard"), ("/about/", "About"), ("/contact/", "Contact")]
LOGO = '<span class="logo" aria-hidden="true"><span class="logo__primary">BIRCHMONT</span><span class="logo__rule"><span class="logo__secondary">GROUP</span></span></span>'

def schema():
    offers = []
    for k, p in PKGS.items():
        o = {"@type": "Offer", "name": p["name"], "description": p["short"].replace("&ndash;", "-"),
             "url": f"{SITE}/packages/#{k}", "priceCurrency": "CAD"}
        if k == "partner":
            o["priceSpecification"] = {"@type": "UnitPriceSpecification", "minPrice": p["num"], "priceCurrency": "CAD", "unitText": "MONTH"}
        elif p["pre"] == "from":
            o["priceSpecification"] = {"@type": "PriceSpecification", "minPrice": p["num"], "priceCurrency": "CAD"}
        else:
            o["price"] = p["num"]
        offers.append(o)
    return {
        "@context": "https://schema.org", "@type": "ProfessionalService",
        "name": "Birchmont Group Inc.", "url": SITE + "/", "logo": SITE + "/logo.png", "image": SITE + "/og-image.png",
        "email": EMAIL, "priceRange": "$1,250 - $15,000",
        "description": "AI consulting and implementation for small and mid-sized businesses: AI workshops, opportunity assessments, workflow automation and ongoing AI support.",
        "address": {"@type": "PostalAddress", "addressLocality": "Lethbridge", "addressRegion": "AB", "addressCountry": "CA"},
        "areaServed": [{"@type": "State", "name": "Alberta"}, {"@type": "Country", "name": "Canada"}],
        "knowsAbout": ["Artificial intelligence adoption", "Business process automation", "AI agents", "Generative AI training", "AI governance"],
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": "AI consulting packages", "itemListElement": offers},
    }

def head(title, desc, path, extra_ld=None, noindex=False):
    url = SITE + path
    lds = [schema()] + ([extra_ld] if extra_ld else [])
    ld_html = "\n    ".join(f'<script type="application/ld+json">{json.dumps(x)}</script>' for x in lds)
    robots = '\n    <meta name="robots" content="noindex">' if noindex else ""
    return f'''<!DOCTYPE html>
<html lang="en-CA" class="no-js">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{desc}">{robots}
    <link rel="canonical" href="{url}">
    <meta name="theme-color" content="#0b1019">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:site_name" content="Birchmont Group">
    <meta property="og:locale" content="en_CA">
    <meta property="og:image" content="{SITE}/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="{SITE}/og-image.png">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    {ld_html}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css?v=3">
</head>
<body>
    <a href="#main" class="skip-link">Skip to content</a>
'''

def nav(active):
    out = []
    for h, t in NAV:
        cls = []
        if h == active:
            cls.append("is-active")
        if t == "Scorecard":
            cls.append("nav__pill")
        c = f' class="{" ".join(cls)}"' if cls else ""
        cur = ' aria-current="page"' if h == active else ""
        out.append(f'<a href="{h}"{c}{cur}>{t}</a>')
    items = "".join(out)
    return f'''
    <header class="nav" id="nav">
        <div class="nav__inner">
            <a href="/" class="nav__logo" aria-label="Birchmont Group home">{LOGO}</a>
            <nav class="nav__links" id="navLinks" aria-label="Primary">
                {items}
                <a href="{BOOK}" class="btn btn--primary" target="_blank" rel="noopener">Book a free call</a>
            </nav>
            <button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
        </div>
    </header>
'''

def footer(mobile_cta=True):
    pk = "".join(f'<li><a href="/packages/#{k}">{p["name"]} &middot; {price_text(k)}</a></li>' for k, p in PKGS.items())
    mc = f'''
    <div class="mobile-cta" aria-label="Quick actions">
        <a href="/packages/" class="btn btn--ghost">Pricing</a>
        <a href="{BOOK}" class="btn btn--primary" target="_blank" rel="noopener">Book a free call</a>
    </div>''' if mobile_cta else ""
    return f'''
    <footer class="footer">
        <div class="container">
            <div class="footer__grid">
                <div class="footer__brand">
                    <a href="/" aria-label="Birchmont Group home">{LOGO}</a>
                    <p>Practical AI for small and mid-sized businesses. Fixed prices, published up front, and measured in hours saved.</p>
                </div>
                <div>
                    <h4>Packages</h4>
                    <ul>{pk}</ul>
                </div>
                <div>
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/#how">How it works</a></li>
                        <li><a href="/scorecard/">Free AI scorecard</a></li>
                        <li><a href="/about/">About</a></li>
                        <li><a href="/packages/#faq">Pricing FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Get in touch</h4>
                    <ul>
                        <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
                        <li><a href="{BOOK}" target="_blank" rel="noopener">Book a discovery call</a></li>
                        <li><a href="/contact/">Contact form</a></li>
                        <li>Lethbridge, Alberta</li>
                    </ul>
                </div>
            </div>
            <div class="footer__bottom">
                <span>&copy; {YEAR} Birchmont Group Inc. All rights reserved.</span>
                <span>Lethbridge, Alberta &middot; Serving businesses across Canada</span>
            </div>
        </div>
    </footer>{mc}
'''

def tail(scripts=()):
    s = '    <script src="/script.js?v=3" defer></script>\n'
    for x in scripts:
        s += f'    <script src="/{x}?v=3" defer></script>\n'
    return s + "</body>\n</html>\n"

def hero_bg():
    return '<div class="hero__bg" aria-hidden="true"><div class="hero__glow hero__glow--a"></div><div class="hero__glow hero__glow--b"></div></div>'

def page_hero(crumb, eyebrow, h1, lede, buttons=""):
    crumbs = f'<ol class="crumbs" aria-label="Breadcrumb"><li><a href="/">Home</a></li><li aria-current="page">{crumb}</li></ol>' if crumb else ""
    btns = f'<div class="btn-row reveal" data-delay="180">{buttons}</div>' if buttons else ""
    return f'''
        <section class="page-hero">
            {hero_bg()}
            <div class="container">
                {crumbs}
                <span class="eyebrow reveal">{eyebrow}</span>
                <h1 class="h-xl reveal" data-delay="60">{h1}</h1>
                <p class="lede reveal" data-delay="120">{lede}</p>
                {btns}
            </div>
        </section>'''

def founding(dark=False):
    cls = " founding--dark" if dark else ""
    return f'''
                <aside class="founding{cls} reveal" aria-label="Founding client program">
                    <div class="founding__badge">{icon("star", 28)}</div>
                    <div>
                        <h3>Founding client program: 20% off</h3>
                        <p>We&rsquo;re taking on <b>five founding clients</b> at 20% off any package. In return, we ask for a short case study and an honest testimonial once your results are in.</p>
                    </div>
                    <a href="/contact/?interest=founding" class="btn {'btn--primary' if dark else 'btn--dark'}">Apply for a spot {ARROW}</a>
                </aside>'''

def cta(title="Find out where AI pays off in your business.",
        body="Book a free 30-minute call. We&rsquo;ll look at how your business runs, point out the two or three opportunities with the clearest return, and tell you honestly if the timing isn&rsquo;t right."):
    return f'''
        <section class="section section--tight">
            <div class="container">
                <div class="cta reveal">
                    <span class="eyebrow">Free 30-minute call</span>
                    <h2 class="h-lg">{title}</h2>
                    <p>{body}</p>
                    <div class="btn-row">
                        <a href="{BOOK}" class="btn btn--primary" target="_blank" rel="noopener">Book your free call {ARROW}</a>
                        <a href="/scorecard/" class="btn btn--ghost">Take the 3-minute scorecard</a>
                    </div>
                    <p class="cta__fine">No obligation and no hard sell. You&rsquo;ll leave with ideas you can use either way.</p>
                </div>
            </div>
        </section>'''

def faq_block(items):
    return "".join(f'<details class="reveal"><summary>{q}</summary><p>{a}</p></details>' for q, a in items)

def faq_ld(items):
    clean = lambda s: (s.replace("&rsquo;", "'").replace("&mdash;", "-").replace("&ndash;", "-")
                       .replace("&amp;", "&").replace("<b>", "").replace("</b>", ""))
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": clean(q), "acceptedAnswer": {"@type": "Answer", "text": clean(a)}} for q, a in items]}

def write(path, html):
    full = os.path.join(ROOT, "index.html") if path == "/" else os.path.join(ROOT, path.strip("/"), "index.html")
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w") as f:
        f.write(html)
    print("wrote", os.path.relpath(full, ROOT))

# =====================================================================
# HOME
# =====================================================================
HOME_FAQ = [
    ("What does it cost?", f"Our prices are published. A Kickstart Workshop is {PKGS['workshop']['price']}, an AI Opportunity Assessment is {PKGS['assessment']['price']}, Automation Sprints start at {PKGS['sprint']['price']} and the AI Partner retainer starts at {PKGS['partner']['price']}/month. Every project is fixed-price, so the number we quote is the number you pay."),
    ("We&rsquo;re a small team. Is AI really worth it for us?", "Usually, yes. Small teams often see the biggest relative gains because every hour recovered matters. If you&rsquo;re unsure, the free scorecard or a 30-minute call will tell you quickly. If the return isn&rsquo;t there, we&rsquo;ll say so."),
    ("Do we have to start with the Assessment?", "No. If you already know which workflow is costing you the most, we can scope an Automation Sprint directly. The Assessment is for businesses that want to know where to start, and its fee is credited toward your first Sprint."),
    ("Is our data safe?", "We design around your data. We use business-grade AI services that don&rsquo;t train on your information, give each system only the access it needs, keep sensitive data in Canada where required and document everything against PIPEDA and Alberta&rsquo;s PIPA."),
    ("Do we need to replace our existing software?", "Rarely. Most of our work connects the tools you already pay for (Microsoft 365, Google Workspace, QuickBooks, HubSpot and your industry software) and adds AI where the handoffs happen."),
    ("Will AI replace our staff?", "Our focus is the repetitive work that burns people out, so they can spend more time with customers and on higher-value work. Most businesses use the recovered hours to grow without adding headcount."),
    ("Do you work outside Lethbridge?", "Yes. We work on-site across Southern Alberta and remotely with businesses anywhere in Canada."),
]

def home():
    usecases = {
        "Operations": [
            ("Automated job &amp; order intake", "Emails, web forms and PDFs are read, sorted and entered into your system. No retyping.", "~6 hrs/week saved", "Sprint"),
            ("Scheduling &amp; dispatch assistant", "AI drafts schedules from availability, priorities and travel time, then flags conflicts for a quick human check.", "Fewer missed bookings", "Sprint"),
            ("SOP &amp; knowledge assistant", "Staff ask questions in plain English and get answers from your own manuals and procedures.", "Faster onboarding", "Sprint")],
        "Sales &amp; Marketing": [
            ("Instant lead response", "Every inbound lead gets a personal reply within minutes, qualified and logged to your CRM automatically.", "Reply in minutes", "Sprint"),
            ("Proposal &amp; quote drafting", "First drafts of quotes and proposals, generated from your templates, pricing and past wins.", "~70% faster drafts", "Sprint"),
            ("Content engine", "On-brand social posts, newsletters and blog drafts from a single brief, reviewed by your team.", "Consistent weekly output", "Workshop")],
        "Finance &amp; Admin": [
            ("Invoice &amp; receipt processing", "Bills are captured, coded and matched in your accounting software, with exceptions routed for approval.", "~80% less data entry", "Sprint"),
            ("Collections follow-up", "Polite, escalating reminders on overdue invoices, sent on schedule and paused automatically when a client pays.", "Shorter days-to-pay", "Sprint"),
            ("Weekly business pulse", "Key numbers pulled from your systems into a one-page summary every Monday morning.", "Decisions on current data", "Sprint")],
        "Customer Service": [
            ("24/7 website assistant", "Answers common questions, books appointments and hands off to a person when it should.", "After-hours coverage", "Sprint"),
            ("Inbox triage &amp; drafted replies", "Messages are sorted, prioritized and pre-drafted, so your team reviews and sends.", "~50% faster replies", "Sprint"),
            ("Review &amp; feedback monitoring", "New reviews and survey responses are summarized, with suggested replies and trend alerts.", "Issues caught early", "Partner")],
    }
    pk_names = {"Sprint": "Automation Sprint", "Workshop": "Kickstart Workshop", "Partner": "AI Partner"}
    tab_btns, tab_panels = "", ""
    for i, (name, items) in enumerate(usecases.items()):
        tid = f"uc{i}"
        sel = "true" if i == 0 else "false"
        tab_btns += f'<button class="tabs__btn" role="tab" id="{tid}-tab" aria-controls="{tid}" aria-selected="{sel}" tabindex="{0 if i == 0 else -1}">{name}</button>'
        cells = "".join(
            f'<div class="usecase"><h4>{a}</h4><p>{b}</p><div class="usecase__foot"><span class="tag">{c}</span><span class="tag tag--grey">{pk_names[d]}</span></div></div>'
            for a, b, c, d in items)
        hidden = "" if i == 0 else " hidden"
        tab_panels += f'<div class="tabs__panel" role="tabpanel" id="{tid}" aria-labelledby="{tid}-tab"{hidden}>{cells}</div>'

    who = [("briefcase", "Professional services"), ("hammer", "Trades &amp; construction"), ("home", "Real estate &amp; property"),
           ("cross", "Health clinics"), ("cup", "Hospitality &amp; franchise"), ("truck", "Distribution &amp; logistics"),
           ("store", "Retail &amp; e-commerce"), ("wheat", "Agriculture &amp; ag-services"), ("people", "Non-profits")]
    chips = "".join(f'<span class="chip">{icon(a, 18)}{b}</span>' for a, b in who)

    rungs = [("assessment", "01", "Find", "We interview your team, map how work really flows and hand you a ranked, costed roadmap of where AI pays off."),
             ("sprint", "02", "Build", "We build your highest-return opportunity, connect it to the tools you already use and train your team to run it."),
             ("partner", "03", "Grow", "We monitor, improve and add the next use case every month, and report the hours and dollars saved.")]
    rung_html = ""
    for i, (k, n, verb, d) in enumerate(rungs):
        p = PKGS[k]
        pre = f"<small>{p['pre']} </small>" if p["pre"] else ""
        post = f"<small>{p['post']}</small>" if p["post"] else ""
        rung_html += f'''
                    <a href="/packages/#{k}" class="rung reveal" data-delay="{i * 100}">
                        <div class="rung__step"><span class="rung__num">{n}</span><span class="rung__verb">{verb}</span></div>
                        <h3>{p["name"]}</h3>
                        <p>{d}</p>
                        <div class="rung__meta"><span>{p["time"]}</span><b>{pre}{p["price"]}{post}</b></div>
                    </a>'''

    html = head("AI Consulting for Small Business in Alberta | Birchmont Group",
                "Birchmont Group helps small and mid-sized businesses put AI to work: fixed-price workshops, opportunity assessments and automation projects, live in weeks. Based in Lethbridge, serving Canada.",
                "/", faq_ld(HOME_FAQ))
    html += nav("/")
    html += f'''
    <main id="main">

        <section class="hero">
            {hero_bg()}
            <div class="container hero__grid">
                <div>
                    <a href="/scorecard/" class="hero__badge reveal"><b>Free</b> How AI-ready is your business? Take the 3-minute scorecard &rarr;</a>
                    <h1 class="h-xl reveal" data-delay="60">Less busywork.<br><span class="grad">More business.</span></h1>
                    <p class="lede reveal" data-delay="120">Birchmont helps small and mid-sized businesses put AI to work on the repetitive tasks that slow their teams down. Every engagement is fixed-price, published up front and live in weeks.</p>
                    <div class="btn-row reveal" data-delay="180">
                        <a href="{BOOK}" class="btn btn--primary" target="_blank" rel="noopener">Book a free 30-min call {ARROW}</a>
                        <a href="/packages/" class="btn btn--ghost">See packages &amp; pricing</a>
                    </div>
                    <div class="hero__proof reveal" data-delay="240">
                        <div>{CHECK} Fixed prices, published</div>
                        <div>{CHECK} Live in weeks, not quarters</div>
                        <div>{CHECK} Lethbridge-based, serving Canada</div>
                    </div>
                </div>
                <div class="console-wrap reveal" data-delay="200" aria-hidden="true">
                    <div class="console">
                        <div class="console__bar">
                            <div class="console__dots"><i></i><i></i><i></i></div>
                            <span class="console__title">AI operations &middot; Monday 9:14 am</span>
                            <span class="console__live">Live</span>
                        </div>
                        <div>
                            <div class="task"><div class="ico">{icon("mail", 18)}</div><div><div class="task__name">14 customer emails triaged</div><div class="task__meta">Replies drafted &middot; 2 flagged urgent</div></div><span class="task__status">Done</span></div>
                            <div class="task"><div class="ico ico--b">{icon("doc", 18)}</div><div><div class="task__name">23 invoices coded to QuickBooks</div><div class="task__meta">1 exception sent for approval</div></div><span class="task__status">Done</span></div>
                            <div class="task"><div class="ico ico--c">{icon("bolt", 18)}</div><div><div class="task__name">New lead qualified &amp; booked</div><div class="task__meta">Added to CRM &middot; follow-up scheduled</div></div><span class="task__status">Done</span></div>
                            <div class="task"><div class="ico ico--d">{icon("chart", 18)}</div><div><div class="task__name">Weekly pulse report</div><div class="task__meta">Pulling sales, labour &amp; cash data</div></div><span class="task__status task__status--run">Running</span></div>
                        </div>
                        <div class="console__foot">
                            <div class="console__stat"><b>11.5 h</b><span>Saved this week</span></div>
                            <div class="console__stat"><b>4 min</b><span>Avg. lead reply</span></div>
                            <div class="console__stat"><b>0</b><span>Retyped entries</span></div>
                        </div>
                    </div>
                    <div class="console__float"><div class="ico">{icon("sparkle", 18)}</div><div><b>Human in the loop</b><span>You approve what matters. AI handles the rest.</span></div></div>
                    <span class="console__caption">Illustrative example</span>
                </div>
            </div>
        </section>

        <section class="strip" aria-label="Platforms we implement">
            <div class="container strip__inner">
                <span class="strip__label">We implement &amp; connect</span>
                <div class="strip__list"><span>Microsoft 365 Copilot</span><span>ChatGPT</span><span>Claude</span><span>Gemini</span><span>QuickBooks</span><span>HubSpot</span><span>Zapier</span></div>
            </div>
        </section>

        <section class="section">
            <div class="container split">
                <div class="split__sticky">
                    <span class="eyebrow reveal">The problem</span>
                    <h2 class="h-lg reveal" style="margin:18px 0 22px;">You know AI matters. You don&rsquo;t have time to figure it out.</h2>
                    <p class="lede reveal">Big companies have AI teams. You have a business to run. Most owners we speak with are stuck in the same place.</p>
                </div>
                <div class="pain-list">
                    <div class="pain reveal"><span class="pain__num">01</span><div><h3>Admin is eating your best people</h3><p>Skilled staff lose hours every week to data entry, copy-paste and chasing follow-ups. That&rsquo;s time not spent with customers.</p></div></div>
                    <div class="pain reveal" data-delay="80"><span class="pain__num">02</span><div><h3>Leads and customers wait too long</h3><p>Enquiries sit overnight and quotes take days. The competitor who answers first usually wins the work.</p></div></div>
                    <div class="pain reveal" data-delay="160"><span class="pain__num">03</span><div><h3>Staff are already using AI, with no rules</h3><p>Client information is going into free chatbots with no policy, no oversight and no consistency.</p></div></div>
                    <div class="pain reveal" data-delay="240"><span class="pain__num">04</span><div><h3>Lots of tools, no plan</h3><p>Every vendor now claims AI. Without a roadmap you end up collecting subscriptions instead of results.</p></div></div>
                </div>
            </div>
        </section>

        <section class="section section--white">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow reveal">What changes</span>
                    <h2 class="h-lg reveal" style="margin-top:18px;">AI that shows up in your week, not just in a strategy deck.</h2>
                </div>
                <div class="outcomes">
                    <div class="outcome reveal"><div class="ico">{icon("clock", 24)}</div><h3>Hours back, every week</h3><p>Data entry, invoice coding, scheduling and reporting run on their own, with people approving what matters.</p><div class="outcome__ex"><b>Common first wins:</b> order intake, invoicing, weekly reports</div></div>
                    <div class="outcome reveal" data-delay="80"><div class="ico">{icon("bolt", 24)}</div><h3>Faster answers for customers</h3><p>Every enquiry is acknowledged, qualified and routed within minutes, including evenings and weekends.</p><div class="outcome__ex"><b>Common first wins:</b> lead response, inbox triage, quoting</div></div>
                    <div class="outcome reveal" data-delay="160"><div class="ico">{icon("shield", 24)}</div><h3>A team that uses AI safely</h3><p>Your people know which tools to use, how to get good results and what data stays out.</p><div class="outcome__ex"><b>Common first wins:</b> staff training, an AI use policy</div></div>
                </div>
            </div>
        </section>

        <section class="section dark" id="how">
            <div class="container">
                <div class="section-head section-head--row">
                    <div>
                        <span class="eyebrow reveal">How it works</span>
                        <h2 class="h-lg reveal" style="margin-top:18px;">Three steps. Fixed prices. No surprises.</h2>
                        <p class="lede reveal">Each step stands on its own. You only commit to the next one after the last has proven its value.</p>
                    </div>
                    <a href="/packages/" class="text-link reveal">Full package details {ARROW}</a>
                </div>
                <div class="ladder">{rung_html}
                </div>
                <div class="ladder-foot reveal">
                    <p><b>Not ready for a project yet?</b> Start with a half-day Kickstart Workshop ({PKGS["workshop"]["price"]}) or the free 3-minute scorecard.</p>
                    <div class="btn-row"><a href="/packages/#workshop" class="btn btn--ghost btn--sm">Workshop details</a><a href="/scorecard/" class="btn btn--primary btn--sm">Take the scorecard</a></div>
                </div>
            </div>
        </section>

        <section class="section section--tight">
            <div class="container">{founding()}
            </div>
        </section>

        <section class="section section--flush-top" id="use-cases">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow reveal">Use cases</span>
                    <h2 class="h-lg reveal" style="margin-top:18px;">Where AI is paying off for businesses like yours.</h2>
                    <p class="lede reveal">Practical, proven applications, not science projects. These are the places we usually start.</p>
                </div>
                <div data-tabs class="reveal">
                    <div class="tabs__list" role="tablist" aria-label="Use cases by function">{tab_btns}</div>
                    {tab_panels}
                </div>
                <p class="note reveal" style="margin-top:20px;">Savings shown are indicative for typical small-business workflows. Your actual results depend on volume and process, and the Assessment will quantify them.</p>
            </div>
        </section>

        <section class="section section--tight section--flush-top" id="roi">
            <div class="container">
                <div class="roi reveal" data-roi>
                    <div class="roi__inputs">
                        <span class="eyebrow">Opportunity estimator</span>
                        <h2 class="h-md">What is repetitive work costing you?</h2>
                        <p class="roi__intro">Move the sliders to estimate the capacity tied up in repetitive work across your team.</p>
                        <div class="field">
                            <div class="field__top"><label for="roi-people">People doing admin or repetitive work</label><output for="roi-people"></output></div>
                            <input type="range" id="roi-people" name="people" min="1" max="100" value="12">
                        </div>
                        <div class="field">
                            <div class="field__top"><label for="roi-hours">Hours per person, per week, on repetitive tasks</label><output for="roi-hours"></output></div>
                            <input type="range" id="roi-hours" name="hours" min="1" max="25" value="8" data-suffix=" hrs">
                        </div>
                        <div class="field" style="margin-bottom:0;">
                            <div class="field__top"><label for="roi-rate">Average loaded hourly cost</label><output for="roi-rate"></output></div>
                            <input type="range" id="roi-rate" name="rate" min="20" max="150" step="5" value="45" data-prefix="$">
                        </div>
                    </div>
                    <div class="roi__out">
                        <div class="roi__big">
                            <div class="roi__label">Potential annual value</div>
                            <div class="roi__value" data-out="value">$0</div>
                            <div class="roi__sub">in recovered capacity, per year</div>
                        </div>
                        <div class="roi__row">
                            <div class="roi__mini"><b data-out="hours">0</b><span>hours back to your team</span></div>
                            <div class="roi__mini"><b data-out="fte">0</b><span>full-time equivalents</span></div>
                        </div>
                        <a href="{BOOK}" class="btn btn--primary" target="_blank" rel="noopener">Pressure-test this with us {ARROW}</a>
                        <p class="roi__note">Assumes AI and automation take on 40% of repetitive work across 46 working weeks. This is an illustrative estimate, not a guarantee.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="section dark">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow reveal">Why Birchmont</span>
                    <h2 class="h-lg reveal" style="margin-top:18px;">A partner focused on outcomes, not hype.</h2>
                </div>
                <div class="principles reveal">
                    <div class="principle">{icon("tag", 28)}<h3>Prices you can see</h3><p>Every package is fixed-price and published. The number we quote is the number you pay.</p></div>
                    <div class="principle">{icon("scale", 28)}<h3>Vendor-neutral</h3><p>We don&rsquo;t resell software or mark up subscriptions. We recommend what fits, including tools you already own.</p></div>
                    <div class="principle">{icon("shield", 28)}<h3>Secure by design</h3><p>Business-grade tools, minimal access and Canadian privacy requirements built in from day one.</p></div>
                    <div class="principle">{icon("key", 28)}<h3>You own it</h3><p>Your workflows, prompts, data and documentation stay yours. We build for independence, not lock-in.</p></div>
                </div>
                <div class="who reveal">
                    <div><h3>Who we work with</h3><p>Owner-led and growing businesses with roughly 5 to 500 people.</p></div>
                    <div class="chips">{chips}</div>
                </div>
            </div>
        </section>

        <section class="section section--white" id="faq">
            <div class="container split">
                <div class="split__sticky">
                    <span class="eyebrow reveal">FAQ</span>
                    <h2 class="h-lg reveal" style="margin:18px 0 22px;">Straight answers.</h2>
                    <p class="lede reveal">The questions owners ask us most. Don&rsquo;t see yours? <a href="/contact/" class="text-link" style="display:inline;">Ask us directly.</a></p>
                </div>
                <div class="faq">{faq_block(HOME_FAQ)}</div>
            </div>
        </section>
{cta()}
    </main>
'''
    html += footer() + tail()
    write("/", html)

# =====================================================================
# PACKAGES
# =====================================================================
PKG_FAQ = [
    ("Do we have to start with the Assessment?", "No. If you already know which workflow is costing you the most, we&rsquo;ll scope an Automation Sprint directly on a free call."),
    ("What isn&rsquo;t included in the prices?", "GST, and any software subscriptions your solution needs. Those are billed directly to you at cost, never marked up, and we&rsquo;ll tell you what they are before you commit."),
    ("How is an Automation Sprint priced?", "After a short scoping call we give you a fixed quote based on the number of systems involved and the complexity of the workflow. There&rsquo;s no hourly billing and no change-order creep."),
    ("How does the Assessment credit work?", f"The full {PKGS['assessment']['price']} Assessment fee is credited toward an Automation Sprint booked within 60 days of your roadmap readout."),
    ("What does the AI Partner retainer include?", "Monitoring and maintenance of what we&rsquo;ve built, a monthly block of improvement hours, quarterly roadmap reviews and priority support. There&rsquo;s a three-month minimum, then it&rsquo;s month-to-month."),
    ("How does the founding client program work?", "Our first five clients get 20% off any package. In return, once your results are in, we ask for a short case study and an honest testimonial. Mention it when you get in touch."),
    ("Do you work on-site?", "Yes. We work on-site across Southern Alberta and remotely with businesses anywhere in Canada. Workshops can run in person or by video."),
]

DETAILS = [
    ("workshop", "01",
     "A hands-on half-day session that gets your team using AI tools well in their real day-to-day work, with clear guardrails on what&rsquo;s safe.",
     [("Format", "Half day, on-site or video"), ("Group size", "Up to 15 people"), ("Best for", "Teams new to AI")],
     [("Pre-session survey", "So we tailor examples to your roles"), ("Live, hands-on exercises", "On your real tasks, not generic demos"),
      ("Role-based prompt playbook", "A reference your team keeps"), ("Starter AI use policy", "A plain-language template to adopt"),
      ("Tool recommendations", "What to use with what you already pay for"), ("30 days of email Q&amp;A", "Support while new habits form")],
     ("Your team is curious, but usage is patchy or unmanaged.", "You already know the workflow you want automated. Start with a Sprint.")),
    ("assessment", "02",
     "In two weeks we learn how your business really runs, find where AI and automation will save the most time and money, and give you a ranked, costed plan you can act on.",
     [("Timeline", "2 weeks"), ("Format", "Interviews + workshop"), ("Credit", "100% toward a Sprint")],
     [("Up to 8 stakeholder interviews", "Owners, managers and front-line staff"), ("Workflow &amp; systems map", "Where time, errors and handoffs pile up"),
      ("Ranked opportunity roadmap", "Up to 10 opportunities, scored on return and effort"), ("Business case for each", "Hours saved, investment and payback"),
      ("Data &amp; privacy review", "What&rsquo;s safe to automate, and how"), ("Executive readout", "A 60-minute session to agree next steps")],
     ("You know AI could help but aren&rsquo;t sure where to start or what it&rsquo;s worth.", "You need a slide deck for its own sake. We only produce plans you can act on.")),
    ("sprint", "03",
     "We take one high-value workflow from idea to live: designed around your process, connected to your existing tools, tested on real data and handed over to a trained team.",
     [("Timeline", "4&ndash;6 weeks"), ("Pricing", "Fixed quote after scoping"), ("Best for", "A known, repetitive workflow")],
     [("Solution design", "Agreed success metrics before we build"), ("Build &amp; integration", "Email, CRM, accounting and industry software"),
      ("Human approval steps", "People stay in control where judgment matters"), ("Testing on real data", "Run alongside your current process first"),
      ("Training &amp; documentation", "Your team can run and adjust it"), ("30 days of hypercare", "Fast fixes and tuning after launch")],
     ("You have a high-volume task (intake, invoicing, quoting, follow-ups) that eats hours every week.", "The process changes every week or isn&rsquo;t done often enough to justify automating.")),
    ("partner", "04",
     "Senior AI expertise on a monthly retainer. We look after what we&rsquo;ve built, find and ship the next win, and keep you ahead of a fast-moving market, without a full-time hire.",
     [("Commitment", "3 months, then monthly"), ("Format", "Monthly block of build hours"), ("Best for", "Businesses scaling AI")],
     [("Monitoring &amp; maintenance", "Your automations stay healthy"), ("Monthly improvement hours", "New use cases and refinements"),
      ("Quarterly roadmap review", "Re-prioritize against your goals"), ("Vendor &amp; tool advice", "Cut through new product launches"),
      ("Priority support", "A direct line for your team"), ("Impact reporting", "Hours saved and value delivered")],
     ("You have at least one AI system live and want steady, compounding improvement.", "You haven&rsquo;t built anything yet. Start with an Assessment or Sprint.")),
]

def packages():
    cards = ""
    includes = {
        "workshop": ["Half-day session, up to 15 people", "Hands-on with your own tools", "Role-based prompt playbook", "Starter AI use policy", "30 days of email Q&amp;A"],
        "assessment": ["Up to 8 stakeholder interviews", "Workflow &amp; systems map", "Ranked roadmap, up to 10 opportunities", "ROI &amp; payback for each", "Executive readout session"],
        "sprint": ["One workflow, built and live", "Connected to your existing tools", "Human approval steps built in", "Training &amp; documentation", "30 days of hypercare"],
        "partner": ["Monitoring &amp; maintenance", "Monthly improvement hours", "Quarterly roadmap review", "Priority support", "Impact reporting"],
    }
    terms = {
        "workshop": "One-time, fixed price",
        "assessment": "Fixed price &middot; 100% credited toward a Sprint",
        "sprint": "Fixed quote after a free scoping call",
        "partner": "3-month minimum, then month-to-month",
    }
    fors = {
        "workshop": "Teams that are curious about AI but not using it consistently.",
        "assessment": "Owners who want to know exactly where AI will pay off, and what it&rsquo;s worth.",
        "sprint": "Businesses ready to automate a specific, high-volume workflow.",
        "partner": "Businesses with AI live that want continuous improvement.",
    }
    for i, (k, p) in enumerate(PKGS.items()):
        hl = k == "assessment"
        lis = "".join(f"<li>{CHECK}<span>{x}</span></li>" for x in includes[k])
        flag = '<span class="price__flag">Best place to start</span>' if hl else ""
        btn = (f'<a href="{BOOK}" class="btn btn--primary" target="_blank" rel="noopener">Book a free call</a>' if hl
               else f'<a href="/contact/?interest={k}" class="btn btn--outline">Get started</a>')
        cards += f'''
                    <article class="price{' price--hl' if hl else ''} reveal" data-delay="{i * 70}">
                        {flag}
                        <span class="price__kind">{p["kind"]} &middot; {p["time"]}</span>
                        <h3>{p["name"]}</h3>
                        <p class="price__for">{fors[k]}</p>
                        {price_html(k)}
                        <p class="price__terms">{terms[k]}</p>
                        <ul>{lis}</ul>
                        {btn}
                        <a href="#{k}" class="price__fine">Full details &darr;</a>
                    </article>'''

    sample_rows = [
        ("1", "Automate work-order intake", "Operations &middot; email + web forms to job system", "620 hrs", "$9&ndash;12K", 2, "~5 months"),
        ("2", "Invoice coding &amp; matching", "Finance &middot; supplier bills to QuickBooks", "410 hrs", "$8&ndash;10K", 2, "~6 months"),
        ("3", "Instant lead response &amp; qualification", "Sales &middot; web, email and phone enquiries", "260 hrs", "$7.5&ndash;9K", 1, "~8 months"),
        ("4", "Staff AI training + use policy", "Team &middot; all office staff", "200 hrs", "$1,250", 1, "~2 months"),
        ("5", "Weekly business pulse report", "Leadership &middot; sales, labour &amp; cash", "150 hrs", "Bundle with #2", 1, "&mdash;"),
    ]
    def effort(n):
        return '<span class="effort" aria-label="Effort ' + str(n) + ' of 4">' + "".join(f'<i class="{"on" if j < n else ""}"></i>' for j in range(4)) + "</span>"
    rows = "".join(
        f'<tr><td>{a}</td><td><b>{b}</b><span>{c}</span></td><td class="num">{d}</td><td class="num">{e}</td><td>{effort(f)}</td><td class="num">{g}</td></tr>'
        for a, b, c, d, e, f, g in sample_rows)

    compare_rows = [
        ("Up-front cost", "Low: subscriptions only", "Often five or six figures", f"From {PKGS['workshop']['price']}, published"),
        ("Time to first result", "Unpredictable", "Months", "Weeks"),
        ("Built around your workflows", ("no", "Generic tools, generic results"), ("yes", "Yes"), ("yes", "Yes, starting with how you work today")),
        ("Training &amp; adoption", ("no", "Up to you"), ("no", "Often extra"), ("yes", "Included in every build")),
        ("Sized for 5&ndash;500 people", ("yes", "Yes"), ("no", "Built for enterprise"), ("yes", "It&rsquo;s all we do")),
        ("Independent advice", ("no", "Vendor marketing decides"), "Varies", ("yes", "No resale, no markups")),
    ]
    def cell(v, us=False):
        cls = ' class="us"' if us else ""
        if isinstance(v, tuple):
            kind, txt = v
            mark = CHECK if kind == "yes" else CROSS
            return f'<td{cls}><span class="{kind}">{mark}{txt}</span></td>'
        return f"<td{cls}>{v}</td>"
    comp = "".join(f"<tr><th scope=\"row\">{r[0]}</th>{cell(r[1])}{cell(r[2])}{cell(r[3], True)}</tr>" for r in compare_rows)

    details = ""
    for k, num, desc, meta, dels, (fit_yes, fit_no) in DETAILS:
        p = PKGS[k]
        meta_html = "".join(f"<div><span>{a}</span><b>{b}</b></div>" for a, b in meta)
        del_html = "".join(f'<div class="deliverable"><b>{a}</b><span>{b}</span></div>' for a, b in dels)
        pre = f"<small>{p['pre']} </small>" if p["pre"] else ""
        post = f"<small>{p['post']}</small>" if p["post"] else ""
        details += f'''
                <article class="pkg" id="{k}">
                    <div class="reveal">
                        <span class="pkg__num">PACKAGE {num} &middot; {p["kind"].upper()}</span>
                        <h2>{p["name"]}</h2>
                        <div class="pkg__price">{pre}{p["price"]}{post}</div>
                        <div class="pkg__meta">{meta_html}</div>
                        <div class="btn-row"><a href="/contact/?interest={k}" class="btn btn--dark btn--sm">Get started {ARROW}</a></div>
                    </div>
                    <div class="pkg__body reveal" data-delay="80">
                        <p>{desc}</p>
                        <h4>What&rsquo;s included</h4>
                        <div class="deliverables">{del_html}</div>
                        <h4>Is it right for you?</h4>
                        <div class="fit"><div class="fit--yes"><b>A great fit if&hellip;</b>{fit_yes}</div><div class="fit--no"><b>Not the right fit if&hellip;</b>{fit_no}</div></div>
                    </div>
                </article>'''

    html = head("AI Consulting Packages &amp; Pricing | Birchmont Group",
                f"Fixed-price AI packages for small and mid-sized business: Kickstart Workshop {PKGS['workshop']['price']}, Opportunity Assessment {PKGS['assessment']['price']}, Automation Sprint from {PKGS['sprint']['price']}, AI Partner from {PKGS['partner']['price']}/month.",
                "/packages/", faq_ld(PKG_FAQ))
    html += nav("/packages/")
    html += "\n    <main id=\"main\">"
    html += page_hero("Packages", "Packages &amp; pricing", 'Clear packages. <span class="grad">Published prices.</span>',
                      "Start wherever you are. Every package is fixed-scope and stands on its own, so you never commit to more than the next step.",
                      f'<a href="{BOOK}" class="btn btn--primary" target="_blank" rel="noopener">Book a free call {ARROW}</a><a href="/scorecard/" class="btn btn--ghost">Not sure? Take the scorecard</a>')
    html += f'''
        <section class="section" style="padding-top:72px;">
            <div class="container">
                <div class="pricing">{cards}
                </div>
                <div class="pricing-note reveal">
                    <span>{CHECK} Prices in CAD, before GST</span>
                    <span>{CHECK} Software billed at cost, never marked up</span>
                    <span>{CHECK} On-site in Southern Alberta, remote across Canada</span>
                </div>
                <div style="margin-top:56px;">{founding()}</div>
            </div>
        </section>

        <section class="section section--white">
            <div class="container">
                <div class="section-head section-head--row">
                    <div>
                        <span class="eyebrow reveal">See what you get</span>
                        <h2 class="h-lg reveal" style="margin-top:18px;">An Assessment ends with a plan you can act on.</h2>
                        <p class="lede reveal">Every opportunity is ranked by time saved, cost and payback, with the assumptions shown, so you can make the call with confidence.</p>
                    </div>
                </div>
                <div class="sample reveal">
                    <div class="sample__head"><b>AI Opportunity Roadmap</b><span>Sample output &middot; illustrative 25-person trades business</span></div>
                    <div class="sample__scroll">
                        <table>
                            <thead><tr><th>#</th><th>Opportunity</th><th>Time saved / yr</th><th>Est. investment</th><th>Effort</th><th>Payback</th></tr></thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </div>
                    <div class="sample__foot"><span>Total identified: <b>1,640 hours a year</b>, about 0.95 full-time equivalents</span><span>A full roadmap covers up to 10 opportunities</span></div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow reveal">Why not just&hellip;</span>
                    <h2 class="h-lg reveal" style="margin-top:18px;">How we compare.</h2>
                    <p class="lede reveal">There are three ways a growing business usually gets into AI. Here&rsquo;s an honest look at each.</p>
                </div>
                <div class="compare reveal">
                    <table>
                        <thead><tr><th scope="col"><span class="sr-only">Criteria</span></th><th scope="col">Do it yourself</th><th scope="col">Large consultancy</th><th scope="col" class="us">Birchmont</th></tr></thead>
                        <tbody>{comp}</tbody>
                    </table>
                </div>
            </div>
        </section>

        <section class="section section--white" id="details">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow reveal">Package details</span>
                    <h2 class="h-lg reveal" style="margin-top:18px;">Exactly what&rsquo;s included.</h2>
                </div>{details}
            </div>
        </section>

        <section class="section" id="faq">
            <div class="container split">
                <div class="split__sticky">
                    <span class="eyebrow reveal">Pricing FAQ</span>
                    <h2 class="h-lg reveal" style="margin:18px 0 22px;">The fine print, in plain English.</h2>
                </div>
                <div class="faq">{faq_block(PKG_FAQ)}</div>
            </div>
        </section>
{cta("Not sure which package fits?", "Book a free 30-minute call. We&rsquo;ll recommend the right starting point for your business, even if that&rsquo;s a free tool rather than a paid project.")}
    </main>
'''
    html += footer() + tail()
    write("/packages/", html)

# =====================================================================
# SCORECARD
# =====================================================================
def scorecard():
    html = head("Free AI Readiness Scorecard for Small Business | Birchmont Group",
                "Nine questions, three minutes. Find out how much AI could save your business, how ready you are, and where to focus first. Free, with instant results.",
                "/scorecard/")
    html += nav("/scorecard/")
    html += "\n    <main id=\"main\">"
    html += page_hero("AI Readiness Scorecard", "Free &middot; 3 minutes", 'How ready is your business <span class="grad">for AI?</span>',
                      "Answer nine quick questions to see how much value AI could unlock in your business, how prepared you are and where to focus first.")
    html += f'''
        <section class="section" style="padding-top:64px;">
            <div class="container">
                <div class="sc" data-scorecard>
                    <div class="sc__card reveal" data-sc-intro>
                        <span class="sc__cat">Before you start</span>
                        <h2 class="h-md">Two scores, one clear next step.</h2>
                        <ul class="sc__intro-list">
                            <li>{CHECK}<span><b style="color:var(--text)">Opportunity score:</b> how much time and money AI could recover in your business.</span></li>
                            <li>{CHECK}<span><b style="color:var(--text)">Readiness score:</b> how prepared your data, processes and team are today.</span></li>
                            <li>{CHECK}<span>Your results appear instantly on screen. No email required.</span></li>
                        </ul>
                        <button type="button" class="btn btn--dark" data-sc-start>Start the scorecard {ARROW}</button>
                    </div>
                    <div data-sc-stage hidden aria-live="polite"></div>
                </div>
            </div>
        </section>
    </main>
'''
    html += footer() + tail(["hubspot-form.js", "scorecard.js"])
    write("/scorecard/", html)

# =====================================================================
# ABOUT
# =====================================================================
def about():
    html = head("About Birchmont Group | AI Consulting in Lethbridge, Alberta",
                "Birchmont Group is a Lethbridge-based AI consultancy helping small and mid-sized Canadian businesses adopt practical, secure AI with fixed prices and measurable results.",
                "/about/")
    html += nav("/about/")
    html += "\n    <main id=\"main\">"
    html += page_hero("About", "About Birchmont", 'Operators first. <span class="grad">Technologists second.</span>',
                      "We started Birchmont because we kept seeing the same thing: powerful AI tools, and small businesses with no practical way to use them. We exist to close that gap.")
    html += f'''
        <section class="section">
            <div class="container split">
                <div class="split__sticky">
                    <span class="eyebrow reveal">Our story</span>
                    <h2 class="h-lg reveal" style="margin-top:18px;">Built from the operator&rsquo;s side of the table.</h2>
                </div>
                <div class="prose">
                    <p class="reveal">Birchmont Group grew out of running real businesses, with payrolls to meet, customers to serve and never enough hours in the week. We know what it means when a process breaks on a Friday afternoon, and we know technology only matters if it makes Monday easier.</p>
                    <p class="reveal">That&rsquo;s the lens we bring to AI. <strong>We don&rsquo;t sell software and we don&rsquo;t chase trends.</strong> We look at how your business actually works, find the places where AI can take real weight off your team, and build solutions simple enough to trust and robust enough to rely on.</p>
                    <p class="reveal">We publish our prices because that&rsquo;s how we&rsquo;d want to be treated. We start small because trust should be earned. And we measure everything in the currency owners care about: hours and dollars.</p>
                </div>
            </div>
        </section>

        <section class="section section--tight section--white">
            <div class="container">
                <div class="stat-row">
                    <div class="stat reveal"><b>4</b><span>Fixed-price packages, all published on our site</span></div>
                    <div class="stat reveal" data-delay="80"><b>2 weeks</b><span>From kickoff to a ranked, costed AI roadmap</span></div>
                    <div class="stat reveal" data-delay="160"><b>0%</b><span>Markup on the software we recommend</span></div>
                </div>
            </div>
        </section>

        <section class="section dark">
            <div class="container container--narrow" style="text-align:center;">
                <span class="eyebrow reveal">Our mission</span>
                <p class="quote reveal" style="margin-top:28px;">To give every growing business the same AI advantage as the enterprise, <em>without the enterprise budget, complexity or risk.</em></p>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow reveal">How we operate</span>
                    <h2 class="h-lg reveal" style="margin-top:18px;">What you can expect from us.</h2>
                </div>
                <div class="cards cards--2">
                    <article class="card reveal"><div class="ico">{icon("target")}</div><h3>Honest advice</h3><p>If AI isn&rsquo;t the right answer to a problem, we&rsquo;ll say so. Sometimes the best recommendation is a simpler process or a tool you already own.</p></article>
                    <article class="card reveal" data-delay="80"><div class="ico">{icon("chart")}</div><h3>Measured results</h3><p>We agree on success metrics before we build, then report on hours saved, response times and cost impact after launch.</p></article>
                    <article class="card reveal"><div class="ico">{icon("people")}</div><h3>People-centred change</h3><p>We design with your team, not around them. Adoption comes from tools that make people&rsquo;s days better and training that builds confidence.</p></article>
                    <article class="card reveal" data-delay="80"><div class="ico">{icon("shield")}</div><h3>Responsible AI</h3><p>Privacy, security and transparency are the defaults. Sensitive decisions keep a person in the loop, and your data is never used to train public models.</p></article>
                </div>
            </div>
        </section>

        <section class="section section--tight section--white">
            <div class="container split" style="align-items:center;">
                <div>
                    <span class="eyebrow reveal">Where we work</span>
                    <h2 class="h-lg reveal" style="margin:18px 0 18px;">Rooted in Lethbridge. Working across Canada.</h2>
                    <p class="lede reveal">We&rsquo;re headquartered in Lethbridge and work on-site with businesses across Southern Alberta. Everywhere else in Canada, we work remotely, with the same process and the same prices.</p>
                </div>
                <div class="cards cards--2" style="gap:14px;">
                    <div class="card reveal"><div class="ico">{icon("pin")}</div><h3>On-site</h3><p>Lethbridge and Southern Alberta</p></div>
                    <div class="card reveal" data-delay="80"><div class="ico">{icon("map")}</div><h3>Remote</h3><p>Anywhere in Canada</p></div>
                </div>
            </div>
        </section>
{cta("Let&rsquo;s see what AI can do for your business.")}
    </main>
'''
    html += footer() + tail()
    write("/about/", html)

# =====================================================================
# CONTACT
# =====================================================================
def contact():
    html = head("Contact Birchmont Group | Book a Free AI Strategy Call",
                "Talk to Birchmont Group about putting AI to work in your business. Book a free 30-minute call or send us a message. We reply within one business day.",
                "/contact/")
    html += nav("/contact/")
    html += "\n    <main id=\"main\">"
    html += page_hero("Contact", "Contact", 'Let&rsquo;s find your <span class="grad">first AI win.</span>',
                      "Tell us a little about your business and where the friction is. We reply within one business day, with a straight conversation and no hard sell.")
    html += f'''
        <section class="section">
            <div class="container contact-grid">
                <div class="contact-aside reveal">
                    <h2>What happens next</h2>
                    <p>Our discovery process is free, quick and designed to be useful even if we never work together.</p>
                    <ol class="next-steps">
                        <li><div><b>A 30-minute discovery call</b><span>We learn about your business, your goals and the work that eats your team&rsquo;s time.</span></div></li>
                        <li><div><b>Quick-win recommendations</b><span>We share two or three opportunities worth exploring. They&rsquo;re yours to keep.</span></div></li>
                        <li><div><b>A fixed-price proposal</b><span>If there&rsquo;s a fit, you get a clear scope, timeline and price. No obligation.</span></div></li>
                    </ol>
                    <div class="contact-direct">
                        <a href="{BOOK}" target="_blank" rel="noopener">{icon("calendar")} Book a call directly</a>
                        <a href="mailto:{EMAIL}">{icon("mail")} {EMAIL}</a>
                        <span>{icon("pin")} Lethbridge, Alberta &middot; Serving all of Canada</span>
                    </div>
                </div>
                <div class="form-card reveal" data-delay="100">
                    <h2>Tell us about your business</h2>
                    <p>Takes about a minute. Only your email is required.</p>
                    <div data-hubspot-form></div>
                    <noscript><p>Please email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p></noscript>
                </div>
            </div>
        </section>
        <section class="section section--flush-top">
            <div class="container">{founding()}
            </div>
        </section>
    </main>
'''
    html += footer(mobile_cta=False) + tail(["hubspot-form.js"])
    write("/contact/", html)

# =====================================================================
# PAYMENT RESULT PAGES (Stripe checkout return URLs)
# =====================================================================
def payment(path, title, h1, lines):
    html = head(f"{title} | Birchmont Group", title, path, noindex=True)
    html += nav("")
    paras = "".join(f'<p class="reveal">{l}</p>' for l in lines)
    html += f'''
    <main id="main">
        <section class="page-hero">
            {hero_bg()}
            <div class="container">
                <span class="eyebrow reveal">{title}</span>
                <h1 class="h-xl reveal" data-delay="60">{h1}</h1>
            </div>
        </section>
        <section class="section">
            <div class="container container--narrow prose">{paras}
                <div class="btn-row reveal" style="margin-top:32px;"><a href="/" class="btn btn--dark">Back to home</a></div>
            </div>
        </section>
    </main>
'''
    html += footer(mobile_cta=False) + tail()
    write(path, html)

def sitemap():
    pages = [("/", "1.0"), ("/packages/", "0.9"), ("/scorecard/", "0.8"), ("/contact/", "0.7"), ("/about/", "0.6")]
    body = "".join(f"    <url><loc>{SITE}{u}</loc><lastmod>{YEAR}-11-26</lastmod><priority>{p}</priority></url>\n" for u, p in pages)
    with open(os.path.join(ROOT, "sitemap.xml"), "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "</urlset>\n")
    with open(os.path.join(ROOT, "robots.txt"), "w") as f:
        f.write(f"User-agent: *\nAllow: /\nDisallow: /payment/\n\nSitemap: {SITE}/sitemap.xml\n")
    print("wrote sitemap.xml, robots.txt")

if __name__ == "__main__":
    home(); packages(); scorecard(); about(); contact()
    payment("/payment/success/", "Payment received", "Thank you. You&rsquo;re all set.",
            ["Your payment is complete and a receipt is on its way to your inbox from Stripe.",
             "We&rsquo;ll be in touch within one business day with kickoff details and next steps.",
             f'Questions in the meantime? Email <a class="text-link" href="mailto:{EMAIL}">{EMAIL}</a>.'])
    payment("/payment/cancel/", "Payment cancelled", "No charge was made.",
            ["Your checkout was cancelled and your card has not been charged.",
             f'If you ran into a problem or have questions about scope or pricing, we&rsquo;re happy to help. Email <a class="text-link" href="mailto:{EMAIL}">{EMAIL}</a>.'])
    sitemap()
