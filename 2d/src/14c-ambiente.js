/* ====================== ambientação do vale ======================
   Mais vida entre as tumbas, sem pesar: árvores, braseiros na Estrada das Eras, estátuas, arcos e colunas em ruínas,
   acampamentos, artefatos e cacos espalhados, um rio seco com uma ponte, e seis pontos de interesse com pistas que vão
   para o diário. O que é chão (cacos, pedrinhas, flores, rachaduras, a ponte) vira decalque desenhado uma vez no pedaço
   do mapa; o que tem altura é objeto com sombra, ordenado pela base. Partículas (poeira com o vento, vaga-lumes à noite,
   brasas, folhas) só nascem perto da tela e têm limite; a névoa da manhã é uma textura pronta que desliza. */
Object.assign(OBJS,{
  acacia(v){const c=cnv(46,44),g=ctx2(c),r=rng(60+v);P.r(g,21,22,4,21,'#6a4a2a');P.r(g,21,22,1,21,'#8a6a3a');P.linha(g,22,28,13,18,'#6a4a2a');P.linha(g,23,26,32,17,'#6a4a2a');P.linha(g,23,25,31,17,'#6a4a2a');
    const C=v%2?'#6a9a3a':'#5a8a34';for(let i=0;i<26;i++){const x=6+r()*34,y=8+r()*10;P.elip(g,x,y,4+r()*3,2.2+r(),i%3?C:tom(C,-0.2));}
    for(let i=0;i<12;i++)P.p(g,8+r()*30,6+r()*8,tom(C,0.3));if(v%3===0)for(let i=0;i<6;i++)P.p(g,8+r()*30,8+r()*8,'#ffd24a');return contorno(c,'#1a2a10');},
  braseiro(f){const c=cnv(14,26),g=ctx2(c);P.r(g,4,14,6,11,'#8a7a62');P.r(g,4,14,2,11,'#a8987a');P.r(g,2,23,10,3,'#6a5a48');P.r(g,1,10,12,4,'#4a4038');P.r(g,2,10,10,1,'#6a6058');
    const k=f%3;P.elip(g,7,7+(k===1?-1:0),4,4,'#ff7a20');P.elip(g,7,8,2.5,2.5,'#ffb43a');P.p(g,7,8,'#fff2a0');if(k===2)P.p(g,5,2,'#ff9a3a');return contorno(c,'#24160d');},
  estatuaEngenheira(){const c=cnv(28,48),g=ctx2(c);P.r(g,3,38,22,9,'#8a7a62');P.r(g,3,38,22,2,'#a8987a');P.r(g,8,18,12,21,'#a8a090');P.r(g,8,18,3,21,'#c0b8a8');P.circ(g,14,13,5,'#b8b0a0');P.r(g,10,8,8,3,'#8a8478');
    P.r(g,11,22,10,11,'#d8d0bc');P.r(g,11,22,10,1,'#f0e8d4');for(let y=25;y<32;y+=2)P.r(g,13,y,6,1,'#8a8478');P.p(g,6,40,'#6a9a3a');P.p(g,21,42,'#6a9a3a');P.p(g,9,30,'#7a9a4a');return contorno(c,'#3a2414');},
  observatorio(){const c=cnv(60,48),g=ctx2(c);P.r(g,6,24,48,22,'#bfae8c');P.r(g,6,24,48,3,'#d8c8a4');for(let x=10;x<52;x+=8)P.r(g,x,28,1,16,'#a8987a');
    for(let i=0;i<20;i++){const a=Math.PI+i/19*Math.PI*0.62;P.r(g,Math.round(30+Math.cos(a)*22),Math.round(24+Math.sin(a)*18),3,3,'#cfc29e');}
    P.r(g,30,6,4,20,'#6a5a48');P.linha(g,32,20,48,4,'#8a6a3a');P.linha(g,33,20,49,4,'#8a6a3a');P.circ(g,49,4,2.5,'#d8a24a');P.r(g,22,34,8,10,'#2a2018');for(let i=0;i<5;i++)P.r(g,40+i*3,44-(i%2),2,2,'#cfc29e');return contorno(c,'#3a2414');},
  poco(){const c=cnv(28,30),g=ctx2(c);P.r(g,4,4,2,16,'#6a4a2a');P.r(g,22,4,2,16,'#6a4a2a');P.r(g,3,3,22,2,'#8a5a32');P.linha(g,14,5,14,13,'#cfc29e');P.r(g,12,13,5,4,'#7a4a2a');
    P.elip(g,14,22,12,6,'#8a7a62');P.elip(g,14,21,9,4,'#2a3a4a');P.elip(g,14,21,6,2,'#3a5a7a');P.elip(g,14,25,12,3,'#6a5a48');return contorno(c,'#24160d');},
  carroca(){const c=cnv(48,26),g=ctx2(c);P.r(g,6,8,30,12,'#7a5232');P.r(g,6,8,30,2,'#9a6a42');for(let x=10;x<36;x+=6)P.r(g,x,8,1,12,'#5a3a20');
    P.circ(g,40,12,8,'#5a3a20');P.circ(g,40,12,6,'#3a2414');for(let k=0;k<6;k++){const a=k/6*TAU;P.linha(g,40,12,Math.round(40+Math.cos(a)*6),Math.round(12+Math.sin(a)*6),'#8a6a3a');}P.circ(g,40,12,1.5,'#d8a24a');
    P.linha(g,2,20,10,16,'#6a4a2a');P.engrenagem(g,20,22,3,6,'#d8a24a','#8a6a26',1);return contorno(c,'#24160d');},
  tendaRasgada(){const c=cnv(42,32),g=ctx2(c),C='#bfae8c',E=tom(C,-0.25);for(let y=0;y<26;y++){const w=Math.round(4+y*1.4);P.r(g,21-w,4+y,w,1,E);P.r(g,21,4+y,w,1,C);}
    P.r(g,20,2,2,26,'#5a3a20');P.linha(g,26,10,30,22,'#2a1a10');P.linha(g,27,11,31,23,'#4a3a2a');P.linha(g,12,16,9,24,'#2a1a10');for(let y=0;y<10;y++){const w=Math.round(2+y*0.5);P.r(g,21-w,19+y,w*2,1,'#2a1a10');}return contorno(c,'#24160d');},
  fogueiraFria(){const c=cnv(18,10),g=ctx2(c);for(let i=0;i<7;i++){const a=i/7*TAU;P.r(g,Math.round(9+Math.cos(a)*6)-1,Math.round(5+Math.sin(a)*3)-1,3,2,'#8a7a6a');}P.r(g,6,4,6,2,'#2a2420');P.p(g,8,3,'#4a4038');return contorno(c,'#24160d');},
  arcoQuebrado(v){const c=cnv(50,46),g=ctx2(c),C=v%2?'#cfc29e':'#bfae8c';P.r(g,4,10,8,34,C);P.r(g,4,10,3,34,tom(C,0.15));P.r(g,38,26,8,18,C);P.r(g,38,26,3,18,tom(C,0.15));
    for(let i=0;i<9;i++){const a=Math.PI+i/14*Math.PI;P.r(g,Math.round(25+Math.cos(a)*19)-3,Math.round(14+Math.sin(a)*12)-2,6,5,i%2?C:tom(C,-0.1));}P.r(g,2,42,46,3,'#8a7a62');P.r(g,40,40,6,3,tom(C,-0.2));return contorno(c,'#3a2414');},
  ponteTabuas(n){const w=n*16,c=cnv(w,22),g=ctx2(c);for(let x=0;x<w;x+=4){P.r(g,x,4,3,14,x%8?'#9a6a42':'#8a5a32');P.p(g,x+1,6,'#5a3a20');}P.r(g,0,2,w,2,'#6a4a2a');P.r(g,0,18,w,2,'#6a4a2a');
    for(let x=0;x<w;x+=16){P.r(g,x,0,3,6,'#5a3a20');P.r(g,x,16,3,6,'#5a3a20');}return c;},
  /* decalques de chão (sem contorno grosso: são quase planos) */
  cacos(v){const c=cnv(14,8),g=ctx2(c),C=['#c8743a','#b8a07a','#7a8a9a'][v%3];P.r(g,1,3,4,3,C);P.r(g,7,1,3,3,tom(C,-0.2));P.r(g,10,5,3,2,C);P.p(g,2,3,tom(C,0.3));return c;},
  pedrinhas(v){const c=cnv(12,6),g=ctx2(c);for(let i=0;i<4;i++){const x=(i*3+v*2)%10,y=(i*2+v)%4;P.r(g,x,y+1,2,1,i%2?'#a07a52':'#8a6644');P.p(g,x,y,'#c09a6a');}return c;},
  flores(v){const c=cnv(10,7),g=ctx2(c),C=['#ff7a9a','#ffd24a','#ffffff','#c9a6ff'][v%4];for(let i=0;i<3;i++){const x=1+i*3,y=2+(i%2);P.p(g,x,y+2,'#5a8a3a');P.p(g,x,y,C);P.p(g,x+1,y,tom(C,-0.2));}return c;},
  racha(v){const c=cnv(16,8),g=ctx2(c);P.linha(g,0,4,5,3,'#a8845a');P.linha(g,5,3,9,5,'#a8845a');P.linha(g,9,5,15,2+(v%3),'#a8845a');return c;},
  engrChao(v){const c=cnv(12,8),g=ctx2(c);P.elip(g,6,4,5,3,'#8a6a3a');P.elip(g,6,4,3,1.6,'#b8883a');P.p(g,6,4,'#5a4424');for(let k=0;k<6;k++)P.p(g,Math.round(6+Math.cos(k)*5),Math.round(4+Math.sin(k)*3),'#d8a24a');return c;}
});
/* textura da névoa (feita uma vez): manchas em meio-tom que deslizam com o vento */
let NEVOA=null;
function texturaNevoa(){if(NEVOA)return NEVOA;const c=cnv(192,96),g=ctx2(c),r=rng(9);for(let i=0;i<9;i++){const cx=r()*192,cy=r()*96,rx=30+r()*40,ry=8+r()*10;
  for(let y=Math.floor(cy-ry);y<cy+ry;y++)for(let x=Math.floor(cx-rx);x<cx+rx;x++){const d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<1&&((x+y)&1)===0&&r()<1-d*0.7){g.fillStyle='#f4eee2';g.fillRect(((x%192)+192)%192,((y%96)+96)%96,1,1);}}}
  NEVOA=c;return c;}
/* monta a ambientação; recebe os ajudantes de construirVale (lugar livre, reservas, objetos com sombra) */
function ambientarVale(A,H){
  const{por,lugar,pode,reserva,R:rnd}=H;
  VALE.pois={};VALE.braseiros=[];VALE.arvores=[];
  const ponto=(x,y,img,o)=>por(x,y,img,o);
  /* ---------- pontos de interesse ---------- */
  const POS={};
  const poi=(id,x,y,r,fn)=>{let ok=false;lugar(x,y,r,(x2,y2)=>{POS[id]={x:x2,y:y2};fn(x2,y2);ok=true;});if(!ok){POS[id]={x,y};fn(x,y);}};
  poi('acamp',POIS[0].x,POIS[0].y,3,(x,y)=>{ponto(x,y,SPR.get('tendaRasgada'),{col:[-16,-10,16,0]});ponto(x+2.2,y+1.4,SPR.get('fogueiraFria'),{});ponto(x-2,y+1.2,SPR.get('caixaLote'),{col:[-6,-4,6,0]});A.decalques.push({img:SPR.get('cacos',1),x:(x+1)*16,y:(y+2)*16});});
  /* a ponte fica onde a trilha azul-gelo cruza o rio seco */
  {const P0=TRILHAS.diesel,ax=P0[1][0],ay=P0[1][1],bx=P0[2][0],by=P0[2][1],xm=61,ym=ay+(by-ay)*(ax-xm)/(ax-bx);POS.ponte={x:xm,y:ym+1.2};
    A.decalques.push({img:SPR.get('ponteTabuas',6),x:(xm-3)*16,y:(ym-0.6)*16});reserva(xm,ym,3);}
  poi('observ',POIS[2].x,POIS[2].y,3.2,(x,y)=>ponto(x,y,SPR.get('observatorio'),{col:[-26,-10,26,0]}));
  poi('estatua',POIS[3].x,POIS[3].y,1.6,(x,y)=>ponto(x,y,SPR.get('estatuaEngenheira'),{col:[-10,-6,10,0]}));
  poi('poco',POIS[4].x,POIS[4].y,1.8,(x,y)=>ponto(x,y,SPR.get('poco'),{col:[-12,-8,12,0]}));
  poi('carroca',POIS[5].x,POIS[5].y,2.6,(x,y)=>{ponto(x,y,SPR.get('carroca'),{col:[-22,-8,22,0]});for(let i=0;i<4;i++)A.decalques.push({img:SPR.get('engrChao',i),x:(x-2+i*1.3)*16,y:(y+0.8+(i%2)*0.6)*16});});
  for(const d of POIS){const p=POS[d.id];VALE.pois[d.id]=p;
    interacao(A,{x:p.x*16,y:p.y*16+8,r:24,alto:40,label:()=>G.poi[d.id]?d.t:'Examinar: '+d.t,use:()=>visitarPoi(d)});}
  /* ---------- Estrada das Eras: braseiros e estátuas pequenas ---------- */
  for(let ty=136;ty>=50;ty-=16)for(const tx of[85.2,95.8]){const o=ponto(tx,ty,SPR.get('braseiro',0),{col:[-5,-4,5,0]});o.frames=[0,1,2].map(f=>SPR.get('braseiro',f));o.fps=7;VALE.braseiros.push(o);reserva(tx,ty,1);}
  /* ---------- árvores (perto do oásis, das trilhas e das tumbas vivas) ---------- */
  const arvore=(x,y)=>lugar(x,y,1.8,(x2,y2)=>{VALE.arvores.push(ponto(x2,y2,SPR.get('acacia',(VALE.arvores.length)%4),{col:[-4,-3,4,0],sombra:[16,4,0.2]}));});
  for(const[x,y]of[[70,140],[56,152],[73,150],[49,147],[100,140],[80,138],[118,120],[130,140],[60,118],[44,100],[104,92],[76,92],[112,108],[68,76],[118,78],[100,60],[80,58],[134,100],[46,124],[150,124],[140,82],[40,64]])arvore(x+(rnd()-0.5)*2,y+(rnd()-0.5)*2);
  /* ---------- ruínas: arcos quebrados, colunas e muros a mais ---------- */
  [[98,96],[70,112],[124,104],[58,92],[110,130],[84,66]].forEach(([x,y],i)=>lugar(x,y,2.8,(x2,y2)=>ponto(x2,y2,SPR.get('arcoQuebrado',i),{col:[-24,-6,-16,0]})));
  [[64,100,3],[116,96,4],[92,108,3],[52,116,4],[132,72,3],[74,128,3]].forEach(([x,y,l],i)=>lugar(x,y,l*0.5+0.8,(x2,y2)=>ponto(x2,y2,SPR.get('muro',l,i+20),{col:[-l*4,-6,l*4,0]})));
  for(const[x,y]of[[106,124],[62,72],[128,86],[50,134],[96,74]])lugar(x,y,2.4,(x2,y2)=>ponto(x2,y2,SPR.get('colunaCaida'),{col:[-18,-6,18,0]}));
  for(const[x,y,e]of[[110,100,'steam'],[72,96,'diesel'],[70,122,'atom'],[116,118,'bio'],[100,84,'steam'],[78,108,'atom']])lugar(x,y,1,(x2,y2)=>ponto(x2,y2,SPR.get('coluna',e),{col:[-6,-4,6,0]}));
  /* ---------- acampamento de caravana (com fogo) a meio caminho da Tumba Viva ---------- */
  lugar(118,136,4,(x,y)=>{ponto(x,y,SPR.get('tenda','#b9533a'),{col:[-16,-10,16,0]});const f=ponto(x+3,y+1.5,SPR.get('fogueira',0),{col:[-6,-4,6,1]});f.frames=[0,1,2].map(k=>SPR.get('fogueira',k));f.fps=6;VALE.fogo.push(f);ponto(x-2.5,y+1.5,SPR.get('caixaLote'),{col:[-6,-4,6,0]});});
  /* ---------- chão: cacos, engrenagens, pedrinhas, flores e rachaduras ---------- */
  for(let i=0;i<620;i++){const a=rnd()*TAU,d=6+Math.sqrt(rnd())*70,x=VALE_C+Math.cos(a)*d,y=VALE_C+Math.sin(a)*d;if(!pode(x,y,0.1))continue;const q=rnd();
    const img=q<0.32?SPR.get('pedrinhas',(rnd()*4)|0):q<0.5?SPR.get('racha',(rnd()*3)|0):q<0.66?SPR.get('flores',(rnd()*4)|0):q<0.82?SPR.get('cacos',(rnd()*3)|0):SPR.get('engrChao',(rnd()*4)|0);
    A.decalques.push({img,x:x*16,y:y*16});}
  for(let i=0;i<80;i++){const a=rnd()*TAU,d=5.5+rnd()*2.5,x=62+Math.cos(a)*d*1.15,y=146+Math.sin(a)*d*0.9;if(pode(x,y,0.1))A.decalques.push({img:SPR.get('flores',(rnd()*4)|0),x:x*16,y:y*16});}
}
/* rio seco: uma faixa de cascalho de norte a sul, a oeste da estrada (antes dos objetos, para nada nascer nele) */
function leitoSeco(A){
  for(let ty=60;ty<112;ty++){const c=61+2.6*Math.sin(ty*0.13)+1.2*Math.sin(ty*0.37);
    for(let tx=Math.floor(c-3);tx<=Math.ceil(c+3);tx++){const k=A.kind(tx,ty);if(Math.abs(tx+0.5-c)<2.1&&(k==='areia'||k==='duna'||k==='trilha'))A.set(tx,ty,'leito');}}
}
function visitarPoi(d){
  const novo=!G.poi[d.id];G.poi[d.id]=true;addDiary('poi_'+d.id,true);
  if(d.id==='poco')SFX.poco();else SFX.insc();
  const p=VALE.pois[d.id];if(novo&&p)faiscas(p.x*16,p.y*16-20,10,['#fff6c0','#ffd24a']);
  toast(d.t+': '+d.s+(novo?' (Lugares visitados: '+POI_IDS.filter(k=>G.poi[k]).length+'/'+POI_IDS.length+'.)':''),novo?'good':'');
  if(novo)salvar(false);
}
/* a cada quadro no vale: partículas de ambiente e a distância do fogo e da água (para o som) */
function ambienteVale(dt,t){
  const n=noiteAgora(),p=G.p;
  const W=R.W,Hh=R.H,ox=-R.ox,oy=-R.oy;
  /* poeira levada pelo vento (de dia) */
  if(n<0.4&&Math.random()<dt*7)particula({x:ox+Math.random()*W,y:oy+Math.random()*Hh,z:3+Math.random()*10,vx:14+Math.random()*10,vy:(Math.random()-0.5)*3,vz:(Math.random()-0.5)*2,vida:2.5+Math.random()*1.5,cor:'#f6e2b8',fade:true});
  /* vaga-lumes à noite, perto das árvores e do oásis */
  if(n>0.45&&Math.random()<dt*10){const a=VALE.arvores[(Math.random()*VALE.arvores.length)|0];const nearOasis=Math.hypot(p.x/16-62,p.y/16-146)<20;
    const bx=nearOasis&&Math.random()<0.5?(62+(Math.random()-0.5)*14)*16:a?a.x+(Math.random()-0.5)*40:null,by=nearOasis&&Math.random()<0.5?(146+(Math.random()-0.5)*10)*16:a?a.y-10+(Math.random()-0.5)*24:null;
    if(bx!==null&&naTela(bx,by))particula({x:bx,y:by,z:4+Math.random()*12,vx:(Math.random()-0.5)*8,vy:(Math.random()-0.5)*6,vz:(Math.random()-0.5)*4,vida:2+Math.random()*2,cores:['#e8ff8a','#c8ff5a','#4a6a2a','#e8ff8a'],fade:true});}
  /* brasas dos braseiros e folhas das árvores */
  if(Math.random()<dt*6){const b=VALE.braseiros[(Math.random()*VALE.braseiros.length)|0];if(b&&naTela(b.x,b.y))particula({x:b.x+(Math.random()-0.5)*4,y:b.y,z:22,vz:16+Math.random()*10,vx:(Math.random()-0.5)*6,vida:0.8,cores:['#fff2a0','#ffb43a','#ff7a20','#5a2a10'],fade:true});}
  if(Math.random()<dt*1.5){const a=VALE.arvores[(Math.random()*VALE.arvores.length)|0];if(a&&naTela(a.x,a.y))particula({x:a.x+(Math.random()-0.5)*30,y:a.y-2,z:26+Math.random()*8,vz:-6,vx:8+Math.random()*6,g:4,vida:3,cor:Math.random()<0.5?'#7aaa4a':'#c8a04a'});}
  /* som: perto do fogo e da água */
  let fogo=0;for(const o of VALE.fogo.concat(VALE.braseiros)){const d=Math.hypot(o.x-p.x,o.y-p.y);if(d<120)fogo=Math.max(fogo,1-d/120);}AU.fogo=fogo;
  AU.agua=clamp(1-(Math.hypot(p.x/16-62,p.y/16-146)-4)/14,0,1);
}
/* névoa: forte no começo da manhã, fraca à noite; desliza com o vento */
function nevoaVale(g,t){
  const manha=clamp(1-Math.abs(G.time-0.06)/0.09,0,1),a=manha*0.32+noiteAgora()*0.08;if(a<0.02)return;
  const tx=texturaNevoa(),w=tx.width,h=tx.height,dx=((Math.floor(t*6)+R.ox*0.6)%w+w)%w,dy=((Math.floor(R.oy*0.6))%h+h)%h;
  g.globalAlpha=a;for(let y=-dy;y<R.H;y+=h)for(let x=-dx;x<R.W;x+=w)g.drawImage(tx,Math.round(x),Math.round(y));g.globalAlpha=1;
}
