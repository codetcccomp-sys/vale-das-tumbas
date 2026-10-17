// Perigos e guardiões adaptados para 2D: pistões, placas que cedem, Autômato, Robô-vigia e pilares, canal e pontões,
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
  /* ---------- Motores: o vigia vê no facho, os pilares escondem ---------- */
  await ev(()=>{__vt.entrar('diesel');});
  r=await ev(()=>{const A=__vt.G.area,v=A.guardas[0];v.reiniciar();v.x=8*16;v.y=20*16;v.dir=1;__vt.ir(12*16,20*16,'esquerda');passoJogo(1/60,performance.now());return v.estado;});
  t.ok(r==='caca','parado na frente do facho do vigia: é visto',r);
  r=await ev(()=>{const A=__vt.G.area,v=A.guardas[0];v.reiniciar();v.x=8*16;v.y=18*16+4;v.dir=1;__vt.ir(13*16+4,18*16+4,'esquerda');passoJogo(1/60,performance.now());return v.estado;});
  t.ok(r==='patrulha','atrás de um pilar o vigia não vê',r);
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
