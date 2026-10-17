const {open}=require('../lib');
(async()=>{const {browser,page}=await open();
const ev=(f,a)=>page.evaluate(f,a);
await ev(()=>{__vt.start(true);__vt.sim(10);__vt.setArea(__vt.TOMB_AREAS.steam);__vt.tp(0,5);__vt.sim(5);__vt.renderOnce();});
console.log(await ev(()=>{
  const out={};const a=__vt.TOMB_AREAS.steam.group;let total=0,vis=0;
  a.traverse(o=>{if(o.isMesh||o.isSprite){total++;}});
  const byTop={};
  for(const c of a.children){let n=0;c.traverse(o=>{if(o.isMesh||o.isSprite)n++;});const k=(c.isMesh?'mesh':c.isSprite?'sprite':'group')+(c.userData.dyn?'-dyn':'');byTop[k]=(byTop[k]||0)+n;}
  return JSON.stringify({total,byTop,calls:__vt.renderer.info.render.calls,tris:__vt.renderer.info.render.triangles});}));
console.log(await ev(()=>{const a=__vt.TOMB_AREAS.steam.group;const mats={};a.traverse(o=>{if(o.isMesh&&o.parent===a){mats[o.material.type]=(mats[o.material.type]||0)+1;}});return JSON.stringify(mats)+' toplevel meshes='+a.children.filter(o=>o.isMesh).length;}));
await browser.close();})();
