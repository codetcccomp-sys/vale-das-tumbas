/* ====================== renderização em pixels inteiros ======================
   O mundo é desenhado num canvas pequeno (resolução interna) e ampliado por um fator INTEIRO para o canvas da tela,
   sem suavização: todo pixel do jogo vira um quadrado de k×k pixels do aparelho. O fator sai do lado menor da tela
   (cerca de 250 pixels de jogo no lado menor), então os sprites ficam do mesmo tamanho em pé e deitado.
   A câmera anda em subpixels, mas o desenho usa a posição arredondada: nada treme nem deforma. */
const R={cv:null,g:null,lo:null,lg:null,W:320,H:240,k:3,dpr:1,cam:{x:0,y:0},ox:0,oy:0,luz:null,lz:null,chunks:new Map(),treme:0,vista:null,longe:false};
function renderInit(){
  R.cv=document.getElementById('c');R.g=R.cv.getContext('2d',{alpha:false});
  R.lo=cnv(320,240);R.lg=ctx2(R.lo);R.luz=cnv(320,240);R.lz=ctx2(R.luz);
  addEventListener('resize',redimensionar);
  if(window.visualViewport)visualViewport.addEventListener('resize',redimensionar);
  redimensionar();
}
/* câmera afastada (padrão, guardada nas preferências; VER / C alterna): um degrau a menos de ampliação mostra mais do
   lugar, ainda com pixels inteiros. Só vale quando cada pixel do jogo continua com pelo menos 1,1 pixel da tela (texto e
   personagem legíveis). Com o painel aberto volta ao normal: a faixa da sala mostra o mecanismo com detalhe. */
function kDe(dw,dh,longe){return Math.max(1,Math.round(Math.min(dw,dh)/250)-(longe?1:0));}
function longePossivel(dw,dh,dpr){const k1=kDe(dw,dh,true);return k1<kDe(dw,dh,false)&&k1/dpr>=1.1;}
function redimensionar(){
  const dpr=Math.min(window.devicePixelRatio||1,4),w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
  const dw=Math.round(w*dpr),dh=Math.round(h*dpr);
  const longe=R.longe&&!(typeof PAINEL!=='undefined'&&PAINEL.aberto)&&longePossivel(dw,dh,dpr);
  R.dpr=dpr;R.k=kDe(dw,dh,longe);R.longeAtivo=longe;
  /* rótulos do cenário em dobro quando a letra de 5 px ficaria com menos de 9 px de tela (celular com a câmera afastada) */
  R.etq=R.k/R.dpr*5<9?2:1;
  R.W=Math.ceil(dw/R.k);R.H=Math.ceil(dh/R.k);
  R.cv.width=dw;R.cv.height=dh;R.cv.style.width=w+'px';R.cv.style.height=h+'px';
  R.lo.width=R.W;R.lo.height=R.H;R.luz.width=R.W;R.luz.height=R.H;
  R.g.imageSmoothingEnabled=false;R.lg.imageSmoothingEnabled=false;R.lz.imageSmoothingEnabled=false;
}
/* parte da tela que mostra o mundo (o painel de programação cobre o resto): em pixels internos */
function areaVisivel(){
  const v=R.vista;if(!v)return{x:0,y:0,w:R.W,h:R.H};
  const k=R.k;return{x:Math.floor(v.x/k),y:Math.floor(v.y/k),w:Math.ceil(v.w/k),h:Math.ceil(v.h/k)};
}
/* ---------- câmera ---------- */
function camSeguir(alvoX,alvoY,dt,A,imediato){
  const v=areaVisivel();
  /* áreas com um chefe grande puxam a câmera para cima enquanto o jogador anda (A.camDy), para ele caber no quadro */
  if(A&&A.camDy&&G.mode==='play')alvoY+=A.camDy();
  /* centro desejado do alvo na parte visível da tela */
  /* no toque, os botões VER, LUZ e AÇÃO ocupam a faixa de baixo: o centro fica entre o HUD e essa faixa */
  const base=R.vista||!document.body.classList.contains('touch')?0:Math.round(104*R.dpr/R.k);
  const hudC=R.vista?0:(R.hudTopo||0)*0.5-base*0.5;
  let cx=alvoX-(v.x+v.w/2),cy=alvoY-(v.y+v.h/2)-hudC;
  /* limites da área (quando a área é menor que a tela, centraliza). Em cima sobra a altura do HUD e, no toque, embaixo sobra a faixa
     dos botões, para o explorador nunca ficar escondido atrás deles perto das bordas do mapa. */
  const mw=A.w*TILE,mh=A.h*TILE,hud=R.vista?0:(R.hudTopo||0);
  const minX=-v.x,maxX=mw-(v.x+v.w),minY=-v.y-hud,maxY=mh-(v.y+v.h)+base;
  cx=maxX<minX?(minX+maxX)/2:clamp(cx,minX,maxX);cy=maxY<minY?(minY+maxY)/2:clamp(cy,minY,maxY);
  if(imediato){R.cam.x=cx;R.cam.y=cy;}
  else{const q=1-Math.exp(-8*dt);R.cam.x+=(cx-R.cam.x)*q;R.cam.y+=(cy-R.cam.y)*q;}
}
function camPixel(){
  let sx=0,sy=0;if(R.treme>0){sx=Math.round((Math.random()-0.5)*R.treme*4);sy=Math.round((Math.random()-0.5)*R.treme*4);}
  R.ox=-Math.round(R.cam.x)+sx;R.oy=-Math.round(R.cam.y)+sy;
}
/* ---------- chão em pedaços (chunks de 16×16 tiles) guardados em cache ---------- */
const CH=16,CHPX=CH*TILE;
function chunk(A,cx,cy){
  const key=A.id+':'+cx+','+cy+':'+A.versao;
  let c=R.chunks.get(key);
  if(c){R.chunks.delete(key);R.chunks.set(key,c);return c;}
  c=cnv(CHPX,CHPX);const g=ctx2(c);
  for(let y=0;y<CH;y++)for(let x=0;x<CH;x++){const tx=cx*CH+x,ty=cy*CH+y;if(tx>=A.w||ty>=A.h)continue;desenharTile(g,A,tx,ty,x*TILE,y*TILE);}
  if(A.decalques)for(const d of A.decalques){const dx=d.x-cx*CHPX,dy=d.y-cy*CHPX;if(dx>-d.img.width&&dy>-d.img.height&&dx<CHPX&&dy<CHPX)g.drawImage(d.img,dx|0,dy|0);}
  R.chunks.set(key,c);
  while(R.chunks.size>60){const k0=R.chunks.keys().next().value;R.chunks.delete(k0);}
  return c;
}
function desenharChao(A){
  const g=R.lg,x0=Math.floor(-R.ox/CHPX),y0=Math.floor(-R.oy/CHPX),x1=Math.floor((-R.ox+R.W)/CHPX),y1=Math.floor((-R.oy+R.H)/CHPX);
  g.fillStyle=A.fundo||'#000';g.fillRect(0,0,R.W,R.H);
  for(let cy=Math.max(0,y0);cy<=y1;cy++)for(let cx=Math.max(0,x0);cx<=x1;cx++){
    if(cx*CH>=A.w||cy*CH>=A.h)continue;g.drawImage(chunk(A,cx,cy),cx*CHPX+R.ox,cy*CHPX+R.oy);
  }
}
/* água animada: brilhos que correm sobre os tiles de água visíveis */
function desenharAgua(A,t){
  const g=R.lg,tx0=Math.max(0,Math.floor(-R.ox/TILE)),ty0=Math.max(0,Math.floor(-R.oy/TILE)),tx1=Math.min(A.w-1,Math.floor((-R.ox+R.W)/TILE)),ty1=Math.min(A.h-1,Math.floor((-R.oy+R.H)/TILE));
  const C=(TEMA[A.tema].agua||TEMA.vale.agua),cl=tom(C[0],0.35),f=Math.floor(t*3);
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){
    const k=A.kind(tx,ty);if(k!=='agua'&&k!=='aguaRasa')continue;
    const px=tx*TILE+R.ox,py=ty*TILE+R.oy;
    for(let i=0;i<2;i++){const ph=(hash2(tx,ty,i+3)*4+f)%4|0,x=((hash2(tx,ty,i)*12)|0)+ph,y=3+((hash2(tx,ty,i+8)*10)|0);if(ph<3){g.fillStyle=cl;g.fillRect(px+x,py+y,2+ph%2,1);}}
  }
}
/* ---------- sprites ordenados pela base (y) ---------- */
const DESENHO=[];
function enfileirar(y,fn){DESENHO.push({y,fn});}
function desenharFila(){DESENHO.sort((a,b)=>a.y-b.y);for(const d of DESENHO)d.fn(R.lg);DESENHO.length=0;}
function sombra(g,x,y,rx,ry,a){g.fillStyle='rgba(20,10,0,'+(a===undefined?0.28:a)+')';P.elip(g,Math.round(x+R.ox),Math.round(y+R.oy),rx,ry,g.fillStyle);}
/* desenha uma imagem com a base (ax,ay) no ponto (x,y) do mundo */
function blit(g,img,x,y,ax,ay,alfa){if(!img)return;const px=Math.round(x-ax+R.ox),py=Math.round(y-ay+R.oy);if(px>R.W||py>R.H||px+img.width<0||py+img.height<0)return;if(alfa!==undefined&&alfa<1){g.globalAlpha=alfa;g.drawImage(img,px,py);g.globalAlpha=1;}else g.drawImage(img,px,py);}
function naTela(x,y,m){m=m||48;return x+R.ox>-m&&x+R.ox<R.W+m&&y+R.oy>-m&&y+R.oy<R.H+m;}

/* ---------- partículas (quadradinhos de 1–2 px) ---------- */
const PART=[];
function particula(o){if(PART.length>420)PART.shift();PART.push(Object.assign({x:0,y:0,z:0,vx:0,vy:0,vz:0,g:0,vida:1,t:0,cor:'#fff',tam:1,cores:null,atrito:0},o));}
function atualizarParticulas(dt){
  for(let i=PART.length-1;i>=0;i--){const p=PART[i];p.t+=dt;if(p.t>=p.vida){PART.splice(i,1);continue;}
    p.vx*=1-p.atrito*dt;p.vy*=1-p.atrito*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vz-=p.g*dt;p.z+=p.vz*dt;if(p.g&&p.z<0){p.z=0;p.vz*=-0.3;p.vx*=0.6;p.vy*=0.6;}}
}
function desenharParticulas(){
  const g=R.lg;
  for(const p of PART){const u=p.t/p.vida,c=p.cores?p.cores[Math.min(p.cores.length-1,(u*p.cores.length)|0)]:p.cor;
    const s=p.tam>1&&u>0.6?p.tam-1:p.tam;g.fillStyle=c;g.globalAlpha=p.fade?1-u:1;g.fillRect(Math.round(p.x+R.ox),Math.round(p.y-p.z+R.oy),s,s);}
  g.globalAlpha=1;
}
function vapor(x,y,n,cor){for(let i=0;i<(n||4);i++)particula({x:x+(Math.random()-0.5)*6,y,z:Math.random()*4,vx:(Math.random()-0.5)*8,vz:14+Math.random()*12,vida:0.9+Math.random()*0.6,tam:2,cores:cor||['#ffffff','#f0ece4','#d8d4cc','#b8b4ac'],fade:true});}
function faiscas(x,y,n,cores){for(let i=0;i<(n||8);i++){const a=Math.random()*TAU,v=20+Math.random()*40;particula({x,y,z:6,vx:Math.cos(a)*v,vy:Math.sin(a)*v*0.6,vz:30+Math.random()*30,g:120,vida:0.5+Math.random()*0.4,cores:cores||['#fff6c0','#ffd24a','#ff9a3a']});}}
function gotas(x,y,n){for(let i=0;i<(n||6);i++){particula({x:x+(Math.random()-0.5)*6,y:y+(Math.random()-0.5)*3,z:10+Math.random()*4,vx:(Math.random()-0.5)*14,vz:-10,g:80,vida:0.5,cores:['#bfeeff','#6fd3ff','#3a86a8']});}}
function poeira(x,y,n,cor){for(let i=0;i<(n||3);i++)particula({x:x+(Math.random()-0.5)*6,y:y+(Math.random()-0.5)*2,z:1,vx:(Math.random()-0.5)*14,vy:(Math.random()-0.5)*4,vz:6+Math.random()*6,g:30,vida:0.45,cor:cor||'#d8b884',fade:true});}

/* ---------- luz: escuridão das tumbas e da noite, com círculos de luz em degraus (aparência de pixel art) ---------- */
const LUZES=[];
function luz(x,y,r,forca,cor){LUZES.push({x,y,r,f:forca===undefined?1:forca,cor});}
function desenharLuz(escuro,tinta){
  if(escuro<=0.01){LUZES.length=0;return;}
  const g=R.lz;g.globalCompositeOperation='source-over';g.clearRect(0,0,R.W,R.H);
  g.fillStyle=tinta||'rgba(6,4,12,1)';g.globalAlpha=escuro;g.fillRect(0,0,R.W,R.H);g.globalAlpha=1;
  g.globalCompositeOperation='destination-out';
  for(const L of LUZES){
    const x=Math.round(L.x+R.ox),y=Math.round(L.y+R.oy);if(x<-L.r-4||y<-L.r-4||x>R.W+L.r+4||y>R.H+L.r+4)continue;
    /* quatro degraus suaves: a borda some aos poucos (sem um círculo marcado que esconda o resto) */
    const deg=[[1,0.22],[0.84,0.45],[0.68,0.72],[0.52,1]];
    for(const[rr,a]of deg){g.globalAlpha=a*L.f;P.circ(g,x,y,L.r*rr,'#000');}
  }
  g.globalAlpha=1;g.globalCompositeOperation='source-over';
  R.lg.drawImage(R.luz,0,0);
  /* brilho colorido por cima (aditivo) */
  R.lg.globalCompositeOperation='lighter';
  for(const L of LUZES){if(!L.cor)continue;const x=Math.round(L.x+R.ox),y=Math.round(L.y+R.oy);R.lg.globalAlpha=0.16*L.f*Math.min(1,escuro*1.5);P.circ(R.lg,x,y,L.r*0.5,L.cor);}
  R.lg.globalAlpha=1;R.lg.globalCompositeOperation='source-over';
  LUZES.length=0;
}
/* tinta do dia: manhã quente, meio-dia neutro, entardecer laranja, noite azul */
function tintaDia(g,noite,tarde){
  if(tarde>0.01){g.globalCompositeOperation='multiply';g.fillStyle='rgba(255,170,110,'+(tarde*0.5)+')';g.fillRect(0,0,R.W,R.H);g.globalCompositeOperation='source-over';}
}
/* ---------- apresentação: amplia o canvas interno para a tela ---------- */
function apresentar(){
  const g=R.g;g.imageSmoothingEnabled=false;
  g.drawImage(R.lo,0,0,R.W,R.H,0,0,R.W*R.k,R.H*R.k);
}
