(function () {
    'use strict';

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

        // Close on outside click (desktop)
        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target)) {
                menu.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on Escape
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

    // --- Contact form (posts to Birchmont CRM Apps Script) ---
    var CONTACT_API_URL = 'https://script.google.com/macros/s/AKfycbwPyMVvoq8P05KQK9WIb30PXXH99Oc2DDt9GTO9UmsxmH8P7hWTuLv8nLzuhdKKdrI/exec';
    var CONTACT_FALLBACK_EMAIL = 'info@birchmontgroup.ca';

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

            // text/plain content type avoids the CORS preflight that Apps Script
            // web apps don't support. Body is still JSON.
            fetch(CONTACT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    action: 'submit_form',
                    data: {
                        name: name,
                        email: email,
                        message: message,
                        source_page: location.href
                    }
                }),
                redirect: 'follow'
            })
            .then(function (res) { return res.json(); })
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
                status.textContent = 'Sorry — something went wrong. Please email ' + CONTACT_FALLBACK_EMAIL + ' directly.';
            })
            .then(function () {
                if (btn) btn.disabled = false;
            });
        });
    }
})();
