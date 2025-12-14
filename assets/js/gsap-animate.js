//  gsap.registerPlugin(ScrollTrigger);
//   //  // Welcome text gentle rise & fade (parallax feel)
//   //  gsap.from(".intro .title", {
//   //    y: 200, opacity:0, duration:1.2, ease:"power3.out",
//   //    scrollTrigger:{
//   //      trigger:".intro",
//   //      start:"top 100%",
//   //      end:"bottom 30%",
//   //      scrub:true
//   //    }
//   //  });
//   //  gsap.from(".intro .subtitle", {
//   //    y: 25, opacity:0, duration:1.1, ease:"power3.out",
//   //    scrollTrigger:{
//   //      trigger:".intro",
//   //      start:"top 65%",
//   //      end:"bottom 35%",
//   //      scrub:true
//   //    }
//   //  });
//   //  // Animate milestone cards as they come into view (stagger)
//   //  const cards = gsap.utils.toArray(".card");
//   //  cards.forEach((card, i) => {
//   //    gsap.from(card, {
//   //      x: 500,
//   //      y: 100,
//   //      opacity: 0,
//   //      duration: 0.9,
//   //      ease: "power3.out",
//   //      scrollTrigger:{
//   //        trigger: card,
//   //        start: "top 80%",
//   //        toggleActions: "play none none reverse"
//   //      }
//   //    });
//   //    // subtle float on hover for large screens
//   //    if(window.innerWidth > 880){
//   //      card.addEventListener("mouseenter", () => gsap.to(card, { y:-8, duration:0.35, ease:"power2.out" }));
//   //      card.addEventListener("mouseleave", () => gsap.to(card, { y:0, duration:0.5, ease:"power2.out" }));
//   //    }
//   //  });
//    // Celebrate CTA: small pop when enters
//   //  gsap.from(".cta", {
//   //    scale: 0.92, opacity:0, duration:0.7, ease:"back.out(1.7)",
//   //    scrollTrigger:{
//   //      trigger: ".celebrate",
//   //      start: "top 80%",
//   //      toggleActions: "play none none reverse"
//   //    }
//   //  });

// MD's Note: orchestrated reveal — image as cover first, then section, then description
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  // prepare initial hidden states — make the md section enter from the left
  gsap.set('.md-note', { autoAlpha: 0, x: -60 });
  gsap.set('.md-note .md-note-content', { autoAlpha: 0, x: -38 });
  gsap.set('.md-note .md-name', { autoAlpha: 0, x: -24 });

  const mdTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.md-note-section',
      start: 'top 60%',
      toggleActions: 'play none none reverse'
    }
  });

  // show image prominently (cover-like pop)
  mdTl.fromTo('.md-image', { scale: 1.08, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.65, ease: 'power2.out' });

  // reveal the container (text area) sliding in from the left
  mdTl.to('.md-note', { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' }, '>-0.12');

  // reveal description then name (also slide in)
  mdTl.to('.md-note .md-note-content', { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '>-0.06');
  mdTl.to('.md-note .md-name', { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power2.out' }, '>-0.04');

  // subtle parallax tilt for image while scrolling the section
  gsap.to('.md-image', {
    rotationY: 6,
    y: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.md-note-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6
    }
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.addEventListener('resize', () => ScrollTrigger.refresh());
}

// --- Performance Mode toggle (persistent) ---
// Creates a small floating toggle, saves choice to localStorage under 'perfMode',
// sets `data-performance="low"|"normal"` on <html> and dispatches a `performancechange` event.
(function () {
  const STORAGE_KEY = 'perfMode';

  function applyPerf(enabled) {
    try {
      document.documentElement.setAttribute('data-performance', enabled ? 'low' : 'normal');
    } catch (e) {}
    window.performanceModeEnabled = !!enabled;
    window.dispatchEvent(new CustomEvent('performancechange', { detail: { enabled: !!enabled } }));
  }

  function createToggle() {
    if (document.getElementById('perf-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'perf-toggle';
    btn.type = 'button';
    btn.title = 'Toggle Performance Mode (saves preference)';
    btn.setAttribute('aria-pressed', 'false');

    Object.assign(btn.style, {
      position: 'fixed',
      right: '14px',
      top: '14px',
      zIndex: 99999,
      background: 'rgba(0,0,0,0.5)',
      color: '#fff',
      padding: '6px 10px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '13px',
      backdropFilter: 'blur(6px)'
    });

    const label = document.createElement('span');
    label.textContent = 'Perf Mode';
    const state = document.createElement('span');
    state.id = 'perf-toggle-state';
    Object.assign(state.style, { marginLeft: '8px', fontWeight: 700 });

    btn.appendChild(label);
    btn.appendChild(state);

    btn.addEventListener('click', () => {
      const enabled = !(localStorage.getItem(STORAGE_KEY) === '1');
      localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
      btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      state.textContent = enabled ? 'ON' : 'OFF';
      applyPerf(enabled);
    });

    document.body.appendChild(btn);

    // initialize from storage
    const stored = localStorage.getItem(STORAGE_KEY) === '1';
    btn.setAttribute('aria-pressed', stored ? 'true' : 'false');
    state.textContent = stored ? 'ON' : 'OFF';
    applyPerf(stored);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createToggle);
  } else {
    createToggle();
  }
})();