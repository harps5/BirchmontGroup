(function () {
    'use strict';

    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function () {
        nav.classList.toggle('is-scrolled', window.scrollY > 32);
    }, { passive: true });

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

    function triggerReveals(els) {
        els.forEach(function (el) {
            var delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(function () { el.classList.add('is-visible'); }, delay);
        });
    }

    var heroReveals = document.querySelectorAll('.hero .reveal');
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

    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');
    if (form && status) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = form.name.value.trim();
            var email = form.email.value.trim();
            var message = form.message.value.trim();
            if (!name || !email || !message) {
                status.textContent = 'Please fill in all fields.';
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                status.textContent = 'Please enter a valid email address.';
                return;
            }
            status.textContent = 'Thank you. We’ll be in touch.';
            form.reset();
        });
    }
})();
