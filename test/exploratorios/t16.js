const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const ev=(f,a)=>page.evaluate(f,a);const P=s=>console.log(s);
  await ev(()=>{__vt.start(true);__vt.sim(5);__vt.G.relics.steam=true;__vt.G.relics.diesel=true;__vt.G.relics.atom=true;__vt.tp(0,-128.4);__vt.saveNow();});
  await page.reload();await page.waitForFunction(()=>window.__vt);
  await page.click('#btnContinue');await page.waitForFunction(()=>__vt.G.mode==='play');
  P('HUD após continuar: '+await ev(()=>document.getElementById('relicCount').textContent)+' relíquias='+JSON.stringify(await ev(()=>__vt.G.relics)));
  await ev(()=>{__vt.G.cam;__vt.cam.yaw=0;__vt.cam.pitch=0.55;__vt.tp(0,-128.4);__vt.sim(20);__vt.renderOnce();});
  await page.screenshot({path:ROOT+'/test/shots/60-encaixes.png'});
  await ev(()=>{__vt.tp(0,-128.4);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('porta final com 3/4: '+await ev(()=>document.querySelector('#msgs .toast:last-child')?.textContent));
  await ev(()=>{__vt.tp(-96.6,100);__vt.sim(5);__vt.use();__vt.sim(150);});
  P('reentrou no Reator: área='+await ev(()=>__vt.state().area)+' núcleo visível='+await ev(()=>__vt.atm.core.visible)+' (esperado false)');
  await ev(()=>{__vt.tp(0,-104.6);__vt.sim(5);});
  P('aviso de pegar relíquia ausente: '+await ev(()=>{__vt.renderOnce();return document.getElementById('prompt').style.display;}));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n')[0]);process.exit(1);});
