// venue-cover.js
// Creates a crossfade slideshow inside #venue-cover using GSAP
(function () {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not found — venue cover will not animate');
    return;
  }

  const images = [
    'assets/img/venue-gallery/main.jfif',
    'assets/img/venue-gallery/main-2.jfif',
    'assets/img/venue-gallery/pool.jfif',
     'assets/img/venue-gallery/bar.jfif',
     'assets/img/venue-gallery/dining.jfif',
     'assets/img/venue-gallery/bar-2.jfif',
          'assets/img/venue-gallery/dining-2.jfif',

      'assets/img/venue-gallery/room.jfif',
            'assets/img/venue-gallery/balcony.jfif',


  ];

  const cover = document.getElementById('venue-cover');
  if (!cover) return;

  // create slides
  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'vc-slide';
    slide.style.backgroundImage = `url(${src})`;
    slide.setAttribute('data-index', i);
    cover.appendChild(slide);
  });

  // overlay, content, dots
  const overlay = document.createElement('div');
  overlay.className = 'vc-overlay';
  cover.appendChild(overlay);

  const content = document.createElement('div');
  content.className = 'vc-content';
  content.innerHTML = `
    <div class="vc-title">Courtyard by Marriott Aravali Resort</div>
    <div class="vc-subtitle">Venue for WIN Sangam 2026</div>
    <a class="vc-cta" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=Courtyard+by+Marriott+Aravali+Resort">Visit on map</a>
  `;
  cover.appendChild(content);

  const dots = document.createElement('div');
  dots.className = 'vc-dots';
  cover.appendChild(dots);

  const slides = Array.from(cover.querySelectorAll('.vc-slide'));
  slides.forEach((s, idx) => {
    const btn = document.createElement('button');
    btn.setAttribute('data-idx', idx);
    btn.addEventListener('click', () => goto(idx));
    dots.appendChild(btn);
  });

  let current = 0;
  const t = gsap.timeline({ paused: true });

  // initial show
  gsap.set(slides, { autoAlpha: 0 });
  gsap.set(slides[0], { autoAlpha: 1 });
  updateDots();

  function updateDots() {
    dots.querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('active', i === current);
    });
  }

  function goto(idx) {
    if (idx === current) return;
    const from = slides[current];
    const to = slides[idx];
    gsap.timeline()
      .to(from, { autoAlpha: 0, duration: 0.8, ease: 'power2.out' })
      .fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' });
    current = idx;
    updateDots();
    resetAuto();
  }

  // auto-advance (controlled by visibility to avoid jank)
  let autoId = null;
  function startAuto() {
    stopAuto();
    autoId = setInterval(() => {
      const next = (current + 1) % slides.length;
      goto(next);
    }, 3500);
  }
  function stopAuto() { if (autoId) { clearInterval(autoId); autoId = null; } }
  function resetAuto() { if (isInView && !document.hidden) startAuto(); }

  // Pause auto-advance while the section is off-screen or the page is hidden.
  let isInView = false;
  function ensureImagesLoaded() {
    // preload background images to avoid flicker when animation runs
    slides.forEach(s => {
      const bg = (s.style.backgroundImage || '').replace(/url\((?:"|')?(.*?)(?:"|')?\)/, '$1');
      if (bg) {
        const im = new Image();
        im.src = bg;
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          isInView = true;
          ensureImagesLoaded();
          startAuto();
        } else {
          isInView = false;
          stopAuto();
        }
      });
    }, { threshold: [0.25] });
    obs.observe(cover);
  } else {
    // fallback: start immediately
    ensureImagesLoaded();
    startAuto();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else if (isInView) startAuto();
  });
})();
