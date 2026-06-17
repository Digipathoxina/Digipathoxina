/* =========================================================
   MOBILE ONLY - CA-R34
   - crea una scena separata da ruotare su telefono
   - attiva la rotazione dopo il primo click sulla donnina
   - aggiunge supporto touch agli elementi già gestiti via mouse
   ========================================================= */

(function () {
  const MOBILE_QUERY = "(max-width: 900px)";

  function isMobileWidth() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function resetMobileSliderCursors() {
    if (!isMobileWidth()) return;
    if (!document.body.classList.contains("mobile-landscape-active")) return;

    requestAnimationFrame(() => {
      document.querySelectorAll(".slider .cursore").forEach((cursor) => {
        const slider = cursor.closest(".slider");
        if (!slider) return;

        const trackH = slider.offsetHeight || 190;
        const knobH = cursor.offsetHeight || 42;
        const max = Math.max(0, trackH - knobH);

        /* I cursori vengono creati dal JS desktop prima della rotazione mobile.
           Li riposizioniamo appena entra la modalità telefono, così partono già
           appoggiati alla loro barra e non si sistemano solo dopo il primo tocco. */
        cursor.style.top = max + "px";
      });
    });
  }

  function patchSpecialFountainOrigin() {
    if (typeof spawnFountainBurst !== "function") return;

    const originalSpawnFountainBurst = spawnFountainBurst;

    spawnFountainBurst = function mobileCenteredFountainBurst() {
      if (!isMobileWidth() || !document.body.classList.contains("mobile-landscape-active")) {
        return originalSpawnFountainBurst.apply(this, arguments);
      }

      const fountain = document.getElementById("fountain");
      const stage = document.querySelector(".mobile-rotate-stage");
      if (!fountain || !stage) return 0;

      const burst = document.createElement("div");
      burst.className = "fountain-burst";
      fountain.appendChild(burst);

      const baseX = stage.offsetWidth / 2;
      const baseY = stage.offsetHeight - 34;

      const LINKS = 30;
      const STAGGER = 45;
      const DURATION = 5200;
      const PEAK = stage.offsetHeight * 0.78;
      const SPREAD = Math.min(320, stage.offsetWidth * 0.34);
      const totalMs = (LINKS - 1) * STAGGER + DURATION;

      const links = (typeof SPECIAL_LINKS !== "undefined" && Array.isArray(SPECIAL_LINKS)) ? SPECIAL_LINKS : ["#"];
      const dirs = Array.from({ length: LINKS }, (_, i) => (i < LINKS / 2 ? -1 : 1));
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
      }

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const smooth01 = (t) => t * t * (3 - 2 * t);

      for (let i = 0; i < LINKS; i++) {
        const dir = dirs[i];
        setTimeout(() => {
          const a = document.createElement("a");
          a.textContent = `link-${i + 1}`;
          a.href = links[i % links.length];
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.style.pointerEvents = "auto";
          a.style.zIndex = "9999";
          burst.appendChild(a);

          const startX = baseX + (Math.random() * 40 - 20);
          const startY = baseY + (Math.random() * 18 - 9);
          const y0 = startY + 25;
          const sideAmp = (SPREAD * (0.65 + Math.random() * 0.55)) * dir;
          const xEnd = startX + sideAmp;
          const yEnd = startY + 120;
          const born = performance.now();
          const targetRot = -80 * dir;

          const tick = (now) => {
            const t = (now - born) / DURATION;
            if (t >= 1) { a.remove(); return; }
            const u = easeOutCubic(t);
            const yPar = y0 - (PEAK * (4 * u * (1 - u)));
            const y = yPar + (yEnd - y0) * (u * u);
            const x = startX + (xEnd - startX) * (u * u);
            let rot = 90;
            if (u > 0.48) {
              const p = smooth01((u - 0.48) / 0.52);
              rot = 90 + (targetRot - 90) * p;
            }
            const fadeIn = Math.min(1, t / 0.10);
            const fadeOut = 1 - Math.max(0, (t - 0.55) / 0.45);
            const op = Math.max(0, Math.min(1, fadeIn * fadeOut));
            a.style.left = x + "px";
            a.style.top = y + "px";
            a.style.opacity = String(op);
            a.style.transform = `rotate(${rot}deg)`;
            requestAnimationFrame(tick);
          };

          a.style.left = startX + "px";
          a.style.top = y0 + "px";
          a.style.opacity = "0";
          a.style.transform = "rotate(90deg)";
          requestAnimationFrame(tick);
        }, i * STAGGER);
      }

      setTimeout(() => {
        try { burst.remove(); } catch (_) {}
      }, totalMs + 1500);

      return totalMs;
    };
  }

  function limitSpecialFountainOnMobile() {
    if (typeof triggerEvent !== "function") return;

    const originalTriggerEvent = triggerEvent;
    let running = false;
    let lastStartedAt = 0;

    triggerEvent = async function mobileSafeTriggerEvent() {
      if (isMobileWidth()) {
        const now = Date.now();
        if (running || now - lastStartedAt < 6500) return 0;
        running = true;
        lastStartedAt = now;
        try {
          return await originalTriggerEvent.apply(this, arguments);
        } finally {
          running = false;
        }
      }

      return originalTriggerEvent.apply(this, arguments);
    };
  }

  function createMobileStage() {
    if (document.querySelector(".mobile-rotate-stage")) return;

    const stage = document.createElement("div");
    stage.className = "mobile-rotate-stage";

    const nodesToMove = Array.from(document.body.childNodes).filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        if (el.tagName === "SCRIPT") return false;
        if (el.classList.contains("mobile-rotate-stage")) return false;
      }
      return true;
    });

    document.body.insertBefore(stage, document.body.firstChild);
    nodesToMove.forEach((node) => stage.appendChild(node));
  }

  function activateLandscapeAfterFirstClick() {
    const donnina = document.getElementById("donnina");
    if (!donnina) return;

    donnina.addEventListener("click", () => {
      if (!isMobileWidth()) return;
      document.body.classList.add("mobile-landscape-active");
      resetMobileSliderCursors();
      setTimeout(resetMobileSliderCursors, 120);
      setTimeout(resetMobileSliderCursors, 450);
    });
  }

  function makeMouseEvent(type, touch, coordsOverride) {
    const clientX = coordsOverride && typeof coordsOverride.clientX === "number" ? coordsOverride.clientX : touch.clientX;
    const clientY = coordsOverride && typeof coordsOverride.clientY === "number" ? coordsOverride.clientY : touch.clientY;

    return new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 0,
      buttons: type === "mouseup" ? 0 : 1,
      clientX,
      clientY,
      screenX: touch.screenX || clientX,
      screenY: touch.screenY || clientY
    });
  }

  function getMobileDragCoords(touch, target) {
    if (!document.body.classList.contains("mobile-landscape-active")) {
      return { clientX: touch.clientX, clientY: touch.clientY };
    }

    const slider = target.closest(".slider");

    /* La scena mobile è ruotata di 90°. Per gli slider orizzontali il movimento
       naturale del dito corrisponde meglio all'asse Y dello schermo. Lo amplifichiamo
       leggermente per rendere il trascinamento meno faticoso. */
    if (slider && slider.classList.contains("horizontal")) {
      const rect = slider.getBoundingClientRect();
      const dx = touch.clientX - (rect.left + rect.width / 2);
      const dy = touch.clientY - (rect.top + rect.height / 2);

      /* Usa l'asse dominante del gesto, senza amplificare troppo: prima lo slider
         correva e arrivava al terzo step troppo spesso, generando troppi link. */
      const axis = Math.abs(dx) > Math.abs(dy) ? touch.clientX : touch.clientY;
      return {
        clientX: axis,
        clientY: touch.clientY
      };
    }

    return { clientX: touch.clientX, clientY: touch.clientY };
  }

  function enableTouchToMouseBridge() {
    let activeTarget = null;
    let activeSlider = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let synthStartX = 0;
    let synthStartY = 0;

    function coordsForActiveTouch(touch) {
      if (!activeSlider) return getMobileDragCoords(touch, activeTarget);

      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const isHorizontal = activeSlider.classList.contains("horizontal");

      if (isHorizontal) {
        /* Manteniamo il comportamento già sistemato per gli orizzontali,
           ma lo rendiamo stabile anche se il dito non segue perfettamente la barra. */
        const movement = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        return {
          clientX: synthStartX + movement,
          clientY: synthStartY
        };
      }

      /* Slider verticali laterali:
         dopo la rotazione CSS il gesto del dito può arrivare come asse X o Y.
         Proiettiamo il movimento sull'asse più evidente e lo passiamo al JS desktop
         come movimento verticale, così il cursore non resta bloccato. */
      const movement = Math.abs(dy) >= Math.abs(dx) ? dy : -dx;
      return {
        clientX: synthStartX,
        clientY: synthStartY + movement * 1.15
      };
    }

    document.addEventListener("touchstart", (e) => {
      if (!isMobileWidth()) return;

      /* IMPORTANTE:
         Non intercettiamo #donnina: deve ricevere il suo click nativo,
         altrimenti il primo tap viene bloccato e non parte il reveal. */
      let target = e.target.closest(".cursore, .slider, .cerchio, .cerchio-btn, .btn-top, .btn-bottom, #nav-btn");
      if (!target || !e.touches.length) return;

      /* Se tocchi l'asta o l'area invisibile dello slider, facciamo partire
         comunque il drag dal suo cursore: su mobile è molto più naturale. */
      const touchedSlider = target.closest(".slider");
      if (touchedSlider && !target.classList.contains("cursore")) {
        const cursor = touchedSlider.querySelector(".cursore");
        if (cursor) target = cursor;
      }

      activeTarget = target;
      activeSlider = target.closest(".slider");

      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      synthStartX = touch.clientX;
      synthStartY = touch.clientY;

      target.dispatchEvent(makeMouseEvent("mousedown", touch, coordsForActiveTouch(touch)));
      e.preventDefault();
    }, { passive: false });

    document.addEventListener("touchmove", (e) => {
      if (!isMobileWidth() || !activeTarget || !e.touches.length) return;

      const touch = e.touches[0];
      window.dispatchEvent(makeMouseEvent("mousemove", touch, coordsForActiveTouch(touch)));
      e.preventDefault();
    }, { passive: false });

    document.addEventListener("touchend", (e) => {
      if (!isMobileWidth() || !activeTarget) return;

      const touch = e.changedTouches[0] || { clientX: touchStartX, clientY: touchStartY, screenX: touchStartX, screenY: touchStartY };
      window.dispatchEvent(makeMouseEvent("mouseup", touch, coordsForActiveTouch(touch)));

      /* Per bottoni semplici convertiamo anche il tap in click.
         Slider e cerchi usano invece mousedown/mousemove/mouseup. */
      if (activeTarget.matches(".cerchio-btn, .btn-top, .btn-bottom, #nav-btn")) {
        activeTarget.click();
      }

      activeTarget = null;
      activeSlider = null;
      e.preventDefault();
    }, { passive: false });
  }

  function enableIdleDemo() {
    let timers = [];
    let sequenceRunning = false;

    function clearTimers() {
      timers.forEach((t) => clearTimeout(t));
      timers = [];
    }

    function addTimer(fn, ms) {
      const t = setTimeout(fn, ms);
      timers.push(t);
      return t;
    }

    function removeDemoClasses() {
      document.querySelectorAll(".mobile-idle-demo-circle, .mobile-idle-demo-cursor").forEach((el) => {
        el.classList.remove("mobile-idle-demo-circle", "mobile-idle-demo-cursor");
      });
    }

    function pickRandomCursor() {
      const cursors = Array.from(document.querySelectorAll(".slider .cursore"));
      if (!cursors.length) return null;
      return cursors[Math.floor(Math.random() * cursors.length)];
    }

    function runGuideSequence() {
      if (!isMobileWidth()) return;
      if (!document.body.classList.contains("mobile-landscape-active")) return;
      if (sequenceRunning) return;

      sequenceRunning = true;
      removeDemoClasses();

      const circle = document.getElementById(Math.random() > 0.5 ? "cerchio-1" : "cerchio-2") || document.getElementById("cerchio-1");
      if (circle) {
        circle.classList.add("mobile-idle-demo-circle");
        addTimer(() => circle.classList.remove("mobile-idle-demo-circle"), 1300);
      }

      /* Dopo 2 secondi muoviamo anche un cursore a caso. */
      addTimer(() => {
        const cursor = pickRandomCursor();
        if (!cursor) return;
        cursor.classList.add("mobile-idle-demo-cursor");
        addTimer(() => cursor.classList.remove("mobile-idle-demo-cursor"), 1300);
      }, 2000);

      /* Finita la guida, aspettiamo 10 secondi prima di rifarla se l'utente resta inattivo. */
      addTimer(() => {
        sequenceRunning = false;
        scheduleDemo(10000);
      }, 3400);
    }

    function scheduleDemo(delay = 4000) {
      clearTimers();
      removeDemoClasses();
      sequenceRunning = false;
      if (!isMobileWidth()) return;
      if (!document.body.classList.contains("mobile-landscape-active")) return;
      addTimer(runGuideSequence, delay);
    }

    ["touchstart", "mousedown", "click", "keydown"].forEach((evt) => {
      document.addEventListener(evt, () => {
        scheduleDemo(4000);
      }, { passive: true });
    });

    const donnina = document.getElementById("donnina");
    if (donnina) {
      donnina.addEventListener("click", () => {
        setTimeout(() => scheduleDemo(4000), 80);
      });
    }
  }

  createMobileStage();
  patchSpecialFountainOrigin();
  limitSpecialFountainOnMobile();
  activateLandscapeAfterFirstClick();
  enableTouchToMouseBridge();
  enableIdleDemo();

  window.addEventListener("resize", () => {
    setTimeout(resetMobileSliderCursors, 80);
  });
})();
