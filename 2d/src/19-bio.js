/* ====================== Tumba Viva (Biopunk) · saber: Repetições e automação ======================
   Entrada com a flor de luz → sala da canção (o coração canta uma sequência de bulbos; repita na mesma ordem para abrir a
   membrana; errar acorda os Clones das cápsulas) → jardim dos esporos (a névoa encurta a luz; as raízes brilhantes
   mostram o caminho) → Estufa automática (trilho com organismos e o polinizador) → câmara da Semente da vida. */
Object.assign(OBJS,{
  flor(aceso,f){const c=cnv(20,26),g=ctx2(c);P.r(g,9,10,2,15,'#3a7a3a');P.linha(g,10,18,4,14,'#3a7a3a');P.linha(g,10,16,16,12,'#3a7a3a');
    const C=aceso?(f?'#ffe9ff':'#f0c8ff'):'#6a4a7a';for(let k=0;k<5;k++){const a=k/5*TAU-Math.PI/2;P.circ(g,10+Math.cos(a)*4,7+Math.sin(a)*4,2.6,C);}P.circ(g,10,7,2.2,aceso?'#ffd24a':'#4a3a2a');return contorno(c,'#1a0a20');},
  bulbo(i,aceso){const cores=['#ff6a8a','#6fd3ff','#ffd24a','#5dff7a'],c=cnv(18,24),g=ctx2(c);P.r(g,7,14,4,9,'#5a3a6a');P.elip(g,9,9,7,8,aceso?tom(cores[i],0.35):tom(cores[i],-0.45));P.elip(g,7,6,3,3,aceso?'#ffffff':tom(cores[i],-0.2));
    P.r(g,2,21,14,3,'#4a2a5a');return contorno(c,'#1a0a20');},
  coracao2(f){const c=cnv(24,24),g=ctx2(c);const k=f%2;P.circ(g,8,9,5+k*0.5,'#c8345a');P.circ(g,16,9,5+k*0.5,'#c8345a');P.r(g,4,10,16,4,'#c8345a');for(let y=0;y<8;y++)P.r(g,5+y,13+y,14-y*2,1,'#a82848');P.p(g,7,6,'#ffb0c0');P.linha(g,12,3,12,0,'#7a5aa0');return contorno(c,'#1a0a20');},
  capsula(f){const c=cnv(22,32),g=ctx2(c);P.r(g,2,26,18,5,'#4a2a5a');P.elip(g,11,15,9,13,'#2a1a3a');g.globalAlpha=0.5;P.elip(g,11,15,8,12,'#b98cff');g.globalAlpha=1;P.elip(g,8,9,2,4,'#ffffff');return contorno(c,'#1a0a20');},
  membrana(larg,est){const w=larg*16,c=cnv(w,30),g=ctx2(c);if(est===2){P.r(g,0,0,w,4,'#5a3a6a');return c;}const h=est===1?14:28;
    for(let x=0;x<w;x++){const hh=h-Math.round(Math.abs(Math.sin(x*0.4))*3);P.r(g,x,30-hh,1,hh,x%4<2?'#8a5aa0':'#7a4a90');}P.r(g,0,30-h,w,2,'#c9a6ff');return contorno(c,'#1a0a20');},
  organismo(um,alvo,f){const c=cnv(22,28),g=ctx2(c),seco=um<alvo;const C=seco?mistura('#7aa84a','#8a7a4a',1-um/alvo):'#5dd06a';
    P.r(g,3,22,16,5,'#5a3a2a');P.r(g,4,21,14,2,'#7a5a3a');
    P.elip(g,11,15-(f%2),6,7,C);P.elip(g,9,12-(f%2),2,3,tom(C,0.3));if(!seco){P.p(g,14,10,'#ffffff');P.circ(g,11,7-(f%2),2,'#ff8ac8');}
    else{P.linha(g,7,18,4,13,tom(C,-0.3));P.linha(g,15,18,18,13,tom(C,-0.3));}return contorno(c,'#1a0a20');},
  trilho(){const c=cnv(16,6),g=ctx2(c);P.r(g,0,1,16,2,'#7a7a82');P.r(g,0,4,16,1,'#4a4a52');P.r(g,3,0,2,6,'#5a5a62');P.r(g,11,0,2,6,'#5a5a62');return c;},
  consoleBio(f){const c=cnv(22,24),g=ctx2(c);P.elip(g,11,18,9,5,'#5a3a6a');P.r(g,4,6,14,12,'#6a4a7a');P.r(g,6,8,10,7,'#1a0a20');P.r(g,7,10,3+(f%2)*4,2,'#5dff7a');P.circ(g,11,4,3,'#c9a6ff');return contorno(c,'#1a0a20');},
  raizBrilho(){const c=cnv(16,8),g=ctx2(c);P.linha(g,0,4,15,3,'#5dff7a');P.p(g,5,3,'#e8ffe8');P.p(g,11,4,'#e8ffe8');return c;}
});
const MAPA_BIO=[
  '##############################',
  '##############################',
  '###########........###########',
  '###########........###########',
  '###########........###########',
  '##############..##############',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '##############..##############',
  '####......................####',
  '####......................####',
  '####......................####',
  '####......................####',
  '####......................####',
  '####......................####',
  '####......................####',
  '##############..##############',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '###........................###',
  '##############..##############',
  '#######................#######',
  '#######................#######',
  '#######................#######',
  '#######................#######',
  '#######................#######',
  '##############################',
  '##############################'
];
const TRILHO={x:5,y:11,passo:40};
CONSTRUIR.bio=function(){
  const A=tumbaArea('bio','bio',MAPA_BIO,{'#':'parede','.':'chao'});
  A.som='bio';A.spawn={x:15*16,y:35*16+8,dir:'cima'};
  for(const[x,y]of[[8,26],[21,26],[14,28]])A.set(x,y,'chao2');
  /* raízes brilhantes marcam o caminho no jardim dos esporos */
  for(let y=16;y<=22;y++){const x=14+Math.round(Math.sin(y*0.9)*3);A.set(x,y,'raiz');A.set(x+1,y,'raiz');}
  saidaVale(A,14,36);
  pontoEnergia(A,9,33,'flor','a flor de luz','bio_enter');
  for(const[x,y]of[[8,31],[21,31],[5,23],[24,23],[6,15],[23,15],[6,5],[23,5],[12,1],[17,1]])lampada(A,x,y,'#c9a6ff',38);
  /* sala da canção: quatro bulbos e o coração */
  const canto={seq:[2,0,3,1],pos:0,tocando:-1,fila:[],t:0,acesos:[0,0,0,0]};
  const aberto=()=>G.abertas.indexOf('bio_canto')>=0;
  const BUL=[[8,27],[12,26],[17,26],[21,27]];
  BUL.forEach(([x,y],i)=>{const o=objeto(A,SPR.get('bulbo',i,false),x*16+8,y*16+14,{col:[-6,-4,6,0]});o.desenho=(g,ob)=>blit(g,SPR.get('bulbo',i,canto.acesos[i]>0),ob.x,ob.y,9,24);
    A.lampadas.push({x:x*16+8,y:y*16,get r(){return canto.acesos[i]>0?40:14;},cor:['#ff6a8a','#6fd3ff','#ffd24a','#5dff7a'][i]});
    interacao(A,{x:x*16+8,y:y*16+20,r:18,label:()=>aberto()?null:'Tocar o bulbo',use:()=>tocarBulbo(i)});});
  const co=objeto(A,SPR.get('coracao2',0),14*16+8,29*16+12,{col:[-8,-6,8,0]});co.frames=[0,1].map(f=>SPR.get('coracao2',f));co.fps=2;
  interacao(A,{x:14*16+8,y:29*16+18,r:22,label:()=>aberto()?'O coração da sala (a membrana já está aberta)':'Ouvir a canção do coração',use:()=>{if(aberto()){toast('A membrana continua aberta.');return;}cantar();addDiary('bio_seq',true);}});
  const cantar=()=>{canto.fila=canto.seq.slice();canto.t=0.6;canto.pos=0;toast('O coração canta '+canto.seq.length+' notas. Observe a ordem dos bulbos e repita.');};
  const tocarBulbo=i=>{
    if(canto.fila.length)return;canto.acesos[i]=0.4;SFX.node(i);
    if(canto.seq[canto.pos]===i){canto.pos++;if(canto.pos>=canto.seq.length){canto.pos=0;G.abertas.push('bio_canto');SFX.bioChime();SFX.membrane();toast('A canção está certa: a membrana se abriu.','good');salvar(false);}}
    else{canto.pos=0;SFX.bioFail();toast('A canção errada ecoa pela sala.','warn');for(const e of A.guardas)if(e.estado==='dorme'){e.estado='acorda';e.t=0;}SFX.wake();addDiary('bio_clone',true);}
  };
  portao(A,14,23,2,'membrana',aberto);
  for(const[x,y]of[[5,30],[24,30]]){objeto(A,SPR.get('capsula',0),x*16+8,y*16+14,{col:[-9,-6,9,0]});}
  guardiao(A,{tx:6,ty:28,sala:[3,24,27,31],spr:(ac,f)=>sprClone(ac,f),msg:TXT.hit.clone,diario:'bio_clone',vel:48});
  guardiao(A,{tx:23,ty:28,sala:[3,24,27,31],spr:(ac,f)=>sprClone(ac,f),msg:TXT.hit.clone,diario:'bio_clone',vel:48});
  /* estufa: trilho, organismos e o polinizador */
  for(let i=0;i<8;i++)A.decalques.push({img:SPR.get('trilho'),x:TRILHO.x*16+i*40,y:TRILHO.y*16+9},{img:SPR.get('trilho'),x:TRILHO.x*16+i*40+16,y:TRILHO.y*16+9},{img:SPR.get('trilho'),x:TRILHO.x*16+i*40+24,y:TRILHO.y*16+9});
  const foco={x:14*16,y:10*16};A.focoPainel=foco;
  terminal(A,14,13,'bio',foco,'consoleBio','Usar o console da estufa');
  placaPista(A,'bio',6*16+8,13*16+14,{cor:'#c9a6ff'});
  marcaLuz(A,'bio_zero',11,31);marcaLuz(A,'bio_parar',18,23);
  criarLume(A,17.5,13,'bio');
  tochasProgresso(A,'bio',[[9,14],[10.5,14],[12,14],[17,14],[18.5,14],[20,14]],'#c9a6ff');
  /* as quatro tochas de seiva da estufa: acendem uma depois da outra com o for (etapa b0) */
  const TOCHAS_BIO=[[9,7],[12,7],[16,7],[19,7]];
  const tochasAcesas=()=>{const vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;return vis&&vis.cfg.mundo==='tochas'?vis.ws.acesas:(G.learn.b0?4:0);};
  TOCHAS_BIO.forEach(([x,y],i)=>{const o=objeto(A,SPR.get('tocha',false,0,'#c9a6ff'),x*16+8,y*16+14,{col:[-4,-3,4,0]});
    o.desenho=(g,ob,t)=>{const on=tochasAcesas()>i;blit(g,SPR.get('tocha',on,Math.floor(t*8+i)%3,'#c9a6ff'),ob.x,ob.y,6,30);if(PAINEL.aberto&&PAINEL.area===A&&painelVis().cfg.mundo==='tochas')FONTE.rotulo(g,String(i+1),Math.round(ob.x+R.ox),Math.round(ob.y+3+R.oy),on?'#e8d0ff':'#8a7a9a','#0b0705');};
    A.lampadas.push({x:x*16+8,y:y*16-12,get r(){return tochasAcesas()>i?44:0;},cor:'#c9a6ff'});});
  portao(A,14,5,2,'membrana',()=>saberOk('bio'));
  pedestal(A,14,3,'bio');
  A.update=(dt,t)=>{
    for(let i=0;i<4;i++)if(canto.acesos[i]>0)canto.acesos[i]-=dt;
    if(canto.fila.length){canto.t-=dt;if(canto.t<=0){const i=canto.fila.shift();canto.acesos[i]=0.55;SFX.node(i);canto.t=0.8;}}
    /* esporos no jardim */
    if(G.mode!=='painel'&&Math.random()<dt*20){const x=(4+Math.random()*22)*16,y=(16+Math.random()*7)*16;if(naTela(x,y))particula({x,y,z:4+Math.random()*10,vx:(Math.random()-0.5)*6,vz:2,vida:2.5,cor:Math.random()<0.5?'#c9a6ff':'#e8d0ff',fade:true});}
  };
  A.luzesExtra=t=>{
    const p=G.p,y=p.y/16;if(y>15.5&&y<23)LUZES.forEach(L=>{if(Math.abs(L.x-p.x)<1&&Math.abs(L.y-(p.y-14))<1)L.r*=0.6;});
    for(let ty=16;ty<=22;ty++){const x=14+Math.round(Math.sin(ty*0.9)*3);luz(x*16+16,ty*16+8,12,0.8,'#5dff7a');}
    luz(14*16,10*16,PAINEL.aberto&&PAINEL.area===A?120:50,1,'#e8d0ff');
  };
  A.desenharChao=(g,t)=>{
    /* névoa de esporos */
    const y0=16*16+R.oy,h=7*16;g.globalAlpha=0.22+Math.sin(t*0.7)*0.04;P.ponti(g,Math.max(0,4*16+R.ox),Math.max(0,y0),Math.min(R.W,22*16),Math.max(0,Math.min(R.H-y0,h)),'#b98cff',Math.floor(t*2)%2);g.globalAlpha=1;
    desenharEstufa(A,g,t);
  };
  A.reiniciar=()=>{reiniciarGuardas(A);for(const pt of A.pontos)pt.aceso=false;canto.pos=0;canto.fila=[];addDiary('bio_enter',true);};
  A.objetivo=()=>{if(!aberto())return{t:'Saber: Repetições e automação',s:'Toque no coração da sala para ouvir a canção e repita a ordem nos bulbos.',alvo:{x:14*16+8,y:29*16-12,txt:'Ouvir a canção'}};if(G.p.y>15*16&&G.p.y<23*16)addDiary('bio_spores',true);return objetivoTumba('bio','No console da estufa');};
  A.focoEvento=(ev,ws,cfg)=>{const a=ev.anim||{};if(a.tocha!==undefined){const p=TOCHAS_BIO[a.tocha];return p?{x:p[0]*16+8,y:p[1]*16-36}:null;}
    if(cfg.mundo==='estufa'&&ws&&(ev.cmd||ev.tipo==='enq'))return{x:TRILHO.x*16+Math.min(ws.x,ws.fimX)*TRILHO.passo+8,y:TRILHO.y*16-34};return null;};
  A.aoEvento=(ev)=>{const a=ev.anim||{};if(a.tocha!==undefined){const p=[[9,7],[12,7],[16,7],[19,7]][a.tocha];SFX.lamp();faiscas(p[0]*16+8,p[1]*16-12,10,['#ffffff','#e8d0ff','#c9a6ff']);}if(a.rega!==undefined){SFX.rega();const x=TRILHO.x*16+a.rega*TRILHO.passo+8;gotas(x,TRILHO.y*16-6,6);}if(a.encharca||a.vazio||ev.tipo==='erro'){SFX.deny();R.treme=0.2;}};
  A.aoConcluir=(cfg)=>{if(saberOk('bio'))setTimeout(()=>toast('A estufa respira sozinha: a membrana da câmara da Semente da vida se abriu.','good'),600);};
  return A;
};
function desenharEstufa(A,g,t){
  let vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;if(vis&&vis.cfg.mundo!=='estufa')vis=null;
  const cfg=vis?vis.cfg:(desafiosDa('bio').find(d=>!G.learn[d.id]&&d.mundo==='estufa')||DESAFIO.b4);
  const ws=vis?vis.ws:MUNDOS.estufa.init(cfg.situacoes[0]);if(!ws||!ws.pods)return;
  const X=i=>TRILHO.x*16+i*TRILHO.passo+8,Y=TRILHO.y*16;
  /* fim do trilho: a base do polinizador */
  etiqueta(g,X(ws.fimX),Y+12,'base','#c9a6ff');
  ws.pods.forEach((p,i)=>{
    const x=X(i);
    if(!p){enfileirar(Y-2,gg=>{gg.fillStyle='#4a2a1a';gg.fillRect(Math.round(x-7+R.ox),Math.round(Y-6+R.oy),14,4);});return;}
    enfileirar(Y-2,gg=>{blit(gg,SPR.get('organismo',p.um,ws.alvo,Math.floor(t*2+i)%2),x,Y-1,11,28);
      /* medidor de umidade: um quadradinho por dose */
      for(let k=0;k<ws.alvo;k++){gg.fillStyle=k<p.um?'#6fd3ff':'#2a1a3a';gg.fillRect(Math.round(x-7+k*5+R.ox),Math.round(Y-34+R.oy),4,3);}
      FONTE.rotulo(gg,String(p.um),Math.round(x+R.ox),Math.round(Y-42+R.oy),'#ffffff','#0b0705');});
  });
  /* polinizador */
  let px=ws.x;const ev=vis&&vis.ev,u=vis?vis.t:1;if(ev&&ev.anim&&ev.anim.anda!==undefined&&u<1)px=lerp(ev.anim.anda-1,ev.anim.anda,u);
  let bx=0;if(ev&&ev.anim&&ev.anim.bate&&u<1)bx=Math.sin(u*Math.PI)*6;
  const x=X(px)+bx,y=Y-14+Math.round(Math.sin(t*6)*1.5);
  enfileirar(Y+4,gg=>{sombra(gg,x,Y+6,6,2);blit(gg,sprPolinizador(Math.floor(t*10)),x,y,8,14);});
  /* contador da repetição em destaque */
  if(vis&&vis.s){const c=LANG.contadores(vis.s);if(c.length){const k=c[c.length-1];etiqueta(g,14*16,7*16,(k.k==='rep'?'volta '+k.volta+' de '+k.n:'volta '+k.volta)+(c.length>1?' (bloco de dentro)':''),'#6fd3ff');}}
}
