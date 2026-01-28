// ============================
// AUTOPLAY SAFE (audio gated)
// ============================
let audioEnabled = false;
document.addEventListener("click", () => { audioEnabled = true; }, { once: true });

// ============================
// AUDIO POOL + GLOBAL INTERRUPT/RESUME MANAGER
// - se parte un nuovo elemento sonoro, interrompe quello corrente
// - se riattivi lo stesso elemento, riprende dal punto salvato
// ============================
function makeAudio(src) {
  const a = new Audio(src);
  a.preload = "auto";
  a.volume = 1;
  return a;
}

// pool per riusare la stessa istanza Audio per ciascun file
const AUDIO_POOL = new Map();
function getAudio(src) {
  if (!AUDIO_POOL.has(src)) AUDIO_POOL.set(src, makeAudio(src));
  return AUDIO_POOL.get(src);
}

const audioState = {
  currentControlId: null,      // id logico dell'elemento che sta suonando
  currentAudio: null,          // istanza Audio in play
  savedTimeByControl: new Map()// controlId -> seconds
};

function interruptCurrentAudio(exceptControlId = null) {
  const { currentControlId, currentAudio } = audioState;
  if (!currentAudio || !currentControlId) return;

  if (exceptControlId && currentControlId === exceptControlId) return;

  try {
    audioState.savedTimeByControl.set(currentControlId, currentAudio.currentTime || 0);
    currentAudio.pause();
  } catch (_) {}
}

function playControlAudio(controlId, src) {
  if (!audioEnabled) return false;

  // se sta già suonando questo controllo, non riparte
  if (audioState.currentControlId === controlId && audioState.currentAudio && !audioState.currentAudio.paused) {
    return false;
  }

  // interrompi qualunque altro suono attivo
  interruptCurrentAudio(controlId);

  const aud = getAudio(src);
  const saved = audioState.savedTimeByControl.get(controlId);
  if (typeof saved === "number" && saved >= 0 && saved < (aud.duration || Infinity)) {
    try { aud.currentTime = saved; } catch (_) {}
  } else {
    try { aud.currentTime = 0; } catch (_) {}
  }

  audioState.currentControlId = controlId;
  audioState.currentAudio = aud;

  try { aud.play(); } catch (_) { return false; }
  return true;
}

// helper per bottoni: riparte sempre da 0 (ma sempre con gestione interruzioni)
function playControlAudioRestart(controlId, src) {
  if (!audioEnabled) return false;
  interruptCurrentAudio(controlId);

  const aud = getAudio(src);
  try { aud.currentTime = 0; } catch (_) {}
  audioState.savedTimeByControl.set(controlId, 0);

  audioState.currentControlId = controlId;
  audioState.currentAudio = aud;

  try { aud.play(); } catch (_) { return false; }
  return true;
}

// ============================
// EVENTO SPECIALE (riattivabile, ma "locked" finché non finisce)
// ============================
let specialRunning = false;

async function triggerEvent() {
  if (specialRunning) return 0;
  specialRunning = true;

  // salva volumi per ripristino
  const prevVolumes = new Map();
  for (const [src, a] of AUDIO_POOL.entries()) {
    try { prevVolumes.set(src, a.volume); } catch (_) {}
  }

  // ducking (abbassa tutto)
  for (const a of AUDIO_POOL.values()) {
    try { a.volume = 0.2; } catch (_) {}
  }

  // orgasmo (parte sempre)
  let orgasmoDoneResolve;
  const orgasmoDone = new Promise((res) => (orgasmoDoneResolve = res));

  if (audioEnabled) {
    try {
      const o = getAudio("orgasmo.mp3");
      o.currentTime = 0;
      o.play();

      const onEnded = () => {
        o.removeEventListener("ended", onEnded);
        orgasmoDoneResolve();
      };
      o.addEventListener("ended", onEnded);

      // fallback: se per qualche motivo non parte, non bloccare
      if (o.paused) orgasmoDoneResolve();
    } catch (_) {
      orgasmoDoneResolve();
    }
  } else {
    orgasmoDoneResolve();
  }

  // fontana (ritorna durata totale in ms)
  const totalMs = spawnFountain();

  // fine fontana + 1s “coda”
  const fountainDone = new Promise(res => setTimeout(res, totalMs + 1000));

  // aspetta davvero la fine completa (fontana + orgasmo)
  await Promise.all([fountainDone, orgasmoDone]);

  // ripristina volumi
  for (const [src, a] of AUDIO_POOL.entries()) {
    try {
      const v = prevVolumes.get(src);
      if (typeof v === "number") a.volume = v;
    } catch (_) {}
  }

  // sblocca riattivazione
  specialRunning = false;

  return totalMs;
}

// ============================
// DONNINA: ora apre una nuova pagina (invariato)
// ============================
const donnina = document.getElementById("donnina");
donnina.addEventListener("click", () => {
  window.location.href = "abo-index.html";
});

// ============================
// (resto invariato) ABO container esiste ma non viene più usato qui
// ============================
const aboContainer = document.getElementById("abo-container");

// Drag SOLO con tasto sinistro + trascinamento (invariato)
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
// CERCHI ROTANTI
// - 1° giro completo => audio 1
// - 2° giro consecutivo => audio 2
// - 3° giro consecutivo => audio 3
// - a fine del 3° audio => evento speciale
// - interruzioni: se parte altro suono, interrompe e salva; se riattivi riprende
// ============================
function setupCircle(circleEl, sideKey) {
  let rotating = false;
  let lastDeg = 0;
  let lastTs = 0;

  let accum = 0;
  let spins = 0;

  let lastSpinTs = 0;
  const MAX_GAP_FOR_CONSECUTIVE = 900; // ms: oltre resetta la combo

  const audioSeq = [
    `suono/cerchio-${sideKey}-1.mp3`,
    `suono/cerchio-${sideKey}-2.mp3`,
    `suono/cerchio-${sideKey}-3.mp3`
  ];

  function resetCombo() {
    accum = 0;
    spins = 0;
    lastSpinTs = 0;
  }

  circleEl.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    rotating = true;
    lastTs = performance.now();
    lastDeg = 0;
    resetCombo();
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!rotating) return;

    const rect = circleEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const deg = angle * 180 / Math.PI;

    circleEl.style.transform = `rotate(${deg}deg)`;

    const now = performance.now();
    const dt = Math.max(1, now - lastTs);

    let delta = deg - lastDeg;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;

    accum += Math.abs(delta);

    while (accum >= 360) {
      accum -= 360;

      // verifica consecutività
      if (lastSpinTs && (now - lastSpinTs) > MAX_GAP_FOR_CONSECUTIVE) {
        spins = 0;
      }
      lastSpinTs = now;

      spins += 1;
      if (spins > 3) spins = 3;

      const idx = spins - 1;
      const src = audioSeq[idx];
      const controlId = `circle-${sideKey}-spin-${spins}`;

      const started = playControlAudio(controlId, src);

      // al termine del 3° audio => evento speciale
      if (started && spins === 3) {
        const aud = getAudio(src);
        const onEnded = () => {
          aud.removeEventListener("ended", onEnded);
          triggerEvent();
        };
        aud.addEventListener("ended", onEnded);
      }
    }

    lastDeg = deg;
    lastTs = now;
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    rotating = false;
  });
}

setupCircle(document.getElementById("cerchio-1"), "s"); // sinistra
setupCircle(document.getElementById("cerchio-2"), "d"); // destra

// Bottoni sopra cerchi: audio dedicato
document.querySelectorAll(".cerchio-container").forEach((wrap, idx) => {
  const btn = wrap.querySelector(".cerchio-btn");
  if (!btn) return;
  const n = idx + 1; // 1 = sinistra, 2 = destra (ordine DOM)
  btn.addEventListener("click", () => playControlAudioRestart(`circle-btn-${n}`, `suono/bottone-${n}.mp3`));
});

// ============================
// SLIDER
// - cursore verticale parte in basso
// - cursore orizzontale parte a sinistra
// - audio dedicato per ogni slider + bottoni alto/basso
// - audio slider parte solo dopo: (verticale) su poi giù / (orizzontale) destra poi sinistra
// - interruzioni + resume come specificato
// - evento speciale: 4 cicli su/giù (o dx/sx) oppure movimenti rapidi consecutivi
// ============================
document.querySelectorAll(".slider").forEach((slider) => {
  const isHorizontal = slider.classList.contains("horizontal");

  const asta = document.createElement("img");
  asta.src = "tasti/asta.png";
  asta.className = "asta";

  const cursore = document.createElement("img");
  cursore.src = "tasti/cursore.png";
  cursore.className = "cursore";

  slider.appendChild(asta);
  slider.appendChild(cursore);

  const sliderIdNum = parseInt((slider.id || "").split("-")[1] || "0", 10);

  // mappa file audio
  const sliderAudioSrc = !isHorizontal
    ? `suono/slider-${sliderIdNum}.mp3`               // slider-1..4
    : `suono/slider-x-${sliderIdNum - 4}.mp3`;        // slider-5..6 => x-1..2

  const topBtnAudioSrc = !isHorizontal
    ? `suono/alto-${sliderIdNum}.mp3`
    : `suono/alto-x-${sliderIdNum - 4}.mp3`;

  const bottomBtnAudioSrc = !isHorizontal
    ? `suono/basso-${sliderIdNum}.mp3`
    : `suono/basso-x-${sliderIdNum - 4}.mp3`;

  // bottoni: audio dedicato (sempre restart)
  const topBtn = document.createElement("img");
  topBtn.src = "tasti/alto.png";
  topBtn.className = "btn-top";
  topBtn.addEventListener("click", () => playControlAudioRestart(`slider-${sliderIdNum}-btn-top`, topBtnAudioSrc));

  const bottomBtn = document.createElement("img");
  bottomBtn.src = "tasti/basso.png";
  bottomBtn.className = "btn-bottom";
  bottomBtn.addEventListener("click", () => playControlAudioRestart(`slider-${sliderIdNum}-btn-bottom`, bottomBtnAudioSrc));

  slider.appendChild(topBtn);
  slider.appendChild(bottomBtn);

  let dragging = false;
  let startMouse = 0;
  let startTop = 0;

  function cursorSizeFallback() {
    const h = cursore.offsetHeight;
    return (h && h > 0) ? h : 40;
  }

  function clampTop(top) {
    const trackH = slider.offsetHeight || 300;
    const knobH = cursorSizeFallback();
    const max = Math.max(0, trackH - knobH);
    return Math.max(0, Math.min(max, top));
  }

  // set posizione iniziale cursore
  function setInitialCursorPosition() {
    const trackH = slider.offsetHeight || 300;
    const knobH = cursorSizeFallback();
    const max = Math.max(0, trackH - knobH);

    // verticale: parte in basso (top = max)
    // orizzontale (ruotato): parte a sinistra (top = 0)
    const initTop = isHorizontal ? 0 : max;
    cursore.style.top = initTop + "px";
  }

  // aspetta un frame (e possibilmente il load immagine) per avere misure corrette
  requestAnimationFrame(setInitialCursorPosition);
  cursore.addEventListener("load", () => requestAnimationFrame(setInitialCursorPosition));

  // ============================
  // LOGICA TRIGGER AUDIO + EVENTO SPECIALE
  // ============================
  // "su poi giù" / "dx poi sx"
  const MIN_TRAVEL = 35;

  // stati per ciclo
  let wentFirstDir = false;   // ha fatto il primo "verso" (su o destra)
  let startFirstDirTop = null;

  let cycles = 0;             // numero di cicli completi (su+giù / dx+sx)
  let audioStartedThisDrag = false;

  // “movimenti rapidi consecutivi”
  let rapidScore = 0;
  let lastMoveTs = 0;
  const RAPID_WINDOW_MS = 120;
  const RAPID_NEED = 10;

  // direzione corrente (in termini di "top" che cambia)
  // top diminuisce => su (vertical) o destra (horizontal)
  // top aumenta => giù (vertical) o sinistra (horizontal)
  let lastTop = null;
  let lastDir = 0; // -1 = verso su/destra, +1 = verso giù/sinistra

  function resetGestureState() {
    wentFirstDir = false;
    startFirstDirTop = null;
    cycles = 0;
    audioStartedThisDrag = false;

    rapidScore = 0;
    lastMoveTs = 0;

    lastTop = null;
    lastDir = 0;
  }

  function maybeRapid(now, dirChanged) {
    if (!lastMoveTs) { lastMoveTs = now; return; }

    const dt = now - lastMoveTs;
    if (dt <= RAPID_WINDOW_MS && dirChanged) {
      rapidScore += 1;
    } else if (dt > RAPID_WINDOW_MS * 2) {
      rapidScore = Math.max(0, rapidScore - 1);
    }
    lastMoveTs = now;

    if (rapidScore >= RAPID_NEED) {
      rapidScore = 0;
      triggerEvent();
    }
  }

  function maybeCycleAndAudio(newTop) {
    const now = performance.now();

    if (lastTop === null) {
      lastTop = newTop;
      return;
    }

    const diff = newTop - lastTop;
    const dir = diff === 0 ? lastDir : (diff > 0 ? +1 : -1);

    // rileva cambio dir
    const dirChanged = (lastDir !== 0 && dir !== 0 && dir !== lastDir);
    if (dir !== 0 && lastDir === 0) lastDir = dir;

    if (dirChanged) {
      maybeRapid(now, true);
    } else {
      maybeRapid(now, false);
    }

    // primo verso: deve essere "su/destra" => dir = -1
    if (!wentFirstDir) {
      if (dir === -1) {
        if (startFirstDirTop === null) startFirstDirTop = lastTop;
        const travel = Math.abs(newTop - startFirstDirTop);
        if (travel >= MIN_TRAVEL) {
          wentFirstDir = true;
        }
      } else {
        // se parte già in giù/sinistra, non conta ancora
        startFirstDirTop = newTop;
      }
    } else {
      // secondo verso: deve essere "giù/sinistra" => dir = +1
      if (dir === +1) {
        // quando abbiamo un travel sufficiente, completiamo un ciclo
        const travel = Math.abs(newTop - (startFirstDirTop ?? lastTop));
        if (travel >= MIN_TRAVEL) {
          cycles += 1;

          // audio parte SOLO al primo ciclo (su+giù / dx+sx)
          if (!audioStartedThisDrag) {
            audioStartedThisDrag = true;
            playControlAudio(`slider-${sliderIdNum}`, sliderAudioSrc);
          }

          // reset per contare il prossimo ciclo
          wentFirstDir = false;
          startFirstDirTop = newTop;

          // evento speciale dopo 4 cicli
          if (cycles >= 4) {
            cycles = 0;
            triggerEvent();
          }
        }
      }
    }

    lastDir = dir;
    lastTop = newTop;
  }

  cursore.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;

    dragging = true;
    startMouse = isHorizontal ? e.clientX : e.clientY;
    startTop = parseFloat(cursore.style.top || "0") || 0;

    cursore.style.cursor = "grabbing";
    resetGestureState();
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const nowMouse = isHorizontal ? e.clientX : e.clientY;

    // logica esistente: delta invertito per orizzontali
    const rawDelta = nowMouse - startMouse;
    const delta = isHorizontal ? -rawDelta : rawDelta;

    const newTop = clampTop(startTop + delta);
    cursore.style.top = newTop + "px";

    maybeCycleAndAudio(newTop);
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    if (!dragging) return;

    dragging = false;
    cursore.style.cursor = "grab";
  });
});

// ============================
// NAV (invariato)
// ============================
document.getElementById("nav-btn").addEventListener("click", () => {
  window.location.href = "../a-01/a-pill.html";
});

// ============================
// FONTANA LINK (invariato)
// ============================
const SPECIAL_LINKS = [
  "https://www.youtube.com/watch?v=8IiOzOFrbC4",
  "https://www.youtube.com/watch?v=8WtdlqzZdAw",
  "https://www.tiktok.com/@cherish.care.pet/video/7346441256693665032",
  "https://www.tiktok.com/@curious.baby.amy/video/7327465094542118190",
  "https://www.tiktok.com/@curious.baby.amy/video/7342286367247895851"
];

function spawnFountain() {
  const fountain = document.getElementById("fountain");
  fountain.innerHTML = "";

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

      fountain.appendChild(a);

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

  return totalMs;
}
