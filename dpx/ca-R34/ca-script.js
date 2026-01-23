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
  alto: makeAudio("suono/alto.mp3"),
  basso: makeAudio("suono/basso.mp3"),
  orgasmo: makeAudio("orgasmo.mp3")
};

// Utility: play safe
function playSound(aud, restart = true) {
  if (!audioEnabled) return;
  try {
    if (restart) aud.currentTime = 0;
    aud.play();
  } catch (_) {}
}

// ============================
// EVENTO SPECIALE (uso continuo 3s)
// - conta solo mentre stai "usando" slider o cerchio
// ============================
let specialTriggered = false;
let activeUse = { cerchio: false, slider: false };
let useStartTs = null;

function setActiveUse(type, isActive) {
  if (specialTriggered) return;
  activeUse[type] = isActive;

  const anyActive = activeUse.cerchio || activeUse.slider;

  if (anyActive && useStartTs === null) {
    useStartTs = performance.now();
  }

  if (!anyActive) {
    useStartTs = null;
  }
}

// chiamata durante l'uso per verificare "continuità"
function tickContinuousUse() {
  if (specialTriggered) return;
  const anyActive = activeUse.cerchio || activeUse.slider;
  if (!anyActive || useStartTs === null) return;

  const elapsed = performance.now() - useStartTs;
  if (elapsed >= 3000) {
    triggerEvent();
  }
}

function triggerEvent() {
  if (specialTriggered) return;
  specialTriggered = true;

  // ducking
  Object.values(sounds).forEach(s => { try { s.volume = 0.2; } catch (_) {} });

  // orgasmo
  playSound(sounds.orgasmo, false);

  // fontana
  spawnFountain();

  // reload dopo 10s (durata fontana)
  setTimeout(() => location.reload(), 10000);
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

      // posizione iniziale random (in px così non dipende dal layout)
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
    if (e.button !== 0) return; // solo sinistro
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
// CERCHI ROTANTI (sinistro + drag)
// suono se rotazione "veloce"
// ============================
document.querySelectorAll(".cerchio").forEach(circle => {
  let rotating = false;
  let lastDeg = 0;
  let lastTs = 0;

  circle.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    rotating = true;
    lastTs = performance.now();
    setActiveUse("cerchio", true);
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
    const delta = Math.abs(deg - lastDeg);

    // "velocità" semplificata: gradi/ms
    const speed = delta / dt;

    // suono se speed sopra soglia
    if (speed > 0.25) {
      playSound(sounds.cerchio, true);
    }

    lastDeg = deg;
    lastTs = now;

    // continuous use tick
    tickContinuousUse();
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    if (rotating) {
      rotating = false;
      setActiveUse("cerchio", false);
    }
  });
});

// Bottone sopra cerchi
document.querySelectorAll(".cerchio-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    playSound(sounds.bottone, true);
  });
});

// ============================
// SLIDER (sinistro + drag) + suono se movimento rapido
// ============================
document.querySelectorAll(".slider").forEach(slider => {
  const asta = document.createElement("img");
  asta.src = "tasti/asta.png";
  asta.className = "asta";

  const cursore = document.createElement("img");
  cursore.src = "tasti/cursore.png";
  cursore.className = "cursore";
  cursore.style.top = "140px";

  slider.appendChild(asta);
  slider.appendChild(cursore);

  // bottoni sopra/sotto
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
  let lastY = null;
  let lastT = 0;

  cursore.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    setActiveUse("slider", true);
    lastT = performance.now();
    lastY = null;
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const rect = slider.getBoundingClientRect();
    let y = e.clientY - rect.top;
    y = Math.max(0, Math.min(rect.height - cursore.offsetHeight, y));
    cursore.style.top = y + "px";

    const now = performance.now();
    const dt = Math.max(1, now - lastT);

    if (lastY !== null) {
      const dy = Math.abs(y - lastY);
      const speed = dy / dt; // px/ms
      if (speed > 0.35) {
        playSound(sounds.slider, true);
      }
    }

    lastY = y;
    lastT = now;

    tickContinuousUse();
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 0) return;
    if (dragging) {
      dragging = false;
      setActiveUse("slider", false);
    }
  });
});

// ============================
// NAV
// ============================
document.getElementById("nav-btn").addEventListener("click", () => {
  window.location.href = "../a-01/a-pill.html";
});

// ============================
// FONTANA LINK (10s lenta, verticali, stesso punto, parabola dx/sx)
// ============================
function spawnFountain() {
  const fountain = document.getElementById("fountain");
  fountain.innerHTML = "";

  const startX = window.innerWidth / 2;
  const startY = window.innerHeight - 70;

  const DURATION = 10000; // 10s
  const LINKS = 28;

  for (let i = 0; i < LINKS; i++) {
    const a = document.createElement("a");
    a.textContent = `link-${i + 1}`;
    a.href = "#";
    fountain.appendChild(a);

    // tutti nascono dallo stesso punto
    a.style.left = startX + "px";
    a.style.top  = startY + "px";

    // separazione + parabola
    const side = Math.random() > 0.5 ? 1 : -1;
    const spread = (80 + Math.random() * 220) * side;
    const peak = 520 + Math.random() * 220;
    const drift = (Math.random() * 120) * side;

    const born = performance.now();

    const tick = (now) => {
      const t = (now - born) / DURATION;
      if (t >= 1) { a.remove(); return; }

      // easing lento (smoothstep)
      const tt = t * t * (3 - 2 * t);

      // X: si separano salendo
      const x = startX + (spread * tt) + (drift * tt * tt);

      // Y: parabola (sale e ricade)
      const y = startY - (peak * (4 * tt * (1 - tt)));

      a.style.left = x + "px";
      a.style.top  = y + "px";

      // fade: entra piano, poi svanisce lentamente
      const fadeIn = Math.min(1, tt / 0.10);
      const fadeOut = 1 - Math.max(0, (tt - 0.20) / 0.80);
      a.style.opacity = Math.max(0, Math.min(1, fadeIn * fadeOut));

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
