const {open}=require('../lib');
(async()=>{
  const {browser,page}=await open();
  const r=await page.evaluate(()=>{
    __vt.start(true);__vt.sim(10);__vt.tp(-136.4,-10);__vt.sim(5);__vt.use();__vt.sim(150);
    __vt.tp(0,-10);__vt.cam.yaw=0;__vt.sim(5);__vt.renderOnce();
    const cam=__vt.camera,out={calls:__vt.renderer.info.render.calls,merge:__vt.TOMB_AREAS.diesel.group.children.length};
    // contar objetos visíveis e dentro do frustum por tipo
    const fr=new THREE.Frustum(),m=new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);fr.setFromProjectionMatrix(m);
    const byMat={};let meshes=0,sprites=0;
    __vt.scene.traverseVisible(o=>{
      if(o.isMesh){ // visível na hierarquia
        let inF=true;if(o.geometry){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();const s=o.geometry.boundingSphere.clone().applyMatrix4(o.matrixWorld);inF=fr.intersectsSphere(s);}
        if(inF){meshes++;const k=(o.material.type||'?')+(o.material.side===1?'/back':'')+(o.material.transparent?'/tr':'');byMat[k]=(byMat[k]||0)+1;}
      }
      if(o.isSprite)sprites++;
    });
    out.meshesInFrustum=meshes;out.sprites=sprites;out.byMat=byMat;
    // quais são os meshes dentro do frustum e de que grupo
    const own={};__vt.scene.traverseVisible(o=>{if(o.isMesh){let p=o,top=null;while(p&&p.parent&&p.parent.type!=='Scene')p=p.parent;const nm=(p&&p.children&&p.parent)?(p.userData.name||p.type+'#'+(p.children.length)):'?';own[nm]=(own[nm]||0)+1;}});
    out.top=own;
    return out;
  });
  console.log(JSON.stringify(r,null,1));
  await browser.close();
})();
