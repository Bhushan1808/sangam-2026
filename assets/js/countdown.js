let countdownTicRef = null;

// Set the deadline date to 9 January 2026
const deadlineDate = new Date("2026-01-10T11:00:00").toISOString();
function getTimeRemaining(date) {
  const time = Date.parse(date) - new Date().getTime(),
    days = Math.floor(time / 1000 / 60 / 60 / 24),
    hours = Math.floor((time / 1000 / 60 / 60) % 24),
    minutes = Math.floor((time / 1000 / 60) % 60),
    seconds = Math.floor((time / 1000) % 60);

  return {
    time,
    days,
    hours,
    minutes,
    seconds,
  };
}

function getZero(num) {
  return num >= 0 && num < 10 ? "0" + num : num + "";
}

function updateTimer() {
  const time = getTimeRemaining(deadlineDate);

  if (time.time <= 0) {
    clearInterval(countdownTicRef);
    document.getElementById("countdown").style.display = "none";
    handleResize();
    window.addEventListener("resize", handleResize);
    return;
  }

  // Animate changes with a simple flip effect
  updateDigitWithFlip('days', getZero(time.days));
  updateDigitWithFlip('hours', getZero(time.hours));
  updateDigitWithFlip('minutes', getZero(time.minutes));
  updateDigitWithFlip('seconds', getZero(time.seconds));
}

// Keep previous values to detect change
const _prev = { days: null, hours: null, minutes: null, seconds: null };

function updateDigitWithFlip(id, newValue) {
  const el = document.getElementById(id);
  if (!el) return;
  const parent = el.parentElement; // .countdown__number
  if (!_prev[id] || _prev[id] !== newValue) {
    // create a "new" element for the incoming digit
    const incoming = document.createElement('div');
    incoming.className = 'new';
    incoming.textContent = newValue;
    // for accessibility set aria-live on parent
    parent.setAttribute('aria-live', 'polite');

    // start flip: add flip class to parent which animates current down
    parent.classList.add('flip');
    parent.appendChild(incoming);

    // force reflow then show incoming
    // eslint-disable-next-line no-unused-expressions
    incoming.offsetHeight;
    incoming.classList.add('show');

    // after animation, remove old text and incoming's wrapper
    setTimeout(() => {
      // replace the inner (there may be multiple divs, keep only one)
      el.textContent = newValue;
      // clean up temporary incoming node(s)
      const tmp = parent.querySelectorAll('.new');
      tmp.forEach(n => n.remove());
      parent.classList.remove('flip');
    }, 520);

    _prev[id] = newValue;
  }

}

function handleResize() {
  const countdownElement = document.getElementById("hero");
  if (window.matchMedia("(max-width: 768px)").matches) {
    countdownElement.style.minHeight = "60vh";
  } else {
    countdownElement.style.minHeight = "100vh";
  }
}

function startCountdown() {
  countdownTicRef = setInterval(updateTimer, 1000);
}

startCountdown();
