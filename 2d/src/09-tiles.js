/* ====================== tiles (16×16) ======================
   Cada área tem um tema (paleta) e usa os mesmos tipos de tile: chão, parede, vão, água etc. As paredes se montam
   sozinhas em visão 3/4: quando o tile de baixo não é parede, aparece a face (tijolos, chapas, tecido); senão aparece
   o topo, com a borda clara do lado que dá para o chão. O chão do vale é pintado pixel a pixel com ruído e ondas de
   duna, para não parecer uma grade. Os tiles são desenhados uma vez por pedaço do mapa (chunk) e guardados. */
const TEMA={
  vale:{areia:['#e2bd84','#d8b077','#ccA16a','#c0955f','#e9c991'],sombra:'#b0844f',estrada:['#c7b18a','#b39c76','#a08a66'],trilha:['#bf9466','#ab8258'],
    grama:['#7aa84a','#689a3e','#8cba56'],agua:['#3a86a8','#4a9cc0','#2e6e8e'],rocha:['#a07a52','#8a6644','#6e5034','#c09a6a'],borda:'#4a3320'},
  steam:{chao:['#5e4c3a','#665240','#57463a'],junta:'#3e3024',chao2:['#7a5a3a','#8a6a44'],parede:['#8a5432','#7a4a2a','#a8683e'],topo:'#3a2618',aresta:'#c8743a',vao:'#0e0906',bronze:'#d8a24a'},
  diesel:{chao:['#4a505c','#454b56','#50566a'],junta:'#33373f',chao2:['#5a606c','#666c78'],parede:['#3a3f48','#454b56','#5a606c'],topo:'#1e2126',aresta:'#6fd3ff',vao:'#08090b',bronze:'#cfd8e0'},
  atom:{chao:['#d8d2c0','#ccc6b4','#e2dccb'],junta:'#a8a290',chao2:['#b8c8b0','#a8bca0'],parede:['#e9e4d4','#d8d2c0','#ff9a3a'],topo:'#5a5850',aresta:'#5dff7a',vao:'#0a0e0a',bronze:'#ff9a3a'},
  bio:{chao:['#3e2c4c','#46324f','#382844'],junta:'#2a1c34',chao2:['#5a3e6a','#664a76'],parede:['#6a4a7a','#5a3a6a','#8a64a0'],topo:'#24162e',aresta:'#c9a6ff',vao:'#0a0610',bronze:'#5dff7a'},
  city:{chao:['#e8dcc0','#ded2b4','#f0e6cc'],junta:'#b8aa88',chao2:['#cfc2a0','#c4b694'],parede:['#f0e8d0','#e2d8bc','#cfc29e'],topo:'#6a7a5a',aresta:'#ffd24a',vao:'#1a2a1a',bronze:'#ffd24a',
    grama:['#6aa84a','#5c983e','#7ab856'],agua:['#4ab0d0','#5cc4e0','#3a92b0']}
};
/* tipos de tile: solido bloqueia; perigo diz o que acontece ao pisar (vao, agua) */
const TK={
  nada:{solido:true},chao:{},chao2:{},parede:{solido:true,parede:true},vao:{perigo:'vao'},agua:{perigo:'agua',agua:true},aguaRasa:{agua:true,lento:true},
  areia:{},duna:{},estrada:{},trilha:{},grama:{},leito:{},penhasco:{solido:true,parede:true},rad:{rad:true},grade:{},tapete:{},raiz:{},flor:{}
};

function corVar(lista,tx,ty,s){return lista[Math.floor(hash2(tx,ty,s)*lista.length)%lista.length];}
/* desenha um tile em (px,py) do canvas do chunk */
function desenharTile(g,A,tx,ty,px,py){
  const k=A.kind(tx,ty),T=TEMA[A.tema],h=hash2(tx,ty,7);
  const viz=(dx,dy)=>A.kind(tx+dx,ty+dy);
  switch(k){
    case'chao':case'chao2':case'tapete':case'grade':case'rad':case'raiz':case'flor':return chao(g,A,T,k,tx,ty,px,py,h,viz);
    case'parede':case'penhasco':return parede(g,A,T,k,tx,ty,px,py,h,viz);
    case'vao':{P.r(g,px,py,16,16,T.vao||'#000');const up=viz(0,-1);if(up!=='vao'&&up!=='parede'){P.r(g,px,py,16,5,tom(corBase(A,T,up,tx,ty-1),-0.45));P.r(g,px,py+5,16,1,'#000');}
      if(h<0.3){P.p(g,px+4+(h*30|0)%8,py+9,'#1a1410');}return;}
    case'agua':case'aguaRasa':{const C=T.agua||TEMA.vale.agua;P.r(g,px,py,16,16,k==='aguaRasa'?C[1]:C[0]);
      const up=viz(0,-1);if(up!=='agua'&&up!=='aguaRasa'&&up!=='parede'){P.r(g,px,py,16,3,tom(C[0],-0.35));P.r(g,px,py+3,16,1,C[1]);}
      for(let i=0;i<3;i++){const x=(hash2(tx,ty,20+i)*14)|0,y=4+((hash2(tx,ty,30+i)*11)|0);P.r(g,px+x,py+y,2,1,tom(C[0],0.12));}return;}
    case'areia':case'duna':case'estrada':case'trilha':case'grama':return valeChao(g,A,T,k,tx,ty,px,py,viz);
    case'leito':return leitoChao(g,tx,ty,px,py,viz);
    default:P.r(g,px,py,16,16,'#000');
  }
}
function corBase(A,T,k,tx,ty){
  if(k==='areia'||k==='duna'||k==='trilha'||k==='estrada')return TEMA.vale.areia[1];
  if(k==='grama')return(T.grama||TEMA.vale.grama)[0];
  return T.chao?T.chao[0]:'#555';
}
function chao(g,A,T,k,tx,ty,px,py,h,viz){
  const base=k==='chao2'||k==='tapete'?corVar(T.chao2,tx,ty,3):corVar(T.chao,tx,ty,3);
  P.r(g,px,py,16,16,base);
  const tema=A.tema;
  if(tema==='steam'){ /* lajes de pedra com juntas e manchas de ferrugem */
    P.r(g,px,py+15,16,1,T.junta);P.r(g,px+15,py,1,16,T.junta);P.r(g,px,py,16,1,tom(base,0.08));
    if(h<0.25){P.r(g,px+3,py+5,3,2,tom(base,-0.12));P.p(g,px+9,py+11,tom(base,-0.15));}
    if(k==='chao2'){P.r(g,px+2,py+2,12,12,tom(base,0.06));P.anel(g,px+8,py+8,5,1,T.bronze);P.circ(g,px+8,py+8,1.5,T.bronze);}
  }else if(tema==='diesel'){ /* chapas de aço rebitadas */
    P.r(g,px,py+15,16,1,T.junta);P.r(g,px+15,py,1,16,T.junta);
    for(const[x,y]of[[2,2],[12,2],[2,12],[12,12]])P.p(g,px+x,py+y,tom(base,0.25));
    if(h<0.18){P.elip(g,px+8,py+9,4,2,'#2a2a30');P.p(g,px+7,py+8,'#5a6a8a');}
    if(k==='grade'){P.r(g,px,py,16,16,'#2a2d33');for(let i=1;i<16;i+=3)P.r(g,px+i,py,1,16,'#5a606c');}
    if(k==='chao2'){P.r(g,px,py+7,16,2,'#c8a030');for(let i=0;i<16;i+=4)P.r(g,px+i,py+7,2,2,'#2a2a2a');}
  }else if(tema==='atom'){ /* ladrilhos brancos com rejunte e faixas verdes */
    P.r(g,px,py+15,16,1,T.junta);P.r(g,px+15,py,1,16,T.junta);P.r(g,px+7,py,1,16,tom(base,-0.06));P.r(g,px,py+7,16,1,tom(base,-0.06));
    if(k==='chao2'){P.r(g,px,py+6,16,4,'#3a4a3a');P.r(g,px,py+7,16,1,T.aresta);}
    if(k==='rad'){P.r(g,px,py,16,16,'#3a6a3a');P.ponti(g,px,py,16,16,'#4aa04a',(tx+ty)&1);if(h<0.5)P.p(g,px+(h*24|0)%14+1,py+(h*40|0)%14+1,'#9aff9a');}
  }else if(tema==='bio'){ /* carne roxa com veias e brilho */
    if(h<0.5){P.linha(g,px+(h*16|0),py,px+((h*37|0)%16),py+15,tom(base,0.12));}
    P.p(g,px+(h*13|0)%15,py+(h*29|0)%15,tom(base,0.2));
    if(k==='raiz'){P.r(g,px,py,16,16,base);P.linha(g,px,py+8,px+15,py+6+(h*4|0),'#5dff7a');P.p(g,px+5,py+7,'#c8ffc8');}
    if(k==='chao2'){P.elip(g,px+8,py+8,6,5,tom(base,0.1));P.elip(g,px+8,py+8,3,2,'#c9a6ff');}
  }else if(tema==='city'){ /* pedra clara com juntas suaves e musgo */
    P.r(g,px,py+15,16,1,T.junta);P.r(g,px+15,py,1,16,T.junta);P.r(g,px,py,16,1,tom(base,0.1));
    if(h<0.2){P.r(g,px+3,py+12,3,2,'#8aba6a');P.p(g,px+4,py+11,'#a8d080');}
    if(k==='flor'){P.r(g,px,py,16,16,corVar(TEMA.city.grama,tx,ty,4));for(let i=0;i<4;i++){const x=(hash2(tx,ty,40+i)*14|0)+1,y=(hash2(tx,ty,50+i)*14|0)+1;P.p(g,px+x,py+y,['#ffd24a','#ff7a9a','#ffffff','#c9a6ff'][i]);P.p(g,px+x,py+y+1,'#3a7a2a');}}
    if(k==='tapete'){P.r(g,px,py,16,16,'#d8c690');P.r(g,px+1,py+1,14,14,'#e8d8a8');}
  }
  /* sombra projetada pela parede logo acima */
  const up=viz(0,-1);if(up==='parede'||up==='penhasco')P.ponti(g,px,py,16,3,'rgba(0,0,0,0.28)',0),P.r(g,px,py,16,1,'rgba(0,0,0,0.35)');
}
function parede(g,A,T,k,tx,ty,px,py,h,viz){
  const isW=q=>q==='parede'||q==='penhasco'||q==='nada';
  const baixo=viz(0,1),face=!isW(baixo),tema=A.tema;
  if(k==='penhasco'){
    const R=TEMA.vale.rocha;
    if(face){P.r(g,px,py,16,16,R[1]);for(let i=0;i<5;i++){const x=(hash2(tx,ty,60+i)*14|0),y=(hash2(tx,ty,70+i)*13|0);P.r(g,px+x,py+y,3,2,i%2?R[2]:R[0]);}
      P.r(g,px,py,16,2,R[3]);P.r(g,px,py+15,16,1,'#4a3020');P.linha(g,px+(h*10|0),py+3,px+(h*10|0)+2,py+12,R[2]);}
    else{P.r(g,px,py,16,16,R[0]);for(let i=0;i<4;i++){const x=(hash2(tx,ty,80+i)*14|0),y=(hash2(tx,ty,90+i)*14|0);P.r(g,px+x,py+y,2,2,i%2?R[3]:R[1]);}
      if(!isW(viz(0,-1)))P.r(g,px,py,16,1,R[3]);if(!isW(viz(-1,0)))P.r(g,px,py,1,16,R[3]);if(!isW(viz(1,0)))P.r(g,px+15,py,1,16,R[2]);}
    return;
  }
  if(face){
    const C=T.parede;P.r(g,px,py,16,16,C[0]);
    if(tema==='steam'){for(let r=0;r<4;r++){const off=(r%2)*4;P.r(g,px,py+r*4+3,16,1,tom(C[0],-0.3));for(let x=off;x<16;x+=8)P.r(g,px+x,py+r*4,1,3,tom(C[0],-0.3));if(hash2(tx,ty,r)<0.3)P.r(g,px+off+2,py+r*4+1,3,1,tom(C[0],0.15));}
      P.r(g,px,py,16,1,T.aresta);if(h<0.15){P.engrenagem(g,px+8,py+8,4,6,T.bronze,'#5e4418',1);}}
    else if(tema==='diesel'){P.r(g,px,py,16,16,C[1]);P.r(g,px+1,py+1,14,14,C[0]);for(const x of[2,13])for(const y of[2,13])P.p(g,px+x,py+y,C[2]);P.r(g,px,py+15,16,1,'#22252a');
      if(h<0.2){P.r(g,px+3,py+5,10,2,'#c8a030');P.ponti(g,px+3,py+5,10,2,'#2a2a2a',0);}if(h>0.85){P.r(g,px+6,py+4,4,6,'#1a2a3a');P.r(g,px+7,py+5,2,1,'#6fd3ff');}}
    else if(tema==='atom'){P.r(g,px,py+10,16,2,C[2]);P.r(g,px,py,16,1,'#ffffff');P.r(g,px+15,py,1,16,C[1]);if(h<0.25){P.r(g,px+4,py+3,8,5,'#2a3a2a');P.r(g,px+5,py+4,6,1,T.aresta);P.p(g,px+6,py+6,'#ff5a4a');}}
    else if(tema==='bio'){for(let i=0;i<3;i++)P.linha(g,px+(hash2(tx,ty,i)*16|0),py,px+(hash2(tx,ty,i+5)*16|0),py+15,tom(C[0],-0.18));P.r(g,px,py,16,2,C[2]);
      if(h<0.35){P.circ(g,px+5+(h*20|0)%6,py+9,1.5,'#c9a6ff');P.p(g,px+5+(h*20|0)%6,py+8,'#ffffff');}}
    else if(tema==='city'){for(let r=0;r<2;r++){P.r(g,px,py+r*8+7,16,1,tom(C[0],-0.15));P.r(g,px+(r?4:12),py+r*8,1,7,tom(C[0],-0.15));}P.r(g,px,py,16,1,'#ffffff');
      if(h<0.4){P.linha(g,px+(h*30|0)%12+2,py,px+(h*30|0)%12+4,py+12,'#5c983e');P.p(g,px+(h*30|0)%12+3,py+6,'#8cc86a');P.p(g,px+(h*30|0)%12+4,py+10,'#ff7a9a');}}
    P.r(g,px,py+15,16,1,'rgba(0,0,0,0.35)');
  }else{
    P.r(g,px,py,16,16,T.topo);
    const cl=tom(T.topo,0.3);
    if(!isW(viz(0,-1)))P.r(g,px,py,16,2,cl);if(!isW(viz(-1,0)))P.r(g,px,py,2,16,cl);if(!isW(viz(1,0)))P.r(g,px+14,py,2,16,tom(T.topo,0.15));
    if(h<0.2)P.p(g,px+(h*60|0)%12+2,py+(h*90|0)%12+2,tom(T.topo,0.2));
  }
}
/* rio seco: cascalho e lama rachada, um pouco mais baixo que a areia (barranco escuro onde a margem começa) */
function leitoChao(g,tx,ty,px,py,viz){
  P.r(g,px,py,16,16,'#b0906a');
  for(let i=0;i<7;i++){const x=(hash2(tx,ty,i+60)*15)|0,y=(hash2(tx,ty,i+70)*15)|0;P.r(g,px+x,py+y,i%3?1:2,1,i%2?'#8a6a48':'#d0b88a');}
  if(hash2(tx,ty,77)<0.5){const x=(hash2(tx,ty,78)*10)|0;P.linha(g,px+x,py+3,px+x+4,py+8,'#94744e');P.linha(g,px+x+4,py+8,px+x+2,py+13,'#94744e');}
  const banco=q=>q!=='leito';
  if(banco(viz(-1,0)))P.r(g,px,py,2,16,'#8a6a48');if(banco(viz(1,0)))P.r(g,px+14,py,2,16,'#d8bf90');if(banco(viz(0,-1)))P.r(g,px,py,16,2,'#8a6a48');
}
/* chão do vale: areia com ruído e ondas de duna contínuas entre tiles; estrada de pedra; trilha batida; grama do oásis */
function valeChao(g,A,T,k,tx,ty,px,py,viz){
  const V=TEMA.vale;
  if(k==='estrada'){
    P.r(g,px,py,16,16,V.estrada[1]);
    for(let r=0;r<2;r++)for(let c=0;c<2;c++){const off=(ty+r)%2?4:0,x=(c*8+off)%16,y=r*8;const col=corVar(V.estrada,tx*2+c,ty*2+r,11);P.r(g,px+x,py+y,7,7,col);P.r(g,px+x,py+y,7,1,tom(col,0.12));if(x+7>16)P.r(g,px,py+y,x+7-16,7,col);}
    return;
  }
  if(k==='grama'){
    const C=V.grama;P.r(g,px,py,16,16,corVar(C,tx,ty,5));
    for(let i=0;i<6;i++){const x=(hash2(tx,ty,i+1)*15)|0,y=(hash2(tx,ty,i+9)*14)|0;P.p(g,px+x,py+y,C[2]);P.p(g,px+x,py+y+1,C[1]);}
    for(const[dx,dy]of[[0,-1],[0,1],[-1,0],[1,0]]){const q=viz(dx,dy);if(q==='areia'||q==='duna'||q==='trilha'){for(let i=0;i<16;i++)if(hash2(tx*16+i,ty,dx+dy*3)<0.5){if(dy)P.p(g,px+i,py+(dy<0?0:15),V.areia[0]);else P.p(g,px+(dx<0?0:15),py+i,V.areia[0]);}}}
    return;
  }
  /* areia: cor por pixel = ruído + faixa de duna (seno) — contínuo entre tiles */
  const id=g.createImageData(16,16),d=id.data,trilha=k==='trilha';
  const pal=(trilha?V.trilha:V.areia).map(hexRgb);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const wx=tx*16+x,wy=ty*16+y;
    const onda=Math.sin(wx*0.045+Math.sin(wy*0.03)*2.2+wy*0.012),n=hash2(wx,wy,3);
    let i;
    if(trilha)i=n<0.08?1:0;
    else{i=onda>0.86?3:onda>0.7?2:onda<-0.6?(n<0.5?4:0):(n<0.035?2:n>0.985?4:(k==='duna'&&n<0.3?1:0));if(k==='duna'&&onda>0.5)i=Math.max(i,2);}
    const c=pal[Math.min(i,pal.length-1)],o=(y*16+x)*4;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255;
  }
  g.putImageData(id,px,py);
  if(trilha){for(let i=0;i<2;i++){const x=(hash2(tx,ty,i+30)*13)|0,y=(hash2(tx,ty,i+40)*13)|0;P.r(g,px+x,py+y,2,1,'#8a6a48');}}
}
