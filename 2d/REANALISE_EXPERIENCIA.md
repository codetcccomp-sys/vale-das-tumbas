# Vale das Tumbas 2D — Reanálise completa de experiência
Data: 18/10/2026 · Versão analisada: commit 49a546a (no ar em https://vale-das-tumbas-2d.vercel.app)
Evidências: `capturas/R-reanalise-evidencias.png` (quatro problemas principais) e `capturas/F-celular-antes-depois.png`.

## 1. Parecer
O jogo está completo do treino ao final e a progressão educativa funciona: as 25 etapas foram jogadas de ponta a
ponta (programar → executar → errar → corrigir), com salvamento e recarga depois de cada tumba. Os problemas que
restam são, na maior parte, de **espaço na tela do celular**, e não de conteúdo:

- no modo **Escrever**, com a área de erro aberta, o código fica coberto pela paleta e pelos botões;
- o **enunciado** de 24 das 25 etapas aparece cortado;
- com o celular **deitado**, ou num celular pequeno, a área do programa sai da tela;
- os **rótulos do cenário** (valores, tipos, "aceita/pede", sensores) ficam com cerca de 6 px de altura no celular.

Esses quatro pontos atingem justamente o aparelho-alvo e o momento central do jogo, que é ler o desafio e escrever o
programa. Recomendo corrigi-los antes de qualquer conteúdo novo. Depois vêm o ritmo das tumbas (Motores longa e as
outras três curtas e parecidas) e o teste com pessoas reais.

## 2. O que foi verificado
Tudo no Chromium sem janela, com telas simuladas. **Não** é um celular físico.

| O quê | Como | Resultado |
|---|---|---|
| Percurso completo | O teste `b1-percurso` (95 verificações) com registro de cada aviso, fala, painel, execução, erro e toque | 25 etapas concluídas; 50 execuções, 11 com falha (de propósito, nas etapas de corrigir e nos erros guiados); 190 toques no painel; 52 avisos |
| Telas | 22 telas × 5 aparelhos: 360×740 (celular pequeno), 412×915 (celular), 915×412 (deitado), 820×1180 (tablet) e 1366×768 (computador) | Medidos: alvos de toque, tamanho de fonte, contraste, textos cortados, rolagem lateral, escala dos pixels do jogo |
| Revisão visual | Capturas lado a lado (treino, painéis, tumbas, vale, diário, Guia) | Itens abaixo |
| Caminhos a pé | Busca do menor caminho pela colisão real, do ponto de entrada até cada objeto, à velocidade de caminhada (74 px/s) | Tempos na seção 4.2 |
| Textos | Enunciados, dicas e paleta de cada etapa | Seção 4.2 |

**Não verificado:** aparelho real (toque, teclado virtual, desempenho, bateria); som ouvido de verdade; leitor de
tela; pessoas iniciantes jogando.

## 3. Pontos fortes a preservar
- **Progressão completa e estável:** as 25 etapas, os quatro saberes, as relíquias, a Cidade-Jardim e o final funcionam,
  e o progresso volta depois de recarregar a página.
- **Erros que ensinam:** cada erro diz a linha, a categoria (Python, regra da máquina, mecanismo, objetivo) e o que
  fazer, com atalho para o Guia. No percurso apareceram 10 erros, de 4 categorias.
- **Código que mexe no mundo:** as tochas acendem, a ponte desce e o reator muda de cor, e o Passo a passo mostra isso
  linha por linha.
- **Base de interface sólida:**
  - nenhuma das 110 telas medidas tem rolagem lateral;
  - nenhum alvo de toque tem menos de 24 px;
  - o contraste do texto é adequado (a única exceção está no item P3);
  - em todo o percurso, só um aviso passou de 140 caracteres.
- **Andaime de aprendizagem:** demonstração → prática guiada → corrigir → aplicação em todas as tumbas, com dica em três
  níveis e previsão antes de executar.

## 4. Melhorias prioritárias

### P1 — No modo Escrever, o código fica coberto (celular)
**Observação:** no celular (412 px), com um erro na tela, o campo de código começa em y = 675 px, mas a paleta começa em
704 px e a barra de botões em 763 px. Só **29 px** do código ficam visíveis (foto 1). No celular pequeno, o código fica
quase todo coberto. A paleta e os botões ficam fixos embaixo, e o painel não rola até o código.
**Impacto:** é exatamente quando o jogador precisa ler e corrigir o próprio código que ele não o vê.
**Recomendação:** no modo Escrever, quando o espaço é pouco:
- recolher a área de erro para uma linha, que se abre com um toque;
- recolher "Comandos e variáveis";
- garantir pelo menos 5 linhas visíveis de código acima da paleta.

Teste: o código precisa ficar visível e fora de qualquer sobreposição em 360, 412 e deitado.

### P1 — Enunciado cortado em 24 de 25 etapas
**Observação:** a caixa do enunciado tem altura máxima de 78 px. O texto ocupa até 163 px (412) e 201 px (360). Por
exemplo, a etapa Motores 1 mostra cerca de 40% do texto. Dá para rolar dentro dela, mas não há nenhum sinal disso
(foto 2). Ao mesmo tempo, a área do programa fica com bastante espaço vazio.
**Impacto:** o jogador lê metade da instrução e o resto, que muitas vezes diz o que fazer ("→ Toque em…"), fica
escondido.
**Recomendação:**
- deixar o enunciado crescer até caber, roubando altura da área vazia do programa enquanto ela ainda não tem linhas;
- ou mostrar "▾ ler mais" com uma sombra no corte;
- separar a ação ("→ …") numa linha própria, sempre visível.

### P1 — Celular deitado e celular pequeno: a área do programa sai da tela
**Observação:** deitado (915×412 e 932×430) e no celular pequeno (360×740), a área do programa fica no mínimo de 88 px
(4 linhas), e o painel precisa rolar. Na posição inicial, o programa não aparece; vê-se o enunciado e, logo abaixo, a
paleta (foto 4). O Desafio final (c1), que tem programa mais longo, fica com as mesmas 4 linhas.
**Recomendação:**
- deitado, dividir em duas colunas: enunciado e referência à esquerda, programa à direita, com a paleta e os botões
  numa faixa;
- no pequeno, recolher por padrão as variáveis e "Comandos e variáveis".

Medir de novo com o mesmo roteiro.

### P1 — Rótulos do cenário quase ilegíveis no celular
**Observação:** os rótulos desenhados no cenário usam a fonte de pixel de 5 px. Com a câmera afastada, cada pixel do
jogo vale 1,14 px de tela no celular, então os rótulos ficam com **5,7 px de altura** (6,7 no pequeno; 15 no tablet;
10 no computador). Isso vale para "aceita str · pede ABRIR", os valores das cápsulas, "temperatura 95", "seco/úmido",
os nomes e tipos dos contêineres e "vazio". Muitos desses rótulos são informação necessária ao desafio.
**Recomendação:**
- desenhar esses rótulos na camada de texto do HUD, como já é feito com o marcador do alvo e o nome do objeto, com
  pelo menos 11 px;
- ou ampliar a fonte de pixel para 2× quando a escala for menor que 2.

Os textos decorativos podem continuar em pixel.

### P2 — Entrada das tumbas: herói junto dos botões de toque
**Observação:** na entrada das cinco áreas, o herói fica a 64–104 px do pé da tela, colado no VER. No celular pequeno
fica **coberto pelo VER** nas cinco (foto 3). Os rótulos "Escada para o vale" e "Voltar ao vale" também ficam por
baixo e ao lado dos botões. A câmera já reserva espaço para o HUD em cima, mas não para os botões embaixo.
**Recomendação:**
- reservar embaixo a altura dos botões de toque, como já se faz com o HUD em cima;
- ou trazer o ponto de entrada uma ou duas fileiras para dentro da sala.

### P2 — Ritmo desigual entre as tumbas
**Observação:**

| Área | Etapas | Caminho a pé da entrada ao terminal | Área alcançável |
|---|---|---|---|
| Treino | 2 (mais 9 passos de treino) | — | — |
| Engrenagens | 4 | 7,5 s | 450 tiles |
| Motores | 7, mais o pátio de cápsulas (3 máquinas) | o terminal fica atrás da porta do pátio | 207 tiles antes do pátio |
| Reator | 5 | 3,5 s | 456 tiles |
| Viva | 6 | atrás da canção dos bulbos | 215 tiles antes de abrir |
| Cidade-Jardim | 1 | 1,3 s | 275 tiles |

- Os Motores têm **quatro práticas guiadas seguidas** (d1 a d4); a d1 e a d2 oferecem só uma linha na paleta
  ("variável = valor").
- As Engrenagens, o Reator e a Viva continuam com a planta antiga: entrar, andar poucos segundos, programar e sair.

**Impacto:** a crítica de "salas repetitivas e pequenas" (9.6) continua valendo para três tumbas, e os Motores podem
cansar no meio.
**Recomendação:**
- juntar d3 e d4 numa só etapa, ou transformar uma delas em previsão;
- levar o modelo do pátio (ação no mundo antes do terminal) a mais uma tumba, de preferência o Reator, que já tem o
  canal e as válvulas;
- só depois testar com jogadores.

### P2 — Primeira tumba distante e duas portas seladas no caminho
**Observação:**
- Do acampamento, as tumbas Reator e Viva ficam a cerca de 10–11 s de caminhada, mas estão seladas.
- A primeira tumba (Engrenagens) é a **mais distante**: cerca de 23 s pelo menor caminho.
- A trilha e o objetivo apontam a direção certa, e a seta na borda ajuda.

**Impacto:** é provável que um iniciante tente antes as portas mais próximas e receba "selada" duas vezes logo no
início. Hipótese; precisa de teste com pessoas.
**Recomendação:** observar isso no teste com iniciantes. Se acontecer:
- colocar uma estação de atalho perto das Engrenagens desde o começo;
- ou mostrar na porta selada a seta para a tumba certa ("comece pelas Engrenagens →").

### P2 — Aprender além de imitar: pouca escolha nas práticas guiadas
**Observação:**
- Em 5 das 25 etapas a paleta tem só **uma** linha (t1, d0, d1, d2 e a0), e em várias outras, duas.
- A previsão ("o que vai acontecer?") só aparece nas 5 etapas de corrigir.
- As aplicações têm 3 a 8 linhas na paleta, o que é bom.

**Recomendação:**
- nas práticas guiadas depois da primeira de cada tumba, incluir uma ou duas linhas que não servem (distratores);
- pôr uma previsão também numa prática guiada por tumba.

É barato e mede compreensão, não só imitação.

### P2 — Carga de leitura
**Observação:**
- Os enunciados somam 1.120 palavras nas 25 etapas (média de 45; a maior, Motores 1, com 71).
- No treino, antes da primeira tumba, são 16 avisos com 108 palavras.
- O menu do Lume tem 8 opções na primeira conversa.

**Recomendação:**
- encurtar os enunciados acima de 55 palavras, que são d0, d1, a0, b3 e c1, deixando a explicação longa para o Guia;
- no primeiro encontro com o Lume, mostrar 3 opções (Dica, Como me movo, Pular treino) e "Mais perguntas…".

### P3 — Acabamento de interface (celular)
- **Alvos de toque abaixo dos 44 px recomendados.** Todos estão acima do mínimo de 24 px.
  - Botões de etapa: 34 px.
  - Grupos e assuntos do Guia: 40–42 px.
  - Itens de "Comandos e variáveis": 43 px.
  - Ver a sala e Fechar: 42 px.
  - Controles de volume: 36 px.
  - No celular deitado, os botões Guia, Diário e Pausa: 40 px.
- **Texto de 10–11 px no painel:** 13 a 23 ocorrências por tela de painel. Exemplos: o cabeçalho "Tumba · Prática
  guiada", "aceita bool (booleano)" e "int (inteiro) · agora: 90". Sugestão: 12 px no mínimo.
- **Títulos cortados com reticências** no painel em todos os celulares ("Tumba dos Motores · Pr…", "Etapa 1 · os
  quatro ti…"). Sugestão: duas linhas, ou tirar o nome da tumba quando o HUD já o mostra.
- A etiqueta "novo" do diário tem contraste de 2,8:1 (branco sobre laranja). Precisa de 4,5:1.
- O botão Diário já começa com o ponto de "novo", porque há duas anotações automáticas. Sugestão: marcar só o que o
  jogador descobriu.
- O chip "Lanterna apagada" fica sempre no HUD nas tumbas, ocupando uma linha. Sugestão: mostrar só quando estiver
  acesa, ou como ícone.

## 5. Validações pendentes antes de considerar a versão pronta
1. **Celular real** (Android e iPhone, em pé e deitado), seguindo o roteiro da `VALIDACAO.md` (seção 2), com atenção
   aos quatro itens P1: legibilidade dos rótulos do cenário a um braço de distância, código visível no modo Escrever
   com o teclado aberto, enunciado inteiro e painel deitado.
2. **Iniciantes (3 a 5 pessoas)**, seguindo o roteiro da seção 3. Anotar o tempo até entrar na primeira tumba e quantas
   vezes tentaram uma porta selada.
3. **Desempenho** num aparelho de entrada (quadros por segundo no vale à noite e na Viva, que têm mais luzes e
   partículas).
4. **Som ouvido de verdade** (trilha por região e volumes).
5. **Acessibilidade:** navegação só por teclado no computador e leitor de tela no menu e no Guia. Nada disso foi
   testado.

## 6. Ordem sugerida de trabalho
1. Layout do painel em telas baixas (os três P1 do painel juntos): código sempre visível no modo Escrever, enunciado
   inteiro, deitado em duas colunas.
2. Rótulos do cenário legíveis no celular.
3. Câmera na entrada das tumbas (espaço para os botões de toque).
4. Acabamento P3 (fontes de 12 px, alvos de 44 px, títulos, contraste do "novo").
5. Ritmo: enxugar as guiadas dos Motores e pôr distratores e previsões nas práticas.
6. Teste com celular real e com iniciantes. Só então redesenhar mais uma tumba (Reator) no modelo do pátio.
