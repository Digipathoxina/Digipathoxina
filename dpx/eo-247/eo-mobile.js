/* ===== EO-247 mobile helpers =====
   Piccoli fix JS per rendere la stessa esperienza più stabile su telefono. */
(function () {
  // Riduce davvero il numero di card create solo su mobile.
  // eo-script.js legge questi valori quando parte la seconda sezione.
  window.EO_MOBILE_MEME_LIMIT = 60;
  window.EO_TABLET_MEME_LIMIT = 60;

  const mobileQuery = window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)');

  function applyViewportHeight() {
    document.documentElement.style.setProperty('--eo-vh', `${window.innerHeight * 0.01}px`);
  }

  function markMode() {
    document.documentElement.classList.toggle('eo-mobile', mobileQuery.matches);
  }

  function swapMobileTeethImages() {
    const up = document.getElementById('teeth-up');
    const down = document.getElementById('teeth-down');
    if (!up || !down) return;

    if (mobileQuery.matches) {
      if (up.getAttribute('src') !== 'teeth-up-mobile.png') {
        up.setAttribute('src', 'teeth-up-mobile.png');
      }
      if (down.getAttribute('src') !== 'teeth-down-mobile.png') {
        down.setAttribute('src', 'teeth-down-mobile.png');
      }
    } else {
      if (up.getAttribute('src') !== 'teeth-up.png') {
        up.setAttribute('src', 'teeth-up.png');
      }
      if (down.getAttribute('src') !== 'teeth-down.png') {
        down.setAttribute('src', 'teeth-down.png');
      }
    }
  }

  function clampVisibleMemes() {
    if (!mobileQuery.matches) return;
    document.querySelectorAll('.meme').forEach((meme) => {
      const rect = meme.getBoundingClientRect();
      const maxLeft = Math.max(0, window.innerWidth - rect.width);
      const maxTop = Math.max(0, window.innerHeight - rect.height);
      const left = Math.min(Math.max(0, meme.offsetLeft || 0), maxLeft);
      const top = Math.min(Math.max(0, meme.offsetTop || 0), maxTop);
      meme.style.left = `${left}px`;
      meme.style.top = `${top}px`;
    });
  }

  function bindTouchFeedback() {
    if (!mobileQuery.matches) return;
    document.addEventListener('pointerdown', (event) => {
      const meme = event.target.closest && event.target.closest('.meme');
      if (!meme) return;
      meme.classList.add('mobile-active');
    }, { passive: true });

    document.addEventListener('pointerup', () => {
      document.querySelectorAll('.meme.mobile-active').forEach((meme) => {
        meme.classList.remove('mobile-active');
      });
    }, { passive: true });

    document.addEventListener('pointercancel', () => {
      document.querySelectorAll('.meme.mobile-active').forEach((meme) => {
        meme.classList.remove('mobile-active');
      });
    }, { passive: true });
  }

  window.addEventListener('load', () => {
    applyViewportHeight();
    markMode();
    swapMobileTeethImages();
    bindTouchFeedback();
    setTimeout(clampVisibleMemes, 250);
  });

  window.addEventListener('resize', () => {
    applyViewportHeight();
    markMode();
    swapMobileTeethImages();
    setTimeout(clampVisibleMemes, 120);
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      applyViewportHeight();
      swapMobileTeethImages();
      clampVisibleMemes();
    }, 250);
  });
})();
