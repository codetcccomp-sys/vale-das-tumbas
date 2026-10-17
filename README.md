# Vale das Tumbas

Jogo 3D de exploração e aventura feito com JavaScript e three.js. Um explorador cruza um vale no deserto e entra em quatro tumbas
de eras diferentes (Engrenagens, Motores, Reator e Viva). Lá dentro, resolve enigmas e recolhe relíquias que abrem a Cidade-Jardim.
Tudo é desenhado e sintetizado por código: não há imagens nem sons externos.

## Jogar
- **Arquivo único, sem internet:** rode `./build.sh && ./build-offline.sh` e abra `build/vale-das-tumbas.html` no navegador
  do computador ou do celular. O three.js vai embutido; as fontes vêm do Google Fonts e, sem internet, o navegador usa fontes parecidas.
- **Versão leve:** `./build.sh` gera `build/index.html`, que carrega o three.js de um CDN.
- No celular, aberto direto no navegador, o menu de pausa e a tela inicial mostram o botão **Tela cheia** (ele só aparece
  quando a página permite).

### Publicação na Vercel
O `vercel.json` manda a Vercel gerar o jogo a cada push: ela roda `build.sh` e `build-offline.sh` e publica o arquivo único
como `index.html` (pasta `public/`, que não vai para o git). Push em `main` publica em produção
(`vale-das-tumbas.vercel.app`); outros ramos geram uma prévia.

Controles: no toque, joystick à esquerda e arrastar à direita. No teclado, W A S D, mouse, Espaço, Shift, E, T, J e M.
Controle de videogame também funciona. O jogo salva sozinho no navegador.

## Estrutura
Os arquivos de `src/` são concatenados nesta ordem pelo `build.sh`:

| Arquivo | O que tem |
|---|---|
| `00-head.html` | título, estilos (CSS) e a interface: HUD, menus, diário, tela FIM, dica das zonas de toque |
| `01-core.js` | textos (`TXT`), renderizador, materiais, partículas, áudio, leitura do salvamento, controles (toque, teclado, controle) |
| `02-physics.js` | estado do jogo (`G`), colisões, jogador, câmera |
| `03-chars.js` | o Explorador e os guardiões (Autômato, Robô-vigia, Robô atômico, Clone) |
| `04-vale.js` | o Vale: céu, dia e noite, terreno, acampamento, oásis, estrada, ruínas, inscrições, torres, porta final, linhas das trilhas |
| `04b-dressing.js` | vegetação e estruturas extras do Vale |
| `04c-trails.js` | trilhas até as tumbas, marcos de pedra com fita da cor da era, placas na estrada |
| `05-tomb.js` … `05d-bio.js` | as quatro tumbas |
| `05e-city.js` | a Cidade-Jardim e a cena final |
| `05f-secrets.js` | os 12 segredos do Vale e o mapa do diário |
| `06-game.js` | diário, avisos, bordas perigosas, sombra de pouso, objetivo, transições, vida, pontos de controle, salvamento, telas, laço principal |

Textos fáceis de editar: `TXT` em `01-core.js` (inclui as causas de queda e de dano em `TXT.fall` e `TXT.hit`),
`ENTRIES` em `06-game.js` (diário), `INSC` em `04-vale.js` (inscrições noturnas) e `SEC_ENTRIES` em `05f-secrets.js`.

`vendor/three.min.js` é o three.js r149 (licença MIT), usado pelo build offline e pelos testes.

## Testes automáticos
Precisam de `node`, do pacote `playwright` e de um Chromium: `npm install` e depois `npx playwright install chromium`.
`npm test` gera o jogo e roda `test/rodar.sh`, que termina com erro se qualquer verificação falhar.
Os testes abrem `build/index.html#vt`; o `#vt` liga um gancho de teste (`window.__vt`) que não existe no jogo normal.

| Arquivo | O que confere |
|---|---|
| `v1-camera.js` | caso da parede (x=8,62, z=-50); câmera fora de colisores e abaixo do teto nas 5 áreas; visibilidade do personagem; transparência gradual; olhar sobre o vão; recuperação da distância; câmera ao renascer |
| `v2-checkpoint.js` | ativar, sair, voltar, reusar e cair em todas as tumbas; retorno seguro de todos os pontos de energia |
| `v2-angulos.js` | `wrapPi()` em tempo constante: ângulos comuns, limites em ±π, voltas inteiras, simetria, valores extremos (±1e20, ±1e300), entradas não numéricas e infinitas; saves com direção estragada carregam rápido e preservam o progresso. Roda a função num `vm` do Node com limite de tempo e vigia o navegador, então um travamento reprova em vez de prender o teste |
| `v2-save.js` | saves válidos antigos, campos estragados recuperados, lixo recusado, save dentro de tumba, mensagens |
| `v3-avisos.js` | avisos repetidos, limite, prioridade, tempo de leitura, causa de cada falha, porta bloqueada, bordas, sombra, objetivo |
| `v4-celular.js` | HUD sem sobreposição em 6 tamanhos de tela (em pé e deitado, até 300 px), textos legíveis, três dedos ao mesmo tempo, instruções por entrada |
| `v4-resolucao.js` | lado menor da imagem ≥ 720 px no modo normal (ou o que a tela tiver), ajuste automático que desce só até esse piso e volta a subir, modo leve em ~540 px |
| `v4-orientacao.js` | percorre cada trilha andando até a porta; placas, marcos, mapa, feixes e bússola |
| `v6-final.js` | tampas do teto recolhendo para dentro das paredes; câmera da cena final entre as paredes, a 12-24 m da árvore, com explorador e árvore no quadro e acima do texto (em pé e deitado) |
| `v5-regressao.js` | roda os roteiros de `test/exploratorios/` que resolvem as tumbas e confere os resultados |

`test/exploratorios/` guarda roteiros antigos que só imprimem o que acontece; servem para investigar.
