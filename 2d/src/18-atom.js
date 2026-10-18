/* ====================== Tumba do Reator (Atompunk) · saber: Decisões ======================
   Salão de controle com célula de energia → sala do canal (a válvula verde drena e a laranja enche; com a água baixa os
   pontões assentam e viram passarela; zonas verdes de radiação ferem quem fica parado; o Robô atômico acorda com
   passos apressados, proximidade ou o barulho da bomba) → Sala do Reator (sensores de energia e de nível, comporta,
   carregador, portão de manutenção e dreno) → câmara do Núcleo atômico.
   Adaptação do 3D: a água subia e descia levando plataformas por cima de vãos; aqui o nível decide se os pontões formam
   a passarela sobre o canal, visto de cima. */
Object.assign(OBJS,{
  celula(aceso,f){const c=cnv(18,28),g=ctx2(c);P.r(g,3,22,12,5,'#9a968a');P.r(g,4,4,10,19,'#e9e4d4');P.r(g,6,6,6,15,aceso?(f?'#5dff7a':'#9aff9a'):'#2a3a2a');P.r(g,5,2,8,3,'#cfc9b4');P.r(g,7,0,4,2,'#ff9a3a');return contorno(c,'#0b0705');},
  valvula(cor,f){const c=cnv(18,22),g=ctx2(c);P.r(g,7,8,4,13,'#9a968a');P.r(g,3,18,12,3,'#7a7668');const a=f*0.8;P.anel(g,9,7,6,2,cor);for(let k=0;k<4;k++){const b=a+k*Math.PI/2;P.p(g,Math.round(9+Math.cos(b)*4),Math.round(7+Math.sin(b)*4),cor);}P.circ(g,9,7,1.5,'#ffffff');return contorno(c,'#0b0705');},
  pontao(){const c=cnv(16,12),g=ctx2(c);P.r(g,1,2,14,8,'#ff9a3a');P.r(g,1,2,14,2,'#ffc080');P.r(g,1,9,14,2,'#9a5a1a');P.r(g,6,4,4,4,'#e9e4d4');return contorno(c,'#0b0705');},
  reator(f,cor){cor=cor||'#5dff7a';const c=cnv(64,64),g=ctx2(c);P.elip(g,32,54,28,8,'#9a968a');P.r(g,10,18,44,36,'#e9e4d4');P.r(g,10,18,10,36,'#ffffff');P.r(g,46,18,8,36,'#cfc9b4');
    P.r(g,8,30,48,4,'#ff9a3a');P.elip(g,32,18,22,7,'#cfc9b4');P.circ(g,32,36,8,tom(cor,-0.7));P.circ(g,32,36,6-(f%2),cor);P.circ(g,32,36,3,tom(cor,0.7));
    for(let k=0;k<3;k++)P.anel(g,32,36,12+k*0.5,1,'#3a6a3a');P.r(g,28,2,8,16,'#9a968a');P.r(g,30,0,4,4,'#5dff7a');return contorno(c,'#0b0705');},
  bateria(n){const c=cnv(22,40),g=ctx2(c);P.r(g,3,4,16,34,'#33373f');P.r(g,8,1,6,4,'#5a606c');P.r(g,5,6,12,30,'#0f1a12');
    for(let i=0;i<10;i++){const on=i<n;P.r(g,6,33-i*3,10,2,on?(n>=5?'#5dff7a':'#ffd24a'):'#1e2a20');}return contorno(c,'#0b0705');},
  comporta(ab){const c=cnv(36,40),g=ctx2(c);P.r(g,0,0,4,40,'#cfc9b4');P.r(g,32,0,4,40,'#cfc9b4');const h=Math.round(34*(1-ab));
    if(ab>0){P.r(g,4,6+h,28,34-h,'#3a86a8');for(let y=8+h;y<40;y+=4)P.r(g,6+(y%8),y,8,1,'#8fd6e8');}
    P.r(g,4,4,28,h+2,'#e9e4d4');for(let y=6;y<h+4;y+=5)P.r(g,4,y,28,1,'#b8b2a0');P.r(g,4,h+4,28,2,'#ff9a3a');P.r(g,0,0,36,4,'#9a968a');return contorno(c,'#0b0705');},
  carregador(on,f){const c=cnv(26,30),g=ctx2(c);P.r(g,2,8,22,20,'#cfc9b4');P.r(g,2,8,22,3,'#ffffff');P.r(g,6,13,14,8,'#1a2a1a');
    if(on){P.r(g,7,14,((f%4)+1)*3,6,'#ffd24a');}P.r(g,10,1,6,8,'#9a968a');P.r(g,12,0,2,2,on?'#ffd24a':'#5a5a50');P.linha(g,8,24,18,24,on?'#ffd24a':'#5a5a50');return contorno(c,'#0b0705');},
  tanque(nivel){const c=cnv(24,44),g=ctx2(c);P.r(g,2,2,20,40,'#9a968a');P.r(g,5,5,14,34,'#0a1a14');const h=Math.round(34*nivel/8);P.r(g,5,39-h,14,h,'#3a86a8');P.r(g,5,39-h,14,1,'#8fd6e8');
    for(let i=1;i<8;i++)P.r(g,17,39-Math.round(34*i/8),2,1,i===4?'#ff5a3a':'#cfc9b4');return contorno(c,'#0b0705');},
  portaoManut(ab){const c=cnv(32,30),g=ctx2(c);P.r(g,0,0,32,4,'#9a968a');if(ab<1){const h=Math.round(26*(1-ab));P.r(g,2,4,28,h,'#e9e4d4');P.r(g,2,4,28,2,'#ff9a3a');for(let x=6;x<28;x+=6)P.r(g,x,6,2,h-2,'#cfc9b4');}return contorno(c,'#0b0705');},
  dreno(on,f){const c=cnv(20,16),g=ctx2(c);P.r(g,2,4,16,8,'#7a7668');P.r(g,2,4,16,2,'#9a968a');P.circ(g,10,8,3,'#2a2a28');if(on){P.r(g,8,12,4,4,'#3a86a8');P.p(g,9+(f%2),14,'#8fd6e8');}return contorno(c,'#0b0705');},
  ventilador(f,on){const c=cnv(30,32),g=ctx2(c);P.r(g,13,20,4,10,'#9a968a');P.r(g,8,29,14,3,'#7a7668');P.circ(g,15,13,12,'#cfc9b4');P.circ(g,15,13,10,'#2a3a2a');
    const a=on?f*0.7:0.3;for(let k=0;k<3;k++){const b=a+k*TAU/3;for(let r=2;r<9;r++)P.r(g,Math.round(15+Math.cos(b)*r)-1,Math.round(13+Math.sin(b)*r)-1,2,2,on?'#e9e4d4':'#9a968a');}P.circ(g,15,13,2,'#ff9a3a');return contorno(c,'#0b0705');},
  luzStatus(on){const c=cnv(12,20),g=ctx2(c);P.r(g,5,8,2,11,'#9a968a');P.r(g,2,17,8,3,'#7a7668');P.circ(g,6,5,4.5,'#33373f');P.circ(g,6,5,3,on?'#5dff7a':'#1e2a20');if(on)P.p(g,5,3,'#e8ffe8');return contorno(c,'#0b0705');},
  painelAtom(f){const c=cnv(22,24),g=ctx2(c);P.r(g,2,8,18,14,'#cfc9b4');P.r(g,2,8,18,2,'#ffffff');P.r(g,4,2,14,8,'#1a2a1a');P.r(g,5,3,12,6,'#0f1a12');P.r(g,6,5,4+(f%2)*4,2,'#5dff7a');P.circ(g,8,15,2,'#ff9a3a');P.circ(g,14,15,2,'#5dff7a');return contorno(c,'#0b0705');}
});
const MAPA_ATOM=[
  '##############################',
  '##############################',
  '###########........###########',
  '###########........###########',
  '###########........###########',
  '##############..##############',
  '####......................####',
  '####......................####',
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
  '###~~~~~~~~~~~~~~~~~~~~~~~~###',
  '###~~~~~~~~~~~~~~~~~~~~~~~~###',
  '###~~~~~~~~~~~~~~~~~~~~~~~~###',
  '###........................###',
  '###...rrrr.........rrrr....###',
  '###...rrrr.........rrrr....###',
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
CONSTRUIR.atom=function(){
  const A=tumbaArea('atom','atom',MAPA_ATOM,{'#':'parede','.':'chao','~':'agua',r:'rad'});
  A.som='atom';A.spawn={x:15*16,y:30*16+8,dir:'cima'};
  for(let x=4;x<26;x++)A.set(x,11,'chao2');
  saidaVale(A,14,31);
  pontoEnergia(A,9,28,'celula','a célula de energia','atom_enter');
  for(const[x,y]of[[8,26],[21,26],[5,15],[24,15],[6,5],[23,5],[12,1],[17,1]])lampada(A,x,y,'#9aff9a',42);
  /* canal: nível alto (8) ou baixo (2); com a água baixa os pontões formam a passarela na coluna 14–15 */
  const canal={nivel:8,alvo:8,bomba:0};
  const pontoes=[];for(let y=18;y<=20;y++)for(const x of[14,15])pontoes.push({tx:x,ty:y});
  const assentado=()=>canal.nivel<3;
  A.cobre=(x,y)=>{if(!assentado())return false;const tx=Math.floor(x/16),ty=Math.floor(y/16);return pontoes.some(p=>p.tx===tx&&p.ty===ty);};
  const valv=(tx,ty,cor,nome,alvo)=>{const o=objeto(A,SPR.get('valvula',cor,0),tx*16+8,ty*16+14,{col:[-6,-4,6,0]});o.desenho=(g,ob,t)=>blit(g,SPR.get('valvula',cor,canal.bomba>0?Math.floor(t*8)%4:0),ob.x,ob.y,ob.ax,ob.ay);
    interacao(A,{x:tx*16+8,y:ty*16+20,r:22,label:()=>nome,use:()=>{canal.alvo=alvo;canal.bomba=1.6;SFX.valve();SFX.pump();addDiary('atom_water',true);toast(alvo<5?'A água do canal está baixando: os pontões vão assentar no fundo.':'A água do canal está subindo.');}});};
  valv(6,25,'#5dff7a','Válvula verde (drenar o canal)',2);valv(23,25,'#ff9a3a','Válvula laranja (encher o canal)',8);
  guardiao(A,{tx:22,ty:16,sala:[3,16,27,26],spr:(ac,f)=>sprRoboAtom(ac,f),msg:TXT.hit.bot,diario:'atom_guard',vel:50,ouve:()=>canal.bomba>0});
  /* Sala do Reator */
  /* a cor do núcleo mostra a temperatura (vermelho ≥ 80, laranja ≥ 50, verde abaixo) e muda com resfriar/ventilar */
  const corNucleo=()=>{if(est.temperatura===null)return'#5dff7a';if(est.manter)return'#5dff7a';let t=est.temperatura-(est.resfriar?40:0)-(est.ventilar?20:0);return t>=80?'#ff5a3a':t>=50?'#ffb43a':'#5dff7a';};
  {const M={abrir:[20*16,10*16-44],carregar:[9*16+8,10*16-30],portao:[20*16,14*16-30],drenar:[24*16,14*16-22],resfriar:[14*16+8,10*16-68],ventilar:[11*16,12*16-14],manter:[17*16+8,9*16-26]};
    A.focoEvento=ev=>{const m=ev.cmd&&M[ev.cmd];return m?{x:m[0],y:m[1]}:null;};}
  objeto(A,SPR.get('reator',0),14*16+8,10*16,{col:[-24,-20,24,0]}).desenho=(g,ob,t)=>{blit(g,SPR.get('reator',Math.floor(t*4)%2,corNucleo()),ob.x,ob.y,32,64);if(mostrar('temperatura'))etiqueta(g,ob.x,ob.y-70,'temperatura '+est.temperatura,corNucleo());};
  objeto(A,SPR.get('ventilador',0,false),11*16,12*16+12,{col:[-12,-6,12,0]}).desenho=(g,ob,t)=>blit(g,SPR.get('ventilador',Math.floor(t*12)%9,est.ventilar),ob.x,ob.y,15,32);
  objeto(A,SPR.get('luzStatus',false),17*16+8,9*16,{col:[-4,-3,4,0]}).desenho=(g,ob)=>blit(g,SPR.get('luzStatus',est.manter),ob.x,ob.y,6,20);
  const foco={x:14*16+8,y:10*16};A.focoPainel=foco;
  terminal(A,14,13,'atom',foco,'painelAtom','Usar o painel do reator');
  criarLume(A,17.5,12.5,'atom');
  tochasProgresso(A,'atom',[[9,14],[10.5,14],[12,14],[17,14],[18.5,14],[20,14]],'#9aff9a');
  placaPista(A,'atom',6*16+8,13*16+14,{cor:'#9aff9a'});
  marcaLuz(A,'atom_primeiro',11,26);marcaLuz(A,'atom_resto',9,15);
  /* estado visível das máquinas (vem da execução ou da situação escolhida) */
  const est={comporta:0,carregador:false,portao:0,dreno:false,energia:7,nivel:2,temperatura:null,resfriar:false,ventilar:false,manter:false,cfg:null};
  objeto(A,SPR.get('bateria',7),7*16,10*16,{col:[-10,-6,10,0]}).desenho=(g,ob)=>{blit(g,SPR.get('bateria',est.energia),ob.x,ob.y,11,40);if(mostrar('energia'))etiqueta(g,ob.x,ob.y-44,'energia '+est.energia,'#5dff7a');};
  objeto(A,SPR.get('carregador',false,0),9*16+8,10*16,{col:[-12,-6,12,0]}).desenho=(g,ob,t)=>blit(g,SPR.get('carregador',est.carregador,Math.floor(t*6)%4),ob.x,ob.y,13,30);
  objeto(A,SPR.get('comporta',0),20*16,10*16,{col:[-18,-6,18,0]}).desenho=(g,ob)=>{blit(g,SPR.get('comporta',Math.round(est.comporta*8)/8),ob.x,ob.y,18,40);};
  objeto(A,SPR.get('tanque',2),23*16+8,10*16,{col:[-12,-6,12,0]}).desenho=(g,ob)=>{blit(g,SPR.get('tanque',Math.round(est.nivel)),ob.x,ob.y,12,44);if(mostrar('nivel'))etiqueta(g,ob.x,ob.y-48,'nivel '+Math.round(est.nivel),'#8fd6e8');};
  objeto(A,SPR.get('portaoManut',0),20*16,14*16+8,{col:[-16,-6,16,0]}).desenho=(g,ob)=>blit(g,SPR.get('portaoManut',Math.round(est.portao*6)/6),ob.x,ob.y,16,30);
  objeto(A,SPR.get('dreno',false,0),24*16,14*16,{}).desenho=(g,ob,t)=>blit(g,SPR.get('dreno',est.dreno,Math.floor(t*6)%2),ob.x,ob.y,10,16);
  const mostrar=n=>est.cfg&&(est.cfg.sensores||[]).some(s=>s.nome===n);
  portao(A,14,5,2,'portaoManut',()=>saberOk('atom'));
  pedestal(A,14,3,'atom');
  A.update=(dt,t)=>{
    if(canal.bomba>0)canal.bomba-=dt;
    canal.nivel+=Math.sign(canal.alvo-canal.nivel)*Math.min(Math.abs(canal.alvo-canal.nivel),dt*3);
    /* radiação: fere quem fica parado nela */
    const p=G.p;if(G.mode==='play'&&A.kind(Math.floor(p.x/16),Math.floor(p.y/16))==='rad'){A.radT=(A.radT||0)+dt;if(A.radT>1.8){A.radT=0;ferir(TXT.hit.rad);addDiary('atom_rad');}if(Math.random()<dt*12)AU.geiger=8;}else{A.radT=0;AU.geiger=1.2;}
    /* máquinas do painel */
    let vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;if(vis&&vis.cfg.mundo!=='reator')vis=null;
    const c=vis?vis.cfg:(desafiosDa('atom').find(d=>!G.learn[d.id])||DESAFIO.a2),ws=vis?vis.ws:MUNDOS.reator.init(c.situacoes[0]);
    est.cfg=c;const q=Math.min(1,dt*3);
    est.temperatura=ws.temperatura!==undefined?ws.temperatura:null;est.resfriar=!!ws.resfriar;est.ventilar=!!ws.ventilar;est.manter=!!ws.manter;
    if(est.resfriar&&Math.random()<dt*30){const a=Math.random()*TAU;particula({x:14*16+8+Math.cos(a)*22,y:10*16-30+Math.sin(a)*8,z:10,vz:-20,vx:-Math.cos(a)*10,vida:0.6,cores:['#bfeeff','#6fd3ff','#ffffff'],fade:true});}
    if(est.ventilar&&Math.random()<dt*10)vapor(14*16+8+(Math.random()-0.5)*30,10*16-40,1,['#e9e4d4','#cfc9b4']);
    est.comporta+=((ws.comporta?1:0)-est.comporta)*q;est.portao+=((ws.portao?1:0)-est.portao)*q;est.carregador=!!ws.carregador;est.dreno=!!ws.dreno;
    if(ws.energia!==undefined)est.energia=ws.energia;
    const nAlvo=ws.nivel!==undefined?(ws.dreno?Math.max(1,ws.nivel-3):ws.nivel):2;est.nivel+=(nAlvo-est.nivel)*q;
  };
  A.desenharChao=(g,t)=>{
    /* água do canal: clara e agitada quando alta; escura com o fundo à vista quando baixa */
    const baixa=1-clamp((canal.nivel-2)/6,0,1);
    for(let ty=18;ty<=20;ty++)for(let tx=3;tx<27;tx++){const x=tx*16+R.ox,y=ty*16+R.oy;if(x<-16||y<-16||x>R.W||y>R.H)continue;g.globalAlpha=0.6*baixa;g.fillStyle='#0e2a2a';g.fillRect(x,y,16,16);g.globalAlpha=1;}
    for(const pt of pontoes){const off=assentado()?0:Math.round(Math.sin(t*1.5+pt.ty+pt.tx)*3)+(pt.tx===14?-10:10)*clamp((canal.nivel-3)/3,0,1);
      blit(g,SPR.get('pontao'),pt.tx*16+8+off,pt.ty*16+13+(assentado()?1:0),8,12);}
  };
  A.luzesExtra=t=>{luz(14*16+8,8*16,PAINEL.aberto&&PAINEL.area===A?110:52,1,corNucleo());if(est.manter)luz(17*16+8,8*16,24,1,'#5dff7a');for(const[x,y]of[[7,23],[21,23]])luz(x*16,y*16,30,0.7,'#5dff7a');};
  A.reiniciar=()=>{reiniciarGuardas(A);for(const pt of A.pontos)pt.aceso=false;canal.nivel=canal.alvo=8;addDiary('atom_enter',true);};
  A.objetivo=()=>{if(G.p.y>21*16&&!assentado())return{t:'Saber: Decisões',s:'O canal está cheio. Use a válvula verde para drenar e atravesse pelos pontões.',alvo:{x:6*16+8,y:25*16-12,txt:'Drenar o canal'}};return objetivoTumba('atom','No painel do reator');};
  A.aoEvento=(ev)=>{const a=ev.anim||{};if(a.comporta||a.portao)SFX.gate();if(a.carregador)SFX.sensor();if(a.dreno||a.resfriar)SFX.agua();if(a.ventilar)SFX.rotate();if(a.manter)SFX.sensor();if(a.falha||ev.tipo==='erro'){SFX.deny();R.treme=0.25;}if(ev.tipo==='se')faiscas(14*16+8,9*16,8,ev.res?['#5dff7a','#ffffff']:['#ff9a3a','#ffffff']);};
  A.aoConcluir=(cfg)=>{if(saberOk('atom'))setTimeout(()=>toast('O reator estabilizou: o portão da câmara do Núcleo atômico se abriu.','good'),600);};
  return A;
};
/* rótulo em pixels com fundo escuro, para valores no mundo */
/* rótulo do cenário com caixa; devolve o topo da caixa (em coordenadas do mundo) para empilhar outro rótulo acima */
function etiqueta(g,x,y,txt,cor,fundo){const Y=Math.round(y+R.oy)-1,h=FONTE.caixa(g,txt,Math.round(x+R.ox),Y,cor||'#ffffff',fundo);return Y+6-h-R.oy;}
