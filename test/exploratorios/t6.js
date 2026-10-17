const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const shot=async n=>{await page.evaluate(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  await page.evaluate(()=>{__vt.start(true);__vt.G.time=0.76;__vt.tp(-60,124);__vt.cam.yaw=0.3;__vt.cam.pitch=0.25;__vt.sim(40);});
  await shot('17-noite');
  await page.evaluate(()=>{__vt.G.time=0.5;__vt.tp(0,100);__vt.cam.yaw=0;__vt.sim(40);});
  await shot('18-entardecer');
  await page.evaluate(()=>{__vt.G.time=0.76;__vt.tp(-60,124);__vt.cam.yaw=-0.2;__vt.G.lanternOn=true;__vt.sim(40);});
  console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
  await browser.close();
})().catch(e=>{console.error('FALHOU',e);process.exit(1);});
