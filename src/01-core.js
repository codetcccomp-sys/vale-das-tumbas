'use strict';
if(typeof THREE==='undefined'){const b=document.getElementById('boot');if(b)b.innerHTML='<p>Não foi possível carregar o motor 3D. Verifique a conexão e recarregue a página.</p>';throw new Error('three.js indisponível');}
/* ====================== utilidades ====================== */
const TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
/* ângulo em [-π, π] em tempo constante: resto exato da divisão por 2π e no máximo um ajuste de meia volta.
   (Os laços de subtração antigos travavam com valores enormes: 1e20 - 2π == 1e20.) Não número ou não finito vira 0. */
const wrapPi=a=>{if(typeof a!=='number'||!isFinite(a))return 0;if(a>=-Math.PI&&a<=Math.PI)return a;let r=a%TAU;if(r>Math.PI)r-=TAU;else if(r<-Math.PI)r+=TAU;return r;};
const $=id=>document.getElementById(id);
function rng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const isTouchDevice=('ontouchstart' in window)||(navigator.maxTouchPoints>0);

/* ====================== textos (pt-BR) ====================== */
const TXT={
  welcome:'Bem-vindo ao Vale das Tumbas. Explore o horizonte em busca das torres.',
  sealed:'Esta tumba está selada.',
  saved:'Progresso salvo: relíquias, diário, segredos e posição no vale.',
  saveFixed:'Parte do salvamento estava danificada. O que pôde ser aproveitado foi recuperado.',
  saveFail:'Não foi possível salvar o progresso neste navegador.',
  soundOn:'Som: ligado', soundOff:'Som: desligado',
  gfxNorm:'Gráficos: normais', gfxLow:'Gráficos: leves',
  camAuto:'Câmera automática: ligada', camManual:'Câmera automática: desligada',
  enterTomb:'Entrando na tumba...', backValley:'Voltando ao vale...',
  deathTomb:'Os perigos da tumba te venceram.',noHearts:'Sem corações.',
  fall:{gap:'Você caiu no vão.',water:'Você caiu na água funda do canal.',tile:'A placa sem o olho cedeu sob seus pés.',piston:'O pistão desceu com você em cima. Espere a luz de aviso.'},
  hit:{automato:'O Autômato de latão te acertou. Ande devagar perto dele.',sentinel:'O Robô-vigia te alcançou. Saia do facho e use os pilares.',
    bot:'O Robô atômico te acertou. Saia da sala e ele volta a dormir.',clone:'Um Clone te alcançou. Saia da sala e eles voltam a dormir.'},
  backPoint:'Voltando ao último ponto de energia.',backPointCity:'Voltando à última flor de luz.',
  backEntrance:'Voltando à entrada: use um ponto de energia para salvar mais perto.',backEntranceCity:'Voltando à entrada: toque uma flor de luz para salvar mais perto.',
  boilerLit:'Caldeira acesa. Ponto de controle salvo e lanterna recarregada.',
  pointAgain:'Ponto de controle salvo aqui. Lanterna recarregada.',pointAgainCity:'Ponto de controle salvo aqui.',
  pointLabel:'Recarregar e salvar o ponto',pointLabelCity:'Salvar o ponto aqui',
  nightHint:'Uma inscrição brilha ao longe...',
  dayInsc:'A inscrição está apagada. Volte à noite.',
  finalNeed:(n,list)=>'A porta tem quatro encaixes. Falta'+(n===1?' ':'m ')+n+': '+list+'. Siga essas cores na bússola.',
  finalAll:'Os quatro encaixes brilham. A porta se abre.',
  ending:['A civilização do vale avançou do vapor à engenharia genética.','Em cada era, buscou mais poder, e abandonou a cidade em harmonia com a natureza que deu origem a tudo.','Ela esperou por você.'],
  hint:{kb:'E',pad:'X',touch:''},
  tip:{touch:'Joystick à esquerda para andar. Arraste o lado direito para olhar. Perto de algo, toque em Usar.',kb:'WASD anda, arrastar o mouse gira a câmera, E usa, T liga a lanterna, J abre o diário e M o mapa.',pad:'Analógico esquerdo anda, o direito gira a câmera. X usa, Y liga a lanterna, A pula.'}
};

/* ====================== renderizador ====================== */
const app=$('app'),canvas=$('c');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:!isTouchDevice,powerPreference:'high-performance'});}
catch(err){document.body.innerHTML='<p style="padding:24px;font:18px sans-serif;color:#ecdcb4">Este navegador não conseguiu iniciar o gráfico 3D (WebGL).</p>';throw err;}
const CFG={gfx:'normal',autoCam:true};
/* resolução: no modo normal o lado menor da imagem nunca fica abaixo de 720 pixels reais (só a tela do aparelho limita);
   no modo leve fica fixa em 540. O ajuste automático (06-game.js) anda só dentro desta faixa. */
function pixelRange(){
  const dpr=window.devicePixelRatio||1,short=Math.max(1,Math.min(window.innerWidth||1,window.innerHeight||1));
  if(CFG.gfx==='leve'){const r=Math.min(dpr,Math.max(1,540/short));return[r,r];}
  const lo=Math.min(dpr,Math.max(1,720/short));return[lo,Math.min(dpr,Math.max(lo,2))];
}
const pixelCap=()=>pixelRange()[1];
let pixelRatio=pixelCap();
renderer.setPixelRatio(pixelRatio);
let glLost=false;
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();glLost=true;});
canvas.addEventListener('webglcontextrestored',()=>{glLost=false;resize();});
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(62,1,0.1,900);
function resize(){const w=Math.max(1,app.clientWidth),h=Math.max(1,app.clientHeight),r=pixelRange();pixelRatio=clamp(pixelRatio,r[0],r[1]);renderer.setPixelRatio(pixelRatio);renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=camera.aspect<1?74:62;camera.updateProjectionMatrix();}
window.addEventListener('resize',resize);
const cam={yaw:0,pitch:0.34,want:5.6,cur:5.6};

/* ====================== materiais (sombreamento em degraus + contorno de tinta) ====================== */
function makeGradient(vals){const t=new THREE.DataTexture(new Uint8Array(vals),vals.length,1,THREE.RedFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;}
const GRAD=makeGradient([78,150,215,255]);
const MATS=new Map();
function M(color,o){const k=color+'|'+(o?JSON.stringify(o):'');let m=MATS.get(k);if(!m){m=new THREE.MeshToonMaterial(Object.assign({color,gradientMap:GRAD},o||{}));MATS.set(k,m);}return m;}
const BCACHE=new Map();
function BASIC(color,o){if(o)return new THREE.MeshBasicMaterial(Object.assign({color},o));let m=BCACHE.get(color);if(!m){m=new THREE.MeshBasicMaterial({color});BCACHE.set(color,m);}return m;}
function BASICU(color,o){return new THREE.MeshBasicMaterial(Object.assign({color},o||{}));}   // material único: a cor muda durante o jogo
const OUTLINE_MAT=new THREE.MeshBasicMaterial({color:0x0f0a06,side:THREE.BackSide});
function outline(m,s){const o=new THREE.Mesh(m.geometry,OUTLINE_MAT);o.scale.setScalar(s||1.07);m.add(o);return m;}
function mesh(geo,mat,x,y,z,parent){const m=new THREE.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);if(parent)parent.add(m);return m;}
const GEO={
  box:(w,h,d)=>new THREE.BoxGeometry(w,h,d),
  cyl:(rt,rb,h,s)=>new THREE.CylinderGeometry(rt,rb,h,s||10),
  sph:(r,w,h)=>new THREE.SphereGeometry(r,w||10,h||8),
  cone:(r,h,s)=>new THREE.ConeGeometry(r,h,s||8),
  tor:(r,t,rs,ts)=>new THREE.TorusGeometry(r,t,rs||6,ts||14)
};

/* junta a geometria estática de uma área em poucas malhas (por material e por faixa de 24 m em z).
   Tudo que se mexe (grupos ou malhas com userData.dyn) fica de fora. O contorno de tinta vira uma malha só. */
function mergeStatic(root,chunk){chunk=chunk||24;
  root.updateMatrixWorld(true);
  const buckets=new Map(),dead=[],tmp=new THREE.Vector3();
  (function walk(o){
    for(const c of o.children){
      if(c.userData&&c.userData.dyn)continue;
      if(c.isMesh&&c.geometry&&c.geometry.attributes&&c.geometry.attributes.position&&!Array.isArray(c.material)){
        c.getWorldPosition(tmp);const key=c.material.uuid+'|'+Math.floor(tmp.z/chunk);
        let b=buckets.get(key);if(!b){b={mat:c.material,list:[]};buckets.set(key,b);}b.list.push(c);dead.push(c);
      }
      walk(c);
    }
  })(root);
  let before=dead.length;
  for(const b of buckets.values()){
    const pos=[],nor=[],uv=[],idx=[];let off=0;
    for(const m of b.list){
      m.updateWorldMatrix(true,false);
      const g=m.geometry.clone();g.applyMatrix4(m.matrixWorld);
      const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv,cnt=P.count;
      for(let i=0;i<P.array.length;i++)pos.push(P.array[i]);
      if(N)for(let i=0;i<N.array.length;i++)nor.push(N.array[i]);else for(let i=0;i<P.array.length;i++)nor.push(0);
      if(U)for(let i=0;i<U.array.length;i++)uv.push(U.array[i]);else for(let i=0;i<cnt*2;i++)uv.push(0);
      if(g.index){const ia=g.index.array;for(let i=0;i<ia.length;i++)idx.push(ia[i]+off);}else for(let i=0;i<cnt;i++)idx.push(off+i);
      off+=cnt;g.dispose();
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    geo.setIndex(off>65535?new THREE.Uint32BufferAttribute(idx,1):new THREE.Uint16BufferAttribute(idx,1));
    const mm=new THREE.Mesh(geo,b.mat);root.add(mm);
  }
  for(const m of dead){if(m.parent)m.parent.remove(m);}
  return{merged:buckets.size,removed:before};
}

/* dentro de um objeto articulado (personagem, holofote, porta), junta as peças que ficam paradas em relação à própria articulação.
   Cada grupo/articulação vira poucas malhas (uma por material); os grupos filhos continuam livres para girar. */
function mergeLocalTree(root){
  root.updateMatrixWorld(true);
  const groups=[];root.traverse(o=>{if(o.isGroup||o===root)groups.push(o);});
  for(const Gp of groups){
    const buckets=new Map(),dead=[];
    const collect=(m,acc)=>{
      const m4=new THREE.Matrix4().multiplyMatrices(acc,m.matrix);
      if(!(m.userData&&m.userData.keep)&&m.geometry&&m.geometry.attributes.position&&!Array.isArray(m.material)){
        let b=buckets.get(m.material.uuid);if(!b){b={mat:m.material,list:[]};buckets.set(m.material.uuid,b);}b.list.push({geo:m.geometry,m4});dead.push(m);
      }
      for(const c of m.children){if(c.isMesh)collect(c,m4);}
    };
    for(const c of Gp.children){if(c.isMesh)collect(c,new THREE.Matrix4());}
    for(const b of buckets.values()){
      const pos=[],nor=[],uv=[],idx=[];let off=0;
      for(const it of b.list){
        const g=it.geo.clone();g.applyMatrix4(it.m4);
        const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv,cnt=P.count;
        for(let i=0;i<P.array.length;i++)pos.push(P.array[i]);
        if(N)for(let i=0;i<N.array.length;i++)nor.push(N.array[i]);else for(let i=0;i<P.array.length;i++)nor.push(0);
        if(U)for(let i=0;i<U.array.length;i++)uv.push(U.array[i]);else for(let i=0;i<cnt*2;i++)uv.push(0);
        if(g.index){const ia=g.index.array;for(let i=0;i<ia.length;i++)idx.push(ia[i]+off);}else for(let i=0;i<cnt;i++)idx.push(off+i);
        off+=cnt;g.dispose();
      }
      const geo=new THREE.BufferGeometry();
      geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
      geo.setIndex(off>65535?new THREE.Uint32BufferAttribute(idx,1):new THREE.Uint16BufferAttribute(idx,1));
      Gp.add(new THREE.Mesh(geo,b.mat));
    }
    for(const m of dead){if(m.parent)m.parent.remove(m);}
  }
}

/* variante de mergeLocalTree para personagens: as cores dos materiais simples viram cor de vértice, então cada articulação
   vira só uma malha iluminada, uma sem luz e uma de contorno. Materiais com textura, transparência ou marcados com userData.keep ficam à parte. */
const VC_TOON=new THREE.MeshToonMaterial({vertexColors:true,gradientMap:GRAD}),VC_BASIC=new THREE.MeshBasicMaterial({vertexColors:true});
function mergeLocalVC(root){
  root.updateMatrixWorld(true);
  const groups=[];root.traverse(o=>{if(o.isGroup||o===root)groups.push(o);});
  for(const Gp of groups){
    const buckets=new Map(),dead=[];
    const collect=(m,acc)=>{
      const m4=new THREE.Matrix4().multiplyMatrices(acc,m.matrix),mat=m.material;
      if(!(m.userData&&m.userData.keep)&&m.geometry&&m.geometry.attributes.position&&!Array.isArray(mat)){
        let key,tint=null;
        if(mat===OUTLINE_MAT)key='o';
        else if(mat.isMeshToonMaterial&&!mat.map&&!mat.transparent&&!mat.emissiveMap&&mat.side===THREE.FrontSide){key='t';tint=mat.color;}
        else if(mat.isMeshBasicMaterial&&!mat.map&&!mat.transparent&&mat.side===THREE.FrontSide){key='b';tint=mat.color;}
        else key=mat.uuid;
        let b=buckets.get(key);if(!b){b={key,mat,list:[]};buckets.set(key,b);}b.list.push({geo:m.geometry,m4,tint});dead.push(m);
      }
      for(const c of m.children){if(c.isMesh)collect(c,m4);}
    };
    for(const c of Gp.children){if(c.isMesh)collect(c,new THREE.Matrix4());}
    for(const b of buckets.values()){
      const pos=[],nor=[],uv=[],idx=[],col=[],tinted=b.key==='t'||b.key==='b';let off=0;
      for(const it of b.list){
        const g=it.geo.clone();g.applyMatrix4(it.m4);
        const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv,cnt=P.count;
        for(let i=0;i<P.array.length;i++)pos.push(P.array[i]);
        if(N)for(let i=0;i<N.array.length;i++)nor.push(N.array[i]);else for(let i=0;i<P.array.length;i++)nor.push(0);
        if(U)for(let i=0;i<U.array.length;i++)uv.push(U.array[i]);else for(let i=0;i<cnt*2;i++)uv.push(0);
        if(tinted)for(let i=0;i<cnt;i++)col.push(it.tint.r,it.tint.g,it.tint.b);
        if(g.index){const ia=g.index.array;for(let i=0;i<ia.length;i++)idx.push(ia[i]+off);}else for(let i=0;i<cnt;i++)idx.push(off+i);
        off+=cnt;g.dispose();
      }
      const geo=new THREE.BufferGeometry();
      geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
      if(tinted)geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
      geo.setIndex(off>65535?new THREE.Uint32BufferAttribute(idx,1):new THREE.Uint16BufferAttribute(idx,1));
      Gp.add(new THREE.Mesh(geo,b.key==='t'?VC_TOON:b.key==='b'?VC_BASIC:b.mat));
    }
    for(const m of dead){if(m.parent)m.parent.remove(m);}
  }
}

/* símbolos desenhados em canvas (o olho aparece em todas as eras) */
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=2;return t;}
function eyeTexture(fg,bg){return canvasTex(128,128,(g)=>{if(bg){g.fillStyle=bg;g.fillRect(0,0,128,128);}g.strokeStyle=fg;g.fillStyle=fg;g.lineWidth=8;g.lineCap='round';
  g.beginPath();g.moveTo(12,64);g.quadraticCurveTo(64,14,116,64);g.quadraticCurveTo(64,114,12,64);g.stroke();
  g.beginPath();g.arc(64,64,18,0,TAU);g.fill();
  for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*0.42;g.beginPath();g.moveTo(64+Math.cos(a)*40,56+Math.sin(a)*40);g.lineTo(64+Math.cos(a)*54,56+Math.sin(a)*54);g.stroke();}});}
function gearTexture(fg,bg){return canvasTex(128,128,(g)=>{g.fillStyle=bg;g.fillRect(0,0,128,128);g.strokeStyle=fg;g.fillStyle=fg;g.lineWidth=7;
  for(let i=0;i<10;i++){const a=i/10*TAU;g.beginPath();g.moveTo(64+Math.cos(a)*34,64+Math.sin(a)*34);g.lineTo(64+Math.cos(a)*52,64+Math.sin(a)*52);g.stroke();}
  g.beginPath();g.arc(64,64,34,0,TAU);g.stroke();g.beginPath();g.arc(64,64,10,0,TAU);g.fill();});}
function glyphTexture(seed){const r=rng(seed);return canvasTex(128,192,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);g.strokeStyle='#fff';g.lineWidth=5;g.lineCap='round';
  for(let row=0;row<6;row++){const y=18+row*30;let x=16;while(x<w-22){const L=10+r()*22;g.beginPath();g.moveTo(x,y);g.lineTo(x+L,y+(r()-0.5)*10);if(r()>0.5){g.moveTo(x+L*0.5,y);g.lineTo(x+L*0.5,y-12);}g.stroke();x+=L+10;}}
  g.beginPath();g.arc(w/2,h-14,7,0,TAU);g.stroke();});}
const SOFT=canvasTex(64,64,(g)=>{const r=g.createRadialGradient(32,32,2,32,32,30);r.addColorStop(0,'rgba(255,255,255,0.95)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});

/* ====================== partículas (vapor, poeira) ====================== */
const puffGroup=new THREE.Group();scene.add(puffGroup);
const puffs=[];let puffIdx=0;
for(let i=0;i<30;i++){const m=new THREE.SpriteMaterial({map:SOFT,transparent:true,depthWrite:false,opacity:0,color:0xffffff});const s=new THREE.Sprite(m);s.visible=false;puffGroup.add(s);puffs.push({s,life:0,max:1,vx:0,vy:0,vz:0,size:1,grow:1,op:0.5});}
function puff(x,y,z,o){o=o||{};const p=puffs[puffIdx++%puffs.length];p.s.position.set(x,y,z);p.life=p.max=o.life||1.4;p.vx=o.vx||0;p.vy=o.vy===undefined?1.2:o.vy;p.vz=o.vz||0;p.size=o.size||0.8;p.grow=o.grow===undefined?1.6:o.grow;p.op=o.op===undefined?0.5:o.op;p.s.material.color.setHex(o.color||0xffffff);p.s.visible=true;}
function updatePuffs(dt){for(const p of puffs){if(!p.s.visible)continue;p.life-=dt;if(p.life<=0){p.s.visible=false;continue;}const k=1-p.life/p.max;p.s.position.x+=p.vx*dt;p.s.position.y+=p.vy*dt;p.s.position.z+=p.vz*dt;const sc=p.size*(1+k*p.grow);p.s.scale.set(sc,sc,1);p.s.material.opacity=p.op*(1-k)*Math.min(1,k*6);}}

/* ====================== áudio (tudo sintetizado, sem arquivos) ====================== */
const AU={ctx:null,master:null,sfx:null,amb:null,mus:null,on:true,vol:0.8,noise:null,wind:null,hum:null,nextTick:0,flip:false,nextChord:2,last:{}};
function auInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended'){try{AU.ctx.resume();}catch(e){}}return;}
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=AU.ctx=new C();
    AU.master=c.createGain();AU.master.gain.value=AU.on?AU.vol:0;AU.master.connect(c.destination);
    for(const k of ['sfx','amb','mus']){AU[k]=c.createGain();AU[k].connect(AU.master);}
    AU.sfx.gain.value=0.9;AU.amb.gain.value=0.55;AU.mus.gain.value=0.4;
    const len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AU.noise=buf;
    // vento
    const ws=c.createBufferSource();ws.buffer=buf;ws.loop=true;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=520;bp.Q.value=0.6;
    const wg=c.createGain();wg.gain.value=0;const lfo=c.createOscillator();lfo.frequency.value=0.11;const lg=c.createGain();lg.gain.value=0.08;lfo.connect(lg);lg.connect(wg.gain);
    ws.connect(bp);bp.connect(wg);wg.connect(AU.amb);ws.start();lfo.start();AU.wind=wg;
    // zumbido grave das tumbas
    const hg=c.createGain();hg.gain.value=0;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=220;
    for(const f of [48,72.5]){const o=c.createOscillator();o.type='triangle';o.frequency.value=f;o.connect(lp);o.start();}
    lp.connect(hg);hg.connect(AU.amb);AU.hum=hg;
    // motor a diesel: serra grave com pulsos lentos
    const eg=c.createGain();eg.gain.value=0;const elp=c.createBiquadFilter();elp.type='lowpass';elp.frequency.value=150;
    const eo=c.createOscillator();eo.type='sawtooth';eo.frequency.value=34;const eo2=c.createOscillator();eo2.type='square';eo2.frequency.value=51;
    const elfo=c.createOscillator();elfo.frequency.value=6.5;const elg=c.createGain();elg.gain.value=0.35;elfo.connect(elg);const mod=c.createGain();mod.gain.value=0.65;elg.connect(mod.gain);
    eo.connect(elp);eo2.connect(elp);elp.connect(mod);mod.connect(eg);eg.connect(AU.amb);eo.start();eo2.start();elfo.start();AU.engine=eg;
    // reator atômico: zumbido agudo e estável com tremolo lento
    const rg=c.createGain();rg.gain.value=0;const rlp=c.createBiquadFilter();rlp.type='lowpass';rlp.frequency.value=600;
    const ro1=c.createOscillator();ro1.type='sine';ro1.frequency.value=112;const ro2=c.createOscillator();ro2.type='sine';ro2.frequency.value=167;const ro3=c.createOscillator();ro3.type='triangle';ro3.frequency.value=56;
    const rl=c.createOscillator();rl.frequency.value=0.35;const rlg=c.createGain();rlg.gain.value=0.25;const rm=c.createGain();rm.gain.value=0.75;rl.connect(rlg);rlg.connect(rm.gain);
    ro1.connect(rlp);ro2.connect(rlp);ro3.connect(rlp);rlp.connect(rm);rm.connect(rg);rg.connect(AU.amb);ro1.start();ro2.start();ro3.start();rl.start();AU.reactor=rg;
    // tumba viva: pad orgânico, grave e lento
    const bgn=c.createGain();bgn.gain.value=0;const blp=c.createBiquadFilter();blp.type='lowpass';blp.frequency.value=420;
    const bo1=c.createOscillator();bo1.type='triangle';bo1.frequency.value=98;const bo2=c.createOscillator();bo2.type='triangle';bo2.frequency.value=147.8;const bo3=c.createOscillator();bo3.type='sine';bo3.frequency.value=73.4;
    const bl=c.createOscillator();bl.frequency.value=0.18;const blg=c.createGain();blg.gain.value=0.3;const bm=c.createGain();bm.gain.value=0.7;bl.connect(blg);blg.connect(bm.gain);
    bo1.connect(blp);bo2.connect(blp);bo3.connect(blp);blp.connect(bm);bm.connect(bgn);bgn.connect(AU.amb);bo1.start();bo2.start();bo3.start();bl.start();AU.bio=bgn;
  }catch(e){AU.ctx=null;}
}
function auSetOn(on){AU.on=on;if(AU.master)AU.master.gain.setTargetAtTime(on?AU.vol:0,AU.ctx.currentTime,0.05);}
function auArea(inTomb,night,kind){AU.kind=kind||'steam';if(!AU.ctx)return;const t=AU.ctx.currentTime;AU.wind.gain.setTargetAtTime(inTomb?(AU.kind==='city'?0.14:0):(night?0.16:0.3),t,0.6);
  AU.hum.gain.setTargetAtTime(inTomb&&AU.kind==='steam'?0.16:0,t,0.6);AU.engine.gain.setTargetAtTime(inTomb&&AU.kind==='diesel'?0.3:0,t,0.6);AU.reactor.gain.setTargetAtTime(inTomb&&AU.kind==='atom'?0.2:0,t,0.6);AU.bio.gain.setTargetAtTime(inTomb&&AU.kind==='bio'?0.2:0,t,0.6);}
function tone(f,d,type,v,slide,delay,bus){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f*slide),t+d);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||0.2,t+Math.min(0.02,d/3));g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AU[bus||'sfx']);o.start(t);o.stop(t+d+0.05);}
function burst(d,ftype,f,v,delay,q){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime+(delay||0),s=c.createBufferSource();s.buffer=AU.noise;s.loopStart=0;const fl=c.createBiquadFilter();fl.type=ftype||'lowpass';fl.frequency.value=f||1000;fl.Q.value=q||0.8;
  const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||0.2,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(fl);fl.connect(g);g.connect(AU.sfx);s.start(t,Math.random()*1.5,d+0.05);}
function once(k,gap,fn){const now=performance.now();if(AU.last[k]&&now-AU.last[k]<gap)return;AU.last[k]=now;fn();}
const SFX={
  step:(run,metal)=>once('step',90,()=>{if(metal){burst(0.07,'bandpass',run?2200:1700,run?0.12:0.07,0,2);tone(run?190:150,0.05,'square',0.02);}else burst(0.09,'lowpass',run?1100:800,run?0.16:0.09);}),
  jump:()=>{burst(0.1,'lowpass',900,0.1);tone(220,0.14,'triangle',0.05,1.5);},
  land:(hard)=>{burst(0.14,'lowpass',500,hard?0.3:0.14);},
  click:()=>{tone(1700,0.03,'square',0.05);tone(1100,0.05,'square',0.04,1,0.03);},
  use:()=>{tone(520,0.08,'triangle',0.1);tone(780,0.1,'triangle',0.08,1,0.06);},
  deny:()=>{tone(180,0.14,'sawtooth',0.07,0.7);},
  warn:()=>once('warn',3500,()=>{tone(880,0.1,'square',0.06);tone(880,0.1,'square',0.06,1,0.16);}),
  hit:()=>{burst(0.22,'lowpass',300,0.4);tone(110,0.25,'sawtooth',0.12,0.5);},
  steam:(v)=>once('steam',250,()=>burst(0.5,'highpass',2600,v||0.12,0,0.6)),
  piston:()=>once('piston',140,()=>{tone(90,0.12,'square',0.06,0.6);burst(0.09,'lowpass',700,0.12);}),
  crack:()=>once('crack',120,()=>{burst(0.12,'bandpass',1400,0.2,0,3);tone(140,0.12,'sawtooth',0.05,0.6);}),
  fall:()=>{tone(400,0.7,'sine',0.1,0.15);},
  wake:()=>{tone(90,0.45,'sawtooth',0.12,1.6);burst(0.5,'highpass',2200,0.16,0.05);tone(200,0.2,'square',0.06,0.8,0.2);},
  sleep:()=>{tone(260,0.5,'sine',0.06,0.5);},
  lamp:()=>{burst(0.18,'bandpass',900,0.12,0,1.2);tone(330,0.35,'triangle',0.08,2);tone(495,0.4,'triangle',0.06,2,0.08);},
  gate:()=>{tone(70,1.1,'sawtooth',0.08,1.4);burst(1.1,'lowpass',420,0.14);},
  lever:()=>{tone(150,0.1,'square',0.08);burst(0.3,'highpass',2400,0.14,0.04);},
  relic:()=>{[392,494,587,784,988].forEach((f,i)=>tone(f,0.9,'triangle',0.09,1,i*0.11));burst(0.8,'highpass',3000,0.05,0.2);},
  heal:()=>{tone(523,0.3,'sine',0.08);tone(659,0.35,'sine',0.07,1,0.1);tone(784,0.5,'sine',0.07,1,0.2);},
  page:()=>{burst(0.12,'bandpass',2500,0.07,0,0.7);},
  insc:()=>{tone(220,0.8,'sine',0.07);tone(330,0.9,'sine',0.05,1,0.1);},
  chest:()=>{burst(0.3,'bandpass',500,0.12,0,3);tone(180,0.25,'triangle',0.06,1.5);[660,880,1100].forEach((f,i)=>tone(f,0.5,'sine',0.07,1,0.18+i*0.09));},
  frag:()=>{burst(0.18,'bandpass',2400,0.1,0,2);tone(784,0.3,'triangle',0.07);tone(1046,0.45,'triangle',0.06,1,0.1);},
  node:(i)=>{const f=[262,330,392,523][((i%4)+4)%4];tone(f,0.6,'sine',0.17);tone(f*2,0.4,'triangle',0.05);},
  bioFail:()=>{tone(150,0.4,'sawtooth',0.1,0.5);tone(158,0.4,'sawtooth',0.1,0.5);burst(0.35,'lowpass',500,0.22);},
  bioChime:()=>{[392,494,587,784].forEach((f,i)=>tone(f,0.9,'sine',0.1,1,i*0.12));},
  membrane:()=>{burst(0.9,'bandpass',600,0.12,0,1.5);tone(180,0.9,'sine',0.08,0.4);},
  valve:()=>{tone(200,0.12,'square',0.05,0.6);burst(0.35,'highpass',2200,0.1,0.05,0.7);tone(90,0.4,'sine',0.05,1.4,0.1);},
  pump:()=>once('pump',500,()=>{burst(0.6,'lowpass',500,0.16);tone(60,0.6,'sawtooth',0.05,1.3);}),
  rotate:()=>{tone(140,0.09,'square',0.08,0.7);burst(0.12,'bandpass',1200,0.14,0.02,2);tone(520,0.05,'square',0.03,1,0.06);},
  sensor:()=>{tone(880,0.12,'triangle',0.09);tone(1320,0.22,'triangle',0.08,1,0.1);},
  elev:()=>once('elev',400,()=>{tone(70,0.7,'sawtooth',0.07,1.5);burst(0.7,'lowpass',380,0.12);}),
  alert:()=>{tone(660,0.12,'square',0.08);tone(990,0.16,'square',0.08,1,0.14);}
};
const SCALE=[293.66,329.63,369.99,440,493.88,587.33];
function auUpdate(dt,inTomb,night,mode){
  if(!AU.ctx||!AU.on)return;const now=AU.ctx.currentTime;
  if(inTomb){
    if(AU.kind==='bio'){
      if(now>(AU.nextBeat||0)){AU.nextBeat=now+(AU.beatGap||1);tone(58,0.14,'sine',0.17,0.55,0,'amb');tone(50,0.16,'sine',0.12,0.55,0.2,'amb');}
      if(now>(AU.nextDrip||0)){AU.nextDrip=now+1.4+Math.random()*3.5;const f=700+Math.random()*700;tone(f,0.09,'sine',0.04,0.55,0,'amb');tone(f*0.75,0.12,'sine',0.022,0.5,0.18,'amb');}
      if(now>(AU.nextBreath||0)){AU.nextBreath=now+4.2;burst(1.6,'lowpass',420,0.05,0,0.6);}
    }
    else if(AU.kind==='city'){
      const lv=AU.cityLvl||0;
      if(now>(AU.nextCityChord||0)){AU.nextCityChord=now+(8-4.5*lv)+Math.random()*3;const n=2+Math.round(lv*2.4),base=lv>0.45?1:0.5,i=Math.floor(Math.random()*3);
        for(let j=0;j<n;j++){const k=i+j*2,f=SCALE[k%SCALE.length]*base*(k>=SCALE.length?2:1)*0.5;
          const o=AU.ctx.createOscillator(),g=AU.ctx.createGain();o.type=lv>0.6?'sine':'triangle';o.frequency.value=f;
          g.gain.setValueAtTime(0.0001,now+j*0.35);g.gain.linearRampToValueAtTime(0.04+0.03*lv,now+j*0.35+2);g.gain.linearRampToValueAtTime(0.0001,now+j*0.35+6.5);o.connect(g);g.connect(AU.mus);o.start(now+j*0.35);o.stop(now+j*0.35+6.7);}}
      if(lv>0.25&&now>(AU.nextBird||0)){AU.nextBird=now+2+Math.random()*(6-4*lv);const f=2200+Math.random()*1600;tone(f,0.07,'sine',0.03,1.25,0,'amb');tone(f*1.2,0.08,'sine',0.025,0.9,0.11,'amb');}
      if(Math.random()<dt*0.5)burst(0.5,'highpass',3500,0.025,0,0.5);
    }
    else if(AU.kind==='atom'){const rate=AU.geiger||1.2;if(Math.random()<rate*dt)burst(0.02,'highpass',3200,0.07,0,1);}
    else if(AU.kind==='diesel'){if(now>(AU.nextRadio||0)){AU.nextRadio=now+2.5+Math.random()*6;burst(0.18+Math.random()*0.5,'bandpass',1600+Math.random()*1800,0.05,0,5);if(Math.random()<0.5)tone(380+Math.random()*500,0.12,'sawtooth',0.012,0.7);}}
    else if(now>AU.nextTick){AU.nextTick=now+0.62;AU.flip=!AU.flip;tone(AU.flip?1250:980,0.025,'square',0.025,1,0,'amb');if(Math.random()<0.08)SFX.steam(0.06);}
  }
  else if(mode==='play'||mode==='menu'){ if(now>AU.nextChord){AU.nextChord=now+9+Math.random()*5;const base=night?0.5:1,i=Math.floor(Math.random()*4);[i,i+2,i+3].forEach((k,j)=>{const f=SCALE[k%SCALE.length]*base*(k>=SCALE.length?2:1)*0.5;
      const o=AU.ctx.createOscillator(),g=AU.ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0.0001,now+j*0.4);g.gain.linearRampToValueAtTime(0.045,now+j*0.4+2.2);g.gain.linearRampToValueAtTime(0.0001,now+j*0.4+7);o.connect(g);g.connect(AU.mus);o.start(now+j*0.4);o.stop(now+j*0.4+7.2);});} }
}

/* ====================== salvamento (localStorage, sempre com try/catch) ====================== */
const SAVE_KEY='vale_das_tumbas_save',CFG_KEY='vale_das_tumbas_cfg',SAVE_VER=1;
let saveWarned=false;
function lsGet(k){try{return window.localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{window.localStorage.setItem(k,v);return true;}catch(e){return false;}}
function lsDel(k){try{window.localStorage.removeItem(k);}catch(e){}}
/* devolve o save já conferido por cleanSave (06-game.js) ou null quando não há nada aproveitável */
function readSave(){
  const raw=lsGet(SAVE_KEY);if(!raw)return null;
  let d;try{d=JSON.parse(raw);}catch(e){return null;}
  return cleanSave(d);
}
function readCfg(){const raw=lsGet(CFG_KEY);if(!raw)return;try{const c=JSON.parse(raw);if(typeof c.sound==='boolean')AU.on=c.sound;if(c.gfx==='leve'||c.gfx==='normal')CFG.gfx=c.gfx;if(typeof c.autoCam==='boolean')CFG.autoCam=c.autoCam;}catch(e){}}
function writeCfg(){lsSet(CFG_KEY,JSON.stringify({sound:AU.on,gfx:CFG.gfx,autoCam:CFG.autoCam}));}

/* ====================== entrada: teclado, mouse, toque, controle ====================== */
const keys=Object.create(null);
const IN={mode:isTouchDevice?'touch':'kb',pressed:{},runToggle:false,joy:{x:0,y:0,id:null,cx:0,cy:0},drag:{id:null,lx:0,ly:0},cams:new Map(),pad:{prev:{},on:false,run:false,name:''}};
function press(a){IN.pressed[a]=true;}
function take(a){const v=IN.pressed[a];IN.pressed[a]=false;return !!v;}
function clearPress(){IN.pressed={};}
function setMode(m){if(IN.mode===m)return;IN.mode=m;document.body.classList.toggle('touch',m==='touch');}
document.body.classList.toggle('touch',IN.mode==='touch');

addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)&&G&&G.mode==='play')e.preventDefault();
  if(e.repeat)return;
  keys[k]=true;setMode('kb');auInit();
  if(k===' ')press('jump');else if(k==='t')press('lantern');else if(k==='e')press('use');else if(k==='j')press('diary');else if(k==='m')press('map');else if(k==='escape'||k==='p')press('pause');
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;resetTouch();});

const layer=$('inputLayer'),joyBase=$('joyBase'),joyThumb=$('joyThumb');
layer.addEventListener('contextmenu',e=>e.preventDefault());
layer.addEventListener('wheel',e=>{e.preventDefault();cam.want=clamp(cam.want+e.deltaY*0.004,2.6,9);camTouched();},{passive:false});
function resetTouch(){IN.joy.x=0;IN.joy.y=0;IN.joy.id=null;IN.drag.id=null;IN.cams.clear();joyBase.style.display='none';}
layer.addEventListener('pointerdown',e=>{
  e.preventDefault();auInit();
  try{layer.setPointerCapture(e.pointerId);}catch(err){}
  if(e.pointerType==='mouse'){IN.drag.id=e.pointerId;IN.drag.lx=e.clientX;IN.drag.ly=e.clientY;return;}
  setMode('touch');
  const left=e.clientX<layer.clientWidth*0.46;
  if(left&&IN.joy.id===null){zoneUsed('joy');IN.joy.id=e.pointerId;IN.joy.cx=e.clientX;IN.joy.cy=e.clientY;joyBase.style.left=e.clientX+'px';joyBase.style.top=e.clientY+'px';joyBase.style.display='block';joyThumb.style.transform='translate(0,0)';}
  else{zoneUsed('look');IN.cams.set(e.pointerId,{lx:e.clientX,ly:e.clientY});}
});
layer.addEventListener('pointermove',e=>{
  if(e.pointerType==='mouse'){if(IN.drag.id===e.pointerId&&(e.buttons&1||e.buttons&2)){cam.yaw-=(e.clientX-IN.drag.lx)*0.006;cam.pitch=clamp(cam.pitch+(e.clientY-IN.drag.ly)*0.005,-0.15,1.2);IN.drag.lx=e.clientX;IN.drag.ly=e.clientY;camTouched();}return;}
  if(IN.joy.id===e.pointerId){
    let dx=e.clientX-IN.joy.cx,dy=e.clientY-IN.joy.cy;const R=56,L=Math.hypot(dx,dy);if(L>R){dx*=R/L;dy*=R/L;}
    joyThumb.style.transform='translate('+dx+'px,'+dy+'px)';
    let x=dx/R,y=-dy/R;const mag=Math.hypot(x,y);if(mag<0.14){x=0;y=0;}else{const s=(mag-0.14)/(0.86*mag);x*=s;y*=s;}IN.joy.x=x;IN.joy.y=y;
  }else if(IN.cams.has(e.pointerId)){const c=IN.cams.get(e.pointerId);cam.yaw-=(e.clientX-c.lx)*0.0065;cam.pitch=clamp(cam.pitch+(e.clientY-c.ly)*0.0055,-0.15,1.2);c.lx=e.clientX;c.ly=e.clientY;camTouched();}
});
function endPointer(e){
  if(IN.drag.id===e.pointerId)IN.drag.id=null;
  if(IN.joy.id===e.pointerId){IN.joy.id=null;IN.joy.x=0;IN.joy.y=0;joyBase.style.display='none';}
  IN.cams.delete(e.pointerId);
}
layer.addEventListener('pointerup',endPointer);layer.addEventListener('pointercancel',endPointer);layer.addEventListener('lostpointercapture',endPointer);

/* botões de toque: usam pointerdown (resposta imediata) e rastreiam o dedo pelo pointerId */
const holdBtn={};
document.querySelectorAll('.tbtn').forEach(b=>{
  const act=b.dataset.act;
  b.addEventListener('contextmenu',e=>e.preventDefault());
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();auInit();setMode('touch');try{b.setPointerCapture(e.pointerId);}catch(err){}
    if(act==='run'){IN.runToggle=!IN.runToggle;b.classList.toggle('on',IN.runToggle);}else press(act);});
  const up=e=>{e.preventDefault();};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);
});
function setRunToggle(v){IN.runToggle=v;$('bRun').classList.toggle('on',v);}

/* controle (Gamepad API, mapeamento padrão) */
let padBlocked=false;
function pollPad(){
  if(!navigator.getGamepads||padBlocked)return;
  let pads;try{pads=navigator.getGamepads();}catch(e){padBlocked=true;return;}
  let gp=null;for(const p of pads){if(p&&p.connected){gp=p;break;}}
  const P=IN.pad;
  if(!gp){if(P.on){P.on=false;if(G.mode==='play')padLost();}P.run=false;return;}
  if(!P.on){P.on=true;P.name=gp.id;toast('Controle conectado.','good');}
  const b=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed);
  const edge=(name,v)=>{const was=P.prev[name];P.prev[name]=v;return v&&!was;};
  const ax=(i)=>{const v=gp.axes[i]||0;return Math.abs(v)<0.16?0:v;};
  let mx=ax(0),my=-ax(1);if(b(14))mx-=1;if(b(15))mx+=1;if(b(12))my+=1;if(b(13))my-=1;
  const rx=ax(2),ry=ax(3);
  const active=Math.hypot(mx,my)>0.01||Math.hypot(rx,ry)>0.01||gp.buttons.some(x=>x&&x.pressed);
  if(active){setMode('pad');auInit();}
  P.mx=mx;P.my=my;P.rx=rx;P.ry=ry;P.run=b(4)||b(10);
  if(edge('a',b(0)))press('jump');if(edge('x',b(2)))press('use');if(edge('y',b(3)))press('lantern');
  if(edge('back',b(8)))press('diary');if(edge('start',b(9)))press('pause');
  if(edge('up',b(12)))press('navUp');if(edge('down',b(13)))press('navDown');if(edge('a2',b(0)))press('navOk');if(edge('b',b(1)))press('navBack');
}
function moveInput(){
  let x=0,y=0,run=false;
  if(IN.mode==='touch'){x=IN.joy.x;y=IN.joy.y;run=IN.runToggle;}
  const kx=((keys['d']||keys['arrowright'])?1:0)-((keys['a']||keys['arrowleft'])?1:0),ky=((keys['w']||keys['arrowup'])?1:0)-((keys['s']||keys['arrowdown'])?1:0);
  if(kx||ky){const l=Math.hypot(kx,ky);x+=kx/l;y+=ky/l;run=run||!!keys['shift'];}
  if(IN.pad.on){x+=IN.pad.mx||0;y+=IN.pad.my||0;run=run||IN.pad.run;}
  const l=Math.hypot(x,y);if(l>1){x/=l;y/=l;}
  return{x,y,run};
}
