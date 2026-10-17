const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const st=()=>page.evaluate(()=>__vt.state());
  const shot=async n=>{await page.evaluate(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  await page.evaluate(()=>__vt.start(true));
  await page.evaluate(()=>__vt.step(30));
  // ir até a porta da Tumba das Engrenagens e usar
  await page.evaluate(()=>{__vt.tp(95.2,-90);__vt.step(5);});
  await page.evaluate(()=>{__vt.use();__vt.step(3);});
  console.log('após usar (transição):',JSON.stringify(await st()));
  await page.evaluate(()=>__vt.step(120));
  console.log('dentro da tumba:',JSON.stringify(await st()));
  await shot('3-hall');
  // colisão lateral: segurar A (esquerda) por 4 s
  await page.evaluate(()=>{__vt.key('a',true);__vt.step(240);__vt.key('a',false);});
  const s1=await st();console.log('após 4s andando para a esquerda (esperado x>=-8.6):',s1.x.toFixed(2));
  // contra a parede sul
  await page.evaluate(()=>{__vt.key('s',true);__vt.step(240);__vt.key('s',false);});
  const s2=await st();console.log('após 4s andando para trás (esperado z<=8.4):',s2.z.toFixed(2));
  // correndo contra a parede com lag simulado (passo grande)
  await page.evaluate(()=>{__vt.key('a',true);__vt.key('shift',true);for(let i=0;i<30;i++)__vt.step(1,0.1);__vt.key('a',false);__vt.key('shift',false);});
  const s3=await st();console.log('corrida com passos de 100ms (esperado x>=-8.6):',s3.x.toFixed(2));
  console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
  await browser.close();
})().catch(e=>{console.error('FALHOU',e);process.exit(1);});
