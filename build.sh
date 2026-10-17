#!/bin/bash
set -e
cd "$(dirname "$0")"
mkdir -p build
cat src/01-core.js src/02-physics.js src/03-chars.js src/04-vale.js src/04b-dressing.js src/04c-trails.js src/05-tomb.js src/05b-diesel.js src/05c-atom.js src/05d-bio.js src/05e-city.js src/05f-secrets.js src/06-game.js > build/all.js
node --check build/all.js
{ cat src/00-head.html; echo '<script>'; cat build/all.js; echo '</script>'; } > build/index.html
wc -c build/index.html build/all.js
