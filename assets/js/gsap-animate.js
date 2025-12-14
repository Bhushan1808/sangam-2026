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

     gsap.from('.schedule', {
    xPercent: 10,      opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.schedule',
            start: "top 50%",
            toggleActions: "play none none reverse"
          }
        });

         gsap.from('.md-note-section', {
    xPercent: -10,      opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.md-note-section',
            start: "top 50%",
            toggleActions: "play none none reverse"
          }
        });

    // Ensure schedule items start hidden (so animations always come from below)
    gsap.set('.schedule .schedule-item', { y: 24, autoAlpha: 0 });

    // Animate schedule "rows" (.schedule-item) as they enter the viewport.
    // Add `onEnterBack` and explicitly set the from-state to avoid layout-shift
    // cases where the element is partially visible and the animation appears
    // to originate from the middle.
    ScrollTrigger.batch('.schedule .schedule-item', {
      interval: 0.1, // time window (in seconds) for batching
      batchMax: 8,   // maximum elements to batch at once
      // make the trigger happen a little lower in the viewport so items
      // are fully off-screen before they animate in (helps with fixed header overlap)
      start: 'top 92%',
      end: 'bottom 12%',
      onEnter: batch => {
        // force consistent start state then animate up
        gsap.fromTo(batch, { y: 24, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.06,
          overwrite: true
        });
      },
      onEnterBack: batch => {
        // when scrolling back up, animate in the same upward direction
        gsap.fromTo(batch, { y: 24, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.04,
          overwrite: true
        });
      },
      // ensure items are reset when they leave the viewport (below)
      onLeave: batch => {
        gsap.set(batch, { y: 24, autoAlpha: 0, overwrite: true });
      },
      onLeaveBack: batch => gsap.to(batch, { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.03 }),
    });

    gsap.from('.team-section .team-member', {
      y: 30,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.team-section',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.addEventListener('resize', () => ScrollTrigger.refresh());
}
