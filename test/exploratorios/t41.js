const {open,ROOT}=require('../lib');
(async()=>{
  for(const vp of [{width:412,height:860},{width:360,height:740},{width:390,height:844}]){
    const {browser,page}=await open({viewport:vp});const ev=(f,a)=>page.evaluate(f,a);
    await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(94.6+0,-90);const T=__vt.TOMBS.steam;__vt.tp(T.x+T.face[0]*3.4,T.z+T.face[1]*3.4);__vt.cam.yaw=Math.PI/2;__vt.sim(10);__vt.renderOnce();});
    const rects=await ev(()=>{const R=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)];};return {prompt:R('#prompt'),bRun:R('#bRun'),bLight:R('#bLight'),bJump:R('#bJump'),bUse:R('#bUse'),msgs:R('#msgs')};});
    console.log(vp.width+'x'+vp.height,JSON.stringify(rects));
    if(vp.width===412)await page.screenshot({path:ROOT+'/test/shots/135-prompt.png'});
    await browser.close();
  }
})();
