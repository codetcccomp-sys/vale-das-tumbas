/* ====================== Cidade-Jardim (Solarpunk) · desafio final: tudo junto ======================
   Entrada com a flor de luz → praça com as placas dos quatro distritos (Ritmo, Luz, Água, Semente) e o Jardim Central:
   cinco canteiros, o robô jardineiro e a fonte. O programa final usa sequência, um contador, uma decisão e uma repetição.
   Quando o jardim acende, a luz do sol entra, as plantas revivem e o terraço da árvore-matriz se abre para a cena final. */
Object.assign(OBJS,{
  arvore(flor,f){const c=cnv(80,92),g=ctx2(c),r=rng(5);P.r(g,34,50,12,40,'#7a5232');P.r(g,34,50,4,40,'#9a6a42');P.linha(g,40,60,22,46,'#7a5232');P.linha(g,40,58,60,44,'#7a5232');
    for(let i=0;i<46;i++){const a=r()*TAU,d=Math.sqrt(r())*30,x=40+Math.cos(a)*d*1.2,y=34+Math.sin(a)*d*0.8;P.circ(g,x,y,5+r()*3,i%3?'#4a9a4a':'#3a8a3a');}
    for(let i=0;i<20;i++){const a=r()*TAU,d=Math.sqrt(r())*28,x=40+Math.cos(a)*d*1.2,y=30+Math.sin(a)*d*0.8;P.circ(g,x,y,2.5,'#7ac86a');}
    if(flor)for(let i=0;i<26;i++){const x=12+r()*56,y=10+r()*44;P.p(g,x,y,['#ffd24a','#ff8ac8','#ffffff'][i%3]);P.p(g,x+1,y,['#ffd24a','#ff8ac8','#ffffff'][(i+f)%3]);}
    P.elip(g,40,88,22,4,'#5a3a2a');return contorno(c,'#1a2a10');},
  canteiro2(seco){const c=cnv(28,22),g=ctx2(c);P.r(g,1,6,26,14,'#cfc29e');P.r(g,1,6,26,2,'#e9dcbc');P.r(g,3,9,22,9,seco?'#9a7a4a':'#4a3420');
    if(seco){for(let i=0;i<4;i++)P.linha(g,5+i*6,16,7+i*6,11,'#a89a5a');P.linha(g,4,12,10,14,'#7a5a3a');}
    else for(let i=0;i<5;i++){P.r(g,5+i*4,9,2,6,'#4a9a4a');P.p(g,5+i*4,8,['#ffd24a','#ff8ac8','#ffffff'][i%3]);}
    return contorno(c,'#24160d');},
  fonte(acesa,f){const c=cnv(36,36),g=ctx2(c);P.elip(g,18,28,16,6,'#cfc29e');P.elip(g,18,27,13,4,acesa?'#4ab0d0':'#3a4a4a');P.r(g,15,8,6,20,'#e9dcbc');P.elip(g,18,9,8,3,'#cfc29e');
    if(acesa){P.r(g,17,0,2,9,'#8fe0ff');for(let i=0;i<3;i++)P.p(g,12+i*6,4+((f+i)%3),'#bfeeff');P.circ(g,18,15,2,'#ffd24a');}return contorno(c,'#24160d');},
  placaDistrito(cor){const c=cnv(20,26),g=ctx2(c);P.r(g,9,12,2,13,'#8a7a62');P.r(g,2,2,16,12,'#e9dcbc');P.r(g,2,2,16,3,cor);P.r(g,5,8,10,1,'#8a7a62');P.r(g,5,10,7,1,'#8a7a62');return contorno(c,'#24160d');},
  consoleCity(f){const c=cnv(22,24),g=ctx2(c);P.r(g,3,10,16,12,'#e9dcbc');P.r(g,3,10,16,2,'#ffffff');P.r(g,5,2,12,9,'#2a4a3a');P.r(g,6,4,4+(f%2)*4,2,'#ffd24a');P.r(g,6,7,8,1,'#7ac86a');return contorno(c,'#24160d');},
  portaoVinha(larg,est){const w=larg*16,c=cnv(w,30),g=ctx2(c);if(est===2){P.r(g,0,0,w,3,'#3a7a3a');return c;}const h=est===1?14:28;
    P.r(g,0,30-h,w,h,'#e9dcbc');for(let x=1;x<w;x+=5)P.linha(g,x,30-h,x+3,29,'#4a9a4a');P.r(g,0,30-h,w,2,'#ffd24a');return contorno(c,'#24160d');},
  vaso(v){const c=cnv(16,20),g=ctx2(c);P.r(g,3,10,10,9,'#c8743a');P.r(g,3,10,10,2,'#e8945a');P.circ(g,8,7,5,v%2?'#4a9a4a':'#5aa85a');P.p(g,6,5,['#ffd24a','#ff8ac8'][v%2]);return contorno(c,'#24160d');}
});
const MAPA_CITY=[
  '############################',
  '##########........##########',
  '##########........##########',
  '##########........##########',
  '##########........##########',
  '#############..#############',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '#############..#############',
  '#######..............#######',
  '#######..............#######',
  '#######..............#######',
  '#######..............#######',
  '#######..............#######',
  '############################',
  '############################'
];
const JARDIM={x:6,y:11,passo:40};
CONSTRUIR.final=function(){
  const A=tumbaArea('final','city',MAPA_CITY,{'#':'parede','.':'chao'});
  A.som='city';A.gastaLanterna=false;A.spawn={x:14*16,y:22*16+8,dir:'cima'};A.escuro=0.5;A.tinta='rgb(8,18,10)';
  for(let x=5;x<23;x++){A.set(x,13,'tapete');}for(const[x,y]of[[5,7],[22,7],[5,16],[22,16],[11,2],[16,2]])A.set(x,y,'flor');
  saidaVale(A,14,23);
  pontoEnergia(A,9,20,'flor','a flor de luz','city_enter');
  for(const[x,y]of[[8,18],[19,18],[6,5],[21,5],[11,0],[16,0]])lampada(A,x,y,'#ffe9a0',40);
  [[19,21],[20,21],[8,22]].forEach(([x,y],i)=>objeto(A,SPR.get('vaso',i),x*16+8,y*16+14,{col:[-5,-4,5,0]}));
  /* placas dos distritos */
  const DIST=[['city_rhythm',5,8,'#c8743a'],['city_light',22,8,'#6fd3ff'],['city_water',5,16,'#5dff7a'],['city_seq',22,16,'#b98cff']];
  for(const[id,x,y,cor]of DIST){objeto(A,SPR.get('placaDistrito',cor),x*16+8,y*16+14,{col:[-6,-4,6,0]});interacao(A,{x:x*16+8,y:y*16+20,r:20,label:()=>'Ler a placa: '+ENTRIES[id].t,use:()=>{addDiary(id,true);SFX.insc();toast(ENTRIES[id].s);}});}
  /* Jardim Central: canteiros, fonte e o console */
  const foco={x:14*16,y:11*16};A.focoPainel=foco;
  terminal(A,14,15,'final',foco,'consoleCity','Programar o Jardim Central');
  criarLume(A,17.5,15.5,'final');
  /* árvore-matriz no terraço; o portão abre quando o jardim acende */
  const arv=objeto(A,SPR.get('arvore',false,0),14*16,4*16+8,{col:[-14,-10,14,0]});arv.desenho=(g,ob,t)=>blit(g,SPR.get('arvore',G.learn.c1,Math.floor(t*2)%3),ob.x,ob.y,40,90);
  portao(A,13,5,2,'portaoVinha',()=>!!G.learn.c1);
  interacao(A,{x:14*16,y:5*16,r:26,alto:90,label:()=>G.learn.c1?'A árvore-matriz':null,use:()=>cenaFinal()});
  A.update=(dt,t)=>{AU.cityLvl=G.learn.c1?1:0.3;const alvo=G.learn.c1?0.04:0.5;A.escuro+=(alvo-A.escuro)*Math.min(1,dt*0.8);if(G.learn.c1&&Math.random()<dt*3){const x=(5+Math.random()*18)*16,y=(6+Math.random()*11)*16;if(naTela(x,y))particula({x,y,z:10,vz:-4,vx:(Math.random()-0.5)*10,vida:2,cor:Math.random()<0.5?'#ffd24a':'#ffffff',fade:true});}};
  A.luzesExtra=t=>{luz(14*16,11*16,PAINEL.aberto&&PAINEL.area===A?130:70,1,'#ffe9a0');luz(14*16,3*16,50,0.8,'#d8ffb0');};
  A.desenharChao=(g,t)=>desenharJardim(A,g,t);
  A.reiniciar=()=>{for(const pt of A.pontos)pt.aceso=false;A.escuro=G.learn.c1?0.04:0.5;addDiary('city_enter',true);};
  A.objetivo=()=>G.learn.c1?{t:G.done?'Cidade-Jardim restaurada':'Etapa 5 de 5 · concluída',s:G.done?'Explore o vale: segredos '+secCount()+'/12.':'Suba ao terraço e toque na árvore-matriz.'}:{t:'Etapa 5 de 5 · Tudo junto',s:'Programe o Jardim Central: sequência, variável, decisão e repetição.'};
  A.aoEvento=(ev)=>{const a=ev.anim||{};if(a.rega!==undefined){SFX.rega();gotas(JARDIM.x*16+a.rega*JARDIM.passo+8,JARDIM.y*16-4,6);}if(a.acende){SFX.bioChime();faiscas(JARDIM.x*16+5*JARDIM.passo+8,JARDIM.y*16-10,20,['#ffd24a','#ffffff','#8fe0ff']);}if(ev.tipo==='erro'){SFX.deny();R.treme=0.2;}};
  A.aoConcluir=(cfg)=>{R.treme=0.4;setTimeout(()=>toast('O Jardim Central acendeu! A luz do sol entra pela cúpula e o terraço da árvore-matriz se abriu.','good'),700);};
  return A;
};
function desenharJardim(A,g,t){
  let vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;if(vis&&vis.cfg.mundo!=='jardim')vis=null;
  const cfg=DESAFIO.c1,ws=vis?vis.ws:(G.learn.c1?{beds:cfg.situacoes[0].beds.map(()=>({solo:'úmido'})),x:5,fimX:5,acesa:true}:MUNDOS.jardim.init(cfg.situacoes[0]));
  const X=i=>JARDIM.x*16+i*JARDIM.passo+8,Y=JARDIM.y*16;
  ws.beds.forEach((b,i)=>{const x=X(i);enfileirar(Y,gg=>{blit(gg,SPR.get('canteiro2',b.solo==='seco'),x,Y+2,14,22);FONTE.rotulo(gg,b.solo,Math.round(x+R.ox),Math.round(Y-24+R.oy),b.solo==='seco'?'#ffd8a0':'#bfffc8','#0b0705');});});
  enfileirar(Y+4,gg=>blit(gg,SPR.get('fonte',!!ws.acesa||!!G.learn.c1,Math.floor(t*6)%3),X(ws.fimX),Y+6,18,36));
  let px=ws.x;const ev=vis&&vis.ev,u=vis?vis.t:1;if(ev&&ev.anim&&ev.anim.anda!==undefined&&u<1)px=lerp(ev.anim.anda-1,ev.anim.anda,u);
  const x=X(px),y=Y+14;enfileirar(y,gg=>{sombra(gg,x,y,6,2);blit(gg,sprJardineiro(Math.floor(t*6)),x,y+1,8,18);});
  if(vis&&vis.s){const r=vis.s.env.regadas;etiqueta(g,14*16,7*16+4,'regadas = '+(r&&r.val?LANG.fmt(r.val):'vazio'),'#ffd24a');}
}
function cenaFinal(){
  if(G.mode!=='play')return;
  const primeira=!G.done;G.done=true;addDiary('city_end',true);SFX.relic();
  const box=$('fimTxt');box.textContent='';
  for(const l of TXT.ending){const p=document.createElement('p');p.textContent=l;box.appendChild(p);}
  const p=document.createElement('p');p.className='sub';p.textContent='Saberes: '+saberesCount()+'/4 · etapas concluídas: '+Object.keys(G.learn).length+' de '+DESAFIOS.length+' · segredos: '+secCount()+'/12.';box.appendChild(p);
  G.mode='fim';mostrarTela('fim');focoPrimeiro('fim');salvar(false);
  if(primeira)addDiary('saber_tudo',true);
}
