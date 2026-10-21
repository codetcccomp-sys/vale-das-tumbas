#!/bin/bash
# Roda todos os testes da versão 2D: lógica (Node, sem navegador) e navegador (Playwright + Chromium sem janela).
# Termina com erro se qualquer verificação falhar.
cd "$(dirname "$0")/.."
export NODE_PATH="${NODE_PATH:-$(npm root -g 2>/dev/null)}"
mkdir -p test/shots
falhou=0
for f in test/l[0-9]*.js test/b[0-9]*.js; do
  echo "================ $f"
  timeout 600 node "$f" || falhou=1
done
if [ $falhou = 1 ]; then echo "ALGUM TESTE FALHOU"; exit 1; fi
echo "TODOS OS TESTES PASSARAM"
