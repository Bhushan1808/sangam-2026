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

// // MD's Note: orchestrated reveal — image as cover first, then section, then description
// if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
//   // prepare initial hidden states
//   gsap.set('.md-note', { autoAlpha: 0, y: 18 });
//   gsap.set('.md-note .md-note-content', { autoAlpha: 0, y: 12 });
//   gsap.set('.md-note .md-name', { autoAlpha: 0, y: 8 });

//   const mdTl = gsap.timeline({
//     scrollTrigger: {
//       trigger: '.md-note-section',
//       start: 'top 60%',
//       toggleActions: 'play none none reverse'
//     }
//   });

//   // show image prominently (cover-like pop)
//   mdTl.fromTo('.md-image', { scale: 1.08, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.65, ease: 'power2.out' });

//   // reveal the container (text area)
//   mdTl.to('.md-note', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '>-0.12');

//   // reveal description then name
//   mdTl.to('.md-note .md-note-content', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '>-0.06');
//   mdTl.to('.md-note .md-name', { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '>-0.04');

//   // subtle parallax tilt for image while scrolling the section
//   gsap.to('.md-image', {
//     rotationY: 6,
//     y: -8,
//     ease: 'none',
//     scrollTrigger: {
//       trigger: '.md-note-section',
//       start: 'top bottom',
//       end: 'bottom top',
//       scrub: 0.6
//     }
//   });

//   window.addEventListener('load', () => ScrollTrigger.refresh());
//   window.addEventListener('resize', () => ScrollTrigger.refresh());
// }