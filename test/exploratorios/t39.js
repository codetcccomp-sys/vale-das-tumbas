const path=require('path');const {chromium}=require('playwright');const {open,ROOT}=require('../lib');
(async()=>{
  const P=s=>console.log(s);
  // 1) carregamento normal remove a tela de carregando
  {const {browser,page,logs}=await open();P('carregamento normal: #boot existe='+await page.evaluate(()=>!!document.getElementById('boot'))+' | botão Novo jogo clicável='+await page.evaluate(()=>!document.getElementById('scStart').hidden));await browser.close();}
  // 2) sem o three.js: mensagem clara
  {const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
   const page=await (await browser.newContext({viewport:{width:412,height:860}})).newPage();const errs=[];page.on('pageerror',e=>errs.push(e.message));
   await page.route('**/*',r=>{const u=r.request().url();if(u.startsWith('file://'))return r.continue();return r.abort();});
   await page.goto('file://'+path.join(ROOT,'build/index.html'));await page.waitForTimeout(600);
   P('sem three.js: texto="'+await page.evaluate(()=>document.getElementById('boot').textContent)+'" erros='+JSON.stringify(errs.map(e=>e.slice(0,50))));
   await page.screenshot({path:ROOT+'/test/shots/126-sem-motor.png'});await browser.close();}
  // 3) localStorage bloqueado (aba anônima / dados bloqueados)
  {const {browser,page,logs}=await open();
   await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}});});
   await page.reload();await page.waitForFunction(()=>window.__vt);
   P('sem localStorage: Continuar oculto='+await page.evaluate(()=>document.getElementById('btnContinue').hidden));
   await page.click('#btnNew');await page.waitForFunction(()=>__vt.G.mode==='play');
   await page.evaluate(()=>{__vt.sim(10);__vt.G.relics.steam=true;__vt.saveNow();});
   P('aviso de salvamento: '+await page.evaluate(()=>Array.from(document.querySelectorAll('#msgs .toast')).map(t=>t.textContent).join(' | ')));
   await page.evaluate(()=>{__vt.tp(0,-125);__vt.sim(5);__vt.exit&&0;});
   P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));await browser.close();}
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
