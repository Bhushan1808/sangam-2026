// throwback-cover.js
// Convert existing .carousel-container contents into a simple crossfade slideshow
// that mirrors the behavior of #venue-cover. Non-destructive: reads image URLs from
// existing carousel items and replaces the container innerHTML with slides/dots.
(function () {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not found — throwback cover will not animate');
    return;
  }

  function initContainer(container) {
    const items = Array.from(container.querySelectorAll('.carousel__slider__item'));
    if (!items.length) return;

    const images = items.map(it => {
      const img = it.querySelector('img');
      return img ? img.src : null;
    }).filter(Boolean);

    // clear existing content (we keep the container element)
    container.innerHTML = '';

    // build slides
    images.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'vc-slide';
      slide.style.backgroundImage = `url(${src})`;
      slide.setAttribute('data-index', i);
      container.appendChild(slide);
    });

    const overlay = document.createElement('div');
    overlay.className = 'vc-overlay';
    container.appendChild(overlay);

    const dots = document.createElement('div');
    dots.className = 'vc-dots';
    container.appendChild(dots);

    const slides = Array.from(container.querySelectorAll('.vc-slide'));
    slides.forEach((s, idx) => {
      const btn = document.createElement('button');
      btn.setAttribute('data-idx', idx);
      btn.addEventListener('click', () => goto(idx));
      dots.appendChild(btn);
    });

    let current = 0;

    gsap.set(slides, { autoAlpha: 0 });
    if (slides[0]) gsap.set(slides[0], { autoAlpha: 1 });
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

    let autoId;
    function startAuto() {
      stopAuto();
      autoId = setInterval(() => {
        const next = (current + 1) % slides.length;
        goto(next);
      }, 3500);
    }
    function stopAuto() { if (autoId) { clearInterval(autoId); autoId = null; } }
    function resetAuto() { startAuto(); }

    startAuto();

    // when container becomes visible (tab toggle), restart/refresh
    // listen for class changes: if container gets .active, restart auto
    const obs = new MutationObserver(() => {
      if (container.classList.contains('active')) {
        resetAuto();
      } else {
        stopAuto();
      }
    });
    obs.observe(container, { attributes: true, attributeFilter: ['class'] });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel-container').forEach(initContainer);
  });
})();
