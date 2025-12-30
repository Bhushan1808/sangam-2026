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
 



  // show image prominently (cover-like pop)


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

    // More robust per-item ScrollTrigger approach:
    // - Do not hide items on leave (avoids disappearing rows during fast scroll)
    // - Animate each item on enter/enterBack with a simple gsap.to
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const smallViewport = window.innerWidth < 768;

    const scheduleEls = gsap.utils.toArray('.schedule .schedule-item');

    if (isTouch || smallViewport) {
      // on touch/small screens, disable entrance animation to avoid layout issues
      gsap.set(scheduleEls, { y: 0, autoAlpha: 1 });
    } else {
      // set initial hidden state
      gsap.set(scheduleEls, { y: 24, autoAlpha: 0 });

      scheduleEls.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          onEnter: () => {
            gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' });
          },
          onEnterBack: () => {
            gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
          }
          // intentionally no onLeave/onLeaveBack so items are not hidden again
        });
      });
    }

    gsap.from('.team-section', {
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

     gsap.from('.gallery', {
    xPercent: -10,      opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.gallery',
            start: "top 40%",
            toggleActions: "play none none reverse"
          }
        });

        gsap.from('.venue', {
    yPercent: 20,      opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.venue',
            start: "top 35%",
            toggleActions: "play none none reverse"
          }
        });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.addEventListener('resize', () => ScrollTrigger.refresh());
}
