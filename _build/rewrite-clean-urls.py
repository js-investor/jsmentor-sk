from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {"index.html", "konzultaciajsmentor.html"}

PAGE_REPLACEMENTS = [
    ("bonusy-hypo-kalkulacka.html", "/bonusy/hypo-kalkulacka"),
    ("bonusy-investicna-kalkulacka.html", "/bonusy/investicna-kalkulacka"),
    ("bonusy-mzdova-kalkulacka.html", "/bonusy/mzdova-kalkulacka"),
    ("bonusy-uverova-kalkulacka.html", "/bonusy/uverova-kalkulacka"),
    ("bonusy-rentova-kalkulacka.html", "/bonusy/rentova-kalkulacka"),
    ("bonusy-investicny-byt.html", "/bonusy/investicny-byt"),
    ("bonusy-etf-semafor.html", "/bonusy/etf-semafor"),
    ("bonusy-poplatkovy-rontgen.html", "/bonusy/poplatkovy-rontgen"),
    ("bonusy-bytovy-semafor.html", "/bonusy/bytovy-semafor"),
    ("komunita.html", "/komunita"),
    ("bonusy.html", "/bonusy"),
    ("gdpr.html", "/gdpr"),
    ("404.html", "/404"),
    ("index.html", "/"),
]

ASSET_REPLACEMENTS = [
    ('href="css/', 'href="/css/'),
    ('src="js/', 'src="/js/'),
    ('src="assets/', 'src="/assets/'),
    ('href="assets/', 'href="/assets/'),
    ('content="assets/', 'content="/assets/'),
    ('data-lightbox-src="assets/', 'data-lightbox-src="/assets/'),
]


def rewrite(text: str) -> str:
    for old, new in ASSET_REPLACEMENTS:
        text = text.replace(old, new)
    for old, new in PAGE_REPLACEMENTS:
        text = text.replace(f'href="{old}#', f'href="{new}#')
        text = text.replace(f"href='{old}#", f"href='{new}#")
        text = text.replace(f'href="{old}"', f'href="{new}"')
        text = text.replace(f"href='{old}'", f"href='{new}'")
    return text


changed = 0
for path in ROOT.glob("*.html"):
    if path.name in SKIP:
        continue
    original = path.read_text(encoding="utf-8")
    updated = rewrite(original)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        changed += 1
        print("updated", path.name)

print(f"done, {changed} files")
