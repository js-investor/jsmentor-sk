var HypoMount = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../jsmentor-sk-stary/src/components/calculators/hypotekarna/hypotekarnaMount.ts
  var hypotekarnaMount_exports = {};
  __export(hypotekarnaMount_exports, {
    mountHypotekarnaCalculator: () => mountHypotekarnaCalculator
  });

  // shims/chart.js
  var chart_default = window.Chart;

  // shims/html2canvas.js
  var html2canvas_default = window.html2canvas;

  // shims/jspdf.js
  var jsPDF = window.jspdf.jsPDF;
  var jspdf_default = window.jspdf;

  // ../jsmentor-sk-stary/src/components/calculators/hypotekarna/hypotekarnaMount.ts
  var BRAND_SITE = "JS Mentor";
  function mountHypotekarnaCalculator() {
    let chartInstance = null;
    let disposed = false;
    let variants = [
      {
        id: 1,
        name: "Variant 1",
        mortgageEnabled: true,
        investEnabled: true,
        mortgage: { amount: 15e4, years: 20, rate: 4.9 },
        invest: { initial: 5e3, monthly: 250, rate: 6 },
        events: []
      }
    ];
    let activeId = 1;
    let nextId = 2;
    const cachedResults = {};
    const fmtCur = (v) => new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
    const elCurrentDate = document.getElementById("hypo-current-date");
    if (elCurrentDate) elCurrentDate.textContent = (/* @__PURE__ */ new Date()).toLocaleDateString("sk-SK");
    const comparisonModal = document.getElementById("hypo-comparison-modal");
    const onModalBackdrop = (e) => {
      if (e.target === comparisonModal) window.mlCloseComparison?.();
    };
    comparisonModal?.addEventListener("click", onModalBackdrop);
    function renderTabs() {
      const container = document.getElementById("hypo-variant-tabs");
      if (!container) return;
      container.innerHTML = "";
      variants.forEach((v) => {
        const wrap = document.createElement("div");
        wrap.className = "ml-dropdown";
        const tab = document.createElement("button");
        tab.type = "button";
        tab.className = "ml-variant-tab " + (v.id === activeId ? "active" : "inactive");
        tab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>${v.name}`;
        tab.onclick = () => {
          saveCurrentVariant();
          switchVariant(v.id);
        };
        const menuBtn = document.createElement("button");
        menuBtn.type = "button";
        menuBtn.setAttribute("aria-label", "Mo\u017Enosti variantu");
        menuBtn.style.cssText = "background:none;border:none;cursor:pointer;padding:2px 4px;color:inherit;font-size:16px;line-height:1;";
        menuBtn.innerHTML = "\u22EE";
        menuBtn.onclick = (e) => {
          e.stopPropagation();
          toggleDropdown(v.id);
        };
        const menu = document.createElement("div");
        menu.className = "ml-dropdown-menu";
        menu.id = "hypo-menu-" + v.id;
        menu.innerHTML = `<div class="ml-dropdown-item" data-action="rename" data-id="${v.id}">Premenova\u0165</div><div class="ml-dropdown-item" data-action="dup" data-id="${v.id}">Duplikova\u0165</div>${variants.length > 1 ? `<div class="ml-dropdown-item danger" data-action="del" data-id="${v.id}">Zmaza\u0165</div>` : ""}`;
        menu.addEventListener("click", (e) => e.stopPropagation());
        menu.querySelectorAll(".ml-dropdown-item").forEach((item) => {
          item.addEventListener("click", (ev) => {
            const t2 = ev.currentTarget;
            const id = Number(t2.dataset.id);
            const action = t2.dataset.action;
            if (action === "rename") window.mlRenameVariant?.(id);
            if (action === "dup") window.mlDuplicateVariant?.(id);
            if (action === "del") window.mlDeleteVariant?.(id);
            document.querySelectorAll(".ml-dropdown-menu").forEach((m) => m.classList.remove("open"));
          });
        });
        tab.appendChild(menuBtn);
        wrap.appendChild(tab);
        wrap.appendChild(menu);
        container.appendChild(wrap);
      });
      if (variants.length < 4) {
        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "ml-add-variant";
        addBtn.innerHTML = "+";
        addBtn.title = "Prida\u0165 variant";
        addBtn.onclick = () => window.mlAddVariant?.();
        container.appendChild(addBtn);
      }
    }
    function toggleDropdown(id) {
      document.querySelectorAll(".ml-dropdown-menu").forEach((m) => {
        if (m.id === "hypo-menu-" + id) m.classList.toggle("open");
        else m.classList.remove("open");
      });
    }
    const onDocClick = () => document.querySelectorAll(".ml-dropdown-menu").forEach((m) => m.classList.remove("open"));
    document.addEventListener("click", onDocClick);
    window.mlAddVariant = function() {
      if (variants.length >= 4) return alert("Maxim\xE1lny po\u010Det variantov je 4.");
      saveCurrentVariant();
      const newV = {
        id: nextId++,
        name: "Variant " + (variants.length + 1),
        mortgageEnabled: true,
        investEnabled: true,
        mortgage: { amount: 15e4, years: 20, rate: 4.9 },
        invest: { initial: 5e3, monthly: 250, rate: 6 },
        events: []
      };
      variants.push(newV);
      switchVariant(newV.id);
    };
    window.mlRenameVariant = function(id) {
      const v = variants.find((x) => x.id === id);
      if (!v) return;
      const name = prompt("Nov\xFD n\xE1zov variantu:", v.name);
      if (name && name.trim()) {
        v.name = name.trim();
        renderTabs();
      }
    };
    window.mlDuplicateVariant = function(id) {
      if (variants.length >= 4) return alert("Maxim\xE1lny po\u010Det variantov je 4.");
      saveCurrentVariant();
      const src = variants.find((x) => x.id === id);
      if (!src) return;
      const newV = JSON.parse(JSON.stringify(src));
      newV.id = nextId++;
      newV.name = src.name + " (k\xF3pia)";
      variants.push(newV);
      switchVariant(newV.id);
    };
    window.mlDeleteVariant = function(id) {
      if (variants.length <= 1) return;
      if (!confirm("Zmaza\u0165 tento variant?")) return;
      variants = variants.filter((x) => x.id !== id);
      delete cachedResults[id];
      if (activeId === id) switchVariant(variants[0].id);
      else renderTabs();
    };
    function saveCurrentVariant() {
      const v = variants.find((x) => x.id === activeId);
      if (!v) return;
      const mt = document.getElementById("hypo-mortgage-toggle");
      const it = document.getElementById("hypo-invest-toggle");
      if (mt) v.mortgageEnabled = mt.checked;
      if (it) v.investEnabled = it.checked;
      v.mortgage.amount = parseFloat(document.getElementById("c-mortgage-amount")?.value || "0") || 0;
      v.mortgage.years = parseFloat(document.getElementById("c-mortgage-years")?.value || "0") || 0;
      v.mortgage.rate = parseFloat(document.getElementById("c-mortgage-rate")?.value || "0") || 0;
      v.invest.initial = parseFloat(document.getElementById("c-invest-initial")?.value || "0") || 0;
      v.invest.monthly = parseFloat(document.getElementById("c-invest-monthly")?.value || "0") || 0;
      v.invest.rate = parseFloat(document.getElementById("c-invest-rate")?.value || "0") || 0;
    }
    function loadVariant(id) {
      const v = variants.find((x) => x.id === id);
      if (!v) return;
      activeId = id;
      const mt = document.getElementById("hypo-mortgage-toggle");
      const it = document.getElementById("hypo-invest-toggle");
      if (mt) mt.checked = v.mortgageEnabled;
      if (it) it.checked = v.investEnabled;
      const gamount = document.getElementById("c-mortgage-amount");
      const gyears = document.getElementById("c-mortgage-years");
      const grate = document.getElementById("c-mortgage-rate");
      const gi0 = document.getElementById("c-invest-initial");
      const gim = document.getElementById("c-invest-monthly");
      const gir = document.getElementById("c-invest-rate");
      if (gamount) gamount.value = String(v.mortgage.amount);
      if (gyears) gyears.value = String(v.mortgage.years);
      if (grate) grate.value = String(v.mortgage.rate);
      if (gi0) gi0.value = String(v.invest.initial);
      if (gim) gim.value = String(v.invest.monthly);
      if (gir) gir.value = String(v.invest.rate);
      applyToggleUI(v.mortgageEnabled, v.investEnabled);
      window._hypoCalcEvents = v.events;
      renderEvents();
    }
    function switchVariant(id) {
      activeId = id;
      loadVariant(id);
      renderTabs();
      calculateAll();
    }
    window.mlToggleMortgage = function(enabled) {
      applyToggleUI(enabled, !!document.getElementById("hypo-invest-toggle")?.checked);
      calculateAll();
    };
    window.mlToggleInvest = function(enabled) {
      applyToggleUI(!!document.getElementById("hypo-mortgage-toggle")?.checked, enabled);
      calculateAll();
    };
    function applyToggleUI(mEnabled, iEnabled) {
      const mFields = document.getElementById("hypo-mortgage-fields");
      const iFields = document.getElementById("hypo-invest-fields");
      if (mFields) {
        mFields.style.opacity = mEnabled ? "1" : "0.4";
        mFields.style.pointerEvents = mEnabled ? "" : "none";
      }
      if (iFields) {
        iFields.style.opacity = iEnabled ? "1" : "0.4";
        iFields.style.pointerEvents = iEnabled ? "" : "none";
      }
    }
    const evtToggle = document.getElementById("hypo-evt-accordion-toggle");
    const accordionHandler = () => {
      const c = document.getElementById("hypo-evt-accordion-content");
      const icon = document.getElementById("hypo-evt-accordion-icon");
      if (!c || !icon) return;
      const isClosed = window.getComputedStyle(c).display === "none";
      c.style.display = isClosed ? "block" : "none";
      icon.style.transform = isClosed ? "rotate(180deg)" : "rotate(0deg)";
      evtToggle?.setAttribute("aria-expanded", String(isClosed));
    };
    evtToggle?.addEventListener("click", accordionHandler);
    window._hypoCalcEvents = variants[0].events;
    window.addEvent = function() {
      const sel = document.getElementById("evt-type");
      const yEl = document.getElementById("evt-year");
      const vEl = document.getElementById("evt-value");
      if (!sel || !yEl || !vEl) return;
      const type = sel.value;
      const year = parseInt(yEl.value, 10);
      const value = parseFloat(vEl.value);
      if (!year || Number.isNaN(value)) return;
      const labels = {
        hypo_extra: "Hypo: Mimoriadna spl\xE1tka",
        hypo_rate: "Hypo: Zmena \xFAroku",
        invest_deposit: "Invest: Mimoriadny vklad",
        invest_withdraw: "Invest: V\xFDber"
      };
      const valTexts = {
        hypo_extra: "- " + fmtCur(value),
        hypo_rate: value + " %",
        invest_deposit: "+ " + fmtCur(value),
        invest_withdraw: "- " + fmtCur(value)
      };
      const ev = window._hypoCalcEvents ?? [];
      ev.push({ id: Date.now(), type, year, value, label: labels[type] ?? type, valText: valTexts[type] ?? "" });
      ev.sort((a, b) => a.year - b.year);
      window._hypoCalcEvents = ev;
      const v = variants.find((x) => x.id === activeId);
      if (v) v.events = ev;
      renderEvents();
      calculateAll();
    };
    window.removeEvent = function(id) {
      const ev = (window._hypoCalcEvents ?? []).filter((e) => e.id !== id);
      window._hypoCalcEvents = ev;
      const v = variants.find((x) => x.id === activeId);
      if (v) v.events = ev;
      renderEvents();
      calculateAll();
    };
    function renderEvents() {
      const list = document.getElementById("hypo-events-list");
      const badge = document.getElementById("hypo-event-count-badge");
      if (!list || !badge) return;
      list.innerHTML = "";
      const evts = window._hypoCalcEvents ?? [];
      if (evts.length === 0) {
        list.innerHTML = '<p style="font-size:15px;color:hsl(var(--muted-foreground));font-style:italic;">Zatia\u013E \u017Eiadne pridan\xE9 udalosti.</p>';
        badge.style.display = "none";
      } else {
        badge.textContent = String(evts.length);
        badge.style.display = "inline-block";
        evts.forEach((evt) => {
          const div = document.createElement("div");
          div.style.cssText = "display:flex;justify-content:space-between;align-items:center;background:hsl(var(--card));padding:10px 12px;border-radius:6px;border:1px solid hsl(var(--border));font-size:15px;";
          div.innerHTML = `<div style="display:flex;align-items:center;gap:12px;"><span style="font-weight:700;background:hsl(var(--foreground));color:hsl(var(--background));width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:11px;">${evt.year}.</span><span style="font-weight:600;">${evt.label}</span></div><div style="display:flex;align-items:center;gap:12px;"><span style="font-weight:700;color:hsl(var(--primary));">${evt.valText}</span><button type="button" data-remove="${evt.id}" style="color:hsl(var(--muted-foreground));background:none;border:none;cursor:pointer;font-size:15px;">\u2715</button></div>`;
          div.querySelector("button[data-remove]")?.addEventListener("click", () => window.removeEvent?.(evt.id));
          list.appendChild(div);
        });
      }
    }
    function calcPMT(p, r, n) {
      if (p <= 0 || n <= 0) return 0;
      if (r === 0) return p / n;
      return p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    function runCalc(v, atMonth) {
      const mEnabled = v.mortgageEnabled;
      const iEnabled = v.investEnabled;
      const mAmount = v.mortgage.amount;
      const mYears = v.mortgage.years;
      const mRateInit = v.mortgage.rate;
      const iInitial = v.invest.initial;
      const iMonthly = v.invest.monthly;
      const iRate = v.invest.rate;
      const totalMonths = mYears * 12;
      let curM = mAmount;
      let curI = iInitial;
      let curHRate = mRateInit;
      let totalInterest = 0;
      let totalPrincipalInvested = iInitial;
      let curMR = curHRate / 100 / 12;
      let curPMT = mEnabled ? calcPMT(curM, curMR, totalMonths) : 0;
      const labels = [0];
      const dataM = [mEnabled ? mAmount : null];
      const dataI = [iEnabled ? iInitial : null];
      let crossFound = false;
      let crossYear = 0;
      const maxM = atMonth ?? totalMonths;
      for (let m = 1; m <= maxM; m++) {
        const yr = Math.ceil(m / 12);
        if (m % 12 === 1) {
          v.events.filter((e) => e.year === yr).forEach((evt) => {
            if (mEnabled) {
              if (evt.type === "hypo_extra") {
                curM -= evt.value;
                if (curM < 0) curM = 0;
                curPMT = calcPMT(curM, curMR, totalMonths - m + 1);
              }
              if (evt.type === "hypo_rate") {
                curHRate = evt.value;
                curMR = curHRate / 100 / 12;
                curPMT = calcPMT(curM, curMR, totalMonths - m + 1);
              }
            }
            if (iEnabled) {
              if (evt.type === "invest_deposit") {
                curI += evt.value;
                totalPrincipalInvested += evt.value;
              }
              if (evt.type === "invest_withdraw") curI -= evt.value;
            }
          });
        }
        if (mEnabled && curM > 0) {
          const interest = curM * curMR;
          let principal = curPMT - interest;
          if (principal > curM) principal = curM;
          totalInterest += interest;
          curM -= principal;
        }
        if (iEnabled) {
          curI = curI * (1 + iRate / 100 / 12) + iMonthly;
          totalPrincipalInvested += iMonthly;
        }
        if (m % 12 === 0) {
          labels.push(yr);
          dataM.push(mEnabled ? curM : null);
          dataI.push(iEnabled ? curI : null);
          if (!crossFound && mEnabled && iEnabled && curI >= curM) {
            crossFound = true;
            crossYear = yr;
          }
        }
      }
      return {
        labels,
        dataM,
        dataI,
        curM,
        curI,
        totalInterest,
        totalPrincipalInvested,
        crossFound,
        crossYear,
        curPMT: mEnabled ? calcPMT(mAmount, mRateInit / 100 / 12, totalMonths) : 0,
        mAmount,
        mYears,
        mRateInit,
        iInitial,
        iMonthly,
        iRate
      };
    }
    function calculateAll() {
      if (disposed) return;
      const v = variants.find((x) => x.id === activeId);
      if (!v) return;
      const mt = document.getElementById("hypo-mortgage-toggle");
      const it = document.getElementById("hypo-invest-toggle");
      if (mt) v.mortgageEnabled = mt.checked;
      if (it) v.investEnabled = it.checked;
      v.mortgage.amount = parseFloat(document.getElementById("c-mortgage-amount")?.value || "0") || 0;
      v.mortgage.years = parseFloat(document.getElementById("c-mortgage-years")?.value || "0") || 0;
      v.mortgage.rate = parseFloat(document.getElementById("c-mortgage-rate")?.value || "0") || 0;
      v.invest.initial = parseFloat(document.getElementById("c-invest-initial")?.value || "0") || 0;
      v.invest.monthly = parseFloat(document.getElementById("c-invest-monthly")?.value || "0") || 0;
      v.invest.rate = parseFloat(document.getElementById("c-invest-rate")?.value || "0") || 0;
      const evSrc = window._hypoCalcEvents ?? [];
      v.events = [...evSrc];
      const r = runCalc(v, null);
      cachedResults[v.id] = r;
      const setTxt = (id, t2) => {
        const e = document.getElementById(id);
        if (e) e.textContent = t2;
      };
      setTxt("c-monthly-payment", v.mortgageEnabled ? fmtCur(r.curPMT) : "\u2014");
      setTxt("c-total-paid", v.mortgageEnabled ? fmtCur(v.mortgage.amount + r.totalInterest) : "\u2014");
      setTxt("c-invest-final", v.investEnabled ? fmtCur(r.curI) : "\u2014");
      setTxt("c-invest-profit", v.investEnabled ? "+" + fmtCur(r.curI - r.totalPrincipalInvested) : "\u2014");
      setTxt("res-mortgage-total", v.mortgageEnabled ? fmtCur(v.mortgage.amount + r.totalInterest) : "\u2014");
      setTxt("res-invest-principal", v.investEnabled ? fmtCur(r.totalPrincipalInvested) : "\u2014");
      setTxt("res-net-worth", fmtCur((v.investEnabled ? r.curI : 0) - (v.mortgageEnabled ? r.curM : 0)));
      const cInfo = document.getElementById("hypo-crossover-info");
      if (cInfo) {
        cInfo.style.display = r.crossFound ? "block" : "none";
        if (r.crossFound) setTxt("crossover-year", r.crossYear + ". roku");
      }
      updateChart(r.labels, r.dataM, r.dataI, v.mortgageEnabled, v.investEnabled, false);
    }
    const hoverLinePlugin = {
      id: "hypoHoverLine",
      afterDatasetsDraw(chart) {
        const active = chart.tooltip?.getActiveElements();
        if (!active || active.length === 0) return;
        const x = active[0].element.x;
        const { top, bottom } = chart.chartArea;
        const c = chart.ctx;
        c.save();
        c.beginPath();
        c.moveTo(x, top);
        c.lineTo(x, bottom);
        c.lineWidth = 1;
        c.setLineDash([4, 4]);
        c.strokeStyle = "rgba(41, 97, 74, 0.35)";
        c.stroke();
        c.restore();
      }
    };
    const lastPointRadius = (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1 ? 5 : 0;
    function updateChart(labels, dataM, dataI, mEnabled, iEnabled, isStatic = false) {
      const canvas = document.getElementById("compareChart");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx || disposed) {
        chartInstance?.destroy();
        chartInstance = null;
        return;
      }
      const chartLabels = labels.map((y) => "Rok " + y);
      if (chartInstance) {
        chartInstance.data.labels = chartLabels;
        chartInstance.data.datasets[0].data = dataM;
        chartInstance.data.datasets[1].data = dataI;
        chartInstance.setDatasetVisibility(0, mEnabled);
        chartInstance.setDatasetVisibility(1, iEnabled);
        const tooltipOpts = chartInstance.options.plugins?.tooltip;
        if (tooltipOpts) tooltipOpts.enabled = !isStatic;
        chartInstance.update();
        return;
      }
      const gradientHeight = canvas.clientHeight || 400;
      const gM = ctx.createLinearGradient(0, 0, 0, gradientHeight);
      gM.addColorStop(0, "rgba(193, 83, 60, 0.10)");
      gM.addColorStop(1, "rgba(193, 83, 60, 0)");
      const gI = ctx.createLinearGradient(0, 0, 0, gradientHeight);
      gI.addColorStop(0, "rgba(41, 97, 74, 0.28)");
      gI.addColorStop(0.65, "rgba(41, 97, 74, 0.08)");
      gI.addColorStop(1, "rgba(41, 97, 74, 0)");
      chartInstance = new chart_default(ctx, {
        type: "line",
        data: {
          labels: chartLabels,
          datasets: [
            {
              type: "line",
              label: "Zostatok hypot\xE9ky",
              data: dataM,
              borderColor: "#C1533C",
              backgroundColor: gM,
              borderWidth: 2.5,
              fill: true,
              tension: 0.4,
              pointRadius: lastPointRadius,
              pointHoverRadius: 6,
              pointBackgroundColor: "#C1533C",
              pointBorderColor: "#FFF9F5",
              pointBorderWidth: 2,
              hidden: !mEnabled
            },
            {
              type: "line",
              label: "Hodnota invest\xEDcie",
              data: dataI,
              borderColor: "#29614A",
              backgroundColor: gI,
              borderWidth: 2.5,
              fill: true,
              tension: 0.4,
              pointRadius: lastPointRadius,
              pointHoverRadius: 6,
              pointBackgroundColor: "#29614A",
              pointBorderColor: "#FFF9F5",
              pointBorderWidth: 2,
              hidden: !iEnabled
            }
          ]
        },
        plugins: [hoverLinePlugin],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 500, easing: "easeOutQuart" },
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: !isStatic,
              backgroundColor: "rgba(2, 44, 34, 0.96)",
              titleColor: "#fdf8f2",
              bodyColor: "rgba(240, 235, 227, 0.92)",
              footerColor: "#8fd4b4",
              borderColor: "rgba(253, 248, 242, 0.15)",
              borderWidth: 1,
              padding: 14,
              cornerRadius: 12,
              caretSize: 6,
              usePointStyle: true,
              boxPadding: 5,
              titleFont: { family: "Recoleta, Georgia, serif", size: 14, weight: "bold" },
              bodyFont: { family: "Gilroy, sans-serif", size: 13 },
              footerFont: { family: "Gilroy, sans-serif", size: 13, weight: "bold" },
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || "";
                  if (label) label += ": ";
                  if (context.parsed.y !== null) label += fmtCur(context.parsed.y);
                  return label;
                },
                footer: (items) => {
                  const mortgage = items.find((it) => it.datasetIndex === 0)?.parsed.y;
                  const invest = items.find((it) => it.datasetIndex === 1)?.parsed.y;
                  if (typeof mortgage !== "number" && typeof invest !== "number") return "";
                  const net = (typeof invest === "number" ? invest : 0) - (typeof mortgage === "number" ? mortgage : 0);
                  return "\u010Cist\xFD majetok: " + fmtCur(net);
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              border: { display: false },
              grid: { color: "rgba(0, 0, 0, 0.05)" },
              ticks: {
                maxTicksLimit: 5,
                color: "rgba(0, 0, 0, 0.4)",
                font: { family: "Gilroy, sans-serif", size: 12 },
                callback(value) {
                  const v = Number(value);
                  return v >= 1e6 ? (v / 1e6).toFixed(1) + "M \u20AC" : (v / 1e3).toFixed(0) + "k \u20AC";
                }
              }
            },
            x: {
              border: { display: false },
              grid: { display: false },
              ticks: {
                maxTicksLimit: 8,
                color: "rgba(0, 0, 0, 0.4)",
                font: { family: "Gilroy, sans-serif", size: 12 }
              }
            }
          }
        }
      });
    }
    window.mlOpenComparison = function() {
      variants.forEach((v) => {
        saveCurrentVariant();
        cachedResults[v.id] = runCalc(v, null);
      });
      const maxYears = Math.max(...variants.map((v) => v.mortgage.years));
      const slider = document.getElementById("ml-compare-slider");
      if (slider) {
        slider.max = String(maxYears);
        slider.value = "0";
      }
      const maxEl = document.getElementById("ml-slider-max");
      const labEl = document.getElementById("ml-slider-label");
      if (maxEl) maxEl.textContent = String(maxYears);
      if (labEl) labEl.textContent = "0";
      window.mlUpdateComparison?.("0");
      document.getElementById("hypo-comparison-modal")?.classList.add("open");
    };
    window.mlCloseComparison = function() {
      document.getElementById("hypo-comparison-modal")?.classList.remove("open");
    };
    window.mlUpdateComparison = function(yearVal) {
      const yr = parseInt(yearVal, 10);
      const lab = document.getElementById("ml-slider-label");
      if (lab) lab.textContent = String(yr);
      const snapshots = variants.map((v) => ({ v, r: runCalc(v, yr * 12) }));
      const table = document.getElementById("ml-compare-table");
      if (!table) return;
      let html = "<thead><tr><th>Ukazovate\u013E</th>";
      variants.forEach((v) => {
        html += `<th>${v.name}</th>`;
      });
      html += "</tr></thead><tbody>";
      html += `<tr class="section-header"><td colspan="${variants.length + 1}">Hypot\xE9ka</td></tr>`;
      const mRows = [
        ["V\xFD\u0161ka \xFAveru", (v) => v.mortgageEnabled ? fmtCur(v.mortgage.amount) : "\u2014"],
        ["Doba spl\xE1cania", (v) => v.mortgageEnabled ? v.mortgage.years + " rokov" : "\u2014"],
        ["\xDArokov\xE1 sadzba", (v) => v.mortgageEnabled ? v.mortgage.rate + " %" : "\u2014"],
        ["Mesa\u010Dn\xE1 spl\xE1tka", (v, r) => v.mortgageEnabled ? fmtCur(r.curPMT) : "\u2014"],
        ["Zostatok \xFAveru", (v, r) => v.mortgageEnabled ? fmtCur(r.curM) : "\u2014"],
        ["Zaplaten\xE9 na \xFArokoch", (v, r) => v.mortgageEnabled ? fmtCur(r.totalInterest) : "\u2014"]
      ];
      mRows.forEach(([label, fn]) => {
        html += `<tr><td style="color:hsl(var(--muted-foreground));">${label}</td>`;
        snapshots.forEach(({ v, r }) => {
          html += `<td>${fn(v, r)}</td>`;
        });
        html += "</tr>";
      });
      html += `<tr class="section-header"><td colspan="${variants.length + 1}">Invest\xEDcia</td></tr>`;
      const iRows = [
        ["Jednorazov\xFD vklad", (v) => v.investEnabled ? fmtCur(v.invest.initial) : "\u2014"],
        ["Mesa\u010Dn\xE1 invest\xEDcia", (v) => v.investEnabled ? fmtCur(v.invest.monthly) : "\u2014"],
        ["Zhodnotenie p.a.", (v) => v.investEnabled ? v.invest.rate + " %" : "\u2014"],
        ["Hodnota invest\xEDcie", (v, r) => v.investEnabled ? fmtCur(r.curI) : "\u2014"],
        ["Vlo\u017Een\xE9 celkom", (v, r) => v.investEnabled ? fmtCur(r.totalPrincipalInvested) : "\u2014"],
        ["\u010Cist\xFD v\xFDnos", (v, r) => v.investEnabled ? fmtCur(r.curI - r.totalPrincipalInvested) : "\u2014"]
      ];
      iRows.forEach(([label, fn]) => {
        html += `<tr><td style="color:hsl(var(--muted-foreground));">${label}</td>`;
        snapshots.forEach(({ v, r }) => {
          html += `<td>${fn(v, r)}</td>`;
        });
        html += "</tr>";
      });
      html += `<tr class="section-header"><td colspan="${variants.length + 1}">V\xFDsledok</td></tr>`;
      html += '<tr class="highlight"><td>\u010Cist\xFD majetok</td>';
      snapshots.forEach(({ v, r }) => {
        const net = (v.investEnabled ? r.curI : 0) - (v.mortgageEnabled ? r.curM : 0);
        html += `<td style="color:${net >= 0 ? "#29614A" : "#C1533C"}">${fmtCur(net)}</td>`;
      });
      html += "</tr></tbody>";
      table.innerHTML = html;
    };
    window.mlSendEmail = function() {
      const v = variants.find((x) => x.id === activeId);
      if (!v) return;
      const r = cachedResults[activeId] ?? runCalc(v, null);
      const date = (/* @__PURE__ */ new Date()).toLocaleDateString("sk-SK");
      const subject = encodeURIComponent(`Finan\u010Dn\xFD report: Hypot\xE9ka vs. investovanie (${date})`);
      const body = encodeURIComponent(`Dobr\xFD de\u0148,

tu je detailn\xFD preh\u013Ead finan\u010Dnej simul\xE1cie z ${BRAND_SITE}.
VARIANTA: ${v.name}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
HYPOT\xC9KA ${v.mortgageEnabled ? "" : "(vypnut\xE1)"}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
V\xFD\u0161ka \xFAveru:        ${fmtCur(v.mortgage.amount)}
Doba spl\xE1cania:     ${v.mortgage.years} rokov
\xDArokov\xE1 sadzba:     ${v.mortgage.rate} %
Mesa\u010Dn\xE1 spl\xE1tka:    ${v.mortgageEnabled ? fmtCur(r.curPMT) : "\u2014"}
Celkovo zaplat\xEDte:  ${v.mortgageEnabled ? fmtCur(v.mortgage.amount + r.totalInterest) : "\u2014"}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
INVEST\xCDCIA ${v.investEnabled ? "" : "(vypnut\xE1)"}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
Jednorazov\xFD vklad:  ${fmtCur(v.invest.initial)}
Mesa\u010Dn\xE1 invest\xEDcia: ${fmtCur(v.invest.monthly)}
Zhodnotenie p.a.:   ${v.invest.rate} %
Hodnota na konci:   ${v.investEnabled ? fmtCur(r.curI) : "\u2014"}
\u010Cist\xFD zisk:         ${v.investEnabled ? fmtCur(r.curI - r.totalPrincipalInvested) : "\u2014"}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
V\xDDSLEDOK
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u010Cist\xFD majetok na konci: ${fmtCur((v.investEnabled ? r.curI : 0) - (v.mortgageEnabled ? r.curM : 0))}
${r.crossFound ? "Bod zlomu: Invest\xEDcia presiahne hypot\xE9ku v " + r.crossYear + ". roku" : ""}
${v.events.length > 0 ? "\nUDALOSTI:\n" + v.events.map((e) => `  \u2022 Rok ${e.year}: ${e.label} (${e.valText})`).join("\n") : ""}
Vygenerovan\xE9 d\u0148a ${date} \u2014 ${BRAND_SITE}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };
    window.mlDownloadPDF = function() {
      const btns = [document.getElementById("btn-pdf-top"), document.getElementById("btn-pdf-bottom")];
      const oldHtml = btns.map((b) => b ? b.innerHTML : "");
      btns.forEach((b) => {
        if (b) b.innerHTML = "Pripravujem...";
      });
      saveCurrentVariant();
      const originalActiveId = activeId;
      let selectedVariantId = activeId;
      if (variants.length > 1) {
        const options = variants.map((v2, i) => `${i + 1}. ${v2.name}${v2.id === activeId ? " (aktu\xE1lna)" : ""}`).join("\n");
        const picked = prompt(`Vyber variant pre PDF (zadaj \u010D\xEDslo):
${options}`, String(variants.findIndex((v2) => v2.id === activeId) + 1));
        if (picked === null) {
          btns.forEach((b, i) => {
            if (b) b.innerHTML = oldHtml[i] ?? "";
          });
          return;
        }
        const idx = parseInt(picked, 10) - 1;
        if (!Number.isInteger(idx) || idx < 0 || idx >= variants.length) {
          alert("Neplatn\xFD v\xFDber variantu.");
          btns.forEach((b, i) => {
            if (b) b.innerHTML = oldHtml[i] ?? "";
          });
          return;
        }
        selectedVariantId = variants[idx].id;
      }
      if (selectedVariantId !== activeId) switchVariant(selectedVariantId);
      const v = variants.find((x) => x.id === selectedVariantId);
      if (!v) {
        btns.forEach((b, i) => {
          if (b) b.innerHTML = oldHtml[i] ?? "";
        });
        return;
      }
      const r = cachedResults[selectedVariantId] ?? runCalc(v, null);
      updateChart(r.labels, r.dataM, r.dataI, v.mortgageEnabled, v.investEnabled, true);
      setTimeout(() => {
        const liveCanvas = document.querySelector("#compareChart");
        const chartDataUrl = liveCanvas ? liveCanvas.toDataURL("image/png", 1) : null;
        const sourceEl = document.querySelector(".hypo-print-container");
        if (!sourceEl) {
          btns.forEach((b, i) => {
            if (b) b.innerHTML = oldHtml[i] ?? "";
          });
          return;
        }
        const clone = sourceEl.cloneNode(true);
        if (chartDataUrl) {
          const cc = clone.querySelector("canvas");
          if (cc) {
            const liveC = document.querySelector("#compareChart");
            const ar = liveC.width / liveC.height;
            const imgW = 840;
            const imgH = Math.round(imgW / ar);
            const img = document.createElement("img");
            img.src = chartDataUrl;
            img.style.cssText = `width:100%;height:${imgH}px;display:block;object-fit:fill;`;
            const parent = cc.parentElement;
            if (parent) {
              parent.style.height = imgH + "px";
              parent.replaceChild(img, cc);
            }
          }
        }
        document.querySelectorAll("#hypo-compare-wrapper input, #hypo-compare-wrapper select").forEach((inp) => {
          if (!(inp instanceof HTMLInputElement) && !(inp instanceof HTMLSelectElement)) return;
          const id = inp.id;
          if (!id) return;
          const twin = clone.querySelector(`#${CSS.escape(id)}`);
          if (twin instanceof HTMLInputElement || twin instanceof HTMLSelectElement) twin.value = inp.value;
        });
        const savedScroll = window.scrollY;
        window.scrollTo(0, 0);
        const pdfWrapper = document.createElement("div");
        pdfWrapper.style.cssText = "position:absolute;top:0;left:0;width:900px;background:hsl(var(--cream));padding:30px;box-sizing:border-box;z-index:99999;";
        pdfWrapper.appendChild(clone);
        document.body.appendChild(pdfWrapper);
        const finishPdf = () => {
          if (document.body.contains(pdfWrapper)) document.body.removeChild(pdfWrapper);
          window.scrollTo(0, savedScroll);
          if (selectedVariantId !== originalActiveId) switchVariant(originalActiveId);
          else updateChart(r.labels, r.dataM, r.dataI, v.mortgageEnabled, v.investEnabled, false);
          btns.forEach((b, i) => {
            if (b) b.innerHTML = oldHtml[i] ?? "";
          });
        };
        setTimeout(() => {
          const totalHeight = pdfWrapper.offsetHeight;
          html2canvas_default(pdfWrapper, {
            scale: 2,
            useCORS: true,
            logging: false,
            width: 900,
            height: totalHeight,
            windowWidth: 1200,
            windowHeight: totalHeight + 200,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0
          }).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 0.98);
            const pdfW = 595;
            const pdfH = canvas.height / canvas.width * pdfW;
            const pdf = new jsPDF({ unit: "px", format: [pdfW, pdfH], orientation: "portrait", hotfixes: ["px_scaling"] });
            pdf.addImage(imgData, "JPEG", 0, 0, pdfW, pdfH);
            pdf.save(`${BRAND_SITE.replace(/\s+/g, "_")}_hypoteka_report.pdf`);
            finishPdf();
          }).catch((err) => {
            console.error(err);
            finishPdf();
          });
        }, 300);
      }, 700);
    };
    const inputIds = [
      "c-mortgage-amount",
      "c-mortgage-years",
      "c-mortgage-rate",
      "c-invest-initial",
      "c-invest-monthly",
      "c-invest-rate"
    ];
    const inputListeners = [];
    inputIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const fn = () => calculateAll();
        el.addEventListener("input", fn);
        inputListeners.push({ el, fn });
      }
    });
    renderTabs();
    const t = window.setTimeout(() => {
      if (!disposed) calculateAll();
    }, 500);
    return () => {
      disposed = true;
      window.clearTimeout(t);
      comparisonModal?.removeEventListener("click", onModalBackdrop);
      document.removeEventListener("click", onDocClick);
      evtToggle?.removeEventListener("click", accordionHandler);
      inputListeners.forEach(({ el, fn }) => el.removeEventListener("input", fn));
      chartInstance?.destroy();
      chartInstance = null;
      delete window.mlSendEmail;
      delete window.mlOpenComparison;
      delete window.mlCloseComparison;
      delete window.mlDownloadPDF;
      delete window.mlToggleMortgage;
      delete window.mlToggleInvest;
      delete window.mlAddVariant;
      delete window.mlRenameVariant;
      delete window.mlDuplicateVariant;
      delete window.mlDeleteVariant;
      delete window.mlUpdateComparison;
      delete window.addEvent;
      delete window.removeEvent;
      delete window._hypoCalcEvents;
    };
  }
  return __toCommonJS(hypotekarnaMount_exports);
})();
function boot(){if(window.HypoMount&&window.HypoMount.mountHypotekarnaCalculator)window.HypoMount.mountHypotekarnaCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("hypo-calc-root");window.CalcUI.initCalcEcho("hypo-calc-root");window.CalcUI.initCalcHeroPulse("res-net-worth");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
