/* ====================== segredos do vale e o mapa do diário ======================
   12 segredos fora das tumbas: 4 fragmentos de mapa, 5 baús e 3 inscrições legíveis de dia (mais as 6 inscrições
   que só brilham à noite). Sem marcador na tela: só um brilho pequeno de perto. Dão informação e história. */
function aplicarSegredos(){
  for(const s of VALE.segredos.frags)s.o.on=!G.sec[s.f.id];
  for(const s of VALE.segredos.baus){s.o.img=SPR.get('bau',!!G.sec[s.c.id]);s.o.brilha=G.sec[s.c.id]?null:'#ffd24a';}
  for(const s of VALE.segredos.dia)s.o.brilha=G.sec[s.d.id]?null:'#fff0c0';
}
function pegarFragmento(f){
  if(G.sec[f.id])return;G.sec[f.id]=true;SFX.frag();aplicarSegredos();addDiary('sec_'+f.id,true);
  const n=secFragCount();toast('Fragmento de mapa recolhido ('+n+'/4). Veja a página Mapa do diário.','good');
  if(n>=4)setTimeout(()=>toast('Os quatro fragmentos se encaixam. O mapa do vale está completo.','good'),1800);
  faiscas(f.x*16+8,f.y*16+8,10,['#fff6c0','#ffe9a0']);salvar(false);
}
function abrirBau(c){
  if(G.sec[c.id])return;G.sec[c.id]=true;SFX.chest();aplicarSegredos();addDiary('sec_'+c.id,true);
  const e=ENTRIES['sec_'+c.id];toast(e.t+'. '+e.s,'good');faiscas(c.x*16+8,c.y*16+8,12);salvar(false);
}
function lerInscricaoDia(d){
  const key='insc_'+d.id,e=ENTRIES[key];
  if(!G.sec[d.id]){G.sec[d.id]=true;addDiary(key,true);aplicarSegredos();salvar(false);}
  SFX.insc();toast(e.s);
}
function lerInscricao(d){
  if(noiteAgora()<=0.55){toast(TXT.dayInsc);return;}
  const novo=!G.insc[d.id];G.insc[d.id]=1;addDiary('insc_'+d.id,true);SFX.insc();toast(d.s,novo?'good':'');if(novo)salvar(false);
}
/* mapa do vale (página Mapa do diário): desenhado a partir dos tiles, sem a posição do jogador e sem segredos */
function desenharMapaVale(cv){
  const A=AREAS.vale,W=A.w,H=A.h;cv.width=W;cv.height=H;const g=ctx2(cv);
  const full=cnv(W,H),f=ctx2(full),id=f.createImageData(W,H),d=id.data;
  const cor={areia:[220,190,140],duna:[205,172,120],estrada:[150,130,100],trilha:[176,140,96],grama:[110,150,80],agua:[70,130,170],penhasco:[110,80,52],leito:[168,136,98],nada:[60,40,30]};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=cor[A.kind(x,y)]||[200,180,140],o=(y*W+x)*4,n=hash2(x,y,1)*10;d[o]=c[0]+n;d[o+1]=c[1]+n;d[o+2]=c[2]+n;d[o+3]=255;}
  f.putImageData(id,0,0);
  for(const k in TRILHAS){f.fillStyle=COR_TRILHA[k];for(const p of TRILHAS[k])f.fillRect(Math.round(p[0])-1,Math.round(p[1])-1,2,2);}
  for(const k of RELIC_KEYS){const T=TOMBS[k];P.r(f,T.x-3,T.y-2,7,5,'#2a1a0e');P.r(f,T.x-2,T.y-1,5,3,T.col);}
  P.r(f,79,18,23,22,'#2a1a0e');for(let s=0;s<10;s++)P.r(f,80+s,38-s*2,21-s*2,2,s%2?'#e9dcbc':'#ffd24a');
  for(const dx of[-4,0,4])P.r(f,90+dx-1,153,3,3,'#b9533a');
  P.circ(f,62,146,3,'#3a86a8');
  g.fillStyle='#1f160e';g.fillRect(0,0,W,H);
  const q=[['f_nw',0,0],['f_ne',1,0],['f_sw',0,1],['f_se',1,1]],h=W/2;
  for(const[id2,qx,qy]of q){
    if(G.sec[id2])g.drawImage(full,qx*h,qy*h,h,h,qx*h,qy*h,h,h);
    else{g.fillStyle='#2b1f14';g.fillRect(qx*h+1,qy*h+1,h-2,h-2);g.fillStyle='rgba(180,140,80,0.5)';FONTE.texto(g,'?',qx*h+h/2-1,qy*h+h/2-2,'#a8885a');}
  }
  P.r(g,W-12,3,1,8,'#24160d');FONTE.texto(g,'N',W-13,12,'#24160d');
}
