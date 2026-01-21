// dd-script.js
const viewer = document.querySelector('#viewer');
const loader = document.querySelector('#loader');
const loadingBtn = document.querySelector('#loadingBtn');
const loadingSub = document.querySelector('#loadingSub');
const exitBtn = document.querySelector('#exitBtn');

const audio = document.querySelector('#bgAudio');

/* ====== AUTOROTATE: lento + irregolare ====== */
const IDLE_BEFORE_RESUME_MS = 1400;
const SPEED_MIN_DEG = 0;
const SPEED_MAX_DEG = 1;

let idleTimer = null;
let jitterTimer = null;

function setRotationSpeedRandom() {
  const speed = SPEED_MIN_DEG + Math.random() * (SPEED_MAX_DEG - SPEED_MIN_DEG);
  viewer.setAttribute('rotation-per-second', speed.toFixed(2) + 'deg');
}

function startJitter() {
  stopJitter();
  const loop = () => {
    if (!viewer.autoRotate) return;
    setRotationSpeedRandom();
    const next = 700 + Math.random() * 1100;
    jitterTimer = setTimeout(loop, next);
  };
  loop();
}

function stopJitter() {
  if (jitterTimer) clearTimeout(jitterTimer);
  jitterTimer = null;
}

function pauseAutoRotateAndScheduleResume() {
  if (!userActivated) return;

  viewer.autoRotate = false;
  stopJitter();

  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    viewer.autoRotate = true;
    startJitter();
  }, IDLE_BEFORE_RESUME_MS);
}

/* ====== ANIMATION "PLAY ALL" DEFAULT (mixer) ====== */
const appended = new Map();

function appendAllAnimationsOnce() {
  const anims = viewer.availableAnimations || [];
  if (!anims.length) return;

  if (typeof viewer.appendAnimation === 'function') {
    for (const name of anims) {
      if (appended.has(name)) continue;
      try {
        const handle = viewer.appendAnimation(name, { weight: 1 });
        appended.set(name, handle ?? null);
      } catch (e) {
        appended.set(name, null);
      }
    }
    try { viewer.play(); } catch (e) {}
    return;
  }

  // fallback
  try {
    viewer.animationName = anims[0];
    viewer.play();
  } catch (e) {}
}

/* ====== LOADER TEXT: "Loading" per-letter blur -> focus col progress ====== */
let lastP = 0;
let modelLoaded = false;

function clamp01(x) { return Math.max(0, Math.min(1, x)); }

let loadingChars = []; // array di <span> per ogni lettera

function setupLoadingLetters() {
  if (!loadingBtn) return;

  // testo originale del bottone (es. "Loading")
  const text = loadingBtn.textContent ?? 'Loading';

  // pulisci contenuto
  loadingBtn.textContent = '';

  loadingChars = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    // mantieni eventuali spazi
    if (ch === ' ') {
      const spacer = document.createElement('span');
      spacer.className = 'char space';
      spacer.innerHTML = '&nbsp;';
      spacer.style.setProperty('--lp', '0');
      loadingBtn.appendChild(spacer);
      loadingChars.push(spacer);
      continue;
    }

    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;

    // progress lettera (0..1)
    span.style.setProperty('--lp', '0');

    loadingBtn.appendChild(span);
    loadingChars.push(span);
  }
}

function updateLettersByProgress(p) {
  if (!loadingChars.length) return;

  const n = loadingChars.length;
  const seg = 1 / Math.max(1, n);

  for (let i = 0; i < n; i++) {
    const start = i * seg;
    const end = (i + 1) * seg;

    // progress locale della lettera in base al progress globale
    const local = clamp01((p - start) / (end - start));

    // scrivi sullo span (CSS: blur dipende da --lp)
    loadingChars[i].style.setProperty('--lp', String(local));
  }
}

function updateLoaderByProgress(p) {
  if (!loader || !loadingBtn) return;

  // monotono: mai indietro
  p = Math.max(lastP, clamp01(p));
  lastP = p;

  // aggiorna blur lettera-per-lettera
  updateLettersByProgress(p);

  // quando completo: abilita click
  if (p >= 1 && !modelLoaded) {
    modelLoaded = true;

    loader.classList.add('is-loaded');
    loadingBtn.classList.add('is-ready');
    loadingBtn.disabled = false;
    loadingBtn.setAttribute('aria-label', 'Start binaural sound');

    // sicurezza: tutte nitide
    updateLettersByProgress(1);
  }
}

/* ====== AUDIO + START EXPERIENCE (audio + autorotate) ====== */
let audioStarted = false;
let userActivated = false;

function startAutoRotateNow() {
  viewer.autoRotate = true;
  setRotationSpeedRandom();
  startJitter();
}

function activateExperience() {
  if (!userActivated) {
    userActivated = true;
    startAutoRotateNow();
  }
}

async function startAudioFromClick() {
  activateExperience();

  if (audioStarted) return true;

  try {
    await audio.play();
    audioStarted = true;

    // mostra il pulsante exit in basso a destra
    exitBtn.classList.add('is-visible');

    return true;
  } catch (e) {
    return false;
  }
}

if (loadingBtn) loadingBtn.addEventListener('click', async () => {
  if (!modelLoaded) return; // cliccabile solo dopo load completo
  const ok = await startAudioFromClick();
  if (ok) {
    loader.classList.add('is-started');
    setTimeout(() => loader.remove(), 520);
  }
});

function onUserInteractsWithModel() {
  activateExperience();
  pauseAutoRotateAndScheduleResume();
}
viewer.addEventListener('pointerdown', onUserInteractsWithModel);
viewer.addEventListener('camera-change', onUserInteractsWithModel);

window.addEventListener('DOMContentLoaded', () => {
  setupLoadingLetters();
  lastP = 0;
  updateLettersByProgress(0);
});

viewer.addEventListener('progress', (e) => {
  const p = Math.max(0, Math.min(1, e.detail.totalProgress || 0));
  updateLoaderByProgress(p);
});

viewer.addEventListener('load', () => {
  appendAllAnimationsOnce();
  viewer.autoRotate = false;
  updateLoaderByProgress(1);
});
