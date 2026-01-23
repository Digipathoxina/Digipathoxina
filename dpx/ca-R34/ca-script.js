// ============================
// AUTOPLAY SAFE (audio gated)
// ============================
let audioEnabled = false;
document.addEventListener("click", () => { audioEnabled = true; }, { once: true });

function makeAudio(src) {
  const a = new Audio(src);
  a.preload = "auto";
  a.volume = 1;
  return a;
}

const sounds = {
  cerchio: makeAudio("suono/cerchio.mp3"),
  bottone: makeAudio("suono/bottone.mp3"),
  slider: makeAudio("suono/slider.mp3"),
  sliderF: makeAudio("suono/slider-f.mp3"), // slider orizzontali
  alto: makeAudio("suono/alto.mp3"),
  basso: makeAudio("suono/basso.mp3"),
  orgasmo: makeAudio("orgasmo.mp3")
};

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
    if (!aud.paused && !aud.ended) return false; // sta suonando -> ignora
    aud.currentTime = 0;
    aud.play();
    return true;
  } catch (_) {
    return false;
  }
}

// ============================
// EVENTO SPECIALE (trigger una sola volta per sessione)
// ============================
let specialTriggered = false;

function triggerEvent() {
  if (specialTriggered) return 0;
  specialTriggered = true;

  // ducking
  Object.values(sounds).forEach(s => { try { s.volume = 0.2; } catch (_) {} });

  // orgasmo
  playSound(sounds.orgasmo, false);

  // fontana (ritorna durata effettiva)
  const totalMs = spawnFountain();

  // reload 1s dopo che sono svaniti tutti
  setTimeout(() => location.reload(), totalMs + 1000);

  return totalMs;
}

// ============================
// DONNINA TOGGLE + ABO DRAG
// ============================
const donnina = document.getElementById("donnina");
const aboContainer = document.getElementById("abo-container");
let aboVisible = false;

donnina.addEventListener("click", () => {
  aboVisible = !aboVisible;
  aboContainer.innerHTML = "";

  if (aboVisible) {
    for (let i = 1; i <= 4; i++) {
      const img = document.createElement("img");
      img.src = `abo-${i}.jpg`;
      img.className = "abo";
      img.style.left = (window.innerWidth * (0.15 + Math.random() * 0.7)) + "px";
      img.style.top  = (window.innerHeight * (0.15 + Math.random() * 0.7)) + "px";
      makeDraggable(img);
      aboContainer.appendChild(img);
    }
  }
});

// Drag SOLO con tasto sinistro + trascinamento
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
// - suono solo dopo 2 giri veloci
// - suono LOCKED (non riparte finché non finisce)
// - evento speciale alla 2ª riproduzione di cerchio.mp3
// ============================
let cerchioAudioPlays = 0;

document.querySelectorAll(".cerchio").forEach(circle => {
  let rotating = false;
  let lastDeg = 0;
  let lastTs = 0;

  let fastRotAccum = 0;
  let spinsCount = 0;

  circle.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    rotating = true;
    lastTs = performance.now();
    lastDeg = 0;
    fastRotAccum = 0;
    spinsCount = 0;
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!rotating) return;

    const rect = circle.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const deg = angle * 180 / Math.PI;

    circle.style.transform = `rotate(${deg}deg)`;

    const now = performance.now();
    const dt = Math.max(1, now - lastTs);

    let delta = deg - lastDeg;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;

    const speed = Math.abs(delta) / dt;

    if (speed > 0.35) {
      fastRotAccum += Math.abs(delta);

      while (fastRotAccum >= 360) {
        fastRotAccum -= 360;
        spinsCount += 1;
      }

      if (spinsCount >= 2) {
        spinsCount = 0;
        fastRotAccum = 0;

        // LOCKED: se sta già suonando, non riparte
        const started = playSoundLocked(sounds.cerchio);

        if (started) {
          cerchioAudioPlays += 1;
          if (cerchioAudioPlays >= 2) {
            triggerEvent();
          }
        }
      }
    }

    lastDeg = deg;
    lastTs = now;
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    rotating = false;
  });
});

// Bottone sopra cerchi (NON evento)
document.querySelectorAll(".cerchio-btn").forEach(btn => {
  btn.addEventListener("click", () => playSound(sounds.bottone, true));
});

// ============================
// SLIDER
// - Verticali: drag su/giù
// - Orizzontali (.horizontal): drag destra/sinistra (direzione FIXATA)
// - suono parte solo dopo oscillazioni (8 inversioni)
// - quando il suono parte: NON può ripartire finché non finisce
// - OGNI VOLTA che parte davvero il suono slider => parte evento speciale
// ============================
document.querySelectorAll(".slider").forEach((slider) => {
  const isHorizontal = slider.classList.contains("horizontal");

  const asta = document.createElement("img");
  asta.src = "tasti/asta.png";
  asta.className = "asta";

  const cursore = document.createElement("img");
  cursore.src = "tasti/cursore.png";
  cursore.className = "cursore";
  cursore.style.top = "140px";

  slider.appendChild(asta);
  slider.appendChild(cursore);

  // bottoni (NON evento)
  const topBtn = document.createElement("img");
  topBtn.src = "tasti/alto.png";
  topBtn.className = "btn-top";
  topBtn.addEventListener("click", () => playSound(sounds.alto, true));

  const bottomBtn = document.createElement("img");
  bottomBtn.src = "tasti/basso.png";
  bottomBtn.className = "btn-bottom";
  bottomBtn.addEventListener("click", () => playSound(sounds.basso, true));

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

  // trigger suono dopo oscillazioni
  let lastTop = null;
  let lastDir = 0;
  let reversals = 0;
  const MIN_TRAVEL_FOR_REVERSAL = 55;
  let sinceLastReversalTop = null;

  function resetOscillationCounter() {
    lastTop = null;
    lastDir = 0;
    reversals = 0;
    sinceLastReversalTop = null;
  }

  function maybeCountReversal(newTop) {
    if (lastTop === null) {
      lastTop = newTop;
      sinceLastReversalTop = newTop;
      return;
    }

    const diff = newTop - lastTop;
    const dir = diff === 0 ? lastDir : (diff > 0 ? +1 : -1);

    if (lastDir === 0) {
      lastDir = dir;
      lastTop = newTop;
      sinceLastReversalTop = newTop;
      return;
    }

    if (dir !== 0 && dir !== lastDir) {
      const travel = Math.abs(newTop - sinceLastReversalTop);
      if (travel >= MIN_TRAVEL_FOR_REVERSAL) {
        reversals += 1;
        sinceLastReversalTop = newTop;
        lastDir = dir;

        // 4 oscillazioni ~ 8 inversioni
        if (reversals >= 8) {
          reversals = 0;

          const aud = isHorizontal ? sounds.sliderF : sounds.slider;

          // LOCKED: se sta già suonando, non riparte
          const started = playSoundLocked(aud);

          // OGNI VOLTA che parte davvero => evento speciale
          if (started) {
            triggerEvent();
          }
        }
      } else {
        lastDir = dir;
      }
    }

    lastTop = newTop;
  }

  cursore.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;

    dragging = true;
    startMouse = isHorizontal ? e.clientX : e.clientY;
    startTop = parseFloat(cursore.style.top || "0") || 0;

    cursore.style.cursor = "grabbing";
    resetOscillationCounter();
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const nowMouse = isHorizontal ? e.clientX : e.clientY;

    // FIX DIREZIONE (orizzontali invertiti): reinvertiamo SOLO per orizzontali
    const rawDelta = nowMouse - startMouse;
    const delta = isHorizontal ? -rawDelta : rawDelta;

    const newTop = clampTop(startTop + delta);
    cursore.style.top = newTop + "px";

    maybeCountReversal(newTop);
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
document.getElementById("nav-btn").addEventListener("click", () => {
  window.location.href = "../a-01/a-pill.html";
});

// ============================
// FONTANA LINK (getto/spruzzo, parabola, offset start, rallenta, reload 1s dopo)
// - "più in alto prima della curvatura": PEAK aumentato
// - ritorna durata effettiva totale (ms)
// ============================
function spawnFountain() {
  const fountain = document.getElementById("fountain");
  fountain.innerHTML = "";

  const baseX = window.innerWidth / 2;
  const baseY = window.innerHeight - 40;

  const LINKS = 30;
  const STAGGER = 45;       // nascono veloci
  const DURATION = 5200;    // percorso lento/che rallenta

  // ✅ più alto prima della curvatura (più “getto”)
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
      a.href = "#";
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
