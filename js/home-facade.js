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
})();
