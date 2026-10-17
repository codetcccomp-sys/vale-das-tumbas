const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page}=await open();const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);document.body.classList.remove('playing');});
  const cases=[['atom',4.5,-9.4,-1.17],['bio',5.5,6.5,-1.07],['final',-5.8,0.2,-0.72],['diesel',3.3,-74.3,-0.31],['atom',7.9,-62.2,-1.16],['bio',7.6,-40.5,0.04]];
  let i=0;
  for(const[k,x,z,yaw]of cases){
    const info=await ev(([k,x,z,yaw])=>{const A=__vt.TOMB_AREAS[k];__vt.setArea(A);const y=groundAt(A,x,z,12);__vt.tp(x,z,y);__vt.G.p.face=Math.PI;__vt.cam.yaw=yaw;__vt.cam.pitch=0.3;__vt.cam.cur=__vt.cam.want;for(let j=0;j<40;j++)__vt.renderOnce();return 'cur='+__vt.cam.cur.toFixed(2)+' yaw='+__vt.cam.yaw.toFixed(2)+' cam=('+__vt.camera.position.x.toFixed(1)+','+__vt.camera.position.y.toFixed(1)+','+__vt.camera.position.z.toFixed(1)+')';},[k,x,z,yaw]);
    console.log(k,x,z,info);
    await page.screenshot({path:ROOT+'/test/shots/170-cam-'+(i++)+'.png'});
  }
  await browser.close();
})();
