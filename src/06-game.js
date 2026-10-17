/* ====================== diário ====================== */
const ENTRIES={
  camp:{t:'Caderno de campo',s:'Cheguei ao vale ao amanhecer. Cinco torres no horizonte: cobre, azul-gelo, verde, lilás e, ao norte, o dourado. A bússola guarda as cores delas.'},
  steam_enter:{t:'Tumba das Engrenagens',s:'O chão fala em ritmo. Os pistões sobem e descem em onda: espere a luz de aviso piscar antes de pisar na próxima plataforma.'},
  steam_floor:{t:'Piso de engrenagens',s:'Só as placas marcadas com o olho aguentam o peso. As outras cedem logo que alguém para sobre elas.'},
  automato:{t:'Autômato de latão',s:'Dorme até ouvir passos apressados ou sentir alguém por perto. Andar devagar o mantém quieto. Se você sair da sala, ele volta a dormir.'},
  steam_relic:{t:'Engrenagem-mestra',s:'A primeira relíquia. O encaixe de cobre na porta da Cidade-Jardim se acendeu. Faltam três.'},
  oasis:{t:'O oásis',s:'A água fresca fecha as feridas de quem volta das tumbas.'},
  night:{t:'À noite',s:'Algumas inscrições só brilham depois que o sol se põe. Elas guardam pistas sobre as tumbas.'},
  diesel_enter:{t:'Tumba dos Motores',s:'Um arranha-céu soterrado. Os holofotes obedecem a quem os gira: cada toque vira o facho um oitavo de volta. Quando a luz encontra o sensor na parede, a porta responde.'},
  diesel_beams:{t:'Luz que abre portas',s:'O sensor só acende quando o facho o alcança sem nada no caminho. Pilares e motores fazem sombra.'},
  diesel_elev:{t:'Elevador de carga',s:'O elevador só obedece depois que um facho acende o sensor da parede. Lá em cima, outro holofote espera.'},
  diesel_guard:{t:'Robô-vigia a diesel',s:'Ele patrulha varrendo o facho de luz à frente. Quem fica no facho é visto e perseguido. Os pilares escondem.'},
  diesel_relic:{t:'Vela de ignição',s:'A segunda relíquia. O encaixe azul-gelo da Cidade-Jardim se acendeu. Faltam duas.'},
  atom_enter:{t:'Tumba do Reator',s:'A água de resfriamento obedece a duas válvulas: a laranja enche, a verde drena. Tudo que flutua sobe e desce com ela.'},
  atom_water:{t:'Comportas',s:'As comportas só cedem quando a água chega ao nível certo. Os pontões do canal flutuam: no nível baixo dá para atravessar.'},
  atom_rad:{t:'Radiação',s:'As zonas verdes gastam a lanterna mais rápido e o contador Geiger acelera. Alagar a sala as protege, mas a bomba faz barulho.'},
  atom_guard:{t:'Robô atômico de manutenção',s:'Dorme até ouvir passos apressados, sentir alguém por perto ou escutar a bomba de água. Se você sair da sala, ele volta a dormir.'},
  atom_relic:{t:'Núcleo atômico',s:'A terceira relíquia. O encaixe verde da Cidade-Jardim se acendeu. Falta uma.'},
  bio_enter:{t:'Tumba Viva',s:'Uma tumba que respira. Os bulbos cantam uma sequência e as portas de tecido só abrem para quem a repete na mesma ordem. O coração no centro de cada sala canta de novo.'},
  bio_seq:{t:'A canção das portas',s:'Cada bulbo tem uma cor e uma nota. Errar a ordem faz um barulho que ecoa pela sala e acorda quem dorme nas cápsulas.'},
  bio_spores:{t:'Sala dos Esporos',s:'Os esporos turvam a vista. O que a luz não alcança continua lá: guarde a ordem das cores e a posição de cada bulbo.'},
  bio_clone:{t:'Os Clones',s:'Corpos translúcidos dormem nas cápsulas. Acordam com passos apressados, com a proximidade ou com a canção errada. Se você sair da sala, voltam a dormir.'},
  bio_relic:{t:'Semente da vida',s:'A quarta relíquia. Os quatro encaixes da porta da Cidade-Jardim brilham.'},
  city_enter:{t:'Cidade-Jardim',s:'O sol volta a entrar. A cidade desperta a cada seção que você vence: o teto se abre, as plantas revivem e a água corre. Aqui a lanterna não gasta, e as flores de luz salvam o ponto.'},
  city_rhythm:{t:'Seção do Ritmo',s:'O que as engrenagens ensinaram: pistões em ritmo e placas que só aguentam quando marcadas com o olho.'},
  city_light:{t:'Seção da Luz',s:'O que os motores ensinaram: um facho de luz, girado no ângulo certo, acorda o que dorme na parede.'},
  city_water:{t:'Seção da Água',s:'O que o reator ensinou: o nível da água leva as plataformas por cima do que parecia intransponível.'},
  city_seq:{t:'Seção da Sequência',s:'O que a tumba viva ensinou: repetir a canção na ordem certa. A última porta se abriu para o sol.'},
  city_end:{t:'A cidade acordou',s:'No alto da escada, o teto aberto e a árvore-matriz. A civilização do vale esperou por alguém que reunisse todas as eras.'}
};
for(const d of INSC)ENTRIES['insc_'+d.id]={t:d.t,s:d.s};
Object.assign(ENTRIES,SEC_ENTRIES);
function addDiary(id,silent){
  if(G.diary.indexOf(id)>=0||!ENTRIES[id])return;
  G.diary.push(id);G.diaryNew++;$('btnDiary').classList.add('new');
  if(!silent){toast('Diário atualizado: '+ENTRIES[id].t);SFX.page();writeSave(false);}
}
function setDiaryTab(map){
  $('tabNotes').classList.toggle('on',!map);$('tabMap').classList.toggle('on',map);$('diaryList').hidden=map;$('mapBox').hidden=!map;
  if(map){drawVMap($('mapCv'));const n=secFragCount();$('mapNote').textContent=(n>=4?'O mapa completo do vale. Ele não mostra onde você está nem onde há segredos.':'Reúna os fragmentos de mapa escondidos pelo vale. Cada um revela um quarto do mapa ('+n+'/4).')+' As trilhas coloridas saem da estrada e levam a cada tumba.';}
}
function renderDiary(){
  setDiaryTab(false);$('secCount').textContent='Segredos: '+secCount()+'/12';
  const box=$('diaryList');box.textContent='';
  const list=G.diary.slice().reverse();
  if(!list.length){const p=document.createElement('p');p.className='sub';p.textContent='Ainda não há anotações.';box.appendChild(p);return;}
  list.forEach((id,i)=>{const e=ENTRIES[id];if(!e)return;const d=document.createElement('div');d.className='entry';const h=document.createElement('h3');h.textContent=e.t;
    if(i<G.diaryNew){const tg=document.createElement('span');tg.className='tag';tg.textContent='novo';h.appendChild(tg);}
    const p=document.createElement('p');p.textContent=e.s;d.appendChild(h);d.appendChild(p);box.appendChild(d);});
}

/* ====================== mensagens, HUD ====================== */
/* avisos: no máximo 3 na tela. O mesmo texto não se acumula: renova o tempo e mostra ×N. Perigos (warn) passam
   na frente de conquistas (good), que passam na frente de dicas; um aviso novo só tira da tela outro de prioridade
   igual ou menor que já tenha sido lido por 2 s, senão espera na fila. Cada um fica o tempo de leitura do texto. */
const TOASTS={on:[],queue:[],last:new Map()};
function toastMs(text,kind){return Math.min(9500,Math.max(kind==='warn'?5200:4300,text.length*62));}
function toast(text,kind){
  const now=performance.now(),pri=kind==='warn'?2:kind==='good'?1:0;
  const same=TOASTS.on.find(t=>t.text===text);
  if(same){same.count++;same.until=Math.max(same.until,now+Math.max(2500,toastMs(text,kind)*0.6));same.n.textContent='×'+same.count;same.n.hidden=false;
    same.el.classList.remove('bump');void same.el.offsetWidth;same.el.classList.add('bump');return same.el;}
  const q=TOASTS.queue.find(t=>t.text===text);if(q){q.count++;return null;}
  const lt=TOASTS.last.get(text);if(lt!==undefined&&now-lt<1200)return null;
  TOASTS.queue.push({text,kind,pri,t:now,count:1});
  TOASTS.queue.sort((a,b)=>b.pri-a.pri||a.t-b.t);
  while(TOASTS.queue.length>4){const i=TOASTS.queue.length-1;TOASTS.queue.splice(i,1);}
  toastPump(now);
  const shown=TOASTS.on.find(t=>t.text===text);return shown?shown.el:null;
}
/* a pilha de avisos não desce sobre o aviso de interação nem sobre os botões de toque */
function msgsLimit(){const H=innerHeight;if(!document.body.classList.contains('touch'))return H-90;return H<=520?H-84:H-280;}
function msgsOverflow(){const m=$('msgs');let h=0,n=0;for(const e of m.children)if(!e.classList.contains('out')){h+=e.offsetHeight;n++;}
  return n>0&&m.getBoundingClientRect().top+h+6*(n-1)>msgsLimit();}
function toastShow(it,now){
  const el=document.createElement('div');el.className='toast'+(it.kind?' '+it.kind:'');el.setAttribute('role',it.pri===2?'alert':'status');
  const tx=document.createElement('span');tx.textContent=it.text;const n=document.createElement('b');n.className='n';n.hidden=it.count<2;n.textContent='×'+it.count;
  el.appendChild(tx);el.appendChild(n);$('msgs').appendChild(el);
  TOASTS.on.push({el,n,text:it.text,kind:it.kind,pri:it.pri,born:now,until:now+toastMs(it.text,it.kind),count:it.count});
}
function toastOut(t,now){
  const i=TOASTS.on.indexOf(t);if(i>=0)TOASTS.on.splice(i,1);TOASTS.last.set(t.text,now);
  t.el.classList.add('out');setTimeout(()=>{if(t.el.parentNode)t.el.parentNode.removeChild(t.el);},520);
}
function toastPump(now){
  while(TOASTS.queue.length){
    const nx=TOASTS.queue[0];
    if(TOASTS.on.length>=(innerHeight<=520?2:3)){
      let v=null;for(const t of TOASTS.on)if(now-t.born>2000&&t.pri<=nx.pri&&(!v||t.pri<v.pri||(t.pri===v.pri&&t.born<v.born)))v=t;
      if(!v&&nx.pri===2)for(const t of TOASTS.on)if(t.pri<2&&(!v||t.pri<v.pri||(t.pri===v.pri&&t.born<v.born)))v=t;
      if(!v)break;
      toastOut(v,now);
    }
    TOASTS.queue.shift();toastShow(nx,now);
    const me=TOASTS.on[TOASTS.on.length-1];
    while(TOASTS.on.length>1&&msgsOverflow()){
      let v=null;for(const t of TOASTS.on)if(t!==me&&t.pri<=me.pri&&(now-t.born>2000||(me.pri===2&&t.pri<2))&&(!v||t.pri<v.pri||(t.pri===v.pri&&t.born<v.born)))v=t;
      if(!v){TOASTS.on.pop();me.el.remove();nx.count=me.count;TOASTS.queue.unshift(nx);return;}
      const i=TOASTS.on.indexOf(v);TOASTS.on.splice(i,1);TOASTS.last.set(v.text,now);v.el.remove();
    }
  }
}
function toastTick(now){
  for(const t of TOASTS.on.slice())if(now>=t.until)toastOut(t,now);
  /* o HUD mudou de altura (objetivo em duas linhas, giro da tela): libera espaço tirando o aviso menos importante */
  while(TOASTS.on.length>1&&msgsOverflow()){let v=null;for(const t of TOASTS.on)if(!v||t.pri<v.pri||(t.pri===v.pri&&t.born<v.born))v=t;
    TOASTS.on.splice(TOASTS.on.indexOf(v),1);TOASTS.last.set(v.text,now);v.el.remove();}
  if(TOASTS.queue.length)toastPump(now);
  if(TOASTS.last.size>40)for(const[k,v]of TOASTS.last)if(now-v>10000)TOASTS.last.delete(k);
}
function toastClear(){for(const t of TOASTS.on.slice())toastOut(t,performance.now());TOASTS.queue.length=0;TOASTS.last.clear();}   // limpa tudo, inclusive o histórico anti-repetição
const heartEls=[];
(function(){const h=$('hearts');for(let i=0;i<3;i++){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 22');const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d','M12 21C-5 9 4-3 12 5c8-8 17 4 0 16z');s.appendChild(p);h.appendChild(s);heartEls.push(s);}})();
const relicEls=[];
(function(){const r=$('relics');['steam','diesel','atom','bio'].forEach(k=>{const i=document.createElement('i');i.style.color=TOMBS[k].css;r.appendChild(i);relicEls.push(i);});})();
const markEls=[];
(function(){const c=$('compass');for(const m of COMPASS){const e=document.createElement('div');e.className='mk';e.style.color=m.css;e.innerHTML='<b></b><span></span>';e.lastChild.textContent=m.label;c.appendChild(e);markEls.push(e);}})();
let hudHearts=-1,hudRelics='';
const COMPASS_KEY={N:'final',NE:'steam',W:'diesel',SW:'atom',SE:'bio'};
function updateHud(){
  if(hudHearts!==G.hearts){hudHearts=G.hearts;heartEls.forEach((s,i)=>s.classList.toggle('off',i>=G.hearts));}
  const key=['steam','diesel','atom','bio'].map(k=>G.relics[k]?1:0).join('');
  if(key!==hudRelics){const ones=k=>k.split('1').length-1;if(hudRelics&&ones(key)>ones(hudRelics)){const ch=$('relics').parentElement;ch.classList.remove('flash');void ch.offsetWidth;ch.classList.add('flash');}
    hudRelics=key;let n=0;['steam','diesel','atom','bio'].forEach((k,i)=>{const on=G.relics[k];if(on)n++;relicEls[i].classList.toggle('on',on);relicEls[i].style.background=on?TOMBS[k].css:'transparent';});$('relicCount').textContent=n+'/4';}
  if(G.area===valeArea){
    /* tumbas já vencidas ficam apagadas na bússola */
    const p=G.p;COMPASS.forEach((m,i)=>{const rel=wrapPi(Math.atan2(m.x-p.x,-(m.z-p.z))+cam.yaw);const e=markEls[i],k=COMPASS_KEY[m.label];if(Math.abs(rel)<Math.PI/2){e.style.display='flex';e.style.left=(50+rel/(Math.PI/2)*46)+'%';e.style.opacity=String((1-smooth(1.1,1.57,Math.abs(rel))*0.9)*(k!=='final'&&G.relics[k]?0.4:1));}else e.style.display='none';});
  }else{
    const lo=G.lantern<25;$('lfill').style.width=(G.lantern/130*100)+'%';$('ltxt').textContent=Math.ceil(G.lantern)+'s';$('lantern').classList.toggle('low',lo);$('lantern').classList.toggle('rad',!!(G.area.drainExtra&&G.lanternOn&&G.area.drainExtra()>0));
  }
}
function flashVig(){const v=$('vig');v.classList.add('flash');requestAnimationFrame(()=>requestAnimationFrame(()=>v.classList.remove('flash')));}

/* ====================== leitura do perigo: bordas, sombra de pouso e objetivo ====================== */
/* faixa listrada no chão firme onde ele termina sobre um vão mortal (sem chão fixo embaixo: poço, canal,
   fosso dos pistões). Plataformas móveis não contam como chão, então a borda continua marcada. */
const EDGE_MAT=(()=>{const t=canvasTex(64,16,g=>{g.fillStyle='#22170c';g.fillRect(0,0,64,16);g.fillStyle='#ffb43a';
  for(let i=-16;i<80;i+=16){g.beginPath();g.moveTo(i,16);g.lineTo(i+8,16);g.lineTo(i+16,0);g.lineTo(i+8,0);g.closePath();g.fill();}});
  t.wrapS=THREE.RepeatWrapping;return new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:0.92,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});})();
function buildEdgeMarks(a,dyn){
  const stat=a.cols.filter(c=>!dyn.has(c));
  const floors=stat.filter(c=>c.t==='b'&&Math.abs(c.y1)<0.05&&c.x1-c.x0>=6&&c.z1-c.z0>=1.5);
  const inside=(c,x,z)=>c.t==='b'?x>=c.x0-0.02&&x<=c.x1+0.02&&z>=c.z0-0.02&&z<=c.z1+0.02:Math.hypot(x-c.x,z-c.z)<=c.r;
  const supported=(x,z)=>stat.some(c=>c.y1>-1&&c.y0<1.5&&inside(c,x,z));
  const segs=[],W=0.28,O=0.4;
  for(const c of floors){
    for(const[sx,sz,dx,dz,nx,nz,len]of[[c.x0,c.z0,1,0,0,-1,c.x1-c.x0],[c.x0,c.z1,1,0,0,1,c.x1-c.x0],[c.x0,c.z0,0,1,-1,0,c.z1-c.z0],[c.x1,c.z0,0,1,1,0,c.z1-c.z0]]){
      const n=Math.max(1,Math.round(len/0.25));let run=-1;
      for(let i=0;i<=n;i++){
        const u=i*len/n,drop=!supported(sx+dx*u+nx*O,sz+dz*u+nz*O);
        if(drop&&run<0)run=u;
        if(run>=0&&(!drop||i===n)){const end=drop?u:u-len/n;if(end-run>0.6)segs.push([sx,sz,dx,dz,nx,nz,run,end]);run=-1;}
      }
    }
  }
  if(!segs.length)return 0;
  const pos=[],uv=[],idx=[];
  for(const[sx,sz,dx,dz,nx,nz,u0,u1]of segs){
    const ax=sx+dx*u0,az=sz+dz*u0,bx=sx+dx*u1,bz=sz+dz*u1,ix=-nx*W,iz=-nz*W,k=pos.length/3,L=(u1-u0)/0.9;
    pos.push(ax,0.015,az,bx,0.015,bz,bx+ix,0.015,bz+iz,ax+ix,0.015,az+iz);uv.push(0,1,L,1,L,0,0,0);idx.push(k,k+1,k+2,k,k+2,k+3);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);
  const m=new THREE.Mesh(g,EDGE_MAT);m.renderOrder=1;m.userData.edgeMarks=segs.length;a.group.add(m);a.edgeMarks=segs.length;return segs.length;
}
(function(){
  const dyn=new Set();
  for(const L of[tomb.pistons,tomb.tiles,cty.pistons,cty.tiles,atm.pontoons,cty.pontoons])for(const o of L)if(o.c)dyn.add(o.c);
  if(dsl.elev)dyn.add(dsl.elev.col);
  for(const k in TOMB_AREAS)buildEdgeMarks(TOMB_AREAS[k],dyn);
})();
/* sombra de pouso: mostra onde o personagem vai cair durante o salto */
const blob=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:SOFT,color:0x000000,transparent:true,opacity:0.42,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));
blob.rotation.x=-Math.PI/2;blob.renderOrder=1;scene.add(blob);
function updateBlob(){
  const p=G.p,g=groundAt(G.area,p.x,p.z,p.y+0.05),h=p.y-g;
  blob.visible=G.mode!=='menu'&&h<14&&h>-0.5;if(!blob.visible)return;
  const k=Math.min(1,h/7);blob.position.set(p.x,g+(G.area===valeArea?0.08:0.03),p.z);blob.scale.setScalar(1.15*(1-0.45*k));
  blob.material.opacity=(p.grounded?0.34:0.5)*(1-0.6*k);
}
/* objetivo: próximo destino no vale (e a marca dele pisca na bússola); ponto de controle dentro das tumbas */
const POINT_NAME={steam:'caldeira',diesel:'gerador',atom:'célula de energia',bio:'flor bioluminescente',final:'flor de luz'};
let goalKey='',goalMark=-1;
function updateGoal(){
  let txt,mark=-1;
  if(G.area===valeArea){
    const miss=['steam','diesel','atom','bio'].filter(k=>!G.relics[k]);
    if(G.finished)txt='Segredos do vale: '+secCount()+'/12';
    else if(!miss.length){txt='Próximo: porta da Cidade-Jardim (N)';mark=0;}
    else{let best=miss[0],bd=1e9;for(const k of miss){const T=TOMBS[k],d=Math.hypot(T.x-G.p.x,T.z-G.p.z);if(d<bd){bd=d;best=k;}}
      txt='Próximo: '+TOMBS[best].name+' ('+TOMBS[best].label+')';mark=COMPASS.findIndex(m=>m.label===TOMBS[best].label);}
  }else{
    const k=G.area.key||'steam',cp=G.checkpoint?POINT_NAME[k]:'entrada';
    txt=(k==='final'?'Seção '+Math.min(4,cty.done.filter(Boolean).length+1)+'/4 · ':'')+'Ponto salvo: '+cp;
  }
  if(txt!==goalKey){goalKey=txt;const el=$('goal');el.textContent=txt;el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}
  if(mark!==goalMark){if(goalMark>=0)markEls[goalMark].classList.remove('goal');if(mark>=0)markEls[mark].classList.add('goal');goalMark=mark;}
}

/* ====================== áreas e transições ====================== */
const explorer=buildExplorer();scene.add(explorer.group);
scene.fog=new THREE.Fog(0xe9c48c,40,380);
function setArea(a){
  G.area=a;const tomb_=a!==valeArea;perfHold(2.5);if(camera.view)camera.clearViewOffset();camera.fov=camera.aspect<1?74:62;
  valeArea.group.visible=!tomb_;for(const k in TOMB_AREAS)TOMB_AREAS[k].group.visible=(TOMB_AREAS[k]===a);
  document.body.classList.toggle('intomb',tomb_);document.body.classList.toggle('incity',a.key==='final');document.body.classList.remove('cine');$('endTxt').hidden=true;$('spore').style.opacity='0';camera.far=tomb_?52:900;camera.updateProjectionMatrix();
  sky.visible=!tomb_;stars.visible=!tomb_;if(tomb_){sunSpr.visible=false;moonSpr.visible=false;}
  if(tomb_){
    const fc=a.fogColor||0x0e0906,h=a.hemi||[0x6a4a38,0x1e140c,0.62];
    scene.background=new THREE.Color(fc);scene.fog.color.setHex(fc);scene.fog.near=3;scene.fog.far=44;
    sun.intensity=0;hemi.color.setHex(h[0]);hemi.groundColor.setHex(h[1]);hemi.intensity=h[2];lampL.color.setHex(a.lampColor||0xff9a40);
  }else{scene.background=null;}
  auArea(tomb_,NIGHT>0.5,a.ambience||'steam');
}
function transition(text,mid){
  if(G.trans)return;
  G.trans={ph:0,t:0,mid};G.mode='transition';$('fadeTxt').textContent=text;
}
function updateTrans(dt){
  const tr=G.trans;if(!tr)return;tr.t+=dt;const f=$('fade'),ft=$('fadeTxt');
  if(tr.ph===0){const k=clamp(tr.t/0.4,0,1);f.style.opacity=k;ft.style.opacity=k;if(tr.t>=0.4){tr.mid();tr.ph=1;tr.t=0;}}
  else if(tr.ph===1){f.style.opacity=1;if(tr.t>=0.35){tr.ph=2;tr.t=0;}}
  else{const k=1-clamp(tr.t/0.5,0,1);f.style.opacity=k;ft.style.opacity=k;if(tr.t>=0.5){G.trans=null;G.mode='play';f.style.opacity=0;ft.style.opacity=0;clearPress();}}
}
function placePlayer(x,y,z,face){const p=G.p;p.x=x;p.y=y;p.z=z;p.vx=p.vz=p.vy=p.kx=p.kz=0;p.face=face;p.grounded=true;}
function enterTomb(key){
  const area=TOMB_AREAS[key];if(!area)return;
  transition(TXT.enterTomb,()=>{
    const T=TOMBS[key];G.curTomb=key;G.valePos={x:T.entry.x,z:T.entry.z};
    setArea(area);const s=area.spawn;placePlayer(s.x,0,s.z,s.face);cam.yaw=0;cam.pitch=0.3;cam.cur=cam.want;
    G.lanternOn=true;G.checkpoint=null;G.invuln=0;resetVisitState();writeSave(false);if(area.onEnter)area.onEnter();
  });
}
function relicCount(){return['steam','diesel','atom','bio'].filter(k=>G.relics[k]).length;}
function exitTomb(afterRelic){
  const key=G.curTomb||'steam';
  transition(TXT.backValley,()=>{
    const T=TOMBS[key];setArea(valeArea);placePlayer(T.entry.x,terrainH(T.entry.x,T.entry.z),T.entry.z,T.entry.face);
    cam.yaw=Math.atan2(-T.face[0],-T.face[1]);cam.pitch=0.3;cam.cur=cam.want;G.lanternOn=false;G.valePos={x:T.entry.x,z:T.entry.z};
    writeSave(true);
    if(afterRelic){const n=relicCount(),info=RELIC_INFO[key];
      setTimeout(()=>toast(n>=4?'Os quatro encaixes brilham. A porta da Cidade-Jardim espera ao norte.':'O encaixe '+info.slot+' da Cidade-Jardim brilha. Faltam '+(4-n)+'. Siga a bússola.','good'),700);}
  });
}
function useTombDoor(key){
  if(TOMB_AREAS[key])enterTomb(key);else{SFX.deny();toast(TXT.sealed);}
}
function useFinalDoor(){
  const n=relicCount();
  if(n>=4){toast(TXT.finalAll,'good');SFX.gate();enterTomb('final');}
  else{SFX.deny();const DIR={NE:'nordeste',W:'oeste',SW:'sudoeste',SE:'sudeste'};
    toast(TXT.finalNeed(4-n,['steam','diesel','atom','bio'].filter(k=>!G.relics[k]).map(k=>TOMBS[k].name+' ('+DIR[TOMBS[k].label]+')').join(', ')),'warn');}
}
function readInscription(d){
  if(NIGHT>0.55){addDiary('insc_'+d.id);toast(d.s);SFX.insc();G.insc[d.id]=1;}else{SFX.deny();toast(TXT.dayInsc);}
}
function healOasis(){
  if(G.hearts<3){G.hearts=3;SFX.heal();toast('A água fresca fechou seus ferimentos.','good');addDiary('oasis');for(let i=0;i<6;i++)puff(-70+Math.cos(i*1.05)*6,0.6,140+Math.sin(i*1.05)*6,{vy:1.4,size:0.8,life:1.8,op:0.45,color:0xaee8ff});}
  else toast('A água está fresca e calma.');
}
const RELIC_INFO={
  steam:{name:'engrenagem-mestra',diary:'steam_relic',slot:'de cobre'},
  diesel:{name:'vela de ignição',diary:'diesel_relic',slot:'azul-gelo'},
  atom:{name:'núcleo atômico',diary:'atom_relic',slot:'verde'},
  bio:{name:'semente da vida',diary:'bio_relic',slot:'lilás'}
};
function collectRelic(key){
  const info=RELIC_INFO[key];G.relics[key]=true;SFX.relic();updateFinalSlots();addDiary(info.diary,true);
  toast('Você pegou a '+info.name+'!','good');writeSave(false);
  setTimeout(()=>{if(G.area!==valeArea&&G.mode==='play')exitTomb(true);},2200);
}
function openDiary(){
  if(G.mode!=='play')return;
  renderDiary();G.mode='diary';showScreen('scDiary');G.diaryNew=0;$('btnDiary').classList.remove('new');SFX.page();focusFirst('scDiary');
}
function closeDiary(){hideScreens();G.mode='play';clearPress();}

/* ====================== vida, queda e morte ====================== */
function resetVisitState(){for(const k in TOMB_AREAS){const a=TOMB_AREAS[k];if(a.resetVisit)a.resetVisit();}}
function respawn(){
  const sp=G.area.spawn,c=G.checkpoint||{x:sp.x,y:0,z:sp.z,face:Math.PI};
  placePlayer(c.x,c.y,c.z,c.face);G.invuln=1.4;resetVisitState();
  cam.yaw=wrapPi(c.face+Math.PI);cam.pitch=0.32;cam.cur=cam.want;CAMX.gap=0;CAMX.ap=0;CAMX.look=0;CAMX.lastInput=G.t;
  const bl=$('blink');bl.classList.remove('on');void bl.offsetWidth;bl.classList.add('on');
}
/* pontos de energia (caldeira, gerador, célula, flor): acender um ponto, ou usar de novo um já aceso, grava o
   ponto de controle ao lado dele. O lugar é conferido contra os colisores e precisa ter chão firme. */
function checkpointNear(x,z,face){
  const a=G.area;
  for(const[ox,oz]of[[0,0],[0,1.2],[0,-1.2],[0.9,0],[-0.9,0],[0,2.2],[0,-2.2]]){
    const r=pushOut(a,x+ox,z+oz,0,PR,PH),g=groundAt(a,r[0],r[1],0.3);
    if(g>-0.3&&g<0.6&&Math.hypot(r[0]-x-ox,r[1]-z-oz)<0.9)return{x:r[0],y:g,z:r[1],face};
  }
  return{x,y:0,z,face};
}
function usePowerPoint(cx,cz,first,msg){
  const city=G.area.drainExtra&&G.area.drainExtra()<0;
  G.lantern=130;G.checkpoint=checkpointNear(cx,cz,Math.PI);
  if(first){SFX.lamp();toast(msg,'good');}
  else{SFX.use();toast(city?TXT.pointAgainCity:TXT.pointAgain,'good');}
}
/* cada falha diz o motivo e para onde o jogador volta (ponto de energia usado nesta visita ou a entrada) */
function whereBack(){const city=G.area.key==='final';return G.checkpoint?(city?TXT.backPointCity:TXT.backPoint):(city?TXT.backEntranceCity:TXT.backEntrance);}
function die(cause){
  toast((cause||TXT.deathTomb)+' '+TXT.noHearts+' '+whereBack(),'warn');G.hearts=3;G.lantern=Math.max(G.lantern,60);respawn();
}
function hurt(n,fx,fz,cause){
  if(G.invuln>0||G.mode!=='play')return;
  G.hearts=Math.max(0,G.hearts-n);G.invuln=1.4;SFX.hit();flashVig();
  const dx=G.p.x-fx,dz=G.p.z-fz,d=Math.hypot(dx,dz)||1;G.p.kx=dx/d*9;G.p.kz=dz/d*9;
  const why=TXT.hit[cause]||TXT.deathTomb;
  if(G.hearts<=0)die(why);else toast(why,'warn');
}
function fellOff(){
  SFX.fall();flashVig();G.hearts=Math.max(0,G.hearts-1);
  const p=G.p,inWater=(G.area.water||[]).some(w=>p.x>=w.x0&&p.x<=w.x1&&p.z>=w.z0&&p.z<=w.z1);
  const c=G.cause&&G.t-G.cause.t<4?G.cause.k:inWater?'water':'gap';G.cause=null;
  if(G.hearts<=0)die(TXT.fall[c]);else{toast(TXT.fall[c]+' '+whereBack(),'warn');respawn();}
}

/* ====================== reinício, salvamento ====================== */
function resetTombWorld(){for(const k in TOMB_AREAS)TOMB_AREAS[k].reset();resetVisitState();}
/* o save guarda relíquias, diário, inscrições, segredos, hora do dia e a posição no vale. Dentro de uma tumba
   guarda só qual era ela: ao continuar, o jogador volta à porta dela (os pontos de energia valem só por visita). */
function snapshot(){
  const inT=G.area!==valeArea&&G.curTomb&&TOMBS[G.curTomb]?G.curTomb:undefined;
  return{v:SAVE_VER,relics:G.relics,diary:G.diary,insc:G.insc,sec:G.sec,done:!!G.finished,time:G.time,pos:{x:G.valePos.x,z:G.valePos.z},yaw:inT?undefined:cam.yaw,tomb:inT};
}
/* confere cada campo do save. Um campo estragado vira o valor neutro (e marca fixed) em vez de invalidar tudo;
   relíquias perdidas são deduzidas do diário, porque a anotação de cada uma só existe depois de pegá-la. */
function cleanSave(d){
  const obj=o=>!!o&&typeof o==='object'&&!Array.isArray(o),num=n=>typeof n==='number'&&isFinite(n);
  if(!obj(d)||d.v!==SAVE_VER)return null;
  if(!obj(d.relics)&&!Array.isArray(d.diary)&&!obj(d.pos))return null;
  let fixed=false;const bad=()=>{fixed=true;};
  const diary=[];
  if(Array.isArray(d.diary)){for(const id of d.diary){if(typeof id==='string'&&ENTRIES[id]){if(diary.indexOf(id)<0)diary.push(id);}else bad();}}else bad();
  if(d.done!==undefined&&typeof d.done!=='boolean')bad();
  const done=d.done===true,relics={};
  if(!obj(d.relics))bad();
  for(const k of['steam','diesel','atom','bio']){
    const v=obj(d.relics)?d.relics[k]:undefined;if(v!==undefined&&typeof v!=='boolean')bad();
    relics[k]=v===true||diary.indexOf(RELIC_INFO[k].diary)>=0||done;
  }
  const pick=(src,ids,val)=>{const o={};if(src===undefined)return o;if(!obj(src)){bad();return o;}
    for(const k in src){if(ids.indexOf(k)<0)bad();else if(src[k])o[k]=val;}return o;};
  const insc=pick(d.insc,INSC.map(i=>i.id),1),sec=pick(d.sec,SEC_IDS,true);
  let pos;if(obj(d.pos)&&num(d.pos.x)&&num(d.pos.z))pos={x:d.pos.x,z:d.pos.z};else{bad();pos={x:valeArea.spawn.x,z:valeArea.spawn.z};}
  let time=0.12;if(num(d.time))time=((d.time%1)+1)%1;else bad();
  const yaw=num(d.yaw)?wrapPi(d.yaw):null,tomb=typeof d.tomb==='string'&&TOMBS[d.tomb]&&TOMBS[d.tomb].entry?d.tomb:null;
  return{v:SAVE_VER,relics,diary,insc,sec,done,time,pos,yaw,tomb,fixed};
}
function writeSave(show){
  if(G.mode==='menu')return false;
  const ok=lsSet(SAVE_KEY,JSON.stringify(snapshot()));
  if(!ok&&!saveWarned){saveWarned=true;toast(TXT.saveFail,'warn');}
  else if(ok&&show)toast(TXT.saved);
  return ok;
}
function resetState(){
  G.hearts=3;G.invuln=0;G.lantern=130;G.lanternOn=false;G.relics={steam:false,diesel:false,atom:false,bio:false};
  G.diary=[];G.diaryNew=0;G.insc={};G.time=0.12;G.checkpoint=null;G.nightSeen=false;G.finished=false;G.sec={};$('btnDiary').classList.remove('new');
}
function startGame(fresh){
  auInit();const s=fresh?null:readSave();
  if(fresh)lsDel(SAVE_KEY);
  resetState();
  if(s){G.relics=s.relics;G.diary=s.diary;G.insc=s.insc;G.sec=s.sec;G.finished=s.done;G.time=s.time;}
  resetTombWorld();applySecrets();updateFinalSlots();hudHearts=-1;hudRelics='';
  setArea(valeArea);
  const T=s&&s.tomb?TOMBS[s.tomb]:null,pos=T?T.entry:s?s.pos:{x:valeArea.spawn.x,z:valeArea.spawn.z};
  const r=Math.hypot(pos.x,pos.z);const px=r>200?pos.x*200/r:pos.x,pz=r>200?pos.z*200/r:pos.z;
  const pp=pushOut(valeArea,px,pz,terrainH(px,pz),PR,PH);
  placePlayer(pp[0],terrainH(pp[0],pp[1]),pp[1],T?T.entry.face:s?Math.PI:valeArea.spawn.face);G.valePos={x:pp[0],z:pp[1]};
  cam.yaw=T?Math.atan2(-T.face[0],-T.face[1]):s&&s.yaw!==null?s.yaw:0;cam.pitch=0.34;cam.cur=cam.want;
  hideScreens();document.body.classList.add('playing');G.mode='play';clearPress();setRunToggle(false);showZoneHint();
  if(!s){addDiary('camp',true);toast(TXT.welcome);setTimeout(()=>{if(G.mode==='play'&&G.area===valeArea)toast(TXT.tip[IN.mode==='pad'?'pad':IN.mode==='touch'?'touch':'kb']);},2600);}else{
    toast('Progresso carregado: '+relicCount()+'/4 relíquias e '+secCount()+'/12 segredos.'+(T?' Você está na porta da '+T.name+'; lá dentro, os pontos de energia precisam ser usados de novo.':''),'good');
    if(s.fixed)toast(TXT.saveFixed,'warn');}
  writeSave(false);
}
function goMenu(){
  writeSave(false);G.mode='menu';document.body.classList.remove('playing');document.body.classList.remove('intomb');
  setArea(valeArea);placePlayer(valeArea.spawn.x,terrainH(0,150),valeArea.spawn.z,valeArea.spawn.face);
  refreshStart();showScreen('scStart');focusFirst('scStart');
}

/* ====================== telas ====================== */
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>{s.hidden=s.id!==id;});$('prompt').style.display='none';}
function hideScreens(){document.querySelectorAll('.screen').forEach(s=>{s.hidden=true;});}
function focusFirst(id){const b=document.querySelector('#'+id+' .btn:not([hidden])');if(b)try{b.focus({preventScroll:true});}catch(e){}}
function ctlHtml(){
  const rows=IN.mode==='touch'?[['Joystick esquerdo','mover'],['Arrastar à direita','câmera'],['Correr','liga e desliga'],['Pular · Lanterna · Usar','botões à direita']]
    :[['W A S D ou setas','mover'],['Arrastar o mouse','câmera (roda: zoom)'],['Shift','correr'],['Espaço','pular'],['T','lanterna'],['E','usar'],['J','diário'],['M','mapa'],['Esc','pausa']];
  const pad=[['Controle','analógicos movem; A pula, X usa, Y lanterna, LB corre, Start pausa']];
  return rows.concat(pad).map(r=>'<b>'+r[0]+'</b><span>'+r[1]+'</span>').join('');
}
function refreshStart(){
  const sv=readSave(),has=!!sv;const nr=sv?['steam','diesel','atom','bio'].filter(k=>sv.relics[k]).length:0;
  $('startNote').textContent=!sv?'Explore o vale, entre nas quatro tumbas e leve as relíquias até a porta ao norte. O jogo salva sozinho.'
    :(sv.done?'Você já acendeu a Cidade-Jardim. ':'')+'Continuar traz '+nr+'/4 relíquias, '+Object.keys(sv.sec).length+'/12 segredos e o diário'+(sv.tomb?', a partir da porta da '+TOMBS[sv.tomb].name:', no ponto do vale onde você parou')+'.';$('btnContinue').hidden=!has;$('btnNew').className=has?'btn':'btn main';
  $('ctlStart').innerHTML=ctlHtml();$('ctlPause').innerHTML=ctlHtml();
  refreshFull();$('pSound').textContent=AU.on?TXT.soundOn:TXT.soundOff;$('pGfx').textContent=CFG.gfx==='leve'?TXT.gfxLow:TXT.gfxNorm;$('pCam').textContent=CFG.autoCam?TXT.camAuto:TXT.camManual;
}
/* dica das zonas de toque (andar à esquerda, olhar à direita): cada lado some no primeiro uso ou após 20 s */
let zoneTimer=0;
function showZoneHint(){
  const z=$('zoneHint');if(IN.mode!=='touch'){z.hidden=true;return;}
  z.hidden=false;z.querySelector('.zl').classList.toggle('off',!!IN.usedJoy);z.querySelector('.zr').classList.toggle('off',!!IN.usedLook);
  clearTimeout(zoneTimer);zoneTimer=setTimeout(()=>{z.querySelector('.zl').classList.add('off');z.querySelector('.zr').classList.add('off');},20000);
}
function zoneUsed(side){if(side==='joy')IN.usedJoy=true;else IN.usedLook=true;const z=$('zoneHint');if(!z.hidden)z.querySelector(side==='joy'?'.zl':'.zr').classList.add('off');}
/* tela cheia: só aparece quando a página permite (dentro de alguns sites o navegador bloqueia) */
const fsOK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
function fsOn(){return !!(document.fullscreenElement||document.webkitFullscreenElement);}
function toggleFull(){
  try{if(fsOn())(document.exitFullscreen||document.webkitExitFullscreen).call(document);
    else{const el=document.documentElement,rq=el.requestFullscreen||el.webkitRequestFullscreen;const r=rq&&rq.call(el,{navigationUI:'hide'});if(r&&r.catch)r.catch(()=>toast('O navegador não permitiu a tela cheia aqui.','warn'));}}
  catch(e){toast('O navegador não permitiu a tela cheia aqui.','warn');}
}
function refreshFull(){for(const id of['pFull','btnFull']){const b=$(id);b.hidden=!fsOK;b.textContent=fsOn()?'Sair da tela cheia':'Tela cheia';}}
document.addEventListener('fullscreenchange',refreshFull);document.addEventListener('webkitfullscreenchange',refreshFull);
function pauseGame(){if(G.mode!=='play')return;G.mode='paused';refreshStart();
  $('saveInfo').textContent=G.area===valeArea?'O jogo salva sozinho: relíquias, diário, segredos e a sua posição no vale.':'Relíquias, diário e segredos estão salvos. Se sair agora, você volta à porta desta tumba e os pontos de energia precisam ser usados de novo.';showScreen('scPause');focusFirst('scPause');}
function resumeGame(){hideScreens();G.mode='play';clearPress();}
let confirmAction=null;
function askConfirm(title,text,yes,action){$('cfTitle').textContent=title;$('cfText').textContent=text;$('cfYes').textContent=yes;confirmAction=action;showScreen('scConfirm');focusFirst('scConfirm');}
$('btnContinue').onclick=()=>startGame(false);
$('btnNew').onclick=()=>{if(readSave())askConfirm('Começar de novo?','Isso apaga as relíquias, o diário e a posição salva.','Apagar e começar',()=>startGame(true));else startGame(true);};
$('pResume').onclick=resumeGame;
$('pFull').onclick=toggleFull;$('btnFull').onclick=toggleFull;
$('pCam').onclick=()=>{CFG.autoCam=!CFG.autoCam;writeCfg();$('pCam').textContent=CFG.autoCam?TXT.camAuto:TXT.camManual;};
$('pGfx').onclick=()=>{CFG.gfx=CFG.gfx==='leve'?'normal':'leve';pixelRatio=pixelCap();perfHold(2);resize();writeCfg();$('pGfx').textContent=CFG.gfx==='leve'?TXT.gfxLow:TXT.gfxNorm;};
$('pSound').onclick=()=>{auInit();auSetOn(!AU.on);writeCfg();$('pSound').textContent=AU.on?TXT.soundOn:TXT.soundOff;};
$('pDiary').onclick=()=>{hideScreens();G.mode='play';openDiary();};
$('pErase').onclick=()=>askConfirm('Apagar o progresso?','Isso apaga as relíquias, o diário e a posição salva.','Apagar',()=>{lsDel(SAVE_KEY);startGame(true);});
$('pHome').onclick=goMenu;
$('cfYes').onclick=()=>{const a=confirmAction;confirmAction=null;if(a)a();};
$('cfNo').onclick=()=>{confirmAction=null;if(G.mode==='menu')showScreen('scStart');else showScreen('scPause');focusFirst(G.mode==='menu'?'scStart':'scPause');};
$('dClose').onclick=closeDiary;
$('tabNotes').onclick=()=>setDiaryTab(false);
$('tabMap').onclick=()=>{setDiaryTab(true);SFX.page();};
$('endTxt').addEventListener('pointerdown',e=>{e.stopPropagation();if(cty.end)cty.end.skip=true;});
$('eVale').onclick=()=>{hideScreens();exitTomb(false);setTimeout(()=>toast('Você acendeu a Cidade-Jardim. O vale continua aberto para explorar.','good'),2200);};
let againArm=0;
$('eAgain').onclick=()=>{
  if(!againArm){againArm=setTimeout(()=>{againArm=0;$('eAgain').textContent='Jogar de novo';},3500);$('eAgain').textContent='Apaga o progresso. Toque de novo';return;}
  clearTimeout(againArm);againArm=0;$('eAgain').textContent='Jogar de novo';startGame(true);
};
$('btnDiary').addEventListener('pointerdown',e=>{e.stopPropagation();auInit();});$('btnMenu').addEventListener('pointerdown',e=>{e.stopPropagation();auInit();});
$('btnDiary').onclick=()=>{try{document.activeElement.blur();}catch(e){}if(G.mode==='play')openDiary();};
$('btnMenu').onclick=()=>{try{document.activeElement.blur();}catch(e){}if(G.mode==='play')pauseGame();};
function padLost(){toast('Controle desconectado.','warn');pauseGame();}

/* navegação dos menus com teclado e controle */
function menuNav(){
  if(G.mode==='play'){IN.pressed.navUp=IN.pressed.navDown=IN.pressed.navOk=IN.pressed.navBack=false;return;}
  const sc=document.querySelector('.screen:not([hidden])');if(!sc)return;
  const btns=Array.from(sc.querySelectorAll('.btn')).filter(b=>!b.hidden);if(!btns.length)return;
  let i=btns.indexOf(document.activeElement);
  if(take('navDown')){i=(i+1)%btns.length;btns[i].focus();}
  if(take('navUp')){i=(i-1+btns.length)%btns.length;btns[i].focus();}
  if(take('navOk')&&i>=0&&IN.mode==='pad')btns[i].click();
  if(take('navBack')){if(G.mode==='diary')closeDiary();else if(G.mode==='paused')resumeGame();}
}

/* ====================== laço principal ====================== */
const tmpV=new THREE.Vector3(),tmpC=new THREE.Color();
let saveTimer=0,lastNightFlag=false;
/* ajuste automático da resolução: a cada 2 s compara o tempo médio dos quadros; lento, desce 10% (nunca abaixo do piso
   de 720p); folgado por 4 s seguidos, sobe 10% até o teto. Ignora os primeiros segundos depois de carregar, trocar de
   área ou voltar ao jogo, e quadros de engasgo isolados (compilação de shader, troca de aba). */
const PERF={t:0,n:0,good:0,hold:3};
function perfHold(s){PERF.hold=Math.max(PERF.hold,s);PERF.t=PERF.n=0;PERF.good=0;}
function adaptResolution(avg){
  const r=pixelRange();
  if(avg>1/40&&pixelRatio>r[0]+0.01){pixelRatio=Math.max(r[0],pixelRatio*0.9);PERF.good=0;resize();}
  else if(avg<1/55&&pixelRatio<r[1]-0.01){if(++PERF.good>=2){pixelRatio=Math.min(r[1],pixelRatio*1.1);PERF.good=0;resize();}}
  else PERF.good=0;
}
function handleGlobalInput(){
  if(take('pause')){if(G.mode==='play')pauseGame();else if(G.mode==='paused')resumeGame();else if(G.mode==='diary')closeDiary();}
  if(take('diary')){if(G.mode==='play')openDiary();else if(G.mode==='diary')closeDiary();}
  if(take('map')){if(G.mode==='play'){openDiary();setDiaryTab(true);}else if(G.mode==='diary')closeDiary();}
  menuNav();
}
function updateInteract(){
  const p=G.p,a=G.area,pr=$('prompt');let best=null,bd=1e9;
  if(G.mode==='play'){
    for(let i=0;i<a.interact.length;i++){const it=a.interact[i],d=Math.hypot(p.x-it.x,p.z-it.z);if(d<it.r&&d<bd){const lab=it.label();if(lab){best=it;bd=d;it.cur=lab;}}}
  }
  if(best){
    if(pr.dataset.k!==best.cur+IN.mode){pr.dataset.k=best.cur+IN.mode;pr.textContent='';const h=TXT.hint[IN.mode==='pad'?'pad':IN.mode==='touch'?'touch':'kb'];
      if(h){const k=document.createElement('kbd');k.textContent=h;pr.appendChild(k);}pr.appendChild(document.createTextNode(best.cur));}
    pr.style.display='block';
    if(take('use')){SFX.use();best.use();}
  }else{pr.style.display='none';pr.dataset.k='';if(G.mode==='play')take('use');}
  $('bUse').classList.toggle('hint',!!best);
}
function updateLanternAndLights(dt,t){
  const inTomb=G.area!==valeArea,p=G.p;
  if(G.mode==='play'&&take('lantern')){
    if(inTomb&&G.lantern<=0){SFX.deny();toast('A lanterna está sem carga. Procure um ponto de energia.','warn');}
    else{G.lanternOn=!G.lanternOn;SFX.click();}
  }
  if(inTomb&&G.lanternOn&&G.mode==='play'){
    const ex=G.area.drainExtra?G.area.drainExtra():0;G.lantern=Math.max(0,G.lantern-dt*(1+ex));if(G.lantern<25&&G.lantern>0)SFX.warn();
    if(G.lantern<=0){G.lanternOn=false;toast('A lanterna apagou. Procure um ponto de energia.','warn');}
  }
  explorer.rig.lens.getWorldPosition(tmpV);
  const dx=Math.sin(p.face),dz=Math.cos(p.face),on=G.lanternOn&&(inTomb?G.lantern>0:NIGHT>0.25);
  explorer.rig.lens.material.color.setHex(on?0xfff2b0:0x6a6458);
  torch.position.copy(tmpV);torch.target.position.set(tmpV.x+dx*9,tmpV.y-1.3,tmpV.z+dz*9);torch.target.updateMatrixWorld();
  torch.intensity=on?(inTomb?1.9:1.1):0;
  fill.position.set(p.x,p.y+1.7,p.z);fill.intensity=inTomb?(on?0.7:0.32):(on?0.3:0);
  let best=null,bd=17;
  for(const l of G.area.lamps){if(!l.on)continue;const d=Math.hypot(l.x-p.x,l.z-p.z);if(d<bd){bd=d;best=l;}}
  if(best){lampL.position.set(best.x,best.y,best.z);lampL.intensity=0.95+Math.sin(t*9+best.z)*0.08;}else lampL.intensity=0;
}
function update(dt){
  if(G.mode==='paused'||G.mode==='diary')return;
  G.t+=dt;
  if(G.mode==='menu'){cam.yaw+=dt*0.1;G.time=(G.time+dt/DAY_LEN*3)%1;updateValeDynamic(dt,G.t);updatePuffs(dt);return;}
  updatePlayer(dt);
  if(G.invuln>0)G.invuln=Math.max(0,G.invuln-dt);
  if(G.area===valeArea){
    updateValeDynamic(dt,G.t);
    if(G.mode==='play'){G.time=(G.time+dt/DAY_LEN)%1;if(G.p.grounded){G.valePos.x=G.p.x;G.valePos.z=G.p.z;}
      saveTimer+=dt;if(saveTimer>30){saveTimer=0;writeSave(false);}
      if(NIGHT>0.6&&!G.nightSeen){let near=false;for(const d of INSC){if(!G.insc[d.id]&&Math.hypot(d.x-G.p.x,d.z-G.p.z)<45)near=true;}if(near){G.nightSeen=true;toast(TXT.nightHint);addDiary('night',true);}}}
  }else G.area.update(dt,G.t);
  updateLanternAndLights(dt,G.t);
  updateInteract();
  updatePuffs(dt);
  updateTrans(dt);
}
function syncPlayerModel(t,camVis){
  const p=G.p;explorer.group.position.set(p.x,p.y,p.z);explorer.group.rotation.y=p.face;
  animExplorer(explorer.rig,p.anim,p.speed,!p.grounded,p.run,t);
  /* em vez de sumir de uma vez quando a câmera encosta, o personagem fica translúcido entre 1,35 m e 0,45 m */
  const F=explorer.rig.fade,op=clamp((cam.cur-0.45)/0.9,0,1);
  if(Math.abs(op-F.op)>0.01||(op===1)!==(F.op===1)){F.op=op;for(const m of F.mats){m.opacity=op>=0.999?1:0.15+0.85*op;m.depthWrite=op>0.6;}for(const o of F.outlines)o.visible=op>0.9;}
  explorer.group.visible=op>0.02&&(G.invuln<=0||Math.floor(G.t*18)%2===0);
}
function render(dt){
  if(G.mode==='ending'||G.mode==='end'){cityEndingCamera(dt);cam.cur=cam.want;}else updateCamera(dt,null);
  syncPlayerModel(G.t);
  if(G.area===valeArea)updateSky();
  const inTomb=G.area!==valeArea;
  if(lastNightFlag!==(NIGHT>0.5)){lastNightFlag=NIGHT>0.5;auArea(inTomb,lastNightFlag,G.area.ambience||'steam');}
  auUpdate(dt,inTomb,NIGHT>0.5,G.mode);
  if(G.mode!=='menu'){updateHud();updateGoal();}
  updateBlob();
  if(!glLost)renderer.render(scene,camera);
}
let last=performance.now(),acc=0;
function frame(now){
  requestAnimationFrame(frame);
  let dt=(now-last)/1000;last=now;if(!(dt>0))dt=1/60;const raw=dt;dt=Math.min(dt,0.1);
  pollPad();handleGlobalInput();toastTick(now);
  acc+=dt;let n=0;while(acc>=1/60&&n<6){update(1/60);acc-=1/60;n++;}if(n===6)acc=0;
  render(dt);
  if(PERF.hold>0)PERF.hold-=raw;else if(raw<0.25){PERF.t+=raw;PERF.n++;if(PERF.n>=120){const avg=PERF.t/PERF.n;PERF.t=PERF.n=0;adaptResolution(avg);}}
}

/* ====================== início ====================== */
(function boot(){
  readCfg();pixelRatio=pixelCap();
  buildVale();
  for(const f of flames)f.userData.dyn=true;for(const o of spinners)o.o.userData.dyn=true;for(const o of orbs)o.userData.dyn=true;
  VG.children.forEach(c=>{if(c.isMesh&&c.geometry.attributes.color)c.userData.dyn=true;});
  valeArea.merge=mergeStatic(VG,80);
  setArea(valeArea);
  placePlayer(valeArea.spawn.x,terrainH(0,150),valeArea.spawn.z,valeArea.spawn.face);
  resize();updateFinalSlots();refreshStart();focusFirst('scStart');
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(G.mode==='play')pauseGame();writeSave(false);if(AU.ctx)try{AU.ctx.suspend();}catch(e){}}
    else{perfHold(2);if(AU.ctx&&AU.on)try{AU.ctx.resume();}catch(e){}}
  });
  addEventListener('pagehide',()=>writeSave(false));
  canvas.addEventListener('webglcontextlost',()=>toast('Os gráficos foram interrompidos pelo navegador. Tentando restaurar...','warn'));
  canvas.addEventListener('webglcontextrestored',()=>toast('Gráficos restaurados.','good'));
  const bt=$('boot');if(bt)bt.remove();
  requestAnimationFrame(frame);
  if(location.hash==='#vt')window.__vt={G,cam,tomb,IN,start:startGame,sim:(n,dt)=>{for(let i=0;i<n;i++)update(dt||1/60);},step:(n,dt)=>{for(let i=0;i<n;i++){update(dt||1/60);}render(dt||1/60);},tp:(x,z,y)=>{placePlayer(x,y===undefined?(G.area===valeArea?terrainH(x,z):0):y,z,G.p.face);},
    enter:enterTomb,exit:exitTomb,TOMB_AREAS,dsl,atm,bio,cty,use:()=>press('use'),key:(k,v)=>{keys[k]=v;},press,setArea,valeArea,tombArea,TOMBS,scene,camera,renderer,renderOnce:()=>render(1/60),saveNow:()=>writeSave(true),hurt,state:()=>({mode:G.mode,x:G.p.x,y:G.p.y,z:G.p.z,hearts:G.hearts,lantern:G.lantern,area:G.area.name,grounded:G.p.grounded})};
})();
