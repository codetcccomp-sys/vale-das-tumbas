/* ====================== Tumba do Reator (Atompunk) ======================
   A regra: subir e baixar a água de resfriamento. Duas válvulas por estação: uma enche, outra drena.
   Salão -> Sala das Comportas (canal com pontões) -> Sala das Plataformas (pontões sobem com a água)
   -> Sala do Reator (zonas de radiação e o Robô atômico) -> Câmara do núcleo atômico. */
const atomArea=makeArea('atom');atomArea.key='atom';atomArea.killY=-5;atomArea.metal=true;atomArea.spawn={x:0,y:0,z:5,face:Math.PI};
atomArea.fogColor=0x050c08;atomArea.hemi=[0x3f7a58,0x101c14,0.7];atomArea.lampColor=0xb8ffc8;atomArea.ambience='atom';
const AG=atomArea.group;AG.visible=false;scene.add(AG);TOMB_AREAS.atom=atomArea;
const atm={hints:{},cells:[],gates:[],waters:{},pontoons:[],lever:null,lever3:null,bot:null,core:null,relicTaken:false,zones:[],spin:[],flames:[]};
const A_WALL=M(0x4d5f56),A_WALL2=M(0x65786e),A_WHITE=M(0xcfd6cf),A_ORANGE=M(0xe0792a),A_DARK=M(0x141c19);
const PUMP_WAKE=18;

function abox(x0,x1,z0,z1,y0,y1,mat,col){const m=mesh(GEO.box(x1-x0,y1-y0,z1-z0),mat,(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,AG);if(col!==false)colBox(atomArea,x0,x1,z0,z1,y0,y1);return m;}
function aCross(zc,half){
  abox(-9.8,-half,zc-0.4,zc+0.4,-12,10,A_WALL);abox(half,9.8,zc-0.4,zc+0.4,-12,10,A_WALL);abox(-half,half,zc-0.4,zc+0.4,7.4,10,A_WALL,false);
  for(const s of[-1,1]){mesh(GEO.cyl(0.45,0.45,7.6,10),A_WHITE,s*(half+0.4),3.8,zc+0.5,AG);mesh(GEO.cyl(0.45,0.45,7.6,10),A_WHITE,s*(half+0.4),3.8,zc-0.5,AG);for(const dz of[-0.5,0.5])colCyl(atomArea,s*(half+0.4),zc+dz,0.45,-2,7.6);}
  mesh(GEO.box(half*2+1.4,0.25,1.4),A_ORANGE,0,7.3,zc,AG);
}
function aGate(zc){
  const g=new THREE.Group();g.position.set(0,0,zc);AG.add(g);
  g.add(outline(mesh(GEO.box(6,7.4,0.5),A_WHITE,0,3.7,0),1.02));
  const ring=mesh(GEO.tor(1.7,0.18,8,24),A_ORANGE,0,3.7,0.3,g);
  for(let i=0;i<4;i++){const sp=mesh(GEO.box(3.1,0.18,0.14),A_ORANGE,0,3.7,0.32,g);sp.rotation.z=i*Math.PI/4;}
  mesh(GEO.cyl(0.35,0.35,0.3,10),BASIC(0x5dff7a),0,3.7,0.4,g).rotation.x=Math.PI/2;
  mesh(GEO.box(5.4,0.14,0.7),A_ORANGE,0,0.9,0,g);mesh(GEO.box(5.4,0.14,0.7),A_ORANGE,0,6.5,0,g);
  const c=colBox(atomArea,-3,3,zc-0.3,zc+0.3,-12,8);
  const o={g,c,open:0,latched:false,zc};atm.gates.push(o);return o;
}
function aLever(x,y,z,onUse,label){
  const lev=new THREE.Group();lev.position.set(x,y,z);AG.add(lev);outline(mesh(GEO.box(1.4,1.1,1.1),A_DARK,0,0.55,0,lev),1.04);
  const arm=new THREE.Group();arm.position.set(0,1.1,0);lev.add(arm);arm.add(mesh(GEO.cyl(0.07,0.07,1.5,6),BASIC(0xc9d3de),0,0.75,0));arm.add(mesh(GEO.sph(0.18,8,6),A_ORANGE,0,1.55,0));arm.rotation.z=0.8;
  const o={arm,lev,done:false,t:0};
  colBox(atomArea,x-0.7,x+0.7,z-0.55,z+0.55,y-2,y+1.4);
  atomArea.interact.push({x,z:z+1.2,r:2.4,label:()=>o.done?null:label,use:()=>{if(o.done)return;o.done=true;o.t=0;SFX.lever();onUse();}});
  return o;
}
function aCell(x,z){
  const g=new THREE.Group();g.position.set(x,0,z);AG.add(g);
  outline(mesh(GEO.cyl(0.8,0.9,0.5,14),A_WHITE,0,0.25,0,g),1.04);
  outline(mesh(GEO.cyl(0.5,0.5,1.5,12),A_DARK,0,1.2,0,g),1.04);
  const glow=mesh(GEO.cyl(0.4,0.4,1.3,12),BASICU(0x1c4a2a),0,1.2,0,g);
  for(const y of[0.7,1.2,1.7]){const r=mesh(GEO.tor(0.52,0.05,5,14),A_ORANGE,0,y,0,g);r.rotation.x=Math.PI/2;}
  colCyl(atomArea,x,z,0.95,-2,2.4);
  const o={x,z,g,glow,lit:false,lamp:{x,y:2.0,z,on:false}};atm.cells.push(o);atomArea.lamps.push(o.lamp);
  atomArea.interact.push({x,z,r:2.6,label:()=>o.lit?TXT.pointLabel:'Ativar a célula de energia',use:()=>useCell(o)});
  return o;
}
function aWater(x0,x1,z0,z1,max,step,speed,always,noisy){
  const mat=new THREE.MeshBasicMaterial({color:0x2fd6a0,transparent:true,opacity:0.6,depthWrite:false,side:THREE.DoubleSide});
  const mesh_=mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),mat,(x0+x1)/2,0,(z0+z1)/2,AG);mesh_.rotation.x=-Math.PI/2;mesh_.userData.dyn=true;mesh_.renderOrder=2;
  (atomArea.water=atomArea.water||[]).push({x0,x1,z0,z1});
  return{level:0,target:0,min:0,max,step,speed,mesh:mesh_,mat,moving:false,always,noisy};
}
function aValve(parent,x,y,z,type){
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  const col=type==='up'?0xe0792a:0x6fd3a8;
  outline(mesh(GEO.cyl(0.13,0.16,0.9,8),A_DARK,0,0.45,0,g),1.05);
  const wheel=mesh(GEO.tor(0.42,0.06,6,18),BASIC(col),0,1.0,0,g);wheel.rotation.x=Math.PI/2;
  for(let i=0;i<2;i++){const sp=mesh(GEO.box(0.84,0.07,0.07),BASIC(col),0,1.0,0,g);sp.rotation.y=i*Math.PI/2;}
  const ar=mesh(GEO.cone(0.17,0.34,6),BASIC(col),0,1.6,0,g);if(type==='down')ar.rotation.x=Math.PI;
}
function valveLabel(type,W){return type==='up'?'Abrir a válvula de enchimento (subir a água)':'Abrir o dreno (baixar a água)';}
function useValve(type,W){
  if(W.moving){SFX.deny();toast('A água ainda está se movendo.');return;}
  if(type==='up'){if(W.target>=W.max-1e-6){SFX.deny();toast('O nível já está no máximo.');return;}W.target=Math.min(W.max,W.target+W.step);}
  else{if(W.target<=W.min+1e-6){SFX.deny();toast('O nível já está no mínimo.');return;}W.target=Math.max(W.min,W.target-W.step);}
  SFX.valve();
  if(W.noisy){const b=atm.bot;if(b&&b.state==='sleep'&&Math.hypot(G.p.x-b.x,G.p.z-b.z)<PUMP_WAKE)wakeBot(b,true);}
}
function aStation(parent,lx,ly,lz,wx,wz,W,spread,solid){
  for(const[dx,type]of[[-spread/2,'up'],[spread/2,'down']]){
    aValve(parent,lx+dx,ly,lz,type);
    if(solid)colCyl(atomArea,wx+dx,wz,0.5,ly-2,ly+2.4);
    atomArea.interact.push({x:wx+dx,z:wz,r:1.8,label:()=>valveLabel(type,W),use:()=>useValve(type,W)});
  }
}
function aPontoon(W,cx,cz,w,d,station){
  const g=new THREE.Group();g.position.set(cx,0,cz);AG.add(g);g.userData.dyn=true;
  outline(mesh(GEO.box(w,0.8,d),A_WHITE,0,-0.34,0,g),1.02);
  mesh(GEO.box(w+0.1,0.06,d+0.1),A_ORANGE,0,0.03,0,g);
  for(const sx of[-w/2+0.4,w/2-0.4])mesh(GEO.sph(0.12,6,5),BASIC(0x5dff7a),sx,0.12,d/2-0.3,g);
  const c=colBox(atomArea,cx-w/2,cx+w/2,cz-d/2,cz+d/2,-0.8,0.06);
  const o={g,c,W,cx,cz};atm.pontoons.push(o);
  if(station)aStation(g,0,0.06,0,cx,cz,W,3.0,false);
  return o;
}
function trefoilTex(){return canvasTex(128,128,(g)=>{g.clearRect(0,0,128,128);g.fillStyle='#e8ff4a';for(let i=0;i<3;i++){const a=i*TAU/3-Math.PI/2;g.beginPath();g.moveTo(64,64);g.arc(64,64,52,a-0.52,a+0.52);g.closePath();g.fill();}
  g.fillStyle='#10321c';g.beginPath();g.arc(64,64,11,0,TAU);g.fill();g.strokeStyle='#e8ff4a';g.lineWidth=5;g.beginPath();g.arc(64,64,60,0,TAU);g.stroke();});}

function buildAtom(){
  /* pisos, paredes, teto */
  const FL=M(0x24342c);
  abox(-9,9,-14,8.8,-1,0,FL);abox(-9,9,-38,-28,-1,0,FL);abox(-9,9,-99.2,-60,-1,0,FL);abox(-7.8,7.8,-113,-98.4,-1,0,M(0x2a3c32));
  abox(-9.8,-9,-99.2,9.6,-12,10,A_WALL);abox(9,9.8,-99.2,9.6,-12,10,A_WALL);abox(-9.8,9.8,8.8,9.6,-12,10,A_WALL);
  abox(-8.6,-7.8,-113.8,-98.4,-12,10,A_WALL);abox(7.8,8.6,-113.8,-98.4,-12,10,A_WALL);abox(-8.6,8.6,-113.8,-113,-12,10,A_WALL);
  abox(-9.8,9.8,-113.8,9.6,8.4,9.6,M(0x18211d),false);
  aCross(-8,3);aCross(-34,3);aCross(-66,3);aCross(-98.8,3);
  for(let z=6;z>-112;z-=6)abox(-9,9,z-0.14,z+0.14,8.0,8.4,BASIC(0x5dff7a),false);
  /* tubos, colunas e vigias (anos 50: formas redondas) */
  for(const s of[-1,1]){
    const p=mesh(GEO.cyl(0.26,0.26,120,8),A_WHITE,s*8.5,5.6,-52,AG);p.rotation.x=Math.PI/2;
    const p2=mesh(GEO.cyl(0.16,0.16,120,6),A_ORANGE,s*8.6,4.9,-52,AG);p2.rotation.x=Math.PI/2;
    for(let z=4;z>-112;z-=8){const cl=mesh(GEO.tor(0.3,0.05,5,12),A_ORANGE,s*8.5,5.6,z,AG);cl.rotation.y=Math.PI/2;}
    for(let z=2;z>-100;z-=8){mesh(GEO.cyl(0.34,0.34,7.8,10),A_WALL2,s*8.6,3.9,z,AG);mesh(GEO.tor(0.38,0.05,5,12),A_ORANGE,s*8.6,2.2,z,AG).rotation.x=Math.PI/2;mesh(GEO.tor(0.38,0.05,5,12),A_ORANGE,s*8.6,5.8,z,AG).rotation.x=Math.PI/2;}
  }
  for(let z=4;z>-100;z-=8)for(const s of[-1,1]){
    if(z<-12&&z>-96){const rim=mesh(GEO.tor(1.0,0.13,6,20),A_ORANGE,s*8.95,4.2,z-4,AG);rim.rotation.y=-s*Math.PI/2;const gl=mesh(new THREE.CircleGeometry(1.0,18),BASIC(0x0b3a26),s*8.97,4.2,z-4,AG);gl.rotation.y=-s*Math.PI/2;}
    mesh(GEO.box(0.3,0.5,0.3),A_DARK,s*8.7,4.2,z,AG);mesh(GEO.sph(0.24,8,6),BASIC(0xd6ffe0),s*8.45,4.6,z,AG);atomArea.lamps.push({x:s*8.45,y:4.6,z,on:true});
  }
  /* salão */
  const mark=mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshBasicMaterial({map:eyeTexture('#5dff7a'),transparent:true,opacity:0.8,depthWrite:false}),0,0.03,0,AG);mark.rotation.x=-Math.PI/2;
  mesh(GEO.tor(2.3,0.3,8,26),A_ORANGE,0,3.0,8.4,AG);mesh(GEO.cyl(2.1,2.1,0.2,24),BASIC(0x4a7fa8,{transparent:true,opacity:0.55}),0,3.0,8.6,AG).rotation.x=Math.PI/2;
  mesh(new THREE.PlaneGeometry(1.5,1.5),new THREE.MeshBasicMaterial({map:eyeTexture('#d6ffe0'),transparent:true,depthWrite:false}),0,6.2,7.9,AG);
  atomArea.interact.push({x:0,z:6.9,r:2.7,label:()=>'Sair para o Vale',use:()=>exitTomb(false)});
  aCell(-5.2,-3.5);aCell(-6,-36.2);aCell(7.5,-68.2);

  /* águas: R1 e R2 sobem de 0 a 2 e de 0 a 4; R3 alaga de 0 a 0,45 */
  const W1=atm.waters.W1=aWater(-9,9,-28,-14,2,2,1.0,true,false);
  const W2=atm.waters.W2=aWater(-9,9,-60,-38,4,2,1.0,true,false);
  const W3=atm.waters.W3=aWater(-9,9,-98,-66,0.45,0.45,0.15,false,true);
  for(const[zA,zB]of[[-28,-14],[-60,-38]]){const f=mesh(new THREE.PlaneGeometry(18,zB-zA),BASIC(0x0a2a1a),0,-5.5,(zA+zB)/2,AG);f.rotation.x=-Math.PI/2;
    const gw=mesh(new THREE.PlaneGeometry(16,Math.abs(zB-zA)-2),BASIC(0x2fff9a,{transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false}),0,-5.4,(zA+zB)/2,AG);gw.rotation.x=-Math.PI/2;gw.userData.dyn=true;atm.spin.push({pit:gw});}

  /* SALA 1: Sala das Comportas */
  const G1=aGate(-34);
  aPontoon(W1,0,-16.7,6,3,false);aPontoon(W1,0,-20.9,6,3,false);aPontoon(W1,0,-25.1,6,3,false);
  aStation(AG,-4.5,0,-10.4,-4.5,-10.4,W1,3.0,true);aStation(AG,-5,0,-30.8,-5,-30.8,W1,3.0,true);
  /* SALA 2: Sala das Plataformas */
  const G2=aGate(-66);
  aStation(AG,5,0,-35.4,5,-35.4,W2,3.0,true);
  aPontoon(W2,0,-41.2,6,4,true);aPontoon(W2,0,-54,6,4,true);
  abox(-9,-4.2,-55,-41,1.5,2.0,A_WHITE);abox(4.2,9,-62,-50,3.5,4.0,A_WHITE);
  for(const[cx,cz]of[[-8.4,-54.4],[-8.4,-41.6],[8.4,-61.4],[8.4,-50.6]]){const top=cx<0?1.5:3.5;mesh(GEO.cyl(0.3,0.3,top+5.5,8),A_WALL2,cx,(top-5.5)/2,cz,AG);}
  for(const[x0,x1,z0,z1,y]of[[-9,-4.2,-55,-41,2.0],[4.2,9,-62,-50,4.0]]){mesh(GEO.box(x1-x0,0.14,0.14),A_ORANGE,(x0+x1)/2,y+0.08,z0,AG);mesh(GEO.box(x1-x0,0.14,0.14),A_ORANGE,(x0+x1)/2,y+0.08,z1,AG);}
  aStation(AG,5.6,4.0,-51.8,5.6,-51.8,W2,2.6,true);
  atm.lever2=aLever(7.4,4.0,-60.8,()=>{G2.latched=true;SFX.gate();toast('A comporta da sala está subindo...','good');},'Abrir a comporta da sala');
  /* SALA 3: Sala do Reator */
  const G3=aGate(-98.8);
  aStation(AG,-5.6,0,-69.2,-5.6,-69.2,W3,2.8,true);
  atm.zones=[{x:-3,z:-76,r:5.5},{x:3.5,z:-84.5,r:5.5},{x:-3,z:-93,r:5.5}];
  const tref=trefoilTex();
  for(const z of atm.zones){
    const m=new THREE.MeshBasicMaterial({map:tref,transparent:true,opacity:0.55,depthWrite:false,color:0xb8ff9a});
    const d=mesh(new THREE.PlaneGeometry(z.r*2,z.r*2),m,z.x,0.03,z.z,AG);d.rotation.x=-Math.PI/2;z.mat=m;d.renderOrder=1;
    const gl=mesh(GEO.cyl(z.r,z.r,0.06,28),BASIC(0x3aff6a,{transparent:true,opacity:0.18,depthWrite:false}),z.x,0.02,z.z,AG);z.glow=gl;gl.userData.dyn=true;
  }
  for(const[x,z]of[[-7.5,-72],[7.5,-86],[-7.5,-96],[7.5,-94]]){outline(mesh(GEO.cyl(1.0,1.0,7,14),A_WHITE,x,3.5,z,AG),1.03);for(const y of[1.2,3.5,5.8])mesh(GEO.tor(1.02,0.08,5,16),A_ORANGE,x,y,z,AG).rotation.x=Math.PI/2;colCyl(atomArea,x,z,1.05,-2,8);}
  atm.lever3=aLever(6.8,0,-96.6,()=>{G3.latched=true;SFX.gate();toast('A comporta final está subindo...','good');addDiary('atom_rad');},'Abrir a comporta final');
  /* CÂMARA: o núcleo atômico */
  const ped=new THREE.Group();ped.position.set(0,0,-107);AG.add(ped);outline(mesh(GEO.cyl(1.3,1.6,1.1,14),A_WHITE,0,0.55,0,ped),1.04);outline(mesh(GEO.cyl(1.7,1.7,0.2,14),A_ORANGE,0,0.1,0,ped),1.03);
  colCyl(atomArea,0,-107,1.55,-2,2);
  const core=new THREE.Group();core.position.set(0,2.6,-107);AG.add(core);
  mesh(GEO.sph(0.42,14,10),BASIC(0x5dff7a),0,0,0,core);
  atm.rings=[];for(let i=0;i<3;i++){const r=mesh(GEO.tor(0.85,0.05,6,28),BASIC(i===1?0xe0792a:0xd6ffe0),0,0,0,core);r.rotation.set(i*1.05,i*0.7,0);r.userData.keep=true;atm.rings.push(r);}
  const cg=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0x5dff7a,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.6}));cg.scale.set(5.5,5.5,1);cg.position.set(0,2.6,-107);AG.add(cg);
  atm.core=core;atm.coreGlow=cg;atm.coreLamp={x:0,y:2.8,z:-107,on:true};atomArea.lamps.push(atm.coreLamp);
  const mark2=mesh(new THREE.PlaneGeometry(9,9),new THREE.MeshBasicMaterial({map:eyeTexture('#5dff7a'),transparent:true,opacity:0.55,depthWrite:false}),0,0.03,-107,AG);mark2.rotation.x=-Math.PI/2;
  atomArea.interact.push({x:0,z:-104.6,r:2.8,label:()=>atm.relicTaken?null:'Pegar o núcleo atômico',use:()=>{if(atm.relicTaken)return;atm.relicTaken=true;atm.core.visible=false;atm.coreGlow.visible=false;atm.coreLamp.on=false;collectRelic('atom');}});
  /* o Robô atômico de manutenção */
  const B=buildMaintBot();B.group.position.set(6.5,0,-78.5);AG.add(B.group);
  atm.bot={x:6.5,z:-78.5,hx:6.5,hz:-78.5,face:Math.PI*0.9,state:'sleep',room:{x0:-9,x1:9,z0:-98.4,z1:-66.4},rig:B.rig,group:B.group,speed:0,puffT:0};
  atomArea.guards.push(atm.bot);
}

/* ---------- lógica ---------- */
function useCell(o){
  const first=!o.lit;usePowerPoint(o.x+(o.x<0?1.9:-1.9),o.z,first,'Célula ativada. Ponto de controle salvo e lanterna recarregada.');if(!first)return;
  o.lit=true;o.lamp.on=true;o.glow.material.color.setHex(0x5dff7a);
  for(let i=0;i<3;i++)puff(o.x,2.4,o.z,{vy:1.2,size:0.6,life:1.4,color:0x9affb8});
}
function wakeBot(g,noise){
  if(g.state==='awake')return;g.state='awake';SFX.wake();
  toast(noise?'O barulho da bomba acordou o Robô atômico!':'O Robô atômico despertou!','warn');addDiary('atom_guard');
}
function aUpdateBot(g,dt,t){
  const p=G.p,inRoom=p.x>=g.room.x0&&p.x<=g.room.x1&&p.z>=g.room.z0&&p.z<=g.room.z1&&p.y>-3;
  const dx=p.x-g.x,dz=p.z-g.z,d=Math.hypot(dx,dz)||0.001;
  if(g.state==='sleep'){
    g.speed=0;
    if(inRoom&&G.mode==='play'){const noisy=p.run&&p.speed>3;if((noisy&&d<8.5)||d<3)wakeBot(g,false);}
  }else if(!inRoom){
    g.state='sleep';g.x=g.hx;g.z=g.hz;g.speed=0;SFX.sleep();toast('O Robô atômico voltou a dormir.');
  }else{
    const sp=2.5,r=pushOut(atomArea,g.x+dx/d*sp*dt,g.z+dz/d*sp*dt,0,0.6,2.2);g.x=r[0];g.z=r[1];g.speed=sp;
    g.face+=wrapPi(Math.atan2(dx,dz)-g.face)*(1-Math.exp(-6*dt));
    g.puffT-=dt;if(g.puffT<=0){g.puffT=0.3;puff(g.x,2.9,g.z,{vy:0.8,size:0.4,life:1,op:0.35,color:0x9affb8});}
    if(d<1.3&&G.mode==='play')hurt(1,g.x,g.z,'bot');
  }
  g.group.position.set(g.x,0,g.z);g.group.rotation.y=g.face;animMaintBot(g.rig,t,g.state==='awake',g.speed);
}
atomArea.drainExtra=function(){
  const p=G.p;if(atm.waters.W3.level>=0.4||p.y>1.5||p.z>-66)return 0;
  for(const z of atm.zones){if(Math.hypot(p.x-z.x,p.z-z.z)<z.r)return 2;}
  return 0;
};
function aUpdate(dt,t){
  const p=G.p,gt=atm.gates;
  for(const k in atm.waters){
    const W=atm.waters[k],d=W.target-W.level;
    if(Math.abs(d)>1e-4){W.level+=clamp(d,-W.speed*dt,W.speed*dt);W.moving=true;SFX.pump();}else{W.level=W.target;W.moving=false;}
    W.mesh.position.y=W.level+0.03;W.mesh.visible=W.always||W.level>0.03;W.mat.opacity=0.55+Math.sin(t*2)*0.05;
  }
  for(const o of atm.pontoons){const L=o.W.level;o.g.position.y=L;o.c.y1=L+0.06;o.c.y0=o.c.y1-0.8;}
  if(atm.waters.W1.level>=1.9&&!gt[0].latched){gt[0].latched=true;SFX.gate();toast('A água chegou ao nível. A comporta está subindo...','good');addDiary('atom_water');}
  for(const g of gt){if(g.latched&&g.open<1){g.open=Math.min(1,g.open+dt/2);g.g.position.y=g.open*7.6;if(g.open>0.55)g.c.on=false;if(Math.random()<dt*10)puff(0,6,g.zc,{vy:0.6,size:1.2,life:1.4,op:0.3,color:0xb8e8cc});}}
  for(const lv of[atm.lever2,atm.lever3]){if(lv&&lv.done&&lv.t<1){lv.t+=dt;lv.arm.rotation.z=lerp(0.8,-0.8,smooth(0,0.4,lv.t));}}
  /* zonas de radiação: brilham mais quando secas, apagam quando alagadas */
  const flooded=atm.waters.W3.level>=0.4;
  for(const z of atm.zones){z.mat.opacity=flooded?0.1:0.5+Math.sin(t*3+z.x)*0.1;z.glow.material.opacity=flooded?0.04:0.16+Math.sin(t*2.4+z.z)*0.05;}
  const extra=atomArea.drainExtra();
  AU.geiger=extra>0?30:1.4;
  if(extra>0&&!atm.hints.rad){atm.hints.rad=1;toast('Zona de radiação! A lanterna gasta mais rápido aqui. Alagar a sala protege.','warn');addDiary('atom_rad');}
  if(!atm.relicTaken){atm.core.position.y=2.6+Math.sin(t*2)*0.12;atm.coreGlow.position.y=atm.core.position.y;atm.coreGlow.material.opacity=0.5+Math.sin(t*3)*0.12;atm.rings.forEach((r,i)=>{r.rotation.x+=dt*(0.8+i*0.5);r.rotation.y+=dt*(0.6+i*0.3);});}
  for(const s of atm.spin){if(s.pit)s.pit.material.opacity=0.26+Math.sin(t*1.5)*0.06;}
  if(Math.random()<dt*0.7){const x=(Math.random()<0.5?-8.2:8.2),z=-12-Math.random()*86;puff(x*0.95,0.5,z,{vy:2,size:0.7,life:1.5,op:0.28,color:0xb8e8cc,vx:-Math.sign(x)*0.4});}
  aUpdateBot(atm.bot,dt,t);
  if(p.z<-6)addDiary('atom_enter');
  const H=atm.hints;
  if(p.z<-12&&p.z>-34&&!H.r1){H.r1=1;toast('Duas válvulas controlam a água: a laranja enche e a verde drena. As plataformas flutuam com o nível.');}
  if(p.z<-38&&p.z>-66&&!H.r2){H.r2=1;toast('Os pontões sobem com a água. Alcance as passarelas altas e puxe a alavanca.');}
  if(p.z<-70&&p.z>-98&&!H.r3){H.r3=1;toast('O Robô atômico dorme perto. Alagar a sala apaga a radiação, mas a bomba faz barulho.','warn');}
}
function aReset(){
  for(const o of atm.cells){o.lit=false;o.lamp.on=false;o.glow.material.color.setHex(0x1c4a2a);}
  for(const g of atm.gates){g.open=0;g.latched=false;g.g.position.y=0;g.c.on=true;}
  for(const k in atm.waters){const W=atm.waters[k];W.level=0;W.target=0;W.moving=false;}
  for(const lv of[atm.lever2,atm.lever3]){if(lv){lv.done=false;lv.t=0;lv.arm.rotation.z=0.8;}}
  atm.relicTaken=!!G.relics.atom;atm.core.visible=!atm.relicTaken;atm.coreGlow.visible=!atm.relicTaken;atm.coreLamp.on=!atm.relicTaken;
  aResetVisit();
}
function aResetVisit(){
  for(const k in atm.waters){const W=atm.waters[k];W.level=0;W.target=0;W.moving=false;}
  const b=atm.bot;b.state='sleep';b.x=b.hx;b.z=b.hz;b.face=Math.PI*0.9;b.speed=0;
}
buildAtom();
for(const o of atm.cells)o.g.userData.dyn=true;for(const o of atm.gates)o.g.userData.dyn=true;
for(const lv of[atm.lever2,atm.lever3])lv.lev.userData.dyn=true;
atm.core.userData.dyn=true;atm.bot.group.userData.dyn=true;
atm.merge=mergeStatic(AG,60);
for(const o of atm.cells)mergeLocalTree(o.g);for(const o of atm.gates)mergeLocalTree(o.g);for(const o of atm.pontoons)mergeLocalTree(o.g);
for(const lv of[atm.lever2,atm.lever3])mergeLocalTree(lv.lev);mergeLocalTree(atm.core);
atomArea.camCeil=7.6;atomArea.camBoundX=8.0;atomArea.update=aUpdate;atomArea.reset=aReset;atomArea.resetVisit=aResetVisit;
