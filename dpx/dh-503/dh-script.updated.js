/* =========================
   CONFIG
   ========================= */

const DH_GAME_MODE = "boxed"; // "boxed" | "fullscreen"
const DH_GAME_BOX_W = "800px";
const DH_GAME_BOX_H = "450px";

const HK_WINDOW_MS = 6000;

// UI positioning relative to dh-game
const offsetFromBottomPx = 160;
const X_OFFSET_PX = -50; // ← cambia questo valore
// sinistra/destra: negativo = sinistra, positivo = destra

/* =========================
   TIME SETUP
   ========================= */

const FPS = 30;
function tc(h, m, s, f) { return (h * 3600) + (m * 60) + s + (f / FPS); }

// pause 1: CONTINUA
const T_PAUSE_1 = tc(0, 0, 3, 16);
// pause 2: RED BUTTON
const T_PAUSE_RED = tc(0, 0, 10, 8);

// INPUT WINDOW
const T_INPUT_SHOW = tc(0, 0, 19, 11);
const T_INPUT_COMMIT = tc(0, 0, 29, 5);

// (resto lasciato per dopo)
const T_HIDE_TXT = tc(0, 0, 40, 25);

/* =========================
   ELEMENTS
   ========================= */

const stage = document.querySelector(".stage");

const openDoor = document.getElementById("openDoor");

const dhGameFull = document.getElementById("dhGameFull");
const dhGameWrap = document.getElementById("dhGameWrap");
const dhGameBoxed = document.getElementById("dhGameBoxed");

const startOverlay = document.getElementById("startOverlay");
const keysField = document.getElementById("keysField");

const cardWrap = document.getElementById("cardWrap");
const cardWindowEl = document.getElementById("cardWindow");
const cardVid = document.getElementById("cardVid");

const continueBtn = document.getElementById("continueBtn");
const btnRed = document.getElementById("btnRed");

const bottomCenter = document.querySelector(".bottom-center");
const inputWrap = document.getElementById("inputWrap");
const userInput = document.getElementById("userInput");
const printedText = document.getElementById("printedText");

const glitch = document.getElementById("glitch");
const finalScreen = document.getElementById("finalScreen");
const btnNo = document.getElementById("btnNo");
const btnYes = document.getElementById("btnYes");

// Guard
function must(el, name) {
  if (!el) console.error(`Missing element: ${name}`);
  return el;
}
must(stage, "stage");
must(openDoor, "openDoor");
must(dhGameFull, "dhGameFull");
must(dhGameWrap, "dhGameWrap");
must(dhGameBoxed, "dhGameBoxed");
must(startOverlay, "startOverlay");
must(keysField, "keysField");
must(cardWrap, "cardWrap");
must(cardWindowEl, "cardWindow");
must(cardVid, "cardVid");
must(continueBtn, "continueBtn");
must(btnRed, "btnRed");
must(inputWrap, "inputWrap");
must(userInput, "userInput");
must(printedText, "printedText");
must(glitch, "glitch");
must(finalScreen, "finalScreen");

/* =========================
   DH GAME MODE
   ========================= */

let dhGame = null;

function applyDhGameMode() {
  if (DH_GAME_MODE === "boxed") {
    document.documentElement.style.setProperty("--dh-game-w", DH_GAME_BOX_W);
    document.documentElement.style.setProperty("--dh-game-h", DH_GAME_BOX_H);

    dhGameFull.classList.remove("is-visible");
    dhGameWrap.classList.remove("is-visible");
    dhGameWrap.setAttribute("aria-hidden", "false");

    dhGame = dhGameBoxed;
  } else {
    dhGameWrap.classList.remove("is-visible");
    dhGameWrap.setAttribute("aria-hidden", "true");
    dhGameFull.classList.remove("is-visible");

    dhGame = dhGameFull;
  }
}
applyDhGameMode();

function showDhGameVisible() {
  if (DH_GAME_MODE === "boxed") dhGameWrap.classList.add("is-visible");
  else dhGameFull.classList.add("is-visible");
}
function hideDhGameVisible() {
  if (DH_GAME_MODE === "boxed") dhGameWrap.classList.remove("is-visible");
  else dhGameFull.classList.remove("is-visible");
}

/* =========================
   STATE
   ========================= */

let openDoorHasStarted = false;
let openDoorHasEnded = false;

let pause1Done = false;
let pauseRedDone = false;

// input window state
let inputShown = false;
let inputCommitted = false;
let inputSubmitted = false;
let committedText = "";

/* =========================
   CARD (Luca) behavior
   ========================= */

function showCard() {
  if (!cardWrap) return;
  cardWrap.classList.add("is-visible");
  cardWrap.setAttribute("aria-hidden", "false");

  // preview autoplay muted + loop
  if (cardVid) {
    cardVid.muted = true;
    cardVid.loop = true;
    cardVid.play().catch(() => { });
  }
}

function hideCard() {
  if (!cardWrap) return;
  cardWrap.classList.remove("is-visible");
  cardWrap.setAttribute("aria-hidden", "true");
  if (cardVid) cardVid.pause();
}

// Card is a button that opens a separate page
function setupLucaCardAsButton() {
  if (!cardWindowEl) return;
  cardWindowEl.style.cursor = "pointer";
  cardWindowEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open("luca-carlevarino.html", "_blank");
  }, { passive: false });
}
setupLucaCardAsButton();

/* =========================
   UI position anchored to dh-game
   ========================= */

function getGameAnchorEl() {
  if (DH_GAME_MODE === "boxed") {
    const box = document.querySelector(".dh-game-box");
    if (box) return box;
    return dhGameWrap || dhGameBoxed;
  }
  return dhGameFull || dhGame;
}

function positionUIToGame() {
  if (!bottomCenter) return;

  const anchor = getGameAnchorEl();
  if (!anchor || !anchor.getBoundingClientRect) return;

  const r = anchor.getBoundingClientRect();
  const x = r.left + (r.width / 2) + X_OFFSET_PX;
  const y = r.bottom - offsetFromBottomPx;

  bottomCenter.style.position = "fixed";
  bottomCenter.style.left = `${Math.round(x)}px`;
  bottomCenter.style.top = `${Math.round(y)}px`;
  bottomCenter.style.bottom = "auto";
  bottomCenter.style.transform = "translate(-50%, -50%)";
  bottomCenter.style.width = `min(640px, ${Math.round(window.innerWidth * 0.92)}px)`;
}

window.addEventListener("resize", positionUIToGame);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", positionUIToGame);
  window.visualViewport.addEventListener("scroll", positionUIToGame);
}

/* =========================
   VIDEO HARDENING
   ========================= */

function lockVideo(video) {
  if (!video) return;
  video.controls = false;
  video.setAttribute("controlsList", "nodownload noplaybackrate noremoteplayback");
  video.disablePictureInPicture = true;
  video.addEventListener("contextmenu", (e) => e.preventDefault());
}
[openDoor, dhGameFull, dhGameBoxed, cardVid].forEach(lockVideo);

openDoor.muted = false;
dhGameFull.muted = false;
dhGameBoxed.muted = false;

function preventPauseWhilePlaying(video) {
  if (!video) return;
  video.addEventListener("pause", () => {
    if (video.ended) return;
    if (!video.dataset.allowPause) video.play().catch(() => { });
  });
}
preventPauseWhilePlaying(openDoor);
preventPauseWhilePlaying(dhGameFull);
preventPauseWhilePlaying(dhGameBoxed);

/* =========================
   KEYS / CAPTCHA
   ========================= */

const SYMBOLS = ["⚷", "ꄗ", "🗝", "🔑", "🔐"];
const CHUNKS = [
  "DH-503", "0xA7F", "k9", "p13", "R0UT3", "AUTH", "GATE", "NODE", "CACHE",
  "--..", "..--", "__//", "\\\\__", "::", "==", "++", "??", "!!", "<>", "[]", "{}",
  "0101", "0011", "1100", "1010", "0001", "0110", "SALT", "HASH", "KEY", "SEED"
];
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function makeKeyString() {
  const s = pick(SYMBOLS);
  const a = pick(CHUNKS);
  const b = pick(CHUNKS);
  const c = pick(CHUNKS);
  const mid = pick(["/", "//", "::", "__", "-", "==", "++", "??"]);
  return `${s} ${a}${mid}${b}${pick(["", "'", "_", "\\", "/"])}${c}`;
}

const CORRECT_TEXT = `
 ______     ______   ______     __   __    
/\\  __ \\   /\\  == \\ /\\  ___\\   /\\ "-.\\ \\   
\\ \\ \\/\\ \\  \\ \\  _-/ \\ \\  __\\   \\ \\ \\-.  \\  
 \\ \\_____\\  \\ \\_\\    \\ \\_____\\  \\ \\_\\\\"\\_\\ 
  \\/_____/   \\/_/     \\/_____/   \\/_/ \\/_/ 
                                            
`;

const MAX_KEYS = 70;
const INITIAL_KEYS = 8;
const ADD_EVERY_MS = 1000;

const keyItems = [];

function placeRandomAvoidingAscii() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const avoidXMin = vw * 0.28;
  const avoidXMax = vw * 0.72;
  const avoidYMin = vh * 0.18;
  const avoidYMax = vh * 0.58;

  let x, y, tries = 0;
  do {
    x = randInt(10, Math.max(10, vw - 260));
    y = randInt(10, Math.max(10, vh - 40));
    tries++;
    if (tries > 80) break;
  } while (x > avoidXMin && x < avoidXMax && y > avoidYMin && y < avoidYMax);

  return { x, y };
}

function addKey(text) {
  const { x, y } = placeRandomAvoidingAscii();

  const el = document.createElement("a");
  el.href = "#";
  el.className = "access-key";
  if (text === CORRECT_TEXT) el.classList.add("is-correct");
  el.textContent = text;

  el.style.left = x + "px";
  el.style.top = y + "px";

  el.addEventListener("click", async (e) => {
    e.preventDefault();

    if (text === CORRECT_TEXT) {
      if (openDoorHasStarted || openDoorHasEnded) return;

      openDoorHasStarted = true;
      keysField.style.pointerEvents = "none";

      startOverlay.classList.add("is-hidden");

      openDoor.style.display = "";
      openDoor.style.opacity = "";
      openDoor.classList.add("is-visible");

      try { await openDoor.play(); }
      catch (err) { console.warn("openDoor play blocked:", err); }
      return;
    }

    scramblePositions();
  });

  keysField.appendChild(el);
  keyItems.push({ text, el });
}

function scramblePositions() {
  keyItems.forEach((k) => {
    if (k.text !== CORRECT_TEXT && Math.random() < 0.20) {
      k.text = makeKeyString();
      k.el.textContent = k.text;
    }
    if (k.text !== CORRECT_TEXT) {
      const p = placeRandomAvoidingAscii();
      k.el.style.left = p.x + "px";
      k.el.style.top = p.y + "px";
    }
  });

  if (!keyItems.some(k => k.text === CORRECT_TEXT)) addKey(CORRECT_TEXT);
}

function initKeys() {
  keysField.innerHTML = "";
  keyItems.length = 0;

  for (let i = 0; i < INITIAL_KEYS - 1; i++) addKey(makeKeyString());
  addKey(CORRECT_TEXT);
}
initKeys();

const growTimer = setInterval(() => {
  if (startOverlay.classList.contains("is-hidden")) {
    clearInterval(growTimer);
    return;
  }
  if (keyItems.length >= MAX_KEYS) return;
  addKey(makeKeyString());
}, ADD_EVERY_MS);

/* =========================
   CHECKPOINT BUTTONS
   ========================= */

function hideCheckpointButtons() {
  if (btnRed) btnRed.classList.remove("is-visible");
}

function showRedCheckpoint() {
  if (!btnRed) return;
  btnRed.classList.add("is-visible");
  btnRed.onclick = () => {
    btnRed.classList.remove("is-visible");
    resumeDhGame();
  };
}


function showContinueButton() {
  continueBtn.classList.add("is-visible");
  continueBtn.onclick = () => {
    continueBtn.classList.remove("is-visible");
    resumeDhGame();
  };
}

function pauseAtCheckpoint(afterPause) {
  dhGame.dataset.allowPause = "1";
  dhGame.pause();
  setTimeout(() => { if (typeof afterPause === "function") afterPause(); }, 0);
}

function resumeDhGame() {
  hideCheckpointButtons();
  continueBtn.classList.remove("is-visible");
  delete dhGame.dataset.allowPause;
  dhGame.play().catch(() => { });
}

/* =========================
   INPUT + PRINTED TEXT (NEW LOGIC)
   ========================= */

function pulseGlitch(ms = 260) {
  if (!glitch) return;
  glitch.classList.add("is-on");
  setTimeout(() => glitch.classList.remove("is-on"), ms);
}

function showInputWindow() {
  if (!inputWrap || !userInput) return;
  inputWrap.classList.add("is-visible");
  userInput.value = "";
  // focus senza spostare la pagina
  try { userInput.focus({ preventScroll: true }); } catch (e) { userInput.focus(); }
}

function hideInputWindow() {
  if (!inputWrap) return;
  inputWrap.classList.remove("is-visible");
}

function showPrinted(txt) {
  if (!printedText) return;
  printedText.textContent = txt;
  printedText.classList.add("is-visible");
}

function hidePrinted() {
  if (!printedText) return;
  printedText.classList.remove("is-visible");
  printedText.textContent = "";
}

function commitInputAndPrint({ jumpToCommit = false } = {}) {
  if (inputCommitted) return;
  inputCommitted = true;

  // scegli testo
  const raw = (userInput?.value ?? "").trim();
  if (inputSubmitted) committedText = raw.length ? raw : "testo di default";
  else committedText = raw.length ? raw : "testo di default";

  // glitch + eventualmente salto
  pulseGlitch(280);

  if (jumpToCommit) {
    // salto se l'utente ha premuto invio prima del commit time
    try { dhGame.currentTime = T_INPUT_COMMIT; } catch (e) { }
  } else {
    // se siamo arrivati “da playback”, allineiamo preciso comunque
    try { dhGame.currentTime = T_INPUT_COMMIT; } catch (e) { }
  }

  // UI
  hideInputWindow();
  showPrinted(committedText);
}

/* =========================
   OPEN DOOR ENDED -> DH GAME + BG
   ========================= */

openDoor.addEventListener("ended", async () => {
  openDoorHasEnded = true;

  try { openDoor.pause(); } catch (e) { }
  openDoor.classList.remove("is-visible");
  openDoor.style.opacity = "0";
  openDoor.style.display = "none";

  if (stage) stage.style.background = "url('dc-desktop.jpg') center/cover no-repeat";

  showCard();

  showDhGameVisible();
  positionUIToGame();
  setTimeout(positionUIToGame, 60);

  // reset checkpoint state
  pause1Done = false;
  pauseRedDone = false;
  hideCheckpointButtons();
  continueBtn.classList.remove("is-visible");

  // reset input state
  inputShown = false;
  inputCommitted = false;
  inputSubmitted = false;
  committedText = "";
  hideInputWindow();
  hidePrinted();

  // bind enter once (overwrite ok)
  userInput.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputSubmitted = true;
      // invio: salta subito a 29:05 con glitch e stampa
      commitInputAndPrint({ jumpToCommit: true });
    }
  };

  try { await dhGame.play(); }
  catch (err) { console.warn("dhGame play blocked:", err); }
});

/* =========================
   DH GAME TIMELINE
   ========================= */

dhGame.addEventListener("timeupdate", () => {
  const t = dhGame.currentTime;

  // 1) CONTINUA
  if (!pause1Done && t >= T_PAUSE_1) {
    pause1Done = true;
    pauseAtCheckpoint(() => showContinueButton());
    return;
  }

  // 2) RED button
  if (!pauseRedDone && t >= T_PAUSE_RED) {
    pauseRedDone = true;
    pauseAtCheckpoint(() => showRedCheckpoint());
    return;
  }


  // INPUT appears (no pause)
  if (!inputShown && t >= T_INPUT_SHOW) {
    inputShown = true;
    showInputWindow();
    positionUIToGame();
    setTimeout(positionUIToGame, 60);
  }

  // COMMIT at 29:05 if not already committed
  if (!inputCommitted && t >= T_INPUT_COMMIT) {
    // non ha premuto invio: usa value se presente, altrimenti default
    commitInputAndPrint({ jumpToCommit: false });
    return;
  }

  // (per dopo)
  if (inputCommitted && !hideTextDone && t >= T_HIDE_TXT) {
    // se vuoi far sparire il testo ad un certo punto, lo gestiamo dopo
    // hideTextDone = true;
  }
});

dhGame.addEventListener("ended", () => {
  hideDhGameVisible();
  hideCard();

  // sparisce il printed insieme al video
  hideInputWindow();
  hidePrinted();

  finalScreen.classList.add("is-visible");
});

/* =========================
   HK SKIP (optional)
   ========================= */

const bootAt = Date.now();
const hkState = { h: false, a: false, k: false };

window.addEventListener("keydown", (e) => {
  const within = (Date.now() - bootAt) <= HK_WINDOW_MS;
  if (!within) return;

  const key = (e.key || "").toLowerCase();
  if (key === "h") hkState.h = true;
  if (key === "a") hkState.a = true;
  if (key === "k") hkState.k = true;

  if (hkState.h && hkState.a && hkState.k) {
    hkState.h = hkState.a = hkState.k = false;
    try { dhGame.pause(); } catch (e) { }
    hideDhGameVisible();
    hideCard();
    hideInputWindow();
    hidePrinted();
    finalScreen.classList.add("is-visible");
    return;
  }
});

/* =========================
   FINAL BUTTONS
   ========================= */

function goNext() {
  window.location.href = "ec-pill/ec-pill-index.html";
}
if (btnNo) btnNo.addEventListener("click", goNext);
if (btnYes) btnYes.addEventListener("click", goNext);

// prevent common playback shortcuts
window.addEventListener("keydown", (e) => {
  const keys = [" ", "Spacebar", "ArrowLeft", "ArrowRight", "k", "K", "j", "J", "l", "L"];
  if (keys.includes(e.key)) e.preventDefault();
}, { passive: false });
