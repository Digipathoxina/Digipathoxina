/* ===== DH-503 mobile helpers =====
   Keeps desktop behavior untouched, then fine-tunes layout on phone/tablet. */
(function () {
  const mobileQuery = window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)');

  function applyViewportHeight() {
    document.documentElement.style.setProperty('--dh-vh', `${window.innerHeight * 0.01}px`);
  }

  function markMode() {
    document.documentElement.classList.toggle('dh-mobile', mobileQuery.matches);
  }

  function placeMobileBottomUI() {
    if (!mobileQuery.matches) return;

    const bottomCenter = document.querySelector('.bottom-center');
    if (bottomCenter) {
      bottomCenter.style.position = 'fixed';
      bottomCenter.style.left = '50%';
      bottomCenter.style.top = 'auto';
      bottomCenter.style.bottom = `max(14px, env(safe-area-inset-bottom))`;
      bottomCenter.style.transform = 'translateX(-50%)';
      bottomCenter.style.width = `min(92vw, 520px)`;
    }
  }

  function keepCardPreviewPortrait() {
    if (!mobileQuery.matches) return;

    const cardVideo = document.getElementById('cardVid');
    if (!cardVideo) return;

    cardVideo.setAttribute('playsinline', '');
    cardVideo.setAttribute('webkit-playsinline', '');
    cardVideo.muted = true;
  }



  function avoidAsciiCenterForStartKeys() {
    if (!mobileQuery.matches) return;

    const keysField = document.getElementById('keysField');
    if (!keysField) return;

    const keys = [...keysField.querySelectorAll('.access-key:not(.is-correct)')];
    const ascii = keysField.querySelector('.access-key.is-correct');

    // Scritta ASCII sempre al centro dello schermo.
    if (ascii) {
      ascii.style.position = 'absolute';
      ascii.style.left = '50%';
      ascii.style.top = '50%';
      ascii.style.transform = 'translate(-50%, -50%)';
      ascii.style.textAlign = 'center';
      ascii.style.zIndex = '3';
    }

    if (!keys.length) return;

    // Zona vietata: il centro dove c'è la scritta ASCII.
    // Più allarghi questi valori, più le chiavi stanno lontane dal centro.
    const forbidden = {
      leftMin: 18,
      leftMax: 82,
      topMin: 40,
      topMax: 60
    };

    function randomBetween(min, max) {
      return min + Math.random() * (max - min);
    }

    function randomSafePosition() {
      let left;
      let top;
      let attempts = 0;

      do {
        left = randomBetween(6, 88);
        top = randomBetween(22, 78);
        attempts += 1;
      } while (
        attempts < 80 &&
        left > forbidden.leftMin &&
        left < forbidden.leftMax &&
        top > forbidden.topMin &&
        top < forbidden.topMax
      );

      return { left, top };
    }

    keys.forEach((key) => {
      const pos = randomSafePosition();
      key.style.position = 'absolute';
      key.style.left = `${pos.left}%`;
      key.style.top = `${pos.top}%`;
      key.style.transform = 'translate(-50%, -50%)';
      key.style.zIndex = '2';
    });
  }

  function refreshMobileLayout() {
    applyViewportHeight();
    markMode();
    keepCardPreviewPortrait();
    // dh-script.js riposiziona l'input in base al video: ripassiamo dopo per il layout mobile.
    setTimeout(placeMobileBottomUI, 0);
    setTimeout(placeMobileBottomUI, 80);
    setTimeout(placeMobileBottomUI, 220);
    setTimeout(avoidAsciiCenterForStartKeys, 0);
    setTimeout(avoidAsciiCenterForStartKeys, 120);
    setTimeout(avoidAsciiCenterForStartKeys, 300);
  }

  window.addEventListener('load', refreshMobileLayout);
  window.addEventListener('resize', refreshMobileLayout);
  window.addEventListener('orientationchange', () => setTimeout(refreshMobileLayout, 250));

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', refreshMobileLayout);
    window.visualViewport.addEventListener('scroll', refreshMobileLayout);
  }

  document.addEventListener('click', () => {
    if (!mobileQuery.matches) return;
    setTimeout(placeMobileBottomUI, 80);
  }, { passive: true });
})();
