(function () {
  "use strict";

  var KONZULTACIA_URL = "https://konzultacia.jsmentor.sk/";
  var BONUSY_CTA_LABEL = "Rezervovať konzultáciu s Ivanom";

  var G = 10;
  var ETF_TER = 0.35;
  var PROVIDERS = {
    banka:   { name: "🏦 Fondy banky",            ter: 2.5,  tax: true  },
    poradca: { name: "🤝 Fondy cez poradcu",      ter: 1.0,  tax: false },
    sprav:   { name: "🏢 Správcovská spoločnosť", ter: 1.20, tax: false },
  };
  var LABELS = {
    banka:   { icon: "🏦", title: "Cez banku",              sub: "podielové fondy banky" },
    poradca: { icon: "🤝", title: "Cez poradcu",            sub: "sprostredkovateľ / agent" },
    sprav:   { icon: "🏢", title: "Správcovská spoločnosť", sub: "fondy priamo" },
  };

  var W = 1100;
  var H = 420;
  var PAD = { l: 95, r: 24, t: 16, b: 44 };

  var prov = "banka";
  var v0 = 10000;
  var monthly = 200;
  var years = 20;
  var tip = null;
  var root = null;
  var chartWrap = null;
  var built = false;

  function sim(V0, M, yrs, g, ter) {
    var rm = Math.pow(1 + g / 100, 1 / 12) - 1;
    var fm = ter / 100 / 12;
    var v = V0;
    var fees = 0;
    var series = [v];
    for (var t = 1; t <= yrs * 12; t++) {
      v = (v + M) * (1 + rm);
      var f = v * fm;
      fees += f;
      v -= f;
      if (t % 12 === 0) series.push(v);
    }
    return { end: v, fees: fees, series: series, invested: V0 + M * yrs * 12 };
  }

  function taxAdjSeries(series, V0, M) {
    return series.map(function (v, i) {
      var inv = V0 + M * 12 * i;
      var gain = v - inv;
      return gain > 0 ? inv + gain * 0.81 : v;
    });
  }

  function fmt(n) {
    return new Intl.NumberFormat("sk-SK", { maximumFractionDigits: 0 }).format(Math.round(n)) + "\u00a0€";
  }
  function fmtPct(n) {
    return n.toLocaleString("sk-SK", { maximumFractionDigits: 1 }) + "\u00a0%";
  }

  function cx(i, n) {
    return PAD.l + (W - PAD.l - PAD.r) * (i / (n - 1));
  }
  function cy(v, maxV) {
    return H - PAD.b - (H - PAD.t - PAD.b) * (v / maxV);
  }
  function toPath(series, maxV) {
    return series.map(function (v, i) {
      return (i === 0 ? "M" : "L") + cx(i, series.length).toFixed(1) + "," + cy(v, maxV).toFixed(1);
    }).join("");
  }
  function toArea(sA, sB, maxV) {
    var n = sA.length;
    var p = sA.map(function (v, i) {
      return (i === 0 ? "M" : "L") + cx(i, n).toFixed(1) + "," + cy(v, maxV).toFixed(1);
    }).join("");
    for (var i = n - 1; i >= 0; i--) {
      p += "L" + cx(i, n).toFixed(1) + "," + cy(sB[i], maxV).toFixed(1);
    }
    return p + "Z";
  }

  function compute() {
    var E = sim(v0, monthly, years, G, ETF_TER);
    var F = sim(v0, monthly, years, G, PROVIDERS[prov].ter);
    var taxOn = PROVIDERS[prov].tax;
    var sA = E.series;
    var sB = taxOn ? taxAdjSeries(F.series, v0, monthly) : F.series;
    var fEndNet = sB[sB.length - 1];
    var taxPaid = taxOn ? F.end - fEndNet : 0;
    var diff = E.end - fEndNet;
    var profitE = E.end - E.invested;
    var eaten = profitE > 0 ? (diff / profitE) * 100 : 0;
    return { sA: sA, sB: sB, E: E, F: F, diff: diff, fEndNet: fEndNet, taxPaid: taxPaid, eaten: eaten, taxOn: taxOn };
  }

  function chartSvg(data) {
    var sA = data.sA;
    var sB = data.sB;
    var maxV = Math.max.apply(null, sA) * 1.05;
    var n = sA.length;
    var grid = "";
    for (var i = 0; i < 5; i++) {
      var v = (maxV * i) / 4;
      var yy = cy(v, maxV);
      grid +=
        "<g>" +
          '<line class="pr-ch-grid" x1="' + PAD.l + '" x2="' + (W - PAD.r) + '" y1="' + yy + '" y2="' + yy + '" />' +
          '<text class="pr-ch-txt" x="' + (PAD.l - 10) + '" y="' + (yy + 5) + '" text-anchor="end">' + Math.round(v / 1000) + "k€</text>" +
        "</g>";
    }
    var step = years <= 12 ? 2 : 5;
    var xLabels = "";
    for (var j = 0; j < n; j++) {
      if (j % step !== 0) continue;
      xLabels +=
        '<text class="pr-ch-txt" x="' + cx(j, n) + '" y="' + (H - 12) + '" text-anchor="middle">' +
          (j === 0 ? "dnes" : "+" + j + "\u00a0r.") +
        "</text>";
    }
    var cursor = "";
    if (tip !== null) {
      var cursorX = cx(tip.i, n);
      cursor =
        '<line x1="' + cursorX + '" x2="' + cursorX + '" y1="' + PAD.t + '" y2="' + (H - PAD.b) + '" stroke="rgba(245,237,224,.3)" stroke-width="1" />' +
        '<circle cx="' + cursorX + '" cy="' + cy(sA[tip.i], maxV) + '" r="5" fill="#5BC78A" stroke="#111210" stroke-width="2" />' +
        '<circle cx="' + cursorX + '" cy="' + cy(sB[tip.i], maxV) + '" r="5" fill="#D9604B" stroke="#111210" stroke-width="2" />';
    }
    return (
      '<svg viewBox="0 0 ' + W + " " + H + '" class="pr-chart-svg" aria-hidden="true">' +
        grid + xLabels +
        '<path d="' + toArea(sA, sB, maxV) + '" fill="rgba(217,96,75,.18)" />' +
        '<path d="' + toPath(sB, maxV) + '" fill="none" stroke="#D9604B" stroke-width="3" stroke-linejoin="round" />' +
        '<path d="' + toPath(sA, maxV) + '" fill="none" stroke="#5BC78A" stroke-width="3" stroke-linejoin="round" />' +
        cursor +
      "</svg>"
    );
  }

  function tooltipHtml(data) {
    if (tip === null) return "";
    var wrapW = chartWrap ? chartWrap.offsetWidth : 0;
    var left = tip.x > wrapW - 200 ? tip.x - 190 : tip.x + 16;
    var top = Math.max(0, tip.y - 70);
    return (
      '<div class="pr-tooltip" style="left:' + left + "px;top:" + top + 'px">' +
        '<div class="pr-tt-d">' + (tip.i === 0 ? "dnes" : "o " + tip.i + " r.") + "</div>" +
        '<div class="pr-tt-green">● ETF: ' + fmt(data.sA[tip.i]) + "</div>" +
        '<div class="pr-tt-red">● Fond: ' + fmt(data.sB[tip.i]) + "</div>" +
        '<div class="pr-tt-amber">Δ ' + fmt(data.sA[tip.i] - data.sB[tip.i]) + "</div>" +
      "</div>"
    );
  }

  function buildShell() {
    var provBtns = Object.keys(PROVIDERS).map(function (key) {
      var l = LABELS[key];
      return (
        '<button type="button" class="pr-prov' + (prov === key ? " pr-prov--active" : "") + '" data-pr-prov="' + key + '">' +
          "<i>" + l.icon + "</i><strong>" + l.title + "</strong><span>" + l.sub + "</span>" +
        "</button>"
      );
    }).join("");

    root.innerHTML =
      '<section class="pr-sec pr-sec--cream">' +
        '<div class="pr-in">' +
          '<span class="pr-pill">Poplatkový röntgen 💸</span>' +
          '<h1 class="pr-h1">Zisti, koľko ťa stoja<br /><em>skryté poplatky</em></h1>' +
          '<p class="pr-sub">Tri kliky a uvidíš, koľko z tvojho budúceho majetku potichu zmizne v poplatkoch. V eurách, nie v percentách.</p>' +
          '<div class="pr-info-banner">ℹ️ <strong>Röntgen ráta ročné poplatky</strong> — tie, ktoré platíš každý rok z celej hodnoty investície. Väčšina ľudí netuší, koľko ich investovanie ročne stojí, lebo poplatok nikdy nevidia na výpise — strháva sa potichu z hodnoty fondu.</div>' +
          '<div class="pr-assume">⚖️ Porovnávame dynamické (akciové) investície — všade rátame s historickým výnosom <strong>10&nbsp;% ročne</strong>.</div>' +
          '<div class="pr-prov-label">Cez koho investuješ?</div>' +
          '<div class="pr-provs">' + provBtns + "</div>" +
          '<div class="pr-tax-box" data-pr-tax-box></div>' +
          '<div class="pr-controls">' +
            '<div class="pr-ctl"><label>💰 Koľko tam máš</label>' +
              '<input type="number" data-pr-v0 min="0" step="500" value="' + v0 + '" /><span class="pr-unit">EUR</span></div>' +
            '<div class="pr-ctl"><label>🔁 Koľko tam dávaš mesačne</label>' +
              '<input type="number" data-pr-monthly min="0" step="50" value="' + monthly + '" /><span class="pr-unit">EUR&nbsp;/ mes.</span></div>' +
            '<div class="pr-ctl pr-ctl--wide">' +
              '<label class="pr-slider-label">Ako dlho ešte plánuješ investovať<output data-pr-years-out>' + years + "&nbsp;rokov</output></label>" +
              '<input type="range" data-pr-years min="5" max="40" step="1" value="' + years + '" />' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +
      '<section class="pr-sec pr-sec--dark">' +
        '<div class="pr-in">' +
          '<span class="pr-pill pr-pill--red">☠️ Výsledok röntgenu</span>' +
          '<div class="pr-xray-num" data-pr-diff></div>' +
          '<div class="pr-xray-cap" data-pr-cap></div>' +
          '<p class="pr-xray-sub" data-pr-sub></p>' +
          '<div class="pr-versus" data-pr-versus></div>' +
          '<div class="pr-chart-card">' +
            '<div class="pr-chart-head"><span>📉 Ako sa nožnice roztvárajú</span><span class="pr-chart-sub">prejdi prstom po grafe</span></div>' +
            '<div class="pr-chart-wrap" data-pr-chart></div>' +
            '<div class="pr-ch-leg">' +
              '<span><i class="pr-leg-dot" style="background:#5BC78A"></i>Nízkonákladové ETF portfólio</span>' +
              '<span><i class="pr-leg-dot" style="background:#D9604B"></i>Tvoje súčasné investovanie</span>' +
              '<span><i class="pr-leg-area" style="background:#D9604B"></i>medzera = tvoja strata</span>' +
            "</div>" +
          "</div>" +
          '<div class="pr-why-box"><strong>Prečo to robí taký rozdiel?</strong> Poplatok sa strháva každý rok z <strong>celej hodnoty</strong> portfólia — nielen z toho, čo si vložil. A každé euro, ktoré odíde na poplatkoch, ti zároveň prestane zarábať. Strata sa tak úročí rovnako ako majetok — z pár percent ročne vyrastú za 20 rokov desaťtisíce eur.</div>' +
          '<a class="pr-btn" href="' + KONZULTACIA_URL + '" target="_blank" rel="noopener noreferrer" data-umami-event="click_konzultacia" data-umami-event-section="poplatkovy-rontgen">' + BONUSY_CTA_LABEL + "</a>" +
          '<span class="pr-micro">Priprav si svoje portfólio — audit dostaneš zadarmo</span>' +
        "</div>" +
      "</section>" +
      '<footer class="pr-foot"><div class="pr-in pr-foot-text">' +
        "Modelový prepočet: porovnávame dynamické (akciové) investície — oba varianty rastú rovnakým hrubým výnosom 10&nbsp;% ročne (historický priemer akciových trhov), líšia sa ročnými poplatkami aplikovanými mesačne (1/12 ročnej sadzby) na aktuálnu hodnotu: nízkonákladové ETF portfólio 0,35&nbsp;% p.a.; fondy banky 2,5&nbsp;% p.a.; fondy cez poradcu 1,0&nbsp;% p.a.; fondy správcovskej spoločnosti 1,2&nbsp;% p.a. (typické hodnoty). Pri fondoch banky je zohľadnená 19&nbsp;% daň z výnosu pri predaji; ETF obchodované na burze sú po viac ako 1&nbsp;roku držania od dane oslobodené (časový test). Graf zobrazuje hodnotu po zdanení pri predaji v danom roku. Nejde o investičné ani daňové odporúčanie." +
      "</div></footer>";
  }

  function update() {
    var data = compute();
    var taxBox = root.querySelector("[data-pr-tax-box]");
    if (taxBox) {
      if (data.taxOn) {
        taxBox.style.display = "";
        taxBox.innerHTML = "🧾 Pri fondoch banky ťa čaká pri predaji aj <strong>19&nbsp;% daň z výnosu</strong>. V tvojom prípade: <span class=\"pr-tax-val\">" + fmt(data.taxPaid) + "</span>";
      } else {
        taxBox.style.display = "none";
        taxBox.innerHTML = "";
      }
    }
    root.querySelectorAll("[data-pr-prov]").forEach(function (btn) {
      btn.classList.toggle("pr-prov--active", btn.getAttribute("data-pr-prov") === prov);
    });
    var yearsOut = root.querySelector("[data-pr-years-out]");
    if (yearsOut) yearsOut.innerHTML = years + "&nbsp;rokov";

    var diffEl = root.querySelector("[data-pr-diff]");
    if (diffEl) diffEl.textContent = fmt(Math.abs(data.diff));
    var capEl = root.querySelector("[data-pr-cap]");
    if (capEl) capEl.innerHTML = "o toľko prichádzaš za " + years + "&nbsp;rokov";
    var subEl = root.querySelector("[data-pr-sub]");
    if (subEl) {
      subEl.innerHTML =
        "Pri vklade <strong>" + fmt(v0) + "</strong> + <strong>" + fmt(monthly) + "&nbsp;mesačne</strong> si poplatky" +
        (data.taxOn ? " a daň" : "") + " vezmú <strong>" + fmtPct(Math.max(0, data.eaten)) + " z tvojho možného zisku</strong>.";
    }
    var versus = root.querySelector("[data-pr-versus]");
    if (versus) {
      var taxLine = data.taxOn ? " · daň z výnosu 19&nbsp;% <strong>" + fmt(data.taxPaid) + "</strong>" : "";
      versus.innerHTML =
        '<div class="pr-vcard pr-vcard--good">' +
          '<span class="pr-tag pr-tag--good">Lepšie riešenie</span>' +
          '<div class="pr-vcard-nm">📊 Nízkonákladové ETF portfólio</div>' +
          '<div class="pr-vcard-big pr-vcard-big--green">' + fmt(data.E.end) + "</div>" +
          '<div class="pr-vcard-sm">poplatky spolu <strong>' + fmt(data.E.fees) + "</strong> · daň pri predaji <strong>0&nbsp;€</strong> (časový test)<br />ročný poplatok: <strong>0,35&nbsp;%</strong></div>" +
        "</div>" +
        '<div class="pr-vs-mid"><div class="pr-vs-circle">VS</div></div>' +
        '<div class="pr-vcard pr-vcard--bad">' +
          '<span class="pr-tag pr-tag--bad">Tvoje súčasné</span>' +
          '<div class="pr-vcard-nm">' + PROVIDERS[prov].name + "</div>" +
          '<div class="pr-vcard-big">' + fmt(data.fEndNet) + "</div>" +
          '<div class="pr-vcard-sm">poplatky spolu <strong>' + fmt(data.F.fees) + "</strong>" + taxLine +
            "<br />priemerný ročný poplatok: <strong>" + PROVIDERS[prov].ter.toLocaleString("sk-SK", { minimumFractionDigits: 2 }) + "&nbsp;%</strong></div>" +
        "</div>";
    }
    chartWrap = root.querySelector("[data-pr-chart]");
    if (chartWrap) {
      chartWrap.innerHTML = chartSvg(data) + tooltipHtml(data);
    }
  }

  function onMove(clientX, clientY) {
    if (!chartWrap) return;
    var data = compute();
    var n = data.sA.length;
    var r = chartWrap.getBoundingClientRect();
    var sx = ((clientX - r.left) / r.width) * W;
    var i = Math.max(0, Math.min(n - 1, Math.round((sx - PAD.l) / (W - PAD.l - PAD.r) * (n - 1))));
    tip = { x: clientX - r.left, y: clientY - r.top, i: i };
    chartWrap.innerHTML = chartSvg(data) + tooltipHtml(data);
  }

  document.addEventListener("DOMContentLoaded", function () {
    root = document.getElementById("poplatkovy-rontgen-root");
    if (!root) return;
    buildShell();
    built = true;
    update();

    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-pr-prov]");
      if (btn) {
        prov = btn.getAttribute("data-pr-prov");
        update();
      }
    });
    root.addEventListener("input", function (e) {
      var t = e.target;
      if (t.matches("[data-pr-v0]")) v0 = Math.max(0, +t.value || 0);
      if (t.matches("[data-pr-monthly]")) monthly = Math.max(0, +t.value || 0);
      if (t.matches("[data-pr-years]")) years = +t.value;
      update();
    });
    root.addEventListener("mousemove", function (e) {
      if (!e.target.closest("[data-pr-chart]")) return;
      onMove(e.clientX, e.clientY);
    });
    root.addEventListener("mouseleave", function (e) {
      if (e.target.closest("[data-pr-chart]") || e.target === chartWrap) {
        /* handled below */
      }
    }, true);
    root.addEventListener("mouseout", function (e) {
      if (chartWrap && !chartWrap.contains(e.relatedTarget) && (e.target === chartWrap || chartWrap.contains(e.target))) {
        tip = null;
        update();
      }
    });
    root.addEventListener("touchmove", function (e) {
      if (!e.target.closest("[data-pr-chart]")) return;
      e.preventDefault();
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    root.addEventListener("touchend", function () {
      tip = null;
      update();
    });
  });
})();
