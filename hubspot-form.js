(function () {
    'use strict';

    // --- Birchmont Group lead form ---------------------------------------
    // A custom, brand-styled form that submits to HubSpot's Forms API.
    // Submissions still land in HubSpot CRM as contacts AND trigger the
    // form's notification email. To choose who gets emailed, set the
    // recipients in HubSpot:  Marketing > Forms > (this form) > Settings >
    // "Send form submission notifications to".
    //
    // To reuse this form elsewhere, just drop a <div data-hubspot-form></div>
    // onto the page. Update only the three values below to point at a
    // different HubSpot form.
    var HUBSPOT = {
        portalId: '343241177',
        formId: 'e0449e72-d185-4528-9122-42eda0922160',
        region: 'na3'
    };

    var ENDPOINT = 'https://api.hsforms.com/submissions/v3/integration/submit/' +
        HUBSPOT.portalId + '/' + HUBSPOT.formId;

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var targets = document.querySelectorAll('[data-hubspot-form]');
    if (!targets.length) return;
    targets.forEach(renderForm);

    function fieldHtml(name, label, type, required, autocomplete) {
        var note = required
            ? ' <span class="lead-form__req" aria-hidden="true">*</span>'
            : ' <span class="lead-form__opt">(optional)</span>';
        return '' +
            '<div class="lead-form__field">' +
                '<label for="lf-' + name + '">' + label + note + '</label>' +
                '<input id="lf-' + name + '" name="' + name + '" type="' + type + '"' +
                    (required ? ' required' : '') +
                    ' autocomplete="' + autocomplete + '"' +
                    ' aria-required="' + (required ? 'true' : 'false') + '">' +
            '</div>';
    }

    function formMarkup() {
        return '' +
            '<form class="lead-form" novalidate>' +
                '<div class="lead-form__row">' +
                    fieldHtml('firstname', 'First name', 'text', false, 'given-name') +
                    fieldHtml('lastname', 'Last name', 'text', false, 'family-name') +
                '</div>' +
                fieldHtml('email', 'Email', 'email', true, 'email') +
                fieldHtml('phone', 'Phone', 'tel', false, 'tel') +
                '<div class="lead-form__field">' +
                    '<label for="lf-message">How can we help? <span class="lead-form__opt">(optional)</span></label>' +
                    '<textarea id="lf-message" name="message" rows="4" autocomplete="off"></textarea>' +
                '</div>' +
                // Honeypot: hidden from humans, catches bots that fill every field.
                '<div class="lead-form__hp" aria-hidden="true">' +
                    '<label>Leave this field empty' +
                        '<input type="text" name="company_website" tabindex="-1" autocomplete="off">' +
                    '</label>' +
                '</div>' +
                '<p class="form-status" role="status" aria-live="polite"></p>' +
                '<button type="submit" class="btn lead-form__submit">Send message</button>' +
                '<p class="lead-form__fineprint">We&rsquo;ll reply within one business day. No spam, ever.</p>' +
            '</form>';
    }

    function renderForm(container) {
        container.innerHTML = formMarkup();
        container.querySelector('.lead-form').addEventListener('submit', onSubmit);
    }

    function clearErrors(form) {
        form.querySelectorAll('.lead-form__field--error').forEach(function (f) {
            f.classList.remove('lead-form__field--error');
        });
        form.querySelectorAll('.lead-form__error').forEach(function (e) { e.remove(); });
    }

    function showFieldError(form, name, msg) {
        var input = form.elements[name];
        if (!input) return;
        var wrap = input.closest('.lead-form__field');
        wrap.classList.add('lead-form__field--error');
        var p = document.createElement('p');
        p.className = 'lead-form__error';
        p.textContent = msg;
        wrap.appendChild(p);
        input.focus();
    }

    function onSubmit(e) {
        e.preventDefault();
        var form = e.currentTarget;
        var status = form.querySelector('.form-status');
        var btn = form.querySelector('.lead-form__submit');
        clearErrors(form);

        // Honeypot tripped -> silently pretend success, drop the bot.
        if (form.elements.company_website && form.elements.company_website.value) {
            showSuccess(form);
            return;
        }

        var email = form.elements.email.value.trim();
        if (!email || !EMAIL_RE.test(email)) {
            showFieldError(form, 'email', 'Please enter a valid email address.');
            return;
        }

        form.classList.add('is-submitting');
        btn.disabled = true;
        btn.textContent = 'Sending…';
        status.className = 'form-status';
        status.textContent = '';

        var names = ['firstname', 'lastname', 'email', 'phone', 'message'];
        var fields = names.map(function (n) {
            return { name: n, value: (form.elements[n].value || '').trim() };
        }).filter(function (f) { return f.value; });

        var payload = {
            submittedAt: Date.now(),
            fields: fields,
            context: { pageUri: location.href, pageName: document.title }
        };

        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function (res) {
            if (res.ok) return res.json();
            return res.json().then(function (err) { throw err; });
        }).then(function () {
            showSuccess(form);
        }).catch(function (err) {
            console.error('Birchmont lead form submission failed:', err);
            form.classList.remove('is-submitting');
            btn.disabled = false;
            btn.textContent = 'Send message';
            status.className = 'form-status form-status--error';
            status.textContent = 'Something went wrong. Please email info@birchmontgroup.ca or try again in a moment.';
        });
    }

    function showSuccess(form) {
        var container = form.closest('[data-hubspot-form]');
        container.innerHTML = '' +
            '<div class="lead-form__success" role="status">' +
                '<div class="lead-form__success-icon" aria-hidden="true">' +
                    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none">' +
                        '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.5" ' +
                        'stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                '</div>' +
                '<h3>Thank you &mdash; message received.</h3>' +
                '<p>We&rsquo;ve got your note and will reply within one business day. ' +
                'For anything urgent, email ' +
                '<a href="mailto:info@birchmontgroup.ca">info@birchmontgroup.ca</a>.</p>' +
            '</div>';
    }
})();
