# Vale das Tumbas 2D

Aventura em pixel art vista de cima, no estilo dos RPGs de 16 bits, para quem está começando em lógica de programação.
De proteção de cabeça com óculos, roupa ocre e dourada e uma bengala alta, o personagem cruza o vale, entra em quatro tumbas e recupera os conhecimentos de uma civilização que controlava máquinas,
geradores, portais e organismos artificiais com instruções, dados e regras lógicas. Cada relíquia é um saber: só desperta
quando o jogador monta, executa e corrige programas que fazem o mecanismo da sala funcionar.

A versão 3D continua separada, na raiz do repositório, e não foi alterada.

## Jogar
- **Arquivo único:** rode `./build.sh` e abra `build/vale-das-tumbas-2d.html` no navegador do computador ou do celular. Tudo vai
  dentro do arquivo (sem imagens, sons nem bibliotecas externas, sem WebGL): funciona sem internet.
- **Controles:** no celular, joystick à esquerda (empurrado até o fim, corre) e o botão AÇÃO à direita; LUZ liga a lanterna nas
  tumbas. No teclado, WASD ou setas, Shift corre, E / Espaço / Enter interage, T lanterna, J diário, Esc pausa.
  Controle de videogame: analógico anda, A interage, Y lanterna, X diário, Start pausa.
- O jogo salva sozinho no navegador.

## Progressão educativa
Instruções → Dados e variáveis → Decisões → Repetições e automação → tudo junto. Cada tumba só abre depois do saber da anterior,
e o objetivo no alto da tela sempre mostra a próxima etapa de aprendizagem.

| Tumba | Saber (relíquia) | Mecanismo | Etapas |
|---|---|---|---|
| Engrenagens (Steampunk) | Sequência (Engrenagem-mestra) | Computador Ancestral: placas AVANÇAR, VIRAR À DIREITA e ATIVAR movem um autômato no tabuleiro | demonstração (mesmas placas em outra ordem), prática guiada, percurso novo |
| Motores (Dieselpunk) | Dados e variáveis (Vela de ignição) | contêineres com nome, tipo e valor ligados à separadora e ao monta-cargas | demonstração, reconhecer tipos, atribuir, consultar, mudar o valor, configuração nova |
| Reator (Atompunk) | Decisões (Núcleo atômico) | sensores de energia e de nível; comporta, carregador, portão, dreno | demonstração em duas situações, prática guiada (A e B), aplicação com variável e três situações |
| Viva (Biopunk) | Repetições e automação (Semente da vida) | trilho com organismos e o polinizador | demonstração, REPETIR guiado, REPETIR em padrão novo, ENQUANTO guiado (0, 1 e várias voltas), automação |
| Cidade-Jardim | tudo junto | robô jardineiro, cinco canteiros e a fonte | sequência + contador + decisão + repetição em dois jardins |

### A linguagem do jogo
- Tipos: inteiro (`int`) `5`, decimal (`float`) `3.14`, texto (`str`) `"ABRIR"`, booleano (`bool`) `True`/`False`.
- Cada contêiner aceita um tipo só; nada é convertido sozinho: `"5"` não entra num contêiner de inteiro, e `5` não entra num de
  decimal (escreve-se `5.0`). Comparar número com texto é erro, não um Falso escondido.
- Variável sem valor aparece como **vazio**, diferente de `0` e de `False`; ler uma variável vazia é erro explicado.
- `=` guarda (atribuição); `==` compara. Soma só com a conta escrita (`quantidade = quantidade + 3`).
- Decimais aparecem com até 4 casas; o jogo avisa que eles são guardados de forma aproximada.
- Unidades como litros são só etiqueta do objeto: o valor guardado é o número.

### O painel de programação
O mesmo painel em todas as tumbas, com recursos liberados aos poucos. Tudo funciona por toques, sem arrastar:
tocar numa placa da paleta insere no cursor ▸; tocar numa linha a seleciona e abre o editor dela (subir, descer, remover,
escolher valor, condição ou número de voltas). Há **Executar**, **Passo** (uma instrução por toque), **Parar**, **Reiniciar**
(volta o mecanismo ao começo e mantém o programa), **Limpar** (separado, com confirmação), **Dica** (graduais), **Exemplos**
(os já vistos) e a velocidade. Durante a execução, a linha atual fica destacada, os contêineres mostram cada mudança, os
contadores de REPETIR/ENQUANTO aparecem ao lado da linha e o mecanismo da sala se move. Num erro, a execução para na
linha responsável com uma explicação simples. Erros de programação não tiram vida.
Enquanto o painel está aberto, a exploração fica pausada (guardiões, pistões, radiação e lanterna). Ao fechar, a execução
para, o programa fica guardado e os controles voltam ao normal.
Executar e Passo usam o mesmo interpretador (`LANG.passo`); só existe uma execução por vez; repetições têm limite de voltas e o
programa inteiro tem limite de passos, então nada trava o jogo.

## Estrutura
Os arquivos de `src/` são concatenados nesta ordem pelo `build.sh`:

| Arquivo | O que tem |
|---|---|
| `00-head.html` | estilos e interface: HUD, botões de toque, painel de programação, diário, menus, tela final |
| `01-core.js` | utilidades, textos, posições do mundo, relíquias, inscrições, segredos e o diário |
| `02-lang.js` | **interpretador**: valores tipados, expressões, comparações, edição do programa por toques, `passo()`, explicações |
| `03-learn.js` | **aprendizagem**: comandos, os mundos de cada desafio (modelo do mecanismo), as 18 etapas, dicas, saberes |
| `04-save.js` | **salvamento** versionado e migração do save 3D (lógica pura) |
| `05-audio.js` | sons sintetizados (os do 3D e os do painel) |
| `06-input.js` | teclado, toque (joystick e botões) e controle |
| `07-pixel.js` | ferramentas de pixel art: sprites de texto, contorno, círculos, linhas e a fonte de pixels 3×5 |
| `08-sprites.js` | guardiões e autômatos |
| `08b-heroi.js` | **personagem principal**: 4 direções; repouso, caminhada (passos com a bengala), interação e dano; folha de sprites e configuração das animações |
| `09-tiles.js` | tiles de cada tema e paredes em visão 3/4 que se montam sozinhas |
| `10-objetos.js` | objetos do vale (tendas, palmeiras, ruínas de cada era, entradas, pirâmide, ícones dos valores) |
| `11-render.js` | **renderização**: resolução interna, escala inteira, câmera em pixel inteiro, chão em pedaços, luz, partículas |
| `12-mapa.js` | **mapas e colisões**: áreas, colisão nos pés com deslize nas quinas, interação, linha de visão |
| `13-painel.js` | **interface** do painel de programação |
| `14-vale.js` | o vale |
| `15-tumbas.js` | peças comuns das tumbas: pontos de energia, saída, pedestal, terminal, portões, guardiões |
| `16-steam.js` … `20-city.js` | as quatro tumbas e a Cidade-Jardim (mapa, perigos, guardião, mecanismo do desafio) |
| `21-segredos.js` | os 12 segredos e o mapa do diário |
| `22-game.js` | estado, personagem (movimento e quadro de animação), HUD, avisos, diário, transições, menus, salvamento no navegador, laço principal |
| `23-teste.js` | gancho de teste (`window.__vt`), só com `#vt` no endereço |

`recursos/` tem folhas PNG de todos os sprites e tiles, exportadas do código (`node test/ferramentas/exportar-sprites.js`),
entre elas a folha do personagem (`heroi.png`, `heroi_4x.png`) e a configuração das animações (`heroi.json`),
e `capturas/` tem imagens representativas (`node test/ferramentas/capturas.js`).

### Pixels nítidos
O mundo é desenhado num canvas pequeno (cerca de 250 pixels de jogo no lado menor da tela) e ampliado por um fator **inteiro**
para o canvas do tamanho real da tela, sem suavização. A câmera anda em subpixels, mas o desenho usa a posição arredondada:
nada treme nem deforma. Tiles de 16×16, personagem em células de 40×46 (cerca de 32 px de altura, a bengala com 37 px),
contorno escuro de 1 px em tudo.

### Personagem principal
Desenhado a partir da imagem de referência oficial (poses laterais): proteção de cabeça com óculos de lentes verdes sobre o
cabelo preso em coque, roupa ocre e dourada, faixa roxo-azulada no peito, lenço e cartucheira vermelhos, bolsinha, babado
amarelo, botas escuras e a bengala com ponta, anel verde, mecanismo, empunhadura ocre e pé largo. As vistas de frente e de
costas foram criadas com as mesmas proporções; a lateral esquerda é o espelho exato da direita.
- **Folha de sprites:** `recursos/heroi.png` (fundo transparente, células de 40×46, 8 colunas, uma linha por direção e
  animação) e `recursos/heroi.json` (ordem das linhas, âncora, colisão e tempos). O jogo monta os mesmos quadros por código
  (`folhaHeroi()`), então a folha nunca fica diferente do que aparece na tela (há teste para isso).
- **Ponto de referência:** (20, 44) na célula, o centro da linha de contato das botas com o chão; é ele que vai na posição
  do personagem. Em todo quadro pelo menos uma bota está apoiada nessa linha.
- **Animações:** repouso (4 quadros, respiração e reflexo nos óculos), caminhada (8 quadros por ciclo de dois passos; a
  bengala fica apoiada no primeiro passo e é levada à frente no segundo, e a mão acompanha a empunhadura), interação (3
  quadros: a mão livre alcança o objeto na direção em que o personagem olha) e dano (2 quadros com clarão, depois pisca
  enquanto está protegido). A caminhada avança com a distância andada, então não escorrega nem corre à toa.
- **Colisão:** só a caixa dos pés (12×6 px, centrada na referência). A bengala e a cabeça não entram na colisão: o
  personagem passa por portas e corredores de 1 tile.
- **Ordenação visual:** entra na fila de desenho pela linha dos pés, como todo objeto do cenário pela sua base; fica atrás
  do que está mais embaixo na tela e na frente do que está mais em cima.

## Salvamento e migração do 3D
- Chave própria: `vale_das_tumbas_2d` (versão 1). Guarda relíquias, etapas concluídas, programas de cada etapa, diário,
  inscrições, segredos, portas abertas, hora do dia e a posição no vale (dentro de uma tumba, volta à porta dela).
- Na primeira vez, se houver um save do 3D (`vale_das_tumbas_save`) no mesmo navegador, a tela inicial oferece trazê-lo:
  relíquias, diário (todas as 46 anotações do 3D existem no 2D), inscrições, segredos e a hora do dia. As relíquias chegam
  **adormecidas**: a conclusão dos desafios é controlada à parte, então dá para revisitar as tumbas já vencidas no 3D; cada
  relíquia desperta quando o saber da tumba é recuperado. A posição do 3D é convertida (escala 0,4) e levada ao tile livre
  mais próximo. O save do 3D nunca é alterado nem apagado.
- Cada campo é conferido: um campo estragado volta ao valor neutro e o resto do progresso é mantido (com aviso).

## Testes
Precisam de `node` e do pacote `playwright` com o Chromium: `npm install` e `npx playwright install chromium`.
`npm test` gera o jogo e roda `test/rodar.sh`, que termina com erro se qualquer verificação falhar.

| Arquivo | Tipo | O que confere |
|---|---|---|
| `l1-linguagem.js` | lógica (Node) | tipos, `"5"` × `5`, vazio × 0 × False, contas, comparações, SE/SENÃO, REPETIR (0, 1, n), ENQUANTO (0, 1, várias voltas), repetição sem parada e limite de passos sem travar, erro na linha responsável, edição por toques, Executar × Passo, soluções de todas as etapas, soluções alternativas, erros esperados |
| `l2-save.js` | lógica (Node) | migração do 3D (relíquias adormecidas, diário, segredos, posição convertida e segura, save dentro de tumba), save 3D estragado, save 2D ida e volta, save 2D estragado campo a campo |
| `b1-percurso.js` | navegador | o jogo inteiro tocando nos botões: tumbas fora de ordem seladas, cada tumba com seus perigos e todas as etapas montadas pela paleta, relíquias, Cidade-Jardim, final, recarregar e continuar |
| `b2-painel.js` | navegador | Executar e Passo a passo dão os mesmos passos, mundo e variáveis (inclusive com erro); uma execução por vez; Parar; Reiniciar; Limpar com confirmação; dicas graduais; exemplos; limite de linhas; ENQUANTO sem parada; exploração pausada; fechar no meio |
| `b3-save.js` | navegador | migração real a partir do save 3D no `localStorage`, save 3D intacto, relíquia que desperta, save dentro de tumba, save 2D estragado, posição dentro de obstáculo, save ilegível |
| `b4-telas.js` | navegador | 10 tamanhos de tela (em pé, deitado, tablet, computador): escala inteira, HUD e avisos sem sobreposição, botões grandes, textos legíveis, painel inteiro alcançável |
| `b5-perigos.js` | navegador | pistões, placas com e sem olho, Autômato, Robô-vigia e pilares, canal, radiação, bomba, canção errada, derrota, oásis, inscrições, segredos e mapa |
| `b6-personagem.js` | navegador | quadros de todas as direções e animações, linha do chão e altura coerentes, espelho, colisão nos pés, passagem de 1 tile, porta da tumba, atrás/na frente do pilar, transições repouso → caminhada → repouso, interação e dano, folha exportada igual à do jogo |

## Publicar na Vercel (projeto novo, separado do 3D)
O 3D continua no projeto que já existe. Para o 2D, crie **outro projeto** na Vercel apontando para o mesmo repositório:
1. Vercel → *Add New… → Project* → importe `codetcccomp-sys/vale-das-tumbas`.
2. Em **Root Directory**, escolha `2d`. *Framework Preset*: **Other**. Não precisa mudar comandos: o `2d/vercel.json` manda
   rodar `./build.sh` e publicar `public/index.html`.
3. Deploy. O ramo de produção (`main`) publica o endereço principal do projeto; outros ramos geram prévias.

Observação: cada endereço tem o próprio armazenamento no navegador. A migração automática do save 3D só encontra o progresso
quando o 2D roda no mesmo endereço (domínio) em que o 3D foi jogado; em endereços diferentes, o 2D começa do zero.

## O que mudou em relação ao 3D (adaptações)
- **Visão:** de câmera em terceira pessoa para visão de cima em 3/4, com paredes que mostram a face, objetos ordenados pela base e
  luz em degraus. As entradas das tumbas passaram a ficar na face sul, que lê melhor de cima.
- **Pulo:** não existe. Os desafios que dependiam de pular ou de altura foram redesenhados:
  - pistões que eram plataformas sobre um vão agora descem sobre o corredor em ritmo (a luz de aviso continua);
  - o piso de engrenagens virou uma ponte de placas sobre o fosso: as com o olho aguentam, as outras cedem;
  - a água do Reator, que levava plataformas para cima, agora decide se os pontões assentam e formam uma passarela;
  - o elevador de carga dos Motores virou o monta-cargas da oficina, controlado pelos contêineres;
  - as seções de ritmo, luz, água e sequência da Cidade-Jardim viraram placas dos distritos e o desafio final de programação.
- **Holofotes:** o facho é uma linha no chão que para em paredes e pilares; o cone do Robô-vigia também.
- **Relíquias:** agora dependem dos desafios educativos; as trazidas do 3D chegam adormecidas.
- **Escala do vale:** o vale 2D usa as posições do 3D multiplicadas por 0,4 (180 × 180 tiles).
