#!/usr/bin/env bash
# Nasadenie novej hlavnej stránky: nova.html (výstup build9.py v zdrojoch Downloads/jsmentor-nova-v9/_zdroj) -> index.html bez noindex + canonical.
# Použitie: _build/deploy-home.sh cesta/k/nova.html   (potom git add index.html && git commit && git push origin main)
set -euo pipefail
SRC="${1:?cesta k nova.html}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
python3 - "$SRC" "$HERE/index.html" <<'PY'
import sys, pathlib
s = pathlib.Path(sys.argv[1]).read_text(encoding="utf-8")
s = s.replace('    <meta name="robots" content="noindex, nofollow, noarchive" />\n', '', 1)
s = s.replace('    <meta name="googlebot" content="noindex, nofollow, noarchive" />\n', '    <link rel="canonical" href="https://www.jsmentor.sk/" />\n', 1)
assert "noindex" not in s and 'rel="canonical"' in s
pathlib.Path(sys.argv[2]).write_text(s, encoding="utf-8")
print("index.html aktualizovaný z", sys.argv[1])
PY
