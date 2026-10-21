/* ====================== objetos do cenário (pixel art por código) ======================
   Cada função devolve um canvas com contorno escuro; a âncora padrão é o meio da base (onde o objeto toca o chão).
   SPR.get(nome, ...) guarda o resultado para não redesenhar. */
const SPR={c:new Map(),get(nome,...a){const k=nome+'|'+a.join(',');let s=this.c.get(k);if(!s){s=OBJS[nome](...a);this.c.set(k,s);}return s;}};
const OBJS={
  /* ---------- vale ---------- */
  tenda(cor){
    const c=cnv(42,32),g=ctx2(c),C=cor||'#d7c39a',E=tom(C,-0.25),D=tom(C,-0.45);
    for(let y=0;y<26;y++){const w=Math.round(4+y*1.4);P.r(g,21-w,4+y,w,1,E);P.r(g,21,4+y,w,1,C);}
    P.r(g,20,2,2,26,'#5a3a20');P.linha(g,21,3,3,29,D);P.linha(g,21,3,39,29,tom(C,0.15));
    for(let y=0;y<14;y++){const w=Math.round(2+y*0.6);P.r(g,21-w,16+y,w*2,1,'#2a1a10');}
    P.r(g,19,28,6,1,'#2a1a10');P.p(g,21,1,'#b8392a');P.r(g,22,0,4,2,'#b8392a');
    return contorno(c,'#24160d');
  },
  fogueira(f){
    const c=cnv(18,22),g=ctx2(c);
    for(let i=0;i<7;i++){const a=i/7*TAU;P.r(g,Math.round(9+Math.cos(a)*6)-1,Math.round(17+Math.sin(a)*3)-1,3,2,i%2?'#8a7a6a':'#6a5a4a');}
    P.r(g,4,16,10,2,'#5a3a20');P.r(g,6,15,6,1,'#7a4a28');
    const fl=[[0,0],[1,-1],[0,1]][f%3];
    P.elip(g,9+fl[0],12,4,5+fl[1],'#ff7a20');P.elip(g,9,13,3,3.5,'#ffb43a');P.elip(g,9-fl[0],14,1.6,2,'#fff2a0');P.p(g,8+f%2,5+fl[1],'#ff9a3a');
    return contorno(c,'#24160d');
  },
  mesa(){const c=cnv(22,16),g=ctx2(c);P.r(g,1,4,20,7,'#7a4a2a');P.r(g,1,4,20,2,'#9a6236');P.r(g,2,11,2,4,'#5a3420');P.r(g,18,11,2,4,'#5a3420');
    P.r(g,6,2,9,4,'#ecdcb4');P.r(g,10,2,1,4,'#c4b087');P.r(g,7,3,2,1,'#8a6a4a');P.r(g,12,3,2,1,'#8a6a4a');P.r(g,16,1,2,4,'#3a2a1a');return contorno(c,'#24160d');},
  bandeira(){const c=cnv(16,34),g=ctx2(c);P.r(g,2,1,2,32,'#5a3a20');P.r(g,4,2,10,7,'#b8392a');P.r(g,4,2,10,2,'#d8583a');P.p(g,9,5,'#ffd24a');return contorno(c,'#24160d');},
  palmeira(v){
    const c=cnv(40,52),g=ctx2(c),r=rng(30+v);
    let x=19,y=50;for(let i=0;i<9;i++){const nx=19+Math.round(Math.sin(i*0.4+v)*2*(i/9));P.r(g,nx-2,y-4,5,4,i%2?'#7a5232':'#8e6238');P.r(g,nx-2,y-4,1,4,'#5a3a20');y-=4;x=nx;}
    P.circ(g,x,y,3,'#5a3a20');
    for(let k=0;k<7;k++){const a=-Math.PI/2+(k-3)*0.55+(r()-0.5)*0.2,L=12+r()*6;
      for(let s=0;s<L;s++){const t=s/L,px=x+Math.cos(a)*s,py=y+Math.sin(a)*s+t*t*9;P.r(g,Math.round(px)-1,Math.round(py),3,2,s<L*0.4?'#4a8a3a':'#3a7a30');if(s%3===1)P.p(g,Math.round(px),Math.round(py)+2,'#2a5a24');}}
    P.p(g,x-2,y+2,'#8a5a2a');P.p(g,x+2,y+3,'#8a5a2a');
    return contorno(c,'#1a2a10');
  },
  arbusto(v){const c=cnv(18,14),g=ctx2(c),C=v%2?'#7a8a3a':'#8a9a48';P.elip(g,9,9,7,4.5,tom(C,-0.25));P.elip(g,8,7,5,3.5,C);P.p(g,6,6,tom(C,0.3));P.p(g,11,7,tom(C,0.3));if(v%3===0){P.p(g,4,8,'#e05a4a');P.p(g,13,9,'#e05a4a');}return contorno(c,'#2a2410');},
  capim(v){const c=cnv(12,10),g=ctx2(c);for(let i=0;i<5;i++){const x=2+i*2;P.linha(g,x,9,x+(i%2?1:-1),3+(i*v)%3,i%2?'#a89a4a':'#8a7a3a');}return c;},
  cacto(v){const c=cnv(16,22),g=ctx2(c);P.r(g,6,3,5,18,'#5a8a3a');P.r(g,6,3,2,18,'#7aaa4a');P.r(g,2,8,3,6,'#5a8a3a');P.r(g,2,13,5,2,'#5a8a3a');P.r(g,12,6,3,7,'#5a8a3a');P.r(g,10,12,4,2,'#5a8a3a');
    for(let i=0;i<5;i++)P.p(g,9,5+i*3,'#d8e8a0');if(v%2)P.r(g,7,1,3,2,'#ff7a9a');return contorno(c,'#1a2a10');},
  pedra(t,v){const s=[6,9,13][t],c=cnv(s*2+4,s+6),g=ctx2(c),C=['#b8895a','#a57848','#c89a68'][v%3];
    P.elip(g,s+2,s/2+3,s,s/2+1,tom(C,-0.28));P.elip(g,s+1,s/2+2,s-2,s/2-1,C);P.r(g,s-2,3,3,1,tom(C,0.25));if(t>0)P.linha(g,s+2,4,s+4,s/2+3,tom(C,-0.35));return contorno(c,'#3a2414');},
  coluna(era){
    const c=cnv(16,44),g=ctx2(c);
    if(era==='steam'){P.r(g,3,4,10,38,'#b8703a');P.r(g,3,4,3,38,'#d08a4a');P.r(g,11,4,2,38,'#8a5028');for(const y of[10,22,34])P.r(g,2,y,12,2,'#d8a24a');P.engrenagem(g,8,5,5,8,'#d8a24a','#8a6a26',1.2);}
    else if(era==='diesel'){P.r(g,1,36,14,6,'#3a3f48');P.r(g,3,6,10,30,'#4a505c');P.r(g,3,6,3,30,'#5a606c');P.r(g,1,2,14,5,'#3a3f48');P.r(g,7,8,2,26,'#cfd8e0');}
    else if(era==='atom'){P.r(g,4,6,8,36,'#e9e4d4');P.r(g,4,6,2,36,'#ffffff');P.r(g,10,6,2,36,'#c8c2b0');P.r(g,3,20,10,2,'#5dff7a');P.circ(g,8,5,4.5,'#ff9a3a');P.p(g,6,3,'#ffd0a0');}
    else{for(let k=0;k<3;k++)P.r(g,4+k*3,4+k,3,38-k,['#7a5aa8','#8a64b8','#6a4a98'][k]);for(let k=0;k<4;k++)P.circ(g,5+k*2,10+k*8,1.6,'#c9a6ff');}
    return contorno(c,'#24160d');
  },
  engrenagemGrande(){const c=cnv(52,34),g=ctx2(c);P.engrenagem(g,26,24,22,14,'#8a6a3a','#5a4424',7);P.circ(g,26,24,4,'#3a2a14');P.anel(g,26,24,15,2,'#6a5030');
    P.r(g,0,28,52,6,'#d8b077');P.elip(g,26,29,26,4,'#e2bd84');P.r(g,10,27,6,1,'#c0955f');return contorno(c,'#24160d');},
  dirigivel(){const c=cnv(104,40),g=ctx2(c);P.elip(g,52,20,48,14,'#6f7468');P.elip(g,50,16,44,8,'#8a9084');for(let i=-3;i<=3;i++)P.r(g,52+i*12,6,2,28,'#4a4f48');
    P.r(g,4,12,10,3,'#4a4f48');P.r(g,2,8,3,12,'#4a4f48');P.elip(g,40,34,30,4,'#d8b077');P.r(g,70,18,22,10,'#2a2a28');P.p(g,74,20,'#5a5a50');return contorno(c,'#1a1a18');},
  antena(h){const c=cnv(22,h+6),g=ctx2(c);P.linha(g,11,2,4,h+4,'#cfcab8');P.linha(g,11,2,18,h+4,'#cfcab8');for(let y=8;y<h;y+=7){const w=Math.round((y/h)*7);P.r(g,11-w,y,w*2+1,1,'#a8a490');P.linha(g,11-w,y,11+w,y+7,'#a8a490');}
    P.circ(g,11,3,2,'#ff4a3a');P.p(g,10,2,'#ffc0b0');return contorno(c,'#24160d');},
  estufa(cor){const c=cnv(48,38),g=ctx2(c),V=cor||'#9fe8d0';
    P.r(g,2,10,44,24,'#7a7a72');g.globalAlpha=0.35;P.r(g,4,6,40,26,V);g.globalAlpha=1;for(const x of[4,16,28,40])P.r(g,x,6,2,28,'#8a8f8a');P.r(g,4,6,38,2,'#8a8f8a');P.r(g,2,32,44,2,'#5a5a52');
    for(let i=0;i<7;i++)P.circ(g,8+i*5.5,28-(i%2)*3,3,i%2?'#4a8a3a':'#6aa84a');P.linha(g,30,8,40,20,'#ffffff');return contorno(c,'#24160d');},
  caldeiraRuina(){const c=cnv(44,26),g=ctx2(c);P.r(g,4,6,36,16,'#7a4a2a');P.r(g,4,6,36,4,'#9a6236');for(const x of[10,22,34])P.r(g,x,5,3,18,'#b07a3a');P.circ(g,40,14,7,'#6a3a1a');P.circ(g,40,14,4,'#2a1a10');
    P.elip(g,22,23,22,3,'#d8b077');return contorno(c,'#24160d');},
  torreDiesel(){const c=cnv(40,58),g=ctx2(c);P.r(g,3,36,34,20,'#4a505c');P.r(g,9,18,22,20,'#5a606c');P.r(g,14,4,12,16,'#6a707c');P.r(g,3,36,34,3,'#6a707c');P.r(g,9,18,22,3,'#7a828e');
    P.r(g,18,8,2,46,'#cfd8e0');for(const[x,y]of[[6,44],[30,44],[12,26],[26,26]])P.r(g,x,y,3,4,'#1a2a3a');return contorno(c,'#141418');},
  estatuaAutomato(){const c=cnv(32,40),g=ctx2(c);P.r(g,6,30,20,8,'#8a7a62');P.r(g,6,30,20,2,'#a8987a');P.elip(g,16,22,8,8,'#b08a3a');P.circ(g,18,12,6,'#c59a3e');P.p(g,16,11,'#4a2a10');P.p(g,20,11,'#4a2a10');
    P.linha(g,8,20,2,10,'#b08a3a');P.linha(g,9,20,3,10,'#b08a3a');P.engrenagem(g,16,22,4,6,'#8e6a26','#5e4418',1);return contorno(c,'#24160d');},
  estela(seed,brilho){const c=cnv(18,30),g=ctx2(c),r=rng(seed);P.r(g,1,26,16,4,'#6a5c48');P.r(g,3,2,12,25,'#8a7a62');P.r(g,3,2,12,2,'#a8987a');P.r(g,13,2,2,25,'#6e604c');
    const gl=brilho?'#ffb455':'#4a3a28';for(let y=6;y<24;y+=4){let x=5;while(x<12){const L=1+(r()*3|0);P.r(g,x,y,L,1,gl);if(r()>0.5)P.p(g,x,y-1,gl);x+=L+1;}}
    return contorno(c,'#24160d');},
  bau(aberto){const c=cnv(20,18),g=ctx2(c);P.elip(g,10,15,10,3,'#c89a62');
    if(aberto){P.r(g,3,2,14,5,'#5a3420');P.r(g,3,2,14,1,'#7a4a2a');P.r(g,3,8,14,7,'#6b4326');P.r(g,4,8,12,3,'#2a1a10');P.r(g,6,9,8,2,'#ffd24a');}
    else{P.r(g,3,5,14,10,'#6b4326');P.r(g,3,5,14,3,'#8a5a32');P.r(g,6,5,2,10,'#8a7a52');P.r(g,12,5,2,10,'#8a7a52');P.r(g,9,8,2,3,'#d8a24a');}
    return contorno(c,'#24160d');},
  fragmento(){const c=cnv(14,12),g=ctx2(c);P.r(g,1,2,12,8,'#e6d3a2');P.p(g,1,2,'#00000000');P.r(g,3,4,6,1,'#8a6a3a');P.r(g,3,6,4,1,'#8a6a3a');P.p(g,10,4,'#b8392a');P.p(g,9,5,'#b8392a');P.p(g,11,5,'#b8392a');P.p(g,10,6,'#b8392a');return contorno(c,'#4a3320');},
  marco(cor){const c=cnv(14,18),g=ctx2(c);P.elip(g,7,14,6,3,'#8a7a62');P.elip(g,7,10,5,3,'#a8987a');P.elip(g,7,6,3.5,2.5,'#bfae8c');P.r(g,6,1,2,6,'#5a3a20');P.r(g,8,1,5,3,cor);P.p(g,12,4,cor);return contorno(c,'#24160d');},
  placaTrilha(cor){const c=cnv(22,24),g=ctx2(c);P.r(g,10,8,2,15,'#5a3a20');P.r(g,2,3,18,7,'#9a6236');P.r(g,2,3,18,2,'#b8783e');P.r(g,4,6,12,1,'#3a2414');P.r(g,16,4,3,5,cor);return contorno(c,'#24160d');},
  /* entrada de tumba: fachada de pedra com porta escura e o olho da era; a torre fica atrás */
  entrada(era){
    const c=cnv(96,64),g=ctx2(c),E={steam:['#7a4a2a','#9a6236','#c8743a'],diesel:['#4a505c','#5a606c','#6fd3ff'],atom:['#cfc9b4','#e9e4d4','#5dff7a'],bio:['#6a4a8a','#7a5aa0','#b98cff']}[era];
    P.r(g,4,18,88,44,E[0]);P.r(g,4,10,88,10,E[1]);P.r(g,4,10,88,2,tom(E[1],0.25));
    for(let y=22;y<60;y+=6)for(let x=(y%12?4:10);x<90;x+=12)P.r(g,x,y,1,6,tom(E[0],-0.25));for(let y=22;y<60;y+=6)P.r(g,4,y,88,1,tom(E[0],-0.2));
    P.r(g,8,14,12,48,E[1]);P.r(g,76,14,12,48,E[1]);P.r(g,8,14,3,48,tom(E[1],0.2));P.r(g,76,14,3,48,tom(E[1],0.2));
    P.r(g,34,30,28,32,'#050403');P.r(g,32,28,32,3,E[1]);P.r(g,30,24,36,4,E[2]);
    P.elip(g,48,18,7,4,E[2]);P.elip(g,48,18,4,2.5,'#fff6dc');P.circ(g,48,18,1.6,'#24160d');
    return contorno(c,'#0b0705');
  },
  torre(era){
    const c=cnv(48,104),g=ctx2(c);
    if(era==='steam'){P.r(g,14,20,20,82,'#b8703a');P.r(g,14,20,6,82,'#d08a4a');P.r(g,30,20,4,82,'#8a5028');for(const y of[40,62,84])P.r(g,12,y,24,3,'#d8a24a');P.engrenagem(g,24,22,13,12,'#d8a24a','#8a6a26',3);}
    else if(era==='diesel'){P.r(g,8,60,32,42,'#4a505c');P.r(g,13,30,22,32,'#5a606c');P.r(g,17,10,14,22,'#6a707c');P.r(g,23,12,2,88,'#cfd8e0');g.globalAlpha=0.5;P.r(g,15,2,18,10,'#6fd3ff');g.globalAlpha=1;}
    else if(era==='atom'){for(let k=0;k<3;k++)P.linha(g,14+k*10,102,20+k*4,14,'#cfc9b4'),P.linha(g,15+k*10,102,21+k*4,14,'#e9e4d4');for(const y of[30,52,74,92])P.r(g,13,y,22,3,'#ff9a3a');}
    else{for(let k=0;k<4;k++)P.r(g,12+k*6,10+k*2,6,92-k*2,['#7a5aa8','#8a64b8','#6a4a98','#7a5aa8'][k]);for(let k=0;k<6;k++)P.circ(g,14+(k%3)*9,24+k*13,2.5,'#c9a6ff');}
    return contorno(c,'#0b0705');
  },
  orbe(cor,f){const c=cnv(16,16),g=ctx2(c),k=f%2;P.circ(g,8,8,6+k*0.5,cor);P.circ(g,7,7,3,tom(cor,0.5));P.p(g,6,5,'#ffffff');return c;},
  /* pirâmide da Cidade-Jardim: degraus, vegetação, faixas azuis, olho dourado e a porta com quatro encaixes */
  piramide(){
    const W=360,H=232,c=cnv(W,H),g=ctx2(c),r=rng(77);
    for(let s=0;s<14;s++){const y0=H-16-s*15,w=Math.round(W/2-8-s*12);P.r(g,W/2-w,y0-15,w*2,15,s%2?'#e9dcbc':'#e2d4b0');P.r(g,W/2-w,y0-15,w*2,2,'#f6ecd0');P.r(g,W/2-w,y0-2,w*2,2,'#b8aa88');
      if(s%3===1){P.r(g,W/2-w+6,y0-9,w*2-12,3,'#2a4a7a');}}
    for(let i=0;i<60;i++){const s=(r()*13)|0,y0=H-16-s*15,w=W/2-8-s*12,x=W/2-w+r()*w*2;P.elip(g,x,y0-3,3+r()*4,2+r()*2,r()<0.6?'#4a9a4a':'#78b84a');}
    P.circ(g,W/2,H-150,14,'#d8a24a');P.elip(g,W/2,H-150,10,6,'#fff6dc');P.circ(g,W/2,H-150,3.5,'#24160d');
    P.r(g,W/2-30,H-74,60,74,'#d8c9a0');P.r(g,W/2-30,H-74,60,3,'#f0e4c0');P.r(g,W/2-16,H-44,32,44,'#070605');P.r(g,W/2-20,H-50,40,4,'#ffd24a');
    return contorno(c,'#24160d');
  },
  encaixe(cor){const c=cnv(10,10),g=ctx2(c);P.circ(g,5,5,4.5,'#2a2a2a');if(cor){P.circ(g,5,5,3.5,cor);P.p(g,3,3,'#ffffff');}return contorno(c,'#0b0705');},
  /* ---------- estruturas extras do vale (como no 3D: uma por era, perto da tumba da mesma era) ---------- */
  chamine(){const c=cnv(14,40),g=ctx2(c);P.r(g,3,4,8,34,'#8a4a2a');P.r(g,3,4,2,34,'#a8603a');for(let y=8;y<36;y+=5)P.r(g,3,y,8,1,'#6a3a1e');P.r(g,2,2,10,3,'#5a3420');return contorno(c,'#24160d');},
  cano(){const c=cnv(44,14),g=ctx2(c);P.r(g,2,4,40,6,'#8a5028');P.r(g,2,4,40,2,'#b07a3a');for(const x of[8,22,36])P.r(g,x,3,3,8,'#d8a24a');P.r(g,2,10,40,2,'#5a3420');return contorno(c,'#24160d');},
  caminhao(){const c=cnv(48,26),g=ctx2(c);P.r(g,4,6,28,14,'#5a6a58');P.r(g,4,6,28,3,'#6f8070');P.r(g,32,10,12,10,'#4a5a48');P.r(g,34,11,6,4,'#2a3a3a');for(const x of[10,24,38])P.circ(g,x,21,4,'#2a2a2a'),P.circ(g,x,21,1.5,'#6a6a6a');P.r(g,8,8,4,2,'#8a3a2a');return contorno(c,'#141418');},
  poste(){const c=cnv(12,36),g=ctx2(c);P.r(g,5,6,2,28,'#3a3f48');P.r(g,2,2,8,5,'#4a505c');P.r(g,3,5,6,2,'#ffe9a0');P.r(g,3,33,6,2,'#3a3f48');return contorno(c,'#141418');},
  disco(){const c=cnv(30,30),g=ctx2(c);P.r(g,13,16,4,12,'#9a968a');P.r(g,8,26,14,3,'#8a8676');P.elip(g,15,11,12,8,'#e9e4d4');P.elip(g,15,11,8,5,'#cfc9b4');P.r(g,14,4,2,8,'#5a5850');P.circ(g,15,4,2,'#ff9a3a');return contorno(c,'#1a1a14');},
  bunker(){const c=cnv(52,30),g=ctx2(c);P.elip(g,26,18,24,11,'#b8b2a0');P.elip(g,26,15,20,8,'#cfc9b4');P.r(g,18,16,16,8,'#3a3a32');P.r(g,6,20,40,2,'#ff9a3a');P.r(g,22,4,8,3,'#9a968a');return contorno(c,'#1a1a14');},
  cogumelo(v){const c=cnv(20,24),g=ctx2(c),C=v%2?'#c9a6ff':'#a47ae6';P.r(g,8,10,4,13,'#e9dcf0');P.elip(g,10,9,9,6,C);P.elip(g,10,7,7,3,tom(C,0.25));P.p(g,6,8,'#ffffff');P.p(g,13,6,'#ffffff');return contorno(c,'#2a1a40');},
  arcoRaiz(){const c=cnv(44,36),g=ctx2(c);for(let i=0;i<30;i++){const a=Math.PI*(i/29),x=22-Math.cos(a)*18,y=34-Math.sin(a)*28;P.circ(g,x,y,3,i%2?'#6a4a8a':'#7a5aa0');}P.circ(g,22,7,2,'#c9a6ff');P.circ(g,10,16,1.5,'#5dff7a');return contorno(c,'#2a1a40');},
  painelSolar(){const c=cnv(40,20),g=ctx2(c);for(let i=0;i<3;i++){P.r(g,2+i*13,4,11,9,'#2a4a7a');P.r(g,3+i*13,5,9,1,'#6a9ad0');P.r(g,6+i*13,13,2,5,'#8a8676');}return contorno(c,'#141418');},
  cataVento(f){const c=cnv(28,44),g=ctx2(c);P.r(g,13,12,2,30,'#e9e4d4');const a=f*0.6;for(let k=0;k<3;k++){const b=a+k*TAU/3;P.linha(g,14,12,14+Math.cos(b)*11,12+Math.sin(b)*11,'#f0e8d0');P.linha(g,14,13,14+Math.cos(b)*10,13+Math.sin(b)*10,'#cfc29e');}P.circ(g,14,12,2,'#ffd24a');return contorno(c,'#24160d');},
  canteiro(v){const c=cnv(30,18),g=ctx2(c);P.r(g,2,4,26,12,'#8a6a44');P.r(g,4,6,22,8,'#5a4024');for(let i=0;i<6;i++){P.r(g,6+i*3.5,5,2,4,'#4a9a4a');P.p(g,6+i*3.5,4,['#ffd24a','#ff7a9a','#ffffff'][(i+v)%3]);}return contorno(c,'#24160d');},
  muro(len,v){const w=len*8+6,c=cnv(w,26),g=ctx2(c),r=rng(v);for(let i=0;i<len;i++){const h=8+Math.round(r()*12);P.r(g,3+i*8,24-h,8,h,i%2?'#bfae8c':'#a8987a');P.r(g,3+i*8,24-h,8,2,'#d8c8a4');}P.r(g,1,22,w-2,3,'#8a7a62');return contorno(c,'#3a2414');},
  colunaCaida(){const c=cnv(42,14),g=ctx2(c);P.r(g,4,3,34,8,'#cfc29e');P.r(g,4,3,34,2,'#e9dcbc');for(let x=8;x<38;x+=6)P.r(g,x,3,1,8,'#b8aa88');P.circ(g,38,7,4,'#b8aa88');return contorno(c,'#3a2414');},
  mesaRocha(v){const c=cnv(64,48),g=ctx2(c),r=rng(v+9);P.r(g,6,10,52,34,'#a87a52');P.r(g,6,10,52,6,'#c49a6a');for(let i=0;i<8;i++)P.r(g,8+r()*44,18+r()*22,4,2,'#8a6040');P.r(g,6,40,52,4,'#7a5434');
    for(let x=6;x<58;x+=4)P.r(g,x,8+Math.round(r()*3),4,3,'#c49a6a');return contorno(c,'#3a2414');},
  arvoreSeca(){const c=cnv(26,32),g=ctx2(c);P.r(g,12,14,3,17,'#6a4a2a');P.linha(g,13,16,5,6,'#6a4a2a');P.linha(g,13,18,22,8,'#6a4a2a');P.linha(g,8,10,6,3,'#6a4a2a');P.linha(g,19,11,23,5,'#6a4a2a');return contorno(c,'#24160d');},
  /* ---------- itens e ícones ---------- */
  coracao(cheio){return sprMapa(['.oo.oo.','oRRoRRo','oRrRRRo','oRRRRRo','.oRRRo.','..oRo..','...o...'].map(l=>cheio?l:l.replace(/[Rr]/g,'.')),{o:'#24160d',R:'#e8483a',r:'#ffb0a0'});},
  reliquia(k,estado){
    /* estado: 0 nenhuma (encaixe vazio), 1 adormecida (trazida do 3D), 2 desperta */
    const c=cnv(12,12),g=ctx2(c),cor={steam:'#c8743a',diesel:'#6fd3ff',atom:'#5dff7a',bio:'#b98cff'}[k];
    if(estado===0){P.anel(g,6,6,5,1,'#8a7a62');return c;}
    const C=estado===2?cor:mistura(cor,'#6a6a6a',0.7);
    if(k==='steam')P.engrenagem(g,6,6,5,8,C,tom(C,-0.4),1.2);
    else if(k==='diesel'){P.r(g,5,1,2,6,C);P.r(g,3,6,6,4,tom(C,-0.2));P.p(g,6,10,'#ffffff');}
    else if(k==='atom'){P.circ(g,6,6,2,C);P.anel(g,6,6,5,1,tom(C,-0.2));P.p(g,6,1,C);P.p(g,2,8,C);}
    else{P.elip(g,6,7,3,4,C);P.r(g,6,1,1,3,'#5dff7a');P.p(g,7,2,'#5dff7a');}
    return contorno(c,'#0b0705');
  },
  seta(cor){return sprMapa(['...o...','..oCo..','.oCCCo.','oCCCCCo','ooCCCoo','..oCo..','..ooo..'],{o:'#0b0705',C:cor||'#ffd24a'});},
  /* objetos de valor (dados): cada um com palavras e símbolos, não só cor */
  valor(icone){
    const c=cnv(24,24),g=ctx2(c);
    if(icone==='engr'){P.r(g,2,10,20,12,'#6b4326');P.r(g,2,10,20,2,'#8a5a32');for(let i=0;i<3;i++)P.engrenagem(g,6+i*6,8,3.5,6,'#d8a24a','#8a6a26',1);}
    else if(icone==='caixas'){P.r(g,2,8,9,8,'#a8783e');P.r(g,12,8,10,8,'#9a6a32');P.r(g,6,1,11,8,'#b8884a');P.r(g,2,8,9,1,'#c89a5a');P.linha(g,6,1,16,8,'#7a5228');}
    else if(icone==='galao'){P.r(g,5,5,14,17,'#c83a2a');P.r(g,5,5,4,17,'#e85a3a');P.r(g,14,1,4,5,'#7a2a1a');P.r(g,8,12,8,6,'#ffe9b0');}
    else if(icone==='frasco'){P.r(g,7,8,10,14,'#3a6a4a');P.r(g,7,8,3,14,'#5a9a6a');P.r(g,9,3,6,6,'#2a4a3a');P.r(g,8,13,8,6,'#e9f0d0');}
    else if(icone==='placa'){P.r(g,1,5,22,13,'#d8c9a0');P.r(g,1,5,22,2,'#f0e4c0');P.r(g,3,9,2,1,'#2a1a0e');P.r(g,19,9,2,1,'#2a1a0e');}
    else if(icone==='cartao'){P.r(g,2,4,20,16,'#e8e0c8');P.r(g,2,4,20,2,'#c8bfa0');for(let i=0;i<5;i++)P.r(g,4+i*4,7,2,2,'#5a5040');}
    else if(icone==='fusivel1'||icone==='fusivel0'){const on=icone==='fusivel1';P.r(g,5,2,14,20,'#3a3f48');P.r(g,8,5,8,14,on?'#ffd24a':'#5a5a5a');P.r(g,10,3,4,18,'#cfd8e0');if(on)P.p(g,12,11,'#ffffff');}
    else if(icone==='alavanca1'||icone==='alavanca0'){const on=icone==='alavanca1';P.r(g,3,16,18,6,'#4a505c');P.linha(g,12,17,on?5:19,on?4:4,'#8a6a3a');P.linha(g,13,17,on?6:20,on?4:4,'#8a6a3a');P.circ(g,on?5:19,4,2.5,on?'#ff5a3a':'#5dff7a');}
    else if(icone==='plaq'||icone==='plaqDec'){P.r(g,3,3,18,18,icone==='plaq'?'#cfc9b4':'#b8d8e8');P.r(g,3,3,18,2,'#ffffff');P.r(g,3,19,18,2,'#8a8676');}
    else P.r(g,4,4,16,16,'#888');
    return contorno(c,'#0b0705');
  }
};
