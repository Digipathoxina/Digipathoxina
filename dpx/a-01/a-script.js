// a-script.js
// Fa comparire testo e GLB contemporaneamente
window.startAPillExperience = async function startAPillExperience({
  videoSrc,
  glbSrc,
  showGlbAt = 17,
  redirectTo = '/Digiphatoxina/index.html',
  fadeMs = 900,
  cameraOrbit = '190deg 60deg 6m',
  earlyGlbSeconds = 2
} = {}) {
  const root = document.createElement('div');
  root.className = 'a-exp';
  root.style.setProperty('--fade-ms', `${fadeMs}ms`);
  document.body.appendChild(root);

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

  // Testo (inizialmente nascosto)
  const txt = document.createElement('div');
  txt.className = 'a-text';
  txt.textContent = 'lorem lorem lorem lorem lorem';
  root.appendChild(txt);

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
    txt.classList.add('show'); // <<< FA APPARIRE IL TESTO INSIEME AL GLB
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
