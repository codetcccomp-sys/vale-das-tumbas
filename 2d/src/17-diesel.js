/* ====================== Tumba dos Motores (Dieselpunk) · saber: Dados e variáveis ======================
   Garagem com gerador → pátio de abastecimento (um canal corta o pátio; três máquinas com etiqueta de tipo — disjuntor
   aceita bool, bomba hidráulica aceita float, painel da porta aceita str — recebem cápsulas de valor carregadas pelo chão:
   reconhecer o tipo e o valor certos liga a bomba, baixa a ponte e abre a porta) → Oficina dos contêineres
   (variáveis com nome, tipo e valor, ligadas à separadora de peças e ao monta-cargas) → câmara da Vela de ignição.
   Adaptação do 3D: o elevador de carga virou o monta-cargas da oficina, controlado pelos contêineres. */
Object.assign(OBJS,{
  gerador(aceso,f){const c=cnv(28,28),g=ctx2(c);P.r(g,2,8,24,18,'#4a505c');P.r(g,2,8,24,3,'#6a707c');for(let x=5;x<24;x+=4)P.r(g,x,12,2,10,'#33373f');
    P.r(g,18,2,6,8,'#3a3f48');P.circ(g,9,17,3.5,aceso?(f?'#ffd24a':'#ffe9a0'):'#2a2d33');P.r(g,20,14,4,3,aceso?'#5dff7a':'#5a2a1a');return contorno(c,'#0b0705');},
  /* cápsula de valor: a faixa colorida mostra o tipo (int azul, float verde, str papel, bool âmbar) */
  capsulaValor(t){const c=cnv(10,14),g=ctx2(c),C={int:'#6fd3ff',float:'#5dff7a',str:'#e9dcbc',bool:'#ffb43a'}[t]||'#ffffff';
    P.r(g,1,2,8,11,'#5a606c');P.r(g,1,2,2,11,'#7a828e');P.r(g,1,6,8,3,C);P.r(g,2,0,6,2,'#3a3f48');P.r(g,1,12,8,1,'#33373f');return contorno(c,'#0b0705');},
  disjuntor(on){const c=cnv(20,28),g=ctx2(c);P.r(g,2,4,16,22,'#4a505c');P.r(g,2,4,16,3,'#6a707c');P.r(g,5,9,10,8,'#22262c');
    P.r(g,8,on?9:12,4,5,on?'#5dff7a':'#ff5a3a');P.r(g,6,19,8,4,'#2a2d33');P.r(g,7,20,6,2,'#ffb43a');return contorno(c,'#0b0705');},
  bombaHidro(on,f){const c=cnv(26,30),g=ctx2(c);P.r(g,3,8,20,20,'#4a505c');P.r(g,3,8,20,3,'#6a707c');P.circ(g,9,18,5,'#22262c');P.circ(g,9,18,4,'#cfd8e0');
    const a=on?(f%4)*0.6-0.9:-2.2;P.linha(g,9,18,Math.round(9+Math.cos(a)*3),Math.round(18+Math.sin(a)*3),'#ff5a3a');P.r(g,16,12,5,12,'#22262c');P.r(g,17,13,3,10,on?'#5dff7a':'#33373f');
    P.r(g,10,1,6,8,'#3a3f48');P.r(g,11,2,4,2,'#5dff7a');return contorno(c,'#0b0705');},
  /* ponte do canal: erguida (só a beirada aparece) ou baixada (chapa listrada sobre o vão) */
  ponteDiesel(b){const c=cnv(32,36),g=ctx2(c);
    if(b){P.r(g,0,4,32,32,'#5a606c');for(let y=6;y<36;y+=5)P.r(g,0,y,32,1,'#3a3f48');P.r(g,0,4,2,32,'#c8a030');P.r(g,30,4,2,32,'#c8a030');}
    else{P.r(g,0,0,32,8,'#5a606c');P.r(g,0,0,32,2,'#7a828e');for(let x=2;x<32;x+=5)P.r(g,x,2,1,6,'#3a3f48');P.r(g,0,6,32,2,'#c8a030');}
    return contorno(c,'#0b0705');},
  guarda(){const c=cnv(16,8),g=ctx2(c);P.r(g,0,1,16,2,'#c8a030');P.r(g,0,3,16,1,'#8a6a20');for(const x of[1,8])P.r(g,x,1,2,7,'#5a606c');return c;},
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
  '###vvvvvvvvvvvvvvvvvvvvvvvv###',
  '###vvvvvvvvvvvvvvvvvvvvvvvv###',
  '###........................###',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
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
/* pátio de abastecimento: três máquinas com contrato de tipo (a etiqueta diz o tipo aceito e o valor pedido) e cápsulas
   de valor no chão, cada uma com uma "irmã" parecida de outro tipo (True e "True", 2.5 e "2.5") ou de outro valor
   ("ABRIR" e "abrir"). Disjuntor (bool) dá energia à bomba; a bomba (float) baixa a ponte do canal; o painel (str) abre
   a oficina. Quem tinha aberto a oficina pelo jogo antigo (holofote, diesel_luz) encontra as três máquinas prontas. */
const PATIO_DIESEL={
  maquinas:{
    disjuntor:{tx:27,ty:24,tipo:'bool',val:true,nome:'Disjuntor do pátio',em:'no disjuntor',ele:'ele',faz:'liga a energia da bomba hidráulica',ok:'O disjuntor aceitou True: a energia chegou à bomba hidráulica.',flag:'diesel_disjuntor'},
    bomba:{tx:2,ty:24,tipo:'float',val:2.5,unid:' L',nome:'Bomba hidráulica',em:'na bomba hidráulica',ele:'ela',faz:'baixa a ponte do canal',ok:'A bomba aceitou 2.5 L de óleo: a ponte do canal desceu.',flag:'diesel_ponte',precisa:'disjuntor'},
    porta:{tx:12,ty:16,tipo:'str',val:'ABRIR',nome:'Painel da porta',em:'no painel da porta',ele:'ele',faz:'abre a porta da oficina',ok:'O painel leu "ABRIR": a porta da oficina se abriu.',flag:'diesel_porta'}
  },
  capsulas:[['c_true','bool',true,6,26],['c_strue','str','True',9,23],['c_f25','float',2.5,22,26],['c_s25','str','2.5',19,23],['c_abrir','str','ABRIR',5,22],['c_abrirm','str','abrir',24,22],['c_5','int',5,12,25]]
};
CONSTRUIR.diesel=function(){
  const A=tumbaArea('diesel','diesel',MAPA_DIESEL,{'#':'parede','.':'chao',v:'vao'});
  A.metal=true;A.som='diesel';A.spawn={x:15*16,y:32*16+8,dir:'cima'};
  for(let x=5;x<25;x++)A.set(x,10,'chao2');for(const y of[17,25])for(let x=4;x<26;x+=7)A.set(x,y,'grade');
  saidaVale(A,14,33);
  pontoEnergia(A,9,30,'gerador','o gerador','diesel_enter');
  for(const[x,y]of[[8,28],[21,28],[6,15],[23,15],[6,5],[23,5],[12,1],[17,1]])lampada(A,x,y,'#cfe8ff',40);
  for(const[x,y]of[[19,31],[20,32]])objeto(A,SPR.get('barril'),x*16+8,y*16+14,{col:[-6,-4,6,0]});
  const mot=objeto(A,SPR.get('motor',0),11*16,33*16+4,{col:[-16,-8,16,0]});mot.frames=[0,1].map(f=>SPR.get('motor',f));mot.fps=8;
  placaPista(A,'diesel_patio',17*16+8,27*16+14,{cor:'#6fd3ff'});
  marcaLuz(A,'diesel_etiqueta',10,15);marcaLuz(A,'diesel_aspas',11,28);
  /* ---------- pátio: máquinas, cápsulas, canal e ponte ---------- */
  const PD=PATIO_DIESEL,MQ=PD.maquinas;
  const feita=k=>G.abertas.indexOf(MQ[k].flag)>=0||G.abertas.indexOf('diesel_luz')>=0;
  const pat={carrega:null,caps:{}};A.patio=pat;
  const capInicial=()=>{pat.caps={};for(const[id,t,v,tx,ty]of PD.capsulas)pat.caps[id]={id,val:LV(t,v),x:tx*16+8,y:ty*16+12,em:null};
    for(const k in MQ)if(feita(k)){const c=Object.values(pat.caps).find(c=>c.val.t===MQ[k].tipo&&c.val.v===MQ[k].val);if(c)c.em=k;}pat.carrega=null;};
  capInicial();
  const rot=v=>LANG.fmt(v)+' ('+LANG.TIPOS[v.t].py+')';
  /* uma cápsula no chão: pegar (ou trocar pela que está na mão: a da mão fica no lugar dela) */
  for(const[id]of PD.capsulas){
    const it=interacao(A,{x:0,y:0,r:16,alto:22,nome:()=>{const c=pat.caps[id];return'Cápsula '+LANG.fmt(c.val);},label:()=>{const c=pat.caps[id];if(c.em||pat.carrega===id)return null;return(pat.carrega?'Trocar pela cápsula ':'Pegar a cápsula ')+rot(c.val);},
      use:()=>{const c=pat.caps[id];if(pat.carrega){const m=pat.caps[pat.carrega];m.x=c.x;m.y=c.y;}pat.carrega=id;SFX.frag();}});
    Object.defineProperty(it,'x',{get:()=>pat.caps[id].x});Object.defineProperty(it,'y',{get:()=>pat.caps[id].y+4});
  }
  /* a cápsula da mão aparece no HUD (e sobre a cabeça do explorador), sem aviso a cada troca */
  const corTipo={int:'#6fd3ff',float:'#5dff7a',str:'#e9dcbc',bool:'#ffb43a'};
  A.naMao=()=>pat.carrega?{t:rot(pat.caps[pat.carrega].val),cor:corTipo[pat.caps[pat.carrega].val.t]}:null;
  /* as máquinas: ler a etiqueta, ou pôr a cápsula da mão (recusa com explicação quando o tipo ou o valor não servem) */
  for(const k in MQ){const m=MQ[k],x=m.tx*16+8,y=m.ty*16+14;
    const spr=k==='disjuntor'?'disjuntor':k==='bomba'?'bombaHidro':'painelSenha';
    const o=objeto(A,SPR.get(spr,false,0),x,y,{col:k==='porta'?[-10,-6,10,0]:[-10,-8,10,0]});
    o.desenho=(g,ob,t)=>{const on=feita(k);blit(g,SPR.get(spr,on,Math.floor(t*4)%4),ob.x,ob.y,ob.ax,ob.ay);
      etiqueta(g,ob.x,ob.y-ob.ay-16,'aceita '+LANG.TIPOS[m.tipo].py,{int:'#6fd3ff',float:'#5dff7a',str:'#e9dcbc',bool:'#ffb43a'}[m.tipo]);
      etiqueta(g,ob.x,ob.y-ob.ay-8,on?'ok':'pede '+LANG.fmt(LV(m.tipo,m.val)).replace(/^"|"$/g,'"')+(m.unid||''),on?'#5dff7a':'#ffffff');};
    A.lampadas.push({x,y:y-20,get r(){return feita(k)?40:18;},get cor(){return feita(k)?'#5dff7a':'#ffb43a';}});
    interacao(A,{x,y:y+8,r:24,alto:52,nome:m.nome,label:()=>feita(k)?m.nome+' (funcionando)':pat.carrega?'Pôr '+rot(pat.caps[pat.carrega].val)+' '+m.em:'Ler a etiqueta: '+m.nome,
      use:()=>usarMaquina(k)});
  }
  const usarMaquina=k=>{const m=MQ[k],ped=LANG.fmt(LV(m.tipo,m.val))+(m.unid||'');
    if(feita(k)){toast(m.nome+' já está funcionando: '+m.faz+'.');return;}
    if(!pat.carrega){SFX.page();toast(m.nome+': aceita '+LANG.rotulo(m.tipo)+' e pede '+ped+'. '+mai1(m.ele)+' '+m.faz+'.');return;}
    const c=pat.caps[pat.carrega],v=c.val;
    if(m.precisa&&!feita(m.precisa)){SFX.deny();toast(m.nome+' está sem energia. Primeiro ligue o '+MQ[m.precisa].nome.toLowerCase()+'.','warn');return;}
    if(v.t!==m.tipo){SFX.deny();R.treme=0.15;addDiary('diesel_tipos',true);
      const aspas=v.t==='str'&&/^(True|False|-?\d+(\.\d+)?)$/.test(v.v)?' Com aspas, '+LANG.fmt(v)+' é texto, mesmo parecendo '+(/^(True|False)$/.test(v.v)?'um booleano':'um número')+'.':'';
      /* a observação sobre o Python vem só na primeira recusa, para o aviso não ficar enorme */
      const regra=pat.regra?'':' (Regra desta máquina: em Python, uma variável pode guardar qualquer tipo.)';pat.regra=true;
      toast(m.nome+' recusou '+LANG.fmt(v)+': é '+LANG.tipoDe(v)+', e '+m.ele+' só aceita '+LANG.rotulo(m.tipo)+'.'+aspas+regra,'warn');return;}
    if(v.v!==m.val){SFX.deny();
      toast(m.tipo==='str'?m.nome+' leu '+LANG.fmt(v)+' e não abriu: a senha é '+ped+'. Em texto, maiúsculas e minúsculas contam: '+LANG.fmt(v)+' == '+ped+' é False.':m.nome+' aceitou o tipo, mas pede '+ped+'.','warn');return;}
    c.em=k;pat.carrega=null;G.abertas.push(m.flag);SFX.sensor();SFX.maquina();faiscas(m.tx*16+8,m.ty*16-6,12,['#fff6c0','#5dff7a']);
    if(k==='bomba'){SFX.elev();R.treme=0.35;}if(k==='porta')SFX.gate();
    toast(m.ok,'good');salvar(false);};
  A.usarMaquina=usarMaquina;
  /* canal com guarda-corpo: não dá para cair; a ponte (colunas 14 e 15) desce com a bomba */
  solido(A,3*16,20*16,14*16,22*16);solido(A,16*16,20*16,27*16,22*16);
  const trava=solido(A,14*16,20*16,16*16,22*16);
  const ponte={b:feita('bomba')?1:0};
  /* porta da oficina: abre com a senha no painel */
  portao(A,14,15,2,'portaoAco',()=>feita('porta'));
  A.cobre=(x,y)=>{const tx=Math.floor(x/16),ty=Math.floor(y/16);return ponte.b>0.6&&(tx===14||tx===15)&&(ty===20||ty===21);};
  for(let x=3;x<27;x++){if(x===14||x===15)continue;objeto(A,SPR.get('guarda'),x*16+8,20*16+2,{});objeto(A,SPR.get('guarda'),x*16+8,22*16+2,{});}
  objeto(A,SPR.get('ponteDiesel',0),15*16,20*16+2,{camada:-30}).desenho=(g,ob)=>{const b=ponte.b>0.6;blit(g,SPR.get('ponteDiesel',b?1:0),ob.x,b?22*16:20*16+2,16,b?36:8);};
  A.ponte=ponte;
  /* cápsulas: no chão (com o valor escrito), na mão do explorador e dentro das máquinas */
  const desenharCapsulas=()=>{
    for(const id in pat.caps){const c=pat.caps[id];if(id===pat.carrega)continue;
      const mq=c.em?MQ[c.em]:null,x=mq?mq.tx*16+8:c.x,y=mq?mq.ty*16+(c.em==='porta'?6:2):c.y;if(!naTela(x,y,30))continue;
      enfileirar(y+(mq?1:0),g=>{if(!mq)sombra(g,x,y+1,4,1.5);blit(g,SPR.get('capsulaValor',c.val.t),x,y,5,13);if(!mq)etiqueta(g,x,y-22,LANG.fmt(c.val),{int:'#6fd3ff',float:'#5dff7a',str:'#e9dcbc',bool:'#ffb43a'}[c.val.t]);});}
    if(pat.carrega){const c=pat.caps[pat.carrega],p=G.p;enfileirar(p.y+1,g=>{blit(g,SPR.get('capsulaValor',c.val.t),p.x+7,p.y-30,5,13);etiqueta(g,p.x+7,p.y-52,LANG.fmt(c.val),'#ffe9a0');});}
  };
  /* Oficina: contêineres, separadora, monta-cargas, bancada e o console */
  objeto(A,SPR.get('separadora',0),8*16,12*16+8,{col:[-24,-14,24,0]}).desenho=(g,ob,t)=>blit(g,SPR.get('separadora',PAINEL.run&&PAINEL.area===A?Math.floor(t*6)%2:0),ob.x,ob.y,26,40);
  objeto(A,SPR.get('bancada'),5*16+8,14*16+12,{col:[-18,-8,18,0]});
  for(let i=0;i<3;i++)objeto(A,SPR.get('valor',['engr','galao','placa'][i]),4*16+14+i*12,14*16+2,{camada:2});
  const mc={nivel:0};
  objeto(A,SPR.get('montaCargas',0),21*16,12*16+8,{col:[-22,-10,22,0]}).desenho=(g,ob)=>blit(g,SPR.get('montaCargas',Math.round(mc.nivel*6)/6),ob.x,ob.y,24,64);
  const foco={x:14*16,y:9*16};A.focoPainel=foco;
  terminal(A,14,12,'diesel',foco,'console','Usar o console da oficina');
  criarLume(A,17.5,11,'diesel');
  tochasProgresso(A,'diesel',[[9,14],[10.5,14],[12,14],[17,14],[18.5,14],[20,14],[21.5,14]],'#cfe8ff');
  /* etapa dos quatro tipos: cada máquina reage ao valor da variável dela */
  const maqEstado=()=>{const vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;
    if(vis&&vis.cfg.id==='d1')return{on:true,m:vis.ws.maq||{}};
    /* bomba de combustível (etapa 7): o gerador segue a variável energia e o tanque mostra cada abastecimento */
    if(vis&&vis.cfg.id==='d6'){const env=vis.s?vis.s.env:null;return{on:true,d6:true,m:{energia:env&&env.energia?env.energia.val:null},tq:vis.ws.tanques||[]};}
    if(G.learn.d1)return{on:false,m:{energia:LV('bool',true),combustivel:LV('float',2.5),pecas:LV('int',5),senha:LV('str','ABRIR')}};return{on:false,m:{}};};
  const ger=objeto(A,SPR.get('gerador',false,0),5*16+8,9*16+6,{col:[-14,-8,14,0]});
  ger.desenho=(g,ob,t)=>{const e=maqEstado(),lig=e.m.energia&&e.m.energia.v===true;blit(g,SPR.get('gerador',lig,Math.floor(t*6)%2),ob.x,ob.y,14,28);if(e.on)etiqueta(g,ob.x,ob.y-34,lig?'ligado':'desligado',lig?'#5dff7a':'#ff9a7a');};
  const tq=objeto(A,SPR.get('tanqueDiesel',0),24*16,9*16+6,{col:[-11,-8,11,0]});
  tq.desenho=(g,ob)=>{const e=maqEstado();
    if(e.d6){const l=e.tq,v=l.length?l[l.length-1]:0;blit(g,SPR.get('tanqueDiesel',Math.round(Math.min(v,4)*4)/4),ob.x,ob.y,11,36);
      etiqueta(g,ob.x,ob.y-42,l.length?l.map((x,i)=>'T'+(i+1)+' '+LANG.fmtDec(x)+' L').join(' '):'tanques vazios','#ffe080');return;}
    const v=e.m.combustivel?e.m.combustivel.v:0;blit(g,SPR.get('tanqueDiesel',Math.round(v*4)/4),ob.x,ob.y,11,36);if(e.on)etiqueta(g,ob.x,ob.y-42,LANG.fmt(e.m.combustivel||null)+(e.m.combustivel?' L':''),'#ffe080');};
  const ps=objeto(A,SPR.get('painelSenha',false,0),19*16+8,7*16+14,{});
  ps.desenho=(g,ob,t)=>{const e=maqEstado(),s=e.m.senha,ok=s&&s.v==='ABRIR';blit(g,SPR.get('painelSenha',ok,Math.floor(t*3)%2),ob.x,ob.y,15,26);
    if(s){const x=Math.round(ob.x+R.ox),y=Math.round(ob.y-20+R.oy);FONTE.rotulo(g,s.v.slice(0,6),x,y,ok?'#5dff7a':'#ffd24a');}};
  const pt=objeto(A,SPR.get('portinhola',0),22*16+8,7*16+14,{});const pst={a:0};
  pt.desenho=(g,ob)=>{const e=maqEstado(),ok=e.m.senha&&e.m.senha.v==='ABRIR';pst.a+=((ok?1:0)-pst.a)*0.08;blit(g,SPR.get('portinhola',Math.round(pst.a*6)/6),ob.x,ob.y,13,30);};
  A.luzGerador=()=>{const e=maqEstado();return e.m.energia&&e.m.energia.v===true;};
  placaPista(A,'diesel',24*16+8,13*16+14,{cor:'#6fd3ff'});
  A.luzesExtra=t=>{
    if(A.luzGerador()){luz(5*16+8,8*16,46+Math.sin(t*12)*2,1,'#ffe9a0');for(const x of[8,20])luz(x*16,7*16,30,0.8,'#ffe9a0');}
    if(PAINEL.aberto&&PAINEL.area===A){luz(14*16,9*16,96,1,'#cfe8ff');}else luz(14*16,9*16,40,0.6,'#cfe8ff');
  };
  portao(A,14,5,2,'portaoAco',()=>saberOk('diesel'));
  pedestal(A,14,3,'diesel');
  A.update=(dt,t)=>{
    /* a ponte desce aos poucos depois que a bomba recebe o óleo; a trava só sai quando ela está embaixo */
    ponte.b+=((feita('bomba')?1:0)-ponte.b)*Math.min(1,dt*2.5);trava.on=ponte.b<0.6;
    /* monta-cargas sobe quando a última execução da etapa 5 deu certo */
    const vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;const alvo=vis&&vis.cfg.id==='d5'&&vis.s&&vis.s.ok?1:(G.learn.d5&&!(vis&&vis.cfg.id==='d5'&&vis.rodando)?1:0);mc.nivel+=(alvo-mc.nivel)*Math.min(1,dt*1.5);
  };
  A.desenharChao=(g,t)=>{
    desenharCapsulas();
    desenharOficina(A,g,t);
  };
  A.reiniciar=()=>{for(const p0 of A.pontos)p0.aceso=false;capInicial();ponte.b=feita('bomba')?1:0;mc.nivel=G.learn.d5?1:0;addDiary('diesel_enter',true);};
  A.objetivo=()=>{const alvoM=k=>({x:MQ[k].tx*16+8,y:MQ[k].ty*16-34,txt:MQ[k].nome});
    if(!feita('disjuntor'))return{t:'Saber: Dados e variáveis',s:'O pátio está sem energia. Leia a etiqueta do disjuntor (leste): ele aceita um tipo só. Leve a cápsula certa até ele.',alvo:alvoM('disjuntor')};
    if(!feita('bomba'))return{t:'Saber: Dados e variáveis',s:'Com energia, a bomba hidráulica (oeste) baixa a ponte do canal. Leia a etiqueta e escolha a cápsula do tipo certo.',alvo:alvoM('bomba')};
    if(!feita('porta'))return{t:'Saber: Dados e variáveis',s:'A ponte desceu. O painel da porta (norte) pede uma senha: leve a cápsula com o texto certo.',alvo:alvoM('porta')};
    return objetivoTumba('diesel','No console da oficina');};
  /* o que cada instrução mexe: a máquina da variável (etapas 2 e 7), o contêiner, a separadora, o monta-cargas ou a bomba */
  A.focoEvento=(ev,ws,cfg)=>{const M={energia:[5*16+8,9*16-28],combustivel:[24*16,9*16-38],senha:[19*16+8,7*16-18],pecas:[8*16,12*16-14]};
    if(ev.tipo==='set'){if((cfg.id==='d1'||cfg.id==='d6')&&M[ev.nome])return{x:M[ev.nome][0],y:M[ev.nome][1]};const p=contPos(A,ev.nome);return{x:p.x,y:p.y-52};}
    if(ev.cmd==='separar')return{x:8*16,y:12*16-18};if(ev.cmd==='mc')return{x:21*16,y:12*16-34};if(ev.cmd==='abastecer')return{x:24*16,y:9*16-38};return null;};
  A.aoEvento=(ev)=>{
    if(ev.anim&&ev.anim.maq){const m=ev.anim.maq;if(m==='energia'){if(ev.depois.v){SFX.maquina();faiscas(5*16+8,8*16,12,['#fff6c0','#ffd24a']);R.treme=0.2;}else SFX.deny();}
      else if(m==='combustivel'){SFX.agua();gotas(24*16,7*16,6);}else if(m==='senha'){if(ev.depois.v==='ABRIR'){SFX.sensor();SFX.gate();}else SFX.deny();}else if(m==='pecas')SFX.click();}
    if(ev.anim&&ev.anim.lote){SFX.maquina();for(let i=0;i<Math.min(ev.anim.lote,12);i++)setTimeout(()=>faiscas(10*16,11*16,2,['#ffd24a','#d8a24a']),i*40);}
    if(ev.anim&&ev.anim.tanque){SFX.agua();gotas(24*16,7*16,8);}if(ev.anim&&ev.anim.falha==='bomba')SFX.deny();
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
  const tqs=cfg.situacoes[0]&&cfg.situacoes[0].tanques;if(tqs){const txt='pedido: '+tqs.map(x=>LANG.fmtDec(x).replace('.',',')+' L').join(' e ');const x=Math.round(24*16+R.ox),y=Math.round(10*16+6+R.oy),w=FONTE.larg(txt);g.fillStyle='#e9d8ae';g.fillRect(x-Math.ceil(w/2)-2,y-1,w+4,7);FONTE.rotulo(g,txt,x,y,'#24160d');}
  if(cfg.id==='d5'){const x=Math.round(21*16+R.ox),y=Math.round(8*16+R.oy);const L=['carga 12','óleo 0,75 L','código MOTOR','freio solto'];g.fillStyle='#e9d8ae';g.fillRect(x-24,y-4,48,30);L.forEach((l,i)=>FONTE.texto(g,l,x-22,y-2+i*7,'#24160d'));}
}
