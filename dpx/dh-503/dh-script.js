/* ===== Config ===== */
const SRC_1 = "dh_hack.mp4";
const SRC_2 = "luca_carlevarino.mp4";
const SRC_3 = "dh-hamsteria.mp4"; // <— nuovo nome del terzo video

/* Fade/reveal del video 1: ultimi 2 secondi */
const REVEAL_SECOND_BEFORE_END_V1 = 2;

/* Skip su v2 dopo 2 secondi di riproduzione */
const SHOW_SKIP_AFTER_V2_SECONDS = 2;

/* Notifica su v3 a 01:20 */
const V3_NOTIFY_AT = 82;

/* Redirect finale */
const DEST_URL = "ec-pill/ec-pill-index.html";

/* ===== DOM ===== */
const startKey = document.getElementById("startKey");
const stage    = document.getElementById("stage");
const v1       = document.getElementById("v1");
const v2       = document.getElementById("v2");
const v3       = document.getElementById("v3");
const skipBtn  = document.getElementById("skipBtn");
const v2Banner = document.getElementById("v2Banner");
const loader   = document.getElementById("loader"); // <img id="loader" src="time.gif">

/* Notifica V3 */
const notify  = document.getElementById("notify");
const btnYes  = document.getElementById("btnYes");
const btnNo   = document.getElementById("btnNo");

/* ===== Stato ===== */
let revealedV2 = false;
let skipShown  = false;
let v3Notified = false;

/* ===== Setup ===== */
function setupVideos() {
  [v1, v2, v3].forEach(v => {
    v.setAttribute("playsinline", "");
    v.removeAttribute("controls");
    v.controls = false;
    v.muted = false;
    v.preload = "auto";
  });
  v1.src = SRC_1;
  v2.src = SRC_2;
  v3.src = SRC_3;
}

async function safePlay(video) {
  try { await video.play(); } catch { /* ignore autoplay restrictions */ }
}

/* Piccola utility per attese parallele (loader) */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* Attendi il primo frame “vero” (con timeout fail-safe) */
function waitForFirstFrame(video, timeoutMs = 1500) {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };

    const t = setTimeout(finish, timeoutMs);
    const cb = () => { clearTimeout(t); finish(); };

    if (video.readyState >= 2) {
      if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(cb);
      else cb();
      return;
    }
    const onLoaded = () => {
      video.removeEventListener("loadeddata", onLoaded);
      if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(cb);
      else cb();
    };
    const onError = () => { clearTimeout(t); finish(); };

    video.addEventListener("loadeddata", onLoaded, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

/* ===== Anti-interruzione + combo H+K su v1 ===== */
const pressedKeys = new Set();

function hardenAgainstUserInterruption() {
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  document.addEventListener("keydown", (e) => {
    const key = (e.key || "").toLowerCase();
    pressedKeys.add(key);

    // H + K durante v1 => vai subito a v2
    const onV1Active = v1.classList.contains("show") && !revealedV2 && !v1.paused;
    if (onV1Active && pressedKeys.has("h") && pressedKeys.has("k")) {
      e.preventDefault(); e.stopPropagation();
      skipV1ToV2();
      return;
    }

    // Blocca tasti play/pause/seek comuni
    const blocked = [" ", "k", "j", "l", "arrowleft", "arrowright", "arrowup", "arrowdown", "mediaplaypause"];
    if (blocked.includes(key)) { e.preventDefault(); e.stopPropagation(); }
  }, { capture: true });

  document.addEventListener("keyup", (e) => {
    pressedKeys.delete((e.key || "").toLowerCase());
  }, { capture: true });

  window.addEventListener("blur", () => pressedKeys.clear());

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      [v1, v2, v3].forEach(v => { if (!v.paused && v.readyState >= 2) v.play().catch(()=>{}); });
    }
  });

  ["dragstart", "drop"].forEach(evt =>
    document.addEventListener(evt, e => e.preventDefault(), { capture: true })
  );
}

/* ===== Logica di flusso ===== */
function handleV1Timeupdate() {
  if (revealedV2) return;
  if (!isFinite(v1.duration) || v1.duration <= 0) return;

  const remaining = v1.duration - v1.currentTime;
  if (remaining <= REVEAL_SECOND_BEFORE_END_V1) {
    revealedV2 = true;

    // Rivela v2 sotto e dissolve v1 (2s via CSS .fade-long)
    v2.classList.add("show");
    v1.classList.add("fade-long");
    safePlay(v2);

    v1.addEventListener("ended", () => {
      v1.classList.remove("show", "fade-long");
      v1.classList.add("hide");
      startVideo2Phase();
    }, { once: true });
  }
}

function startVideo2Phase() {
  v2.classList.add("show");
  safePlay(v2);

  // Banner su v2
  v2Banner.classList.add("show");

  // Skip dopo ~2s (sempre)
  const showSkip = () => { if (!skipShown) { skipShown = true; skipBtn.classList.add("show"); } };
  const t1 = setTimeout(showSkip, SHOW_SKIP_AFTER_V2_SECONDS * 1000);
  const onPlaying = () => { setTimeout(showSkip, SHOW_SKIP_AFTER_V2_SECONDS * 1000); v2.removeEventListener("playing", onPlaying); };
  v2.addEventListener("playing", onPlaying);
  const ti = setInterval(() => {
    if (v2.currentTime >= SHOW_SKIP_AFTER_V2_SECONDS) showSkip();
    if (skipShown) { clearInterval(ti); clearTimeout(t1); }
  }, 250);

  v2.addEventListener("ended", () => transitionToV3(), { once: true });
  skipBtn.addEventListener("click", () => transitionToV3(), { once: true });
}

/* Notifica su v3 a 01:20 */
function attachV3Notification() {
  const onTimeUpdate = () => {
    if (!v3Notified && isFinite(v3.duration) && v3.currentTime >= V3_NOTIFY_AT) {
      v3Notified = true;
      v3.removeEventListener("timeupdate", onTimeUpdate);
      v3.pause();

      notify.classList.add("show");
      notify.setAttribute("aria-hidden", "false");

      const handleChoice = () => {
        // pulizia focus (evita warning ARIA)
        const active = document.activeElement;
        if (notify.contains(active)) active.blur();
        if (!stage.hasAttribute("tabindex")) stage.setAttribute("tabindex", "-1");
        stage.focus();

        notify.classList.remove("show");
        notify.setAttribute("aria-hidden", "true");

        // riprendi subito (nessun flash)
        safePlay(v3);

        btnYes.removeEventListener("click", handleChoice);
        btnNo.removeEventListener("click", handleChoice);
      };

      btnYes.addEventListener("click", handleChoice);
      btnNo.addEventListener("click", handleChoice);
    }
  };
  v3.addEventListener("timeupdate", onTimeUpdate);
}

/* v2 -> background (fade) + loader 2s -> v3 senza flash */
async function transitionToV3() {
  // Chiudi overlay v2 (banner/skip)
  v2Banner.classList.remove("show");
  skipBtn.classList.remove("show");
  skipBtn.style.pointerEvents = "none";

  // Avvia dissolvenza di v2 per mostrare il background
  v2.classList.remove("show");
  v2.classList.add("hide");

  // Ferma audio v2 in parallelo
  try { v2.pause(); v2.currentTime = 0; v2.muted = true; } catch(_) {}

  // Mostra loader (rotella) per ~2s mentre prepariamo v3
  if (loader) loader.classList.add("show");

  // Attendi sia il primo frame di v3 (fail-safe) sia i 2s di loader
  await Promise.all([
    waitForFirstFrame(v3, 1500),
    sleep(2000)
  ]);

  // Mostra v3 e avvia
  v3.classList.add("show");
  safePlay(v3);

  // Nascondi loader
  if (loader) loader.classList.remove("show");

  // Notifica a 01:20 e redirect a fine v3
  attachV3Notification();
  v3.addEventListener("ended", () => { window.location.href = DEST_URL; }, { once: true });

  // Non forzare play quando è in pausa per la notifica
  const tryKeepPlaying = () => { if (!v3.paused) safePlay(v3); };
  v3.addEventListener("pause", tryKeepPlaying);
}

/* ===== Skip manuale v1 -> v2 (combo H+K) ===== */
function skipV1ToV2() {
  if (revealedV2) return;
  revealedV2 = true;

  v1.removeEventListener("timeupdate", handleV1Timeupdate);
  v1.classList.remove("show", "fade-long");
  v1.classList.add("hide");
  v1.pause();

  v2.classList.add("show");
  safePlay(v2);
  startVideo2Phase();
}

/* ===== Avvio sequenza ===== */
async function startSequence() {
  startKey.classList.add("hidden");

  stage.classList.add("active");
  stage.setAttribute("aria-hidden", "false");

  v1.classList.add("show");
  await safePlay(v1);

  v1.addEventListener("timeupdate", handleV1Timeupdate);
  v1.addEventListener("ended", () => {
    if (!revealedV2) v2.classList.add("show");
    startVideo2Phase();
  }, { once: true });
}

/* ===== Init ===== */
setupVideos();
hardenAgainstUserInterruption();
stage.classList.remove("active");   // parte inattivo
startKey.addEventListener("click", startSequence, { once: true });
