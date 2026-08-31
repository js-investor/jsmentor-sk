(function (global) {
  "use strict";

  function syncSlider(el) {
    var min = Number(el.min || 0);
    var max = Number(el.max || 100);
    var value = Number(el.value);
    var p = max > min ? ((value - min) / (max - min)) * 100 : 0;
    el.style.setProperty("--p", Math.min(100, Math.max(0, p)) + "%");
  }

  function initCalcSliders(rootId) {
    var root = document.getElementById(rootId);
    if (!root) return function () {};

    var syncAll = function () {
      root.querySelectorAll("input[type='range']").forEach(syncSlider);
    };

    var onInput = function (e) {
      var t = e.target;
      if (t instanceof HTMLInputElement && t.type === "range") syncSlider(t);
    };

    var raf = 0;
    var onClick = function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncAll);
    };

    syncAll();
    root.addEventListener("input", onInput);
    document.addEventListener("click", onClick);

    return function () {
      cancelAnimationFrame(raf);
      root.removeEventListener("input", onInput);
      document.removeEventListener("click", onClick);
    };
  }

  var CALC_CHART_COLORS = {
    primary: "#29614A",
    primaryFill: "rgba(41, 97, 74, 0.16)",
    sand: "#A8956E",
    sandFill: "rgba(168, 149, 110, 0.12)",
    terra: "#C1533C",
    terraFill: "rgba(193, 83, 60, 0.12)",
    grid: "rgba(0, 0, 0, 0.06)",
    tick: "rgba(0, 0, 0, 0.45)",
  };

  function initCalcHeroPulse(valueId) {
    var el = document.getElementById(valueId);
    if (!el) return function () {};

    var timer = 0;
    var observer = new MutationObserver(function () {
      el.classList.remove("is-updating");
      void el.offsetWidth;
      el.classList.add("is-updating");
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        el.classList.remove("is-updating");
      }, 450);
    });

    observer.observe(el, { childList: true, characterData: true, subtree: true });

    return function () {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }

  function initCalcEcho(rootId) {
    var root = document.getElementById(rootId);
    if (!root) return function () {};

    var sync = function () {
      root.querySelectorAll("[data-echo-of]").forEach(function (el) {
        var src = document.getElementById(el.getAttribute("data-echo-of") || "");
        if (src) el.textContent = src.value + (el.getAttribute("data-echo-suffix") || "");
      });
    };

    var raf = 0;
    var onEvent = function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };

    sync();
    root.addEventListener("input", onEvent);
    document.addEventListener("click", onEvent);

    return function () {
      cancelAnimationFrame(raf);
      root.removeEventListener("input", onEvent);
      document.removeEventListener("click", onEvent);
    };
  }

  function initSteppers() {
    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".js-stepper");
      if (!btn) return;
      var inputId = btn.getAttribute("data-stepper-input");
      var dir = btn.getAttribute("data-stepper-dir");
      var el = inputId ? document.getElementById(inputId) : null;
      if (!el) return;
      if (dir === "up") el.stepUp();
      else el.stepDown();
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  function initComparisonButtons() {
    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-open-comparison]");
      if (!btn) return;
      if (typeof global.mlOpenComparison === "function") global.mlOpenComparison();
    });
  }

  function boot() {
    initSteppers();
    initComparisonButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  global.CalcUI = {
    initCalcSliders: initCalcSliders,
    initCalcEcho: initCalcEcho,
    initCalcHeroPulse: initCalcHeroPulse,
    CALC_CHART_COLORS: CALC_CHART_COLORS,
  };
})(window);
