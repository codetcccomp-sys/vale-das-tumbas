const path=require('path');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
async function open(opts){
  opts=opts||{};
  const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--use-gl=angle','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl']});
  const ctx=await browser.newContext({viewport:opts.viewport||{width:412,height:860},deviceScaleFactor:1,hasTouch:opts.touch!==false,isMobile:opts.touch!==false});
  const page=await ctx.newPage();
  await page.addInitScript(()=>{document.addEventListener('DOMContentLoaded',()=>{const m=document.createElement('meta');m.name='viewport';m.content='width=device-width, initial-scale=1';document.head.appendChild(m);});});
  const logs=[];
  page.on('console',m=>{const t=m.type();if(t==='error'||t==='warning')logs.push(t+': '+m.text());});
  page.on('pageerror',e=>logs.push('PAGEERROR: '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  await page.route('**/*',route=>{
    const u=route.request().url();
    if(u.includes('three.min.js'))return route.fulfill({path:path.join(ROOT,'vendor/three.min.js'),contentType:'application/javascript'});
    if(u.startsWith('file://'))return route.continue();
    return route.abort();
  });
  await page.goto('file://'+path.join(ROOT,'build/index.html')+'#vt');
  await page.waitForFunction(()=>window.__vt,{timeout:20000});
  return{browser,ctx,page,logs};
}
module.exports={open,ROOT};
