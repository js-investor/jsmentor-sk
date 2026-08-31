import * as esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "jsmentor-sk-stary", "src", "components", "calculators");
const shim = (name) => path.join(root, "_build", "shims", name);

const mounts = [
  {
    entry: path.join(src, "hypotekarna", "hypotekarnaMount.ts"),
    outfile: path.join(root, "js", "calculators", "hypotekarna.js"),
    globalName: "HypoMount",
    boot: `function boot(){if(window.HypoMount&&window.HypoMount.mountHypotekarnaCalculator)window.HypoMount.mountHypotekarnaCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("hypo-calc-root");window.CalcUI.initCalcEcho("hypo-calc-root");window.CalcUI.initCalcHeroPulse("res-net-worth");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();`,
  },
  {
    entry: path.join(src, "investicna", "investicnaMount.ts"),
    outfile: path.join(root, "js", "calculators", "investicna.js"),
    globalName: "InvMount",
    boot: `function boot(){if(window.InvMount&&window.InvMount.mountInvesticnaCalculator)window.InvMount.mountInvesticnaCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("inv-calc-root");window.CalcUI.initCalcEcho("inv-calc-root");window.CalcUI.initCalcHeroPulse("inv-finalValue");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();`,
  },
  {
    entry: path.join(src, "mzdova", "mzdovaMount.ts"),
    outfile: path.join(root, "js", "calculators", "mzdova.js"),
    globalName: "MzdMount",
    boot: `function boot(){if(window.MzdMount&&window.MzdMount.mountMzdovaCalculator)window.MzdMount.mountMzdovaCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("mzv3-w");window.CalcUI.initCalcEcho("mzv3-w");window.CalcUI.initCalcHeroPulse("mzv3-net");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();`,
  },
  {
    entry: path.join(src, "podlaprijmu", "podla-prijmuMount.ts"),
    outfile: path.join(root, "js", "calculators", "podla-prijmu.js"),
    globalName: "DtiMount",
    boot: `function boot(){if(window.DtiMount&&window.DtiMount.mountPodlaPrijmuCalculator)window.DtiMount.mountPodlaPrijmuCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("dti-calc-root");window.CalcUI.initCalcEcho("dti-calc-root");window.CalcUI.initCalcHeroPulse("dti-max-mortgage");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();`,
  },
  {
    entry: path.join(src, "rentova", "rentovaMount.ts"),
    outfile: path.join(root, "js", "calculators", "rentova.js"),
    globalName: "RentMount",
    boot: `function boot(){if(window.RentMount&&window.RentMount.mountRentovaCalculator)window.RentMount.mountRentovaCalculator();if(window.CalcUI){window.CalcUI.initCalcSliders("rentova-calc-root");window.CalcUI.initCalcEcho("rentova-calc-root");window.CalcUI.initCalcHeroPulse("ml-requiredCapital");}}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();`,
  },
];

for (const m of mounts) {
  await esbuild.build({
    entryPoints: [m.entry],
    bundle: true,
    format: "iife",
    globalName: m.globalName,
    outfile: m.outfile,
    alias: {
      "chart.js/auto": shim("chart.js"),
      "chart.js": shim("chart.js"),
      html2canvas: shim("html2canvas.js"),
      jspdf: shim("jspdf.js"),
    },
    footer: { js: m.boot },
    logLevel: "info",
  });
}

console.log("Calculator mounts bundled.");
