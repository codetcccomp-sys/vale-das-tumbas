# Validação — Vale das Tumbas 2D

Este arquivo responde ao documento *"Análise crítica e plano de melhorias"* (17/10/2026), item por item. Ele separa três
coisas: o que **já existia** quando a análise foi feita, o que **foi feito agora** e o que **só pode ser conferido fora
daqui** (num celular de verdade ou com estudantes). Os testes automáticos rodam num Chromium sem janela, com telas de
celular, tablet e computador simuladas; eles não substituem um aparelho real nem pessoas jogando.

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
3. Tocar em **VER** e de novo: a câmera afasta e volta.
4. Encaixar a manivela, abrir o **Guia**, abrir o editor: os botões têm pelo menos 40 px e nenhum fica cortado; não há rolagem para o lado.
5. Tocar em **✎ Escrever**: o teclado abre; o campo de código, a área de erro e **▶ Executar** continuam visíveis acima dele.
6. Escrever `acender_toxa()` e executar: o erro aparece com a linha e a origem ("Erro de Python"); "📖 Ver no Guia" abre e volta sem perder o texto.
7. Na etapa 2 do treino, responder a previsão, executar, corrigir a ordem: o portão abre e o cadeado fica verde.
8. Trocar para outro aplicativo por 10 s e voltar: o jogo está na pausa, o som volta ao continuar.
9. Fechar a aba, abrir de novo e tocar em **Continuar**: o progresso volta.
10. Ouvir: passos, pássaros de dia, grilos à noite, fogo e água perto dos braseiros e do poço, sons do painel.
Anote o aparelho, o navegador e o que falhou (com captura de tela).

## 3. Roteiro de teste com iniciantes (3 a 5 pessoas)
- **Sem explicação externa.** Diga só: "É um jogo; jogue como quiser por 30 minutos, falando em voz alta o que pensa."
- **Observe e anote** (sem ajudar): onde a pessoa pede ajuda; qual objeto ela não reconhece ou procura ao acaso; se usa o
  Lume, o Guia, a Dica e o Passo a passo; quanto tempo fica parada diante de um erro e se a área de erro resolve.
- **Ao fim de cada tumba**, peça que a pessoa explique em voz alta o programa que montou: o que cada linha faz e por que a
  ordem é aquela. Pergunte: *"Por que "5" com aspas não entrou no contêiner? Em Python isso daria erro?"*
- **Aplicação independente**: veja se a pessoa resolve a bomba dos Motores e a rotina da Viva sem copiar uma dica.
- **Não use só o tempo** como medida. Prefira: explicações corretas, número de dicas pedidas por etapa, erros diferentes
  encontrados e corrigidos, e se a pessoa resolve uma variação nova sem ajuda.
- Depois, compare as anotações e procure padrões (o mesmo objeto, a mesma mensagem ou a mesma etapa).

## 4. Testes automáticos executados
`2d/test/rodar.sh` (Node + Chromium sem janela): l1-linguagem, l2-save, b1-percurso, b2-painel, b3-save, b4-telas,
b5-perigos, b6-personagem, b7-ajuda, b8-leitura e b9-validacoes. O README lista o que cada um confere.
