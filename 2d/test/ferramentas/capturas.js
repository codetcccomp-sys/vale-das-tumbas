// Capturas representativas para a entrega: ambientes, desafios em execução, diário e final.
// uso: node test/ferramentas/capturas.js  (gera em capturas/)
const {open}=require('../lib');const {ui}=require('../ui');const path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','capturas');fs.mkdirSync(OUT,{recursive:true});
const TUDO={s0:true,s1:true,s2:true,d0:true,d1:true,d2:true,d3:true,d4:true,d5:true,a0:true,a1:true,a2:true,b0:true,b1:true,b2:true,b3:true,b4:true};
async function sessao(W,H,dpr,toque,pref,fn){const {browser,page,logs}=await open({viewport:{width:W,height:H},dpr,touch:toque});const U=ui(page);
  const foto=async n=>{await page.waitForTimeout(350);await page.screenshot({path:path.join(OUT,pref+n+'.png')});};
  await U.ev(()=>document.getElementById('btnNew').click());await fn(U,foto,page);if(logs.length)console.log(pref,'LOGS',logs.slice(0,3).join(' | '));await browser.close();}
(async()=>{
  await sessao(412,860,2,true,'',async(U,foto,page)=>{
    const ev=U.ev;
    await page.evaluate(()=>{toastClear();document.getElementById('zoneHint').hidden=true;});
    await foto('00-inicio-vale');
    await ev(()=>{__vt.ir(66*16,141*16,'cima');__vt.G.time=0.78;__vt.quadros(5);toastClear();});await foto('01-vale-noite-oasis');
    await ev(()=>{__vt.G.time=0.2;__vt.ir(130*16+8,61*16,'cima');__vt.quadros(5);toastClear();});await foto('02-vale-tumba-engrenagens');
    await ev(()=>{__vt.ir(90*16+8,47*16,'cima');__vt.quadros(5);toastClear();});await foto('03-vale-piramide');
    /* Engrenagens: execução em andamento com a linha destacada */
    await ev(()=>{__vt.G.learn={s0:true,s1:true};__vt.entrar('steam');__vt.G.lanternOn=true;__vt.ir(14*16,30*16,'cima');__vt.quadros(10);toastClear();});await foto('04-engrenagens-automato');
    await ev(()=>{__vt.usarEm(17*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.s2);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    for(const c of['AVANÇAR','AVANÇAR','AVANÇAR','VIRAR','AVANÇAR','AVANÇAR','VIRAR','AVANÇAR','AVANÇAR','ATIVAR'])await U.pb(c);
    await ev(()=>{__vt.velocidade(1);document.getElementById('pRun').click();});await page.waitForTimeout(3300);await foto('05-engrenagens-executando');
    await U.esperarFim();await foto('06-engrenagens-concluido');
    /* Motores: contêineres e erro de tipo */
    await ev(()=>{fecharPainel();__vt.G.learn=Object.assign({},{s0:1,s1:1,s2:1,d0:1,d1:1,d2:1,d3:1,d4:1});__vt.entrar('diesel');__vt.G.abertas.push('diesel_luz');__vt.usarEm(14*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.d5);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    await U.pb('GUARDAR');await U.ch('12');await U.pb('GUARDAR');await U.ch('oleo');await U.ch('0,75 L');await U.pb('GUARDAR');await U.ch('codigo');await U.ch('"MOTOR"');await U.pb('GUARDAR');await U.ch('freio');
    await U.ch('"MOTOR"').catch(()=>{});await foto('07-motores-tipo-incompativel');
    await U.ch('False');await U.pb('LIGAR');await ev(()=>__vt.velocidade(2));await U.executar();await foto('08-motores-monta-cargas');
    await ev(()=>{escolherDesafio(__vt.DESAFIO.d1);});await foto('09-motores-reconhecer-tipos');
    /* Reator: duas situações */
    await ev(()=>{fecharPainel();__vt.G.learn=Object.assign({},__vt.G.learn,{d5:1,a0:1});__vt.entrar('atom');__vt.usarEm(14*16+8,14*16+6,'cima');escolherDesafio(__vt.DESAFIO.a1);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    await U.pb('SE … SENÃO');await U.ch('5');await U.pb('ABRIR');await U.linhaTipo('senao');await U.pb('CARREGADOR');await U.sit(1);
    await ev(()=>{__vt.velocidade(1);document.getElementById('pStep').click();});await page.waitForTimeout(500);await foto('10-reator-decisao-passo');
    await U.esperarFim().catch(()=>{});await ev(()=>{for(let i=0;i<3;i++)document.getElementById('pStep').click();});await foto('11-reator-situacao-B');
    /* Viva: repetição com contador */
    await ev(()=>{fecharPainel();__vt.G.learn=Object.assign({},__vt.G.learn,{a1:1,a2:1,b0:1,b1:1,b2:1,b3:1});__vt.entrar('bio');__vt.usarEm(14*16+8,14*16+6,'cima');escolherDesafio(__vt.DESAFIO.b4);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    await U.pb('REPETIR');await U.ch('+');await U.ch('+');await U.pb('ENQUANTO');await U.ch('<');await U.ch('3');await U.pb('IRRIGAR');await U.linhaTipo('fim',0);await U.pb('AVANÇAR');
    await ev(()=>{__vt.velocidade(1);document.getElementById('pRun').click();});await page.waitForTimeout(4200);await foto('12-viva-repeticoes');
    await ev(()=>painelParar(true));
    /* Cidade-Jardim e final */
    await ev(()=>{fecharPainel();__vt.G.learn=Object.assign({},__vt.G.learn,{b4:1});__vt.entrar('final');__vt.usarEm(14*16+8,15*16+6,'cima');PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
    await U.pb('GUARDAR');await U.ch('0');await U.pb('REPETIR');for(let i=0;i<3;i++)await U.ch('+');await U.pb('SE … ENTÃO');await U.ch('==');await U.ch('"seco"');await U.pb('IRRIGAR');await U.pb('GUARDAR');await U.ch('regadas + 1');await U.linhaTipo('fim',0);await U.pb('AVANÇAR');await U.linhaTipo('fim',1);await U.pb('ACENDER');
    await ev(()=>{__vt.velocidade(1);document.getElementById('pRun').click();});await page.waitForTimeout(6000);await foto('13-cidade-desafio-final');
    await ev(()=>{__vt.velocidade(8);});await U.esperarFim();await U.sit(1);await U.executar();await ev(()=>{fecharPainel();toastClear();__vt.ir(14*16,8*16,'cima');__vt.quadros(60);});await foto('14-cidade-restaurada');
    await ev(()=>{__vt.ir(14*16,5*16+4,'cima');cenaFinal();});await foto('15-final');
    await ev(()=>{document.getElementById('fimOk').click();for(const k of['steam','diesel','atom','bio'])__vt.G.relics[k]=true;addDiary('saber_seq',true);abrirDiario('saberes');});await foto('16-diario-saberes');
  });
  await sessao(844,390,3,true,'L-',async(U,foto,page)=>{const ev=U.ev;
    await ev(()=>{__vt.G.learn={s0:true,s1:true};__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.s2);toastClear();});await foto('17-deitado-painel');
    await ev(()=>{fecharPainel();__vt.entrar('final');__vt.ir(14*16,12*16,'cima');__vt.quadros(10);toastClear();});await foto('18-deitado-cidade');});
  await sessao(1366,768,1,false,'D-',async(U,foto,page)=>{const ev=U.ev;await ev(()=>{__vt.ir(91*16,140*16,'cima');__vt.quadros(10);toastClear();});await foto('19-computador-vale');});
  console.log('capturas em',OUT);
})();
