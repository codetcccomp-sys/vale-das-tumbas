const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  const press=(x,z)=>ev(([x,z])=>{__vt.G.invuln=1;__vt.tp(x,z);__vt.sim(3);__vt.use();__vt.sim(3);},[x,z]);
  const info=()=>ev(()=>({r:__vt.bio.rooms.map(r=>({s:r.state,p:r.prog,sol:r.solved})),g:__vt.bio.gates.map(g=>+g.open.toFixed(2)),c:__vt.bio.clones.map(c=>c.state+'@'+c.x.toFixed(1)+','+c.z.toFixed(1)),h:__vt.G.hearts}));
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(106.6,90);__vt.sim(5);__vt.use();__vt.sim(150);});
  const open_=i=>ev((i)=>{const r=__vt.bio.rooms[i];r.solved=true;r.state='solved';r.gate.latched=true;r.gate.open=1;r.gate.fl.position.x=-4.62;r.gate.fr.position.x=4.62;r.gate.c.on=false;for(const n of r.nodes)n.stay=true;if(r.heart)r.heart.mat.color.setHex(0x8aff6a);},i);
  await open_(0);await open_(1);
  // vistas da sala 2 e da sala 3
  await ev(()=>{__vt.tp(-1,-42);__vt.cam.yaw=-1.25;__vt.cam.pitch=0.25;__vt.sim(30);});await shot('77-sala2-clone');
  await ev(()=>{__vt.bio.rooms[1].solved=false;__vt.bio.rooms[1].state='playing';__vt.bio.rooms[1].pt=0;__vt.bio.rooms[1].step=0;__vt.tp(0,-44);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(52);});await shot('78-sala2-tocando');
  await open_(1);
  // ---- SALA 3
  await ev(()=>{__vt.G.hearts=3;__vt.tp(0,-69);__vt.sim(5);});
  await ev(()=>{__vt.tp(0,-70);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(5);});
  await ev(()=>{__vt.tp(0,-76);__vt.sim(3);});P('auto-play sala 3: '+JSON.stringify((await info()).r[2]));
  await ev(()=>{__vt.sim(40);});await shot('79-sala3-tocando');
  P('draw calls sala 3 (de frente): '+await ev(()=>{__vt.renderOnce();return __vt.renderer.info.render.calls;}));
  await ev(()=>__vt.sim(400));
  await ev(()=>{__vt.tp(-3,-80);__vt.cam.yaw=-1.0;__vt.cam.pitch=0.25;__vt.sim(30);});await shot('80-sala3-capsulas');
  // errar acorda os dois
  await press(-6,-82.2); // padrão [2,0,3,0,1]: nó 0 no passo 1 é errado
  P('erro na sala 3: '+JSON.stringify((await info()).c)+' msg='+await last());
  await ev(()=>{__vt.G.invuln=0;__vt.tp(0,-80);__vt.cam.yaw=0;__vt.sim(60);});await shot('81-clones-perseguem');
  // perseguição com o jogador correndo em círculos
  const res=await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;let minD=99,hits=0,prev=3;const cl=__vt.bio.clones.filter(c=>c.room.id===2);
    for(let i=0;i<900;i++){const ang=i*0.02;__vt.tp(Math.cos(ang)*5,-80+Math.sin(ang)*3.5);const p=__vt.G.p;__vt.sim(1);for(const c of cl){minD=Math.min(minD,Math.hypot(c.x-p.x,c.z-p.z));}if(__vt.G.hearts<prev){hits++;prev=__vt.G.hearts;}if(__vt.G.hearts<=0)break;}
    return{minD:+minD.toFixed(2),hits,pos:cl.map(c=>c.x.toFixed(1)+','+c.z.toFixed(1))};});
  P('perseguição circular (jogador teleportando em volta dos bulbos): '+JSON.stringify(res));
  // clones não atravessam paredes: posições dentro da sala
  P("clones da sala 3 dentro dela: "+await ev(()=>__vt.bio.clones.filter(c=>c.room.id===2).every(c=>c.x>-9&&c.x<9&&c.z>-98.4&&c.z<-66)));
  // sair da sala: dormem
  await ev(()=>{__vt.G.invuln=3;__vt.tp(0,-63);__vt.sim(5);});
  P('fora da sala 3: '+JSON.stringify((await info()).c));
  // sequência certa [2,0,3,0,1]
  await ev(()=>{__vt.G.hearts=3;__vt.tp(0,-80);__vt.sim(5);});
  await press(2,-82.2);await press(-6,-82.2);await press(6,-82.2);await press(-6,-82.2);P('4/5: '+JSON.stringify((await info()).r[2]));
  await press(-2,-82.2);
  P('sala 3 resolvida: '+JSON.stringify(await info())+' msg='+await last());
  await ev(()=>__vt.sim(200));
  await ev(()=>{__vt.tp(0,-96);__vt.key('w',true);__vt.sim(120);__vt.key('w',false);});
  P('atravessou o portão 3: '+JSON.stringify(await st()));
  await ev(()=>{__vt.tp(0,-104.6);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(40);});await shot('82-camara');
  await ev(()=>{__vt.G.relics.steam=true;__vt.G.relics.diesel=true;__vt.G.relics.atom=true;});
  await ev(()=>{__vt.use();__vt.sim(5);});
  P('relíquias: '+JSON.stringify(await ev(()=>__vt.G.relics))+' semente visível='+await ev(()=>__vt.bio.seed.visible));
  await page.waitForTimeout(2700);await ev(()=>__vt.sim(220));
  P('depois da relíquia: '+JSON.stringify(await st())+' HUD='+await ev(()=>document.getElementById('relicCount').textContent));
  await page.waitForTimeout(800);P('msg: '+await last());
  P('save: '+await ev(()=>JSON.stringify(JSON.parse(localStorage.getItem('vale_das_tumbas_save')).relics)));
  P('diário: '+await ev(()=>JSON.stringify(__vt.G.diary.filter(d=>d.startsWith('bio')))));
  P('encaixe final lilás: '+await ev(()=>{const s=document.querySelectorAll('#relics i');return Array.from(s).map(i=>i.classList.contains('on')).join(',');}));
  await ev(()=>{__vt.cam.yaw=0;__vt.tp(0,-128.4);__vt.sim(5);__vt.use();__vt.sim(3);});
  P('porta final com 4/4: '+await last());
  // recarrega e continua
  await page.reload();await page.waitForFunction(()=>window.__vt);
  await page.click('#btnContinue');await page.waitForFunction(()=>__vt.G.mode==='play');
  P('continuar: '+JSON.stringify(await ev(()=>__vt.G.relics)));
  await ev(()=>{__vt.tp(106.6,90);__vt.sim(5);__vt.use();__vt.sim(150);});
  await ev(()=>{__vt.tp(0,-104.6);__vt.sim(5);});
  P('semente some após carregar com relíquia: visível='+await ev(()=>__vt.bio.seed.visible)+' prompt='+await ev(()=>{__vt.renderOnce();return document.getElementById('prompt').style.display;}));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
