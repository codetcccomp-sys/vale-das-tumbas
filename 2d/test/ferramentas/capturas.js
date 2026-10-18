// Capturas representativas para a entrega: treino, Guia, Lume, ambientes do vale, desafios em execução (com a área de
// erro e o código mexendo no cenário), modo Escrever, diário e final.
// uso: node test/ferramentas/capturas.js  (gera em capturas/)
const {open}=require('../lib');const {ui}=require('../ui');const path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','capturas');fs.mkdirSync(OUT,{recursive:true});
/* as comparações antes/depois (C-, F-) são montadas à parte e ficam */
for(const f of fs.readdirSync(OUT))if(/\.png$/.test(f)&&!/^[CF]-/.test(f))fs.unlinkSync(path.join(OUT,f));
async function sessao(W,H,dpr,toque,pref,fn,hash){const {browser,page,logs}=await open({viewport:{width:W,height:H},dpr,touch:toque,hash});const U=ui(page);
  const foto=async n=>{await page.waitForTimeout(350);await page.screenshot({path:path.join(OUT,pref+n+'.png')});};
  await U.ev(()=>document.getElementById('btnNew').click());await U.ev(()=>{toastClear();document.getElementById('zoneHint').hidden=true;});
  await fn(U,foto,page);if(logs.length)console.log(pref,'LOGS',logs.slice(0,3).join(' | '));await browser.close();}
const limpo=()=>{toastClear();document.getElementById('zoneHint').hidden=true;};
(async()=>{
  /* ---------- treino, Lume e Guia (celular em pé) ---------- */
  await sessao(412,860,2,true,'',async(U,foto,page)=>{const ev=U.ev;
    await ev(()=>{__vt.ir(TREINO.marca.x,TREINO.marca.y+40,'cima');__vt.quadros(30);});await ev(limpo);await foto('00-treino-patio');
    await ev(()=>__vt.usarEm(TREINO.lume.tx*16+8,TREINO.lume.ty*16+20,'cima'));await U.opcao('Como funciona a programação');await foto('01-treino-lume');
    await U.opcao('Até logo');await ev(()=>{__vt.G.treino.manivela=true;__vt.G.treino.passo=5;abrirGuia('variaveis');});await foto('02-guia-variaveis');
    await ev(()=>mostrarTopico('contratos'));await foto('03-guia-regras-das-maquinas');
    await ev(()=>{fecharGuia();__vt.usarEm(TREINO.term.tx*16+8,TREINO.term.ty*16+30,'cima');__vt.velocidade(1);});
    await U.pb('acender_tocha()');await U.executar();await ev(limpo);await foto('04-treino-primeiro-comando');
    /* a ordem importa: previsão antes de executar, erro explicado e conferência da previsão */
    await U.etapa(1);await ev(()=>{__vt.velocidade(4);document.getElementById('pRun').click();});await page.waitForTimeout(200);await foto('04b-treino-previsao');
    await U.prever(0);await U.esperarFim();await ev(limpo);await foto('04c-treino-ordem-erro');
  },'#vt-treino');
  /* ---------- vale e tumbas (celular em pé) ---------- */
  await sessao(412,860,2,true,'',async(U,foto,page)=>{const ev=U.ev;
    const lugar=(x,y,tm)=>ev(([x,y,tm])=>{__vt.G.time=tm;__vt.ir(x*16,y*16,'baixo');__vt.quadros(90);toastClear();},[x,y,tm]);
    await lugar(90.5,147.5,0.3);await foto('05-vale-acampamento');
    await lugar(90.5,118,0.8);await foto('06-vale-noite-braseiros');
    await lugar(100,96,0.05);await foto('07-vale-manha-nevoa');
    await ev(()=>{const p=VALE.pois.ponte;__vt.G.time=0.25;__vt.ir(p.x*16,p.y*16+30,'cima');__vt.quadros(30);toastClear();});await foto('08-vale-ponte-leito-seco');
    await ev(()=>{const T=TOMBS.steam;__vt.G.time=0.3;__vt.ir(T.door.x*16+8,(T.door.y+9)*16,'cima');__vt.quadros(30);toastClear();});await foto('08b-vale-entrada-emblema-alvo');
    /* Engrenagens: corrigir (erro na linha) e execução */
    await ev(()=>{__vt.G.learn={t1:true,t2:true,s0:true,s1:true};__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');__vt.velocidade(4);toastClear();});
    await U.executar();await foto('09-engrenagens-corrigir-erro');
    await ev(()=>{__vt.G.learn.s3=true;escolherDesafio(__vt.DESAFIO.s2);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    for(const c of['avancar()','avancar()','avancar()','virar_direita()','avancar()','avancar()','virar_direita()','avancar()','avancar()','ativar()'])await U.pb(c);
    await ev(()=>{__vt.velocidade(1);document.getElementById('pRun').click();});await page.waitForTimeout(3300);await foto('10-engrenagens-executando');
    await ev(()=>painelParar(false));
    /* Motores: as quatro máquinas reagem aos tipos; erro de tipo explicado */
    await ev(()=>{fecharPainel();Object.assign(__vt.G.learn,{s2:1,d0:1});__vt.entrar('diesel');__vt.G.abertas.push('diesel_luz');__vt.usarEm(14*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.d1);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    await U.pb('variável = valor');await U.ch('True');await U.pb('variável = valor');await U.ch('2,5 L');await U.pb('variável = valor');await U.ch('5');await U.pb('variável = valor');await U.ch('"ABRIR"');
    await ev(()=>__vt.velocidade(2));await U.executar();await ev(limpo);await foto('11-motores-quatro-tipos');
    await ev(()=>{Object.assign(__vt.G.learn,{d1:1,d2:1,d3:1,d4:1});escolherDesafio(__vt.DESAFIO.d5);});await U.executar();await ev(limpo);await foto('12-motores-regra-da-maquina');
    /* aplicação independente: a bomba lê energia e combustivel e enche dois tanques */
    await ev(()=>{Object.assign(__vt.G.learn,{d5:1});escolherDesafio(__vt.DESAFIO.d6);});
    await U.escrever('energia = True\ncombustivel = 2.5\nabastecer_tanque()\ncombustivel = combustivel + 1.5\nabastecer_tanque()');
    await ev(()=>{__vt.velocidade(1);document.getElementById('pRun').click();});await page.waitForTimeout(3400);await ev(limpo);await foto('12b-motores-bomba-aplicacao');
    await ev(()=>painelParar(false));
    /* Reator: if, elif e else */
    await ev(()=>{fecharPainel();Object.assign(__vt.G.learn,{d5:1,d6:1,a0:1,a1:1,a2:1});__vt.entrar('atom');__vt.usarEm(14*16+8,14*16+6,'cima');escolherDesafio(__vt.DESAFIO.a3);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    await U.pb('if … else');await U.ch('>=');await U.ch('80');await U.pb('resfriar()');await U.pb('elif');await U.ch('>=');await U.ch('50');await U.pb('ventilar()');await U.linhaTipo('senao');await U.pb('manter_estavel()');
    await U.sit(1);await ev(()=>{__vt.velocidade(1);document.getElementById('pRun').click();});await page.waitForTimeout(2600);await foto('13-reator-elif');
    await ev(()=>painelParar(false));
    /* Viva: for acende as quatro tochas; while rega o necessário */
    await ev(()=>{fecharPainel();Object.assign(__vt.G.learn,{a3:1,a4:1,bd:1});__vt.entrar('bio');__vt.usarEm(14*16+8,14*16+6,'cima');escolherDesafio(__vt.DESAFIO.b0);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    await U.pb('for … in range(n)');await U.pb('acender_tocha()');await U.linhaTipo('no',0);await U.ch('+');await U.ch('+');
    await ev(()=>{__vt.velocidade(1);document.getElementById('pRun').click();});await page.waitForTimeout(3000);await foto('14-viva-for-tochas');
    await ev(()=>{painelParar(false);Object.assign(__vt.G.learn,{b0:1,b1:1,b2:1,b3:1});escolherDesafio(__vt.DESAFIO.b4);});
    await U.escrever('for i in range(4):\n    while umidade < 3:\n        irrigar()\n    avancar()');
    await ev(()=>{__vt.velocidade(1);document.getElementById('pRun').click();});await page.waitForTimeout(4200);await foto('15-viva-while');
    await ev(()=>painelParar(false));
    /* Cidade-Jardim: modo Escrever e final */
    await ev(()=>{fecharPainel();Object.assign(__vt.G.learn,{b4:1});__vt.entrar('final');__vt.usarEm(14*16+8,15*16+6,'cima');PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    await ev(()=>document.getElementById('pModo').click());await page.fill('#pTxt','regadas = 0\nfor i in range(5):\n    if solo == "seco":\n        irrigar()\n        regadas = regadas + 1\n    avancar()\nacender_jardim()');
    await foto('16-cidade-modo-escrever');
    await ev(()=>{document.getElementById('pModo').click();__vt.velocidade(8);});await U.executarTodas();await ev(()=>{fecharPainel();toastClear();__vt.ir(14*16,8*16,'cima');__vt.quadros(60);});await foto('17-cidade-restaurada');
    await ev(()=>{__vt.ir(14*16,5*16+4,'cima');cenaFinal();});await foto('18-final');
    await ev(()=>{document.getElementById('fimOk').click();for(const k of['steam','diesel','atom','bio'])__vt.G.relics[k]=true;addDiary('saber_seq',true);abrirDiario('saberes');});await foto('19-diario-saberes');
  });
  /* ---------- melhorias desta versão: terminal, pistas, pátio dos Motores, lanterna, atalhos (celular em pé) ---------- */
  await sessao(412,860,2,true,'B-',async(U,foto,page)=>{const ev=U.ev;
    /* pista: placa com ! lida e fixada */
    await ev(()=>{__vt.G.learn={t1:1,t2:1,s0:1,s1:1,s3:1,s2:1};__vt.entrar('diesel');toastClear();const p=__vt.G.area.pistas.find(p=>p.id==='diesel_patio');__vt.ir(p.x,p.y+60,'cima');__vt.quadros(30);});await foto('25-patio-motores-placa-com-pista');
    await ev(()=>{const p=__vt.G.area.pistas.find(p=>p.id==='diesel_patio');__vt.usarEm(p.x,p.y+60,'cima');});await foto('26-pista-lida');
    await ev(()=>{fixarPista('diesel_patio');fecharFala();toastClear();});
    /* pátio: a cápsula "2.5" (texto) é recusada pela bomba; 2.5 (float) baixa a ponte */
    const cap=id=>ev(id=>{const c=__vt.G.area.patio.caps[id];__vt.usarEm(c.x,c.y+12,'cima');},id);
    await cap('c_true');await ev(()=>{const m=PATIO_DIESEL.maquinas.disjuntor;__vt.usarEm(m.tx*16+8,m.ty*16+30,'cima');toastClear();});
    await cap('c_s25');await ev(()=>{const m=PATIO_DIESEL.maquinas.bomba;__vt.usarEm(m.tx*16+8,m.ty*16+30,'cima');__vt.quadros(20);});await foto('27-patio-recusa-tipo');
    await ev(()=>{toastClear();const c=__vt.G.area.patio.caps.c_f25;__vt.usarEm(c.x,c.y+12,'cima');const m=PATIO_DIESEL.maquinas.bomba;__vt.usarEm(m.tx*16+8,m.ty*16+30,'cima');for(let i=0;i<60;i++)__vt.quadros(1);__vt.ir(15*16,23*16,'cima');__vt.quadros(20);});await foto('28-patio-ponte-baixada');
    /* terminal: editor amplo, pista fixada e Comandos e variáveis no modo Escrever */
    await ev(()=>{toastClear();__vt.G.abertas.push('diesel_porta');__vt.G.learn.d0=1;__vt.G.learn.d1=1;__vt.usarEm(14*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.d2);});await foto('29-terminal-editor-amplo');
    await ev(()=>{document.getElementById('pModo').click();const a=document.getElementById('pTxt');a.value='quantidade = ';a.setSelectionRange(13,13);const P=document.getElementById('painel');P.scrollTop=document.getElementById('pRefBox').offsetTop-8;});await foto('30-terminal-escrever-referencia');
    await ev(()=>{document.getElementById('pModo').click();fecharPainel();});
    /* lanterna: marca de luz na Tumba das Engrenagens */
    await ev(()=>{__vt.entrar('steam');__vt.G.lanternOn=true;const m=__vt.G.area.marcas.find(m=>m.id==='steam_ordem');__vt.ir(m.x+20,m.y+34,'cima');__vt.quadros(20);toastClear();});await foto('31-lanterna-marca-de-luz');
    /* vale: estação de atalho e quadro do acampamento */
    await ev(()=>{for(const d of desafiosDa('steam'))__vt.G.learn[d.id]=true;sairTumba(false);});await page.waitForTimeout(800);
    await ev(()=>{toastClear();__vt.G.time=0.3;const E=VALE.estacoes.steam;__vt.usarEm(E.x,E.y+22,'cima');});await foto('32-vale-estacao-de-atalho');
    await ev(()=>{fecharFala();lerQuadroAcampamento();});await foto('33-vale-quadro-do-acampamento');
    await ev(()=>{fecharFala();abrirDiario('pistas');});await foto('34-diario-pistas');
  });
  /* ---------- celular deitado ---------- */
  await sessao(844,390,3,true,'L-',async(U,foto,page)=>{const ev=U.ev;
    await ev(()=>{__vt.G.learn={t1:true,t2:true,s0:true,s1:true,s3:true,d0:1,d1:1,d2:1,d3:1,d4:1,d5:1,d6:1,a0:1,a1:1,a2:1};__vt.entrar('atom');__vt.usarEm(14*16+8,14*16+6,'cima');escolherDesafio(__vt.DESAFIO.a4);toastClear();});
    await U.executar();await foto('20-deitado-painel-erro');
    await ev(()=>{fecharPainel();__vt.entrar('final');__vt.ir(14*16,12*16,'cima');__vt.quadros(10);toastClear();});await foto('21-deitado-cidade');});
  /* ---------- computador ---------- */
  await sessao(1366,768,1,false,'D-',async(U,foto,page)=>{const ev=U.ev;
    await ev(()=>{__vt.G.time=0.32;__vt.ir(91*16,140*16,'cima');__vt.quadros(10);toastClear();});await foto('22-computador-vale');
    await ev(()=>abrirGuia('elif'));await foto('23-computador-guia');
    /* área de erro: o Python tem print, o editor do jogo não */
    await ev(()=>{fecharGuia();__vt.G.learn={t1:1,t2:1,s0:1,s1:1,s3:1,s2:1,d0:1,d1:1};__vt.entrar('diesel');__vt.G.abertas.push('diesel_luz');__vt.usarEm(14*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.d2);toastClear();});
    await U.escrever('quantidade = 5\nprint(quantidade)');await foto('24-computador-erro-subconjunto');});
  console.log('capturas em',OUT);
})();
