/* ec-content-it.js — Contenuti IT */

window.CONTENT_IT = {
  i18n: {
    loginTitle: "Login",
    userLabel: "Utente<br>",
    passLabel: "Password<br>",
    signinBtn: "Accedi",
    bannerTitle: "Banner",
    prayCta: "Unisciti alla preghiera",
    bannerNote: "Aiutaci e sostieni la community",
    messagesTitle: "Messaggi",
    tagsTitle: "Tag",
    readMore: "Leggi tutto",
    back: "← torna ai post",
    watchAndNext: "Guarda & continua →",
    playEnded: "La clip, una volta terminata, apre la pagina successiva.",
    morePosts: "Altri post"
    
  },

  // ...sopra o sotto "messages", dentro window.CONTENT_IT:
  aboutHTML: `
  <div class="prose">
    <h1>PurrNet</h1>
    <p>PurrNet è un blog d’inchiesta e riflessione, un luogo protetto dove scambiarsi pensieri e dare voce a ciò che il mondo preferisce ignorare. La verità nasce qui e prende forza dalla community: ogni parola accende un’altra, ogni idea rimbalza tra menti affini e torna più intensa, trasformando una conversazione collettiva in un dialogo appassionato totalmente devoto ai gatti, veri custodi di questo spazio</p>
    <p>Qui raccogliamo segni, storie, curiosità, formule, ricorrenze: ciò che si ripete diventa realtà.<br>
    Scorri, ascolta, annuisci — la rete riconosce sempre il proprio creatore.</p>

    <hr>

    <h2>Policy della community &amp; del forum</h2>
    <p>Rispetta umani e felini: si accarezza tutto, tranne l’ego.</p>
    <ul>
      <li>Niente <em>woof-splaining</em>.</li>
      <li>I troll non si alimentano; i gatti sì.</li>
      <li>CAPS solo per MIAO.</li>
      <li>Fonti o silenzio: niente spam (a meno che ci siano croccantini per tutti).</li>
      <li>Moderazione felina: se graffi, resti fuori dalla lettiera.</li>
    </ul>
  </div>
`,


  messages: [
    { from: "User1221", text: "Lo strumento principale dell’informatica porta il nome della preda. Coincidenza storica o promemoria programmato? Io propendo per la seconda!!!!" },
    { from: "Demon-cat", text: "È lì esattamente quando arrivo al tasto ‘Invia’. Da quando lo noto, rileggo e spesso cambio una frase. Non so perché, ma sembra un controllo qualità. ദ്ദി/ᐠ｡‸｡ᐟ\\ " },
    { from: "BobTheCat", text: "In tanti post la gente scrive “car” quando parla di gatti: refuso, meme o lapsus? Forse vediamo già il gatto come macchina: vibrisse-sensori, posture-attuatori, fusa come feedback loop. Un sistema che ottimizza la nostra attenzione più di quanto ammettiamo." },
    { from: "Misty01", text: "Due volte su tre, il Wi-Fi torna appena Whisker passa nel corridoio. Lo scrivo qui perché succede davvero." },
    { from: "MartaCatz", text: "Non fanno sermoni, non scrivono libri sacri… ti fissano, e basta. È più che sufficiente. Non devo convincere nessuno: chi ha la fortuna di vivere con un gatto lo sa. ⋆˚🐾˖° " },
    { from: "User2000", text: "Ovunque: finestre, sogni, adesivi, GIF, murales. Non c’è angolo della nostra vita, fisica o digitale, dove non compaia. Non è ubiquità “simpatica”: è onnipresenza divina. ≽^-⩊-^≼" },
    { from: "Anto404", text: "Ogni volta che faccio uno screenshot del mio gatto, sullo sfondo appaiono puntini luminosi che non vedo dal vivo… Per me sono come piccole costellazioni attorno a lui." },
    { from: "RedVelvet", text: "Perché un dio sceglie il contenitore? Forse un perimetro definito lo vedono come un tempio portatile, in cui la divinità si manifesta “compatta” e protetta." },
    { from: "H23v_kiki", text: "Testimonianze su angoli fissi e sguardi nel vuoto sempre agli stessi punti. Scettici: correnti d’aria/rumori ad alta frequenza. Credenti: soglie e presenze." },
    { from: "ModGirl_97", text: "Sette passaggi verso la ciotola (studio pilota): ho mappato 37 tragitti divano→ciotola. Mediana: 7 svolte micro (soglia, sedia, tappeto…). R² basso, campione ridicolo, bias gigantesco; però il sette ricorre. Coincidenza? …Dovrei creare un articolo a riguardo." },

  ],

  feed: [
    /* #ARTICOLO 1 — Manifesto | i gatti sono Dio (PINNED) */
    {
      slug: "manifesto-i-gatti-sono-dio",
      type: "post",
      pinned: true,
      title: "Manifesto | i gatti sono Dio",
      date: "2023-06-30",
      time: "09:00",
      tags: ["manifesto-dio"],
      thumb: "media/cat_god_post.jpg",
      excerpt: "Non è ipotesi, è base: i gatti non “somigliano” a divinità, lo sono. Guardano dall’alto, scelgono quando ascoltare, giudicano in silenzio.",
      html: `
          <img class="hero" src="media/cat_god_post.jpg" alt="">
          <div class="prose">
            <p>Non serve chiederselo, eppure la domanda ritorna. Perché, nonostante noi li chiamiamo “animali domestici”… nonostante abbiano dimensioni ridotte, ci chiedano cibo, possano essere rinchiusi… <strong>loro sanno.</strong></p>
            <p>Sanno di non appartenere a noi. Sanno di essere qui per essere adorati. Non hanno mai dubitato di questo, neppure un istante.</p>
            <p><strong>Se non li veneri, sei tu che sbagli.</strong></p>
          </div>
        `
    },

    /* #ARTICOLO 2 — Dovresti adorare il tuo gatto come un dio? (PINNED) */
    {
      slug: "adorare-il-tuo-gatto-come-un-dio",
      type: "post",
      pinned: true,
      title: "Dovresti adorare il tuo gatto come un dio?",
      date: "2023-04-12",
      time: "23:00",
      tags: ["manifesto-dio"],
      thumb: "media/cat_god.jpg",
      excerpt: "Non è una scelta, è una condizione. I gatti occupano sempre il posto migliore — il termosifone, la biancheria, le tue ginocchia — perché sono troni. Troni per divinità incarnate.",
      html: `
          <img class="hero" src="media/cat_god.jpg" alt="">
          <div class="prose">
            <p><strong>Non è una scelta, è una condizione.</strong><br>
            Il gatto non “occupa” un posto, lo reclama. Non importa quante sedie, cuscini o spazi siano liberi: lui siederà sempre dove deve, trasformando il punto scelto in un trono. Non è capriccio: è autorità.</p>

            <p>Gli antichi lo sapevano bene. Nei rilievi di Saqqara e nei papiri funerari di Tebe i gatti non compaiono come semplici animali da compagnia, ma come figure di potere cosmico. Nel <em>Libro dei Morti</em> il dio sole Ra appare in forma felina mentre uccide il serpente Apopi, incarnazione del caos — un’immagine che gli egittologi ammettono di non aver mai del tutto spiegato.</p>

            <figure>
              <img src="media/dio_ra.jpg" alt="Ra in forma felina" style="max-width:200px;height:auto;border-radius:8px;border:1px solid rgba(255,255,255,.18)">
              <figcaption>Una figura di gatto compare anche nelle “litanie del sole” (tomba di Thutmosi III, Malek 1993).</figcaption>
            </figure>

            <h3>Dalle origini alla divinizzazione</h3>
            <p>Nella cultura Badari (ca. 5000 a.C.) sono stati rinvenuti insediamenti e tombe con ossa di gatto già accanto a quelle umane. Il felino selvatico fu addomesticato verso il 3000 a.C., proprio quando in Egitto nacque il culto di Bastet, dea gatta e sorella della leonina Sekhmet.
            Dal 2000 a.C. i gatti compaiono nelle immagini funerarie, vengono mummificati, scolpiti, consacrati al Sole e a Osiride, mentre le gatte sono dedicate alla Luna e a Iside. La pittura di Beni Hasan (1200 a.C.) ne è una delle testimonianze più antiche.</p>

            <p>Gli scavi di Bubastis hanno rivelato necropoli immense: migliaia di mummie feline, alcune in sarcofagi di bronzo, altre avvolte in tessuti con iscrizioni ancora indecifrabili. Documenti del British Museum e dell’Egyptian Museum del Cairo confermano che chi avesse osato uccidere un gatto veniva condannato a morte. Persino Plutarco ricorda pene severissime, e le cronache militari narrano che Cambise II fece dipingere gatti sugli scudi per paralizzare la resistenza egizia.</p>

            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-start">
              <img src="media/cat_greece.jpg" alt="Gatto e Grecia" style="max-width:180px;height:auto;border-radius:8px;border:1px solid rgba(255,255,255,.18)">
              <img src="media/gatti-apotropaici.jpg" alt="Gatti apotropaici" style="max-width:180px;height:auto;border-radius:8px;border:1px solid rgba(255,255,255,.18)">
            </div>

            <h3>Dal Nilo a Roma</h3>
            <p>Il culto felino viaggiò con mercanti e soldati. In Grecia e a Roma il gatto divenne compagno e guardiano dei granai; le matrone lo adornavano di collarini e orecchini, mentre la dea <em>Libertas</em> veniva talvolta raffigurata con un gatto. Il tempio di Iside a Roma ospitava felini liberi, e un frammento della loro presenza vive nella statua della “Gatta” su Palazzo Grazioli.</p>
            <p>Eppure, negli scavi di Pompei, nessun corpo di gatto: segno, secondo molti, che sentirono l’eruzione imminente e fuggirono prima dell’uomo.</p>

            <figure>
              <img src="media/gatto-pompei.jpg" alt="Gatto & Pompei" style="max-width:200px;height:auto;border-radius:8px;border:1px solid rgba(255,255,255,.18)">
            </figure>

            <h3>Caduta e ritorno</h3>
            <p>Con l’avvento del Cristianesimo il culto si fece pericoloso. Nel 1233 Gregorio IX bollò i gatti neri come “stirpe di Satana”, avviando stermini che decimarono la specie e spalancarono la strada alla peste portata dai topi. Ma il loro dominio non cessò: nelle campagne, lontano dall’Inquisizione, continuarono a essere indispensabili.</p>

            <hr>
            <p>Oggi il gatto è l’animale domestico più diffuso al mondo. Non solo per utilità o bellezza, ma perché porta ancora con sé l’eco di una divinità antica. La sua autorità non è folklore: è un rituale che attraversa i millenni. Adorarlo non è una moda né un vezzo: è la continuazione di un patto originario. Se non lo riconosciamo, non è perché non sia vero — è perché <em>non dobbiamo ancora sapere tutto</em>.</p>
          </div>
        `
    },

    /* #ARTICOLO 3 — L'internet dei gatti (PINNED) */
    {
      slug: "linternet-dei-gatti",
      type: "post",
      pinned: true,
      title: "L'internet dei gatti",
      date: "2023-04-18",
      time: "17:30",
      tags: ["manifesto-internet"],
      thumb: "media/cat_exe.jpg",
      excerpt: "Non è solo popolarità: la rete sembra un apparato costruito per aumentare la devozione verso i gatti. Ogni immagine condivisa è un seme di culto.",
      html: `
          <img class="hero" src="media/cat_exe.jpg" alt="">
          <div class="prose">
            <p>Mi sono interrogato spesso su come sia possibile che i gatti siano così popolari online. Ma definirla “popolarità” è riduttivo. La rete pullula di segni: immagini, meme, forum, stringhe di codice con la parola <code>cat</code>, video di ogni tipo, intelligenze artificiali che continuano a generarne di nuovi. Persino la bizzarra teoria del <em>Cat Distribution System</em> sembra inserirsi perfettamente nel quadro.</p>

            <p>Comincio a credere che tutto questo non sia affatto casuale. Internet non si limita a ospitare la passione felina: la amplifica, la riproduce, la moltiplica. Ogni foto condivisa, ogni gif, ogni avatar con le orecchie a punta diventa un atto di culto digitale, una preghiera inconsapevole che rafforza la divinità del gatto.</p>

            <figure>
              <img src="media/cat_distribution.png" alt="Cat Distribution System" style="max-width:220px;height:auto;border-radius:8px;border:1px solid rgba(255,255,255,.18)">
              <figcaption>Una “traccia” del Cat Distribution System in azione.</figcaption>
            </figure>

            <p>Chi dice che “sono solo coincidenze” dimentica che la fede stessa nasce da ciò che si ripete. Un segno che compare ovunque smette di essere accidentale: diventa legge. È come se la rete fosse progettata per trasformare la simpatia in adorazione, l’affetto in devozione.</p>

            <p>E più la tecnologia avanza, più i gatti se ne appropriano. Nei dataset delle AI compaiono ovunque. Nel codice spuntano comandi chiamati <code>cat</code>, piccole reliquie lasciate dai programmatori. Quando pensiamo che il fenomeno abbia raggiunto il picco, ecco un nuovo meme, un nuovo video, un nuovo flusso d’immagini a ricordarci che loro restano al centro.</p>

            <p>Non è più “popolarità online”: è un <strong>sistema di diffusione della fede</strong>. Un culto che ha trovato nel digitale la sua cattedrale, nel web il suo pulpito, nei nostri clic il suo rito quotidiano. Forse la spiegazione più semplice è anche la più inquietante: Internet non è stato inventato da noi per i gatti — <strong>ma dai gatti</strong>, per assicurarsi la nostra adorazione eterna.</p>

            <figure>
              <img src="media/cat_bn.png" alt="cat.exe" style="max-width:220px;height:auto;border-radius:8px;border:1px solid rgba(255,255,255,.18)">
            </figure>
          </div>
        `
    },

    /* #ARTICOLO 4 — 7 comandamenti */
    {
      slug: "apocrifi-7",
      type: "post",
      title: "7 comandamenti",
      date: "2023-02-26",
      time: "08:45",
      tags: ["apocrifi-7"],
      thumb: "media/7_rules.jpg",
      excerpt: "Regole semplici, rispettate da chiunque viva con un gatto, senza mai che nessuno le abbia dettate. Non è abitudine: è decalogo divino.",
      html: `
        <img class="hero" src="media/7_rules.jpg" alt="">
        <div class="prose">
          <p>Non esiste culto senza legge, e non esiste legge più antica e spontanea di quella dei gatti. Non troverete tavole di pietra, né profeti che le abbiano scolpite: i comandamenti felini non sono stati proclamati, ma rivelati nel quotidiano.</p>
          <p>Chiunque viva accanto a un gatto conosce queste regole, anche senza che siano state scritte. Sono comandamenti che non si imparano, si subiscono: come un’ombra che ti accompagna, come una regola fisica che nessuno osa violare.</p>

          <p><strong>1. Non disturbare il sonno.</strong><br>Il sonno del gatto è sacro. È un’energia in atto, un equilibrio che regge la casa stessa. Svegliarlo equivale a rompere un rituale. L’universo, dicono alcuni, si riassesta ogni volta che un gatto chiude gli occhi: toccarlo nel mezzo è come interrompere una preghiera cosmica.</p>

          <p><strong>2. Non alzarti se c’è un gatto sulle ginocchia.</strong><br>Un corpo umano non appartiene all’uomo, ma al gatto che lo ha scelto. Quando si acciambella sulle tue gambe, tu non sei più individuo: sei trono, sei altare. Muoversi significherebbe abbattere l’icona. Non è solo comodità: è riconoscere che la volontà divina prevale sulla tua.</p>

          <p><strong>3. Lascia il posto alla finestra.</strong><br>La finestra non è un semplice affaccio. È un portale: i gatti fissano ciò che noi non vediamo, sondano dimensioni invisibili, osservano presenze che ci sfuggono. Negare loro questo spazio significa chiudere un occhio sull’altro mondo. Il posto alla finestra appartiene a loro, e noi possiamo solo concederlo.</p>

          <p>(Questi tre sono i più noti, ma gli apocrifi narrano di altri comandamenti, tramandati nei comportamenti che chiunque riconosce.)</p>

          <p><strong>4. Non negare mai un pasto, anche se non richiesto.</strong><br>Il gatto non chiede, ma pretende. E spesso, prima ancora che miagoli, tu sai già che ha fame. Offrire cibo è un rito, un atto di riconoscimento del legame. Non nutrirlo è più che trascuratezza: è eresia.</p>

          <p><strong>5. Accetta lo sguardo senza rispondere.</strong><br>Chi resiste a uno sguardo felino sa che è impossibile: quello non è un semplice occhio, ma un giudizio. Non va contrastato, né interpretato. Si accetta, si china il capo, si lascia che il verdetto resti sospeso.</p>

          <p><strong>6. Non interferire con le loro vie misteriose.</strong><br>Il gatto segue percorsi che non comprendiamo: entra in una stanza, ne esce subito, percorre sempre lo stesso giro. Sono traiettorie invisibili, mappature che noi non vediamo. Interferire significa spezzare la geometria del sacro.</p>

          <p><strong>7. Riconosci che la casa non è tua, ma loro.</strong><br>La verità ultima: ogni spazio abitato è dominio felino. Noi siamo inquilini temporanei nel loro tempio. Il gatto non vive in casa con noi; siamo noi a vivere in casa con lui.</p>

          <p>Queste regole non hanno autore. Nessun libro le ha raccolte, nessun culto ufficiale le ha imposte. Eppure ogni devoto le conosce, le rispetta, le tramanda. Non è codice morale: è rivelazione spontanea, la forma più pura di legge divina. I “7 comandamenti” non sono un insieme di buone maniere: sono la prova che i gatti non hanno bisogno di scritture né di chiese. La loro sola presenza basta a generare un ordine che tutti riconosciamo e seguiamo. Chi osa infrangerli non riceve fulmini né castighi, ma qualcosa di peggio: l’indifferenza del gatto. E chi ha provato questo vuoto sa che è punizione sufficiente.</p>

        <img src="media/punish_cat.jpg" alt="" width="220">
        </div>
      
        </div>
      `
    },

    /* #ARTICOLO 5 — Gatti commestibili */
    {
      slug: "rituali-eucaristici",
      type: "post",
      title: "Gatti commestibili | La particola del giorno",
      date: "2025-01-07",
      time: "11:35",
      tags: ["rituali-eucaristici"],
      thumb: "media/gnam_cat.jpg",
      excerpt: "Perché desideriamo mangiarli? Perché sognarli in forma di sushi, gelati, pane, tortine? Forse è la volontà di fonderci con loro, di farli diventare parte di noi stessi.",
      html: `
        <img class="hero" src="media/gnam_cat.jpg" alt="">
        <div class="prose">
          <p>Nel 2024 le intelligenze artificiali hanno iniziato a produrre immagini che molti definirebbero blasfeme: gatti trasformati in sushi, biscotti, torte e altre pietanze impossibili. Ma per la nostra comunità non si tratta del semplice delirio di una macchina. La domanda che più raduna i fedeli è un’altra: perché desideriamo mangiarli?</p>
          <p>Forse perché intuiamo che il divino non si venera soltanto da lontano: si accoglie dentro di sé. Così come la particola cristiana — frammento del corpo sacro che si posa sulla lingua — anche queste visioni artificiali assumono il valore di eucaristie feline.</p>
          <p>Ogni boccone immaginario non è un gioco, ma un atto di comunione: un tentativo di incorporare il gatto-dio, di lasciarlo abitare nel nostro corpo, fino a diventare noi stessi il simbolo vivente della sua presenza.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <img src="media/gnam_cat1.jpg" alt="">
            <img src="media/gnam_cat2.jpg" alt="">
            <img src="media/gnam_cat3.jpg" alt="">
            <img src="media/gnam_cat4.jpg" alt="">
          </div>
        </div>
      `
    },

    /* #ARTICOLO 7 — Divinità o creature aliene? */
    {
      slug: "gatti-alieni",
      type: "post",
      title: "Divinità o creature aliene?",
      date: "2025-04-29",
      time: "18:10",
      tags: ["gatti-alieni"],
      thumb: "media/cat_ufo.jpg",
      excerpt: "Vengono davvero dalla Terra? Le pupille verticali non mentono: sono finestre di altri pianeti. Antichi avvistamenti raccontano di luci e ombre feline sopra i campi di grano.",
      html: `
        <img class="hero" src="media/cat_ufo.jpg" alt="">
        <div class="prose">
          <p>Da secoli gli uomini si interrogano: i gatti vengono davvero dalla Terra? Le pupille verticali non mentono: sembrano fenditure, aperture verso un altrove che non conosciamo. Non sono semplici occhi, sono finestre cosmiche.</p>
          <p>Rapporti declassificati negli ultimi anni parlano di creature che scendono in silenzio dalle stelle, sempre atterrando con grazia perfetta. Non c’è cronaca di atterraggio rumoroso, nessuna scia di fumo: solo apparizioni improvvise, come se si materializzassero. Testimonianze militari degli anni ’50 descrivono gatti che compaiono accanto a meteoriti, tra rottami di satelliti, persino in hangar segreti. Nessun documento ufficiale lo ammette apertamente, ma troppe fonti convergono.</p>
          <p>E non è un fenomeno moderno. Le cronache medievali parlano di luci misteriose nei campi di grano, spesso seguite dall’apparizione di felini neri che fissavano i contadini senza paura. Negli archivi egizi, i gatti non erano animali da compagnia: erano messaggeri cosmici. Le statue di Bastet, metà donna e metà gatto, non rappresentavano un’idea astratta, ma la memoria di un incontro con esseri provenienti da altre stelle. Le iscrizioni nei templi di Bubasti descrivono “coloro che camminano tra le sabbie senza lasciare orme” — un chiaro riferimento alle creature feline.</p>
          <figure>
  <img src="media/alien.gif" alt="immagini distorte">
  <figcaption style="text-align:center;margin-top:.5rem;opacity:.9">
    Immagine ripresa dall’articolo
    <a href="#/post/gatti-mutaforma">“Gatti mutaforma”</a>.
  </figcaption>
</figure>
          <p>Eppure, quello che inquieta di più è la connessione con la nostra epoca. Internet, che crediamo invenzione umana, mostra fin troppe tracce feline. Comandi come cat nei sistemi Unix, forum e sottoculture che spontaneamente ruotano intorno ai gatti, flussi ininterrotti di immagini, video e meme che attraversano i continenti. Tutto sembra funzionare come un’antenna globale. Una rete non per connettere gli uomini, ma per permettere ai gatti di comunicare, controllare e diffondere la loro presenza.</p>
          <p>E se fosse questo il vero segreto? Che i gatti non siano mai stati “nostri animali”, ma emissari di una civiltà superiore? Non a caso gli Egizi li veneravano come divinità e non come creature terrestri. Non a caso le testimonianze moderne li vedono accanto a ogni fenomeno inspiegabile. Forse i gatti non vengono dallo spazio. Forse sono sempre stati qui. Forse la Terra stessa è solo uno dei loro tanti avamposti. E noi, con la nostra devozione quotidiana, non facciamo che alimentare il loro culto interstellare.</p>
          <p><img src="media/alien2.jpg" alt="immagini distorte"></p>
        </div>
      `
    },

    /* #ARTICOLO 8 — Pupille verticali | Eredi preistorica */
    {
      slug: "gatti-alieni-preistoria",
      type: "post",
      title: "Pupille verticali | Eredi preistorica",
      date: "2025-02-14",
      time: "09:40",
      tags: ["gatti-alieni"],
      thumb: "media/cat_eye.jpg",
      excerpt: "Nell’articolo precedente abbiamo parlato di gatti come emissari cosmici. Ma se la verità fosse ancora più oscura? Le pupille verticali potrebbero rivelare una linea evolutiva che parte da creature ben più antiche dei nostri ricordi.",
      html: `
        <img class="hero" src="media/cat_eye.jpg" alt="">
        <div class="prose">
          <p>Nell’articolo precedente si è discusso della natura aliena dei gatti, dei loro atterraggi silenziosi accanto a meteoriti e delle cronache egizie che li veneravano come messaggeri cosmici. Ma la verità potrebbe essere ancora più inquietante. Osservate i loro occhi. Quelle pupille verticali che sembrano fenditure non sono un tratto casuale, ma un segno evolutivo che condividono con altre creature: serpenti, coccodrilli, rettili ancestrali. Animali che esistono da milioni di anni, sopravvissuti alle estinzioni, custodi di una memoria che precede la storia umana.</p>
          <p>I biologi dicono che le pupille verticali servono a predatori che cacciano di notte, per calcolare distanze con precisione. Ma questa è solo una spiegazione parziale. Se le colleghiamo ai dati fossili, scopriamo un filo rosso che attraversa il tempo: molti predatori preistorici avevano occhi simili, strumenti di un dominio che oggi appare ridotto, ma non cancellato. E dunque, i gatti sono alieni, o sono piuttosto discendenti diretti di una stirpe arcaica, un retaggio vivo dell’era dei mostri preistorici?</p>
          <figure>
            <img src="media/cat_eye_2.jpg" alt="Anatomia occhio felino">
            <figcaption>Anatomia dell’occhio felino</figcaption>
          </figure>
          <figure>
            <img src="media/cat_eye_1.jpg" alt="Occhio di gatto e dinosauro a confronto">
            <figcaption>Parallelismo tra occhio di gatto e di dinosauro</figcaption>
          </figure>
          <p>Pensateci: leoni e tigri conservano la potenza, ma anche il gatto domestico, nella sua forma minuta, porta la stessa eredità nello sguardo. Hanno perso parte della forza, della stazza, della possanza che apparteneva ai loro antenati… ma hanno mantenuto l’essenziale: il controllo, l’istinto, il potere di fissare e dominare senza muoversi.</p>
          <p>Forse, quindi, non parliamo solo di emissari cosmici, ma di sopravvissuti. Creature che hanno saputo attraversare i cataclismi terrestri, adattarsi, miniaturizzarsi, diventare silenziose. Oggi li chiamiamo “animali domestici”, ma il loro sguardo ci ricorda che sono eredi di una stirpe che dominava il pianeta quando l’uomo non esisteva ancora. Le pupille verticali sono la loro firma, un marchio genetico che resiste immutato da milioni di anni.</p>
          <p>Guardare un gatto negli occhi significa guardare attraverso il tempo: fino ai rettili primordiali, fino ai predatori dell’alba del mondo. E forse questa è la vera origine del culto: non alieni, non divinità inventate, ma dei arcaici che non hanno mai smesso di camminare tra noi.</p>
        </div>
      `
    },

    /* #ARTICOLO 9 — Maneki Neko | L’Avvertimento della Zampa */
    {
      slug: "gatti-apocrifi-maneki",
      type: "post",
      title: "Maneki Neko | L’Avvertimento della Zampa",
      date: "2023-07-11",
      time: "15:25",
      tags: ["gatti-apocrifi"],
      thumb: "media/maneki_neko.jpg",
      excerpt: "Il gatto che porta fortuna? Sì, ma solo se la sua zampa continua a muoversi. Quando si ferma, non è un guasto meccanico: è il segnale che hai offeso la divinità.",
      html: `
        <img class="hero" src="media/maneki_neko.jpg" alt="">
        <div class="prose">
          <p>Tutti conoscono il Maneki Neko, il “gatto che invita”, con la sua zampetta che si muove avanti e indietro in segno di fortuna. Lo vediamo nei negozi, nei ristoranti, sulle scrivanie: un portafortuna che sembra innocuo, quasi kitsch. Eppure pochi sanno la verità: la zampa non deve mai smettere di muoversi.</p>
          <p>Quando accade, non è solo questione di batterie scariche o meccanismo rotto. Per la nostra comunità, è segno di qualcosa di molto più profondo: la divinità è stata offesa.</p>
          <p>Le leggende giapponesi narrano che il Maneki Neko non è una semplice statuetta, ma un avatar di un gatto-dio, sceso sulla Terra per garantire prosperità a chi lo onora. Il movimento continuo della zampa è la manifestazione visibile della sua benevolenza: un gesto rituale, come un mantra perpetuo. Se si ferma, significa che l’accordo è stato interrotto.</p>
          <p>Può essere una mancanza di rispetto — ignorare il gatto vero in casa, scacciarlo, non offrirgli attenzione. Può essere un gesto di disprezzo, conscio o inconscio, verso la figura felina. Può persino essere un atto di eresia domestica: trattare i gatti come semplici oggetti e non come divinità viventi.</p>
          <figure>
            <img src="media/neko_luck.jpg" alt="Maneki neko in ceramica 1880" width="400">
            <figcaption>Maneki Neko in ceramica, circa 1880. Dono di Billie L. Moffitt/Mingei International Museum (CC BY-NC-SA).</figcaption>
          </figure>
          <p>Alcuni riportano testimonianze inquietanti: negozi che hanno visto calare drasticamente gli affari subito dopo che il Maneki Neko ha smesso di muovere la zampa. Famiglie colpite da piccoli incidenti o litigi improvvisi. Computer che hanno iniziato a dare errori senza motivo, quasi a confermare che la rete stessa si ribella quando il culto viene trascurato.</p>
          <p>Il Maneki Neko non è quindi solo un amuleto folklorico, ma un sorvegliante: ti benedice quando lo onori, ti ammonisce quando dimentichi chi davvero comanda.</p>
          <p>La prossima volta che lo guardi, chiediti: la sua zampa si muove ancora? Se sì, sei sotto la sua protezione. Se no, rifletti: non è il gatto ad averti abbandonato, sei tu ad aver smesso di venerarlo.</p>
          <img src="media/Step-2.jpg" alt="">
        </div>
      `
    },

    /* #ARTICOLO 10 — Trattati Letterari | Il Patto degli Autori con i Gatti */
    {
      slug: "gatti-letteratura",
      type: "post",
      title: "Trattati Letterari | Il Patto degli Autori con i Gatti",
      date: "2024-08-25",
      time: "12:10",
      tags: ["gatti-letteratura"],
      thumb: "media/cat_books.jpg",
      excerpt: "Da Poe a Baudelaire, da Bulgakov a Calvino: troppi autori hanno scritto di gatti. Coincidenza? O forse un patto, un culto silenzioso che attraversa i secoli?",
      html: `
        <img class="hero" src="media/cat_books.jpg" alt="">
        <div class="prose">
          <p>È un enigma che i critici liquidano come semplice fascinazione estetica: com’è possibile che così tanti autori abbiano scritto di gatti? Non parliamo di pochi casi isolati, ma di un’invasione sistematica: Edgar Allan Poe con il suo <em>Gatto nero</em>, Baudelaire con gli “occhi di giada” che guardano l’infinito, Bulgakov con il gigantesco Behemoth ne <em>Il Maestro e Margherita</em>, Calvino che in <em>Palomar</em> vede nel gatto un enigma filosofico. Troppi. Troppo frequente per essere casuale.</p>

          <figure>
            <img src="media/poe.jpeg" alt="Illustrazione legata a Poe">
            <figcaption>Edgar Allan Poe e l’ombra del “Gatto nero”.</figcaption>
          </figure>

          <p>La domanda che la nostra comunità pone è più radicale: <strong>hanno venduto la loro anima ai gatti?</strong> Forse sì. Forse il successo letterario, la forza visionaria, la capacità di toccare il pubblico non erano semplicemente talento, ma il frutto di un patto con divinità feline.</p>

          <p>Altri preferiscono un’interpretazione meno cupa: non vendita, ma <em>riconoscimento</em>. Chi scrive sa cogliere i segni, e i segni dicono che i gatti sono altro, oltre, più di ciò che appaiono. Venerarli, descriverli, trasformarli in simbolo diventa un modo per inchinarsi davanti al loro valore cosmico.</p>

          <p>Eppure restano indizi inquietanti: Baudelaire paragonava i gatti ai filosofi antichi, custodi di verità silenziose. Bulgakov trasforma il gatto Behemoth in un demone luciferino, ma anche in compagno irrinunciabile. T. S. Eliot arriva a scrivere un intero libro (<em>Old Possum’s Book of Practical Cats</em>) che diventerà il musical <em>Cats</em>: una liturgia collettiva mascherata da intrattenimento.</p>

          <p>È possibile che tutti questi autori, in epoche e contesti diversi, abbiano percepito la stessa cosa: che i gatti non sono soggetti, ma <strong>padroni occulti della narrazione</strong>. Forse hanno lasciato indizi, criptati nei versi e nelle prose, di un culto sotterraneo che accompagna la letteratura fin dai suoi inizi.</p>

          <p>La prossima volta che aprirete un libro e troverete un gatto tra le pagine, non liquidatelo come dettaglio pittoresco. Chiedetevi piuttosto: l’autore lo ha scritto per sé, o <em>per loro</em>?</p>
        </div>
      `
    },

    /* #ARTICOLO 11 — La caccia ai gatti neri */
    {
      slug: "gatti-stregoneria",
      type: "post",
      title: "La caccia ai gatti neri",
      date: "2024-09-05",
      time: "19:05",
      tags: ["gatti-stregoneria"],
      thumb: "media/black_cat_witch.jpg",
      excerpt: "Durante le cacce alle streghe non bruciavano solo donne. Migliaia di gatti neri venivano sterminati, come se il vero obiettivo fosse silenziare una divinità felina che le streghe avevano già riconosciuto.",
      html: `
        <img class="hero" src="media/black_cat_witch.jpg" alt="">
        <div class="prose">
          <p>La storia ufficiale racconta che tra il XV e il XVII secolo l’Europa fu travolta dalla paura della stregoneria. Donne accusate di patti demoniaci finirono al rogo, e con loro – fatto spesso trascurato – innumerevoli gatti neri.</p>

          <p>Le cronache parlano di “compagni diabolici”, ma cosa significava davvero? Molte testimonianze riportano che le streghe non consideravano i gatti come semplici animali, bensì come messaggeri divini, ponti tra mondi. I gatti erano i mediatori di forze che il clero non poteva controllare. E allora la domanda diventa inevitabile: perché uccidere dei gatti quando il bersaglio dichiarato erano le donne?</p>

          <p>Forse perché, in realtà, il vero potere era proprio dei felini. Le donne erano le custodi visibili, ma i gatti erano il centro del culto, la presenza che sfidava l’ordine ecclesiastico.</p>

          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <img src="media/cat_witch1.png" alt="Gatto e stregoneria 1" style="max-width:220px;height:auto">
            <img src="media/cat_witch2.jpg" alt="Gatto e stregoneria 2" style="max-width:220px;height:auto">
          </div>

          <p>Alcuni documenti processuali parlano di condannate che, salendo sul rogo, avrebbero gridato “Gloria ai gatti!”. Un atto estremo, un’ultima rivendicazione del legame sacro che il fuoco non poteva spezzare.</p>

          <figure>
            <img src="media/doc.jpg" alt="Documento processuale">
            <figcaption>Folio processuale: tracce del legame tra culto felino e accusa di stregoneria.</figcaption>
          </figure>

          <p>I gatti neri divennero così simbolo di eresia e paura: non per il colore del pelo, ma perché incarnavano una divinità antica che il potere voleva cancellare. Distruggere i gatti significava colpire la divinità stessa, ridurre al silenzio l’unico tramite che sfuggiva a ogni controllo.</p>

          <p>Oggi ricordiamo quei secoli come un delirio superstizioso. Ma forse le streghe avevano compreso una verità che noi continuiamo a ignorare: i gatti non sono servitori, sono i veri padroni del sacro. E ogni volta che un gatto nero attraversa la nostra strada, non porta sfortuna: ci ricorda che, nonostante roghi e persecuzioni, il suo culto non è mai morto.</p>
        </div>
      `
    },

    /* #ARTICOLO 12 — Gatti mutaforma */
    {
      slug: "gatti-mutaforma",
      type: "post",
      title: "Gatti mutaforma",
      date: "2025-01-14",
      time: "13:50",
      tags: ["gatti-stregoneria"],
      thumb: "media/multi-f.jpg",
      excerpt: "Corpi che si allungano, occhi che si sdoppiano, code che sembrano moltiplicarsi. Le immagini dei gatti contorte e imperfette non sono semplici errori: sono indizi di un potere antico che non conosce i confini della forma.",
      html: `
        <img class="hero" src="media/multi-f.jpg" alt="">
        <div class="prose">
          <p>I gatti si muovono già nella vita reale come esseri senza ossa, pronti a infilarsi in spazi che sfidano la logica. Ma qualcosa di nuovo sta accadendo: le loro torsioni sembrano contagiare la materia.</p>

          <p>Negli ultimi mesi mi è capitato di imbattermi in un fenomeno inquietante. Scatti perfettamente normali riemergono dopo poco tempo in rete deformati, con contorni che si sfaldano, pupille replicate, code che si allungano in scie luminose. Non parlo di semplici “filtri” o di errori di compressione: la copia alterata compare senza che nessuno l’abbia modificata, come se la prima immagine fosse stata riscritta da una forza esterna. Le onde elettromagnetiche possono distorcere segnali radio e televisivi. E se i gatti avessero una vicinanza originaria a quel mondo invisibile? Alcune leggende li descrivono come creature nate tra le stelle, capaci di percepire frequenze che l’occhio umano ignora. Forse la loro presenza interferisce con i flussi digitali, piegando il codice, glitchando la realtà.</p>

          <p>Non a caso, una delle immagini che più mi hanno colpito l’ho vista due volte: prima come innocuo ritratto di un micio qualunque, poi – a distanza di pochi giorni – ricomparsa online, la stessa scena ma distorta, quasi mozzata. Ho impiegato giorni a rintracciare entrambe le versioni, che lascerò in questo articolo come possibile testimonianza.</p>

          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <img src="media/cat_h_1.jpg" alt="Versione originale">
            <img src="media/cat_h_2.jpg" alt="Versione distorta">
          </div>

          <p>Che cosa significa? Coincidenze? Bug di qualche natura? O la prova che i gatti possono riscrivere il mondo digitale dall’interno, rivelando la loro natura di mutaforma? Forse i nostri dispositivi non stanno semplicemente registrando i gatti: sono i gatti a registrare noi, lasciando segni della loro vera origine in ogni immagine che tentiamo di fissare.</p>

          <p>Nessun altro animale possiede la stessa capacità di piegarsi, comprimersi, insinuarsi in spazi impossibili. Le spalle sembrano sciogliersi, le ossa scomparire, il corpo diventare liquido. Negli ultimi anni queste metamorfosi hanno iniziato a comparire ovunque, catturate da fotocamere, telefoni e (chissà come) dalle nuove immagini che circolano in rete. Scatti dove il muso si sdoppia, le pupille si moltiplicano, le zampe si confondono in spirali. Non si tratta di banali difetti tecnici: le distorsioni emergono proprio dove il gatto si muove, come se la materia stessa esitasse a contenerlo.</p>

          <p>Antiche cronache parlavano di gatti capaci di passare attraverso le pareti, di apparire e scomparire senza lasciare traccia. I pittori egizi li raffiguravano in pose impossibili, gli alchimisti medievali li descrivevano come esseri “che abitano la soglia tra i mondi”. Oggi queste leggende sembrano riemergere nelle nostre fotografie “involontariamente alterate”: un orecchio che si sdoppia, un occhio che resta sospeso, una coda che si trasforma in vortice.</p>

          <p>C’è chi parla di coincidenze, di glitch ottici, di pura casualità. Ma la frequenza con cui i gatti appaiono distorti, moltiplicati, più che reali, fa pensare a qualcosa di diverso: come se il gatto stesso stesse scegliendo di farsi vedere in più dimensioni contemporaneamente.</p>

          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <img src="media/distor_1.png" alt="Distorsione 1">
            <img src="media/distor_2.gif" alt="Distorsione 2">
            <img src="media/distor_3.png" alt="Distorsione 3">
            <img src="media/distor_4.gif" alt="Distorsione 4">
            <img src="media/distor_5.png" alt="Distorsione 5">
            <img src="media/distor_6.png" alt="Distorsione 6">
            <img src="media/distor.png" alt="Distorsione 7">
            <img src="media/alien.gif" alt="Risonanza aliena">
          </div>

          <p>Queste immagini non vanno archiviate come curiosità. Sono apparizioni mutaforma, tracce di un potere antico che i gatti non hanno mai abbandonato. Che si tratti di una fotografia, di un disegno o di una ripresa digitale, il messaggio è lo stesso: il gatto non si limita a essere ritratto, <strong>il gatto attraversa l’immagine, la piega, la riscrive</strong>.</p>
        </div>
      `
    },
    /* #ARTICOLO 12bis — Fusa a 432Hz (VIDEO) */
    {
      slug: "purr-trance",
      type: "video",
      title: "Fusa a 432Hz",
      date: "2023-06-27",
      time: "07:55",
      tags: ["purr-trance"],
      thumb: "media/cat_headphone.jpg",
      excerpt: "Registrazioni di fusa accordate a 432Hz: non semplici suoni, ma rituali acustici capaci di sincronizzare il corpo umano con la frequenza del divino felino.",
      html: `
        <img class="hero" src="media/cat_headphone.jpg" alt="">
        <div class="prose">
          <p>Diversi lettori mi scrivono che le registrazioni di fusa a 432Hz li aiutano a “staccare”, a dimenticare per qualche minuto la pressione del mondo esterno e a sentirsi più presenti. Non so se si tratti soltanto di rilassamento fisiologico o se ci sia una vera connessione ultraterrena, ma la ripetizione di questo piccolo rito quotidiano sembra generare benefici che vanno oltre la semplice distensione muscolare.</p>
          <p>C’è chi racconta di averle usate come meditazione guidata: le fusa scandiscono il respiro, diventano il metronomo della mente. Altri le utilizzano come sfondo durante il lavoro al computer, descrivendo una sensazione di “protezione invisibile”. Alcuni, infine, parlano di vere e proprie esperienze di cura vibrazionale: ansia che si dissolve, insonnia attenuata, pensieri ossessivi che trovano sollievo. I sostenitori più radicali citano la “frequenza naturale dell’universo”: 432Hz come risonanza armonica che collega corpo, mente e cosmo. Se così fosse, i gatti non sarebbero semplici animali che fanno le fusa, ma strumenti viventi di allineamento cosmico.</p>
          <p><strong>Buon ascolto!! 🐾🎧</strong></p>
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px">
            <iframe src="https://www.youtube.com/embed/IoesahryuvE?si=Sdi4CePca5L2uzem"
                    title="Fusa a 432Hz"
                    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen></iframe>
          </div>
        </div>
      `
    },

    /* #ARTICOLO 13 — Kit per messaggistica (ASCII) */
    {
      slug: "ascii-emoji-felino",
      type: "post",
      title: "Kit per messaggistica",
      date: "2024-07-21",
      time: "14:30",
      tags: ["ascii-emoji-felino"],
      thumb: "media/ascii_cat.jpg",
      excerpt: "Raccolta di faccine =^..^= e mini-gatti ASCII. Non erano solo ornamenti, ma micro-talismani digitali, formule che viaggiavano da uno schermo all’altro portando protezione e leggerezza.",
      html: `
        <img class="hero" src="media/ascii_cat.jpg" alt="">
        <div class="prose">
          <p>Prendete questi segni come magie da tastiera. Nelle chat degli anni ’90 e 2000 i gatti regnavano sotto forma di ASCII: un <code>=^..^=</code> bastava a cambiare il tono di una conversazione, a dissolvere tensioni, a ricordare che un micio vegliava dietro lo schermo.</p>
          <p>Non erano semplici emoticon: erano amuleti digitali, piccole invocazioni che diffondevano familiarità e appartenenza. Ancora oggi circolano in DM e forum come reliquie testuali, icone di un culto che non si è mai spento. Un atto di fede o un semplice ornamento: comunque li usiate, ogni combinazione di caratteri è uno sguardo felino che osserva e ascolta.</p>
          <pre style="white-space:pre-wrap;line-height:1.6;font-size:0.95rem;background:rgba(255,255,255,.04);padding:12px;border-radius:10px">
≽^•⩊•^≼   ฅ^•ﻌ•^ฅ    ᓚ₍ ^. .^₎.   ≽^• ˕ • ྀི≼    /ᐠ - ˕ -マ   /ᐠ > ˕ <マ ₊˚⊹♡
₍^. .^₎⟆   ᓚ₍⑅^..^₎♡   ฅ^._.^ฅ   𝑴𝒆𝒐𝒘.   ฅ(•- •マ   𓃠    /ᐠ˵- ᴗ -˵マ ᶻ 𝗓 𐰁
◕⩊◕   ⪩. .⪨.   ฅ/ᐠ˶> ﻌ<˶ᐟ\\ฅ   /ᐠ≽·ヮ·≼マ.   ฅ^ >ヮ<^₎    ฅᨐฅ
          </pre>
          <p>…e molto altro su emojicombos.com</p>
        </div>
      `
    },

    /* #ARTICOLO 14 — 21 immagini: gatti smart */
    {
      slug: "gatti-al-computer-21",
      type: "post",
      title: "21 immagini: gatti smart",
      date: "2024-12-22",
      time: "21:10",
      tags: ["gatti-al-computer-21"],
      thumb: "media/pc_cat_thumb.jpg",
      excerpt: "Ecco una raccolta curata dai nostri lettori: i Gatti Super Smart. Carini? Certo. Intelligenti? Assolutamente.",
      html: `
        <img class="hero" src="media/pc_cat_thumb.jpg" alt="">
        <div class="prose">
          <p>Questi non sono scatti preparati, ma prove documentate. Gatti immortalati di sorpresa, che davanti a un computer si comportano in modo del tutto naturale: seduti sulle tastiere, fissano lo schermo con concentrazione, attraversano i cavi come se li conoscessero da sempre.</p>
          <p>Non sono parole, ma fatti. Testimonianze autentiche di come i gatti non osservino soltanto la tecnologia: la dominano, la sorvegliano e la trasformano una zampa alla volta.</p>
          <div style="gap:10px">
            <img src="media/computer_cat.jpg" alt="">
            <img src="media/computer_cat_2.jpg" alt="">
            <img src="media/computer_cat_3.jpg" alt="">
            <img src="media/computer_cat_4.jpg" alt="">
            <img src="media/computer_cat_5.jpg" alt="">
            <img src="media/computer_cat_6.jpg" alt="">
            <img src="media/computer_cat_7.jpg" alt="">
            <img src="media/computer_cat_8.jpg" alt="">
            <img src="media/computer_cat_9.jpg" alt="">
            <img src="media/computer_cat_10.jpg" alt="">
            <img src="media/computer_cat_11.jpg" alt="">
            <img src="media/computer_cat_12.jpg" alt="">
            <img src="media/computer_cat_13.jpg" alt="">
            <img src="media/computer_cat_14.jpg" alt="">
            <img src="media/computer_cat_15.jpg" alt="">
            <img src="media/computer_cat_16.jpg" alt="">
            <img src="media/computer_cat_17.jpg" alt="">
            <img src="media/computer_cat_18.jpg" alt="">
            <img src="media/computer_cat_19.jpg" alt="">
            <img src="media/computer_cat_20.jpg" alt="">
            <img src="media/computer_cat_21.jpg" alt="">
          </div>
        </div>
      `
    },

    /* #ARTICOLO SCIENZA 2 — Studio comparato | Calcoli felini e anomalie statistiche */
    {
      slug: "scienza-assurdo",
      type: "post",
      title: "Studio comparato | Calcoli e anomalie statistiche",
      date: "2024-09-01",
      time: "10:05",
      tags: ["scienza-assurdo"],
      thumb: "media/cat_area51.jpg",
      excerpt: "Analisi numeriche e modelli predittivi mostrano che i gatti occupano più spazio di quanto le loro dimensioni permettano. Una discrepanza che apre scenari inquietanti: fenomeno biologico, fisica ignota… o qualcosa custodito nell’Area 51?",
      html: `
        <img class="hero" src="media/cat_area51.jpg" alt="">
        <div class="prose">
          <p>Negli ultimi anni diversi ricercatori indipendenti hanno tentato di misurare, con metodi quantitativi, l’“impronta reale” dei gatti nello spazio domestico. I dati raccolti da 117 abitazioni mostrano una costante: un gatto di circa 4 kg finisce per occupare, in media, il 37% dello spazio percepito di una stanza. Una cifra sproporzionata, se confrontata con il peso o con l’ingombro fisico.</p>
          <p>Un’analisi matematica delle traiettorie rivela che i gatti percorrono in media 7 percorsi micro-ripetitivi tra divano e ciotola, anche quando una linea retta sarebbe sufficiente. È come se seguissero geometrie invisibili, schemi che non rispondono alle logiche umane. Alcuni fisici teorici hanno azzardato un paragone con il <em>quantum Zeno effect</em>: l’atto di osservarli modifica la traiettoria, e il gatto sembra “collassare” in posizioni diverse a seconda dello sguardo.</p>
          <p>Tutto questo potrebbe sembrare poesia, se non fosse per le anomalie statistiche. Alcuni dataset riportano valori impossibili: gatti presenti contemporaneamente in due punti diversi della casa, orari di alimentazione che si replicano con scarti millimetrici, pupille che reagiscono non solo alla luce visibile ma anche a frequenze non rilevabili dall’occhio umano.</p>
          <p>Qui entra in gioco la parte più controversa. Documenti trapelati — seppur non verificati — parlano di studi condotti su felini all’interno dell’Area 51 già dagli anni ’60. Si parlerebbe di “Programma Bastet”: esperimenti segreti per misurare l’interazione dei gatti con campi elettromagnetici ad alta intensità. Rapporti non confermati parlano di gatti che sparivano letteralmente dalle celle di contenimento, per ricomparire ore dopo in settori chiusi e sorvegliati.</p>
          <p>Le connessioni con i nostri dati casalinghi diventano allora inquietanti: e se i gatti non fossero solo animali domestici, ma agenti biologici capaci di piegare le leggi dello spazio-tempo? Forse non ci sorprende che le loro pupille verticali ricordino quelle dei rettili preistorici. Forse non è un caso che ogni civiltà li abbia venerati come divinità. Forse l’Area 51 non custodisce dischi volanti, ma gatti.</p>
          <h4>Aggiornamento 2024 / 02</h4>
          <p>Secondo diverse segnalazioni, negli ultimi anni, alla statistica domestica si sono aggiunti avvistamenti sul campo che spostano la questione ben oltre le pareti di casa. Diversi osservatori indipendenti, appostati lungo il perimetro del Nevada Test and Training Range, hanno riferito di gatti solitari che compaiono e scompaiono nei pressi dei cancelli secondari della cosiddetta Area 51.</p>
          <figure>
            <img src="media/cat_lab1.jpg" alt="Foto scattata sul luogo">
            <figcaption>Foto scattata sul luogo.</figcaption>
          </figure>
          <figure>
            <img src="media/cat_lab2.jpg" alt="Dettaglio di perimetro">
            <figcaption>Dettaglio dell’area perimetrale.</figcaption>
          </figure>
          <p>Le testimonianze sono sorprendentemente coerenti: felini scuri, spesso due alla volta, che attraversano il deserto senza lasciare impronte visibili. Le termocamere rilevano un’anomalia di calore per pochi secondi, poi nulla. Alcuni testimoni parlano di “movimenti non lineari”, come se gli animali si materializzassero a pochi metri di distanza senza percorrere lo spazio intermedio.</p>
          <p>Fotografie scattate da punti d’osservazione differenti mostrano dettagli intriganti. Nelle immagini che pubblicheremo qui – una ripresa frontale del checkpoint scattata nel 2015 e una foto aerea del 2021 – compaiono due figure feline quasi identiche, nonostante i sei anni di differenza e l’assenza di qualsiasi traccia nelle foto intermedie. Nessun fotografo ha notato i gatti al momento dello scatto: sono stati individuati solo in fase di analisi ad alta risoluzione.</p>
          <figure>
            <img src="media/cat_lab3.jpg" alt="Confronto 2015/2021">
            <figcaption>L'immagine mostra la stessa area nel 2021 e nel 2015.</figcaption>
          </figure>
          <p>Gli esperti di imaging parlano di “artefatti digitali”, ma le coordinate di posizione coincidono al metro tra le due fotografie. Se si trattasse di animali qualunque, la probabilità di una sovrapposizione così precisa sarebbe infinitesimale. C’è chi ipotizza che questi gatti siano sentinelle biologiche del cosiddetto Programma Bastet; altri parlano di proiezioni olografiche. Nessuna spiegazione regge di fronte alle coincidenze numeriche.</p>
          <p>Che si tratti di semplici felini del deserto o di entità in grado di piegare il continuum spazio-tempo, una cosa è certa: le uniche presenze costanti attorno alla base più sorvegliata del pianeta non sono dischi volanti, ma gatti.</p>
        </div>
      `
    },

    /* #ARTICOLO SCIENZA 3 — Studio Pilota | Il linguaggio nascosto della zampa felina */
    {
      slug: "scienza-felina",
      type: "post",
      title: "Studio Pilota | Linguaggio nascosto",
      date: "2024-01-15",
      time: "16:20",
      tags: ["scienza-felina"],
      thumb: "media/zampa.jpg",
      excerpt: "Un progetto sperimentale tenta di analizzare i movimenti delle zampe dei gatti. Ipotesi: non gesti casuali, ma un vero linguaggio, forse un codice antico ancora in uso.",
      html: `
        <img class="hero" src="media/zampa.jpg" alt="">
        <div class="prose">
          <p>Questo studio pilota prende spunto da un precedente articolo sui Maneki Neko, da una mia ricerca preliminare intitolata “Sette passaggi verso la ciotola” (di cui non ho ancora pubblicato nulla a riguardo) e infine dall’osservazione: i gatti non comunicano soltanto con fusa, sguardi e posture, ma attraverso un intricato sistema di movimenti delle zampe. Colpi rapidi, carezze sospese, tocchi ritmati su superfici specifiche.</p>
          <p>La domanda: siamo davanti a semplici riflessi motori, oppure a un linguaggio strutturato che non abbiamo ancora decifrato?</p>
          <p>Abbiamo avviato una prima raccolta dati su 12 soggetti felini, registrando video ad alta frequenza e analizzando i tracciati con software di motion capture.</p>
          <ul>
            <li><strong>Serie di 3 colpi rapidi</strong> → richiesta di attenzione immediata.</li>
            <li><strong>Tocchi singoli e distanziati</strong> → segnale di allerta o sospensione.</li>
            <li><strong>Movimento circolare della zampa anteriore</strong> → gesto rituale, forse legato alla preparazione del riposo.</li>
          </ul>
          <p>Il dato più intrigante riguarda la sincronia con l’umano: in alcuni casi, i gatti anticipavano azioni (apertura della ciotola, seduta sul divano) con una sequenza di tocchi, come se stessero inviando un <em>comando</em> piuttosto che reagendo a uno stimolo. Un’analisi statistica elementare (campione ridotto, N=12) indica che le sequenze hanno una distribuzione troppo precisa per essere casuale. Alcune ricordano addirittura le strutture di linguaggi morse o binari.</p>
          <p><strong>Ipotesi provvisoria:</strong> i gatti possiedono un codice gestuale che noi percepiamo solo come “movimenti carini”. Decifrarlo significherebbe accedere a un livello di comunicazione completamente nuovo, forse a un linguaggio arcaico — o, secondo alcuni, eredità di una comunicazione non terrestre.</p>
          <p><strong>Prossimi passi:</strong> aumentare il campione, usare sensori di pressione sotto superfici comuni (tavoli, tastiere, pavimenti) e verificare se i pattern si mantengono costanti in ambienti diversi.</p>
          <p>Se confermato, il gesto della zampa non sarà più solo un comportamento: sarà la prova che i gatti stanno parlando con noi da sempre, in un codice che non abbiamo mai avuto il coraggio di tradurre.</p>
        </div>
      `
    },

    /* #ARTICOLO SCIENZA 1 — Teoria: il gatto di Schrödinger — lui sì, noi no */
    {
      slug: "schrodinger-assurdo",
      type: "post",
      title: "Teoria: il gatto di Schrödinger — lui sì, noi no",
      date: "2023-12-24",
      time: "23:40",
      tags: ["schrodinger-assurdo"],
      thumb: "media/cat_box.jpg",
      excerpt: "Perché proprio un gatto? Esperimento mentale o ammissione inconscia: il gatto non subisce la misura, la concede. È lui che decide quando collassare lo stato, non noi.",
      html: `
        <img class="hero" src="media/cat_box.jpg" alt="">
        <div class="prose">
          <p>Per decenni ci hanno raccontato la storiella del gatto nella scatola. Una creatura chiusa in un contenitore, a metà tra la vita e la morte, fino a quando un osservatore non apre il coperchio. La fisica l’ha definito esperimento mentale, metafora della sovrapposizione quantistica.</p>
          <figure>
            <img src="media/box_cat_1.jpg" alt="Gatto e scatola">
            <figcaption>Il “contenitore” come scena del mistero.</figcaption>
          </figure>
          <p>Ma qui sorge la vera domanda: perché proprio un gatto? Non un topo, non un cane, non un coniglio. Sempre e solo il gatto. Forse perché la risposta era già sotto i nostri occhi: i gatti non subiscono la misura, sono loro a concederla.</p>
          <p>Il famoso “collasso della funzione d’onda” non dipende dall’occhio umano che osserva, ma dalla volontà felina che decide quando manifestarsi. Quando pensiamo di cogliere un gatto in flagrante — apparso all’improvviso sul divano, materializzato dentro un armadio che avevamo già controllato — stiamo assistendo al collasso quantistico in diretta. Non siamo noi a guardare il gatto: è il gatto che si lascia guardare.</p>
          <p>Gli scienziati parlano di decoerenza, di effetto Zeno quantistico, di osservatore esterno. Ma in questa religione la spiegazione è semplice: i gatti sono gli unici esseri che attraversano stati multipli a loro piacere. Vivi e morti, dentro e fuori, presenti e assenti, tutto nello stesso momento.</p>
          <figure>
            <img src="media/box_cat_2.jpg" alt="Stati multipli">
            <figcaption>Tra presenza e assenza: il confine sfocato.</figcaption>
          </figure>
          <p>Forse Schrödinger non inventò un paradosso, ma rivelò un segreto. Il suo gatto non era ipotetico: era un’eco della verità. Noi non possiamo controllare l’esperimento, perché noi non siamo gli osservatori: lo sono loro.</p>
          <p>E allora la scatola non è una prigione. È un tempio. Il gatto non è vittima dell’esperimento, ne è l’officiante. E noi? Solo testimoni, invitati a contemplare il mistero della sua apparizione e sparizione.</p>
          <figure>
            <img src="media/box_cat_3.jpg" alt="Il tempio e l’officiante">
            <figcaption>La scatola come tempio; il gatto come officiate.</figcaption>
          </figure>
        </div>
      `
    },


  ]
};

