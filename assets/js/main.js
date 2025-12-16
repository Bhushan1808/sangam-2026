(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
    // Toggle a class used for a CSS animated hamburger → X transition
    mobileNavToggleBtn.classList.toggle("is-active");
  }
  if (mobileNavToggleBtn) mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      // Add a hidden class to allow CSS fade-out, then remove from DOM
      preloader.classList.add('preloader--hidden');
      setTimeout(() => {
        if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 520);
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);

  /**
   * Theme toggle (light / dark) — persists to localStorage and uses
   * `data-theme` attribute on <html> for CSS variable switching.
   */
  function applyTheme(theme) {
    try {
      if (!theme) return;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('site-theme', theme);
      const icon = document.getElementById('theme-toggle-icon');
      if (icon) {
        icon.className = 'bi ' + (theme === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill');
      }
    } catch (e) {
      console.error('applyTheme error', e);
    }
  }

  function initThemeToggle() {
    const saved = localStorage.getItem('site-theme');
    let initial = saved;
    if (!initial) {
      // Respect OS preference if no saved value
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      initial = prefersDark ? 'light' : 'dark';
    }
    applyTheme(initial);

    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      // persist the selection and reload so dependent modules (particles, etc.) re-init
      applyTheme(next);
      try {
        // ensure theme is stored then reload
        localStorage.setItem('site-theme', next);
      } catch (e) {
        console.warn('Could not write theme to localStorage', e);
      }
      // short delay to ensure DOM updates/localStorage complete, then reload
      setTimeout(() => { window.location.reload(); }, 5);
    });
  }

  // initialize theme toggle on load
  window.addEventListener('load', initThemeToggle);

  /* Hero video initialization: ensure video plays when allowed and
     pauses/hides when Performance Mode is enabled or on small screens. */
  function setupHeroVideo() {
    try {
      const vid = document.getElementById('hero-video');
      if (!vid) return;
      const isPerfMode = () => {
        return (document.documentElement.getAttribute('data-performance') === 'low') ||
          localStorage.getItem('perfMode') === '1' ||
          window.performanceModeEnabled === true;
      };

      if (isPerfMode()) {
        vid.pause();
        vid.style.display = 'none';
        return;
      }

      vid.muted = true;
      vid.playsInline = true;

      const tryPlay = () => { vid.play().catch(() => {}); };
      tryPlay();

      window.addEventListener('performancechange', () => {
        if (isPerfMode()) { vid.pause(); vid.style.display = 'none'; }
        else { vid.style.display = 'block'; tryPlay(); }
      });
    } catch (e) { /* swallow errors */ }
  }
  window.addEventListener('load', setupHeroVideo);
})();