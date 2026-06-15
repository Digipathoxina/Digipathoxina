/* EO – Meme Playground (full, v10)
   - Primo hint 1s dopo caricamento di tutti i media
   - Seconda ondata: dopo 3s due meme diversi e (se possibile) direzioni diverse, simultanei
   - Poi un hint ogni 5s
   - Ogni hint: mini-shake (0.5s) e poi slide rapido verso un bordo
*/

/////////////////////// CONFIG ///////////////////////
const audioBasePath = "./eo-audio/";

// Timing richiesti
const FIRST_DELAY_MS = 1000;     // 1s dopo che tutto è pronto
const SECOND_WAVE_GAP_MS = 3000; // 3s dopo il primo
const LOOP_INTERVAL_MS = 5000;   // poi ogni 5s

// Shake + movimento
const SHAKE_MS = 500;            // mezzo secondo
const MOVE_MIN_MS = 900;         // min durata slide
const MOVE_MAX_MS = 2000;        // max durata slide
const EDGE_PADDING = 8;          // quanto stare lontano dal bordo

/////////////////////// DATA /////////////////////////
const MEMES = [
  // --- GIF/JPG/PNG ---
  { src: "https://media.tenor.com/SN6JQRO3OIgAAAAj/shrek-shrek-smile.gif", audios: ["smash-mouth-all-star.mp3"] },
  { src: "https://media1.tenor.com/m/u9J4mhaJ2yYAAAAd/shrek-meme-shrek-gif.gif", audios: ["shrek.mp3"] },
  { src: "https://media1.tenor.com/m/_Ksgzc71Fw0AAAAd/meme-goofy-face.gif", audios: ["sus-piano.mp3"] },
  { src: "https://media1.tenor.com/m/r6V_z4uEvs8AAAAd/xqc-juicer.gif", audios: ["verbatim-xqc-meme.mp3"] },
  { src: "https://media1.tenor.com/m/-yiWonLWmp4AAAAd/mad-somebodyholdme.gif", audios: ["angry-roblox.mp3"] },
  { src: "https://media1.tenor.com/m/Ow4aJ_k2rgkAAAAd/cat-monday-left-me-broken-cat.gif", audios: ["avicii-wake-me-up.mp3"] },
  { src: "https://media1.tenor.com/m/fjk1rI5fZxYAAAAd/siren-borzoi-siren-dog.gif", audios: ["danger-alarm-sound-effect-meme.mp3"] },
  { src: "https://media1.tenor.com/m/wHs3JITWApsAAAAd/galaxy-brain-meme.gif", audios: ["galaxy-meme.mp3"] },
  { src: "https://media1.tenor.com/m/spgJsx_4cdoAAAAd/me-atrapaste-es-cine.gif", audios: ["absolute-cinema-meme.mp3"] },
  { src: "https://media1.tenor.com/m/QXVs4QWLlzkAAAAd/spider-man.gif", audios: ["spiderman-meme-song.mp3"] },
  { src: "https://media1.tenor.com/m/haqt6SiJ2ywAAAAd/meow-meow-meow-meow-billie-eilish.gif", audios: ["sad-meow-song.mp3"] },
  { src: "http://media1.tenor.com/m/aSkdq3IU0g0AAAAd/laughing-cat.gif", audios: ["cat-laugh-meme-1.mp3"] },
  { src: "https://media.tenor.com/YpVqLrEIa7IAAAAj/huh-cat.gif", audios: ["huh-cat.mp3"] },
  { src: "https://media.tenor.com/8VuZc8I8f7EAAAAi/oiia-cat.gif", audios: ["oiia-oiia-sound.mp3"] },
  { src: "https://media1.tenor.com/m/hfA1tKGHkBYAAAAd/john-pork-john-pork-fortnite.gif", audios: ["cat-iphone-ringtone.mp3"] },
  { src: "https://media.tenor.com/rI_0O_9AJ5sAAAAj/nyan-cat-poptart-cat.gif", audios: ["nyan-cat_1.mp3"] },
  { src: "https://media.tenor.com/Pkz68vuQmikAAAAj/rock.gif", audios: ["vine-boom.mp3"] },
  { src: "https://media.tenor.com/8sFA07F8VdMAAAAj/cotton-eye-joe-gegagedigedagedago.gif", audios: ["gedagedigedagedago.mp3"] },
  { src: "https://media1.tenor.com/m/9niKyDAAqPoAAAAd/benjammins-holiday.gif", audios: ["nothing-beats-a-jet2-holiday_IeBO1Mr.mp3"] },
  { src: "https://media1.tenor.com/m/WarZqLGgTHoAAAAd/oh-no-cringe-cringe.gif", audios: ["oh-no-cringe.mp3"] },
  { src: "https://media1.tenor.com/m/Yn8OFus9tikAAAAd/boomshakalaka.gif", audios: ["explosion-meme_dTCfAHs.mp3"] },
  { src: "https://media.tenor.com/_HPYzqeqmkMAAAAj/giga-chad.gif", audios: ["sigma-boy-bass-boosted-caca.mp3"] },
  { src: "https://media1.tenor.com/m/1mekY2yeGWkAAAAd/sigma.gif", audios: ["sigmamy.mp3"] },
  { src: "https://media1.tenor.com/m/OroVCOXbuUUAAAAd/sadhamstergirl.gif", audios: ["sad-hamster.mp3"] },
  { src: "https://media1.tenor.com/m/LwgUKnLHjvsAAAAd/quello-esatto.gif", audios: ["leonardo-di-caprio-assovio-apontando.mp3"] },
  { src: "https://media1.tenor.com/m/FpHhGgR4zvgAAAAd/social-credit-credit.gif", audios: ["social-credit_751J4TV.mp3"] },
  { src: "https://media.tenor.com/eobRu0D3lf4AAAAj/jamma-orb-jamma.gif", audios: ["plancton-meme.mp3"] },
  { src: "https://media1.tenor.com/m/fWqq9QLFyJgAAAAd/okboomer-tamambuum%C4%B1r.gif", audios: ["peter-kuli-jedwill-ok-boomer-official-music-video-mp3cut.mp3"] },
  { src: "https://media1.tenor.com/m/H2O5Eh_gcIAAAAAd/bitaroo-bitcoin.gif", audios: ["hawk-tuah_SRaUp2L.mp3"] },
  { src: "http://media1.tenor.com/m/T1zotsnaPJsAAAAd/bruh-meme.gif", audios: ["bruh-sound-effect_WstdzdM.mp3"] },
  { src: "https://media1.tenor.com/m/71ywJRgnbcQAAAAd/eating-burning.gif", audios: ["classic_hurt.mp3"] },
  { src: "https://media.tenor.com/nUKvaF6VYa4AAAAj/cwif-catwifhat.gif", audios: ["cry-banana-cat.mp3"] },
  { src: "https://media.tenor.com/jRYJuFDaGFAAAAAj/glorp-pop-cat.gif", audios: ["cat-mouth-noise-192-kbps.mp3"] },
  { src: "https://media1.tenor.com/m/bXjzL5fdskwAAAAd/mellstroy.gif", audios: ["am-am-am-am-mellstroy.mp3"] },
  { src: "https://media.tenor.com/ewaUKtHi7AMAAAAj/lie-detector-meme.gif", audios: ["wrong-answer-sound-effect (1).mp3"] },
  { src: "https://media1.tenor.com/m/46hUIivJ_JsAAAAd/fish-i-sleep.gif", audios: ["snore-mimimimimimi.mp3"] },
  { src: "https://media1.tenor.com/m/Cnwk6nqKB3QAAAAd/horse-interview.gif", audios: ["cute-horse-interview.mp3"] },
  { src: "https://media1.tenor.com/m/u9TgsrtFDp8AAAAd/hamster-huh.gif", audios: ["dramatic.swf.mp3"] },
  { src: "https://media1.tenor.com/m/elYtbBiu9d8AAAAd/bugs-life-a-bugs-life.gif", audios: ["awkward-cricket-sound-effect.mp3"] },
  { src: "https://media1.tenor.com/m/nhqXUHVKCJcAAAAC/puppyy3533amoung-us-puppyy-kitchen-pantry-amoung-us-impostor.gif", audios: ["53b1bab6-a8c3-4a1a-82db-7110ce1c29ef_6KNDGWD.mp3"] },
  { src: "https://media1.tenor.com/m/6rbd0jOiNhgAAAAd/zoner-mitch-ray.gif", audios: ["gta-san-andreas-mission-complete-sound-hq.mp3"] },
  { src: "https://media1.tenor.com/m/0i0ZxbRgVyAAAAAd/meonly.gif", audios: ["expedientes-secretos-x-musica22.mp3"] },
  { src: "https://media1.tenor.com/m/K4xB25ACa5kAAAAd/ocean-ocean-meme.gif", audios: ["ocean-meme.mp3"] },
  { src: "https://media1.tenor.com/m/GwZEshiH6jUAAAAd/disappearing.gif", audios: ["ack.mp3"] },
  { src: "https://media1.tenor.com/m/32k0x7POPzsAAAAd/metal-pipe.gif", audios: ["jixaw-metal-pipe-falling-sound.mp3"] },
  { src: "https://media1.tenor.com/m/5daifW7gDPAAAAAd/cat.gif", audios: ["das-war-ein-befehl_6M3MPtl.mp3"] },
  { src: "https://media1.tenor.com/m/LoTSdDHzoc0AAAAd/cat-annoyed.gif", audios: ["bombastic-side-eye.mp3"] },
  { src: "https://media1.tenor.com/m/FetQ_KhWgd4AAAAd/chill-guy.gif", audios: ["chill-guy-song.mp3"] },
  { src: "https://media1.tenor.com/m/kbQv5cIBq8IAAAAd/the-office-steve-carell.gif", audios: ["nooo-god-0.mp3"] },
  { src: "https://media1.tenor.com/m/scX-kVPwUn8AAAAd/this-is-fine.gif", audios: ["fine.mp3"] },
  { src: "https://media1.tenor.com/m/DRcW0asAZnMAAAAd/technologiaaa-meme-arab.gif", audios: ["technoloyia-technologia-tecnologia.mp3"] },
  { src: "https://media1.tenor.com/m/zWJN3FozxQcAAAAd/surprised-pikachu-surprised.gif", audios: ["pikachu-pee.mp3"] },
  { src: "https://media1.tenor.com/m/3qM9y_SPvJMAAAAd/nani-steve-harvey.gif", audios: ["nani_hMQHlpR.mp3"] },
  { src: "https://media1.tenor.com/m/5xPjYqB2QVYAAAAd/emotional-kid.gif", audios: ["ssstiktok_1617758649_1.mp3"] },
  { src: "https://media1.tenor.com/m/MX6lVp7MXFoAAAAd/shaq.gif", audios: ["uuuuuu.mp3"] },
  { src: "https://media1.tenor.com/m/lus_iN-2QlUAAAAd/kardashian-kim-kardashian.gif", audios: ["they-ask-you-how-you-feel.mp3"] },
  { src: "https://media1.tenor.com/m/gnx5lOoMb0UAAAAd/%D0%B7%D0%B0%D0%BA-%D1%81%D0%BC%D0%B5%D1%85.gif", audios: ["zach-galifianakis-laugh.mp3"] },

  { src: "https://i.pinimg.com/736x/9c/67/38/9c6738bf74f94adf5ed0f9e4170cbf2d.jpg", audios: ["let-me-know.mp3"] },
  { src: "https://media1.tenor.com/m/sV-p10fX0foAAAAC/gif-emoji-dying.gif", audios: ["auughhh.mp3"] },
  { src: "https://media1.tenor.com/m/hyZ3wm5naugAAAAC/bongo-cat-button.gif", audios: ["dry-fart_3.mp3", "wrong-answer-sound-effect.mp3", "coche-claxon.mp3"] },
  { src: "https://media.tenor.com/_AZJmhAry0gAAAAi/rat-dancing-meme.gif", audios: ["rat-dance-music.mp3"] },
  { src: "https://media.tenor.com/kQA86PqyXZQAAAAi/small-dancing-white-cat-dance-funny.gif", audios: ["bailando-bailando.mp3", "dancing-ai-cat.mp3"] },
  { src: "https://static.wikitide.net/italianbrainrotwiki/2/2f/Nooo_La_Polizia.png", audios: ["noo-la-policia.mp3"] },
  { src: "https://media.tenor.com/BegUzq59qvQAAAAi/mini-impact-miniimpact.gif", audios: ["fairy-tail-wow-fairy-tail-wow.mp3"] },
  { src: "https://i.pinimg.com/originals/d5/1e/c9/d51ec9e1eb94636383c31cdfd549ec51.gif", audios: [] },
  { src: "https://media.tenor.com/gOTzyTGvt0wAAAAj/cat-wobble.gif", audios: ["wobbly-wiggly.mp3"] },
  { src: "https://media.tenor.com/dqaZmNuWIxwAAAAi/pogfish-oooo.gif", audios: ["gogogogogo.mp3"] },
  { src: "https://media.tenor.com/WZDGtj0jBDgAAAAi/mock-spongebob.gif", audios: ["spongebob-fail.mp3"] },
  { src: "https://media1.tenor.com/m/4na8hqTj6okAAAAC/spongebob-what.gif", audios: ["you-what.mp3"] },
  { src: "https://media1.tenor.com/m/9S9aYsgGYakAAAAC/fezzyka9.gif", audios: ["ary.mp3"] },
  { src: "https://media1.tenor.com/m/Q0vK2_i4zg8AAAAC/yo.gif", audios: ["boomer-extended.mp3"] },
  { src: "https://media1.tenor.com/m/wR5h6MBC3VsAAAAC/forabozo-mimimi.gif", audios: ["rich-laugh.MP3"] },
  { src: "https://media.tenor.com/am86MJSZVUwAAAAi/hehe.gif", audios: ["eheheh.mp3"] },
  { src: "https://hips.hearstapps.com/hmg-prod/images/2s9cjb-1548710537.jpg?crop=1xw:0.9523809523809523xh;center,top&resize=1200:", audios: ["is_sound.mp3"] },
  { src: "https://en.meming.world/images/en/1/1b/The_What%3F.jpg", audios: ["the_sound.mp3"] },
  { src: "https://media.tenor.com/b49RbivGBtMAAAPo/meh-goat.mp4", audios: ["meeeeee-mayimbu.mp3"] },
  { src: "https://i.pinimg.com/736x/6e/28/04/6e28044e354b92213dade3122048e93d.jpg", audios: ["diiiiiiiii.mp3"] },
  { src: "https://i.pinimg.com/originals/26/b9/66/26b9660514c1ff01beea3869562e6198.gif", audios: ["how-bout-i-sit-here-until-you-fall-asleep-mmmmmmmm-mp3cut.mp3"] },
  { src: "https://media1.tenor.com/m/0man6VITMPYAAAAd/tim-allen.gif", audios: ["tim-allen-confused.mp3"] },
  { src: "https://media1.tenor.com/m/Hg0fnO6PvzAAAAAd/sadds-man.gif", audios: ["emotional-damage-meme.mp3"] },
  { src: "https://media1.tenor.com/m/Q8Osh26rY68AAAAd/cardi-b-cardi.gif", audios: ["cardi-b-laugh_aAqBCTa.mp3"] },
  { src: "https://media.tenor.com/YpVqLrEIa7IAAAAi/huh-cat.gif", audios: ["ceeday-huh-sound-effect.mp3"] },
  { src: "https://media.tenor.com/39c7_ZNzC4MAAAAi/silly-cat-silly.gif", audios: ["happy-happy-happy-song.mp3"] },
  { src: "https://media1.tenor.com/m/D8JpDSNywwMAAAAd/oaky-okay-ok-meme-typo-oakley.gif", audios: ["okmeme_sound_effect-2nmi5x9imac.mp3"] },
  { src: "https://media1.tenor.com/m/4mKwMGyI7HIAAAAd/noice-meme-nice.gif", audios: ["noice_1.mp3"] },
  { src: "https://media1.tenor.com/m/fu5pw2B-3HsAAAAd/e-boy.gif", audios: ["ainsley_harriott_and_his_spicy_meatconverttoaudio.mp3"] },
  { src: "https://media1.tenor.com/m/1YTN6f743Z0AAAAd/scared-running.gif", audios: ["why-are-you-running-sound-effect-hd_2yraBjq.mp3"] },
  { src: "https://media1.tenor.com/m/EKPvNJqFni8AAAAd/fire.gif", audios: ["best-cry-ever-trimmed.mp3"] },
  { src: "https://media1.tenor.com/m/8m066eOzOb8AAAAd/ogli.gif", audios: ["crying-black-dude-meme.mp3"] },

  // --- NUOVE AGGIUNTE ---
  { src: "https://media1.tenor.com/m/cHwOfwjXMhUAAAAd/yaopapa-mmm-yaopapa.gif", audios: ["yapapa-cat.mp3"] },
  { src: "https://media1.tenor.com/m/Lnt2uEm1vrUAAAAd/67-67-kid.gif", audios: ["67.mp3"] },
  { src: "https://media1.tenor.com/m/NHgudHn3Q8kAAAAd/baby.gif", audios: ["sweetlove.mp3"] },
  { src: "https://tenor.com/it/view/donald-duck-winnie-the-pooh-ariel-little-mermaid-gif-14462758998790195647.gif", audios: ["sweetlove.mp3"] },
  { src: "https://media1.tenor.com/m/2dE4HVA8uz4AAAAd/pipi.gif", audios: ["pipipipi.mp3"] },
  { src: "https://media1.tenor.com/m/XE24_3OQK8cAAAAd/gravewalker-kung-fu-panda.gif", audios: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-e-lutador.mp3"] },
  { src: "https://media.tenor.com/OcmcdA8l8NoAAAAj/skeleton-sword.gif", audios: ["skeleton-with-shield.mp3"] },
];

/////////////////////// STATE + ELEMENTS ///////////////////////
let audioEnabled = false;

const $playground = document.getElementById("playground");
const $doraLayer = document.getElementById("dora-layer");
const $dora = document.getElementById("dora");
const $snail = document.getElementById("snail");
const $teethUp = document.getElementById("teeth-up");
const $teethDown = document.getElementById("teeth-down");

const SNAIL_TRAVEL_MS = 60000;

/////////////////////// UTILS ///////////////////////
function randGaussian() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function clamp(x, min, max) { return Math.min(max, Math.max(min, x)); }

const MEME_WIDTH_PX = (() => {
  const style = getComputedStyle(document.documentElement);
  const val = style.getPropertyValue("--meme-width").trim();
  return parseFloat(val.replace("px", "")) || 220;
})();

function getChildRect(wrapper) {
  const child = wrapper.firstElementChild;
  if (!child) return { width: wrapper.offsetWidth, height: wrapper.offsetHeight };
  const r = child.getBoundingClientRect?.();
  if (r && r.width && r.height) return { width: r.width, height: r.height };
  if (child.tagName === "VIDEO" && child.videoWidth && child.videoHeight) {
    const approxW = MEME_WIDTH_PX * 0.5;
    return { width: approxW, height: approxW * (child.videoHeight / child.videoWidth) };
  }
  return { width: MEME_WIDTH_PX * 0.5, height: MEME_WIDTH_PX * 0.375 };
}

function randomPosWithin(containerW, containerH, elW, elH) {
  const cx = containerW / 2, cy = containerH / 2;
  const sigmaX = containerW / 4.2, sigmaY = containerH / 4.2;
  let x = cx + randGaussian() * sigmaX - elW / 2;
  let y = cy + randGaussian() * sigmaY - elH / 2;
  x = clamp(x, 0, Math.max(0, containerW - elW));
  y = clamp(y, 0, Math.max(0, containerH - elH));
  return { x, y };
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function isMobileEO() {
  return window.matchMedia && window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches;
}

function shuffledCopy(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getActiveMemes() {
  if (!isMobileEO()) return MEMES;
  const isSmallPhone = window.matchMedia && window.matchMedia('(max-width: 480px)').matches;
  const fallbackLimit = isSmallPhone ? 18 : 26;
  const configuredLimit = isSmallPhone
    ? (window.EO_MOBILE_MEME_LIMIT || fallbackLimit)
    : (window.EO_TABLET_MEME_LIMIT || window.EO_MOBILE_MEME_LIMIT || fallbackLimit);
  const limit = Math.max(1, Math.min(MEMES.length, Number(configuredLimit) || fallbackLimit));
  return shuffledCopy(MEMES).slice(0, limit);
}

function getPointer(e) { if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY }; return { x: e.clientX, y: e.clientY }; }

/////////////////////// INTERACTION ///////////////////////
function makeDraggable(wrapper) {
  let startX = 0, startY = 0, origX = 0, origY = 0, dragging = false;
  const onDown = (e) => {
    e.preventDefault(); dragging = true; wrapper.dataset.dragging = "1"; wrapper.style.cursor = "grabbing";
    const p = getPointer(e); startX = p.x; startY = p.y; origX = wrapper.offsetLeft; origY = wrapper.offsetTop; wrapper.setPointerCapture?.(e.pointerId || 0);
  };
  const onMove = (e) => {
    if (!dragging) return; const p = getPointer(e); const dx = p.x - startX, dy = p.y - startY;
    const { width: visW, height: visH } = getChildRect(wrapper);
    const maxX = window.innerWidth - visW, maxY = window.innerHeight - visH;
    wrapper.style.left = `${clamp(origX + dx, 0, Math.max(0, maxX))}px`;
    wrapper.style.top = `${clamp(origY + dy, 0, Math.max(0, maxY))}px`;
  };
  const onUp = (e) => { dragging = false; wrapper.dataset.dragging = "0"; wrapper.style.cursor = "grab"; try { wrapper.releasePointerCapture?.(e.pointerId || 0); } catch (_) { } };
  wrapper.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}

function bindHoverAudio(wrapper, audioList) {
  if (!audioList || audioList.length === 0) return;
  const audioEl = new Audio();
  audioEl.preload = "auto";
  audioEl.loop = true;
  let lastPick = null;

  const pickNext = () => {
    let pick = pickRandom(audioList);
    if (audioList.length > 1) {
      let safety = 4;
      while (pick === lastPick && safety-- > 0) pick = pickRandom(audioList);
    }
    lastPick = pick;
    audioEl.src = audioBasePath + pick;
    audioEl.load();
  };

  // Prepara subito il file audio: al touch non deve perdere tempo a scegliere/caricare la sorgente.
  pickNext();

  const tryPlay = () => {
    if (!audioEnabled) return;
    if (!audioEl.src) pickNext();
    try { audioEl.currentTime = 0; } catch (_) { }
    audioEl.play().catch(() => { });
  };

  const stop = () => {
    audioEl.pause();
    try { audioEl.currentTime = 0; } catch (_) { }
    pickNext();
  };

  // Desktop: resta il comportamento originale hover.
  wrapper.addEventListener("mouseenter", () => {
    wrapper.classList.add("hovering");
    tryPlay();
  });
  wrapper.addEventListener("mouseleave", () => {
    wrapper.classList.remove("hovering");
    stop();
  });

  // Mobile/touch: il suono parte appena tocchi la card, anche mentre la trascini.
  wrapper.addEventListener("pointerdown", () => {
    wrapper.classList.add("hovering");
    tryPlay();
  });

  const stopTouchAudio = () => {
    wrapper.classList.remove("hovering");
    stop();
  };
  wrapper.addEventListener("pointerup", stopTouchAudio);
  wrapper.addEventListener("pointercancel", stopTouchAudio);
  window.addEventListener("pointerup", stopTouchAudio);
  window.addEventListener("pointercancel", stopTouchAudio);
}

/////////////////////// CREATION ///////////////////////
function createMemeElement(item) {
  const w = document.createElement("div");
  w.className = "meme";
  w.dataset.dragging = "0";
  w.dataset.moving = "0";

  const lower = item.src.toLowerCase();
  let el;
  if (lower.endsWith(".mp4")) {
    el = document.createElement("video");
    el.src = item.src;
    el.muted = true; el.loop = true; el.autoplay = true; el.playsInline = true;
  } else {
    el = document.createElement("img");
    el.src = item.src; el.alt = "meme"; el.decoding = "async"; el.loading = "eager";
  }
  w.appendChild(el);
  $playground.appendChild(w);

  let resolveReady;
  const ready = new Promise(res => { resolveReady = res; });

  const place = () => {
    const { width: visW, height: visH } = getChildRect(w);
    const { x, y } = randomPosWithin(
      window.innerWidth, window.innerHeight,
      visW || MEME_WIDTH_PX * 0.5,
      visH || MEME_WIDTH_PX * 0.375
    );
    w.style.left = `${x}px`;
    w.style.top = `${y}px`;
  };

  if (el.tagName === "IMG") {
    if (el.complete) { place(); resolveReady(); }
    else el.addEventListener("load", () => { place(); resolveReady(); }, { once: true });
  } else {
    if (el.readyState >= 1) { place(); resolveReady(); }
    else el.addEventListener("loadedmetadata", () => { place(); resolveReady(); }, { once: true });
  }

  makeDraggable(w);
  bindHoverAudio(w, item.audios);

  return { wrapper: w, ready };
}

function init() {
  const readyPromises = [];
  getActiveMemes().forEach(item => {
    const { ready } = createMemeElement(item);
    readyPromises.push(ready);
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".meme").forEach(w => {
      const { width: visW, height: visH } = getChildRect(w);
      const x = clamp(w.offsetLeft, 0, Math.max(0, window.innerWidth - visW));
      const y = clamp(w.offsetTop, 0, Math.max(0, window.innerHeight - visH));
      w.style.left = `${x}px`; w.style.top = `${y}px`;
    });
  });

  // Risolve quando tutte le IMG hanno ‘load’ e tutti i VIDEO ‘loadedmetadata’
  return Promise.allSettled(readyPromises);
}

/////////////////////// HINTS (shake + slide) ///////////////////////

/** mini-shake sul wrapper: rotazione a dx/sx e ritorno (Web Animations API) */
function shake(wrapper) {
  try {
    wrapper.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(7deg)" },
        { transform: "rotate(-7deg)" },
        { transform: "rotate(4deg)" },
        { transform: "rotate(-4deg)" },
        { transform: "rotate(0deg)" },
      ],
      { duration: SHAKE_MS, easing: "ease-in-out" }
    );
  } catch (_) { }
}

/** Calcola target in base a hint {axis:'x'|'y', dir:-1|1} oppure verso il bordo più lontano */
function computeTarget(wrapper, hint) {
  const { width: visW, height: visH } = getChildRect(wrapper);
  const maxX = Math.max(0, window.innerWidth - visW);
  const maxY = Math.max(0, window.innerHeight - visH);
  const curLeft = wrapper.offsetLeft || 0;
  const curTop = wrapper.offsetTop || 0;

  let axis = hint?.axis || (Math.random() < 0.7 ? 'x' : 'y');
  let dir = hint?.dir;
  let targetLeft = curLeft;
  let targetTop = curTop;

  if (axis === 'x') {
    if (dir == null) {
      // verso bordo più lontano
      const distL = curLeft;
      const distR = Math.max(0, maxX - curLeft);
      targetLeft = (distL > distR) ? EDGE_PADDING : Math.max(0, maxX - EDGE_PADDING);
    } else {
      targetLeft = dir < 0 ? EDGE_PADDING : Math.max(0, maxX - EDGE_PADDING);
    }
  } else {
    if (dir == null) {
      const distT = curTop;
      const distB = Math.max(0, maxY - curTop);
      targetTop = (distT > distB) ? EDGE_PADDING : Math.max(0, maxY - EDGE_PADDING);
    } else {
      targetTop = dir < 0 ? EDGE_PADDING : Math.max(0, maxY - EDGE_PADDING);
    }
  }
  return { targetLeft, targetTop, travel: Math.max(Math.abs(targetLeft - curLeft), Math.abs(targetTop - curTop)) };
}

/** Slide rapido verso il target; risolve quando finito */
function slide(wrapper, hint) {
  return new Promise(res => {
    const { targetLeft, targetTop, travel } = computeTarget(wrapper, hint);

    // durata proporzionale ma rapida
    const duration = clamp(Math.round(travel * 1.8), MOVE_MIN_MS, MOVE_MAX_MS);
    const old = wrapper.style.transition;
    wrapper.dataset.moving = "1";
    wrapper.style.transition = `left ${duration}ms cubic-bezier(.2,.7,.2,1), top ${duration}ms cubic-bezier(.2,.7,.2,1)`;

    requestAnimationFrame(() => {
      wrapper.style.left = `${targetLeft}px`;
      wrapper.style.top = `${targetTop}px`;
    });

    setTimeout(() => {
      wrapper.style.transition = old || "";
      wrapper.dataset.moving = "0";
      res();
    }, duration + 40);
  });
}

/** Un'azione completa: shake (0.5s) poi slide; risolve quando finito */
async function shakeThenSlide(wrapper, hint) {
  if (!wrapper || wrapper.dataset.dragging === "1" || wrapper.dataset.moving === "1") return;
  shake(wrapper);
  await new Promise(r => setTimeout(r, SHAKE_MS));
  await slide(wrapper, hint);
}

function getCandidates() {
  return Array.from(document.querySelectorAll(".meme"))
    .filter(w => w.dataset.dragging !== "1" && w.dataset.moving !== "1");
}

// Restituisce due hint diversi (assi o direzioni diverse)
function twoDifferentHints() {
  const axisA = Math.random() < 0.7 ? 'x' : 'y';
  const dirA = Math.random() < 0.5 ? -1 : 1;

  // prova a differenziare: o cambio asse o inverto dir
  let axisB = axisA;
  let dirB = dirA;

  if (Math.random() < 0.5) {
    axisB = axisA === 'x' ? 'y' : 'x';
  } else {
    dirB = -dirA;
  }
  return [{ axis: axisA, dir: dirA }, { axis: axisB, dir: dirB }];
}

/////////////////////// SCHEDULER ///////////////////////
function startHintSchedule() {
  // 1) primo hint 1s dopo che tutto è pronto
  setTimeout(async () => {
    const list = getCandidates();
    if (list.length === 0) return;
    const w = pickRandom(list);
    await shakeThenSlide(w);

    // 2) dopo 3s due simultanei con direzioni diverse
    setTimeout(() => {
      const pool = getCandidates();
      if (pool.length < 1) return;
      const hints = twoDifferentHints();
      const first = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      const second = pool.length > 0 ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0] : null;

      const p1 = shakeThenSlide(first, hints[0]);
      const p2 = second ? shakeThenSlide(second, hints[1]) : Promise.resolve();

      // 3) da lì in poi ogni 5s uno
      Promise.all([p1, p2]).then(() => {
        setInterval(() => {
          const cands = getCandidates();
          if (cands.length === 0) return;
          const pick = pickRandom(cands);
          shakeThenSlide(pick); // hint random (asse/direzione calcolati al volo)
        }, LOOP_INTERVAL_MS);
      });
    }, SECOND_WAVE_GAP_MS);

  }, FIRST_DELAY_MS);
}

/////////////////////// SNAIL + TEETH ///////////////////////
function animateSnailToQuarter() {
  const startLeft = window.innerWidth + 20;
  $snail.style.left = `${startLeft}px`;

  function computeTargetLeft() {
    const w = $snail.getBoundingClientRect().width || 120;
    const quarter = window.innerWidth * 0.25;
    return Math.round(quarter - w / 2);
  }
  let targetLeft = computeTargetLeft();
  let dist = startLeft - targetLeft;
  const startTime = performance.now();

  function freezeSnailVideo() {
    if ($snail.tagName !== "VIDEO") return;
    if ($snail.readyState < 1) {
      $snail.addEventListener("loadedmetadata", freezeSnailVideo, { once: true });
      return;
    }
    $snail.pause();
    try { $snail.currentTime = Math.max(0, $snail.duration - 0.05); } catch (_) { }
  }

  function step(now) {
    targetLeft = computeTargetLeft();
    dist = startLeft - targetLeft;
    const t = clamp((now - startTime) / SNAIL_TRAVEL_MS, 0, 1);
    const left = Math.round(startLeft - dist * t);
    $snail.style.left = `${left}px`;
    if (left <= targetLeft || t >= 1) { freezeSnailVideo(); return; }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setupTeethRedirectAfterClick() {
  let upDone = false, downDone = false;
  const tryRedirect = () => { if (upDone && downDone) window.location.href = "dh-pill/dh-pill-index.html"; };
  $teethUp.addEventListener("animationend", () => { upDone = true; tryRedirect(); }, { once: true });
  $teethDown.addEventListener("animationend", () => { downDone = true; tryRedirect(); }, { once: true });
}

/////////////////////// BOOT ///////////////////////
function startSecondSection() {
  audioEnabled = true;

  document.body.classList.add("teeth-on");
  document.body.classList.remove("intro");
  document.body.classList.remove("cards-ready");
  document.body.classList.add("bg-into");

  // Nasconde il bottone di avvio
  const startBtn = document.getElementById("start-btn");
  if (startBtn) startBtn.classList.add("hidden");

  // Snail: appare ora, mantiene animazione ma NON è cliccabile
  try { $snail.style.pointerEvents = "none"; } catch (_) { }
  try { $snail.style.cursor = "default"; } catch (_) { }
  animateSnailToQuarter();

  setupTeethRedirectAfterClick();

  $doraLayer.classList.remove("hidden");
  $doraLayer.setAttribute("aria-hidden", "false");
  try { if ($dora) $dora.play().catch(() => { }); } catch (e) { }
  $playground.classList.remove("hidden");

  // crea tutti i meme, poi parte la sequenza (1s -> 3s -> loop 5s)
  const ready = init();
  ready.then(() => {
    // Lo sfondo statico compare solo quando le card sono state create/caricate.
    document.body.classList.add("cards-ready");
    startHintSchedule();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      startBtn.disabled = true;
      startSecondSection();
    });
  }
});
