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

  function refreshMobileLayout() {
    applyViewportHeight();
    markMode();
    keepCardPreviewPortrait();
    // dh-script.js riposiziona l'input in base al video: ripassiamo dopo per il layout mobile.
    setTimeout(placeMobileBottomUI, 0);
    setTimeout(placeMobileBottomUI, 80);
    setTimeout(placeMobileBottomUI, 220);
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
