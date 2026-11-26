(function () {
    'use strict';

    // --- Birchmont Group lead capture ------------------------------------
    // Brand-styled forms that submit to HubSpot's Forms API. Submissions land
    // in HubSpot CRM as contacts and trigger the form's notification email
    // (set recipients in HubSpot: Marketing > Forms > this form > Settings).
    //
    // The HubSpot form only defines firstname, lastname, email, phone and
    // message, so extra details (company, interest, scorecard results) are
    // folded into the message field rather than sent as separate fields.
    var HUBSPOT = {
        portalId: '343241177',
        formId: 'e0449e72-d185-4528-9122-42eda0922160'
    };
    var ENDPOINT = 'https://api.hsforms.com/submissions/v3/integration/submit/' +
        HUBSPOT.portalId + '/' + HUBSPOT.formId;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var INTERESTS = [
        ['', 'Choose one'],
        ['workshop', 'AI Kickstart Workshop ($1,250)'],
        ['assessment', 'AI Opportunity Assessment ($2,500)'],
        ['sprint', 'Automation Sprint (from $7,500)'],
        ['partner', 'AI Partner retainer (from $1,500/mo)'],
        ['founding', 'Founding client program'],
        ['unsure', 'Not sure yet, help me decide']
    ];

    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function field(id, name, label, type, required, autocomplete) {
        var note = required ? ' <span class="lead-form__req" aria-hidden="true">*</span>' : ' <span class="lead-form__opt">(optional)</span>';
        return '<div class="lead-form__field"><label for="' + id + '">' + label + note + '</label>' +
            '<input id="' + id + '" name="' + name + '" type="' + type + '"' + (required ? ' required aria-required="true"' : '') +
            ' autocomplete="' + autocomplete + '"></div>';
    }

    function honeypot() {
        return '<div class="lead-form__hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label></div>';
    }

    // ---- Submit (shared) ----
    function submit(values) {
        var names = ['firstname', 'lastname', 'email', 'phone', 'message'];
        var fields = names.filter(function (n) { return values[n]; })
            .map(function (n) { return { name: n, value: String(values[n]).trim() }; });
        return fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ submittedAt: Date.now(), fields: fields, context: { pageUri: location.href, pageName: document.title } })
        }).then(function (res) {
            if (res.ok) return res.json();
            return res.json().then(function (err) { throw err; });
        });
    }

    function clearErrors(form) {
        form.querySelectorAll('.lead-form__field--error').forEach(function (f) { f.classList.remove('lead-form__field--error'); });
        form.querySelectorAll('.lead-form__error').forEach(function (e) { e.remove(); });
    }
    function fieldError(form, name, msg) {
        var input = form.elements[name];
        var wrap = input.closest('.lead-form__field');
        wrap.classList.add('lead-form__field--error');
        var p = document.createElement('p');
        p.className = 'lead-form__error';
        p.textContent = msg;
        wrap.appendChild(p);
        input.focus();
    }
    function success(container, title, body) {
        container.innerHTML = '<div class="lead-form__success" role="status"><div class="lead-form__success-icon" aria-hidden="true">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
            '<h3>' + title + '</h3><p>' + body + '</p></div>';
    }

    // Generic handler: buildMessage(form) returns the message text.
    function wire(container, form, opts) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearErrors(form);
            var status = form.querySelector('.form-status');
            var btn = form.querySelector('.lead-form__submit');
            if (form.elements.company_website && form.elements.company_website.value) { success(container, opts.successTitle, opts.successBody); return; }
            var email = form.elements.email.value.trim();
            if (!EMAIL_RE.test(email)) { fieldError(form, 'email', 'Please enter a valid email address.'); return; }
            var label = btn.textContent;
            btn.disabled = true; btn.textContent = 'Sending…';
            status.className = 'form-status'; status.textContent = '';
            var name = (form.elements.fullname ? form.elements.fullname.value.trim() : '');
            var values = {
                firstname: form.elements.firstname ? form.elements.firstname.value : name.split(' ')[0],
                lastname: form.elements.lastname ? form.elements.lastname.value : name.split(' ').slice(1).join(' '),
                email: email,
                phone: form.elements.phone ? form.elements.phone.value : '',
                message: opts.buildMessage(form)
            };
            submit(values).then(function () {
                success(container, opts.successTitle, opts.successBody);
            }).catch(function (err) {
                console.error('Lead form submission failed:', err);
                btn.disabled = false; btn.textContent = label;
                status.className = 'form-status form-status--error';
                status.textContent = 'Something went wrong. Please email info@birchmontgroup.ca or try again in a moment.';
            });
        });
    }

    // ---- Contact form ----
    function renderContact(container) {
        var params = new URLSearchParams(location.search);
        var pre = params.get('interest') || '';
        var opts = INTERESTS.map(function (o) {
            return '<option value="' + o[0] + '"' + (o[0] === pre ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
        }).join('');
        container.innerHTML =
            '<form class="lead-form" novalidate>' +
                '<div class="lead-form__row">' +
                    field('lf-first', 'firstname', 'First name', 'text', false, 'given-name') +
                    field('lf-last', 'lastname', 'Last name', 'text', false, 'family-name') +
                '</div>' +
                '<div class="lead-form__row">' +
                    field('lf-email', 'email', 'Work email', 'email', true, 'email') +
                    field('lf-phone', 'phone', 'Phone', 'tel', false, 'tel') +
                '</div>' +
                field('lf-company', 'company', 'Company', 'text', false, 'organization') +
                '<div class="lead-form__field"><label for="lf-interest">What are you interested in? <span class="lead-form__opt">(optional)</span></label>' +
                    '<select id="lf-interest" name="interest">' + opts + '</select></div>' +
                '<div class="lead-form__field"><label for="lf-message">Where is your team losing the most time? <span class="lead-form__opt">(optional)</span></label>' +
                    '<textarea id="lf-message" name="message" rows="4" placeholder="e.g. We re-enter every work order into three systems and chase invoices by hand."></textarea></div>' +
                honeypot() +
                '<p class="form-status" role="status" aria-live="polite"></p>' +
                '<button type="submit" class="btn lead-form__submit">Send message</button>' +
                '<p class="lead-form__fineprint">We reply within one business day. No spam, ever.</p>' +
            '</form>';
        var form = container.querySelector('form');
        wire(container, form, {
            successTitle: 'Thanks, message received.',
            successBody: 'We&rsquo;ll reply within one business day. Want to skip the back-and-forth? <a href="https://cal.com/birchmont-discovery" target="_blank" rel="noopener">Book a time directly &rarr;</a>',
            buildMessage: function (f) {
                var sel = f.elements.interest;
                var parts = [];
                if (f.elements.company.value.trim()) parts.push('Company: ' + f.elements.company.value.trim());
                if (sel.value) parts.push('Interested in: ' + sel.options[sel.selectedIndex].text);
                var msg = f.elements.message.value.trim();
                if (msg) parts.push((parts.length ? '\n' : '') + msg);
                return parts.join('\n');
            }
        });
    }

    // ---- Scorecard capture form (summary text supplied by scorecard.js) ----
    function renderScorecard(container, getSummary) {
        container.innerHTML =
            '<form class="lead-form" novalidate>' +
                '<div class="lead-form__row">' +
                    field('sc-name', 'fullname', 'Name', 'text', false, 'name') +
                    field('sc-email', 'email', 'Work email', 'email', true, 'email') +
                '</div>' +
                field('sc-company', 'company', 'Company', 'text', false, 'organization') +
                honeypot() +
                '<p class="form-status" role="status" aria-live="polite"></p>' +
                '<button type="submit" class="btn lead-form__submit">Send me my results + book a debrief</button>' +
                '<p class="lead-form__fineprint">We&rsquo;ll email your results and suggest a time for a free 15-minute debrief.</p>' +
            '</form>';
        var form = container.querySelector('form');
        wire(container, form, {
            successTitle: 'Done. Check your inbox.',
            successBody: 'We&rsquo;ll send your results and a few times for a free 15-minute debrief within one business day.',
            buildMessage: function (f) {
                var c = f.elements.company.value.trim();
                return 'AI READINESS SCORECARD\n' + (c ? 'Company: ' + c + '\n' : '') + getSummary();
            }
        });
    }

    window.BirchmontLead = { submit: submit, renderScorecard: renderScorecard };
    document.querySelectorAll('[data-hubspot-form]').forEach(renderContact);
})();
