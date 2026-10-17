/* ====================== Cidade-Jardim (Solarpunk) ======================
   A Tumba Final. Sem guardião: a tensão vem das armadilhas e da cidade acordando. A lanterna não gasta (a luz está voltando).
   Salão -> Seção do Ritmo (pistões + placas) -> Seção da Luz (holofotes) -> Seção da Água (válvulas e pontões)
   -> Seção da Sequência (bulbos) -> escada -> terraço (cena final). A cada seção o teto se abre mais para o sol. */
const cityArea=makeArea('city');cityArea.key='final';cityArea.killY=-5;cityArea.metal=false;cityArea.spawn={x:0,y:0,z:5,face:Math.PI};
cityArea.fogColor=0x4a5a4e;cityArea.hemi=[0xe6f4ff,0x6f8f58,0.85];cityArea.lampColor=0xfff2c0;cityArea.ambience='city';
cityArea.drainExtra=()=>-1;   // a lanterna não gasta aqui
const CGR=cityArea.group;CGR.visible=false;scene.add(CGR);TOMB_AREAS.final=cityArea;
const cty={flowers:[],pistons:[],tiles:[],floods:[],sensors:[],gates:[],pontoons:[],slabs:[],done:[false,false,false,false],hints:{},
  W:null,room:null,lvl:0,beamT:0,end:null,pitGlows:[],tree:null,treeGlow:null};
const C_WHITE=M(0xd9d3ba),C_WALL=M(0xcdc6aa),C_GOLD=M(0xcfa63e),C_STONE=M(0xa9a388),C_DARKG=M(0x2c3a30);
const C_STAIRA=M(0xa9a388),C_STAIRB=M(0x9a9479);
const C_LEAFA=M(0x52a24c),C_LEAFB=M(0x80c04e),C_LEAFC=M(0x3f8f58);
const LEAF_MATS=[C_LEAFA,C_LEAFB,C_LEAFC];
const LEAF_DRY=[new THREE.Color(0x8a8a52),new THREE.Color(0x9a9a5a),new THREE.Color(0x6e7a50)],LEAF_LIVE=LEAF_MATS.map(m=>new THREE.Color(m.color.getHex()));
const C_SOLAR=new THREE.MeshToonMaterial({map:solarTex(),gradientMap:GRAD});
const C_GLASS=new THREE.MeshBasicMaterial({color:0xb4ecc0,transparent:true,opacity:0.42,side:THREE.DoubleSide,depthWrite:false});
const SKY_DIM=new THREE.Color(0x4a5a4e),SKY_BRIGHT=new THREE.Color(0xa6dcf6),tmpSky=new THREE.Color();
const SLAB_Z=[[-8,-50],[-50,-82],[-82,-110],[-110,-134],[-134,-162]];
const STAIR_N=20,STAIR_D=1.3,STAIR_H=0.4,STAIR_Z0=-136;

function cbox(x0,x1,z0,z1,y0,y1,mat,col){const m=mesh(GEO.box(x1-x0,y1-y0,z1-z0),mat,(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,CGR);if(col!==false)colBox(cityArea,x0,x1,z0,z1,y0,y1);return m;}
function cTiled(x0,x1,z0,z1,y,mat,tile){
  const w=x1-x0,d=z1-z0,g=new THREE.PlaneGeometry(w,d),uv=g.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*w/tile,uv.getY(i)*d/tile);
  const m=mesh(g,mat,(x0+x1)/2,y,(z0+z1)/2,CGR);m.rotation.x=-Math.PI/2;return m;
}
function cityFloorTex(){const t=canvasTex(128,128,(g,w,h)=>{
  const r=rng(33);g.fillStyle='#bfb894';g.fillRect(0,0,w,h);
  g.strokeStyle='rgba(150,140,100,0.55)';g.lineWidth=2;g.strokeRect(1,1,w-2,h-2);g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke();
  for(let i=0;i<26;i++){const x=r()*w,y=r()*h,rad=4+r()*10;g.fillStyle='rgba(96,160,72,0.32)';for(const[ox,oy]of[[0,0],[w,0],[-w,0],[0,h],[0,-h]]){g.beginPath();g.arc(x+ox,y+oy,rad,0,TAU);g.fill();}}
  g.fillStyle='rgba(216,176,74,0.6)';g.fillRect(w/2-3,h/2-3,6,6);
});t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
function solarTex(){return canvasTex(128,128,(g,w,h)=>{g.fillStyle='#1c3a6a';g.fillRect(0,0,w,h);g.strokeStyle='#9ec4ff';g.lineWidth=2;for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*w/4,0);g.lineTo(i*w/4,h);g.moveTo(0,i*h/4);g.lineTo(w,i*h/4);g.stroke();}g.strokeStyle='#d8b04a';g.lineWidth=5;g.strokeRect(2,2,w-4,h-4);});}
function petalTex(){return canvasTex(128,256,(g,w,h)=>{
  g.fillStyle='#efe6c4';g.fillRect(0,0,w,h);const r=rng(9);
  for(let i=0;i<22;i++){g.fillStyle='rgba(120,180,90,'+(0.12+r()*0.15)+')';g.beginPath();g.arc(r()*w,r()*h,8+r()*20,0,TAU);g.fill();}
  g.strokeStyle='rgba(76,150,70,0.85)';g.lineWidth=3;
  for(let k=0;k<5;k++){let x=w/2+(k-2)*22,y=h;g.beginPath();g.moveTo(x,y);for(let s=0;s<8;s++){x+=(r()-0.5)*14;y-=h/8;g.lineTo(x,y);}g.stroke();}
  g.strokeStyle='#d8b04a';g.lineWidth=5;g.strokeRect(3,3,w-6,h-6);
});}

function cCross(zc,half){
  cbox(-9.8,-half,zc-0.4,zc+0.4,-12,10,C_WALL);cbox(half,9.8,zc-0.4,zc+0.4,-12,10,C_WALL);cbox(-half,half,zc-0.4,zc+0.4,7.4,10,C_WALL,false);
  for(const s of[-1,1])for(const dz of[-0.6,0.6]){outline(mesh(GEO.cyl(0.3,0.36,7.6,10),C_WHITE,s*(half+0.6),3.8,zc+dz,CGR),1.04);colCyl(cityArea,s*(half+0.6),zc+dz,0.36,-2,7.6);mesh(GEO.tor(0.36,0.05,5,12),C_GOLD,s*(half+0.6),7.3,zc+dz,CGR).rotation.x=Math.PI/2;mesh(GEO.tor(0.36,0.05,5,12),C_GOLD,s*(half+0.6),0.5,zc+dz,CGR).rotation.x=Math.PI/2;}
  mesh(GEO.box(half*2+1.4,0.25,1.4),C_GOLD,0,7.3,zc,CGR);
}
function cGate(zc){
  const g=new THREE.Group();g.position.set(0,0,zc);CGR.add(g);g.userData.dyn=true;
  const mat=new THREE.MeshToonMaterial({map:petalTex(),gradientMap:GRAD});
  const fl=new THREE.Group(),fr=new THREE.Group();fl.position.x=-1.52;fr.position.x=1.52;g.add(fl);g.add(fr);
  mesh(GEO.box(3.05,7.4,0.3),mat,0,3.7,0,fl);mesh(GEO.box(3.05,7.4,0.3),mat,0,3.7,0,fr);
  const c=colBox(cityArea,-3,3,zc-0.3,zc+0.3,-12,8);
  const eye=mesh(new THREE.PlaneGeometry(1.4,1.4),new THREE.MeshBasicMaterial({map:eyeTexture('#d8a020'),transparent:true,depthWrite:false}),0,8.0,zc+0.43,CGR);
  const o={g,fl,fr,c,open:0,latched:false,zc};cty.gates.push(o);return o;
}
function cDots(r,zc,n){
  const cv=document.createElement('canvas');cv.width=256;cv.height=48;const tx=new THREE.CanvasTexture(cv);
  const pl=mesh(new THREE.PlaneGeometry(4,0.75),new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false}),0,6.9,zc+0.43,CGR);pl.userData.dyn=true;
  r.dotsCv=cv;r.dotsTx=tx;r.dotsN=n;updateDots(r);
}
function cNode(r,idx,x,z){
  outline(mesh(GEO.cyl(0.75,0.95,0.35,10),C_WHITE,x,0.17,z,CGR),1.05);
  mesh(GEO.cyl(0.14,0.26,1.25,8),C_STONE,x,0.9,z,CGR);
  for(let k=0;k<4;k++){const a=k*TAU/4+idx;const l=mesh(GEO.cone(0.2,0.9,5),C_LEAFA,x+Math.cos(a)*0.38,1.55,z+Math.sin(a)*0.38,CGR);l.rotation.z=-Math.cos(a)*0.55;l.rotation.x=Math.sin(a)*0.55;}
  const pg=new THREE.Group();pg.position.set(x,1.95,z);CGR.add(pg);pg.userData.dyn=true;
  const mat=BASICU(BDIM[idx]);mesh(GEO.sph(0.5,12,9),mat,0,0,0,pg);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:BCOL[idx],blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));halo.scale.set(3.4,3.4,1);pg.add(halo);
  colCyl(cityArea,x,z,0.55,-2,1.9);
  const n={idx,x,z,pg,mat,halo,lit:0,decay:1.6,stay:false,fail:0,dim:new THREE.Color(BDIM[idx]),bright:new THREE.Color(BCOL[idx])};
  cityArea.interact.push({x,z,r:2.3,label:()=>(r.solved||r.state==='playing')?null:'Tocar o bulbo',use:()=>cPress(r,n)});
  r.nodes.push(n);return n;
}
function cSource(r,x,z){
  outline(mesh(GEO.cyl(0.7,1.0,0.9,10),C_WHITE,x,0.45,z,CGR),1.04);
  for(let k=0;k<5;k++){const a=k*TAU/5,v=mesh(GEO.cyl(0.07,0.12,1.3,6),C_GOLD,x+Math.cos(a)*0.55,0.65,z+Math.sin(a)*0.55,CGR);v.rotation.z=Math.cos(a)*0.4;v.rotation.x=-Math.sin(a)*0.4;}
  colCyl(cityArea,x,z,0.95,-2,3.2);
  const hg=new THREE.Group();hg.position.set(x,1.7,z);CGR.add(hg);hg.userData.dyn=true;
  const mat=BASICU(0xffd24a);mesh(GEO.sph(0.55,12,9),mat,0,0,0,hg).scale.set(1,1.1,0.95);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xffd24a,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.45}));halo.scale.set(3.2,3.2,1);hg.add(halo);
  r.heart={hg,mat,halo};
  cityArea.interact.push({x,z,r:2.6,label:()=>(r.solved||r.state==='playing')?null:'Ouvir a sequência',use:()=>playRoom(r,false)});
}
function cPress(r,n){
  if(r.solved||r.state==='playing'){SFX.deny();return;}
  if(n.idx===r.pattern[r.prog]){
    lightNode(n,0.55);r.prog++;updateDots(r);
    if(r.prog>=r.pattern.length){
      r.solved=true;r.state='solved';updateDots(r);for(const m of r.nodes)m.stay=true;r.gate.latched=true;
      r.heart.mat.color.setHex(0x8aff6a);r.heart.halo.material.color.setHex(0x8aff6a);
      SFX.bioChime();SFX.membrane();toast('A canção se completa. A última porta se abre...','good');cSectionDone(3);
    }
  }else{
    n.fail=0.5;r.prog=0;updateDots(r);SFX.bioFail();toast('Sequência errada. Toque o coração para ouvir de novo.','warn');
  }
}
function cFlower(x,z){
  const g=new THREE.Group();g.position.set(x,0,z);CGR.add(g);g.userData.dyn=true;
  const petalMat=BASICU(0x7a8a58);
  mesh(GEO.cyl(0.08,0.14,1.5,6),C_LEAFC,0,0.75,0,g);
  for(const[lx,lz]of[[0.5,0.1],[-0.45,-0.2]]){const lf=mesh(GEO.cone(0.18,0.7,5),C_LEAFC,lx,0.5,lz,g);lf.rotation.z=-Math.sign(lx)*1.0;}
  for(let k=0;k<6;k++){const a=k*TAU/6,pt=mesh(GEO.cone(0.22,0.85,5),petalMat,Math.cos(a)*0.34,1.65,Math.sin(a)*0.34,g);pt.rotation.z=-Math.cos(a)*0.85;pt.rotation.x=Math.sin(a)*0.85;}
  mesh(GEO.sph(0.24,8,6),petalMat,0,1.62,0,g);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xffd24a,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));glow.scale.set(3.4,3.4,1);glow.position.y=1.7;g.add(glow);
  colCyl(cityArea,x,z,0.65,-2,2.2);
  const o={x,z,g,petalMat,glow,lit:false,lamp:{x,y:2.0,z,on:false}};cty.flowers.push(o);cityArea.lamps.push(o.lamp);
  cityArea.interact.push({x,z,r:2.6,label:()=>o.lit?TXT.pointLabelCity:'Tocar a flor de luz',use:()=>useCityFlower(o)});
  return o;
}
function useCityFlower(o){
  const first=!o.lit;usePowerPoint(o.x+(o.x<0?1.9:-1.9),o.z,first,'Flor de luz acesa. Ponto de controle salvo.');if(!first)return;
  o.lit=true;o.lamp.on=true;o.petalMat.color.setHex(0xffd24a);o.glow.material.opacity=0.55;
  for(let i=0;i<3;i++)puff(o.x,2.2,o.z,{vy:1.0,size:0.6,life:1.4,color:0xfff0a0});
}
function cStation(parent,lx,ly,lz,wx,wz,W,spread,solid){
  for(const[dx,type]of[[-spread/2,'up'],[spread/2,'down']]){
    aValve(parent,lx+dx,ly,lz,type);
    if(solid)colCyl(cityArea,wx+dx,wz,0.5,ly-2,ly+2.4);
    cityArea.interact.push({x:wx+dx,z:wz,r:1.8,label:()=>valveLabel(type,W),use:()=>useValve(type,W)});
  }
}
function cPontoon(W,cx,cz,w,d){
  const g=new THREE.Group();g.position.set(cx,0,cz);CGR.add(g);g.userData.dyn=true;
  outline(mesh(GEO.box(w,0.8,d),C_WHITE,0,-0.34,0,g),1.02);
  mesh(GEO.box(w+0.1,0.06,d+0.1),C_GOLD,0,0.03,0,g);
  for(const sx of[-w/2+0.4,w/2-0.4])mesh(GEO.sph(0.12,6,5),BASIC(0x8aff6a),sx,0.12,d/2-0.3,g);
  const c=colBox(cityArea,cx-w/2,cx+w/2,cz-d/2,cz+d/2,-0.8,0.06);
  const o={g,c,W,cx,cz};cty.pontoons.push(o);
  cStation(g,0,0.06,0,cx,cz,W,3.0,false);
  return o;
}
function cFlood(x,z,step0){
  const g=new THREE.Group();g.position.set(x,0,z);CGR.add(g);g.userData.dyn=true;
  outline(mesh(GEO.cyl(0.5,0.6,0.55,12),C_WHITE,0,0.28,0,g),1.04);mesh(GEO.tor(0.52,0.04,5,14),C_GOLD,0,0.5,0,g).rotation.x=Math.PI/2;
  outline(mesh(GEO.box(0.2,0.7,0.2),C_STONE,0,0.85,0,g),1.04);
  const head=new THREE.Group();head.position.set(0,1.35,0);g.add(head);
  const hs=mesh(GEO.cyl(0.34,0.4,0.7,12),C_GOLD,0,0,0.1,head);hs.rotation.x=Math.PI/2;outline(hs,1.05);
  mesh(GEO.tor(0.36,0.04,6,14),C_WHITE,0,0,0.45,head);
  const lens=mesh(GEO.cyl(0.31,0.31,0.05,12),BASIC(0xfff6c0),0,0,0.47,head);lens.rotation.x=Math.PI/2;
  const beam=new THREE.Mesh(beamGeo(2.6,0.14),beamMat(0xfff0a0,0.24));beam.position.z=0.5;beam.frustumCulled=false;beam.userData.keep=true;head.add(beam);
  colCyl(cityArea,x,z,0.55,-0.5,1.6);
  const fl={g,head,beam,x,z,hy:1.35,step:step0,step0,cur:step0*Math.PI/4,settled:true};
  head.rotation.y=Math.PI-fl.cur;cty.floods.push(fl);
  cityArea.interact.push({x,z,r:2.4,label:()=>'Girar o holofote',use:()=>{fl.step=(fl.step+1)%8;fl.settled=false;SFX.rotate();}});
  return fl;
}
function cSensor(x,y,z,faceX,fl){
  const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=faceX>0?Math.PI/2:-Math.PI/2;CGR.add(g);g.userData.dyn=true;
  outline(mesh(GEO.box(0.9,0.9,0.16),C_WHITE,0,0,0,g),1.04);
  mesh(GEO.tor(0.3,0.04,6,16),C_GOLD,0,0,0.1,g);
  const lensMat=new THREE.MeshBasicMaterial({color:0x6a3a10});const lens=mesh(GEO.cyl(0.26,0.26,0.06,14),lensMat,0,0,0.12,g);lens.rotation.x=Math.PI/2;
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xb8ff8a,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.8}));glow.scale.set(2.6,2.6,1);glow.position.z=0.3;glow.visible=false;g.add(glow);
  const idle=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xff9a40,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.5}));idle.scale.set(2.2,2.2,1);idle.position.z=0.3;g.add(idle);
  const s={x:x+(faceX>0?0.1:-0.1),y,z,mat:lensMat,glow,idle,lit:false,fl,g};cty.sensors.push(s);return s;
}
function cSlabs(){
  SLAB_Z.forEach(([za,zb],k)=>{
    const len=Math.abs(zb-za)-0.3,zc=(za+zb)/2,pair={k,open:0};
    for(const s of[-1,1]){
      const gp=new THREE.Group();gp.position.set(s*9.8,9.4,zc);CGR.add(gp);gp.userData.dyn=true;
      mesh(GEO.box(9.9,0.2,len),C_GLASS,-s*4.95,0,0,gp).renderOrder=3;
      pair[s<0?'gl':'gr']=gp;
    }
    cty.slabs.push(pair);
  });
}
function cWallDecor(){
  const rg=rng(41),crosses=[-8,-50,-82,-110,-134],solar=C_SOLAR;
  const blossoms=[BASIC(0xff9ec8),BASIC(0xffe27a),BASIC(0xffffff)];
  for(const s of[-1,1])for(let z=3;z>-133;z-=6){
    if(crosses.some(c=>Math.abs(z-c)<1.7))continue;
    const x=s*8.55,n=3+Math.floor(rg()*3);
    for(let k=0;k<n;k++){
      const y=0.8+rg()*6.2,r=0.5+rg()*0.7,m=mesh(GEO.sph(r,7,5),LEAF_MATS[Math.floor(rg()*3)],x-s*(rg()*0.3),y,z+(rg()-0.5)*3,CGR);m.scale.set(0.7,1,1.1);
    }
    mesh(GEO.cyl(0.04,0.04,6.4,5),C_LEAFC,x-s*0.1,3.4,z,CGR);
    for(let k=0;k<4;k++)mesh(GEO.sph(0.14,6,5),blossoms[k%3],x-s*0.5,1+rg()*5.4,z+(rg()-0.5)*2.4,CGR);
  }
  for(const s of[-1,1])for(let z=0;z>-132;z-=6){
    if(crosses.some(c=>Math.abs(z-c)<2.4))continue;
    const pn=mesh(GEO.box(0.12,2.4,3.6),solar,s*8.92,5.4,z,CGR);pn.rotation.z=s*0.18;
  }
}
function cStairs(){
  for(let i=0;i<STAIR_N;i++){
    const z1=STAIR_Z0-STAIR_D*i,z0=z1-STAIR_D,top=STAIR_H*(i+1);
    cbox(-9,9,z0,z1,-1,top,i%2?C_STAIRA:C_STAIRB);
    mesh(GEO.box(18.05,0.06,0.1),C_GOLD,0,top+0.03,z1-0.05,CGR);
  }
}
function cTerrace(){
  const top=8,zc=-171.5;
  const mark=mesh(new THREE.PlaneGeometry(14,14),new THREE.MeshBasicMaterial({map:eyeTexture('#d8a020'),transparent:true,opacity:0.7,depthWrite:false}),0,top+0.03,zc,CGR);mark.rotation.x=-Math.PI/2;
  /* árvore-matriz: tronco claro, copa verde e frutos dourados */
  const tr=new THREE.Group();tr.position.set(0,top,zc-1);CGR.add(tr);
  outline(mesh(GEO.cyl(0.9,1.5,6.5,10),C_WHITE,0,3.2,0,tr),1.04);
  for(let k=0;k<5;k++){const a=k*TAU/5,b=mesh(GEO.cyl(0.25,0.5,3.6,6),C_WHITE,Math.cos(a)*1.4,6.6,Math.sin(a)*1.4,tr);b.rotation.z=-Math.cos(a)*0.8;b.rotation.x=Math.sin(a)*0.8;}
  for(let k=0;k<9;k++){const a=k*TAU/9,r=k?3.4:0,y=k?9+Math.sin(k)*0.8:11.5,c=mesh(GEO.sph(k?2.4:3.2,9,7),LEAF_MATS[k%3],Math.cos(a)*r,y,Math.sin(a)*r,tr);c.scale.y=0.8;}
  for(let k=0;k<14;k++){const a=k*2.4,r=2.4+(k%3)*0.8;mesh(GEO.sph(0.22,6,5),BASIC(0xffd24a),Math.cos(a)*r,8+(k%5)*0.9,Math.sin(a)*r,tr);}
  colCyl(cityArea,0,zc-1,1.6,top-2,top+14);
  cty.tree=tr;
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xfff0a0,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.35}));gl.scale.set(18,18,1);gl.position.set(0,top+10,zc-1);CGR.add(gl);cty.treeGlow=gl;
  for(let k=0;k<6;k++){const a=k*TAU/6+0.3,pn=new THREE.Mesh(GEO.box(2.6,0.1,1.6),C_SOLAR);
    pn.position.set(Math.cos(a)*6,top+0.9,zc-1+Math.sin(a)*6);pn.rotation.set(-0.5,-a,0);CGR.add(pn);}
  for(const s of[-1,1])for(let z=-166;z>-180;z-=4){outline(mesh(GEO.box(1.4,1.0,1.4),C_WHITE,s*8.2,top+0.5,z,CGR),1.04);mesh(GEO.sph(0.8,7,5),LEAF_MATS[(z>>2)&1],s*8.2,top+1.5,z,CGR);colBox(cityArea,s*8.2-0.7,s*8.2+0.7,z-0.7,z+0.7,top-1,top+1);}
}

function buildCity(){
  const FLR=new THREE.MeshToonMaterial({map:cityFloorTex(),gradientMap:GRAD}),BASE=M(0xb9b295);
  /* pisos */
  cbox(-9,9,-10,8.8,-1,0,BASE);cbox(-9,9,-32,-26,-1,0,BASE);cbox(-9,9,-87,-44,-1,0,BASE);cbox(-9,9,-136,-101.8,-1,0,BASE);cbox(-9,9,-181,-162,7,8,BASE);
  cTiled(-9,9,-10,8.8,0.012,FLR,6);cTiled(-9,9,-32,-26,0.012,FLR,6);cTiled(-9,9,-87,-44,0.012,FLR,6);cTiled(-9,9,-136,-101.8,0.012,FLR,6);cTiled(-9,9,-181,-162,8.012,FLR,6);
  /* paredes e teto fixo do salão */
  cbox(-9.8,-9,-134,9.6,-12,10,C_WALL);cbox(9,9.8,-134,9.6,-12,10,C_WALL);cbox(-9.8,9.8,8.8,9.6,-12,10,C_WALL);
  cbox(-9.8,-9,-181.8,-134,-12,22,C_WALL);cbox(9,9.8,-181.8,-134,-12,22,C_WALL);cbox(-9.8,9.8,-181.8,-181,-12,22,C_WALL);
  mesh(GEO.box(19.6,0.2,17.6),C_GLASS,0,9.4,0.8,CGR).renderOrder=3;
  for(let z=6;z>-162;z-=4)mesh(GEO.box(19.6,0.3,0.3),C_GOLD,0,9.3,z,CGR);
  for(const z of[-8,-50,-82,-110,-134])cCross(z,3);
  cWallDecor();cSlabs();cStairs();cTerrace();
  /* salão: olho dourado no chão e a saída para o Vale */
  const mark=mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshBasicMaterial({map:eyeTexture('#d8a020'),transparent:true,opacity:0.85,depthWrite:false}),0,0.03,0,CGR);mark.rotation.x=-Math.PI/2;
  for(const s of[-1,1])outline(mesh(GEO.cyl(0.4,0.5,6.4,10),C_WHITE,s*3,3.2,8.4,CGR),1.04);outline(mesh(GEO.box(7,0.9,0.9),C_GOLD,0,6.2,8.4,CGR),1.04);
  mesh(GEO.box(5.2,5.4,0.2),BASIC(0xb4ecc0,{transparent:true,opacity:0.5}),0,2.7,8.6,CGR);
  mesh(new THREE.PlaneGeometry(1.6,1.6),new THREE.MeshBasicMaterial({map:eyeTexture('#d8a020'),transparent:true,depthWrite:false}),0,6.2,7.9,CGR);
  cityArea.interact.push({x:0,z:6.9,r:2.7,label:()=>'Sair para o Vale',use:()=>exitTomb(false)});
  cFlower(-5.2,-3.5);cFlower(-6,-29);cFlower(-6.5,-52.5);cFlower(-6,-84.5);cFlower(-6.5,-112.5);

  /* SEÇÃO 1 — Ritmo: pistões sobre o fosso e depois placas que cedem (só as do olho aguentam) */
  const pit=mesh(new THREE.PlaneGeometry(18,34),BASIC(0x10281a),0,-5.5,-27,CGR);pit.rotation.x=-Math.PI/2;
  const pg=mesh(new THREE.PlaneGeometry(16,32),BASIC(0xffd24a,{transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false}),0,-5.4,-27,CGR);pg.rotation.x=-Math.PI/2;cty.pitGlows.push(pg);
  [-12,-16,-20,-24].forEach((zc,i)=>{
    const g=new THREE.Group();g.position.set(0,0,zc);CGR.add(g);g.userData.dyn=true;
    outline(mesh(GEO.box(6,3.4,2.6),C_WHITE,0,-1.7,0,g),1.02);mesh(GEO.box(6.2,0.18,2.8),C_GOLD,0,-0.09,0,g);
    for(const sx of[-2.4,0,2.4])mesh(GEO.cyl(0.14,0.14,0.08,8),C_STONE,sx,0.04,0.9,g);
    const lamp=mesh(GEO.box(0.7,0.1,0.7),BASICU(0xffd24a),0,0.05,0,g);
    const c=colBox(cityArea,-3,3,zc-1.3,zc+1.3,-3.4,0);
    cty.pistons.push({g,c,lamp,zc,i,last:0});
  });
  const SAFE=[[0,2],[1,2],[1,3],[2,3],[3,3],[3,2],[4,2]];
  const eyeT=eyeTexture('#d8a020'),gearT=gearTexture('#7a9a62','#243a2a');
  const matSafe=new THREE.MeshBasicMaterial({map:eyeT,transparent:true}),matBad=new THREE.MeshToonMaterial({map:gearT,gradientMap:GRAD});
  const tileSafe=new THREE.MeshToonMaterial({color:0xe8e0b8,gradientMap:GRAD});
  for(let r=0;r<5;r++)for(let c=0;c<5;c++){
    const safe=SAFE.some(s=>s[0]===r&&s[1]===c),x=(c-2)*2.4,z=-32-2.4*(r+0.5),g=new THREE.Group();g.position.set(x,0,z);CGR.add(g);g.userData.dyn=true;
    mesh(GEO.box(2.3,0.4,2.3),safe?tileSafe:matBad,0,-0.2,0,g);
    if(safe){const d=mesh(new THREE.PlaneGeometry(1.9,1.9),matSafe,0,0.012,0,g);d.rotation.x=-Math.PI/2;}
    const col=colBox(cityArea,x-1.15,x+1.15,z-1.15,z+1.15,-0.4,0);
    cty.tiles.push({g,c:col,x,z,safe,state:'ok',stand:0,timer:0,vy:0});
  }
  /* SEÇÃO 2 — Luz: dois holofotes e dois sensores nas paredes; os fachos se cruzam no meio */
  const gA=cGate(-82);
  const fA=cFlood(-6,-58,0),fB=cFlood(6,-58,0);
  cSensor(8.9,2.2,-72.9,-1,fA);cSensor(-8.9,2.2,-72.9,1,fB);

  /* SEÇÃO 3 — Água: sobe e desce o nível para levar os pontões por cima da ilha */
  const W=cty.W={level:0,target:0,min:0,max:2,step:2,speed:1.0,moving:false,always:true};
  const wm=new THREE.MeshBasicMaterial({color:0x3ad6b0,transparent:true,opacity:0.6,depthWrite:false,side:THREE.DoubleSide});
  const wp=mesh(new THREE.PlaneGeometry(18,14.8),wm,0,0,-94.4,CGR);wp.rotation.x=-Math.PI/2;wp.userData.dyn=true;wp.renderOrder=2;W.mesh=wp;W.mat=wm;
  const pit3=mesh(new THREE.PlaneGeometry(18,14.8),BASIC(0x0c2a1c),0,-5.5,-94.4,CGR);pit3.rotation.x=-Math.PI/2;
  cbox(-9,9,-96.4,-92.4,-6,2,C_STONE);mesh(GEO.box(18.05,0.12,4.05),C_GOLD,0,2.04,-94.4,CGR);
  for(const s of[-1,1])for(const dz of[-93.2,-95.6]){mesh(GEO.sph(0.7,7,5),LEAF_MATS[(dz<-94)?1:0],s*6,2.5,dz,CGR);}
  cityArea.water=[{x0:-9,x1:9,z0:-101.8,z1:-87}];
  cPontoon(W,0,-89.7,6,3);cPontoon(W,0,-99.1,6,3);
  cStation(CGR,4.5,0,-84.5,4.5,-84.5,W,3.0,true);cStation(CGR,4.5,0,-104,4.5,-104,W,3.0,true);

  /* SEÇÃO 4 — Sequência: cinco passos para a última porta */
  const gB=cGate(-134);
  const room=cty.room={id:3,zN:-110,x0:-9,x1:9,z0:-134,z1:-110,nodes:[],pattern:[1,3,0,2,3],state:'idle',prog:0,solved:false,played:false,pt:0,step:0,gate:gB};
  for(let i=0;i<4;i++)cNode(room,i,-6+i*4,-122);
  cSource(room,4,-114.5);cDots(room,-134,5);
  gA.sensorsNeeded=2;cty.gA=gA;cty.gB=gB;
}

/* ---------- lógica ---------- */
function cEvalSensors(){
  for(const s of cty.sensors){
    const fl=s.fl;let lit=false;
    if(fl.settled){
      const dx=s.x-fl.x,dz=s.z-fl.z,d=Math.hypot(dx,dz);
      if(d>1&&d<46&&Math.abs(wrapPi(Math.atan2(dx,-dz)-fl.cur))<0.07){
        const ux=dx/d,uz=dz/d,f=rayBlock(cityArea,fl.x+ux*0.95,fl.hy,fl.z+uz*0.95,s.x,fl.hy,s.z);
        if(f>=0.985)lit=true;
      }
    }
    if(lit&&!s.lit)SFX.sensor();
    s.lit=lit;s.mat.color.setHex(lit?0xb8ff8a:0x6a3a10);s.glow.visible=lit;s.idle.visible=!lit;
  }
}
function cBeamLen(fl){
  const dx=Math.sin(fl.cur),dz=-Math.cos(fl.cur);
  const f=rayBlock(cityArea,fl.x+dx*0.95,fl.hy,fl.z+dz*0.95,fl.x+dx*45,fl.hy,fl.z+dz*45);
  const L=Math.max(1.5,45*f-0.3);fl.beam.scale.set(L/45,L/45,L);
}
function cSectionDone(i){
  if(cty.done[i])return;cty.done[i]=true;
  const msg=['Seção do Ritmo concluída. O teto da cidade começa a se abrir.','Seção da Luz concluída. A cidade desperta mais um pouco.','Seção da Água concluída. A água corre de novo pelos canais.','Seção da Sequência concluída. O teto se abre por completo. Suba a escada.'][i];
  setTimeout(()=>{if(G.area===cityArea)toast(msg,'good');},i===3?1400:300);
  SFX.bioChime();addDiary(['city_rhythm','city_light','city_water','city_seq'][i],true);
}
function cityLevel(){return cty.done.filter(Boolean).length/4;}

const CT_LINES=[[2,'A civilização do vale avançou do vapor à engenharia genética.'],[8,'Em cada era, buscou mais poder, e abandonou a cidade em harmonia com a natureza que deu origem a tudo.'],[15,'Ela esperou por você.']];
function beginEnding(){
  G.mode='ending';G.lanternOn=false;clearPress();
  document.body.classList.add('cine');
  camera.far=420;camera.updateProjectionMatrix();
  cty.end={t:0,ct:0,line:-1,c0:camera.position.clone(),skip:false};
  const el=$('endTxt');el.hidden=false;$('endLine').textContent='';
  addDiary('city_end',true);SFX.relic();
}
function cityEndingCamera(dt){
  const e=cty.end;if(!e)return;
  const u=smooth(0,1,clamp(e.ct/17,0,1)),p=G.p,a=e.ct*0.05;
  camera.position.set(lerp(e.c0.x,14+Math.sin(a)*5,u),lerp(e.c0.y,64,u),lerp(e.c0.z,-66,u));
  camera.lookAt(lerp(p.x,0,u),lerp(p.y+1.4,6,u),lerp(p.z,-146,u));
  if(cty.ground)cty.ground.visible=true;
  scene.fog.near=60;scene.fog.far=380;
}
function cEndingTick(dt){
  const e=cty.end;if(!e)return;e.t+=dt;e.ct+=dt;
  if(take('use')||take('jump'))e.skip=true;
  if(e.skip){e.skip=false;if(G.mode==='ending'&&e.t>1.2){const nx=CT_LINES.map(l=>l[0]).concat([21]).find(x=>x>e.t+0.01);e.t=nx;}}
  let idx=-1;for(let i=0;i<CT_LINES.length;i++)if(e.t>=CT_LINES[i][0])idx=i;
  if(idx!==e.line&&G.mode==='ending'){e.line=idx;const l=$('endLine');if(idx>=0){l.textContent=CT_LINES[idx][1];l.classList.remove('show');void l.offsetWidth;l.classList.add('show');}}
  if(e.t>=21&&G.mode==='ending'){
    G.mode='end';G.finished=true;writeSave(false);$('endTxt').hidden=true;showScreen('scEnd');focusFirst('scEnd');
  }
}
function cUpdate(dt,t){
  const p=G.p,H=cty.hints;
  /* pistões em ritmo */
  cty.pistons.forEach((o,i)=>{
    const ph=(((t-i*0.9)%PIST_P)+PIST_P)%PIST_P/PIST_P;let top;
    if(ph<0.58)top=0;else if(ph<0.72)top=-3.2*smooth(0.58,0.72,ph);else if(ph<0.88)top=-3.2;else top=-3.2*(1-smooth(0.88,1,ph));
    const warn=ph>0.44&&ph<0.58;
    const wasOn=o.c.on;o.g.position.y=top;o.c.y1=top;o.c.y0=top-3.4;o.c.on=top>-0.5;
    if(wasOn&&!o.c.on&&p.x>=o.c.x0-0.3&&p.x<=o.c.x1+0.3&&p.z>=o.c.z0-0.3&&p.z<=o.c.z1+0.3)G.cause={k:'piston',t:G.t};
    o.lamp.material.color.setHex(warn?(Math.sin(t*26)>0?0xff5a30:0x802010):0xffd24a);
    if(Math.abs(p.z-o.zc)<14){if(ph>0.58&&o.last<=0.58&&Math.abs(p.z-o.zc)<10)SFX.piston();}
    o.last=ph;
  });
  /* placas que cedem */
  for(const tl of cty.tiles){
    if(tl.safe)continue;
    if(tl.state==='ok'){const on=p.grounded&&p.y>-0.1&&Math.abs(p.x-tl.x)<1.15&&Math.abs(p.z-tl.z)<1.15;
      if(on){tl.stand+=dt;if(tl.stand>0.3){tl.state='crack';tl.timer=0.55;SFX.crack();G.cause={k:'tile',t:G.t};}}else tl.stand=Math.max(0,tl.stand-dt*2);}
    else if(tl.state==='crack'){tl.timer-=dt;tl.g.position.x=tl.x+(Math.random()-0.5)*0.07;if(tl.timer<=0){tl.state='fall';tl.vy=0;tl.c.on=false;tl.g.position.x=tl.x;}}
    else if(tl.state==='fall'){tl.vy-=22*dt;tl.g.position.y+=tl.vy*dt;tl.g.rotation.x+=dt*2.4;if(tl.g.position.y<-8){tl.g.visible=false;tl.state='gone';tl.timer=9;}}
    else{tl.timer-=dt;if(tl.timer<=0){tl.state='ok';tl.g.visible=true;tl.g.position.set(tl.x,0,tl.z);tl.g.rotation.set(0,0,0);tl.c.on=true;tl.stand=0;}}
  }
  /* holofotes e sensores */
  for(const fl of cty.floods){
    const tb=fl.step*Math.PI/4,d=wrapPi(tb-fl.cur);
    if(Math.abs(d)>0.0005)fl.cur=wrapPi(fl.cur+clamp(d,-3.4*dt,3.4*dt));
    fl.settled=Math.abs(wrapPi(tb-fl.cur))<0.02;fl.head.rotation.y=Math.PI-fl.cur;
  }
  cty.beamT-=dt;if(cty.beamT<=0){cty.beamT=0.2;for(const fl of cty.floods)cBeamLen(fl);}
  cEvalSensors();
  if(cty.sensors.every(s=>s.lit)&&!cty.gA.latched){cty.gA.latched=true;SFX.gate();toast('Os dois fachos acenderam os sensores. A porta de pétalas se abre...','good');cSectionDone(1);}
  /* água e pontões */
  const W=cty.W,dw=W.target-W.level;
  if(Math.abs(dw)>1e-4){W.level+=clamp(dw,-W.speed*dt,W.speed*dt);W.moving=true;SFX.pump();}else{W.level=W.target;W.moving=false;}
  W.mesh.position.y=W.level+0.03;W.mat.opacity=0.55+Math.sin(t*2)*0.05;
  for(const o of cty.pontoons){const L=W.level;o.g.position.y=L;o.c.y1=L+0.06;o.c.y0=o.c.y1-0.8;}
  /* portas de pétalas */
  for(const g of cty.gates){
    if(g.latched&&g.open<1){
      if(g.open===0)SFX.membrane();
      g.open=Math.min(1,g.open+dt/2.2);const e=smooth(0,1,g.open);g.fl.position.x=-(1.52+e*3.1);g.fr.position.x=1.52+e*3.1;
      if(g.open>0.55)g.c.on=false;
      if(Math.random()<dt*5)puff((Math.random()-0.5)*5,2+Math.random()*4,g.zc+0.6,{vy:0.5,size:0.9,life:1.2,op:0.3,color:0xfff0a0});
    }
  }
  /* sequência */
  bUpdateRoom(cty.room,dt,t);
  /* seções concluídas ao cruzar o fim de cada uma */
  if(p.y>-0.3&&G.mode==='play'){if(p.z<-46)cSectionDone(0);if(p.z<-103)cSectionDone(2);}
  /* o teto se abre, as plantas revivem e o sol cresce com o progresso */
  const target=cityLevel();cty.lvl+=(target-cty.lvl)*(1-Math.exp(-1.2*dt));
  const lv=cty.lvl;
  for(const s of cty.slabs){
    const tg=cty.done[Math.min(s.k,3)]?1:0;s.open+=clamp(tg-s.open,-dt*0.35,dt*0.35);
    const a=smooth(0,1,s.open)*1.4;s.gl.rotation.z=a;s.gr.rotation.z=-a;
  }
  for(let i=0;i<3;i++)LEAF_MATS[i].color.copy(LEAF_DRY[i]).lerp(LEAF_LIVE[i],smooth(0,1,lv));
  sun.color.setHex(0xfff2d0);sun.position.set(30,80,40);sun.intensity=0.18+0.34*lv;
  hemi.color.setHex(0xe6f4ff);hemi.groundColor.setHex(0x6f8f58);hemi.intensity=0.46+0.14*lv;
  const cine=cty.end&&(G.mode==='ending'||G.mode==='end');
  if(cine)tmpSky.copy(SKY_BRIGHT);else{tmpSky.copy(SKY_DIM).lerp(SKY_BRIGHT,smooth(0,1,lv));scene.fog.near=8+14*lv;scene.fog.far=46;}
  scene.fog.color.copy(tmpSky);if(scene.background&&scene.background.isColor)scene.background.copy(tmpSky);
  AU.cityLvl=lv;
  for(const f of cty.flowers){f.glow.material.opacity=f.lit?0.5+Math.sin(t*3+f.z)*0.1:0;f.glow.scale.setScalar(3.2+(f.lit?Math.sin(t*3+f.z)*0.2:0));}
  for(const pg of cty.pitGlows)pg.material.opacity=0.24+Math.sin(t*1.7)*0.06;
  if(cty.treeGlow)cty.treeGlow.material.opacity=0.22+0.2*lv+Math.sin(t*1.3)*0.04;
  /* pólen e pétalas no ar */
  if(Math.random()<dt*(0.4+2.2*lv))puff(p.x+(Math.random()-0.5)*12,1+Math.random()*5,p.z+(Math.random()-0.5)*14,{vy:0.35,vx:(Math.random()-0.5)*0.6,size:0.35,life:3.2,op:0.5,grow:0.5,color:Math.random()<0.5?0xfff0a0:0xffc8e0});
  /* dicas, diário e o fim */
  if(G.mode==='play'){
    if(p.z<-6)addDiary('city_enter');
    if(p.z<-12&&p.z>-50&&!H.r1){H.r1=1;toast('Os pistões sobem em ritmo. Depois, só as placas com o olho aguentam o peso.');}
    if(p.z<-52&&p.z>-82&&!H.r2){H.r2=1;toast('Dois holofotes e dois sensores. Gire os fachos até acender os dois ao mesmo tempo.');}
    if(p.z<-84&&p.z>-110&&!H.r3){H.r3=1;toast('A válvula laranja enche e a verde drena. Os pontões flutuam com a água.');}
    if(p.z<-112&&p.z>-134&&!H.r4){H.r4=1;toast('Repita a canção dos bulbos. O coração toca de novo.');}
    if(p.y>7.5&&p.z<-166)beginEnding();
  }
  if(G.mode==='ending'||G.mode==='end')cEndingTick(dt);
}
cityArea.camCeil=(x,z)=>z<-161?undefined:8.8;cityArea.camBoundX=7.4;cityArea.update=cUpdate;
function cResetVisit(){
  const W=cty.W;W.level=0;W.target=0;W.moving=false;
  for(const tl of cty.tiles){tl.state='ok';tl.g.visible=true;tl.g.position.set(tl.x,0,tl.z);tl.g.rotation.set(0,0,0);tl.c.on=true;tl.stand=0;}
  const r=cty.room;if(!r.solved){r.state='idle';r.prog=0;r.played=false;r.pt=0;r.step=0;updateDots(r);}for(const n of r.nodes){n.lit=0;n.fail=0;}
}
function cReset(){
  for(const f of cty.flowers){f.lit=false;f.lamp.on=false;f.petalMat.color.setHex(0x7a8a58);f.glow.material.opacity=0;}
  for(const g of cty.gates){g.open=0;g.latched=false;g.fl.position.x=-1.52;g.fr.position.x=1.52;g.c.on=true;}
  for(const fl of cty.floods){fl.step=fl.step0;fl.cur=fl.step0*Math.PI/4;fl.settled=true;fl.head.rotation.y=Math.PI-fl.cur;}
  for(const s of cty.sensors){s.lit=false;s.mat.color.setHex(0x6a3a10);s.glow.visible=false;s.idle.visible=true;}
  const r=cty.room;r.solved=false;for(const n of r.nodes)n.stay=false;r.heart.mat.color.setHex(0xffd24a);r.heart.halo.material.color.setHex(0xffd24a);
  cty.done=[false,false,false,false];cty.lvl=0;cty.hints={};cty.end=null;cty.beamT=0;
  for(const s of cty.slabs){s.open=0;s.gl.rotation.z=0;s.gr.rotation.z=0;}
  cResetVisit();
}
cityArea.onEnter=function(){G.lantern=130;G.lanternOn=false;cty.end=null;cty.lvl=cityLevel();if(cty.ground)cty.ground.visible=false;};
buildCity();
for(const f of cty.flowers)mergeLocalTree(f.g);
cty.merge=mergeStatic(CGR,60);
cty.ground=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000),new THREE.MeshBasicMaterial({color:0x9bd48a}));cty.ground.rotation.x=-Math.PI/2;cty.ground.position.set(0,-11.9,-80);cty.ground.visible=false;CGR.add(cty.ground);
for(const g of cty.gates)mergeLocalTree(g.g);
for(const o of cty.pontoons)mergeLocalTree(o.g);
for(const o of cty.pistons)mergeLocalTree(o.g);
for(const o of cty.tiles)mergeLocalTree(o.g);
for(const fl of cty.floods)mergeLocalTree(fl.g);
for(const s of cty.sensors)mergeLocalTree(s.g);
mergeLocalTree(cty.room.heart.hg);
cityArea.reset=cReset;cityArea.resetVisit=cResetVisit;
