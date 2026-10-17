/* ====================== personagens (modelados por código) ======================
   O modelo olha para +Z. A mão direita do personagem fica em -X. */
/* Explorador: proporções heroicas, como na folha de personagem (chapéu com óculos, barba, colete aberto sobre a camisa,
   bandoleira, lenço vermelho, cinto com bolsas, botas com fivelas e o tubo com runas nas costas). */
/* o perfil precisa subir em y para as normais apontarem para fora; se vier de cima para baixo, é invertido aqui */
const LATHE=(pts,seg,ps,pl)=>{const P=pts[0][1]>pts[pts.length-1][1]?pts.slice().reverse():pts;return new THREE.LatheGeometry(P.map(p=>new THREE.Vector2(p[0],p[1])),seg||14,ps||0,pl||TAU);};
function tubeRuneTex(){return canvasTex(128,256,(g,w,h)=>{
  g.fillStyle='#2e2c31';g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,0.05)';g.fillRect(0,0,w*0.35,h);
  g.strokeStyle='#d4a847';g.lineWidth=5;g.lineJoin='round';
  for(const[cy,s]of[[88,1],[168,-1]]){g.beginPath();g.moveTo(64,cy-30*s);g.lineTo(34,cy+22*s);g.lineTo(94,cy+22*s);g.closePath();g.stroke();g.beginPath();g.moveTo(64,cy-10*s);g.lineTo(52,cy+12*s);g.lineTo(76,cy+12*s);g.closePath();g.stroke();}
  g.lineWidth=3;for(const y of[30,128,226]){g.beginPath();g.moveTo(14,y);g.lineTo(40,y);g.moveTo(88,y);g.lineTo(114,y);g.stroke();}
});}
function buildExplorer(){
  const g=new THREE.Group(),rig={};
  const C={hat:0x7a4a2a,vest:0x6e3f22,dark:0x3e2616,boot:0x553420,sole:0x221510,khaki:0xa08a55,cream:0xe6d8b2,cuff:0xcdbd94,skin:0xd29a6c,skin2:0xbf8558,hair:0x34200f,brass:0xd4a847,red:0xb3442a,metal:0x35353c,glove:0x3a2414};
  const ring=(r,t,mat,x,y,z,parent)=>{const m=mesh(GEO.tor(r,t,6,16),mat,x,y,z,parent);m.rotation.x=Math.PI/2;return m;};
  /* pernas: calça cáqui, cinta na coxa, botas altas com três fivelas */
  for(const s of[-1,1]){
    const leg=new THREE.Group();leg.position.set(s*0.125,0.94,0);g.add(leg);
    outline(mesh(LATHE([[0.001,0.02],[0.128,0.02],[0.138,-0.12],[0.12,-0.36],[0.104,-0.5],[0.1,-0.56],[0.001,-0.56]],12),M(C.khaki),0,0,0,leg),1.05);
    const kn=mesh(GEO.sph(0.064,8,6),M(0x8c7748),0,-0.43,0.09,leg);kn.scale.set(1,1.15,0.42);
    ring(0.132,0.02,M(C.dark),0,-0.17,0,leg);mesh(GEO.box(0.05,0.045,0.03),M(C.brass),s*0.1,-0.17,0.06,leg);
    if(s<0){outline(mesh(GEO.box(0.075,0.15,0.12),M(C.vest),-0.125,-0.24,0.02,leg),1.05);mesh(GEO.sph(0.012,5,4),M(C.brass),-0.165,-0.2,0.04,leg);}
    outline(mesh(LATHE([[0.001,-0.5],[0.122,-0.5],[0.118,-0.56],[0.108,-0.78],[0.112,-0.9],[0.001,-0.9]],12),M(C.boot),0,0,0,leg),1.05);
    ring(0.124,0.022,M(C.dark),0,-0.51,0,leg);
    for(const y of[-0.6,-0.7,-0.8]){ring(0.118,0.016,M(C.dark),0,y,0,leg);mesh(GEO.box(0.045,0.04,0.03),M(C.brass),s*0.105,y,0.04,leg);}
    const toe=outline(mesh(GEO.sph(0.11,10,8),M(C.boot),0,-0.88,0.08,leg),1.05);toe.scale.set(1.0,0.62,1.5);
    outline(mesh(GEO.box(0.2,0.06,0.36),M(C.sole),0,-0.95,0.06,leg),1.04);
    rig[s<0?'legR':'legL']=leg;
  }
  /* tronco: camisa por baixo, colete aberto na frente, cinto, bolsas, lenço, bandoleira e o tubo nas costas */
  const torso=new THREE.Group();torso.position.set(0,0.94,0);g.add(torso);rig.torso=torso;
  const shirt=outline(mesh(LATHE([[0.001,0.03],[0.205,0.03],[0.222,0.16],[0.27,0.4],[0.29,0.53],[0.255,0.62],[0.14,0.68],[0.001,0.68]],16),M(C.cream),0,0,0,torso),1.04);shirt.scale.set(1.12,1,0.74);
  const vest=outline(mesh(LATHE([[0.214,0.12],[0.234,0.2],[0.282,0.4],[0.302,0.53],[0.268,0.62],[0.15,0.685]],16,0.5,TAU-1.0),M(C.vest),0,0,0,torso),1.04);vest.scale.set(1.12,1,0.74);
  for(const s of[-1,1]){
    const lp=mesh(GEO.box(0.06,0.42,0.026),M(C.vest),s*0.115,0.4,0.205,torso);lp.rotation.z=-s*0.2;lp.rotation.x=-0.12;
    for(const y of[0.26,0.36,0.46])mesh(GEO.sph(0.013,5,4),M(C.brass),s*(0.1+(y-0.26)*0.18),y,0.222,torso);
  }
  outline(mesh(GEO.cyl(0.14,0.16,0.1,12),M(C.vest),0,0.66,0,torso),1.05);
  mesh(GEO.cyl(0.078,0.084,0.16,10),M(C.skin),0,0.72,0.005,torso);
  ring(0.098,0.032,M(C.red),0,0.69,0.01,torso);
  const tie=mesh(GEO.cone(0.1,0.2,4),M(C.red),0,0.6,0.15,torso);tie.rotation.x=Math.PI+0.25;tie.scale.set(1,1,0.35);
  const belt=outline(mesh(GEO.cyl(0.23,0.225,0.085,14),M(C.dark),0,0.05,0,torso),1.04);belt.scale.set(1.1,1,0.8);
  outline(mesh(GEO.box(0.13,0.095,0.03),M(C.brass),0,0.05,0.19,torso),1.06);mesh(GEO.box(0.07,0.045,0.032),M(C.dark),0,0.05,0.192,torso);
  for(const s of[-1,1]){const pu=outline(mesh(GEO.box(0.13,0.13,0.08),M(C.vest),s*0.235,0.0,0.1,torso),1.05);pu.rotation.y=s*0.6;mesh(GEO.sph(0.014,5,4),M(C.brass),s*0.25,0.03,0.15,torso);}
  /* bandoleira: do ombro direito ao quadril esquerdo, com cartuchos de latão */
  const bx0=-0.17,by0=0.6,bx1=0.21,by1=0.08,dx=bx1-bx0,dy=by1-by0,L=Math.hypot(dx,dy),th=Math.atan2(-dx,dy);
  const strap=mesh(GEO.box(0.075,L,0.03),M(C.dark),(bx0+bx1)/2,(by0+by1)/2,0.205,torso);strap.rotation.z=th;strap.rotation.x=-0.1;
  for(let i=0;i<9;i++){const t=(i/8-0.5)*L*0.82,cx=(bx0+bx1)/2-Math.sin(th)*t,cy=(by0+by1)/2+Math.cos(th)*t;const c=mesh(GEO.cyl(0.022,0.022,0.085,6),M(C.brass),cx,cy,0.228-0.02*(0.6-cy),torso);c.rotation.z=th+Math.PI/2;}
  for(const s of[-1,1]){const sh=mesh(GEO.box(0.075,0.05,0.34),M(C.dark),s*0.17,0.645,-0.02,torso);sh.rotation.z=s*0.25;}
  /* tubo com runas nas costas (só visual) */
  const tTh=-0.42,tc=[0.03,0.36,-0.29],tDir=[-Math.sin(tTh),Math.cos(tTh)];
  const tubeMat=new THREE.MeshToonMaterial({map:tubeRuneTex(),gradientMap:GRAD});
  const tube=outline(mesh(GEO.cyl(0.1,0.1,0.9,14),tubeMat,tc[0],tc[1],tc[2],torso),1.04);tube.rotation.z=tTh;
  const along=(d)=>[tc[0]+tDir[0]*d,tc[1]+tDir[1]*d,tc[2]];
  for(const d of[-0.3,0,0.3]){const p=along(d),r=mesh(GEO.tor(0.104,0.022,6,16),M(C.brass),p[0],p[1],p[2],torso);r.rotation.order='ZYX';r.rotation.set(Math.PI/2,0,tTh);}
  for(const[d,h,r0,r1]of[[0.47,0.06,0.115,0.115],[-0.47,0.06,0.115,0.115]]){const p=along(d),cap=outline(mesh(GEO.cyl(r0,r1,h,14),M(C.brass),p[0],p[1],p[2],torso),1.05);cap.rotation.z=tTh;}
  {const p=along(0.53),cn=mesh(GEO.cone(0.075,0.1,10),M(C.brass),p[0],p[1],p[2],torso);cn.rotation.z=tTh;}
  /* cabeça: rosto com barba e bigode, cabelo escuro, chapéu de aba larga com óculos de proteção */
  const head=new THREE.Group();head.position.set(0,0.88,0);torso.add(head);rig.head=head;
  const hd=outline(mesh(GEO.sph(0.175,14,12),M(C.skin),0,0,0,head),1.05);hd.scale.set(0.96,1.08,1.0);
  const hair=mesh(GEO.sph(0.182,12,10),M(C.hair),0,0.03,-0.025,head);hair.scale.set(1.0,0.95,0.98);
  const jaw=mesh(GEO.sph(0.16,12,10),M(C.hair),0,-0.075,0.012,head);jaw.scale.set(0.98,0.62,0.93);
  mesh(GEO.sph(0.05,8,6),M(C.skin),0,-0.05,0.135,head).scale.set(1.35,0.75,0.6);
  const gt=mesh(GEO.sph(0.055,8,6),M(C.hair),0,-0.135,0.115,head);gt.scale.set(0.95,1.25,0.8);
  for(const s of[-1,1]){
    const mu=mesh(GEO.sph(0.035,8,6),M(C.hair),s*0.04,-0.06,0.158,head);mu.scale.set(1.35,0.5,0.6);mu.rotation.z=s*0.3;
    mesh(GEO.sph(0.02,6,5),BASIC(0x140c06),s*0.062,0.035,0.16,head);
    mesh(GEO.sph(0.007,4,3),BASIC(0xfff2dc),s*0.057,0.043,0.177,head);
    const br=mesh(GEO.box(0.06,0.014,0.016),M(C.hair),s*0.064,0.075,0.158,head);br.rotation.z=-s*0.18;
    mesh(GEO.sph(0.04,6,5),M(C.skin),s*0.168,0.0,0.0,head).scale.set(0.5,1,0.8);
  }
  mesh(GEO.sph(0.03,8,6),M(C.skin2),0,0.0,0.178,head).scale.set(0.8,1.1,0.9);
  /* chapéu */
  outline(mesh(GEO.cyl(0.42,0.42,0.024,22),M(C.hat),0,0.13,0,head),1.03);
  ring(0.42,0.016,M(C.dark),0,0.137,0,head);
  outline(mesh(GEO.cyl(0.18,0.205,0.2,16),M(C.hat),0,0.235,0,head),1.04);
  const top=mesh(GEO.sph(0.182,14,8),M(C.hat),0,0.33,0,head);top.scale.set(1,0.32,1);
  mesh(GEO.cyl(0.208,0.21,0.045,16),M(C.dark),0,0.17,0,head);
  ring(0.205,0.012,M(C.metal),0,0.215,0,head);
  for(const s of[-1,1]){
    const gx=s*0.062,gz=0.19;
    outline(mesh(GEO.tor(0.048,0.016,6,14),M(C.brass),gx,0.218,gz,head),1.08);
    mesh(new THREE.CircleGeometry(0.042,12),BASIC(0x8fcde8),gx,0.218,gz+0.008,head);
    mesh(new THREE.CircleGeometry(0.012,6),BASIC(0xf4fbff),gx-0.014,0.232,gz+0.01,head);
  }
  mesh(GEO.box(0.03,0.018,0.02),M(C.brass),0,0.218,0.2,head);
  /* braços: manga dobrada no cotovelo, antebraço, luva sem dedos; a direita (-X) segura a lanterna */
  for(const s of[-1,1]){
    const arm=new THREE.Group();arm.position.set(s*0.34,0.56,0);torso.add(arm);
    outline(mesh(GEO.sph(0.1,10,8),M(C.cream),0,0,0,arm),1.05);
    outline(mesh(LATHE([[0.001,0.0],[0.098,0.0],[0.1,-0.1],[0.088,-0.25],[0.084,-0.3],[0.001,-0.3]],10),M(C.cream),0,0,0,arm),1.05);
    ring(0.088,0.026,M(C.cuff),0,-0.29,0,arm);
    outline(mesh(LATHE([[0.001,-0.29],[0.079,-0.29],[0.082,-0.36],[0.064,-0.55],[0.001,-0.55]],10),M(C.skin),0,0,0,arm),1.05);
    outline(mesh(GEO.cyl(0.068,0.066,0.07,10),M(C.glove),0,-0.57,0,arm),1.05);
    const hand=outline(mesh(GEO.sph(0.068,10,8),M(C.glove),0,-0.65,0.01,arm),1.05);hand.scale.set(0.9,1.1,1.05);
    for(let k=0;k<3;k++)mesh(GEO.sph(0.022,6,5),M(C.skin),-s*0.0+(k-1)*0.03,-0.71,0.045,arm);
    rig[s<0?'armR':'armL']=arm;
  }
  const lamp=new THREE.Group();lamp.position.set(0,-0.66,0.02);rig.armR.add(lamp);
  outline(mesh(GEO.cyl(0.036,0.044,0.24,10),M(C.metal),0,-0.04,0,lamp),1.06);
  ring(0.05,0.012,M(C.brass),0,-0.15,0,lamp);
  rig.lens=mesh(GEO.cyl(0.048,0.048,0.03,10),BASICU(0xfff2b0),0,-0.17,0,lamp);
  g.scale.setScalar(0.92);
  rig.lens.userData.keep=true;mergeLocalVC(g);
  /* para esmaecer o personagem quando a câmera chega muito perto (os contornos somem antes) */
  rig.fade={mats:[VC_TOON,VC_BASIC,tubeMat,rig.lens.material],outlines:[],op:1};
  /* sempre na fila transparente: trocar 'transparent' muda o shader (define OPAQUE) e recompila a cada aproximação da câmera */
  for(const m of rig.fade.mats)m.transparent=true;
  g.traverse(o=>{if(o.isMesh&&o.material===OUTLINE_MAT)rig.fade.outlines.push(o);});
  return{group:g,rig};
}
function animExplorer(rig,anim,speed,air,run,t){
  const k=Math.min(1,speed/4.3),sw=Math.sin(anim)*k*(run?0.95:0.65),breath=Math.sin(t*1.8);
  if(air){rig.legL.rotation.x=-0.55;rig.legR.rotation.x=0.4;rig.armL.rotation.x=-2.3;rig.armR.rotation.x=-1.1;rig.torso.rotation.x=0;rig.torso.rotation.y=0;}
  else{
    rig.legL.rotation.x=sw;rig.legR.rotation.x=-sw;rig.armL.rotation.x=-sw*0.9;rig.armR.rotation.x=-0.95-sw*0.12;
    rig.armL.rotation.z=0.06+(1-k)*0.04;rig.armR.rotation.z=-0.06;
    rig.torso.rotation.x=run?0.16:0.02*k;rig.torso.rotation.y=-sw*0.12;
  }
  rig.torso.position.y=0.94+(air?0:Math.abs(Math.cos(anim))*0.035*k+breath*0.005*(1-k));
  rig.head.rotation.y=Math.sin(t*0.7)*0.06*(1-k)+sw*0.1;rig.head.rotation.x=-0.03*breath*(1-k);
}

function buildAutomaton(){
  const g=new THREE.Group(),rig={};
  const brass=0xc59a3e,copper=0xb06a35,dark=0x3a2c20;
  for(const s of[-1,1]){
    const leg=new THREE.Group();leg.position.set(s*0.3,0.85,0);g.add(leg);
    outline(mesh(GEO.cyl(0.15,0.13,0.8,8),M(brass),0,-0.4,0,leg));
    outline(mesh(GEO.box(0.38,0.14,0.56),M(dark),0,-0.8,0.08,leg));
    rig[s<0?'legR':'legL']=leg;
  }
  const body=new THREE.Group();body.position.set(0,0,0);g.add(body);rig.body=body;
  outline(mesh(GEO.cyl(0.62,0.7,1.15,14),M(brass),0,1.45,0,body));
  for(const y of[0.98,1.9]){const t=mesh(GEO.tor(0.665,0.045,6,18),M(copper),0,y,0,body);t.rotation.x=Math.PI/2;}
  for(let i=0;i<10;i++){const a=i/10*TAU;mesh(GEO.sph(0.03,5,4),M(copper),Math.sin(a)*0.64,1.9,Math.cos(a)*0.64,body);}
  const gear=new THREE.Group();gear.position.set(0,1.5,0.66);body.add(gear);rig.gear=gear;
  const gc=mesh(GEO.cyl(0.3,0.3,0.1,14),M(copper,{emissive:0x331a08}),0,0,0,gear);gc.rotation.x=Math.PI/2;
  for(let i=0;i<8;i++){const a=i/8*TAU,b=mesh(GEO.box(0.12,0.1,0.1),M(copper),Math.cos(a)*0.34,Math.sin(a)*0.34,0,gear);b.rotation.z=a;}
  mesh(GEO.cyl(0.07,0.07,0.14,8),M(dark),0,0,0.02,gear).rotation.x=Math.PI/2;
  for(const s of[-1,1]){
    const arm=new THREE.Group();arm.position.set(s*0.82,2.0,0);body.add(arm);
    outline(mesh(GEO.cyl(0.12,0.1,0.55,8),M(brass),0,-0.27,0,arm));
    outline(mesh(GEO.sph(0.13,8,6),M(copper),0,-0.56,0,arm));
    outline(mesh(GEO.cyl(0.1,0.12,0.5,8),M(brass),0,-0.84,0,arm));
    mesh(GEO.box(0.06,0.24,0.09),M(dark),-0.05,-1.17,0,arm);mesh(GEO.box(0.06,0.24,0.09),M(dark),0.05,-1.17,0,arm);
    rig[s<0?'armR':'armL']=arm;
  }
  const head=new THREE.Group();head.position.set(0,2.38,0);body.add(head);rig.head=head;
  outline(mesh(GEO.sph(0.31,12,10),M(brass),0,0,0,head));
  rig.eyeMat=new THREE.MeshBasicMaterial({color:0x4a2a10});
  for(const s of[-1,1])mesh(GEO.sph(0.07,8,6),rig.eyeMat,s*0.13,0.04,0.26,head);
  mesh(GEO.cyl(0.06,0.09,0.36,8),M(dark),0,0.38,-0.08,head);
  mesh(GEO.cyl(0.11,0.07,0.06,8),M(copper),0,0.58,-0.08,head);
  g.scale.setScalar(0.85);
  mergeLocalTree(g);
  return{group:g,rig};
}
function animAutomaton(rig,t,awake,speed){
  if(awake){
    const sw=Math.sin(t*7)*Math.min(1,speed/2.5)*0.7;
    rig.legL.rotation.x=sw;rig.legR.rotation.x=-sw;rig.armL.rotation.x=-sw*0.8-0.3;rig.armR.rotation.x=sw*0.8-0.3;
    rig.head.rotation.x=0;rig.head.rotation.z=Math.sin(t*3)*0.05;rig.body.position.y=Math.abs(Math.cos(t*7))*0.05*Math.min(1,speed/2.5);
    rig.eyeMat.color.setHex(0xffa030);rig.gear.rotation.z+=0.05;
  }else{
    rig.legL.rotation.x=0;rig.legR.rotation.x=0;rig.armL.rotation.x=0.1;rig.armR.rotation.x=0.1;
    rig.head.rotation.x=0.55+Math.sin(t*0.8)*0.03;rig.head.rotation.z=0;rig.body.position.y=Math.sin(t*0.8)*0.012;
    rig.eyeMat.color.setHex(0x3a2210);rig.gear.rotation.z+=0.004;
  }
}

/* ====================== Robô-vigia a diesel (blindado, art déco, holofote no lugar do rosto) ====================== */
function beamGeo(rFar,rNear){const g=new THREE.CylinderGeometry(rFar,rNear,1,14,1,true);g.rotateX(Math.PI/2);g.translate(0,0,0.5);return g;}
function beamMat(color,op){return new THREE.MeshBasicMaterial({color,transparent:true,opacity:op,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,fog:true});}
function buildSentinel(){
  const g=new THREE.Group(),rig={};
  const steel=0x2f343d,dark=0x1a1d23,chrome=0xc9d3de,cream=0xd9cfae;
  for(const s of[-1,1]){
    const leg=new THREE.Group();leg.position.set(s*0.3,0.95,0);g.add(leg);
    outline(mesh(GEO.box(0.34,0.9,0.4),M(steel),0,-0.45,0,leg),1.04);
    mesh(GEO.box(0.36,0.05,0.42),BASIC(chrome),0,-0.25,0,leg);
    outline(mesh(GEO.box(0.42,0.16,0.64),M(dark),0,-0.88,0.1,leg),1.04);
    rig[s<0?'legR':'legL']=leg;
  }
  const body=new THREE.Group();g.add(body);rig.body=body;
  outline(mesh(GEO.box(1.15,0.28,0.8),M(dark),0,1.02,0,body),1.03);
  outline(mesh(GEO.box(1.2,1.25,0.85),M(steel),0,1.78,0,body),1.03);
  for(const x of[-0.3,0,0.3])mesh(GEO.box(0.06,1.05,0.02),BASIC(chrome),x,1.78,0.44,body);
  mesh(GEO.box(0.95,0.07,0.02),BASIC(cream),0,2.2,0.44,body);mesh(GEO.box(0.95,0.07,0.02),BASIC(cream),0,1.36,0.44,body);
  mesh(GEO.cyl(0.14,0.14,0.04,10),BASIC(0xff5a3a),0.38,1.55,0.44,body).rotation.x=Math.PI/2;
  for(const s of[-1,1]){
    outline(mesh(GEO.box(0.5,0.3,0.7),M(dark),s*0.82,2.28,0,body),1.04);
    const arm=new THREE.Group();arm.position.set(s*0.86,2.2,0);body.add(arm);
    outline(mesh(GEO.box(0.22,0.62,0.26),M(steel),0,-0.31,0,arm),1.04);
    outline(mesh(GEO.box(0.26,0.56,0.3),M(steel),0,-0.9,0,arm),1.04);
    mesh(GEO.box(0.28,0.05,0.32),BASIC(chrome),0,-0.7,0,arm);
    outline(mesh(GEO.box(0.28,0.22,0.3),M(dark),0,-1.28,0,arm),1.04);
    rig[s<0?'armR':'armL']=arm;
  }
  const head=new THREE.Group();head.position.set(0,2.66,0);body.add(head);rig.head=head;
  const hs=mesh(GEO.cyl(0.36,0.42,0.62,14),M(dark),0,0,0.08,head);hs.rotation.x=Math.PI/2;outline(hs,1.05);
  const rim=mesh(GEO.tor(0.38,0.04,6,16),BASIC(chrome),0,0,0.4,head);
  const lens=mesh(GEO.cyl(0.33,0.33,0.05,14),BASICU(0xeaf8ff),0,0,0.42,head);lens.rotation.x=Math.PI/2;rig.lens=lens;
  mesh(GEO.box(0.5,0.1,0.5),M(steel),0,0.46,0,head);
  const beam=new THREE.Mesh(beamGeo(5.0,0.25),beamMat(0xcfeaff,0.11));beam.position.z=0.45;beam.scale.set(1,1,13);head.add(beam);rig.beam=beam;
  g.scale.setScalar(0.9);
  beam.userData.keep=true;mergeLocalTree(g);
  return{group:g,rig};
}
function animSentinel(rig,t,speed,chasing){
  const k=Math.min(1,speed/2.5),sw=Math.sin(t*(chasing?7:5))*k*0.55;
  rig.legL.rotation.x=sw;rig.legR.rotation.x=-sw;rig.armL.rotation.x=-sw*0.8;rig.armR.rotation.x=sw*0.8;
  rig.body.position.y=Math.abs(Math.cos(t*(chasing?7:5)))*0.04*k;
  rig.beam.material.color.setHex(chasing?0xff8a5a:0xcfeaff);rig.beam.material.opacity=chasing?0.17:0.11;
  rig.lens.material.color.setHex(chasing?0xffb080:0xeaf8ff);
}

/* ====================== Robô atômico de manutenção (formas arredondadas dos anos 50, antena, visor verde) ====================== */
function buildMaintBot(){
  const g=new THREE.Group(),rig={};
  const white=0xd8ddd4,orange=0xe0792a,dark=0x1a2420,chrome=0xc9d3de;
  const base=new THREE.Group();g.add(base);rig.base=base;
  for(const s of[-1,1]){const w=mesh(GEO.cyl(0.38,0.38,0.22,14),M(dark),s*0.62,0.38,0,base);w.rotation.z=Math.PI/2;outline(w,1.06);const hub=mesh(GEO.cyl(0.18,0.18,0.26,8),BASIC(orange),s*0.62,0.38,0,base);hub.rotation.z=Math.PI/2;}
  outline(mesh(GEO.cyl(0.62,0.7,0.34,16),M(white),0,0.62,0,base),1.04);
  const body=new THREE.Group();body.position.set(0,0,0);g.add(body);rig.body=body;
  const bs=outline(mesh(GEO.sph(0.78,16,12),M(white),0,1.45,0,body),1.03);bs.scale.set(1,1.1,0.95);
  const belt=mesh(GEO.tor(0.76,0.07,6,20),M(orange),0,1.2,0,body);belt.rotation.x=Math.PI/2;
  mesh(GEO.box(0.55,0.4,0.05),M(dark),0,1.55,0.74,body);
  for(const x of[-0.14,0.14])mesh(GEO.cyl(0.09,0.09,0.03,10),BASIC(0x5dff7a),x,1.55,0.78,body).rotation.x=Math.PI/2;
  rig.gaugeMat=null;
  for(const s of[-1,1]){
    const arm=new THREE.Group();arm.position.set(s*0.86,1.75,0);body.add(arm);
    outline(mesh(GEO.cyl(0.11,0.09,0.7,8),M(white),0,-0.35,0,arm),1.05);
    outline(mesh(GEO.sph(0.14,8,6),M(orange),0,-0.72,0,arm),1.05);
    mesh(GEO.box(0.06,0.3,0.1),M(dark),-0.07,-0.95,0,arm);mesh(GEO.box(0.06,0.3,0.1),M(dark),0.07,-0.95,0,arm);
    rig[s<0?'armR':'armL']=arm;
  }
  const head=new THREE.Group();head.position.set(0,2.35,0);body.add(head);rig.head=head;
  const dome=outline(mesh(GEO.sph(0.5,14,10),M(white),0,0,0,head),1.04);dome.scale.set(1,0.85,1);
  rig.visorMat=new THREE.MeshBasicMaterial({color:0x14301c});
  const visor=mesh(GEO.cyl(0.52,0.52,0.2,16,1),rig.visorMat,0,0.02,0,head);visor.scale.set(1,1,0.9);
  const ant=new THREE.Group();ant.position.set(0,0.42,0);head.add(ant);rig.ant=ant;
  mesh(GEO.cyl(0.03,0.03,0.7,6),BASIC(chrome),0,0.35,0,ant);
  rig.tipMat=new THREE.MeshBasicMaterial({color:0x2a4a30});mesh(GEO.sph(0.09,8,6),rig.tipMat,0,0.74,0,ant);
  g.scale.setScalar(0.95);
  mergeLocalTree(g);
  return{group:g,rig};
}
function animMaintBot(rig,t,awake,speed){
  if(awake){
    rig.visorMat.color.setHex(0x5dff7a);rig.tipMat.color.setHex(Math.sin(t*9)>0?0xff5a3a:0x5a1a10);
    rig.head.rotation.x=0;rig.head.rotation.z=Math.sin(t*3)*0.05;rig.ant.rotation.z=Math.sin(t*6)*0.12;
    rig.armL.rotation.x=-0.5+Math.sin(t*5)*0.2*Math.min(1,speed/2.5);rig.armR.rotation.x=-0.5-Math.sin(t*5)*0.2*Math.min(1,speed/2.5);
    rig.body.rotation.z=Math.sin(t*4)*0.03*Math.min(1,speed/2.5);rig.body.position.y=Math.abs(Math.sin(t*8))*0.03*Math.min(1,speed/2.5);
  }else{
    rig.visorMat.color.setHex(0x14301c);rig.tipMat.color.setHex(0x2a4a30);
    rig.head.rotation.x=0.45+Math.sin(t*0.8)*0.02;rig.head.rotation.z=0;rig.ant.rotation.z=0.5;
    rig.armL.rotation.x=0.1;rig.armR.rotation.x=0.1;rig.body.rotation.z=0;rig.body.position.y=Math.sin(t*0.8)*0.01;
  }
}

/* ====================== Clone (translúcido, veias bioluminescentes) ====================== */
function buildClone(){
  const g=new THREE.Group(),rig={};
  const body=M(0xc9a0ff,{transparent:true,opacity:0.8,depthWrite:false}),dark=M(0x8a62c8,{transparent:true,opacity:0.85,depthWrite:false});
  rig.veinMat=new THREE.MeshBasicMaterial({color:0xff7ad8});rig.eyeMat=new THREE.MeshBasicMaterial({color:0x2a1a3a});
  for(const s of[-1,1]){
    const leg=new THREE.Group();leg.position.set(s*0.2,0.95,0);g.add(leg);
    mesh(GEO.cyl(0.14,0.1,0.95,8),body,0,-0.47,0,leg);mesh(GEO.box(0.02,0.8,0.02),rig.veinMat,s*0.04,-0.47,0.11,leg);
    mesh(GEO.sph(0.13,8,6),dark,0,-0.96,0.05,leg);
    rig[s<0?'legR':'legL']=leg;
  }
  const body_=new THREE.Group();g.add(body_);rig.body=body_;
  mesh(GEO.cyl(0.36,0.26,1.0,10),body,0,1.5,0,body_);mesh(GEO.cyl(0.3,0.3,0.14,10),dark,0,1.02,0,body_);
  mesh(GEO.sph(0.12,8,6),rig.veinMat,0,1.62,0.25,body_);
  for(const x of[-0.14,0.14])mesh(GEO.box(0.03,0.8,0.03),rig.veinMat,x,1.5,0.3,body_);
  for(const s of[-1,1]){
    const arm=new THREE.Group();arm.position.set(s*0.44,1.9,0);body_.add(arm);
    mesh(GEO.cyl(0.09,0.07,0.8,8),body,0,-0.4,0,arm);mesh(GEO.box(0.02,0.7,0.02),rig.veinMat,0,-0.4,0.08,arm);mesh(GEO.sph(0.1,8,6),dark,0,-0.84,0,arm);
    rig[s<0?'armR':'armL']=arm;
  }
  const head=new THREE.Group();head.position.set(0,2.2,0);body_.add(head);rig.head=head;
  mesh(GEO.sph(0.24,12,10),body,0,0,0,head);
  for(const s of[-1,1])mesh(GEO.sph(0.045,8,6),rig.eyeMat,s*0.09,0.03,0.2,head);
  mesh(GEO.box(0.02,0.3,0.02),rig.veinMat,0,0.12,0.22,head);
  g.scale.setScalar(0.95);
  mergeLocalTree(g);
  return{group:g,rig};
}
function animClone(rig,t,awake,speed){
  const beat=awake?Math.max(0,Math.sin(t*14)):Math.max(0,Math.sin(t*5.5)),k=Math.min(1,speed/2.5);
  rig.veinMat.color.setRGB(lerp(0.45,1.0,beat),lerp(0.16,0.55,beat),lerp(0.4,0.9,beat));
  if(awake){
    const sw=Math.sin(t*7)*k*0.7;
    rig.legL.rotation.x=sw;rig.legR.rotation.x=-sw;rig.armL.rotation.x=-sw*0.8-0.5;rig.armR.rotation.x=sw*0.8-0.5;
    rig.head.rotation.x=0;rig.head.rotation.z=Math.sin(t*3)*0.06;rig.body.position.y=Math.abs(Math.cos(t*7))*0.05*k;rig.eyeMat.color.setHex(0xffa8ff);
  }else{
    rig.legL.rotation.x=0;rig.legR.rotation.x=0;rig.armL.rotation.x=0.05;rig.armR.rotation.x=0.05;
    rig.head.rotation.x=0.55;rig.head.rotation.z=0;rig.body.position.y=Math.sin(t*1.6)*0.015;rig.eyeMat.color.setHex(0x2a1a3a);
  }
}
