const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const line=()=>ev(()=>document.getElementById('endLine').textContent.slice(0,40));
  const prep=async()=>{await ev(()=>{__vt.G.relics.steam=__vt.G.relics.diesel=__vt.G.relics.atom=__vt.G.relics.bio=true;__vt.tp(0,-125);__vt.sim(5);__vt.use();__vt.sim(150);
    const c=__vt.cty;c.done=[true,true,true,true];c.lvl=1;for(const g of c.gates){g.latched=true;g.open=1;g.fl.position.x=-4.62;g.fr.position.x=4.62;g.c.on=false;}for(const s of c.slabs)s.open=1;
    __vt.tp(0,-163.5,8);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(20);});};
  await ev(()=>{__vt.start(true);__vt.sim(10);});await prep();
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.25;__vt.sim(3);__vt.renderOnce();});await shot('104-terraco');
  await ev(()=>{__vt.tp(0,-166.5,8);__vt.sim(3);});
  P('começou: modo='+await ev(()=>__vt.G.mode));
  for(const sec of[1,3,7,12,18,22]){
    const cur=await ev(()=>__vt.cty.end?__vt.cty.end.t:-1);
    await ev(([a,b])=>__vt.sim(Math.round((a-b)*60)),[sec,Math.max(0,cur)]);
    P(sec+'s: modo='+await ev(()=>__vt.G.mode)+' linha="'+await line()+'" tela FIM='+await ev(()=>!document.getElementById('scEnd').hidden)+' endTxt='+await ev(()=>!document.getElementById('endTxt').hidden));
    if(sec===3)await shot('105-cena-3s');if(sec===12)await shot('106-cena-12s');if(sec===18)await shot('107-cena-18s');
  }
  await shot('108-fim');
  // pular: pressionar usar durante a cena
  await page.click('#eVale');await page.waitForFunction(()=>__vt.G.mode==='play',{timeout:8000});
  await prep();await ev(()=>{__vt.tp(0,-166.5,8);__vt.sim(3);__vt.sim(90);});
  P('pular com Usar: linha antes="'+await line()+'"');
  await ev(()=>{__vt.use();__vt.sim(2);});P('depois de Usar: linha="'+await line()+'" t='+(await ev(()=>__vt.cty.end.t)).toFixed(1));
  await ev(()=>{__vt.use();__vt.sim(2);__vt.use();__vt.sim(2);__vt.use();__vt.sim(2);});P('mais Usar: modo='+await ev(()=>__vt.G.mode));
  // toque na tela (pointer) pula também
  await page.click('#eVale');await page.waitForFunction(()=>__vt.G.mode==='play',{timeout:8000});
  await prep();await ev(()=>{__vt.tp(0,-166.5,8);__vt.sim(3);__vt.sim(90);});
  await page.mouse.click(200,300);await ev(()=>__vt.sim(3));
  P('toque na tela: t='+(await ev(()=>__vt.cty.end.t)).toFixed(1)+' linha="'+await line()+'"');
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
