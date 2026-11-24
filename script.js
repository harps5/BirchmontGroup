(function () {
    'use strict';
    document.documentElement.classList.remove('no-js');

    // --- Nav: solid on scroll ---
    var nav = document.getElementById('nav');
    function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile menu ---
    var toggle = document.getElementById('navToggle');
    var links = document.querySelector('.nav__links');
    function setMenu(open) {
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('menu-open', open);
        nav.classList.toggle('menu-open', open);
    }
    if (toggle && links) {
        toggle.addEventListener('click', function () { setMenu(!links.classList.contains('is-open')); });
        links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    }

    // --- Reveal on scroll ---
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                setTimeout(function () { el.classList.add('is-visible'); }, parseInt(el.dataset.delay || '0', 10));
                io.unobserve(el);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // --- Tabs ---
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
        var btns = root.querySelectorAll('[role="tab"]');
        function select(btn) {
            btns.forEach(function (b) {
                var on = b === btn;
                b.setAttribute('aria-selected', String(on));
                b.tabIndex = on ? 0 : -1;
                document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
            });
        }
        btns.forEach(function (b, i) {
            b.addEventListener('click', function () { select(b); });
            b.addEventListener('keydown', function (e) {
                var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                if (!d) return;
                var next = btns[(i + d + btns.length) % btns.length];
                select(next); next.focus();
            });
        });
    });

    // --- ROI calculator ---
    var roi = document.querySelector('[data-roi]');
    if (roi) {
        var inputs = roi.querySelectorAll('input[type="range"]');
        var fmt = function (n) { return Math.round(n).toLocaleString('en-CA'); };
        var money = function (n) {
            if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
            if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
            return '$' + Math.round(n);
        };
        function calc() {
            var v = {};
            inputs.forEach(function (inp) {
                v[inp.name] = parseFloat(inp.value);
                var pct = (inp.value - inp.min) / (inp.max - inp.min) * 100;
                inp.style.setProperty('--p', pct + '%');
                var out = roi.querySelector('output[for="' + inp.id + '"]');
                if (out) out.textContent = (inp.dataset.prefix || '') + fmt(inp.value) + (inp.dataset.suffix || '');
            });
            var CAPTURE = 0.4;      // conservative share of repetitive work AI can take on
            var WEEKS = 46;         // working weeks per year
            var hours = v.people * v.hours * CAPTURE * WEEKS;
            var value = hours * v.rate;
            roi.querySelector('[data-out="value"]').textContent = money(value);
            roi.querySelector('[data-out="hours"]').textContent = fmt(hours);
            roi.querySelector('[data-out="fte"]').textContent = (hours / 1720).toFixed(1);
        }
        inputs.forEach(function (inp) { inp.addEventListener('input', calc); });
        calc();
    }
})();
