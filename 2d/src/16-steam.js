/* ====================== Tumba das Engrenagens (Steampunk) · saber: Sequência ======================
   Salão com caldeira → corredor dos pistões (descem quando a luz de aviso acende) → salão do Autômato de latão
   (dorme; acorda com passos apressados ou proximidade) → ponte de placas sobre o fosso (só as placas com o olho aguentam)
   → Oficina do Autômato com o Computador Ancestral e o tabuleiro → câmara da Engrenagem-mestra.
   Adaptação do 3D: os pistões subiam e desciam como plataformas sobre um vão; aqui eles descem sobre o corredor em ritmo,
   e a ponte de placas é um fosso visto de cima (sem pulo: as placas boas formam o caminho). */
Object.assign(OBJS,{
  caldeira(aceso,f){const c=cnv(26,30),g=ctx2(c);P.r(g,3,8,20,20,'#7a4a2a');P.r(g,3,8,6,20,'#9a6236');P.r(g,19,8,4,20,'#5a3420');for(const y of[11,19,26])P.r(g,2,y,22,2,'#d8a24a');
    P.r(g,9,1,6,8,'#5a3420');P.r(g,8,0,8,2,'#3a2414');P.circ(g,13,18,4,'#2a1a10');if(aceso){P.circ(g,13,18,3,f?'#ff9a3a':'#ffb43a');P.circ(g,13,18,1.5,'#fff2a0');}
    P.circ(g,20,13,2.5,'#e9dcbc');P.p(g,20,12,'#3a2414');return contorno(c,'#0b0705');},
  pistao(est){const c=cnv(16,22),g=ctx2(c);const y0=est===2?6:0;
    P.r(g,1,y0+2,14,est===2?14:8,'#6a4a32');P.r(g,1,y0+2,14,2,'#9a7050');P.r(g,3,y0+4,10,1,'#3a2414');
    if(est!==2){P.r(g,6,y0+10,4,10,'#b8b0a0');P.r(g,6,y0+10,1,10,'#e8e0d0');}
    P.r(g,12,y0,3,3,est===1?'#ff4a3a':'#5a2a1a');if(est===1)P.p(g,13,y0+1,'#ffd0c0');
    return contorno(c,'#0b0705');},
  placa(tipo,est){const c=cnv(16,18),g=ctx2(c);if(est===2)return c;
    const C=tipo==='olho'?'#8a6a44':'#7a6450';P.r(g,0,0,16,14,C);P.r(g,0,0,16,2,tom(C,0.2));P.r(g,0,14,16,4,tom(C,-0.4));
    if(tipo==='olho'){P.elip(g,8,7,5,3,'#d8a24a');P.elip(g,8,7,3,1.6,'#fff6dc');P.circ(g,8,7,1,'#24160d');}
    else for(const[x,y]of[[2,2],[13,2],[2,11],[13,11]])P.p(g,x,y,'#5a4a3a');
    if(est===1){P.linha(g,2,3,9,11,'#24160d');P.linha(g,9,11,14,6,'#24160d');}
    return c;},
  computador(f){
    const c=cnv(120,58),g=ctx2(c);
    P.r(g,4,10,112,46,'#6a5a48');P.r(g,4,10,112,4,'#8a7a62');P.r(g,8,16,104,36,'#4a3e30');
    for(let i=0;i<5;i++)P.engrenagem(g,16+i*22,26,8,10,'#c8743a','#7a4a2a',2);
    const a=f%2;P.engrenagem(g,16+a,26,8,10,'#d8a24a','#7a4a2a',2);
    P.r(g,10,40,100,10,'#2a2018');for(let i=0;i<10;i++){P.r(g,13+i*10,42,7,6,i%2?'#c8743a':'#8a5a32');P.p(g,15+i*10,44,'#ffe9a0');}
    P.r(g,40,2,40,10,'#8a7a62');P.r(g,44,4,32,6,'#2a2018');P.r(g,46+((f*6)%26),6,4,2,'#ffb455');
    P.r(g,0,50,120,8,'#5a4a3a');return contorno(c,'#0b0705');
  },
  alavancaSteam(f){const c=cnv(18,26),g=ctx2(c);P.r(g,2,14,14,10,'#6a5a48');P.r(g,2,14,14,2,'#8a7a62');P.r(g,5,17,8,4,'#2a2018');P.p(g,6+f*3,18,'#ffb455');
    P.linha(g,9,15,4,3,'#8a6a3a');P.linha(g,10,15,5,3,'#8a6a3a');P.circ(g,4,3,2.5,'#c8743a');return contorno(c,'#0b0705');},
  portaoBronze(larg,est){const w=larg*16,c=cnv(w,30),g=ctx2(c);if(est===2){P.r(g,0,0,w,4,'#5a3420');return c;}
    const h=est===1?16:28;P.r(g,0,30-h,w,h,'#b07a3a');for(let x=2;x<w;x+=5)P.r(g,x,30-h,2,h,'#7a4a2a');P.r(g,0,30-h,w,3,'#d8a24a');P.engrenagem(g,w/2,30-h/2,5,8,'#d8a24a','#7a4a2a',1.5);return contorno(c,'#0b0705');},
  engrParede(f){const c=cnv(20,20),g=ctx2(c);P.engrenagem(g,10,10,8,10,'#8a6a3a','#5a4424',2);const a=f*0.5;P.r(g,Math.round(10+Math.cos(a)*5),Math.round(10+Math.sin(a)*5),2,2,'#d8a24a');return contorno(c,'#0b0705');},
  canos(){const c=cnv(30,12),g=ctx2(c);P.r(g,0,2,30,4,'#8a5028');P.r(g,0,2,30,1,'#b07a3a');P.r(g,0,7,30,3,'#7a4a2a');for(const x of[6,20])P.r(g,x,1,3,10,'#d8a24a');return contorno(c,'#0b0705');},
  tabPedra(){const c=cnv(16,20),g=ctx2(c);P.r(g,1,2,14,14,'#8a7a62');P.r(g,1,2,14,3,'#bfae8c');P.r(g,1,15,14,4,'#5a4a3a');P.p(g,5,8,'#6a5a48');P.p(g,10,11,'#6a5a48');return contorno(c,'#0b0705');}
});

const MAPA_STEAM=[
  '############################',
  '############################',
  '##########........##########',
  '##########........##########',
  '##########........##########',
  '##########........##########',
  '#############..#############',
  '#######..............#######',
  '#######..............#######',
  '#######..............#######',
  '#######..,,,,,.......#######',
  '#######..,,,,,.......#######',
  '#######..,,,,,.......#######',
  '#######..,,,,,.......#######',
  '#######..,,,,,.......#######',
  '#######..............#######',
  '#############..#############',
  '######................######',
  '######xxxxxxxoxxxxxxxx######',
  '######xxxxxxxoxxxxxvvv######',
  '######xvvoooooxxvvxxxx######',
  '######xxxovxxxxxxvvxxx######',
  '######xxxooooooxxxxxxx######',
  '######vvxxxxxxoxxxxvvx######',
  '######xxxxxxxxoxxxxxxx######',
  '######................######',
  '#############..#############',
  '#####..................#####',
  '#####..................#####',
  '#####..................#####',
  '#####..................#####',
  '#####..................#####',
  '#####..................#####',
  '#####..................#####',
  '#############..#############',
  '##########........##########',
  '##########pppppppp##########',
  '##########........##########',
  '##########pppppppp##########',
  '##########........##########',
  '##########pppppppp##########',
  '##########........##########',
  '#############..#############',
  '########............########',
  '########............########',
  '########............########',
  '########............########',
  '########............########',
  '############################',
  '############################'
];
const TAB={x:9,y:10,n:5};
CONSTRUIR.steam=function(){
  const placas=[],pistoes=[];
  const A=tumbaArea('steam','steam',MAPA_STEAM,{'#':'parede','.':'chao',',':'chao2',v:'vao',
    o:{k:'vao',f:(tx,ty)=>placas.push({tx,ty,tipo:'olho',est:0,t:0})},x:{k:'vao',f:(tx,ty)=>placas.push({tx,ty,tipo:'simples',est:0,t:0})},
    p:{k:'chao',f:(tx,ty)=>pistoes.push({tx,ty,linha:ty})}});
  A.metal=true;A.som='steam';A.spawn={x:14*16,y:46*16+8,dir:'cima'};
  saidaVale(A,13,47);
  pontoEnergia(A,10,44,'caldeira','a caldeira','steam_enter');
  pontoEnergia(A,7,28,'caldeira','a caldeira',null);
  for(const[x,y]of[[9,42],[18,42],[11,34],[16,34],[6,26],[21,26],[7,16],[20,16],[8,6],[19,6],[11,1],[16,1]])lampada(A,x,y,'#ffb455',44);
  for(const[x,y]of[[12,42],[7,34],[20,34]]){const o=objeto(A,SPR.get('canos'),x*16+8,y*16+12,{});}
  for(const[x,y]of[[6,15],[21,15],[10,25],[17,25]]){const o=objeto(A,SPR.get('engrParede',0),x*16+8,y*16+14,{});o.frames=[0,1,2,3,4,5,6,7,8,9,10,11].map(f=>SPR.get('engrParede',f));o.fps=6;}
  /* pistões: cada linha desce em ritmo, com a luz de aviso antes */
  const PER=3.0,linhas=[36,38,40];
  const estadoPistao=(ty,t)=>{const k=linhas.indexOf(ty),u=((t+k*1.0)%PER+PER)%PER;return u<1.8?0:u<2.4?1:2;};
  for(const p of pistoes){const o=objeto(A,SPR.get('pistao',0),p.tx*16+8,p.ty*16+16,{camada:-6});o.desenho=(g,ob,t)=>blit(g,SPR.get('pistao',estadoPistao(p.ty,A.relogio)),ob.x,ob.y,ob.ax,ob.ay);}
  /* placas da ponte: decalque por cima do fosso; cobrem o vão enquanto inteiras */
  for(const pl of placas){const o=objeto(A,SPR.get('placa',pl.tipo,0),pl.tx*16+8,pl.ty*16+14,{camada:-30});o.ay=14;o.desenho=(g,ob)=>blit(g,SPR.get('placa',pl.tipo,pl.est),ob.x,ob.y,8,14);}
  const placaEm=(x,y)=>{const tx=Math.floor(x/16),ty=Math.floor(y/16);return placas.find(p=>p.tx===tx&&p.ty===ty);};
  A.cobre=(x,y)=>{const p=placaEm(x,y);return!!p&&p.est<2;};
  /* Autômato de latão */
  guardiao(A,{tx:19,ty:30,sala:[5,27,23,34],spr:(ac,f)=>sprAutomato(ac,f),msg:TXT.hit.automato,diario:'automato',vel:58});
  /* Oficina: Computador Ancestral, tabuleiro e alavanca */
  objeto(A,SPR.get('computador',0),14*16,10*16-2,{col:[-60,-24,60,-2]}).desenho=(g,ob,t)=>blit(g,SPR.get('computador',Math.floor(t*2)%2),ob.x,ob.y,60,58);
  A.lampadas.push({x:14*16,y:8*16,r:40,cor:'#ffb455'});
  const foco={x:12*16,y:11*16+8};A.focoPainel=foco;
  A.luzesExtra=t=>{if(PAINEL.aberto&&PAINEL.area===A){luz(TAB.x*16+40,TAB.y*16+40,64,1,'#ffd890');luz(14*16,8*16,44,0.9,'#ffb455');}};
  terminal(A,17,12,'steam',foco,'alavancaSteam','Usar o Computador Ancestral');
  interacao(A,{x:14*16,y:10*16+6,r:30,alto:44,label:()=>'Ler a placa do Computador Ancestral',use:()=>{addDiary('oficina_steam');toast('As placas são lidas de cima para baixo, uma de cada vez. O autômato cumpre exatamente o que elas mandam: nem mais, nem menos. Use a alavanca ao lado.');}});
  /* portão de bronze da câmara: abre com o saber da Sequência */
  portao(A,13,6,2,'portaoBronze',()=>saberOk('steam'));
  pedestal(A,13,3,'steam');
  /* atualização: pistões ferem, placas cedem */
  A.relogio=0;
  A.update=(dt,t)=>{
    if(G.mode==='play')A.relogio+=dt;
    const p=G.p;
    if(G.mode==='play'&&!p.caindo){
      const tx=Math.floor(p.x/16),ty=Math.floor(p.y/16);
      if(linhas.indexOf(ty)>=0&&tx>=10&&tx<=17&&estadoPistao(ty,A.relogio)===2&&G.invuln<=0){ferir(TXT.fall.piston);moverCorpo(A,p,0,ty*16+16+6-p.y);SFX.piston();}
      const pl=placaEm(p.x,p.y);
      if(pl&&pl.tipo==='simples'&&pl.est===0){pl.est=1;pl.t=0;SFX.crack();if(!A.avisouPlaca){A.avisouPlaca=true;addDiary('steam_floor');}}
    }
    for(const pl of placas){if(pl.est===1){pl.t+=dt;if(pl.t>0.18){pl.est=2;pl.t=0;poeira(pl.tx*16+8,pl.ty*16+8,4,'#8a7a62');}}else if(pl.est===2){pl.t+=dt;if(pl.t>3&&!(Math.floor(p.x/16)===pl.tx&&Math.floor(p.y/16)===pl.ty)){pl.est=0;}}}
    for(const lv of linhas)if(estadoPistao(lv,A.relogio)===2&&estadoPistao(lv,A.relogio-dt)!==2&&Math.abs(G.p.y-lv*16)<200)SFX.piston();
    if(Math.random()<dt*1.5)vapor(14*16+(Math.random()-0.5)*90,8*16,1);
  };
  A.reiniciar=()=>{for(const pl of placas){pl.est=0;pl.t=0;}reiniciarGuardas(A);for(const pt of A.pontos)pt.aceso=false;addDiary('steam_enter',true);};
  A.objetivo=()=>{const o=objetivoTumba('steam','No Computador Ancestral (Oficina do Autômato, ao norte)');return o;};
  /* tabuleiro: desenha o percurso da etapa (a da execução, ou a próxima a fazer) */
  A.desenharChao=(g,t)=>desenharTabuleiro(A,g,t);
  A.aoEvento=(ev)=>{
    const a=ev.anim||{};
    if(a.anda)SFX.piston();if(a.bate||ev.tipo==='erro'){SFX.deny();R.treme=0.25;}
    if(a.ativa){SFX.gate();const c=tabCelula(painelVis().cfg,painelVis().ws.x,painelVis().ws.y);faiscas(c.x+8,c.y+8,14);}
  };
  A.aoConcluir=(cfg)=>{if(cfg.id==='s2'){R.treme=0.6;setTimeout(()=>toast('Um estrondo ao norte: o portão de bronze da câmara se abriu.','good'),700);}};
  return A;
};
/* posição de uma casa do percurso no chão da oficina (o percurso fica centralizado embaixo no tabuleiro 5×5) */
function tabCelula(cfg,x,y){const sit=(cfg&&cfg.situacoes[0])||{grid:['.']},gr=sit.grid,w=gr[0].length,h=gr.length;const ox=Math.floor((TAB.n-w)/2),oy=TAB.n-h;return{x:(TAB.x+ox+x)*16,y:(TAB.y+oy+y)*16};}
function desenharTabuleiro(A,g,t){
  let vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;if(vis&&vis.cfg.mundo!=='grade')vis=null;
  if(!vis){const c=desafiosDa('steam').find(d=>!G.learn[d.id])||DESAFIO.s2;vis={cfg:c,ws:MUNDOS.grade.init(c.situacoes[0]),ev:null,t:1};}
  const cfg=vis.cfg,ws=vis.ws;if(!ws||!ws.grid)return;
  const gr=ws.grid,w=gr[0].length,h=gr.length;
  /* casas ativas um pouco mais claras, com borda de latão */
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=tabCelula(cfg,x,y),px=c.x+R.ox,py=c.y+R.oy;
    g.fillStyle='rgba(255,220,150,0.10)';g.fillRect(px+1,py+1,14,14);g.fillStyle='#d8a24a';g.fillRect(px,py,16,1);g.fillRect(px,py,1,16);
    const k=gr[y][x];if(k==='G'){const on=ws.ativo;P.circ(g,px+8,py+8,6,on?'#fff2a0':'#d8a24a');P.circ(g,px+8,py+8,4,on?'#ffffff':'#ffd24a');P.anel(g,px+8,py+8,6,1,'#7a4a2a');if(on&&Math.floor(t*6)%2)P.circ(g,px+8,py+8,7,'rgba(255,240,160,0.4)');}}
  /* rastro do caminho percorrido */
  if(ws.rastro)for(const[x,y]of ws.rastro){const c=tabCelula(cfg,x,y);g.fillStyle='#ffb455';g.fillRect(c.x+R.ox+7,c.y+R.oy+7,2,2);}
  /* pedras e autômato entram na fila ordenada (ficam em pé) */
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(gr[y][x]==='#'){const c=tabCelula(cfg,x,y);enfileirar(c.y+15,gg=>blit(gg,SPR.get('tabPedra'),c.x+8,c.y+16,8,20));}
  let rx=ws.x,ry=ws.y,dir=ws.dir,dx=0,dy=0;
  const ev=vis.ev,u=vis.t===undefined?1:vis.t;
  if(ev&&ev.anim){
    if(ev.anim.anda&&u<1){rx=lerp(ev.anim.anda.de.x,ev.anim.anda.para.x,u);ry=lerp(ev.anim.anda.de.y,ev.anim.anda.para.y,u);}
    if(ev.anim.bate&&u<1){const b=Math.sin(u*Math.PI)*0.3;dx=(ev.anim.bate.x-ws.x)*b;dy=(ev.anim.bate.y-ws.y)*b;}
    if(ev.anim.gira!==undefined&&u<0.5)dir=(ev.anim.gira+3)%4;
  }
  const c=tabCelula(cfg,rx+dx,ry+dy);
  enfileirar(c.y+14,gg=>{sombra(gg,c.x+8,c.y+13,5,2);blit(gg,sprMiniCache(dir),c.x+8,c.y+14+Math.round(Math.sin(t*8)*0.6),7,14);
    /* seta grande mostrando para onde o autômato olha */
    const d=DIRS[dir],ax=Math.round(c.x+8+d[0]*9+R.ox),ay=Math.round(c.y+7+d[1]*9+R.oy);gg.fillStyle='#ff5a2a';gg.fillRect(ax-1,ay-1,3,3);gg.fillStyle='#ffe9a0';gg.fillRect(ax,ay,1,1);});
}
const MINI={};function sprMiniCache(d){if(!MINI[d])MINI[d]=sprMiniAutomato(d);return MINI[d];}
