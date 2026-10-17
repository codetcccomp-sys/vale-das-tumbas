// Prévia de sprites: carrega arquivos de src/ numa página vazia, roda um trecho de desenho e salva a imagem ampliada.
// uso: node previa.js saida.png escala "arquivo1.js,arquivo2.js" "codigo que desenha em g (canvas 'cv')"
const path=require('path'),fs=require('fs');
const {chromium}=require('playwright');
(async()=>{
  const [out,escala,arqs,codigo]=process.argv.slice(2);
  const src=arqs.split(',').map(f=>fs.readFileSync(path.join(__dirname,'..','..','src',f),'utf8')).join('\n;\n');
  const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1400,height:1000}});
  const erros=[];p.on('pageerror',e=>erros.push(e.message));p.on('console',m=>{if(m.type()==='error')erros.push(m.text());});
  await p.setContent('<html><body style="margin:0;background:#556"><canvas id="cv" width="10" height="10" style="image-rendering:pixelated"></canvas></body></html>');
  await p.addScriptTag({content:src+'\n;window.__desenhar=function(){const cv=document.getElementById("cv");'+codigo+'};'});
  const dim=await p.evaluate(()=>{window.__desenhar();const c=document.getElementById('cv');return[c.width,c.height];});
  const k=+escala;await p.evaluate(([k])=>{const c=document.getElementById('cv');c.style.width=(c.width*k)+'px';c.style.height=(c.height*k)+'px';},[k]);
  await p.setViewportSize({width:Math.max(200,dim[0]*k),height:Math.max(100,dim[1]*k)});
  await p.locator('#cv').screenshot({path:out});
  if(erros.length)console.log('ERROS:',erros.join(' | '));
  console.log('ok',dim);await b.close();
})();
