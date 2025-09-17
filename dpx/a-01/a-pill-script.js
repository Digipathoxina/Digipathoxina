// a-pill-script.js
(function () {
  // Offset hover
  const NAME_OFFSET = { x: -270, y: -70 };
  const INFO_OFFSET = { x: 90, y: 10 };
  const NOISE_ALPHA = 0.12;
  const NOISE_FPS_MS = 110;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function placeHover(e, hoverName, hoverInfo) {
    const margin = 8;
    [hoverName, hoverInfo].forEach(el => {
      if (el.style.display !== 'block') { el.style.display = 'block'; el.style.opacity = '0'; }
    });
    const rn = hoverName.getBoundingClientRect();
    const ri = hoverInfo.getBoundingClientRect();

    let nx = e.clientX + NAME_OFFSET.x;
    let ny = e.clientY + NAME_OFFSET.y;
    let ix = e.clientX + INFO_OFFSET.x;
    let iy = e.clientY + INFO_OFFSET.y;

    nx = clamp(nx, margin, innerWidth - rn.width - margin);
    ny = clamp(ny, margin, innerHeight - rn.height - margin);
    ix = clamp(ix, margin, innerWidth - ri.width - margin);
    iy = clamp(iy, margin, innerHeight - ri.height - margin);

    hoverName.style.left = `${nx}px`; hoverName.style.top = `${ny}px`;
    hoverInfo.style.left = `${ix}px`; hoverInfo.style.top = `${iy}px`;
  }

  // Noise
  function resizeNoiseCanvas(canvas){ canvas.width = innerWidth; canvas.height = innerHeight; }
  function drawNoise(ctx, alphaFrac){
    const w = ctx.canvas.width, h = ctx.canvas.height;
    const img = ctx.createImageData(w, h);
    const buf = new Uint32Array(img.data.buffer);
    const a = Math.floor(255 * alphaFrac);
    for (let i = 0; i < buf.length; i++) {
      const v = (Math.random() * 255) | 0;
      buf[i] = (a << 24) | (v << 16) | (v << 8) | v;
    }
    ctx.putImageData(img, 0, 0);
  }
  function startNoiseLoop(canvas){
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    resizeNoiseCanvas(canvas);
    let raf = null;
    function tick(ts){
      if (!tick.last || ts - tick.last > NOISE_FPS_MS) {
        drawNoise(ctx, NOISE_ALPHA);
        tick.last = ts;
      }
      raf = requestAnimationFrame(tick);
    }
    addEventListener('resize', () => resizeNoiseCanvas(canvas));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }

  document.querySelectorAll('.pill-section').forEach(root => {
    const noiseCanvas = root.querySelector('.noise-canvas');
    const pill = root.querySelector('.pill-img');
    const langWrap = document.getElementById('lang-switch');
    const hoverName = root.querySelector('.hover-name');
    const hoverInfo = root.querySelector('.hover-info');

    const cfg = {
      targetUrl: root.dataset.targetUrl || '#',
      langDefault: (root.dataset.langDefault || 'eng').toLowerCase(),
      pillSrc: root.dataset.pillSrc || 'tablets_a.png',
      nameEng: root.dataset.hoverNameEng || 'a-pill/a_name_eng.png',
      infoEng: root.dataset.hoverInfoEng || 'a-pill/a_info_eng.png',
      nameIta: root.dataset.hoverNameIta || 'a-pill/a_name_ita.png',
      infoIta: root.dataset.hoverInfoIta || 'a-pill/a_info_ita.png',
    };

    startNoiseLoop(noiseCanvas);

    let currentLang = (cfg.langDefault === 'ita') ? 'ita' : 'eng';
    let pillHovering = false;
    let hoverInfoTimer = null;

    pill.src = cfg.pillSrc;

    function updateLangUI(){
      if (!langWrap) return;
      langWrap.querySelectorAll('.lang').forEach(btn => {
        const pressed = btn.dataset.lang === currentLang;
        btn.classList.toggle('active', pressed);
        btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      });
    }
    updateLangUI();

    if (langWrap){
      langWrap.classList.add('show');
      langWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang'); if (!btn) return;
        currentLang = (btn.dataset.lang === 'ita') ? 'ita' : 'eng';
        updateLangUI();
        if (pillHovering){
          const srcs = (currentLang === 'eng')
            ? { name: cfg.nameEng, info: cfg.infoEng }
            : { name: cfg.nameIta, info: cfg.infoIta };
          hoverName.src = srcs.name; hoverInfo.src = srcs.info;
        }
      });
    }

    pill.addEventListener('pointerenter', (e) => {
      pillHovering = true;
      [hoverName, hoverInfo].forEach(el => { el.style.display = 'block'; el.style.opacity = '0'; });
      const srcs = (currentLang === 'eng')
        ? { name: cfg.nameEng, info: cfg.infoEng }
        : { name: cfg.nameIta, info: cfg.infoIta };
      hoverName.src = srcs.name; hoverInfo.src = srcs.info;

      placeHover(e, hoverName, hoverInfo);
      requestAnimationFrame(() => { placeHover(e, hoverName, hoverInfo); hoverName.style.opacity = '1'; });

      if (hoverInfoTimer) clearTimeout(hoverInfoTimer);
      hoverInfoTimer = setTimeout(() => { if (pillHovering) hoverInfo.style.opacity = '1'; hoverInfoTimer = null; }, 2000);
    });
    pill.addEventListener('pointermove', (e) => placeHover(e, hoverName, hoverInfo));
    ['pointerleave','pointerdown'].forEach(ev => {
      pill.addEventListener(ev, () => {
        pillHovering = false;
        if (hoverInfoTimer){ clearTimeout(hoverInfoTimer); hoverInfoTimer = null; }
        hoverName.style.opacity = '0'; hoverInfo.style.opacity = '0';
        setTimeout(() => {
          if (!pillHovering){ hoverName.style.display = 'none'; hoverInfo.style.display = 'none'; }
        }, 360);
      });
    });

    // CLICK → esperienza A
    pill.addEventListener('click', async () => {
      pillHovering = false;
      if (hoverInfoTimer){ clearTimeout(hoverInfoTimer); hoverInfoTimer = null; }

      // Sfondo nero immediato
      document.documentElement.style.background = '#000';
      document.body.style.background = '#000';
      document.body.style.overflow = 'hidden';

      // Svuota body
      document.querySelectorAll('body > *').forEach(el => { if (el !== root) el.remove(); });
      root.remove();

      // Carica CSS esperienza
      await new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'a-styles.css';
        link.onload = resolve; link.onerror = reject;
        document.head.appendChild(link);
      });

      // Carica JS esperienza
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'a-script.js';
        s.defer = true;
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });

      // Avvia
      if (window.startAPillExperience) {
        window.startAPillExperience({
          videoSrc: 'modgirl97.mp4',
          glbSrc: 'modgirl97.glb',
          showGlbAt: 17, // secondi
          redirectTo: '/Digiphatoxina/index.html',
          fadeMs: 900
        });
      } else {
        console.error('startAPillExperience non trovato');
      }
    });
  });
})();
