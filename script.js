(function () {
    'use strict';

    // --- Shared CRM endpoint (Apps Script web app) ---
    var CRM_API_URL = 'https://script.google.com/macros/s/AKfycbwPyMVvoq8P05KQK9WIb30PXXH99Oc2DDt9GTO9UmsxmH8P7hWTuLv8nLzuhdKKdrI/exec';
    var CRM_FALLBACK_EMAIL = 'info@birchmontgroup.ca';

    // text/plain content type avoids the CORS preflight that Apps Script
    // web apps don't support. Body is still JSON.
    function postToCRM(payload) {
        return fetch(CRM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'submit_form', data: payload }),
            redirect: 'follow'
        }).then(function (res) { return res.json(); });
    }

    // Expose a tiny global for the per-page lead-form scripts.
    window.Birchmont = {
        CRM_API_URL: CRM_API_URL,
        CRM_FALLBACK_EMAIL: CRM_FALLBACK_EMAIL,
        postToCRM: postToCRM
    };

    // --- Nav scroll ---
    var nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            nav.classList.toggle('is-scrolled', window.scrollY > 32);
        }, { passive: true });
    }

    // --- Mobile menu toggle ---
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.querySelector('.nav__links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var open = navLinks.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Dropdown nav ---
    document.querySelectorAll('.nav__dropdown').forEach(function (dropdown) {
        var trigger = dropdown.querySelector('.nav__dropdown-trigger');
        var menu = dropdown.querySelector('.nav__dropdown-menu');
        if (!trigger || !menu) return;

        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            var isOpen = menu.classList.toggle('is-open');
            trigger.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target)) {
                menu.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                menu.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        });
    });

    // --- Reveal animations ---
    function triggerReveals(els) {
        els.forEach(function (el) {
            var delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(function () { el.classList.add('is-visible'); }, delay);
        });
    }

    var heroReveals = document.querySelectorAll('.hero .reveal, .design-hero .reveal, .page-hero .reveal');
    if (document.readyState === 'complete') {
        triggerReveals(heroReveals);
    } else {
        window.addEventListener('load', function () { triggerReveals(heroReveals); });
    }

    var sectionReveals = document.querySelectorAll('.section .reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = parseInt(el.dataset.delay || '0', 10);
                    setTimeout(function () { el.classList.add('is-visible'); }, delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
        sectionReveals.forEach(function (el) { io.observe(el); });
    } else {
        sectionReveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // --- Contact form (short form on /contact/) ---
    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');
    if (form && status) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var name = form.querySelector('[name="name"]').value.trim();
            var email = form.querySelector('[name="email"]').value.trim();
            var message = form.querySelector('[name="message"]').value.trim();

            if (!name || !email || !message) {
                status.textContent = 'Please fill in all fields.';
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                status.textContent = 'Please enter a valid email address.';
                return;
            }

            if (btn) btn.disabled = true;
            status.textContent = 'Sending…';

            postToCRM({ name: name, email: email, message: message, source_page: location.href })
                .then(function (json) {
                    if (!json || !json.ok) {
                        throw new Error((json && json.error) || 'Submission failed');
                    }
                    status.textContent = 'Thank you. We’ll be in touch.';
                    form.reset();
                })
                .catch(function (err) {
                    if (window.console && console.error) {
                        console.error('Contact form submission failed:', err);
                    }
                    status.textContent = 'Sorry — something went wrong. Please email ' + CRM_FALLBACK_EMAIL + ' directly.';
                })
                .then(function () {
                    if (btn) btn.disabled = false;
                });
        });
    }

    // --- Shared lead-form handler (used by /divisions/design/ and /divisions/ai/) ---
    window.Birchmont.bindLeadForm = function (opts) {
        var form = document.getElementById(opts.formId);
        var status = document.getElementById(opts.statusId);
        var submitBtn = document.getElementById(opts.submitBtnId);
        if (!form || !status || !submitBtn) return;

        var defaultBtnLabel = submitBtn.textContent;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = form.querySelector('[name="name"]').value.trim();
            var email = form.querySelector('[name="email"]').value.trim();
            var company = (form.querySelector('[name="company"]') || {}).value || '';
            var phone = (form.querySelector('[name="phone"]') || {}).value || '';
            var website = (form.querySelector('[name="website"]') || {}).value || '';
            var message = (form.querySelector('[name="message"]') || {}).value || '';
            company = company.trim();
            phone = phone.trim();
            website = website.trim();
            message = message.trim();

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
            submitBtn.textContent = 'Sending…';
            status.textContent = '';
            status.className = 'form-status';

            postToCRM({
                name: name,
                email: email,
                company: company,
                phone: phone,
                website: website,
                message: message,
                division: opts.division || '',
                source_page: location.href
            })
                .then(function (data) {
                    if (data && data.ok) {
                        var successMsg = opts.successMessage || 'We’ve received your information and will be in touch within one business day.';
                        form.innerHTML =
                            '<div class="form-success">' +
                            '<h3 class="philosophy__title" style="color:var(--navy);">Thank you.</h3>' +
                            '<p class="about__text" style="margin-top:16px;">' + successMsg + '</p>' +
                            '</div>';
                    } else {
                        throw new Error((data && data.error) || 'Submission failed');
                    }
                })
                .catch(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = defaultBtnLabel;
                    status.innerHTML =
                        'Something went wrong. Please try again or email us directly at ' +
                        '<a href="mailto:' + CRM_FALLBACK_EMAIL + '" style="color:var(--gold);">' + CRM_FALLBACK_EMAIL + '</a>';
                    status.className = 'form-status form-status--error';
                });
        });
    };
})();
