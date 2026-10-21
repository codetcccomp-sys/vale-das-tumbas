// Perigos e guardiões adaptados para 2D: pistões, placas que cedem, Autômato, pátio de abastecimento dos Motores, canal e pontões,
// radiação, canção errada que acorda os Clones, queda e volta ao ponto de energia, derrota na tumba.
const {open}=require('./lib');const {suite}=require('./assert');
const t=suite('b5-perigos');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:1,touch:false});
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>document.getElementById('btnNew').click());
  /* ---------- Engrenagens ---------- */
  await ev(()=>{__vt.entrar('steam');});
  /* pistões: quem está embaixo quando descem perde um coração */
  let r=await ev(()=>{const A=__vt.G.area;A.relogio=1.85;__vt.ir(12*16+8,36*16+8,'cima');let h0=__vt.G.hearts;for(let i=0;i<50;i++)passoJogo(1/60,performance.now());return{h0,h:__vt.G.hearts,y:__vt.G.p.y/16};});
  t.ok(r.h===r.h0-1&&r.y>=37,'pistão descendo fere e empurra para fora da linha',r);
  r=await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;const A=__vt.G.area;A.relogio=0.1;__vt.ir(12*16+8,36*16+8,'cima');for(let i=0;i<30;i++)passoJogo(1/60,performance.now());return __vt.G.hearts;});
  t.ok(r===3,'pistão em cima (luz apagada): dá para passar',r);
  /* placas: com olho aguentam; sem olho cedem; a queda volta ao ponto de energia */
  const lbC=await ev(()=>{__vt.G.invuln=0;return __vt.usarEm(7*16+8,29*16+12,'cima');});
  r=await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;__vt.ir(14*16+8,24*16+8,'cima');for(let i=0;i<60;i++)passoJogo(1/60,performance.now());return{h:__vt.G.hearts,cai:__vt.G.p.caindo,y:__vt.G.p.y/16};});
  t.ok(r.h===3&&!(r.cai>0),'placa com o olho aguenta o explorador',r);
  r=await ev(()=>{__vt.ir(12*16+8,24*16+8,'cima');for(let i=0;i<80;i++)passoJogo(1/60,performance.now());return{h:__vt.G.hearts,x:__vt.G.p.x/16,y:__vt.G.p.y/16};});
  t.ok(r.h===2&&Math.abs(r.y-29.9)<1.2,'placa sem olho cede: cai e volta à caldeira acesa',[lbC,r]);
  /* Autômato: andar devagar por perto não acorda; correr acorda; sair da sala faz dormir */
  r=await ev(()=>{const e=__vt.G.area.guardas[0];e.reiniciar();__vt.G.invuln=0;__vt.ir(13*16,31*16,'direita');__vt.andar(1,0,0.6,false);return e.estado;});
  t.ok(r==='dorme','andando devagar a 3 m, o Autômato continua dormindo',r);
  r=await ev(()=>{const e=__vt.G.area.guardas[0];__vt.ir(9*16,31*16,'direita');__vt.andar(1,0,0.5,true);return e.estado;});
  t.ok(r==='acorda'||r==='caca','correndo por perto, o Autômato acorda',r);
  r=await ev(()=>{const e=__vt.G.area.guardas[0];__vt.ir(14*16+8,40*16,'baixo');for(let i=0;i<600;i++)passoJogo(1/60,performance.now());return e.estado;});
  t.ok(r==='dorme','fora da sala, o Autômato volta para o canto e dorme',r);
  /* ---------- Motores: pátio de abastecimento (reconhecer tipos; sem guarda e sem queda) ---------- */
  await ev(()=>{__vt.G.abertas=[];__vt.G.hearts=3;__vt.G.invuln=0;__vt.entrar('diesel');toastClear();});
  const cap=id=>ev(id=>{const c=__vt.G.area.patio.caps[id];return __vt.usarEm(c.x,c.y+12,'cima');},id);
  const maq=k=>ev(k=>{const m=PATIO_DIESEL.maquinas[k];toastClear();__vt.usarEm(m.tx*16+8,m.ty*16+30,'cima');return{ab:__vt.G.abertas.slice(),t:[...document.querySelectorAll('#msgs .toast span')].map(x=>x.textContent).join(' ')};},k);
  await cap('c_f25');r=await maq('bomba');t.ok(!r.ab.length&&/sem energia/.test(r.t),'a bomba sem energia explica que falta ligar o disjuntor',r);
  r=await ev(()=>{__vt.ir(8*16,23*16,'cima');__vt.andar(0,-1,1.5);__vt.ir(15*16,23*16,'cima');__vt.andar(0,-1,1.5);return{y:__vt.G.p.y/16,h:__vt.G.hearts,cai:__vt.G.p.caindo};});
  t.ok(r.y>=22&&r.h===3&&!(r.cai>0),'o canal tem guarda-corpo e a ponte erguida trava a passagem: ninguém cai',r);
  await cap('c_true');r=await maq('disjuntor');t.ok(r.ab.indexOf('diesel_disjuntor')>=0,'True (bool) liga o disjuntor',r.ab);
  await cap('c_s25');r=await maq('bomba');t.ok(r.ab.indexOf('diesel_ponte')<0&&/texto/.test(r.t)&&/float/.test(r.t),'"2.5" (texto) é recusado pela bomba, com o tipo aceito e o recebido',r.t);
  await cap('c_f25');r=await maq('bomba');t.ok(r.ab.indexOf('diesel_ponte')>=0,'2.5 (float) liga a bomba',r.ab);
  r=await ev(()=>{for(let i=0;i<90;i++)passoJogo(1/60,performance.now());__vt.ir(15*16,23*16,'cima');__vt.andar(0,-1,1.6);return{y:__vt.G.p.y/16,h:__vt.G.hearts};});
  t.ok(r.y<20&&r.h===3,'com a ponte baixada, dá para atravessar o canal a pé',r);
  await cap('c_abrirm');r=await maq('porta');t.ok(r.ab.indexOf('diesel_porta')<0&&/maiúsculas/.test(r.t),'"abrir" é texto, mas não é a senha: o painel explica que maiúsculas contam',r.t);
  /* ---------- Reator: canal, radiação, bomba acorda o robô ---------- */
  await ev(()=>{__vt.entrar('atom');});
  r=await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;__vt.ir(7*16,22*16+8,'cima');for(let i=0;i<150;i++)passoJogo(1/60,performance.now());return __vt.G.hearts;});
  t.ok(r<3,'ficar na zona verde de radiação fere',r);
  r=await ev(()=>{const A=__vt.G.area;const e=A.guardas[0];e.reiniciar();__vt.G.hearts=3;__vt.G.invuln=3;__vt.ir(16*16,22*16,'cima');__vt.usarEm(6*16+22,25*16+8,'esquerda');for(let i=0;i<5;i++)passoJogo(1/60,performance.now());return e.estado;});
  t.ok(r!=='dorme','o barulho da bomba acorda o Robô atômico',r);
  /* ---------- Viva: canção errada acorda os Clones ---------- */
  await ev(()=>{__vt.entrar('bio');});
  r=await ev(()=>{const A=__vt.G.area;__vt.usarEm(8*16+8,27*16+20,'cima');for(let i=0;i<3;i++)passoJogo(1/60,performance.now());return A.guardas.map(e=>e.estado);});
  t.ok(r.every(x=>x!=='dorme'),'bulbo fora de ordem: os Clones acordam',r);
  /* ---------- derrota: sem corações dentro da tumba, volta ao vale com a vida cheia ---------- */
  r=await ev(()=>{__vt.G.hearts=1;__vt.G.invuln=0;ferir('teste');return 1;});await page.waitForTimeout(700);
  r=await ev(()=>({a:__vt.G.area.id,h:__vt.G.hearts}));t.ok(r.a==='vale'&&r.h===3,'perder todos os corações na tumba leva de volta ao vale',r);
  /* ---------- vale: oásis cura, inscrição noturna, segredos ---------- */
  r=await ev(()=>{__vt.G.hearts=1;__vt.usarEm(66.6*16,146.4*16,'cima');return __vt.G.hearts;});t.ok(r===3,'a água do oásis cura',r);
  r=await ev(()=>{__vt.G.time=0.25;const lb=__vt.usarEm(65*16+8,140*16+2,'cima');return{lb,insc:!!__vt.G.insc.oasis};});t.ok(/apagada/.test(r.lb)&&!r.insc,'de dia a inscrição está apagada',r);
  r=await ev(()=>{__vt.G.time=0.75;const lb=__vt.usarEm(65*16+8,140*16+2,'cima');return{lb,insc:!!__vt.G.insc.oasis};});t.ok(r.insc,'à noite a inscrição brilha e vai para o diário',r);
  r=await ev(()=>{__vt.G.time=0.2;const a=__vt.usarEm(42*16+8,108*16+4,'cima');const b=__vt.usarEm(39*16+8,75*16+8,'cima');const c=__vt.usarEm(80*16+8,130*16,'cima');return{a,b,c,sec:Object.keys(__vt.G.sec)};});
  t.ok(r.sec.length===3&&/baú/i.test(r.a)&&/fragmento/i.test(r.b),'baú, fragmento de mapa e inscrição de dia contam como segredos',r);
  r=await ev(()=>{abrirDiario('mapa');const c=document.getElementById('mapCv');const g=c.getContext('2d');const d1=g.getImageData(20,20,1,1).data,d2=g.getImageData(160,160,1,1).data;fecharDiario();return{nw:[...d1],se:[...d2]};});
  t.ok(r.nw[0]>100&&r.se[0]<80,'o mapa do diário mostra só o quarto do fragmento achado',r);
  t.done(logs.filter(l=>!/willReadFrequently/.test(l)));await browser.close();   // o aviso de leitura de pixels vem do próprio teste
})();
