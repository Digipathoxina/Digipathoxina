/* ===== Mobile view controller =====
   Rimpiazza il vecchio redirect a index_phone.html.
   Se il dispositivo sembra telefono/tablet, aggiunge una classe al body
   e crea l'immagine phone_paper.jpg dentro index.html. */

(function () {
  const uaIsMobile = /Mobi|Android|iPhone|iPod|Windows Phone/i.test(navigator.userAgent);
  const isiPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isTouchLike = window.matchMedia
    && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const isPhoneOrTablet = uaIsMobile || isiPadOS || isTouchLike;

  if (!isPhoneOrTablet) return;

  document.documentElement.classList.add('is-mobile-view');

  function initMobileView() {
    document.body.classList.add('is-mobile-view');

    if (document.querySelector('.mobile-phone-paper')) return;

    const phoneImage = document.createElement('img');
    phoneImage.className = 'mobile-phone-paper';
    phoneImage.src = 'phone_paper.jpg';
    phoneImage.alt = 'Phone paper';

    document.body.appendChild(phoneImage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileView);
  } else {
    initMobileView();
  }
})();
