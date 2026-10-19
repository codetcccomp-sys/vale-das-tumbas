#!/bin/bash
# Gera o jogo 2D num arquivo HTML único (sem dependências externas: roda sem internet).
#   build/vale-das-tumbas-2d.html        versão pública (é a que vai para o site): sem o gancho de teste
#   build/teste/vale-das-tumbas-2d.html  versão de testes: igual, mais o gancho #vt usado pelos testes automáticos
set -e
cd "$(dirname "$0")"
mkdir -p build build/teste
ARQS="01-core.js 02-lang.js 03-learn.js 04-save.js 05-audio.js 06-input.js 07-pixel.js 08-sprites.js 08b-heroi.js 09-tiles.js 10-objetos.js 11-render.js 12-mapa.js 13-painel.js 13b-guia.js 13c-relatorio.js 14-vale.js 14b-treino.js 14c-ambiente.js 15-tumbas.js 16-steam.js 17-diesel.js 18-atom.js 19-bio.js 20-city.js 20b-camara.js 20c-bossarte.js 21-segredos.js 22-game.js"
montar(){ # $1 = js de saída, $2 = arquivos extras
  : > "$1"
  for f in $ARQS $2; do [ -f "src/$f" ] && { cat "src/$f"; echo; } >> "$1"; done
  echo 'boot();' >> "$1"
  node --check "$1"
}
html(){ { cat src/00-head.html; echo '<script>'; cat "$1"; echo '</script>'; echo '</body></html>'; } > "$2"; }
montar build/all.js ""
montar build/teste/all.js "23-teste.js"
html build/all.js build/vale-das-tumbas-2d.html
html build/teste/all.js build/teste/vale-das-tumbas-2d.html
# a versão pública não pode levar o gancho de teste
if grep -q "function ganchoTeste\|window.__vt=" build/vale-das-tumbas-2d.html; then echo "ERRO: gancho de teste na versão pública"; exit 1; fi
wc -c build/vale-das-tumbas-2d.html build/teste/vale-das-tumbas-2d.html
