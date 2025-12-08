document.addEventListener("DOMContentLoaded", () => {
  const userInfoContainer = document.getElementById("user-info-container");
  const gameContent = document.getElementById("game-content");
  const userInfoForm = document.getElementById("user-info-form");

  userInfoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // relax client pattern, server should verify domain

    const feedback = document.getElementById('email-feedback');
    const success = document.getElementById('form-success');
    feedback.textContent = '';
    success.style.display = 'none';

    if (!email) {
      feedback.textContent = 'Please enter your email.';
      return;
    }

    if (!emailPattern.test(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      return;
    }

    // Save and reveal game area with animation
    try {
      localStorage.setItem("userInfo", JSON.stringify({ email }));
    } catch (e) {
      /* ignore storage errors */
    }

    // hide form container and reveal game content using classes
    userInfoContainer.classList.add('hidden');
    gameContent.classList.remove('hidden');
    gameContent.classList.add('reveal');

    // load the Flappy iframe into the game area (only once)
    (function loadFlappy() {
      try {
        const existing = document.getElementById('flappy-iframe');
        if (existing) return;

        const playerName = email.split('@')[0] || 'Player';
        const container = document.getElementById('game-content');

        // create a wrapper for the iframe if needed
        let frameHolder = document.getElementById('flappy-holder');
        if (!frameHolder) {
          frameHolder = document.createElement('div');
          frameHolder.id = 'flappy-holder';
          frameHolder.style.width = '100%';
          frameHolder.style.maxWidth = '840px';
          frameHolder.style.margin = '12px auto';
          container.insertBefore(frameHolder, container.firstChild);
        }

        // If the visitor is on a mobile-sized viewport, show a polite notice
        // asking them to play on a laptop instead of embedding the iframe.
        const isMobile = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
        if (isMobile) {
          const note = document.createElement('div');
          note.id = 'flappy-mobile-note';
          note.style.background = 'rgba(0,0,0,0.6)';
          note.style.color = '#fff';
          note.style.padding = '18px';
          note.style.borderRadius = '10px';
          note.style.textAlign = 'center';
          note.style.fontWeight = '700';
          note.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
          note.innerHTML = '<div style="font-size:16px;margin-bottom:8px">Please play this game on a laptop for the best experience.</div>' +
                           '<div style="font-size:13px;opacity:0.9;margin-bottom:12px">The game requires keyboard controls and a wider viewport.</div>' 
                           ;

          // replace any existing note
          const existingNote = document.getElementById('flappy-mobile-note');
          if (existingNote) existingNote.remove();
          frameHolder.appendChild(note);
          return;
        }

        const iframe = document.createElement('iframe');
        iframe.id = 'flappy-iframe';
        iframe.src = `assets/games/flappy.html?player=${encodeURIComponent(playerName)}`;
        iframe.width = '100%';
        iframe.height = '640';
        iframe.style.border = '0';
        iframe.style.borderRadius = '10px';
        iframe.setAttribute('allow', 'autoplay');

        frameHolder.appendChild(iframe);

        // Listen for score messages from the iframe
        window.addEventListener('message', async function scoreListener(ev) {
          let data = ev.data;
          if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (err) { return; }
          }
          if (!data || !data.type) return;

          if (data.type === 'GAMESNACKS_SCORE_MESSAGE' || data.type === 'FLAPPY_SCORE') {
            const rawScore = data.score || data.value || 0;
            const score = Number(rawScore) || 0;
            const name = (data.scoreMetadata && data.scoreMetadata.name) || (new URLSearchParams(iframe.src.split('?')[1]).get('player')) || playerName;
            console.log('Received game score from iframe:', { email: name, score, raw: data });

            // Only POST if this score is strictly greater than the previous best we have stored locally
            const safeKey = 'flappy_best_' + encodeURIComponent(String(name).toLowerCase());
            let prevBest = 0;
            try { prevBest = Number(localStorage.getItem(safeKey)) || 0; } catch (e) { prevBest = 0; }

            if (score > prevBest) {
              // Update local best immediately
              try { localStorage.setItem(safeKey, String(score)); } catch (e) { /* ignore */ }

              // Try posting score to a leaderboard endpoint (best-effort)
              try {
                await fetch('https://graceful-bonbon-a81f3c.netlify.app/.netlify/functions/leaderboard', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: name, score })
                });
              } catch (err) {
                // If POST fails, just log — leaderboard GET may still show changes if server-side sync exists
                console.warn('Score POST failed (this is non-fatal):', err);
              }

              // If the page provides a refresh function, call it
              if (typeof fetchLeaderboardData === 'function') {
                try { fetchLeaderboardData(); } catch (e) { /* ignore */ }
              }
            } else {
              console.log('Score not higher than previous best — not posting.', { score, prevBest });
            }
          }
        });

      } catch (err) {
        console.error('Failed to load Flappy iframe', err);
      }
    })();

    // show inline success and focus Play button if exists
    if (success) {
      success.style.display = 'inline-block';
    }
    setTimeout(() => {
      const playBtn = document.querySelector('#game-content .play-button');
      if (playBtn) playBtn.focus();
    }, 420);
  });

  // Listen for GAME_EVENT messages from the game iframe and toggle a global
  // `performance-mode` class. This disables backdrop-filter/animations and
  // attempts to pause/resume GSAP/ScrollTrigger so gameplay feels smoother.
  window.addEventListener('message', function gameEventHandler(ev){
    let data = ev.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch(e) { /* ignore non-JSON messages */ }
    }
    if (!data || data.type !== 'GAME_EVENT') return;
    const evt = data.event;
    const root = document.documentElement || document.body;
    if (evt === 'start'){
      // add class to reduce animations / filters
      root.classList.add('performance-mode');
      try {
        if (window.gsap && gsap.globalTimeline) gsap.globalTimeline.pause();
      } catch(e){}
      try {
        if (window.ScrollTrigger && ScrollTrigger.getAll) ScrollTrigger.getAll().forEach(s=>s.disable());
      } catch(e){}
    } else if (evt === 'pause' || evt === 'end'){
      // restore effects
      root.classList.remove('performance-mode');
      try {
        if (window.gsap && gsap.globalTimeline) gsap.globalTimeline.resume();
      } catch(e){}
      try {
        if (window.ScrollTrigger && ScrollTrigger.getAll) ScrollTrigger.getAll().forEach(s=>s.enable());
      } catch(e){}
    }
  });
});
