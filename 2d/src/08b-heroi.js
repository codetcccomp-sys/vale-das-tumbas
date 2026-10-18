/* ====================== personagem principal ======================
   Desenhado a partir da referência oficial: tapa-olho escuro no olho direito (com a tira em volta da cabeça) sobre o
   cabelo grisalho preso em coque, roupa ocre e dourada com textura gasta, faixa roxo-azulada atravessada no peito, lenço
   vermelho, cinto com cartucheira vermelha e bolsinha, babado amarelo, botas escuras e a bengala alta: ponta escura,
   anel verde, mecanismo de suportes, empunhadura ocre e pé largo.
   Cada quadro tem 40×46 pixels com o ponto de referência nos pés (20, 44): a colisão do jogo continua sendo a caixa dos
   pés (12×6 px), então a bengala não aumenta a área de colisão.
   As partes são montadas em camadas por quadro: botas, braço de trás, tronco, cabeça, bengala e braço da frente; os
   braços são traçados do ombro até a mão, então a mão acompanha a bengala quando ela sobe e anda com o passo. */
const HEROI_PAL={
  o:'#140c0a',H:'#b4a682',h:'#82775c',L:'#d8cca4',b:'#6c7898',G:'#2c2422',g:'#b4c44c',l:'#eef49c',
  S:'#eab45c',s:'#b47e3a',K:'#f8d48c',D:'#dccc7c',d:'#a89a56',E:'#f2e8aa',p:'#767a70',Y:'#ecc62e',y:'#b0921e',
  U:'#4048b8',u:'#262c80',R:'#d65a2c',r:'#902e16',T:'#5e3c20',Z:'#cc3a2c',W:'#f4ece0',O:'#b4a23a',q:'#7a6a22',
  B:'#9a6420',n:'#563612',N:'#c08a36',Q:'#6e4618',
  C:'#363250',c:'#24212f',X:'#5c5880',P:'#2c2840',A:'#4c7e5c',a:'#2e5040',e:'#7cae86',M:'#28272e',m:'#5c6068',
  J:'#de9c3c',j:'#a8702a',k:'#f4c068',F:'#4c4870',f:'#6a669a'
};
const HEROI={W:40,H:46,ax:20,ay:44};
/* bengala de lado (o mecanismo aponta para o corpo) e de frente (o mecanismo fica estreito, à frente da haste) */
const BENG_LADO=['.....P...','....PPP..','....PXP..','...PPXPP.','...PXXPP.','...PXXfP.','...PPXPP.','...PPXPP.','....PXP..','....PXP..',
  '....cCc..','...aAeAa.','...aAAAa.','....aAa..','....CXC..','.MMmCXC..','.MmmCXC..','..MMCXC..','..mMCXC..','MMMMCXC..','MmmMCXC..','MMMMCXC..','.MMMCXC..',
  '....CXC..','....CXC..','....JkJ..','....JkJ..','....JkJ..','....JkJ..','....jJj..','....jJj..','.....j...','....cCc..','.....C...','...FFfFF.','..FFFfFFF','..ccccccc'];
const BENG_FRENTE=['...P...','..PPP..','..PXP..','.PPXPP.','.PXXPP.','.PXXfP.','.PPXPP.','.PPXPP.','..PXP..','..PXP..',
  '..cCc..','.aAeAa.','.aAAAa.','..aAa..','..CXC..','..MmM..','.MMmMM.','..MMM..','..CXC..','.MMmMM.','.MmmMM.','.MMMMM.','..MMM..',
  '..CXC..','..CXC..','..JkJ..','..JkJ..','..JkJ..','..JkJ..','..jJj..','..jJj..','...j...','..cCc..','...C...','.FFfFF.','FFFfFFF','ccccccc'];
/* cabeças: de lado (olhando para a direita), de frente e de costas. Tapa-olho no olho DIREITO da personagem: de frente
   ele fica à esquerda da tela; de perfil para a direita, é o olho que se vê; de perfil para a esquerda aparece o olho
   esquerdo, livre, e só a tira passa por cima do cabelo; de costas, a tira cruza a nuca. G = tapa-olho e tira. */
const CAB_LADO=['.LLHH..........','LHLHHh.........','HHbHHhoHHH.....','hHHHHHHLHHHHH..','.hHHbHHHHHLHHH.','HHHHHHhHHHHbHHH','HhGGGHHHHHHHHHH',
  'HHHHHGGGGGGGGSS','hHHHHSsSSSGGGSS','.hHHsSSSSSGGSSSK','..hHsSSSSSSSrSSs','...hhsSSSSSSSs..','.....sSSSSSs....'];
const CAB_LADO_ESQ=['.LLHH..........','LHLHHh.........','HHbHHhoHHH.....','hHHHHHHLHHHHH..','.hHHbHHGGGGGHHH','HHGGGGGHHHHbHHH','HhHbHHHHHHHHHHH',
  'HHHHHHHHHHSSSSS','hHHHHSsSSSSoSSS','.hHHsSSSSSSSSSSK','..hHsSSSSSSSrSSs','...hhsSSSSSSSs..','.....sSSSSSs....'];
const CAB_FRENTE=['.....LHHL.....','....LHHbHh....','....hHHHhh....','..HHhhhhhhHH..','.HLHHHHbHHGGHH','.HHbHHHHGGHHbH','HhHHHHGGHHhHHH',
  'HhHHGGSSSSSSHH','HGGGGSSSSSSSSH','hGGGGSSSSSoSHh','hHGGSSSKSSSSHh','.hsSSSSsSSSSh.','..sSSSrrSSSs..','...sSSSSSSs...'];
const CAB_COSTAS=['.....LHHL.....','....LHbHHh....','....hHHHhh....','..HHhhhhhhHH..','.HGGbHHHLHHHHH','.HLHGGHHHHHbHH','HhHHHHGGHHHHhH',
  'HHHHHHHHGGHHHH','HHHHHhHHHbGGHH','HHhHHHHHHHhHGG','hHHHbHHHHHHHHh','.hHHHhHHHhHHh.','..hhHHhhHHhh..','...ssSSSSss...'];
/* troncos: lenço, vestido com a faixa, cinto com cartucheira e bolsinha, babado */
const TRONCO_LADO=['.....RRRRrRR..','....DDDRRrRDD.','...DEDDUUUDpDD','..DEDDUUuDDDDD','..DDpUUuDDDDdD','..DDUUuDDpDDdD','..TTUuTTTZWZTT',
  '..DdDDDDOOODdD','.DDpDDDDOqODDdD','.DEDDDDpDOODDDd','DDDDDDDDDDDpDDdD','YyYYyYYyYYyYYyYY','.y..y..y..y..y..'];
const TRONCO_FRENTE=['.....RRrRR.....','...DDRRrrRDD...','..DEDDDRDDUUD..','..DEDDDDUUuDD..','..DDDDUUuDDpD..','..DpDUUuDDDDD..','..TTUuTTTTTZWZT',
  '..DDdDDOODDDdD.','.DDDpDOqqODDDdD','.DEDDDDOODDpDDd','DDDDpDDDDDDDDDdD','YyYYyYYyYYyYYyYY','.y..y..y..y..y..'];
const TRONCO_COSTAS=['.....DDDD......','...DDDDDDDD....','..DEDUUDDDDD...','..DDDDUUDDDD...','..DDpDDUUuDD...','..DDDDDDUUuD...','..TTTTTTTUuTT..',
  '..DDdDDDDDDdD..','.DDDpDDDDDDDDdD','.DEDDDDDpDDDDDd','DDDDpDDDDDDDDDdD','YyYYyYYyYYyYYyYY','.y..y..y..y..y..'];
const BOTA_LADO=['.nBBB..','.nBBB..','NBBBB..','NBBBBBB','nnnnnnn'];
const BOTA_FRENTE=['.nBBn','.nBBB','NBBBB','BBBBB','nnnnn'];
const MAO=['oKSo','SSSS','sSSs','.ss.'];
const MAO_LIVRE=['.SS.','SKSS','SSSs','.ss.'];

function heroiMapa(g,linhas,ox,oy,troca){
  for(let y=0;y<linhas.length;y++){const l=linhas[y];for(let x=0;x<l.length;x++){let ch=l[x];if(ch==='.'||ch===' ')continue;if(troca&&troca[ch])ch=troca[ch];const c=HEROI_PAL[ch];if(!c)continue;g.fillStyle=c;g.fillRect((ox|0)+x,(oy|0)+y,1,1);}}
}
/* braço traçado do ombro até a mão (com cotovelo opcional): 3 px de largura, sombra embaixo */
function heroiBraco(g,pts){
  const pinta=new Set();
  for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*2));
    for(let k=0;k<=n;k++){const x=Math.round(lerp(a[0],b[0],k/n)),y=Math.round(lerp(a[1],b[1],k/n));for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(Math.abs(dx)+Math.abs(dy)<2)pinta.add((x+dx)+','+(y+dy));}}
  for(const k of pinta){const[x,y]=k.split(',').map(Number);const embaixo=!pinta.has(x+','+(y+1));g.fillStyle=embaixo?HEROI_PAL.s:HEROI_PAL.S;g.fillRect(x,y,1,1);}
}
/* um quadro: vista ('lado'|'frente'|'costas'), pose e deslocamentos */
function heroiQuadro(vista,q){
  const c=cnv(HEROI.W,HEROI.H),g=ctx2(c),dy=q.dy||0,bx=q.bx||0,by=q.by||0,dx=q.dx||0;
  const troca=q.brilho?{g:'l'}:null,aperta=q.aperta||0;
  if(vista==='lado'){
    /* botas: a de trás (mais escura) primeiro */
    const b=q.botas||[[0,0],[0,0]];
    heroiMapa(g,BOTA_LADO,16+b[1][0],39-b[1][1],{B:'Q',N:'B'});
    heroiMapa(g,BOTA_LADO,16+b[0][0],39-b[0][1]);
    /* braço de trás (mão na cintura, ou erguido no dano) */
    if(q.livre==='quadril')heroiBraco(g,[[15+dx,29+dy],[11+dx,32+dy],[13+dx,35+dy]]),heroiMapa(g,MAO_LIVRE,11+dx,34+dy);
    else if(q.livre==='dano')heroiBraco(g,[[15+dx,29+dy],[11+dx,27+dy],[9+dx,24+dy]]),heroiMapa(g,MAO_LIVRE,7+dx,22+dy);
    heroiMapa(g,TRONCO_LADO,12+dx,27+dy);
    heroiMapa(g,q.esq?CAB_LADO_ESQ:CAB_LADO,12+dx+(q.inclina||0),14+dy+(q.dano?-1:0),troca);
    if(q.dano){g.fillStyle=HEROI_PAL.o;g.fillRect(24+dx,23+dy,2,2);}
    /* bengala e a mão da frente agarrada à empunhadura */
    heroiMapa(g,BENG_LADO,27+bx,7+by);
    heroiBraco(g,[[22+dx,29+dy],[27+Math.round(bx/2),31+dy+Math.round(by/2)],[30+bx,33+by]]);
    heroiMapa(g,MAO,29+bx,31+by);
    /* interação: o braço livre passa à frente do corpo e toca o objeto */
    if(q.livre==='meio')heroiBraco(g,[[17+dx,30+dy],[23+dx,32+dy],[29+dx,31+dy]]),heroiMapa(g,MAO_LIVRE,28+dx,29+dy);
    if(q.livre==='estica')heroiBraco(g,[[17+dx,30+dy],[25+dx,31+dy],[34+dx+aperta,29+dy]]),heroiMapa(g,MAO_LIVRE,33+dx+aperta,27+dy);
  }else{
    const frente=vista==='frente',cab=frente?CAB_FRENTE:CAB_COSTAS,tr=frente?TRONCO_FRENTE:TRONCO_COSTAS;
    const b=q.botas||[0,0];
    heroiMapa(g,BOTA_FRENTE,14,39-b[0]);heroiMapa(g,BOTA_FRENTE,21,39-b[1]);
    /* de frente a bengala fica à esquerda da tela (na mão direita do personagem); de costas, à direita.
       sx aponta para fora do lado do braço livre */
    const bxB=frente?5:28,sx=frente?1:-1;
    const ombroB=frente?[13,29]:[27,29],ombroL=frente?[27,29]:[13,29],oL=[ombroL[0]+dx,ombroL[1]+dy],L=q.livre;
    if(!frente)heroiMapa(g,BENG_FRENTE,bxB+bx,7+by);
    /* atrás do tronco: braço na cintura; de costas, o braço que alcança o objeto (à frente do personagem, longe da câmera) */
    if(L==='quadril')heroiBraco(g,[oL,[oL[0]+sx*3,32+dy],[oL[0],35+dy]]);
    if(!frente&&(L==='meio'||L==='estica'))heroiBraco(g,[oL,[oL[0]-2,25+dy],[oL[0]+(L==='meio'?-1:0),(L==='meio'?23:21-aperta)+dy]]),
      heroiMapa(g,MAO_LIVRE,oL[0]-3+(L==='meio'?0:1),(L==='meio'?21:19-aperta)+dy);
    heroiMapa(g,tr,12+dx,27+dy);
    if(L==='quadril')heroiMapa(g,MAO_LIVRE,oL[0]-2,34+dy);
    heroiMapa(g,cab,13+dx,14+dy+(q.dano?-1:0)+(frente&&q.inclina?1:0),troca);
    if(q.dano&&frente){g.fillStyle=HEROI_PAL.o;g.fillRect(19+dx,24+dy,2,2);}
    if(frente)heroiMapa(g,BENG_FRENTE,bxB+bx,7+by);
    heroiBraco(g,[[ombroB[0]+dx,ombroB[1]+dy],[bxB+3+bx+(frente?2:-2),31+dy+Math.round(by/2)],[bxB+3+bx,33+by]]);
    heroiMapa(g,MAO,bxB+1+bx,31+by);
    /* de frente, alcançar é estender a mão para baixo, à frente da roupa (na direção da câmera) */
    if(frente&&L==='meio')heroiBraco(g,[oL,[oL[0]+1,32+dy],[oL[0]-2,34+dy]]),heroiMapa(g,MAO_LIVRE,oL[0]-4,33+dy);
    if(frente&&L==='estica')heroiBraco(g,[oL,[oL[0]+1,33+dy],[oL[0]-3,36+dy+aperta]]),heroiMapa(g,MAO_LIVRE,oL[0]-5,35+dy+aperta);
    /* dano: o braço livre é jogado para fora e para cima */
    if(L==='dano')heroiBraco(g,[oL,[oL[0]+sx*4,27+dy],[oL[0]+sx*6,23+dy]]),heroiMapa(g,MAO_LIVRE,oL[0]+sx*6-2,21+dy);
  }
  contorno(c,HEROI_PAL.o);
  if(q.flash){const f=silhueta(c,'#ffffff',0.6);g.drawImage(f,0,0);}
  return c;
}
/* poses de cada animação. botas de lado: [[dx,altura] da bota da frente, [dx,altura] da de trás];
   de frente/costas: [altura esquerda, altura direita]. bx/by movem a bengala (e a mão junto); dy é o balanço do corpo. */
const HEROI_ANIM={
  lado:{
    parado:[{botas:[[2,0],[-2,0]],livre:'quadril'},{botas:[[2,0],[-2,0]],livre:'quadril',dy:-1},{botas:[[2,0],[-2,0]],livre:'quadril',dy:-1,brilho:1},{botas:[[2,0],[-2,0]],livre:'quadril'}],
    /* passo A (frames 0–3): a ponta da bengala fica apoiada no chão e vai ficando para trás enquanto o corpo avança;
       passo B (4–7): ela sobe em arco, passa à frente e desce até tocar o chão de novo (by 0 = ponta na linha dos pés) */
    andar:[
      {botas:[[4,0],[-4,0]],livre:'quadril',bx:3},
      {botas:[[3,0],[-3,0]],livre:'quadril',bx:1,dy:1},
      {botas:[[1,0],[-1,2]],livre:'quadril',bx:-1},
      {botas:[[-1,0],[2,1]],livre:'quadril',bx:-3,dy:-1},
      {botas:[[-4,0],[4,0]],livre:'quadril',bx:-2,by:-2},
      {botas:[[-3,0],[3,0]],livre:'quadril',bx:0,by:-3,dy:1},
      {botas:[[-1,2],[1,0]],livre:'quadril',bx:2,by:-2},
      {botas:[[2,1],[-1,0]],livre:'quadril',bx:3,by:-1,dy:-1}],
    usar:[{botas:[[2,0],[-2,0]],livre:'meio'},{botas:[[2,0],[-2,0]],livre:'estica',inclina:1},{botas:[[2,0],[-2,0]],livre:'estica',inclina:1,aperta:1}],
    dano:[{botas:[[1,0],[-3,0]],livre:'dano',dx:-1,bx:1,by:-1,dano:1},{botas:[[1,0],[-3,0]],livre:'dano',dx:-1,bx:1,by:-1,dano:1,flash:1}]
  },
  frente:{
    parado:[{livre:'quadril'},{livre:'quadril',dy:-1},{livre:'quadril',dy:-1,brilho:1},{livre:'quadril'}],
    andar:[
      {botas:[0,0],livre:'quadril'},{botas:[0,0],livre:'quadril',dy:1},{botas:[2,0],livre:'quadril'},{botas:[1,0],livre:'quadril',dy:-1},
      {botas:[0,0],livre:'quadril',by:-2},{botas:[0,0],livre:'quadril',dy:1,by:-2},{botas:[0,2],livre:'quadril',by:-1},{botas:[0,1],livre:'quadril',dy:-1}],
    usar:[{livre:'meio'},{livre:'estica',inclina:1},{livre:'estica',inclina:1,aperta:1}],
    dano:[{livre:'dano',by:-1,dano:1},{livre:'dano',by:-1,dano:1,flash:1}]
  }
};
HEROI_ANIM.costas=HEROI_ANIM.frente;
/* monta todos os quadros: S[direção] = {parado:[4], andar:[8], usar:[3], dano:[2]} */
function montarHeroi(){
  const S={},vistas={baixo:'frente',cima:'costas',direita:'lado'};
  for(const dir in vistas){const v=vistas[dir],A=HEROI_ANIM[v];S[dir]={};for(const an in A)S[dir][an]=A[an].map(q=>heroiQuadro(v,q));}
  /* a esquerda é o perfil espelhado, mas com a cabeça do lado esquerdo (olho livre; o tapa-olho fica do outro lado) */
  S.esquerda={};for(const an in HEROI_ANIM.lado)S.esquerda[an]=HEROI_ANIM.lado[an].map(q=>espelhar(heroiQuadro('lado',Object.assign({},q,{esq:1}))));
  return S;
}
/* configuração das animações (também vai para o JSON junto com a folha de sprites) */
const HEROI_CONFIG={celula:{largura:HEROI.W,altura:HEROI.H},ancora:{x:HEROI.ax,y:HEROI.ay,descricao:'centro da base dos pés'},
  colisao:{largura:12,altura:6,descricao:'caixa nos pés, centrada na âncora; a bengala não entra na colisão'},
  direcoes:['baixo','cima','esquerda','direita'],
  animacoes:{parado:{quadros:4,fps:3,repete:true},andar:{quadros:8,porPixel:0.18,correndoPorPixel:0.15,repete:true,nota:'avança com a distância andada (quadros por pixel); 8 quadros = dois passos, com a bengala apoiada no primeiro e levada à frente no segundo'},
    usar:{quadros:3,duracao:0.32,repete:false},dano:{quadros:2,fps:12,duracao:0.4,repete:true}}};
/* folha de sprites: uma linha por direção e animação, células iguais, fundo transparente */
function folhaHeroi(){
  const S=montarHeroi(),dirs=HEROI_CONFIG.direcoes,ans=['parado','andar','usar','dano'],linhas=[];
  for(const d of dirs)for(const a of ans)linhas.push({d,a,q:S[d][a]});
  const col=8,c=cnv(col*HEROI.W,linhas.length*HEROI.H),g=ctx2(c),mapa=[];
  linhas.forEach((L,i)=>{L.q.forEach((im,j)=>g.drawImage(im,j*HEROI.W,i*HEROI.H));mapa.push({direcao:L.d,animacao:L.a,linha:i,quadros:L.q.length});});
  return{canvas:c,config:Object.assign({},HEROI_CONFIG,{folha:{colunas:col,linhas:linhas.length,ordem:mapa}})};
}
