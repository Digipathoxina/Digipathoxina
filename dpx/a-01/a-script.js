// a-script.js
// Fa comparire testo e GLB contemporaneamente
window.startAPillExperience = async function startAPillExperience({
  videoSrc,
  glbSrc,
  showGlbAt = 17,
  redirectTo = '/Digiphatoxina/index.html',
  fadeMs = 10000,
  cameraOrbit = '190deg 60deg 6m',
  earlyGlbSeconds = 0
} = {}) {
  const root = document.createElement('div');
  root.className = 'a-exp';
  root.style.setProperty('--fade-ms', `${fadeMs}ms`);
  document.body.appendChild(root);


  // Cursore di supporto: evita l'effetto "sparisce" su sfondi chiari.
  // Non sostituisce il cursore di sistema: è solo un piccolo marker con mix-blend-mode.
  const cursorDot = document.createElement('div');
  cursorDot.className = 'a-cursor';
  root.appendChild(cursorDot);

  const moveCursor = (x, y) => {
    cursorDot.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseMove = (e) => moveCursor(e.clientX, e.clientY);
  const onTouchMove = (e) => {
    if (!e.touches || !e.touches[0]) return;
    moveCursor(e.touches[0].clientX, e.touches[0].clientY);
  };

  root.addEventListener('mousemove', onMouseMove);
  root.addEventListener('touchmove', onTouchMove, { passive: true });
  root.addEventListener('mouseenter', () => cursorDot.classList.add('on'));
  root.addEventListener('mouseleave', () => cursorDot.classList.remove('on'));


  // Video
  const video = document.createElement('video');
  video.className = 'a-video';
  video.src = videoSrc;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';
  video.preload = 'auto';
  video.controls = false;
  root.appendChild(video);

  // Carica model-viewer
  await new Promise((resolve, reject) => {
    const m = document.createElement('script');
    m.type = 'module';
    m.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    m.onload = resolve; m.onerror = reject;
    document.head.appendChild(m);
  });

// Testi (inizialmente nascosti) — invisibili (bianco trasparente) ma selezionabili
const textEls = [];

const makeText = (content, posClass) => {
  const el = document.createElement('div');
  el.className = 'a-text';
  if (posClass) el.classList.add(posClass);
  el.textContent = content;
  root.appendChild(el);
  textEls.push(el);
  return el;
};

// Testo principale (mantiene formattazione con 
makeText(
  `Forse sto impazzendo…
Si forse non riesco a stare sola ma non è un problema finché ho te.
A me Internet ha salvato…`,
  'pos-lb'
);

// Altri testi “sparsi” ai lati del modello (mai davanti/sopra al centro)
// (La posizione è più "casuale" a ogni apertura; il testo principale resta dov'è.)
const sideTexts = [
  makeText(`Stai calma, stai calma.`, 'pos-lt'),
  makeText(`No, smettila, lo sai che non succede. è lui che mi rovina.`, 'pos-rt'),
  makeText(
    `Perché allora scrivono questo...
“Malattia collaborativa”? “ pozzo comportamentale”? come se fossimo tutti malati insieme?
Cazzate.`,
    'pos-lm'
  ),
  makeText(
    `Perché una dipendenza dovrebbe contare meno solo perché non è una “sostanza”?`,
    'pos-rm'
  ),
  makeText(`Eppure sono lucida.`, 'pos-rb2'),
  makeText(`Ho il mio ruolo in questo fottuto sistema.`, 'pos-rb')
];

// Randomizza la posizione rimanendo ai lati (mai davanti al centro/modello)
const randomizeSideTextPositions = () => {
  const pad = 24;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // zona centrale "vietata": circa 46% della larghezza centrata (dove sta il modello)
  const forbiddenLeft = vw * 0.27;
  const forbiddenRight = vw * 0.73;

  // fascia laterale dove mettere i testi
  const sideMaxW = Math.max(160, Math.min(vw * 0.22, 360));

  // piccola griglia per non sovrapporli troppo
  const used = [];
  const collides = (r) => used.some(u => !(r.right < u.left || r.left > u.right || r.bottom < u.top || r.top > u.bottom));

  for (const el of sideTexts) {
    // reset (ma non tocca colore/visibilità)
    el.style.top = '';
    el.style.bottom = '';
    el.style.left = '';
    el.style.right = '';
    el.style.transform = '';
    el.style.maxWidth = '';

    // decide lato
    const side = (Math.random() < 0.5) ? 'left' : 'right';
    el.style.maxWidth = `${Math.max(220, Math.min(sideMaxW, 420))}px`;

    // prova alcune volte a trovare una posizione ok
    let placed = false;
    for (let attempt = 0; attempt < 30 && !placed; attempt++) {
      // y casuale
      const y = pad + Math.random() * (vh - pad * 2);

      // x in fascia laterale
      if (side === 'left') {
        const x = pad + Math.random() * (sideMaxW - pad);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      } else {
        const x = pad + Math.random() * (sideMaxW - pad);
        el.style.right = `${x}px`;
        el.style.top = `${y}px`;
        el.style.textAlign = 'right';
      }

      // misura
      const rect = el.getBoundingClientRect();

      // evita la zona centrale
      const inForbidden = !(rect.right < forbiddenLeft || rect.left > forbiddenRight);

      // evita overflow verticale
      const overflow = rect.top < pad || rect.bottom > (vh - pad);

      // evita sovrapposizioni forti
      const hit = collides(rect);

      if (!inForbidden && !overflow && !hit) {
        used.push(rect);
        placed = true;
      }
    }

    // fallback: se non trova, forza in alto/basso lato
    if (!placed) {
      if (Math.random() < 0.5) {
        el.style.top = `${pad}px`;
      } else {
        el.style.top = `${Math.max(pad, vh - 140)}px`;
      }
      if (Math.random() < 0.5) el.style.left = `${pad}px`;
      else el.style.right = `${pad}px`;
    }
  }
};

// aspetta layout pronto
requestAnimationFrame(() => randomizeSideTextPositions());
window.addEventListener('resize', () => randomizeSideTextPositions());
// GLB
  const mv = document.createElement('model-viewer');
  mv.className = 'a-model';
  mv.setAttribute('src', glbSrc);
  mv.setAttribute('reveal', 'manual');
  mv.setAttribute('interaction-prompt', 'none');
  mv.setAttribute('camera-controls', '');
  mv.setAttribute('disable-zoom', '');
  mv.setAttribute('touch-action', 'pan-y');
  mv.setAttribute('camera-orbit', cameraOrbit);

  let modelReady = false;
  mv.addEventListener('load', () => { modelReady = true; });
  mv.addEventListener('error', e => console.error('Errore model-viewer:', e));
  root.appendChild(mv);

  // Disattiva doppio click
  mv.addEventListener('dblclick', e => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  // Overlay bianco finale
  const overlay = document.createElement('div');
  overlay.className = 'black-overlay';
  root.appendChild(overlay);

  try { await video.play(); }
  catch (e) { console.warn('Autoplay fallito:', e); }

  const triggerTime = Math.max(0, showGlbAt - Math.abs(earlyGlbSeconds));
  let glbShown = false;

  async function revealModelAndText() {
    if (glbShown) return;
    glbShown = true;

    if (!modelReady) {
      await new Promise(resolve => {
        const onLoad = () => { mv.removeEventListener('load', onLoad); resolve(); };
        mv.addEventListener('load', onLoad);
        setTimeout(resolve, 2000);
      });
    }
    try { mv.dismissPoster(); } catch (_) {}
    mv.classList.add('show');
    for (const t of textEls) t.classList.add('show'); // <<< FA APPARIRE I TESTI INSIEME AL GLB
  }

  const checkTime = () => {
    if (!glbShown && video.currentTime >= triggerTime) revealModelAndText();
  };
  video.addEventListener('timeupdate', checkTime);
  video.addEventListener('seeked', checkTime);

  // Fine video
  const endAndRedirect = () => {
    overlay.classList.add('on');
    root.classList.add('fade-out');
    setTimeout(() => { window.location.href = redirectTo; }, fadeMs + 50);
  };
  video.addEventListener('ended', endAndRedirect);
  video.addEventListener('timeupdate', () => {
    if (video.duration && video.currentTime >= video.duration - 0.15) endAndRedirect();
  });

  // Shortcut H+K per saltare al GLB
  let hkTriggered = false;
  const pressed = new Set();
  const checkHK = () => {
    if (hkTriggered) return;
    if (pressed.has('h') && pressed.has('k')) {
      hkTriggered = true;
      const target = Math.min(
        Math.max(triggerTime + 0.05, video.currentTime),
        (isFinite(video.duration) && video.duration) ? video.duration - 0.2 : triggerTime + 0.05
      );
      try { video.currentTime = target; } catch (_) {}
      revealModelAndText();
      setTimeout(() => { hkTriggered = false; }, 400);
    }
  };
  window.addEventListener('keydown', e => {
    const k = (e.key || '').toLowerCase();
    if (k === 'h' || k === 'k') { pressed.add(k); checkHK(); }
  });
  window.addEventListener('keyup', e => {
    const k = (e.key || '').toLowerCase();
    if (k === 'h' || k === 'k') pressed.delete(k);
  });
  window.addEventListener('blur', () => pressed.clear());

  // Evita pinch-zoom su mobile
  mv.addEventListener('touchstart', e => {
    if (e.touches.length >= 2) e.preventDefault();
  }, { passive: false });
};
