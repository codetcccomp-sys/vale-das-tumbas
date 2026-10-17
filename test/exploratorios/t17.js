const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  const press=(x,z)=>ev(([x,z])=>{__vt.tp(x,z);__vt.sim(3);__vt.use();__vt.sim(3);},[x,z]);
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(106.6,90);__vt.sim(5);__vt.use();__vt.sim(150);});
  P('entrou: '+JSON.stringify(await st()));
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(30);});await shot('70-salao');
  P('draw calls salão: '+await ev(()=>{__vt.renderOnce();return __vt.renderer.info.render.calls;}));
  // ---- SALA 1
  await ev(()=>{__vt.tp(0,-16);__vt.sim(3);});
  const bio=()=>ev(()=>({r:__vt.bio.rooms.map(r=>({s:r.state,p:r.prog,sol:r.solved,played:r.played})),g:__vt.bio.gates.map(g=>+g.open.toFixed(2)),c:__vt.bio.clones.map(c=>c.state)}));
  P('auto-play ao entrar na sala 1: '+JSON.stringify((await bio()).r[0]));
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.35;__vt.sim(60);});await shot('71-sala1-tocando');
  await ev(()=>__vt.sim(240));
  P('depois da sequência: '+JSON.stringify((await bio()).r[0]));
  await press(-5,-22.6);await press(-5,-22.6);
  P('nó errado: '+JSON.stringify((await bio()).r[0])+' msg='+await last());
  // jogador não pode apertar enquanto toca
  await ev(()=>{const r=__vt.bio.rooms[0];r.state='playing';r.pt=0;r.step=0;});
  await press(0,-22.6);P('apertar durante a canção ignora: '+JSON.stringify((await bio()).r[0]));
  await ev(()=>{const r=__vt.bio.rooms[0];r.state='idle';r.prog=0;});
  // sequência correta [0,2,1]: x=-5, 5, 0
  await press(-5,-22.6);await press(5,-22.6);P('2/3: '+JSON.stringify((await bio()).r[0]));
  await shot('72-sala1-meio');
  await press(0,-22.6);
  P('resolvida: '+JSON.stringify(await bio())+' msg='+await last());
  await ev(()=>{__vt.sim(200);});
  P('portão 1 aberto='+JSON.stringify((await bio()).g)+' col.on='+await ev(()=>__vt.bio.gates[0].c.on));
  await ev(()=>{__vt.tp(0,-30);__vt.cam.yaw=0;__vt.sim(5);});await shot('73-portao-aberto');
  // atravessar o portão andando
  await ev(()=>{__vt.tp(0,-31);__vt.key('w',true);__vt.sim(90);__vt.key('w',false);});
  P('atravessou o portão 1: '+JSON.stringify(await st()));
  // portão fechado bloqueia
  await ev(()=>{__vt.tp(0,-64);__vt.key('w',true);__vt.sim(120);__vt.key('w',false);});
  P('portão 2 fechado bloqueia: z='+(await st()).z.toFixed(2)+' (esperado ~ -65.3)');
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
