/* ===== Mobile helpers =====
   Mantiene la stessa esperienza del sito desktop, ma aggiunge piccoli adattamenti
   utili su telefono. Non crea nessuna immagine sostitutiva. */

(function () {
  const isMobileLike = window.matchMedia
    && window.matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)').matches;

  if (!isMobileLike) return;

  document.documentElement.classList.add('is-mobile-experience');

  function setViewportHeight() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  }

  function tuneModelViewerForMobile() {
    const mv = document.getElementById('mv');
    if (!mv) return;

    mv.setAttribute('camera-orbit', '0deg 80deg 0.23m');
    mv.setAttribute('rotation-per-second', '4deg');
    mv.setAttribute('interaction-prompt', 'none');
  }

  function tuneVideoForMobile() {
    const video = document.getElementById('replacement-video');
    if (!video) return;

    video.classList.add('mobile-portrait-video');
    video.setAttribute('playsinline', '');
  }

  setViewportHeight();
  window.addEventListener('resize', setViewportHeight, { passive: true });
  window.addEventListener('orientationchange', setViewportHeight, { passive: true });

  function initMobileExperience() {
    tuneModelViewerForMobile();
    tuneVideoForMobile();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileExperience);
  } else {
    initMobileExperience();
  }
})();
