const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  const calls=()=>ev(()=>{__vt.renderOnce();return __vt.renderer.info.render.calls+' calls, '+__vt.renderer.info.render.triangles+' tris';});
  for(const[k,pos]of[['steam',[0,5]],['diesel',[0,5]],['atom',[0,5]],['bio',[0,5]],['bio',[0,-20]],['bio',[0,-45]],['bio',[0,-80]],['bio',[0,-104]]]){
    await ev(([k,pos])=>{__vt.setArea(__vt.TOMB_AREAS[k]);__vt.tp(pos[0],pos[1]);__vt.cam.yaw=0;__vt.sim(5);},[k,pos]);
    P(k+' '+pos+': '+await calls());
  }
  // breakdown for bio hall
  await ev(()=>{__vt.setArea(__vt.TOMB_AREAS.bio);__vt.tp(0,5);__vt.sim(5);__vt.renderOnce();});
  P(await ev(()=>{const a=__vt.TOMB_AREAS.bio.group;let meshes=0,sprites=0,groups=0,vis=0;a.traverse(o=>{if(o.isMesh)meshes++;else if(o.isSprite)sprites++;else if(o.isGroup)groups++;});return 'bio meshes='+meshes+' sprites='+sprites+' groups='+groups;}));
  P(await ev(()=>{const a=__vt.TOMB_AREAS.atom.group;let meshes=0,sprites=0;a.traverse(o=>{if(o.isMesh)meshes++;else if(o.isSprite)sprites++;});return 'atom meshes='+meshes+' sprites='+sprites;}));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
