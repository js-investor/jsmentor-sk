var DtiMount = (() => {
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

  // ../jsmentor-sk-stary/src/components/calculators/podlaprijmu/podla-prijmuMount.ts
  var podla_prijmuMount_exports = {};
  __export(podla_prijmuMount_exports, {
    mountPodlaPrijmuCalculator: () => mountPodlaPrijmuCalculator
  });

  // shims/chart.js
  var chart_default = window.Chart;

  // shims/html2canvas.js
  var html2canvas_default = window.html2canvas;

  // shims/jspdf.js
  var jsPDF = window.jspdf.jsPDF;
  var jspdf_default = window.jspdf;

  // ../jsmentor-sk-stary/src/components/calculators/podlaprijmu/podla-prijmuMount.ts
  function mountPodlaPrijmuCalculator() {
    let dtiChartInstance = null;
    let dstiChartInstance = null;
    let variantCounter = 1;
    let activeVariantId = "v1";
    let variants = [{ id: "v1", name: "Variant 1", data: null }];
    const root = document.getElementById("dti-calc-root");
    if (!root) return () => {
    };
    const partnerToggle = document.getElementById("dti-partner-toggle");
    const partnerInputGroup = document.getElementById("dti-partner-input-group");
    const compareModal = document.getElementById("dti-compare-modal");
    const compareTable = document.getElementById("dti-compare-table");
    const variantTabsEl = document.getElementById("dti-variant-tabs");
    const addVariantBtn = document.getElementById("dti-add-variant");
    const $ = (id) => document.getElementById(id);
    const formatCurrency = (val) => new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
      Number.isFinite(val) ? val : 0
    );
    const formatPercent = (val, digits = 1) => `${(Number(val) || 0).toFixed(digits).replace(".", ",")} %`;
    const formatX = (val, digits = 1) => `${(Number(val) || 0).toFixed(digits).replace(".", ",")}x`;
    const cloneData = (obj) => JSON.parse(JSON.stringify(obj));
    const sanitizeData = (data) => {
      const n = (v, fallback) => Number.isFinite(Number(v)) ? Number(v) : fallback;
      return {
        income: Math.max(0, n(data.income, 1500)),
        partnerEnabled: !!data.partnerEnabled,
        partnerIncome: Math.max(0, n(data.partnerIncome, 0)),
        monthlyDebt: Math.max(0, n(data.monthlyDebt, 0)),
        totalDebt: Math.max(0, n(data.totalDebt, 0)),
        creditLimits: Math.max(0, n(data.creditLimits, 0)),
        rate: Math.max(0, n(data.rate, 4.2)),
        years: Math.max(1, Math.min(40, Math.round(n(data.years, 30)))),
        stressTest: !!data.stressTest
      };
    };
    const syncPartnerVisibility = (resetHiddenValue) => {
      if (!partnerToggle || !partnerInputGroup) return;
      if (partnerToggle.checked) {
        partnerInputGroup.classList.remove("hidden");
      } else {
        partnerInputGroup.classList.add("hidden");
        if (resetHiddenValue) {
          const partnerIncomeEl = document.getElementById("dti-partner-income");
          if (partnerIncomeEl) partnerIncomeEl.value = "0";
        }
      }
    };
    const getFormData = () => {
      const getVal = (id) => parseFloat(document.getElementById(id)?.value || "0") || 0;
      return sanitizeData({
        income: getVal("dti-income"),
        partnerEnabled: !!document.getElementById("dti-partner-toggle")?.checked,
        partnerIncome: getVal("dti-partner-income"),
        monthlyDebt: getVal("dti-monthly-debt"),
        totalDebt: getVal("dti-total-debt"),
        creditLimits: getVal("dti-credit-limits"),
        rate: getVal("dti-rate"),
        years: getVal("dti-years"),
        stressTest: !!document.getElementById("dti-stress-toggle")?.checked
      });
    };
    const setFormData = (data) => {
      const d = sanitizeData(data);
      const setVal = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = String(value);
      };
      setVal("dti-income", d.income);
      setVal("dti-partner-income", d.partnerIncome);
      setVal("dti-monthly-debt", d.monthlyDebt);
      setVal("dti-total-debt", d.totalDebt);
      setVal("dti-credit-limits", d.creditLimits);
      setVal("dti-rate", d.rate);
      setVal("dti-years", d.years);
      const p = document.getElementById("dti-partner-toggle");
      const s = document.getElementById("dti-stress-toggle");
      if (p) p.checked = d.partnerEnabled;
      if (s) s.checked = d.stressTest;
      syncPartnerVisibility(false);
    };
    const getActiveVariant = () => variants.find((v) => v.id === activeVariantId) || variants[0];
    const saveActiveVariant = () => {
      const active = getActiveVariant();
      active.data = getFormData();
    };
    const toggleDropdown = (id) => {
      document.querySelectorAll("#dti-calc-root .ml-dropdown-menu").forEach((m) => {
        if (m.id === "dti-menu-" + id) m.classList.toggle("open");
        else m.classList.remove("open");
      });
    };
    const renderVariantTabs = () => {
      if (!variantTabsEl) return;
      variantTabsEl.innerHTML = "";
      variants.forEach((v) => {
        const wrap = document.createElement("div");
        wrap.className = "ml-dropdown";
        const tab = document.createElement("button");
        tab.type = "button";
        tab.className = "ml-variant-tab " + (v.id === activeVariantId ? "active" : "inactive");
        tab.onclick = () => window.dtiSwitchVariant?.(v.id);
        const label = document.createElement("span");
        label.innerText = v.name;
        tab.appendChild(label);
        const menuBtn = document.createElement("button");
        menuBtn.type = "button";
        menuBtn.innerHTML = "\u22EE";
        menuBtn.style.cssText = "background:none;border:none;cursor:pointer;padding:2px 4px;color:inherit;font-size:16px;line-height:1;";
        menuBtn.onclick = (e) => {
          e.stopPropagation();
          toggleDropdown(v.id);
        };
        tab.appendChild(menuBtn);
        const menu = document.createElement("div");
        menu.className = "ml-dropdown-menu";
        menu.id = "dti-menu-" + v.id;
        const item = (txt, fn, danger = false) => {
          const x = document.createElement("div");
          x.className = "ml-dropdown-item" + (danger ? " danger" : "");
          x.textContent = txt;
          x.onclick = (e) => {
            e.stopPropagation();
            fn();
          };
          menu.appendChild(x);
        };
        item("Premenova\u0165", () => window.dtiRenameVariant?.(v.id));
        item("Duplikova\u0165", () => window.dtiDuplicateVariant?.(v.id));
        if (variants.length > 1) item("Zmaza\u0165", () => window.dtiDeleteVariant?.(v.id), true);
        wrap.appendChild(tab);
        wrap.appendChild(menu);
        variantTabsEl.appendChild(wrap);
      });
      if (addVariantBtn) addVariantBtn.style.display = variants.length >= 4 ? "none" : "";
    };
    const calculateScenario = (data) => {
      const d = sanitizeData(data);
      const partnerIncome = d.partnerEnabled ? d.partnerIncome : 0;
      const totalNetIncome = d.income + partnerIncome;
      const creditCardPayment = d.creditLimits * 0.03;
      const existingMonthlyObligations = d.monthlyDebt + creditCardPayment;
      const maxMonthlyPaymentTotal = totalNetIncome * 0.6;
      const availableForNewPayment = Math.max(0, maxMonthlyPaymentTotal - existingMonthlyObligations);
      const currentDSTI = totalNetIncome > 0 ? existingMonthlyObligations / totalNetIncome : 0;
      const maxTotalDebtAllowed = totalNetIncome * 12 * 8;
      const availableTotalDebt = Math.max(0, maxTotalDebtAllowed - d.totalDebt);
      const currentDTI = totalNetIncome > 0 ? d.totalDebt / (totalNetIncome * 12) : 0;
      const effectiveRate = d.stressTest ? d.rate + 2 : d.rate;
      const r = effectiveRate / 100 / 12;
      const n = d.years * 12;
      const maxMortgageBasedOnDSTI = r > 0 ? availableForNewPayment * (1 - Math.pow(1 + r, -n)) / r : availableForNewPayment * n;
      const finalMaxMortgage = Math.max(0, Math.min(maxMortgageBasedOnDSTI, availableTotalDebt));
      let limitReason = "";
      if (availableForNewPayment <= 0) limitReason = "Vysok\xE9 existuj\xFAce spl\xE1tky (DSTI stop)";
      else if (maxMortgageBasedOnDSTI > availableTotalDebt) limitReason = "Limitovan\xE9 stropom celkov\xE9ho dlhu (DTI 8x)";
      else limitReason = "Limitovan\xE9 mesa\u010Dnou spl\xE1tkou (DSTI 60%)";
      if (d.stressTest) limitReason += " + Stress Test";
      const pDebt = totalNetIncome > 0 ? Math.min(60, existingMonthlyObligations / totalNetIncome * 100) : 0;
      const pReserve = totalNetIncome > 0 ? 40 : 0;
      const pFree = Math.max(0, 100 - pDebt - pReserve);
      return { input: d, totalNetIncome, creditCardPayment, existingMonthlyObligations, availableForNewPayment, currentDSTI, availableTotalDebt, currentDTI, maxMortgageBasedOnDSTI, finalMaxMortgage, limitReason, pDebt, pReserve, pFree };
    };
    const updateGauge = (canvasId, value, max, unit, instance, set) => {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
      const displayValue = Math.min(Math.max(0, safeValue), max);
      const remaining = Math.max(0, max - displayValue);
      const gaugeTrack = "rgba(0,0,0,0.08)";
      let color = "#29614A";
      if (unit === "x") {
        if (safeValue > 6) color = "#A8956E";
        if (safeValue > 8) color = "#C1533C";
      } else {
        if (safeValue > 50) color = "#A8956E";
        if (safeValue > 60) color = "#C1533C";
      }
      const valueEl = document.getElementById(canvasId === "chart-dti" ? "dti-value-text" : "dsti-value-text");
      if (valueEl) {
        valueEl.textContent = safeValue.toFixed(1) + unit;
        valueEl.style.color = color;
      }
      if (instance) {
        instance.data.datasets[0].data = [displayValue, remaining];
        instance.data.datasets[0].backgroundColor = [color, gaugeTrack];
        instance.update();
        return;
      }
      const created = new chart_default(canvas, {
        type: "doughnut",
        data: { labels: ["Hodnota", "Zvy\u0161ok"], datasets: [{ data: [displayValue, remaining], backgroundColor: [color, gaugeTrack], borderWidth: 0, circumference: 180, rotation: 270 }] },
        options: { cutout: "75%", responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: false }, legend: { display: false } } }
      });
      set(created);
    };
    const updateStatusText = (type, val, limit) => {
      const el = document.getElementById(type + "-status-msg");
      if (!el) return;
      if (val > limit) {
        el.textContent = "Prekro\u010Den\xFD limit NBS!";
        el.style.color = "#C1533C";
      } else if (val > limit * 0.85) {
        el.textContent = "Bl\xED\u017Eite sa k limitu";
        el.style.color = "#A8956E";
      } else {
        el.textContent = "V bezpe\u010Dnej z\xF3ne";
        el.style.color = "#29614A";
      }
    };
    const updateUi = (s) => {
      const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      };
      setText("dti-max-mortgage", formatCurrency(s.finalMaxMortgage));
      setText("dti-max-payment", formatCurrency(s.availableForNewPayment));
      setText("dti-reserve", formatCurrency(s.totalNetIncome * 0.4));
      setText("dti-limit-reason", s.limitReason);
      const barDebts = $("bar-debts");
      const barReserve = $("bar-reserve");
      const barFree = $("bar-free");
      if (barDebts) {
        barDebts.style.width = `${s.pDebt}%`;
        barDebts.textContent = s.pDebt > 5 ? `${Math.round(s.pDebt)}%` : "";
      }
      if (barReserve) {
        barReserve.style.width = `${s.pReserve}%`;
        barReserve.textContent = s.pReserve > 5 ? `${Math.round(s.pReserve)}%` : "";
      }
      if (barFree) {
        barFree.style.width = `${s.pFree}%`;
        barFree.textContent = s.pFree > 5 ? `${Math.round(s.pFree)}%` : "";
      }
      updateGauge("chart-dti", s.currentDTI, 8, "x", dtiChartInstance, (x) => dtiChartInstance = x);
      updateGauge("chart-dsti", s.currentDSTI * 100, 100, "%", dstiChartInstance, (x) => dstiChartInstance = x);
      updateStatusText("dti", s.currentDTI, 8);
      updateStatusText("dsti", s.currentDSTI * 100, 60);
    };
    const calculateDTI = () => {
      saveActiveVariant();
      const active = getActiveVariant();
      const s = calculateScenario(active.data || getFormData());
      updateUi(s);
      return s;
    };
    const getAllVariantScenarios = () => {
      saveActiveVariant();
      return variants.map((v) => ({ variant: v, scenario: calculateScenario(v.data || getFormData()) }));
    };
    const renderComparisonTable = () => {
      if (!compareTable) return;
      const rows = getAllVariantScenarios();
      let html = "<thead><tr><th>Ukazovate\u013E</th>";
      rows.forEach(({ variant }) => {
        html += `<th>${variant.name}</th>`;
      });
      html += "</tr></thead><tbody>";
      const defs = [
        ["\u010Cist\xFD pr\xEDjem (spolu)", (s) => formatCurrency(s.totalNetIncome)],
        ["Partner zapojen\xFD", (s) => s.input.partnerEnabled ? "\xC1no" : "Nie"],
        ["Mesa\u010Dn\xE9 spl\xE1tky (existuj\xFAce)", (s) => formatCurrency(s.input.monthlyDebt)],
        ["Zostatok dlhov", (s) => formatCurrency(s.input.totalDebt)],
        ["Kreditn\xE9 limity", (s) => formatCurrency(s.input.creditLimits)],
        ["Aktu\xE1lne DTI", (s) => formatX(s.currentDTI, 2)],
        ["Aktu\xE1lne DSTI", (s) => formatPercent(s.currentDSTI * 100, 1)],
        ["Max. nov\xE1 mesa\u010Dn\xE1 spl\xE1tka", (s) => formatCurrency(s.availableForNewPayment)],
        ["Max. hypot\xE9ka", (s) => formatCurrency(s.finalMaxMortgage)],
        ["D\xF4vod limit\xE1cie", (s) => s.limitReason]
      ];
      defs.forEach(([label, fn]) => {
        html += `<tr><td>${label}</td>`;
        rows.forEach(({ scenario }) => {
          html += `<td>${fn(scenario)}</td>`;
        });
        html += "</tr>";
      });
      html += "</tbody>";
      compareTable.innerHTML = html;
    };
    window.dtiSwitchVariant = (id) => {
      if (id === activeVariantId) return;
      saveActiveVariant();
      activeVariantId = id;
      const active = getActiveVariant();
      setFormData(active.data || getFormData());
      renderVariantTabs();
      calculateDTI();
    };
    window.dtiAddVariant = () => {
      saveActiveVariant();
      if (variants.length >= 4) return alert("Maxim\xE1lny po\u010Det variantov je 4.");
      variantCounter += 1;
      const src = getActiveVariant();
      const data = cloneData(src?.data || getFormData());
      const v = { id: `v${variantCounter}`, name: `Variant ${variantCounter}`, data };
      variants.push(v);
      activeVariantId = v.id;
      setFormData(v.data);
      renderVariantTabs();
      calculateDTI();
    };
    window.dtiRenameVariant = (id) => {
      const v = variants.find((x) => x.id === id);
      if (!v) return;
      const name = prompt("Nov\xFD n\xE1zov variantu:", v.name);
      if (!name || !name.trim()) return;
      v.name = name.trim();
      renderVariantTabs();
    };
    window.dtiDuplicateVariant = (id) => {
      if (variants.length >= 4) return alert("Maxim\xE1lny po\u010Det variantov je 4.");
      saveActiveVariant();
      const src = variants.find((x) => x.id === id);
      if (!src) return;
      variantCounter += 1;
      const v = { id: `v${variantCounter}`, name: `${src.name} (k\xF3pia)`, data: cloneData(src.data || getFormData()) };
      variants.push(v);
      activeVariantId = v.id;
      setFormData(v.data);
      renderVariantTabs();
      calculateDTI();
    };
    window.dtiDeleteVariant = (id) => {
      if (variants.length <= 1) return;
      if (!confirm("Zmaza\u0165 tento variant?")) return;
      const wasActive = id === activeVariantId;
      variants = variants.filter((x) => x.id !== id);
      if (wasActive) {
        activeVariantId = variants[0].id;
        setFormData(variants[0].data || getFormData());
        renderVariantTabs();
        calculateDTI();
      } else renderVariantTabs();
    };
    window.dtiOpenComparison = () => {
      renderComparisonTable();
      compareModal?.classList.add("open");
    };
    window.dtiCloseComparison = () => compareModal?.classList.remove("open");
    window.dtiSendEmail = () => {
      const s = calculateDTI();
      const body = encodeURIComponent(
        `DTI kalkula\u010Dka

Pr\xEDjem spolu: ${formatCurrency(s.totalNetIncome)}
DTI: ${formatX(s.currentDTI, 2)}
DSTI: ${formatPercent(s.currentDSTI * 100, 1)}
Max hypot\xE9ka: ${formatCurrency(s.finalMaxMortgage)}
Limit\xE1cia: ${s.limitReason}`
      );
      window.location.href = `mailto:?subject=DTI kalkula\u010Dka&body=${body}`;
    };
    window.dtiDownloadPDF = async () => {
      const btn = document.getElementById("dti-btn-pdf");
      if (!btn) return;
      if (btn.dataset.busy === "1") return;
      btn.dataset.busy = "1";
      const old = btn.innerHTML;
      btn.innerHTML = "Pripravujem...";
      const hiddenEls = Array.from(root.querySelectorAll(".ml-no-export"));
      const oldDisp = hiddenEls.map((e) => e.style.display);
      hiddenEls.forEach((e) => e.style.display = "none");
      try {
        const canvas = await html2canvas_default(root, { scale: 2, useCORS: true, backgroundColor: "#fcf7ef" });
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");
        if (!pageCtx) throw new Error("Canvas context");
        const pageHeightPx = Math.floor(canvas.width * pageHeight / pageWidth);
        let offsetY = 0;
        let pageIndex = 0;
        while (offsetY < canvas.height) {
          const sliceHeight = Math.min(pageHeightPx, canvas.height - offsetY);
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;
          pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          pageCtx.drawImage(canvas, 0, offsetY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
          const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);
          const imgHeightMm = sliceHeight * pageWidth / canvas.width;
          if (pageIndex > 0) pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeightMm);
          offsetY += sliceHeight;
          pageIndex += 1;
        }
        pdf.save("podla-prijmu-kalkulacka.pdf");
      } finally {
        hiddenEls.forEach((e, i) => e.style.display = oldDisp[i]);
        btn.innerHTML = old;
        delete btn.dataset.busy;
      }
    };
    const onPartnerToggle = () => {
      syncPartnerVisibility(true);
      calculateDTI();
    };
    partnerToggle?.addEventListener("change", onPartnerToggle);
    const onModalClick = (e) => {
      if (e.target === compareModal) window.dtiCloseComparison?.();
    };
    compareModal?.addEventListener("click", onModalClick);
    const onDocClick = () => document.querySelectorAll("#dti-calc-root .ml-dropdown-menu").forEach((m) => m.classList.remove("open"));
    document.addEventListener("click", onDocClick);
    const inputIds = ["dti-income", "dti-partner-income", "dti-monthly-debt", "dti-total-debt", "dti-credit-limits", "dti-rate", "dti-years"];
    const listeners = [];
    inputIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const fn = () => calculateDTI();
        el.addEventListener("input", fn);
        listeners.push({ el, fn });
      }
    });
    const stress = document.getElementById("dti-stress-toggle");
    if (stress) {
      const fn = () => calculateDTI();
      stress.addEventListener("change", fn);
      listeners.push({ el: stress, fn });
    }
    variants[0].data = getFormData();
    syncPartnerVisibility(false);
    renderVariantTabs();
    const t = window.setTimeout(calculateDTI, 200);
    return () => {
      window.clearTimeout(t);
      dtiChartInstance?.destroy();
      dstiChartInstance?.destroy();
      partnerToggle?.removeEventListener("change", onPartnerToggle);
      compareModal?.removeEventListener("click", onModalClick);
      document.removeEventListener("click", onDocClick);
      listeners.forEach(({ el, fn }) => el.removeEventListener("input", fn));
      listeners.forEach(({ el, fn }) => el.removeEventListener("change", fn));
      delete window.dtiSwitchVariant;
      delete window.dtiAddVariant;
      delete window.dtiRenameVariant;
      delete window.dtiDuplicateVariant;
      delete window.dtiDeleteVariant;
      delete window.dtiOpenComparison;
      delete window.dtiCloseComparison;
      delete window.dtiSendEmail;
      delete window.dtiDownloadPDF;
    };
  }
  return __toCommonJS(podla_prijmuMount_exports);
})();
function boot(){if(window.DtiMount&&window.DtiMount.mountPodlaPrijmuCalculator)window.DtiMount.mountPodlaPrijmuCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("dti-calc-root");window.CalcUI.initCalcEcho("dti-calc-root");window.CalcUI.initCalcHeroPulse("dti-max-mortgage");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
