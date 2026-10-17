const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  const press=(x,z)=>ev(([x,z])=>{__vt.G.invuln=1;__vt.tp(x,z);__vt.sim(3);__vt.use();__vt.sim(3);},[x,z]);
  const info=()=>ev(()=>({r:__vt.bio.rooms.map(r=>({s:r.state,p:r.prog,sol:r.solved})),g:__vt.bio.gates.map(g=>+g.open.toFixed(2)),c:__vt.bio.clones.map(c=>c.state+'@'+c.x.toFixed(1)+','+c.z.toFixed(1)),h:__vt.G.hearts}));
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(106.6,90);__vt.sim(5);__vt.use();__vt.sim(150);});
  // abre a sala 1 por atalho e vai à sala 2
  await ev(()=>{const r=__vt.bio.rooms[0];r.solved=true;r.state='solved';r.gate.latched=true;r.gate.open=1;r.gate.fl.position.x=-4.62;r.gate.fr.position.x=4.62;r.gate.c.on=false;});
  // ---- SALA 2: névoa
  await ev(()=>{__vt.G.hearts=3;__vt.tp(0,-30);__vt.sim(5);});
  const fogAt=z=>ev((z)=>{__vt.tp(0,z);__vt.sim(10);__vt.renderOnce();return {near:+__vt.scene.fog.near.toFixed(1),far:+__vt.scene.fog.far.toFixed(1),spore:document.getElementById('spore').style.opacity};},z);
  for(const z of[-30,-34,-36,-40,-50,-64,-67])P('névoa em z='+z+': '+JSON.stringify(await fogAt(z)));
  await ev(()=>{__vt.tp(0,-38);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(60);});await shot('74-sala2-nevoa');
  P('auto-play sala 2: '+JSON.stringify((await info()).r[1]));
  await ev(()=>__vt.sim(300));
  // clone: andar devagar a ~5 m não acorda
  await ev(()=>{__vt.tp(2.6,-41);__vt.sim(5);});P('a ~5 m, parado: '+JSON.stringify((await info()).c));
  await ev(()=>{__vt.tp(2,-34.5);__vt.sim(3);__vt.key('s',false);__vt.key('w',true);__vt.sim(40);__vt.key('w',false);});
  P('andando devagar pela sala: '+JSON.stringify((await info()).c)+' pos='+JSON.stringify(await st()));
  // correr a ~8 m acorda
  await ev(()=>{__vt.tp(0,-36);__vt.sim(3);__vt.key('shift',true);__vt.key('w',true);__vt.sim(25);__vt.key('w',false);__vt.key('shift',false);});
  P('correndo a ~8 m: '+JSON.stringify((await info()).c)+' msg='+await last());
  await ev(()=>__vt.sim(10));await shot('75-clone-acordado');
  // perseguição: contato machuca
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;const c=__vt.bio.clones[0];c.x=2;c.z=-46;__vt.tp(0,-44);__vt.sim(150);});
  P('contato do Clone: corações='+(await info()).h+' (esperado <3) pos='+JSON.stringify(await st()));
  // sair da sala: dorme
  await ev(()=>{__vt.G.invuln=2;__vt.tp(0,-30);__vt.sim(5);});
  P('saiu da sala: '+JSON.stringify((await info()).c)+' msg='+await last());
  // errar a canção acorda
  await ev(()=>{__vt.G.hearts=3;__vt.tp(0,-44);__vt.sim(400);});
  await ev(()=>{__vt.tp(-5.5,-45.2);__vt.sim(3);});
  P('antes do erro: '+JSON.stringify((await info()).c));
  await press(-5.5,-45.2); // padrão [3,1,0,2]: o nó 0 é errado
  P('depois do erro (nó 0 no passo 1): '+JSON.stringify((await info()).c)+' msg='+await last());
  // sequência certa [3,1,0,2]: 3=(5.5,-57) 1=(5.5,-47) 0=(-5.5,-47) 2=(-5.5,-57)
  await ev(()=>{const c=__vt.bio.clones[0];c.state='sleep';c.x=c.hx;c.z=c.hz;c.cap.glass.visible=true;c.cap.col.on=true;__vt.G.hearts=3;__vt.sim(5);});
  await press(5.5,-55.2);await press(5.5,-45.2);await press(-5.5,-45.2);P('3/4: '+JSON.stringify((await info()).r[1]));
  await press(-5.5,-55.2);
  P('sala 2 resolvida: '+JSON.stringify(await info())+' msg='+await last());
  await ev(()=>__vt.sim(200));P('portão 2: '+JSON.stringify((await info()).g));
  await ev(()=>{__vt.tp(0,-62);__vt.cam.yaw=0;__vt.sim(5);});await shot('76-sala2-resolvida');
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
