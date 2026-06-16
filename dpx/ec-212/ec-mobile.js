(() => {
  "use strict";

  const MQ = window.matchMedia("(max-width: 900px)");

  function isMobile() {
    return MQ.matches;
  }

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function safeClick(el) {
    if (!el) return;
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  }

  function getActiveRoute() {
    const active = qs('#topTabs .tab.active');
    return active?.dataset?.route || 'home';
  }

  function ensureMobileMenu() {
    const headerRow = qs("header.top .header-flex");
    if (!headerRow) return;

    if (qs("#mobileMenuBtn")) return;

    const menuWrap = document.createElement("div");
    menuWrap.className = "mobile-menu";
    menuWrap.innerHTML = `
      <button id="mobileMenuBtn" type="button" aria-expanded="false">MENU</button>
      <div id="mobileMenuPanel" aria-label="Mobile menu">
        <a href="#" data-mobile-route="home">Home</a>
        <a href="#" data-mobile-route="about">About</a>
        <a href="#" data-mobile-route="archive">Archive</a>
      </div>
    `;

    const brand = qs(".brand", headerRow);
    if (brand && brand.nextSibling) {
      headerRow.insertBefore(menuWrap, brand.nextSibling);
    } else {
      headerRow.appendChild(menuWrap);
    }

    const btn = qs("#mobileMenuBtn");
    const panel = qs("#mobileMenuPanel");

    btn.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      if (!panel.classList.contains("open")) return;
      const inside = e.target.closest("#mobileMenuPanel") || e.target.closest("#mobileMenuBtn");
      if (!inside) {
        panel.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    panel.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-mobile-route]");
      if (!a) return;
      e.preventDefault();

      const route = a.dataset.mobileRoute;

      panel.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");

      if (route === "community") {
        document.body.classList.add("show-community");
        updateHomeOnlySections(); // in community comunque non vogliamo banner fuori contesto
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      document.body.classList.remove("show-community");

      const tab = qs(`#topTabs .tab[data-route="${route}"]`);
      safeClick(tab);

      // aspetta che il JS principale aggiorni la view/tab active
      setTimeout(updateHomeOnlySections, 30);
    });
  }

  function ensureMobileBottom() {
    let bottom = qs("#mobileBottom");
    if (!bottom) {
      bottom = document.createElement("div");
      bottom.id = "mobileBottom";
      const footer = qs("footer.foot");
      if (footer) footer.parentNode.insertBefore(bottom, footer);
      else document.body.appendChild(bottom);
    }
    return bottom;
  }

  function moveFooterSectionsToBottom() {
    const bottom = ensureMobileBottom();
    const sidebar = qs("aside.sidebar");
    if (!sidebar) return;

    const banner = qs("section.banner", sidebar);
    const ad = qs("section.ad-slot", sidebar);

    const tagsSection = qsa("aside.sidebar > section").find(s => qs("#tagCloud", s));

    // sposta sempre tags e ad (li vuoi ovunque)
    [ad, tagsSection].forEach(sec => {
      if (sec && sec.parentNode !== bottom) bottom.appendChild(sec);
    });

    // banner lo spostiamo comunque, ma lo mostriamo solo in Home via updateHomeOnlySections()
    if (banner && banner.parentNode !== bottom) bottom.appendChild(banner);
  }

  function updateHomeOnlySections() {
    const bottom = qs("#mobileBottom");
    if (!bottom) return;

    const banner = qs(".banner", bottom);
    if (!banner) return;

    const route = getActiveRoute();

    // Banner solo in Home (e NON in Community)
    const shouldShow = (route === "home") && !document.body.classList.contains("show-community");
    banner.style.display = shouldShow ? "" : "none";
  }

  function moveExitButtonAboveHero() {
    const hero = qs("#homeHero");
    const exit = qs(".exit-btn");
    if (!hero || !exit) return;
    if (exit.parentNode !== hero) hero.appendChild(exit);
  }

  function ensureCommunityButton() {
    const hero = qs("#homeHero");
    if (!hero) return;

    let btn = qs("#mobileCommunityBtn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "mobileCommunityBtn";
      btn.type = "button";
      btn.textContent = "Community";
      hero.insertAdjacentElement("afterend", btn);
    }

    if (!btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const active = document.body.classList.toggle("show-community");
        btn.classList.toggle("is-active", active);
        updateHomeOnlySections();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    btn.classList.toggle("is-active", document.body.classList.contains("show-community"));
  }

  function bindTabClicksForHomeOnly() {
    // quando clicchi un tab (desktop hidden ma esiste), aggiorna banner visibility
    const topTabs = qs("#topTabs");
    if (!topTabs || topTabs.dataset.mobileBound) return;
    topTabs.dataset.mobileBound = "1";

    topTabs.addEventListener("click", () => {
      // lascia finire renderAbout/renderArchive/renderFeed
      setTimeout(updateHomeOnlySections, 30);
      document.body.classList.remove("show-community");
    });
  }



  function enhanceMobilePostCards() {
    if (!isMobile()) return;

    qsa('.post').forEach((post) => {
      const thumb = qs('.thumb', post);
      const date = qs('.foot .datetime', post);
      if (!thumb || !date) return;

      let mobileDate = qs('.mobile-date-under-thumb', post);
      if (!mobileDate) {
        mobileDate = document.createElement('div');
        mobileDate.className = 'mobile-date-under-thumb';
        thumb.insertAdjacentElement('afterend', mobileDate);
      }
      mobileDate.textContent = date.textContent || '';
    });
  }

  function observeFeedForMobileCards() {
    const feed = qs('#feed');
    if (!feed || feed.dataset.mobileCardsObserved) return;
    feed.dataset.mobileCardsObserved = '1';

    const obs = new MutationObserver(() => {
      if (!isMobile()) return;
      enhanceMobilePostCards();
    });

    obs.observe(feed, { childList: true, subtree: true });
  }

  function applyMobileBehavior() {
    if (!isMobile()) {
      document.body.classList.remove("show-community");
      return;
    }

    ensureMobileMenu();
    bindTabClicksForHomeOnly();
    observeFeedForMobileCards();
    moveFooterSectionsToBottom();
    ensureCommunityButton();
    enhanceMobilePostCards();
    updateHomeOnlySections();
  }

  document.addEventListener("DOMContentLoaded", applyMobileBehavior);
  MQ.addEventListener?.("change", applyMobileBehavior);
})();
