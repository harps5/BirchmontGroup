/* ==========================================================================
   Birchmont Group Inc. — Landing Page Scripts
   ========================================================================== */

(function () {
    'use strict';

    // ---------- Nav: solid background on scroll ----------
    const nav = document.getElementById('nav');
    const onScroll = () => {
        if (window.scrollY > 24) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Mobile menu toggle ----------
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav__links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---------- Hero entrance: reveal immediately on load ----------
    const heroReveals = document.querySelectorAll('.hero .reveal');
    window.addEventListener('load', () => {
        heroReveals.forEach(el => {
            const delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => el.classList.add('is-visible'), delay);
        });
    });
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
        heroReveals.forEach(el => {
            const delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => el.classList.add('is-visible'), delay);
        });
    }

    // ---------- Scroll-triggered reveals ----------
    const sectionReveals = document.querySelectorAll('.section .reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.delay || '0', 10);
                    setTimeout(() => el.classList.add('is-visible'), delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        sectionReveals.forEach(el => io.observe(el));
    } else {
        sectionReveals.forEach(el => el.classList.add('is-visible'));
    }

    // ---------- Contact form (UI only) ----------
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (form && status) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            if (!name || !email || !message) {
                status.textContent = 'Please fill in all fields.';
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                status.textContent = 'Please enter a valid email address.';
                return;
            }

            status.textContent = 'Thank you — your message has been noted. We will be in touch shortly.';
            form.reset();
        });
    }
})();
