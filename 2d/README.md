# Vale das Tumbas 2D

Aventura em pixel art vista de cima, no estilo dos RPGs de 16 bits, para quem está começando em lógica de programação.
Com tapa-olho no olho direito, roupa ocre e dourada e uma bengala alta, a personagem cruza o vale, entra em quatro tumbas e recupera os conhecimentos de uma civilização que controlava máquinas,
geradores, portais e organismos artificiais com instruções, dados e regras lógicas. Cada relíquia é um saber: só desperta
quando o jogador monta, executa e corrige programas que fazem o mecanismo da sala funcionar.

A versão 3D continua separada, na raiz do repositório, e não foi alterada. O arquivo [`VALIDACAO.md`](VALIDACAO.md) mostra, item por
item, como a análise crítica de 17/10/2026 e a atualização de 18/10/2026 (com as críticas e os áudios do desenvolvedor)
foram atendidas, e traz os roteiros de teste em celular real e com estudantes iniciantes.

## Jogar
- **Arquivo único:** rode `./build.sh` e abra `build/vale-das-tumbas-2d.html` no navegador do computador ou do celular. Tudo vai
  dentro do arquivo (sem imagens, sons nem bibliotecas externas, sem WebGL): funciona sem internet.
- O `build.sh` gera duas versões: `build/vale-das-tumbas-2d.html` é a **pública** (a que vai para o site) e **não contém** o
  gancho de teste; `build/teste/vale-das-tumbas-2d.html` é a dos **testes automáticos**, com o gancho `#vt` que lê o estado e
  teletransporta o explorador. O próprio `build.sh` falha se o gancho aparecer na versão pública.
- **Controles:** no celular, joystick à esquerda (empurrado até o fim, corre) e o botão AÇÃO à direita; LUZ acende e apaga a
  lanterna nas tumbas, VER aproxima ou afasta a câmera e **Guia**, no alto, abre o Guia de Programação. No teclado, WASD ou
  setas, Shift corre, E / Espaço / Enter interage, C aproxima ou afasta a câmera, G Guia, T lanterna, J diário, Esc pausa.
  Controle de videogame: analógico anda, A interage, Y lanterna, X diário, Select Guia, Start pausa.
- O jogo salva sozinho no navegador. A câmera começa **afastada** (mostra mais do lugar) sempre que a tela comporta com pixels
  nítidos e legíveis; a escolha do jogador, os volumes e o jeito do painel ficam guardados neste aparelho.
- **Pausa:** Som ligado/desligado e os volumes de **Música** e **Efeitos**, separados.

## História
**Novo jogo** abre uma história curta (5 páginas, com os sprites do próprio jogo; dá para pular): a cidade do vale
funcionava com instruções; as máquinas adormeceram e os construtores guardaram o que sabiam em quatro tumbas, cada saber com
sua relíquia; **você** chega com a bengala de mecanismo e o **tapa-olho no olho direito**, não para saquear, mas para
entender a cidade e ajudá-la a acordar (com calma, agradecendo às máquinas, sem medo de errar); o Lume acompanha sem
entregar respostas; a missão é recuperar os quatro saberes e levar tudo à Cidade-Jardim. O botão **📜 História** do menu
mostra a história de novo.

## Começo: o Pátio de Treino
Um jogo novo começa num pátio curto, antes da primeira tumba, que ensina jogando (sem blocos de texto): o objetivo no alto
mostra um passo por vez (9 passos) — andar até a marca brilhante, conversar com o Lume, experimentar a câmera, pegar a manivela,
encaixá-la no terminal, abrir o Guia, abrir o editor, executar o primeiro comando, `acender_tocha()`, e por fim **a ordem
importa**: o programa do portão já vem escrito na ordem errada (`erguer_portao()` antes de `destravar_portao()`); o jogador
faz uma **previsão**, executa, vê o portão travado, lê a explicação e corrige a ordem. A tocha acende, o cadeado abre e o
portão do pátio leva ao vale. Logo na entrada, a primeira **placa com !** ensina como reconhecer uma pista. Quem já sabe jogar pode pular pelo Lume ("Já sei jogar"); a placa do acampamento leva de volta
ao pátio a qualquer momento (numa visita depois do treino, o portão já está aberto).

## Ajuda ao jogador
- **Relatório de aprendizagem** — na aba **📊 Relatório** do Diário (ou no menu de pausa): etapas concluídas e pendentes por
  lugar, o conceito de cada um, tentativas (cada execução que chegou ao fim), tentativas com erro, dicas pedidas, a resposta da
  previsão e o dia da conclusão. **⬇ Baixar TXT**, **⬇ Baixar CSV** (para planilha) ou **📋 Copiar**. Nada é inventado: as
  etapas concluídas antes desta versão aparecem como "sem registro". Fica só no aparelho, e o arquivo não tem nome nem dado
  pessoal.
- **Sem rumo?** Quando o objetivo fica igual por uns 2 minutos e meio, um lembrete aponta o objetivo e a bússola; se
  continuar, outro lembra do terminal ◆ (nas tumbas) ou da trilha colorida e do Lume (no vale). No máximo dois por objetivo,
  e nenhum resolve o desafio.
- **Lume** — um pequeno autômato-lanterna que fica no pátio, no acampamento e dentro de cada tumba. Explica os controles, como
  interagir, como funciona a programação e como ler um desafio. Não entrega a solução: dá **dicas progressivas** da etapa da
  vez — a 1ª fala do conceito, a 2ª do caminho e a 3ª chega perto da solução. Dá para conversar de novo quantas vezes quiser;
  depois da terceira, ele repete a mais próxima e sugere o Passo a passo. As dicas do Lume e o botão 💡 Dica do painel usam a
  mesma contagem (e ela fica salva).
- **Guia de Programação** — abre a qualquer momento (tela inicial, botão Guia do HUD, tecla G, menu de pausa, botão 📖 Guia do
  painel, da área de erro, da linha selecionada no editor e pelo Lume) e volta para onde estava, sem perder o programa. O
  índice é compacto e agrupado — **Sequência** (comandos, sequência), **Dados** (variáveis, os quatro tipos, regras das
  máquinas, int, float, str, bool), **Decisões** (comparações, if, else, elif), **Repetições** (for, while) e **Ajuda**
  (recuo, tipos de erro, o que o editor aceita, **do jogo para o Python de verdade**, palavras do jogo, seus exemplos) — e o grupo da tumba atual vem marcado
  com ★ e aberto; tocar num grupo abre o primeiro assunto dele, e no celular os assuntos ficam numa fileira que rola para o
  lado, para o texto ficar com a maior parte da altura. Em **Ajuda** também ficam as mecânicas do jogo (saberes e relíquias,
  objetivo, bússola e atalhos, diário e pistas, lanterna e marcas de luz). Cada
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
- **Pistas (placas com !)** — cada tumba tem uma placa com uma pista para o desafio (os Motores têm duas). Enquanto não foi lida,
  a placa tem um balão **!** (símbolo, contorno e aviso de interação, não só cor); depois, um ✓. A pista lida fica no
  diário (aba **Pistas**) e no terminal, em **Comandos e variáveis**, onde dá para **fixá-la no alto do painel** (até três).
  Os segredos do vale continuam opcionais e discretos.
- **Lanterna e marcas de luz** — a lanterna não gasta (não há recarga). Acesa, ela ilumina em volta e revela **marcas de luz**:
  desenhos dos construtores que só aparecem com a luz bem perto da parede (duas por tumba, opcionais), que contam como eles
  pensavam o saber da tumba e ficam no diário. As salas ficaram mais claras e a borda das luzes é suave, para não esconder
  o que precisa ser lido; com o painel aberto, a sala clareia mais.
- **Avisos e HUD sem poluir a tela** — o aviso de uma interação nova (AÇÃO, VER, LUZ) substitui o da anterior; repetir a mesma
  conta ×2. No celular, no máximo dois avisos, compactos, logo abaixo do HUD. O que o explorador leva na mão (a cápsula do
  pátio dos Motores) fica no HUD. O objetivo pisca só quando muda; no celular, depois de 9 s encolhe para o título e uma
  linha, e um toque abre de novo.
- **Bússola e portas seladas** — a seta no título do objetivo aponta do explorador até o alvo da etapa (some quando ele
  está perto). Uma porta selada diz qual tumba vem antes e para que lado ela fica a partir dali.
- **Rótulos do cenário legíveis** — quando a letra de pixel (5 px) ficaria com menos de 9 px na tela (celular com a câmera
  afastada), os rótulos do mundo ("aceita str · pede ABRIR", valores das cápsulas, sensores) saem em dobro, empilhados sem
  se cobrir. No toque, a câmera reserva a faixa dos botões VER, LUZ e AÇÃO, então o explorador não fica atrás deles.
- **Você quis dizer…?** — num nome errado (`acender_toxa()`, `quantidad`, `Energia`), o erro sugere o nome da sala mais
  parecido.
- **Alvo da etapa e nome dos objetos** — o próximo objeto a usar tem um marcador com símbolo, texto curto e cor (◆ Programe
  aqui, ◆ Manivela, ◆ Tumba das Engrenagens); ao chegar perto de algo, o nome dele aparece em cima. Quando o explorador
  encobre um obstáculo, o obstáculo aparece por cima, semitransparente e com contorno; atrás de uma coluna alta, o contorno
  do explorador aparece por cima dela.

## Progressão educativa
Primeiro comando → sequência e lógica de execução → variáveis e tipos → if, elif e else → for e while → tudo junto. Cada tumba
só abre depois do saber da anterior, e o objetivo no alto da tela sempre mostra a próxima etapa. Em todas as etapas o ciclo é
o mesmo: **programar → executar → observar → corrigir**. Não há múltipla escolha: o jogador escreve (ou monta por toques),
completa, reorganiza ou corrige código, e o código mexe no cenário. São 27 etapas (a Câmara Final, descrita abaixo, tem a sua). Cada tumba tem os três momentos —
**demonstração**, **prática com ajuda** e um **desafio independente** (aplicação, sem guia, numa situação nova) — e o jogo
confere o resultado no mecanismo, não uma resposta única: soluções alternativas que cumprem as regras são aceitas.

Para não dar para resolver só imitando, cada conceito tem uma **prática guiada com previsão** (🔮), e a pergunta parte do
**programa que o jogador escreveu**: o jogo executa esse programa (ou uma variação dele) para saber a resposta certa, então
soluções diferentes e corretas nunca viram "erro". a1: "No seu programa, o que executa na situação B?"; b3: "No seu programa,
quantas vezes irrigar() é chamada na situação A?"; d3: o seu programa com a ordem trocada aparece escrito, e a pergunta é o
que a separadora faria; s1 é uma pergunta de conceito (rotulada assim: vale para qualquer programa). A resposta vem na hora
com o caminho que a execução fez ("linha 1: if: energia >= 5 → 3 >= 5 é False → …"), e a situação da pergunta fica
escolhida para a execução seguinte conferir. Sem programa ainda, a pergunta espera a próxima tentativa. Nas etapas de
corrigir, a pergunta é sobre "o programa como está agora", numa situação definida, e é conferida no fim da tentativa. A paleta também traz **alternativas plausíveis** depois da primeira apresentação de cada
conceito: na comporta (a1) há o `if` sem `else` e os operadores `>=`, `==` e `<`; no while guiado (b3), o `for` e o `<=` —
caminhos que parecem servir, mas falham em alguma situação.

Cada etapa mostra a **🎯 TAREFA** numa linha própria (o que fazer, em uma frase), separada do enunciado (contexto e conceito)
e das respostas do painel (verde quando dá certo, vermelho com a área de erro, azul no passo a passo, dourado para o Lume).
No **Passo a passo**, tudo o que mudou no passo — variável, sensor ou o `i` do `for` — fica marcado com "antes → depois".
Se o programa mudar depois de uma situação ter dado certo, a situação vira **↻** (testar de novo), em vez de perder o ✔ em
silêncio. Depois de três tentativas seguidas com erro, o botão 💡 Dica pisca e a mensagem sugere a dica ou o Passo, sem dar a
resposta. **Executar** (verde), **Passo** (azul), **Parar** (vermelho) e **Reiniciar** (âmbar) ficam numa fileira própria;
no teclado físico, Ctrl+Enter executa, Ctrl+Shift+Enter dá um passo, Ctrl+. para e Alt+R reinicia.

| Lugar | Saber (relíquia) | O código controla… | Etapas |
|---|---|---|---|
| Pátio de Treino | primeiro comando e ordem | `acender_tocha()` acende a tocha; `destravar_portao()` e `erguer_portao()` abrem o portão | prática guiada, **corrigir** a ordem (com previsão) |
| Engrenagens (Steampunk) | Sequência e execução (Engrenagem-mestra) | `avancar()`, `virar_direita()` e `ativar()` movem o autômato e abrem o mecanismo | demonstração (mesmas linhas em outra ordem), prática guiada, **corrigir** (o autômato bate: mudar a ordem), percurso novo |
| Motores (Dieselpunk) | Variáveis e tipos int, float, str, bool (Vela de ignição) | **antes da oficina, o pátio de abastecimento**: cada máquina tem uma etiqueta com o tipo aceito e o valor pedido, e o jogador leva **cápsulas de valor** até ela — o disjuntor aceita bool (`True`, não `"True"`), a bomba aceita float (`2.5`, não `"2.5"`) e baixa a ponte do canal, o painel aceita str (`"ABRIR"`, não `"abrir"`) e abre a oficina; na oficina, `energia = True` liga o gerador, `combustivel = 2.5` enche o tanque, `pecas = 5` ajusta o contador, `senha = "ABRIR"` destrava a porta; a separadora, o monta-cargas e a bomba leem as variáveis | demonstração, os quatro tipos, `5` ou `"5"`, a máquina lê a variável, mudar o valor, **corrigir** a ficha do monta-cargas, **aplicação**: a bomba enche dois tanques (2,5 L e 4,0 L) — guardar, usar e alterar `energia` e `combustivel` |
| Reator (Atompunk) | if, elif e else (Núcleo atômico) | sensores de energia, nível e temperatura; comporta, carregador, portão, dreno, jatos de resfriamento, ventilador e luz de estabilidade | demonstração em duas situações, if/else guiado (A e B), aplicação com variável e três situações, elif guiado (três temperaturas), **corrigir** a ordem dos elif, **aplicação final**: o painel de segurança com dois sensores, o limite numa variável e a regra mais importante primeiro (cinco situações, inclusive exatamente 80 graus) |
| Viva (Biopunk) | for e while (Semente da vida) | `for i in range(4): acender_tocha()` acende quatro tochas de seiva, uma depois da outra; o polinizador rega os organismos | **demonstração** (as mesmas 4 tochas com 4 linhas e com for), for das tochas (painel de 2 linhas), for guiado, **corrigir** o padrão, while guiado (0, 1 e várias voltas), automação com while dentro do for |
| Cidade-Jardim | tudo junto | robô jardineiro, cinco canteiros e a fonte | variável contadora + for + if em dois jardins |

Cada etapa concluída também acende uma tocha de progresso na sala da tumba, e o diário guarda, em cada saber, o conceito e o
programa que o próprio jogador escreveu (o da aplicação independente).

**Mecanismos da sala (opcionais, um por tumba, sem código novo).** Usam objetos que já existiam no cenário e só o conceito
que a tumba já ensina; valem para a visita (entrar de novo devolve ao começo) e nunca bloqueiam o caminho:
- **Engrenagens — três alavancas (sequência).** Vapor, freio e trava, perto dos pistões. O *Manual dos pistões* diz a regra
  ("o freio só segura com o vapor já fechado; a trava só encaixa com o freio já puxado"); na ordem certa os pistões param
  nesta visita. Fora de ordem, as alavancas voltam (sem dano). Sem isso, passa-se esperando a luz de aviso, como antes.
- **Reator — painel de blindagem (if/else).** O medidor mostra a radiação do turno (sorteada entre 3, 4, 7 e 8) e a placa
  *Regra da blindagem*: se for 6 ou mais, ligar a blindagem; senão, abrir a ventilação. A escolha certa contém a radiação
  das manchas nesta visita; a errada não faz nada e o painel explica a comparação (`7 >= 6` dá True).
- **Viva — bomba de seiva (while).** A cápsula começa com 0, 1 ou 2; enquanto estiver abaixo de 3, bombear; em 3, parar.
  Passar de 3 vaza (sem dano) e recomeça do zero. Com 3 certinho, os clones da sala da canção ficam calmos: errar a canção
  não os acorda (chegar perto continua acordando).
- **Motores** já tinham o pátio das cápsulas; a etiqueta de cada máquina agora abre num painel que fica aberto (tipo aceito
  e valor pedido), em vez de um aviso que some.

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
O mesmo painel em todas as tumbas, com recursos liberados aos poucos. Ele abre como **editor amplo**: o painel fica com a
maior parte da tela e a sala vira uma faixa compacta centrada no mecanismo (durante a execução, acompanha o que a instrução
da vez mexe), com a câmera de perto. **🔍 Ver a sala** inverte (a escolha fica guardada). **Comandos e variáveis** é uma
referência recolhível nos dois modos: funções, variáveis (tipo aceito e valor atual), sensores, valores da bancada,
estruturas e as pistas lidas na sala. No celular: o enunciado aparece inteiro quando cabe (senão, "▾ ler o resto"; com 3
linhas ou mais no programa ele recolhe sozinho); com um erro no modo Escrever, a referência recolhe e o campo de código fica
à vista junto da área de erro; deitado, o painel vira duas colunas (o desafio à esquerda, o programa com a paleta e os
botões à direita). Em celular pequeno em pé (até 760 px de altura, ex.: 360 × 640), o painel fica compacto: o programa vem
logo depois da tarefa e do enunciado (Comandos e variáveis, recolhível, vai para baixo dele), os controles cabem em duas
fileiras (os botões auxiliares mostram só a palavra; abaixo de 400 px, sem ícone) e nenhum texto do painel fica abaixo de
11 px. Nas Engrenagens e nas estufas (Viva e Cidade-Jardim), uma faixa **legível** mostra o tabuleiro ou os canteiros em
texto — seta do autômato, ◆ destino, ■ pedra, rastro; "seco", "úmido", "fonte" — e acompanha a execução, em vez de só os
pixels da sala. Há dois jeitos de programar:
- **Por toques**, sem arrastar: tocar numa linha da paleta (`avancar()`, `variável = valor`, `if`, `if … else`, `elif`,
  `for … in range(n)`, `while`) escreve no cursor ▸; tocar numa linha a seleciona e abre o editor dela (subir, descer,
  remover, escolher o valor, a condição, o número de voltas, `+ elif`, `+ else`).
- **✎ Escrever**: o mesmo programa num campo de texto, para digitar Python de verdade (Tab escreve 4 espaços). A paleta não
  some: tocar numa linha da paleta ou num item de Comandos e variáveis escreve no cursor (com o recuo certo e o trecho a
  trocar já selecionado, como `valor` ou `condição`). Ao executar ou tocar em ✔ Pronto, o texto é lido; com erro, a área de
  erro aponta a linha e explica. Abrir o Guia no meio da digitação não perde o texto, o cursor nem a seleção.

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

## Câmara Final · o Devorador do Vale (prova adicional)
Entre as quatro tumbas e a Cidade-Jardim fica uma câmara com um guardião: uma criatura pequena que, ao sentir o explorador,
absorve a energia das relíquias e se transforma num monstro gigante de tentáculos (o **Devorador do Vale**). Ele não é vencido
pela força, e sim pelo conhecimento: cada **fase** é um programa que põe um saber à prova, e no fim ele é **purificado** e volta
ao tamanho original. A câmara é **adicional**: não substitui nenhuma etapa, e o desafio do Jardim continua depois dela. Quem já
tinha concluído o Jardim antes desta câmara existir segue direto para a cidade.
- **Caminho:** a porta final do vale (com os quatro saberes) leva à câmara; com o guardião purificado, o portão ao norte abre e
  leva à Cidade-Jardim. A escada ao sul volta ao vale.
- **Estados do chefe:** *adormecido* (pequeno) → *transformado* (gigante) → *enfraquecido* (logo depois de cada fase) →
  *purificado*. A transformação começa quando o jogador chega perto do terminal; com o painel aberto o chefe não ataca.
- **Golpes:** os tentáculos avisam antes (círculo vermelho no chão por mais de 1 s); só fere quem fica no círculo. A cada fase
  concluída soltam-se mais golpes por rodada, e o intervalo diminui.
- **Fase 1 · Sequência (`k1`, pronta):** quatro mecanismos (`cortar_energia()`, `abrir_valvula()`, `alinhar_espelhos()`,
  `disparar_ressonador()`) com dependências: a válvula só gira sem o campo de energia e o ressonador só dispara com a válvula
  aberta e os espelhos alinhados. Há mais de uma ordem certa (os espelhos podem vir antes) e cada erro diz o que faltou. As
  regras estão nas duas placas da sala.
- **Fases seguintes (previstas):** Variáveis (energia dos dispositivos e tipos), Condicionais (sinais antes de cada ataque e
  defesas com `if/elif/else`) e Repetição (`for`/`while` para automatizar os mecanismos e desativar o núcleo). Cada uma entra
  como um novo desafio da tumba `camara` em `03-learn.js` (`bossFeito()` exige todos).
- **Sprites:** o chefe atual (`OBJS.bossProv` em `20b-camara.js`) é **provisório**, desenhado por código; a folha de sprites
  final (capivara pequena, nuvem de bolhas, chefe com tentáculos) entra no lugar dele.

## Estrutura
Os arquivos de `src/` são concatenados nesta ordem pelo `build.sh`:

| Arquivo | O que tem |
|---|---|
| `00-head.html` | estilos e interface: HUD, botões de toque, painel de programação, diário, menus, tela final |
| `01-core.js` | utilidades, textos, posições do mundo, relíquias, inscrições, segredos e o diário |
| `02-lang.js` | **interpretador** (um pedaço de Python): valores tipados, expressões, comparações, if/elif/else, for/while, edição por toques, leitor de texto (`ler`), `passo()`, explicação dos erros com o nome do Python |
| `03-learn.js` | **aprendizagem**: funções, os mundos de cada desafio (modelo do mecanismo), as 26 etapas, as três dicas de cada uma, saberes, as pistas (placas com !) e as marcas de luz |
| `04-save.js` | **salvamento** versionado e migração do save 3D (lógica pura) |
| `05-audio.js` | sons sintetizados: os do 3D, os do painel, os ambientes (pássaros de dia, grilos à noite, vento, fogo, água, gotas e rangidos nas tumbas) e a **trilha sonora**: um tema por região (vale de dia e de noite, treino, cada tumba, Cidade-Jardim), com volume próprio e mais baixa com o painel aberto |
| `06-input.js` | teclado, toque (joystick e botões) e controle |
| `07-pixel.js` | ferramentas de pixel art: sprites de texto, contorno, círculos, linhas e a fonte de pixels 3×5 |
| `08-sprites.js` | guardiões e autômatos |
| `08b-heroi.js` | **personagem principal**: 4 direções; repouso, caminhada (passos com a bengala), interação e dano; folha de sprites e configuração das animações |
| `09-tiles.js` | tiles de cada tema e paredes em visão 3/4 que se montam sozinhas |
| `10-objetos.js` | objetos do vale (tendas, palmeiras, ruínas de cada era, entradas, pirâmide, ícones dos valores) |
| `11-render.js` | **renderização**: resolução interna, escala inteira, câmera em pixel inteiro, chão em pedaços, luz, partículas |
| `12-mapa.js` | **mapas e colisões**: áreas, colisão nos pés com deslize nas quinas, interação, linha de visão |
| `13-painel.js` | **interface** do painel de programação: editor amplo / ver a sala, Comandos e variáveis, linhas em Python, editor por toques, modo Escrever (escrever no cursor), pistas fixadas, área de erro, dicas |
| `13b-guia.js` | **Guia de Programação** (devolve o cursor do código ao fechar), conversas e dicas do **Lume**, câmera afastada/aproximada |
| `14-vale.js` | o vale, as **estações de atalho** (acordam com o saber de cada tumba) e o **quadro do acampamento** |
| `14b-treino.js` | o **Pátio de Treino** (tutorial jogável) |
| `14c-ambiente.js` | **ambientação** do vale: leito seco e ponte, acácias, braseiros, arcos e muros caídos, acampamento de caravana, pontos de interesse, poeira, vaga-lumes, brasas, folhas, névoa da manhã |
| `15-tumbas.js` | peças comuns das tumbas: pontos de energia, saída, pedestal e a **regra única da recompensa** (`reliquiaLiberada`), terminal, portões, guardiões, placas de pista e marcas de luz |
| `16-steam.js` … `20-city.js` | as quatro tumbas e a Cidade-Jardim (mapa, perigos, guardião, mecanismo do desafio); nos Motores, o pátio de abastecimento |
| `20b-camara.js` | a **Câmara Final**: mapa, mecanismos da arena, o guardião (estados, golpes com aviso, purificação), o portão para a cidade e `bossFeito()` |
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
O mundo é desenhado num canvas pequeno (cerca de 250 pixels de jogo no lado menor da tela; com a câmera afastada, um degrau
a menos de ampliação) e ampliado por um fator **inteiro** para o canvas do tamanho real da tela, sem suavização. A câmera
afastada só vale quando cada pixel do jogo ainda tem pelo menos 1,1 pixel da tela; senão, VER avisa que a tela já mostra o
máximo legível. A câmera anda em subpixels, mas o desenho usa a posição arredondada:
nada treme nem deforma. Tiles de 16×16, personagem em células de 40×46 (cerca de 32 px de altura, a bengala com 37 px),
contorno escuro de 1 px em tudo.

### Personagem principal
Desenhada a partir da imagem de referência oficial (poses laterais): **tapa-olho no olho direito**, com a tira em volta da
cabeça, sobre o cabelo grisalho preso em coque, roupa ocre e dourada, faixa roxo-azulada no peito, lenço e cartucheira vermelhos, bolsinha, babado
amarelo, botas escuras e a bengala com ponta, anel verde, mecanismo, empunhadura ocre e pé largo. As vistas de frente e de
costas foram criadas com as mesmas proporções. De frente, o tapa-olho fica à esquerda da tela; de perfil para a direita,
cobre o olho visível; de perfil para a esquerda (o espelho da direita, menos a cabeça) aparece o olho esquerdo, livre,
e só a tira passa pelo cabelo; de costas, a tira cruza a nuca.
- **Folha de sprites:** `recursos/heroi.png` (fundo transparente, células de 40×46, 8 colunas, uma linha por direção e
  animação) e `recursos/heroi.json` (ordem das linhas, âncora, colisão e tempos). O jogo monta os mesmos quadros por código
  (`folhaHeroi()`), então a folha nunca fica diferente do que aparece na tela (há teste para isso).
- **Ponto de referência:** (20, 44) na célula, o centro da linha de contato das botas com o chão; é ele que vai na posição
  do personagem. Em todo quadro pelo menos uma bota está apoiada nessa linha.
- **Animações:** repouso (4 quadros, respiração), caminhada (8 quadros por ciclo de dois passos; a
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
  treino, as dicas vistas, os pontos de interesse, se o Guia já foi aberto, o programa que resolveu cada etapa, as pistas
  lidas, as fixadas e as marcas de luz encontradas. As preferências do aparelho (som, volumes de música e efeitos, câmera,
  painel e referência) ficam à parte, em `vale_das_tumbas_2d_cfg`.
- **Recompensa das tumbas:** a relíquia só sai do pedestal quando todas as etapas da tumba foram concluídas (é isso que abre o
  portão da câmara), uma única vez, pela mesma regra para teclado, toque e controle. Até a versão anterior, nos Motores, no
  Reator e na Viva, dava para pegá-la encostado no portão fechado.
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
| `l1-linguagem.js` | lógica (Node) | tipos int/float/str/bool com os nomes do Python, comparações como no Python (5 == "5" é False com aviso, 5 < "5" é TypeError, textos em ordem, bool como 0/1, verdade de números e textos), a recusa do contêiner como regra da máquina (não TypeError), a origem de cada erro escrito (Python, o que o editor não tem, regra da máquina, linha sem efeito), o fim do Passo a passo, `"5"` × `5`, vazio × 0 × False, contas, comparações, `not`, if/elif/else (só o primeiro caminho verdadeiro), for com `i` (0, 1, n voltas), while (0, 1, várias voltas), repetição sem parada e limite de passos sem travar, erro na linha responsável, exibição em Python, leitor de texto e seus erros (SyntaxError, IndentationError, NameError, TypeError), edição por toques, Executar × Passo, soluções de todas as 26 etapas e soluções alternativas, previsão nas etapas com código pronto e numa prática guiada de cada conceito, alternativas da paleta que falham (a1, b3), demonstração/prática/aplicação em cada tumba, código inicial das etapas de corrigir falhando, três dicas por etapa |
| `l2-save.js` | lógica (Node) | migração do 3D (relíquias adormecidas, diário, segredos, posição convertida e segura, save dentro de tumba), save 3D estragado, save 2D ida e volta, save 2D estragado campo a campo, revisão 2 (treino, dicas, pontos de interesse) e save antigo ganhando as etapas novas |
| `b1-percurso.js` | navegador | o jogo inteiro como um jogador: treino (andar, Lume, câmera, manivela, Guia, editor, primeiro comando, previsão e correção da ordem do portão), tumbas fora de ordem seladas, cada tumba com seus perigos (nos Motores, o pátio de abastecimento com as cápsulas de valor) e todas as 26 etapas — montadas por toques, escritas no modo Escrever e corrigidas a partir da área de erro —, a bomba dos Motores, a demonstração da Viva, máquinas e tochas reagindo ao código, **recarregar a página depois de cada tumba** (etapas, relíquias e programas voltam), o diário com o programa do jogador, Cidade-Jardim, final, recarregar e continuar |
| `b2-painel.js` | navegador | Executar e Passo a passo dão os mesmos passos, mundo e variáveis (inclusive com erro); uma execução por vez; Parar; Reiniciar; Limpar com confirmação; dicas do Lume em três níveis e recapitulação; Guia aberto do painel e de volta; limite de linhas; while sem parada explicado; exploração pausada; fechar no meio |
| `b3-save.js` | navegador | migração real a partir do save 3D no `localStorage`, save 3D intacto, relíquia que desperta, save dentro de tumba, save 2D estragado, posição dentro de obstáculo, save ilegível |
| `b4-telas.js` | navegador | 10 tamanhos de tela (em pé, deitado, tablet, computador): escala inteira (com a câmera afastada quando cabe), HUD (com Guia) e avisos sem sobreposição, botão VER livre, botões grandes, textos legíveis, painel inteiro alcançável, editor amplo com o mecanismo na faixa da sala, Ver a sala com a sala maior, área de erro inteira acima dos botões fixos |
| `b5-perigos.js` | navegador | pistões, placas com e sem olho, Autômato, pátio dos Motores (bomba sem energia, "2.5" e "abrir" recusados com explicação, guarda-corpo e ponte que trava, travessia com a ponte baixada), canal, radiação, bomba, canção errada, derrota, oásis, inscrições, segredos e mapa |
| `b8-leitura.js` | navegador | alvo da etapa com símbolo e texto, nome do objeto ao alcance, obstáculo e explorador encobertos em contorno, terminal com silhueta própria, caminho livre da manivela ao terminal, pontos do treino alcançáveis a pé, todas as caixas de colisão dentro do desenho (todas as áreas) |
| `b10-recompensa.js` | navegador | a relíquia de cada uma das 4 tumbas não sai antes das etapas, encostando no portão (27 posições) com teclado, toque e controle; a regra central recusa; depois das etapas, coleta uma vez, sem repetir o diário, e continua salva depois de recarregar |
| `b11-terminal.js` | navegador | placa com ! vira pista no diário e no terminal, fixar a pista, editor amplo, Comandos e variáveis nos dois modos (tipo e valor atual), paleta no modo Escrever, escrever no cursor com recuo e trecho selecionado, elif no recuo do if, Guia sem perder texto/cursor/seleção, Ver a sala guardado, aviso de pista não lida, riscos parados com o painel aberto, pistas depois de recarregar |
| `b12-vale-som.js` | navegador | câmera afastada por padrão, de perto com o painel aberto e guardada; lanterna sem gasto, marcas de luz só com ela acesa e perto, no diário; estações de atalho adormecidas e acordadas, viagem ao acampamento, quadro do acampamento; luzes do vale que dependem do saber; trilha sonora por região (vale, noite, tumba), mais baixa com o painel, volumes de música e efeitos separados e guardados, som desligado |
| `b13-tela.js` | navegador | tela limpa no celular: cápsula da mão no HUD (sem aviso), aviso da interação nova substitui o anterior (×2 na mesma), no máximo dois avisos compactos abaixo do HUD e acima do explorador, objetivo refeito só quando muda, encolhe e abre com um toque, marcador inteiro na tela e por baixo do HUD, texto da ação longe de VER/LUZ/AÇÃO, Guia com o exemplo inteiro e o conteúdo com a maior parte da altura (em pé, deitado e no computador), grupo abre o primeiro assunto |
| `b14-mvp.js` | navegador | história antes do treino (pulável, no menu), "Você quis dizer…?", painel no celular (código à vista no modo Escrever com erro em 412 e 360 px, enunciado inteiro ou "ler o resto", duas colunas deitado), rótulos do cenário em dobro no celular e normais no computador, explorador fora dos botões na entrada das tumbas, porta selada que aponta a tumba da vez, bússola do objetivo, Guia com as mecânicas do jogo |
| `b15-plano.js` | navegador | plano de melhorias: a versão pública aberta com `#vt`, `#vt-treino` e `#vt-treino-historia` não cria nenhum objeto interno e segue o caminho normal; previsão das práticas guiadas (pergunta antes de executar, resposta e explicação na hora, Executar seguinte confere sem perguntar de novo, Pular executa direto); o `if` sem `else` da paleta não resolve a comporta |
| `l3-relatorio.js` | lógica (Node) | relatório de aprendizagem: partida nova sem números inventados, totais, etapa antiga "sem registro", pendentes, os sete lugares com o conceito, TXT e CSV com os mesmos números e sem dados pessoais |
| `b16-melhorias.js` | navegador | tarefa da etapa, previsão sobre o programa do jogador (b3) com o caminho da execução e a situação escolhida, sensor marcado "antes → depois" no Passo, situação ↻ depois de mudar o programa, botões de execução e Ctrl+Enter, Dica sugerida após três erros seguidos, funções do jogo × Python no painel e no Guia, relatório no Diário com TXT e CSV baixados e salvos no save, lembrete sem progresso |
| `b17-exploracao.js` | navegador | editor em 360 × 640 em sete etapas (programa à vista ao abrir, Executar na tela, controles em duas fileiras, nenhum rótulo cortado, textos ≥ 11 px, sem rolagem para o lado); alavancas das Engrenagens (ordem errada volta sem dano, ordem certa para os pistões, manual legível, reinício por visita); painel de blindagem do Reator (radiação, regra, escolha errada explicada, escolha certa protege, caminho do senão); bomba de seiva da Viva (nível, parar cedo, vazar, clones calmos diante da canção errada); tabuleiro e canteiros em texto no painel; etiqueta dos Motores em painel |
| `b18-camara.js` | navegador | Câmara Final: a porta do vale leva à câmara (e direto à cidade para quem já terminou), o chefe dorme até alguém chegar perto, golpes só ferem depois do aviso e só no círculo, painel aberto pausa os ataques, ordem errada falha explicando, ordem certa purifica e abre o portão, o Jardim continua pendente, save dentro da câmara, relatório, diário e derrota |
| `b9-validacoes.js` | navegador | armazenamento bloqueado (aviso e jogo seguindo), sair para outro aplicativo e voltar (pausa e salva), teclado virtual simulado (painel, código e Executar acima dele), sem rolagem horizontal |
| `b6-personagem.js` | navegador | quadros de todas as direções e animações, linha do chão e altura coerentes, espelho, colisão nos pés, passagem de 1 tile, porta da tumba, atrás/na frente do pilar, transições repouso → caminhada → repouso, interação e dano, folha exportada igual à do jogo |
| `b7-ajuda.js` | navegador | Guia na tela inicial, no HUD, na tecla G, na pausa e no painel (os dez assuntos com exemplo); pular e revisitar o treino; câmera na tecla C (começa afastada); Lume no acampamento e na tumba com dicas em ordem que não entregam o programa; pontos de interesse no diário; Reiniciar depois de um erro; a área de erro diz a origem (Python, regra da máquina, o que o editor não tem) e leva ao assunto do Guia em um toque, sem perder o programa; Passo a passo que mostra o resultado na última instrução e marca o mecanismo afetado |

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
- **Motores:** o salão do holofote e do Robô-vigia (que exigia furtividade, uma barreira motora) deu lugar, em 18/10/2026, ao
  pátio de abastecimento, em que chegar à oficina já pede reconhecer tipos e valores (comparação em
  `capturas/C-motores-antes-depois.png`). As outras tumbas mantêm a planta anterior até esta ser avaliada com jogadores.
- **Relíquias:** agora dependem dos desafios educativos; as trazidas do 3D chegam adormecidas.
- **Escala do vale:** o vale 2D usa as posições do 3D multiplicadas por 0,4 (180 × 180 tiles).
