(function () {
  const audio = document.getElementById('intro-audio');
  const titles = document.getElementById('titles');

  const ASSET_BASE = 'gif_lgm-30a/';

  const PNG_POOL = [
    { src: ASSET_BASE + 'LGM-30A_1.png' },
    { src: ASSET_BASE + 'LGM-30A_1-2.png' },
    { src: ASSET_BASE + 'LGM-30A_2.png' },
    { src: ASSET_BASE + 'LGM-30A_2-2.png' },
    { src: ASSET_BASE + 'LGM-30A_3.png' },
    { src: ASSET_BASE + 'LGM-30A_3-2.png' },
    { src: ASSET_BASE + 'LGM-30A_4.png' },
    { src: ASSET_BASE + 'LGM-30A_4-2.png' },
    { src: ASSET_BASE + 'LGM-30A_5.png' },
    { src: ASSET_BASE + 'LGM-30A_5-2.png' },
    { src: ASSET_BASE + 'LGM-30A_6.png' },
    { src: ASSET_BASE + 'LGM-30A_6-2.png' },
    { src: ASSET_BASE + 'LGM-30A_7.png' },
    { src: ASSET_BASE + 'LGM-30A_7-2.png' },
    { src: ASSET_BASE + 'LGM-30A_8.png' },
    { src: ASSET_BASE + 'LGM-30A_8-2.png' },
    { src: ASSET_BASE + 'LGM-30A_9.png' },
    { src: ASSET_BASE + 'LGM-30A_9-2.png' },
    { src: ASSET_BASE + 'LGM-30A_10.png' },
    { src: ASSET_BASE + 'LGM-30A_10-2.png' }
  ];

  const FINAL_GIF = { src: ASSET_BASE + 'LGM-30A_11.gif', keep: true };

  function shuffleArray(items) {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  function buildImageSequence() {
    return [
      ...shuffleArray(PNG_POOL).slice(0, 10),
      FINAL_GIF
    ];
  }

  // Effetto pubblicità/pop-up: apertura rapida interrotta + immagine che entra.
  const WINDOW_OPEN_MS = 330;
  const WINDOW_INTERRUPT_AT = 0.78;
  const WINDOW_CLEAR_MS = 80;
  const IMAGE_VISIBLE_MS = 360;
  const IMAGE_FADE_MS = 50;

  let sequenceStarted = false;
  let stage = null;
  let currentImage = null;
  const imageCache = new Map();

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function showTitles() {
    if (!titles) return;
    titles.classList.remove('hidden');
    void titles.offsetWidth;
    titles.classList.add('show');
  }

  function playAudioFromStart() {
    if (!audio) return Promise.resolve();
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = true;
      return audio.play();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function unlockAudioOnFirstInteraction() {
    const retry = () => {
      playAudioFromStart().catch(() => {});
      window.removeEventListener('click', retry);
      window.removeEventListener('touchstart', retry);
      window.removeEventListener('keydown', retry);
    };

    window.addEventListener('click', retry, { once: true });
    window.addEventListener('touchstart', retry, { once: true });
    window.addEventListener('keydown', retry, { once: true });
  }

  function ensureStage() {
    if (stage) return stage;
    stage = document.createElement('div');
    stage.id = 'lgm-stage';
    document.body.appendChild(stage);
    return stage;
  }

  function preloadImage(src) {
    if (imageCache.has(src)) return imageCache.get(src);

    const promise = new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(img);
      img.src = src;
    });

    imageCache.set(src, promise);
    return promise;
  }

  function preloadAllImages() {
    [...PNG_POOL, FINAL_GIF].forEach(cfg => preloadImage(cfg.src));
  }

  async function interruptedGreyWindowTransition() {
    const st = ensureStage();
    const win = document.createElement('div');
    win.className = 'lgm-grey-window';

    // Non arriva a tutto schermo: resta una finestra/parziale sovrapposta.
    const baseSize = window.matchMedia('(max-width: 768px)').matches ? 18 : 22;
    const finalSize = Math.ceil(Math.hypot(window.innerWidth || 0, window.innerHeight || 0) * 0.96);
    const finalScale = Math.max(1, finalSize / baseSize);

    win.style.setProperty('--lgm-base-size', baseSize + 'px');
    win.style.setProperty('--lgm-final-scale', finalScale);
    win.style.setProperty('--lgm-open-ms', WINDOW_OPEN_MS + 'ms');

    st.appendChild(win);

    // Doppio frame + reflow: aiuta il telefono a non saltare l'animazione.
    await new Promise(resolve => requestAnimationFrame(resolve));
    void win.offsetWidth;
    await new Promise(resolve => requestAnimationFrame(resolve));
    win.classList.add('open');

    // L'immagine entra prima che il riquadro finisca l'apertura.
    await sleep(Math.round(WINDOW_OPEN_MS * WINDOW_INTERRUPT_AT));
    win.classList.add('interrupted');

    return win;
  }

  async function closeGreyWindow(win) {
    if (!win) return;
    await sleep(WINDOW_CLEAR_MS);
    win.classList.add('clear');
    await sleep(IMAGE_FADE_MS);
    win.remove();
  }

  async function clearCurrentImage() {
    if (!currentImage) return;
    currentImage.classList.remove('show');
    currentImage.classList.add('hide');
    await sleep(IMAGE_FADE_MS);
    currentImage.remove();
    currentImage = null;
  }

  function createWhitePage() {
    const st = ensureStage();
    const page = document.createElement('div');
    page.className = 'lgm-white-page';
    st.appendChild(page);

    requestAnimationFrame(() => page.classList.add('show'));
    return page;
  }

  async function removeWhitePage(page) {
    if (!page) return;
    page.classList.remove('show');
    page.classList.add('hide');
    await sleep(IMAGE_FADE_MS);
    page.remove();
  }

  async function showCenteredImage(cfg, index, loadedImage) {
    const st = ensureStage();
    const loaded = loadedImage || await preloadImage(cfg.src);

    const img = document.createElement('img');
    img.className = 'lgm-center-image';

    if (cfg.keep) {
      img.classList.add('is-final');
    } else if ((cfg.src || '').toLowerCase().endsWith('.png')) {
      img.classList.add('is-png');
    }

    img.src = loaded.src || cfg.src;
    img.alt = 'LGM-30A_' + (index + 1);
    img.draggable = false;

    st.appendChild(img);
    currentImage = img;

    await new Promise(resolve => requestAnimationFrame(resolve));
    img.classList.add('show');
  }


  async function showExitButtonAfterDelay() {
    await sleep(2000);

    const st = ensureStage();
    if (st.querySelector('.lgm-exit-button')) return;

    const link = document.createElement('a');
    link.className = 'lgm-exit-button';
    link.href = 'eo-pill/eo-pill.html';
    link.setAttribute('aria-label', 'Esci');

    const icon = document.createElement('img');
    icon.src = 'exit.png';
    icon.alt = 'Exit';
    icon.draggable = false;

    link.appendChild(icon);
    st.appendChild(link);

    await new Promise(resolve => requestAnimationFrame(resolve));
    link.classList.add('show');
  }

  async function startImageSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    if (titles) {
      titles.classList.add('fadeout');
      titles.style.pointerEvents = 'none';
    }

    ensureStage();

    const imageSequence = buildImageSequence();

    for (let i = 0; i < imageSequence.length; i++) {
      const cfg = imageSequence[i];

      await clearCurrentImage();

      // Precarico prima: niente blocchi grigi se il telefono è lento.
      const loaded = await preloadImage(cfg.src);

      const win = await interruptedGreyWindowTransition();
      const page = createWhitePage();

      await showCenteredImage(cfg, i, loaded);
      await closeGreyWindow(win);

      if (cfg.keep) {
        showExitButtonAfterDelay();
        break;
      }

      await sleep(IMAGE_VISIBLE_MS);
      await removeWhitePage(page);
    }
  }

  function bindTitleStart() {
    if (!titles) return;

    titles.addEventListener('click', () => {
      playAudioFromStart().catch(() => {});
      startImageSequence();
    });

    titles.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      ev.preventDefault();
      playAudioFromStart().catch(() => {});
      startImageSequence();
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    showTitles();
    bindTitleStart();
    preloadAllImages();

    playAudioFromStart().catch(() => {
      if (titles) titles.classList.add('clickable');
      unlockAudioOnFirstInteraction();
    });
  });
})();
