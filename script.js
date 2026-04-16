/* =========================================================
   Birchmont Group Inc. — Landing Page interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 24) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        mobileMenu.hidden = false;
      } else {
        mobileMenu.hidden = true;
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        mobileMenu.hidden = true;
      });
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal-up");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || "0", 10);
            setTimeout(() => el.classList.add("is-in"), delay);
            io.unobserve(el);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Hero staggered fade-up ---------- */
  const heroReveal = document.querySelectorAll(".hero .reveal");
  window.addEventListener("load", () => {
    heroReveal.forEach((el) => {
      const delay = parseInt(el.dataset.delay || "0", 10);
      setTimeout(() => el.classList.add("is-in"), delay + 120);
    });
  });
  // Fallback in case load already fired
  setTimeout(() => {
    heroReveal.forEach((el) => {
      if (!el.classList.contains("is-in")) {
        const delay = parseInt(el.dataset.delay || "0", 10);
        setTimeout(() => el.classList.add("is-in"), delay);
      }
    });
  }, 400);

  /* ---------- Smooth anchor scroll offset fix ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Contact form (UI only) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = "Please complete all fields.";
        status.style.color = "#dbc4a8";
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        status.textContent = "Please enter a valid email address.";
        status.style.color = "#dbc4a8";
        return;
      }

      status.textContent = "Thank you — we'll be in touch shortly.";
      status.style.color = "#c5a47e";
      form.reset();
    });
  }
})();
