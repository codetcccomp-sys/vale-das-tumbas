/* ====================== ferramentas de pixel art ======================
   Todo gráfico do jogo é desenhado por código em canvases pequenos, sempre em pixels inteiros:
   - sprMapa: sprite a partir de linhas de texto (cada letra é uma cor da paleta);
   - P.*: retângulos, pixels, círculos e linhas sem suavização (sem anti-aliasing);
   - contorno(): borda escura de 1 px em volta de tudo que não é transparente, para leitura sobre qualquer fundo;
   - fonte de pixels 3×5 para rótulos no mundo (nomes de contêineres, valores, números). */
function cnv(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);return c;}
function ctx2(c){const g=c.getContext('2d');g.imageSmoothingEnabled=false;return g;}
function hexRgb(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];}
function rgbHex(r,g,b){return'#'+((1<<24)|(clamp(r|0,0,255)<<16)|(clamp(g|0,0,255)<<8)|clamp(b|0,0,255)).toString(16).slice(1);}
/* clareia (k>0) ou escurece (k<0) puxando levemente para um tom quente/frio, como numa paleta pintada */
function tom(h,k){const[r,g,b]=hexRgb(h);if(k>=0)return rgbHex(r+(255-r)*k,g+(250-g)*k,b+(225-b)*k*0.9);const q=1+k;return rgbHex(r*q,g*q*0.98,b*q*1.04+6*-k);}
function mistura(a,b,t){const A=hexRgb(a),B=hexRgb(b);return rgbHex(lerp(A[0],B[0],t),lerp(A[1],B[1],t),lerp(A[2],B[2],t));}

/* sprite de texto: linhas com letras da paleta; '.' e ' ' são transparentes */
function sprMapa(linhas,pal,ox,oy,dest){
  const h=linhas.length,w=linhas.reduce((m,l)=>Math.max(m,l.length),0);
  const c=dest||cnv(w,h),g=ctx2(c);
  for(let y=0;y<h;y++){const l=linhas[y];for(let x=0;x<l.length;x++){const k=l[x];if(k==='.'||k===' ')continue;const col=pal[k];if(!col)continue;g.fillStyle=col;g.fillRect((ox|0)+x,(oy|0)+y,1,1);}}
  return c;
}
function espelhar(c){const o=cnv(c.width,c.height),g=ctx2(o);g.translate(c.width,0);g.scale(-1,1);g.drawImage(c,0,0);return o;}
/* contorno de 1 px (4 vizinhos) na cor dada; não mexe nos pixels já pintados */
function contorno(c,cor,diag){
  const w=c.width,h=c.height,tmp=document.createElement('canvas');tmp.width=w;tmp.height=h;
  const tg=tmp.getContext('2d',{willReadFrequently:true});tg.drawImage(c,0,0);const d=tg.getImageData(0,0,w,h),a=d.data,o=new Uint8Array(w*h);
  for(let i=0;i<w*h;i++)o[i]=a[i*4+3]>40?1:0;
  const[r,gg,b]=hexRgb(cor);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=y*w+x;if(o[i])continue;
    const v=(x>0&&o[i-1])||(x<w-1&&o[i+1])||(y>0&&o[i-w])||(y<h-1&&o[i+w])||(diag&&((x>0&&y>0&&o[i-w-1])||(x<w-1&&y>0&&o[i-w+1])||(x>0&&y<h-1&&o[i+w-1])||(x<w-1&&y<h-1&&o[i+w+1])));
    if(v){a[i*4]=r;a[i*4+1]=gg;a[i*4+2]=b;a[i*4+3]=255;}
  }
  ctx2(c).putImageData(d,0,0);return c;
}
/* recolore um sprite (usado para o piscar de dano e para silhuetas) */
function silhueta(c,cor,alfa){const o=cnv(c.width,c.height),g=ctx2(o);g.drawImage(c,0,0);g.globalCompositeOperation='source-in';g.fillStyle=cor;g.globalAlpha=alfa===undefined?1:alfa;g.fillRect(0,0,o.width,o.height);return o;}

const P={
  r(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x|0,y|0,w|0,h|0);},
  p(g,x,y,c){g.fillStyle=c;g.fillRect(x|0,y|0,1,1);},
  /* círculo cheio de raio r com centro em (cx,cy) (centro pode ser .5 para diâmetros pares) */
  circ(g,cx,cy,r,c){g.fillStyle=c;for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++){const dy=y+0.5-cy;if(Math.abs(dy)>r)continue;const dx=Math.sqrt(r*r-dy*dy);const x0=Math.round(cx-dx),x1=Math.round(cx+dx);if(x1>x0)g.fillRect(x0,y,x1-x0,1);}},
  elip(g,cx,cy,rx,ry,c){g.fillStyle=c;for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){const dy=(y+0.5-cy)/ry;if(Math.abs(dy)>1)continue;const dx=rx*Math.sqrt(1-dy*dy);const x0=Math.round(cx-dx),x1=Math.round(cx+dx);if(x1>x0)g.fillRect(x0,y,x1-x0,1);}},
  anel(g,cx,cy,r,esp,c){g.fillStyle=c;for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++){const d=Math.hypot(x+0.5-cx,y+0.5-cy);if(d<=r&&d>r-esp)g.fillRect(x,y,1,1);}},
  linha(g,x0,y0,x1,y1,c){g.fillStyle=c;x0|=0;y0|=0;x1|=0;y1|=0;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;for(let n=0;n<400;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}},
  /* pontilhado em xadrez (meio-tom) */
  ponti(g,x,y,w,h,c,fase){g.fillStyle=c;for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(((i+j+(fase|0))&1)===0)g.fillRect(x+i,y+j,1,1);},
  /* engrenagem vista de frente: dentes ao redor e furo no meio */
  engrenagem(g,cx,cy,R,dentes,cor,escura,furo){
    P.circ(g,cx,cy,R-1,cor);
    for(let i=0;i<dentes;i++){const a=i/dentes*TAU,x=cx+Math.cos(a)*(R-0.5),y=cy+Math.sin(a)*(R-0.5);g.fillStyle=cor;g.fillRect(Math.round(x-1),Math.round(y-1),2,2);}
    P.anel(g,cx,cy,R-1,1,escura);if(furo)P.circ(g,cx,cy,furo,escura);
  }
};

/* ---------- fonte de pixels 3×5 (maiúsculas, minúsculas, números e sinais) ---------- */
const FONTE=(function(){
  const G={
    '0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001011001111','4':'101101111001001','5':'111100111001111',
    '6':'111100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001111',
    'A':'010101111101101','B':'110101110101110','C':'011100100100011','D':'110101101101110','E':'111100110100111','F':'111100110100100',
    'G':'011100101101011','H':'101101111101101','I':'111010010010111','J':'001001001101010','K':'101101110101101','L':'100100100100111',
    'M':'101111111101101','N':'110101101101101','O':'010101101101010','P':'110101110100100','Q':'010101101110011','R':'110101110101101',
    'S':'011100010001110','T':'111010010010010','U':'101101101101111','V':'101101101101010','W':'101101111111101','X':'101101010101101',
    'Y':'101101010010010','Z':'111001010100111',
    'a':'000011101101011','b':'100110101101110','c':'000011100100011','d':'001011101101011','e':'000010111100011','f':'011100110100100',
    'g':'000011101011110','h':'100110101101101','i':'010000010010010','j':'001000001101010','k':'100101110101101','l':'010010010010001',
    'm':'000110111101101','n':'000110101101101','o':'000010101101010','p':'000110101110100','q':'000011101011001','r':'000011100100100',
    's':'000011110011110','t':'010111010010001','u':'000101101101011','v':'000101101101010','w':'000101101111111','x':'000101010101101',
    'y':'000101011001110','z':'000111011110111',
    ' ':'000000000000000','.':'000000000000010',',':'000000000010100',':':'000010000010000','-':'000000111000000','+':'000010111010000',
    '=':'000111000111000','<':'001010100010001','>':'100010001010100','!':'010010010000010','?':'110001010000010','"':'101101000000000',
    '\'':'010010000000000','(':'010100100100010',')':'010001001001010','/':'001001010100100','_':'000000000000111','#':'101111101111101',
    '%':'101001010100101','×':'000101010101000','·':'000000010000000','→':'000010111010000'
  };
  const ACENTO={'á':['a','agudo'],'à':['a','grave'],'â':['a','circ'],'ã':['a','til'],'é':['e','agudo'],'ê':['e','circ'],'í':['i','agudo'],
    'ó':['o','agudo'],'ô':['o','circ'],'õ':['o','til'],'ú':['u','agudo'],'ç':['c','ced'],
    'Á':['A','agudo'],'Ã':['A','til'],'É':['E','agudo'],'Ê':['E','circ'],'Í':['I','agudo'],'Ó':['O','agudo'],'Õ':['O','til'],'Ú':['U','agudo'],'Ç':['C','ced']};
  function larg(t){let w=0;for(const ch of t)w+=4;return Math.max(0,w-1);}
  /* desenha o texto com o canto superior esquerdo em (x,y) */
  function texto(g,t,x,y,cor){
    g.fillStyle=cor;let cx=x|0;y|=0;
    for(const ch0 of String(t)){
      let ch=ch0,ac=null;if(ACENTO[ch0]){ch=ACENTO[ch0][0];ac=ACENTO[ch0][1];}
      const b=G[ch]||G['?'];
      for(let i=0;i<15;i++)if(b[i]==='1')g.fillRect(cx+i%3,y+((i/3)|0),1,1);
      if(ac==='agudo')g.fillRect(cx+2,y-2,1,1);else if(ac==='grave')g.fillRect(cx,y-2,1,1);
      else if(ac==='circ'){g.fillRect(cx,y-1,1,1);g.fillRect(cx+1,y-2,1,1);g.fillRect(cx+2,y-1,1,1);}
      else if(ac==='til'){g.fillRect(cx,y-2,2,1);g.fillRect(cx+2,y-2,1,1);}
      else if(ac==='ced')g.fillRect(cx+1,y+5,1,1);
      cx+=4;
    }
  }
  /* texto com sombra de 1 px, centralizado em x */
  function rotulo(g,t,x,y,cor,sombra){const w=larg(t),x0=Math.round(x-w/2);if(sombra){texto(g,t,x0+1,y+1,sombra);}texto(g,t,x0,y,cor);return w;}
  return{texto,rotulo,larg,G};
})();
