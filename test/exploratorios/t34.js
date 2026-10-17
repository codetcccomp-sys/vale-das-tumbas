const path=require('path');const {chromium}=require('playwright');const {open,ROOT}=require('../lib');
(async()=>{
  const P=s=>console.log(s);
  // 1) sem #vt, o gancho de teste não existe
  {const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
   const ctx=await browser.newContext({viewport:{width:412,height:860}});const page=await ctx.newPage();
   await page.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:path.join(ROOT,'vendor/three.min.js'),contentType:'application/javascript'});if(u.startsWith('file://'))return r.continue();return r.abort();});
   await page.goto('file://'+path.join(ROOT,'build/index.html'));await page.waitForSelector('#btnNew');
   P('sem #vt: window.__vt='+await page.evaluate(()=>typeof window.__vt)+' | nota inicial="'+await page.evaluate(()=>document.getElementById('startNote').textContent)+'"');
   await browser.close();}
  const {browser,page,logs}=await open();
  const ev=(f,a)=>page.evaluate(f,a);const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  await page.waitForTimeout(3200);
  P('dica de controles (toque) após ~3 s: '+await ev(()=>Array.from(document.querySelectorAll('#msgs .toast')).map(t=>t.textContent).join(' | ')));
  // 2) tecla M abre o mapa
  await page.keyboard.press('m');await page.waitForFunction(()=>__vt.G.mode==='diary');
  P('M abre o diário na aba: '+await ev(()=>document.querySelector('.tab.on').textContent)+' | mapa visível='+await ev(()=>!document.getElementById('mapBox').hidden));
  await page.keyboard.press('m');await page.waitForFunction(()=>__vt.G.mode==='play');P('M de novo fecha: ok');
  // 3) gráficos leves
  await ev(()=>{__vt.G.mode='play';});
  const pr0=await ev(()=>pixelRatio);
  await page.keyboard.press('Escape');await page.waitForFunction(()=>__vt.G.mode==='paused');
  P('botão de gráficos: "'+await ev(()=>document.getElementById('pGfx').textContent)+'"');
  await page.click('#pGfx');
  P('depois de clicar: "'+await ev(()=>document.getElementById('pGfx').textContent)+'" pixelRatio '+pr0+' -> '+await ev(()=>pixelRatio)+' cfg='+await ev(()=>localStorage.getItem('vale_das_tumbas_cfg')));
  await page.reload();await page.waitForFunction(()=>window.__vt);
  P('depois de recarregar: pixelRatio='+await ev(()=>pixelRatio)+' rótulo da pausa="'+await ev(()=>{refreshStart();return document.getElementById('pGfx').textContent;})+'"');
  await ev(()=>{CFG.gfx='normal';pixelRatio=pixelCap();resize();writeCfg();});
  // 4) som suspende com a página oculta
  await ev(()=>{__vt.start(true);__vt.sim(5);auInit();});await page.waitForTimeout(300);
  P('áudio antes: '+await ev(()=>AU.ctx&&AU.ctx.state));
  await ev(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(300);
  P('áudio com a página oculta: '+await ev(()=>AU.ctx&&AU.ctx.state)+' modo='+await ev(()=>__vt.G.mode));
  await ev(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(300);
  P('áudio ao voltar: '+await ev(()=>AU.ctx&&AU.ctx.state)+' (o jogo continua pausado até o jogador retomar)');
  // 5) perda de contexto WebGL
  await ev(()=>{__vt.G.mode==='paused'&&document.getElementById('pResume').click();});
  const lost=await ev(async()=>{const gl=renderer.getContext();const ext=gl.getExtension('WEBGL_lose_context');if(!ext)return 'sem extensão';ext.loseContext();await new Promise(r=>setTimeout(r,200));const a=glLost;
    for(let i=0;i<5;i++)render(1/60);ext.restoreContext();await new Promise(r=>setTimeout(r,400));return 'perdido='+a+' restaurado='+(!glLost)+' msgs='+Array.from(document.querySelectorAll('#msgs .toast')).map(t=>t.textContent).slice(-2).join(' | ');});
  P('contexto WebGL: '+lost);
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
