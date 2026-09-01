"""Assemble a real homepage from the unpacked Claude bundle."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_build" / "unpacked-home"
TPL = (SRC / "template.html").read_text(encoding="utf-8")

IMG_DST = ROOT / "assets" / "images" / "home"
FONT_DST = ROOT / "assets" / "fonts" / "home"
JS_DST = ROOT / "js" / "home"
CSS_DST = ROOT / "css"

IMG_DST.mkdir(parents=True, exist_ok=True)
FONT_DST.mkdir(parents=True, exist_ok=True)
JS_DST.mkdir(parents=True, exist_ok=True)

USED_FONTS = {
    "82042797.ttf",  # Fraunces roman
    "b90bbfc2.ttf",  # Matter 300
    "cc01e734.ttf",  # Matter 400
    "ae8ee137.ttf",  # Matter 500
    "5dc70571.ttf",  # Matter 600
    "f2d0a1b0.ttf",  # Matter 700
    "298f235b.otf",  # Recoleta light
    "12bfe91c.otf",  # Recoleta regular
    "fbb1e7bb.otf",  # Recoleta bold
}

path_rewrites: dict[str, str] = {}


def copy_fonts():
    for src in (SRC / "assets" / "fonts" / "home").glob("*"):
        if src.name in USED_FONTS:
            shutil.copy2(src, FONT_DST / src.name)


def copy_js():
    for src in (SRC / "js" / "home").glob("*.js"):
        shutil.copy2(src, JS_DST / src.name)


def copy_images():
    src_dir = SRC / "assets" / "images" / "home"
    for src in src_dir.iterdir():
        shutil.copy2(src, IMG_DST / src.name)


def extract_css(html: str) -> tuple[str, str]:
    styles = re.findall(r"<style>(.*?)</style>", html, re.S)
    kept = []
    for block in styles:
        if "font-family: 'Inter'" in block or "font-family: 'Playfair Display'" in block:
            continue
        kept.append(block.strip())
    # Drop unused Fraunces italic face
    css = "\n\n".join(kept)
    css = re.sub(
        r"@font-face \{\s*font-family: \"Fraunces\";\s*src: url\(\"/assets/fonts/home/95e7a002\.ttf\"\)[^}]+\}",
        "",
        css,
        flags=re.S,
    )
    css += """

#home-firstpaint{
  position:fixed;inset:0;z-index:90;background:#F5EDE0;color:#171310;
  display:flex;align-items:center;justify-content:center;padding:28px 22px;text-align:center;
}
#home-firstpaint h1{
  font-family:'Recoleta',Georgia,serif;font-weight:830;
  font-size:clamp(32px,6.2vw,64px);line-height:1.05;letter-spacing:-0.025em;max-width:16ch;
}
body:has(.page) #home-firstpaint{display:none!important}
"""
    html = re.sub(r"<style>.*?</style>", "", html, flags=re.S)
    return html, css


def enhance_images(html: str) -> str:
    html = html.replace(
        '<img src="/assets/images/home/a225a680.png" alt="JS Mentor" style="height:30px;width:auto;display:block;">',
        '<img src="/assets/images/home/a225a680.png" alt="JS Mentor" width="153" height="30" style="height:30px;width:auto;display:block;">',
    )
    html = html.replace(
        '<img src="/assets/images/home/fe90f7ed.png" alt="Ivan Jašík" style="width:36px;height:36px;border-radius:999px;object-fit:cover;border:2px solid #F5EDE0;margin:-8px 0 -8px -10px;flex:none">',
        '<img src="/assets/images/home/fe90f7ed.png" alt="Ivan Jašík" width="36" height="36" style="width:36px;height:36px;border-radius:999px;object-fit:cover;border:2px solid #F5EDE0;margin:-8px 0 -8px -10px;flex:none">',
    )
    # Below-the-fold images: lazy + dimensions where we know them
    replacements = [
        (
            '<img src="/assets/images/home/1e6a6cd6.jpg" alt="Ivan Jašík" style="width: 530px; height: 395px">',
            '<img src="/assets/images/home/1e6a6cd6.jpg" alt="Ivan Jašík" width="530" height="395" loading="lazy" decoding="async" style="width: 530px; height: 395px">',
        ),
        (
            'style="flex:0 1 328px;min-width:0;max-width:344px;height:auto;display:block;cursor:zoom-in;',
            'width="344" height="430" loading="lazy" decoding="async" style="flex:0 1 328px;min-width:0;max-width:344px;height:auto;display:block;cursor:zoom-in;',
        ),
        (
            '<img src="/assets/images/home/3b5b4e2a.png" alt="Vytvor majetok, ktorý ti zabezpečí slobodu a nie starosti." style="width:100%;height:auto;display:block">',
            '<img src="/assets/images/home/3b5b4e2a.png" alt="Vytvor majetok, ktorý ti zabezpečí slobodu a nie starosti." width="1200" height="800" loading="lazy" decoding="async" style="width:100%;height:auto;display:block">',
        ),
        (
            '<img src="/assets/images/home/fe79786e.png" alt="Ivan Jašík" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block">',
            '<img src="/assets/images/home/fe79786e.png" alt="Ivan Jašík" width="900" height="1200" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block">',
        ),
    ]
    for a, b in replacements:
        html = html.replace(a, b)
    return html


def strip_head_bits(html: str) -> str:
    html = re.sub(r"^<!DOCTYPE html>\s*<html><head>.*?</head>\s*<body>\s*", "", html, count=1, flags=re.S)
    html = re.sub(r"</body></html>\s*$", "", html)
    html = re.sub(r'<script src="/js/home/2fafb5be\.js"></script>', "", html, count=1)
    html = re.sub(r'<script src="/js/home/5fc5c615\.js"></script>', "", html)
    return html.strip()


HEAD = r"""<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="/assets/js-favicon.png">
  <title>Ivan Jašík — Bezplatná 30-minútová konzultácia</title>
  <meta name="description" content="Vybuduj si majetok, ktorý ti raz bude posielať výplatu. Na 30-minútovom hovore prejdeme tvoje čísla a do 7 dní dostaneš osobný plán. Zadarmo, bez záväzkov.">
  <meta name="author" content="Ivan Jašík — JS Mentor">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Ivan Jašík — Bezplatná 30-minútová konzultácia">
  <meta property="og:description" content="Vybuduj si majetok, ktorý ti raz bude posielať výplatu. Úvodný hovor je zadarmo.">
  <meta property="og:image" content="/assets/images/jsmentor-biznis-portret-ivan-interier-svetlo.jpg">
  <meta property="og:url" content="https://jsmentor.sk">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="/assets/fonts/home/recoleta-bold.woff2" as="font" type="font/woff2" crossorigin>
  <style>
    @font-face{font-family:Recoleta;src:url("/assets/fonts/home/recoleta-bold.woff2") format("woff2");font-weight:500 900;font-style:normal;font-display:swap}
    html,body{margin:0;background:#F5EDE0;color:#171310}
    x-dc{display:none!important}
    #home-firstpaint{position:fixed;inset:0;z-index:90;background:#F5EDE0;color:#171310;display:flex;align-items:center;justify-content:center;padding:28px 22px;text-align:center}
    #home-firstpaint h1{font-family:Recoleta,Georgia,serif;font-weight:830;font-size:clamp(32px,6.2vw,64px);line-height:1.05;letter-spacing:-.025em;max-width:16ch;margin:0}
  </style>
  <link rel="stylesheet" href="/css/home.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/css/home.css"></noscript>
  <script>
    window.__resources = __RESOURCES__;
  </script>
  <script>
    (function () {
      var host = window.location.hostname;
      var isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local") || host === "";
      if (isLocal) return;
      var script = document.createElement("script");
      script.id = "Cookiebot";
      script.src = "https://consent.cookiebot.com/uc.js";
      script.setAttribute("data-cbid", "a1cb1396-ebeb-4e0d-bb6c-28cfcaf6522d");
      script.setAttribute("data-blockingmode", "auto");
      document.head.appendChild(script);
    })();
  </script>
  <script defer src="https://cloud.umami.is/script.js" data-website-id="c6540d5c-dbbe-4cad-baa0-475ca9c75fc9"></script>
  <script defer src="/js/home/bedae424.js"></script>
  <script defer src="/js/home/fd56f2ec.js"></script>
  <script defer src="/js/home/5fc5c615.js"></script>
  <script defer src="/js/home-facade.js"></script>
</head>
<body>
<main>
<div id="home-firstpaint">
  <h1>Vybuduj si majetok, ktorý ti raz bude posielať výplatu.</h1>
</div>
"""

FOOT = """
</main>
</body>
</html>
"""


def main():
    copy_fonts()
    copy_js()
    copy_images()

    html = TPL
    for old, new in path_rewrites.items():
        html = html.replace(old, new)

    html, css = extract_css(html)
    html = enhance_images(html)
    html = strip_head_bits(html)

    resources = json.loads((SRC / "resource-map.json").read_text(encoding="utf-8"))
    for old, new in path_rewrites.items():
        for k, v in list(resources.items()):
            if v == old:
                resources[k] = new

    head = HEAD.replace("__RESOURCES__", json.dumps(resources, ensure_ascii=False))
    (CSS_DST / "home.css").write_text(css, encoding="utf-8")
    (ROOT / "index.html").write_text(head + "\n" + html + FOOT, encoding="utf-8")
    print("index.html", (ROOT / "index.html").stat().st_size)
    print("home.css", (CSS_DST / "home.css").stat().st_size)


if __name__ == "__main__":
    main()
