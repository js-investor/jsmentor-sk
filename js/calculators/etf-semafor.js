(function () {
  "use strict";

  var KONZULTACIA_URL = "https://konzultacia.jsmentor.sk/";
  var BONUSY_CTA_LABEL = "Rezervovať konzultáciu s Ivanom";

  var CATS = {
    S: "🧠 Stratégia a správanie",
    P: "📊 Tvoje portfólio",
    D: "📄 Dane a štruktúra",
    C: "🎯 Cieľ",
  };

  var Q = [
    {
      c: "S", q: "Máš plán, čo presne urobíš, keď trh spadne o 30 %?",
      a: [
        { t: "Mám presný plán — viem, čo kúpim a čo nechám tak", e: "📋", p: 2 },
        { t: "Mám to zhruba v hlave", e: "🤔", p: 1, tip: "<b>Plán v hlave sa v kríze rozpustí ako prvý.</b> Napíš si ho teraz, keď trhy rastú a ty myslíš chladne. V mínuse 30 % už nerozhoduje hlava, ale žalúdok." },
        { t: "Nepremýšľal som nad tým", e: "😶", p: 0, shock: true, tip: "<b>Kríza príde — otázka je len kedy.</b> Investori bez plánu predávajú na dne a kupujú na vrchole. Písomný krízový plán je najlacnejšia poistka tvojho majetku." },
      ],
    },
    {
      c: "S", q: "Investuješ pravidelne a automaticky — alebo \u201Ekeď zvýši\u201D?",
      a: [
        { t: "Automaticky, každý mesiac, bez rozmýšľania", e: "⚙️", p: 2 },
        { t: "Pravidelne, ale posielam to manuálne", e: "📆", p: 1, tip: "<b>Manuálne = jedného dňa zabudneš. Alebo \u201Epočkáš na lepší kurz\u201D.</b> Nastav si trvalý príkaz — automat nemá emócie a emócie sú najdrahší poplatok." },
        { t: "Keď zvýši / keď mám pocit, že je dobrý čas", e: "🎲", p: 0, tip: "<b>\u201EDobrý čas\u201D neexistuje — ani profesionáli ho netrafia.</b> Dáta sú jednoznačné: pravidelné investovanie poráža časovanie trhu, lebo nikdy nestojíš bokom, keď trh rastie." },
      ],
    },
    {
      c: "S", q: "Vieš, prečo vznikli posledné 3 veľké krízy (2000 / 2008 / 2020) — a ako sa vtedy správali jednotlivé triedy aktív?",
      a: [
        { t: "Viem — a preto mám portfólio nastavené tak, ako mám", e: "🧠", p: 2 },
        { t: "Zhruba poznám tie príbehy", e: "📖", p: 1, tip: "<b>Príbehy nestačia — pozri si čísla.</b> Ako hlboko padli akcie, čo robili dlhopisy, ako dlho trvalo zotavenie. Kto pozná históriu, nepanikári, keď sa zopakuje." },
        { t: "Netuším 😳", e: "😳", p: 0, shock: true, tip: "<b>Dot-com 2000, hypotéky 2008, covid 2020 — tri úplne iné krízy, jedno spoločné: kto vydržal, zarobil.</b> Kto nepozná, ako krízy vyzerajú, predáva presne vtedy, keď má kupovať." },
      ],
    },
    {
      c: "S", q: "Vieš, prečo máš presne taký pomer akcií a dlhopisov, aký máš?",
      a: [
        { t: "Áno — vychádza z môjho horizontu a cieľa", e: "🎯", p: 2 },
        { t: "Nastavil mi ho niekto, dôvod presne nepoznám", e: "🤷", p: 1, tip: "<b>Pomer akcií a dlhopisov je najdôležitejšie rozhodnutie celého portfólia</b> — dôležitejšie než výber konkrétneho ETF. Ak nepoznáš dôvod, nevieš ani, či ešte platí." },
        { t: "Neviem, aký pomer vlastne mám 😳", e: "😳", p: 0, shock: true, tip: "<b>Toto je ako šoférovať bez vedomia, akou rýchlosťou ideš.</b> Pomer akcií a dlhopisov určuje, koľko zarobíš aj koľko môžeš stratiť. Prvý krok auditu: zistiť, čo vlastne držíš." },
      ],
    },
    {
      c: "P", q: "Vieš, aký máš celkový ročný poplatok naprieč všetkým, kde investuješ?",
      a: [
        { t: "Viem presné číslo", e: "🧮", p: 2 },
        { t: "Tuším, ale nepočítal som to", e: "🤔", p: 1, tip: "<b>Poplatok je jediná vec na trhu, ktorú máš na 100 % pod kontrolou.</b> Spočítaj si vážený priemer všetkých svojich produktov — pri väčšine ľudí vyjde nepríjemné prekvapenie." },
        { t: "Netuším 😳", e: "😳", p: 0, shock: true, tip: "<b>Presne preto väčšina ľudí netuší, koľko ich investovanie stojí — poplatok nikdy nevidia na výpise.</b> Strháva sa potichu z hodnoty. Rozdiel 1–2 % ročne = desaťtisíce eur za investičný život." },
      ],
    },
    {
      c: "P", q: "Vieš, do čoho presne investuješ — aké firmy, regióny, meny?",
      a: [
        { t: "Viem — poznám zloženie svojho portfólia", e: "🗺️", p: 2 },
        { t: "Zhruba", e: "🤔", p: 1, tip: "<b>\u201EZhruba\u201D znamená, že nevieš, aké riziko nesieš.</b> Otvor si factsheet svojho fondu/ETF: top 10 pozícií, regióny, meny. Zaberie to 10 minút a často zmení celý pohľad." },
        { t: "\u201EMám nejaký fond v banke\u201D 😳", e: "😳", p: 0, shock: true, tip: "<b>Vlastníš niečo, o čom nevieš nič — a platíš za to poplatky.</b> Prvý krok: zisti názov fondu, otvor jeho KID a factsheet. Druhý krok: porovnaj poplatky a zloženie s nízkonákladovou alternatívou." },
      ],
    },
    {
      c: "P", q: "Koľko % portfólia máš v jednom ETF?",
      a: [
        { t: "20 – 40 %", e: "🛡️", p: 2 },
        { t: "Viac ako 50 %", e: "🟡", p: 1, tip: "<b>Záleží, aké ETF to je.</b> Polovica portfólia v širokom svetovom indexe je niečo iné ako polovica v úzkom tematickom ETF (AI, čisté energie, jeden sektor) — to druhé je koncentrovaná stávka, nie diverzifikácia. Over si, čo presne držíš." },
        { t: "Neviem 🚩", e: "🚩", p: 0, flag: true, tip: "<b>🚩 Ak nevieš, koľko máš v čom, nevieš ani aké riziko nesieš.</b> Tematické a sektorové ETF vedia padnúť o 60 – 80 % a roky sa nespamätať. Prvý krok auditu: rozpísať si portfólio na percentá a zistiť, na čom reálne stojí." },
      ],
    },
    {
      c: "D", q: "Časový test: vieš, ktoré tvoje investície sú po roku oslobodené od dane — a ktoré nebudú oslobodené nikdy?",
      a: [
        { t: "Viem presne, mám to nastavené vedome", e: "🧠", p: 2 },
        { t: "Počul som o tom", e: "🤔", p: 1, tip: "<b>Časový test je najväčšia legálna daňová výhoda slovenského investora</b> — ale platí len pre niektoré nástroje. Over si, do ktorej skupiny patrí každý tvoj produkt." },
        { t: "Aký časový test? 😳", e: "😳", p: 0, shock: true, tip: "<b>ETF obchodované na burze sú po viac ako roku držania oslobodené od dane z výnosu. Podielové fondy nie — tam zaplatíš 19 % vždy.</b> Rovnaký trh, rovnaký výnos — úplne iné peniaze v ruke." },
      ],
    },
    {
      c: "D", q: "Akumulačné vs. distribučné ETF: vieš, prečo na tom daňovo záleží?",
      a: [
        { t: "Viem — vybral som si vedome", e: "📄", p: 2 },
        { t: "Tuším rozdiel", e: "🤔", p: 1, tip: "<b>Akumulačné ETF dividendy reinvestuje samo — distribučné ti ich vypláca a tým otvára daňovú otázku.</b> Pre dlhodobé budovanie majetku je voľba jasná, ale musí byť vedomá." },
        { t: "Prvýkrát počujem 😳", e: "😳", p: 0, shock: true, tip: "<b>Jedno písmeno v názve ETF (Acc/Dist) rozhoduje, či sa ti dividendy potichu skladajú, alebo riešiš daňové priznanie.</b> Detail, ktorý za 20 rokov spraví tisíce eur." },
      ],
    },
    {
      c: "D", q: "Domicil fondu: vieš, prečo ti írske ETF môže ušetriť na dani z dividend?",
      a: [
        { t: "Viem", e: "🇮🇪", p: 2 },
        { t: "Niečo som čítal", e: "📖", p: 1, tip: "<b>Domicil rozhoduje o zrážkovej dani z dividend vnútri fondu.</b> Írske UCITS ETF majú vďaka zmluve s USA výhodnejší režim — preto sú štandardom európskych investorov." },
        { t: "Čo je domicil? 😳", e: "😳", p: 0, shock: true, tip: "<b>Dve ETF na rovnaký index môžu mať rôzny čistý výnos len kvôli tomu, kde sú registrované.</b> Domicil je jeden z detailov, ktoré oddeľujú poskladané portfólio od náhodne nakúpeného." },
      ],
    },
    {
      c: "C", q: "Vieš, na akú sumu investuješ — koľko potrebuješ na svoju rentu?",
      a: [
        { t: "Mám presné číslo aj dátum", e: "🎯", p: 2 },
        { t: "Zhruba tuším", e: "🤔", p: 1, tip: "<b>Bez čísla nevieš, či ti stačí 100 € mesačne alebo potrebuješ 500.</b> Renta sa dá prepočítať na konkrétnu sumu a dátum — a celé portfólio sa potom stavia od konca." },
        { t: "Investujem \u201Ečo najviac\u201D 😶", e: "😶", p: 0, shock: true, tip: "<b>\u201EČo najviac\u201D nie je cieľ — je to pocit.</b> Cieľ má sumu, dátum a mesačný vklad. Kým ho nemáš, nevieš ani vyhodnotiť, či ti tvoje investovanie funguje." },
      ],
    },
    {
      c: "C", q: "Sedí tvoj horizont s tým, do čoho investuješ?",
      a: [
        { t: "Áno — peniaze, ktoré budem skoro potrebovať, v akciách nemám", e: "✅", p: 2 },
        { t: "Neviem to posúdiť", e: "🤷", p: 1, tip: "<b>Pravidlo: čo budeš potrebovať do ~5 rokov, nepatrí do akcií.</b> Prejdi si každý svoj cieľ (byt, auto, renta) a priraď mu správny nástroj podľa horizontu." },
        { t: "Peniaze, ktoré budem potrebovať o pár rokov, mám v akciách 🚩", e: "🚩", p: 0, flag: true, tip: "<b>🚩 Toto je najčastejší spôsob, ako sa z investora stane nútený predajca.</b> Ak trh spadne rok pred tým, než peniaze potrebuješ, predávaš v strate — bez ohľadu na to, aký dobrý bol plán." },
      ],
    },
    {
      c: "C", q: "Máš najprv železnú rezervu — a až potom investície?",
      a: [
        { t: "Áno, 6 mesiacov výdavkov bokom", e: "🛡️", p: 2 },
        { t: "Čiastočne, buduje sa", e: "🟡", p: 1, tip: "<b>Rezerva chráni tvoje investície pred tebou samým.</b> Bez nej každý nečakaný výdavok riešiš predajom portfólia — často v najhorší možný moment." },
        { t: "Investujem všetko, rezervu nemám 🚩", e: "🚩", p: 0, flag: true, tip: "<b>🚩 Investovanie bez rezervy je dom bez základov.</b> Prvá pokazená práčka alebo výpadok príjmu ťa donúti predávať — a trh sa nepýta, či je práve vhodný čas. Najprv rezerva, potom všetko ostatné." },
      ],
    },
    {
      c: "C", q: "Kto ti staval tvoje súčasné portfólio?",
      a: [
        { t: "Kvalifikovaný investičný poradca s férovými poplatkami — je postavené na dátach, stratégii a rozumných krokoch", e: "🧠", p: 2 },
        { t: "Bankár / bežný poradca", e: "🏦", p: 1, tip: "<b>Otázka nie je, či ti poradil dobre — otázka je, či vieš prečo a koľko za to platíš.</b> Vypýtaj si zdôvodnenie každého produktu a jeho poplatky. Kvalifikovaný poradca ti ich povie rád, predajca začne hmlieť." },
        { t: "Staval som ho sám podľa YouTube, kamarátov, internetu", e: "😅", p: 0, tip: "<b>Internet ti dá informácie, ale nie stratégiu ani zodpovednosť.</b> Samostavané portfólio býva mix tipov bez systému — funguje, kým rastie trh. Audit ti ukáže, či máš systém, alebo zbierku náhod." },
      ],
    },
    {
      c: "C", q: "Predstav si: investuješ 300 € mesačne do akciových ETF a po 20 rokoch máš 230 000 €. Chceš investovať ešte 10 rokov. Ako ich investuješ ďalej?",
      a: [
        { t: "Posledné roky ich budem postupne prekladať do dlhopisov a hotovosti", e: "🪜", p: 2 },
        { t: "Nechám všetko ďalších 10 rokov v akciách", e: "📈", p: 1, tip: "<b>Odvážne — ale spočítaj si sekvenčné riziko.</b> Pád o 40 % rok pred čerpaním renty ti zoberie to, čo si 20 rokov staval. Posledné roky pred cieľom sa portfólio postupne upokojuje — presne načasovať to je remeslo." },
        { t: "Nikdy som nad tým neuvažoval 😳", e: "😳", p: 0, shock: true, tip: "<b>Toto je otázka, ktorá oddeľuje sporiteľov od investorov.</b> Najnebezpečnejšie roky celého investovania sú tie posledné — pád trhu tesne pred rentou ťa zasiahne najviac, lebo máš najviac v hre. Plán postupného presunu do konzervatívnych aktív sa stavia roky dopredu." },
      ],
    },
  ];

  var MAX = Q.length * 2;

  var SEM_STYLE = {
    g: "background:radial-gradient(circle,rgba(91,199,138,.35),rgba(91,199,138,.08));border:3px solid #5BC78A;box-shadow:0 0 60px rgba(91,199,138,.35)",
    a: "background:radial-gradient(circle,rgba(217,164,65,.35),rgba(217,164,65,.08));border:3px solid #D9A441;box-shadow:0 0 60px rgba(217,164,65,.3)",
    r: "background:radial-gradient(circle,rgba(217,96,75,.35),rgba(217,96,75,.08));border:3px solid #D9604B;box-shadow:0 0 60px rgba(217,96,75,.3)",
  };
  var VERDICT_COLOR = { g: "#5BC78A", a: "#D9A441", r: "#D9604B" };
  var RECO_BORDER = { g: "rgba(91,199,138,.45)", a: "rgba(217,164,65,.45)", r: "rgba(217,96,75,.45)" };
  var RECO_LABEL = { g: "#5BC78A", a: "#D9A441", r: "#D9604B" };

  var phase = "intro";
  var idx = 0;
  var answers = [];
  var root = null;

  function shockText(n) {
    return n === 1 ? "1 otázka" : n < 5 ? n + " otázky" : n + " otázok";
  }

  function colFor(r) {
    return r >= 0.8 ? "#5BC78A" : r >= 0.55 ? "#D9A441" : "#D9604B";
  }

  function pill(text) {
    return '<span class="inline-block rounded-full bg-primary px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white mb-6">' + text + "</span>";
  }

  function disclaimer() {
    return (
      '<div class="rounded-2xl px-5 py-[40px] md:px-8 border border-border" style="background: #F3EFE9">' +
        '<p class="max-w-[680px] mx-auto text-[12.5px] md:text-[14px] leading-[1.8] text-center font-semibold" style="color: #5E5A50">' +
          "ETF semafor je orientačný vzdelávací nástroj. Daňové a investičné dopady závisia od tvojej konkrétnej situácie — preto ich preberáme individuálne. Nejde o investičné ani daňové odporúčanie." +
        "</p>" +
      "</div>"
    );
  }

  function computeResult() {
    if (answers.length < Q.length) return null;
    var score = 0, flags = 0, shocks = 0;
    var catScore = {};
    var catMax = {};
    var tips = [];
    Q.forEach(function (q, qi) {
      var a = q.a[answers[qi]];
      if (!a) return;
      score += a.p;
      catScore[q.c] = (catScore[q.c] || 0) + a.p;
      catMax[q.c] = (catMax[q.c] || 0) + 2;
      if (a.flag) flags++;
      if (a.shock) shocks++;
      if (a.tip) tips.push({ tip: a.tip, flag: !!a.flag });
    });
    var worstCat = "";
    var worstR = 1;
    Object.keys(CATS).forEach(function (c) {
      var r = (catScore[c] || 0) / (catMax[c] || 1);
      if (r < worstR) { worstR = r; worstCat = c; }
    });
    var p = score / MAX;
    var cls;
    if (flags >= 2 || p < 0.55) cls = "r";
    else if (flags === 1 || p < 0.8) cls = "a";
    else cls = "g";
    var worstName = CATS[worstCat] || "";
    var reco;
    if (cls === "g") {
      reco = "Patríš do úzkej menšiny — väčšina investorov by tento semafor neprešla. Najslabšie ti vyšla oblasť <b>" + worstName + "</b>, dotiahnuť ju je tvoj ďalší krok. A ak chceš mať istotu, že ti nič neuniká, <b>priprav si svoje portfólio — AUDIT dostaneš zadarmo</b> a prejdeme ho číslo po čísle.";
    } else if (cls === "a") {
      reco = "Investuješ — a to je viac, než robí väčšina. Ale tvoje portfólio má diery, najväčšiu v oblasti <b>" + worstName + "</b>. Každý rok, ktorý ich nechávaš otvorené, ťa potichu stojí peniaze. Najrýchlejšia oprava? <b>Priprav si svoje portfólio — AUDIT dostaneš zadarmo.</b> Za 45 minút budeš presne vedieť, čo zmeniť.";
    } else {
      reco = "Toto nie je hejt — je to zrkadlo. Tvoje investovanie momentálne stojí na náhode, najslabšia je oblasť <b>" + worstName + "</b>" + (flags ? " a k tomu máš " + (flags === 1 ? "červenú vlajku" : "červené vlajky") + ", z ktorých každá ti vie rozbiť plán" : "") + ". Dobrá správa: všetko z toho sa dá opraviť — a čím skôr, tým lacnejšie. <b>Priprav si svoje portfólio — AUDIT dostaneš zadarmo</b> a nastavíme to nanovo.";
    }
    return { score: score, flags: flags, shocks: shocks, catScore: catScore, catMax: catMax, tips: tips, p: p, cls: cls, reco: reco };
  }

  function renderIntro() {
    return (
      '<div class="text-center mb-10 max-w-[680px] mx-auto px-5">' +
        pill("ETF semafor 🚦") +
        '<h1 class="[font-family:var(--font-serif)] font-black text-[clamp(1.875rem,6vw,3.125rem)] leading-[1.15] tracking-[-0.015em] text-foreground mb-3">' +
          'Investuješ.<br />Ale investuješ <span class="text-primary">správne?</span>' +
        "</h1>" +
        '<p class="text-[16.5px] text-muted-foreground font-[500] leading-relaxed max-w-[560px] mx-auto mt-3">' +
          "15 otázok, 3 minúty. O stratégii, krízach, daniach a chybách, ktoré ťa potichu stoja peniaze — a o ktorých ti nie každý povie." +
        "</p>" +
        '<div class="flex justify-center gap-3.5 mt-[34px]">' +
          '<span class="w-[54px] h-[54px] rounded-full flex items-center justify-center text-[24px] bg-card border border-border shadow-sm">🔴</span>' +
          '<span class="w-[54px] h-[54px] rounded-full flex items-center justify-center text-[24px] bg-card border border-border shadow-sm">🟡</span>' +
          '<span class="w-[54px] h-[54px] rounded-full flex items-center justify-center text-[24px] bg-card border border-border shadow-sm">🟢</span>' +
        "</div>" +
        '<button type="button" class="btn-primary inline-block mt-[30px] text-body" data-etfs-start>Spustiť semafor 🚦</button>' +
        '<span class="block mt-3 text-[13px] font-semibold text-muted-foreground">zadarmo · bez e-mailu · výsledok hneď</span>' +
      "</div>"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderQuiz() {
    var q = Q[idx];
    if (!q) return "";
    var progress = (idx / Q.length) * 100;
    var answersHtml = q.a.map(function (a, i) {
      return (
        '<button type="button" class="etfs-ans-btn" data-etfs-answer="' + i + '">' +
          '<span class="flex-shrink-0 text-[18px]">' + a.e + "</span>" +
          escapeHtml(a.t) +
        "</button>"
      );
    }).join("");
    var back = idx > 0 ? '<button type="button" class="etfs-back-btn" data-etfs-back>← Späť</button>' : "";
    return (
      '<section class="rounded-2xl overflow-hidden mb-5" style="background: #111210; color: #F5EDE0">' +
        '<div class="px-5 py-[60px] md:px-8">' +
          '<div class="max-w-[620px] mx-auto">' +
            '<div class="h-2 rounded-full overflow-hidden mb-3.5" style="background: rgba(245,237,224,.12)">' +
              '<div class="h-full rounded-full transition-[width] duration-300 ease-out" style="width: ' + progress + '%; background: linear-gradient(90deg,#2B6B4A,#5BC78A)"></div>' +
            "</div>" +
            '<div class="flex justify-between text-[11.5px] font-extrabold uppercase tracking-[0.1em] mb-[30px]" style="color: #B8B2A4">' +
              '<span>Otázka <span style="color: #5BC78A">' + (idx + 1) + "</span> / " + Q.length + "</span>" +
              "<span>" + CATS[q.c] + "</span>" +
            "</div>" +
            '<div class="etfs-qcard bg-[#1A1B18] border border-[rgba(245,237,224,.14)] rounded-[14px] p-[34px_24px] md:p-[34px_30px]">' +
              '<div class="text-[11px] font-extrabold uppercase tracking-[0.14em] mb-3" style="color: #5BC78A">' + CATS[q.c] + "</div>" +
              '<div class="text-[clamp(19px,3.2vw,23px)] font-black leading-[1.35] mb-6" style="color: #F5EDE0">' + escapeHtml(q.q) + "</div>" +
              '<div class="flex flex-col gap-[11px]">' + answersHtml + "</div>" +
              back +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function renderResult() {
    var result = computeResult();
    if (!result) return "";
    var verdict =
      result.cls === "g" ? "Zelená. Máš to pod kontrolou." :
      result.cls === "a" ? "Žltá. Tvoje portfólio potrebuje audit." :
      "Červená. Tvoje peniaze pracujú proti tebe.";
    var emo = result.cls === "g" ? "🟢" : result.cls === "a" ? "🟡" : "🔴";
    var flagsHtml = "";
    if (result.flags > 0) {
      flagsHtml =
        '<div class="text-[13.5px] font-bold mt-1" style="color: #D9604B">' +
          "🚩 " + (result.flags === 1
            ? "1 červená vlajka — riziko, ktoré ti vie rozbiť celý plán"
            : result.flags + " červené vlajky — každá z nich ti vie rozbiť celý plán") +
        "</div>";
    }
    var shockHtml = "";
    if (result.shocks > 0) {
      shockHtml =
        '<div class="mt-6 rounded-[14px] p-[22px_24px] text-left" style="background: linear-gradient(150deg,rgba(217,164,65,.22),rgba(217,164,65,.05)); border: 1px solid rgba(217,164,65,.45)">' +
          '<div class="text-[clamp(20px,3.6vw,26px)] font-black" style="color: #F5EDE0">' +
            'Zaskočilo ťa <span style="color: #D9A441">' + shockText(result.shocks) + "</span> 😳" +
          "</div>" +
          '<p class="text-[13.5px] font-semibold mt-2" style="color: #B8B2A4">' +
            "Každá z nich je miesto, kde tvoje portfólio potichu stráca peniaze alebo zbytočne riskuje. Dobrá správa: všetky sa dajú opraviť." +
          "</p>" +
        "</div>";
    }
    var catsHtml = Object.keys(CATS).map(function (c) {
      var score = result.catScore[c] || 0;
      var max = result.catMax[c] || 1;
      var ratio = score / max;
      return (
        '<div class="bg-[#1A1B18] border border-[rgba(245,237,224,.14)] rounded-xl p-[16px_18px]">' +
          '<div class="flex justify-between text-[12.5px] font-extrabold mb-2.5" style="color: #F5EDE0">' +
            "<span>" + CATS[c] + "</span>" +
            '<span style="color: #B8B2A4">' + score + " / " + max + "</span>" +
          "</div>" +
          '<div class="h-2 rounded-full overflow-hidden" style="background: rgba(245,237,224,.1)">' +
            '<span class="etfs-bar-fill" style="width: ' + (ratio * 100) + "%; background: " + colFor(ratio) + '"></span>' +
          "</div>" +
        "</div>"
      );
    }).join("");
    var tipsSorted = result.tips.slice().sort(function (a, b) { return Number(b.flag) - Number(a.flag); });
    var tipsHtml;
    if (tipsSorted.length > 0) {
      tipsHtml = tipsSorted.map(function (tip) {
        return (
          '<div class="etfs-tip' + (tip.flag ? " flag" : "") + '">' +
            '<span class="etfs-tip-icon">' + (tip.flag ? "🚩" : "💡") + "</span>" +
            "<span>" + tip.tip + "</span>" +
          "</div>"
        );
      }).join("");
    } else {
      tipsHtml =
        '<div class="etfs-tip ok">' +
          '<span class="etfs-tip-icon">👏</span>' +
          "<span><b>Plný počet — rešpekt.</b> Buď investuješ naozaj premyslene, alebo si bol na seba mierny. Over si odpovede s chladnou hlavou — a drž systém, ktorý máš.</span>" +
        "</div>";
    }
    tipsHtml +=
      '<div class="etfs-tip cta">' +
        '<span class="etfs-tip-icon">💬</span>' +
        "<span><b>A pri každom bode vyššie platí:</b> nemusíš to lúskať sám. Priprav si svoje portfólio — AUDIT dostaneš zadarmo. 45 minút, online, prejdeme ho číslo po čísle.</span>" +
      "</div>";

    return (
      '<section class="rounded-2xl overflow-hidden mb-5" style="background: #111210; color: #F5EDE0">' +
        '<div class="px-5 py-[60px] md:px-8">' +
          '<div class="max-w-[620px] mx-auto text-center">' +
            pill("Tvoj výsledok") +
            '<div class="etfs-sem" style="' + SEM_STYLE[result.cls] + '">' + emo + "</div>" +
            '<div class="text-[clamp(26px,5vw,38px)] font-black mt-[22px]" style="color: ' + VERDICT_COLOR[result.cls] + '">' + verdict + "</div>" +
            '<div class="text-[14px] font-bold mt-1.5" style="color: #B8B2A4">Skóre: ' + result.score + " / " + MAX + " bodov (" + Math.round(result.p * 100) + " %)</div>" +
            flagsHtml +
            shockHtml +
            '<div class="mt-6 rounded-[14px] p-[24px_26px] text-left bg-[#1A1B18]" style="border: 1px solid ' + RECO_BORDER[result.cls] + '">' +
              '<div class="text-[11px] font-extrabold uppercase tracking-[0.14em] mb-2.5" style="color: ' + RECO_LABEL[result.cls] + '">Odporúčanie</div>' +
              '<p class="text-[14.5px] font-semibold leading-[1.65]" style="color: #F5EDE0">' + result.reco + "</p>" +
            "</div>" +
            '<div class="grid gap-3 mt-6 text-left">' + catsHtml + "</div>" +
            '<div class="mt-[34px] text-left">' +
              '<div class="text-[13px] font-extrabold uppercase tracking-[0.14em] text-center mb-[14px]" style="color: #5BC78A">Čo s tým 👇</div>' +
              tipsHtml +
            "</div>" +
            '<a href="' + KONZULTACIA_URL + '" target="_blank" rel="noopener noreferrer" class="btn-primary inline-block mt-[30px] text-body" data-umami-event="click_konzultacia" data-umami-event-section="etf-semafor">' + BONUSY_CTA_LABEL + "</a>" +
            '<span class="block mt-3 text-[13px] font-semibold" style="color: #B8B2A4">Priprav si svoje portfólio — audit dostaneš zadarmo</span>' +
            '<div class="mt-4">' +
              '<button type="button" class="inline-block rounded-xl border font-extrabold text-[14px] px-[26px] py-[14px] transition-colors cursor-pointer" style="background: transparent; color: #B8B2A4; border-color: rgba(245,237,224,.14)" data-etfs-restart' +
                ' onmouseenter="this.style.color=\'#F5EDE0\';this.style.background=\'#1A1B18\'"' +
                ' onmouseleave="this.style.color=\'#B8B2A4\';this.style.background=\'transparent\'"' +
              ">↺ Spustiť znova</button>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function render() {
    if (!root) return;
    var body = "";
    if (phase === "intro") body = renderIntro();
    else if (phase === "quiz") body = renderQuiz();
    else body = renderResult();
    root.innerHTML = body + disclaimer();
  }

  function handleStart() {
    idx = 0;
    answers = [];
    phase = "quiz";
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
  }

  function handleAnswer(i) {
    answers[idx] = i;
    if (idx + 1 < Q.length) {
      idx += 1;
    } else {
      phase = "result";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    render();
  }

  function handleBack() {
    if (idx > 0) {
      idx -= 1;
      render();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    root = document.getElementById("etf-semafor-root");
    if (!root) return;
    root.addEventListener("click", function (e) {
      var t = e.target.closest("[data-etfs-start]");
      if (t) { handleStart(); return; }
      t = e.target.closest("[data-etfs-restart]");
      if (t) { handleStart(); return; }
      t = e.target.closest("[data-etfs-back]");
      if (t) { handleBack(); return; }
      t = e.target.closest("[data-etfs-answer]");
      if (t) { handleAnswer(Number(t.getAttribute("data-etfs-answer"))); }
    });
    render();
  });

  window.etfSemafor = { start: handleStart };
})();
