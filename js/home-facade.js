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

  document.addEventListener("click", function (event) {
    var btn = event.target.closest(".js-vimeo-facade");
    if (!btn) return;
    event.preventDefault();
    var src = btn.getAttribute("data-vimeo-src");
    if (!src) return;
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = btn.getAttribute("aria-label") || "Video";
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; clipboard-write");
    iframe.setAttribute("allowfullscreen", "");
    iframe.style.cssText = "width:100%;height:100%;border:0;display:block";
    btn.replaceWith(iframe);
  });
})();
