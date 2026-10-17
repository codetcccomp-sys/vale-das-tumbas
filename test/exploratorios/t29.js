const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.relics.steam=__vt.G.relics.diesel=__vt.G.relics.atom=__vt.G.relics.bio=true;__vt.tp(0,-125);__vt.sim(5);__vt.use();__vt.sim(150);
    const c=__vt.cty;c.done=[true,true,true,true];c.lvl=1;for(const g of c.gates){g.latched=true;g.open=1;g.fl.position.x=-4.62;g.fr.position.x=4.62;g.c.on=false;}for(const s of c.slabs)s.open=1;
    __vt.tp(0,-166.5,8);__vt.sim(3);__vt.sim(60*9);__vt.renderOnce();});
  await page.waitForTimeout(2000);
  await page.screenshot({path:ROOT+'/test/shots/109-texto.png'});
  console.log(await ev(()=>({opacity:getComputedStyle(document.getElementById('endLine')).opacity,txt:document.getElementById('endLine').textContent.slice(0,30)})));
  await browser.close();
})();
