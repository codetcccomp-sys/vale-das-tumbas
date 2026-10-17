const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  await page.screenshot({path:ROOT+'/test/shots/130-inicio.png'});
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.time=0.2;__vt.cam.yaw=0.3;__vt.cam.pitch=0.3;__vt.sim(40);});await page.waitForTimeout(3200);await shot('131-vale-dia');
  await ev(()=>{__vt.G.time=0.78;__vt.sim(10);__vt.G.lanternOn=true;__vt.G.time=0.78;__vt.sim(40);});await shot('132-vale-noite');
  await ev(()=>{__vt.G.time=0.2;__vt.tp(0,-110);__vt.cam.yaw=0;__vt.cam.pitch=0.25;__vt.sim(60);});await shot('133-vale-estrada');
  await ev(()=>{__vt.G.relics.steam=__vt.G.relics.diesel=__vt.G.relics.atom=__vt.G.relics.bio=true;__vt.tp(0,-118);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(40);});await shot('134-porta-final');
  console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
  await browser.close();
})();
