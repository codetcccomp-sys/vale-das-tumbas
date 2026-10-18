/* ====================== o Vale ======================
   Mesma geografia do vale 3D na escala 0,4: acampamento ao sul, oásis a sudoeste, a Estrada das Eras subindo até a
   pirâmide da Cidade-Jardim ao norte, as quatro tumbas (Engrenagens a nordeste, Motores a oeste, Reator a sudoeste,
   Viva a sudeste), trilhas coloridas com marcos, ruínas de cada era, inscrições, os 12 segredos e uma borda de penhascos.
   As portas das tumbas ficam na face sul (de frente para quem chega), o que lê melhor na visão de cima. */
const TRILHAS={
  steam:[[94,72],[107.6,70],[118,61],[126,57.5],[130.5,57.5]],
  diesel:[[86,84],[68,82],[51,86.4],[40,89.5],[34.5,89.5]],
  atom:[[86,132],[75,135],[67,134.4],[59,133.5],[50.5,133.5]],
  bio:[[94,132],[108,129.2],[120,127.6],[128,129.5],[134.5,129.5]]
};
const COR_TRILHA={steam:'#c8743a',diesel:'#6fd3ff',atom:'#5dff7a',bio:'#b98cff'};
const NOME_TRILHA={steam:'cobre',diesel:'azul-gelo',atom:'verde',bio:'lilás'};
function distSeg(px,py,P){let b=1e9;for(let i=0;i<P.length-1;i++){const ax=P[i][0],ay=P[i][1],dx=P[i+1][0]-ax,dy=P[i+1][1]-ay,L=dx*dx+dy*dy,u=clamp(((px-ax)*dx+(py-ay)*dy)/L,0,1),ex=ax+dx*u-px,ey=ay+dy*u-py;b=Math.min(b,ex*ex+ey*ey);}return Math.sqrt(b);}
const VALE={A:null,feixes:[],fogo:[],fumaca:[],cata:[],insc:[],segredos:{frags:[],baus:[],dia:[]},estacoes:{}};
Object.assign(OBJS,{
  /* estação de atalho: poste com placa e lâmpada da cor da era; acorda com o saber da tumba */
  estacaoAtalho(cor,ativa){const c=cnv(18,36),g=ctx2(c);P.r(g,8,8,3,27,'#5a4a3a');P.r(g,8,8,1,27,'#7a6a52');P.r(g,2,12,15,9,'#e9dcbc');P.r(g,2,12,15,2,cor);
    P.r(g,5,16,9,1,'#6a5a48');P.r(g,5,18,6,1,'#6a5a48');P.r(g,14,16,2,3,'#6a5a48');P.r(g,6,1,7,7,'#2a2018');P.r(g,7,2,5,5,ativa?tom(cor,0.35):'#4a4038');if(ativa)P.p(g,8,3,'#ffffff');
    P.r(g,4,33,11,3,'#5a4a3a');return contorno(c,'#24160d');},
  /* quadro do acampamento: tábua com papéis presos */
  quadroExplorar(){const c=cnv(30,30),g=ctx2(c);P.r(g,3,14,2,15,'#5a3a20');P.r(g,25,14,2,15,'#5a3a20');P.r(g,1,2,28,16,'#8a5a32');P.r(g,1,2,28,2,'#b07a3a');
    for(const[x,y,w,h,cr]of[[4,6,7,8,'#e9dcbc'],[13,5,6,9,'#f0e6cc'],[21,7,6,7,'#e9dcbc']]){P.r(g,x,y,w,h,cr);P.p(g,x+w/2|0,y,'#b9533a');P.r(g,x+1,y+3,w-2,1,'#8a7a62');P.r(g,x+1,y+5,w-3,1,'#8a7a62');}
    return contorno(c,'#24160d');}
});
const PIR={x:90*16+8,y:41*16};

function construirVale(){
  const A=novaArea('vale',VALE_W,VALE_H,'vale');A.fundo='#6e5034';VALE.A=A;
  const R=rng(2024);
  /* ---------- tiles ---------- */
  for(let ty=0;ty<VALE_H;ty++)for(let tx=0;tx<VALE_W;tx++){
    const dx=tx+0.5-VALE_C,dy=ty+0.5-VALE_C,r=Math.hypot(dx,dy),an=Math.atan2(dy,dx);
    const borda=VALE_R+2.4*Math.sin(an*5+1)+1.3*Math.sin(an*11+2);
    let k='areia';
    if(r>borda)k='penhasco';
    else{
      const n=Math.sin(tx*0.11+1.3)+Math.sin(ty*0.09-0.4)+Math.sin((tx+ty)*0.05+2);
      if(n>1.2&&r<borda-4)k='duna';
      if(tx>=87&&tx<=93&&ty>=40&&ty<=141)k='estrada';
      else for(const key in TRILHAS)if(distSeg(tx+0.5,ty+0.5,TRILHAS[key])<1.05){k='trilha';break;}
      const ox=(tx+0.5-62)/4.4,oy=(ty+0.5-146)/3.3,od=Math.hypot(ox,oy);
      if(od<1)k='agua';else if(od<1.85&&k!=='estrada')k='grama';
    }
    A.set(tx,ty,k);
  }
  leitoSeco(A);
  /* praça na frente da pirâmide e em volta do acampamento */
  for(let ty=40;ty<=44;ty++)for(let tx=83;tx<=97;tx++)A.set(tx,ty,'estrada');
  for(let ty=144;ty<=158;ty++)for(let tx=80;tx<=100;tx++)if(A.kind(tx,ty)==='duna')A.set(tx,ty,'areia');
  A.spawn={x:90*16+8,y:147*16+8,dir:'cima'};

  const avoid=[];const livre=(x,y,r)=>avoid.every(a=>Math.hypot(a[0]-x,a[1]-y)>a[2]+r);
  const pode=(x,y,r)=>{const tx=Math.floor(x),ty=Math.floor(y),k=A.kind(tx,ty);return(k==='areia'||k==='duna')&&livre(x,y,r)&&Math.hypot(x-VALE_C,y-VALE_C)<VALE_R-3;};
  /* objetos com altura ganham uma sombra no chão */
  const por=(tx,ty,img,o)=>{o=o||{};if(o.sombra===undefined&&o.col&&img.width>=14&&img.height>=14)o.sombra=[Math.min(34,Math.round(img.width*0.42)),Math.max(2,Math.round(img.width*0.13)),0.2];return objeto(A,img,tx*16,ty*16,o);};
  const reserva=(x,y,r)=>avoid.push([x,y,r]);

  /* ---------- acampamento ---------- */
  for(const[x,y,c]of[[85,154,'#d7c39a'],[90,156,'#b9533a'],[95,154,'#d7c39a']]){por(x,y,SPR.get('tenda',c),{col:[-16,-10,16,0]});reserva(x,y,3);}
  const fog=por(91.5,150,SPR.get('fogueira',0),{col:[-6,-4,6,1]});fog.frames=[0,1,2].map(f=>SPR.get('fogueira',f));fog.fps=6;VALE.fogo.push(fog);
  por(87.6,149.6,SPR.get('mesa'),{col:[-10,-6,10,0]});por(86.5,152,SPR.get('bandeira'),{col:[-3,-3,3,0]});reserva(90,150,6);
  interacao(A,{x:87.6*16,y:150.6*16,r:20,label:()=>'Abrir o caderno de campo',use:()=>abrirDiario()});
  /* o Lume fica no acampamento; a placa leva de volta ao pátio de treino */
  criarLume(A,93.2,148,'vale');reserva(93.2,148,1.5);
  por(84.2,148.6,SPR.get('placaTreino'),{col:[-3,-3,3,0]});reserva(84.2,148.6,1.5);
  interacao(A,{x:84.2*16,y:148.6*16+6,r:18,label:()=>'Placa: Pátio de Treino',use:()=>entrarTreino()});
  /* ---------- oásis ---------- */
  for(let i=0;i<7;i++){const a=i/7*TAU+0.3,rr=5.2+R()*0.9,x=62+Math.cos(a)*rr*1.15,y=146+Math.sin(a)*rr*0.9;por(x,y,SPR.get('palmeira',i%3),{col:[-3,-3,3,1]});reserva(x,y,1.5);}
  por(53.5,141.5,SPR.get('estufa','#9fe8d0'),{col:[-22,-14,22,0]});reserva(53.5,141,4);reserva(62,146,6);
  interacao(A,{x:66.6*16,y:145.5*16,r:28,label:()=>G.hearts<3?'Beber a água fresca do oásis':'Água fresca do oásis',use:()=>curarOasis()});
  /* ---------- Estrada das Eras: colunas de cada era ---------- */
  for(let ty=138;ty>=44;ty-=12){const era=ty>126?'steam':ty>102?'diesel':ty>78?'atom':'bio';for(const tx of[86.2,94.8])por(tx,ty,SPR.get('coluna',era),{col:[-6,-4,6,0]});}
  /* ---------- entradas das tumbas, torres e feixes de luz ---------- */
  for(const k of RELIC_KEYS){
    const T=TOMBS[k],bx=T.door.x*16+8,by=(T.door.y+1)*16;
    objeto(A,SPR.get('torre',k),bx,by-50,{col:null});
    objeto(A,SPR.get('entrada',k),bx,by,{col:[-48,-46,48,0]});
    /* marca própria de cada tumba: o emblema com o símbolo do saber, iluminado com a cor da tumba */
    const em=objeto(A,SPR.get('emblema',k),bx,by-52,{camada:60});em.luz={r:30,cor:T.col,dy:-10};
    VALE.feixes.push({k,x:bx,y:by-150});reserva(T.door.x,T.door.y-2,6);reserva(T.out.x,T.out.y,2.5);
    interacao(A,{x:bx,y:by+10,r:22,label:()=>tumbaRotulo(k),use:()=>usarPortaTumba(k)});
  }
  /* ---------- estações de atalho: uma ao lado de cada tumba e uma no acampamento ----------
     O saber de uma tumba acorda a estação dela: dela se vai ao acampamento e às outras estações acordadas (a volta
     fica curta). A do acampamento leva às estações acordadas. */
  const lugarFixo=(x,y,r)=>{for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[1,1],[-1,1],[2,0],[-2,0],[0,-1]]){const k=A.kind(Math.floor(x+dx),Math.floor(y+dy));
    if((k==='areia'||k==='duna'||k==='grama')&&livre(x+dx,y+dy,r))return[x+dx,y+dy];}return[x,y];};
  const estacao=(id,x0,y0,cor,ativa,nome)=>{const[x,y]=lugarFixo(x0,y0,1.2);const o=por(x,y,SPR.get('estacaoAtalho',cor,false),{col:[-4,-3,4,0]});reserva(x,y,1.5);
    o.desenho=(g,ob)=>blit(g,SPR.get('estacaoAtalho',cor,ativa()),ob.x,ob.y,9,36);o.luz={r:22,cor,dy:-30};o.luzSe=ativa;
    const E={id,x:x*16,y:y*16,ativa,nome};VALE.estacoes[id]=E;
    interacao(A,{x:x*16,y:y*16+6,r:20,alto:40,nome:'Estação de atalho',label:()=>ativa()?'Estação de atalho: viajar':'Estação de atalho (adormecida)',use:()=>usarEstacao(id)});};
  for(const k of RELIC_KEYS){const T=TOMBS[k],dx=T.out.x<90?4.5:-4.5;estacao(k,T.out.x+0.5+dx,T.out.y+1,T.col,()=>saberOk(k),'Estação da '+T.name);}
  estacao('camp',97.5,149,'#ffd24a',()=>true,'Estação do acampamento');
  /* quadro do acampamento: o que há fora da estrada e para que serve */
  {const[x,y]=lugarFixo(81.5,151,1.6);por(x,y,SPR.get('quadroExplorar'),{col:[-12,-4,12,0]});reserva(x,y,2);
    interacao(A,{x:x*16,y:y*16+8,r:20,alto:34,nome:'Quadro do acampamento',label:()=>'Ler o quadro do acampamento',use:()=>lerQuadroAcampamento()});}
  /* ---------- pirâmide da Cidade-Jardim ---------- */
  objeto(A,SPR.get('piramide'),PIR.x,PIR.y,{col:[-176,-130,176,-2]});
  VALE.feixes.push({k:'final',x:PIR.x,y:PIR.y-226});
  for(let ty=12;ty<41;ty++)for(let tx=79;tx<=101;tx++)reserva(tx,ty,0.5);
  interacao(A,{x:PIR.x,y:PIR.y+10,r:26,label:()=>saberesCount()>=4?'CIDADE-JARDIM: entrar':'Porta da Cidade-Jardim',use:()=>usarPortaFinal()});
  /* ---------- Autômato de pedra ---------- */
  por(110,88,SPR.get('estatuaAutomato'),{col:[-10,-8,10,0]});reserva(110,88,3);
  /* ---------- inscrições noturnas ---------- */
  INSC.forEach((d,i)=>{const o=por(d.x+0.5,d.y+0.5,SPR.get('estela',40+i,false),{col:[-7,-4,7,0]});o.noite=SPR.get('estela',40+i,true);VALE.insc.push({d,o});reserva(d.x,d.y,2);
    interacao(A,{x:d.x*16+8,y:d.y*16+16,r:18,label:()=>noiteAgora()>0.55?'Ler a inscrição':'Inscrição apagada',use:()=>lerInscricao(d)});});
  /* ---------- segredos ---------- */
  for(const f of SEC_FRAGS){const o=por(f.x+0.5,f.y+0.6,SPR.get('fragmento'),{});o.brilha='#ffe9a0';VALE.segredos.frags.push({f,o});reserva(f.x,f.y,2);
    interacao(A,{x:f.x*16+8,y:f.y*16+8,r:16,label:()=>G.sec[f.id]?null:'Pegar o fragmento de mapa',use:()=>pegarFragmento(f)});}
  for(const c of SEC_CHESTS){const o=por(c.x+0.5,c.y+0.8,SPR.get('bau',false),{col:[-8,-6,8,0]});o.brilha='#ffd24a';VALE.segredos.baus.push({c,o});reserva(c.x,c.y,2);
    interacao(A,{x:c.x*16+8,y:c.y*16+20,r:18,label:()=>G.sec[c.id]?null:'Abrir o baú',use:()=>abrirBau(c)});}
  SEC_INSC.forEach((d,i)=>{const o=por(d.x+0.5,d.y+0.5,SPR.get('estela',90+i,true),{col:[-7,-4,7,0]});o.brilha='#fff0c0';VALE.segredos.dia.push({d,o});reserva(d.x,d.y,2);
    interacao(A,{x:d.x*16+8,y:d.y*16+16,r:18,label:()=>'Ler a inscrição',use:()=>lerInscricaoDia(d)});});
  /* ---------- trilhas: marcos com fita da cor da era e placas na estrada ---------- */
  for(const k in TRILHAS){
    const P0=TRILHAS[k];let acc=0;
    for(let i=0;i<P0.length-1;i++){const ax=P0[i][0],ay=P0[i][1],bx=P0[i+1][0],by=P0[i+1][1],L=Math.hypot(bx-ax,by-ay);
      for(let s=0;s<L;s+=1){acc+=1;if(acc%7===4&&i<P0.length-2){const u=s/L,x=ax+(bx-ax)*u,y=ay+(by-ay)*u,nx=-(by-ay)/L,ny=(bx-ax)/L,sd=acc%14<7?1:-1;
        por(x+nx*1.7*sd,y+ny*1.7*sd,SPR.get('marco',COR_TRILHA[k]),{col:[-4,-3,4,0]});reserva(x+nx*1.7*sd,y+ny*1.7*sd,1);}}}
    const s0=P0[0],sx=s0[0]<90?s0[0]-1.3:s0[0]+1.3;por(sx,s0[1]-1.2,SPR.get('placaTrilha',COR_TRILHA[k]),{col:[-3,-3,3,0]});reserva(sx,s0[1]-1.2,1.5);
    interacao(A,{x:sx*16,y:(s0[1]-1.2)*16+6,r:16,label:()=>'Placa: '+TOMBS[k].name,use:()=>toast('A trilha com marcos de fita '+NOME_TRILHA[k]+' leva à '+TOMBS[k].name+' ('+SABERES[TOMBS[k].saber].nome+')'+(saberOk(k)?': saber já recuperado.':'.'))});
  }
  /* ---------- ruínas de cada era, perto da tumba da mesma era ---------- */
  const lugar=(x,y,r,fn)=>{for(let t=0;t<8;t++){const ox=t?x+(R()-0.5)*3*t:x,oy=t?y+(R()-0.5)*3*t:y;if(pode(ox,oy,r)){fn(ox,oy);reserva(ox,oy,r);return true;}}return false;};
  lugar(126,67,2.5,(x,y)=>por(x,y,SPR.get('engrenagemGrande'),{col:[-20,-8,20,0]}));lugar(135,62,2.5,(x,y)=>por(x,y,SPR.get('engrenagemGrande'),{col:[-20,-8,20,0]}));
  lugar(121,47,2.5,(x,y)=>por(x,y,SPR.get('engrenagemGrande'),{col:[-20,-8,20,0]}));lugar(136,49,2.6,(x,y)=>por(x,y,SPR.get('caldeiraRuina'),{col:[-20,-8,20,0]}));
  lugar(124,40,2.6,(x,y)=>por(x,y,SPR.get('caldeiraRuina'),{col:[-20,-8,20,0]}));
  for(const[x,y]of[[143,67],[116,42]])lugar(x,y,1,(x2,y2)=>{const o=por(x2,y2,SPR.get('chamine'),{col:[-5,-4,5,0]});VALE.fumaca.push(o);});
  for(const[x,y]of[[140,38],[146,52]])lugar(x,y,2.5,(x2,y2)=>por(x2,y2,SPR.get('cano'),{col:[-20,-6,20,0]}));
  for(const[x,y]of[[39,94],[29,98],[41,77]])lugar(x,y,2.6,(x2,y2)=>por(x2,y2,SPR.get('torreDiesel'),{col:[-18,-14,18,0]}));
  lugar(35,105,5,(x,y)=>por(x,y,SPR.get('dirigivel'),{col:[-46,-14,46,0]}));
  for(const[x,y]of[[29,72],[47,66]])lugar(x,y,2.6,(x2,y2)=>por(x2,y2,SPR.get('caminhao'),{col:[-22,-8,22,0]}));
  for(const[x,y]of[[43,81],[40,92],[23,93],[26,79]])lugar(x,y,0.8,(x2,y2)=>{const o=por(x2,y2,SPR.get('poste'),{col:[-3,-3,3,0]});o.luz={r:28,cor:'#ffe9a0',dy:-30};o.luzSe=()=>saberOk('diesel');});
  for(const[x,y,h]of[[56,124,50],[45,123,62],[52,139,42],[62,130,56]])lugar(x,y,0.8,(x2,y2)=>{const o=por(x2,y2,SPR.get('antena',h),{col:[-4,-3,4,0]});o.luz={r:14,cor:'#ff4a3a',dy:-h};o.luzSe=()=>saberOk('atom');});
  for(const[x,y]of[[34,119],[66,117]])lugar(x,y,1.6,(x2,y2)=>por(x2,y2,SPR.get('disco'),{col:[-8,-5,8,0]}));
  lugar(36,146,3,(x,y)=>por(x,y,SPR.get('bunker'),{col:[-24,-10,24,0]}));
  for(const[x,y,v]of[[128,118,0],[142,134,1],[137,114,2]])lugar(x,y,2.8,(x2,y2)=>por(x2,y2,SPR.get('estufa','#b9a6ff'),{col:[-22,-14,22,0]}));
  for(const[x,y,v]of[[146,115,0],[148,118,1],[144,120,0],[125,140,1],[128,142,0],[151,130,1],[118,130,0]])lugar(x,y,1,(x2,y2)=>{const o=por(x2,y2,SPR.get('cogumelo',v),{col:[-4,-3,4,0]});o.luz={r:12,cor:'#c9a6ff',dy:-10};o.luzSe=()=>saberOk('bio');});
  for(const[x,y]of[[141,141],[120,113]])lugar(x,y,2.5,(x2,y2)=>por(x2,y2,SPR.get('arcoRaiz'),{col:[-20,-6,-14,0]}));
  /* Solarpunk perto da porta final: painéis, cata-ventos e canteiros */
  for(const[x,y]of[[73,43],[107,43],[78,50]])lugar(x,y,2.4,(x2,y2)=>por(x2,y2,SPR.get('painelSolar'),{col:[-18,-6,18,0]}));
  for(const[x,y]of[[67,30],[112,29],[62,39]])lugar(x,y,1,(x2,y2)=>{const o=por(x2,y2,SPR.get('cataVento',0),{col:[-3,-3,3,0]});o.frames=[0,1,2,3,4,5].map(f=>SPR.get('cataVento',f));o.fps=5;VALE.cata.push(o);});
  [[80,45],[100,45],[76,36],[104,36],[82,52],[98,51],[70,47],[110,48]].forEach(([x,y],i)=>lugar(x,y,1.8,(x2,y2)=>por(x2,y2,SPR.get('canteiro',i),{col:[-14,-8,14,0]})));
  /* muros arruinados e colunas caídas */
  [[106,114,4],[74,102,3],[114,62,4],[58,54,5],[130,94,3],[78,70,3],[102,134,3],[50,106,3]].forEach(([x,y,l],i)=>lugar(x,y,l*0.5+0.8,(x2,y2)=>por(x2,y2,SPR.get('muro',l,i),{col:[-l*4,-6,l*4,0]})));
  for(const[x,y]of[[100,102],[80,82],[118,86],[66,94],[98,66],[72,126]])lugar(x,y,2.4,(x2,y2)=>por(x2,y2,SPR.get('colunaCaida'),{col:[-18,-6,18,0]}));
  /* mesas de rocha perto da borda */
  for(let k=0;k<11;k++){const a=k/11*TAU+0.25+R()*0.2,d=66+R()*5;lugar(VALE_C+Math.cos(a)*d,VALE_C+Math.sin(a)*d,4,(x,y)=>por(x,y,SPR.get('mesaRocha',k),{col:[-28,-24,28,0]}));}
  /* manchas de vegetação do deserto e o que sobra espalhado */
  const manchas=[];for(let i=0;i<200&&manchas.length<26;i++){const a=R()*TAU,d=12+Math.sqrt(R())*58,x=VALE_C+Math.cos(a)*d,y=VALE_C+Math.sin(a)*d;if(Math.abs(x-90)>6&&manchas.every(p=>Math.hypot(p[0]-x,p[1]-y)>10))manchas.push([x,y]);}
  for(const[cx,cy]of manchas){
    for(let k=0;k<2;k++)lugar(cx+(R()-0.5)*7,cy+(R()-0.5)*7,0.8,(x,y)=>por(x,y,SPR.get('cacto',(R()*3)|0),{col:[-4,-3,4,0]}));
    for(let k=0;k<4;k++)lugar(cx+(R()-0.5)*8,cy+(R()-0.5)*8,0.6,(x,y)=>por(x,y,SPR.get('arbusto',(R()*4)|0),{}));
    for(let k=0;k<6;k++){const x=cx+(R()-0.5)*9,y=cy+(R()-0.5)*9;if(pode(x,y,0.2))A.decalques.push({img:SPR.get('capim',(R()*3)|0),x:x*16,y:y*16});}
    if(R()<0.7)lugar(cx+(R()-0.5)*6,cy+(R()-0.5)*6,1.4,(x,y)=>por(x,y,SPR.get('pedra',2,(R()*3)|0),{col:[-12,-6,12,0]}));
    if(R()<0.35)lugar(cx+(R()-0.5)*6,cy+(R()-0.5)*6,1.2,(x,y)=>por(x,y,SPR.get('arvoreSeca'),{col:[-3,-3,3,0]}));
  }
  for(let i=0;i<500;i++){const a=R()*TAU,d=8+Math.sqrt(R())*68,x=VALE_C+Math.cos(a)*d,y=VALE_C+Math.sin(a)*d;const q=R();
    if(q<0.12)lugar(x,y,0.8,(x2,y2)=>por(x2,y2,SPR.get('cacto',(R()*3)|0),{col:[-4,-3,4,0]}));
    else if(q<0.4)lugar(x,y,0.5,(x2,y2)=>por(x2,y2,SPR.get('arbusto',(R()*4)|0),{}));
    else if(q<0.55)lugar(x,y,0.8,(x2,y2)=>por(x2,y2,SPR.get('pedra',(R()*2)|0,(R()*3)|0),{col:[-6,-3,6,0]}));
    else if(pode(x,y,0.1))A.decalques.push({img:SPR.get('capim',(R()*3)|0),x:x*16,y:y*16});}
  /* beira da estrada */
  for(let ty=48;ty<150;ty+=2){const sd=R()<0.5?-1:1,x=90+sd*(5+R()*3);if(pode(x,ty,0.1))A.decalques.push({img:SPR.get('capim',(R()*3)|0),x:x*16,y:ty*16});if(R()<0.25)lugar(90-sd*(5.5+R()*3),ty,0.5,(x2,y2)=>por(x2,y2,SPR.get('arbusto',(R()*4)|0),{}));}

  ambientarVale(A,{por,lugar,pode,reserva,R});
  for(const o of VALE.braseiros)o.luz={r:34,cor:'#ff9a40',dy:-14};
  A.update=atualizarVale;A.desenharTopo=desenharTopoVale;
  return A;
}

/* ---------- vale: animação, noite, feixes ---------- */
function atualizarVale(dt,t){
  /* o vale reage aos saberes: as chaminés do vapor só voltam a fumegar depois das Engrenagens */
  if(saberOk('steam')&&Math.random()<dt*2.5)for(const o of VALE.fumaca)if(naTela(o.x,o.y,80)&&Math.random()<0.5)vapor(o.x,o.y-38,1,['#e8dccb','#cfc4b4','#a8a094']);
  const st=TOMBS.steam;if(Math.random()<dt*2&&naTela(st.door.x*16,st.door.y*16-100,120))vapor(st.door.x*16+8,st.door.y*16-118,1);
  for(const v of VALE.insc)v.o.img=noiteAgora()>0.5?v.o.noite:SPR.get('estela',40+INSC.indexOf(v.d),false);
  ambienteVale(dt,t);
}
function desenharTopoVale(g,t){
  nevoaVale(g,t);
  const nRel=saberesCount();
  for(const f of VALE.feixes){
    if(!naTela(f.x,f.y,160))continue;
    const cor=f.k==='final'?'#ffd24a':TOMBS[f.k].col,fraco=f.k!=='final'&&saberOk(f.k),forca=f.k==='final'?0.35+0.65*nRel/4:fraco?0.25:1;
    const x=Math.round(f.x+R.ox),y=Math.round(f.y+R.oy),pul=Math.sin(t*2.2)*0.5+0.5;
    g.globalAlpha=(0.12+0.06*pul+noiteAgora()*0.1)*forca;P.r(g,x-4,y-200,8,200,cor);g.globalAlpha=(0.2+0.1*pul)*forca;P.r(g,x-2,y-200,4,200,'#ffffff');g.globalAlpha=1;
    g.drawImage(SPR.get('orbe',cor,(t*2|0)%2),x-8,y-8);
  }
}
function noiteAgora(){const e=Math.sin(G.time*TAU);return smooth(0.05,-0.25,e);}
function tardeAgora(){const e=Math.sin(G.time*TAU),day=smooth(0,0.4,e),night=smooth(0.05,-0.25,e);return(1-day)*(1-night);}

/* ---------- estações de atalho e quadro do acampamento ---------- */
function usarEstacao(id){
  const E=VALE.estacoes[id];
  if(!E.ativa()){const T=TOMBS[id];SFX.deny();toast('Esta estação acorda com o saber '+SABERES[T.saber].nome+'. Conclua as etapas da '+T.name+'.','warn');return;}
  const ops=[];
  for(const k in VALE.estacoes){if(k===id)continue;const D=VALE.estacoes[k];if(!D.ativa())continue;ops.push({t:'➜ '+D.nome,fn:()=>{fecharFala();viajarAtalho(D);}});}
  ops.push({t:'Ficar aqui'});
  const ativas=RELIC_KEYS.filter(k=>VALE.estacoes[k].ativa()).length;
  falar(ops.length>1?'Estações acordadas: '+ativas+' de 4. Para onde ir?':'Nenhuma outra estação está acordada ainda. Cada tumba concluída acorda a estação ao lado da porta.',ops,E.nome,['estacaoAtalho',id==='camp'?'#ffd24a':TOMBS[id].col,true]);
}
function viajarAtalho(D){SFX.lever();transicao(()=>{posicionar(D.x,D.y+22,'baixo');camSeguir(G.p.x,G.p.y,0,G.area,true);salvar(false);},'Seguindo pelo atalho…');}
function lerQuadroAcampamento(){
  const n=a=>a.filter(x=>G.sec[x.id]).length,est=RELIC_KEYS.filter(k=>saberOk(k)).length;
  const t='Fora da estrada: fragmentos de mapa '+n(SEC_FRAGS)+'/4 (cada um revela um quarto do mapa do diário) · baús '+n(SEC_CHESTS)+'/5 (notas dos construtores) · inscrições do dia '+n(SEC_INSC)+'/3 e da noite '+Object.keys(G.insc).length+'/'+INSC.length+' (estas só se leem à noite) · estações de atalho acordadas '+est+'/4 (cada tumba concluída acorda uma e encurta a volta) · marcas de luz '+Object.keys(G.marcas).length+'/'+MARCA_IDS.length+' (dentro das tumbas, com a lanterna). Nada disso é obrigatório para aprender: é para quem quiser explorar.';
  SFX.page();falar(t,[{t:'🗺 Abrir o mapa do diário',fn:()=>{fecharFala();abrirDiario('mapa');}},{t:'Entendi',main:true}],'Quadro do acampamento','quadroExplorar');
}
/* ---------- portas ---------- */
function tumbaAnterior(k){const i=ORDEM_TUMBAS.indexOf(k);return i>0?ORDEM_TUMBAS[i-1]:null;}
function tumbaAberta(k){const a=tumbaAnterior(k);return!a||saberOk(a);}
function tumbaRotulo(k){const T=TOMBS[k];return tumbaAberta(k)?'Entrar: '+T.name+' ('+SABERES[T.saber].nome+')':T.name+' (selada)';}
function usarPortaTumba(k){
  if(!tumbaAberta(k)){const a=tumbaAnterior(k);SFX.deny();toast('O selo desta porta responde a quem já sabe '+SABERES[TOMBS[a].saber].nome.toLowerCase()+'. Primeiro recupere esse saber na '+TOMBS[a].name+'.','warn');return;}
  entrarTumba(k);
}
function usarPortaFinal(){
  const falta=RELIC_KEYS.filter(k=>!saberOk(k));
  if(falta.length){SFX.deny();toast('A porta tem quatro encaixes, um para cada saber. Falta'+(falta.length===1?' ':'m ')+falta.length+': '+falta.map(k=>SABERES[TOMBS[k].saber].nome).join(', ')+'.','warn');return;}
  entrarTumba('final');
}
