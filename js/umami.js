(function (global) {
  "use strict";

  var WEBSITE_ID = "c6540d5c-dbbe-4cad-baa0-475ca9c75fc9";
  var SCRIPT_SRC = "https://cloud.umami.is/script.js";
  var START_WINDOW_MS = 30 * 60 * 1000;
  var STORAGE_PREFIX = "jsmentor-umami-form-start:";
  var PII_KEYS = {
    name: 1,
    meno: 1,
    email: 1,
    telefon: 1,
    phone: 1,
    tel: 1,
    address: 1,
    adresa: 1,
    firstname: 1,
    lastname: 1,
    priezvisko: 1,
  };

  var started = {};
  var fetchHooked = false;
  var inited = false;
  var queue = [];
  var pollTimer = 0;

  function isLocalHost() {
    var loc = global.location;
    if (!loc) return true;
    var host = loc.hostname || "";
    if (!host) return true;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local") ||
      loc.protocol === "file:"
    );
  }

  var enabled = !isLocalHost();

  function formLocation() {
    var path = (global.location && global.location.pathname) || "/";
    if (path.length > 1 && path.charAt(path.length - 1) === "/") {
      path = path.replace(/\/+$/, "");
    }
    return path || "/";
  }

  function slugFromPath() {
    var parts = formLocation().split("/").filter(Boolean);
    if (parts[0] === "bonusy" && parts[1]) return parts[1];
    return parts[parts.length - 1] || "";
  }

  function cleanProps(props) {
    if (!props) return {};
    var out = {};
    Object.keys(props).forEach(function (key) {
      if (PII_KEYS[String(key).toLowerCase()]) return;
      var value = props[key];
      if (value == null || value === "") return;
      var type = typeof value;
      if (type === "string" || type === "number" || type === "boolean") {
        out[key] = value;
      }
    });
    return out;
  }

  function flush() {
    if (!enabled) return;
    if (!(global.umami && typeof global.umami.track === "function")) return;
    while (queue.length) {
      var item = queue.shift();
      try {
        if (item.props && Object.keys(item.props).length) {
          global.umami.track(item.name, item.props);
        } else {
          global.umami.track(item.name);
        }
      } catch (err) {}
    }
  }

  function track(name, props) {
    if (!enabled || !name) return;
    queue.push({ name: name, props: cleanProps(props) });
    flush();
  }

  function trackFormStart(formId) {
    if (!enabled || !formId) return false;
    var loc = formLocation();
    var memKey = formId + ":" + loc;
    if (started[memKey]) return false;
    var storageKey = STORAGE_PREFIX + memKey;
    var now = Date.now();
    try {
      var last = parseInt(global.localStorage.getItem(storageKey) || "0", 10);
      if (last && now - last < START_WINDOW_MS) {
        started[memKey] = true;
        return false;
      }
    } catch (err) {}
    started[memKey] = true;
    try {
      global.localStorage.setItem(storageKey, String(now));
    } catch (err) {}
    track("form_start", { form_id: formId, form_location: loc });
    return true;
  }

  function trackFormSubmit(formId) {
    if (!enabled || !formId) return;
    track("form_submit", { form_id: formId, form_location: formLocation() });
  }

  function loadScript() {
    if (!enabled || !document.head) return;
    if (document.querySelector('script[data-website-id="' + WEBSITE_ID + '"]')) return;
    var script = document.createElement("script");
    script.defer = true;
    script.src = SCRIPT_SRC;
    script.setAttribute("data-website-id", WEBSITE_ID);
    script.setAttribute("data-cookieconsent", "ignore");
    script.addEventListener("load", flush);
    document.head.appendChild(script);
  }

  function isFillableField(el) {
    if (!el || !el.tagName) return false;
    var tag = el.tagName;
    if (tag !== "INPUT" && tag !== "TEXTAREA") return false;
    var type = String(el.type || "text").toLowerCase();
    return (
      type !== "hidden" &&
      type !== "checkbox" &&
      type !== "radio" &&
      type !== "submit" &&
      type !== "button" &&
      type !== "reset" &&
      type !== "file"
    );
  }

  function formIdFrom(form) {
    if (!form) return "";
    return form.getAttribute("data-umami-form") || "";
  }

  function onFormInput(event) {
    var target = event.target;
    if (!isFillableField(target) || !target.closest) return;
    var form = target.closest("form");
    if (!form) return;
    var id = formIdFrom(form);
    if (!id && (form.id === "komunita-join-form" || form.classList.contains("km-join"))) {
      id = "community_join";
    }
    if (id) trackFormStart(id);
  }

  function isConsultationHref(href) {
    if (!href) return false;
    var lower = href.toLowerCase();
    if (lower.indexOf("#formular") !== -1) return true;
    if (lower.indexOf("konzultacia.jsmentor.sk") !== -1) return true;
    try {
      var url = new URL(href, global.location.href);
      var path = url.pathname.replace(/\/+$/, "") || "/";
      if (path === "/konzultacia") return true;
      if (path === "/" && url.hash === "#formular") return true;
    } catch (err) {}
    return false;
  }

  function onConsultationClick(event) {
    var el = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!el) return;
    if (el.getAttribute("data-umami-event")) return;
    if (!isConsultationHref(el.getAttribute("href"))) return;
    var slug = slugFromPath();
    var section = el.getAttribute("data-umami-event-section") || slug || formLocation();
    var props = { section: section };
    if (slug) props.slug = slug;
    track("click_konzultacia", props);
  }

  function requestUrl(input) {
    try {
      if (typeof input === "string") return input;
      if (input && typeof input.url === "string") return input.url;
    } catch (err) {}
    return "";
  }

  function requestMethod(input, init) {
    if (init && init.method) return String(init.method).toUpperCase();
    if (input && input.method) return String(input.method).toUpperCase();
    return "GET";
  }

  function interceptJoinFetch() {
    if (!enabled || fetchHooked || typeof global.fetch !== "function") return;
    fetchHooked = true;
    var original = global.fetch;
    global.fetch = function (input, init) {
      var url = requestUrl(input);
      var method = requestMethod(input, init);
      var pending = original.apply(this, arguments);
      if (method === "POST" && /\/api\/join(\?|$)/.test(url)) {
        pending
          .then(function (res) {
            if (res && res.ok) trackFormSubmit("community_join");
          })
          .catch(function () {});
      }
      return pending;
    };
  }

  function startPolling() {
    if (pollTimer || !enabled) return;
    var ticks = 0;
    pollTimer = global.setInterval(function () {
      ticks += 1;
      flush();
      if ((global.umami && typeof global.umami.track === "function") || ticks > 40) {
        global.clearInterval(pollTimer);
        pollTimer = 0;
      }
    }, 250);
  }

  function init() {
    if (inited) return;
    inited = true;
    loadScript();
    interceptJoinFetch();
    document.addEventListener("input", onFormInput, true);
    document.addEventListener("click", onConsultationClick, true);
    startPolling();
  }

  global.JSMentorUmami = {
    enabled: enabled,
    track: track,
    formStart: trackFormStart,
    formSubmit: trackFormSubmit,
    location: formLocation,
  };

  interceptJoinFetch();
  if (document.head) loadScript();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
