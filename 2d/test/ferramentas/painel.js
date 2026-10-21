// Foto do painel durante uma demonstração: node painel.js saida.png largura altura dpr toque
const {open}=require('../lib');
(async()=>{
  const [out,w,h,dpr,toque,extra]=process.argv.slice(2);
  const {browser,page,logs}=await open({viewport:{width:+w,height:+h},dpr:+dpr||1,touch:toque==='1'});
  await page.evaluate(()=>{document.getElementById('btnNew').click();__vt.entrar('steam');__vt.ir(17*16+8,13*16+8,'cima');__vt.quadros(10);__vt.painel('steam');});
  await page.waitForTimeout(200);
  if(extra)await page.evaluate(extra);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('#pPaleta .pb')][0];if(b)b.click();});
  await page.waitForTimeout(2600);
  await page.screenshot({path:out});
  console.log(await page.evaluate(()=>document.getElementById('pMsg').textContent));
  if(logs.length)console.log('LOGS:',logs.slice(0,5).join('\n'));
  await browser.close();
})();
