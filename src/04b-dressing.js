/* ====================== vegetação e estruturas extras do Vale ======================
   Cactos, arbustos secos e tufos de capim espalhados pelas dunas; ruínas de muro e colunas caídas; e um conjunto
   de estruturas por era perto de cada tumba (chaminés e canos a vapor, caminhões a diesel, antenas parabólicas e um
   abrigo atômico, cogumelos gigantes e raízes, painéis solares e cata-ventos perto da Cidade-Jardim).
   Tudo usa materiais que o Vale já tem sempre que possível, para a junção estática gerar poucas chamadas de desenho. */
function dressFree(x,z,r,avoid){
  if(Math.hypot(x,z)>182||flatMask(x,z)>0.85)return false;
  if(Math.abs(x)<13&&z>-140&&z<172)return false;   // a Estrada das Eras fica livre
  for(const p of avoid)if(Math.hypot(x-p[0],z-p[1])<p[2]+r)return false;
  const q=pushOut(valeArea,x,z,terrainH(x,z),r,3);return Math.hypot(q[0]-x,q[1]-z)<0.01;
}
function cactus(x,z,s,R){
  const g=new THREE.Group(),mat=M(0x4a8a3a),h=3.0*s;
  outline(mesh(GEO.cyl(0.3*s,0.36*s,h,7),mat,0,h/2,0,g),1.06);mesh(GEO.sph(0.3*s,7,4),mat,0,h,0,g);
  const arms=R()<0.25?0:R()<0.6?1:2;
  for(let k=0;k<arms;k++){const sd=k?-1:1,ay=h*(0.38+R()*0.2),al=0.9*s+R()*0.6*s;
    const hz=mesh(GEO.cyl(0.18*s,0.18*s,0.7*s,7),mat,sd*0.4*s,ay,0,g);hz.rotation.z=Math.PI/2;
    mesh(GEO.cyl(0.2*s,0.2*s,al,6),mat,sd*0.72*s,ay+al/2,0,g);mesh(GEO.sph(0.2*s,6,4),mat,sd*0.72*s,ay+al,0,g);}
  if(R()<0.3)mesh(GEO.sph(0.12*s,6,5),BASIC(0xffd24a),0,h+0.25*s,0,g);
  g.rotation.y=R()*TAU;onGround(g,x,z,-0.1);colCylT(x,z,0.4*s,h);
}
function shrub(x,z,s,R){
  const g=new THREE.Group();
  for(let k=0;k<4;k++){const r=(0.35+R()*0.3)*s,b=mesh(new THREE.DodecahedronGeometry(r,0),M(k%3?0x8a6a3a:0x4a8a3a),(R()-0.5)*0.9*s,r*0.6,(R()-0.5)*0.9*s,g);b.scale.y=0.65;b.rotation.y=R()*3;}
  for(let k=0;k<3;k++){const t=mesh(GEO.cyl(0.03,0.04,0.8*s,4),M(0x6b4326),(R()-0.5)*0.6*s,0.4*s,(R()-0.5)*0.6*s,g);t.rotation.z=(R()-0.5)*0.9;t.rotation.x=(R()-0.5)*0.9;}
  onGround(g,x,z,-0.05);
}
function tuft(x,z,R){
  const g=new THREE.Group(),mat=M(R()<0.6?0x8a6a3a:0x4a8a3a);
  for(let k=0;k<6;k++){const hh=0.7+R()*0.6,c=mesh(GEO.cone(0.07,hh,4),mat,(R()-0.5)*0.45,hh*0.45,(R()-0.5)*0.45,g);c.rotation.z=(R()-0.5)*0.8;c.rotation.x=(R()-0.5)*0.8;}
  onGround(g,x,z,0);
}
function wallRuin(x,z,rot,len,R){
  const g=new THREE.Group(),stone=M(0xd8c9a0),dark=M(0xb89a68);
  let px=-len/2;while(px<len/2-0.4){const w=0.9+R()*1.2,h=0.8+R()*2.4;outline(mesh(GEO.box(Math.min(w,len/2-px),h,0.8),R()<0.75?stone:dark,px+Math.min(w,len/2-px)/2,h/2-0.2,0,g),1.03);px+=w;}
  for(let k=0;k<3;k++){const b=mesh(GEO.box(0.6,0.4,0.5),stone,(R()-0.5)*len,0.1,1.0+R()*0.8,g);b.rotation.y=R()*2;b.rotation.z=(R()-0.5)*0.5;}
  g.rotation.y=rot;onGround(g,x,z,-0.15);
  const c=Math.cos(rot),s=Math.sin(rot);for(let d=-len/2+0.5;d<=len/2-0.4;d+=1.0)colCylT(x+c*d,z-s*d,0.55,2.6);
}
function fallenColumn(x,z,rot){
  const g=new THREE.Group(),mat=M(0xd8c9a0);
  const c=outline(mesh(GEO.cyl(0.55,0.55,6,10),mat,0,0.35,0,g),1.03);c.rotation.z=Math.PI/2;
  for(const d of[-2.6,2.6]){const r=mesh(GEO.tor(0.56,0.08,5,12),M(0xb89a68),d,0.35,0,g);r.rotation.y=Math.PI/2;}
  const cap=outline(mesh(GEO.box(1.4,1.4,1.4),mat,3.6,0.4,0.3,g),1.03);cap.rotation.set(0.3,0.4,0.2);
  g.rotation.y=rot;onGround(g,x,z,-0.15);
  const cs=Math.cos(rot),sn=Math.sin(rot);for(const d of[-2.4,-0.8,0.8,2.4,3.6])colCylT(x+cs*d,z-sn*d,0.6,1.0);
}
/* era do vapor */
function chimney(x,z,h){
  const g=new THREE.Group();outline(mesh(GEO.cyl(0.6,0.8,h,10),M(0xb8703a),0,h/2,0,g),1.03);
  for(const y of[h*0.3,h*0.6,h*0.92])mesh(GEO.tor(0.72-y/h*0.12,0.08,5,12),M(0xd8a24a),0,y,0,g).rotation.x=Math.PI/2;
  outline(mesh(GEO.cyl(0.78,0.66,0.5,10),M(0x7a4a2a),0,h,0,g),1.04);
  onGround(g,x,z,-0.3);colCylT(x,z,0.85,h);
  return{x,y:terrainH(x,z)+h+0.4,z};
}
function pipeRun(x,z,rot,len){
  const g=new THREE.Group(),mat=M(0x7a4a2a);
  const p=outline(mesh(GEO.cyl(0.38,0.38,len,10),mat,0,0.3,0,g),1.03);p.rotation.z=Math.PI/2;
  for(let d=-len/2+0.8;d<len/2;d+=2.2)mesh(GEO.tor(0.42,0.07,5,12),M(0xd8a24a),d,0.3,0,g).rotation.y=Math.PI/2;
  const el=outline(mesh(GEO.cyl(0.38,0.38,2.4,10),mat,len/2,1.3,0,g),1.03);
  const v=mesh(GEO.cyl(0.08,0.08,0.6,6),M(0x3a2c20),-len/4,0.95,0,g);const w=mesh(GEO.tor(0.25,0.05,5,12),M(0xd8a24a),-len/4,1.25,0,g);w.rotation.x=Math.PI/2;
  g.rotation.y=rot;onGround(g,x,z,-0.1);
  const cs=Math.cos(rot),sn=Math.sin(rot);for(let d=-len/2;d<=len/2;d+=1.4)colCylT(x+cs*d,z-sn*d,0.45,0.8);colCylT(x+cs*len/2,z-sn*len/2,0.5,2.6);
}
/* era do diesel */
function truckWreck(x,z,rot,tilt){
  const g=new THREE.Group(),body=M(0x4a505c),dark=M(0x3a3f48),tire=M(0x2a1a10);
  outline(mesh(GEO.box(2.2,0.5,5.6),dark,0,0.75,0,g),1.03);
  outline(mesh(GEO.box(2.1,1.5,1.7),body,0,1.7,1.3,g),1.03);
  outline(mesh(GEO.box(1.9,0.9,1.6),body,0,1.35,2.75,g),1.03);
  mesh(GEO.box(1.7,0.5,0.06),BASIC(0x0a1018),0,2.0,2.17,g);
  outline(mesh(GEO.box(2.2,1.1,2.6),M(0x5a606c),0,1.55,-1.3,g),1.03);
  for(const[wx,wz]of[[-1.15,2.2],[1.15,2.2],[-1.15,-1.6],[1.15,-1.6]]){const w=outline(mesh(GEO.cyl(0.55,0.55,0.4,10),tire,wx,0.5,wz,g),1.04);w.rotation.z=Math.PI/2;}
  mesh(GEO.box(0.06,0.06,2.4),BASIC(0xcfd8e0),1.12,1.0,0,g);
  g.rotation.set(0,rot,tilt);onGround(g,x,z,-0.45);
  const cs=Math.cos(rot),sn=Math.sin(rot);for(const d of[-2.3,-0.8,0.8,2.6])colCylT(x+sn*d,z+cs*d,1.25,2.4);
}
function decoLamp(x,z){
  const g=new THREE.Group();outline(mesh(GEO.box(0.3,4.2,0.3),M(0x3a3f48),0,2.1,0,g),1.05);
  mesh(GEO.box(0.06,3.8,0.06),BASIC(0xcfd8e0),0,2.1,0.16,g);outline(mesh(GEO.box(0.7,0.18,0.7),M(0x4a505c),0,4.2,0,g),1.05);
  mesh(GEO.sph(0.26,8,6),BASIC(0xcfd8e0),0,4.5,0,g);
  const tilt=0.12;g.rotation.z=tilt;onGround(g,x,z,-0.2);colCylT(x,z,0.3,4);
}
/* era atômica */
function dish(x,z,rot){
  const g=new THREE.Group(),white=M(0xe9e4d4);
  outline(mesh(GEO.cyl(0.35,0.55,2.4,10),M(0xcfcab8),0,1.2,0,g),1.04);
  const d=outline(mesh(new THREE.SphereGeometry(2.4,16,8,0,TAU,0,0.75),white,0,0,0,g),1.02);d.position.set(0,3.6,0);d.rotation.x=-2.2;
  const arm=mesh(GEO.cyl(0.05,0.05,2.0,5),M(0xcfcab8),0,3.3,1.2,g);arm.rotation.x=0.95;
  mesh(GEO.sph(0.18,8,6),M(0xff9a3a),0,3.9,2.05,g);
  g.rotation.y=rot;onGround(g,x,z,-0.1);colCylT(x,z,0.7,3);
}
function bunker(x,z,rot){
  const g=new THREE.Group();
  outline(mesh(new THREE.SphereGeometry(3.4,16,8,0,TAU,0,Math.PI/2),M(0xcfc9b4),0,-0.3,0,g),1.02);
  outline(mesh(GEO.box(1.6,2.0,1.2),M(0xcfc9b4),0,0.7,3.0,g),1.03);mesh(GEO.box(1.1,1.6,0.08),BASIC(0x0b100c),0,0.75,3.62,g);
  const t=mesh(GEO.tor(0.55,0.05,5,16),M(0xff9a3a),0,1.95,3.0,g);
  for(const sx of[-1.4,1.3])outline(mesh(GEO.cyl(0.22,0.22,1.4,8),M(0xe9e4d4),sx,3.2,-0.6,g),1.05);
  mesh(GEO.sph(0.2,6,5),BASIC(0x5dff7a),0,3.25,0,g);
  g.rotation.y=rot;onGround(g,x,z,0);colCylT(x,z,3.2,3);
}
/* era biopunk */
function mushroom(x,z,s,R){
  const g=new THREE.Group();
  outline(mesh(GEO.cyl(0.28*s,0.42*s,2.6*s,8),M(0xd7c39a),0,1.3*s,0,g),1.05);
  const cap=outline(mesh(new THREE.SphereGeometry(1.25*s,14,7,0,TAU,0,Math.PI*0.5),M(0x7a5aa8),0,2.5*s,0,g),1.03);cap.scale.y=0.7;
  for(let k=0;k<6;k++){const a=R()*TAU,r=(0.4+R()*0.6)*s;mesh(GEO.sph(0.12*s,6,4),BASIC(0xc9a6ff),Math.cos(a)*r,2.5*s+0.75*s*Math.sqrt(1-Math.min(1,(r/(1.25*s))**2))*0.95,Math.sin(a)*r,g);}
  g.rotation.z=(R()-0.5)*0.15;onGround(g,x,z,-0.1);colCylT(x,z,0.45*s,2.6*s);
}
function rootArch(x,z,rot){
  const g=new THREE.Group(),a=outline(mesh(new THREE.TorusGeometry(3.2,0.42,7,14,Math.PI),M(0x7a5aa8),0,0,0,g),1.04);
  for(let k=0;k<5;k++){const t=0.3+k*0.6;mesh(GEO.sph(0.22,6,5),BASIC(0xc9a6ff),Math.cos(t)*3.2,Math.sin(t)*3.2,0.35,g);}
  g.rotation.y=rot;onGround(g,x,z,-0.6);
  const cs=Math.cos(rot),sn=Math.sin(rot);for(const d of[-3.2,3.2])colCylT(x+cs*d,z-sn*d,0.55,2.5);
}
/* Solarpunk, perto da porta final: painéis e cata-ventos (as pás giram), flores e arbustos */
function solarRow(x,z,n){
  for(let i=0;i<n;i++){const px=x+(i-(n-1)/2)*3.0,g=new THREE.Group();
    outline(mesh(GEO.cyl(0.08,0.08,1.2,6),M(0xcfcab8),0,0.6,0,g),1.05);
    const pn=outline(mesh(GEO.box(2.6,0.08,1.6),C_SOLAR,0,1.3,0,g),1.04);pn.rotation.x=-0.55;
    onGround(g,px,z,0);colCylT(px,z,0.4,1.4);}
}
function windmill(x,z){
  const g=new THREE.Group();outline(mesh(GEO.cyl(0.18,0.32,9,8),M(0xe9dcbc),0,4.5,0,g),1.04);outline(mesh(GEO.box(0.6,0.5,0.9),M(0xe9dcbc),0,9.1,0,g),1.04);
  const rot=new THREE.Group();rot.position.set(0,9.1,0.55);g.add(rot);
  for(let k=0;k<3;k++){const a=k*TAU/3,b=outline(mesh(GEO.box(0.32,3.4,0.06),M(0xe9dcbc),-Math.sin(a)*1.8,Math.cos(a)*1.8,0,rot),1.05);b.rotation.z=a;}
  mesh(GEO.sph(0.22,8,6),M(0xd8a24a),0,0,0.05,rot);mergeLocalTree(rot);
  onGround(g,x,z,0);colCylT(x,z,0.4,9);spinners.push({o:rot,s:0.9});
}
function gardenPatch(x,z,R){
  const g=new THREE.Group();
  for(let k=0;k<5;k++){const b=mesh(GEO.sph(0.5+R()*0.5,7,5),M(k%2?0x4a9a4a:0x78b84a),(R()-0.5)*3,0.3,(R()-0.5)*3,g);b.scale.y=0.7;}
  for(let k=0;k<8;k++)mesh(GEO.sph(0.13,6,4),BASIC(k%2?0xffd24a:0xffffff),(R()-0.5)*3.4,0.65+R()*0.3,(R()-0.5)*3.4,g);
  onGround(g,x,z,-0.1);
}

function mesa(x,z,s,R){
  const g=new THREE.Group(),rc=[0xb8895a,0xa57848,0xc89a68];
  const base=outline(mesh(GEO.cyl(3.2*s,4.2*s,5*s,7),M(rc[1]),0,2.2*s,0,g),1.02);base.rotation.y=R()*3;
  const mid=outline(mesh(GEO.cyl(2.4*s,3.0*s,3.4*s,6),M(rc[0]),0.4*s,6.2*s,0.2*s,g),1.02);mid.rotation.y=R()*3;
  const top=mesh(GEO.cyl(2.6*s,2.4*s,0.7*s,6),M(rc[2]),0.3*s,8.2*s,0.1*s,g);top.rotation.y=R()*3;
  for(let k=0;k<4;k++){const a=R()*TAU,r=new THREE.Mesh(new THREE.DodecahedronGeometry((0.8+R()*0.9)*s,0),M(rc[k%3]));r.position.set(Math.cos(a)*4.6*s,0.4*s,Math.sin(a)*4.6*s);r.rotation.set(R()*3,R()*3,R()*3);g.add(r);}
  onGround(g,x,z,-0.6);colCylT(x,z,4.2*s,9*s);
}
function rockCluster(x,z,R){
  const rc=[0xb8895a,0xa57848,0xc89a68],n=2+Math.floor(R()*3);
  for(let k=0;k<n;k++){const s=0.5+R()*1.3,px=x+(R()-0.5)*4,pz=z+(R()-0.5)*4,r=outline(new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),M(rc[k%3])),1.06);r.scale.y=0.55+R()*0.4;r.rotation.set(R()*3,R()*3,R()*3);onGround(r,px,pz,s*0.15);if(s>1.1)colCylT(px,pz,s*0.8,s*1.0);}
}
function buildDressing(){
  const R=rng(2024);
  const avoid=[[0,150,30],[-70,140,26],[0,-125,18]];
  for(const d of INSC)avoid.push([d.x,d.z,6]);
  for(const f of SEC_FRAGS)avoid.push([f.x,f.z,7]);for(const c of SEC_CHESTS)avoid.push([c.x,c.z,7]);for(const d of SEC_INSC)avoid.push([d.x,d.z,6]);
  for(const k in TOMBS){const T=TOMBS[k];avoid.push([T.x,T.z,20]);}
  const place=(x,z,r,fn)=>{for(let t=0;t<6;t++){const ox=t?x+(R()-0.5)*8*t:x,oz=t?z+(R()-0.5)*8*t:z;if(dressFree(ox,oz,r,avoid)){fn(ox,oz);avoid.push([ox,oz,r]);return true;}}return false;};
  /* estruturas por era, perto da tumba da mesma era e fora da estrada */
  const smoke=[];
  place(132,-58,1.2,(x,z)=>smoke.push(chimney(x,z,9)));place(66,-122,1.2,(x,z)=>smoke.push(chimney(x,z,7)));
  place(124,-132,3,(x,z)=>pipeRun(x,z,0.6,8));place(140,-96,3,(x,z)=>pipeRun(x,z,-1.1,7));
  place(-152,-46,3.2,(x,z)=>truckWreck(x,z,0.7,0.08));place(-108,-58,3.2,(x,z)=>truckWreck(x,z,-2.2,-0.1));
  for(const[x,z]of[[-118,-22],[-124,4],[-168,8],[-160,-28]])place(x,z,0.6,(x,z)=>decoLamp(x,z));
  place(-140,72,1.5,(x,z)=>dish(x,z,0.8));place(-62,66,1.5,(x,z)=>dish(x,z,-0.6));place(-134,138,3.6,(x,z)=>bunker(x,z,0.4));
  for(const[x,z,s]of[[140,62,1.3],[146,70,0.9],[136,74,0.7],[88,124,1.1],[96,130,0.8],[152,100,1.0],[70,98,0.8]])place(x,z,1.2*s,(x,z)=>mushroom(x,z,s,R));
  place(128,128,3.6,(x,z)=>rootArch(x,z,0.5));place(74,58,3.6,(x,z)=>rootArch(x,z,-0.9));
  place(-42,-118,1.6,(x,z)=>solarRow(x,z,4));place(42,-118,1.6,(x,z)=>solarRow(x,z,4));place(-30,-100,1.6,(x,z)=>solarRow(x,z,3));
  place(-58,-150,0.6,(x,z)=>windmill(x,z));place(56,-152,0.6,(x,z)=>windmill(x,z));place(-70,-128,0.6,(x,z)=>windmill(x,z));
  for(const[x,z]of[[-24,-112],[24,-112],[-36,-136],[36,-136],[-18,-96],[20,-98],[-50,-108],[50,-104]])place(x,z,1.8,(x,z)=>gardenPatch(x,z,R));
  /* ruínas de muro e colunas caídas espalhadas */
  for(const[x,z,rot,len]of[[40,60,0.4,9],[-40,30,-0.8,7],[60,-70,1.2,8],[-80,-90,0.2,10],[100,10,-0.3,7],[-30,-50,1.0,6],[30,110,0.9,6],[-100,40,1.6,7]])place(x,z,2,(x,z)=>wallRuin(x,z,rot,len,R));
  for(const[x,z,rot]of[[24,30,0.3],[-26,-20,1.9],[70,-10,2.6],[-60,10,0.9],[20,-60,1.3],[-46,90,2.2]])place(x,z,2.2,(x,z)=>fallenColumn(x,z,rot));
  /* vegetação do deserto: cactos, arbustos secos e capim */
  /* mesas de rocha emoldurando o vale, perto da borda */
  for(let k=0;k<11;k++){const a=k/11*TAU+0.25+R()*0.2,d=164+R()*12;place(Math.cos(a)*d,Math.sin(a)*d,4.6,(x,z)=>mesa(x,z,0.8+R()*0.5,R));}
  /* manchas de vegetação: cada mancha junta cactos, arbustos, capim e pedras; e mais um pouco espalhado */
  const spots=[];for(let i=0;i<120&&spots.length<26;i++){const a=R()*TAU,d=30+Math.sqrt(R())*140,x=Math.cos(a)*d,z=Math.sin(a)*d;if(flatMask(x,z)<0.6&&Math.abs(x)>16&&spots.every(p=>Math.hypot(p[0]-x,p[1]-z)>24))spots.push([x,z]);}
  let nc=0,ns=0,nt=0;
  for(const[cx,cz]of spots){
    for(let k=0;k<3;k++)if(place(cx+(R()-0.5)*16,cz+(R()-0.5)*16,1.0,(x,z)=>cactus(x,z,0.9+R()*0.7,R)))nc++;
    for(let k=0;k<4;k++)if(place(cx+(R()-0.5)*18,cz+(R()-0.5)*18,0.7,(x,z)=>shrub(x,z,1.0+R()*0.8,R)))ns++;
    for(let k=0;k<9;k++){const x=cx+(R()-0.5)*20,z=cz+(R()-0.5)*20;if(Math.hypot(x,z)<182&&flatMask(x,z)<0.85&&Math.abs(x)>11){tuft(x,z,R);nt++;}}
    if(R()<0.7)place(cx+(R()-0.5)*14,cz+(R()-0.5)*14,2.5,(x,z)=>rockCluster(x,z,R));
  }
  for(let i=0;i<200&&nc<84;i++){const a=R()*TAU,d=25+Math.sqrt(R())*155;if(place(Math.cos(a)*d,Math.sin(a)*d,1.0,(x,z)=>cactus(x,z,0.8+R()*0.7,R)))nc++;}
  for(let i=0;i<260&&ns<130;i++){const a=R()*TAU,d=20+Math.sqrt(R())*160;if(place(Math.cos(a)*d,Math.sin(a)*d,0.7,(x,z)=>shrub(x,z,0.9+R()*0.8,R)))ns++;}
  for(let i=0;i<500&&nt<330;i++){const a=R()*TAU,d=12+Math.sqrt(R())*170,x=Math.cos(a)*d,z=Math.sin(a)*d;if(Math.hypot(x,z)<182&&flatMask(x,z)<0.85&&Math.abs(x)>11){tuft(x,z,R);nt++;}}
  /* beira da Estrada das Eras: capim, arbustos e um cacto de vez em quando, sem fechar o caminho */
  for(let z=-128;z<160;z+=2.6){
    const sd=R()<0.5?-1:1,x=sd*(14+R()*9);if(Math.hypot(x,z)<182&&!avoid.some(p=>Math.hypot(x-p[0],z-p[1])<p[2])){tuft(x,z,R);nt++;}
    if(R()<0.3)place(-sd*(15+R()*10),z+(R()-0.5)*3,0.7,(x,z)=>{shrub(x,z,0.8+R()*0.6,R);ns++;});
    if(R()<0.09)place(sd*(17+R()*10),z+(R()-0.5)*3,1.0,(x,z)=>{cactus(x,z,0.9+R()*0.6,R);nc++;});
  }
  dressCount={cactos:nc,arbustos:ns,capim:nt,manchas:spots.length};
  dressSmoke=smoke;
}
let dressSmoke=[],dressCount=null;
function updateDressing(dt){
  if(Math.random()<dt*1.4&&dressSmoke.length){const s=dressSmoke[Math.floor(Math.random()*dressSmoke.length)];if(Math.abs(G.p.x-s.x)+Math.abs(G.p.z-s.z)<160)puff(s.x,s.y,s.z,{vy:2.4,size:1.6,grow:2.6,op:0.35,life:2.8,color:0xe8dccb});}
}
