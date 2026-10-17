const {open}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const ev=(f,a)=>page.evaluate(f,a);
  const info=()=>ev(()=>{__vt.renderOnce();const i=__vt.renderer.info;return{calls:i.render.calls,tris:i.render.triangles};});
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(-96.6,100);__vt.sim(5);__vt.use();__vt.sim(150);});
  for(const [n,x,z,yaw] of [['salão',0,3,Math.PI],['sala 1 (canal)',0,-10,0],['sala 2',0,-36,0],['sala 3',0,-69,0],['câmara',0,-104,0]]){
    await ev(([x,z,yaw])=>{__vt.tp(x,z);__vt.cam.yaw=yaw;__vt.sim(5);},[x,z,yaw]);
    console.log(n,JSON.stringify(await info()));
  }
  console.log('merge Reator:',JSON.stringify(await ev(()=>__vt.atm.merge)));
  console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
  await browser.close();
})();
