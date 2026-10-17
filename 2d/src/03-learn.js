/* ====================== aprendizagem: comandos, mundos dos desafios, etapas e saberes ======================
   Tudo aqui é lógica pura (sem DOM): cada desafio diz quais placas aparecem, quais contêineres e sensores existem, quais
   valores (objetos) estão disponíveis, as situações em que o programa é testado, as dicas graduais e o exemplo que fica
   guardado. Cada "mundo" é o modelo do mecanismo da sala: o interpretador (LANG) chama mundo.cmd() a cada comando e
   mundo.fim() quando o programa termina; a sala só desenha o estado (ws) que o mundo mantém.
   Progressão: Instruções (Engrenagens) → Dados e variáveis (Motores) → Decisões (Reator) → Repetições e automação (Viva)
   → tudo junto (Cidade-Jardim). */
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
const DIR_NOME=['para cima','para a direita','para baixo','para a esquerda'];

Object.assign(LANG.CMD,{
  fwd:{nome:'AVANÇAR',sim:'⬆',ajuda:'anda uma casa na direção da seta'},
  right:{nome:'VIRAR À DIREITA',sim:'↻',ajuda:'gira 90° na mesma casa, sem andar'},
  act:{nome:'ATIVAR',sim:'✦',ajuda:'aciona o mecanismo, só em cima do destino'},
  separar:{nome:'SEPARAR LOTE',sim:'⚙',ajuda:'a separadora consulta quantidade e separa essa quantidade de peças'},
  mc:{nome:'LIGAR MONTA-CARGAS',sim:'⇅',ajuda:'o monta-cargas consulta carga, oleo, codigo e freio'},
  abrir:{nome:'ABRIR COMPORTA',sim:'▤',ajuda:'abre a comporta; o motor dela precisa de energia 5 ou mais'},
  carregar:{nome:'LIGAR CARREGADOR',sim:'⚡',ajuda:'liga o carregador da bateria do reator'},
  portao:{nome:'ABRIR PORTÃO',sim:'◫',ajuda:'abre o portão de manutenção; só abre com a água abaixo do limite'},
  drenar:{nome:'DRENAR TANQUE',sim:'⇩',ajuda:'abre o dreno e baixa a água do tanque'},
  irrigar:{nome:'IRRIGAR',sim:'💧',ajuda:'dá uma dose de água ao organismo da frente (umidade + 1)'},
  avancar:{nome:'AVANÇAR',sim:'➜',ajuda:'anda uma posição no trilho'},
  acender:{nome:'ACENDER JARDIM',sim:'☀',ajuda:'na fonte, informa quantos canteiros foram regados e acende a cidade'}
});
/* nome e símbolo das placas de estrutura (aparecem na paleta junto com os comandos) */
const BLOCO_INFO={
  set:{nome:'GUARDAR  =',sim:'▣',ajuda:'guarda um valor num contêiner (atribuição)'},
  se:{nome:'SE … ENTÃO',sim:'◇',ajuda:'executa o bloco só quando a condição for verdadeira'},
  sese:{nome:'SE … SENÃO',sim:'◈',ajuda:'um caminho para verdadeiro e outro para falso'},
  rep:{nome:'REPETIR n VEZES',sim:'⟳',ajuda:'repete o bloco um número fixo de vezes'},
  enq:{nome:'ENQUANTO',sim:'∞',ajuda:'repete o bloco enquanto a condição for verdadeira'}
};
function blocoInfo(b){return BLOCO_INFO[b]||LANG.CMD[b]||{nome:b,sim:'?',ajuda:''};}

/* ---------- objetos que representam valores (pixel art desenhada em 08-sprites.js pelo campo icone) ---------- */
const LV=LANG.val;
const OBJ={
  eng5:{icone:'engr',rotulo:'5',nome:'Lote de engrenagens marcado com 5',val:LV('int',5)},
  eng3:{icone:'engr',rotulo:'3',nome:'Lote de engrenagens marcado com 3',val:LV('int',3)},
  eng8:{icone:'engr',rotulo:'8',nome:'Lote de engrenagens marcado com 8',val:LV('int',8)},
  eng0:{icone:'engr',rotulo:'0',nome:'Lote vazio de engrenagens, marcado com 0',val:LV('int',0)},
  gal314:{icone:'galao',rotulo:'3,14 L',nome:'Galão com 3,14 litros',val:LV('float',3.14)},
  gal25:{icone:'galao',rotulo:'2,5 L',nome:'Galão com 2,5 litros',val:LV('float',2.5)},
  plAbrir:{icone:'placa',rotulo:'"ABRIR"',nome:'Placa com a inscrição ABRIR',val:LV('str','ABRIR')},
  pl5:{icone:'placa',rotulo:'"5"',nome:'Placa com a inscrição 5',val:LV('str','5')},
  fusOn:{icone:'fusivel1',rotulo:'True',nome:'Fusível ligado',val:LV('bool',true)},
  fusOff:{icone:'fusivel0',rotulo:'False',nome:'Fusível desligado',val:LV('bool',false)},
  /* monta-cargas: aparências novas para o jogador interpretar o dado */
  cx12:{icone:'caixas',rotulo:'12',nome:'Pilha de caixas com o número 12',val:LV('int',12)},
  cx7:{icone:'caixas',rotulo:'7',nome:'Pilha de caixas com o número 7',val:LV('int',7)},
  ct12:{icone:'cartao',rotulo:'"12"',nome:'Cartão perfurado com a inscrição 12',val:LV('str','12')},
  fr075:{icone:'frasco',rotulo:'0,75 L',nome:'Frasco de óleo com 0,75 litro',val:LV('float',0.75)},
  fr05:{icone:'frasco',rotulo:'0,5 L',nome:'Frasco de óleo com 0,5 litro',val:LV('float',0.5)},
  ctMotor:{icone:'cartao',rotulo:'"MOTOR"',nome:'Cartão perfurado com a inscrição MOTOR',val:LV('str','MOTOR')},
  ctMotorMin:{icone:'cartao',rotulo:'"motor"',nome:'Cartão perfurado com a inscrição motor',val:LV('str','motor')},
  alvTrue:{icone:'alavanca1',rotulo:'True',nome:'Alavanca puxada (True)',val:LV('bool',true)},
  alvFalse:{icone:'alavanca0',rotulo:'False',nome:'Alavanca solta (False)',val:LV('bool',false)},
  /* plaquetas numeradas do Reator e da Cidade */
  n3:{icone:'plaq',rotulo:'3',nome:'Plaqueta 3',val:LV('int',3)},
  n4:{icone:'plaq',rotulo:'4',nome:'Plaqueta 4',val:LV('int',4)},
  n5:{icone:'plaq',rotulo:'5',nome:'Plaqueta 5',val:LV('int',5)},
  n7:{icone:'plaq',rotulo:'7',nome:'Plaqueta 7',val:LV('int',7)},
  n0:{icone:'plaq',rotulo:'0',nome:'Plaqueta 0',val:LV('int',0)},
  n1:{icone:'plaq',rotulo:'1',nome:'Plaqueta 1',val:LV('int',1)},
  n2:{icone:'plaq',rotulo:'2',nome:'Plaqueta 2',val:LV('int',2)},
  s4:{icone:'placa',rotulo:'"4"',nome:'Placa com a inscrição 4',val:LV('str','4')},
  f4:{icone:'plaqDec',rotulo:'4.0',nome:'Plaqueta decimal 4.0',val:LV('float',4)},
  seco:{icone:'placa',rotulo:'"seco"',nome:'Placa com a palavra seco',val:LV('str','seco')},
  umido:{icone:'placa',rotulo:'"úmido"',nome:'Placa com a palavra úmido',val:LV('str','úmido')}
};
for(const k in OBJ)OBJ[k].id=k;

/* ====================== mundos ====================== */
const MUNDOS={};
/* --- Engrenagens: tabuleiro do autômato. '.' livre, '#' pedra, 'G' destino --- */
const casaG=(w,x,y)=>y<0||y>=w.grid.length||x<0||x>=w.grid[0].length?null:w.grid[y][x];
MUNDOS.grade={
  init(sit){return{grid:sit.grid,x:sit.start.x,y:sit.start.y,dir:sit.start.dir,ativo:false,demo:!!sit.demo,rastro:[[sit.start.x,sit.start.y]]};},
  cmd(w,c){
    if(c==='fwd'){
      const d=DIRS[w.dir],nx=w.x+d[0],ny=w.y+d[1],k=casaG(w,nx,ny);
      if(k===null)return{erro:{tipo:'limite',msg:'à frente acaba o tabuleiro, e o autômato não pode sair dele. Ele estava olhando '+DIR_NOME[w.dir]+'.'},anim:{bate:{x:nx,y:ny}}};
      if(k==='#')return{erro:{tipo:'parede',msg:'há uma pedra na casa à frente, e o autômato não atravessa obstáculos. Ele estava olhando '+DIR_NOME[w.dir]+'.'},anim:{bate:{x:nx,y:ny}}};
      const de={x:w.x,y:w.y};w.x=nx;w.y=ny;w.rastro.push([nx,ny]);
      return{anim:{anda:{de,para:{x:nx,y:ny}}},msg:'O autômato avançou uma casa.'};
    }
    if(c==='right'){w.dir=(w.dir+1)%4;return{anim:{gira:w.dir},msg:'O autômato girou na mesma casa e agora olha '+DIR_NOME[w.dir]+'.'};}
    if(c==='act'){
      if(casaG(w,w.x,w.y)==='G'){w.ativo=true;return{fimOk:true,anim:{ativa:true},msg:'Mecanismo acionado!'};}
      return{erro:{tipo:'fora',msg:'o autômato não está sobre o destino dourado. ATIVAR só aciona o mecanismo em cima dele.'},anim:{falha:true}};
    }
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    if(w.demo)return{ok:true,msg:'Fim do programa: o autômato parou na coluna '+(w.x+1)+', linha '+(w.y+1)+', olhando '+DIR_NOME[w.dir]+'.'};
    if(w.ativo)return{ok:true};
    if(casaG(w,w.x,w.y)==='G')return{ok:false,erro:{tipo:'semAtivar',msg:'O autômato chegou ao destino, mas o programa acabou sem ATIVAR. Sem ativar, o mecanismo não se move.'}};
    return{ok:false,erro:{tipo:'incompleto',msg:'O programa terminou e o autômato não chegou ao destino. Faltam instruções, ou a ordem delas precisa mudar.'}};
  }
};

/* --- Motores: oficina com contêineres ligados a máquinas --- */
const fmtV=LANG.fmt;
function lerVar(s,nome){const d=s.env[nome];if(!d)return{erro:{tipo:'naoExiste',nome}};if(d.val===null)return{erro:{tipo:'semValor',nome}};return{val:d.val};}
MUNDOS.oficina={
  init(sit){return{lotes:[],mc:null,sit};},
  cmd(w,c,s){
    if(c==='separar'){
      const q=lerVar(s,'quantidade');if(q.erro)return q;
      if(q.val.v<1||q.val.v>12)return{erro:{tipo:'faixa',msg:'a separadora só monta lotes de 1 a 12 peças, e quantidade vale '+fmtV(q.val)+'.'}};
      if(w.lotes.length>=3)return{erro:{tipo:'cheia',msg:'a esteira já tem três caixas. Não há lugar para outro lote.'}};
      w.lotes.push(q.val.v);
      return{anim:{lote:q.val.v},msg:'A separadora consultou quantidade ('+q.val.v+') e separou '+q.val.v+' peças.'};
    }
    if(c==='mc'){
      const r={};
      for(const n of['carga','oleo','codigo','freio']){const v=lerVar(s,n);if(v.erro)return v;r[n]=v.val;}
      w.mc=r;
      return{anim:{mc:true},msg:'O monta-cargas leu carga = '+fmtV(r.carga)+', oleo = '+fmtV(r.oleo)+', codigo = '+fmtV(r.codigo)+' e freio = '+fmtV(r.freio)+'.'};
    }
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w,s){
    const sit=w.sit;
    if(sit.atrib){
      const d=s.env[sit.atrib.nome];
      if(!d||d.val===null)return{ok:false,erro:{tipo:'semValor',nome:sit.atrib.nome,msg:'o contêiner "'+sit.atrib.nome+'" continua vazio. Use GUARDAR para colocar um valor nele.'}};
      if(d.val.v!==sit.atrib.val.v)return{ok:false,erro:{tipo:'valor',msg:'o contêiner "'+sit.atrib.nome+'" ficou com '+fmtV(d.val)+', mas o pedido era '+fmtV(sit.atrib.val)+'.'}};
      return{ok:true,msg:sit.atrib.nome+' = '+fmtV(d.val)+': o valor ficou guardado no contêiner.'};
    }
    if(sit.pedidos){
      const p=sit.pedidos,l=w.lotes;
      if(!l.length)return{ok:false,erro:{tipo:'semLote',msg:'nenhum lote foi separado. A separadora só trabalha quando recebe a placa SEPARAR LOTE.'}};
      for(let i=0;i<p.length;i++){
        if(l[i]===undefined)return{ok:false,erro:{tipo:'faltaLote',msg:'o pedido '+(i+1)+' ('+p[i]+' peças) ficou sem caixa. Faltam placas no programa.'}};
        if(l[i]!==p[i])return{ok:false,erro:{tipo:'loteErrado',msg:'a caixa '+(i+1)+' saiu com '+l[i]+' peças, mas o pedido '+(i+1)+' era de '+p[i]+'. A separadora usa o valor que estiver em quantidade naquele momento.'}};
      }
      if(l.length>p.length)return{ok:false,erro:{tipo:'loteSobra',msg:'saiu uma caixa a mais ('+l[p.length]+' peças) que ninguém pediu.'}};
      return{ok:true,msg:'Pedido'+(p.length>1?'s':'')+' atendido'+(p.length>1?'s':'')+': '+p.join(' e ')+' peças.'};
    }
    if(sit.mc){
      if(!w.mc)return{ok:false,erro:{tipo:'semMc',msg:'os contêineres estão prontos, mas falta a placa LIGAR MONTA-CARGAS para a máquina consultar os valores.'}};
      const E=sit.mc,R=w.mc,nome={carga:'carga',oleo:'óleo',codigo:'código',freio:'freio'};
      for(const k of['carga','oleo','codigo','freio']){
        if(R[k].v!==E[k].v){
          let extra='';
          if(k==='codigo'&&String(R[k].v).toUpperCase()===String(E[k].v))extra=' Letras maiúsculas e minúsculas fazem textos diferentes.';
          if(k==='freio')extra=' Freio solto quer dizer que ele NÃO está acionado: False.';
          return{ok:false,erro:{tipo:'mcErrado',msg:'o monta-cargas não subiu. A ficha pede '+nome[k]+' '+fmtV(E[k])+', e o programa guardou '+fmtV(R[k])+'.'+extra}};
        }
      }
      return{ok:true,msg:'O monta-cargas subiu com 12 caixas, 0.75 L de óleo, código "MOTOR" e freio solto.'};
    }
    return{ok:true};
  }
};

/* --- Reator: sensores de energia e de nível da água; comporta, carregador, portão e dreno --- */
MUNDOS.reator={
  init(sit){return{energia:sit.energia,nivel:sit.nivel,comporta:false,carregador:false,portao:false,dreno:false,acoes:[],sit};},
  sensores(w,cfg){const o={};for(const d of cfg.sensores||[])o[d.nome]={t:'int',val:LV('int',w[d.nome])};return o;},
  cmd(w,c){
    w.acoes.push(c);
    if(c==='abrir'){
      if(w.energia<5)return{erro:{tipo:'semEnergia',msg:'a comporta não abriu: com energia '+w.energia+' o motor dela não tem força. Ela precisa de 5 ou mais.'},anim:{falha:'comporta'}};
      w.comporta=true;return{anim:{comporta:true},msg:'A comporta abriu: a energia ('+w.energia+') era suficiente.'};
    }
    if(c==='carregar'){w.carregador=true;return{anim:{carregador:true},msg:'O carregador ligou e começou a encher a bateria.'};}
    if(c==='portao'){
      if(w.nivel>=4)return{erro:{tipo:'pressao',msg:'o portão não abre com a água no nível '+w.nivel+': a pressão segura a porta. Ele só abre com o nível abaixo de 4.'},anim:{falha:'portao'}};
      w.portao=true;return{anim:{portao:true},msg:'O portão de manutenção abriu.'};
    }
    if(c==='drenar'){w.dreno=true;return{anim:{dreno:true},msg:'O dreno abriu e a água começou a baixar.'};}
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    const e=w.sit.espera;if(!e)return{ok:true,msg:'Fim da demonstração.'};
    const T={comporta:'abrir a comporta',carregador:'ligar o carregador',portao:'abrir o portão',dreno:'drenar o tanque'};
    for(const k in e){
      if(e[k]&&!w[k])return{ok:false,erro:{tipo:'faltou',msg:'nesta situação ('+w.sit.nome+') o certo era '+T[k]+', e o programa não fez isso.'}};
      if(!e[k]&&w[k])return{ok:false,erro:{tipo:'sobrou',msg:'nesta situação ('+w.sit.nome+') o programa resolveu '+T[k]+', mas não precisava. Confira a condição e os dois caminhos.'}};
    }
    return{ok:true,msg:'Situação '+w.sit.nome+': o programa escolheu o caminho certo.'};
  }
};

/* --- Viva: trilho com organismos; o sensor umidade lê o organismo da frente --- */
MUNDOS.estufa={
  init(sit){return{pods:sit.pods.map(p=>p===null?null:{um:p,ini:p}),x:0,fimX:sit.pods.length,alvo:sit.alvo||3,regas:0,sit};},
  sensores(w){const p=w.pods[w.x];return{umidade:{t:'int',val:LV('int',p?p.um:0)}};},
  cmd(w,c){
    if(c==='irrigar'){
      const p=w.pods[w.x];
      if(!p)return{erro:{tipo:'semPlanta',msg:'aqui não há organismo para irrigar: a água caiu na terra vazia.'},anim:{rega:w.x,vazio:true}};
      if(p.um>=w.alvo)return{erro:{tipo:'encharcou',msg:'o organismo já estava com umidade '+p.um+', o máximo. Regar demais afoga as raízes: a rotina precisa de uma condição de parada.'},anim:{rega:w.x,encharca:true}};
      p.um++;w.regas++;return{anim:{rega:w.x},msg:'Uma dose de água: umidade foi para '+p.um+'.'};
    }
    if(c==='avancar'){
      if(w.x>=w.fimX)return{erro:{tipo:'limite',msg:'o trilho acabou: não há mais caminho à frente do polinizador.'},anim:{bate:true}};
      w.x++;return{anim:{anda:w.x},msg:'O polinizador avançou uma posição.'};
    }
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    if(w.sit.demo)return{ok:true,msg:'Fim do programa.'};
    for(let i=0;i<w.pods.length;i++){const p=w.pods[i];if(p&&p.um<w.alvo)return{ok:false,erro:{tipo:'seco',msg:'o organismo '+(i+1)+' ficou com umidade '+p.um+'; ele precisa chegar a '+w.alvo+'.'}};}
    if(w.sit.chegar&&w.x!==w.fimX)return{ok:false,erro:{tipo:'parou',msg:'todos foram irrigados, mas o polinizador precisa terminar no fim do trilho para voltar à base.'}};
    return{ok:true,msg:w.regas===0?'Nada precisava de água: a rotina não irrigou nenhuma vez.':'Rotina concluída com '+w.regas+(w.regas===1?' rega.':' regas.')};
  }
};

/* --- Cidade-Jardim: canteiros com o sensor solo, contador regadas e a fonte no fim --- */
MUNDOS.jardim={
  init(sit){return{beds:sit.beds.map(b=>({solo:b,ini:b})),x:0,fimX:sit.beds.length,acesa:false,regas:0,sit};},
  sensores(w){const b=w.beds[w.x];return{solo:{t:'str',val:LV('str',b?b.solo:'fonte')}};},
  cmd(w,c,s){
    if(c==='irrigar'){
      const b=w.beds[w.x];
      if(!b)return{erro:{tipo:'semCanteiro',msg:'aqui é a fonte, não um canteiro.'}};
      if(b.solo!=='seco')return{erro:{tipo:'encharcou',msg:'este canteiro já estava úmido. Regar de novo encharca a terra: use uma decisão para regar só os secos.'},anim:{rega:w.x,encharca:true}};
      b.solo='úmido';w.regas++;return{anim:{rega:w.x},msg:'Canteiro '+(w.x+1)+' regado.'};
    }
    if(c==='avancar'){
      if(w.x>=w.fimX)return{erro:{tipo:'limite',msg:'o caminho acabou na fonte: não há mais nada à frente.'},anim:{bate:true}};
      w.x++;return{anim:{anda:w.x},msg:w.x>=w.fimX?'O robô jardineiro chegou à fonte.':'O robô jardineiro avançou.'};
    }
    if(c==='acender'){
      if(w.x!==w.fimX)return{erro:{tipo:'longe',msg:'o painel que acende o jardim fica na fonte, no fim do caminho. O robô ainda está no canteiro '+(w.x+1)+'.'}};
      const r=lerVar(s,'regadas');if(r.erro)return r;
      if(r.val.v!==w.regas)return{erro:{tipo:'contagem',msg:'o painel recebeu regadas = '+r.val.v+', mas o robô regou '+w.regas+(w.regas===1?' canteiro':' canteiros')+'. O contador precisa somar 1 a cada rega (regadas = regadas + 1).'}};
      w.acesa=true;return{fimOk:true,anim:{acende:true},msg:'A fonte leu regadas = '+r.val.v+' e acendeu o jardim!'};
    }
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    for(let i=0;i<w.beds.length;i++)if(w.beds[i].solo==='seco')return{ok:false,erro:{tipo:'seco',msg:'o canteiro '+(i+1)+' continuou seco.'}};
    if(!w.acesa)return{ok:false,erro:{tipo:'apagado',msg:'o programa terminou sem ACENDER JARDIM na fonte.'}};
    return{ok:true};
  }
};

/* ====================== saberes (um por relíquia) ====================== */
const SABERES={
  seq:{nome:'Sequência',tumba:'steam',relic:'Engrenagem-mestra',
    resumo:'Um algoritmo é uma lista de instruções executadas uma de cada vez, na ordem em que foram escritas. Trocar a ordem muda o resultado.',
    exemplo:'AVANÇAR\nAVANÇAR\nVIRAR À DIREITA\nAVANÇAR\nATIVAR'},
  dados:{nome:'Dados e variáveis',tumba:'diesel',relic:'Vela de ignição',
    resumo:'Uma variável é um contêiner com nome que guarda um valor de um tipo: inteiro (5), decimal (3.14), texto ("ABRIR") ou booleano (True/False). = guarda um valor; guardar de novo troca o conteúdo.',
    exemplo:'quantidade = 5\nSEPARAR LOTE\nquantidade = quantidade + 3\nSEPARAR LOTE'},
  decisoes:{nome:'Decisões',tumba:'atom',relic:'Núcleo atômico',
    resumo:'Uma condição compara valores e dá Verdadeiro ou Falso. SE ela for verdadeira, o programa segue o ENTÃO; senão, segue o SENÃO. == compara; = guarda.',
    exemplo:'SE energia >= 5 ENTÃO\n  ABRIR COMPORTA\nSENÃO\n  LIGAR CARREGADOR\nFIM SE'},
  automacao:{nome:'Repetições e automação',tumba:'bio',relic:'Semente da vida',
    resumo:'REPETIR executa um bloco um número fixo de vezes. ENQUANTO repete enquanto a condição for verdadeira, e para quando ela fica falsa: pode executar nenhuma, uma ou várias vezes.',
    exemplo:'REPETIR 4 VEZES\n  ENQUANTO umidade < 3\n    IRRIGAR\n  FIM ENQUANTO\n  AVANÇAR\nFIM REPETIR'}
};
const SABER_DE={steam:'seq',diesel:'dados',atom:'decisoes',bio:'automacao'};
const ORDEM_TUMBAS=['steam','diesel','atom','bio'];

/* ====================== desafios ======================
   etapa: demo (o jogador assiste e compara), guiada (passo a passo com o guia), aplicacao (situação nova, só dicas),
   classificar (reconhecer tipos). situacoes: o programa precisa dar certo em todas, com o mesmo programa. */
const G1=['.G.','.#.','.#.'],G2=['...#','.#.#','.#G.','.#..'];
const DESAFIOS=[
  /* ---------- Engrenagens: sequência ---------- */
  {id:'s0',tumba:'steam',saber:'seq',etapa:'demo',titulo:'Demonstração · a ordem importa',mundo:'grade',
    intro:['O Computador Ancestral lê as placas de cima para baixo, uma de cada vez. Isso é um algoritmo: instruções em ordem.',
      'Veja dois programas com as mesmas três placas em ordem diferente. Observe onde o autômato termina em cada um.'],
    blocos:['fwd','right','act'],situacoes:[{id:'d',nome:'tabuleiro livre',grid:['...','...','...'],start:{x:0,y:2,dir:0},demo:true}],
    demo:[{nome:'Programa A',prog:[{id:1,k:'cmd',cmd:'fwd'},{id:2,k:'cmd',cmd:'right'},{id:3,k:'cmd',cmd:'fwd'}]},
      {nome:'Programa B',prog:[{id:1,k:'cmd',cmd:'right'},{id:2,k:'cmd',cmd:'fwd'},{id:3,k:'cmd',cmd:'fwd'}]}],
    conclusao:'As mesmas placas, em outra ordem, levaram o autômato a outra casa. A ordem das instruções muda o resultado.',
    exemplo:{titulo:'A ordem muda o resultado',codigo:'Programa A: AVANÇAR, VIRAR À DIREITA, AVANÇAR\nPrograma B: VIRAR À DIREITA, AVANÇAR, AVANÇAR'}},
  {id:'s1',tumba:'steam',saber:'seq',etapa:'guiada',titulo:'Prática guiada · percurso 1',mundo:'grade',maxLinhas:12,
    intro:['Monte o programa tocando nas placas. O autômato está embaixo, à esquerda, olhando para cima: veja a seta.','O destino dourado fica no alto, no meio.'],
    blocos:['fwd','right','act'],situacoes:[{id:'a',nome:'percurso 1',grid:G1,start:{x:0,y:2,dir:0}}],
    alvo:['fwd','fwd','right','fwd','act'],
    guiaTextos:['O autômato está embaixo, à esquerda, olhando para cima (veja a seta). Ele cumpre as placas uma a uma, na ordem. Toque em AVANÇAR.',
      'Cada AVANÇAR anda uma casa na direção da seta. Toque em AVANÇAR de novo para chegar ao alto.',
      'No alto, o destino fica à direita. VIRAR À DIREITA gira o autômato 90° na mesma casa: ele não anda.',
      'Agora a seta aponta para a direita. AVANÇAR leva o autômato até o destino dourado.',
      'No destino, ATIVAR aciona o mecanismo. Coloque ATIVAR no final.',
      'Programa completo. Toque em EXECUTAR, ou em PASSO para ver uma placa de cada vez.'],
    dicas:['O autômato olha para cima. Duas casas acima dele fica o canto do tabuleiro.',
      'Depois de subir, o destino está à direita: o autômato precisa girar com VIRAR À DIREITA antes de avançar.',
      'Programa sugerido: AVANÇAR, AVANÇAR, VIRAR À DIREITA, AVANÇAR, ATIVAR.'],
    sucesso:'Isso! O autômato cumpriu as placas na ordem: subiu duas casas, girou sem sair do lugar, avançou e ativou.',
    exemplo:{titulo:'Percurso 1',codigo:'AVANÇAR\nAVANÇAR\nVIRAR À DIREITA\nAVANÇAR\nATIVAR'}},
  {id:'s2',tumba:'steam',saber:'seq',etapa:'aplicacao',titulo:'Aplicação · percurso 2',mundo:'grade',maxLinhas:12,
    intro:['Um tabuleiro novo, sem guia. Planeje o caminho, monte o programa e teste. Se errar, o autômato para na placa responsável.'],
    blocos:['fwd','right','act'],situacoes:[{id:'a',nome:'percurso 2',grid:G2,start:{x:0,y:3,dir:0}}],
    dicas:['Comece pela orientação: o autômato está embaixo, à esquerda, olhando para cima. AVANÇAR anda para onde a seta aponta.',
      'Pela coluna da esquerda dá para subir até o alto do tabuleiro. Conte as casas livres antes de virar.',
      'No alto, vire à direita e avance até ficar acima do destino. Vire à direita de novo: a seta passa a apontar para baixo.',
      'Um programa possível: AVANÇAR ×3, VIRAR À DIREITA, AVANÇAR ×2, VIRAR À DIREITA, AVANÇAR ×2, ATIVAR.'],
    sucesso:'Mecanismo ativado! O programa levou o autômato ao destino, na ordem certa, e terminou com ATIVAR.',
    exemplo:{titulo:'Percurso 2',codigo:'AVANÇAR\nAVANÇAR\nAVANÇAR\nVIRAR À DIREITA\nAVANÇAR\nAVANÇAR\nVIRAR À DIREITA\nAVANÇAR\nAVANÇAR\nATIVAR'}},

  /* ---------- Motores: dados e variáveis ---------- */
  {id:'d0',tumba:'diesel',saber:'dados',etapa:'demo',titulo:'Demonstração · o contêiner e a máquina',mundo:'oficina',
    intro:['Cada contêiner é uma variável: tem um nome, aceita um tipo de dado e mostra o valor atual.',
      'Um contêiner vazio é diferente de um contêiner com 0 ou com False: vazio quer dizer que ainda não há valor nenhum.',
      'Veja: o programa guarda 3 em quantidade e depois a separadora consulta esse contêiner.'],
    blocos:['set','separar'],vars:[{nome:'quantidade',t:'int'}],situacoes:[{id:'d',nome:'demonstração',pedidos:[3]}],
    demo:[{nome:'Guardar e consultar',prog:[{id:1,k:'set',nome:'quantidade',expr:{k:'lit',val:LV('int',3)},obj:'eng3'},{id:2,k:'cmd',cmd:'separar'}]}],
    conclusao:'quantidade = 3 guardou o valor; SEPARAR LOTE consultou o contêiner e separou 3 peças.',
    exemplo:{titulo:'Guardar e consultar',codigo:'quantidade = 3\nSEPARAR LOTE'}},
  {id:'d1',tumba:'diesel',saber:'dados',etapa:'classificar',titulo:'Etapa 1 · reconhecer valores e tipos',mundo:'oficina',
    intro:['Antes de guardar, é preciso reconhecer o tipo de cada dado. Toque num objeto e depois no tipo dele.',
      'inteiro (int): número sem casas decimais · decimal (float): número com ponto · texto (str): entre aspas · booleano (bool): True ou False.'],
    itens:['eng5','gal314','plAbrir','fusOn','pl5','fusOff','eng0','gal25'],situacoes:[],
    dicas:['Objetos com uma medida, como litros, guardam um número com casas decimais: decimal (float). A unidade é só a etiqueta.',
      'Uma placa com aspas guarda texto, mesmo que a inscrição seja um número: "5" é texto, 5 é inteiro.',
      'O fusível só tem duas posições, ligado ou desligado: True ou False, um booleano.'],
    sucesso:'Todos os dados reconhecidos. Agora cada um pode ir para o contêiner do seu tipo.',
    exemplo:{titulo:'Os quatro tipos',codigo:'quantidade = 5        # inteiro (int)\ncombustivel = 3.14   # decimal (float)\nsenha = "ABRIR"      # texto (str)\nligado = True        # booleano (bool)'}},
  {id:'d2',tumba:'diesel',saber:'dados',etapa:'guiada',titulo:'Etapa 2 · atribuir um valor',mundo:'oficina',maxLinhas:3,
    intro:['Guardar um valor numa variável se chama atribuição e se escreve com =.','O contêiner quantidade aceita inteiros e está vazio.'],
    blocos:['set'],vars:[{nome:'quantidade',t:'int'}],objetos:['eng5','pl5','gal314'],situacoes:[{id:'a',nome:'pedido',atrib:{nome:'quantidade',val:LV('int',5)}}],
    passos:[{texto:'Toque em GUARDAR (=) para criar uma atribuição.',bloco:'set',ok:p=>p.some(n=>n.k==='set')},
      {texto:'Toque na linha nova e escolha o valor: o lote de engrenagens marcado com 5. Experimente também a placa "5" para ver a diferença.',ok:p=>p.some(n=>n.k==='set'&&n.expr&&n.expr.k==='lit'&&n.expr.val.t==='int'&&n.expr.val.v===5)},
      {texto:'Pronto: quantidade = 5. Toque em EXECUTAR e observe o contêiner receber o valor.',ok:()=>false}],
    dicas:['GUARDAR cria uma linha "quantidade = …". O valor vem dos objetos da bancada.','A placa "5" é texto: o contêiner de inteiro não aceita. Use o lote de engrenagens 5.'],
    sucesso:'quantidade = 5. O contêiner deixou de estar vazio: agora guarda o inteiro 5.',
    exemplo:{titulo:'Atribuição',codigo:'quantidade = 5'}},
  {id:'d3',tumba:'diesel',saber:'dados',etapa:'guiada',titulo:'Etapa 3 · a máquina consulta a variável',mundo:'oficina',maxLinhas:4,
    intro:['A separadora não tem número próprio: ela consulta o contêiner quantidade no momento em que recebe SEPARAR LOTE.','Pedido: um lote de 5 peças.'],
    blocos:['set','separar'],vars:[{nome:'quantidade',t:'int'}],objetos:['eng5','eng8'],situacoes:[{id:'a',nome:'pedido de 5',pedidos:[5]}],
    passos:[{texto:'Primeiro guarde o valor: GUARDAR e escolha o lote 5.',bloco:'set',ok:p=>p.length>0&&p[0].k==='set'&&!!p[0].expr},
      {texto:'Depois toque em SEPARAR LOTE: a máquina vai consultar quantidade.',bloco:'separar',ok:p=>p.some(n=>n.k==='cmd'&&n.cmd==='separar')},
      {texto:'Execute. Se quiser ver o erro de ordem, mova SEPARAR LOTE para cima da atribuição e execute: a máquina encontra o contêiner vazio.',ok:()=>false}],
    dicas:['A ordem importa também aqui: a máquina só encontra o 5 se ele já estiver guardado.','Programa: quantidade = 5, depois SEPARAR LOTE.'],
    sucesso:'A separadora consultou quantidade e separou 5 peças.',
    exemplo:{titulo:'Consultar uma variável',codigo:'quantidade = 5\nSEPARAR LOTE'}},
  {id:'d4',tumba:'diesel',saber:'dados',etapa:'guiada',titulo:'Etapa 4 · mudar o valor',mundo:'oficina',maxLinhas:6,
    intro:['Chegou um segundo pedido, de 8 peças. O mesmo contêiner pode receber outro valor: guardar de novo troca o conteúdo.',
      'Para somar, é preciso escrever a conta: quantidade = quantidade + 3. Nada soma sozinho.'],
    blocos:['set','separar'],vars:[{nome:'quantidade',t:'int'}],objetos:['eng5','eng3','eng8'],arit:['+'],situacoes:[{id:'a',nome:'pedidos 5 e 8',pedidos:[5,8]}],
    passos:[{texto:'Comece como antes: quantidade = 5 e SEPARAR LOTE para o primeiro pedido.',ok:p=>p.length>=2&&p[0].k==='set'&&p[1].k==='cmd'},
      {texto:'Para o segundo pedido, guarde um novo valor (o lote 8) ou faça a conta quantidade + 3. Depois, SEPARAR LOTE de novo.',ok:p=>p.filter(n=>n.k==='cmd'&&n.cmd==='separar').length>=2},
      {texto:'Execute e compare as duas caixas na esteira.',ok:()=>false}],
    dicas:['Na linha nova de GUARDAR, toque em "conta" para montar quantidade + 3, ou escolha o lote 8.','Programa: quantidade = 5, SEPARAR LOTE, quantidade = 8 (ou quantidade + 3), SEPARAR LOTE.'],
    sucesso:'Duas caixas: 5 e 8 peças. A mesma placa SEPARAR LOTE deu outro resultado porque o valor guardado mudou.',
    exemplo:{titulo:'Trocar o valor',codigo:'quantidade = 5\nSEPARAR LOTE\nquantidade = quantidade + 3\nSEPARAR LOTE'}},
  {id:'d5',tumba:'diesel',saber:'dados',etapa:'aplicacao',titulo:'Etapa 5 · configurar o monta-cargas',mundo:'oficina',maxLinhas:8,
    intro:['Ficha de serviço do monta-cargas: carga de 12 caixas · óleo: 0,75 litro · código: MOTOR · freio: solto.',
      'Leia cada dado, descubra o tipo e guarde nos contêineres carga, oleo, codigo e freio. Os objetos desta bancada têm outra aparência: leia as palavras e os símbolos.'],
    blocos:['set','mc'],vars:[{nome:'carga',t:'int'},{nome:'oleo',t:'float',unid:'L'},{nome:'codigo',t:'str'},{nome:'freio',t:'bool'}],
    objetos:['cx12','ct12','cx7','fr075','fr05','ctMotor','ctMotorMin','alvTrue','alvFalse'],
    situacoes:[{id:'a',nome:'ficha de serviço',mc:{carga:LV('int',12),oleo:LV('float',0.75),codigo:LV('str','MOTOR'),freio:LV('bool',false)}}],
    dicas:['Quatro contêineres, quatro atribuições, e no fim LIGAR MONTA-CARGAS para a máquina consultar todos.',
      'No programa, decimal se escreve com ponto: 0,75 litro vira 0.75. O cartão "12" é texto: o contêiner carga só aceita inteiro.',
      'Freio solto quer dizer que o freio não está acionado: freio = False. E "MOTOR" em maiúsculas é diferente de "motor".'],
    sucesso:'O monta-cargas subiu! Cada contêiner tinha o dado certo, do tipo certo.',
    exemplo:{titulo:'Configuração completa',codigo:'carga = 12\noleo = 0.75\ncodigo = "MOTOR"\nfreio = False\nLIGAR MONTA-CARGAS'}},

  /* ---------- Reator: decisões ---------- */
  {id:'a0',tumba:'atom',saber:'decisoes',etapa:'demo',titulo:'Demonstração · comparar e decidir',mundo:'reator',
    intro:['Uma comparação pergunta algo sobre os dados e responde Verdadeiro ou Falso. energia >= 5 pergunta: a energia é maior ou igual a 5?',
      'Atenção: = guarda um valor (energia = 5 troca o conteúdo); == compara (energia == 5 só pergunta).',
      'Veja o mesmo programa em duas situações: com energia 7 e com energia 3. O caminho executado muda.'],
    blocos:['sese','abrir','carregar'],sensores:[{nome:'energia',t:'int'}],
    situacoes:[{id:'A',nome:'energia 7',energia:7,demo:true},{id:'B',nome:'energia 3',energia:3,demo:true}],
    demo:[{nome:'SE energia >= 5',prog:[{id:1,k:'se',cond:{a:{k:'var',nome:'energia'},op:'>=',b:{k:'lit',val:LV('int',5)}},entao:[{id:2,k:'cmd',cmd:'abrir'}],senao:[{id:3,k:'cmd',cmd:'carregar'}]}],todas:true}],
    conclusao:'Com energia 7, a condição deu Verdadeiro e a comporta abriu. Com energia 3, deu Falso e o carregador ligou.',
    exemplo:{titulo:'Decidir com SE e SENÃO',codigo:'SE energia >= 5 ENTÃO\n  ABRIR COMPORTA\nSENÃO\n  LIGAR CARREGADOR\nFIM SE'}},
  {id:'a1',tumba:'atom',saber:'decisoes',etapa:'guiada',titulo:'Prática guiada · a comporta',mundo:'reator',maxLinhas:6,
    intro:['A comporta só abre com energia 5 ou mais. Com menos, é preciso ligar o carregador.','O programa precisa funcionar nas duas situações: teste A (energia 7) e B (energia 3).'],
    blocos:['sese','abrir','carregar'],sensores:[{nome:'energia',t:'int'}],objetos:['n3','n5','n7'],ops:['>='],
    situacoes:[{id:'A',nome:'A · energia 7',energia:7,espera:{comporta:true,carregador:false}},{id:'B',nome:'B · energia 3',energia:3,espera:{comporta:false,carregador:true}}],
    passos:[{texto:'Toque em SE … SENÃO para criar uma decisão com dois caminhos.',bloco:'sese',ok:p=>p.some(n=>n.k==='se')},
      {texto:'Toque na linha do SE e complete a condição: energia >= 5.',ok:p=>p.some(n=>n.k==='se'&&n.cond&&n.cond.op==='>='&&n.cond.b&&n.cond.b.k==='lit'&&n.cond.b.val.v===5)},
      {texto:'O cursor está dentro do ENTÃO: toque em ABRIR COMPORTA.',bloco:'abrir',ok:p=>p.some(n=>n.k==='se'&&n.entao.some(x=>x.cmd==='abrir'))},
      {texto:'Toque na linha SENÃO para pôr o cursor lá e depois em LIGAR CARREGADOR.',bloco:'carregar',ok:p=>p.some(n=>n.k==='se'&&n.senao&&n.senao.some(x=>x.cmd==='carregar'))},
      {texto:'Execute na situação A e depois na B. O programa só vale se der certo nas duas.',ok:()=>false}],
    dicas:['Só ABRIR COMPORTA não basta: com energia 3 a comporta não tem força. É preciso decidir.','Condição: energia >= 5. Verdadeiro → ABRIR COMPORTA; Falso → LIGAR CARREGADOR.'],
    sucesso:'Nas duas situações o programa decidiu certo: abriu com energia 7 e carregou com energia 3.',
    exemplo:{titulo:'Decisão da comporta',codigo:'SE energia >= 5 ENTÃO\n  ABRIR COMPORTA\nSENÃO\n  LIGAR CARREGADOR\nFIM SE'}},
  {id:'a2',tumba:'atom',saber:'decisoes',etapa:'aplicacao',titulo:'Aplicação · o portão de manutenção',mundo:'reator',maxLinhas:8,
    intro:['O portão de manutenção só abre com a água abaixo do nível 4. Com 4 ou mais, é preciso drenar o tanque.',
      'Guarde o limite num contêiner (limite = …) e compare o sensor nivel com ele. Teste as três situações: nível 2, 6 e exatamente 4.'],
    blocos:['set','sese','se','portao','drenar'],vars:[{nome:'limite',t:'int'}],sensores:[{nome:'nivel',t:'int'}],objetos:['n3','n4','n5','s4','f4'],
    ops:['==','!=','<','>','<=','>='],cmpVars:true,
    situacoes:[{id:'A',nome:'A · nível 2',nivel:2,espera:{portao:true,dreno:false}},{id:'B',nome:'B · nível 6',nivel:6,espera:{portao:false,dreno:true}},{id:'C',nome:'C · nível 4',nivel:4,espera:{portao:false,dreno:true}}],
    dicas:['Comece guardando o limite: limite = 4. O contêiner limite aceita inteiro: "4" (texto) e 4.0 (decimal) não entram.',
      'Depois decida: SE nivel < limite ENTÃO ABRIR PORTÃO SENÃO DRENAR TANQUE.',
      'Na situação C o nível é exatamente 4. Com < a resposta é Falso (4 não é menor que 4); com <= seria Verdadeiro. Escolha o operador com cuidado.'],
    sucesso:'O portão só abriu com a água abaixo do limite. Nos níveis 6 e 4, o programa drenou o tanque.',
    exemplo:{titulo:'Comparar com uma variável',codigo:'limite = 4\nSE nivel < limite ENTÃO\n  ABRIR PORTÃO\nSENÃO\n  DRENAR TANQUE\nFIM SE'}},

  /* ---------- Viva: repetições e automação ---------- */
  {id:'b0',tumba:'bio',saber:'automacao',etapa:'demo',titulo:'Demonstração · repetir em vez de copiar',mundo:'estufa',
    intro:['Quatro organismos precisam de uma dose de água cada. Dá para escrever IRRIGAR e AVANÇAR quatro vezes…',
      '…ou usar REPETIR 4 VEZES com as duas placas dentro. O resultado é o mesmo, com um programa bem menor.'],
    blocos:['rep','irrigar','avancar'],situacoes:[{id:'d',nome:'quatro organismos',pods:[2,2,2,2],demo:true}],
    demo:[{nome:'Sem repetição (8 linhas)',prog:[1,2,3,4].reduce((a,i)=>a.concat([{id:i*2-1,k:'cmd',cmd:'irrigar'},{id:i*2,k:'cmd',cmd:'avancar'}]),[])},
      {nome:'Com REPETIR (4 linhas)',prog:[{id:1,k:'rep',n:4,corpo:[{id:2,k:'cmd',cmd:'irrigar'},{id:3,k:'cmd',cmd:'avancar'}]}]}],
    conclusao:'Os dois programas fizeram a mesma coisa. Com REPETIR, o contador mostrou cada volta: 1, 2, 3, 4.',
    exemplo:{titulo:'REPETIR',codigo:'REPETIR 4 VEZES\n  IRRIGAR\n  AVANÇAR\nFIM REPETIR'}},
  {id:'b1',tumba:'bio',saber:'automacao',etapa:'guiada',titulo:'Prática guiada · repetir 4 vezes',mundo:'estufa',maxLinhas:4,repMax:8,
    intro:['O painel desta estufa tem só 4 linhas: o programa não cabe sem repetição.','Cada organismo precisa de uma dose. Depois da última, o polinizador termina no fim do trilho.'],
    blocos:['rep','irrigar','avancar'],situacoes:[{id:'a',nome:'quatro organismos',pods:[2,2,2,2],chegar:true}],
    passos:[{texto:'Toque em REPETIR para criar o bloco.',bloco:'rep',ok:p=>p.some(n=>n.k==='rep')},
      {texto:'Com o cursor dentro do REPETIR, toque em IRRIGAR e depois em AVANÇAR.',bloco:'irrigar',ok:p=>p.some(n=>n.k==='rep'&&n.corpo.length>=2)},
      {texto:'Toque na linha REPETIR e ajuste o número para 4 com os botões − e +.',ok:p=>p.some(n=>n.k==='rep'&&n.n===4)},
      {texto:'Execute e acompanhe o contador de voltas.',ok:()=>false}],
    dicas:['Dentro do REPETIR vão as placas de UM organismo: IRRIGAR e AVANÇAR.','REPETIR 4 VEZES: IRRIGAR, AVANÇAR.'],
    sucesso:'Quatro voltas, quatro organismos irrigados, com um programa de 4 linhas.',
    exemplo:{titulo:'Repetir um bloco',codigo:'REPETIR 4 VEZES\n  IRRIGAR\n  AVANÇAR\nFIM REPETIR'}},
  {id:'b2',tumba:'bio',saber:'automacao',etapa:'aplicacao',titulo:'Aplicação · organismos intercalados',mundo:'estufa',maxLinhas:5,repMax:8,
    intro:['Neste trilho há um organismo a cada duas posições, com terra vazia entre eles. Irrigar a terra vazia é desperdício.','O painel tem 5 linhas.'],
    blocos:['rep','irrigar','avancar'],situacoes:[{id:'a',nome:'organismos intercalados',pods:[2,null,2,null,2,null],chegar:true}],
    dicas:['Descubra o que se repete: irrigar um organismo e chegar ao próximo.','De um organismo ao outro são duas posições: dois AVANÇAR.','REPETIR 3 VEZES: IRRIGAR, AVANÇAR, AVANÇAR.'],
    sucesso:'Três voltas iguais resolveram o trilho inteiro.',
    exemplo:{titulo:'Achar o padrão',codigo:'REPETIR 3 VEZES\n  IRRIGAR\n  AVANÇAR\n  AVANÇAR\nFIM REPETIR'}},
  {id:'b3',tumba:'bio',saber:'automacao',etapa:'guiada',titulo:'Prática guiada · enquanto precisar',mundo:'estufa',maxLinhas:4,
    intro:['Cada organismo chega com uma umidade diferente e precisa ficar com 3. Regar demais afoga as raízes.',
      'ENQUANTO umidade < 3, IRRIGAR: a condição é testada antes de cada volta, e a repetição para quando ela fica falsa.',
      'Teste as três situações: umidade 3 (nenhuma rega), 2 (uma) e 0 (várias).'],
    blocos:['enq','irrigar'],sensores:[{nome:'umidade',t:'int'}],objetos:['n2','n3','n4'],ops:['<'],
    situacoes:[{id:'A',nome:'A · umidade 3',pods:[3]},{id:'B',nome:'B · umidade 2',pods:[2]},{id:'C',nome:'C · umidade 0',pods:[0]}],
    passos:[{texto:'Toque em ENQUANTO para criar a repetição com condição.',bloco:'enq',ok:p=>p.some(n=>n.k==='enq')},
      {texto:'Toque na linha ENQUANTO e complete: umidade < 3.',ok:p=>p.some(n=>n.k==='enq'&&n.cond&&n.cond.op==='<'&&n.cond.b&&n.cond.b.k==='lit'&&n.cond.b.val.v===3)},
      {texto:'Dentro do ENQUANTO, coloque IRRIGAR.',bloco:'irrigar',ok:p=>p.some(n=>n.k==='enq'&&n.corpo.some(x=>x.cmd==='irrigar'))},
      {texto:'Execute nas três situações e observe quantas voltas cada uma dá.',ok:()=>false}],
    dicas:['REPETIR 3 VEZES não serve: com umidade 3 o organismo não precisa de nenhuma dose.','ENQUANTO umidade < 3: IRRIGAR. Cada rega aumenta a umidade, até a condição ficar falsa.'],
    sucesso:'A mesma rotina regou 0, 1 e 3 vezes: ela parou quando a umidade chegou a 3.',
    exemplo:{titulo:'Repetir enquanto for preciso',codigo:'ENQUANTO umidade < 3\n  IRRIGAR\nFIM ENQUANTO'}},
  {id:'b4',tumba:'bio',saber:'automacao',etapa:'aplicacao',titulo:'Aplicação · rotina automática',mundo:'estufa',maxLinhas:6,repMax:8,
    intro:['Um trilho com quatro organismos, cada um com uma umidade. Crie uma rotina que deixe todos com 3, sem encharcar nenhum, e termine no fim do trilho.',
      'Uma repetição pode ficar dentro de outra. Teste as duas situações.'],
    blocos:['rep','enq','irrigar','avancar'],sensores:[{nome:'umidade',t:'int'}],objetos:['n2','n3','n4'],ops:['<','<=','=='],
    situacoes:[{id:'A',nome:'A · 0, 2, 3, 1',pods:[0,2,3,1],chegar:true},{id:'B',nome:'B · 3, 3, 0, 2',pods:[3,3,0,2],chegar:true}],
    dicas:['Para cada organismo: regar enquanto precisar e depois avançar.','O ENQUANTO vai dentro do REPETIR 4 VEZES, antes do AVANÇAR.',
      'REPETIR 4 VEZES: (ENQUANTO umidade < 3: IRRIGAR), AVANÇAR.'],
    sucesso:'A rotina funcionou nas duas situações: cada organismo recebeu exatamente a água que faltava.',
    exemplo:{titulo:'Automação',codigo:'REPETIR 4 VEZES\n  ENQUANTO umidade < 3\n    IRRIGAR\n  FIM ENQUANTO\n  AVANÇAR\nFIM REPETIR'}},

  /* ---------- Cidade-Jardim: tudo junto ---------- */
  {id:'c1',tumba:'final',saber:'tudo',etapa:'aplicacao',titulo:'Desafio final · acender o Jardim Central',mundo:'jardim',maxLinhas:12,repMax:8,
    intro:['O robô jardineiro percorre cinco canteiros até a fonte. Os secos precisam de água; os úmidos não podem ser regados de novo.',
      'Na fonte, ACENDER JARDIM consulta o contêiner regadas: ele precisa dizer quantos canteiros foram regados.',
      'Use tudo o que aprendeu: a ordem das placas, uma variável contadora, uma decisão e uma repetição. Teste os dois jardins.'],
    blocos:['set','se','sese','rep','enq','irrigar','avancar','acender'],vars:[{nome:'regadas',t:'int'}],sensores:[{nome:'solo',t:'str'}],
    objetos:['n0','n1','seco','umido'],ops:['==','!='],arit:['+'],
    situacoes:[{id:'A',nome:'Jardim A',beds:['seco','úmido','seco','seco','úmido']},{id:'B',nome:'Jardim B',beds:['úmido','seco','úmido','úmido','seco']}],
    dicas:['Sequência: comece zerando o contador (regadas = 0) e termine com ACENDER JARDIM na fonte.',
      'Repetição: o mesmo trabalho se repete nos cinco canteiros, e cada volta termina com AVANÇAR.',
      'Decisão: SE solo == "seco" ENTÃO IRRIGAR. O sensor solo é texto, então compare com a placa "seco".',
      'Variável: dentro do SE, depois de IRRIGAR, conte a rega: regadas = regadas + 1.'],
    sucesso:'O Jardim Central acendeu! Sequência, variável, decisão e repetição trabalharam juntas.',
    exemplo:{titulo:'Tudo junto',codigo:'regadas = 0\nREPETIR 5 VEZES\n  SE solo == "seco" ENTÃO\n    IRRIGAR\n    regadas = regadas + 1\n  FIM SE\n  AVANÇAR\nFIM REPETIR\nACENDER JARDIM'}}
];
const DESAFIO={};for(const d of DESAFIOS)DESAFIO[d.id]=d;
const ETAPA_NOME={demo:'Demonstração',guiada:'Prática guiada',aplicacao:'Aplicação',classificar:'Reconhecer'};
function desafiosDa(tumba){return DESAFIOS.filter(d=>d.tumba===tumba);}

/* ---------- classificar tipos (Motores, etapa 1) ---------- */
function classificar(objId,tipo){
  const o=OBJ[objId];if(!o)return{ok:false,msg:'Objeto desconhecido.'};
  if(o.val.t===tipo)return{ok:true,msg:o.nome+': '+LANG.TIPOS[tipo].nome+' ('+LANG.TIPOS[tipo].py+'). Valor: '+LANG.fmt(o.val)+'.'};
  const t=o.val.t;let m;
  if(t==='str'&&o.rotulo.replace(/"/g,'').match(/^\d/))m='A inscrição está entre aspas: é texto, mesmo parecendo número. "5" e 5 são dados diferentes.';
  else if(t==='float')m='Tem casas decimais (a medida em litros é só a etiqueta): é um decimal (float).';
  else if(t==='int')m='É uma contagem de peças, sem casas decimais: inteiro (int).';
  else if(t==='bool')m='Só tem duas posições, ligado ou desligado: booleano (bool), True ou False.';
  else m='É uma palavra entre aspas: texto (str).';
  return{ok:false,msg:'Ainda não. '+m};
}

/* ---------- criação de placas pela paleta ---------- */
function novoNo(cfg,b){
  if(b==='set'){const v=(cfg.vars||[])[0];return{k:'set',nome:v?v.nome:'',expr:null};}
  if(b==='se'||b==='sese')return{k:'se',cond:condPadrao(cfg),entao:[],senao:b==='sese'?[]:null};
  if(b==='rep')return{k:'rep',n:2,corpo:[]};
  if(b==='enq')return{k:'enq',cond:condPadrao(cfg),corpo:[]};
  return{k:'cmd',cmd:b};
}
function condPadrao(cfg){
  const a=(cfg.sensores&&cfg.sensores[0])||(cfg.vars&&cfg.vars[0]);
  const ops=cfg.ops||LANG.OPS_CMP;
  return{a:a?{k:'var',nome:a.nome}:null,op:ops.length===1?ops[0]:null,b:null};
}
/* valores que o editor oferece: objetos da bancada, variáveis (quando o desafio permite comparar com elas) */
function opcoesValor(cfg){return(cfg.objetos||[]).map(id=>OBJ[id]).filter(Boolean);}
function nomesLeitura(cfg){return(cfg.sensores||[]).concat(cfg.vars||[]);}

/* ---------- guia das etapas guiadas: texto da vez e placa sugerida ---------- */
function guiaDe(cfg,prog){
  if(cfg.alvo){
    const g=cfg.alvo,k=prog.length,igual=k<=g.length&&prog.every((n,i)=>n.k==='cmd'&&n.cmd===g[i]);
    if(!igual)return{texto:'Este programa é diferente do sugerido. Teste para ver o que acontece, ou remova placas para seguir o guia.',bloco:null};
    return{texto:cfg.guiaTextos[Math.min(k,cfg.guiaTextos.length-1)],bloco:k<g.length?g[k]:null};
  }
  if(cfg.passos){for(const p of cfg.passos)if(!p.ok(prog))return{texto:p.texto,bloco:p.bloco||null};}
  return null;
}

/* ---------- conclusão: todas as situações passaram com o mesmo programa ---------- */
function situacoesOk(cfg,passou,prog){
  const a=LANG.assinatura(prog);
  return cfg.situacoes.every(s=>passou&&passou[s.id]===a);
}
/* confere uma solução sem tela (usado pelos testes e para validar o desafio) */
function rodarTodas(cfg,prog){
  const res=[];
  for(const sit of cfg.situacoes){const r=LANG.executar(cfg,MUNDOS[cfg.mundo],sit,prog);res.push({sit:sit.id,ok:r.s.ok,s:r.s,eventos:r.eventos});}
  return res;
}
