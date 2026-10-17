const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page}=await open({viewport:{width:412,height:860}});const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.time=0.24;document.getElementById('msgs').innerHTML='';});
  for(const[n,x,z,yaw,pitch]of[['estrada',2,60,0.15,0.2],['oeste',-60,20,1.6,0.18],['sudeste',80,110,-1.0,0.2],['norte',-20,-115,0.4,0.2]]){
    await ev(([x,z,yaw,pitch])=>{__vt.tp(x,z);__vt.cam.yaw=yaw;__vt.cam.pitch=pitch;__vt.cam.want=5.6;__vt.sim(30);__vt.renderOnce();},[x,z,yaw,pitch]);
    await page.screenshot({path:ROOT+'/test/shots/160-chao-'+n+'.png'});
  }
  await browser.close();
})();
