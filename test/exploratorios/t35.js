const {open,ROOT}=require('../lib');
(async()=>{
  const P=s=>console.log(s);
  const {browser,page,logs}=await open({viewport:{width:860,height:400}});
  const ev=(f,a)=>page.evaluate(f,a);
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  await page.screenshot({path:ROOT+'/test/shots/120-paisagem-inicio.png'});
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(106.6,90);__vt.sim(5);});
  await ev(()=>{__vt.cam.yaw=Math.PI/2;});await shot('121-paisagem-hud');
  const rect=sel=>ev(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom),getComputedStyle(e).display];},sel);
  P('prompt='+JSON.stringify(await rect('#prompt'))+' bUse='+JSON.stringify(await rect('#bUse'))+' bJump='+JSON.stringify(await rect('#bJump'))+' bLight='+JSON.stringify(await rect('#bLight'))+' bRun='+JSON.stringify(await rect('#bRun'))+' joy='+JSON.stringify(await rect('#joyBase')));
  P('msgs='+JSON.stringify(await rect('#msgs'))+' hl='+JSON.stringify(await rect('#hl'))+' hr='+JSON.stringify(await rect('#hr')));
  await ev(()=>{__vt.use();__vt.sim(150);__vt.cam.yaw=0;__vt.sim(5);});await shot('122-paisagem-tumba');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>__vt.G.mode==='paused');await page.screenshot({path:ROOT+'/test/shots/123-paisagem-pausa.png'});
  P('painel da pausa: '+JSON.stringify(await rect('#scPause .panel'))+' rolagem='+await ev(()=>{const p=document.querySelector('#scPause .panel');return p.scrollHeight+'>'+p.clientHeight;}));
  await page.click('#pResume');await page.waitForFunction(()=>__vt.G.mode==='play');
  await page.keyboard.press('m');await page.waitForFunction(()=>__vt.G.mode==='diary');await page.screenshot({path:ROOT+'/test/shots/124-paisagem-mapa.png'});
  P('painel do diário: '+JSON.stringify(await rect('#scDiary .panel'))+' rolagem='+await ev(()=>{const p=document.querySelector('#scDiary .panel');return p.scrollHeight+'>'+p.clientHeight;}));
  await page.click('#dClose');
  // FIM em paisagem
  await ev(()=>{const c=__vt.cty;});
  await ev(()=>{__vt.G.mode='end';showScreen('scEnd');});await page.screenshot({path:ROOT+'/test/shots/125-paisagem-fim.png'});
  P('painel FIM: '+JSON.stringify(await rect('#scEnd .panel')));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
