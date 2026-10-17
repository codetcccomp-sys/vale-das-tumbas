const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:640,height:420}});const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.time=0.22;document.body.classList.remove('playing');document.getElementById('msgs').innerHTML='';});
  const views=[['vapor',115,-70,-0.9],['diesel',-135,-35,1.2],['atomo',-105,80,2.3],['bio',115,80,-2.2],['norte',0,-108,0.0],['centro',10,60,0.4]];
  for(const[n,x,z,yaw]of views){
    await ev(([x,z,yaw])=>{__vt.tp(x,z);__vt.cam.yaw=yaw;__vt.cam.pitch=0.42;__vt.cam.want=22;__vt.cam.cur=22;__vt.sim(5);__vt.cam.cur=22;__vt.renderOnce();},[x,z,yaw]);
    await page.screenshot({path:ROOT+'/test/shots/155-vista-'+n+'.png'});
  }
  await browser.close();
})();
