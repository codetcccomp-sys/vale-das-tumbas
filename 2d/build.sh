#!/bin/bash
# Gera o jogo 2D num arquivo HTML único (sem dependências externas: roda sem internet).
set -e
cd "$(dirname "$0")"
mkdir -p build
ARQS="01-core.js 02-lang.js 03-learn.js 04-save.js 05-audio.js 06-input.js 07-pixel.js 08-sprites.js 08b-heroi.js 09-tiles.js 10-objetos.js 11-render.js 12-mapa.js 13-painel.js 14-vale.js 15-tumbas.js 16-steam.js 17-diesel.js 18-atom.js 19-bio.js 20-city.js 21-segredos.js 22-game.js 23-teste.js"
: > build/all.js
for f in $ARQS; do [ -f "src/$f" ] && { cat "src/$f"; echo; } >> build/all.js; done
echo 'boot();' >> build/all.js
node --check build/all.js
{ cat src/00-head.html; echo '<script>'; cat build/all.js; echo '</script>'; echo '</body></html>'; } > build/vale-das-tumbas-2d.html
wc -c build/vale-das-tumbas-2d.html
