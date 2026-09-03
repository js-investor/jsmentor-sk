#!/usr/bin/env bash
# Zostaví React aplikáciu /bonusy + /komunita (repo js-investor/jsmentor.sk-stary) a skopíruje ju do tohto webu.
# Použitie: _build/build-bonusy-app.sh [cesta-k-react-repu]   (predvolene ../jsmentor.sk-stary)
#
# Výsledok: assets/app/* (JS, CSS, fonty, obrázky s hashom) + aktualizované názvy bundle súborov v bonusy.html a komunita.html.
# Shelly (meta, Cookiebot, Umami, most pre odkazy mimo aplikácie) ostávajú, menia sa len hashe.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$HERE/../jsmentor.sk-stary}"
OUT="$(mktemp -d)"

( cd "$SRC" && npm ci --no-audit --no-fund >/dev/null && npx vite build --outDir "$OUT" --assetsDir assets/app --emptyOutDir )

rm -rf "$HERE/assets/app"
cp -R "$OUT/assets/app" "$HERE/assets/app"

JS="$(basename "$(ls "$OUT"/assets/app/index-*.js)")"
CSS="$(basename "$(ls "$OUT"/assets/app/index-*.css)")"

for SHELL in "$HERE/bonusy.html" "$HERE/komunita.html"; do
python3 - "$SHELL" "$JS" "$CSS" <<'PY'
import re, sys
p, js, css = sys.argv[1:]
s = open(p, encoding="utf-8").read()
s = re.sub(r'/assets/app/index-[^"]+\.js', '/assets/app/' + js, s)
s = re.sub(r'/assets/app/index-[^"]+\.css', '/assets/app/' + css, s)
open(p, "w", encoding="utf-8").write(s)
PY
done

echo "Hotovo: assets/app + bonusy.html + komunita.html -> $JS, $CSS"
