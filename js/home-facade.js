(function () {
  function hideFirstPaint() {
    var splash = document.getElementById("home-firstpaint");
    if (splash) splash.remove();
  }
  function liveHeader() {
    var headers = document.querySelectorAll("header");
    for (var i = 0; i < headers.length; i++) {
      if (!headers[i].closest("x-dc") && headers[i].getBoundingClientRect().height > 20) return headers[i];
    }
    return null;
  }
  if (liveHeader()) {
    hideFirstPaint();
  } else {
    var obs = new MutationObserver(function () {
      if (liveHeader()) {
        hideFirstPaint();
        obs.disconnect();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(function () {
      hideFirstPaint();
      obs.disconnect();
    }, 4000);
  }

  function isLocalHost() {
    var host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local") || host === "";
  }

  function inject(src, attrs) {
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        s.setAttribute(k, attrs[k]);
      });
    }
    document.head.appendChild(s);
  }

  function loadThirdParties() {
    if (isLocalHost()) return;
    inject("https://consent.cookiebot.com/uc.js", {
      id: "Cookiebot",
      "data-cbid": "a1cb1396-ebeb-4e0d-bb6c-28cfcaf6522d",
      "data-blockingmode": "auto"
    });
    inject("https://cloud.umami.is/script.js", {
      "data-website-id": "c6540d5c-dbbe-4cad-baa0-475ca9c75fc9"
    });
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadThirdParties, { timeout: 4000 });
  } else {
    window.addEventListener("load", function () {
      window.setTimeout(loadThirdParties, 1200);
    });
  }
})();
