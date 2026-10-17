const {open}=require('../lib');
(async()=>{const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);
await ev(()=>{__vt.start(true);__vt.sim(10);__vt.setArea(__vt.TOMB_AREAS.final);});
for(const z of[5,-12,-30,-45,-56,-70,-84,-95,-108,-120,-136,-150,-168]){
  const r=await ev((z)=>{__vt.tp(0,z,z<-136?Math.min(8,Math.max(0,(-136-z)*0.4)):0);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.sim(10);__vt.renderOnce();return __vt.renderer.info.render.calls+' calls, '+__vt.renderer.info.render.triangles+' tris';},z);
  console.log('z='+z+': '+r);}
const mem=await ev(()=>({geo:__vt.renderer.info.memory.geometries,tex:__vt.renderer.info.memory.textures}));console.log(JSON.stringify(mem));
console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
await browser.close();})();
