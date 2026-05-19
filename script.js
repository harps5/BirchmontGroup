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

    var heroReveals = document.querySelectorAll('.hero .reveal, .design-hero .reveal, .studio-hero .reveal, .page-hero .reveal');
    if (document.readyState === 'complete') {
        triggerReveals(heroReveals);
    } else {
        window.addEventListener('load', function () { triggerReveals(heroReveals); });
    }

    var sectionReveals = document.querySelectorAll('.section .reveal, .spotlight .reveal');
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

    // --- Studio hero parallax (subtle, scroll-linked) ---
    var prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var parallaxLayer = document.querySelector('.studio-hero__layer');
    if (parallaxLayer && !prefersReducedMotion) {
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                var offset = Math.min(window.scrollY, 600) * 0.18;
                parallaxLayer.style.transform = 'translate3d(0,' + offset + 'px,0)';
                ticking = false;
            });
        }, { passive: true });
    }
})();
