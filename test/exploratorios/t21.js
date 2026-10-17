const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.setArea(__vt.TOMB_AREAS.diesel);});
  for(const px of[0,0.8,-1.5,2.5]){
    const r=await ev((px)=>{__vt.G.hearts=3;__vt.G.invuln=0;const g=__vt.dsl.guard;g.x=0;g.z=-86.5;g.state='chase';g.lost=0;__vt.tp(px,-80);const z0=[];for(let i=0;i<300;i++){__vt.sim(1);if(__vt.G.hearts<3)return {hit:i,gx:g.x.toFixed(2),gz:g.z.toFixed(2)};__vt.tp(px,-80);}return {hit:-1,gx:g.x.toFixed(2),gz:g.z.toFixed(2),state:g.state};},px);
    console.log('jogador em x='+px+': '+JSON.stringify(r));
  }
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
