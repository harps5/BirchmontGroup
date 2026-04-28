(function () {
    'use strict';

    var API_URL = 'https://script.google.com/macros/s/AKfycbwPyMVvoq8P05KQK9WIb30PXXH99Oc2DDt9GTO9UmsxmH8P7hWTuLv8nLzuhdKKdrI/exec';

    var form = document.getElementById('designLeadForm');
    var status = document.getElementById('leadFormStatus');
    var submitBtn = document.getElementById('leadSubmitBtn');

    if (!form || !status || !submitBtn) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = form.querySelector('[name="name"]').value.trim();
        var email = form.querySelector('[name="email"]').value.trim();
        var company = form.querySelector('[name="company"]').value.trim();
        var phone = form.querySelector('[name="phone"]').value.trim();
        var website = form.querySelector('[name="website"]').value.trim();
        var message = form.querySelector('[name="message"]').value.trim();

        if (!name || !email) {
            status.textContent = 'Please fill in your name and email.';
            status.className = 'form-status form-status--error';
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            status.textContent = 'Please enter a valid email address.';
            status.className = 'form-status form-status--error';
            return;
        }

        var interests = [];
        form.querySelectorAll('[name="interest"]:checked').forEach(function (cb) {
            interests.push(cb.value);
        });
        if (interests.length) {
            message = '[Interests: ' + interests.join(', ') + ']\n\n' + message;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        status.textContent = '';
        status.className = 'form-status';

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'submit_form',
                data: {
                    name: name,
                    email: email,
                    company: company,
                    phone: phone,
                    website: website,
                    message: message,
                    source_page: location.href
                }
            }),
            redirect: 'follow'
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.ok) {
                form.innerHTML = '<div class="form-success"><h3 class="philosophy__title" style="color:var(--navy);">Thank you.</h3><p class="about__text" style="margin-top:16px;">We’ve received your information and will be in touch within one business day to schedule your discovery call.</p></div>';
            } else {
                throw new Error(data.error || 'Submission failed');
            }
        })
        .catch(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Book a Free Discovery Call';
            status.innerHTML = 'Something went wrong. Please try again or email us directly at <a href="mailto:hello@birchmontgroup.ca" style="color:var(--gold);">hello@birchmontgroup.ca</a>';
            status.className = 'form-status form-status--error';
        });
    });
})();
