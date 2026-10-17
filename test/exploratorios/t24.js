const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  // porta com menos de 4 relíquias
  await ev(()=>{__vt.G.relics.steam=true;__vt.G.relics.diesel=true;__vt.G.relics.atom=true;__vt.tp(0,-125);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('porta com 3/4: área='+(await st()).area+' msg='+await last());
  await ev(()=>{__vt.G.relics.bio=true;__vt.sim(3);__vt.renderOnce();});
  P('rótulo com 4/4: '+await ev(()=>document.getElementById('prompt').textContent));
  await ev(()=>{__vt.use();__vt.sim(150);});
  P('entrou: '+JSON.stringify(await st())+' msg='+await last());
  P('lanterna: '+await ev(()=>{__vt.G.lanternOn=true;const a=__vt.G.lantern;__vt.sim(300);return (a-__vt.G.lantern).toFixed(2)+' gasto em 5 s (esperado 0)';}));
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(30);});await shot('90-salao');
  P('draw calls salão: '+await ev(()=>{__vt.renderOnce();return __vt.renderer.info.render.calls;}));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
