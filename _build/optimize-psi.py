"""Subset fonts, compress images, replace Lucide <i> with inline SVG."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LUCIDE = ROOT / "js" / "home" / "2fafb5be.js"
HTML = ROOT / "index.html"
FONT_DIR = ROOT / "assets" / "fonts" / "home"
IMG_DIR = ROOT / "assets" / "images" / "home"

UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x100))
    + list(range(0x100, 0x180))
    + [0x20AC, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026]
)

LUCIDE_NAMES = {
    "arrow-right": "ArrowRight",
    "arrow-left": "ArrowLeft",
    "arrow-up": "ArrowUp",
    "check": "Check",
    "x": "X",
    "message-circle": "MessageCircle",
    "trending-up": "TrendingUp",
    "building-2": "Building2",
    "shield-check": "ShieldCheck",
    "briefcase": "Briefcase",
    "users": "Users",
    "graduation-cap": "GraduationCap",
    "alert-circle": "CircleAlert",
}


def subset_font(src: Path, dst: Path) -> None:
    from fontTools.subset import Options, Subsetter
    from fontTools.ttLib import TTFont

    font = TTFont(src)
    options = Options()
    options.flavor = "woff2"
    options.desubroutinize = True
    options.layout_features = ["*"]
    options.glyph_names = False
    options.notdef_outline = True
    options.recommended_glyphs = True
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    dst.parent.mkdir(parents=True, exist_ok=True)
    font.save(dst)
    print(f"woff2 {src.name} {src.stat().st_size} -> {dst.name} {dst.stat().st_size}")


def convert_fonts() -> None:
    mapping = {
        "fbb1e7bb.otf": "recoleta-bold.woff2",
        "12bfe91c.otf": "recoleta-regular.woff2",
        "cc01e734.ttf": "matter-400.woff2",
        "ae8ee137.ttf": "matter-500.woff2",
        "5dc70571.ttf": "matter-600.woff2",
        "f2d0a1b0.ttf": "matter-700.woff2",
    }
    for src_name, dst_name in mapping.items():
        src = FONT_DIR / src_name
        if not src.exists():
            raise SystemExit(f"missing font {src}")
        subset_font(src, FONT_DIR / dst_name)


def save_webp(im: Image.Image, dest: Path, quality: int = 78) -> Path:
    dest = dest.with_suffix(".webp")
    im.save(dest, "WEBP", quality=quality, method=6)
    return dest


def fit_height(im: Image.Image, height: int) -> Image.Image:
    w, h = im.size
    if h <= height:
        return im
    nw = max(1, round(w * height / h))
    return im.resize((nw, height), Image.Resampling.LANCZOS)


def fit_width(im: Image.Image, width: int) -> Image.Image:
    w, h = im.size
    if w <= width:
        return im
    nh = max(1, round(h * width / w))
    return im.resize((width, nh), Image.Resampling.LANCZOS)


def compress_images() -> dict[str, str]:
    """Return old path -> new path rewrites for HTML/CSS."""
    rewrites: dict[str, str] = {}

    def note(old_name: str, new_path: Path) -> None:
        old = f"/assets/images/home/{old_name}"
        new = "/" + new_path.relative_to(ROOT).as_posix()
        if old != new:
            rewrites[old] = new
        print(f"img {old_name} -> {new_path.name} {new_path.stat().st_size}")

    avatar = Image.open(IMG_DIR / "fe90f7ed.png").convert("RGB")
    avatar = avatar.resize((72, 72), Image.Resampling.LANCZOS)
    dest = save_webp(avatar, IMG_DIR / "fe90f7ed", 72)
    note("fe90f7ed.png", dest)

    for name, height in (("a2d68d48.png", 68), ("2a92a907.png", 60), ("c91c649d.png", 72), ("a225a680.png", 60)):
        im = Image.open(IMG_DIR / name)
        im = fit_height(im, height)
        if im.mode in ("RGBA", "LA"):
            dest = save_webp(im.convert("RGBA"), IMG_DIR / name, 80)
        else:
            dest = save_webp(im.convert("RGB"), IMG_DIR / name, 80)
        note(name, dest)

    for name, max_w in (("1e6a6cd6.jpg", 1000), ("3b5b4e2a.jpg", 800), ("fe79786e.jpg", 800)):
        src = IMG_DIR / name
        im = Image.open(src).convert("RGB")
        im = fit_width(im, max_w)
        dest = save_webp(im, src, 76)
        note(name, dest)

    return rewrites


def parse_lucide_icons(src: str) -> dict[str, list]:
    icons = {}
    for slug, const in LUCIDE_NAMES.items():
        m = re.search(rf"const {const} = \[", src)
        if not m:
            raise SystemExit(f"lucide icon {const} not found")
        start = m.end() - 1
        depth = 0
        i = start
        while i < len(src):
            if src[i] == "[":
                depth += 1
            elif src[i] == "]":
                depth -= 1
                if depth == 0:
                    blob = src[start : i + 1]
                    blob = re.sub(r"([{,]\s*)([A-Za-z0-9-]+)\s*:", r'\1"\2":', blob)
                    icons[slug] = eval(blob, {"__builtins__": {}})
                    break
            i += 1
        else:
            raise SystemExit(f"unclosed array for {const}")
    return icons


def node_to_svg(tag: str, attrs: dict) -> str:
    parts = [f"<{tag}"]
    for k, v in attrs.items():
        parts.append(f' {k}="{v}"')
    parts.append("/>")
    return "".join(parts)


def icon_svg(nodes: list, width: str, height: str, stroke: str, extra_style: str) -> str:
    inner = "".join(node_to_svg(tag, attrs) for tag, attrs in nodes)
    style = extra_style
    if "flex:none" not in style.replace(" ", "") and "flex: none" not in style:
        if style:
            style = style.rstrip(";") + ";flex:none"
        else:
            style = "flex:none"
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{stroke}" '
        f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="{style}">'
        f"{inner}</svg>"
    )


def replace_lucide(html: str, icons: dict) -> str:
    pattern = re.compile(
        r'<i data-lucide="([a-z0-9-]+)"(?: data-stroke="([^"]*)")?(?: style="([^"]*)")?></i>'
    )

    def repl(m: re.Match) -> str:
        name, stroke, style = m.group(1), m.group(2) or "2", m.group(3) or ""
        if name not in icons:
            raise SystemExit(f"unmapped lucide icon {name}")
        w = h = "24"
        wm = re.search(r"width:(\d+)px", style.replace(" ", ""))
        hm = re.search(r"height:(\d+)px", style.replace(" ", ""))
        if wm:
            w = wm.group(1)
        if hm:
            h = hm.group(1)
        return icon_svg(icons[name], w, h, stroke, style)

    html, n = pattern.subn(repl, html)
    print(f"replaced {n} lucide icons")
    leftover = re.findall(r"data-lucide=", html)
    if leftover:
        raise SystemExit(f"leftover data-lucide: {len(leftover)}")
    return html


def apply_rewrites(html: str, rewrites: dict[str, str]) -> str:
    for old, new in rewrites.items():
        html = html.replace(old, new)
    return html


def main() -> None:
    convert_fonts()
    rewrites = compress_images()
    icons = parse_lucide_icons(LUCIDE.read_text(encoding="utf-8"))
    html = HTML.read_text(encoding="utf-8")
    html = replace_lucide(html, icons)
    html = apply_rewrites(html, rewrites)
    HTML.write_text(html, encoding="utf-8")
    print("wrote", HTML)


if __name__ == "__main__":
    main()
