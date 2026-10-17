// Etapa 1: câmera. Caso da parede (x=8,62, z=-50, câmera voltada para x=9), câmera nunca dentro de colisores
// nem acima do teto, auditoria de visibilidade nas cinco áreas, transparência gradual, olhar sobre o vão,
// recuperação suave da distância e câmera orientada depois de cair.
// A lógica da câmera roda sem desenhar (cam1): milhares de quadros desenhados num laço sem pausa
// esgotam a GPU por software do navegador de teste, e o desenho não muda a posição da câmera.
const {open}=require('./lib');const {suite}=require('./assert');
(async()=>{
  const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);const S=suite('câmera');
  await ev(()=>{__vt.start(true);__vt.sim(10);window.cam1=()=>updateCamera(1/60,null);});
  // 1) o caso relatado
  const wall=await ev(()=>{__vt.setArea(__vt.TOMB_AREAS.steam);const out=[];
    for(const[yaw,pitch]of[[Math.PI/2,0.3],[Math.PI/2,0],[Math.PI/2+0.4,0.3],[Math.PI/2,0.9]]){
      __vt.tp(8.62,-50,0);__vt.G.p.face=-Math.PI/2;__vt.cam.yaw=yaw;__vt.cam.pitch=pitch;__vt.cam.cur=__vt.cam.want;
      cam1();const x1=__vt.camera.position.x;let maxX=x1;for(let i=0;i<60;i++){cam1();maxX=Math.max(maxX,__vt.camera.position.x);}
      out.push({yaw:+yaw.toFixed(2),pitch,x1:+x1.toFixed(2),maxX:+maxX.toFixed(2),cur:+__vt.cam.cur.toFixed(2)});}
    return out;});
  S.ok(wall.every(w=>w.maxX<8.95),'parede em x=9: a câmera nunca passa para dentro dela (nem no primeiro quadro)',wall.map(w=>w.maxX));
  S.ok(wall.every(w=>w.cur>=2),'parede em x=9: em 1 s a câmera encontra um ângulo livre (≥ 2 m)',wall.map(w=>w.cur));
  // 2) varredura em todas as áreas
  const aud=await ev(()=>{const out={};let seed=11;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const rc=new THREE.Raycaster();rc.camera=__vt.camera;
    const occl=(grp,from,to)=>{const d=to.clone().sub(from),L=d.length();rc.set(from,d.normalize());rc.far=L-0.25;rc.near=0.05;
      return rc.intersectObject(grp,true).some(h=>h.object.visible&&h.object.material&&!h.object.material.transparent&&h.object.material.side!==THREE.BackSide&&!h.object.isSprite);};
    for(const key of['steam','diesel','atom','bio','final']){
      const A=__vt.TOMB_AREAS[key];__vt.setArea(A);let n=0,inside=0,ceil=0,colada=0,enc=0,minCur=9;const ex=[];
      for(let i=0;i<90;i++){
        const x=(rnd()-0.5)*16,z=8-rnd()*(key==='final'?170:112),y=groundAt(A,x,z,12);if(!(y>-0.5)||y>9)continue;
        const r=pushOut(A,x,z,y,PR,PH);if(Math.hypot(r[0]-x,r[1]-z)>0.01)continue;
        if(A.cols.some(c=>c.on&&Math.abs(c.y1-y)<0.01&&c.y1-c.y0>3.5&&(c.t==='b'?x>=c.x0&&x<=c.x1&&z>=c.z0&&z<=c.z1:Math.hypot(x-c.x,z-c.z)<=c.r)))continue;
        __vt.tp(x,z,y);__vt.G.p.face=Math.PI*(rnd()<0.5?1:0.6+rnd());__vt.cam.yaw=(rnd()-0.5)*2.4+(rnd()<0.2?Math.PI:0);__vt.cam.pitch=0.15+rnd()*0.9;__vt.cam.cur=__vt.cam.want;
        for(let k=0;k<60;k++)cam1();n++;
        const c=__vt.camera.position,ce=typeof A.camCeil==='function'?A.camCeil(x,z):A.camCeil;
        const inCol=A.cols.some(q=>q.on&&q.y1-q.y0>=0.25&&c.y>q.y0&&c.y<q.y1&&(q.t==='b'?c.x>q.x0&&c.x<q.x1&&c.z>q.z0&&c.z<q.z1:Math.hypot(c.x-q.x,c.z-q.z)<q.r));
        if(inCol){inside++;if(ex.length<3)ex.push([+x.toFixed(1),+z.toFixed(1)]);}
        if(ce!==undefined&&c.y>ce)ceil++;
        if(__vt.cam.cur<1.3)colada++;minCur=Math.min(minCur,__vt.cam.cur);
        const p=__vt.G.p;let o=0;for(const h of[0.35,1.2,1.75])if(occl(A.group,c.clone(),new THREE.Vector3(p.x,p.y+h,p.z)))o++;if(o>=2)enc++;
      }
      out[key]={n,inside,ceil,colada,enc,ex};}
    return out;});
  for(const k in aud){const a=aud[k];
    S.ok(a.inside===0,k+': câmera nunca dentro de colisor ('+a.n+' posições)',a);
    S.ok(a.ceil===0,k+': câmera nunca acima do teto',a.ceil);
    S.ok(a.colada<=Math.ceil(a.n*0.03),k+': câmera colada (< 1,3 m) em no máximo 3% das posições',a.colada+'/'+a.n);
    S.ok(a.enc<=Math.ceil(a.n*0.03),k+': corpo encoberto por cenário em no máximo 3% das posições',a.enc+'/'+a.n);}
  // 3) transparência gradual em vez de sumir de uma vez
  const fade=await ev(()=>{const r=[];for(const c of[2,1.2,0.9,0.7,0.5,0.3]){__vt.cam.cur=c;syncPlayerModel(__vt.G.t);r.push([c,+explorer.rig.fade.op.toFixed(2),explorer.group.visible]);}return r;});
  const ops=fade.map(f=>f[1]);let maxJump=0;for(let i=1;i<ops.length;i++)maxJump=Math.max(maxJump,Math.abs(ops[i]-ops[i-1]));
  S.ok(ops[0]===1&&ops[2]>0&&ops[2]<1&&fade[5][2]===false,'perto da câmera o personagem fica translúcido e só some colado nela',fade);
  S.ok(maxJump<=0.5,'a transparência muda aos poucos (sem pulo brusco)',maxJump);
  // 4) diante de um vão, a câmera inclina e mostra a borda
  const gap=await ev(()=>{const A=__vt.TOMB_AREAS.steam;__vt.setArea(A);__vt.G.mode='play';
    let edge=null;for(let z=0;z>-110&&edge===null;z-=0.1)for(let x=-6;x<=6&&edge===null;x+=1)if(groundAt(A,x,z,0.5)>-0.1&&groundAt(A,x,z-2.4,0.5)<-100&&groundAt(A,x,z-1.6,0.5)<-100)edge=[x,z];
    __vt.tp(edge[0],edge[1],0);__vt.G.p.face=Math.PI;__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.cam.cur=__vt.cam.want;CAMX.gap=0;
    __vt.G.p.vz=-0.8;__vt.G.p.speed=0.8;const before=__vt.camera.position.y;
    for(let i=0;i<60;i++){__vt.G.p.speed=0.8;updateCamera(1/60,null);}
    return{edge,gap:+CAMX.gap.toFixed(2),look:+CAMX.look.toFixed(2)};});
  S.ok(gap.edge!==null&&gap.gap>0.5&&gap.look>0.3,'na borda de um vão, a câmera inclina e mira à frente',gap);
  // 5) recuperação da distância: volta suave, sem salto
  const rec=await ev(()=>{const A=__vt.TOMB_AREAS.steam;__vt.setArea(A);__vt.tp(0,-50,0);__vt.cam.yaw=0;__vt.cam.pitch=0.3;__vt.cam.cur=0.5;CAMX.ap=0;
    let maxStep=0,prev=__vt.cam.cur,t=0;while(__vt.cam.cur<__vt.cam.want-0.05&&t<300){cam1();maxStep=Math.max(maxStep,__vt.cam.cur-prev);prev=__vt.cam.cur;t++;}
    return{frames:t,maxStep:+maxStep.toFixed(3)};});
  S.ok(rec.frames<=150&&rec.maxStep<0.25,'livre de novo, a câmera volta à distância normal em até 2,5 s sem saltos',rec);
  // 6) depois de cair, renasce com a câmera atrás do personagem
  const sp=await ev(()=>{__vt.enter('bio');let n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}__vt.cam.yaw=1.3;__vt.cam.cur=0.4;__vt.G.p.y=-6;__vt.sim(1);
    const r={yawErr:+Math.abs(wrapPi(__vt.cam.yaw-(__vt.G.p.face+Math.PI))).toFixed(3),cur:__vt.cam.cur,want:__vt.cam.want};__vt.exit(false);n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}return r;});
  S.ok(sp.yawErr<0.01&&sp.cur===sp.want,'ao renascer, a câmera fica atrás do personagem na distância normal',sp);
  S.done(logs);await browser.close();
})();
