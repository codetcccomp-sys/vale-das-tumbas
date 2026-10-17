const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);
  const ev=(f,a)=>page.evaluate(f,a);
  const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  // porta no Vale
  await ev(()=>{__vt.tp(-136.4,-10);__vt.sim(5);__vt.use();__vt.sim(150);});
  P('entrou na tumba dos Motores: '+JSON.stringify(await st()));
  const D=()=>ev(()=>({gens:__vt.dsl.gens.map(g=>g.lit),gates:__vt.dsl.gates.map(g=>g.latched?Math.round(g.open*100):-1),sens:Object.fromEntries(Object.entries(__vt.dsl.S).map(([k,s])=>[k,s.lit])),steps:Object.fromEntries(Object.entries(__vt.dsl.F).map(([k,f])=>[k,f.step])),elev:{p:__vt.dsl.elev.powered,y:+__vt.dsl.elev.y.toFixed(2)}}));
  await shot('30-hall');
  // gerador 1
  await ev(()=>{__vt.tp(-3.6,-3.5);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('gerador 1 ligado: '+(await D()).gens);
  // ---- SALA 1 ----
  await ev(()=>{__vt.tp(0,-10);__vt.sim(30);});await shot('31-sala1');
  const turn=async(x,z,n,y)=>{for(let i=0;i<n;i++){await ev(([x,z,y])=>{__vt.tp(x,z,y);__vt.sim(3);__vt.use();__vt.sim(40);},[x,z,y]);}};
  // atalho: F1 apontando para o norte (step 0) não pode acender nada
  await turn(4.3,-14,3);
  P('F1 virado ao norte (step '+(await D()).steps.F1+'): S1 acesa='+(await D()).sens.S1+' (esperado false)');
  await turn(4.3,-14,4);
  let d=await D();P('F1 em step '+d.steps.F1+' (esperado 7): S1 acesa='+d.sens.S1+' porta1='+d.gates[0]);
  await ev(()=>__vt.sim(200));d=await D();P('porta 1 aberta: '+d.gates[0]+'%  colisor ligado='+await ev(()=>__vt.dsl.gates[0].c.on));
  await ev(()=>{__vt.tp(0,-12);__vt.sim(3);});await shot('32-feixe1');
  // atravessar a porta 1 caminhando
  await ev(()=>{__vt.tp(0,-31);__vt.key('w',true);__vt.sim(90);__vt.key('w',false);});
  P('atravessou a porta 1: '+JSON.stringify(await st()));
  // ---- SALA 2 ----
  await ev(()=>{__vt.tp(-4.2,-36.6);__vt.sim(3);__vt.use();__vt.sim(5);});
  // atalho: F2 em step 0 (norte) não pode acender S3 (outra altura)
  await turn(4,-40,4);d=await D();P('F2 step '+d.steps.F2+' (2+4=6): S2='+d.sens.S2+' S3='+d.sens.S3+' elev='+JSON.stringify(d.elev));
  await turn(4,-40,1);d=await D();P('F2 step '+d.steps.F2+' (esperado 7): S2='+d.sens.S2+' elevador energizado='+d.elev.p);
  await ev(()=>{__vt.tp(-7.4,-54.3);__vt.sim(5);__vt.use();__vt.sim(5);});
  await ev(()=>__vt.sim(220));P('elevador subiu: '+JSON.stringify((await D()).elev)+' jogador='+JSON.stringify(await st()));
  await shot('33-elevador');
  // caminhar do elevador até o holofote da passarela (andando de verdade)
  await ev(()=>{__vt.key('s',false);__vt.key('w',true);__vt.cam.yaw=0;__vt.sim(40);__vt.key('w',false);});
  P('na passarela: '+JSON.stringify(await st()));
  await turn(-7.3,-59.6,2,5);d=await D();P('F3 step '+d.steps.F3+' (esperado 2): S3='+d.sens.S3+' porta2='+d.gates[1]);
  await shot('34-passarela');
  await ev(()=>__vt.sim(250));
  // descer: pular da passarela ao chão e seguir
  await ev(()=>{__vt.tp(-3,-60,0);__vt.sim(5);__vt.key('w',true);__vt.sim(100);__vt.key('w',false);});
  P('saiu da sala 2 pela porta: '+JSON.stringify(await st()));
  // ---- SALA 3 ----
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;});
  await ev(()=>{__vt.tp(2,-68.5);__vt.sim(3);__vt.use();__vt.sim(5);});
  await shot('35-sala3');
  // atalho: os dois holofotes apontando para o norte NÃO podem abrir a porta
  await turn(-6,-70.5,3);await turn(6,-70.5,5);d=await D();
  P('FL step '+d.steps.FL+', FR step '+d.steps.FR+': SL='+d.sens.SL+' SR='+d.sens.SR+' porta3='+d.gates[2]);
  P('RESULTADO FINAL desta etapa será conferido após virar os dois corretamente...');
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
