/* ====================== Tumba dos Motores (Dieselpunk) ======================
   Um arranha-céu art déco soterrado. A regra: direcionar o facho dos holofotes para acender sensores.
   Salão -> Sala dos Holofotes -> Sala do Elevador -> Sala da Luz Cruzada -> Câmara da vela de ignição.
   Cada toque em "Usar" vira o holofote um oitavo de volta (45 graus); o facho é visível e para nas paredes. */
const dieselArea=makeArea('diesel');dieselArea.key='diesel';dieselArea.killY=-5;dieselArea.metal=true;dieselArea.spawn={x:0,y:0,z:5,face:Math.PI};
dieselArea.fogColor=0x07090d;dieselArea.hemi=[0x4a5a70,0x14181e,0.66];dieselArea.lampColor=0xbfe4ff;dieselArea.ambience='diesel';
const DG=dieselArea.group;DG.visible=false;scene.add(DG);TOMB_AREAS.diesel=dieselArea;
const dsl={hints:{},gens:[],gates:[],floods:[],sensors:[],elev:null,guard:null,plug:null,relicTaken:false,spin:[],beamT:0,wasLit:{}};
const D_WALL=M(0x3b414b),D_WALL2=M(0x4a515d),D_DARK=M(0x15181d),D_STEEL=M(0x2f343d),D_CREAM=M(0xd9cfae),D_CEIL=M(0x1a1d23);
const CHROME=0xc9d3de;

function dbox(x0,x1,z0,z1,y0,y1,mat,col){const m=mesh(GEO.box(x1-x0,y1-y0,z1-z0),mat,(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,DG);if(col!==false)colBox(dieselArea,x0,x1,z0,z1,y0,y1);return m;}
function dCross(zc,half){
  dbox(-9.8,-half,zc-0.4,zc+0.4,-12,10,D_WALL);dbox(half,9.8,zc-0.4,zc+0.4,-12,10,D_WALL);dbox(-half,half,zc-0.4,zc+0.4,8.2,10,D_WALL,false);
  for(const s of[-1,1]){mesh(GEO.box(0.6,8.4,1.3),D_WALL2,s*(half+0.3),4.2,zc,DG);colBox(dieselArea,s*(half+0.3)-0.3,s*(half+0.3)+0.3,zc-0.72,zc+0.72,-2,8.4);mesh(GEO.box(0.08,8.2,0.14),BASIC(CHROME),s*(half+0.05),4.2,zc+0.72,DG);mesh(GEO.box(0.08,8.2,0.14),BASIC(CHROME),s*(half+0.05),4.2,zc-0.72,DG);}
  mesh(GEO.box(half*2+1.2,0.2,1.3),BASIC(0xd9cfae),0,8.1,zc,DG);
}
function dGate(zc){
  const g=new THREE.Group();g.position.set(0,0,zc);DG.add(g);
  outline(mesh(GEO.box(6,8.2,0.5),D_STEEL,0,4.1,0,g),1.02);
  for(let i=-2;i<=2;i++)mesh(GEO.box(0.12,8,0.7),BASIC(CHROME),i*1.1,4.1,0,g);
  mesh(GEO.box(5.4,0.14,0.72),BASIC(0xd9cfae),0,6.6,0,g);mesh(GEO.box(5.4,0.14,0.72),BASIC(0xd9cfae),0,1.6,0,g);
  mesh(new THREE.PlaneGeometry(1.5,1.5),new THREE.MeshBasicMaterial({map:eyeTexture('#6fd3ff'),transparent:true,depthWrite:false}),0,4.1,0.38,g);
  const c=colBox(dieselArea,-3,3,zc-0.3,zc+0.3,-12,9);
  const o={g,c,open:0,latched:false,zc};dsl.gates.push(o);return o;
}
function dPillar(x,z){
  const p=new THREE.Group();p.position.set(x,0,z);DG.add(p);
  outline(mesh(GEO.box(1.7,0.7,1.7),D_WALL2,0,0.35,0,p),1.03);outline(mesh(GEO.box(1.3,8.2,1.3),D_WALL,0,4.6,0,p),1.02);outline(mesh(GEO.box(1.7,0.5,1.7),D_WALL2,0,8.45,0,p),1.03);
  for(const s of[-1,1]){mesh(GEO.box(0.08,7.6,0.1),BASIC(CHROME),s*0.45,4.4,0.67,p);mesh(GEO.box(0.08,7.6,0.1),BASIC(CHROME),s*0.45,4.4,-0.67,p);}
  mesh(GEO.box(1.34,0.1,1.34),BASIC(0xd9cfae),0,1.4,0,p);mesh(GEO.box(1.34,0.1,1.34),BASIC(0xd9cfae),0,7.4,0,p);
  colCyl(dieselArea,x,z,0.85,-2,9);
}
function dEngine(x,z,w,d){
  const e=new THREE.Group();e.position.set(x,0,z);DG.add(e);
  outline(mesh(GEO.box(w,1.4,d),D_WALL2,0,0.7,0,e),1.03);outline(mesh(GEO.box(w*0.9,0.9,d*0.9),D_STEEL,0,1.85,0,e),1.03);
  for(let i=0;i<4;i++){const cx=-w*0.34+i*(w*0.68/3);outline(mesh(GEO.cyl(0.36,0.4,0.9,10),D_DARK,cx,2.75,0,e),1.05);mesh(GEO.cyl(0.42,0.42,0.1,10),BASIC(CHROME),cx,3.22,0,e);}
  const ex=outline(mesh(GEO.cyl(0.18,0.2,6,8),D_DARK,w*0.46,5.2,-d*0.3,e),1.06);
  mesh(GEO.box(w*0.96,0.07,0.04),BASIC(0xd9cfae),0,1.1,d*0.5+0.02,e);
  colBox(dieselArea,x-w/2,x+w/2,z-d/2,z+d/2,-2,3.4);
  dsl.spin.push({smoke:{x:x+w*0.46,y:8.3,z:z-d*0.3}});
}
function dCrate(x,z){const c=outline(mesh(GEO.box(1.2,1.0,1.2),M(0x5a5240),x,0.5,z,DG),1.04);mesh(GEO.box(1.24,0.08,1.24),BASIC(0xd9cfae),x,0.8,z,DG);colBox(dieselArea,x-0.6,x+0.6,z-0.6,z+0.6,-2,1.0);}
function dGen(x,z){
  const g=new THREE.Group();g.position.set(x,0,z);DG.add(g);
  outline(mesh(GEO.box(1.5,1.2,1.0),D_WALL2,0,0.6,0,g),1.03);
  outline(mesh(GEO.cyl(0.3,0.3,0.9,10),D_DARK,-0.4,1.65,0,g),1.05);outline(mesh(GEO.cyl(0.22,0.22,0.9,10),D_DARK,0.4,1.65,0,g),1.05);
  mesh(GEO.box(1.56,0.08,1.06),BASIC(CHROME),0,1.2,0,g);
  const ind=mesh(GEO.box(0.5,0.18,0.04),BASICU(0x5a1410),0,0.8,0.52,g);
  colBox(dieselArea,x-0.8,x+0.8,z-0.55,z+0.55,-2,2.2);
  const o={x,z,g,ind,lit:false,lamp:{x,y:2.0,z,on:false}};dsl.gens.push(o);dieselArea.lamps.push(o.lamp);
  dieselArea.interact.push({x,z,r:2.6,label:()=>o.lit?TXT.pointLabel:'Ligar o gerador',use:()=>useGen(o)});
  return o;
}
function dFlood(x,yb,z,step0){
  const g=new THREE.Group();g.position.set(x,yb,z);DG.add(g);
  outline(mesh(GEO.cyl(0.5,0.6,0.55,12),D_DARK,0,0.28,0,g),1.04);mesh(GEO.tor(0.52,0.04,5,14),BASIC(CHROME),0,0.5,0,g).rotation.x=Math.PI/2;
  outline(mesh(GEO.box(0.2,0.7,0.2),D_WALL2,0,0.85,0,g),1.04);
  const head=new THREE.Group();head.position.set(0,1.35,0);g.add(head);
  const hs=mesh(GEO.cyl(0.34,0.4,0.7,12),D_STEEL,0,0,0.1,head);hs.rotation.x=Math.PI/2;outline(hs,1.05);
  mesh(GEO.tor(0.36,0.04,6,14),BASIC(CHROME),0,0,0.45,head);
  const lens=mesh(GEO.cyl(0.31,0.31,0.05,12),BASIC(0xeaf8ff),0,0,0.47,head);lens.rotation.x=Math.PI/2;
  const beam=new THREE.Mesh(beamGeo(2.6,0.14),beamMat(0xbfe8ff,0.2));beam.position.z=0.5;beam.frustumCulled=false;head.add(beam);
  colCyl(dieselArea,x,z,0.55,yb-0.5,yb+1.6);
  const fl={g,head,beam,x,z,yb,hy:yb+1.35,step:step0,step0,cur:step0*Math.PI/4,settled:true};
  head.rotation.y=Math.PI-fl.cur;dsl.floods.push(fl);
  dieselArea.interact.push({x,z,r:2.4,label:()=>'Girar o holofote',use:()=>{fl.step=(fl.step+1)%8;fl.settled=false;SFX.rotate();}});
  return fl;
}
function dSensor(x,y,z,faceX){
  const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=faceX>0?Math.PI/2:-Math.PI/2;DG.add(g);
  outline(mesh(GEO.box(0.9,0.9,0.16),D_STEEL,0,0,0,g),1.04);
  mesh(GEO.tor(0.3,0.04,6,16),BASIC(CHROME),0,0,0.1,g);
  const lensMat=new THREE.MeshBasicMaterial({color:0x5a1410});const lens=mesh(GEO.cyl(0.26,0.26,0.06,14),lensMat,0,0,0.12,g);lens.rotation.x=Math.PI/2;
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0x7fe0ff,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.8}));glow.scale.set(2.6,2.6,1);glow.position.z=0.3;glow.visible=false;g.add(glow);
  const idle=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xff4a30,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.5}));idle.scale.set(2.2,2.2,1);idle.position.z=0.3;g.add(idle);
  const s={x:x+(faceX>0?0.1:-0.1),y,z,mat:lensMat,glow,idle,lit:false,faceX,accept:[]};dsl.sensors.push(s);return s;
}

function buildDiesel(){
  /* piso, paredes, teto (arranha-céu soterrado: pé-direito alto) */
  dbox(-9,9,-99.2,8.8,-1,0,M(0x23272e));dbox(-7.8,7.8,-113,-98.4,-1,0,M(0x2a2f37));
  dbox(-9.8,-9,-99.2,9.6,-12,10,D_WALL);dbox(9,9.8,-99.2,9.6,-12,10,D_WALL);dbox(-9.8,9.8,8.8,9.6,-12,10,D_WALL);
  dbox(-8.6,-7.8,-113.8,-98.4,-12,10,D_WALL);dbox(7.8,8.6,-113.8,-98.4,-12,10,D_WALL);dbox(-8.6,8.6,-113.8,-113,-12,10,D_WALL);
  dbox(-9.8,9.8,-113.8,9.6,8.6,9.8,D_CEIL,false);
  dCross(-8,3);dCross(-34,3);dCross(-66,3);dCross(-98.8,3);
  const checker=canvasTex(64,64,(g)=>{g.fillStyle='#1b1e24';g.fillRect(0,0,64,64);g.fillStyle='#2c3139';g.fillRect(0,0,32,32);g.fillRect(32,32,32,32);g.strokeStyle='#cfc6a8';g.lineWidth=2;g.strokeRect(1,1,62,62);});
  checker.wrapS=checker.wrapT=THREE.RepeatWrapping;checker.repeat.set(9,56);
  const fl=mesh(new THREE.PlaneGeometry(18,112),new THREE.MeshToonMaterial({map:checker,gradientMap:GRAD}),0,0.012,-45.4,DG);fl.rotation.x=-Math.PI/2;
  for(let z=6;z>-112;z-=6)dbox(-9,9,z-0.16,z+0.16,8.2,8.6,D_CREAM,false);
  /* pilastras, frisos e janelas */
  const winM=BASIC(0x0a1018),winFrame=BASIC(0xcfc6a8);
  for(let z=4;z>-100;z-=8)for(const s of[-1,1]){
    mesh(GEO.box(0.36,8.4,1.1),D_WALL2,s*8.82,4.2,z,DG);mesh(GEO.box(0.06,8,0.12),BASIC(CHROME),s*8.62,4.2,z+0.5,DG);mesh(GEO.box(0.06,8,0.12),BASIC(CHROME),s*8.62,4.2,z-0.5,DG);
    if(z<-12&&z>-96){const w1=mesh(new THREE.PlaneGeometry(2.4,3),winFrame,s*8.97,4.2,z-4,DG);w1.rotation.y=-s*Math.PI/2;const w2=mesh(new THREE.PlaneGeometry(2.0,2.6),winM,s*8.95,4.2,z-4,DG);w2.rotation.y=-s*Math.PI/2;}
    if(Math.abs(s)===1)tombLampDiesel(s*8.5,z);
  }
  /* salão */
  const mark=mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshBasicMaterial({map:eyeTexture('#6fd3ff'),transparent:true,opacity:0.8,depthWrite:false}),0,0.03,0,DG);mark.rotation.x=-Math.PI/2;
  for(const s of[-1,1])outline(mesh(GEO.box(0.8,7.4,0.8),D_WALL2,s*3,3.7,8.4,DG),1.04);outline(mesh(GEO.box(7,0.9,0.9),D_WALL2,0,7.4,8.4,DG),1.04);
  mesh(GEO.box(5.2,6.6,0.2),BASIC(0x4a7fa8,{transparent:true,opacity:0.5}),0,3.3,8.6,DG);
  mesh(new THREE.PlaneGeometry(1.7,1.7),new THREE.MeshBasicMaterial({map:eyeTexture('#d9cfae'),transparent:true,depthWrite:false}),0,7.4,7.9,DG);
  dieselArea.interact.push({x:0,z:6.9,r:2.7,label:()=>'Sair para o Vale',use:()=>exitTomb(false)});

  /* geradores (pontos de energia) */
  dGen(-5.2,-3.5);dGen(-6,-36.6);dGen(4,-67.7);

  /* SALA 1: Sala dos Holofotes */
  const G1=dGate(-34);dEngine(-6.5,-18,4,5);dEngine(7,-26,4,5);dCrate(-3,-12);dCrate(2.2,-22);dPillar(-5.5,-30);
  const F1=dFlood(6,0,-14,3);const S1=dSensor(-8.9,1.8,-28.9,1);
  /* SALA 2: Sala do Elevador */
  const G2=dGate(-66);dPillar(5.5,-46);dPillar(-5.5,-46);dPillar(5.5,-58);dCrate(1,-52);dCrate(-1.5,-44);
  const F2=dFlood(5.5,0,-40,2);const S2=dSensor(-8.9,1.8,-54.4,1);
  // elevador de carga na parede oeste e passarela no alto
  const pl=new THREE.Group();pl.position.set(-7.4,0,-54.3);DG.add(pl);
  pl.add(outline(mesh(GEO.box(3,0.4,3.4),D_WALL2,0,-0.2,0),1.02));pl.add(mesh(GEO.box(3.06,0.06,3.46),BASIC(0xd9cfae),0,0.02,0));
  for(const[px,pz]of[[-1.4,-1.6],[1.4,-1.6],[-1.4,1.6],[1.4,1.6]])pl.add(mesh(GEO.cyl(0.05,0.05,1.2,6),BASIC(CHROME),px,0.6,pz));
  const cable=mesh(GEO.cyl(0.05,0.05,1,6),D_DARK,-7.4,4.5,-54.3,DG);
  for(const sx of[-1,1])mesh(GEO.box(0.18,9,0.3),D_STEEL,-7.4+sx*1.6,4.5,-56.1,DG);
  const elCol=colBox(dieselArea,-8.9,-5.9,-56,-52.6,-0.6,0);
  dsl.elev={y:0,target:0,powered:false,col:elCol,g:pl,cable,moving:false};
  dbox(-9,-5.8,-64.8,-56,4.5,5,D_WALL2);
  for(const[cx,cz]of[[-5.95,-56.2],[-5.95,-64.6]])dbox(cx-0.25,cx+0.25,cz-0.25,cz+0.25,0,4.5,D_STEEL);
  for(let z=-57;z>=-64.4;z-=1.8){mesh(GEO.cyl(0.04,0.04,1.1,6),BASIC(CHROME),-5.92,5.55,z,DG);}
  mesh(GEO.cyl(0.04,0.04,8,6),BASIC(CHROME),-5.92,6.05,-60.6,DG).rotation.x=Math.PI/2;
  colBox(dieselArea,-6.0,-5.8,-64.8,-56.6,5,6.1);colBox(dieselArea,-9,-5.8,-64.9,-64.7,5,6.1);
  const F3=dFlood(-7.3,5,-61.5,0);const S3=dSensor(8.9,6.4,-61.5,-1);
  dieselArea.interact.push({x:-7.4,z:-54.3,r:2.3,label:()=>dsl.elev.moving?null:(dsl.elev.powered?(dsl.elev.target>2.5?'Descer no elevador':'Subir no elevador'):'Elevador sem energia'),use:()=>useElevator()});
  /* SALA 3: Sala da Luz Cruzada */
  const G3=dGate(-98.8);dPillar(-6,-76);dPillar(6,-76);dPillar(-6,-90);dPillar(6,-90);dPillar(0,-84);
  const FL=dFlood(-7.5,0,-70.5,5);const FR=dFlood(7.5,0,-70.5,3);
  const SR=dSensor(8.9,1.8,-86.9,-1);const SL=dSensor(-8.9,1.8,-86.9,1);
  S1.accept=[F1];S2.accept=[F2];S3.accept=[F3];SL.accept=[FR];SR.accept=[FL];
  dsl.S={S1,S2,S3,SL,SR};dsl.F={F1,F2,F3,FL,FR};
  /* CÂMARA: a vela de ignição */
  const ped=new THREE.Group();ped.position.set(0,0,-107);DG.add(ped);outline(mesh(GEO.cyl(1.3,1.6,1.1,12),D_WALL2,0,0.55,0,ped),1.04);outline(mesh(GEO.cyl(1.7,1.7,0.2,12),D_STEEL,0,0.1,0,ped),1.03);
  const ring=mesh(GEO.tor(1.35,0.06,5,24),BASIC(0x6fd3ff),0,1.12,0,ped);ring.rotation.x=Math.PI/2;
  colCyl(dieselArea,0,-107,1.55,-2,2);
  const plug=new THREE.Group();plug.position.set(0,2.4,-107);DG.add(plug);
  plug.add(outline(mesh(GEO.cyl(0.2,0.2,0.9,10),M(0xe6e0cc),0,0.2,0),1.06));
  const nut=mesh(GEO.cyl(0.3,0.3,0.22,6),M(0x555a64),0,-0.42,0,plug);outline(nut,1.06);
  mesh(GEO.cyl(0.14,0.14,0.5,8),M(0x777c88),0,-0.8,0,plug);mesh(GEO.cyl(0.08,0.08,0.3,8),BASIC(CHROME),0,0.78,0,plug);
  mesh(GEO.sph(0.1,8,6),BASIC(0x7fe8ff),0,-1.1,0,plug);
  const pg=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0x6fd3ff,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.6}));pg.scale.set(5,5,1);pg.position.set(0,2.4,-107);DG.add(pg);
  dsl.plug=plug;dsl.plugGlow=pg;dsl.plugLamp={x:0,y:2.8,z:-107,on:true};dieselArea.lamps.push(dsl.plugLamp);
  const mark2=mesh(new THREE.PlaneGeometry(9,9),new THREE.MeshBasicMaterial({map:eyeTexture('#6fd3ff'),transparent:true,opacity:0.55,depthWrite:false}),0,0.03,-107,DG);mark2.rotation.x=-Math.PI/2;
  dieselArea.interact.push({x:0,z:-104.6,r:2.8,label:()=>dsl.relicTaken?null:'Pegar a vela de ignição',use:()=>{if(dsl.relicTaken)return;dsl.relicTaken=true;dsl.plug.visible=false;dsl.plugGlow.visible=false;dsl.plugLamp.on=false;collectRelic('diesel');}});
  /* o Robô-vigia */
  const S=buildSentinel();S.group.position.set(3,0,-73);DG.add(S.group);
  dsl.guard={x:3,z:-73,face:Math.PI,head:0,state:'patrol',wps:[[3,-95],[-3,-95],[-3,-73],[3,-73]],wi:0,wait:0,lost:0,speed:0,rig:S.rig,group:S.group,room:{x0:-9,x1:9,z0:-98.4,z1:-66.4}};
  dieselArea.guards.push(dsl.guard);
  dsl.vents=[[-8.2,-12],[8.2,-30],[-8.2,-48],[8.2,-62],[-8.2,-80],[8.2,-92]];
}
function tombLampDiesel(x,z){
  mesh(GEO.box(0.3,0.5,0.3),D_STEEL,x*1.0,4.4,z,DG);const b=mesh(GEO.sph(0.24,8,6),BASIC(0xdff2ff),x*0.97,4.8,z,DG);
  dieselArea.lamps.push({x:x*0.97,y:4.8,z,on:true});
}

/* ---------- lógica ---------- */
function useGen(o){
  const first=!o.lit;usePowerPoint(o.x+(o.x<0?1.9:-1.9),o.z,first,'Gerador ligado. Ponto de controle salvo e lanterna recarregada.');if(!first)return;
  o.lit=true;o.lamp.on=true;o.ind.material.color.setHex(0x5dff7a);
  for(let i=0;i<4;i++)puff(o.x,2.4,o.z,{vy:1.4,size:0.6,life:1.6,color:0x9aa4b0});
}
function useElevator(){
  const e=dsl.elev;if(e.moving)return;
  if(!e.powered){SFX.deny();toast('O elevador está sem energia. Acenda o sensor da parede com um holofote.','warn');return;}
  e.target=e.target>2.5?0:5;e.moving=true;SFX.elev();
}
function wakeSentinel(g){if(g.state==='chase')return;g.state='chase';g.lost=0;SFX.alert();toast('O Robô-vigia viu você!','warn');addDiary('diesel_guard');}
function dBeamLen(fl){
  const dx=Math.sin(fl.cur),dz=-Math.cos(fl.cur);
  const f=rayBlock(dieselArea,fl.x+dx*0.95,fl.hy,fl.z+dz*0.95,fl.x+dx*45,fl.hy,fl.z+dz*45);
  const L=Math.max(1.5,45*f-0.3);fl.beam.scale.set(L/45,L/45,L);
}
function dEvalSensors(){
  for(const s of dsl.sensors){
    let lit=false;
    for(const fl of s.accept){
      if(!fl.settled||Math.abs(s.y-fl.hy)>1.4)continue;
      const dx=s.x-fl.x,dz=s.z-fl.z,d=Math.hypot(dx,dz);if(d>46||d<1)continue;
      if(Math.abs(wrapPi(Math.atan2(dx,-dz)-fl.cur))>0.07)continue;
      const ux=dx/d,uz=dz/d,f=rayBlock(dieselArea,fl.x+ux*0.95,fl.hy,fl.z+uz*0.95,s.x,s.y,s.z);
      if(f<0.985)continue;lit=true;break;
    }
    if(lit&&!s.lit)SFX.sensor();
    s.lit=lit;s.mat.color.setHex(lit?0x7fe8ff:0x5a1410);s.glow.visible=lit;s.idle.visible=!lit;
  }
}
function dUpdateGuard(g,dt,t){
  const p=G.p,inRoom=p.x>=g.room.x0&&p.x<=g.room.x1&&p.z>=g.room.z0&&p.z<=g.room.z1&&p.y>-3&&p.y<2;
  const dx=p.x-g.x,dz=p.z-g.z,d=Math.hypot(dx,dz)||0.001;
  const beamA=g.face+g.head;let seen=false;
  if(inRoom&&G.mode==='play'&&d<13){
    if(Math.abs(wrapPi(Math.atan2(dx,dz)-beamA))<0.36){const f=rayBlock(dieselArea,g.x,1.6,g.z,p.x,p.y+1.2,p.z);if(f>0.97)seen=true;}
  }
  if(g.state==='patrol'){
    const w=g.wps[g.wi],wx=w[0]-g.x,wz=w[1]-g.z,wd=Math.hypot(wx,wz);
    if(wd<0.5){g.wi=(g.wi+1)%g.wps.length;g.wait=0.9;g.speed=0;}
    if(g.wait>0){g.wait-=dt;g.speed=0;}
    else{const sp=1.6,r=pushOut(dieselArea,g.x+wx/wd*sp*dt,g.z+wz/wd*sp*dt,0,0.55,2.1);g.x=r[0];g.z=r[1];g.speed=sp;g.face+=wrapPi(Math.atan2(wx,wz)-g.face)*(1-Math.exp(-5*dt));}
    g.head=Math.sin(t*1.1)*1.0;
    if(seen)wakeSentinel(g);
  }else{
    g.face+=wrapPi(Math.atan2(dx,dz)-g.face)*(1-Math.exp(-6*dt));g.head=clamp(wrapPi(Math.atan2(dx,dz)-g.face),-1,1);
    const sp=2.5,r=pushOut(dieselArea,g.x+dx/d*sp*dt,g.z+dz/d*sp*dt,0,0.55,2.1);g.x=r[0];g.z=r[1];g.speed=sp;
    if(seen)g.lost=0;else g.lost+=dt;
    if(!inRoom||g.lost>2.6||d>20){g.state='patrol';g.lost=0;let bi=0,bd=1e9;g.wps.forEach((w,i)=>{const q=Math.hypot(w[0]-g.x,w[1]-g.z);if(q<bd){bd=q;bi=i;}});g.wi=bi;if(!inRoom)toast('O Robô-vigia perdeu você de vista.');}
    if(d<1.2&&G.mode==='play')hurt(1,g.x,g.z,'sentinel');
  }
  g.group.position.set(g.x,0,g.z);g.group.rotation.y=g.face;g.rig.head.rotation.y=g.head;animSentinel(g.rig,t,g.speed,g.state==='chase');
}
function dUpdate(dt,t){
  const p=G.p;
  /* holofotes */
  for(const fl of dsl.floods){
    const tb=fl.step*Math.PI/4,d=wrapPi(tb-fl.cur);
    if(Math.abs(d)>0.0005){fl.cur=wrapPi(fl.cur+clamp(d,-3.4*dt,3.4*dt));}
    fl.settled=Math.abs(wrapPi(tb-fl.cur))<0.02;
    fl.head.rotation.y=Math.PI-fl.cur;
  }
  dsl.beamT-=dt;if(dsl.beamT<=0){dsl.beamT=0.2;for(const fl of dsl.floods)dBeamLen(fl);}
  dEvalSensors();
  const S=dsl.S,gt=dsl.gates;
  if(S.S1.lit&&!gt[0].latched){gt[0].latched=true;SFX.gate();toast('O sensor acendeu. A porta está subindo...','good');addDiary('diesel_beams');}
  if(S.S2.lit&&!dsl.elev.powered){dsl.elev.powered=true;SFX.use();toast('O sensor acendeu. O elevador de carga ganhou energia.','good');addDiary('diesel_elev');}
  if(S.S3.lit&&!gt[1].latched){gt[1].latched=true;SFX.gate();toast('O sensor acendeu. A porta da sala está subindo...','good');}
  if(S.SL.lit&&S.SR.lit&&!gt[2].latched){gt[2].latched=true;SFX.gate();toast('Os dois fachos se cruzaram. A porta final está subindo...','good');}
  for(const g of gt){if(g.latched&&g.open<1){g.open=Math.min(1,g.open+dt/2);g.g.position.y=g.open*8.4;if(g.open>0.55)g.c.on=false;if(Math.random()<dt*10)puff(0,6,g.zc,{vy:0.6,size:1.2,life:1.4,op:0.3,color:0xaab4c0});}}
  /* elevador */
  const e=dsl.elev;
  if(Math.abs(e.target-e.y)>0.0005){const dir=Math.sign(e.target-e.y);e.y+=dir*Math.min(2.2*dt,Math.abs(e.target-e.y));if(Math.abs(e.target-e.y)<0.0005){e.y=e.target;e.moving=false;}}
  else e.moving=false;
  e.col.y1=e.y;e.col.y0=e.y-0.4;e.g.position.y=e.y;
  const top=8.4,len=Math.max(0.1,top-e.y);e.cable.scale.y=len;e.cable.position.y=e.y+len/2;
  /* vela de ignição */
  if(!dsl.relicTaken){dsl.plug.rotation.y+=dt*1.1;dsl.plug.position.y=2.4+Math.sin(t*2)*0.12;dsl.plugGlow.position.y=dsl.plug.position.y;dsl.plugGlow.material.opacity=0.5+Math.sin(t*3.2)*0.12;if(Math.random()<dt*6)puff(0,2.3+Math.random()*0.4,-107,{vy:0.5,size:0.35,life:0.6,op:0.5,color:0x9fe8ff,vx:(Math.random()-0.5)*0.6});}
  for(const sp of dsl.spin){if(sp.smoke&&Math.random()<dt*1.5)puff(sp.smoke.x,sp.smoke.y,sp.smoke.z,{vy:1.5,size:0.9,grow:2.4,life:2.6,op:0.35,color:0x555a62});}
  if(Math.random()<dt*0.7){const v=dsl.vents[Math.floor(Math.random()*dsl.vents.length)];puff(v[0]*0.95,0.5,v[1],{vy:2,size:0.7,life:1.5,op:0.3,color:0xb0b8c4,vx:-Math.sign(v[0])*0.4});}
  dUpdateGuard(dsl.guard,dt,t);
  if(p.z<-6)addDiary('diesel_enter');
  const H=dsl.hints;
  if(p.z<-12&&p.z>-34&&!H.r1){H.r1=1;toast('Há um holofote e um sensor vermelho na parede. Chegue perto do holofote e use para girar o facho.');}
  if(p.z<-38&&p.z>-66&&!H.r2){H.r2=1;toast('Um elevador de carga e um sensor na parede. Acenda o sensor com um holofote.');}
  if(p.z<-70&&p.z>-98&&!H.r3){H.r3=1;toast('Dois holofotes e dois sensores: os fachos precisam se cruzar. Cuidado com o Robô-vigia.','warn');}
}
function dReset(){
  for(const o of dsl.gens){o.lit=false;o.lamp.on=false;o.ind.material.color.setHex(0x5a1410);}
  for(const g of dsl.gates){g.open=0;g.latched=false;g.g.position.y=0;g.c.on=true;}
  for(const fl of dsl.floods){fl.step=fl.step0;fl.cur=fl.step0*Math.PI/4;fl.settled=true;fl.head.rotation.y=Math.PI-fl.cur;}
  const e=dsl.elev;e.y=0;e.target=0;e.powered=false;e.moving=false;e.col.y1=0;e.col.y0=-0.4;e.g.position.y=0;
  for(const s of dsl.sensors){s.lit=false;s.mat.color.setHex(0x5a1410);s.glow.visible=false;s.idle.visible=true;}
  dsl.relicTaken=!!G.relics.diesel;dsl.plug.visible=!dsl.relicTaken;dsl.plugGlow.visible=!dsl.relicTaken;dsl.plugLamp.on=!dsl.relicTaken;dsl.beamT=0;
  dResetVisit();
}
function dResetVisit(){const g=dsl.guard;g.state='patrol';g.x=3;g.z=-73;g.face=Math.PI;g.head=0;g.wi=0;g.wait=0;g.lost=0;g.speed=0;}
buildDiesel();
for(const o of dsl.gens)o.g.userData.dyn=true;for(const o of dsl.gates)o.g.userData.dyn=true;for(const o of dsl.floods)o.g.userData.dyn=true;
dsl.elev.g.userData.dyn=true;dsl.elev.cable.userData.dyn=true;dsl.plug.userData.dyn=true;dsl.guard.group.userData.dyn=true;
for(const s of dsl.sensors)s.mat.userData.sensor=true;
(function(){for(const s of dsl.sensors){let o=null;DG.traverse(x=>{if(x.isMesh&&x.material===s.mat)o=x;});let g=o;while(g&&g.parent!==DG)g=g.parent;if(g)g.userData.dyn=true;}})();
dsl.merge=mergeStatic(DG,60);
for(const f of dsl.floods){f.beam.userData.keep=true;mergeLocalTree(f.g);}
for(const o of dsl.gens)mergeLocalTree(o.g);for(const o of dsl.gates)mergeLocalTree(o.g);mergeLocalTree(dsl.elev.g);mergeLocalTree(dsl.plug);
for(const s of dsl.sensors){let g=null;DG.traverse(x=>{if(x.isMesh&&x.material===s.mat)g=x.parent;});if(g)mergeLocalTree(g);}
dieselArea.camCeil=7.8;dieselArea.camBoundX=8.2;dieselArea.update=dUpdate;dieselArea.reset=dReset;dieselArea.resetVisit=dResetVisit;
