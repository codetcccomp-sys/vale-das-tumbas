#!/bin/bash
# Roda todas as verificações com asserção (test/v*.js) contra build/index.html.
# Cada arquivo imprime "ok"/"FALHA" por condição e sai com código 1 se alguma falhar.
# Este script termina com código 1 se qualquer arquivo falhar.
# Precisa de node e do pacote playwright com um Chromium (ver LEIA-ME.md).
cd "$(dirname "$0")/.."
falhas=()
for t in test/v*.js; do
  echo "================ $t"
  if ! node "$t"; then falhas+=("$t"); fi
done
echo
if [ ${#falhas[@]} -eq 0 ]; then echo "TUDO CERTO: todas as verificações passaram."; exit 0
else echo "FALHARAM: ${falhas[*]}"; exit 1; fi
