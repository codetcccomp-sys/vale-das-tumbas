/* ====================== Tumba dos Motores (Dieselpunk) · saber: Dados e variáveis ======================
   Garagem com gerador → sala dos holofotes (cada toque gira o facho 1/8 de volta; quando a luz alcança o sensor da parede,
   a porta da oficina abre; o Robô-vigia patrulha varrendo o facho dele, e os pilares escondem) → Oficina dos contêineres
   (variáveis com nome, tipo e valor, ligadas à separadora de peças e ao monta-cargas) → câmara da Vela de ignição.
   Adaptação do 3D: o elevador de carga virou o monta-cargas da oficina, controlado pelos contêineres. */
Object.assign(OBJS,{
  gerador(aceso,f){const c=cnv(28,28),g=ctx2(c);P.r(g,2,8,24,18,'#4a505c');P.r(g,2,8,24,3,'#6a707c');for(let x=5;x<24;x+=4)P.r(g,x,12,2,10,'#33373f');
    P.r(g,18,2,6,8,'#3a3f48');P.circ(g,9,17,3.5,aceso?(f?'#ffd24a':'#ffe9a0'):'#2a2d33');P.r(g,20,14,4,3,aceso?'#5dff7a':'#5a2a1a');return contorno(c,'#0b0705');},
  holofote(d){const c=cnv(20,22),g=ctx2(c);P.r(g,6,14,8,7,'#3a3f48');P.r(g,8,10,4,5,'#4a505c');
    const a=d*TAU/8-Math.PI/2,cx=10,cy=9;P.circ(g,cx,cy,5,'#5a606c');P.r(g,Math.round(cx+Math.cos(a)*4)-2,Math.round(cy+Math.sin(a)*4)-2,4,4,'#fff6c0');P.p(g,Math.round(cx+Math.cos(a)*5),Math.round(cy+Math.sin(a)*5),'#ffffff');
    return contorno(c,'#0b0705');},
  sensor(on){const c=cnv(14,14),g=ctx2(c);P.r(g,1,1,12,12,'#33373f');P.circ(g,7,7,4,on?'#6fd3ff':'#1a2a3a');P.circ(g,7,7,2,on?'#ffffff':'#2a3a4a');return contorno(c,'#0b0705');},
  pilarAco(){const c=cnv(16,34),g=ctx2(c);P.r(g,2,4,12,28,'#4a505c');P.r(g,2,4,4,28,'#5a606c');P.r(g,1,1,14,4,'#3a3f48');P.r(g,1,30,14,3,'#3a3f48');for(let y=8;y<30;y+=6)P.r(g,6,y,6,1,'#33373f');return contorno(c,'#0b0705');},
  console(f){const c=cnv(22,24),g=ctx2(c);P.r(g,2,8,18,14,'#3a3f48');P.r(g,2,8,18,2,'#5a606c');P.r(g,4,2,14,8,'#22262c');P.r(g,5,3,12,6,f?'#1a3a4a':'#14303a');P.r(g,6,4,6,1,'#6fd3ff');P.r(g,6,6,9,1,'#6fd3ff');
    for(let i=0;i<4;i++)P.r(g,5+i*4,13,2,2,['#ff5a3a','#ffd24a','#5dff7a','#6fd3ff'][i]);return contorno(c,'#0b0705');},
  conteiner(larg){const c=cnv(30,40),g=ctx2(c);P.r(g,3,6,24,30,'#5a606c');P.r(g,3,6,24,3,'#7a828e');P.r(g,6,11,18,20,'#14202a');P.r(g,6,11,18,1,'#2a3a4a');
    P.r(g,1,34,28,4,'#3a3f48');P.r(g,12,1,6,6,'#4a505c');P.r(g,13,0,4,2,'#6a707c');return contorno(c,'#0b0705');},
  separadora(f){const c=cnv(52,40),g=ctx2(c);P.r(g,4,10,30,24,'#5a5040');P.r(g,4,10,30,3,'#7a6a52');P.r(g,10,2,18,10,'#4a4234');P.r(g,8,0,22,4,'#6a5a44');
    P.r(g,14,14+(f%2)*2,10,8,'#9a968a');P.r(g,34,26,18,8,'#2a2a2a');for(let x=35;x<51;x+=4)P.r(g,x+(f%2),27,2,6,'#4a4a4a');P.r(g,8,24,22,6,'#2a2018');return contorno(c,'#0b0705');},
  caixaLote(){const c=cnv(16,14),g=ctx2(c);P.r(g,1,3,14,10,'#9a6a32');P.r(g,1,3,14,2,'#c89a5a');P.r(g,1,7,14,1,'#7a5228');return contorno(c,'#0b0705');},
  montaCargas(nivel){const c=cnv(48,64),g=ctx2(c);P.r(g,2,0,4,62,'#4a505c');P.r(g,42,0,4,62,'#4a505c');for(let y=4;y<60;y+=8){P.r(g,2,y,4,1,'#6a707c');P.r(g,42,y,4,1,'#6a707c');}
    const y=40-Math.round(nivel*30);P.r(g,6,y,36,6,'#6a5a44');P.r(g,6,y,36,2,'#9a8a6a');for(let i=0;i<3;i++)P.r(g,9+i*11,y-8,9,8,'#a8783e'),P.r(g,9+i*11,y-8,9,1,'#c89a5a');
    P.r(g,20,0,8,4,'#3a3f48');P.linha(g,24,4,24,y,'#9a968a');P.r(g,0,58,48,6,'#33373f');return contorno(c,'#0b0705');},
  bancada(){const c=cnv(40,22),g=ctx2(c);P.r(g,1,6,38,8,'#6b4326');P.r(g,1,6,38,2,'#8a5a32');P.r(g,3,14,3,7,'#4a2c18');P.r(g,34,14,3,7,'#4a2c18');return contorno(c,'#0b0705');},
  portaoAco(larg,est){const w=larg*16,c=cnv(w,30),g=ctx2(c);if(est===2){P.r(g,0,0,w,3,'#33373f');return c;}const h=est===1?14:28;
    P.r(g,0,30-h,w,h,'#5a606c');for(let y=30-h;y<30;y+=4)P.r(g,0,y,w,1,'#3a3f48');P.r(g,0,30-h,w,2,'#c8a030');P.ponti(g,0,30-h,w,2,'#2a2a2a',0);return contorno(c,'#0b0705');},
  barril(){const c=cnv(14,18),g=ctx2(c);P.r(g,2,2,10,15,'#3a5a3a');P.r(g,2,2,3,15,'#4a7a4a');for(const y of[5,12])P.r(g,2,y,10,1,'#2a3a2a');P.elip(g,7,2,5,1.5,'#2a3a2a');return contorno(c,'#0b0705');},
  tanqueDiesel(n){const c=cnv(22,36),g=ctx2(c);P.r(g,2,4,18,30,'#4a505c');P.r(g,2,4,18,3,'#6a707c');P.r(g,5,8,12,22,'#14202a');const h=Math.round(22*clamp(n,0,4)/4);if(h>0){P.r(g,5,30-h,12,h,'#c8a030');P.r(g,5,30-h,12,1,'#ffe080');}
    for(let i=1;i<4;i++)P.r(g,15,30-Math.round(22*i/4),2,1,'#cfd8e0');P.r(g,8,0,6,5,'#3a3f48');return contorno(c,'#0b0705');},
  painelSenha(ok,f){const c=cnv(30,26),g=ctx2(c);P.r(g,2,2,26,18,'#3a3f48');P.r(g,2,2,26,2,'#5a606c');P.r(g,4,6,22,10,ok?'#0e2a14':'#14202a');P.r(g,13,20,4,5,'#3a3f48');
    P.circ(g,24,4,1.5,ok?'#5dff7a':(f%2?'#ff5a3a':'#5a2a1a'));return contorno(c,'#0b0705');},
  portinhola(ab){const c=cnv(26,30),g=ctx2(c);P.r(g,0,0,26,30,'#22252a');if(ab<1){const w=Math.round(22*(1-ab));P.r(g,2,2,w,26,'#5a606c');for(let y=4;y<28;y+=5)P.r(g,2,y,w,1,'#3a3f48');P.r(g,2+w-3,13,2,4,'#c8a030');}
    else{P.r(g,2,2,22,26,'#0b0d10');P.r(g,6,22,14,4,'#c8a030');}return contorno(c,'#0b0705');},
  motor(f){const c=cnv(34,26),g=ctx2(c);P.r(g,2,6,30,18,'#4a505c');P.r(g,2,6,30,3,'#6a707c');for(let x=6;x<30;x+=6)P.r(g,x,2+(f%2&&x%12===0?1:0),3,5,'#3a3f48');P.circ(g,10,16,4,'#2a2d33');P.circ(g,10,16,1.5,'#9a968a');return contorno(c,'#0b0705');}
});

const MAPA_DIESEL=[
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
  '#######................#######',
  '#######................#######',
  '#######................#######',
  '#######................#######',
  '#######................#######',
  '##############################',
  '##############################'
];
const HOLO={tx:8,ty:24,sensor:{tx:16,ty:15}};
CONSTRUIR.diesel=function(){
  const A=tumbaArea('diesel','diesel',MAPA_DIESEL,{'#':'parede','.':'chao'});
  A.metal=true;A.som='diesel';A.spawn={x:15*16,y:31*16+8,dir:'cima'};
  for(let x=5;x<25;x++)A.set(x,10,'chao2');for(let y=17;y<26;y+=4)for(let x=4;x<26;x+=7)A.set(x,y,'grade');
  saidaVale(A,14,32);
  pontoEnergia(A,9,29,'gerador','o gerador','diesel_enter');
  for(const[x,y]of[[8,27],[21,27],[6,15],[23,15],[6,5],[23,5],[12,1],[17,1]])lampada(A,x,y,'#cfe8ff',40);
  for(const[x,y]of[[19,30],[20,31]])objeto(A,SPR.get('barril'),x*16+8,y*16+14,{col:[-6,-4,6,0]});
  const mot=objeto(A,SPR.get('motor',0),11*16,32*16+4,{col:[-16,-8,16,0]});mot.frames=[0,1].map(f=>SPR.get('motor',f));mot.fps=8;
  /* holofote, sensor e pilares que fazem sombra */
  const holo={d:2};
  const sensorLigado=()=>G.abertas.indexOf('diesel_luz')>=0;
  const ho=objeto(A,SPR.get('holofote',2),HOLO.tx*16+8,HOLO.ty*16+14,{col:[-6,-4,6,0]});ho.desenho=(g,ob)=>blit(g,SPR.get('holofote',holo.d),ob.x,ob.y,ob.ax,ob.ay);
  const se=objeto(A,SPR.get('sensor',false),HOLO.sensor.tx*16+8,HOLO.sensor.ty*16+14,{});se.desenho=(g,ob)=>blit(g,SPR.get('sensor',sensorLigado()),ob.x,ob.y,ob.ax,ob.ay);
  /* o pilar ocupa pouco chão (colisão nos pés), mas tapa a visão e a luz em toda a altura do desenho */
  A.opacos=[];for(const[x,y]of[[11,18],[19,21],[16,24],[22,18],[6,20]]){const bx=x*16+8,by=y*16+15;objeto(A,SPR.get('pilarAco'),bx,by,{col:[-7,-6,7,0]});A.opacos.push({x0:bx-7,y0:by-30,x1:bx+7,y1:by});}
  interacao(A,{x:HOLO.tx*16+8,y:HOLO.ty*16+20,r:22,label:()=>'Girar o holofote (1/8 de volta)',use:()=>{holo.d=(holo.d+1)%8;SFX.rotate();addDiary('diesel_beams',true);}});
  /* facho: anda em passos de 2 px até bater numa parede ou num pilar */
  const facho=()=>{const a=holo.d*TAU/8-Math.PI/2,x0=HOLO.tx*16+8,y0=HOLO.ty*16+5;let x=x0,y=y0;
    for(let i=0;i<300;i++){x+=Math.cos(a)*2;y+=Math.sin(a)*2;const tx=Math.floor(x/16),ty=Math.floor(y/16);if(TK[A.kind(tx,ty)].solido)return{x0,y0,x,y,tx,ty};
      for(const b of A.opacos)if(x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1)return{x0,y0,x,y,tx:-1,ty:-1};}
    return{x0,y0,x,y,tx:-1,ty:-1};};
  A.facho=facho;
  portao(A,14,15,2,'portaoAco',sensorLigado);
  /* Robô-vigia: patrulha de um lado ao outro; o facho dele é um cone; quem fica nele é visto */
  const vg={x:6*16,y:20*16,dir:1,estado:'patrulha',t:0,f:0,perdeu:0,cd:0};
  vg.update=(dt,ativo)=>{vg.f+=dt*6;if(!ativo)return;const p=G.p;if(vg.cd>0)vg.cd-=dt;
    const dentro=p.y>16*16&&p.y<27*16&&p.x>3*16&&p.x<27*16;
    if(vg.estado==='patrulha'){vg.x+=vg.dir*34*dt;if(vg.x>24*16){vg.dir=-1;}if(vg.x<5*16){vg.dir=1;}
      if(dentro&&vePlayer(vg)){vg.estado='caca';SFX.alert();addDiary('diesel_guard');}}
    else{const dx=p.x-vg.x,dy=p.y-vg.y,d=Math.hypot(dx,dy);
      if(!dentro||vg.perdeu>3){vg.estado='patrulha';vg.perdeu=0;return;}
      vg.perdeu=vePlayer(vg)?0:vg.perdeu+dt;moverCorpo(A,vg,dx/(d||1)*60*dt,dy/(d||1)*60*dt);vg.dir=dx<0?-1:1;
      if(d<12&&vg.cd<=0){vg.cd=1.2;ferir(TXT.hit.sentinel);moverCorpo(A,p,dx/(d||1)*22,dy/(d||1)*22);}}
  };
  const vePlayer=v=>{const p=G.p,dx=p.x-v.x,dy=p.y-v.y,d=Math.hypot(dx,dy);if(d>96)return false;const a=Math.atan2(dy,dx),f=v.dir>0?0:Math.PI;let da=Math.abs(((a-f+Math.PI*3)%TAU)-Math.PI);return da<0.55&&visao(A,v.x,v.y-6,p.x,p.y-6);};
  vg.desenhar=()=>{if(!naTela(vg.x,vg.y,120))return;enfileirar(vg.y,g=>{sombra(g,vg.x,vg.y,8,3);blit(g,sprVigia(Math.floor(vg.f)),vg.x,vg.y+2,9,22);});};
  vg.reiniciar=()=>{vg.x=6*16;vg.y=20*16;vg.estado='patrulha';};
  A.ents.push(vg);A.guardas.push(vg);
  /* Oficina: contêineres, separadora, monta-cargas, bancada e o console */
  objeto(A,SPR.get('separadora',0),8*16,12*16+8,{col:[-24,-14,24,0]}).desenho=(g,ob,t)=>blit(g,SPR.get('separadora',PAINEL.run&&PAINEL.area===A?Math.floor(t*6)%2:0),ob.x,ob.y,26,40);
  objeto(A,SPR.get('bancada'),5*16+8,14*16+12,{col:[-18,-8,18,0]});
  for(let i=0;i<3;i++)objeto(A,SPR.get('valor',['engr','galao','placa'][i]),4*16+14+i*12,14*16+2,{camada:2});
  const mc={nivel:0};
  objeto(A,SPR.get('montaCargas',0),21*16,12*16+8,{col:[-22,-10,22,0]}).desenho=(g,ob)=>blit(g,SPR.get('montaCargas',Math.round(mc.nivel*6)/6),ob.x,ob.y,24,64);
  const foco={x:14*16,y:9*16};A.focoPainel=foco;
  terminal(A,14,12,'diesel',foco,'console','Usar o console da oficina');
  criarLume(A,17.5,11,'diesel');
  tochasProgresso(A,'diesel',[[9,14],[10.5,14],[12,14],[17,14],[18.5,14],[20,14]],'#cfe8ff');
  /* etapa dos quatro tipos: cada máquina reage ao valor da variável dela */
  const maqEstado=()=>{const vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;
    if(vis&&vis.cfg.id==='d1')return{on:true,m:vis.ws.maq||{}};
    if(G.learn.d1)return{on:false,m:{energia:LV('bool',true),combustivel:LV('float',2.5),pecas:LV('int',5),senha:LV('str','ABRIR')}};return{on:false,m:{}};};
  const ger=objeto(A,SPR.get('gerador',false,0),5*16+8,9*16+6,{col:[-14,-8,14,0]});
  ger.desenho=(g,ob,t)=>{const e=maqEstado(),lig=e.m.energia&&e.m.energia.v===true;blit(g,SPR.get('gerador',lig,Math.floor(t*6)%2),ob.x,ob.y,14,28);if(e.on)etiqueta(g,ob.x,ob.y-34,lig?'ligado':'desligado',lig?'#5dff7a':'#ff9a7a');};
  const tq=objeto(A,SPR.get('tanqueDiesel',0),24*16,9*16+6,{col:[-11,-8,11,0]});
  tq.desenho=(g,ob)=>{const e=maqEstado(),v=e.m.combustivel?e.m.combustivel.v:0;blit(g,SPR.get('tanqueDiesel',Math.round(v*4)/4),ob.x,ob.y,11,36);if(e.on)etiqueta(g,ob.x,ob.y-42,LANG.fmt(e.m.combustivel||null)+(e.m.combustivel?' L':''),'#ffe080');};
  const ps=objeto(A,SPR.get('painelSenha',false,0),19*16+8,7*16+14,{});
  ps.desenho=(g,ob,t)=>{const e=maqEstado(),s=e.m.senha,ok=s&&s.v==='ABRIR';blit(g,SPR.get('painelSenha',ok,Math.floor(t*3)%2),ob.x,ob.y,15,26);
    if(s){const x=Math.round(ob.x+R.ox),y=Math.round(ob.y-20+R.oy);FONTE.rotulo(g,s.v.slice(0,6),x,y,ok?'#5dff7a':'#ffd24a');}};
  const pt=objeto(A,SPR.get('portinhola',0),22*16+8,7*16+14,{});const pst={a:0};
  pt.desenho=(g,ob)=>{const e=maqEstado(),ok=e.m.senha&&e.m.senha.v==='ABRIR';pst.a+=((ok?1:0)-pst.a)*0.08;blit(g,SPR.get('portinhola',Math.round(pst.a*6)/6),ob.x,ob.y,13,30);};
  A.luzGerador=()=>{const e=maqEstado();return e.m.energia&&e.m.energia.v===true;};
  interacao(A,{x:14*16,y:7*16,r:30,label:()=>'Ler a placa dos contêineres',use:()=>{addDiary('oficina_diesel');toast('Cada contêiner é uma variável: tem um nome, aceita um tipo (int, float, string ou boolean) e mostra o valor atual. As máquinas leem a variável na hora de trabalhar.');}});
  A.luzesExtra=t=>{
    const f=A.facho();luz(f.x,f.y,10,1,'#fff6c0');
    if(A.luzGerador()){luz(5*16+8,8*16,46+Math.sin(t*12)*2,1,'#ffe9a0');for(const x of[8,20])luz(x*16,7*16,30,0.8,'#ffe9a0');}
    if(PAINEL.aberto&&PAINEL.area===A){luz(14*16,9*16,96,1,'#cfe8ff');}else luz(14*16,9*16,40,0.6,'#cfe8ff');
    if(naTela(vg.x,vg.y,100))luz(vg.x+vg.dir*30,vg.y-4,26,0.9,'#fff2b0');
  };
  portao(A,14,5,2,'portaoAco',()=>saberOk('diesel'));
  pedestal(A,14,3,'diesel');
  A.update=(dt,t)=>{
    const f=A.facho();
    if(f.tx===HOLO.sensor.tx&&f.ty===HOLO.sensor.ty&&!sensorLigado()){G.abertas.push('diesel_luz');SFX.sensor();toast('A luz alcançou o sensor: a porta da oficina se abriu.','good');salvar(false);}
    /* monta-cargas sobe quando a última execução da etapa 5 deu certo */
    const vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;const alvo=vis&&vis.cfg.id==='d5'&&vis.s&&vis.s.ok?1:(G.learn.d5&&!(vis&&vis.cfg.id==='d5'&&vis.rodando)?1:0);mc.nivel+=(alvo-mc.nivel)*Math.min(1,dt*1.5);
  };
  A.desenharChao=(g,t)=>{
    /* o facho no chão (linha clara) */
    const f=A.facho(),ox=R.ox,oy=R.oy;g.globalAlpha=0.55;P.linha(g,f.x0+ox,f.y0+oy,f.x+ox,f.y+oy,'#fff6c0');g.globalAlpha=0.25;P.linha(g,f.x0+ox+1,f.y0+oy,f.x+ox+1,f.y+oy,'#fff6c0');g.globalAlpha=1;
    /* cone do vigia */
    if(naTela(vg.x,vg.y,120)){g.globalAlpha=vg.estado==='caca'?0.3:0.16;g.fillStyle='#fff2b0';const a0=vg.dir>0?0:Math.PI;for(let r=10;r<96;r+=3){const w=Math.tan(0.55)*r;for(let s=-w;s<=w;s+=3)g.fillRect(Math.round(vg.x+Math.cos(a0)*r-Math.sin(a0)*s+ox),Math.round(vg.y-4+Math.sin(a0)*r+Math.cos(a0)*s+oy),2,2);}g.globalAlpha=1;}
    desenharOficina(A,g,t);
  };
  A.reiniciar=()=>{reiniciarGuardas(A);for(const pt of A.pontos)pt.aceso=false;holo.d=sensorLigado()?1:2;mc.nivel=G.learn.d5?1:0;addDiary('diesel_enter',true);};
  A.objetivo=()=>{if(!sensorLigado())return{t:'Saber: Dados e variáveis',s:'A porta da oficina está fechada. Gire o holofote até a luz alcançar o sensor da parede.'};return objetivoTumba('diesel','No console da oficina');};
  A.aoEvento=(ev)=>{
    if(ev.anim&&ev.anim.maq){const m=ev.anim.maq;if(m==='energia'){if(ev.depois.v){SFX.maquina();faiscas(5*16+8,8*16,12,['#fff6c0','#ffd24a']);R.treme=0.2;}else SFX.deny();}
      else if(m==='combustivel'){SFX.agua();gotas(24*16,7*16,6);}else if(m==='senha'){if(ev.depois.v==='ABRIR'){SFX.sensor();SFX.gate();}else SFX.deny();}else if(m==='pecas')SFX.click();}
    if(ev.anim&&ev.anim.lote){SFX.maquina();for(let i=0;i<Math.min(ev.anim.lote,12);i++)setTimeout(()=>faiscas(10*16,11*16,2,['#ffd24a','#d8a24a']),i*40);}
    if(ev.anim&&ev.anim.mc)SFX.elev();if(ev.tipo==='set')faiscas(contPos(A,ev.nome).x,contPos(A,ev.nome).y-20,6,['#6fd3ff','#ffffff']);if(ev.tipo==='erro'){SFX.deny();R.treme=0.2;}};
  A.aoConcluir=(cfg)=>{if(saberOk('diesel')){setTimeout(()=>toast('O monta-cargas levou a carga e destravou o portão da câmara.','good'),600);}};
  return A;
};
/* contêineres no alto da oficina: um para cada variável da etapa */
function contPos(A,nome){const vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;const cfg=vis?vis.cfg:(desafiosDa('diesel').find(d=>!G.learn[d.id])||DESAFIO.d5);
  const vs=cfg.vars||[];const i=Math.max(0,vs.findIndex(v=>v.nome===nome)),n=Math.max(1,vs.length);const x0=14*16-(n-1)*20;return{x:x0+i*40,y:8*16+4};}
function desenharOficina(A,g,t){
  let vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;if(vis&&vis.cfg.mundo!=='oficina')vis=null;
  const cfg=vis?vis.cfg:(desafiosDa('diesel').find(d=>!G.learn[d.id])||DESAFIO.d5);
  const env=vis&&vis.s?vis.s.env:(PAINEL.parado&&PAINEL.area===A?PAINEL.parado.env:null);
  const ws=vis?vis.ws:{lotes:[]};
  const vs=cfg.vars||[];
  /* canos dos contêineres até as máquinas */
  for(const v of vs){const p=contPos(A,v.nome);g.fillStyle='#3a3f48';g.fillRect(Math.round(p.x+R.ox)-1,Math.round(p.y+R.oy),3,22);}
  for(const v of vs){
    const p=contPos(A,v.nome),val=env&&env[v.nome]?env[v.nome].val:null;
    enfileirar(p.y+2,gg=>{
      blit(gg,SPR.get('conteiner',1),p.x,p.y+4,15,40);
      const x=Math.round(p.x+R.ox),y=Math.round(p.y+R.oy);
      /* janela: vazia (pontilhada) ou com o valor */
      if(val===null){gg.fillStyle='#5a6a7a';for(let i=0;i<18;i+=3){gg.fillRect(x-9+i,y-29,2,1);gg.fillRect(x-9+i,y-10,2,1);}for(let j=0;j<20;j+=3){gg.fillRect(x-9,y-29+j,1,2);gg.fillRect(x+8,y-29+j,1,2);}FONTE.rotulo(gg,'vazio',x,y-22,'#8a9aaa');}
      else{const o=(cfg.objetos||[]).map(id=>OBJ[id]).find(o=>o.val.t===val.t&&o.val.v===val.v);if(o)gg.drawImage(SPR.get('valor',o.icone),x-12,y-32);
        const txt=LANG.fmt(val)+(v.unid?' '+v.unid:'');const w=FONTE.larg(txt);gg.fillStyle='#0b0705';gg.fillRect(x-Math.ceil(w/2)-2,y-14,w+4,7);FONTE.rotulo(gg,txt,x,y-13,'#ffd24a');}
      /* nome e tipo acima */
      const nm=v.nome,w=FONTE.larg(nm);gg.fillStyle='#0b0705';gg.fillRect(x-Math.ceil(w/2)-2,y-46,w+4,7);FONTE.rotulo(gg,nm,x,y-45,'#ffffff');
      const tp=LANG.TIPOS[v.t].py,w2=FONTE.larg(tp);gg.fillStyle='#1a3a4a';gg.fillRect(x-Math.ceil(w2/2)-2,y-38,w2+4,7);FONTE.rotulo(gg,tp,x,y-37,'#6fd3ff');
    });
  }
  /* caixas separadas na esteira, com o número de peças */
  (ws.lotes||[]).forEach((n,i)=>{const x=11*16+i*18,y=13*16+4;enfileirar(y,gg=>{blit(gg,SPR.get('caixaLote'),x,y,8,14);FONTE.rotulo(gg,String(n),Math.round(x+R.ox),Math.round(y-10+R.oy),'#fff6dc','#0b0705');});});
  /* pedido em cima da separadora */
  const ped=cfg.situacoes[0]&&cfg.situacoes[0].pedidos;if(ped){const txt='pedido: '+ped.join(' e ');const x=Math.round(8*16+R.ox),y=Math.round(9*16+6+R.oy),w=FONTE.larg(txt);g.fillStyle='#e9d8ae';g.fillRect(x-Math.ceil(w/2)-2,y-1,w+4,7);FONTE.rotulo(g,txt,x,y,'#24160d');}
  if(cfg.id==='d5'){const x=Math.round(21*16+R.ox),y=Math.round(8*16+R.oy);const L=['carga 12','óleo 0,75 L','código MOTOR','freio solto'];g.fillStyle='#e9d8ae';g.fillRect(x-24,y-4,48,30);L.forEach((l,i)=>FONTE.texto(g,l,x-22,y-2+i*7,'#24160d'));}
}
