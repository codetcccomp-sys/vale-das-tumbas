/* ====================== sprites dos personagens ======================
   Explorador (16×24): chapéu de aba larga com óculos de proteção, barba, colete aberto sobre a camisa creme,
   lenço vermelho, bandoleira com cartuchos de latão, cinto com bolsas, calça cáqui, botas altas e o tubo com runas
   nas costas, como no modelo 3D. Quatro direções (a direita é a esquerda espelhada) com repouso (2 quadros, respiração),
   caminhada (4 quadros), interação (braço estendido) e dano. */
const PAL_EXP={
  o:'#24160d',H:'#9a6236',h:'#6b3f22',n:'#3a2414',g:'#e0b450',G:'#9fe0ee',
  S:'#e8b080',s:'#bf8156',d:'#3a2414',D:'#4a2e18',e:'#140a04',
  C:'#eee0b8',c:'#c4b087',V:'#7e4628',v:'#58301a',R:'#cc4a2e',r:'#8e3020',
  Y:'#ecc25a',y:'#a87a2a',L:'#3a2414',K:'#b39b62',k:'#887246',W:'#62402a',w:'#3e2616',T:'#3a3842',t:'#5e5a68'
};
/* parte de cima (cabeça e tronco, linhas 0–18) de cada direção */
const EXP_TOPO={
  baixo:[
    '................',
    '.....oooooo.....',
    '....oHHHHHHo....',
    '....oHgGGgHo....',
    '...ohHHHHHHho...',
    '..oonnnnnnnnoo..',
    '.oHHHHHHHHHHHHo.',
    'ohhhhhhhhhhhhhho',
    '.oooddSSSSddooo.',
    '....odSSSSdo....',
    '....oSeSSeSo....',
    '....oSSssSSo....',
    '....oDdSSdDo....',
    '...ooDDDDDDoo...',
    '..oCVVRRRRVVCo..',
    '.oCcVYCrrCVVcCo.',
    '.oCcVVYCCCVVcCo.',
    '.oSoVVLYLLVVoSo.',
    '..oovLLLLYLvoo..'
  ],
  cima:[
    '................',
    '.....oooooo.....',
    '....oHHHHHHo....',
    '....oHHHHHHo....',
    '...ohHHHHHHho...',
    '..oonnnnnnnnoo..',
    '.oHHHHHHHHHHHHo.',
    'ohhhhhhhhhhhhhho',
    '.ooooddddddoooo.',
    '....odddddDo....',
    '....oddddddo....',
    '....oDddddDo....',
    '....osDDDDso....',
    '...ooVVVVVTtoo..',
    '..oCVVVVVTtVCo..',
    '.oCcVVVVTtVVcCo.',
    '.oCcVVVTtVVVcCo.',
    '.oSoVVTtLLVVoSo.',
    '..oovLLLLLLvoo..'
  ],
  lado:[
    '................',
    '.....ooooo......',
    '....oHHHHHo.....',
    '....oHHHgGGo....',
    '...ohHHHHHHho...',
    '..oonnnnnnnnoo..',
    '.oHHHHHHHHHHHHo.',
    '.ohhhhhhhhhhhhhh',
    '..oooddSSSSoooo.',
    '....oddSSSSo....',
    '....odSSSeSo....',
    '....odSSSSsSo...',
    '....oDDdSSDo....',
    '...TtoDDDDDo....',
    '..oTtVVRRVVo....',
    '..oTtVVYCrCo....',
    '...oTVVVYCCo....',
    '....oVVLLYLo....',
    '....ovLLLLLo....'
  ]
};
/* pernas (linhas 19–23) por quadro: 0 parado, 1 passo A, 2 junto, 3 passo B */
const EXP_PERNAS={
  baixo:[
    ['...oKKKkKKKo....','...oKKkokKKo....','...oWWwoWWWo....','...oWWwoWWWo....','...ooooooooo....'],
    ['...oKKKkKKKo....','...oKKkokKKo....','...oWWwoKKko....','...oWWwoWWWo....','...ooooooWWo....'],
    ['...oKKKkKKKo....','...oKKkokKKo....','...oWWwoWWWo....','...oWWwoWWWo....','...ooooooooo....'],
    ['...oKKKkKKKo....','...oKKkokKKo....','...oKKkoWWWo....','...oWWwoWWWo....','...oWWoooooo....']
  ],
  lado:[
    ['.....oKKKKo.....','.....oKKkKo.....','.....oWWwWo.....','.....oWWWWWo....','.....oooooo.....'],
    ['....oKKKKKKo....','...oKKko.oKKo...','..oWWwo...oWWo..','.oWWWo....oWWWo.','.oooo......ooo..'],
    ['.....oKKKKo.....','.....oKKkKo.....','.....oWWwWo.....','.....oWWWWWo....','.....oooooo.....'],
    ['....oKKKKKKo....','....oKKo.oKko...','...oWWo...oWWo..','..oWWWo....oWWo.','..ooo......ooo..']
  ]
};
EXP_PERNAS.cima=EXP_PERNAS.baixo;
function montarExplorador(){
  const S={};
  for(const dir of['baixo','cima','lado']){
    S[dir]={andar:[],parado:[],usar:null};
    for(let f=0;f<4;f++){
      const c=cnv(16,24),bob=(f===1||f===3)?1:0;
      sprMapa(EXP_TOPO[dir],PAL_EXP,0,bob,c);
      sprMapa(EXP_PERNAS[dir][f],PAL_EXP,0,19,c);
      /* braços balançando: as mãos sobem/descem 1 px nas vistas de frente e de costas */
      if(dir!=='lado'&&f!==0&&f!==2){const g=ctx2(c);const up=f===1;P.p(g,up?1:14,17+bob,'#24160d');P.p(g,up?2:13,18+bob,PAL_EXP.S);}
      S[dir].andar.push(c);
    }
    /* repouso: respiração (o tronco sobe 1 px no segundo quadro) */
    const p0=cnv(16,24);sprMapa(EXP_TOPO[dir],PAL_EXP,0,0,p0);sprMapa(EXP_PERNAS[dir][0],PAL_EXP,0,19,p0);
    const p1=cnv(16,24);sprMapa(EXP_TOPO[dir].slice(0,13),PAL_EXP,0,1,p1);sprMapa(EXP_TOPO[dir].slice(13),PAL_EXP,0,13,p1);sprMapa(EXP_PERNAS[dir][0],PAL_EXP,0,19,p1);
    S[dir].parado=[p0,p1];
    /* interação: braço estendido à frente com a mão aberta */
    const u=cnv(16,24),gu=ctx2(u);gu.drawImage(p0,0,0);
    if(dir==='baixo'){P.r(gu,11,17,3,3,PAL_EXP.C);P.r(gu,12,19,2,2,PAL_EXP.S);contorno(u,'#24160d');}
    else if(dir==='cima'){P.r(gu,12,13,3,3,PAL_EXP.C);P.r(gu,13,11,2,2,PAL_EXP.S);contorno(u,'#24160d');}
    else{P.r(gu,10,15,4,2,PAL_EXP.C);P.r(gu,14,15,2,2,PAL_EXP.S);contorno(u,'#24160d');}
    S[dir].usar=u;
  }
  /* o desenho de lado olha para a direita; a esquerda é o espelho */
  S.direita={andar:S.lado.andar,parado:S.lado.parado,usar:S.lado.usar};
  S.esquerda={andar:S.lado.andar.map(espelhar),parado:S.lado.parado.map(espelhar),usar:espelhar(S.lado.usar)};
  return S;
}

/* ---------- guardiões e autômatos ---------- */
/* Autômato de latão (Engrenagens): corpo redondo, olhos de vidro, engrenagem nas costas, braços articulados. 16×20 */
function sprAutomato(acordado,f){
  const c=cnv(18,22),g=ctx2(c);const bob=f%2;
  const B='#c99a3e',b='#8e6a26',L='#f0cc70',E=acordado?'#ff5a3a':'#3a2a10';
  P.elip(g,9,12+bob,6,6,B);P.elip(g,8,11+bob,4,3,L);P.r(g,3,16+bob,12,1,b);
  P.circ(g,9,5+bob,3.6,B);P.r(g,7,3+bob,1,1,L);P.p(g,7,5+bob,E);P.p(g,11,5+bob,E);
  P.engrenagem(g,9,12+bob,3,6,b,'#5e4418',1);
  P.r(g,1,10+bob,2,5,b);P.r(g,15,10+bob,2,5,b);P.r(g,6,18,2,3,b);P.r(g,10,18,2,3,b);
  if(acordado){P.p(g,9,1+bob,'#ff9a3a');P.p(g,9,0+bob,'#ffe080');}
  return contorno(c,'#24160d');
}
/* Robô-vigia a diesel (Motores): caixa de aço com holofote no peito e esteiras. 18×22 */
function sprVigia(f){
  const c=cnv(18,22),g=ctx2(c),bob=f%2;
  P.r(g,3,4+bob,12,11,'#5a606c');P.r(g,4,5+bob,10,3,'#7a828e');P.r(g,3,14+bob,12,1,'#3a3f48');
  P.r(g,6,1+bob,6,4,'#4a505c');P.r(g,7,2+bob,4,1,'#cfe8ff');
  P.circ(g,9,10+bob,2.5,'#fff2b0');P.circ(g,9,10+bob,1.2,'#ffffff');
  P.r(g,2,16,6,5,'#2a2d33');P.r(g,10,16,6,5,'#2a2d33');for(let i=0;i<3;i++){P.r(g,3,17+i*2-(f%2),4,1,'#4a4f58');P.r(g,11,17+i*2-(f%2),4,1,'#4a4f58');}
  P.r(g,0,7+bob,3,5,'#4a505c');P.r(g,15,7+bob,3,5,'#4a505c');
  return contorno(c,'#141418');
}
/* Robô atômico de manutenção (Reator): cúpula branca, faixa laranja, antena com luz. 16×20 */
function sprRoboAtom(acordado,f){
  const c=cnv(18,22),g=ctx2(c),bob=f%2;
  P.elip(g,9,12+bob,6,6,'#e9e4d4');P.r(g,3,12+bob,12,2,'#ff9a3a');P.elip(g,9,10+bob,4,3,'#ffffff');
  P.circ(g,9,7+bob,2,acordado?'#ff4a3a':'#5dff7a');P.p(g,8,6+bob,'#ffffff');
  P.r(g,9,1+bob,1,4,'#9a968a');P.p(g,9,0+bob,acordado?'#ff4a3a':'#5dff7a');
  P.r(g,5,18,3,3,'#9a968a');P.r(g,10,18,3,3,'#9a968a');
  return contorno(c,'#1a1a14');
}
/* Clone (Viva): corpo translúcido lilás com núcleo brilhante. 14×22 */
function sprClone(acordado,f){
  const c=cnv(16,24),g=ctx2(c),bob=f%2;
  g.globalAlpha=0.85;
  P.circ(g,8,5+bob,3.5,'#c9a6ff');P.r(g,5,8+bob,7,9,'#a47ae6');P.r(g,6,9+bob,5,6,'#c9a6ff');
  P.r(g,3,9+bob,2,7,'#8e64d0');P.r(g,12,9+bob,2,7,'#8e64d0');P.r(g,5,17,3,5,'#8e64d0');P.r(g,9,17,3,5,'#8e64d0');
  g.globalAlpha=1;P.circ(g,8,12+bob,1.6,acordado?'#ff6aa0':'#f0e0ff');P.p(g,7,5+bob,acordado?'#ff2a6a':'#3a2a5a');P.p(g,10,5+bob,acordado?'#ff2a6a':'#3a2a5a');
  return contorno(c,'#2a1a40');
}
/* autômatos programáveis dos painéis: pequenos, com uma seta mostrando para onde olham. 14×14 */
function sprMiniAutomato(dir){
  const c=cnv(14,14),g=ctx2(c);
  P.circ(g,7,7.5,5.5,'#d8a24a');P.circ(g,7,7,4,'#f0cc70');P.circ(g,7,7,2,'#8e6a26');P.p(g,7,7,'#ffe9a0');
  const tip=[[7,0],[13,7],[7,13],[0,7]][dir];P.r(g,tip[0]-1+(dir===1?-1:dir===3?1:0),tip[1]-1+(dir===0?1:dir===2?-1:0),2,2,'#ff5a2a');
  return contorno(c,'#24160d');
}
function sprPolinizador(f){
  const c=cnv(16,14),g=ctx2(c);const a=f%2;
  P.elip(g,8,8,5,4,'#7a5aa8');P.elip(g,8,7,3,2,'#c9a6ff');P.r(g,7,3,2,2,'#4a3a6a');
  g.globalAlpha=0.7;P.elip(g,3,4-a,3,2,'#e8f4ff');P.elip(g,13,4-a,3,2,'#e8f4ff');g.globalAlpha=1;
  P.p(g,6,8,'#5dff7a');P.p(g,10,8,'#5dff7a');
  return contorno(c,'#2a1a40');
}
function sprJardineiro(f){
  const c=cnv(16,18),g=ctx2(c);const b=f%2;
  P.r(g,4,6+b,8,7,'#3f8a4a');P.r(g,5,7+b,6,3,'#7ad07a');P.circ(g,8,4+b,3,'#e9dcbc');P.p(g,7,4+b,'#2a4a7a');P.p(g,9,4+b,'#2a4a7a');
  P.r(g,3,14,4,3,'#6a5a3a');P.r(g,9,14,4,3,'#6a5a3a');P.r(g,12,8+b,3,2,'#6fd3ff');P.p(g,15,9+b,'#9fe0ee');
  return contorno(c,'#1a2a14');
}
