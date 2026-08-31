var MzdMount = (() => {
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

  // ../jsmentor-sk-stary/src/components/calculators/mzdova/mzdovaMount.ts
  var mzdovaMount_exports = {};
  __export(mzdovaMount_exports, {
    mountMzdovaCalculator: () => mountMzdovaCalculator
  });

  // shims/chart.js
  var chart_default = window.Chart;

  // shims/html2canvas.js
  var html2canvas_default = window.html2canvas;

  // shims/jspdf.js
  var jsPDF = window.jspdf.jsPDF;
  var jspdf_default = window.jspdf;

  // ../jsmentor-sk-stary/src/components/calculators/mzdova/mzdovaMount.ts
  function mountMzdovaCalculator() {
    const NCZD_MONTH = 497.23;
    const NCZD_FULL_LIMIT_YEAR = 26083.13;
    const NCZD_PHASE_OUT_COEF = 14661.11;
    const NCZD_ZERO_LIMIT_YEAR = 43983.32;
    const BONUS_U15 = 100;
    const BONUS_U18 = 50;
    const TAX1 = 0.19;
    const TAX2 = 0.25;
    const TAX3 = 0.3;
    const TAX4 = 0.35;
    const TAX_THRESHOLD_1 = 3665.28;
    const TAX_THRESHOLD_2 = 5029.1;
    const TAX_THRESHOLD_3 = 6250.86;
    const SOC_MAX_BASE = 16764;
    const EMP_SOC = 0.094;
    const EMP_HEALTH = 0.05;
    const EMP_HEALTH_ZTP = 0.025;
    const EMPR_SOC_CAPPED = 0.244;
    const EMPR_ACCIDENT = 8e-3;
    const EMPR_HEALTH = 0.11;
    const EMPR_HEALTH_ZTP = 0.055;
    const SZCO_SOC_RATE = 0.3315;
    const SZCO_HEALTH_RATE = 0.16;
    const SZCO_HEALTH_ZTP = 0.08;
    const SZCO_SOC_MIN_BASE = 914.4;
    const SZCO_HEALTH_MIN_BASE = 762;
    const SZCO_MIN_SOC = 303.11;
    const SZCO_MAX_SOC = 5557.26;
    const SZCO_MIN_HEALTH = 121.92;
    const SZCO_MIN_HEALTH_ZTP = 60.96;
    let disposed = false;
    let chart = null;
    let empType = "emp";
    let dir = "gross";
    let useNczd = true;
    const root = document.getElementById("mzv3-w");
    if (!root) return () => {
    };
    const $ = (id) => document.getElementById(id);
    const fmt = (v) => new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    );
    const fmt0 = (v) => new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number.isFinite(v) ? v : 0);
    const setText = (id, t) => {
      const el = $(id);
      if (el) el.textContent = t;
    };
    const pct = (rate) => new Intl.NumberFormat("sk-SK", { maximumFractionDigits: 1 }).format(rate * 100);
    const calcTaxMonthly = (taxableBase) => {
      const base = Math.max(0, taxableBase);
      if (base <= TAX_THRESHOLD_1) return base * TAX1;
      if (base <= TAX_THRESHOLD_2) {
        return TAX_THRESHOLD_1 * TAX1 + (base - TAX_THRESHOLD_1) * TAX2;
      }
      if (base <= TAX_THRESHOLD_3) {
        return TAX_THRESHOLD_1 * TAX1 + (TAX_THRESHOLD_2 - TAX_THRESHOLD_1) * TAX2 + (base - TAX_THRESHOLD_2) * TAX3;
      }
      return TAX_THRESHOLD_1 * TAX1 + (TAX_THRESHOLD_2 - TAX_THRESHOLD_1) * TAX2 + (TAX_THRESHOLD_3 - TAX_THRESHOLD_2) * TAX3 + (base - TAX_THRESHOLD_3) * TAX4;
    };
    const resolveNczdMonthly = (taxBase, applyNczd) => {
      if (!applyNczd) return 0;
      const annualTaxBase = taxBase * 12;
      if (annualTaxBase <= NCZD_FULL_LIMIT_YEAR) return NCZD_MONTH;
      if (annualTaxBase < NCZD_ZERO_LIMIT_YEAR) {
        return Math.max(0, (NCZD_PHASE_OUT_COEF - annualTaxBase / 3) / 12);
      }
      return 0;
    };
    const calcEmp = (gross, c15, c18, ztp, applyNczd) => {
      const healthRate = ztp ? EMP_HEALTH_ZTP : EMP_HEALTH;
      const socBase = Math.min(gross, SOC_MAX_BASE);
      const empSoc = socBase * EMP_SOC;
      const empHealth = gross * healthRate;
      const empTotal = empSoc + empHealth;
      const taxBase = gross - empTotal;
      const nczd = resolveNczdMonthly(taxBase, applyNczd);
      const taxableBase = Math.max(0, taxBase - nczd);
      const tax = calcTaxMonthly(taxableBase);
      const bonus = c15 * BONUS_U15 + c18 * BONUS_U18;
      const taxAfterBonus = Math.max(0, tax - bonus);
      const bonusApplied = Math.min(tax, bonus);
      const net = gross - empTotal - taxAfterBonus;
      const emprSocBase = Math.min(gross, SOC_MAX_BASE);
      const emprSoc = emprSocBase * EMPR_SOC_CAPPED + gross * EMPR_ACCIDENT;
      const emprHealthRate = ztp ? EMPR_HEALTH_ZTP : EMPR_HEALTH;
      const emprHealth = gross * emprHealthRate;
      const emprTotal = emprSoc + emprHealth;
      const superGross = gross + emprTotal;
      return {
        gross,
        net,
        empSoc,
        empHealth,
        empTotal,
        taxBase,
        nczd,
        taxableBase,
        tax,
        taxAfterBonus,
        bonusApplied,
        emprSoc,
        emprHealth,
        emprTotal,
        superGross,
        healthRate,
        emprHealthRate
      };
    };
    const calcEmpFromNet = (net, c15, c18, ztp, applyNczd) => {
      let g = net * 1.3;
      for (let i = 0; i < 80; i++) {
        const r = calcEmp(Math.max(0, g), c15, c18, ztp, applyNczd);
        const diff = r.net - net;
        if (Math.abs(diff) < 5e-3) break;
        g -= diff * 0.85;
      }
      return calcEmp(Math.max(0, g), c15, c18, ztp, applyNczd);
    };
    const calcSZCO = (income, ztp, useMinBase, usePausch) => {
      const healthRate = ztp ? SZCO_HEALTH_ZTP : SZCO_HEALTH_RATE;
      const minHealth = ztp ? SZCO_MIN_HEALTH_ZTP : SZCO_MIN_HEALTH;
      const taxableIncome = usePausch ? Math.max(0, income - Math.min(income * 0.6, 2e4 / 12)) : income;
      const rawVmz = taxableIncome * 0.5;
      let socVmz = useMinBase ? SZCO_SOC_MIN_BASE : Math.max(rawVmz, SZCO_SOC_MIN_BASE);
      socVmz = Math.min(socVmz, SOC_MAX_BASE);
      const healthVmz = useMinBase ? SZCO_HEALTH_MIN_BASE : Math.max(rawVmz, SZCO_HEALTH_MIN_BASE);
      const socOdvod = socVmz <= SZCO_SOC_MIN_BASE ? SZCO_MIN_SOC : socVmz >= SOC_MAX_BASE ? SZCO_MAX_SOC : socVmz * SZCO_SOC_RATE;
      const healthOdvod = healthVmz <= SZCO_HEALTH_MIN_BASE ? minHealth : healthVmz * healthRate;
      const odvodyTotal = socOdvod + healthOdvod;
      const danBase = Math.max(0, taxableIncome - odvodyTotal - NCZD_MONTH);
      const dan = calcTaxMonthly(danBase);
      const net = income - odvodyTotal - dan;
      return {
        income,
        net,
        gross: income,
        vmz: rawVmz,
        socVmz,
        healthVmz,
        socOdvod,
        healthOdvod,
        odvodyTotal,
        taxableIncome,
        danBase,
        dan,
        superGross: odvodyTotal,
        usePausch,
        healthRate
      };
    };
    const renderChart = (labels, values, colors) => {
      const canvas = $("mzv3-chart");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      chart?.destroy();
      chart = new chart_default(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [{ data: values, backgroundColor: colors, borderWidth: 2, borderColor: "#FFF9F5", hoverOffset: 6 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: {
              position: "right",
              labels: {
                font: { family: "Gilroy, sans-serif", size: 12 },
                padding: 12,
                boxWidth: 8,
                boxHeight: 8,
                usePointStyle: true
              }
            },
            tooltip: {
              backgroundColor: "rgba(2, 44, 34, 0.96)",
              titleColor: "#fdf8f2",
              bodyColor: "rgba(240, 235, 227, 0.92)",
              borderColor: "rgba(253, 248, 242, 0.15)",
              borderWidth: 1,
              padding: 12,
              cornerRadius: 12,
              caretSize: 6,
              usePointStyle: true,
              boxPadding: 5,
              titleFont: { family: "Recoleta, Georgia, serif", size: 13, weight: "bold" },
              bodyFont: { family: "Gilroy, sans-serif", size: 13 },
              callbacks: {
                label: (c) => {
                  const total = c.dataset.data.reduce((a, b) => a + b, 0);
                  return ` ${fmt(c.raw)} (${(c.raw / total * 100).toFixed(1)}%)`;
                }
              }
            }
          }
        }
      });
    };
    const renderBreakdownHtml = (rows) => {
      const bd = $("mzv3-breakdown");
      if (!bd) return;
      bd.innerHTML = rows.map((row) => {
        if ("sep" in row) return `<div class="bd-sep">${row.sep}</div>`;
        if ("total" in row) {
          return `<div class="bd-row bd-total"><span class="bd-label">${row.label}</span><span class="bd-val">${row.val}</span></div>`;
        }
        return `<div class="bd-row"><span class="bd-label ${row.cls ?? ""}">${row.label}</span><span class="bd-val ${row.cls ?? ""}">${row.val}</span></div>`;
      }).join("");
    };
    const renderBreakdownEmp = (r) => {
      const rows = [
        { label: "Hrub\xE1 mzda", val: fmt(r.gross) },
        { sep: "Zamestnanec \u2013 odvody" },
        { label: `Zdravotn\xE9 poistenie (${pct(r.healthRate)}%)`, val: `-${fmt(r.empHealth)}`, cls: "bd-neg" },
        { label: "Soci\xE1lne poistenie (9,4%)", val: `-${fmt(r.empSoc)}`, cls: "bd-neg" },
        { label: "Z\xE1klad dane (po odvodoch)", val: fmt(r.taxBase), cls: "text-muted-foreground text-xs" },
        { sep: "Da\u0148 z pr\xEDjmu" }
      ];
      if (r.nczd > 0) rows.push({ label: "Nezdanite\u013En\xE1 \u010Das\u0165 (N\u010CZD)", val: `-${fmt(r.nczd)}`, cls: "bd-pos" });
      rows.push(
        { label: "Zdanite\u013En\xFD z\xE1klad", val: fmt(r.taxableBase), cls: "text-muted-foreground text-xs" },
        { label: "Da\u0148 z pr\xEDjmu (19\u201335%)", val: `-${fmt(r.tax)}`, cls: "bd-neg" }
      );
      if (r.bonusApplied > 0) {
        rows.push({ label: "Da\u0148ov\xFD bonus na deti", val: `+${fmt(r.bonusApplied)}`, cls: "bd-pos" });
      }
      rows.push(
        { label: "\u010Cist\xE1 da\u0148", val: `-${fmt(r.taxAfterBonus)}`, cls: "bd-neg" },
        { total: true, label: "\u010CIST\xC1 MZDA", val: fmt(r.net) },
        { sep: "Zamestn\xE1vate\u013E (navy\u0161e)" },
        { label: `Zdravotn\xE9 poistenie zamestn\xE1vate\u013Ea (${pct(r.emprHealthRate)}%)`, val: `+${fmt(r.emprHealth)}`, cls: "text-muted-foreground" },
        { label: "Soci\xE1lne poistenie zamestn\xE1vate\u013Ea (24,4% + 0,8%)", val: `+${fmt(r.emprSoc)}`, cls: "text-muted-foreground" },
        { label: "Celkov\xE9 n\xE1klady zamestn\xE1vate\u013Ea", val: fmt(r.superGross), cls: "font-semibold text-muted-foreground" }
      );
      renderBreakdownHtml(rows);
    };
    const renderBreakdownSzco = (r) => {
      const rows = [{ label: "Hrub\xFD pr\xEDjem", val: fmt(r.income) }];
      if (r.usePausch) {
        const exp = Math.min(r.income * 0.6, 2e4 / 12);
        rows.push(
          { label: "Pau\u0161\xE1lne v\xFDdavky (60%)", val: `-${fmt(exp)}`, cls: "bd-neg" },
          { label: "Z\xE1klad dane (pr\xEDjmy \u2013 v\xFDdavky)", val: fmt(r.taxableIncome), cls: "text-muted-foreground text-xs" }
        );
      }
      rows.push({
        label: "Vymeriavac\xED z\xE1klad (soc. / zdrav.)",
        val: `${fmt(r.socVmz)} / ${fmt(r.healthVmz)}`,
        cls: "text-muted-foreground text-xs"
      });
      rows.push(
        { sep: "Odvody SZ\u010CO" },
        { label: "Soci\xE1lne poistenie (33,15%)", val: `-${fmt(r.socOdvod)}`, cls: "bd-neg" },
        { label: `Zdravotn\xE9 poistenie (${pct(r.healthRate)}%)`, val: `-${fmt(r.healthOdvod)}`, cls: "bd-neg" },
        { label: "Odvody spolu", val: `-${fmt(r.odvodyTotal)}`, cls: "bd-neg font-semibold" },
        { sep: "Da\u0148 z pr\xEDjmu SZ\u010CO" },
        { label: "Nezdanite\u013En\xE1 \u010Das\u0165 (N\u010CZD, 497,23 \u20AC)", val: `-${fmt(NCZD_MONTH)}`, cls: "bd-pos" },
        { label: "Zdanite\u013En\xFD z\xE1klad", val: fmt(r.danBase), cls: "text-muted-foreground text-xs" },
        { label: "Da\u0148 z pr\xEDjmu (19\u201335%)", val: `-${fmt(r.dan)}`, cls: "bd-neg" },
        { total: true, label: "\u010CIST\xDD PR\xCDJEM", val: fmt(r.net) }
      );
      renderBreakdownHtml(rows);
    };
    const calc = () => {
      if (disposed) return;
      const salary = parseFloat($("mzv3-salary")?.value || "0") || 0;
      const ztp = $("mzv3-ztpp")?.checked ?? false;
      if (empType === "emp") {
        const c15 = parseInt($("mzv3-ch15")?.value || "0", 10) || 0;
        const c18 = parseInt($("mzv3-ch18")?.value || "0", 10) || 0;
        const r = dir === "gross" ? calcEmp(salary, c15, c18, ztp, useNczd) : calcEmpFromNet(salary, c15, c18, ztp, useNczd);
        setText("mzv3-hero-label", dir === "gross" ? "\u010Cist\xE1 mzda" : "Zodpovedaj\xFAca hrub\xE1 mzda");
        setText("mzv3-net", fmt(dir === "gross" ? r.net : r.gross));
        setText("mzv3-net-sub", dir === "gross" ? "" : `Hrub\xE1: ${fmt(r.gross)} / \u010Cist\xE1: ${fmt(r.net)}`);
        setText("mzv3-super", fmt(r.superGross));
        setText("mzv3-second-label", "N\xE1klady zamestn\xE1vate\u013Ea");
        setText("mzv3-super-sub", "Superhrub\xE1 mzda (hrub\xE1 + odvody zamestn\xE1vate\u013Ea)");
        renderBreakdownEmp(r);
        renderChart(
          ["\u010Cist\xE1 mzda", "Zdravotn\xE9", "Soci\xE1lne", "Da\u0148", "Odvody zamestn\xE1vate\u013Ea"],
          [Math.max(0, r.net), r.empHealth, r.empSoc, r.taxAfterBonus, r.emprTotal],
          ["#29614A", "#A8956E", "#D5C098", "#C1533C", "#E7E0D2"]
        );
        setText("mzv3-gross-yr", fmt0(r.gross * 12));
        setText("mzv3-net-yr", fmt0(r.net * 12));
        setText("mzv3-odvody-yr", fmt0(r.empTotal * 12));
        setText("mzv3-tax-yr", fmt0(r.taxAfterBonus * 12));
      } else {
        const useMinBase = $("mzv3-szco-minbase")?.checked ?? false;
        const usePausch = $("mzv3-szco-pausch")?.checked ?? false;
        const r = calcSZCO(salary, ztp, useMinBase, usePausch);
        setText("mzv3-hero-label", "\u010Cist\xFD pr\xEDjem SZ\u010CO");
        setText("mzv3-net", fmt(r.net));
        setText("mzv3-net-sub", "Po odvodoch a dani z pr\xEDjmu");
        setText("mzv3-super", fmt(r.odvodyTotal));
        setText("mzv3-second-label", "Celkov\xE9 odvody SZ\u010CO");
        setText("mzv3-super-sub", "Soci\xE1lne + zdravotn\xE9 poistenie / mes.");
        renderBreakdownSzco(r);
        renderChart(
          ["\u010Cist\xFD pr\xEDjem", "Soci\xE1lne odvody", "Zdravotn\xE9 odvody", "Da\u0148"],
          [Math.max(0, r.net), r.socOdvod, r.healthOdvod, r.dan],
          ["#29614A", "#D5C098", "#A8956E", "#C1533C"]
        );
        setText("mzv3-gross-yr", fmt0(salary * 12));
        setText("mzv3-net-yr", fmt0(r.net * 12));
        setText("mzv3-odvody-yr", fmt0(r.odvodyTotal * 12));
        setText("mzv3-tax-yr", fmt0(r.dan * 12));
      }
    };
    window.mzv3SetType = (t) => {
      empType = t;
      $("mzv3-t-emp")?.classList.toggle("sel", t === "emp");
      $("mzv3-t-emp")?.setAttribute("aria-pressed", String(t === "emp"));
      $("mzv3-t-szco")?.classList.toggle("sel", t === "szco");
      $("mzv3-t-szco")?.setAttribute("aria-pressed", String(t === "szco"));
      $("mzv3-dir-wrap")?.classList.toggle("hidden", t === "szco");
      $("mzv3-emp-opts")?.classList.toggle("hidden", t === "szco");
      $("mzv3-szco-opts")?.classList.toggle("hidden", t === "emp");
      $("mzv3-szco-income-wrap")?.classList.toggle("hidden", t === "emp");
      const label = $("mzv3-salary-label");
      if (label) label.textContent = t === "emp" ? dir === "gross" ? "Hrub\xE1 mesa\u010Dn\xE1 mzda" : "Po\u017Eadovan\xE1 \u010Dist\xE1 mzda" : "Hrub\xFD mesa\u010Dn\xFD pr\xEDjem (pred odvodmi)";
      if (t === "szco") window.mzv3SetDir?.("gross");
      calc();
    };
    window.mzv3SetDir = (d) => {
      dir = d;
      $("mzv3-d-gross")?.classList.toggle("sel", d === "gross");
      $("mzv3-d-gross")?.setAttribute("aria-pressed", String(d === "gross"));
      $("mzv3-d-net")?.classList.toggle("sel", d === "net");
      $("mzv3-d-net")?.setAttribute("aria-pressed", String(d === "net"));
      const label = $("mzv3-salary-label");
      if (label) label.textContent = empType === "emp" ? d === "gross" ? "Hrub\xE1 mesa\u010Dn\xE1 mzda" : "Po\u017Eadovan\xE1 \u010Dist\xE1 mzda" : "Hrub\xFD mesa\u010Dn\xFD pr\xEDjem (pred odvodmi)";
      calc();
    };
    window.mzv3SetNczd = (v) => {
      useNczd = v;
      $("mzv3-nczd-yes")?.classList.toggle("sel", v);
      $("mzv3-nczd-yes")?.setAttribute("aria-pressed", String(v));
      $("mzv3-nczd-no")?.classList.toggle("sel", !v);
      $("mzv3-nczd-no")?.setAttribute("aria-pressed", String(!v));
      calc();
    };
    window.mzv3Email = () => {
      const salary = parseFloat($("mzv3-salary")?.value || "0") || 0;
      const net = $("mzv3-net")?.textContent || "";
      const superCost = $("mzv3-super")?.textContent || "";
      const type = empType === "emp" ? "Zamestnanec" : "SZ\u010CO";
      const body = encodeURIComponent(
        `Mzdov\xE1 kalkula\u010Dka 2026

Typ: ${type}
Hrub\xE1: ${fmt(salary)}
\u010Cist\xE1: ${net}
N\xE1klady/Odvody: ${superCost}`
      );
      window.location.href = `mailto:?subject=Mzdov\xE1 kalkula\u010Dka 2026&body=${body}`;
    };
    window.mzv3PDF = () => {
      const ne = root.querySelectorAll(".mzv3-ne");
      ne.forEach((e) => e.style.display = "none");
      html2canvas_default(root, { scale: 2, useCORS: true, backgroundColor: "#fcf7ef" }).then((c) => {
        const p = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const img = c.toDataURL("image/png");
        const w = p.internal.pageSize.getWidth();
        p.addImage(img, "PNG", 0, 0, w, Math.min(c.height * w / c.width, 297));
        p.save("mzdova-kalkulacka-2026.pdf");
      }).finally(() => ne.forEach((e) => e.style.display = ""));
    };
    const listen = (selector, event, fn) => {
      const els = Array.from(root.querySelectorAll(selector));
      els.forEach((el) => el.addEventListener(event, fn));
      return () => els.forEach((el) => el.removeEventListener(event, fn));
    };
    const unsubs = [
      listen("input[type=number]", "input", () => calc()),
      listen("input[type=checkbox]", "change", () => calc())
    ];
    calc();
    return () => {
      disposed = true;
      chart?.destroy();
      unsubs.forEach((u) => u());
      delete window.mzv3SetType;
      delete window.mzv3SetDir;
      delete window.mzv3SetNczd;
      delete window.mzv3Email;
      delete window.mzv3PDF;
    };
  }
  return __toCommonJS(mzdovaMount_exports);
})();
function boot(){if(window.MzdMount&&window.MzdMount.mountMzdovaCalculator)window.MzdMount.mountMzdovaCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("mzv3-w");window.CalcUI.initCalcEcho("mzv3-w");window.CalcUI.initCalcHeroPulse("mzv3-net");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
