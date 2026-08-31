var InvMount = (() => {
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

  // ../jsmentor-sk-stary/src/components/calculators/investicna/investicnaMount.ts
  var investicnaMount_exports = {};
  __export(investicnaMount_exports, {
    mountInvesticnaCalculator: () => mountInvesticnaCalculator
  });

  // shims/chart.js
  var chart_default = window.Chart;

  // shims/html2canvas.js
  var html2canvas_default = window.html2canvas;

  // shims/jspdf.js
  var jsPDF = window.jspdf.jsPDF;
  var jspdf_default = window.jspdf;

  // ../jsmentor-sk-stary/src/components/calculators/investicna/investicnaMount.ts
  var BRAND = "JS Mentor";
  var cloneData = (obj) => JSON.parse(JSON.stringify(obj));
  function mountInvesticnaCalculator() {
    let disposed = false;
    let chartInstance = null;
    let variantCounter = 1;
    let activeVariantId = "v1";
    let variants = [{ id: "v1", name: "Variant 1", data: null }];
    const toggleBtn = document.getElementById("inv-advanced-toggle");
    const contentDiv = document.getElementById("inv-advanced-content");
    const arrowIcon = document.getElementById("inv-arrow-icon");
    const comparisonModal = document.getElementById("inv-comparison-modal");
    const comparisonTable = document.getElementById("inv-compare-table");
    const variantTabsEl = document.getElementById("inv-variant-tabs");
    const addVariantBtn = document.getElementById("inv-add-variant");
    const rateInput = document.getElementById("inv-rate");
    const rateSlider = document.getElementById("inv-rate-slider");
    const advancedToggleHandler = () => {
      if (!contentDiv || !arrowIcon) return;
      const isHidden = window.getComputedStyle(contentDiv).display === "none";
      contentDiv.style.display = isHidden ? "block" : "none";
      arrowIcon.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
      toggleBtn?.setAttribute("aria-expanded", String(isHidden));
    };
    toggleBtn?.addEventListener("click", advancedToggleHandler);
    const modalBackdropHandler = (e) => {
      if (e.target === comparisonModal) window.invCloseComparison?.();
    };
    comparisonModal?.addEventListener("click", modalBackdropHandler);
    const docClickCloseDropdowns = () => {
      document.querySelectorAll("#inv-calc-root .ml-dropdown-menu").forEach((m) => m.classList.remove("open"));
    };
    document.addEventListener("click", docClickCloseDropdowns);
    const formatCurrency = (value) => new Intl.NumberFormat("sk-SK", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(Number.isFinite(Number(value)) ? Number(value) : 0);
    const setText = (idSuffix, txt) => {
      const el = document.getElementById("inv-" + idSuffix);
      if (el) el.textContent = txt;
    };
    function sanitizeData(data) {
      const n = (v, fallback) => Number.isFinite(Number(v)) ? Number(v) : fallback;
      return {
        initial: Math.max(0, n(data?.initial, 5e3)),
        monthly: Math.max(0, n(data?.monthly, 200)),
        duration: Math.max(1, Math.min(50, Math.round(n(data?.duration, 20)))),
        rate: Math.max(0, n(data?.rate, 8)),
        inflation: Math.max(0, n(data?.inflation, 2))
      };
    }
    function getFormData() {
      const getVal = (id) => parseFloat(document.getElementById("inv-" + id)?.value || "0") || 0;
      return sanitizeData({
        initial: getVal("initial"),
        monthly: getVal("monthly"),
        duration: getVal("duration"),
        rate: getVal("rate"),
        inflation: getVal("inflation")
      });
    }
    function setFormData(data) {
      const d = sanitizeData(data ?? {});
      const setVal = (id, value) => {
        const el = document.getElementById("inv-" + id);
        if (el) el.value = String(value);
      };
      setVal("initial", d.initial);
      setVal("monthly", d.monthly);
      setVal("duration", d.duration);
      setVal("rate", d.rate);
      setVal("inflation", d.inflation);
      if (rateSlider) rateSlider.value = String(Math.min(15, Math.max(1, d.rate)));
    }
    function getActiveVariant() {
      return variants.find((v) => v.id === activeVariantId) ?? variants[0];
    }
    function saveActiveVariant() {
      const active = getActiveVariant();
      active.data = getFormData();
    }
    function renderVariantTabs() {
      if (!variantTabsEl) return;
      variantTabsEl.innerHTML = "";
      variants.forEach((v) => {
        const wrap = document.createElement("div");
        wrap.className = "ml-dropdown";
        const tab = document.createElement("button");
        tab.type = "button";
        tab.className = "ml-variant-tab " + (v.id === activeVariantId ? "active" : "inactive");
        tab.onclick = () => window.invSwitchVariant?.(v.id);
        const label = document.createElement("span");
        label.textContent = v.name;
        tab.appendChild(label);
        const menuBtn = document.createElement("button");
        menuBtn.type = "button";
        menuBtn.innerHTML = "\u22EE";
        menuBtn.setAttribute("aria-label", "Mo\u017Enosti variantu");
        menuBtn.style.cssText = "background:none;border:none;cursor:pointer;padding:2px 4px;color:inherit;font-size:16px;line-height:1;";
        menuBtn.onclick = (e) => {
          e.stopPropagation();
          toggleDropdown(v.id);
        };
        tab.appendChild(menuBtn);
        const menu = document.createElement("div");
        menu.className = "ml-dropdown-menu";
        menu.id = "inv-menu-" + v.id;
        menu.addEventListener("click", (e) => e.stopPropagation());
        const addItem = (text, danger, fn) => {
          const item = document.createElement("div");
          item.className = "ml-dropdown-item" + (danger ? " danger" : "");
          item.textContent = text;
          item.onclick = (e) => {
            e.stopPropagation();
            fn();
            document.querySelectorAll("#inv-calc-root .ml-dropdown-menu").forEach((m) => m.classList.remove("open"));
          };
          menu.appendChild(item);
        };
        addItem("Premenova\u0165", false, () => window.invRenameVariant?.(v.id));
        addItem("Duplikova\u0165", false, () => window.invDuplicateVariant?.(v.id));
        if (variants.length > 1) addItem("Zmaza\u0165", true, () => window.invDeleteVariant?.(v.id));
        wrap.appendChild(tab);
        wrap.appendChild(menu);
        variantTabsEl.appendChild(wrap);
      });
      if (addVariantBtn) addVariantBtn.style.display = variants.length >= 4 ? "none" : "";
    }
    function toggleDropdown(id) {
      document.querySelectorAll("#inv-calc-root .ml-dropdown-menu").forEach((m) => {
        if (m.id === "inv-menu-" + id) m.classList.toggle("open");
        else m.classList.remove("open");
      });
    }
    function calculateScenario(data) {
      const d = sanitizeData(data ?? {});
      const months = d.duration * 12;
      const monthlyRate = d.rate / 100 / 12;
      const inflationRate = d.inflation / 100;
      const fvLump = d.initial * Math.pow(1 + monthlyRate, months);
      const fvMonthly = Math.abs(monthlyRate) < 1e-12 ? d.monthly * months : d.monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      const finalValue = fvLump + fvMonthly;
      const totalInvested = d.initial + d.monthly * months;
      const totalInterest = finalValue - totalInvested;
      const realValue = finalValue / Math.pow(1 + inflationRate, d.duration);
      const interestPercent = finalValue > 0 ? totalInterest / finalValue * 100 : 0;
      const roi = totalInvested > 0 ? finalValue / totalInvested : 0;
      const labels = [];
      const dataInvested = [];
      const dataTotal = [];
      let currentInvested = d.initial;
      let currentTotal = d.initial;
      for (let i = 0; i <= d.duration; i++) {
        labels.push("Rok " + i);
        dataInvested.push(currentInvested);
        dataTotal.push(currentTotal);
        currentInvested += d.monthly * 12;
        for (let m = 0; m < 12; m++) {
          currentTotal = currentTotal * (1 + monthlyRate) + d.monthly;
        }
      }
      return {
        input: d,
        finalValue,
        totalInvested,
        totalInterest,
        realValue,
        interestPercent,
        roi,
        labels,
        dataInvested,
        dataTotal
      };
    }
    const hoverLinePlugin = {
      id: "invHoverLine",
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
    function updateChart(s) {
      const canvas = document.getElementById("inv-chart");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx || !s || disposed) {
        chartInstance?.destroy();
        chartInstance = null;
        return;
      }
      if (chartInstance) {
        chartInstance.data.labels = s.labels;
        chartInstance.data.datasets[0].data = s.dataTotal;
        chartInstance.data.datasets[1].data = s.dataInvested;
        chartInstance.update();
        return;
      }
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight || 400);
      gradient.addColorStop(0, "rgba(41, 97, 74, 0.28)");
      gradient.addColorStop(0.65, "rgba(41, 97, 74, 0.08)");
      gradient.addColorStop(1, "rgba(41, 97, 74, 0)");
      chartInstance = new chart_default(ctx, {
        type: "line",
        data: {
          labels: s.labels,
          datasets: [
            {
              type: "line",
              label: "Hodnota portf\xF3lia",
              data: s.dataTotal,
              borderColor: "#29614A",
              backgroundColor: gradient,
              borderWidth: 2.5,
              fill: true,
              tension: 0.4,
              pointRadius: lastPointRadius,
              pointHoverRadius: 6,
              pointBackgroundColor: "#29614A",
              pointBorderColor: "#FFF9F5",
              pointBorderWidth: 2
            },
            {
              type: "line",
              label: "Vklady",
              data: s.dataInvested,
              borderColor: "rgba(168, 149, 110, 0.75)",
              backgroundColor: "transparent",
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointBackgroundColor: "#A8956E",
              pointBorderColor: "#FFF9F5",
              pointBorderWidth: 2
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
                  if (context.parsed.y !== null) label += formatCurrency(context.parsed.y);
                  return label;
                },
                footer: (items) => {
                  const total = items.find((it) => it.datasetIndex === 0)?.parsed.y;
                  const invested = items.find((it) => it.datasetIndex === 1)?.parsed.y;
                  if (typeof total !== "number" || typeof invested !== "number") return "";
                  return "Zisk: +" + formatCurrency(Math.max(0, total - invested));
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
    function updateUi(s) {
      setText("durationVal", s.input.duration + " rokov");
      setText("finalValue", formatCurrency(s.finalValue));
      setText("totalInterest", formatCurrency(s.totalInterest));
      setText("totalInvested", formatCurrency(s.totalInvested));
      setText("realValue", formatCurrency(s.realValue));
      setText("interestPercent", Math.max(0, s.interestPercent).toFixed(0) + "%");
      setText("roi", (Number.isFinite(s.roi) ? s.roi : 0).toFixed(1) + "x");
      if (rateSlider && document.activeElement !== rateSlider && document.activeElement !== rateInput) {
        rateSlider.value = String(Math.min(15, Math.max(1, s.input.rate)));
      }
      updateChart(s);
    }
    function inv_calculate() {
      if (disposed) return null;
      saveActiveVariant();
      const active = getActiveVariant();
      const s = calculateScenario(active.data ?? getFormData());
      updateUi(s);
      return s;
    }
    function getAllVariantScenarios() {
      saveActiveVariant();
      return variants.map((variant) => ({
        variant,
        scenario: calculateScenario(variant.data ?? getFormData())
      }));
    }
    function renderComparisonTable() {
      if (!comparisonTable) return;
      const rows = getAllVariantScenarios();
      let html = "<thead><tr><th>Ukazovate\u013E</th>";
      rows.forEach(({ variant }) => {
        html += `<th>${variant.name}</th>`;
      });
      html += "</tr></thead><tbody>";
      const defs = [
        ["Po\u010Diato\u010Dn\xFD vklad", (s) => formatCurrency(s.input.initial)],
        ["Mesa\u010Dn\xFD vklad", (s) => formatCurrency(s.input.monthly)],
        ["Doba investovania", (s) => `${s.input.duration} rokov`],
        ["Ro\u010Dn\xFD v\xFDnos", (s) => `${s.input.rate.toFixed(1).replace(".", ",")} %`],
        ["Infl\xE1cia", (s) => `${s.input.inflation.toFixed(1).replace(".", ",")} %`],
        ["Celkov\xFD vklad", (s) => formatCurrency(s.totalInvested)],
        ["Hodnota portf\xF3lia", (s) => formatCurrency(s.finalValue)],
        ["\u010Cist\xFD v\xFDnos", (s) => formatCurrency(s.totalInterest)],
        ["Re\xE1lna hodnota", (s) => formatCurrency(s.realValue)],
        ["N\xE1vratnos\u0165", (s) => `${s.roi.toFixed(2).replace(".", ",")}x`],
        ["Podiel zhodnotenia", (s) => `${Math.max(0, s.interestPercent).toFixed(0)}%`]
      ];
      defs.forEach(([label, fn]) => {
        html += `<tr><td>${label}</td>`;
        rows.forEach(({ scenario }) => {
          html += `<td>${fn(scenario)}</td>`;
        });
        html += "</tr>";
      });
      html += "</tbody>";
      comparisonTable.innerHTML = html;
    }
    function buildEmailBody() {
      const rows = getAllVariantScenarios();
      const active = rows.find((r) => r.variant.id === activeVariantId) ?? rows[0];
      const date = (/* @__PURE__ */ new Date()).toLocaleDateString("sk-SK");
      let body = `Dobr\xFD de\u0148,

Tu je preh\u013Ead z investi\u010Dnej kalkula\u010Dky (${BRAND}).
D\xE1tum: ${date}

`;
      if (active) {
        const s = active.scenario;
        body += `AKT\xCDVNA VARIANTA: ${active.variant.name}
`;
        body += `- Po\u010Diato\u010Dn\xFD vklad: ${formatCurrency(s.input.initial)}
`;
        body += `- Mesa\u010Dn\xFD vklad: ${formatCurrency(s.input.monthly)}
`;
        body += `- Doba investovania: ${s.input.duration} rokov
`;
        body += `- Ro\u010Dn\xFD v\xFDnos: ${s.input.rate.toFixed(1).replace(".", ",")} %
`;
        body += `- Infl\xE1cia: ${s.input.inflation.toFixed(1).replace(".", ",")} %

`;
        body += `V\xDDSLEDKY
`;
        body += `- Celkov\xFD vklad: ${formatCurrency(s.totalInvested)}
`;
        body += `- Hodnota portf\xF3lia: ${formatCurrency(s.finalValue)}
`;
        body += `- \u010Cist\xFD v\xFDnos: ${formatCurrency(s.totalInterest)}
`;
        body += `- Re\xE1lna hodnota (po infl\xE1cii): ${formatCurrency(s.realValue)}
`;
        body += `- N\xE1vratnos\u0165: ${s.roi.toFixed(2).replace(".", ",")}x
`;
        body += `- Podiel zhodnotenia: ${Math.max(0, s.interestPercent).toFixed(0)}%

`;
      }
      if (rows.length > 1) {
        body += `POROVNANIE VARIANTOV
`;
        rows.forEach(({ variant, scenario }) => {
          body += `- ${variant.name}: portf\xF3lio ${formatCurrency(scenario.finalValue)}, \u010Dist\xFD v\xFDnos ${formatCurrency(scenario.totalInterest)}, ROI ${scenario.roi.toFixed(2).replace(".", ",")}x
`;
        });
        body += "\n";
      }
      body += `Vygenerovan\xE9 na webe ${BRAND}`;
      return body;
    }
    window.invSwitchVariant = function(id) {
      if (id === activeVariantId) return;
      saveActiveVariant();
      activeVariantId = id;
      const active = getActiveVariant();
      setFormData(active.data ?? getFormData());
      renderVariantTabs();
      inv_calculate();
    };
    window.invAddVariant = function() {
      saveActiveVariant();
      if (variants.length >= 4) {
        alert("Maxim\xE1lny po\u010Det variantov je 4.");
        return;
      }
      variantCounter += 1;
      const src = getActiveVariant();
      const data = cloneData(src?.data ?? getFormData());
      const v = { id: "v" + variantCounter, name: "Variant " + variantCounter, data };
      variants.push(v);
      activeVariantId = v.id;
      setFormData(v.data);
      renderVariantTabs();
      inv_calculate();
    };
    window.invRenameVariant = function(id) {
      const v = variants.find((x) => x.id === id);
      if (!v) return;
      const name = prompt("Nov\xFD n\xE1zov variantu:", v.name);
      if (!name || !name.trim()) return;
      v.name = name.trim();
      renderVariantTabs();
    };
    window.invDuplicateVariant = function(id) {
      if (variants.length >= 4) {
        alert("Maxim\xE1lny po\u010Det variantov je 4.");
        return;
      }
      saveActiveVariant();
      const src = variants.find((x) => x.id === id);
      if (!src) return;
      variantCounter += 1;
      const v = {
        id: "v" + variantCounter,
        name: src.name + " (k\xF3pia)",
        data: cloneData(src.data ?? getFormData())
      };
      variants.push(v);
      activeVariantId = v.id;
      setFormData(v.data);
      renderVariantTabs();
      inv_calculate();
    };
    window.invDeleteVariant = function(id) {
      if (variants.length <= 1) return;
      if (!confirm("Zmaza\u0165 tento variant?")) return;
      const wasActive = id === activeVariantId;
      variants = variants.filter((x) => x.id !== id);
      if (!variants.length) return;
      if (wasActive) {
        activeVariantId = variants[0].id;
        setFormData(variants[0].data ?? getFormData());
        renderVariantTabs();
        inv_calculate();
      } else {
        renderVariantTabs();
      }
    };
    window.invOpenComparison = function() {
      renderComparisonTable();
      comparisonModal?.classList.add("open");
    };
    window.invCloseComparison = function() {
      comparisonModal?.classList.remove("open");
    };
    window.invSendEmail = function() {
      const subject = encodeURIComponent(`Investi\u010Dn\xE1 kalkula\u010Dka \u2014 ${BRAND} (${(/* @__PURE__ */ new Date()).toLocaleDateString("sk-SK")})`);
      const body = encodeURIComponent(buildEmailBody());
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };
    window.invDownloadPDF = async function() {
      const wrapper = document.getElementById("inv-calc-root");
      const btn = document.getElementById("inv-btn-pdf");
      if (!wrapper || !btn) return;
      if (btn.getAttribute("data-busy") === "1") return;
      btn.setAttribute("data-busy", "1");
      btn.disabled = true;
      const oldHtml = btn.innerHTML;
      btn.innerHTML = "Pripravujem...";
      const hiddenEls = Array.from(wrapper.querySelectorAll(".inv-no-export"));
      const previousDisplays = hiddenEls.map((el) => el.style.display);
      const modalWasOpen = comparisonModal?.classList.contains("open");
      if (modalWasOpen) comparisonModal?.classList.remove("open");
      try {
        inv_calculate();
        hiddenEls.forEach((el) => {
          el.style.display = "none";
        });
        await new Promise((r) => setTimeout(r, 120));
        const canvas = await html2canvas_default(wrapper, {
          scale: 2,
          useCORS: true,
          backgroundColor: "hsl(36 25% 92%)",
          scrollX: 0,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.clientWidth
        });
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");
        if (!pageCtx) throw new Error("Canvas context nie je dostupn\xFD.");
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
        pdf.save(`${BRAND.replace(/\s+/g, "_")}_investicna_kalkulacka.pdf`);
      } catch (e) {
        console.error(e);
        alert("Nepodarilo sa vygenerova\u0165 PDF.");
      } finally {
        hiddenEls.forEach((el, i) => {
          el.style.display = previousDisplays[i];
        });
        if (modalWasOpen) comparisonModal?.classList.add("open");
        btn.innerHTML = oldHtml;
        btn.disabled = false;
        btn.removeAttribute("data-busy");
      }
    };
    const inputIds = ["inv-initial", "inv-monthly", "inv-duration", "inv-rate", "inv-inflation"];
    const inputHandlers = [];
    inputIds.forEach((id) => {
      const el = document.getElementById(id);
      const fn = () => {
        inv_calculate();
      };
      if (el) {
        el.addEventListener("input", fn);
        inputHandlers.push({ el, fn });
      }
    });
    const rateSliderHandler = function() {
      if (rateInput) rateInput.value = this.value;
      inv_calculate();
    };
    const rateInputHandler = function() {
      if (rateSlider) rateSlider.value = this.value;
    };
    rateSlider?.addEventListener("input", rateSliderHandler);
    rateInput?.addEventListener("input", rateInputHandler);
    variants[0].data = getFormData();
    renderVariantTabs();
    inv_calculate();
    return () => {
      disposed = true;
      toggleBtn?.removeEventListener("click", advancedToggleHandler);
      comparisonModal?.removeEventListener("click", modalBackdropHandler);
      document.removeEventListener("click", docClickCloseDropdowns);
      inputHandlers.forEach(({ el, fn }) => el.removeEventListener("input", fn));
      rateSlider?.removeEventListener("input", rateSliderHandler);
      rateInput?.removeEventListener("input", rateInputHandler);
      chartInstance?.destroy();
      chartInstance = null;
      delete window.invSwitchVariant;
      delete window.invAddVariant;
      delete window.invRenameVariant;
      delete window.invDuplicateVariant;
      delete window.invDeleteVariant;
      delete window.invOpenComparison;
      delete window.invCloseComparison;
      delete window.invSendEmail;
      delete window.invDownloadPDF;
    };
  }
  return __toCommonJS(investicnaMount_exports);
})();
function boot(){if(window.InvMount&&window.InvMount.mountInvesticnaCalculator)window.InvMount.mountInvesticnaCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("inv-calc-root");window.CalcUI.initCalcEcho("inv-calc-root");window.CalcUI.initCalcHeroPulse("inv-finalValue");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
