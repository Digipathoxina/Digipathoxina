// intro.js
(() => {
  // Blocca l’avvio della tua parte finché non diamo il via
  window.__holdCiStart = true;

  // ===== LINGUA =====
  const LANG = { current: 'eng' }; // default inglese
  const TEXTS = {
    eng: {
      headline: "To continue you need to disable the pop-up blocker.",
      button:   "Got it",
      blocked:  "Pop-ups still blocked. Please disable the pop-up blocker and try again."
    },
    ita: {
      headline: "Per proseguire devi disattivare il blocco dei pop-up.",
      button:   "Ho capito",
      blocked:  "I pop-up risultano ancora bloccati. Disattiva il blocco e riprova."
    }
  };
  const t = (k) => (TEXTS[LANG.current] && TEXTS[LANG.current][k]) || TEXTS.ita[k];

  // ===== HELLO KITTY ASSET =====
  const HK = {
    enter: "hk_animation/hk_enter.webm",
    hello: "hk_animation/hk_hello.webm",
    exit:  "hk_animation/hk_exit.webm",
    size:  240,
    pos:   { right: 0, bottom: 180 },
    png:   "hk_animation/hk_default.png"
  };

  // ===== STATE DOM =====
  let root = null, vA = null, vB = null, standby = null, active = 'A';

  // ===== VIDEO HELPERS =====
  function getA() { return active === 'A' ? vA : vB; }
  function getB() { return active === 'A' ? vB : vA; }
  function hardHide(v) { v.style.opacity = '0'; v.style.zIndex = '1'; try { v.pause(); } catch {} }
  function show(v, now = false) {
    v.style.zIndex = '2';
    if (now) { v.style.opacity = '1'; return; }
    // micro reflow
    void v.offsetWidth;
    v.style.transition = 'opacity 80ms linear';
    v.style.opacity = '1';
    setTimeout(() => { v.style.transition = ''; }, 100);
  }
  function swap() {
    const old = getA(), nw = getB();
    show(nw, true);
    hardHide(old);
    active = (active === 'A') ? 'B' : 'A';
  }
  function loadOn(v, src) {
    return new Promise(res => {
      const ok = () => { v.removeEventListener('canplaythrough', ok); res(); };
      v.addEventListener('canplaythrough', ok, { once: true });
      v.src = src; v.load();
    });
  }
  async function play(src, { useStandby = true } = {}) {
    const hidden = getB();
    hidden.loop = false;
    await loadOn(hidden, src);
    try { hidden.currentTime = 0; } catch {}
    show(hidden, true);
    try { await hidden.play(); } catch {}
    swap();
    if (useStandby) {
      // quando finisce torna PNG
      standby.style.opacity = '0';
      getA().onended = () => { standby.style.opacity = '1'; };
    }
    return getA();
  }

  // ===== BUBBLE MOUNT =====
  function mountHK() {
    root = document.createElement('div');
    root.className = 'h-char h-noselect';
    Object.assign(root.style, {
      position: 'fixed',
      right: HK.pos.right + 'px',
      bottom: HK.pos.bottom + 'px',
      width: HK.size + 'px',
      zIndex: '2147483647',
      pointerEvents: 'auto'
    });

    vA = document.createElement('video');
    vB = document.createElement('video');
    [vA, vB].forEach(v => {
      Object.assign(v.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: 'auto',
        opacity: '0',
        zIndex: '1',
        pointerEvents: 'none'
      });
      v.playsInline = true;
      v.muted = true;
      v.preload = 'auto';
    });
    vA.style.opacity = '1';
    vA.style.zIndex  = '2';
    root.appendChild(vA);
    root.appendChild(vB);

    standby = document.createElement('img');
    standby.src = HK.png;
    standby.alt = 'HK';
    Object.assign(standby.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: 'auto',
      zIndex: '3',
      opacity: '0',
      transition: 'opacity .08s linear',
      pointerEvents: 'none'
    });
    root.appendChild(standby);

    const bubble = document.createElement('div');
    bubble.className = 'h-bubble';
    bubble.innerHTML = `
      <span class="h-bubble-text" id="hk_bubble_text"></span>
      <button type="button" class="h-btn" id="hk_btn"></button>
    `;
    // puoi regolare nel CSS: .h-bubble { position:absolute; bottom:-10px; ... }
    root.appendChild(bubble);

    document.body.appendChild(root);
    requestAnimationFrame(() => root.classList.add('show'));

    return bubble;
  }

  // ===== TYPEWRITER LIGHT =====
  function type(el, text, cps = 24, done) {
    const ms = Math.max(18, Math.round(1000 / cps));
    el.textContent = '';
    let i = 0;
    (function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, ms);
      } else {
        done && done();
      }
    })();
  }

  // ===== AUDIO PRIME (opzionale) =====
  function primeAudio() {
    const a = document.getElementById('intro-audio');
    if (!a) return Promise.resolve();
    return a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
  }

  // ===== LANG SWITCH =====
  function initLangSwitch() {
    const sw = document.getElementById('lang-switch');
    if (!sw) return;
    sw.style.display = 'flex';
    sw.classList.add('show');
    sw.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-lang]');
      if (!btn) return;
      const L = btn.getAttribute('data-lang');
      if (!L || (L !== 'ita' && L !== 'eng')) return;
      LANG.current = L;
      sw.querySelectorAll('.lang').forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      // Aggiorna testo bubble se già montata
      const btxt = document.getElementById('hk_bubble_text');
      const bb   = document.getElementById('hk_btn');
      if (btxt) btxt.textContent = t('headline');
      if (bb)   bb.textContent   = t('button');
    });
  }

  // ===== PROBE POPUP REALE =====
  // Apre un vero popup (about:blank), ci scrive, poi lo chiude dopo ~200ms.
  // Ritorna true se è riuscito ad aprirlo (⇒ pop-up consentiti).
  function __openProbePopup() {
    let w = null;
    try {
      w = window.open(
        'about:blank',
        'probe_' + Math.random().toString(36).slice(2),
        'popup=yes,width=240,height=160,noopener,noreferrer,menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=no'
      );
    } catch (e) {}
    if (!w || w.closed) return false;
    try {
      w.document.write('<!doctype html><title>Probe</title><p style="font:14px/1.2 Arial;padding:6px">ok</p>');
      w.document.close();
    } catch (e) {}
    setTimeout(() => { try { w.close(); } catch(e) {} }, 200);
    return true;
  }

  // ===== FLOW =====
  async function runIntro() {
    initLangSwitch();

    const bubble = mountHK();
    const txtEl  = bubble.querySelector('#hk_bubble_text');
    const btn    = bubble.querySelector('#hk_btn');

    // ENTRATA
    await play(HK.enter, { useStandby: false });
    getA().onended = async () => {
      try { getA().pause(); } catch {}
      // SALUTO
      await play(HK.hello, { useStandby: true });

      // Mostra bubble e scrive headline
      bubble.classList.add('show');
      type(txtEl, t('headline'), 24, () => {
        btn.textContent = t('button');
        btn.classList.add('show');
      });

      // Disabilita il bottone finché non passa il probe automatico
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '.6';

      // PROVA AUTOMATICA (fa comparire la notifica del blocco se presente)
      setTimeout(() => {
        const ok = __openProbePopup();
        if (ok) {
          // Pop-up già sbloccati → abilito bottone
          btn.disabled = false;
          btn.style.pointerEvents = '';
          btn.style.opacity = '';
        } else {
          // Bloccati → messaggio e abilito bottone solo per RIPROVARE (gesture utente)
          txtEl.textContent = t('blocked');
          btn.disabled = false;
          btn.style.pointerEvents = '';
          btn.style.opacity = '';
        }
      }, 150);

      // Al click: riprova il probe; solo se passa → procede ed esce HK
      btn.addEventListener('click', async () => {
        // Prime audio (se presente)
        await primeAudio();

        const okNow = __openProbePopup();
        if (!okNow) {
          // Ancora bloccato → resta nella intro
          txtEl.textContent = t('blocked');
          return;
        }

        // OK: chiudi bubble e fai uscire HK, poi sblocca il resto del sito
        try {
          bubble.classList.add('hide');
          setTimeout(() => { try { bubble.remove(); } catch {} }, 220);

          const v = await play(HK.exit, { useStandby: true });
          v.onended = () => {
            try { v.pause(); } catch {}
            try { root.remove(); } catch {}
            window.__holdCiStart = false;
            document.dispatchEvent(new CustomEvent('intro:proceed'));
          };
        } catch {
          try { root.remove(); } catch {}
          window.__holdCiStart = false;
          document.dispatchEvent(new CustomEvent('intro:proceed'));
        }
      }, { once: true });
    };
  }

  window.addEventListener('DOMContentLoaded', runIntro);
})();
