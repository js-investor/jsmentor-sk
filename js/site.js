(function () {
  "use strict";

  window.JS_MENTOR_MAKE_WEBHOOK_URL = window.JS_MENTOR_MAKE_WEBHOOK_URL || "";

  var HEADER_SELECTOR = "[data-js-site-header]";
  var HEADER_FALLBACK_PX = 88;
  var GAP_PX = 16;
  var anchorScrollGeneration = 0;

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function getSiteHeaderHeightPx() {
    var header = document.querySelector(HEADER_SELECTOR);
    if (!header) return HEADER_FALLBACK_PX;
    return Math.max(Math.ceil(header.getBoundingClientRect().height), 48);
  }

  function scrollTopForElementUnderHeader(el) {
    var rect = el.getBoundingClientRect();
    return Math.round(rect.top + window.scrollY - getSiteHeaderHeightPx() - GAP_PX);
  }

  function beginAnchorScrollSession() {
    anchorScrollGeneration += 1;
    return anchorScrollGeneration;
  }

  function cancelAnchorScrollOnUserInput(session) {
    var markCancelled = function () {
      if (session === anchorScrollGeneration) anchorScrollGeneration += 1;
    };
    window.addEventListener("wheel", markCancelled, { passive: true, once: true });
    window.addEventListener("touchmove", markCancelled, { passive: true, once: true });
  }

  function scrollToAnchorId(elementId) {
    var el = elementId === "formular" ? document.getElementById("formular") : document.getElementById(elementId);
    if (!(el instanceof HTMLElement)) return;
    var session = beginAnchorScrollSession();
    cancelAnchorScrollOnUserInput(session);
    var top = Math.max(0, scrollTopForElementUnderHeader(el));
    window.scrollTo({ top: top, left: 0, behavior: "smooth" });
    window.setTimeout(function () {
      if (session !== anchorScrollGeneration) return;
      var target = document.getElementById(elementId);
      if (!(target instanceof HTMLElement)) return;
      var targetY = Math.max(0, scrollTopForElementUnderHeader(target));
      if (Math.abs(window.scrollY - targetY) > 12) {
        window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
      }
    }, 520);
  }

  function normalizePath(pathname) {
    if (!pathname || pathname === "/") return "/";
    return pathname.replace(/\/+$/, "") || "/";
  }

  function samePageHash(href) {
    try {
      var url = new URL(href, window.location.href);
      return normalizePath(url.pathname) === normalizePath(window.location.pathname) && url.hash;
    } catch (e) {
      return "";
    }
  }

  function initHashLinks() {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var anchor = event.target.closest("a[href]");
      if (!anchor) return;
      var hash = samePageHash(anchor.href);
      if (!hash) return;
      var id = hash.slice(1);
      if (!id) return;
      event.preventDefault();
      scrollToAnchorId(id);
      if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
    });

    if (window.location.hash) {
      var id = window.location.hash.replace(/^#/, "");
      window.setTimeout(function () {
        scrollToAnchorId(id);
      }, 0);
    }
  }

  function initMobileMenu() {
    var toggle = document.querySelector("[data-mobile-menu-toggle]");
    var panel = document.querySelector("[data-mobile-menu]") || document.querySelector(".konzultacia-header-mobile-panel");
    if (!toggle || !panel) return;

    var iconOpen = toggle.querySelector("[data-icon-open], [data-icon-menu], [data-icon='menu']");
    var iconClose = toggle.querySelector("[data-icon-close], [data-icon='close']");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Zavrieť menu" : "Otvoriť menu");
      panel.classList.toggle("hidden", !open);
      if (open) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle("hidden", open);
        iconClose.classList.toggle("hidden", !open);
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  function initNavDropdowns() {
    document.querySelectorAll("[data-nav-group]").forEach(function (group) {
      var panel = group.querySelector("[data-nav-panel]");
      var button = group.querySelector("button");
      if (!panel) return;
      var timer = null;

      function open() {
        if (timer) window.clearTimeout(timer);
        panel.classList.remove("hidden");
        if (button) button.setAttribute("aria-expanded", "true");
        var chevron = group.querySelector("svg");
        if (chevron) chevron.classList.add("rotate-180");
      }

      function scheduleClose() {
        timer = window.setTimeout(function () {
          panel.classList.add("hidden");
          if (button) button.setAttribute("aria-expanded", "false");
          var chevron = group.querySelector("svg");
          if (chevron) chevron.classList.remove("rotate-180");
        }, 160);
      }

      group.addEventListener("mouseenter", open);
      group.addEventListener("mouseleave", scheduleClose);
      panel.addEventListener("mouseenter", open);
      panel.addEventListener("mouseleave", scheduleClose);
    });

    document.querySelectorAll("[data-mobile-group]").forEach(function (el) {
      var button = el.tagName === "BUTTON" ? el : el.querySelector("button");
      var scope = el.tagName === "BUTTON" ? el.parentElement : el;
      var panel = scope ? scope.querySelector("[data-mobile-group-panel]") : null;
      if (!button || !panel) return;
      button.addEventListener("click", function () {
        var willOpen = panel.classList.contains("hidden");
        document.querySelectorAll("[data-mobile-group-panel]").forEach(function (p) {
          p.classList.add("hidden");
        });
        document.querySelectorAll("[data-mobile-group] svg, [data-mobile-chevron]").forEach(function (s) {
          s.classList.remove("rotate-180");
        });
        if (willOpen) {
          panel.classList.remove("hidden");
          var chevron = button.querySelector("svg");
          if (chevron) chevron.classList.add("rotate-180");
        }
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });
  }

  function isKonzultaciaFaq(button) {
    return button.classList.contains("rounded-xl") && button.classList.contains("border");
  }

  function setKonzultaciaFaqOpen(button, panel, open) {
    button.setAttribute("aria-expanded", open ? "true" : "false");
    var mark = button.querySelector("span.absolute, span.h6");
    if (open) {
      panel.classList.remove("hidden");
      panel.removeAttribute("hidden");
      button.classList.remove("bg-white", "text-foreground", "hover:bg-primary", "hover:text-white");
      button.classList.add("bg-primary", "text-white");
      if (mark) {
        mark.textContent = "-";
        mark.classList.remove("text-primary", "group-hover:text-white");
        mark.classList.add("text-white");
      }
    } else {
      panel.classList.add("hidden");
      panel.setAttribute("hidden", "");
      button.classList.add("bg-white", "text-foreground", "hover:bg-primary", "hover:text-white");
      button.classList.remove("bg-primary", "text-white");
      if (mark) {
        mark.textContent = "+";
        mark.classList.add("text-primary", "group-hover:text-white");
        mark.classList.remove("text-white");
      }
    }
  }

  function initFaq() {
    var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-faq-toggle]"));
    if (!toggles.length) return;

    function panelFor(button) {
      var item = button.closest("[data-faq-item]") || button.parentElement;
      return item ? item.querySelector("[data-faq-panel]") : null;
    }

    var exclusive = toggles.some(isKonzultaciaFaq);

    toggles.forEach(function (button) {
      button.addEventListener("click", function () {
        var panel = panelFor(button);
        if (!panel) return;
        var willOpen = button.getAttribute("aria-expanded") !== "true";

        if (exclusive) {
          toggles.forEach(function (other) {
            var otherPanel = panelFor(other);
            if (!otherPanel) return;
            if (isKonzultaciaFaq(other)) setKonzultaciaFaqOpen(other, otherPanel, other === button && willOpen);
            else {
              other.setAttribute("aria-expanded", other === button && willOpen ? "true" : "false");
              otherPanel.hidden = !(other === button && willOpen);
              otherPanel.classList.toggle("hidden", !(other === button && willOpen));
            }
          });
          return;
        }

        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
        panel.hidden = !willOpen;
        panel.classList.toggle("hidden", !willOpen);
        var chevron = button.querySelector("svg");
        if (chevron) chevron.classList.toggle("rotate-180", willOpen);
      });
    });
  }

  function initReveal() {
    var nodes = document.querySelectorAll(".js-reveal");
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
    );
    nodes.forEach(function (el) {
      observer.observe(el);
    });
  }

  var FORM_MESSAGES = {
    success: "Ďakujem, formulár bol úspešne odoslaný. Ozvem sa ti do 48 hodín.",
    webhook_gone: "Formulár sa nepodarilo odoslať, pretože webhook už nie je aktívny (410 Gone). Prosím aktualizuj Make webhook URL.",
    network_error: "Formulár sa nepodarilo odoslať kvôli sieťovej/CORS chybe. Skús to prosím znovu alebo ma kontaktuj na WhatsAppe.",
    error: "Odoslanie sa nepodarilo. Skús to prosím znovu alebo ma kontaktuj na WhatsAppe.",
    config_error: "Formulár nie je nakonfigurovaný. Chýba Vercel premenná VITE_MAKE_WEBHOOK_URL.",
  };

  function initBookingForm() {
    var form = document.querySelector("#formular form");
    if (!form) return;
    var submitBtn = form.querySelector("[data-form-submit]");

    function showStatus(key) {
      form.querySelectorAll("[data-form-status]").forEach(function (el) {
        var match = el.getAttribute("data-form-status") === key;
        el.classList.toggle("hidden", !match);
        if (match) {
          el.removeAttribute("hidden");
          if (!el.textContent) el.textContent = FORM_MESSAGES[key] || "";
        } else {
          el.setAttribute("hidden", "");
        }
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      showStatus(null);
      var webhook = window.JS_MENTOR_MAKE_WEBHOOK_URL;
      if (!webhook) {
        showStatus("config_error");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Odosielam...";
      }

      var formData = new FormData(form);
      formData.append("source", "konzultacia-form");
      formData.append("submittedAt", new Date().toISOString());
      var payload = new URLSearchParams();
      formData.forEach(function (value, key) {
        payload.append(key, String(value));
      });

      var abortController = new AbortController();
      var timeout = window.setTimeout(function () {
        abortController.abort();
      }, 12000);

      fetch(webhook, { method: "POST", body: payload, signal: abortController.signal })
        .then(function (response) {
          window.clearTimeout(timeout);
          if (response.status === 410) {
            showStatus("webhook_gone");
            return;
          }
          if (!response.ok) {
            showStatus("error");
            return;
          }
          showStatus("success");
          form.reset();
        })
        .catch(function () {
          window.clearTimeout(timeout);
          showStatus("network_error");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Odoslať formulár";
          }
        });
    });
  }

  function initLightbox() {
    var overlay = document.getElementById("reviews-lightbox");
    if (!overlay) return;
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox-src]"));
    var image = overlay.querySelector("[data-lightbox-image]");
    var index = 0;

    function open(i) {
      index = i;
      if (image) {
        image.src = triggers[index].getAttribute("data-lightbox-src");
        var img = triggers[index].querySelector("img");
        image.alt = img ? img.alt : "Recenzia";
      }
      overlay.classList.remove("hidden");
      overlay.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
    }

    function close() {
      overlay.classList.add("hidden");
      overlay.setAttribute("hidden", "");
      document.body.style.overflow = "";
    }

    function step(delta) {
      if (!triggers.length) return;
      index = (index + delta + triggers.length) % triggers.length;
      open(index);
    }

    triggers.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        open(i);
      });
    });
    overlay.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    overlay.querySelectorAll("[data-lightbox-prev]").forEach(function (el) {
      el.addEventListener("click", function () {
        step(-1);
      });
    });
    overlay.querySelectorAll("[data-lightbox-next]").forEach(function (el) {
      el.addEventListener("click", function () {
        step(1);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (overlay.classList.contains("hidden")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    });
  }

  function initScrollDepth() {
    if (!document.querySelector(".page-home") || !document.getElementById("CTA1")) return;

    var firedDepths = {};
    var milestones = [25, 50, 75, 90];
    window.addEventListener(
      "scroll",
      function () {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        var percent = Math.round((window.scrollY / docHeight) * 100);
        milestones.forEach(function (milestone) {
          if (percent >= milestone && !firedDepths[milestone]) {
            firedDepths[milestone] = true;
            if (window.umami && typeof window.umami.track === "function") {
              window.umami.track("scroll_" + milestone + "pct");
            }
          }
        });
      },
      { passive: true }
    );

    [
      { id: "ivan", label: "O Ivanovi" },
      { id: "financne-chyby", label: "Finančné chyby" },
      { id: "nastroje", label: "Nástroje" },
      { id: "ukazky-videi", label: "Ukážky videi" },
      { id: "bonusy-kalkulacky", label: "Bonusy a kalkulačky" },
      { id: "recenzie", label: "Recenzie" },
      { id: "CTA1", label: "CTA1" },
      { id: "faq", label: "FAQ" },
    ].forEach(function (section) {
      var el = document.getElementById(section.id);
      if (!el) return;
      var observer = new IntersectionObserver(
        function (entries) {
          if (entries[0] && entries[0].isIntersecting) {
            if (window.umami && typeof window.umami.track === "function") {
              window.umami.track("section_view", { section: section.label });
            }
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
    });
  }

  onReady(function () {
    initHashLinks();
    initMobileMenu();
    initNavDropdowns();
    initFaq();
    initReveal();
    initBookingForm();
    initLightbox();
    initScrollDepth();
  });
})();
