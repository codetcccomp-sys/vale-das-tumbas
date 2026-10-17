const {open}=require('../lib');
(async()=>{
  const t0=Date.now();
  const {browser,page,logs}=await open();
  const ev=(f,a)=>page.evaluate(f,a);
  console.log('tempo até o gancho de teste existir (inclui abrir o navegador): '+(Date.now()-t0)+' ms');
  console.log(JSON.stringify(await ev(()=>{const n=performance.getEntriesByType('navigation')[0];return {dcl:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd),res:performance.getEntriesByType('resource').length};})));
  // tempo de construção das áreas: reexecuta o carregamento medindo o script principal
  const r=await ev(()=>{const t=performance.now();return {now:Math.round(t)};});
  console.log(JSON.stringify(r));
  await browser.close();
})();
