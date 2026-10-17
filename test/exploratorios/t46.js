// Auditoria da câmera: quantas vezes o corpo do personagem fica encoberto por geometria entre ele e a câmera
const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  const res=await ev(()=>{
    const out={};let seed=7;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const rc=new THREE.Raycaster();rc.camera=__vt.camera;
    const occl=(grp,from,to)=>{const d=to.clone().sub(from),L=d.length();rc.set(from,d.normalize());rc.far=L-0.25;rc.near=0.05;
      const hits=rc.intersectObject(grp,true).filter(h=>h.object.visible&&h.object.material&&!h.object.material.transparent&&h.object.material.side!==THREE.BackSide&&!h.object.isSprite);if(hits.length)lastHit='#'+(hits[0].object.material.color?hits[0].object.material.color.getHexString():'?')+'@'+hits[0].distance.toFixed(1);return hits.length>0;};let lastHit='';
    for(const key of['steam','diesel','atom','bio','final']){
      const A=__vt.TOMB_AREAS[key];__vt.setArea(A);
      let n=0,hidden=0,occ=0,near=0,sumCur=0;const bad=[],lows=[];
      for(let i=0;i<160;i++){
        const x=(rnd()-0.5)*16,z=8-rnd()*(key==='final'?170:112);
        const y=groundAt(A,x,z,12);if(!(y>-0.5)||y>9)continue;
        const r=pushOut(A,x,z,y,PR,PH);if(Math.hypot(r[0]-x,r[1]-z)>0.01)continue;
        if(A.cols.some(c=>c.on&&Math.abs(c.y1-y)<0.01&&c.y1-c.y0>3.5&&(c.t==='b'?x>=c.x0&&x<=c.x1&&z>=c.z0&&z<=c.z1:Math.hypot(x-c.x,z-c.z)<=c.r)))continue;
        __vt.tp(x,z,y);__vt.G.p.face=Math.PI*(rnd()<0.5?1:0.6+rnd());__vt.cam.yaw=(rnd()-0.5)*2.4+(rnd()<0.2?Math.PI:0);__vt.cam.pitch=0.15+rnd()*0.4;__vt.cam.cur=__vt.cam.want;
        for(let k=0;k<90;k++){__vt.renderOnce();}
        const p=__vt.G.p,cp=__vt.camera.position.clone();n++;sumCur+=__vt.cam.cur;
        if(__vt.cam.cur<1.3){hidden++;if(lows.length<5)lows.push([+x.toFixed(1),+z.toFixed(1),+__vt.cam.cur.toFixed(2)]);}
        if(__vt.cam.cur<2.2)near++;
        let o=0;for(const h of[0.35,1.2,1.75]){if(occl(A.group,cp,new THREE.Vector3(p.x,p.y+h,p.z)))o++;}
        if(o>=2){occ++;if(bad.length<5)bad.push([+x.toFixed(1),+z.toFixed(1),+__vt.cam.cur.toFixed(1),lastHit]);}
      }
      out[key]={amostras:n,camera_media:+(sumCur/n).toFixed(2),boneco_oculto:hidden,camera_colada_lt2_2m:near,corpo_encoberto:occ,encobertos:bad,colados:lows};
    }
    return out;});
  for(const k in res)console.log(k+': '+JSON.stringify(res[k]));
  console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
  await browser.close();
})();
