/* ====================== Tumba Viva (Biopunk) ======================
   A regra: repetir a canção. Em cada sala os bulbos cantam uma sequência de cores e notas; a porta de tecido só abre
   para quem a repete na mesma ordem. Errar faz barulho e acorda os Clones que dormem nas cápsulas.
   Salão -> Sala das Portas de Tecido -> Sala dos Esporos (névoa, 1 Clone) -> Sala das Cápsulas (2 Clones) -> Câmara da semente. */
const bioArea=makeArea('bio');bioArea.key='bio';bioArea.killY=-5;bioArea.metal=false;bioArea.spawn={x:0,y:0,z:5,face:Math.PI};
bioArea.fogColor=0x0a0610;bioArea.hemi=[0x7a5aa0,0x1c1226,0.68];bioArea.lampColor=0xe0b8ff;bioArea.ambience='bio';
const BGR=bioArea.group;BGR.visible=false;scene.add(BGR);TOMB_AREAS.bio=bioArea;
const bio={rooms:[],gates:[],clones:[],flowers:[],hints:{},relicTaken:false,seed:null,sporeOp:-1,hazeOn:false};
const B_WALL=M(0x4a2f66),B_DARK=M(0x1c1226),B_ROOT=M(0x3b2a52),B_FLESH=M(0x8a5aa8),B_LEAF=M(0x5fa85a);
const BCOL=[0xff6ac8,0xb98cff,0x8aff6a,0x6fe0ff],BDIM=[0x4a1c3e,0x2e2250,0x1f3a1c,0x1a3a44];
const HAZE_COL=new THREE.Color(0x3a2748),BASE_FOG=new THREE.Color(0x0a0610);
const NODE_STEP=0.9,CLONE_SPEED=2.6,CLONE_WAKE_RUN=8.5,CLONE_WAKE_NEAR=2.4;

function bbox(x0,x1,z0,z1,y0,y1,mat,col){const m=mesh(GEO.box(x1-x0,y1-y0,z1-z0),mat,(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,BGR);if(col!==false)colBox(bioArea,x0,x1,z0,z1,y0,y1);return m;}
function bTiled(x0,x1,z0,z1,y,mat,tile){
  const w=x1-x0,d=z1-z0,g=new THREE.PlaneGeometry(w,d),uv=g.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*w/tile,uv.getY(i)*d/tile);
  const m=mesh(g,mat,(x0+x1)/2,y,(z0+z1)/2,BGR);m.rotation.x=-Math.PI/2;return m;
}
function floorTex(){return canvasTex(128,128,(g,w,h)=>{
  const r=rng(21);g.fillStyle='#2b1b3b';g.fillRect(0,0,w,h);
  for(let i=0;i<46;i++){const x=r()*w,y=r()*h,rad=5+r()*16,c=r()<0.3?'62,104,68':'58,36,84';g.fillStyle='rgba('+c+',0.4)';
    for(const[ox,oy]of[[0,0],[w,0],[-w,0],[0,h],[0,-h]]){g.beginPath();g.arc(x+ox,y+oy,rad,0,TAU);g.fill();}}
  g.strokeStyle='rgba(255,122,216,0.4)';g.lineWidth=1.6;
  for(let k=0;k<5;k++){let x=r()*w,y=r()*h;g.beginPath();g.moveTo(x,y);for(let s=0;s<6;s++){x+=(r()-0.5)*36;y+=(r()-0.5)*36;g.lineTo(x,y);}g.stroke();}
});}
function membraneTex(){return canvasTex(128,256,(g,w,h)=>{
  const r=rng(5);g.fillStyle='#7a4aa8';g.fillRect(0,0,w,h);
  for(let i=0;i<34;i++){g.fillStyle='rgba('+(110+r()*40|0)+','+(60+r()*30|0)+','+(150+r()*50|0)+',0.35)';g.beginPath();g.arc(r()*w,r()*h,8+r()*22,0,TAU);g.fill();}
  g.strokeStyle='rgba(255,122,216,0.9)';g.lineWidth=2.4;
  for(let k=0;k<7;k++){let x=r()*w,y=h;g.beginPath();g.moveTo(x,y);for(let s=0;s<9;s++){x+=(r()-0.5)*30;y-=h/9;g.lineTo(x,y);}g.stroke();}
});}

function bCross(zc,half){
  bbox(-9.8,-half,zc-0.4,zc+0.4,-12,10,B_WALL);bbox(half,9.8,zc-0.4,zc+0.4,-12,10,B_WALL);bbox(-half,half,zc-0.4,zc+0.4,7.4,10,B_WALL,false);
  for(const s of[-1,1])for(const dz of[-0.6,0.6]){const c=mesh(GEO.cyl(0.3,0.55,7.6,8),B_FLESH,s*(half+0.6),3.8,zc+dz,BGR);c.rotation.z=-s*0.04;colCyl(bioArea,s*(half+0.6),zc+dz,0.5,-2,7.6);}
}
function bGate(zc){
  const g=new THREE.Group();g.position.set(0,0,zc);BGR.add(g);g.userData.dyn=true;
  const mat=new THREE.MeshToonMaterial({map:membraneTex(),gradientMap:GRAD});
  const fl=new THREE.Group(),fr=new THREE.Group();fl.position.x=-1.52;fr.position.x=1.52;g.add(fl);g.add(fr);
  mesh(GEO.box(3.05,7.4,0.3),mat,0,3.7,0,fl);mesh(GEO.box(3.05,7.4,0.3),mat,0,3.7,0,fr);
  const c=colBox(bioArea,-3,3,zc-0.3,zc+0.3,-12,8);
  const o={g,fl,fr,c,open:0,latched:false,zc,sound:false};bio.gates.push(o);return o;
}
function bDots(r,zc,n){
  const cv=document.createElement('canvas');cv.width=256;cv.height=48;const tx=new THREE.CanvasTexture(cv);
  const pl=mesh(new THREE.PlaneGeometry(4,0.75),new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false}),0,7.9,zc+0.43,BGR);pl.userData.dyn=true;
  r.dotsCv=cv;r.dotsTx=tx;r.dotsN=n;updateDots(r);
}
function updateDots(r){
  const g=r.dotsCv.getContext('2d'),W=256,n=r.dotsN;g.clearRect(0,0,W,48);
  for(let k=0;k<n;k++){const x=W/2+(k-(n-1)/2)*44,on=r.solved||k<r.prog;g.fillStyle=on?'#ffe98a':'#2a1c3a';g.strokeStyle=on?'#fff6c8':'#6a4a88';g.lineWidth=3;g.beginPath();g.arc(x,24,14,0,TAU);g.fill();g.stroke();}
  r.dotsTx.needsUpdate=true;
}

/* bulbos que cantam */
function bNode(r,idx,x,z){
  outline(mesh(GEO.cyl(0.75,0.95,0.35,10),B_FLESH,x,0.17,z,BGR),1.05);
  mesh(GEO.cyl(0.14,0.26,1.25,8),B_ROOT,x,0.9,z,BGR);
  for(let k=0;k<4;k++){const a=k*TAU/4+idx;const l=mesh(GEO.cone(0.2,0.9,5),B_LEAF,x+Math.cos(a)*0.38,1.55,z+Math.sin(a)*0.38,BGR);l.rotation.z=-Math.cos(a)*0.55;l.rotation.x=Math.sin(a)*0.55;}
  const pg=new THREE.Group();pg.position.set(x,1.95,z);BGR.add(pg);pg.userData.dyn=true;
  const mat=BASICU(BDIM[idx]);mesh(GEO.sph(0.5,12,9),mat,0,0,0,pg);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:BCOL[idx],blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));halo.scale.set(3.4,3.4,1);pg.add(halo);
  colCyl(bioArea,x,z,0.55,-2,2.5);
  const n={idx,x,z,pg,mat,halo,lit:0,decay:1.6,stay:false,fail:0,dim:new THREE.Color(BDIM[idx]),bright:new THREE.Color(BCOL[idx])};
  bioArea.interact.push({x,z,r:2.3,label:()=>(r.solved||r.state==='playing')?null:'Tocar o bulbo',use:()=>pressNode(r,n)});
  r.nodes.push(n);return n;
}
/* o coração repete a canção */
function bSource(r,x,z){
  outline(mesh(GEO.cyl(0.7,1.0,0.9,10),B_FLESH,x,0.45,z,BGR),1.04);
  for(let k=0;k<5;k++){const a=k*TAU/5,v=mesh(GEO.cyl(0.07,0.12,1.3,6),B_ROOT,x+Math.cos(a)*0.55,0.65,z+Math.sin(a)*0.55,BGR);v.rotation.z=Math.cos(a)*0.4;v.rotation.x=-Math.sin(a)*0.4;}
  colCyl(bioArea,x,z,0.95,-2,3.2);
  const hg=new THREE.Group();hg.position.set(x,1.7,z);BGR.add(hg);hg.userData.dyn=true;
  const mat=BASICU(0xff5ab8);mesh(GEO.sph(0.55,12,9),mat,0,0,0,hg).scale.set(1,1.1,0.95);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xff5ab8,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.45}));halo.scale.set(3.2,3.2,1);hg.add(halo);
  r.heart={hg,mat,halo};
  bioArea.interact.push({x,z,r:2.6,label:()=>(r.solved||r.state==='playing')?null:'Ouvir a sequência',use:()=>playRoom(r,false)});
}
/* flor bioluminescente: ponto de controle e recarga */
function bFlower(x,z){
  const g=new THREE.Group();g.position.set(x,0,z);BGR.add(g);g.userData.dyn=true;
  const petalMat=BASICU(0x4a2a66);
  mesh(GEO.cyl(0.08,0.14,1.5,6),B_LEAF,0,0.75,0,g);
  for(const[lx,lz]of[[0.5,0.1],[-0.45,-0.2]]){const lf=mesh(GEO.cone(0.18,0.7,5),B_LEAF,lx,0.5,lz,g);lf.rotation.z=-Math.sign(lx)*1.0;}
  for(let k=0;k<6;k++){const a=k*TAU/6,pt=mesh(GEO.cone(0.22,0.85,5),petalMat,Math.cos(a)*0.34,1.65,Math.sin(a)*0.34,g);pt.rotation.z=-Math.cos(a)*0.85;pt.rotation.x=Math.sin(a)*0.85;}
  mesh(GEO.sph(0.24,8,6),petalMat,0,1.62,0,g);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xff7ad8,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));glow.scale.set(3.4,3.4,1);glow.position.y=1.7;g.add(glow);
  colCyl(bioArea,x,z,0.65,-2,2.2);
  const o={x,z,g,petalMat,glow,lit:false,lamp:{x,y:2.0,z,on:false}};bio.flowers.push(o);bioArea.lamps.push(o.lamp);
  bioArea.interact.push({x,z,r:2.6,label:()=>o.lit?TXT.pointLabel:'Tocar a flor bioluminescente',use:()=>useFlower(o)});
  return o;
}
function useFlower(o){
  const first=!o.lit;usePowerPoint(o.x+(o.x<0?1.9:-1.9),o.z,first,'Flor acesa. Ponto de controle salvo e lanterna recarregada.');if(!first)return;
  o.lit=true;o.lamp.on=true;o.petalMat.color.setHex(0xff7ad8);o.glow.material.opacity=0.55;
  for(let i=0;i<3;i++)puff(o.x,2.2,o.z,{vy:1.0,size:0.6,life:1.4,color:0xffa8e8});
}
/* cápsulas de Clones */
const B_GLASS=BASICU(0xd8b8ff,{transparent:true,opacity:0.2,depthWrite:false});
function bCapsule(x,z,occupied){
  outline(mesh(GEO.cyl(1.2,1.3,0.4,14),B_FLESH,x,0.2,z,BGR),1.03);
  mesh(GEO.cyl(1.05,0.8,0.5,14),B_FLESH,x,3.55,z,BGR);
  mesh(GEO.cyl(0.14,0.14,5,6),B_ROOT,x,6.1,z,BGR);
  const glass=mesh(GEO.cyl(1.0,1.0,3.1,14),B_GLASS,x,1.95,z,BGR);glass.userData.dyn=true;glass.renderOrder=3;
  const col=colCyl(bioArea,x,z,1.05,-2,3.4);
  if(!occupied){const c=mesh(GEO.sph(0.6,8,6),M(0x3a2552),x,1.35,z,BGR);c.scale.set(1,1.9,1);}
  return{glass,col};
}
function bClone(room,x,z){
  const face=x<0?Math.PI/2:-Math.PI/2;
  const C=buildClone();C.group.position.set(x,0,z);C.group.rotation.y=face;BGR.add(C.group);C.group.userData.dyn=true;
  const cap=bCapsule(x,z,true);
  const o={x,z,hx:x,hz:z,face,hf:face,state:'sleep',rig:C.rig,group:C.group,speed:0,room,cap,puffT:0};bio.clones.push(o);return o;
}

function buildBio(){
  const FLR=new THREE.MeshToonMaterial({map:(function(){const t=floorTex();t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;})(),gradientMap:GRAD});
  /* pisos, paredes, teto */
  bbox(-9,9,-99.2,8.8,-1,0,M(0x241632));bbox(-7.8,7.8,-113,-98.4,-1,0,M(0x2a1a3a));
  bTiled(-9,9,-99.2,8.8,0.012,FLR,6);bTiled(-7.8,7.8,-113,-98.4,0.012,FLR,6);
  bbox(-9.8,-9,-99.2,9.6,-12,10,B_WALL);bbox(9,9.8,-99.2,9.6,-12,10,B_WALL);bbox(-9.8,9.8,8.8,9.6,-12,10,B_WALL);
  bbox(-8.6,-7.8,-113.8,-98.4,-12,10,B_WALL);bbox(7.8,8.6,-113.8,-98.4,-12,10,B_WALL);bbox(-8.6,8.6,-113.8,-113,-12,10,B_WALL);
  bbox(-9.8,9.8,-113.8,9.6,8.4,9.6,M(0x241632),false);
  bCross(-8,3);bCross(-34,3);bCross(-66,3);bCross(-98.8,3);
  /* colunas de raiz e decoração */
  const rg=rng(11);
  for(const s of[-1,1])for(let z=3;z>-97;z-=6){
    const c=mesh(GEO.cyl(0.35,0.8,8.4,8),B_FLESH,s*8.8,4.2,z,BGR);c.rotation.z=-s*0.03;colCyl(bioArea,s*8.8,z,0.8,-2,8);
    for(let k=0;k<2;k++)mesh(GEO.sph(0.3+rg()*0.15,6,5),B_ROOT,s*(8.3-rg()*0.3),1+rg()*5,z+(rg()-0.5)*0.8,BGR);
  }
  const veinMat=BASIC(0xff7ad8),mushA=BASIC(0xff9ee8),mushB=BASIC(0x8aff6a);
  for(let i=0;i<46;i++){
    const s=rg()<0.5?-1:1,z=8-rg()*118,y=0.6+rg()*6;let vy=y;
    for(let k=0;k<4;k++){const v=mesh(GEO.box(0.06,0.06,0.9),veinMat,s*8.93,vy,z-k*0.7,BGR);v.rotation.x=(rg()-0.5)*0.9;vy+=(rg()-0.3)*0.5;}
  }
  for(let i=0;i<64;i++){
    const x=(rg()-0.5)*15,z=5-rg()*100,len=1.4+rg()*2.4;
    outline(mesh(GEO.cone(0.32,len,6),B_ROOT,x,8.4-len/2,z,BGR).rotateX(Math.PI),1.06);
    mesh(GEO.sph(0.1,6,5),i%3?mushA:mushB,x,8.4-len,z,BGR);
  }
  for(let i=0;i<34;i++){
    const s=rg()<0.5?-1:1,x=s*(7.4+rg()*1.0),z=6-rg()*108,hh=0.3+rg()*0.45;
    mesh(GEO.cyl(0.05,0.07,hh,5),B_LEAF,x,hh/2,z,BGR);mesh(GEO.sph(0.15,6,5),i%2?mushA:mushB,x,hh+0.06,z,BGR);
  }
  for(let z=0;z>-100;z-=12){for(const s of[-1,1]){
    mesh(GEO.cyl(0.03,0.03,2,4),B_DARK,s*5.2,7.4,z,BGR);mesh(GEO.sph(0.3,8,6),BASIC(0xffb8f0),s*5.2,6.35,z,BGR);bioArea.lamps.push({x:s*5.2,y:6.2,z,on:true});}}
  /* salão: porta de saída (arco de raízes com membrana) */
  const mark=mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshBasicMaterial({map:eyeTexture('#b98cff'),transparent:true,opacity:0.8,depthWrite:false}),0,0.03,0,BGR);mark.rotation.x=-Math.PI/2;
  for(const s of[-1,1])outline(mesh(GEO.cyl(0.4,0.7,6.4,8),B_FLESH,s*3,3.2,8.4,BGR),1.04);outline(mesh(GEO.box(7,0.9,0.9),B_FLESH,0,6.2,8.4,BGR),1.04);
  mesh(GEO.box(5.2,5.4,0.2),BASIC(0xb98cff,{transparent:true,opacity:0.4}),0,2.7,8.6,BGR);
  mesh(new THREE.PlaneGeometry(1.6,1.6),new THREE.MeshBasicMaterial({map:eyeTexture('#ff9ee8'),transparent:true,depthWrite:false}),0,6.2,7.9,BGR);
  bioArea.interact.push({x:0,z:6.9,r:2.7,label:()=>'Sair para o Vale',use:()=>exitTomb(false)});
  bFlower(-5.2,-3.5);bFlower(-6,-36.2);bFlower(6,-68.2);

  /* SALA 1: Sala das Portas de Tecido (3 bulbos) */
  const g0=bGate(-34);
  const r1={id:0,zN:-8,x0:-9,x1:9,z0:-34,z1:-8,nodes:[],pattern:[0,2,1],state:'idle',prog:0,solved:false,played:false,pt:0,step:0,gate:g0};
  bNode(r1,0,-5,-24);bNode(r1,1,0,-24);bNode(r1,2,5,-24);bSource(r1,4.2,-15);bDots(r1,-34,3);bio.rooms.push(r1);
  /* SALA 2: Sala dos Esporos (4 bulbos, névoa, 1 Clone) */
  const g1=bGate(-66);
  const r2={id:1,zN:-34,x0:-9,x1:9,z0:-66,z1:-34,nodes:[],pattern:[3,1,0,2],state:'idle',prog:0,solved:false,played:false,pt:0,step:0,gate:g1};
  bNode(r2,0,-5.5,-47);bNode(r2,1,5.5,-47);bNode(r2,2,-5.5,-57);bNode(r2,3,5.5,-57);bSource(r2,-4.2,-41);bDots(r2,-66,4);bio.rooms.push(r2);
  bClone(r2,7.6,-40);
  /* SALA 3: Sala das Cápsulas (4 bulbos, 5 passos, 2 Clones entre 8 cápsulas) */
  const g2=bGate(-98.8);
  const r3={id:2,zN:-66,x0:-9,x1:9,z0:-98.4,z1:-66,nodes:[],pattern:[2,0,3,0,1],state:'idle',prog:0,solved:false,played:false,pt:0,step:0,gate:g2};
  for(let i=0;i<4;i++)bNode(r3,i,-6+i*4,-84);
  bSource(r3,3.5,-74.5);bDots(r3,-98.8,5);bio.rooms.push(r3);
  for(const z of[-72,-78,-84,-90])for(const s of[-1,1]){const x=s*7.9;const hasClone=(s<0&&z===-72)||(s>0&&z===-90);if(hasClone)bClone(r3,x,z);else bCapsule(x,z,false);}

  /* CÂMARA: a semente */
  const ped=new THREE.Group();ped.position.set(0,0,-107);BGR.add(ped);
  outline(mesh(GEO.cyl(1.3,1.6,1.1,12),B_FLESH,0,0.55,0,ped),1.04);
  for(let k=0;k<6;k++){const a=k*TAU/6,v=mesh(GEO.cone(0.22,1.4,5),B_LEAF,Math.cos(a)*1.45,0.7,Math.sin(a)*1.45,ped);v.rotation.z=-Math.cos(a)*0.5;v.rotation.x=Math.sin(a)*0.5;}
  colCyl(bioArea,0,-107,1.55,-2,2);
  const sd=new THREE.Group();sd.position.set(0,2.6,-107);BGR.add(sd);sd.userData.dyn=true;
  mesh(GEO.sph(0.4,12,9),BASIC(0xc9a0ff),0,0,0,sd).scale.set(1,1.35,1);
  for(let k=0;k<3;k++){const a=k*TAU/3,lf=mesh(GEO.cone(0.14,0.6,5),BASIC(0x8aff6a),Math.cos(a)*0.1,0.62,Math.sin(a)*0.1,sd);lf.rotation.z=-Math.cos(a)*0.7;lf.rotation.x=Math.sin(a)*0.7;}
  const sg=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xb98cff,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.6}));sg.scale.set(5.5,5.5,1);sg.position.set(0,2.6,-107);BGR.add(sg);
  bio.seed=sd;bio.seedGlow=sg;bio.seedLamp={x:0,y:2.8,z:-107,on:true};bioArea.lamps.push(bio.seedLamp);
  const mark2=mesh(new THREE.PlaneGeometry(9,9),new THREE.MeshBasicMaterial({map:eyeTexture('#b98cff'),transparent:true,opacity:0.55,depthWrite:false}),0,0.03,-107,BGR);mark2.rotation.x=-Math.PI/2;
  bioArea.interact.push({x:0,z:-104.6,r:2.8,label:()=>bio.relicTaken?null:'Pegar a semente',use:()=>{if(bio.relicTaken)return;bio.relicTaken=true;bio.seed.visible=false;bio.seedGlow.visible=false;bio.seedLamp.on=false;collectRelic('bio');}});
}

/* ---------- lógica ---------- */
function lightNode(n,dur){n.lit=1;n.decay=1/dur;SFX.node(n.idx);}
function playRoom(r,auto){
  if(r.solved||r.state==='playing')return;
  r.state='playing';r.prog=0;r.step=0;r.pt=auto?-0.6:-0.35;updateDots(r);
  if(!auto)SFX.click();
}
function bioNoise(r){
  let n=0;for(const c of bio.clones){if(c.room===r&&c.state==='sleep'){wakeClone(c,true);n++;}}
  return n;
}
function pressNode(r,n){
  if(r.solved||r.state==='playing'){SFX.deny();return;}
  if(n.idx===r.pattern[r.prog]){
    lightNode(n,0.55);r.prog++;updateDots(r);
    if(r.prog>=r.pattern.length){
      r.solved=true;r.state='solved';updateDots(r);for(const m of r.nodes)m.stay=true;r.gate.latched=true;
      if(r.heart){r.heart.mat.color.setHex(0x8aff6a);r.heart.halo.material.color.setHex(0x8aff6a);}
      SFX.bioChime();SFX.membrane();toast('A canção se completa. A porta de tecido se abre...','good');addDiary('bio_seq');
    }
  }else{
    n.fail=0.5;r.prog=0;updateDots(r);SFX.bioFail();
    const woke=bioNoise(r);
    toast(woke?'Sequência errada! O barulho acordou os Clones!':'Sequência errada! Toque o coração para ouvir de novo.','warn');
    addDiary('bio_seq');
  }
}
function wakeClone(c,noise){
  if(c.state==='awake')return;
  c.state='awake';c.cap.glass.visible=false;c.cap.col.on=false;SFX.wake();
  for(let i=0;i<2;i++)puff(c.x,1.6,c.z,{vy:0.6,size:1.0,life:1.0,op:0.4,color:0xe0b8ff});
  if(!noise){toast('Um Clone despertou!','warn');}
  addDiary('bio_clone');
}
function sleepClone(c,quiet){
  if(c.state==='sleep'&&quiet)return;
  const was=c.state==='awake';
  c.state='sleep';c.x=c.hx;c.z=c.hz;c.face=c.hf;c.speed=0;c.cap.glass.visible=true;c.cap.col.on=true;
  if(was&&!quiet){SFX.sleep();toast('Os Clones voltaram a dormir.');}
}
function bUpdateClone(c,dt,t){
  const p=G.p,R=c.room,inRoom=p.x>=R.x0&&p.x<=R.x1&&p.z>=R.z0&&p.z<=R.z1&&p.y>-3;
  const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz)||0.001;
  if(c.state==='sleep'){
    c.speed=0;
    if(inRoom&&G.mode==='play'){const noisy=p.run&&p.speed>3;if((noisy&&d<CLONE_WAKE_RUN)||d<CLONE_WAKE_NEAR)wakeClone(c,false);}
  }else if(!inRoom){
    sleepClone(c,false);
  }else{
    const sp=CLONE_SPEED,r=pushOut(bioArea,c.x+dx/d*sp*dt,c.z+dz/d*sp*dt,0,0.55,2.0);c.x=r[0];c.z=r[1];c.speed=sp;
    c.face+=wrapPi(Math.atan2(dx,dz)-c.face)*(1-Math.exp(-6*dt));
    c.puffT-=dt;if(c.puffT<=0){c.puffT=0.5;puff(c.x,2.2,c.z,{vy:0.5,size:0.4,life:0.9,op:0.3,color:0xe0b8ff});}
    if(d<1.2&&G.mode==='play')hurt(1,c.x,c.z,'clone');
  }
  c.group.position.set(c.x,0,c.z);c.group.rotation.y=c.face;animClone(c.rig,t,c.state==='awake',c.speed);
}
function bUpdateRoom(r,dt,t){
  const p=G.p;
  if(r.state==='playing'){
    r.pt+=dt;
    while(r.step<r.pattern.length&&r.pt>=r.step*NODE_STEP){lightNode(r.nodes[r.pattern[r.step]],0.65);r.step++;}
    if(r.step>=r.pattern.length&&r.pt>=r.pattern.length*NODE_STEP+0.3)r.state='idle';
  }
  if(!r.solved&&!r.played&&p.x>=r.x0&&p.x<=r.x1&&p.z<r.zN-6&&p.z>=r.z0&&p.y>-3){r.played=true;playRoom(r,true);}
  for(const n of r.nodes){
    if(n.fail>0)n.fail=Math.max(0,n.fail-dt);
    if(!n.stay&&n.lit>0)n.lit=Math.max(0,n.lit-dt*n.decay);
    const k=n.stay?0.85+Math.sin(t*2+n.idx)*0.08:n.lit;
    if(n.fail>0)n.mat.color.setHex(0xff3a3a);else n.mat.color.copy(n.dim).lerp(n.bright,k);
    n.halo.material.opacity=0.85*k+(n.fail>0?0.4:0);
    const sc=1+0.32*k+Math.sin(t*2+n.idx*1.3)*0.035;n.pg.scale.setScalar(sc);
  }
  if(r.heart){
    const h=r.heart,beat=Math.max(0,Math.sin(t*6.3));
    h.hg.scale.setScalar(1+beat*0.09+(r.state==='playing'?0.08:0));h.halo.material.opacity=0.35+beat*0.25+(r.state==='playing'?0.2:0);
  }
}
function bUpdate(dt,t){
  const p=G.p,H=bio.hints;
  for(const g of bio.gates){
    if(g.latched&&g.open<1){
      g.open=Math.min(1,g.open+dt/2.2);const e=smooth(0,1,g.open);g.fl.position.x=-(1.52+e*3.1);g.fr.position.x=1.52+e*3.1;
      if(g.open>0.55)g.c.on=false;
      if(Math.random()<dt*5)puff((Math.random()-0.5)*5,2+Math.random()*4,g.zc+0.6,{vy:0.5,size:0.9,life:1.2,op:0.3,color:0xffa8e8});
    }
  }
  for(const r of bio.rooms)bUpdateRoom(r,dt,t);
  let awake=false;for(const c of bio.clones){bUpdateClone(c,dt,t);if(c.state==='awake')awake=true;}
  AU.beatGap=awake?0.55:1.0;
  for(const f of bio.flowers){f.glow.material.opacity=f.lit?0.5+Math.sin(t*3+f.z)*0.1:0;f.glow.scale.setScalar(3.2+(f.lit?Math.sin(t*3+f.z)*0.2:0));}
  if(!bio.relicTaken){bio.seed.position.y=2.6+Math.sin(t*2)*0.12;bio.seed.rotation.y=t*0.8;bio.seedGlow.position.y=bio.seed.position.y;bio.seedGlow.material.opacity=0.5+Math.sin(t*3)*0.12;}
  /* névoa de esporos na Sala 2: some com a distância de visão e tinge a tela de lilás */
  const h=clamp((-33.5-p.z)/4,0,1)*clamp((p.z+66.5)/3.5,0,1);
  if(h>0.001||bio.hazeOn){
    bio.hazeOn=h>0.001;
    scene.fog.near=lerp(3,1.2,h);scene.fog.far=lerp(44,12,h);
    scene.fog.color.copy(BASE_FOG).lerp(HAZE_COL,h);if(scene.background&&scene.background.isColor)scene.background.copy(scene.fog.color);
    const op=Math.round(0.5*h*50)/50;
    if(op!==bio.sporeOp){bio.sporeOp=op;$('spore').style.opacity=String(op);}
    if(h>0.4&&Math.random()<dt*2.5)puff(p.x+(Math.random()-0.5)*10,0.6+Math.random()*3,p.z+(Math.random()-0.5)*10-2,{vy:0.2,vx:(Math.random()-0.5)*0.5,size:1.5,life:3,op:0.22,color:0xd0a0ff});
  }
  /* dicas e diário */
  if(p.z<-6)addDiary('bio_enter');
  if(p.z<-12&&p.z>-34&&!H.r1){H.r1=1;toast('Os bulbos cantam uma sequência. Toque-os na mesma ordem. O coração no centro repete a canção.');}
  if(p.z<-35.5&&p.z>-66&&!H.r2){H.r2=1;toast('Os esporos turvam a vista e um Clone dorme na cápsula. Andar devagar o mantém quieto.','warn');addDiary('bio_spores');}
  if(p.z<-67.5&&p.z>-98&&!H.r3){H.r3=1;toast('Duas das oito cápsulas guardam Clones. Errar a canção os acorda.','warn');}
}
function bResetVisit(){
  for(const r of bio.rooms){if(!r.solved){r.state='idle';r.prog=0;r.played=false;r.pt=0;r.step=0;updateDots(r);}for(const n of r.nodes){n.lit=0;n.fail=0;}}
  for(const c of bio.clones)sleepClone(c,true);
  bio.sporeOp=-1;bio.hazeOn=false;AU.beatGap=1;
}
function bReset(){
  for(const f of bio.flowers){f.lit=false;f.lamp.on=false;f.petalMat.color.setHex(0x4a2a66);f.glow.material.opacity=0;}
  for(const g of bio.gates){g.open=0;g.latched=false;g.fl.position.x=-1.52;g.fr.position.x=1.52;g.c.on=true;}
  for(const r of bio.rooms){r.solved=false;r.state='idle';r.prog=0;r.played=false;for(const n of r.nodes)n.stay=false;
    if(r.heart){r.heart.mat.color.setHex(0xff5ab8);r.heart.halo.material.color.setHex(0xff5ab8);}}
  bio.relicTaken=!!G.relics.bio;bio.seed.visible=!bio.relicTaken;bio.seedGlow.visible=!bio.relicTaken;bio.seedLamp.on=!bio.relicTaken;
  bResetVisit();
}
buildBio();
for(const f of bio.flowers)mergeLocalTree(f.g);
bio.merge=mergeStatic(BGR,60);
for(const g of bio.gates)mergeLocalTree(g.g);
for(const r of bio.rooms)if(r.heart)mergeLocalTree(r.heart.hg);
mergeLocalTree(bio.seed);
bioArea.camCeil=7.4;bioArea.camBoundX=7.9;bioArea.update=bUpdate;bioArea.reset=bReset;bioArea.resetVisit=bResetVisit;
