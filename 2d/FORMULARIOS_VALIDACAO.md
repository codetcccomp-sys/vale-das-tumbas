# Formulários de validação — Vale das Tumbas 2D

Fase 1 do *Plano de melhorias* (18/10/2026): formulários simples para registrar o teste em **celular real** (A02), com
**iniciantes** (A03) e a **bateria manual de qualidade** (C01). Os roteiros completos estão em `VALIDACAO.md`, seções 2 e 3;
aqui ficam só os campos a preencher. Imprima, copie para uma planilha ou para um formulário on-line.

**Versão testada:** endereço `https://vale-das-tumbas-2d.vercel.app` · data da publicação: ________ · commit: ________

> Sem dados pessoais. Identifique cada pessoa por um código (P1, P2…) e cada aparelho por um código (D1, D2…).
> Não grave rosto nem voz sem autorização por escrito. O progresso fica só no navegador do aparelho usado.

---

## Formulário 1 — Aparelho real (A02 + C01)

Um formulário por **aparelho × navegador**. Faça em pé e deitado, com som ligado.

| Campo | Resposta |
|---|---|
| Código do aparelho | D__ |
| Modelo / sistema (ex.: Galaxy A15 · Android 14; iPhone 12 · iOS 17) | |
| Navegador e versão | |
| Tamanho da tela (se souber) / aparelho simples ou bom | |
| Quem testou · data · duração | |

Marque **OK**, **Problema** (descreva em "Problemas encontrados") ou **Não testado**.

| # | Verificação | Em pé | Deitado |
|---|---|---|---|
| 1 | Novo jogo: história aparece, pode pular; o pátio e o objetivo são legíveis | | |
| 2 | Joystick + **AÇÃO** ao mesmo tempo (anda e interage) | | |
| 3 | **VER** aproxima e afasta; textos e personagem continuam legíveis | | |
| 4 | Objetos e pistas: dá para saber o que é cada coisa (rótulos legíveis) | | |
| 5 | Abrir e fechar: Guia, Diário, pausa, painel de programação | | |
| 6 | Nenhum botão essencial cortado ou coberto; nenhuma rolagem para o lado | | |
| 7 | **✎ Escrever**: com o teclado aberto, código, área de erro e **▶ Executar** visíveis | | |
| 8 | Erro de propósito (`acender_toxa()`): linha, explicação e "Você quis dizer…" aparecem | | |
| 9 | Previsão (🔮): os botões cabem; a resposta aparece e Executar confere | | |
| 10 | Trocar de aplicativo por 10 s e voltar: jogo em pausa, som volta ao continuar | | |
| 11 | Bloquear a tela e desbloquear: jogo em pausa, nada perdido | | |
| 12 | Fechar a aba, abrir de novo, **Continuar**: progresso e programas voltam | | |
| 13 | Atualizar a página no meio de uma tumba: volta no ponto salvo | | |
| 14 | Música e Efeitos: volumes separados funcionam; troca de trilha entre vale e tumbas | | |
| 15 | Fluidez: vale à noite e tumba Viva sem engasgos perceptíveis (anote se houver) | | |
| 16 | Endereço com `#vt` no fim: o jogo abre normalmente, sem nada estranho | | |

**Só no computador** (C01): navegar o menu e o Guia só com **Tab/Enter/Esc** ( OK / Problema ) · leitor de tela
(NVDA, VoiceOver ou TalkBack) lê os botões do menu e os textos do Guia ( OK / Problema ).

### Problemas encontrados (um por linha)

| Nº | Verificação | Passos para reproduzir | Esperado | O que aconteceu | Captura (nome do arquivo) | Gravidade (bloqueia / atrapalha / detalhe) |
|---|---|---|---|---|---|---|
| | | | | | | |

---

## Formulário 2 — Sessão com iniciante (A03)

Uma ficha por pessoa. **30 minutos sem orientação.** Diga só: *"É um jogo; jogue como quiser, falando em voz alta o
que pensa."* Não ajude; se a pessoa travar mais de 5 minutos, anote e só então diga onde fica o Lume.

| Campo | Resposta |
|---|---|
| Código da pessoa | P__ |
| Já programou antes? (nunca / um pouco / sim) | |
| Já joga no celular/computador? (pouco / às vezes / muito) | |
| Aparelho usado (código do Formulário 1) | D__ |
| Data · observador | |

> Dica para o observador: no fim da sessão, abra **Diário › 📊 Relatório** e baixe o CSV. Ele traz, por etapa, tentativas,
> tentativas com erro, dicas e a resposta da previsão registradas pelo próprio jogo (sem nome). Use-o para conferir as
> anotações abaixo, não para substituí-las.

### Durante o jogo

| Campo | Anotação |
|---|---|
| Tempo até sair do treino (min) | |
| Tempo até entrar na primeira tumba (min) | |
| Tentou entrar em porta selada? Quantas vezes? Achou sozinha a tumba certa? | |
| Usou: Lume ( ) · Guia ( ) · Dica ( ) · Passo a passo ( ) · Diário ( ) · bússola/objetivo ( ) | |
| Locais de confusão (onde, o que disse) | |
| Pistas essenciais ignoradas / informações opcionais tratadas como obrigatórias | |
| Pontos de abandono ou de irritação | |
| Leu os enunciados inteiros? Pulou textos? Onde? | |

### Por etapa (preencha as que a pessoa alcançou)

| Etapa | Tentativas | Dicas pedidas (0–3) | Erros diferentes vistos | Corrigiu sozinha? | Previsão 🔮 (acertou / errou / pulou) |
|---|---|---|---|---|---|
| t1 · primeiro comando | | | | | — |
| t2 · a ordem importa | | | | | |
| s1 · percurso 1 | | | | | |
| s3 · corrija o autômato | | | | | |
| s2 · percurso 2 (aplicação) | | | | | — |
| d1 · os quatro tipos | | | | | — |
| d2 · 5 ou "5"? | | | | | — |
| d3 · a máquina lê a variável | | | | | |
| d4 · mudar o valor | | | | | — |
| d5 · corrija a ficha | | | | | |
| d6 · bomba (aplicação) | | | | | — |
| a1 · a comporta | | | | | |
| a2 · portão (aplicação) | | | | | — |
| a3 · três caminhos | | | | | — |
| a4 · corrija a ordem | | | | | |
| a5 · painel de segurança (aplicação) | | | | | — |
| b0 · quatro tochas | | | | | — |
| b1 · regar 4 | | | | | — |
| b2 · corrija | | | | | |
| b3 · while | | | | | |
| b4 · rotina (aplicação) | | | | | — |
| c1 · desafio final | | | | | — |

### Ao fim de cada tumba: explicação e transferência

Peça: *"Explique o seu programa: o que cada linha faz e por que nessa ordem."* Depois proponha a **variação** (não aparece
nas dicas) e peça a resposta **sem executar**.

Nota da explicação: **0** não explica · **1** descreve o que acontece, sem o porquê · **2** explica a ordem/condição/tipo.

| Tumba (conceito) | Variação proposta | Resposta da pessoa | Nota (0–2) |
|---|---|---|---|
| Engrenagens (sequência) | "Se o destino do percurso 1 estivesse uma casa mais à direita, o que mudaria no programa?" (esperado: mais um `avancar()` depois do `virar_direita()`) | | |
| Motores (variáveis e tipos) | "O pedido agora é de 7 peças e depois de 10. Escreva o programa." (esperado: `quantidade = 7`, `separar_lote()`, `quantidade = quantidade + 3` ou `= 10`, `separar_lote()`) · "Por que `"7"` não entra?" | | |
| Reator (decisões) | "E se a comporta abrisse com 6 ou mais? Com energia 6, o que roda?" (esperado: muda para `>= 6`; com 6, abre) · "Por que a ordem dos `elif` importa?" | | |
| Viva (repetições) | "E se fossem 6 organismos, um a cada duas casas?" (esperado: `range(6)` com `irrigar()` e dois `avancar()`) · "Quando o `while` não executa nenhuma vez?" | | |

### No fim da sessão (2 minutos)

| Pergunta | Resposta |
|---|---|
| O que você aprendeu? (com as palavras da pessoa) | |
| O que foi mais difícil? | |
| Algo cansou a vista? Onde? | |
| Algum texto longo demais? Qual? | |

---

## Formulário 3 — Consolidação (depois de 3 a 5 sessões)

Junte as fichas e procure **padrões** (a mesma etapa, o mesmo objeto, a mesma mensagem). Corrija pelo padrão, não pelo tempo.

| Padrão observado | Em quantas pessoas (x de N) | Etapa / tela | Evidência (código da ficha) | Correção proposta | Item do plano (A04, B01–B04…) |
|---|---|---|---|---|---|
| | | | | | |

| Indicador | P1 | P2 | P3 | P4 | P5 |
|---|---|---|---|---|---|
| Explicações nota 2 (de 4 tumbas) | | | | | |
| Variações certas sem ajuda (de 4) | | | | | |
| Dicas pedidas no total | | | | | |
| Etapa onde mais travou | | | | | |
| Concluiu a primeira tumba sem ajuda externa? | | | | | |

**Critério do plano:** cada iniciante explica a lógica de ao menos uma solução própria por conceito (nota 2), e as correções
seguintes saem dos padrões desta tabela.
