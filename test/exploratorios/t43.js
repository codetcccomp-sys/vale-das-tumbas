const {open,ROOT}=require('../lib');
(async()=>{
  const t0=Date.now();const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);
  console.log('carregou em '+(Date.now()-t0)+' ms; DCL='+await ev(()=>Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd))+' ms');
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.time=0.22;document.body.classList.remove('playing');document.getElementById('msgs').innerHTML='';});
  console.log('colisores do Vale: '+await ev(()=>__vt.valeArea.cols.length)+' | malhas no Vale: '+await ev(()=>{let n=0;__vt.valeArea.group.traverse(o=>{if(o.isMesh)n++;});return n;}));
  const views=[['camp',0,140,0],['ne',95,-40,-0.7],['w',-120,-30,1.3],['sw',-110,60,2.4],['se',110,60,-2.4],['n',0,-95,0],['meio',30,40,-0.5]];
  for(const[n,x,z,yaw]of views){
    const dc=await ev(([x,z,yaw])=>{__vt.tp(x,z);__vt.cam.yaw=yaw;__vt.cam.pitch=0.22;__vt.cam.want=5.6;__vt.sim(20);__vt.renderOnce();return __vt.renderer.info.render.calls+' calls / '+__vt.renderer.info.render.triangles+' tris';},[x,z,yaw]);
    console.log('vista '+n+': '+dc);
    await page.screenshot({path:ROOT+'/test/shots/150-mundo-'+n+'.png'});
  }
  console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
  await browser.close();
})();
