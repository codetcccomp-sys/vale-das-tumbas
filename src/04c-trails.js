/* ====================== trilhas, marcos e placas ======================
   Da Estrada das Eras sai uma trilha de areia batida até a porta de cada tumba. Marcos de pedra com uma fita na cor
   da era acompanham a trilha (a ponta brilha à noite) e uma placa na estrada diz para onde ela vai.
   As trilhas passam perto de alguns segredos (baú, inscrições), para quem anda por elas ter pequenas descobertas. */
const TRAIL_MAT=(()=>{const t=canvasTex(64,128,(g,w,h)=>{const r=rng(31);g.fillStyle='#d8b47c';g.fillRect(0,0,w,h);
  for(let i=0;i<140;i++){g.fillStyle='rgba('+(r()<0.5?'255,240,210':'120,84,44')+','+(0.10+r()*0.12)+')';g.fillRect(r()*w,r()*h,2+r()*3,2+r()*3);}
  for(let i=0;i<30;i++){for(const sx of[0,1]){const x=sx?w-3-r()*7:3+r()*7,y=r()*h;g.fillStyle='rgba(138,106,68,0.55)';g.beginPath();g.ellipse(x,y,1.6+r()*1.4,1.3+r()*1.1,0,0,TAU);g.fill();}}
  const e=g.createLinearGradient(0,0,w,0);e.addColorStop(0,'rgba(140,100,60,0.55)');e.addColorStop(0.18,'rgba(140,100,60,0)');e.addColorStop(0.82,'rgba(140,100,60,0)');e.addColorStop(1,'rgba(140,100,60,0.55)');g.fillStyle=e;g.fillRect(0,0,w,h);});
  t.wrapT=THREE.RepeatWrapping;return new THREE.MeshToonMaterial({color:0xffffff,map:t,gradientMap:GRAD,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4});})();
/* suaviza a linha (Chaikin) e reamostra a cada 'step' metros */
function trailCurve(pts,step){
  let P=pts.map(p=>[p[0],p[1]]);
  for(let it=0;it<3;it++){const Q=[P[0]];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];Q.push([a[0]*0.75+b[0]*0.25,a[1]*0.75+b[1]*0.25],[a[0]*0.25+b[0]*0.75,a[1]*0.25+b[1]*0.75]);}Q.push(P[P.length-1]);P=Q;}
  const out=[P[0]];let acc=0;
  for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);let s=step-acc;
    while(s<=L){out.push([a[0]+(b[0]-a[0])*s/L,a[1]+(b[1]-a[1])*s/L]);s+=step;}acc=L-(s-step);}
  out.push(P[P.length-1]);return out;
}
function trailRibbon(C,w){
  const pos=[],nor=[],uv=[],idx=[];let v=0;
  for(let i=0;i<C.length;i++){
    const a=C[Math.max(0,i-1)],b=C[Math.min(C.length-1,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],tl=Math.hypot(tx,tz)||1,nx=-tz/tl*w/2,nz=tx/tl*w/2;
    if(i)v+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1])/4;
    for(const s of[-1,1]){const x=C[i][0]+nx*s,z=C[i][1]+nz*s;pos.push(x,terrainH(x,z)+0.07,z);nor.push(0,1,0);uv.push(s<0?0:1,v);}
    if(i){const k=i*2;idx.push(k-2,k-1,k,k-1,k+1,k);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return g;
}
function cairn(x,z,color,R){
  const g=new THREE.Group(),st=M(0x8a7458),st2=M(0x6e5c46);
  let y=0;for(const [r,m] of [[0.55,st],[0.42,st2],[0.3,st]]){const b=mesh(new THREE.DodecahedronGeometry(r,0),m,(R()-0.5)*0.12,y+r*0.7,(R()-0.5)*0.12,g);b.scale.y=0.7;b.rotation.y=R()*3;y+=r*1.1;}
  mesh(GEO.cyl(0.04,0.04,1.5,5),M(0x5a3a22),0.08,y+0.5,0,g);
  const fl=mesh(GEO.box(0.5,0.26,0.03),BASIC(color),0.34,y+1.05,0,g);fl.rotation.y=R()*0.6;
  mesh(GEO.sph(0.09,6,5),BASIC(color),0.08,y+1.28,0,g);
  g.rotation.y=R()*TAU;onGround(g,x,z,-0.08);colCylT(x,z,0.5,1.6);
}
const TRAIL_NAMES={steam:'de cobre',diesel:'azul-gelo',atom:'verde',bio:'lilás'};
/* as quatro placas numa textura só (uma faixa por tumba), para virarem uma única chamada de desenho */
const SIGN_ROWS=['steam','diesel','atom','bio'];
const SIGN_MAT=new THREE.MeshBasicMaterial({map:canvasTex(256,256,(c,w)=>{SIGN_ROWS.forEach((k,i)=>{const T=TOMBS[k],y=i*64,h=64;
  c.fillStyle='#e4cf9e';c.fillRect(0,y,w,h);c.fillStyle=T.css;c.fillRect(0,y,w,10);c.fillRect(0,y+h-10,w,10);
  c.fillStyle='#2a1a0e';c.font='bold 25px Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.fillText(T.name.replace('Tumba ','T. ').toUpperCase(),w/2-12,y+h/2+1);
  c.beginPath();c.moveTo(w-14,y+h/2);c.lineTo(w-30,y+h/2-11);c.lineTo(w-30,y+h/2+11);c.closePath();c.fill();});})});
function signpost(x,z,key,dirX,dirZ){
  const T=TOMBS[key],g=new THREE.Group(),wood=M(0x6b4326);
  outline(mesh(GEO.box(0.22,2.6,0.22),wood,0,1.3,0,g),1.06);
  const row=SIGN_ROWS.indexOf(key),board=new THREE.Group();board.position.y=2.15;g.add(board);
  outline(mesh(GEO.box(2.3,0.62,0.1),wood,0,0,0,board),1.04);
  for(const sd of[-1,1]){const pg=new THREE.PlaneGeometry(2.2,0.55),uv=pg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,(3-row+uv.getY(i))/4);
    const p=mesh(pg,SIGN_MAT,0,0,sd*0.056,board);if(sd<0){p.rotation.y=Math.PI;p.scale.x=-1;}}
  const a=Math.atan2(dirX,dirZ);board.rotation.y=a-Math.PI/2;
  onGround(g,x,z,0);colCylT(x,z,0.25,2.6);
  valeArea.interact.push({x,z,r:2.4,label:()=>'Placa: '+T.name,use:()=>toast('A trilha com marcos de fita '+TRAIL_NAMES[key]+' leva à '+T.name+(G.relics[key]?' (relíquia já recolhida).':'.'))});
}
let trailCount=0;
function buildTrails(){
  const R=rng(53);
  for(const t of TRAILS){
    const T=TOMBS[t.key],C=trailCurve(t.pts,1.6);t.curve=C;
    VG.add(new THREE.Mesh(trailRibbon(C,3.2),TRAIL_MAT));
    /* marcos a cada ~18 m, alternando os lados, longe da estrada e da porta */
    let acc=0,side=1;
    for(let i=1;i<C.length;i++){
      acc+=Math.hypot(C[i][0]-C[i-1][0],C[i][1]-C[i-1][1]);
      const dRoad=Math.abs(C[i][0]),dEnd=Math.hypot(C[i][0]-C[C.length-1][0],C[i][1]-C[C.length-1][1]);
      if(acc>=18&&dRoad>16&&dEnd>12){
        const a=C[i-1],b=C[Math.min(C.length-1,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],tl=Math.hypot(tx,tz)||1,x=C[i][0]-tz/tl*3.1*side,z=C[i][1]+tx/tl*3.1*side;
        if(pushOut(valeArea,x,z,terrainH(x,z),0.6,2)[0]===x){cairn(x,z,T.color,R);trailCount++;}acc=0;side=-side;
      }
    }
    /* placa na estrada, apontando para a trilha */
    const p0=t.pts[0],p1=t.pts[1],dx=p1[0]-p0[0],dz=p1[1]-p0[1],dl=Math.hypot(dx,dz);
    signpost(p0[0],p0[1]+(p0[1]>0?-3.6:3.6),t.key,dx/dl,dz/dl);
  }
}
