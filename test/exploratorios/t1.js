const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  await page.waitForTimeout(800);
  await page.screenshot({path:ROOT+'/test/shots/1-menu.png'});
  await page.evaluate(()=>__vt.start(true));
  await page.evaluate(()=>__vt.step(90));
  await page.waitForTimeout(300);
  await page.screenshot({path:ROOT+'/test/shots/2-vale.png'});
  console.log('state',JSON.stringify(await page.evaluate(()=>__vt.state())));
  console.log('LOGS',logs.length?logs.join('\n'):'(nenhum erro)');
  await browser.close();
})().catch(e=>{console.error('FALHOU',e);process.exit(1);});
