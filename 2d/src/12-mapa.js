/* ====================== áreas, colisão e interação ======================
   Uma área é uma grade de tiles (tipo de cada tile), objetos parados (sprites com caixa de colisão), entidades que se
   mexem (guardiões, plataformas), pontos de interação e zonas. O explorador colide com uma caixa nos pés
   (12×6 px): primeiro anda em x, depois em y, e escorrega nas quinas para não enroscar. */
const AREAS={},CONSTRUIR={};   // áreas já montadas e as funções que montam cada tumba
function novaArea(id,w,h,tema){
  return{id,w,h,tema,t:new Array(w*h).fill('nada'),versao:0,objs:[],ents:[],interact:[],zonas:[],solidos:[],decalques:[],
    escuro:0,fundo:'#000',spawn:{x:w*8,y:h*8,dir:'baixo'},kind(tx,ty){return tx<0||ty<0||tx>=this.w||ty>=this.h?'nada':this.t[ty*this.w+tx];},
    set(tx,ty,k){if(tx<0||ty<0||tx>=this.w||ty>=this.h)return;this.t[ty*this.w+tx]=k;},update:null,desenhar:null,desenharChao:null,entrar:null,sair:null};
}
/* monta os tiles a partir de linhas de texto e de uma legenda (letra → tipo de tile ou função) */
function carregarMapa(A,linhas,leg,ox,oy){
  ox=ox|0;oy=oy|0;
  for(let y=0;y<linhas.length;y++){const l=linhas[y];for(let x=0;x<l.length;x++){const ch=l[x],v=leg[ch];if(v===undefined)continue;
    const tx=ox+x,ty=oy+y;if(typeof v==='string')A.set(tx,ty,v);else{if(v.k)A.set(tx,ty,v.k);if(v.f)v.f(tx,ty);}}}
}
/* objeto parado: img com âncora na base; col = caixa sólida relativa à base (x0,y0,x1,y1) */
function objeto(A,img,x,y,o){
  o=o||{};const ob={img,x,y,ax:o.ax!==undefined?o.ax:img.width/2,ay:o.ay!==undefined?o.ay:img.height,col:o.col||null,sombra:o.sombra,alfa:1,desenho:o.desenho||null,on:true,dados:o.dados||null,camada:o.camada||0,id:o.id};
  if(ob.col){ob.box={x0:x+ob.col[0],y0:y+ob.col[1],x1:x+ob.col[2],y1:y+ob.col[3],on:true,ob};A.solidos.push(ob.box);}
  A.objs.push(ob);return ob;
}
function solido(A,x0,y0,x1,y1){const b={x0,y0,x1,y1,on:true};A.solidos.push(b);return b;}
function interacao(A,o){const it=Object.assign({r:14},o);A.interact.push(it);return it;}

/* ---------- colisão ---------- */
const PW=6,PH=3;   // meia largura e meia altura da caixa dos pés
function bloqueado(A,x0,y0,x1,y1){
  const tx0=Math.floor(x0/TILE),ty0=Math.floor(y0/TILE),tx1=Math.floor((x1-0.001)/TILE),ty1=Math.floor((y1-0.001)/TILE);
  for(let ty=ty0;ty<=ty1;ty++)for(let tx=tx0;tx<=tx1;tx++){const k=A.kind(tx,ty);if(TK[k]&&TK[k].solido)return true;}
  for(const b of A.solidos)if(b.on&&x1>b.x0&&x0<b.x1&&y1>b.y0&&y0<b.y1)return true;
  return false;
}
function livreEm(A,x,y){return!bloqueado(A,x-PW,y-PH,x+PW,y+PH);}
/* move o corpo (x,y = centro dos pés) por (dx,dy) e devolve se bateu */
function moverCorpo(A,c,dx,dy){
  let bateu=false;
  const passo=(ax,ay)=>{
    const nx=c.x+ax,ny=c.y+ay;
    if(!bloqueado(A,nx-PW,ny-PH,nx+PW,ny+PH)){c.x=nx;c.y=ny;return true;}
    /* escorrega na quina: tenta deslocar até 5 px no outro eixo */
    for(let s=1;s<=5;s++)for(const sg of[1,-1]){
      const ex=ay?s*sg:0,ey=ax?s*sg:0;
      if(!bloqueado(A,nx+ex-PW,ny+ey-PH,nx+ex+PW,ny+ey+PH)&&!bloqueado(A,c.x+ex-PW,c.y+ey-PH,c.x+ex+PW,c.y+ey+PH)){
        c.x+=Math.sign(ex)*Math.min(1,Math.abs(ex));c.y+=Math.sign(ey)*Math.min(1,Math.abs(ey));return false;}
    }
    return false;
  };
  const n=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/4)||1;
  for(let i=0;i<n;i++){if(dx&&!passo(dx/n,0))bateu=true;if(dy&&!passo(0,dy/n))bateu=true;}
  return bateu;
}
/* o que há embaixo dos pés (centro): vão, água funda, radiação... plataformas e pontes cobrem o perigo */
function soloEm(A,x,y){
  const tx=Math.floor(x/TILE),ty=Math.floor(y/TILE),k=A.kind(tx,ty);
  if(A.cobre&&A.cobre(x,y))return{k:'chao'};
  return{k,tk:TK[k]||{}};
}
/* linha de visão entre dois pontos (para os guardiões): para em paredes e em objetos que fazem sombra */
function visao(A,x0,y0,x1,y1){
  const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/4);
  for(let i=1;i<n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;const k=A.kind(Math.floor(x/TILE),Math.floor(y/TILE));if(TK[k]&&TK[k].parede)return false;
    for(const b of A.solidos)if(b.on&&b.opaco&&x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1)return false;
    if(A.opacos)for(const b of A.opacos)if(x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1)return false;}
  return true;
}
