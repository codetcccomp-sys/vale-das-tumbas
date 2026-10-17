/* ====================== luzes (quantidade fixa, para não recompilar shader ao trocar de área) ====================== */
const sun=new THREE.DirectionalLight(0xfff0d0,1);scene.add(sun);scene.add(sun.target);
const hemi=new THREE.HemisphereLight(0xcfe0ff,0x9a7040,0.8);scene.add(hemi);
const torch=new THREE.SpotLight(0xffe6b0,0,26,0.55,0.7,1);scene.add(torch);scene.add(torch.target);
const fill=new THREE.PointLight(0xffc890,0,7,1);scene.add(fill);
const lampL=new THREE.PointLight(0xff9a40,0,16,1);scene.add(lampL);

/* ====================== céu, estrelas, sol e lua ====================== */
const skyMat=new THREE.ShaderMaterial({uniforms:{top:{value:new THREE.Color(0x86aedc)},bot:{value:new THREE.Color(0xe9c48c)}},
  vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 top;uniform vec3 bot;varying float h;void main(){float t=smoothstep(-0.05,0.62,h);gl_FragColor=vec4(mix(bot,top,t),1.0);}',
  side:THREE.BackSide,depthWrite:false,fog:false});
const sky=new THREE.Mesh(new THREE.SphereGeometry(700,20,12),skyMat);sky.frustumCulled=false;sky.renderOrder=-10;scene.add(sky);
const starsGeo=new THREE.BufferGeometry(),sp=[],sr=rng(99);
for(let i=0;i<380;i++){const u=sr()*TAU,v=0.05+sr()*0.95,r=Math.sqrt(1-v*v);sp.push(Math.cos(u)*r*650,v*650,Math.sin(u)*r*650);}
starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({size:2.2,sizeAttenuation:false,color:0xffffff,transparent:true,opacity:0,fog:false,depthWrite:false}));
stars.frustumCulled=false;scene.add(stars);
const sunSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xffe3a0,fog:false,depthWrite:false,blending:THREE.AdditiveBlending,transparent:true}));sunSpr.scale.set(170,170,1);scene.add(sunSpr);
const moonTex=canvasTex(64,64,(g)=>{g.fillStyle='#e8eeff';g.beginPath();g.arc(32,32,24,0,TAU);g.fill();g.fillStyle='rgba(150,165,200,.5)';g.beginPath();g.arc(24,26,6,0,TAU);g.arc(38,38,4,0,TAU);g.fill();});
const moonSpr=new THREE.Sprite(new THREE.SpriteMaterial({map:moonTex,fog:false,depthWrite:false,transparent:true}));moonSpr.scale.set(60,60,1);scene.add(moonSpr);

const DAY_LEN=480;let NIGHT=0;
const C={nT:new THREE.Color(0x0b1233),nB:new THREE.Color(0x1d2c5a),dT:new THREE.Color(0x86aedc),dB:new THREE.Color(0xe9c48c),tT:new THREE.Color(0x4a4f9a),tB:new THREE.Color(0xff9c5c),a:new THREE.Color(),b:new THREE.Color(),fog:new THREE.Color(0xe9c48c),warm:new THREE.Color(0xff9a60),hn:new THREE.Color(0x6a7cc0),hd:new THREE.Color(0xcfe0ff),hw:new THREE.Color(0xffb080),gn:new THREE.Color(0x3a3450),gd:new THREE.Color(0x8a6a44)};
function updateSky(){
  const a=G.time*TAU,e=Math.sin(a);
  const day=smooth(0,0.4,e),night=smooth(0.05,-0.25,e),tw=(1-day)*(1-night);
  NIGHT=night;
  C.a.copy(C.nT).lerp(C.dT,day).lerp(C.tT,tw*0.85);C.b.copy(C.nB).lerp(C.dB,day).lerp(C.tB,tw*0.9);
  skyMat.uniforms.top.value.copy(C.a);skyMat.uniforms.bot.value.copy(C.b);C.fog.copy(C.b);
  if(G.area===valeArea){
    scene.fog.color.copy(C.fog);scene.fog.near=40;scene.fog.far=lerp(260,420,day);
    if(e>-0.02){
      sun.position.set(Math.cos(a)*200,Math.sin(a)*200+8,70);sun.color.setHex(0xfff0d8).lerp(C.warm,tw*0.8);
      sun.intensity=lerp(0.06,0.25,smooth(-0.02,0.1,e))+0.55*smooth(0,0.35,e);
    }else{sun.position.set(-60,120,40);sun.color.setHex(0x8fa8ff);sun.intensity=0.3*night;}
    hemi.color.copy(C.hn).lerp(C.hd,day).lerp(C.hw,tw*0.5);hemi.groundColor.copy(C.gn).lerp(C.gd,day);hemi.intensity=lerp(0.95,0.52,day);
  }
  stars.material.opacity=night*0.9;
  const d=new THREE.Vector3(Math.cos(a),Math.sin(a),0.12).normalize();
  sunSpr.position.copy(camera.position).addScaledVector(d,600);sunSpr.visible=e>-0.12;sunSpr.material.opacity=smooth(-0.12,0.05,e);
  moonSpr.position.copy(camera.position).addScaledVector(d,-600);moonSpr.visible=e<0.1;
  sky.position.copy(camera.position);stars.position.copy(camera.position);
}

/* ====================== terreno ====================== */
function smoothstepInv(a,b,x){return smooth(a,b,x);}
function roadMask(x,z){return(1-smooth(3,15,Math.abs(x)))*smooth(-160,-140,z)*smooth(185,165,z);}
const FLATS=[[0,150,28],[-70,140,26],[100,-90,28],[-140,-10,28],[-100,100,28],[110,90,28],[0,-125,40],[50,0,14]];
/* trilhas da Estrada das Eras até a porta de cada tumba (pontos de controle da linha; 04c-trails.js desenha e marca) */
const TRAILS=[
  {key:'steam',pts:[[11,-45],[44,-50],[70,-72],[91,-88]]},
  {key:'diesel',pts:[[-11,-15],[-55,-20],[-98,-9],[-131,-10]]},
  {key:'atom',pts:[[-11,105],[-38,113],[-58,111],[-78,105],[-91,101]]},
  {key:'bio',pts:[[11,105],[45,98],[75,94],[101,90]]}
];
for(const t of TRAILS){let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(const p of t.pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[1]);z1=Math.max(z1,p[1]);}t.box=[x0-8,x1+8,z0-8,z1+8];}
function trailDist(t,x,z){let best=1e9;const P=t.pts;for(let i=0;i<P.length-1;i++){const ax=P[i][0],az=P[i][1],dx=P[i+1][0]-ax,dz=P[i+1][1]-az,L=dx*dx+dz*dz;
  const u=clamp(((x-ax)*dx+(z-az)*dz)/L,0,1),ex=ax+dx*u-x,ez=az+dz*u-z,d=ex*ex+ez*ez;if(d<best)best=d;}return Math.sqrt(best);}
function trailMask(x,z){let m=0;for(const t of TRAILS){const b=t.box;if(x<b[0]||x>b[1]||z<b[2]||z>b[3])continue;m=Math.max(m,1-smooth(2.2,6,trailDist(t,x,z)));}return m;}
function flatMask(x,z){let m=Math.max(roadMask(x,z),trailMask(x,z)*0.9);for(const f of FLATS){const d=Math.hypot(x-f[0],z-f[1]);m=Math.max(m,1-smooth(f[2],f[2]+26,d));}return m;}
function duneH(x,z){return Math.sin(x*0.021+1.3)*0.9+Math.sin(z*0.017-0.4)*0.8+Math.sin((x+z)*0.011+2)*1.3+Math.sin(x*0.07+z*0.03)*Math.sin(z*0.06-x*0.02)*0.35;}
function terrainH(x,z){const r=Math.hypot(x,z);const rim=smooth(196,252,r)*(16+5*Math.sin(Math.atan2(z,x)*5+1));return duneH(x,z)*(1-flatMask(x,z))+rim;}
function buildTerrain(){
  const SZ=620,SEG=124,g=new THREE.PlaneGeometry(SZ,SZ,SEG,SEG);g.rotateX(-Math.PI/2);
  const pos=g.attributes.position,cols=new Float32Array(pos.count*3);
  const c1=new THREE.Color(0xc98f4c),c2=new THREE.Color(0xa86f34),c3=new THREE.Color(0xdeb376),t=new THREE.Color();
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),z=pos.getZ(i),h=terrainH(x,z);pos.setY(i,h);
    const n=0.5+0.5*Math.sin(x*0.09)*Math.sin(z*0.08+1);
    t.copy(c1).lerp(c2,clamp(h*0.1+n*0.45,0,1)).lerp(c3,roadMask(x,z)*0.65);cols[i*3]=t.r;cols[i*3+1]=t.g;cols[i*3+2]=t.b;
  }
  g.setAttribute('color',new THREE.BufferAttribute(cols,3));g.computeVertexNormals();
  return new THREE.Mesh(g,new THREE.MeshToonMaterial({vertexColors:true,gradientMap:GRAD}));
}

/* ====================== construtores de ruínas ====================== */
function gearMesh(R,teeth,thick,color,emissive){
  const g=new THREE.Group(),mat=M(color,emissive?{emissive}:null);
  const disc=mesh(GEO.cyl(R*0.86,R*0.86,thick,22),mat,0,0,0,g);disc.rotation.x=Math.PI/2;outline(disc,1.04);
  const hub=mesh(GEO.cyl(R*0.28,R*0.28,thick*1.5,10),M(0x3a2c20),0,0,0,g);hub.rotation.x=Math.PI/2;
  for(let i=0;i<teeth;i++){const a=i/teeth*TAU,b=mesh(GEO.box(R*0.26,R*0.22,thick),mat,Math.cos(a)*R*0.95,Math.sin(a)*R*0.95,0,g);b.rotation.z=a;}
  return g;
}
const valeArea=makeArea('vale');valeArea.terrain=terrainH;valeArea.bound=203;valeArea.killY=-60;valeArea.spawn={x:0,z:150,face:Math.PI};
scene.add(valeArea.group);
const VG=valeArea.group,R=rng(7);
const TOMBS={
  steam:{name:'Tumba das Engrenagens',era:'Steampunk',color:0xc8743a,css:'#c8743a',x:100,z:-90,face:[-1,0],label:'NE'},
  diesel:{name:'Tumba dos Motores',era:'Dieselpunk',color:0x6fd3ff,css:'#6fd3ff',x:-140,z:-10,face:[1,0],label:'W'},
  atom:{name:'Tumba do Reator',era:'Atompunk',color:0x5dff7a,css:'#5dff7a',x:-100,z:100,face:[1,0],label:'SW'},
  bio:{name:'Tumba Viva',era:'Biopunk',color:0xb98cff,css:'#b98cff',x:110,z:90,face:[-1,0],label:'SE'},
  final:{name:'Cidade-Jardim',era:'Solarpunk',color:0xffd24a,css:'#ffd24a',x:0,z:-165,face:[0,1],label:'N'}
};
const COMPASS=[{label:'N',x:0,z:-165,css:'#ffd24a'},{label:'NE',x:100,z:-90,css:'#c8743a'},{label:'W',x:-140,z:-10,css:'#6fd3ff'},{label:'SW',x:-100,z:100,css:'#5dff7a'},{label:'SE',x:110,z:90,css:'#b98cff'},{label:'S',x:0,z:150,css:'#ecdcb4'}];
const flames=[],glows=[],spinners=[],inscList=[];

function addTerrainMesh(){const t=buildTerrain();VG.add(t);}
/* colisores do Vale medidos a partir do chão local: nas dunas o terreno sobe até ~3 m e um colisor fixo em y=0 ficaria enterrado */
function colCylT(x,z,r,h){const t=terrainH(x,z);return colCyl(valeArea,x,z,r,t-2,t+h);}
function colBoxT(x0,x1,z0,z1,h){const t=terrainH((x0+x1)/2,(z0+z1)/2);return colBox(valeArea,x0,x1,z0,z1,t-2,t+h);}
function onGround(obj,x,z,dy){obj.position.set(x,terrainH(x,z)+(dy||0),z);VG.add(obj);return obj;}

/* acampamento */
function buildCamp(){
  const cx=0,cz=150;
  for(let i=0;i<3;i++){
    const a=-0.9+i*1.2,x=cx+Math.sin(a)*10,z=cz+7+Math.cos(a)*4;
    const t=new THREE.Group();
    outline(mesh(GEO.cone(2.4,2.9,6),M(i===1?0xb9533a:0xd7c39a),0,1.45,0,t),1.05);
    mesh(GEO.box(0.9,1.5,0.1),M(0x2a1a10),0,0.75,2.1,t).rotation.y=0;
    t.rotation.y=-a+Math.PI;onGround(t,x,z);colCylT(x,z,2.1,3);
  }
  const fire=new THREE.Group();
  for(let i=0;i<4;i++){const l=mesh(GEO.cyl(0.1,0.1,1.2,6),M(0x4a2c18),0,0.14,0,fire);l.rotation.z=Math.PI/2;l.rotation.y=i*0.8;}
  const flame=mesh(GEO.cone(0.34,0.9,6),BASIC(0xffa030),0,0.6,0,fire);flames.push(flame);
  mesh(GEO.cone(0.2,0.6,6),BASIC(0xffe080),0,0.55,0,fire);
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xff9a40,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.3}));gl.scale.set(7,7,1);gl.position.y=1;fire.add(gl);glows.push(gl);
  onGround(fire,cx+3,cz-1);colCylT(cx+3,cz-1,0.8,1.2);
  const pole=new THREE.Group();mesh(GEO.cyl(0.07,0.09,5,6),M(0x4a2c18),0,2.5,0,pole);mesh(GEO.box(1.4,0.8,0.04),M(0xb8392a),0.75,4.5,0,pole);onGround(pole,cx-4,cz+4);
  const desk=new THREE.Group();outline(mesh(GEO.box(1.6,0.9,0.9),M(0x6b4326),0,0.45,0,desk));mesh(GEO.box(0.7,0.08,0.5),M(0xecdcb4),0,0.95,0,desk).rotation.x=-0.25;onGround(desk,cx-3,cz-2);colBoxT(cx-3.9,cx-2.1,cz-2.55,cz-1.45,1.2);
  const mark=mesh(new THREE.CircleGeometry(3.2,28),BASIC(0xffffff,{map:eyeTexture('#7a5320'),transparent:true,opacity:0.8,depthWrite:false}),0,0,0);mark.rotation.x=-Math.PI/2;onGround(mark,cx,cz-9,0.05);
  valeArea.interact.push({x:cx-3,z:cz-2,r:2.6,label:()=>'Abrir o caderno de campo',use:()=>openDiary()});
}

/* oásis com estufa em ruínas */
function buildOasis(){
  const ox=-70,oz=140;
  const pond=mesh(new THREE.CircleGeometry(8,32),BASIC(0x3a86a8,{transparent:true,opacity:0.88}),0,0,0);pond.rotation.x=-Math.PI/2;onGround(pond,ox,oz,0.06);
  const rim=mesh(new THREE.RingGeometry(8,9.2,32),M(0xb89a68),0,0,0);rim.rotation.x=-Math.PI/2;onGround(rim,ox,oz,0.05);
  colCylT(ox,oz,6.2,0.15);
  for(let i=0;i<7;i++){
    const a=i/7*TAU+0.3,rr=10.5+R()*3,x=ox+Math.cos(a)*rr,z=oz+Math.sin(a)*rr,p=new THREE.Group();
    const tr=outline(mesh(GEO.cyl(0.18,0.3,5.2,6),M(0x6b4326),0,2.6,0,p),1.1);tr.rotation.z=(R()-0.5)*0.2;
    for(let k=0;k<6;k++){const l=mesh(GEO.cone(0.42,3.2,4),M(0x3f7a3a),0,5.2,0,p);l.scale.set(1,1,0.25);l.rotation.z=1.15;l.rotation.y=k/6*TAU;l.position.x=0;l.translateX(1.2);}
    onGround(p,x,z);colCylT(x,z,0.45,6);
  }
  const gh=new THREE.Group(),glass=BASIC(0x9fe8d0,{transparent:true,opacity:0.22,side:THREE.DoubleSide});
  for(const[px,pz]of[[-4,-2.5],[4,-2.5],[-4,2.5],[4,2.5]]){mesh(GEO.box(0.18,3.2,0.18),M(0x8a8f8a),px,1.6,pz,gh);}
  mesh(GEO.box(8.2,0.16,0.16),M(0x8a8f8a),0,3.2,-2.5,gh);mesh(GEO.box(8.2,0.16,0.16),M(0x8a8f8a),0,3.2,2.5,gh);
  const roof=mesh(GEO.box(8.2,0.12,5.2),glass,0,3.6,0,gh);roof.rotation.z=0.0;
  mesh(new THREE.PlaneGeometry(8,3),glass,0,1.6,-2.5,gh);mesh(new THREE.PlaneGeometry(4,3),glass,-4,1.6,0,gh).rotation.y=Math.PI/2;
  for(let i=0;i<9;i++)mesh(GEO.sph(0.4+R()*0.3,6,5),M(0x4a8a3a),(R()-0.5)*6,0.3,(R()-0.5)*3.4,gh);
  onGround(gh,ox-20,oz-10);for(const[px,pz]of[[-4,-2.5],[4,-2.5],[-4,2.5],[4,2.5]])colCylT(ox-20+px,oz-10+pz,0.35,4);
  valeArea.interact.push({x:ox+7.5,z:oz-3,r:3.6,label:()=>G.hearts<3?'Beber a água fresca do oásis':'Água fresca do oásis',use:()=>healOasis()});
}

/* colunas da Estrada das Eras: a era muda ao longo do caminho */
function column(era,x,z){
  const c=new THREE.Group();
  if(era==='steam'){outline(mesh(GEO.cyl(0.55,0.68,7,10),M(0xb8703a),0,3.5,0,c));for(const y of[1.2,3.5,5.8])mesh(GEO.tor(0.66,0.07,6,14),M(0xd8a24a),0,y,0,c).rotation.x=Math.PI/2;const g=gearMesh(0.9,8,0.2,0xd8a24a);g.position.y=7.5;c.add(g);spinners.push({o:g,s:0.5});}
  else if(era==='diesel'){outline(mesh(GEO.box(1.7,1.1,1.7),M(0x3a3f48),0,0.55,0,c));outline(mesh(GEO.box(1.1,5.4,1.1),M(0x4a505c),0,3.8,0,c));outline(mesh(GEO.box(1.6,0.5,1.6),M(0x3a3f48),0,6.7,0,c));mesh(GEO.box(0.2,5,0.1),BASIC(0xcfd8e0),0,3.8,0.58,c);}
  else if(era==='atom'){outline(mesh(GEO.cyl(0.5,0.62,6.4,12),M(0xe9e4d4),0,3.2,0,c));const t=mesh(GEO.tor(0.56,0.06,6,16),BASIC(0x5dff7a),0,4.6,0,c);t.rotation.x=Math.PI/2;outline(mesh(GEO.sph(0.62,10,8),M(0xff9a3a),0,6.9,0,c));}
  else{for(let k=0;k<3;k++){const b=mesh(GEO.cyl(0.18,0.34,7,6),M(0x7a5aa8),Math.cos(k*2.1)*0.35,3.5,Math.sin(k*2.1)*0.35,c);b.rotation.z=Math.sin(k*2.1)*0.12;b.rotation.x=Math.cos(k*2.1)*0.12;}
    for(let k=0;k<4;k++)mesh(GEO.sph(0.2,6,5),BASIC(0xc9a6ff),Math.cos(k*1.7)*0.5,2+k*1.3,Math.sin(k*1.7)*0.5,c);}
  onGround(c,x,z);colCylT(x,z,0.75,8);
}
function buildRoad(){for(let z=120;z>=-120;z-=30){const era=z>90?'steam':z>30?'diesel':z>-30?'atom':'bio';column(era,-9,z);column(era,9,z);}}

/* ruínas das eras, mais densas perto da tumba da mesma era */
function bigGear(x,z,R2,rotY){const g=gearMesh(R2,12,R2*0.18,0x8a6a3a);g.rotation.set(1.25,rotY,0);onGround(g,x,z,-R2*0.28);colCylT(x,z,R2*0.5,R2*0.7);}
function airship(x,z,rotY){
  const a=new THREE.Group();const hull=outline(mesh(GEO.sph(1,12,8),M(0x6f7468),0,1.3,0,a),1.03);hull.scale.set(9,3,3);
  for(let i=-3;i<=3;i++){const r=mesh(GEO.tor(2.95,0.1,5,14),M(0x4a4f48),i*2.3,1.3,0,a);r.rotation.y=Math.PI/2;r.scale.set(1,1,1);}
  mesh(GEO.box(2.6,0.12,0.9),M(0x4a4f48),-8,1.8,0,a);mesh(GEO.box(0.12,2.4,0.9),M(0x4a4f48),-8.2,2.6,0,a);
  onGround(a,x,z,-0.4);a.rotation.y=rotY;for(const o of[-5,0,5])colCylT(x+Math.cos(rotY)*o,z-Math.sin(rotY)*o,3,4.5);
}
function antenna(x,z,h){const a=new THREE.Group();outline(mesh(GEO.cyl(0.1,0.18,h,6),M(0xcfcab8),0,h/2,0,a));for(const y of[h*0.5,h*0.72,h*0.9])mesh(GEO.box(2.6-y/h,0.1,0.1),M(0xcfcab8),0,y,0,a);mesh(GEO.sph(0.2,6,5),BASIC(0xff4a3a),0,h+0.2,0,a);onGround(a,x,z);colCylT(x,z,0.5,h);}
function ruinGreenhouse(x,z,rotY){const g=new THREE.Group(),glass=BASIC(0xb9a6ff,{transparent:true,opacity:0.2,side:THREE.DoubleSide});for(const[px,pz]of[[-3,-2],[3,-2],[-3,2],[3,2]])mesh(GEO.box(0.16,2.8,0.16),M(0x7a7a82),px,1.4,pz,g);mesh(GEO.box(6.2,0.14,0.14),M(0x7a7a82),0,2.8,-2,g);mesh(new THREE.PlaneGeometry(6,2.8),glass,0,1.4,2,g);for(let i=0;i<7;i++)mesh(GEO.sph(0.35+R()*0.35,6,5),M(i%2?0x7a5aa8:0x4a8a6a),(R()-0.5)*5,0.3,(R()-0.5)*3,g);g.rotation.y=rotY;onGround(g,x,z);for(const[px,pz]of[[-3,-2],[3,-2],[-3,2],[3,2]])colCylT(x+px*Math.cos(rotY)+pz*Math.sin(rotY),z-px*Math.sin(rotY)+pz*Math.cos(rotY),0.35,3);}
function deco(x,z,rotY){const g=new THREE.Group();outline(mesh(GEO.box(5,2.2,5),M(0x4a505c),0,1.1,0,g));outline(mesh(GEO.box(3.4,2.2,3.4),M(0x5a606c),0,3.3,0,g));outline(mesh(GEO.box(1.8,2.2,1.8),M(0x6a707c),0,5.5,0,g));mesh(GEO.box(0.3,6.5,0.1),BASIC(0xcfd8e0),2.52,2.2,0,g);g.rotation.y=rotY;onGround(g,x,z,-0.5);colBoxT(x-2.6,x+2.6,z-2.6,z+2.6,5);}
function boilerRuin(x,z,rotY){const b=new THREE.Group();const t=outline(mesh(GEO.cyl(1.5,1.5,5.5,12),M(0x7a4a2a),0,1,0,b));t.rotation.z=Math.PI/2;for(const dx of[-2,0,2])mesh(GEO.tor(1.52,0.1,5,14),M(0xb07a3a),dx,1,0,b).rotation.y=Math.PI/2;b.rotation.y=rotY;onGround(b,x,z,-0.2);colCylT(x,z,2.2,3);}
function rocks(){
  const rc=[0xb8895a,0xa57848,0xc89a68];
  for(let i=0;i<30;i++){const a=R()*TAU,d=15+Math.sqrt(R())*180,x=Math.cos(a)*d,z=Math.sin(a)*d;if(flatMask(x,z)>0.4)continue;const s=0.5+R()*1.6;
    const r=outline(new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),M(rc[i%3])),1.06);r.scale.y=0.6+R()*0.5;r.rotation.set(R()*3,R()*3,R()*3);onGround(r,x,z,s*0.2);if(s>1.2)colCylT(x,z,s*0.85,s*1.2);}
}

/* inscrições: brilham à noite e revelam pistas */
const INSC=[
  {id:'oasis',x:-62,z:122,t:'Inscrição do oásis',s:'Antes do ferro, havia a semente. O oásis lembra o que a cidade esqueceu.'},
  {id:'automato',x:45,z:8,t:'Inscrição do Autômato',s:'Todos os caminhos sobem. A Cidade-Jardim espera ao norte, atrás de quatro encaixes.'},
  {id:'steam',x:82,z:-62,t:'Inscrição do vapor',s:'Vapor e engrenagem: aprenda o ritmo do chão. Só pisa firme quem lê o olho.'},
  {id:'diesel',x:-118,z:14,t:'Inscrição do diesel',s:'Onde o farol aponta, a porta se abre. A luz obedece a quem a guia.'},
  {id:'atom',x:-82,z:72,t:'Inscrição do átomo',s:'A água esfria o que o átomo acende. Suba e desça com cuidado.'},
  {id:'bio',x:88,z:62,t:'Inscrição da vida',s:'Repita o que a tumba canta. Quem erra a canção acorda os que dormem.'}
];
function buildInscriptions(){
  INSC.forEach((d,i)=>{
    const mat=new THREE.MeshToonMaterial({color:0x8a7a62,gradientMap:GRAD,emissive:0xffb455,emissiveMap:glyphTexture(40+i),emissiveIntensity:0});
    const s=new THREE.Group();outline(mesh(GEO.box(1.7,2.5,0.38),mat,0,1.25,0,s),1.04);mesh(GEO.box(2.1,0.25,0.7),M(0x6a5c48),0,0.12,0,s);
    s.rotation.y=Math.atan2(-d.x,-d.z);onGround(s,d.x,d.z);colCylT(d.x,d.z,0.95,3);
    inscList.push({d,mat});
    valeArea.interact.push({x:d.x,z:d.z,r:2.9,label:()=>NIGHT>0.55?'Ler a inscrição':'Inscrição apagada',use:()=>readInscription(d)});
  });
}
function buildAutomatonStatue(){
  const g=new THREE.Group();outline(mesh(GEO.cyl(0.9,1,1.6,12),M(0xb08a3a),0,0.2,0,g),1.04);const h=outline(mesh(GEO.sph(0.62,10,8),M(0xc59a3e),0.5,1.55,0.2,g),1.05);
  mesh(GEO.sph(0.12,6,5),BASIC(0x4a2a10),0.35,1.65,0.74,g);mesh(GEO.sph(0.12,6,5),BASIC(0x4a2a10),0.75,1.65,0.7,g);
  const arm=outline(mesh(GEO.cyl(0.18,0.16,2.2,8),M(0xb08a3a),-1.3,1.4,0,g),1.05);arm.rotation.z=0.7;
  g.rotation.y=-0.6;onGround(g,50,-5,-0.7);colCylT(50,-5,1.3,3);
}

/* ====================== entradas das tumbas, torres e a porta final ====================== */
function axisBox(cx,cz,hw,hd,nx){return Math.abs(nx)===1?[cx-hd,cx+hd,cz-hw,cz+hw]:[cx-hw,cx+hw,cz-hd,cz+hd];}
const beams=[],orbs=[],finalSlots=[];
function buildSite(key){
  const T=TOMBS[key],nx=T.face[0],nz=T.face[1],tx=-nz,tz=nx,gy=terrainH(T.x,T.z);
  const grp=new THREE.Group();grp.position.set(T.x,gy,T.z);grp.rotation.y=Math.atan2(nx,nz);VG.add(grp);
  const stone=M(key==='steam'?0x7a4a2a:key==='diesel'?0x4a505c:key==='atom'?0xcfc9b4:0x6a4a8a),col=BASIC(T.color);
  for(const s of[-1,1])outline(mesh(GEO.box(1.5,6.4,1.5),stone,s*3.2,3.2,0,grp),1.03);
  outline(mesh(GEO.box(8.2,1.3,1.7),stone,0,6.7,0,grp),1.03);
  mesh(GEO.box(4.9,5.8,0.2),BASIC(0x050403),0,2.9,-0.45,grp);
  mesh(GEO.box(7,0.28,0.1),col,0,6.2,0.9,grp);
  mesh(new THREE.PlaneGeometry(1.3,1.3),new THREE.MeshBasicMaterial({map:eyeTexture('#'+T.color.toString(16).padStart(6,'0')),transparent:true,depthWrite:false}),0,7.1,0.88,grp);
  outline(mesh(GEO.box(9,6.6,1.4),stone,0,3.3,-1.7,grp),1.02);
  const tw=new THREE.Group();tw.position.set(0,0,-8);grp.add(tw);
  if(key==='steam'){outline(mesh(GEO.cyl(2,3.2,26,10),M(0xb8703a),0,13,0,tw),1.03);for(const y of[5,12,19])mesh(GEO.tor(2.8-y*0.04,0.22,6,16),M(0xd8a24a),0,y,0,tw).rotation.x=Math.PI/2;const g=gearMesh(2.6,12,0.5,0xd8a24a);g.position.set(0,24,2.2);tw.add(g);spinners.push({o:g,s:0.4});}
  else if(key==='diesel'){outline(mesh(GEO.box(5,12,5),M(0x4a505c),0,6,0,tw),1.02);outline(mesh(GEO.box(3.4,12,3.4),M(0x5a606c),0,18,0,tw),1.02);outline(mesh(GEO.box(2.2,6,2.2),M(0x6a707c),0,27,0,tw),1.02);mesh(GEO.cone(2.6,5,8),BASIC(0x6fd3ff,{transparent:true,opacity:0.45}),0,31,0,tw);}
  else if(key==='atom'){for(let k=0;k<3;k++){const l=mesh(GEO.cyl(0.2,0.45,28,5),M(0xcfc9b4),Math.cos(k*2.1)*1.5,13.5,Math.sin(k*2.1)*1.5,tw);l.rotation.z=-Math.cos(k*2.1)*0.09;l.rotation.x=Math.sin(k*2.1)*0.09;}for(const y of[6,12,18,24]){const r=mesh(GEO.tor(1.55-y*0.025,0.12,5,3),M(0xff9a3a),0,y,0,tw);r.rotation.x=Math.PI/2;}}
  else if(key==='bio'){for(let k=0;k<4;k++){const b=mesh(GEO.cyl(0.4,1.4,26,6),M(0x7a5aa8),Math.cos(k*1.57)*1.2,13,Math.sin(k*1.57)*1.2,tw);b.rotation.z=Math.cos(k*1.57)*0.08;b.rotation.x=-Math.sin(k*1.57)*0.08;}for(let k=0;k<8;k++)mesh(GEO.sph(0.5,6,5),BASIC(0xc9a6ff),Math.cos(k*1.3)*1.9,4+k*3,Math.sin(k*1.3)*1.9,tw);}
  const orb=mesh(GEO.sph(1.8,10,8),col,0,key==='steam'?29:key==='diesel'?33:key==='atom'?29.5:27.5,0,tw);orbs.push(orb);
  const beam=mesh(GEO.cyl(0.6,1.1,90,8,1,true),BASIC(T.color,{transparent:true,opacity:0.2,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}),0,orb.position.y+45,0,tw);beam.userData.key=key;beams.push(beam);
  const ps=axisBox(T.x+tx*3.2,T.z+tz*3.2,0.75,0.75,nx),pt=axisBox(T.x-tx*3.2,T.z-tz*3.2,0.75,0.75,nx),bw=axisBox(T.x-nx*1.7,T.z-nz*1.7,4.6,0.8,nx);
  colBox(valeArea,ps[0],ps[1],ps[2],ps[3],-3,8);colBox(valeArea,pt[0],pt[1],pt[2],pt[3],-3,8);colBox(valeArea,bw[0],bw[1],bw[2],bw[3],-3,8);
  colCyl(valeArea,T.x-nx*8,T.z-nz*8,3.4,-3,30);
  valeArea.interact.push({x:T.x+nx*3.4,z:T.z+nz*3.4,r:3.4,label:()=>T.name+' ('+T.era+')',use:()=>useTombDoor(key)});
  T.entry={x:T.x+nx*6,z:T.z+nz*6,face:Math.atan2(nx,nz)};T.tower=tw;
}
function buildFinal(){
  const T=TOMBS.final,w0=29.7,h=46;
  const pyr=outline(mesh(new THREE.ConeGeometry(42,h,4),M(0xe9dcbc),0,h/2,0),1.01);pyr.rotation.y=Math.PI/4;
  const g=new THREE.Group();g.add(pyr);
  const eye=mesh(new THREE.PlaneGeometry(11,11),new THREE.MeshBasicMaterial({map:eyeTexture('#d8a24a'),transparent:true,opacity:0.9,depthWrite:false}),0,24,w0*(1-24/h)+0.3);eye.rotation.x=-Math.atan(w0/h);g.add(eye);
  for(let i=0;i<46;i++){const side=Math.floor(R()*3),y=3+R()*34,w=w0*(1-y/h),u=(R()*2-1)*w*0.92;let x,z;if(side===0){x=u;z=w;}else if(side===1){x=w;z=u;}else{x=-w;z=u;}
    const bush=mesh(GEO.sph(0.8+R()*1.3,6,5),M(i%3?0x4a9a4a:0x78b84a),x*1.0,y,z*1.0,g);bush.scale.y=0.7;if(side===0)bush.position.z+=0.2;}
  for(let i=0;i<5;i++){const y=6+i*7,w=w0*(1-y/h);const band=mesh(GEO.box(w*2,0.5,0.4),M(0x2a4a7a),0,y,w+0.1,g);band.rotation.x=-0.1;}
  const crystal=mesh(new THREE.OctahedronGeometry(2.6),BASIC(0xffd24a),0,h+3.4,0,g);orbs.push(crystal);spinners.push({o:crystal,s:0.8});
  const beam=mesh(GEO.cyl(0.7,1.3,100,8,1,true),BASIC(0xffd24a,{transparent:true,opacity:0.2,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}),0,h+50,0,g);beam.userData.key='final';beams.push(beam);
  const porch=new THREE.Group();porch.position.set(0,0,w0+1.2);g.add(porch);
  outline(mesh(GEO.box(15,14,3),M(0xd8c9a0),0,7,0,porch),1.02);
  mesh(GEO.box(7.4,9.2,0.3),BASIC(0x070605),0,4.6,1.55,porch);
  for(let i=0;i<4;i++){const s=mesh(GEO.cyl(0.9,0.9,0.25,16),BASIC(0x3a3a3a),-4.5+i*3,11.4,1.6,porch);s.rotation.x=Math.PI/2;finalSlots.push(s);}
  mesh(GEO.box(8.4,0.5,0.4),BASIC(0xffd24a),0,9.5,1.6,porch);
  g.position.set(T.x,terrainH(T.x,T.z),T.z);VG.add(g);
  colBox(valeArea,-30,30,-195,-132.4,-3,60);
  valeArea.interact.push({x:0,z:-128.6,r:4.6,label:()=>relicCount()>=4?'CIDADE-JARDIM (TUMBA FINAL)':'Porta da Cidade-Jardim',use:()=>useFinalDoor()});
  T.entry={x:0,z:-124.5,face:0};T.tower=g;
}
function updateFinalSlots(){const keys=['steam','diesel','atom','bio'];finalSlots.forEach((s,i)=>{s.material.color.setHex(G.relics[keys[i]]?TOMBS[keys[i]].color:0x3a3a3a);});}

/* monta o Vale */
function buildVale(){
  addTerrainMesh();buildCamp();buildOasis();buildRoad();buildInscriptions();buildAutomatonStatue();
  for(const k of['steam','diesel','atom','bio'])buildSite(k);
  buildFinal();
  bigGear(88,-62,4.2,0.4);bigGear(112,-70,3,1.7);bigGear(78,-100,3.4,2.4);boilerRuin(116,-108,0.5);boilerRuin(90,-120,1.9);
  deco(-128,10,0.3);deco(-150,18,1.1);deco(-122,-30,2.2);airship(-120,34,0.5);
  antenna(-84,86,16);antenna(-112,82,20);antenna(-95,124,13);antenna(-70,100,18);
  ruinGreenhouse(96,70,0.6);ruinGreenhouse(130,110,2.3);ruinGreenhouse(118,60,1.2);
  buildTrails();rocks();buildSecrets();buildDressing();
}
function updateValeDynamic(dt,t){
  for(const f of flames){f.scale.set(1+Math.sin(t*9)*0.12,1+Math.sin(t*13)*0.18,1+Math.sin(t*11)*0.12);}
  for(const g of glows)g.material.opacity=0.25+NIGHT*0.4+Math.sin(t*7)*0.04;
  for(const s of spinners)s.o.rotation.z+=s.s*dt;
  updateSecrets(dt,t);updateDressing(dt);
  for(const o of orbs){const k=1+Math.sin(t*2.2)*0.06;o.scale.set(k,k,k);}
  /* feixes mais fortes de dia; o da tumba já vencida enfraquece e o dourado cresce a cada relíquia */
  const nRel=relicCount();for(const b of beams){const k=b.userData.key;b.material.opacity=(0.27+NIGHT*0.17)*(k==='final'?0.55+0.45*nRel/4:G.relics[k]?0.3:1);}
  for(const i of inscList)i.mat.emissiveIntensity=NIGHT>0.5?(NIGHT-0.5)*3.2:0;
  const st=TOMBS.steam.tower;if(st&&Math.random()<dt*2.2)puff(TOMBS.steam.x+TOMBS.steam.face[0]*-8,terrainH(TOMBS.steam.x,TOMBS.steam.z)+30,TOMBS.steam.z+TOMBS.steam.face[1]*-8,{vy:3,size:2.2,grow:3.2,op:0.45,life:3.2,color:0xf2e8d8});
}
