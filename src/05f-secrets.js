/* ====================== segredos do Vale ======================
   12 segredos fora das tumbas, longe da Estrada das Eras: 4 fragmentos de mapa, 5 baús e 3 inscrições legíveis de dia.
   Sem marcador na tela e nada na bússola: só um brilho pequeno de perto. Dão informação e história, nunca mudam um valor do jogo. */
const SEC_FRAGS=[
  {id:'f_nw',x:-127,z:-37,q:'noroeste'},
  {id:'f_ne',x:93,z:-127,q:'nordeste'},
  {id:'f_sw',x:-101,z:121,q:'sudoeste'},
  {id:'f_se',x:137,z:115,q:'sudeste'}
];
const SEC_CHESTS=[
  {id:'c1',x:-121,z:43,rot:0.6},
  {id:'c2',x:-87,z:149,rot:2.1},
  {id:'c3',x:124,z:-115,rot:-0.8},
  {id:'c4',x:92,z:78,rot:1.2},
  {id:'c5',x:-62,z:88,rot:-1.9}
];
const SEC_INSC=[{id:'d1',x:-24,z:98},{id:'d2',x:-48,z:-58},{id:'d3',x:70,z:-30}];
const SEC_IDS=SEC_FRAGS.map(f=>f.id).concat(SEC_CHESTS.map(c=>c.id),SEC_INSC.map(d=>d.id));
const SEC_ENTRIES={
  sec_f_nw:{t:'Fragmento de mapa (noroeste)',s:'Um pedaço rasgado de um mapa antigo. A página Mapa do diário mostra o que ele revela.'},
  sec_f_ne:{t:'Fragmento de mapa (nordeste)',s:'Um pedaço rasgado de um mapa antigo. A página Mapa do diário mostra o que ele revela.'},
  sec_f_sw:{t:'Fragmento de mapa (sudoeste)',s:'Um pedaço rasgado de um mapa antigo. A página Mapa do diário mostra o que ele revela.'},
  sec_f_se:{t:'Fragmento de mapa (sudeste)',s:'Um pedaço rasgado de um mapa antigo. A página Mapa do diário mostra o que ele revela.'},
  sec_c1:{t:'Baú do dirigível',s:'Bilhete sobre os Motores: cada toque gira o holofote um oitavo de volta, e o facho mostra para onde ele aponta. Siga a luz e procure o sensor na parede.'},
  sec_c2:{t:'Baú do oásis',s:'Carta do jardineiro: "Deixei as estufas abertas para o vento entrar. Se um dia voltarem, que encontrem o que sobrou da primeira semente."'},
  sec_c3:{t:'Baú da caldeira',s:'Registro do maquinista: "A caldeira nunca apagou por falta de lenha, e sim por falta de gente. A cidade se acostumou ao ruído e esqueceu o silêncio."'},
  sec_c4:{t:'Baú da estufa',s:'Bilhete sobre a Tumba Viva: ela canta antes de ouvir. Escute a sequência inteira e repita na mesma ordem. Errar faz barulho, e barulho acorda quem dorme.'},
  sec_c5:{t:'Baú da antena',s:'Bilhete sobre o Reator: a água obedece a duas válvulas, uma enche e a outra drena. O que flutua sobe com ela e leva você aonde os pés não chegam.'},
  insc_d1:{t:'Inscrição da semente',s:'A cidade nasceu de uma semente trazida pelo vento. Quem plantou não pediu nada em troca.'},
  insc_d2:{t:'Inscrição da muralha',s:'Cada era achou ser a última. Cada uma construiu mais alto que a anterior e esqueceu de olhar para o chão.'},
  insc_d3:{t:'Inscrição do viajante',s:'Quem chegou ao norte sem as quatro relíquias voltou de mãos vazias. A cidade não tem pressa.'}
};
const secObjs={frags:[],chests:[],insc:[]};
function secCount(){let n=0;for(const k of SEC_IDS)if(G.sec[k])n++;return n;}
function secFragCount(){let n=0;for(const f of SEC_FRAGS)if(G.sec[f.id])n++;return n;}

function tornMapTex(){return canvasTex(128,96,(g,w,h)=>{
  const r=rng(5);g.clearRect(0,0,w,h);g.fillStyle='#e6d3a2';g.strokeStyle='#4a3320';g.lineWidth=3;
  g.beginPath();g.moveTo(8,14);for(let i=1;i<=7;i++)g.lineTo(8+i*16,10+r()*10);g.lineTo(w-6,h*0.45);g.lineTo(w-14,h-12+r()*6);for(let i=6;i>=0;i--)g.lineTo(10+i*16,h-8-r()*10);g.lineTo(4,h*0.5);g.closePath();g.fill();g.stroke();
  g.strokeStyle='#8a6a3a';g.lineWidth=2;for(let k=0;k<5;k++){g.beginPath();g.moveTo(16+r()*30,24+k*13);for(let i=1;i<5;i++)g.lineTo(16+i*20+r()*8,24+k*13+(r()-0.5)*10);g.stroke();}
  g.strokeStyle='#b8392a';g.lineWidth=4;g.beginPath();g.moveTo(80,40);g.lineTo(96,56);g.moveTo(96,40);g.lineTo(80,56);g.stroke();
});}
function dayGlyphTex(seed){const r=rng(seed);return canvasTex(128,192,(g,w,h)=>{
  g.fillStyle='#cdbb96';g.fillRect(0,0,w,h);g.strokeStyle='#3a2a18';g.lineWidth=5;g.lineCap='round';
  for(let row=0;row<5;row++){const y=40+row*28;let x=16;while(x<w-22){const L=10+r()*22;g.beginPath();g.moveTo(x,y);g.lineTo(x+L,y+(r()-0.5)*10);if(r()>0.5){g.moveTo(x+L*0.5,y);g.lineTo(x+L*0.5,y-12);}g.stroke();x+=L+10;}}
  g.strokeStyle='#b8892a';g.fillStyle='#b8892a';g.lineWidth=4;g.beginPath();g.moveTo(34,20);g.quadraticCurveTo(64,2,94,20);g.quadraticCurveTo(64,38,34,20);g.stroke();g.beginPath();g.arc(64,20,5,0,TAU);g.fill();
});}
function secGlow(parent,color,size,y){
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:SOFT,color,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0.5}));
  s.scale.set(size,size,1);s.position.y=y;parent.add(s);return s;
}

function buildSecrets(){
  const wood=M(0x6b4326),metal=M(0x8a7a52),sand=M(0xc89a62),stone=M(0x9a8a6a);
  const paperTex=tornMapTex();
  /* fragmentos de mapa */
  SEC_FRAGS.forEach(f=>{
    const g=new THREE.Group();g.userData.dyn=true;
    mesh(GEO.sph(0.8,6,4),sand,0,0,0,g).scale.set(1,0.3,1);
    const paper=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.75),new THREE.MeshBasicMaterial({map:paperTex,transparent:true,side:THREE.DoubleSide,alphaTest:0.1}));paper.position.y=0.7;paper.rotation.x=-1.1;paper.userData.keep=true;g.add(paper);
    const glow=secGlow(g,0xffe9a0,2.4,0.9);
    onGround(g,f.x,f.z,0.05);
    const o={f,g,paper,glow,t:Math.random()*6};secObjs.frags.push(o);
    valeArea.interact.push({x:f.x,z:f.z,r:2.3,label:()=>G.sec[f.id]?null:'Pegar o fragmento de mapa',use:()=>collectFrag(o)});
  });
  /* baús meio enterrados */
  SEC_CHESTS.forEach(c=>{
    const g=new THREE.Group();g.userData.dyn=true;
    const mound=mesh(GEO.sph(1.5,8,5),sand,0,0.05,0,g);mound.scale.set(1.15,0.35,0.9);
    const body=new THREE.Group();body.rotation.z=0.1;g.add(body);
    outline(mesh(GEO.box(1.5,0.8,0.9),wood,0,0.4,0,body),1.04);
    for(const x of[-0.55,0.55])mesh(GEO.box(0.12,0.84,0.94),metal,x,0.4,0,body);
    const lid=new THREE.Group();lid.position.set(0,0.8,-0.45);body.add(lid);
    outline(mesh(GEO.box(1.5,0.3,0.9),wood,0,0.15,0.45,lid),1.04);
    for(const x of[-0.55,0.55])mesh(GEO.box(0.12,0.34,0.94),metal,x,0.15,0.45,lid);
    mesh(GEO.box(0.22,0.26,0.1),BASIC(0xd8a24a),0,0.1,0.95,lid);
    const glow=secGlow(g,0xffd24a,2.6,1.5);
    g.rotation.y=c.rot;onGround(g,c.x,c.z,-0.3);colCylT(c.x,c.z,0.9,1.1);
    const o={c,g,lid,glow,open:G.sec[c.id]?1:0,t:Math.random()*6};secObjs.chests.push(o);
    valeArea.interact.push({x:c.x,z:c.z,r:2.6,label:()=>G.sec[c.id]?null:'Abrir o baú',use:()=>openChest(o)});
  });
  /* inscrições que dá para ler de dia */
  SEC_INSC.forEach((d,i)=>{
    const mat=new THREE.MeshToonMaterial({map:dayGlyphTex(90+i),gradientMap:GRAD});
    const s=new THREE.Group();outline(mesh(GEO.box(1.7,2.5,0.38),mat,0,1.25,0,s),1.04);mesh(GEO.box(2.1,0.25,0.7),stone,0,0.12,0,s);
    s.rotation.y=Math.atan2(-d.x,-d.z);onGround(s,d.x,d.z);colCylT(d.x,d.z,0.95,3);
    const gl=new THREE.Group();gl.userData.dyn=true;const glow=secGlow(gl,0xfff0c0,1.8,2.9);onGround(gl,d.x,d.z);
    secObjs.insc.push({d,glow,t:Math.random()*6});
    valeArea.interact.push({x:d.x,z:d.z,r:2.9,label:()=>'Ler a inscrição',use:()=>readDayInsc(d)});
  });
  for(const o of secObjs.chests)mergeLocalTree(o.g);
}

function collectFrag(o){
  const f=o.f;if(G.sec[f.id])return;
  G.sec[f.id]=true;o.g.visible=false;SFX.frag();
  addDiary('sec_'+f.id,true);const n=secFragCount();
  toast('Fragmento de mapa recolhido ('+n+'/4). Veja a página Mapa do diário.','good');
  if(n>=4)setTimeout(()=>toast('Os quatro fragmentos se encaixam. O mapa do vale está completo.','good'),1800);
  writeSave(false);
}
function openChest(o){
  const c=o.c;if(G.sec[c.id])return;
  G.sec[c.id]=true;SFX.chest();addDiary('sec_'+c.id,true);
  const e=ENTRIES['sec_'+c.id];toast(e.t+'. '+e.s,'good');
  for(let i=0;i<4;i++)puff(c.x+(Math.random()-0.5)*1.4,terrainH(c.x,c.z)+1.2,c.z+(Math.random()-0.5)*1.2,{vy:1.1,size:0.5,life:1.4,op:0.5,color:0xffe9a0});
  writeSave(false);
}
function readDayInsc(d){
  const key='insc_'+d.id,e=ENTRIES[key];
  if(!G.sec[d.id]){G.sec[d.id]=true;addDiary(key,true);writeSave(false);}
  SFX.insc();toast(e.s);
}
function applySecrets(){
  for(const o of secObjs.frags)o.g.visible=!G.sec[o.f.id];
  for(const o of secObjs.chests){o.open=G.sec[o.c.id]?1:0;o.lid.rotation.x=-1.25*o.open;}
}
function updateSecrets(dt,t){
  const p=G.p,vale=G.area===valeArea;if(!vale)return;
  const boost=0.35+NIGHT*0.4;
  for(const o of secObjs.frags){
    if(!o.g.visible)continue;
    const dd=Math.abs(p.x-o.f.x)+Math.abs(p.z-o.f.z);if(dd>90)continue;
    o.paper.position.y=0.75+Math.sin(t*1.8+o.t)*0.12;o.paper.rotation.z=t*0.6+o.t;
    o.glow.material.opacity=boost*(0.7+0.3*Math.sin(t*2.4+o.t));
  }
  for(const o of secObjs.chests){
    const dd=Math.abs(p.x-o.c.x)+Math.abs(p.z-o.c.z);
    if(o.open<1&&G.sec[o.c.id])o.open=Math.min(1,o.open+dt*1.6);
    if(dd<90){const e=smooth(0,1,o.open);o.lid.rotation.x=-1.25*e;}
    if(dd<90)o.glow.material.opacity=G.sec[o.c.id]?Math.max(0,0.5-o.open):boost*(0.6+0.4*Math.sin(t*2+o.t));
  }
  for(const o of secObjs.insc){
    const dd=Math.abs(p.x-o.d.x)+Math.abs(p.z-o.d.z);if(dd>90)continue;
    o.glow.material.opacity=(G.sec[o.d.id]?0.12:0.3)+NIGHT*0.2+0.05*Math.sin(t*1.6+o.t);
  }
}

/* ---------- o mapa do vale (página do diário), desenhado à mão: sem posição do jogador, sem marcadores, sem segredos ---------- */
function drawVMap(cv){
  const W=cv.width,g=cv.getContext('2d'),k=(W/2-16)/205,U=x=>W/2+x*k,V=z=>W/2+z*k;
  const full=document.createElement('canvas');full.width=W;full.height=W;const f=full.getContext('2d'),r=rng(12);
  f.fillStyle='#e9d8ae';f.fillRect(0,0,W,W);
  for(let i=0;i<60;i++){f.fillStyle='rgba(150,110,60,'+(0.04+r()*0.06)+')';f.beginPath();f.arc(r()*W,r()*W,6+r()*26,0,TAU);f.fill();}
  const wob=(cx,cy,rad,n,amp)=>{f.beginPath();for(let i=0;i<=n;i++){const a=i/n*TAU,rr=rad+Math.sin(a*5+1)*amp+(r()-0.5)*amp;const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;if(i)f.lineTo(x,y);else f.moveTo(x,y);}f.closePath();};
  wob(W/2,W/2,200*k,64,3);f.fillStyle='#dcbd82';f.fill();f.strokeStyle='#4a3320';f.lineWidth=2.4;f.stroke();
  wob(W/2,W/2,184*k,64,2.4);f.strokeStyle='rgba(74,51,32,0.35)';f.lineWidth=1.2;f.stroke();
  f.strokeStyle='rgba(120,84,40,0.55)';f.lineWidth=1.2;
  for(let i=0;i<46;i++){const a=r()*TAU,d=r()*170*k,x=W/2+Math.cos(a)*d,y=W/2+Math.sin(a)*d;f.beginPath();f.moveTo(x-7,y);f.quadraticCurveTo(x,y-4,x+7,y);f.stroke();}
  /* a Estrada das Eras */
  f.strokeStyle='#4a3320';f.lineWidth=1.6;f.setLineDash([5,4]);
  for(const s of[-1,1]){f.beginPath();f.moveTo(U(s*9),V(125));f.lineTo(U(s*9),V(-125));f.stroke();}
  /* as trilhas até as tumbas, na cor de cada era */
  f.lineWidth=2.4;f.setLineDash([4,4]);
  for(const t of TRAILS){const C=t.curve||t.pts;f.strokeStyle=TOMBS[t.key].css;f.beginPath();C.forEach((p,i)=>i?f.lineTo(U(p[0]),V(p[1])):f.moveTo(U(p[0]),V(p[1])));f.stroke();}
  f.setLineDash([]);
  /* o acampamento, o oásis, o Autômato */
  f.fillStyle='#b9533a';f.strokeStyle='#4a3320';f.lineWidth=1.6;for(const dx of[-9,0,9]){f.beginPath();f.moveTo(U(dx),V(150)-9);f.lineTo(U(dx)-7,V(150)+3);f.lineTo(U(dx)+7,V(150)+3);f.closePath();f.fill();f.stroke();}
  f.fillStyle='#6ab0d0';f.beginPath();f.ellipse(U(-70),V(140),9,6,0,0,TAU);f.fill();f.stroke();f.strokeStyle='#3f7a3a';f.lineWidth=2;for(const [dx,dy] of [[-13,-6],[12,-7],[-11,8],[13,8]]){f.beginPath();f.moveTo(U(-70)+dx,V(140)+dy);f.lineTo(U(-70)+dx,V(140)+dy-8);f.stroke();f.beginPath();f.arc(U(-70)+dx,V(140)+dy-9,3,0,TAU);f.stroke();}
  f.fillStyle='#b08a3a';f.strokeStyle='#4a3320';f.lineWidth=1.6;f.beginPath();f.arc(U(50),V(-5),4.5,0,TAU);f.fill();f.stroke();
  /* as torres das cinco eras */
  const towers=[[100,-90,'#c8743a',1],[-140,-10,'#6fd3ff',1],[-100,100,'#5dff7a',1],[110,90,'#b98cff',1],[0,-165,'#ffd24a',1.7]];
  for(const[x,z,c,sz]of towers){f.fillStyle=c;f.strokeStyle='#2a1a0e';f.lineWidth=1.8;f.beginPath();f.moveTo(U(x),V(z)-11*sz);f.lineTo(U(x)-7*sz,V(z)+5*sz);f.lineTo(U(x)+7*sz,V(z)+5*sz);f.closePath();f.fill();f.stroke();}
  /* bordas e rosa dos ventos */
  f.strokeStyle='#4a3320';f.lineWidth=3;f.strokeRect(4,4,W-8,W-8);
  f.fillStyle='#4a3320';f.font='bold 15px Georgia,serif';f.textAlign='center';f.fillText('N',W-22,24);f.beginPath();f.moveTo(W-22,28);f.lineTo(W-27,42);f.lineTo(W-17,42);f.closePath();f.fill();
  /* monta a página: só os pedaços já achados aparecem; os outros são silhuetas escuras */
  g.clearRect(0,0,W,W);g.fillStyle='#1f160e';g.fillRect(0,0,W,W);
  const quads=[['f_nw',0,0],['f_ne',1,0],['f_sw',0,1],['f_se',1,1]],h=W/2;
  for(const[id,qx,qy]of quads){
    g.save();g.beginPath();g.rect(qx*h+1.5,qy*h+1.5,h-3,h-3);g.clip();
    if(G.sec[id])g.drawImage(full,0,0);
    else{g.fillStyle='#2b1f14';g.fillRect(qx*h,qy*h,h,h);g.strokeStyle='rgba(180,140,80,0.35)';g.setLineDash([6,5]);g.lineWidth=2;g.strokeRect(qx*h+8,qy*h+8,h-16,h-16);g.setLineDash([]);g.fillStyle='rgba(180,140,80,0.4)';g.font='bold 30px Georgia,serif';g.textAlign='center';g.fillText('?',qx*h+h/2,qy*h+h/2+10);}
    g.restore();
  }
  if(secFragCount()>=4){
    g.fillStyle='#2a1a0e';g.font='bold 12px "Special Elite",Georgia,serif';g.textAlign='center';
    const lab=(t,x,z,dy)=>{const w=g.measureText(t).width/2+3,u=Math.min(W-w-6,Math.max(w+6,U(x))),v=V(z)+dy;g.fillStyle='rgba(233,216,174,0.82)';g.fillRect(u-w,v-11,w*2,15);g.fillStyle='#2a1a0e';g.fillText(t,u,v);};
    lab('Acampamento',0,150,22);lab('Oásis',-70,140,22);lab('Autômato',50,-5,20);
    lab('Tumba das Engrenagens',100,-90,24);lab('Tumba dos Motores',-140,-10,24);lab('Tumba do Reator',-100,100,24);lab('Tumba Viva',110,90,24);lab('Cidade-Jardim',0,-165,30);
  }
}
