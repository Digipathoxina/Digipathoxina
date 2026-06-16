/* =========================================================
   IC-CTRL — MOBILE ONLY
   Caricare questo file al posto degli script desktop.

   Cosa fa:
   - salta completamente il pre-intro/personaggio;
   - mostra subito il titolo LGM-30A;
   - usa audio_ic.mp3 come audio iniziale mobile;
   - disattiva i pop-up della fase desktop;
   - mostra un piccolo hint se il browser blocca autoplay.
   ========================================================= */
(function () {
  'use strict';

  window.__IC_MOBILE__ = true;

  const MOBILE_AUDIO_SRC = 'audio_ic.mp3';

  let originalWindowOpen = null;
  let audio = null;
  let titles = null;
  let hint = null;

  function disablePopupsHard() {
    // Evita aperture indesiderate in questa prima versione mobile.
    if (!originalWindowOpen) originalWindowOpen = window.open;
    window.open = function () { return null; };

    try {
      document.dispatchEvent(new CustomEvent('phase:popups:disable'));
    } catch (_) {}

    const popupNotice = document.getElementById('popupNotice');
    if (popupNotice) {
      popupNotice.classList.add('hidden');
      popupNotice.style.display = 'none';
    }
  }

  function removeDesktopCharacterAndPanels() {
    document
      .querySelectorAll('.h-char, .h-bubble, .h-wallpaper, .p2-image, .p2-shadow-b, .p2-shadow-l, .p2-glitch')
      .forEach(function (el) {
        try { el.remove(); } catch (_) { el.style.display = 'none'; }
      });

    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
      langSwitch.classList.remove('show');
      langSwitch.style.display = 'none';
    }
  }

  function ensureHint() {
    if (hint) return hint;
    hint = document.createElement('div');
    hint.id = 'mobileAudioHint';
    hint.textContent = 'Tocca LGM per attivare il suono';
    document.body.appendChild(hint);
    return hint;
  }

  function showHint() {
    ensureHint().classList.add('show');
  }

  function hideHint() {
    if (hint) hint.classList.remove('show');
  }

  function setupTitles() {
    titles = document.getElementById('titles');
    if (!titles) return;

    titles.classList.remove('hidden', 'fadeout');
    titles.classList.add('show');
    titles.setAttribute('role', 'button');
    titles.setAttribute('aria-label', 'Avvia audio');
  }

  function setupAudio() {
    audio = document.getElementById('intro-audio');

    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'intro-audio';
      document.body.prepend(audio);
    }

    audio.src = MOBILE_AUDIO_SRC;
    audio.preload = 'auto';
    audio.loop = false;
    audio.setAttribute('playsinline', '');
  }

  async function playMobileAudio() {
    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
      await audio.play();
      hideHint();
    } catch (_) {
      // Su molti telefoni l'audio parte solo dopo un tap dell'utente.
      showHint();
    }
  }

  function bindUserStart() {
    const start = function () {
      playMobileAudio();
    };

    if (titles) titles.addEventListener('click', start);
    document.addEventListener('touchstart', start, { once: true, passive: true });
    document.addEventListener('pointerdown', start, { once: true });
  }

  function initMobile() {
    disablePopupsHard();
    removeDesktopCharacterAndPanels();
    setupTitles();
    setupAudio();
    bindUserStart();
    playMobileAudio();

    // Se per sbaglio uno script desktop viene caricato dopo, ripulisco di nuovo.
    setTimeout(function () {
      disablePopupsHard();
      removeDesktopCharacterAndPanels();
      setupTitles();
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobile, { once: true });
  } else {
    initMobile();
  }
})();
