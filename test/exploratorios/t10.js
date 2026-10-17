const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);
  const ev=(f,a)=>page.evaluate(f,a);
  const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const D=()=>ev(()=>({gates:__vt.dsl.gates.map(g=>g.latched?Math.round(g.open*100):-1),sens:Object.fromEntries(Object.entries(__vt.dsl.S).map(([k,s])=>[k,s.lit])),steps:Object.fromEntries(Object.entries(__vt.dsl.F).map(([k,f])=>[k,f.step]))}));
  const turn=async(x,z,n,y)=>{for(let i=0;i<n;i++){await ev(([x,z,y])=>{__vt.tp(x,z,y);__vt.sim(3);__vt.use();__vt.sim(40);},[x,z,y]);}};
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(-136.4,-10);__vt.sim(5);__vt.use();__vt.sim(150);});
  // abre as portas 1 e 2 diretamente para ir à sala 3 (já testadas)
  await ev(()=>{for(const g of __vt.dsl.gates.slice(0,2)){g.latched=true;g.open=1;g.g.position.y=8.4;g.c.on=false;}__vt.dsl.elev.powered=true;});
  // ---- fachos da sala 1 vistos de perto ----
  await turn(4.3,-14,4);   // F1 3 -> 7
  await ev(()=>{__vt.tp(7.2,-12);__vt.cam.yaw=Math.PI/4;__vt.cam.pitch=0.22;__vt.sim(30);});await shot('40-feixe-sala1');
  // ---- SALA 3: apontar corretamente ----
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;});
  await turn(-6,-70.5,4);P('FL step='+(await D()).steps.FL+' (esperado 1): SR='+(await D()).sens.SR);
  await turn(6,-70.5,4);let d=await D();P('FR step='+d.steps.FR+' (esperado 7): SL='+d.sens.SL+' SR='+d.sens.SR+' porta3='+d.gates[2]);
  await ev(()=>{__vt.tp(0,-69);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(5);});await shot('41-luz-cruzada');
  await ev(()=>__vt.sim(240));d=await D();P('porta3 aberta='+d.gates[2]+'% colisor='+await ev(()=>__vt.dsl.gates[2].c.on));
  // ---- Robô-vigia ----
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;});
  const pos0=await ev(()=>({x:__vt.dsl.guard.x,z:__vt.dsl.guard.z}));
  await ev(()=>{__vt.tp(0,-67.5);__vt.sim(600);});
  const pos1=await ev(()=>({x:__vt.dsl.guard.x,z:__vt.dsl.guard.z,state:__vt.dsl.guard.state}));
  P('patrulha: de '+JSON.stringify(pos0)+' para '+JSON.stringify(pos1)+' (esperado: se mexeu)');
  // detecção: jogador parado no meio da sala, no campo de visão
  await ev(()=>{const g=__vt.dsl.guard;g.state='patrol';g.x=0;g.z=-90;g.wi=2;g.wait=0;__vt.tp(0,-78);__vt.G.p.vy=0;__vt.sim(1);});
  let seenAt=-1;for(let i=0;i<900;i++){await ev(()=>__vt.sim(1));const s=await ev(()=>__vt.dsl.guard.state);if(s==='chase'){seenAt=i;break;}}
  P('robô-vigia viu o jogador no meio da sala após '+(seenAt/60).toFixed(1)+' s (esperado: algum momento nos primeiros 10 s)');
  await ev(()=>__vt.sim(10));await shot('42-robo-vigia');
  // esconder atrás do pilar quebra a visão
  const h0=(await st()).hearts;
  await ev(()=>{const g=__vt.dsl.guard;g.x=0;g.z=-84-2.5;g.state='chase';});
  await ev(()=>{__vt.tp(0,-80);__vt.sim(200);});
  P('contato do robô: corações '+h0+' -> '+(await st()).hearts+' (esperado: perdeu 1)');
  // sair da sala faz o robô desistir
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;const g=__vt.dsl.guard;g.state='chase';g.x=0;g.z=-90;__vt.tp(0,-97);__vt.sim(10);__vt.tp(0,-103);__vt.sim(40);});
  P('jogador fora da sala: robô='+await ev(()=>__vt.dsl.guard.state));
  // ---- câmara e relíquia ----
  await ev(()=>{__vt.tp(0,-104.6);__vt.cam.yaw=0;__vt.sim(40);});await shot('43-camara');
  await ev(()=>{__vt.use();__vt.sim(5);});
  P('relíquias: '+JSON.stringify(await ev(()=>__vt.G.relics))+' vela some da cena='+!(await ev(()=>__vt.dsl.plug.visible)));
  await page.waitForTimeout(2700);await ev(()=>__vt.sim(220));
  P('depois da relíquia: '+JSON.stringify(await st())+' contador HUD='+await ev(()=>document.getElementById('relicCount').textContent));
  await shot('44-volta');
  // encaixes da porta final acesos
  await ev(()=>{__vt.G.relics.steam=true;__vt.tp(0,-128.4);__vt.cam.yaw=0;__vt.cam.pitch=0.6;__vt.sim(20);});
  await ev(()=>{const f=window.__vt;});
  await shot('45-encaixes');
  P('save: '+await ev(()=>JSON.stringify(JSON.parse(localStorage.getItem('vale_das_tumbas_save')).relics)));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
