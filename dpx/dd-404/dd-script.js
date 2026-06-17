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

/* ====== SOTTOTITOLO: alternanza con dissolvenza ====== */
const SUBTITLE_TEXTS = ['Headphones recommended', 'Click to enter'];
const SUBTITLE_VISIBLE_MS = 5000;
const SUBTITLE_FADE_MS = 900;
const SUBTITLE_HIDDEN_GAP_MS = 140;

let subtitleIndex = 0;
let subtitleTimer = null;

function fadeLoadingSubTo(text, onComplete) {
  if (!loadingSub || loadingSub.textContent === text) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // 1) la scritta vecchia esce completamente: opacity 0 + blur
  loadingSub.classList.add('is-changing');

  window.setTimeout(() => {
    if (!loadingSub) return;

    // 2) quando è invisibile, cambio testo
    loadingSub.textContent = text;

    // 3) resta invisibile per un istante, così il browser registra davvero lo stato di uscita
    window.setTimeout(() => {
      if (!loadingSub) return;

      // forza il reflow: rende affidabile il fade-in anche su mobile
      void loadingSub.offsetWidth;

      // 4) la nuova scritta entra: opacity piena + blur che torna a 0
      loadingSub.classList.remove('is-changing');

      if (typeof onComplete === 'function') {
        window.setTimeout(onComplete, SUBTITLE_FADE_MS);
      }
    }, SUBTITLE_HIDDEN_GAP_MS);
  }, SUBTITLE_FADE_MS);
}

function scheduleNextLoadingSubtitleSwitch() {
  subtitleTimer = window.setTimeout(() => {
    subtitleIndex = (subtitleIndex + 1) % SUBTITLE_TEXTS.length;

    fadeLoadingSubTo(SUBTITLE_TEXTS[subtitleIndex], () => {
      // dopo l'entrata completa, la scritta rimane visibile prima del prossimo cambio
      scheduleNextLoadingSubtitleSwitch();
    });
  }, SUBTITLE_VISIBLE_MS);
}

function startLoadingSubtitleLoop() {
  if (!loadingSub) return;

  stopLoadingSubtitleLoop();
  loadingSub.textContent = SUBTITLE_TEXTS[0];
  loadingSub.classList.remove('is-changing');
  subtitleIndex = 0;

  scheduleNextLoadingSubtitleSwitch();
}

function stopLoadingSubtitleLoop() {
  if (subtitleTimer) window.clearTimeout(subtitleTimer);
  subtitleTimer = null;
}

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
    loadingBtn.setAttribute('aria-label', 'Click to enter');

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
    appendAllAnimationsOnce();
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
    stopLoadingSubtitleLoop();
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
  startLoadingSubtitleLoop();
  lastP = 0;
  updateLettersByProgress(0);
});

viewer.addEventListener('progress', (e) => {
  const p = Math.max(0, Math.min(1, e.detail.totalProgress || 0));
  updateLoaderByProgress(p);
});

viewer.addEventListener('load', () => {
  viewer.autoRotate = false;
  updateLoaderByProgress(1);
});
