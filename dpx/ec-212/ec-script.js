(() => {
  "use strict";

  // === LINK DI DESTINAZIONE CENTRALIZZATO ===
  const NEXT_PAGE = "Digipathoxina/dpx/a-01/a-pill.html";

  const EL = {
    main: document.getElementById('main'),
    feed: document.getElementById('feed'),
    msgList: document.getElementById('msgList'),
    tagCloud: document.getElementById('tagCloud'),
    langSwitch: document.getElementById('langSwitch'),
    tabs: document.getElementById('topTabs'),
    homeHero: document.getElementById('homeHero'),
    spamZone: document.getElementById('spamZone'),
    // login + modali
    loginForm: document.getElementById('loginForm'),
    loginUser: document.getElementById('loginUser'),
    loginPass: document.getElementById('loginPass'),
    hackOverlay: document.getElementById('hackOverlay'),
    adminModal: document.getElementById('adminModal'),
    logoutBtn: document.getElementById('logoutBtn'),
    // elementi del profilo dentro il modal (se presenti nell’HTML)
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail'),
    profileRole: document.getElementById('profileRole'),
    profileAvatar: document.getElementById('profileAvatar'),
  };

  // lingua iniziale
  let LANG = (localStorage.getItem('purrnet-lang') || 'en').toLowerCase();
  if (!['en', 'it'].includes(LANG)) LANG = 'en';
  document.documentElement.lang = LANG;
  document.documentElement.dataset.lang = LANG;

  // selezione contenuti correnti
  function CURRENT() {
    return LANG === 'it' ? (window.CONTENT_IT || {}) : (window.CONTENT_EN || {});
  }
  function t() { return CURRENT().i18n || {}; }

  const params = new URLSearchParams(location.search);
  const videoSrc = params.get('video');
  const nextDest = params.get('next');

  let activeTag = null;

  init();

  function init() {
    const brand = document.querySelector('.brand');
    if (brand) brand.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveTab('home');
      renderFeed();
    });

    if (EL.langSwitch) {
      EL.langSwitch.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-lang]');
        if (!btn) return;
        setLang(btn.dataset.lang);
      });
    }
    syncSwitch();

    if (EL.tabs) {
      EL.tabs.addEventListener('click', (e) => {
        const a = e.target.closest('a.tab[data-route]');
        if (!a) return;
        e.preventDefault();
        const route = a.dataset.route;
        setActiveTab(route);
        if (route === 'home') renderFeed();
        if (route === 'about') renderAbout();
        if (route === 'archive') renderArchive();
      });
      setActiveTab('home');
    }

    renderMessages();
    buildTagCloud();
    renderRandomAd();   // AD con pesi

    if (EL.loginForm) EL.loginForm.addEventListener('submit', onLoginSubmit);
    if (EL.logoutBtn) EL.logoutBtn.addEventListener('click', hideAdminModal);
    if (EL.adminModal) {
      EL.adminModal.addEventListener('click', (e) => {
        if (e.target === EL.adminModal) hideAdminModal();
      });
    }

    if (videoSrc) { renderVideo(videoSrc, nextDest); }
    else { renderFeed(); }

    applyStaticI18n();

    // === Listener unico per i link che aprono la pagina successiva
    //     (IGNORA #convFissata per non hijackare la mini-chat)
    document.querySelectorAll('[data-next]').forEach(el => {
      if (el.id === 'convFissata') return; // << fix richiesto
      el.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = NEXT_PAGE;
      });
    });

    // === Conversazione fissata (apre il modal, non cambia pagina)
    const convBtn = document.getElementById('convFissata');
    if (convBtn) {
      convBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openPinnedConversation();
      });
    }
  }

  // === Conversazione fissata ===
  function openPinnedConversation() {
    const msgs = CURRENT().pinnedConversation || defaultPinnedMsgs();
    const title = t().pinnedTitle || (LANG === 'it' ? 'Conversazione fissata' : 'Pinned conversation');
    const closeTxt = (LANG === 'it') ? 'Chiudi' : 'Close';

    const overlay = document.createElement('div');
    overlay.id = 'pinnedChat';
    overlay.innerHTML = `
      <div class="modal-card">
        <h3 class="modal-title">${title}</h3>
        <div class="messages">
          ${msgs.map(m => `
            <div class="msg">
              <div class="from">@${m.from}</div>
              <div class="text">${m.text}</div>
            </div>`).join('')}
        </div>
        <button class="btn modal-logout" id="closeConv">${closeTxt}</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('closeConv').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }

  function defaultPinnedMsgs() {
    if (LANG === 'it') {
      return [
        { from: "ModGirl_97", text: "Sette passaggi verso la ciotola (studio pilota): ho mappato 37 tragitti divano→ciotola. Mediana: 7 svolte micro (soglia, sedia, tappeto…). R² basso, campione ridicolo, bias gigantesco; però il sette ricorre. Coincidenza? …Dovrei creare un articolo a riguardo." },
        { from: "ModGirl_97", text: "Aggiornamento rapido: ho ripetuto la mappatura per una settimana. Mediana sempre 7; con ostacoli rimossi scende a 5–6. Sto preparando un articolo con grafici." },
        { from: "User42",  text: "Mi piace l’idea! Forse il 7 è un pattern legato al perimetro della stanza. Curioso di leggere l’articolo." }
      ];
    }
    return [
      { from: "ModGirl_97", text: "Seven steps to the bowl (pilot study): mapped 37 couch→bowl routes. Median: 7 micro-turns (doorway, chair, rug…). Low R², tiny sample, huge bias; yet seven keeps showing up. Coincidence? …Probably worth a full article." },
      { from: "ModGirl_97", text: "Quick update: repeated tracking for a week. Median still 7; with obstacles removed it drops to 5–6. Drafting charts for the article." },
      { from: "User42",  text: "Love the idea! Maybe seven relates to the room’s layout. Can’t wait to read the article." }
    ];
  }

  function applyStaticI18n() {
    const txt = t();

    setText('[data-i18n="loginTitle"]', txt.loginTitle || (LANG === 'it' ? 'Login' : 'Login'));
    const userLabel = (txt.userLabel || (LANG === 'it' ? 'Utente<br>' : 'User<br>'));
    const passLabel = (txt.passLabel || 'Password<br>');
    const signin = (txt.signinBtn || (LANG === 'it' ? 'Accedi' : 'Sign in'));

    const uLabel = document.querySelector('.login label:nth-child(1)');
    const pLabel = document.querySelector('.login label:nth-child(2)');
    if (uLabel) uLabel.innerHTML = `${userLabel}<input id="loginUser" type="text" placeholder="guest">`;
    if (pLabel) pLabel.innerHTML = `${passLabel}<input id="loginPass" type="password" placeholder="••••••">`;
    EL.loginUser = document.getElementById('loginUser');
    EL.loginPass = document.getElementById('loginPass');

    setText('[data-i18n="signinBtn"]', signin);
    setText('[data-i18n="bannerTitle"]', txt.bannerTitle || 'Banner');

    const prayCta = (txt.prayCta || (LANG === 'it' ? 'Unisciti alla preghiera' : 'Join the prayer'));
    const bannerNote = (txt.bannerNote || (LANG === 'it' ? 'Aiutaci e sostieni la community' : 'Help and support our community'));
    const prayLink = document.querySelector('.pray-link');
    if (prayLink) prayLink.textContent = prayCta;
    setText('[data-i18n="bannerNote"]', bannerNote);

    setText('[data-i18n="messagesTitle"]', txt.messagesTitle || (LANG === 'it' ? 'Messaggi' : 'Messages'));
    setText('[data-i18n="tagsTitle"]', txt.tagsTitle || 'Tags');
    setText('[data-i18n="morePosts"]', txt.morePosts || (LANG === 'it' ? 'Altri post' : 'More posts'));

    // === NUOVO: i18n Widget
    setText('#convFissata', txt.pinnedTitle || (LANG === 'it' ? 'Conversazione fissata' : 'Pinned conversation'));
    const extLinkEl = document.querySelector('.placeholder p a[data-i18n="externalLinks"]');
    if (extLinkEl) extLinkEl.textContent = txt.externalLinks || (LANG === 'it' ? 'Altri link utili' : 'External links');
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el && typeof value === 'string') el.textContent = value;
  }

  function setLang(l) {
    if (!['en', 'it'].includes(l)) return;
    LANG = l;
    localStorage.setItem('purrnet-lang', l);
    document.documentElement.lang = l;
    document.documentElement.dataset.lang = l;
    syncSwitch();
    renderMessages();
    buildTagCloud();

    const route = EL.tabs?.querySelector('.tab.active')?.dataset.route || 'home';
    if (route === 'home') renderFeed();
    if (route === 'about') renderAbout();
    if (route === 'archive') renderArchive();

    applyStaticI18n();
  }

  function syncSwitch() {
    if (!EL.langSwitch) return;
    [...EL.langSwitch.querySelectorAll('button')].forEach(b => {
      b.classList.toggle('on', (b.dataset.lang || '') === LANG);
    });
  }

  function setActiveTab(route) {
    if (!EL.tabs) return;
    [...EL.tabs.querySelectorAll('.tab')].forEach(t => {
      t.classList.toggle('active', t.dataset.route === route);
    });
    if (EL.homeHero) EL.homeHero.style.display = (route === 'home') ? '' : 'none';
  }

  /* ===== LOGIN ===== */
  function onLoginSubmit(e) {
    e.preventDefault();
    const u = (EL.loginUser?.value || '').trim();
    const p = (EL.loginPass?.value || '').trim();

    if (u === 'HACK' && p === 'digiphatoxina') { showHackOverlay(); return; }
    if (u === 'admin' && p === 'admin') { showAdminModal(); return; }

    EL.loginForm.classList.add('shake');
    setTimeout(() => EL.loginForm.classList.remove('shake'), 400);
  }

  function showHackOverlay() {
    if (!EL.hackOverlay) return;
    EL.hackOverlay.classList.add('show');
    setTimeout(() => EL.hackOverlay.classList.remove('show'), 2500);
  }

  function showAdminModal() {
    if (!EL.adminModal) return;
    if (EL.profileName) EL.profileName.textContent = 'Nome: Admin_X';
    if (EL.profileEmail) EL.profileEmail.textContent = 'Email: admin@purrnet.com';
    if (EL.profileRole) EL.profileRole.textContent = 'Ruolo: Official Admin';
    if (EL.profileAvatar) {
      EL.profileAvatar.src = 'media/admin.png';
      EL.profileAvatar.alt = 'Admin';
      EL.profileAvatar.loading = 'lazy';
    }
    EL.adminModal.classList.add('show');
  }
  function hideAdminModal() {
    if (!EL.adminModal) return;
    EL.adminModal.classList.remove('show');
  }

  /* ===== AD RANDOM (singolo) — con pesi ===== */
  function renderRandomAd() {
    if (!EL.spamZone) return;
    const r = Math.random();
    let idx;
    if (r < 0.20) {
      idx = 3; // 20%
    } else {
      const pool = [1, 2, 4];
      idx = pool[Math.floor(Math.random() * pool.length)];
    }
    const img = document.createElement('img');
    img.src = `media/spam_${idx}.gif`;
    img.alt = `Ad ${idx}`;
    img.loading = 'lazy';
    EL.spamZone.replaceChildren(img);
  }

  /* ===== MESSAGGI ===== */
  function renderMessages() {
    if (!EL.msgList) return;
    EL.msgList.innerHTML = '';
    const msgs = (CURRENT().messages) || [];
    msgs.forEach(m => {
      const div = document.createElement('div'); div.className = 'msg';
      div.innerHTML = `<div class="from">@${escapeHTML(m.from || '')}</div><div class="text">${escapeHTML(m.text || '')}</div>`;
      EL.msgList.appendChild(div);
    });
  }

  /* ===== TAG CLOUD ===== */
  function buildTagCloud() {
    if (!EL.tagCloud) return;
    const tags = new Set();
    const feed = (CURRENT().feed) || [];
    feed.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    EL.tagCloud.innerHTML = '';
    [...tags].sort().forEach(tg => {
      const a = document.createElement('a');
      a.textContent = `#${tg}`;
      a.href = '#';
      a.dataset.tag = tg;
      if (activeTag === tg) a.classList.add('active');
      a.addEventListener('click', (e) => {
        e.preventDefault();
        activeTag = (activeTag === tg) ? null : tg;
        buildTagCloud();
        renderFeed();
      });
      EL.tagCloud.appendChild(a);
    });
  }

  // === factory per il bottone "Altri post / More posts"
  function createMoreLink() {
    const div = document.createElement('div');
    div.className = 'more-wrap';
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'more-link';
    a.dataset.next = ''; // usa il listener data-next
    a.setAttribute('data-i18n', 'morePosts');
    a.textContent = t().morePosts || (LANG === 'it' ? 'Altri post' : 'More posts');
    div.appendChild(a);
    return div;
  }

  // === ordine post usato per feed/archive ===
  function getOrderedPosts() {
    return ((CURRENT().feed) || [])
      .slice()
      .sort((a, b) => {
        const pa = a.pinned ? 1 : 0, pb = b.pinned ? 1 : 0;
        if (pa !== pb) return pb - pa; // pinned first
        return (a.date < b.date) ? 1 : (a.date > b.date ? -1 : 0);
      });
  }

  function renderFeed() {
    const list = document.createElement('section');
    list.id = 'feed'; list.className = 'feed';

    const posts = getOrderedPosts()
      .filter(p => !activeTag || (p.tags || []).includes(activeTag));

    posts.forEach(p => list.appendChild(renderPostCard(p)));
    const more = createMoreLink();
    EL.main.replaceChildren(list, more);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderPostCard(p) {
    const card = document.createElement('article');
    card.className = 'post'; card.id = p.slug;

    const img = document.createElement('img');
    img.className = 'thumb'; img.src = p.thumb; img.alt = '';
    card.appendChild(img);

    const right = document.createElement('div');
    right.className = 'right';

    const tags = document.createElement('div');
    tags.className = 'tagsline';
    tags.innerHTML = `<span class="hash">${(p.tags || []).map(t => `#${t}`).join(' ')}</span>`;
    right.appendChild(tags);

    const h3 = document.createElement('h3');
    h3.className = 'title';
    h3.innerHTML = `<a href="#" data-slug="${p.slug}">${escapeHTML(p.title || 'Untitled')}</a>`;
    right.appendChild(h3);

    const ex = document.createElement('p');
    ex.className = 'excerpt'; ex.textContent = p.excerpt || '';
    right.appendChild(ex);

    const foot = document.createElement('div');
    foot.className = 'foot';
    foot.innerHTML = `
      <a href="#" class="read ${p.type === 'video' ? 'video' : ''}" data-slug="${p.slug}">
        ${p.type === 'video' ? (t().watchAndNext || 'Watch & continue →') : (t().readMore || 'Read more')}
      </a>
      <span class="datetime">${formatDate(p.date)} • ${formatTime(p.time)}</span>
    `;
    right.appendChild(foot);

    foot.querySelector('a.read').addEventListener('click', (e) => { e.preventDefault(); openItem(p); });
    h3.querySelector('a').addEventListener('click', (e) => { e.preventDefault(); openItem(p); });

    card.appendChild(right);
    return card;
  }

  function openItem(p) {
    // html del post
    let html = p.html || '<div class="prose"><p>No content.</p></div>';

    // rimuovi <img class="hero"> se è lo stesso file del thumb
    try {
      const norm = (s) => String(s || '').trim().split('/').pop().toLowerCase();
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const hero = tmp.querySelector('img.hero');
      if (hero) {
        const hsrc = hero.getAttribute('src') || '';
        if (norm(hsrc) === norm(p.thumb)) {
          hero.remove();
        }
      }
      html = tmp.innerHTML;
    } catch (e) { /* no-op */ }

    const ordered = getOrderedPosts();
    const idx = Math.max(0, ordered.findIndex(x => x.slug === p.slug));
    const nextIdx = (idx + 1) % ordered.length;
    const nextPost = ordered[nextIdx];

    const nextLabel = (LANG === 'it') ? 'post successivo' : 'next post';
    const backLabel = t().back || (LANG === 'it' ? '← torna ai post' : '← back to posts');

    const view = document.createElement('article');
    view.className = 'view';
    view.innerHTML = `
      <h1 class="title">${escapeHTML(p.title || 'Untitled')}</h1>
      <div class="meta">${formatDate(p.date)} • ${formatTime(p.time)} ${p.tags ? '• ' + p.tags.map(t => `#${t}`).join(' ') : ''}</div>
      ${html}
      <div class="navline">
        <a href="#" class="back">${backLabel}</a>
        <a href="#" class="next" data-slug="${nextPost.slug}">${nextLabel} →</a>
      </div>
    `;
    view.querySelector('.back').addEventListener('click', (e) => {
      e.preventDefault(); renderFeed();
    });
    view.querySelector('.next').addEventListener('click', (e) => {
      e.preventDefault();
      const slug = e.currentTarget.getAttribute('data-slug');
      const target = ordered.find(x => x.slug === slug);
      if (target) openItem(target);
    });

    EL.main.replaceChildren(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderAbout() {
    const about = document.createElement('section');
    about.className = 'view about';
    const aboutHTML = (CURRENT().aboutHTML) || '<div class="prose"><p>PurrNet è il luogo in cui si dicono le cose come stanno: i gatti sono Dio. Hanno inventato Internet e ne hanno lasciato il manuale in fusa, sguardi e tracce di codice. Qui raccogliamo segni, formulae, ricorrenze: ciò che si ripete si fa realtà. Scorri, ascolta, annuisci — la rete sa riconoscere il suo creatore. Policy community & forum Rispetta umani e felini: si accarezza tutto, tranne l’ego. Niente woof-splaining. I troll non si nutrono; i gatti sì. CAPS solo per MIAO. Fonti o silenzio; niente spam (a meno di croccantini per tutti). Moderazione felina: se graffia, fuori dalla lettiera. </p></div>';
    about.innerHTML = `${aboutHTML}<a href="#" class="back">${t().back || (LANG === 'it' ? '← torna ai post' : '← back to posts')}</a>`;
    about.querySelector('.back').addEventListener('click', (e) => { e.preventDefault(); renderFeed(); setActiveTab('home'); });
    EL.main.replaceChildren(about);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderArchive() {
    const wrap = document.createElement('section');
    wrap.className = 'view';
    const items = ((CURRENT().feed) || [])
      .slice()
      .sort((a, b) => a.date < b.date ? 1 : -1)
      .map(p => `<li><a href="#" data-slug="${p.slug}">${escapeHTML(p.title || 'Untitled')}</a> <span class="meta">— ${formatDate(p.date)}</span></li>`)
      .join('');
    wrap.innerHTML = `
      <h2 class="title">${LANG === 'it' ? 'Archivio' : 'Archive'}</h2>
      <div class="prose"><ul>${items}</ul></div>
      <a href="#" class="back">${t().back || (LANG === 'it' ? '← torna ai post' : '← back to posts')}</a>
    `;
    wrap.querySelectorAll('a[data-slug]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const slug = a.dataset.slug;
        const p = ((CURRENT().feed) || []).find(x => x.slug === slug);
        if (p) openItem(p);
      });
    });
    wrap.querySelector('.back').addEventListener('click', (e) => { e.preventDefault(); renderFeed(); setActiveTab('home'); });
    const more = createMoreLink();
    EL.main.replaceChildren(wrap, more);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ===== VIDEO ===== */
  function renderVideo(src, next) {
    const wrap = document.createElement('div');
    wrap.className = 'view video-wrap';
    wrap.innerHTML = `
      <h2 class="title">Playback</h2>
      <video id="v" src="${src}" controls autoplay playsinline></video>
      <div class="tip">${t().playEnded || (LANG === 'it' ? 'La clip, una volta terminata, apre la pagina successiva.' : 'When the clip ends, the next page opens.')}</div>
      <a href="#" class="back">${t().back || (LANG === 'it' ? '← torna ai post' : '← back to posts')}</a>
    `;
    EL.main.replaceChildren(wrap);
    wrap.querySelector('.back').addEventListener('click', (e) => { e.preventDefault(); renderFeed(); });
    const v = wrap.querySelector('#v');
    v.addEventListener('ended', () => {
      if (next) {
        if (/^https?:|\.html$/.test(next)) { location.href = next; }
        else { location.href = `./${next}`; }
      } else { renderFeed(); }
    });
  }

  /* ===== UTILS ===== */
  function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-').map(Number);
    const loc = LANG === 'it' ? 'it-IT' : 'en-GB';
    const str = new Date(y, m - 1, day).toLocaleDateString(loc, { day: '2-digit', month: 'short', year: 'numeric' });
    return str.replace('.', '');
  }
  function formatTime(t) { return t || '00:00'; }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

})();
