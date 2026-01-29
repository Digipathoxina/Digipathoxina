// ============================
// START GATE (solo donnina visibile finché non clicchi)
// ============================
let audioEnabled = false;
let firstRevealDone = false;

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("preclick");
});

// ============================
// AUDIO PATH
// ============================
const SOUND_DIR = "suono/";

// helper audio
function makeAudio(src) {
  const a = new Audio(SOUND_DIR + src);
  a.preload = "auto";
  a.volume = 1;
  return a;
}

// ============================
// AUDIO REGISTRY (per ducking evento speciale)
// - includi qui SOLO gli Audio “persistenti” che riutilizziamo
// - gli audio one-shot (es. orgasmo) restano fuori e possono sovrapporsi
// ============================
const audioRegistry = [];
function reg(a) { audioRegistry.push(a); return a; }

// ============================
// PLAY HELPERS
// ============================
function playSound(aud, restart = true) {
  if (!audioEnabled) return;
  try {
    if (restart) aud.currentTime = 0;
    aud.play();
  } catch (_) {}
}

// Play "locked": se sta già suonando, NON riparte
function playSoundLocked(aud) {
  if (!audioEnabled) return false;
  try {
    if (!aud.paused && !aud.ended) return false;
    aud.currentTime = 0;
    aud.play();
    return true;
  } catch (_) {
    return false;
  }
}

// ============================
// DONNINA
// - all'apertura: è l'unica visibile (via body.preclick)
// - 1° click: reveal + abilita suoni
// - click successivi: vai a abo-index.html
// ============================
const donnina = document.getElementById("donnina");
if (donnina) {
  donnina.addEventListener("click", () => {
    if (!firstRevealDone) {
      document.body.classList.remove("preclick");
      audioEnabled = true;
      firstRevealDone = true;
      return;
    }
    window.location.href = "abo-index.html";
  });
}

// (resto invariato) ABO container esiste ma non viene più usato qui
const aboContainer = document.getElementById("abo-container");

// ============================
// DRAG GENERICO
// ============================
function makeDraggable(el) {
  let offsetX = 0, offsetY = 0;
  let dragging = false;

  el.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    el.style.cursor = "grabbing";
    const r = el.getBoundingClientRect();
    offsetX = e.clientX - r.left;
    offsetY = e.clientY - r.top;
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    el.style.left = (e.clientX - offsetX) + "px";
    el.style.top  = (e.clientY - offsetY) + "px";
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    dragging = false;
    el.style.cursor = "grab";
  });
}

// ============================
// EVENTO SPECIALE
// ============================

// ducking con reference-count (così non “litigano” tra eventi simultanei)
let specialActiveCount = 0;
const prevVolumes = new Map();

function duckAllSounds() {
  if (specialActiveCount === 0) {
    audioRegistry.forEach((a, i) => {
      try { prevVolumes.set(i, a.volume); } catch (_) {}
    });
    audioRegistry.forEach(a => { try { a.volume = 0.2; } catch (_) {} });
  }
  specialActiveCount += 1;
}

function unduckAllSounds() {
  specialActiveCount = Math.max(0, specialActiveCount - 1);
  if (specialActiveCount === 0) {
    audioRegistry.forEach((a, i) => {
      try {
        const v = prevVolumes.get(i);
        if (typeof v === "number") a.volume = v;
      } catch (_) {}
    });
  }
}

async function triggerEvent() {
  duckAllSounds();

  // audio orgasmo: istanza nuova per allow overlap
  const orgasmo = new Audio(SOUND_DIR + "orgasmo.mp3");
  orgasmo.preload = "auto";
  orgasmo.volume = 1;

  const orgasmoDone = new Promise((res) => {
    if (!audioEnabled) return res();
    try {
      const onEnded = () => {
        orgasmo.removeEventListener("ended", onEnded);
        res();
      };
      orgasmo.addEventListener("ended", onEnded);
      orgasmo.currentTime = 0;
      orgasmo.play().catch(() => res());
      if (orgasmo.paused) res();
    } catch (_) {
      res();
    }
  });

  const totalMs = spawnFountainBurst();
  const fountainDone = new Promise(res => setTimeout(res, totalMs + 1000));

  await Promise.all([fountainDone, orgasmoDone]);
  unduckAllSounds();
  return totalMs;
}

// ============================
// AUDIO MAP (come richiesto)
// ============================

// SLIDER VERTICALI (1..4): 3 audio ciascuno
const V_SLIDER_AUDIOS = {
  "slider-1": [reg(makeAudio("slider-1-1.mp3")), reg(makeAudio("slider-1-2.mp3")), reg(makeAudio("slider-1-3.mp3"))],
  "slider-2": [reg(makeAudio("slider-2-1.mp3")), reg(makeAudio("slider-2-2.mp3")), reg(makeAudio("slider-2-3.mp3"))],
  "slider-3": [reg(makeAudio("slider-3-1.mp3")), reg(makeAudio("slider-3-2.mp3")), reg(makeAudio("slider-3-3.mp3"))],
  "slider-4": [reg(makeAudio("slider-4-1.mp3")), reg(makeAudio("slider-4-2.mp3")), reg(makeAudio("slider-4-3.mp3"))]
};

// SLIDER ORIZZONTALI (5..6) => x-1, x-2: 3 audio ciascuno
const H_SLIDER_AUDIOS = {
  "slider-5": [reg(makeAudio("slider-x-1-1.mp3")), reg(makeAudio("slider-x-1-2.mp3")), reg(makeAudio("slider-x-1-3.mp3"))],
  "slider-6": [reg(makeAudio("slider-x-2-1.mp3")), reg(makeAudio("slider-x-2-2.mp3")), reg(makeAudio("slider-x-2-3.mp3"))]
};

// bottoni slider verticali (alto/basso 1..4)
const V_TOP_BTNS = [
  reg(makeAudio("alto-1.mp3")),
  reg(makeAudio("alto-2.mp3")),
  reg(makeAudio("alto-3.mp3")),
  reg(makeAudio("alto-4.mp3"))
];
const V_BOTTOM_BTNS = [
  reg(makeAudio("basso-1.mp3")),
  reg(makeAudio("basso-2.mp3")),
  reg(makeAudio("basso-3.mp3")),
  reg(makeAudio("basso-4.mp3"))
];

// bottoni slider orizzontali: destra=alto-x, sinistra=basso-x (x-1..2)
const H_RIGHT_BTNS = [
  reg(makeAudio("alto-x-1.mp3")),
  reg(makeAudio("alto-x-2.mp3"))
];
const H_LEFT_BTNS = [
  reg(makeAudio("basso-x-1.mp3")),
  reg(makeAudio("basso-x-2.mp3"))
];

// CERCHI: 3 audio ciascuno
const CIRCLE_AUDIOS = {
  "cerchio-1": [reg(makeAudio("cerchio-s-1.mp3")), reg(makeAudio("cerchio-s-2.mp3")), reg(makeAudio("cerchio-s-3.mp3"))],
  "cerchio-2": [reg(makeAudio("cerchio-d-1.mp3")), reg(makeAudio("cerchio-d-2.mp3")), reg(makeAudio("cerchio-d-3.mp3"))]
};
// bottoni cerchi (2)
const CIRCLE_BTNS = [
  reg(makeAudio("bottone-1.mp3")),
  reg(makeAudio("bottone-2.mp3"))
];

// ============================
// STATE: memoria ciclo per elemento
// stepIndex = prossimo audio da riprodurre (0..2)
// ============================
const elementCycleState = new Map();
function getStep(id) {
  if (!elementCycleState.has(id)) elementCycleState.set(id, 0);
  return elementCycleState.get(id);
}
function advanceStep(id) {
  const next = (getStep(id) + 1) % 3;
  elementCycleState.set(id, next);
}

function isAnyAudioPlaying(audios) {
  return audios.some(a => !a.paused && !a.ended);
}

// ============================
// SEQUENZA AUDIO (sliders: con auto-advance se "continui a muovere")
// ============================
const SLIDER_MOVE_PAUSE_MS = 250; // pausa significativa

function startSequencedAudio(id, audios, shouldAutoContinue) {
  const step = getStep(id);
  const aud = audios[step];

  // Non far partire se QUALSIASI audio di questo elemento è già in corso
  if (isAnyAudioPlaying(audios)) return false;

  const started = playSoundLocked(aud);
  if (!started) return false;

  if (step === 2) triggerEvent();

  const onEnded = () => {
    aud.removeEventListener("ended", onEnded);
    advanceStep(id);

    if (typeof shouldAutoContinue === "function" && shouldAutoContinue()) {
      startSequencedAudio(id, audios, shouldAutoContinue);
    }
  };

  aud.addEventListener("ended", onEnded);
  return true;
}

// ============================
// CERCHI ROTANTI (meccanica precedente invariata)
// ============================
document.querySelectorAll(".cerchio").forEach((circleEl) => {
  const id = circleEl.id;
  const audios = CIRCLE_AUDIOS[id];
  if (!audios) return;

  let rotating = false;
  let lastAngle = 0;
  let accumAbsDeg = 0;
  let armed = true;

  function angleFromMouse(e) {
    const rect = circleEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
  }

  circleEl.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    rotating = true;
    accumAbsDeg = 0;
    armed = true;
    lastAngle = angleFromMouse(e);
    circleEl.style.cursor = "grabbing";
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!rotating) return;

    const deg = angleFromMouse(e);
    circleEl.style.transform = `rotate(${deg}deg)`;

    let delta = deg - lastAngle;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;

    accumAbsDeg += Math.abs(delta);
    lastAngle = deg;

    if (!armed) return;

    if (accumAbsDeg >= 360) {
      accumAbsDeg = 0;

      const step = getStep(id);
      const aud = audios[step];

      const started = playSoundLocked(aud);
      if (!started) return;

      if (step === 2) triggerEvent();

      const onEnded = () => {
        aud.removeEventListener("ended", onEnded);
        advanceStep(id);
        armed = true;
      };
      aud.addEventListener("ended", onEnded);

      armed = false;
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    if (!rotating) return;
    rotating = false;
    circleEl.style.cursor = "grab";
  });
});

// Bottoni sopra cerchi
document.querySelectorAll(".cerchio-btn").forEach((btn, idx) => {
  btn.addEventListener("click", () => playSound(CIRCLE_BTNS[idx % CIRCLE_BTNS.length], true));
});

// ============================
// SLIDER (nuova logica continuità)
// ============================
document.querySelectorAll(".slider").forEach((sliderEl) => {
  const id = sliderEl.id;
  const isHorizontal = sliderEl.classList.contains("horizontal");

  const audios = (V_SLIDER_AUDIOS[id] || H_SLIDER_AUDIOS[id]);
  if (!audios) return;

  const asta = document.createElement("img");
  asta.src = "tasti/asta.png";
  asta.className = "asta";

  const cursore = document.createElement("img");
  cursore.src = "tasti/cursore.png";
  cursore.className = "cursore";

  sliderEl.appendChild(asta);
  sliderEl.appendChild(cursore);

  const topBtn = document.createElement("img");
  topBtn.src = "tasti/alto.png";
  topBtn.className = "btn-top";

  const bottomBtn = document.createElement("img");
  bottomBtn.src = "tasti/basso.png";
  bottomBtn.className = "btn-bottom";

  if (!isHorizontal) {
    const idx = Math.max(0, Math.min(3, parseInt(id.split("-")[1], 10) - 1));
    topBtn.addEventListener("click", () => playSound(V_TOP_BTNS[idx], true));
    bottomBtn.addEventListener("click", () => playSound(V_BOTTOM_BTNS[idx], true));
  } else {
    const idx = (id === "slider-6") ? 1 : 0;
    topBtn.addEventListener("click", () => playSound(H_RIGHT_BTNS[idx], true));
    bottomBtn.addEventListener("click", () => playSound(H_LEFT_BTNS[idx], true));
  }

  sliderEl.appendChild(topBtn);
  sliderEl.appendChild(bottomBtn);

  let dragging = false;
  let startMouse = 0;
  let startTop = 0;

  let lastMoveAt = 0;

  function isContinuingInteraction() {
    return dragging && (Date.now() - lastMoveAt) < SLIDER_MOVE_PAUSE_MS;
  }
  function tryStartSliderSequence() {
    startSequencedAudio(id, audios, isContinuingInteraction);
  }

  function cursorSizeFallback() {
    const h = cursore.offsetHeight;
    return (h && h > 0) ? h : 40;
  }

  function clampTop(top) {
    const trackH = sliderEl.offsetHeight || 300;
    const knobH = cursorSizeFallback();
    const max = Math.max(0, trackH - knobH);
    return Math.max(0, Math.min(max, top));
  }

  function setInitialCursorPosition() {
    const trackH = sliderEl.offsetHeight || 300;
    const knobH = cursorSizeFallback();
    const max = Math.max(0, trackH - knobH);
    cursore.style.top = max + "px";
  }

  requestAnimationFrame(() => {
    setInitialCursorPosition();
  });

  cursore.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;

    dragging = true;
    lastMoveAt = 0;

    startMouse = isHorizontal ? e.clientX : e.clientY;
    startTop = parseFloat(cursore.style.top || "0") || 0;

    cursore.style.cursor = "grabbing";
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const nowMouse = isHorizontal ? e.clientX : e.clientY;
    const rawDelta = nowMouse - startMouse;
    const delta = isHorizontal ? -rawDelta : rawDelta;

    const newTop = clampTop(startTop + delta);
    cursore.style.top = newTop + "px";

    // movimento recente (definisce continuità)
    if (Math.abs(delta) >= 2) {
      const wasPaused = (Date.now() - lastMoveAt) >= SLIDER_MOVE_PAUSE_MS;
      lastMoveAt = Date.now();

      // Se nessun audio di questo slider sta suonando, parte lo step corrente
      // (se eri in pausa, è una "ripresa": lo step è già quello successivo perché avanza solo a fine audio)
      if (!isAnyAudioPlaying(audios)) {
        if (wasPaused) {
          tryStartSliderSequence();
        } else {
          // prima attivazione durante drag
          tryStartSliderSequence();
        }
      }
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    if (!dragging) return;

    dragging = false;
    cursore.style.cursor = "grab";
  });
});

// ============================
// NAV
// ============================
const navBtn = document.getElementById("nav-btn");
if (navBtn) {
  navBtn.addEventListener("click", () => {
    window.location.href = "../a-01/a-pill.html";
  });
}

// ============================
// FONTANA LINK (getto/spruzzo)
// ============================
const SPECIAL_LINKS = [
  "https://www.youtube.com/watch?v=8IiOzOFrbC4",
  "https://www.youtube.com/watch?v=8WtdlqzZdAw",
  "https://www.tiktok.com/@cherish.care.pet/video/7346441256693665032",
  "https://www.tiktok.com/@curious.baby.amy/video/7327465094542118190",
  "https://www.tiktok.com/@curious.baby.amy/video/7342286367247895851"
];

function spawnFountainBurst() {
  const fountain = document.getElementById("fountain");
  if (!fountain) return 0;

  const burst = document.createElement("div");
  burst.className = "fountain-burst";
  fountain.appendChild(burst);

  const baseX = window.innerWidth / 2;
  const baseY = window.innerHeight - 40;

  const LINKS = 30;
  const STAGGER = 45;
  const DURATION = 5200;

  const PEAK = window.innerHeight * 0.78;
  const SPREAD = 320;

  const totalMs = (LINKS - 1) * STAGGER + DURATION;

  const dirs = Array.from({ length: LINKS }, (_, i) => (i < LINKS / 2 ? -1 : 1));
  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const smooth01 = (t) => t * t * (3 - 2 * t);

  for (let i = 0; i < LINKS; i++) {
    const dir = dirs[i];

    setTimeout(() => {
      const a = document.createElement("a");
      a.textContent = `link-${i + 1}`;
      a.href = SPECIAL_LINKS[i % SPECIAL_LINKS.length];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.pointerEvents = "auto";
      a.style.zIndex = "9999";
      burst.appendChild(a);

      const startX = baseX + (Math.random() * 40 - 20);
      const startY = baseY + (Math.random() * 18 - 9);
      const y0 = startY + 25;

      const sideAmp = (SPREAD * (0.65 + Math.random() * 0.55)) * dir;
      const xEnd = startX + sideAmp;
      const yEnd = startY + 120;

      const born = performance.now();
      const targetRot = -80 * dir;

      const tick = (now) => {
        const t = (now - born) / DURATION;
        if (t >= 1) { a.remove(); return; }

        const u = easeOutCubic(t);

        const yPar = y0 - (PEAK * (4 * u * (1 - u)));
        const y = yPar + (yEnd - y0) * (u * u);

        const x = startX + (xEnd - startX) * (u * u);

        let rot = 90;
        if (u > 0.48) {
          const p = smooth01((u - 0.48) / 0.52);
          rot = 90 + (targetRot - 90) * p;
        }

        const fadeIn = Math.min(1, t / 0.10);
        const fadeOut = 1 - Math.max(0, (t - 0.55) / 0.45);
        const op = Math.max(0, Math.min(1, fadeIn * fadeOut));

        a.style.left = x + "px";
        a.style.top = y + "px";
        a.style.opacity = String(op);
        a.style.transform = `rotate(${rot}deg)`;

        requestAnimationFrame(tick);
      };

      a.style.left = startX + "px";
      a.style.top = y0 + "px";
      a.style.opacity = "0";
      a.style.transform = "rotate(90deg)";

      requestAnimationFrame(tick);
    }, i * STAGGER);
  }

  setTimeout(() => {
    try { burst.remove(); } catch (_) {}
  }, totalMs + 1500);

  return totalMs;
}
