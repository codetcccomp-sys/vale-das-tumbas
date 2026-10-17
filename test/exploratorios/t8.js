const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);
  const vis=id=>page.evaluate(id=>{const e=document.getElementById(id);return !!e&&!e.hidden&&getComputedStyle(e).display!=='none';},id);
  const mode=m=>page.waitForFunction(m=>__vt.G.mode===m,m,{timeout:15000});
  // ---- salvar e continuar ----
  await page.evaluate(()=>{__vt.start(true);__vt.sim(10);__vt.G.relics.steam=true;__vt.tp(30,40);__vt.sim(5);__vt.saveNow();});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('vale_das_tumbas_save')));
  P('salvo: relíquias='+JSON.stringify(saved.relics)+' pos='+JSON.stringify(saved.pos));
  await page.reload();await page.waitForFunction(()=>window.__vt);
  P('após recarregar: Continuar visível='+await vis('btnContinue')+', tela inicial='+await vis('scStart')+', modo='+await page.evaluate(()=>__vt.G.mode));
  await page.click('#btnContinue');await mode('play');
  P('continuou: '+JSON.stringify(await page.evaluate(()=>({st:__vt.state(),relicas:document.getElementById('relicCount').textContent,slotCobreAceso:__vt.G.relics.steam}))));
  // ---- pausa ----
  await page.keyboard.press('Escape');await mode('paused');
  P('Esc abre a pausa: tela visível='+await vis('scPause'));
  const t0=await page.evaluate(()=>__vt.G.t);await page.waitForTimeout(800);
  P('simulação congelada durante a pausa: '+((await page.evaluate(()=>__vt.G.t))===t0));
  await page.click('#pSound');P('botão de som: "'+await page.evaluate(()=>document.getElementById('pSound').textContent)+'" cfg='+await page.evaluate(()=>localStorage.getItem('vale_das_tumbas_cfg')));
  await page.click('#pSound');
  await page.click('#pErase');P('apagar pede confirmação: '+await vis('scConfirm'));
  await page.click('#cfNo');P('cancelar volta à pausa: '+await vis('scPause')+', save intacto: '+!!await page.evaluate(()=>localStorage.getItem('vale_das_tumbas_save')));
  await page.click('#pResume');await mode('play');P('retomou: ok');
  // ---- diário ----
  await page.keyboard.press('j');await mode('diary');
  P('J abre o diário: entradas='+await page.evaluate(()=>document.querySelectorAll('#diaryList .entry').length)+' tela='+await vis('scDiary'));
  await page.keyboard.press('j');await mode('play');P('J fecha o diário: ok');
  // ---- apagar de verdade ----
  await page.keyboard.press('Escape');await mode('paused');
  await page.click('#pErase');await page.click('#cfYes');await mode('play');
  P('apagou e recomeçou: relíquias='+JSON.stringify(await page.evaluate(()=>__vt.G.relics))+' save='+await page.evaluate(()=>localStorage.getItem('vale_das_tumbas_save')?'recriado':'ausente'));
  // ---- teclado ----
  const k0=await page.evaluate(()=>__vt.state());
  await page.keyboard.down('w');await page.waitForFunction(z=>__vt.state().z<z-3,k0.z,{timeout:15000});await page.keyboard.up('w');
  P('teclado W: andou para o norte (z '+k0.z.toFixed(1)+' -> '+(await page.evaluate(()=>__vt.state().z)).toFixed(1)+'), modo de entrada='+await page.evaluate(()=>__vt.IN.mode)+', botões de toque ocultos='+await page.evaluate(()=>getComputedStyle(document.getElementById('touchUI')).display==='none'||!document.body.classList.contains('touch')));
  // ---- controle (gamepad) simulado ----
  await page.evaluate(()=>{window.__pad={connected:true,id:'Pad de teste',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};navigator.getGamepads=()=>[window.__pad];});
  const g0=await page.evaluate(()=>__vt.state());
  await page.evaluate(()=>{__pad.axes[1]=-1;});await page.waitForFunction(z=>__vt.state().z<z-3,g0.z,{timeout:15000});await page.evaluate(()=>{__pad.axes[1]=0;});
  P('controle: analógico para frente andou (z '+g0.z.toFixed(1)+' -> '+(await page.evaluate(()=>__vt.state().z)).toFixed(1)+'), modo='+await page.evaluate(()=>__vt.IN.mode));
  const hit=async(i)=>{await page.evaluate(i=>{__pad.buttons[i].pressed=true;},i);await page.waitForTimeout(500);await page.evaluate(i=>{__pad.buttons[i].pressed=false;},i);await page.waitForTimeout(500);};
  await hit(9);P('Start pausa: modo='+await page.evaluate(()=>__vt.G.mode));
  await hit(9);P('Start de novo retoma: modo='+await page.evaluate(()=>__vt.G.mode));
  await hit(8);P('Back abre o diário: modo='+await page.evaluate(()=>__vt.G.mode));
  await hit(1);P('B fecha: modo='+await page.evaluate(()=>__vt.G.mode));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
  // ---- layout de computador ----
  const d=await open({viewport:{width:1280,height:720},touch:false});
  await d.page.evaluate(()=>{__vt.start(true);__vt.G.time=0.2;__vt.tp(95.2,-90);__vt.cam.yaw=-Math.PI/2;__vt.cam.pitch=0.25;__vt.sim(40);__vt.renderOnce();});
  await d.page.screenshot({path:ROOT+'/test/shots/21-desktop.png'});
  P('desktop: modo='+await d.page.evaluate(()=>__vt.IN.mode)+', botões de toque='+await d.page.evaluate(()=>getComputedStyle(document.getElementById('touchUI')).display));
  await d.browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n')[0]);process.exit(1);});
