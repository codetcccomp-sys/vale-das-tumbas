/* ====================== Pátio de Treino ======================
   Antes da primeira tumba: um pátio de ruínas fechado por um portão de madeira. Cada passo se aprende fazendo, com uma
   frase curta no objetivo: andar até a marca → conversar com o Lume → afastar a câmera → pegar a manivela → encaixá-la
   no terminal → abrir o Guia → abrir o editor → executar acender_tocha() → prever, executar e corrigir a ordem de
   duas instruções (destravar e erguer o portão). A tocha acende, o portão abre e o caminho leva ao acampamento do vale.
   Quem já sabe jogar pode pular o treino conversando com o Lume. */
Object.assign(OBJS,{
  tocha(acesa,f,cor){const c=cnv(12,30),g=ctx2(c);P.r(g,5,10,2,19,'#6a4a2a');P.r(g,5,10,1,19,'#8a6a3a');P.r(g,2,8,8,3,'#5a4a3a');P.r(g,3,7,6,2,'#8a7a62');P.r(g,4,28,4,2,'#4a3a2a');
    if(acesa){const C=cor||'#ff9a3a',k=f%3;P.elip(g,6,4+(k===1?-1:0),3,4,C);P.elip(g,6,5,2,2.5,tom(C,0.4));P.p(g,6,6,'#fff6c0');if(k===2)P.p(g,4,1,C);}
    else{P.r(g,4,5,4,3,'#2a2018');P.p(g,5,4,'#4a4038');}
    return contorno(c,'#0b0705');},
  manivela(){const c=cnv(16,10),g=ctx2(c);P.r(g,1,4,10,2,'#b07a3a');P.r(g,1,4,10,1,'#d8a24a');P.r(g,10,1,2,8,'#b07a3a');P.r(g,11,1,4,2,'#d8a24a');P.circ(g,2,5,2,'#8a5a28');return contorno(c,'#24160d');},
  /* terminal: silhueta própria (mastro com lâmpada, faixas de latão e tela) para não se confundir com as ruínas */
  terminalTreino(com,f){const c=cnv(26,40),g=ctx2(c);
    P.r(g,12,4,2,9,'#5a4a3a');P.r(g,10,11,6,2,'#b07a3a');P.circ(g,13,4,3,'#2a2018');P.circ(g,13,4,2,com?(f%2?'#9aff9a':'#4ac05a'):(f%2?'#ffe07a':'#c8902a'));P.p(g,12,3,'#ffffff');
    P.r(g,6,13,14,10,'#a8987a');P.r(g,6,13,14,2,'#d8c8a4');P.r(g,8,15,10,6,'#14201a');
    P.r(g,9,16,5+(f%2),1,com?'#7ee08a':'#3a4a3a');P.r(g,9,18,7,1,com?'#7ee08a':'#2e3a2e');if(com&&f%2)P.r(g,16,18,1,1,'#ffffff');
    P.r(g,3,23,20,15,'#8a7a62');P.r(g,3,23,20,2,'#bfae8c');P.r(g,3,29,20,2,'#b07a3a');P.r(g,3,29,20,1,'#d8a24a');P.r(g,5,32,3,3,'#6a5a48');
    P.r(g,17,32,4,4,'#2a2018');if(com){P.r(g,18,30,2,5,'#b07a3a');P.r(g,19,28,4,2,'#d8a24a');}P.r(g,2,37,22,2,'#5a4a3a');return contorno(c,'#24160d');},
  cadeado(aberto){const c=cnv(10,13),g=ctx2(c);const C=aberto?'#5dd06a':'#d8a24a',D=aberto?'#2a7a3a':'#8a5a1a';
    P.r(g,2,aberto?0:2,2,5,'#9a9a9a');P.r(g,6,2,2,aberto?2:5,'#9a9a9a');P.r(g,2,aberto?0:2,6,2,'#bdbdbd');
    P.r(g,1,6,8,6,C);P.r(g,1,6,8,1,tom(C,0.3));P.r(g,4,8,2,3,D);return contorno(c,'#0b0705');},
  portaoMadeira(larg,est){const w=larg*16,c=cnv(w,30),g=ctx2(c);if(est===2){P.r(g,0,0,4,30,'#6a4a2a');P.r(g,w-4,0,4,30,'#6a4a2a');return contorno(c,'#24160d');}
    const h=est===1?16:28;for(let x=0;x<w;x+=6){P.r(g,x,30-h,5,h,x%12?'#8a5a32':'#9a6a3a');P.r(g,x+2,30-h,1,1,'#2a1a10');}P.r(g,0,34-h,w,3,'#6a4a2a');P.r(g,0,22,w,3,'#6a4a2a');return contorno(c,'#24160d');},
  placaTreino(){const c=cnv(22,24),g=ctx2(c);P.r(g,10,10,2,13,'#5a3a20');P.r(g,1,2,20,10,'#c89a62');P.r(g,1,2,20,2,'#e8bf88');P.r(g,4,6,14,1,'#5a3a20');P.r(g,4,8,9,1,'#5a3a20');return contorno(c,'#24160d');}
});
const MAPA_TREINO=[
  'PPPPPPPPPPPTTTTPPPPPPPPPPP',
  'PPPPPPPPPPPTTTTPPPPPPPPPPP',
  'PP.........TTTT.........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP..........TT..........PP',
  'PP......................PP',
  'PPPPPPPPPPPPPPPPPPPPPPPPPP',
  'PPPPPPPPPPPPPPPPPPPPPPPPPP'
];
const TREINO={marca:{x:12.5*16+8,y:12*16+8},term:{tx:8,ty:4},tocha:{tx:10,ty:2},manivela:{x:6.5*16,y:10*16},lume:{tx:16,ty:11}};
/* os passos do treino, na ordem do objetivo */
const PASSOS_TREINO=[
  {id:'mover',nome:'Movimentação',txt:()=>IN.mode==='touch'?'Arraste no lado esquerdo da tela e ande até a marca brilhante.':'Ande até a marca brilhante (WASD ou setas).'},
  {id:'falar',nome:'Conversa',txt:()=>'Converse com o Lume: chegue perto e aperte '+(IN.mode==='touch'?'AÇÃO':IN.mode==='pad'?'A':'E')+'.'},
  {id:'camera',nome:'Câmera',txt:()=>'Afaste a câmera para ver o pátio inteiro: '+(IN.mode==='touch'?'toque em VER.':'aperte C.')},
  {id:'coletar',nome:'Coleta',txt:()=>'Pegue a manivela de latão perto da barraca.'},
  {id:'interagir',nome:'Interação',txt:()=>'Encaixe a manivela no terminal de pedra.'},
  {id:'guia',nome:'Guia',txt:()=>'Abra o Guia de Programação: '+(IN.mode==='touch'?'botão Guia, no alto.':'aperte G (ou o botão Guia).')+' Depois feche.'},
  {id:'editor',nome:'Editor',txt:()=>'Use o terminal para abrir o editor de programação.'},
  {id:'executar',nome:'Primeiro comando',txt:()=>'No editor, escreva acender_tocha() e toque em ▶ Executar.'},
  {id:'ordem',nome:'Ordem das instruções',txt:()=>'No terminal, etapa 2: preveja, execute e corrija a ordem para abrir o portão.'}
];
CONSTRUIR.treino=function(){
  const A=novaArea('treino',MAPA_TREINO[0].length,MAPA_TREINO.length,'vale');A.fundo='#6e5034';A.gastaLanterna=false;A.mostraJogador=true;
  carregarMapa(A,MAPA_TREINO,{P:'penhasco','.':'areia',T:'trilha',g:'grama'});
  A.spawn={x:12.5*16+8,y:16*16+8,dir:'cima'};A.escuro=0;
  const T={viu:false,editor:false};A.treino=T;
  const por=(tx,ty,img,o)=>objeto(A,img,tx*16,ty*16,o);
  /* cenário: barraca, ruínas, pedras, vegetação e colunas */
  por(5,8,SPR.get('tenda','#d7c39a'),{col:[-16,-10,16,0]});por(3.5,9.5,SPR.get('caixaLote'),{col:[-6,-4,6,0]});por(4.6,10.9,SPR.get('fogueira',0),{col:[-6,-4,6,1]}).frames=[0,1,2].map(f=>SPR.get('fogueira',f));
  A.objs[A.objs.length-1].fps=6;
  for(const[x,y]of[[3,3],[22.5,3],[3,15],[22.5,15]])por(x,y,SPR.get('coluna','steam'),{col:[-6,-4,6,0]});
  por(20,7,SPR.get('muro',4,7),{col:[-16,-6,16,0]});por(19,14,SPR.get('colunaCaida'),{col:[-18,-6,18,0]});por(5,14.5,SPR.get('pedra',2,1),{col:[-12,-6,12,0]});
  for(const[x,y,v]of[[9.5,15,0],[17,9,1],[21,11,2],[4,12,3],[15.5,16.5,1]])por(x,y,SPR.get('arbusto',v),{});
  for(const[x,y]of[[22,17],[3,5.5]])por(x,y,SPR.get('cacto',1),{col:[-4,-3,4,0]});
  for(let i=0;i<26;i++){const x=2+((i*7.31)%22),y=2+((i*5.17)%15);if(A.kind(Math.floor(x),Math.floor(y))==='areia')A.decalques.push({img:SPR.get('capim',i%3),x:x*16,y:y*16});}
  /* placa de boas-vindas */
  por(10.5,15.5,SPR.get('placaTreino'),{col:[-3,-3,3,0]});
  interacao(A,{x:10.5*16,y:15.5*16+6,r:18,nome:'Placa do pátio',label:()=>'Ler a placa',use:()=>{SFX.page();toast('Pátio de Treino: aprenda fazendo. O objetivo, no alto da tela, mostra o próximo passo.');}});
  /* Lume */
  criarLume(A,TREINO.lume.tx,TREINO.lume.ty,'treino',()=>G.treino.feito?null:[{t:'Já sei jogar: pular o treino',fn:()=>confirmar('Pular o treino?','Você vai direto para o vale. Dá para voltar ao pátio pela placa do acampamento.','Pular',()=>{concluirTreino(true);})}]);
  /* manivela (coleta) */
  const mv=objeto(A,SPR.get('manivela'),TREINO.manivela.x,TREINO.manivela.y,{});mv.brilha='#ffe9a0';
  mv.desenho=(g,ob,t)=>{if(G.treino.manivela)return;blit(g,SPR.get('manivela'),ob.x,ob.y+Math.round(Math.sin(t*3)),8,10);if(Math.floor(t*3)%4===0){g.fillStyle='#fff6c0';g.fillRect(Math.round(ob.x+R.ox+3),Math.round(ob.y-12+R.oy),1,1);}};
  interacao(A,{x:TREINO.manivela.x,y:TREINO.manivela.y+4,r:18,nome:'Manivela de latão',label:()=>G.treino.manivela?null:'Pegar a manivela de latão',use:()=>{G.treino.manivela=true;SFX.frag();faiscas(TREINO.manivela.x,TREINO.manivela.y-6,8,['#ffe9a0','#d8a24a']);toast('Você pegou a manivela de latão. Ela encaixa no terminal de pedra.','good');avancarTreino();salvar(false);}});
  /* terminal de pedra: primeiro recebe a manivela, depois abre o editor */
  const tm=TREINO.term,foco={x:11*16,y:4*16};A.focoPainel=foco;
  const to=objeto(A,SPR.get('terminalTreino',false,0),tm.tx*16+8,tm.ty*16+14,{col:[-10,-6,10,0]});
  to.desenho=(g,ob,t)=>blit(g,SPR.get('terminalTreino',G.treino.passo>4,Math.floor(t*2)%2),ob.x,ob.y,13,40);
  A.term={x:tm.tx*16+8,y:tm.ty*16-34,txt:'Terminal'};
  interacao(A,{x:tm.tx*16+8,y:tm.ty*16+24,r:22,alto:44,nome:'Terminal de pedra',label:()=>{const p=G.treino.passo;if(p<=4)return G.treino.manivela?'Encaixar a manivela no terminal':'Terminal de pedra (falta a manivela)';if(p<6&&!G.guia)return'Terminal: abra o Guia antes';return'Usar o terminal (editor de programação)';},
    use:()=>{const p=G.treino.passo;
      if(p<=4){if(!G.treino.manivela){SFX.deny();toast('O terminal tem um encaixe vazio. A manivela está perto da barraca.');return;}G.treino.passo=Math.max(G.treino.passo,5);SFX.lever();faiscas(tm.tx*16+16,tm.ty*16+4,8);toast('A manivela encaixou e o terminal acordou.','good');avancarTreino();salvar(false);return;}
      if(p<6&&!G.guia){SFX.deny();toast('Antes de programar, abra o Guia de Programação: '+(IN.mode==='touch'?'botão Guia, no alto.':'aperte G.'));return;}
      abrirPainel('treino',A,foco);}});
  /* tocha do portão: acende com o código (durante a execução, mostra o estado do programa) */
  const tc=TREINO.tocha;const toc=objeto(A,SPR.get('tocha',false,0),tc.tx*16+8,tc.ty*16+14,{col:[-4,-3,4,0]});
  const tochaAcesa=()=>{const vis=PAINEL.aberto&&PAINEL.area===A?painelVis():null;return vis&&vis.cfg.mundo==='tochas'?vis.ws.acesas>0:!!G.learn.t1;};
  toc.desenho=(g,ob,t)=>blit(g,SPR.get('tocha',tochaAcesa(),Math.floor(t*8)%3),ob.x,ob.y,6,30);
  A.luzes=t=>{if(tochaAcesa())luz(tc.tx*16+8,tc.ty*16-12,40+Math.sin(t*9)*2,1,'#ff9a3a');
    luz(tm.tx*16+8,tm.ty*16-22,14+Math.sin(t*4)*3,0.9,G.treino.passo>4?'#7eff8a':'#ffd24a');};
  /* portão de madeira com trava: abre com o desafio da ordem (t2); durante a execução, mostra o que o código faz.
     Numa visita depois do treino, já está aberto. */
  const visPatio=()=>{const v=PAINEL.aberto&&PAINEL.area===A?painelVis():null;return v&&v.cfg.mundo==='patio'?v.ws:null;};
  const saida=()=>!!G.learn.t2||G.treino.feito;
  const aberto=()=>{const w=visPatio();return w?w.aberto:saida();},travado=()=>{const w=visPatio();return w?w.trava:!saida();};
  portao(A,11,1,4,'portaoMadeira',aberto);
  const cad=objeto(A,SPR.get('cadeado',false),13*16,1*16+12,{camada:8});
  cad.desenho=(g,ob,t)=>{if(aberto())return;const tr=travado();blit(g,SPR.get('cadeado',!tr),ob.x,ob.y+(tr?0:Math.round(Math.sin(t*6))),5,12);};
  A.update=(dt,t)=>{
    if(G.mode==='play'&&G.treino.passo===0&&Math.hypot(G.p.x-TREINO.marca.x,G.p.y-TREINO.marca.y)<14)avancarTreino();
    if(G.mode==='play'&&saida()&&G.p.y<1.3*16&&G.p.x>11*16&&G.p.x<15*16)concluirTreino(!G.learn.t2);
    if(tochaAcesa()&&Math.random()<dt*4)particula({x:tc.tx*16+8+(Math.random()-0.5)*4,y:tc.ty*16+14,z:26,vz:14,vx:(Math.random()-0.5)*6,vida:0.7,cores:['#fff2a0','#ffb43a','#7a4a2a'],fade:true});
  };
  /* marca brilhante no chão (primeiro passo) */
  A.desenharChao=(g,t)=>{if(G.treino.passo>0)return;const x=Math.round(TREINO.marca.x+R.ox),y=Math.round(TREINO.marca.y+R.oy),k=Math.floor(t*4)%2;
    g.globalAlpha=0.55+0.25*Math.sin(t*4);P.anel(g,x,y,8+k,2,'#ffd24a');P.anel(g,x,y,4,1,'#fff6c0');g.globalAlpha=1;};
  A.focoEvento=ev=>ev.cmd==='tocha'?{x:tc.tx*16+8,y:tc.ty*16-18}:ev.cmd==='destravar'||ev.cmd==='erguer'?{x:13*16,y:1*16-6}:null;
  A.aoVista=longe=>{if(longe&&!T.viu){T.viu=true;avancarTreino();}};
  A.aoGuia=()=>avancarTreino();
  A.aoAbrirPainel=()=>{T.editor=true;avancarTreino();};
  A.aoConcluir=cfg=>{avancarTreino();R.treme=0.4;setTimeout(()=>toast(cfg.id==='t1'?'A tocha acendeu! Agora o portão: no painel, toque na etapa 2.':'O portão do pátio se abriu! Atravesse-o para chegar ao vale.','good'),600);};
  A.objetivo=()=>{const p=G.treino.passo;if(p>=PASSOS_TREINO.length)return{t:'Treino concluído',s:saida()?'Atravesse o portão, ao norte, para chegar ao vale.':'Volte ao terminal e abra o portão (etapa 2).',alvo:saida()?{x:13*16,y:1*16-6,txt:'Saída para o vale'}:Object.assign({},A.term,{txt:'Programe aqui'})};
    const tm2=t=>Object.assign({},A.term,{txt:t});
    const alvo=[{x:TREINO.marca.x,y:TREINO.marca.y-14,txt:'Ande até aqui'},{x:TREINO.lume.tx*16+8,y:TREINO.lume.ty*16-22,txt:'Lume'},null,
      G.treino.manivela?null:{x:TREINO.manivela.x,y:TREINO.manivela.y-14,txt:'Manivela'},tm2('Encaixe a manivela'),null,tm2('Abra o editor'),tm2('Programe aqui'),tm2('Programe aqui')][p];
    return{t:'Treino '+(p+1)+' de '+PASSOS_TREINO.length+' · '+PASSOS_TREINO[p].nome,s:PASSOS_TREINO[p].txt(),alvo};};
  A.reiniciar=()=>{T.viu=false;T.editor=false;};
  return A;
};
/* avança o treino enquanto o passo da vez já estiver feito (dá para fazer algo antes da hora) */
function avancarTreino(){
  const A=AREAS.treino;if(!A||G.area!==A)return;const T=A.treino;
  const feito=[()=>Math.hypot(G.p.x-TREINO.marca.x,G.p.y-TREINO.marca.y)<14,()=>!!G.lumeFalou,()=>T.viu,()=>G.treino.manivela,()=>G.treino.passo>4,()=>G.guia,()=>T.editor,()=>!!G.learn.t1,()=>!!G.learn.t2];
  let mudou=false;
  while(G.treino.passo<PASSOS_TREINO.length&&feito[G.treino.passo]()){const P0=PASSOS_TREINO[G.treino.passo];G.treino.passo++;mudou=true;toast('✔ '+P0.nome,'good');}
  if(mudou){SFX.sensor();salvar(false);}
}
/* fim do treino: segue para o acampamento do vale */
function concluirTreino(pulou){
  if(G.treino.feito&&G.area!==AREAS.treino)return;
  const revisita=G.treino.feito;G.treino.feito=true;if(!pulou)addDiary('treino',true);
  transicao(()=>{const V=AREAS.vale;trocarArea(V,V.spawn.x,V.spawn.y,'cima');G.curTomb=null;salvar(false);
    setTimeout(()=>{if(G.mode==='play')toast(revisita?'De volta ao vale.':pulou?'Treino pulado. O Lume fica no acampamento, se precisar.':'Você chegou ao vale. O Lume espera no acampamento, e o objetivo no alto mostra o caminho.','good');},500);},pulou&&!revisita?null:'Saindo do pátio…');
}
function entrarTreino(){
  if(!AREAS.treino)AREAS.treino=CONSTRUIR.treino();
  const A=AREAS.treino;
  transicao(()=>{A.reiniciar();trocarArea(A,A.spawn.x,A.spawn.y,'cima');G.curTomb=null;},'Indo ao pátio de treino…');
}
