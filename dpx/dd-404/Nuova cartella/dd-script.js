// dd-script.js
const viewer = document.querySelector('#viewer');
const loader = document.querySelector('#loader');
const hint = document.querySelector('#hint');
const subhint = document.querySelector('#subhint');

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

/* ====== LOADER TEXT: lettere sparse -> compongono col progress ====== */
const LOADER_TEXT = "Loading";
const SUB_TEXT = "Headphones recommended";
let chars = [];
let lastP = 0;
let loaderDone = false;

function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function buildLoaderText() {
  hint.innerHTML = "";
  if (subhint) subhint.textContent = SUB_TEXT;

  const arr = [...LOADER_TEXT]; // preserva spazi
  chars = arr.map((ch) => {
    const span = document.createElement('span');
    span.className = 'hchar';
    span.textContent = ch;

    const rx = (Math.random() * 2 - 1) * 110; // px (scatter X)
    const ry = (Math.random() * 2 - 1) * 80;  // px (scatter Y)
    const amp = 6 + Math.random() * 14;

    const delay = Math.floor(Math.random() * 900);
    const dur = 2400 + Math.floor(Math.random() * 2200);

    span.style.setProperty('--rx', rx.toFixed(1) + 'px');
    span.style.setProperty('--ry', ry.toFixed(1) + 'px');
    span.style.setProperty('--amp', amp.toFixed(1) + 'px');
    span.style.setProperty('--d', delay + 'ms');
    span.style.setProperty('--dur', dur + 'ms');

    span.style.setProperty('--mix', '0');
    span.style.opacity = '0';

    hint.appendChild(span);
    return span;
  });

  hint.style.setProperty('--p', '0');
}

function updateLoaderByProgress(p) {
  if (!chars.length || loaderDone) return;

  p = Math.max(lastP, clamp01(p));
  lastP = p;

  hint.style.setProperty('--p', String(p));

  const n = chars.length;

  for (let i = 0; i < n; i++) {
    const t0 = i / Math.max(1, n - 1);
    const w = 0.16;
    const local = smoothstep(t0 - w, t0 + w, p);

    const el = chars[i];
    el.style.setProperty('--mix', local.toFixed(3));
    el.style.opacity = local.toFixed(3);

    if (local > 0.92) el.classList.add('is-locked');
  }

  if (p >= 1 && !loaderDone) {
    loaderDone = true;

    for (const el of chars) {
      el.style.setProperty('--mix', '1');
      el.style.opacity = '1';
      el.classList.add('is-locked');
    }

    setTimeout(() => {
      // il modello è pronto: lo sfondo del loader diventa trasparente,
      // e rimane solo la scritta "Loading" cliccabile.
      loader.classList.add('is-ready');
      if (subhint) subhint.classList.add('is-hidden');
    }, 250);
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

async function startExperienceFromGesture() {
  if (!loaderDone) return false;
  if (!userActivated) {
    userActivated = true;
    startAutoRotateNow();
  }

  if (audioStarted) return true;

  try {
    await audio.play();
    audioStarted = true;

    // Nascondi il loader solo dopo il gesto utente che avvia l'audio
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 520);


    // mostra il pulsante exit in basso a destra
    exitBtn.classList.add('is-visible');

    return true;
  } catch (e) {
    return false;
  }
}


function onUserInteractsWithModel() {
  pauseAutoRotateAndScheduleResume();
}
viewer.addEventListener('pointerdown', onUserInteractsWithModel);
viewer.addEventListener('camera-change', onUserInteractsWithModel);

// Avvia l'audio solo quando l'utente clicca su "Loading"
hint.addEventListener('click', startExperienceFromGesture);

window.addEventListener('DOMContentLoaded', () => {
  buildLoaderText();
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
