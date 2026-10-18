# Vale das Tumbas 2D

Aventura em pixel art vista de cima, no estilo dos RPGs de 16 bits, para quem está começando em lógica de programação.
De proteção de cabeça com óculos, roupa ocre e dourada e uma bengala alta, o personagem cruza o vale, entra em quatro tumbas e recupera os conhecimentos de uma civilização que controlava máquinas,
geradores, portais e organismos artificiais com instruções, dados e regras lógicas. Cada relíquia é um saber: só desperta
quando o jogador monta, executa e corrige programas que fazem o mecanismo da sala funcionar.

A versão 3D continua separada, na raiz do repositório, e não foi alterada. O arquivo [`VALIDACAO.md`](VALIDACAO.md) mostra, item por
item, como a análise crítica de 17/10/2026 foi atendida e traz os roteiros de teste em celular real e com estudantes iniciantes.

## Jogar
- **Arquivo único:** rode `./build.sh` e abra `build/vale-das-tumbas-2d.html` no navegador do computador ou do celular. Tudo vai
  dentro do arquivo (sem imagens, sons nem bibliotecas externas, sem WebGL): funciona sem internet.
- **Controles:** no celular, joystick à esquerda (empurrado até o fim, corre) e o botão AÇÃO à direita; LUZ liga a lanterna nas
  tumbas, VER afasta a câmera (vista ampla) e **Guia**, no alto, abre o Guia de Programação. No teclado, WASD ou setas, Shift
  corre, E / Espaço / Enter interage, C vista ampla, G Guia, T lanterna, J diário, Esc pausa.
  Controle de videogame: analógico anda, A interage, Y lanterna, X diário, Select Guia, Start pausa.
- O jogo salva sozinho no navegador.

## Começo: o Pátio de Treino
Um jogo novo começa num pátio curto, antes da primeira tumba, que ensina jogando (sem blocos de texto): o objetivo no alto
mostra um passo por vez (9 passos) — andar até a marca brilhante, conversar com o Lume, afastar a câmera, pegar a manivela,
encaixá-la no terminal, abrir o Guia, abrir o editor, executar o primeiro comando, `acender_tocha()`, e por fim **a ordem
importa**: o programa do portão já vem escrito na ordem errada (`erguer_portao()` antes de `destravar_portao()`); o jogador
faz uma **previsão**, executa, vê o portão travado, lê a explicação e corrige a ordem. A tocha acende, o cadeado abre e o
portão do pátio leva ao vale. Quem já sabe jogar pode pular pelo Lume ("Já sei jogar"); a placa do acampamento leva de volta
ao pátio a qualquer momento (numa visita depois do treino, o portão já está aberto).

## Ajuda ao jogador
- **Lume** — um pequeno autômato-lanterna que fica no pátio, no acampamento e dentro de cada tumba. Explica os controles, como
  interagir, como funciona a programação e como ler um desafio. Não entrega a solução: dá **dicas progressivas** da etapa da
  vez — a 1ª fala do conceito, a 2ª do caminho e a 3ª chega perto da solução. Dá para conversar de novo quantas vezes quiser;
  depois da terceira, ele repete a mais próxima e sugere o Passo a passo. As dicas do Lume e o botão 💡 Dica do painel usam a
  mesma contagem (e ela fica salva).
- **Guia de Programação** — abre a qualquer momento (tela inicial, botão Guia do HUD, tecla G, menu de pausa, botão 📖 Guia do
  painel, da área de erro, da linha selecionada no editor e pelo Lume) e volta para onde estava, sem perder o programa. O
  índice é compacto e agrupado — **Sequência** (comandos, sequência), **Dados** (variáveis, os quatro tipos, regras das
  máquinas, int, float, str, bool), **Decisões** (comparações, if, else, elif), **Repetições** (for, while) e **Ajuda**
  (recuo, tipos de erro, o que o editor aceita, palavras do jogo, seus exemplos) — e o grupo da tumba atual vem marcado
  com ★ e aberto. Cada
  assunto tem ícone, uma frase, um exemplo de código colorido, o resultado (o que acontece) passo a passo e a ligação com o jogo — por
  exemplo `quantidade = 5` ("Uma variável funciona como uma caixa usada para guardar uma informação") e
  `if porta_aberta:` / `    entrar()` ("O comando IF verifica uma condição antes de executar uma ação"). No painel, o Guia já
  abre no assunto do desafio.
- **Área de erro** — quando algo dá errado, uma caixa diz a linha, **de onde vem o problema** e o que fazer, em linguagem
  simples, com um botão **📖 Ver no Guia** que abre o assunto certo sem perder o programa. As origens têm cores próprias:
  - **Erro de Python** (vermelho): SyntaxError (faltou `:`, `=` no lugar de `==`), IndentationError (bloco sem recuo),
    NameError (função ou variável que não existe, ou variável que ainda não recebeu valor), TypeError (`"5" + 1`,
    `5 < "5"`, chamar uma variável como função);
  - **Regra desta máquina, não é erro do Python** (âmbar): o contêiner recusa um tipo. Ex.: *A máquina recusou o valor:
    carga só aceita int (inteiro). O programa tentou guardar "12", que é um texto (str). Em Python, carga = "12" seria
    permitido… mas aqui carga é o contêiner de uma máquina que só funciona com um número inteiro (como a anotação
    carga: int)*. Também: sensores só de leitura, a variável do for, nomes que não são contêineres da sala;
  - **O Python tem, o editor do jogo não**: `print`, listas, `def`, `and`/`or`, `*` e `/`, `range(2, 5)`, `5,5`…;
  - **Linha que não faz nada**: `x == 5` sozinho, uma função sem parênteses;
  - **O mecanismo não conseguiu** e **Objetivo ainda não alcançado** (azul): o programa rodou, mas a máquina não
    funcionou ou não chegou ao resultado — sem culpar uma linha quando o problema é o que faltou;
  - **Limite de segurança do jogo**: um while que não para é interrompido (o Python rodaria para sempre).
- **Previsão** — nas etapas em que o código já vem escrito (corrigir e o portão do treino), antes da primeira tentativa o
  painel pergunta o que vai acontecer; no fim da tentativa, confere ("você acertou" ou "o resultado foi outro"). Dá para pular.
- **Alvo da etapa e nome dos objetos** — o próximo objeto a usar tem um marcador com símbolo, texto curto e cor (◆ Programe
  aqui, ◆ Manivela, ◆ Tumba das Engrenagens); ao chegar perto de algo, o nome dele aparece em cima. Quando o explorador
  encobre um obstáculo, o obstáculo aparece por cima, semitransparente e com contorno; atrás de uma coluna alta, o contorno
  do explorador aparece por cima dela.

## Progressão educativa
Primeiro comando → sequência e lógica de execução → variáveis e tipos → if, elif e else → for e while → tudo junto. Cada tumba
só abre depois do saber da anterior, e o objetivo no alto da tela sempre mostra a próxima etapa. Em todas as etapas o ciclo é
o mesmo: **programar → executar → observar → corrigir**. Não há múltipla escolha: o jogador escreve (ou monta por toques),
completa, reorganiza ou corrige código, e o código mexe no cenário. São 25 etapas. Cada tumba tem os três momentos —
**demonstração**, **prática com ajuda** e um **desafio independente** (aplicação, sem guia, numa situação nova) — e o jogo
confere o resultado no mecanismo, não uma resposta única: soluções alternativas que cumprem as regras são aceitas.

| Lugar | Saber (relíquia) | O código controla… | Etapas |
|---|---|---|---|
| Pátio de Treino | primeiro comando e ordem | `acender_tocha()` acende a tocha; `destravar_portao()` e `erguer_portao()` abrem o portão | prática guiada, **corrigir** a ordem (com previsão) |
| Engrenagens (Steampunk) | Sequência e execução (Engrenagem-mestra) | `avancar()`, `virar_direita()` e `ativar()` movem o autômato e abrem o mecanismo | demonstração (mesmas linhas em outra ordem), prática guiada, **corrigir** (o autômato bate: mudar a ordem), percurso novo |
| Motores (Dieselpunk) | Variáveis e tipos int, float, str, bool (Vela de ignição) | `energia = True` liga o gerador, `combustivel = 2.5` enche o tanque, `pecas = 5` ajusta o contador, `senha = "ABRIR"` destrava a porta; a separadora, o monta-cargas e a bomba leem as variáveis | demonstração, os quatro tipos, `5` ou `"5"`, a máquina lê a variável, mudar o valor, **corrigir** a ficha do monta-cargas, **aplicação**: a bomba enche dois tanques (2,5 L e 4,0 L) — guardar, usar e alterar `energia` e `combustivel` |
| Reator (Atompunk) | if, elif e else (Núcleo atômico) | sensores de energia, nível e temperatura; comporta, carregador, portão, dreno, jatos de resfriamento, ventilador e luz de estabilidade | demonstração em duas situações, if/else guiado (A e B), aplicação com variável e três situações, elif guiado (três temperaturas), **corrigir** a ordem dos elif |
| Viva (Biopunk) | for e while (Semente da vida) | `for i in range(4): acender_tocha()` acende quatro tochas de seiva, uma depois da outra; o polinizador rega os organismos | **demonstração** (as mesmas 4 tochas com 4 linhas e com for), for das tochas (painel de 2 linhas), for guiado, **corrigir** o padrão, while guiado (0, 1 e várias voltas), automação com while dentro do for |
| Cidade-Jardim | tudo junto | robô jardineiro, cinco canteiros e a fonte | variável contadora + for + if em dois jardins |

Cada etapa concluída também acende uma tocha de progresso na sala da tumba, e o diário guarda, em cada saber, o conceito e o
programa que o próprio jogador escreveu (o da aplicação independente).

### A linguagem do jogo (um pedaço de Python)
- O código aparece e se escreve como em Python: `avancar()`, `quantidade = 5`, `if energia >= 5:`, `elif`, `else:`,
  `for i in range(4):`, `while umidade < 3:`, `not freio`, blocos com 4 espaços de recuo. No painel, o fim de cada bloco
  aparece como um comentário apagado (`# fim do for`), que não conta como linha.
- Tipos do Python: `int` `5`, `float` `2.5`, `str` (o texto, a "string") `"ABRIR"`, `bool` (o booleano) `True`/`False`.
  Nada é convertido sozinho: `"5"` é texto e `5` é número.
- **Regra do jogo, não do Python**: cada variável é o contêiner de uma máquina, com um contrato de tipo (como a anotação
  `quantidade: int`). Em Python, `quantidade = "5"` é permitido; aqui a máquina confere e recusa — e a área de erro diz
  isso com essas palavras. O painel mostra, em cada contêiner, o nome, o tipo que ele aceita e o valor atual.
- Como no Python: `5 == "5"` dá False (o jogo avisa que número e texto nunca são iguais), `5 < "5"` dá TypeError,
  textos se comparam em ordem alfabética, `True`/`False` valem 1/0, e `if x:` com um número ou texto usa a "verdade" do
  valor (0, 0.0 e "" contam como False). `x = 5` com um nome que não é contêiner da sala não cria variável (regra do jogo).
- Variável sem valor aparece como **vazia**, diferente de `0` e de `False`; ler uma variável vazia é NameError, explicado.
- O editor aceita só um pedaço do Python (o Guia mostra qual, em "O que o editor aceita").
- `=` guarda (atribuição); `==` compara. Soma só com a conta escrita (`quantidade = quantidade + 3`).
- No `for`, a variável `i` aparece no painel enquanto ele roda (0, 1, 2…), só para leitura.
- Decimais aparecem com até 4 casas; unidades como litros são só etiqueta do objeto: o valor guardado é o número.

### O painel de programação
O mesmo painel em todas as tumbas, com recursos liberados aos poucos. Há dois jeitos de programar:
- **Por toques**, sem arrastar: tocar numa linha da paleta (`avancar()`, `variável = valor`, `if`, `if … else`, `elif`,
  `for … in range(n)`, `while`) escreve no cursor ▸; tocar numa linha a seleciona e abre o editor dela (subir, descer,
  remover, escolher o valor, a condição, o número de voltas, `+ elif`, `+ else`).
- **✎ Escrever**: o mesmo programa num campo de texto, para digitar Python de verdade (Tab escreve 4 espaços). Ao executar ou
  tocar em ✔ Pronto, o texto é lido; com erro, a área de erro aponta a linha e explica.

Botões: **▶ Executar** (uma tentativa inteira), **⏭ Passo** (uma instrução por toque; na última, o resultado já aparece no
mesmo toque), **Parar**, **↺ Reiniciar** (nova tentativa: o mecanismo volta ao começo e o programa fica), **💡 Dica** (as três
dicas do Lume), **📖 Guia**, **✎ Escrever**, **Limpar** (com confirmação; nas etapas de corrigir vira **↺ Código original**)
e a velocidade. Durante a execução, a instrução atual fica destacada no código e um anel pulsante marca na sala o mecanismo
que ela mexeu (vermelho quando dá erro); a variável que mudou mostra antes → depois (`vazia → 5`); a condição aparece com
os valores (`65 >= 80 é False`) e o `for`/`while` com o contador de voltas. Erros de programação não tiram vida.
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
| `02-lang.js` | **interpretador** (um pedaço de Python): valores tipados, expressões, comparações, if/elif/else, for/while, edição por toques, leitor de texto (`ler`), `passo()`, explicação dos erros com o nome do Python |
| `03-learn.js` | **aprendizagem**: funções, os mundos de cada desafio (modelo do mecanismo), as 22 etapas, as três dicas de cada uma, saberes |
| `04-save.js` | **salvamento** versionado e migração do save 3D (lógica pura) |
| `05-audio.js` | sons sintetizados: os do 3D, os do painel e os ambientes (pássaros de dia, grilos à noite, vento, fogo, água, gotas e rangidos nas tumbas) |
| `06-input.js` | teclado, toque (joystick e botões) e controle |
| `07-pixel.js` | ferramentas de pixel art: sprites de texto, contorno, círculos, linhas e a fonte de pixels 3×5 |
| `08-sprites.js` | guardiões e autômatos |
| `08b-heroi.js` | **personagem principal**: 4 direções; repouso, caminhada (passos com a bengala), interação e dano; folha de sprites e configuração das animações |
| `09-tiles.js` | tiles de cada tema e paredes em visão 3/4 que se montam sozinhas |
| `10-objetos.js` | objetos do vale (tendas, palmeiras, ruínas de cada era, entradas, pirâmide, ícones dos valores) |
| `11-render.js` | **renderização**: resolução interna, escala inteira, câmera em pixel inteiro, chão em pedaços, luz, partículas |
| `12-mapa.js` | **mapas e colisões**: áreas, colisão nos pés com deslize nas quinas, interação, linha de visão |
| `13-painel.js` | **interface** do painel de programação: linhas em Python, editor por toques, modo Escrever, área de erro, dicas |
| `13b-guia.js` | **Guia de Programação**, conversas e dicas do **Lume**, vista ampla |
| `14-vale.js` | o vale |
| `14b-treino.js` | o **Pátio de Treino** (tutorial jogável) |
| `14c-ambiente.js` | **ambientação** do vale: leito seco e ponte, acácias, braseiros, arcos e muros caídos, acampamento de caravana, pontos de interesse, poeira, vaga-lumes, brasas, folhas, névoa da manhã |
| `15-tumbas.js` | peças comuns das tumbas: pontos de energia, saída, pedestal, terminal, portões, guardiões |
| `16-steam.js` … `20-city.js` | as quatro tumbas e a Cidade-Jardim (mapa, perigos, guardião, mecanismo do desafio) |
| `21-segredos.js` | os 12 segredos e o mapa do diário |
| `22-game.js` | estado, personagem (movimento e quadro de animação), HUD, avisos, diário, transições, menus, salvamento no navegador, laço principal |
| `23-teste.js` | gancho de teste (`window.__vt`), só com `#vt` no endereço (`#vt-treino` mantém o treino no jogo novo) |

`recursos/` tem folhas PNG de todos os sprites e tiles, exportadas do código (`node test/ferramentas/exportar-sprites.js`),
entre elas a folha do personagem (`heroi.png`, `heroi_4x.png`), a configuração das animações (`heroi.json`) e a folha do
Lume, das tochas, do treino, da ambientação do vale e das máquinas que reagem ao código (`ambiente_e_ajuda.png`), e
`capturas/` tem imagens representativas (`node test/ferramentas/capturas.js`). Com `#vt-treino` no endereço, os testes fazem o
treino; com `#vt`, um jogo novo vai direto ao vale.

### Ambientação e desempenho
O vale ganhou um leito de rio seco com ponte de tábuas, acácias e arbustos, braseiros acesos ao longo da Estrada das Eras,
estátua de engenheira, arcos e muros caídos, colunas, carroça quebrada, poço, observatório em ruínas e um acampamento de
caravana com fogueira. Cada entrada de tumba tem a sua marca: torre e materiais da era, feixe de luz e um emblema com o
símbolo do saber (engrenagem, vela de ignição, átomo, folha) iluminado na cor da tumba. Seis **pontos de interesse** entre as tumbas (acampamento, ponte, observatório, estátua, poço, carroça)
podem ser examinados e entram no diário, cada um com uma ideia de programação. Há sombras sob os objetos, poeira ao vento,
vaga-lumes à noite, brasas, folhas, névoa pela manhã e sons naturais que mudam com a hora e o lugar. Tudo é desenhado por
código; o cenário estático fica em cache no chão em pedaços, e um quadro do vale leva cerca de 1,6 ms no Chromium de teste.

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
- Chave própria: `vale_das_tumbas_2d` (versão 1, revisão 3). Guarda relíquias, etapas concluídas, programas de cada etapa,
  diário, inscrições, segredos, portas abertas, hora do dia, a posição no vale (dentro de uma tumba, volta à porta dela), o
  treino, as dicas vistas, os pontos de interesse, se o Guia já foi aberto e o programa que resolveu cada etapa.
- A revisão 3 trouxe três etapas (a ordem no treino, a bomba dos Motores e a demonstração da Viva): quem já tinha terminado
  o treino, completado os Motores ou começado a Viva as recebe concluídas — nenhum progresso volta.
- O jogo salva sozinho e também ao sair para outro aplicativo; se o navegador não deixa guardar (janela privada,
  armazenamento bloqueado ou cheio), o jogo segue normalmente e avisa que o progresso se perde ao fechar.
- Um save de antes desta revisão continua valendo: quem já tinha concluído uma tumba ganha as etapas novas dela como
  concluídas (o progresso não volta) e não precisa fazer o treino.
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
| `l1-linguagem.js` | lógica (Node) | tipos int/float/str/bool com os nomes do Python, comparações como no Python (5 == "5" é False com aviso, 5 < "5" é TypeError, textos em ordem, bool como 0/1, verdade de números e textos), a recusa do contêiner como regra da máquina (não TypeError), a origem de cada erro escrito (Python, o que o editor não tem, regra da máquina, linha sem efeito), o fim do Passo a passo, `"5"` × `5`, vazio × 0 × False, contas, comparações, `not`, if/elif/else (só o primeiro caminho verdadeiro), for com `i` (0, 1, n voltas), while (0, 1, várias voltas), repetição sem parada e limite de passos sem travar, erro na linha responsável, exibição em Python, leitor de texto e seus erros (SyntaxError, IndentationError, NameError, TypeError), edição por toques, Executar × Passo, soluções de todas as 25 etapas e soluções alternativas, previsão nas etapas com código pronto, demonstração/prática/aplicação em cada tumba, código inicial das etapas de corrigir falhando, três dicas por etapa |
| `l2-save.js` | lógica (Node) | migração do 3D (relíquias adormecidas, diário, segredos, posição convertida e segura, save dentro de tumba), save 3D estragado, save 2D ida e volta, save 2D estragado campo a campo, revisão 2 (treino, dicas, pontos de interesse) e save antigo ganhando as etapas novas |
| `b1-percurso.js` | navegador | o jogo inteiro como um jogador: treino (andar, Lume, vista ampla, manivela, Guia, editor, primeiro comando, previsão e correção da ordem do portão), tumbas fora de ordem seladas, cada tumba com seus perigos e todas as 25 etapas — montadas por toques, escritas no modo Escrever e corrigidas a partir da área de erro —, a bomba dos Motores, a demonstração da Viva, máquinas e tochas reagindo ao código, **recarregar a página depois de cada tumba** (etapas, relíquias e programas voltam), o diário com o programa do jogador, Cidade-Jardim, final, recarregar e continuar |
| `b2-painel.js` | navegador | Executar e Passo a passo dão os mesmos passos, mundo e variáveis (inclusive com erro); uma execução por vez; Parar; Reiniciar; Limpar com confirmação; dicas do Lume em três níveis e recapitulação; Guia aberto do painel e de volta; limite de linhas; while sem parada explicado; exploração pausada; fechar no meio |
| `b3-save.js` | navegador | migração real a partir do save 3D no `localStorage`, save 3D intacto, relíquia que desperta, save dentro de tumba, save 2D estragado, posição dentro de obstáculo, save ilegível |
| `b4-telas.js` | navegador | 10 tamanhos de tela (em pé, deitado, tablet, computador): escala inteira, HUD (com Guia) e avisos sem sobreposição, botão VER livre, botões grandes, textos legíveis, painel inteiro alcançável, área de erro inteira acima dos botões fixos |
| `b5-perigos.js` | navegador | pistões, placas com e sem olho, Autômato, Robô-vigia e pilares, canal, radiação, bomba, canção errada, derrota, oásis, inscrições, segredos e mapa |
| `b8-leitura.js` | navegador | alvo da etapa com símbolo e texto, nome do objeto ao alcance, obstáculo e explorador encobertos em contorno, terminal com silhueta própria, caminho livre da manivela ao terminal, pontos do treino alcançáveis a pé, todas as caixas de colisão dentro do desenho (todas as áreas) |
| `b9-validacoes.js` | navegador | armazenamento bloqueado (aviso e jogo seguindo), sair para outro aplicativo e voltar (pausa e salva), teclado virtual simulado (painel, código e Executar acima dele), sem rolagem horizontal |
| `b6-personagem.js` | navegador | quadros de todas as direções e animações, linha do chão e altura coerentes, espelho, colisão nos pés, passagem de 1 tile, porta da tumba, atrás/na frente do pilar, transições repouso → caminhada → repouso, interação e dano, folha exportada igual à do jogo |
| `b7-ajuda.js` | navegador | Guia na tela inicial, no HUD, na tecla G, na pausa e no painel (os dez assuntos com exemplo); pular e revisitar o treino; vista ampla na tecla C; Lume no acampamento e na tumba com dicas em ordem que não entregam o programa; pontos de interesse no diário; Reiniciar depois de um erro; a área de erro diz a origem (Python, regra da máquina, o que o editor não tem) e leva ao assunto do Guia em um toque, sem perder o programa; Passo a passo que mostra o resultado na última instrução e marca o mecanismo afetado |

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
