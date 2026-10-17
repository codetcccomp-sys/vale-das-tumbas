// Abre o jogo 2D (build/vale-das-tumbas-2d.html#vt) num Chromium sem janela. Sem internet: qualquer pedido externo é bloqueado.
const path=require('path');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
async function open(opts){
  opts=opts||{};
  const browser=await chromium.launch({headless:true});
  const ctx=await browser.newContext({viewport:opts.viewport||{width:412,height:860},deviceScaleFactor:opts.dpr||1,hasTouch:!!opts.touch,isMobile:!!opts.touch});
  const page=await ctx.newPage();
  const logs=[];
  page.on('console',m=>{const t=m.type();if(t==='error'||t==='warning')logs.push(t+': '+m.text());});
  page.on('pageerror',e=>logs.push('PAGEERROR: '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  await page.route('**/*',route=>{const u=route.request().url();if(u.startsWith('file://')||u.startsWith('data:'))return route.continue();return route.abort();});
  if(opts.antes)await page.addInitScript(opts.antes,opts.antesArg);
  await page.goto('file://'+path.join(ROOT,'build/vale-das-tumbas-2d.html')+'#vt');
  await page.waitForFunction(()=>window.__vt,{timeout:20000});
  return{browser,ctx,page,logs};
}
module.exports={open,ROOT};
