#!/bin/bash
# Gera build/vale-das-tumbas.html: um arquivo só, que roda sem internet (o three.js vai embutido).
# Precisa de build/all.js (rode ./build.sh antes) e de vendor/three.min.js.
set -e
cd "$(dirname "$0")"
OUT=build/vale-das-tumbas.html
{
  echo '<!doctype html>'
  echo '<html lang="pt-BR"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo '</head><body>'
  grep -v 'cdn.jsdelivr.net/npm/three' src/00-head.html | grep -v 'claude:viewport-fit-sides'
  echo '<script>/* three.js r149, licença MIT (c) 2010-2023 three.js authors */'
  cat vendor/three.min.js
  echo '</script>'
  echo '<script>'
  cat build/all.js
  echo '</script>'
  echo '</body></html>'
} > "$OUT"
wc -c "$OUT"
