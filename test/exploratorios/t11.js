const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const info=()=>ev(()=>{const i=__vt.renderer.info;return{calls:i.render.calls,tris:i.render.triangles};});
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(-136.4,-10);__vt.sim(5);__vt.use();__vt.sim(150);});
  // contato com a linha livre
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;const g=__vt.dsl.guard;g.state='chase';g.x=3;g.z=-86;g.lost=0;__vt.tp(3,-78);__vt.sim(240);});
  const s=await st();P('contato do Robô-vigia com linha livre: corações='+s.hearts+' (esperado menos que 3)');
  // pilar esconde: robô atrás do pilar central nunca vê
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;const g=__vt.dsl.guard;g.state='patrol';g.x=0;g.z=-88;g.wps=[[0,-88]];g.wi=0;g.wait=99;__vt.tp(0,-80);__vt.sim(1);});
  let seen=false;for(let i=0;i<500;i++){await ev(()=>{__vt.dsl.guard.wait=99;__vt.sim(1);});if(await ev(()=>__vt.dsl.guard.state)==='chase'){seen=true;break;}}
  P('jogador escondido atrás do pilar central, robô parado a 8 m: viu='+seen+' (esperado false)');
  // colisão nas paredes da tumba dos Motores
  await ev(()=>{__vt.dsl.guard.wait=0;__vt.tp(0,5);__vt.key('a',true);__vt.key('shift',true);__vt.sim(200);__vt.key('a',false);});
  P('parede oeste do salão (esperado x>=-8.6): '+(await st()).x.toFixed(2));
  await ev(()=>{__vt.tp(0,-100);__vt.key('s',true);__vt.sim(10);__vt.key('s',false);});
  // limite: ir de cima para baixo no fosso inexistente: cair do elevador
  await ev(()=>{__vt.tp(-7.3,-58,5);__vt.sim(3);__vt.key('d',true);__vt.sim(90);__vt.key('d',false);__vt.sim(60);});
  P('andar para fora da passarela (cai ao chão, sem morrer): '+JSON.stringify(await st()));
  // desempenho
  await ev(()=>{__vt.tp(0,3);__vt.cam.yaw=Math.PI;__vt.sim(5);__vt.renderOnce();});P('chamadas de desenho no salão olhando para dentro: '+JSON.stringify(await info()));
  await ev(()=>{__vt.tp(0,-10);__vt.cam.yaw=0;__vt.sim(5);__vt.renderOnce();});P('olhando a sala 1: '+JSON.stringify(await info()));
  await ev(()=>{__vt.tp(0,-69);__vt.cam.yaw=0;__vt.sim(5);__vt.renderOnce();});P('sala 3: '+JSON.stringify(await info()));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
