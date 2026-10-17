/* ====================== Tumba das Engrenagens (Steampunk) ======================
   Área separada. Eixo do corredor: o jogador entra em z=+5 e avança para -z.
   Salão (piso 0) -> Sala 1 dos pistões -> Sala 2 do Autômato -> Sala 3 do piso que cede -> Câmara. */
const tombArea=makeArea('steam');tombArea.killY=-5;tombArea.metal=true;tombArea.spawn={x:0,y:0,z:5,face:Math.PI};
const TG=tombArea.group;TG.visible=false;scene.add(TG);
tombArea.key='steam';tombArea.fogColor=0x0e0906;tombArea.hemi=[0x6a4a38,0x1e140c,0.62];tombArea.lampColor=0xff9a40;tombArea.ambience='steam';
const TOMB_AREAS={steam:tombArea};
const tomb={spin:[],boilers:[],pistons:[],tiles:[],lever:{done:false,t:0},gate:{open:0},relicTaken:false,relic:null,guard:null,vents:[],diaryFlags:{}};
const T_WALL=M(0x5c4636),T_FLOOR=M(0x3b3128),T_BRASS=M(0xb8893a),T_RUST=M(0x7a4a2a),T_CEIL=M(0x2e2620),T_DARK=M(0x2a211b);

function tbox(x0,x1,z0,z1,y0,y1,mat,col){const m=mesh(GEO.box(x1-x0,y1-y0,z1-z0),mat,(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,TG);if(col!==false)colBox(tombArea,x0,x1,z0,z1,y0,y1);return m;}
function crossWall(zc,half){tbox(-9.8,-half,zc-0.4,zc+0.4,-12,7.5,T_WALL);tbox(half,9.8,zc-0.4,zc+0.4,-12,7.5,T_WALL);
  tbox(-half,half,zc-0.4,zc+0.4,6.2,7.5,T_WALL,false);
  for(const s of[-1,1]){mesh(GEO.box(0.5,6.4,1.2),M(0x7a5a3a),s*(half+0.25),3.2,zc,TG);const x=s*(half+0.25);colBox(tombArea,x-0.25,x+0.25,zc-0.6,zc+0.6,-2,6.4);}}

function buildTomb(){
  /* pisos (topo em y=0) */
  tbox(-9,9,-10,8.8,-1,0,T_FLOOR);            // salão + borda da sala 1
  tbox(-9,9,-36,-30,-1,0,T_FLOOR);            // plataforma após os pistões
  tbox(-9,9,-77,-36,-1,0,M(0x3f342a));        // sala 2 e patamar da sala 3
  tbox(-9,9,-102.8,-98.6,-1,0,T_FLOOR);       // saída da sala 3 (vai até a câmara, sem fresta)
  tbox(-7.8,7.8,-116,-102.8,-1,0,M(0x44382d));// câmara
  /* paredes */
  tbox(-9.8,-9,-102,8.8,-12,7.5,T_WALL);tbox(9,9.8,-102,8.8,-12,7.5,T_WALL);
  tbox(-9.8,9.8,8.8,9.6,-12,7.5,T_WALL);
  tbox(-8.6,-7.8,-116,-102,-12,7.5,T_WALL);tbox(7.8,8.6,-116,-102,-12,7.5,T_WALL);tbox(-8.6,8.6,-116.8,-116,-12,7.5,T_WALL);
  crossWall(-8,3);crossWall(-36,3);crossWall(-102.4,3);
  tbox(-9.8,-3,-68.4,-67.6,-12,7.5,T_WALL);tbox(3,9.8,-68.4,-67.6,-12,7.5,T_WALL);tbox(-3,3,-68.4,-67.6,6.2,7.5,T_WALL,false);
  /* teto, nervuras e dutos */
  tbox(-9.8,9.8,-116.8,9.6,6.5,7.6,T_CEIL,false);
  for(let z=6;z>-116;z-=6)tbox(-9,9,z-0.25,z+0.25,5.9,6.5,T_DARK,false);
  for(const s of[-1,1]){
    const p=mesh(GEO.cyl(0.22,0.22,120,8),T_BRASS,s*8.5,5.3,-52,TG);p.rotation.x=Math.PI/2;
    const p2=mesh(GEO.cyl(0.12,0.12,120,6),T_RUST,s*8.6,4.6,-52,TG);p2.rotation.x=Math.PI/2;
    for(let z=4;z>-114;z-=8){const c=mesh(GEO.tor(0.25,0.05,5,10),M(0xd8a24a),s*8.5,5.3,z,TG);c.rotation.y=Math.PI/2;}
    for(let z=2;z>-114;z-=12)mesh(GEO.box(0.3,6.4,0.7),M(0x6a523c),s*8.85,3.2,z,TG);
  }
  /* luminárias: a luz de verdade é uma só e acompanha a mais próxima */
  for(let z=0;z>-112;z-=14)for(const s of[-1,1]){
    mesh(GEO.box(0.3,0.5,0.3),T_BRASS,s*8.8,3.4,z,TG);
    mesh(GEO.sph(0.24,8,6),BASIC(0xffa848),s*8.5,3.8,z,TG);
    tombArea.lamps.push({x:s*8.5,y:3.8,z,on:true});
  }
  /* engrenagens decorativas nas paredes */
  [[-9,-18],[9,-24],[-9,-50],[9,-46],[-9,-88],[9,-84]].forEach(([x,z],i)=>{const g=gearMesh(2.3+(i%2)*0.6,12,0.3,0x8a6a3a,0x1a0e05);g.position.set(x*0.995,3.4,z);g.rotation.y=Math.PI/2;TG.add(g);tomb.spin.push({o:g,s:(i%2?-0.35:0.3)});});
  /* salão: símbolo do olho no chão e porta da superfície */
  const mark=mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshBasicMaterial({map:eyeTexture('#d8a24a'),transparent:true,opacity:0.85,depthWrite:false}),0,0.02,0,TG);mark.rotation.x=-Math.PI/2;
  for(const s of[-1,1])outline(mesh(GEO.box(0.8,6,0.8),T_BRASS,s*3,3,8.4,TG),1.04);outline(mesh(GEO.box(7,0.9,0.9),T_BRASS,0,6,8.4,TG),1.04);
  mesh(GEO.box(5.2,5.4,0.2),BASIC(0x6fa0c8,{transparent:true,opacity:0.5}),0,2.7,8.6,TG);
  mesh(new THREE.PlaneGeometry(1.6,1.6),new THREE.MeshBasicMaterial({map:eyeTexture('#ffd24a'),transparent:true,depthWrite:false}),0,6.0,7.9,TG);
  tombArea.interact.push({x:0,z:6.9,r:2.7,label:()=>'Sair para o Vale',use:()=>exitTomb(false)});

  /* caldeiras: pontos de energia */
  [[-5.2,-3.5],[-5.6,-32.8],[-5.6,-75]].forEach(([x,z],i)=>{
    const g=new THREE.Group();outline(mesh(GEO.cyl(0.8,0.92,1.7,12),T_BRASS,0,0.9,0,g),1.04);
    for(const y of[0.35,1.4])mesh(GEO.tor(0.88,0.06,5,14),M(0x7a4a2a),0,y,0,g).rotation.x=Math.PI/2;
    outline(mesh(GEO.sph(0.8,10,6),T_BRASS,0,1.75,0,g),1.04);outline(mesh(GEO.cyl(0.14,0.18,1.5,8),T_DARK,0.3,2.9,0,g),1.05);
    const fire=mesh(GEO.box(0.7,0.5,0.1),BASICU(0x3a1c0c),0,0.7,0.86,g);
    g.position.set(x,0,z);TG.add(g);colCyl(tombArea,x,z,0.95,-2,3.7);
    const b={x,z,g,fire,lit:false,lamp:{x:x,y:1.6,z:z,on:false},idx:i};tomb.boilers.push(b);tombArea.lamps.push(b.lamp);
    tombArea.interact.push({x:x+1.7,z,r:2.5,label:()=>b.lit?TXT.pointLabel:'Acender a caldeira',use:()=>useBoiler(b)});
  });

  /* SALA 1: pistões em ritmo sobre o fosso */
  const pit=mesh(new THREE.PlaneGeometry(18,22),BASIC(0x3a120a),0,-5.5,-20,TG);pit.rotation.x=-Math.PI/2;
  const pitGlow=mesh(new THREE.PlaneGeometry(16,20),BASIC(0xff6a20,{transparent:true,opacity:0.35,blending:THREE.AdditiveBlending,depthWrite:false}),0,-5.4,-20,TG);pitGlow.rotation.x=-Math.PI/2;tomb.pitGlow=pitGlow;
  [-12,-16,-20,-24,-28].forEach((zc,i)=>{
    const g=new THREE.Group();g.position.set(0,0,zc);TG.add(g);
    outline(mesh(GEO.box(6,3.4,2.6),T_BRASS,0,-1.7,0,g),1.02);
    mesh(GEO.box(6.2,0.18,2.8),M(0xd8b46a),0,-0.09,0,g);
    for(const sx of[-2.4,0,2.4])mesh(GEO.cyl(0.14,0.14,0.08,8),M(0x6a4a2a),sx,0.04,0.9,g);
    const lamp=mesh(GEO.box(0.7,0.1,0.7),BASICU(0xffa030),0,0.05,0,g);
    const c=colBox(tombArea,-3,3,zc-1.3,zc+1.3,-3.4,0);
    tomb.pistons.push({g,c,lamp,zc,i,warn:false,last:0});
  });
  for(const s of[-1,1])for(const zc of[-14,-18,-22,-26]){const r=mesh(GEO.cyl(0.18,0.18,9,6),M(0x5a4636),s*3.6,-1,zc,TG);}

  /* SALA 2: o Autômato dorme; a alavanca de vapor abre a porta */
  for(const[x,z]of[[-5.5,-44],[5.5,-44],[-5.5,-58],[5.5,-58]]){const p=new THREE.Group();outline(mesh(GEO.cyl(0.7,0.8,6.5,10),M(0x6a523c),0,3.2,0,p),1.04);for(const y of[1,3.2,5.4])mesh(GEO.tor(0.76,0.08,5,12),T_BRASS,0,y,0,p).rotation.x=Math.PI/2;p.position.set(x,0,z);TG.add(p);colCyl(tombArea,x,z,0.85,-2,7);}
  const lev=new THREE.Group();lev.position.set(8.1,0,-64.5);TG.add(lev);outline(mesh(GEO.box(1.4,1.1,1.1),T_DARK,0,0.55,0,lev),1.04);
  const arm=new THREE.Group();arm.position.set(0,1.1,0);lev.add(arm);arm.add(mesh(GEO.cyl(0.07,0.07,1.5,6),T_BRASS,0,0.75,0));arm.add(mesh(GEO.sph(0.17,8,6),M(0xb8392a),0,1.55,0));arm.rotation.z=0.8;
  tomb.lever.arm=arm;colBox(tombArea,7.4,8.8,-65.1,-63.9,-2,1.4);
  tombArea.interact.push({x:6.8,z:-64.5,r:2.4,label:()=>tomb.lever.done?null:'Puxar a alavanca de vapor',use:()=>pullLever()});
  const gate=new THREE.Group();gate.position.set(0,0,-68);TG.add(gate);
  outline(mesh(GEO.box(6,6.6,0.5),T_RUST,0,3.3,0,gate),1.02);for(let i=-2;i<=2;i++)mesh(GEO.box(0.16,6.4,0.7),T_BRASS,i*1.1,3.3,0,gate);
  mesh(new THREE.PlaneGeometry(1.4,1.4),new THREE.MeshBasicMaterial({map:eyeTexture('#ffd24a'),transparent:true,depthWrite:false}),0,4.6,0.42,gate);
  tomb.gate.g=gate;tomb.gate.c=colBox(tombArea,-3,3,-68.3,-67.7,-12,7);

  /* SALA 3: piso de placas; só as marcadas com o olho aguentam */
  const pit3=mesh(new THREE.PlaneGeometry(18,22),BASIC(0x3a120a),0,-5.5,-88,TG);pit3.rotation.x=-Math.PI/2;
  const g3=mesh(new THREE.PlaneGeometry(16,20),BASIC(0xff6a20,{transparent:true,opacity:0.35,blending:THREE.AdditiveBlending,depthWrite:false}),0,-5.4,-88,TG);g3.rotation.x=-Math.PI/2;tomb.pitGlow3=g3;
  const SAFE=[[0,2],[1,2],[2,2],[2,3],[3,3],[4,3],[4,2],[5,2],[5,1],[6,1],[7,1],[7,2],[8,2]];
  const eyeT=eyeTexture('#ffd24a'),gearT=gearTexture('#8a6238','#2a1c12');
  for(let r=0;r<9;r++)for(let c=0;c<5;c++){
    const safe=SAFE.some(s=>s[0]===r&&s[1]===c),x=(c-2)*2.4,z=-77-2.4*(r+0.5),g=new THREE.Group();g.position.set(x,0,z);TG.add(g);
    outline(mesh(GEO.box(2.3,0.4,2.3),safe?M(0x3a342e):M(0x6a4a2a),0,-0.2,0,g),1.0);
    const decal=mesh(new THREE.PlaneGeometry(1.9,1.9),new THREE.MeshBasicMaterial({map:safe?eyeT:gearT,transparent:safe}),0,0.012,0,g);decal.rotation.x=-Math.PI/2;
    const col=colBox(tombArea,x-1.15,x+1.15,z-1.15,z+1.15,-0.4,0);
    tomb.tiles.push({g,c:col,x,z,safe,state:'ok',stand:0,timer:0,vy:0});
  }

  /* CÂMARA DA RELÍQUIA */
  const ped=new THREE.Group();ped.position.set(0,0,-110);TG.add(ped);outline(mesh(GEO.cyl(1.3,1.6,1.1,12),T_BRASS,0,0.55,0,ped),1.04);outline(mesh(GEO.cyl(1.7,1.7,0.2,12),M(0xd8b46a),0,0.1,0,ped),1.03);colCyl(tombArea,0,-110,1.55,-2,2);
  const relic=gearMesh(0.62,10,0.2,0xc8743a,0xa0501a);relic.position.set(0,2.2,-110);TG.add(relic);tomb.relic=relic;
  const rg=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color:0xff9a50,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.55}));rg.scale.set(5,5,1);rg.position.set(0,2.2,-110);TG.add(rg);tomb.relicGlow=rg;
  tombArea.lamps.push({x:0,y:2.4,z:-110,on:true});
  const mark2=mesh(new THREE.PlaneGeometry(9,9),new THREE.MeshBasicMaterial({map:eyeTexture('#d8a24a'),transparent:true,opacity:0.6,depthWrite:false}),0,0.02,-110,TG);mark2.rotation.x=-Math.PI/2;
  tombArea.interact.push({x:0,z:-107.4,r:2.8,label:()=>tomb.relicTaken?null:'Pegar a engrenagem-mestra',use:()=>takeRelic()});

  /* o Autômato de latão */
  const A=buildAutomaton();A.group.position.set(1.5,0,-51);TG.add(A.group);
  tomb.guard={x:1.5,z:-51,hx:1.5,hz:-51,face:0.6,state:'sleep',room:{x0:-9,x1:9,z0:-68,z1:-36},rig:A.rig,group:A.group,speed:0,puffT:0};
  tombArea.guards.push(tomb.guard);
  /* respiros de vapor */
  tomb.vents=[[-8.2,-13],[8.2,-27],[-8.2,-47],[8.2,-60],[-8.2,-82],[8.2,-93]];
}

/* ---------- lógica da tumba ---------- */
function useBoiler(b){
  const first=!b.lit;usePowerPoint(b.x+1.9,b.z,first,TXT.boilerLit);if(!first)return;
  b.lit=true;b.lamp.on=true;b.fire.material.color.setHex(0xffa030);
  for(let i=0;i<4;i++)puff(b.x+0.3,3.4,b.z,{vy:1.6,size:0.7,life:1.8});
}
function pullLever(){
  if(tomb.lever.done)return;tomb.lever.done=true;tomb.lever.t=0;SFX.lever();
  toast('A alavanca de vapor foi puxada. A porta está subindo...');
  const g=tomb.guard;if(g.state==='sleep'&&Math.hypot(G.p.x-g.x,G.p.z-g.z)<18)wakeGuard(g,true);
}
function takeRelic(){
  if(tomb.relicTaken)return;tomb.relicTaken=true;tomb.relic.visible=false;tomb.relicGlow.visible=false;if(tomb.relicLamp)tomb.relicLamp.on=false;
  collectRelic('steam');
}
function wakeGuard(g,noise){
  if(g.state==='awake')return;g.state='awake';SFX.wake();
  toast(noise?'O vapor da alavanca acordou o Autômato de latão!':'O Autômato de latão despertou!','warn');addDiary('automato');
}
function updateGuard(g,dt,t){
  const p=G.p,inRoom=p.x>=g.room.x0&&p.x<=g.room.x1&&p.z>=g.room.z0&&p.z<=g.room.z1&&p.y>-3;
  const dx=p.x-g.x,dz=p.z-g.z,d=Math.hypot(dx,dz)||0.001;
  if(g.state==='sleep'){
    g.speed=0;
    if(inRoom&&G.mode==='play'){const noisy=p.run&&p.speed>3;if((noisy&&d<8.5)||d<3)wakeGuard(g,false);}
  }else if(!inRoom){
    g.state='sleep';g.x=g.hx;g.z=g.hz;g.speed=0;SFX.sleep();toast('O Autômato voltou a dormir.');
  }else{
    const sp=2.5,r=pushOut(tombArea,g.x+dx/d*sp*dt,g.z+dz/d*sp*dt,0,0.55,2.1);g.x=r[0];g.z=r[1];g.speed=sp;
    g.face+=wrapPi(Math.atan2(dx,dz)-g.face)*(1-Math.exp(-6*dt));
    g.puffT-=dt;if(g.puffT<=0){g.puffT=0.25;puff(g.x,2.25,g.z,{vy:1.4,size:0.5,life:1.2,op:0.4});SFX.steam(0.05);}
    if(d<1.2&&G.mode==='play')hurt(1,g.x,g.z,'automato');
  }
  g.group.position.set(g.x,0,g.z);g.group.rotation.y=g.face;animAutomaton(g.rig,t,g.state==='awake',g.speed);
}
const PIST_P=3.4;
function updateTomb(dt,t){
  const p=G.p;
  tomb.pistons.forEach((o,i)=>{
    const ph=(((t-i*0.9)%PIST_P)+PIST_P)%PIST_P/PIST_P;let top;
    if(ph<0.58)top=0;else if(ph<0.72)top=-3.2*smooth(0.58,0.72,ph);else if(ph<0.88)top=-3.2;else top=-3.2*(1-smooth(0.88,1,ph));
    const warn=ph>0.44&&ph<0.58;
    const wasOn=o.c.on;o.g.position.y=top;o.c.y1=top;o.c.y0=top-3.4;o.c.on=top>-0.5;
    if(wasOn&&!o.c.on&&p.x>=o.c.x0-0.3&&p.x<=o.c.x1+0.3&&p.z>=o.c.z0-0.3&&p.z<=o.c.z1+0.3)G.cause={k:'piston',t:G.t};
    o.lamp.material.color.setHex(warn?(Math.sin(t*26)>0?0xff3a20:0x701008):0xffa030);
    if(Math.abs(p.z-o.zc)<14){if(ph>0.58&&o.last<=0.58&&Math.abs(p.z-o.zc)<10)SFX.piston();if(ph>0.44&&o.last<=0.44)SFX.steam(0.08);}
    o.last=ph;
  });
  for(const tl of tomb.tiles){
    if(tl.safe)continue;
    if(tl.state==='ok'){const on=p.grounded&&p.y>-0.1&&Math.abs(p.x-tl.x)<1.15&&Math.abs(p.z-tl.z)<1.15;
      if(on){tl.stand+=dt;if(tl.stand>0.3){tl.state='crack';tl.timer=0.55;SFX.crack();G.cause={k:'tile',t:G.t};}}else tl.stand=Math.max(0,tl.stand-dt*2);}
    else if(tl.state==='crack'){tl.timer-=dt;tl.g.position.x=tl.x+(Math.random()-0.5)*0.07;if(tl.timer<=0){tl.state='fall';tl.vy=0;tl.c.on=false;tl.g.position.x=tl.x;}}
    else if(tl.state==='fall'){tl.vy-=22*dt;tl.g.position.y+=tl.vy*dt;tl.g.rotation.x+=dt*2.4;if(tl.g.position.y<-8){tl.g.visible=false;tl.state='gone';tl.timer=9;}}
    else{tl.timer-=dt;if(tl.timer<=0){tl.state='ok';tl.g.visible=true;tl.g.position.set(tl.x,0,tl.z);tl.g.rotation.set(0,0,0);tl.c.on=true;tl.stand=0;}}
  }
  if(tomb.lever.done&&tomb.gate.open<1){
    tomb.lever.t+=dt;tomb.lever.arm.rotation.z=lerp(0.8,-0.8,smooth(0,0.4,tomb.lever.t));
    if(tomb.lever.t>0.5){const was=tomb.gate.open;tomb.gate.open=Math.min(1,tomb.gate.open+dt/1.8);if(was===0)SFX.gate();tomb.gate.g.position.y=tomb.gate.open*7;if(tomb.gate.open>0.55)tomb.gate.c.on=false;
      if(Math.random()<dt*14)puff(0,5,-68,{vy:0.6,size:1.2,life:1.4,op:0.35});}
  }
  tomb.pitGlow.material.opacity=0.28+Math.sin(t*1.7)*0.07;tomb.pitGlow3.material.opacity=0.28+Math.sin(t*1.7+1)*0.07;
  if(!tomb.relicTaken){tomb.relic.rotation.z+=dt*0.9;tomb.relic.position.y=2.2+Math.sin(t*2)*0.12;tomb.relicGlow.position.y=tomb.relic.position.y;tomb.relicGlow.material.opacity=0.45+Math.sin(t*3)*0.1;}
  if(Math.random()<dt*0.8){const v=tomb.vents[Math.floor(Math.random()*tomb.vents.length)];puff(v[0]*0.95,0.5,v[1],{vy:2.2,size:0.7,life:1.6,op:0.35,vx:-Math.sign(v[0])*0.4});if(Math.abs(p.z-v[1])<20)SFX.steam(0.07);}
  for(const s of tomb.spin)s.o.rotation.z+=s.s*dt;
  for(const g of tombArea.guards)updateGuard(g,dt,t);
  /* anotações do diário ao avançar */
  if(p.z<-6)addDiary('steam_enter');if(p.z<-70&&p.y>-1)addDiary('steam_floor');
}
function resetTombVisitState(){
  for(const g of tombArea.guards){g.state='sleep';g.x=g.hx;g.z=g.hz;g.speed=0;}
}
function resetSteam(){
  for(const b of tomb.boilers){b.lit=false;b.lamp.on=false;b.fire.material.color.setHex(0x3a1c0c);}
  tomb.lever.done=false;tomb.lever.t=0;tomb.lever.arm.rotation.z=0.8;tomb.gate.open=0;tomb.gate.g.position.y=0;tomb.gate.c.on=true;
  for(const tl of tomb.tiles){tl.state='ok';tl.g.visible=true;tl.g.position.set(tl.x,0,tl.z);tl.g.rotation.set(0,0,0);tl.c.on=true;tl.stand=0;}
  tomb.relicTaken=!!G.relics.steam;tomb.relic.visible=!tomb.relicTaken;tomb.relicGlow.visible=!tomb.relicTaken;tomb.relicLamp.on=!tomb.relicTaken;
  resetTombVisitState();
}
buildTomb();
for(const o of tomb.pistons)o.g.userData.dyn=true;for(const o of tomb.tiles)o.g.userData.dyn=true;tomb.gate.g.userData.dyn=true;tomb.lever.arm.userData.dyn=true;
for(const o of tomb.spin)o.o.userData.dyn=true;tomb.relic.userData.dyn=true;tomb.guard.group.userData.dyn=true;for(const b of tomb.boilers)b.g.userData.dyn=true;
tomb.merge=mergeStatic(TG,60);
for(const o of tomb.pistons)mergeLocalTree(o.g);for(const o of tomb.tiles)mergeLocalTree(o.g);mergeLocalTree(tomb.gate.g);for(const b of tomb.boilers)mergeLocalTree(b.g);mergeLocalTree(tomb.relic);for(const o of tomb.spin)mergeLocalTree(o.o);
tomb.relicLamp=tombArea.lamps[tombArea.lamps.length-1];
tombArea.camCeil=5.6;tombArea.camBoundX=8.1;tombArea.update=updateTomb;tombArea.reset=resetSteam;tombArea.resetVisit=resetTombVisitState;
