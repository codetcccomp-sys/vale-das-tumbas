// Foto rápida do jogo: node foto.js saida.png largura altura dpr "codigo js depois de iniciar"
const {open}=require('../lib');
(async()=>{
  const [out,w,h,dpr,cod,toque]=process.argv.slice(2);
  const {browser,page,logs}=await open({viewport:{width:+w,height:+h},dpr:+dpr||1,touch:toque==='1'});
  await page.evaluate(()=>{document.getElementById('btnNew').click();});
  await page.waitForTimeout(300);
  if(cod)await page.evaluate(cod);
  await page.waitForTimeout(500);
  await page.screenshot({path:out});
  console.log(JSON.stringify(await page.evaluate(()=>[window.__vt.estado(),window.__vt.escala()])));
  if(logs.length)console.log('LOGS:',logs.slice(0,5).join('\n'));
  await browser.close();
})();
