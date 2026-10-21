// Grava a gameplay completa do Vale das Tumbas 2D, com legendas: história, treino, as quatro tumbas com todas as etapas,
// Câmara Final, Cidade-Jardim, final e diário. Usa a versão de testes (build/teste/) para guiar o explorador.
// Uso (depois de ./build.sh), na pasta 2d:  node test/ferramentas/gravar-video.js   (ou "seco" para conferir sem gravar)
// Sai em test/shots/video/: o .webm do Playwright e, com o ffmpeg instalado, o .mp4 (H.264, 1280×720, sem som).
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const ROOT=path.resolve(__dirname,'..','..');const {ui}=require(ROOT+'/test/ui');
const OUT=path.join(ROOT,'test','shots','video');fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});
const SO=process.argv[2]||'tudo';   // permite gravar só um trecho para conferir
(async()=>{
  const browser=await chromium.launch({headless:true});
  const SECO=SO==='seco';const ctx=await browser.newContext(Object.assign({viewport:{width:1280,height:720},deviceScaleFactor:1},SECO?{}:{recordVideo:{dir:OUT,size:{width:1280,height:720}}}));
  const page=await ctx.newPage();const erros=[];page.on('pageerror',e=>erros.push(e.message));
  await page.route('**/*',r=>{const u=r.request().url();return u.startsWith('file://')||u.startsWith('data:')?r.continue():r.abort();});
  await page.goto('file://'+ROOT+'/build/teste/vale-das-tumbas-2d.html#vt-treino-historia');await page.waitForFunction(()=>window.__vt);
  const U=ui(page),ev=U.ev,W=ms=>page.waitForTimeout(SECO?Math.min(ms,2000):ms);
  /* legenda (canto de baixo, à esquerda) e cartões de capítulo */
  await ev(()=>{const s=document.createElement('style');s.textContent=`#legV{position:fixed;left:22px;bottom:22px;max-width:430px;z-index:99999;background:rgba(14,9,6,.9);color:#fff2cc;border:2px solid #c8a24a;
      padding:10px 14px;font:700 18px/1.3 system-ui,sans-serif;box-shadow:0 4px 0 #0b0705;pointer-events:none;transition:opacity .3s}#legV[hidden]{display:none}
      #cartV{position:fixed;inset:0;z-index:100000;background:#120b07;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ffd24a;font:800 46px/1.2 system-ui,sans-serif;text-align:center;pointer-events:none;transition:opacity .5s}
      #cartV small{display:block;margin-top:14px;color:#e8d8b0;font:600 22px/1.35 system-ui,sans-serif;max-width:900px}#cartV.fora{opacity:0}`;document.head.appendChild(s);
    const l=document.createElement('div');l.id='legV';l.hidden=true;document.body.appendChild(l);const c=document.createElement('div');c.id='cartV';c.className='fora';document.body.appendChild(c);
    /* anda de verdade (joystick virtual) por uma lista de pontos; se travar numa parede, pula para o ponto */
    window.__andar=(pts,correr)=>new Promise(res=>{let i=0,ult=performance.now(),px=G.p.x,py=G.p.y;
      const f=()=>{if(i>=pts.length||G.mode!=='play'){IN.joy.on=false;IN.joy.x=IN.joy.y=0;return res(true);}
        const [x,y]=pts[i],dx=x-G.p.x,dy=y-G.p.y,d=Math.hypot(dx,dy);
        if(d<5){i++;ult=performance.now();return requestAnimationFrame(f);}
        const k=correr?1.25:0.9;IN.joy.on=true;IN.joy.x=dx/d*k;IN.joy.y=dy/d*k;
        if(Math.hypot(G.p.x-px,G.p.y-py)>2){px=G.p.x;py=G.p.y;ult=performance.now();}
        else if(performance.now()-ult>700){__vt.ir(x,y,G.p.dir);i++;ult=performance.now();}
        requestAnimationFrame(f);};requestAnimationFrame(f);});});
  const leg=async(t,ms)=>{await ev(t=>{const l=document.getElementById('legV');if(!t){l.hidden=true;return;}l.hidden=false;l.textContent=t;},t);if(ms)await W(ms);};
  const cartao=async(t,s,ms)=>{await ev(([t,s])=>{const c=document.getElementById('cartV');c.innerHTML='';c.append(t);if(s){const m=document.createElement('small');m.textContent=s;c.append(m);}c.className='';},[t,s]);await W(ms||2600);
    await ev(()=>{document.getElementById('cartV').className='fora';});await W(500);};
  const andar=(pts,correr)=>ev(([p,c])=>__andar(p,c),[pts,!!correr]);
  const usar=async()=>{await page.keyboard.press('KeyE');await W(250);};
  /* chega perto andando e usa (a posição exata vem de usarEm, como nos testes) */
  const irUsar=async(x,y,dir,ms)=>{await andar([[x,y]]);await W(150);const lb=await U.usarEm(x,y,dir||'cima');await W(ms||600);return lb;};
  const digitar=async(txt,ms)=>{await ev(()=>{if(!PAINEL.texto)document.getElementById('pModo').click();});await W(400);
    await page.click('#pTxt');await ev(()=>{const a=document.getElementById('pTxt');a.value='';a.dispatchEvent(new Event('input'));});
    await page.keyboard.type(txt,{delay:SECO?2:28});await W(ms||700);await ev(()=>document.getElementById('pModo').click());await W(500);};
  const vel=v=>ev(v=>__vt.velocidade(v),v);
  const executar=async(ms)=>{const r=await U.executar();await W(ms||1200);return r;};
  const conferir=async()=>{const e=await ev(()=>({id:PAINEL.cfg&&PAINEL.cfg.id,ok:PAINEL.cfg&&!!G.learn[PAINEL.cfg.id]}));if(!e.ok)console.log('  etapa não concluída:',e.id);};
  /* executa em todas as situações; a previsão pode trocar a situação da vez, então repete as que faltaram */
  const todas=async(ms)=>{const n=await ev(()=>PAINEL.cfg.situacoes.length);let r;
    for(let volta=0;volta<3;volta++){if(volta&&await ev(()=>!!G.learn[PAINEL.cfg.id]))break;
      for(let i=0;i<n;i++){if(volta){const ok=await ev(i=>{const c=PAINEL.cfg,x=c.situacoes[i],ps=PAINEL.passou[c.id]||{};return!!ps[x.id];},i);if(ok)continue;}
        await U.sit(i);await W(300);r=await U.executar();await W(ms||700);}}
    const ok=await ev(()=>({id:PAINEL.cfg.id,ok:!!G.learn[PAINEL.cfg.id]}));if(!ok.ok)console.log('  etapa não concluída:',ok.id);return r;};
  const fechar=async()=>{await conferir();await ev(()=>fecharPainel());await W(700);};
  const transicao=async()=>{await W(1300);};
  const marca=async(n)=>{console.log(new Date().toISOString().slice(11,19),n);};

  try{
  /* ================= abertura e história ================= */
  await marca('abertura');
  await cartao('Vale das Tumbas 2D','Um jogo para aprender programação em Python: cada tumba ensina um conceito, e o código do jogador mexe no cenário.',4500);
  await leg('Tela inicial. "Novo jogo" começa pela história, que pode ser pulada.',2500);
  await page.click('#btnNew');await W(1200);
  await leg('A história: cinco páginas curtas antes do treino.');
  for(let i=0;i<5;i++){await W(2600);await page.click('#hProx');}
  await W(1500);

  /* ================= Pátio de Treino ================= */
  const T=await ev(()=>({marca:{x:TREINO.marca.x,y:TREINO.marca.y},lume:{x:TREINO.lume.tx*16+8,y:TREINO.lume.ty*16+20},man:{x:TREINO.manivela.x,y:TREINO.manivela.y+10},term:{x:TREINO.term.tx*16+8,y:TREINO.term.ty*16+30}}));
  await marca('treino');await leg('Pátio de Treino: o objetivo, no alto, mostra um passo por vez.',2500);
  await leg('Passo 1: andar até a marca brilhante.');await andar([[T.marca.x,T.marca.y+2]]);await W(1200);
  await leg('Passo 2: conversar com o Lume, o guia do jogo.');await irUsar(T.lume.x,T.lume.y,'cima',1800);
  await U.opcao('Como');await W(3500);await U.opcao('Até logo');await W(800);
  await leg('Passo 3: pegar a manivela de latão perto da barraca.');await irUsar(T.man.x,T.man.y,'cima',1600);
  await leg('Passo 4: encaixar a manivela no terminal de pedra.');await irUsar(T.term.x,T.term.y,'cima',1800);
  await leg('Passo 5: abrir o Guia de Programação (botão Guia, no alto).');await page.click('#btnGuia');await W(3800);
  await page.click('#gFechar');await W(800);
  await leg('Passo 6: usar o terminal para abrir o editor.');await U.usarEm(T.term.x,T.term.y,'cima');await W(2500);
  await vel(1);await leg('O primeiro comando, montado por toques: acender_tocha().');await U.pb('acender_tocha()');await W(1200);
  await executar(2500);
  await leg('Etapa 2 · a ordem importa: o programa do portão já vem escrito, na ordem errada.');await conferir();await U.etapa(1);await W(2500);
  await ev(()=>document.getElementById('pRun').click());await W(1500);
  await leg('Antes de executar, o jogo pede uma previsão.');await W(2000);await U.prever(0);await U.esperarFim();await W(3000);
  await leg('O portão não subiu: a trava estava fechada. Corrigindo a ordem…');await U.linha(2);await W(800);await U.ch('↑ Subir');await W(1200);
  await executar(2500);await fechar();
  await leg('O portão abriu. Saindo do pátio para o vale.');await andar([[13*16,4*16],[13*16,0]]);await transicao();

  /* ================= Vale ================= */
  await marca('vale');await leg('O vale: o objetivo indica a tumba da vez; a trilha colorida e a seta na borda da tela mostram o caminho.',3500);
  const pv=await ev(()=>({x:G.p.x,y:G.p.y}));await andar([[pv.x,pv.y-170]],true);
  await W(1500);
  await leg('Cada tumba só abre depois do saber da anterior. A primeira é a das Engrenagens.',2500);
  await cartao('Tumba das Engrenagens','Saber 1 · Sequência: as instruções são executadas na ordem em que aparecem.',3000);
  let p=await ev(()=>__vt.porta('steam'));await ev(([x,y])=>__vt.ir(x,y+70,'cima'),[p.x,p.y]);await W(600);await andar([[p.x,p.y+20]]);await U.usarEm(p.x,p.y);await transicao();

  /* ================= Engrenagens ================= */
  await marca('steam');await leg('A caldeira acesa vira ponto de controle.');await irUsar(10*16+8,46*16,'cima',1500);
  await leg('O Computador Ancestral guarda as etapas da tumba.');await ev(()=>__vt.ir(17*16+8,22*16,'cima'));await andar([[17*16+8,13*16+6]]);await U.usarEm(17*16+8,13*16+6,'cima');await W(1500);
  await vel(2);await leg('Etapa 1 · demonstração: dois programas com os mesmos comandos em ordens diferentes.');
  await U.pb('Programa A');await U.esperarFim();await W(1200);await U.pb('Programa B');await U.esperarFim();await W(1500);
  await U.pb('Continuar');await leg('Etapa 2 · prática guiada: levar o autômato até o alvo.');
  for(const c of['avancar()','avancar()','virar_direita()','avancar()','ativar()']){await U.pb(c);await W(500);}
  await executar(2000);
  await leg('Etapa 3 · corrigir: o código vem com erro. Executar mostra onde parou.');await conferir();await U.etapa(2);await W(1200);await executar(2500);
  await leg('Corrigido descendo uma linha.');await U.linha(2);await U.ch('↓ Descer');await W(900);await executar(2000);
  await leg('Etapa 4 · aplicação: um percurso novo, escrito em Python.');await conferir();await U.etapa(3);await W(800);
  await digitar('avancar()\navancar()\navancar()\nvirar_direita()\navancar()\navancar()\nvirar_direita()\navancar()\navancar()\nativar()');await executar(2500);
  await fechar();await leg('Com as etapas feitas, o portão da câmara abre: a Engrenagem-mestra é o primeiro saber.');
  await irUsar(13*16+8,4*16+12,'cima',3000);
  await U.usarEm(14*16,47*16+8,'baixo');await transicao();

  /* ================= Motores ================= */
  await cartao('Tumba dos Motores','Saber 2 · Variáveis e tipos: int, float, str e bool.',3000);
  p=await ev(()=>__vt.porta('diesel'));await ev(([x,y])=>__vt.ir(x,y+60,'cima'),[p.x,p.y]);await andar([[p.x,p.y+20]]);await U.usarEm(p.x,p.y);await transicao();
  await marca('diesel');await leg('Pátio de abastecimento: cada máquina aceita um tipo de valor.',2500);
  const capP=async id=>{const c=await ev(id=>{const c=__vt.G.area.patio.caps[id];return{x:c.x,y:c.y+12};},id);await irUsar(c.x,c.y,'cima',900);};
  const maqP=async k=>{const m=await ev(k=>{const m=PATIO_DIESEL.maquinas[k];return{x:m.tx*16+8,y:m.ty*16+30};},k);await irUsar(m.x,m.y,'cima',1800);};
  await leg('O disjuntor aceita bool: "True" entre aspas é texto e é recusado.');await capP('c_strue');await maqP('disjuntor');await W(1200);
  await leg('True sem aspas liga o disjuntor; 2.5 (float) enche a bomba; "ABRIR" (str) destrava a porta.');
  await capP('c_true');await maqP('disjuntor');await capP('c_f25');await maqP('bomba');await W(1500);await capP('c_abrir');await maqP('porta');await W(1500);
  await ev(()=>__vt.ir(14*16+8,20*16,'cima'));await andar([[14*16+8,13*16+6]]);await U.usarEm(14*16+8,13*16+6,'cima');await W(1500);
  await vel(2);await leg('Etapa 1 · demonstração: guardar um valor numa variável e a máquina ler.');await U.pb('Guardar e ler');await U.esperarFim();await W(1500);await U.pb('Continuar');
  await leg('Etapa 2 · os quatro tipos: o painel recusa "True" (texto) numa variável bool.');
  await U.pb('variável = valor');await U.ch('"True"');await W(1800);await U.ch('True');await U.pb('variável = valor');await U.ch('2,5 L');await U.pb('variável = valor');await U.ch('5');await U.pb('variável = valor');await U.ch('"ABRIR"');await W(1000);await executar(2500);
  await leg('Etapa 3 · atribuição: quantidade = 5.');await conferir();await U.etapa(2);await U.pb('variável = valor');await U.ch('5');await W(800);await executar(1800);
  await leg('Etapa 4 · ler antes de guardar dá erro; a atribuição sobe uma linha.');await conferir();await U.etapa(3);await U.pb('separar_lote()');await executar(2200);
  await U.pb('variável = valor');await U.ch('5');await U.linha(2);await U.ch('↑ Subir');await W(800);await executar(1800);
  await leg('Etapa 5 · mudar o valor com uma conta.');await conferir();await U.etapa(4);await digitar('quantidade = 5\nseparar_lote()\nquantidade = quantidade + 3\nseparar_lote()');await executar(2200);
  await leg('Etapa 6 · corrigir a ficha do monta-cargas, um erro de tipo por vez.');await conferir();await U.etapa(5);await executar(2200);
  await U.linha(1);await U.ch('12');await executar(1800);await U.linha(3);await U.ch('"MOTOR"');await executar(1800);await U.linha(4);await U.ch('False');await executar(2000);
  await leg('Etapa 7 · aplicação: abastecer dois tanques, 2.5 L e 4.0 L, sem código pronto.');await conferir();await U.etapa(6);await W(800);
  await U.pb('variável = valor');await U.ch('True');await U.pb('variável = valor');await U.ch('2,5 L');await U.pb('abastecer_tanque()');await U.pb('variável = valor');await U.ch('combustivel (float)');await U.ch('combustivel + 1,5 L');await U.pb('abastecer_tanque()');await W(800);
  await executar(2500);await fechar();await leg('Segundo saber: a Vela de ignição.');await irUsar(14*16+8,4*16+12,'cima',2600);
  await U.usarEm(15*16,32*16+8,'baixo');await transicao();

  /* ================= Reator ================= */
  await cartao('Tumba do Reator','Saber 3 · Decisões: if, elif e else.',3000);
  p=await ev(()=>__vt.porta('atom'));await ev(([x,y])=>__vt.ir(x,y+60,'cima'),[p.x,p.y]);await andar([[p.x,p.y+20]]);await U.usarEm(p.x,p.y);await transicao();
  await marca('atom');await leg('O canal está cheio: a válvula drena a água para atravessar pelos pontões.');await irUsar(6*16+8,25*16+20,'cima',3500);
  await ev(()=>__vt.ir(14*16+8,21*16+12,'cima'));await andar([[14*16+8,16*16]]);await andar([[14*16+8,14*16+6]]);await U.usarEm(14*16+8,14*16+6,'cima');await W(1500);
  await vel(2);await leg('Etapa 1 · demonstração: o mesmo if em duas situações.');await U.pb('if energia');await U.esperarFim();await W(1800);await U.esperarFim();await W(1200);
  await U.pb('Continuar');await leg('Etapa 2 · if/else: abrir a comporta com energia 5 ou mais, senão ligar o carregador.');
  await U.pb('if … else');await U.ch('>=');await U.ch('5');await U.pb('abrir_comporta()');await U.linhaTipo('senao');await U.pb('ligar_carregador()');await W(1000);await todas(1200);
  await leg('Etapa 3 · o limite numa variável; < e não <= no nível 4.');await conferir();await U.etapa(2);await digitar('limite = 4\nif nivel < limite:\n    abrir_portao()\nelse:\n    drenar_tanque()');await todas(900);
  await leg('Etapa 4 · três caminhos com elif.');await conferir();await U.etapa(3);await U.pb('if … else');await U.ch('>=');await U.ch('80');await U.pb('resfriar()');
  await U.pb('elif');await U.ch('>=');await U.ch('50');await U.pb('ventilar()');await U.linhaTipo('senao');await U.pb('manter_estavel()');await W(800);await todas(900);
  await leg('Etapa 5 · corrigir: a condição mais rigorosa vem primeiro.');await conferir();await U.etapa(4);await executar(2200);
  await digitar('if temperatura >= 80:\n    resfriar()\nelif temperatura >= 50:\n    ventilar()\nelse:\n    manter_estavel()');await todas(800);
  await leg('Etapa 6 · aplicação: painel de segurança com dois sensores.');await conferir();await U.etapa(5);
  await digitar('limite = 80\nif temperatura > limite:\n    resfriar()\nelif energia < 5:\n    ligar_carregador()\nelse:\n    manter_estavel()');await todas(800);
  await fechar();await leg('Terceiro saber: o Núcleo atômico.');await irUsar(14*16+8,4*16+12,'cima',2600);
  await U.usarEm(15*16,31*16+8,'baixo');await transicao();

  /* ================= Viva ================= */
  await cartao('Tumba Viva','Saber 4 · Repetições: for e while.',3000);
  p=await ev(()=>__vt.porta('bio'));await ev(([x,y])=>__vt.ir(x,y+60,'cima'),[p.x,p.y]);await andar([[p.x,p.y+20]]);await U.usarEm(p.x,p.y);await transicao();
  await marca('bio');await leg('O coração da sala toca uma canção; repetir a ordem nos bulbos abre a membrana.');await irUsar(14*16+8,29*16+20,'cima',5500);
  for(const i of[2,0,3,1]){const B=[[8,27],[12,26],[17,26],[21,27]][i];await irUsar(B[0]*16+8,B[1]*16+20,'cima',900);}
  await W(1200);await ev(()=>__vt.ir(14*16+8,22*16,'cima'));await andar([[14*16+8,14*16+6]]);await U.usarEm(14*16+8,14*16+6,'cima');await W(1500);
  await vel(3);await leg('Etapa 1 · demonstração: quatro linhas iguais ou um for.');await U.pb('Linha a linha');await U.esperarFim();await W(1000);await U.pb('Com for');await U.esperarFim();await W(1200);
  await U.pb('Continuar');await leg('Etapa 2 · o painel tem só 2 linhas: é preciso o for para acender as quatro tochas.');
  await U.pb('for … in range(n)');await U.pb('acender_tocha()');await U.linhaTipo('no',0);await U.ch('+');await U.ch('+');await W(800);await executar(2500);
  await leg('Etapa 3 · for com dois comandos: irrigar e avançar.');await conferir();await U.etapa(2);await U.pb('for … in range(n)');await U.pb('irrigar()');await U.pb('avancar()');await U.linha(1);await U.ch('+');await U.ch('+');await W(600);await executar(2500);
  await leg('Etapa 4 · corrigir: o for rega a terra vazia.');await conferir();await U.etapa(3);await executar(2200);
  await U.linha(1);for(let i=0;i<3;i++)await U.ch('−');await U.linha(3);await U.pb('avancar()');await W(600);await executar(2500);
  await leg('Etapa 5 · while: regar enquanto a umidade for menor que 3.');await conferir();await U.etapa(4);await U.pb('while');await U.ch('<');await U.ch('3');await U.pb('irrigar()');await W(600);await todas(800);
  await leg('Etapa 6 · aplicação: while dentro do for.');await conferir();await U.etapa(5);await digitar('for i in range(4):\n    while umidade < 3:\n        irrigar()\n    avancar()');await todas(800);
  await fechar();await leg('Quarto saber: a Semente da vida. Os quatro saberes abrem a porta final.');await irUsar(14*16+8,4*16+12,'cima',2800);
  await U.usarEm(15*16,36*16+8,'baixo');await transicao();

  /* ================= Câmara Final ================= */
  await cartao('Câmara Final · o Devorador do Vale','Uma prova com os quatro saberes, uma fase para cada um.',3200);
  p=await ev(()=>__vt.porta('final'));await ev(([x,y])=>__vt.ir(x,y+60,'cima'),[p.x,p.y]);await andar([[p.x,p.y+20]]);await U.usarEm(p.x,p.y);await transicao();
  await marca('camara');await leg('O guardião acorda quando alguém se aproxima. Os golpes avisam antes, com um círculo.');
  await ev(()=>{G.invuln=0;});await andar([[14*16,17*16]]);await W(5500);
  await leg('O terminal fica à frente. Com o painel aberto, nada ataca.');await andar([[14*16+8,15*16+6]]);await U.usarEm(14*16+8,15*16+6,'cima');await W(1500);
  await vel(2);await leg('Fase 1 · sequência: os mecanismos na ordem que as dependências pedem.');
  await digitar('cortar_energia()\nabrir_valvula()\nalinhar_espelhos()\ndisparar_ressonador()');await todas(900);
  await leg('Fase 2 · variáveis: mudar a frequência entre os pulsos.');await conferir();await U.etapa(1);await digitar('potencia = 2.5\nfrequencia = 7\ndisparar_pulso()\nfrequencia = frequencia + 2\ndisparar_pulso()');await todas(900);
  await leg('Fase 3 · decisões: a defesa certa para cada nível de fúria.');await conferir();await U.etapa(2);await digitar('if furia >= 7:\n    erguer_escudo()\nelif furia >= 4:\n    desviar()\nelse:\n    canalizar_luz()');await vel(4);await todas(600);
  await leg('Fase 4 · repetições: for nos selos e while no núcleo.');await conferir();await U.etapa(3);await vel(2);await digitar('for i in range(4):\n    acender_selo()\nwhile nucleo > 0:\n    purificar_nucleo()');await vel(3);await todas(800);
  await fechar();await leg('As quatro fases vencidas: o Devorador é purificado.');await W(5500);
  await leg('A passagem ao norte leva à Cidade-Jardim.');await andar([[14*16,4*16]]);await U.usarEm(14*16,2*16+22,'cima');await transicao();

  /* ================= Cidade-Jardim ================= */
  await marca('final');await cartao('Cidade-Jardim','O desafio final junta sequência, variável, decisão e repetição.',3000);
  await andar([[14*16+8,17*16]]);await andar([[14*16+8,15*16+6]]);await U.usarEm(14*16+8,15*16+6,'cima');await W(1500);
  await vel(3);await leg('Regar só os canteiros secos, contar as regas e acender o jardim.');
  await digitar('regadas = 0\nfor i in range(5):\n    if solo == "seco":\n        irrigar()\n        regadas = regadas + 1\n    avancar()\nacender_jardim()');await todas(1000);
  await fechar();await leg('A árvore-matriz desperta.');await andar([[14*16,7*16]]);await U.usarEm(14*16,5*16+4,'cima');await W(6000);
  await ev(()=>{const b=document.getElementById('fimOk');if(b&&!document.getElementById('fim').hidden)b.click();});await W(800);
  await leg('O diário guarda, em cada saber, o conceito e o programa que o jogador escreveu.');await ev(()=>abrirDiario('saberes'));await W(5500);
  await ev(()=>{const l=document.getElementById('dLista');if(l)l.scrollTop=400;});await W(3000);
  await leg('E o relatório de aprendizagem mostra etapas, tentativas e dicas.');await ev(()=>{fecharDiario();abrirDiario('relatorio');});await W(5000);await ev(()=>fecharDiario());await leg(null);
  await cartao('Vale das Tumbas 2D','vale-das-tumbas-2d.vercel.app',5000);
  }catch(e){console.log('ERRO',e.message);}
  console.log('estado final:',JSON.stringify(await ev(()=>({done:G.done,relics:G.relics,etapas:Object.keys(G.learn).length,total:DESAFIOS.length})).catch(()=>null)));
  console.log('erros da página:',erros.slice(0,5));
  const vid=page.video();await ctx.close();await browser.close();
  if(!vid){console.log('VIDEO (seco)');return;}
  const f=await vid.path(),mp4=path.join(OUT,'vale-das-tumbas-2d-gameplay.mp4');console.log('VIDEO',f);
  try{require('child_process').execFileSync('ffmpeg',['-v','error','-y','-i',f,'-c:v','libx264','-preset','slow','-crf','20','-tune','animation','-pix_fmt','yuv420p','-r','30','-movflags','+faststart',mp4]);console.log('MP4',mp4);}
  catch(e){console.log('ffmpeg não encontrado ou falhou; fica só o .webm');}
})();
