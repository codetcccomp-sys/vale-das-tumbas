const {open}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  const res=await ev(()=>{
    const out=[];
    for(const [x0,z0] of [[115,92],[30,-183],[30,-157]]){
      const r=pushOut(__vt.valeArea,x0,z0,terrainH(x0,z0),PR,PH);const row=[];
      for(let k=0;k<8;k++){__vt.tp(r[0],r[1]);__vt.G.hearts=3;__vt.cam.yaw=k*Math.PI/4;__vt.sim(5);__vt.key('w',true);const p0=[__vt.G.p.x,__vt.G.p.z];__vt.sim(60);const m=Math.hypot(__vt.G.p.x-p0[0],__vt.G.p.z-p0[1]);__vt.key('w',false);row.push(m.toFixed(1));}
      out.push({at:[x0,z0],mov_por_direção:row.join(' ')});
    }
    return out;});
  console.log(JSON.stringify(res));
  await browser.close();
})();
