# Validação — Vale das Tumbas 2D

Este arquivo responde ao documento *"Análise crítica e plano de melhorias"* (17/10/2026) e à sua atualização de 18/10/2026
(críticas e áudios do desenvolvedor), item por item. A seção 0 trata da atualização; a seção 1, do documento original. Ele
separa três coisas: o que **já existia** quando a análise foi feita, o que **foi feito agora** e o que **só pode ser conferido fora
daqui** (num celular de verdade ou com estudantes). Os testes automáticos rodam num Chromium sem janela, com telas de
celular, tablet e computador simuladas; eles não substituem um aparelho real nem pessoas jogando.

## 0. Atualização de 18/10/2026 (críticas e áudios do desenvolvedor)
Os áudios foram transcritos localmente (dez arquivos, WA0003 a WA0013, sem WA0005) e cada relato foi conferido no jogo antes
de mudar o código. A transcrição está fora do repositório; aqui vai o que foi reproduzido e o que mudou.

### P0 — coleta do item sem resolver o puzzle (WA0003)
| Pergunta | Resultado |
|---|---|
| Reproduziu? | **Sim**, na versão anterior: encostado no portão fechado da câmara, o pedestal oferecia "Pegar a …" e entregava a relíquia nos **Motores, no Reator e na Viva** (o pedestal fica a 2 tiles do portão; o raio de 22 px passava pela grade). Nas **Engrenagens não** (o portão fica mais longe). O teste novo `b10-recompensa` falha 15 de 22 verificações na versão anterior e passa 22 de 22 na nova. |
| O que a coleta alterava | A relíquia ia para o HUD (como "adormecida"), o diário ganhava a anotação da relíquia **e a do saber**, o aviso dizia "Você recuperou… o saber" e o save gravava tudo. Os saberes (a contagem e o portão da Cidade-Jardim) **não** mudavam: eles vêm das etapas concluídas. Ou seja: recompensa e diário sem o conhecimento, mas sem pular a progressão. |
| Correção | Regra única `reliquiaLiberada(k)`: a relíquia só sai com **todas as etapas da tumba concluídas** (o que abre o portão) e só uma vez. Teclado, toque e controle passam pela mesma interação; `pegarReliquia` também confere (uma coleta automática futura passaria pelo mesmo lugar). Com o portão fechado, o pedestal não oferece nada, nem pela grade. O raio não foi só diminuído. |
| Testado | As 4 tumbas; 27 posições encostadas no portão (meio, cantos, reto e na diagonal); tecla E, botão AÇÃO e a ação do controle; chamada direta da regra; coleta depois das etapas (uma vez, sem repetir o diário), entrar de novo na tumba e recarregar a página. |
| Saves antigos | Uma relíquia pega pelo defeito continua no save como **adormecida** (o mesmo tratamento das relíquias trazidas do 3D): desperta quando o saber é recuperado. Nada se perde. |

### A — Terminal e referências (9.1, 9.2)
| Pedido | Situação |
|---|---|
| Prioridade de espaço ao editor, modo expandido | **Feito.** O painel abre como **editor amplo** (76% da altura em pé; até 74% da largura deitado/computador). **🔍 Ver a sala** inverte; a escolha fica guardada. |
| Visualização compacta do mecanismo, em vez de área fixa para o personagem | **Feito.** Na faixa da sala, a câmera fica no mecanismo e de perto (detalhe); durante a execução, acompanha o que a instrução da vez mexe. Testado em 10 tamanhos de tela: o mecanismo fica dentro da faixa. |
| Nomes de variáveis, funções e valores disponíveis ao alternar | **Feito.** **Comandos e variáveis** (recolhível, nos dois modos): funções com o que fazem, variáveis com o tipo aceito e o **valor atual**, sensores, valores da bancada, estruturas. No **modo Escrever a paleta não some** e tocar num item escreve no cursor, com recuo e o trecho a trocar selecionado (`valor`, `condição`). |
| Pistas no terminal | **Feito.** As pistas lidas da sala aparecem em Comandos e variáveis; uma pista **fixada** fica no alto do painel, em qualquer terminal. Pista não lida: o terminal avisa que há uma placa com ! na sala. |
| Preservar programa, cursor e rolagem ao consultar ajuda | **Feito e testado** (Guia aberto no meio da digitação volta com o texto, o cursor, a seleção e a rolagem). |
| Teclado virtual | Continua tratado (b9). Precisa de aparelho real. |
| Pausar riscos e custos durante leitura e programação | **Já era assim**; testado de novo com guardião acordado ao lado (b11). A lanterna deixou de ter custo. |

### B — Câmera, pistas e conforto (9.3, 9.5, 9.8)
| Pedido | Situação |
|---|---|
| Enquadramento inicial mais afastado, guardado, adequado à tela | **Feito.** A câmera começa **afastada** (um degrau a menos de ampliação) sempre que cada pixel do jogo ainda tem ≥ 1,1 pixel da tela; senão fica a normal e VER avisa que a tela já mostra o máximo legível. VER/C alterna e a escolha é guardada. Com o painel aberto, a sala aparece de perto. |
| Ensinar a reconhecer uma inscrição útil; essencial × opcional | **Feito.** A primeira **placa com !** fica logo na entrada do pátio de treino e explica o que é uma pista. Pistas essenciais: balão **!** (depois ✓), nome ao alcance e "Ler a pista". Segredos do vale continuam discretos; marcas de luz são opcionais e marcadas como tal. |
| Registrar no diário e fixar no terminal | **Feito.** Aba **Pistas** no diário (com botão para fixar) e Comandos e variáveis no terminal. |
| Texto, contraste, transições de luz, sobreposição | As tumbas ficaram mais claras (escuridão 0,88 → 0,6), as bordas das luzes ganharam quatro degraus suaves e a sala clareia mais com o painel aberto. Textos da interface continuam ≥ 11 px (b4). **Cansaço visual não foi medido**: depende de teste com pessoas. |

### C — Lanterna (9.4)
| Pergunta | Resposta |
|---|---|
| O que mudava ao ligar, em cada sala | Antes: só o raio de luz em volta do explorador (84 × 28 px), com custo de energia e recarga nos pontos de energia; as salas tinham lâmpadas suficientes, então ela era redundante (confere com WA0006/WA0007). |
| O que muda agora | **Sem custo** (sem barra, sem recarga). Acesa, além do raio, revela as **marcas de luz** (duas por tumba, opcionais): Engrenagens (salão de entrada e salão do Autômato), Motores (parede norte do pátio e garagem), Reator (entrada e salão do canal), Viva (entrada e sala da canção). A marca só aparece com a luz bem perto da parede; lida, fica no diário. Caminhos e textos não dependem dela. |
| A bengala | Não foi tocada: a lanterna é um item à parte. |

### D — Estrutura das tumbas (9.6)
| Pedido | Situação |
|---|---|
| Uma tumba representativa primeiro, jogada do início ao fim | **Feito nos Motores.** O salão do holofote e do Robô-vigia (furtividade = barreira motora) deu lugar ao **pátio de abastecimento**: um canal corta o pátio; o disjuntor aceita bool, a bomba hidráulica aceita float e baixa a ponte, o painel da porta aceita str; cápsulas de valor ficam no chão, cada uma com uma "irmã" parecida (`True`/`"True"`, `2.5`/`"2.5"`, `"ABRIR"`/`"abrir"`). Recusas explicadas (tipo, maiúsculas, falta de energia), guarda-corpo (ninguém cai), sem inimigo. A aproximação já usa o conceito (reconhecer entradas, decidir a ordem: a cápsula "ABRIR" está do lado errado do canal). Comparação: `capturas/C-motores-antes-depois.png`. |
| Repetir nas outras | **Não feito, de propósito**: o documento pede avaliar a primeira antes. Propostas para depois do teste: Engrenagens (trilhos cuja ordem de ativação muda a passagem), Reator (caminhos que respondem aos sensores), Viva (circuitos de irrigação que tornam a repetição visível). |

### E — Exploração do vale (9.7)
| Pedido | Situação |
|---|---|
| Rotas secundárias com função identificável | **Feito em parte.** O **quadro do acampamento** diz o que há fora da estrada e para que serve (fragmentos de mapa, baús, inscrições, estações, marcas de luz) e que nada disso é obrigatório. Desafios opcionais de prática no vale (transferência) **não** foram criados ainda. |
| Conhecimento que altera o vale; volta simplificada | **Feito.** Cada tumba concluída acorda a **estação de atalho** ao lado da porta (leva ao acampamento e às outras acordadas; a do acampamento leva a elas). E o vale reage: chaminés do vapor voltam a fumegar, postes dos motores a acender, antenas atômicas a piscar, cogumelos vivos a brilhar. |

### G — Áudio e ritmo (9.10, 9.11)
| Pergunta | Resposta |
|---|---|
| A trilha existia? | **Não havia trilha**: nenhum arquivo de música (o jogo é um HTML só, com som sintetizado). Havia um acorde baixo e esparso no vale (a cada 9–14 s) e outro na Cidade-Jardim; nas tumbas e no treino, só efeitos e ambiente. O som começa no primeiro toque (Novo jogo/Continuar) e o botão Som da pausa liga e desliga tudo. O relato "ausente" confere. |
| O que mudou | **Trilha sonora sintetizada por região** (vale de dia, vale à noite, treino, cada tumba, Cidade-Jardim — esta ganha densidade conforme renasce): acorde de fundo, baixo e uma melodia curta que volta com variações. Fica mais baixa com o painel ou o Guia abertos. Na pausa: Som (tudo), **Música** e **Efeitos** com volumes separados, guardados. Nenhuma informação de puzzle depende do som (a canção da Viva acende os bulbos). |
| Tédio e duração | Tratados como questão própria (estrutura, atalhos, pátio dos Motores), não com música. Precisam de teste com o público. |
| Ouvido? | **Não.** O navegador de teste não tem saída de som: os testes conferem que as notas são agendadas por região, o abafamento e os volumes; a qualidade musical precisa ser ouvida. |

### H — Retorno do celular real: poluição de tela e caixa de texto pequena
Quatro capturas de um celular em pé (pátio dos Motores e Guia). Reproduzido no navegador de teste com 412×915 e densidade 2;
comparação em `capturas/F-celular-antes-depois.png`.
| Relato | O que estava acontecendo | O que mudou |
|---|---|---|
| Avisos empilhados ao mexer em vários itens | Cada interação somava um aviso (até três de uma vez no celular), e eles ficavam no meio da tela, por cima do explorador e das cápsulas. Pegar uma cápsula também gerava aviso. A primeira recusa do disjuntor tinha 5 linhas. | O aviso de uma interação nova (AÇÃO, VER, LUZ) **substitui** o da anterior, na hora e no mesmo lugar; repetir a mesma interação continua contando ×2. No celular, **no máximo dois avisos**, mais compactos (13 px), **logo abaixo do HUD** (longe do explorador). A cápsula na mão foi para o HUD (**Na mão "2.5" (str)**, com a cor do tipo) e não gera mais aviso. A observação "Regra desta máquina…" aparece só na primeira recusa. |
| Caixa do objetivo grande | Além de ocupar 4 linhas, ela era **refeita a cada quadro** (defeito): a animação de destaque recomeçava sem parar, por isso a moldura amarela grossa ficava sempre acesa. | O objetivo só é refeito (e pisca uma vez) quando o texto muda. No celular, depois de 9 s ele **encolhe para o título e uma linha** (com ▸); tocar nele abre o texto inteiro de novo. |
| Marcadores sobre o HUD e cortados | O "◆ Disjuntor" ficava por cima dos avisos e saía da borda da tela. | Marcas do mundo ficam por baixo do HUD e dos avisos e nunca passam da borda. O texto da ação nas tumbas subiu para não ficar por baixo do botão **VER**. |
| Caixa de texto do Guia pequena | **Defeito de layout**: o quadro **Exemplo** encolhia dentro da área que rola e mostrava só uma faixa (o código ficava cortado). Os assuntos do grupo ocupavam até 5 fileiras de botões. | Nenhum bloco do conteúdo encolhe mais (o exemplo aparece inteiro, no celular, deitado e no computador). No celular, os assuntos ficam **numa fileira que rola para o lado** (o aberto fica à vista) e o cabeçalho é mais baixo: o conteúdo passou de 59% para **77% da caixa**. Tocar num grupo já abre o primeiro assunto dele. |
| Testado | `b13-tela` (22 verificações): HUD da cápsula, substituição dos avisos, limite e posição, objetivo (não refeito, encolhe, abre), marcador dentro da tela e por baixo do HUD, texto da ação × VER/LUZ/AÇÃO, Guia em pé, deitado e no computador. Não testado num celular de verdade. |

### I — Documentos de 18/10/2026: "Registro de melhorias – MVP 0.1" e "Plano de melhorias" (técnico)
Cada item foi conferido no jogo antes. O que já existia está marcado; o que faltava foi feito agora e testado em `b14-mvp`.
| Item | Situação |
|---|---|
| MVP 01–02 · História e introdução | **Feito agora.** História de 5 páginas antes do treino (pulável; **📜 História** no menu): a cidade das instruções, o sono das máquinas, quem é você, o Lume e a missão. |
| MVP 03 · Guia do jogador | Comandos com sintaxe e exemplos, erros, o que o editor aceita e palavras do jogo **já existiam**; **agora** também as mecânicas: saberes e relíquias, objetivo/bússola/atalhos, diário e pistas, lanterna. |
| MVP 04 · Bússola e navegação | Objetivo, marcador ◆, seta na borda e trilhas **já existiam**; **agora** a seta-bússola no título do objetivo e a porta selada que diz qual tumba é a da vez e para que lado. |
| MVP 05 · Personagem | **Corrigido:** o desenho tinha óculos de proteção; agora tem **tapa-olho no olho direito** (de frente à esquerda da tela; perfil direito cobre o olho; perfil esquerdo mostra o olho livre e a tira; de costas, a tira na nuca), boca em tom mais suave. A história apresenta a personalidade gentil. Folha de sprites refeita (`recursos/heroi*.png`). |
| MVP 06 · Jogabilidade e testes | Treino existente; o teste com iniciantes continua **pendente** (roteiro na seção 3). |
| P0-01 a P0-03 | **Já feitos** (b10, b3/b9, b2). |
| P1-01 / P1-08 · Editor e celular | **Feito agora:** no Escrever com erro o código fica à vista (antes: 29 px visíveis em 412 px); enunciado inteiro ou "ler o resto" (antes: cortado em 24 de 25 etapas); deitado em duas colunas (antes: o programa saía da tela). Celular físico: pendente. |
| P1-03 · Câmera e legibilidade | **Feito agora:** rótulos do cenário em dobro no celular (de 5,7 para 11,4 px de altura); a câmera reserva a faixa dos botões de toque (o explorador saía coberto pelo VER no celular pequeno). |
| 6.2 · Diagnósticos | **Feito agora:** "Você quis dizer acender_tocha()?" nos nomes errados (funções e variáveis, inclusive maiúsculas). |
| P1-04 · Outras tumbas no modelo do pátio | **Pendente**, como o documento pede: só depois de validar a tumba-piloto (Motores) com iniciantes. |
| P2-02 · Créditos e permissão da arte | **Pendente** (depende do autor da referência da personagem). |
| 6.3 · Métricas de desempenho | **Pendente.** |

### Entrega (seção 7 do documento)
- Resumo: esta seção 0 e o README. Testes: seção 4. Investigação da coleta antecipada e do áudio: tabelas P0 e G.
- Tutorial, puzzles alterados e salvamento: `b1-percurso` (o jogo inteiro, com o pátio novo e recarga depois de cada tumba).
- Comandos, variáveis e pistas durante a digitação: `b11-terminal`. Antes/depois de uma tumba: `capturas/C-motores-antes-depois.png`.
- Tela limpa no celular e Guia: `b13-tela`. Antes/depois: `capturas/F-celular-antes-depois.png`.
- Celular real e iniciantes: **não realizados** (roteiros nas seções 2 e 3).

### J — Documento de 18/10/2026: "Plano de melhorias" (execução, fases 1 a 4)
O plano manda validar com pessoas antes de mexer no ritmo e no texto. Por isso, nesta rodada, só a **Fase 1** e o **A04**
(P1 de aprendizagem) foram feitos; o resto ficou registrado, sem mudança no jogo. Testes novos: `b15-plano` e 3 verificações
em `l1-linguagem`.
| Item | Situação |
|---|---|
| A01 · Isolar ferramentas internas de teste | **Feito.** O `build.sh` gera a versão pública sem o arquivo do gancho (`23-teste.js`) e a de testes em `build/teste/`; o build falha se o gancho aparecer na pública. Aberta com `#vt`, a pública não cria `window.__vt` nem nada que mude fase, posição ou progresso (b15). Os testes automáticos usam a versão de testes. |
| A02 · Celular real | **Pendente (precisa de aparelho).** Formulário 1 em `FORMULARIOS_VALIDACAO.md`. |
| A03 · 3 a 5 iniciantes | **Pendente (precisa de pessoas).** Formulário 2 (ficha por pessoa, por etapa, explicação 0–2 e uma variação de transferência por tumba) e Formulário 3 (padrões). |
| A04 · Menos imitação | **Feito.** Previsão em uma prática guiada de cada tumba (s1, d3, a1, b3), com resposta na hora e conferência na execução seguinte; alternativas plausíveis na paleta de a1 (`if` sem `else`, `==`, `<`) e b3 (`for`, `<=`), que falham em alguma situação (l1). t1 continua com uma instrução só (é a primeira apresentação); d0 e a0 são demonstrações (o jogador não monta código); d1 e d2 já tinham valores que não servem (fusível desligado, galão 3,14, placa "5", "abrir"). |
| B01–B04 · Ritmo, textos, acabamento, orientação | **Aguardando os testes**, como o plano pede ("aplicar após a primeira rodada"). Os formulários anotam porta selada, textos pulados e onde a pessoa trava. |
| C01 · QA manual | **Pendente (aparelho real).** Itens 10–16 e a parte de computador do Formulário 1 (interrupções, áudio, fluidez, teclado, leitor de tela). |
| C02 · Créditos | **Pendente.** Depende da equipe: quem desenhou a personagem, o que foi autorizado e a separação entre arte original e adaptação. |
| C03 · Ponte com Python real | Parcial (já existia): o Guia diz que o editor é um pedaço do Python e o que ele não tem; erros dizem quando "em Python seria permitido". Exemplos comparativos e desafios finais fora do jogo: **pendentes** (P3). |
| C04 · Relatório exportável | **Pendente** (P3). |
| Fase 1 · Conferir a compilação e rodar os testes | **Feito**: suíte inteira passando (seção 4). |

### K — Pedido "Melhorias do jogo Vale das Tumbas 2D" (10 seções)
Feito sobre a versão atual, sem refazer nada do zero: protagonista, sprites, história, as quatro eras, o save e a Vercel
continuam. Testes novos: `l3-relatorio` e `b16-melhorias`; `l1`, `l2`, `b1`, `b7` e `b15` ganharam verificações.
| Seção | O que foi feito | Situação |
|---|---|---|
| 1 · Previsões | **Bug corrigido:** as previsões guiadas falavam de um código fixo (ex.: "if energia >= 5 … else") mesmo quando o jogador tinha escrito outra solução correta; e as de corrigir comparavam a resposta com a situação que estivesse escolhida, não com a da pergunta (a4 pergunta sobre 95 graus). Agora a resposta certa é calculada **executando o programa do jogador** (a1, b3) ou uma variação dele, mostrada por escrito (d3); s1 é rotulada como pergunta de conceito; as de corrigir falam do "programa como está agora" e escolhem a situação da pergunta. O feedback mostra a resposta certa e o caminho da execução, linha por linha. No Passo a passo, tudo o que muda (variável, sensor, `i`) fica marcado "antes → depois". Situação que passou com outro programa vira ↻. | Feito e testado (l1, b15, b16) |
| 2 · Equilíbrio das tumbas | O Reator terminava numa etapa de corrigir: ganhou a **aplicação final** a5 (dois sensores, limite numa variável, prioridade das regras, caso de fronteira em 80 graus). Agora as quatro tumbas terminam com uma etapa de aplicação (s2, d6, a5, b4). Alternativas plausíveis na paleta (a1, b3, a5 com cinco operadores). Saves antigos: quem já tinha terminado o Reator ganha a a5 (revisão 4 do save). | Feito (l1, l2, b1). **Não feito:** novas interações físicas (alavancas, válvulas) nas Engrenagens, Reator e Viva no modelo do pátio dos Motores — o plano anterior pede validar a tumba-piloto com iniciantes antes de replicar. |
| 3 · Interface | Fileira própria e cores para Executar (verde), Passo (azul), Parar (vermelho) e Reiniciar (âmbar), sem rótulos cortados nos 10 tamanhos de tela testados (no celular pequeno deitado, só a palavra, sem o ícone); atalhos Ctrl+Enter, Ctrl+Shift+Enter, Ctrl+. e Alt+R; a tarefa some no celular pequeno quando o erro do modo Escrever precisa do espaço. | Feito (b4, b14, b16). Toque real: pendente. |
| 4 · Textos | **🎯 TAREFA** em uma frase em cada uma das 26 etapas, separada do enunciado e das respostas; enunciados de d0, d1, a0, b3 e c1 mais curtos; Dica sugerida depois de três erros seguidos (sem dar a resposta). | Feito. Revisão com iniciantes: pendente. |
| 5 · Orientação | Lembrete gentil quando o objetivo não muda por ~2,5 min (no máximo dois por objetivo, sem resolver); concluídas e pendentes no relatório. Bússola, ◆ e trilhas já existiam. | Feito (b16) |
| 6 · Python | Painel separa "🎮 funções das máquinas (só no jogo)" de "🐍 estruturas do Python"; Guia ganhou "Do jogo para o Python de verdade" (o que é Python, o que é do jogo, print/def/input, exemplo com print). Interpretador **não** foi ampliado. | Feito (b16) |
| 7 · Relatório | Aba **📊 Relatório** no Diário e botão na pausa: concluídas/pendentes, conceito, tentativas, erros, dicas, previsão e data; **TXT, CSV e Copiar**. Só dados novos (save revisão 4); nada inventado; sem nome. PDF: não (sem biblioteca externa; o TXT imprime). | Feito (l3, l2, b16) |
| 8 · Preservação | Personagem, sprites, história e eras intactos; save antigo compatível; gancho fora da versão pública; sem bibliotecas novas; mesmo `vercel.json`. | Conferido (l2, b3, b6, b15) |
| 9 · Testes | Os 12 itens pedidos têm teste automático (movimento e colisões: b6/b8; objetos: b5/b8; comandos certos e errados: l1/b1/b2; reinício: b2; previsões e alternativas: l1/b15/b16; quatro ambientes e história até a Cidade-Jardim: b1; save: l2/b3; resoluções: b4/b14; editor no celular: b9/b14; exportação: l3/b16; versão pública sem ferramentas: b15). | 847 verificações passando |

### L — Pedido "três melhorias" (celular 360 × 640, interações nas tumbas, legibilidade)
Só estas três; nada recriado. Personagem e sprites intocados, nenhuma tumba nova, etapas, dicas, previsões e relatório
iguais, save sem campo novo (o estado das interações vale só para a visita). Teste novo: `b17-exploracao` (23 verificações).
| Melhoria | O que foi feito | Situação |
|---|---|---|
| 1 · Editor em 360 × 640 | Painel compacto em celular em pé até 760 px de altura: o programa vem logo depois da tarefa (Comandos e variáveis recolhível passa para baixo); controles em duas fileiras (botões auxiliares só com a palavra; ícones somem abaixo de 400 px; os de execução abaixo de 340 px); "Limpar" deixou de ser cortado; textos do painel ≥ 11 px. Medido ao abrir o painel em t1, s2, d1, a3, a5, b4 e c1: programa à vista com 55 a 155 px (antes: em todas as 7, o programa começava abaixo dos botões, com 99 a 269 px a rolar e controles em três fileiras; agora 0 a 72 px a rolar, só para chegar a Comandos e variáveis), Executar sempre na tela, sem rolagem para o lado. | Feito (b17; b4, b9, b14 e b16 continuam passando). Toque real: pendente. |
| 2 · Interações nas tumbas | Uma por tumba, opcional, com objetos que já existiam e só o conceito da própria tumba: **alavancas** vapor/freio/trava param os pistões das Engrenagens (sequência); **painel de blindagem** do Reator, com radiação sorteada e regra se/senão, contém a radiação (if/else); **bomba de seiva** da Viva, bombear enquanto < 3, acalma os clones diante da canção errada (while). Erro nunca fere nem trava; ninguém precisa delas para passar. | Feito (b17). Ritmo com iniciantes: pendente. |
| 3 · Legibilidade | Informação essencial dos puzzles em painéis de texto (DOM, com o tamanho do painel de diálogo), não só em pixels: *Manual dos pistões*, *Regra da blindagem*, *Bomba de seiva*, etiqueta das máquinas dos Motores (antes um aviso que sumia); tabuleiro das Engrenagens e canteiros da Viva/Cidade-Jardim em texto dentro do painel de programação, acompanhando a execução. | Feito (b17). Leitura em tela real: pendente. |

**Limites desta validação:** Chromium sem janela com aparelhos simulados (tamanho, densidade e toque), sem celular físico,
sem teclado virtual real, sem som ouvido e sem iniciantes. "Menos interações físicas" foi lido como poucas interações leves
e opcionais (três toques na ordem, uma escolha, até três bombeadas), sem novas caminhadas obrigatórias.

### M — Câmara Final: as fases 2, 3 e 4 do Devorador
A câmara tinha só a fase 1 (sequência), embora o texto falasse em quatro. Agora são quatro desafios (`k1` a `k4`), um por saber,
e o guardião só é purificado depois dos quatro. Teste novo: verificações em `l1` (soluções e atalhos que falham), `b18`
(as três fases na sala, golpes por fase, placas) e `b1` (o jogo inteiro passa pelas quatro fases).
| Fase | Como o saber é posto à prova | Atalho que falha (testado) |
|---|---|---|
| 2 · Variáveis | `frequencia` (int) e `potencia` (float); a camada externa vibra em 7 e a interna em 9 | disparar duas vezes sem mudar a frequência; `"7"` em texto; potência vazia |
| 3 · Decisões | sensor `furia`, cinco situações com as fronteiras 7 e 4 | condições na ordem errada; `>` no lugar de `>=` |
| 4 · Repetições | quatro selos (`for`) e núcleo 3, 5 ou 1 (`while`), em 4 linhas | `for` fixo no núcleo; purificar antes dos selos; `while nucleo >= 0` |

Limites: Chromium sem janela; o ritmo da luta (golpes durante as fases 2 a 4) e a clareza das placas precisam de teste com
iniciantes.

## 1. O documento, item por item

### P1 — Relação entre o jogo e o Python
| Pedido | Situação |
|---|---|
| Explicar que os contêineres têm contratos próprios | **Feito.** Assunto novo no Guia, "Regras das máquinas" (`quantidade: int` como anotação de tipo). Cada contêiner no painel mostra "aceita int (inteiro)", o nome e o valor atual. |
| Distinguir sintaxe, nome desconhecido, tipo recusado pela máquina e objetivo não alcançado | **Feito.** A área de erro diz a origem com cor própria: *Erro de Python*, *Regra desta máquina (não é erro do Python)*, *O Python tem, o editor do jogo não*, *Linha que não faz nada*, *O mecanismo não conseguiu*, *Objetivo ainda não alcançado*, *Limite de segurança do jogo*. |
| "texto/string — str em Python" e "booleano — bool em Python" | **Feito.** Os tipos aparecem como `int (inteiro)`, `float (decimal)`, `str (texto, a string)` e `bool (booleano)`, no painel, no Guia e nas mensagens. |
| Dizer, numa frase, o que o editor aceita | **Feito.** Assunto "O que o editor aceita" no Guia, a mesma frase no modo Escrever e na fala do Lume. Quem escreve `print`, `def`, `and`, `*` ou `range(2, 5)` recebe "existe no Python, mas não neste editor". |
| Preservar 5 × "5" e mostrar valor recebido e tipo esperado | **Já existia; o texto foi corrigido.** Antes a recusa era chamada de TypeError. Agora: *"A máquina recusou o valor: carga só aceita int (inteiro). O programa tentou guardar "12", que é um texto (str). Em Python, carga = "12" seria permitido…"* |
| Não sugerir que atribuir texto é proibido em Python | **Feito**, e as regras de comparação passaram a seguir o Python: `5 == "5"` dá False (com aviso), `5 < "5"` dá TypeError, textos se comparam em ordem alfabética, bool vale 0/1, `if n:` usa a verdade do valor. Um nome novo (`y = 2`) explica que o Python criaria a variável e que a regra de usar só os contêineres da sala é do jogo. |

### P1 — Aprendizagem além da imitação
| Pedido | Situação |
|---|---|
| Treino curto como familiarização | **Mantido**, com um passo a mais (9 passos). |
| Máquina de duas ações em ordem, com previsão, execução e correção | **Feito.** No pátio, o portão tem trava: o programa vem como `erguer_portao()` / `destravar_portao()`. O jogador prevê, executa, vê o portão travado e corrige a ordem. |
| Demonstração, prática com ajuda e desafio diferente em cada tumba | **Conferido e completado.** Engrenagens e Reator já tinham os três momentos. Nos Motores faltava o desafio independente: entrou a **bomba de combustível** (dois tanques, 2,5 L e 4,0 L, sem galão de 4,0: guardar, usar e alterar `energia` e `combustivel`). Na Viva faltava a demonstração: entrou **repetir sem copiar** (4 linhas × `for`). Há teste automático que confere os três momentos nas quatro tumbas. |
| Desafio final com objetivo e condições, sem a sequência pronta | **Já existia** (aplicações e Cidade-Jardim começam sem código e sem guia). |
| Aceitar soluções alternativas | **Já existia** (o jogo confere o resultado no mecanismo). Agora há teste com soluções diferentes das sugeridas (ex.: `combustivel = 4.0` direto). |
| Associar cada relíquia ao conhecimento | **Já existia**; a relação é explicada na boas-vindas, no diário e no Guia ("Palavras do jogo"). |
| Diário com explicação do conceito e o programa do jogador | **Feito.** O jogo guarda o programa que resolveu cada etapa; em "Saberes", cada saber mostra o conceito e o *seu programa* (o da aplicação independente). |
| Previsão do resultado | **Feito** nas etapas com código pronto (portão do treino e as quatro etapas de corrigir). Ela é conferida no fim da tentativa e dá para pular. |

### P1 — Leitura dos objetos e das colisões
| Pedido | Situação |
|---|---|
| Terminal com silhueta ou sinal luminoso próprio | **Feito.** O terminal do pátio ganhou mastro com lâmpada, faixas de latão e tela, além de luz própria (amarela; verde depois da manivela). |
| Alvo da etapa com símbolo e texto curto, além de cor | **Feito.** Marcador "◆ Programe aqui", "◆ Manivela", "◆ Tumba das Engrenagens"… no treino, nas tumbas, no vale e na Cidade-Jardim. |
| Nome do objeto ao entrar no alcance | **Feito.** O nome aparece em cima do objeto (dourado quando é o alvo da etapa). A ação continua no aviso de baixo. |
| Contorno ou transparência quando algo importante fica encoberto | **Feito.** O obstáculo encoberto pelo explorador aparece por cima, semitransparente e com contorno ciano; atrás de um objeto alto, o contorno do explorador aparece por cima. |
| Revisar colisões de fogueiras, rochas, terminais e portas | **Feito.** A fogueira do pátio estava no caminho entre a manivela e o terminal e foi movida para junto da barraca. Um teste confere as 508 caixas de colisão de todas as áreas (nenhuma passa do desenho), que o caminho da manivela ao terminal é livre e que todos os pontos do treino são alcançáveis a pé. |
| Colisão do protagonista na base; a bengala não bloqueia | **Já existia e foi conferido pelo código**: a colisão é uma caixa de 12×6 px nos pés; a bengala não entra nela (teste b6: passagem de 1 tile e porta da tumba). |

### P2 — Guia
| Pedido | Situação |
|---|---|
| Agrupar por sequência, dados, decisões e repetições | **Feito**, mais um grupo "Ajuda" (recuo, tipos de erro, o que o editor aceita, palavras do jogo, seus exemplos). |
| Destacar os assuntos da tumba atual | **Feito.** O grupo da tumba vem marcado com ★ e já aberto. |
| Conteúdo completo como consulta opcional | **Mantido**: os cinco grupos ficam sempre acessíveis. |
| Abrir no tópico do erro ou do comando selecionado | **Feito.** Botão "📖 Ver no Guia: …" na área de erro e "📖 …" no editor da linha selecionada. |
| Índice compacto para celular | **Feito**: uma fileira com os cinco grupos e, embaixo, os assuntos do grupo. Não há mais a faixa longa de botões. |
| Exemplos breves com o resultado esperado | **Feito**: cada assunto tem o código e "Resultado (o que acontece)". |
| Achar a explicação de um erro em até duas ações, sem perder o programa | **Feito e testado**: um toque em "Ver no Guia" abre o assunto, e ao fechar o painel e o programa continuam iguais. |

### P2 — Fim da execução passo a passo
| Pedido | Situação |
|---|---|
| Resultado final ao executar a última instrução | **Feito.** O clique extra só para "terminar" deixou de existir; o resultado aparece no mesmo toque. |
| Destacar a instrução atual e o objeto afetado | A linha já ficava destacada. **Novo**: um anel pulsante marca, na sala, o mecanismo que a instrução mexeu (vermelho no erro). |
| Valores antes/depois, condição avaliada e repetições | A condição com valores e o contador de voltas já existiam. **Novo**: a variável que mudou mostra "antes → depois" (ex.: `vazia → 5`). |
| Reiniciar separado de Limpar | **Já existia.** Agora os botões têm títulos explicativos ("Nova tentativa: o programa continua igual"). |

### P2 — Coerência visual e vocabulário
| Pedido | Situação |
|---|---|
| Marcas próprias para as quatro tumbas | As torres e os feixes de luz por era já existiam. **Novo**: emblema com o símbolo do saber, iluminado na cor da tumba. |
| Bengala acompanhando o passo e o chão | **Ajustado**: no primeiro passo a ponta fica no chão e recua mais; no segundo ela sobe em arco e volta a apoiar. |
| Densidade de detalhes, sombras e contornos entre personagem e cenário | **Parcial**: o terminal e as entradas ganharam detalhe, e todo sprite tem contorno escuro de 1 px. Uma revisão artística completa de todo o cenário não foi feita. |
| Relíquias × saberes, singular/plural, nomes distintos | **Feito.** A relação é explicada uma vez (boas-vindas, diário, Guia). "1 etapa concluída" está corrigido, assim como as contagens de peças e tochas. Um glossário no Guia define instrução, função, programa, tentativa, etapa, saber e relíquia. |

### Validações pendentes (seção 5 do documento)
| Item | Situação |
|---|---|
| Interromper e reiniciar sem apagar o programa; uma execução por vez; laços sem fim limitados; programar não expõe a perigos | **Testado** (b2). |
| Recarregar depois de cada tumba | **Testado** (b1 recarrega depois das quatro tumbas e confere etapas, relíquias e programas). |
| Armazenamento indisponível | **Testado com simulação** (b9): o jogo segue e avisa que o progresso não será salvo. |
| Teclado virtual cobrindo código, erro ou Executar | **Tratado e testado com simulação** (b9): o painel sobe acima do teclado. Precisa de conferência em aparelho real. |
| Voltar de outro aplicativo | **Tratado e testado com simulação** (b9): ao sair, pausa, salva e silencia; ao voltar, espera na pausa. Precisa de conferência em aparelho real. |
| Sem rolagem horizontal; controles do editor acessíveis | **Testado** em 10 tamanhos de tela (b4) e com o painel aberto no modo Escrever (b9). |
| Dados: 0, False, vazio, 5 e "5"; nome, tipo exigido e valor atual | **Testado** (l1, b1). |
| Celular real, áudio, áreas de toque na prática | **Não verificável aqui**: roteiro abaixo. |
| Teste com iniciantes | **Não verificável aqui**: roteiro abaixo. |

## 2. Roteiro em celular real (retrato e paisagem)
Faça num Android (Chrome) e num iPhone (Safari), em pé e deitado, com som ligado.
1. Abrir https://vale-das-tumbas-2d.vercel.app, tocar em **Novo jogo**: o pátio aparece, o objetivo e o marcador "◆ Ande até aqui" estão legíveis.
2. Arrastar o joystick e, ao mesmo tempo, tocar em **AÇÃO** perto do Lume: o explorador anda e a conversa abre (toque simultâneo).
3. Conferir se a câmera começa afastada e se o personagem e os textos continuam legíveis; tocar em **VER** e de novo: aproxima e afasta.
4. Encaixar a manivela, abrir o **Guia**, abrir o editor: os botões têm pelo menos 40 px e nenhum fica cortado; não há rolagem para o lado.
5. Tocar em **✎ Escrever**: o teclado abre; o campo de código, a área de erro e **▶ Executar** continuam visíveis acima dele.
6. Escrever `acender_toxa()` e executar: o erro aparece com a linha e a origem ("Erro de Python"); "📖 Ver no Guia" abre e volta sem perder o texto.
7. Na etapa 2 do treino, responder a previsão, executar, corrigir a ordem: o portão abre e o cadeado fica verde.
8. Trocar para outro aplicativo por 10 s e voltar: o jogo está na pausa, o som volta ao continuar.
9. Fechar a aba, abrir de novo e tocar em **Continuar**: o progresso volta.
10. Ouvir: a trilha do vale (de dia e à noite), a de cada tumba, passos, pássaros, grilos, fogo e água, sons do painel; na pausa, mexer em Música e Efeitos.
11. Nos Motores: ler a placa com !, levar uma cápsula errada e uma certa às máquinas, atravessar a ponte; no terminal, usar Comandos e variáveis e o modo Escrever com o teclado aberto; testar 🔍 Ver a sala.
12. Ainda no pátio, mexer depressa em várias cápsulas e máquinas: no máximo dois avisos, abaixo do HUD, sem cobrir o explorador; a cápsula da mão aparece no HUD; depois de uns 9 s o objetivo encolhe e abre com um toque. No Guia, conferir que o exemplo de código aparece inteiro e que a fileira de assuntos rola para o lado.
Anote o aparelho, o navegador e o que falhou (com captura de tela).

## 3. Roteiro de teste com iniciantes (3 a 5 pessoas)
- **Sem explicação externa.** Diga só: "É um jogo; jogue como quiser por 30 minutos, falando em voz alta o que pensa."
- **Observe e anote** (sem ajudar): onde a pessoa pede ajuda; qual objeto ela não reconhece ou procura ao acaso; se usa o
  Lume, o Guia, a Dica e o Passo a passo; quanto tempo fica parada diante de um erro e se a área de erro resolve.
- **Ao fim de cada tumba**, peça que a pessoa explique em voz alta o programa que montou: o que cada linha faz e por que a
  ordem é aquela. Pergunte: *"Por que "5" com aspas não entrou no contêiner? Em Python isso daria erro?"*
- **Aplicação independente**: veja se a pessoa resolve a bomba dos Motores e a rotina da Viva sem copiar uma dica.
- **Pátio dos Motores** (protótipo da tumba nova): a pessoa percebe por que "2.5" foi recusado? Lê a placa com ! antes ou
  depois de errar? Compare com quem jogou a versão anterior (holofote) se possível: tempo parado, pedidos de ajuda, explicação.
- **Conforto**: pergunte, depois de 30 minutos, se algo cansou a vista e onde (painel, salas escuras, textos pequenos).
- **Não use só o tempo** como medida. Prefira: explicações corretas, número de dicas pedidas por etapa, erros diferentes
  encontrados e corrigidos, e se a pessoa resolve uma variação nova sem ajuda.
- Depois, compare as anotações e procure padrões (o mesmo objeto, a mesma mensagem ou a mesma etapa).

## 4. Testes automáticos executados
`2d/test/rodar.sh` (Node + Chromium sem janela): l1-linguagem, l2-save, b1-percurso, b2-painel, b3-save, b4-telas,
b5-perigos, b6-personagem, b7-ajuda, b8-leitura, b9-validacoes e, nesta atualização, b10-recompensa, b11-terminal,
b12-vale-som, b13-tela, b14-mvp, b15-plano, l3-relatorio, b16-melhorias e, nesta atualização, b17-exploracao: **870 verificações, todas passando**. O README lista o que cada um confere.
