/* ====================== aprendizagem: funções, mundos dos desafios, etapas e saberes ======================
   Tudo aqui é lógica pura (sem DOM): cada desafio diz quais linhas aparecem na paleta, quais variáveis e sensores
   existem, quais valores (objetos) estão na bancada, as situações em que o programa é testado, as três dicas do Lume
   (conceito → caminho → quase a solução) e o exemplo que fica guardado. Cada "mundo" é o modelo do mecanismo da sala:
   o interpretador (LANG) chama mundo.cmd() a cada função, mundo.atribuiu() a cada atribuição e mundo.fim() quando o
   programa termina; a sala só desenha o estado (ws) que o mundo mantém, então o código mexe no cenário.
   Progressão: treino (primeiro comando) → sequência e execução (Engrenagens) → variáveis e tipos int, float, string e
   boolean (Motores) → if, elif e else (Reator) → for e while (Viva) → tudo junto (Cidade-Jardim).
   Etapas: demo (assistir e comparar), guiada (passo a passo), aplicacao (situação nova, só dicas) e corrigir (o
   programa já vem escrito com erro: executar, observar onde para e corrigir). */
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
const DIR_NOME=['para cima','para a direita','para baixo','para a esquerda'];

Object.assign(LANG.CMD,{
  fwd:{py:'avancar',sim:'⬆',ajuda:'anda uma casa na direção da seta'},
  right:{py:'virar_direita',sim:'↻',ajuda:'gira 90° na mesma casa, sem andar'},
  act:{py:'ativar',sim:'✦',ajuda:'aciona o mecanismo, só em cima do destino'},
  separar:{py:'separar_lote',sim:'⚙',ajuda:'a separadora lê a variável quantidade e separa essa quantidade de peças'},
  mc:{py:'ligar_monta_cargas',sim:'⇅',ajuda:'o monta-cargas lê carga, oleo, codigo e freio'},
  abrir:{py:'abrir_comporta',sim:'▤',ajuda:'abre a comporta; o motor dela precisa de energia 5 ou mais'},
  carregar:{py:'ligar_carregador',sim:'⚡',ajuda:'liga o carregador da bateria do reator'},
  portao:{py:'abrir_portao',sim:'◫',ajuda:'abre o portão de manutenção; só abre com a água abaixo do limite'},
  drenar:{py:'drenar_tanque',sim:'⇩',ajuda:'abre o dreno e baixa a água do tanque'},
  resfriar:{py:'resfriar',sim:'❄',ajuda:'joga água de resfriamento no reator (para temperatura alta)'},
  ventilar:{py:'ventilar',sim:'✣',ajuda:'liga o ventilador do reator (para temperatura média)'},
  manter:{py:'manter_estavel',sim:'◎',ajuda:'acende a luz verde: o reator está estável'},
  irrigar:{py:'irrigar',sim:'≈',ajuda:'dá uma dose de água ao organismo da frente (umidade + 1)'},
  avancar:{py:'avancar',sim:'➜',ajuda:'anda uma posição no trilho'},
  tocha:{py:'acender_tocha',sim:'✹',ajuda:'acende a próxima tocha apagada'},
  acender:{py:'acender_jardim',sim:'☀',ajuda:'na fonte, informa quantos canteiros foram regados e acende a cidade'}
});
/* nome e símbolo das linhas de estrutura (aparecem na paleta junto com as funções) */
const BLOCO_INFO={
  set:{nome:'variável = valor',sim:'▣',ajuda:'guarda um valor numa variável (atribuição)'},
  se:{nome:'if',sim:'◇',ajuda:'executa o bloco só quando a condição for True'},
  sese:{nome:'if … else',sim:'◈',ajuda:'um caminho para True e outro para False'},
  elif:{nome:'elif',sim:'◆',ajuda:'testa outra condição quando as de cima deram False'},
  rep:{nome:'for … in range(n)',sim:'⟳',ajuda:'repete o bloco um número fixo de vezes'},
  enq:{nome:'while',sim:'∞',ajuda:'repete o bloco enquanto a condição for True'}
};
function blocoInfo(b){if(BLOCO_INFO[b])return BLOCO_INFO[b];const c=LANG.CMD[b];return c?{nome:c.py+'()',sim:c.sim,ajuda:c.ajuda}:{nome:b,sim:'?',ajuda:''};}

/* ---------- objetos que representam valores (pixel art desenhada em 10-objetos.js pelo campo icone) ---------- */
const LV=LANG.val;
const OBJ={
  eng5:{icone:'engr',rotulo:'5',nome:'Lote de engrenagens marcado com 5',val:LV('int',5)},
  eng3:{icone:'engr',rotulo:'3',nome:'Lote de engrenagens marcado com 3',val:LV('int',3)},
  eng8:{icone:'engr',rotulo:'8',nome:'Lote de engrenagens marcado com 8',val:LV('int',8)},
  eng0:{icone:'engr',rotulo:'0',nome:'Lote vazio de engrenagens, marcado com 0',val:LV('int',0)},
  gal314:{icone:'galao',rotulo:'3,14 L',nome:'Galão com 3,14 litros',val:LV('float',3.14)},
  gal25:{icone:'galao',rotulo:'2,5 L',nome:'Galão com 2,5 litros',val:LV('float',2.5)},
  plAbrir:{icone:'placa',rotulo:'"ABRIR"',nome:'Placa com a inscrição ABRIR',val:LV('str','ABRIR')},
  plAbrirMin:{icone:'placa',rotulo:'"abrir"',nome:'Placa com a inscrição abrir',val:LV('str','abrir')},
  pl5:{icone:'placa',rotulo:'"5"',nome:'Placa com a inscrição 5',val:LV('str','5')},
  plTrue:{icone:'placa',rotulo:'"True"',nome:'Placa com a inscrição True',val:LV('str','True')},
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
  n50:{icone:'plaq',rotulo:'50',nome:'Plaqueta 50',val:LV('int',50)},
  n80:{icone:'plaq',rotulo:'80',nome:'Plaqueta 80',val:LV('int',80)},
  n90:{icone:'plaq',rotulo:'90',nome:'Plaqueta 90',val:LV('int',90)},
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
      if(k===null)return{erro:{tipo:'limite',titulo:'O autômato chegou à borda.',msg:'à frente acaba o tabuleiro, e o autômato não pode sair dele. Ele estava olhando '+DIR_NOME[w.dir]+'.'},anim:{bate:{x:nx,y:ny}}};
      if(k==='#')return{erro:{tipo:'parede',titulo:'O autômato bateu numa pedra.',msg:'há uma pedra na casa à frente, e o autômato não atravessa obstáculos. Ele estava olhando '+DIR_NOME[w.dir]+'.'},anim:{bate:{x:nx,y:ny}}};
      const de={x:w.x,y:w.y};w.x=nx;w.y=ny;w.rastro.push([nx,ny]);
      return{anim:{anda:{de,para:{x:nx,y:ny}}},msg:'O autômato avançou uma casa.'};
    }
    if(c==='right'){w.dir=(w.dir+1)%4;return{anim:{gira:w.dir},msg:'O autômato girou na mesma casa e agora olha '+DIR_NOME[w.dir]+'.'};}
    if(c==='act'){
      if(casaG(w,w.x,w.y)==='G'){w.ativo=true;return{fimOk:true,anim:{ativa:true},msg:'Mecanismo acionado!'};}
      return{erro:{tipo:'fora',titulo:'ativar() fora do destino.',msg:'o autômato não está sobre o destino dourado. ativar() só aciona o mecanismo em cima dele.'},anim:{falha:true}};
    }
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    if(w.demo)return{ok:true,msg:'Fim do programa: o autômato parou na coluna '+(w.x+1)+', linha '+(w.y+1)+', olhando '+DIR_NOME[w.dir]+'.'};
    if(w.ativo)return{ok:true};
    if(casaG(w,w.x,w.y)==='G')return{ok:false,erro:{tipo:'semAtivar',titulo:'Faltou ativar().',msg:'o autômato chegou ao destino, mas o programa acabou sem ativar(). Sem ativar, o mecanismo não se move.'}};
    return{ok:false,erro:{tipo:'incompleto',titulo:'O autômato não chegou ao destino.',msg:'o programa terminou antes. Faltam instruções, ou a ordem delas precisa mudar.'}};
  }
};

/* --- Motores: oficina com variáveis ligadas a máquinas --- */
const fmtV=LANG.fmt;
function lerVar(s,nome){const d=s.env[nome];if(!d)return{erro:{tipo:'naoExiste',nome}};if(d.val===null)return{erro:{tipo:'semValor',nome}};return{val:d.val};}
/* o que cada máquina da oficina faz quando a variável dela recebe um valor (etapa dos quatro tipos) */
const MAQ={
  energia:v=>v.v===true?'O gerador ligou: energia = True.':'O gerador continua desligado: energia = False.',
  combustivel:v=>'O tanque do motor recebeu '+fmtV(v)+' litros.',
  pecas:v=>'O contador da separadora marca '+fmtV(v)+' peças.',
  senha:v=>v.v==='ABRIR'?'O painel aceitou a senha "ABRIR": a porta da garagem destravou.':'O painel mostra '+fmtV(v)+', mas a senha não confere.'
};
MUNDOS.oficina={
  init(sit){return{lotes:[],mc:null,maq:{},sit};},
  atribuiu(w,nome,v){if(!w.sit.tipos||!MAQ[nome])return null;w.maq[nome]=v;return{anim:{maq:nome},msg:MAQ[nome](v)};},
  cmd(w,c,s){
    if(c==='separar'){
      const q=lerVar(s,'quantidade');if(q.erro)return q;
      if(q.val.v<1||q.val.v>12)return{erro:{tipo:'faixa',titulo:'Quantidade fora do limite.',msg:'a separadora só monta lotes de 1 a 12 peças, e quantidade vale '+fmtV(q.val)+'.'}};
      if(w.lotes.length>=3)return{erro:{tipo:'cheia',titulo:'A esteira está cheia.',msg:'a esteira já tem três caixas. Não há lugar para outro lote.'}};
      w.lotes.push(q.val.v);
      return{anim:{lote:q.val.v},msg:'separar_lote() leu quantidade ('+q.val.v+') e separou '+q.val.v+' peças.'};
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
    if(sit.tipos){
      for(const k in sit.tipos){
        const d=s.env[k],esp=sit.tipos[k];
        if(!d||d.val===null)return{ok:false,erro:{tipo:'semValor',nome:k,titulo:'A variável '+k+' continua vazia.',msg:'guarde nela '+LANG.TIPOS[esp.t].art+' ('+LANG.TIPOS[esp.t].rot+'): '+k+' = '+fmtV(esp)+'.'}};
        if(d.val.v!==esp.v){let extra='';if(k==='senha'&&String(d.val.v).toUpperCase()===esp.v)extra=' Letras maiúsculas e minúsculas fazem textos diferentes.';
          return{ok:false,erro:{tipo:'valor',titulo:'Valor diferente da ficha.',msg:'a ficha pede '+k+' = '+fmtV(esp)+', e o programa guardou '+fmtV(d.val)+'.'+extra}};}
      }
      return{ok:true,msg:'Gerador ligado, tanque abastecido, peças contadas e porta destravada: cada máquina recebeu o tipo certo.'};
    }
    if(sit.atrib){
      const d=s.env[sit.atrib.nome];
      if(!d||d.val===null)return{ok:false,erro:{tipo:'semValor',nome:sit.atrib.nome,titulo:'A variável '+sit.atrib.nome+' continua vazia.',msg:'use uma atribuição para guardar um valor nela: '+sit.atrib.nome+' = …'}};
      if(d.val.v!==sit.atrib.val.v)return{ok:false,erro:{tipo:'valor',titulo:'Valor diferente do pedido.',msg:'a variável "'+sit.atrib.nome+'" ficou com '+fmtV(d.val)+', mas o pedido era '+fmtV(sit.atrib.val)+'.'}};
      return{ok:true,msg:sit.atrib.nome+' = '+fmtV(d.val)+': o valor ficou guardado na variável.'};
    }
    if(sit.pedidos){
      const p=sit.pedidos,l=w.lotes;
      if(!l.length)return{ok:false,erro:{tipo:'semLote',titulo:'Nenhum lote separado.',msg:'a separadora só trabalha quando o programa chama separar_lote().'}};
      for(let i=0;i<p.length;i++){
        if(l[i]===undefined)return{ok:false,erro:{tipo:'faltaLote',titulo:'Faltou um lote.',msg:'o pedido '+(i+1)+' ('+p[i]+' peças) ficou sem caixa. Faltam linhas no programa.'}};
        if(l[i]!==p[i])return{ok:false,erro:{tipo:'loteErrado',titulo:'Lote com a quantidade errada.',msg:'a caixa '+(i+1)+' saiu com '+l[i]+' peças, mas o pedido '+(i+1)+' era de '+p[i]+'. A separadora usa o valor que estiver em quantidade naquele momento.'}};
      }
      if(l.length>p.length)return{ok:false,erro:{tipo:'loteSobra',titulo:'Sobrou uma caixa.',msg:'saiu uma caixa a mais ('+l[p.length]+' peças) que ninguém pediu.'}};
      return{ok:true,msg:'Pedido'+(p.length>1?'s':'')+' atendido'+(p.length>1?'s':'')+': '+p.join(' e ')+' peças.'};
    }
    if(sit.mc){
      if(!w.mc)return{ok:false,erro:{tipo:'semMc',titulo:'O monta-cargas não foi ligado.',msg:'as variáveis estão prontas, mas falta chamar ligar_monta_cargas() para a máquina ler os valores.'}};
      const E=sit.mc,R=w.mc,nome={carga:'carga',oleo:'oleo',codigo:'codigo',freio:'freio'};
      for(const k of['carga','oleo','codigo','freio']){
        if(R[k].v!==E[k].v){
          let extra='';
          if(k==='codigo'&&String(R[k].v).toUpperCase()===String(E[k].v))extra=' Letras maiúsculas e minúsculas fazem textos diferentes.';
          if(k==='freio')extra=' Freio solto quer dizer que ele NÃO está acionado: False.';
          return{ok:false,erro:{tipo:'mcErrado',titulo:'O monta-cargas não subiu.',msg:'a ficha pede '+nome[k]+' = '+fmtV(E[k])+', e o programa guardou '+fmtV(R[k])+'.'+extra}};
        }
      }
      return{ok:true,msg:'O monta-cargas subiu com 12 caixas, 0.75 L de óleo, código "MOTOR" e freio solto.'};
    }
    return{ok:true};
  }
};

/* --- Reator: sensores de energia, nível da água e temperatura; comporta, carregador, portão, dreno e resfriamento --- */
MUNDOS.reator={
  init(sit){return{energia:sit.energia,nivel:sit.nivel,temperatura:sit.temperatura,comporta:false,carregador:false,portao:false,dreno:false,resfriar:false,ventilar:false,manter:false,acoes:[],sit};},
  sensores(w,cfg){const o={};for(const d of cfg.sensores||[])o[d.nome]={t:'int',val:LV('int',w[d.nome])};return o;},
  cmd(w,c){
    w.acoes.push(c);
    if(c==='abrir'){
      if(w.energia<5)return{erro:{tipo:'semEnergia',titulo:'A comporta não abriu.',msg:'com energia '+w.energia+' o motor dela não tem força. Ela precisa de 5 ou mais.'},anim:{falha:'comporta'}};
      w.comporta=true;return{anim:{comporta:true},msg:'A comporta abriu: a energia ('+w.energia+') era suficiente.'};
    }
    if(c==='carregar'){w.carregador=true;return{anim:{carregador:true},msg:'O carregador ligou e começou a encher a bateria.'};}
    if(c==='portao'){
      if(w.nivel>=4)return{erro:{tipo:'pressao',titulo:'O portão não abriu.',msg:'com a água no nível '+w.nivel+' a pressão segura a porta. Ele só abre com o nível abaixo de 4.'},anim:{falha:'portao'}};
      w.portao=true;return{anim:{portao:true},msg:'O portão de manutenção abriu.'};
    }
    if(c==='drenar'){w.dreno=true;return{anim:{dreno:true},msg:'O dreno abriu e a água começou a baixar.'};}
    if(c==='resfriar'){w.resfriar=true;return{anim:{resfriar:true},msg:'Jatos de água fria cobrem o reator.'};}
    if(c==='ventilar'){w.ventilar=true;return{anim:{ventilar:true},msg:'O ventilador do reator começou a girar.'};}
    if(c==='manter'){w.manter=true;return{anim:{manter:true},msg:'A luz verde acendeu: o reator está estável.'};}
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    const e=w.sit.espera;if(!e)return{ok:true,msg:'Fim da demonstração.'};
    const T={comporta:'abrir a comporta',carregador:'ligar o carregador',portao:'abrir o portão',dreno:'drenar o tanque',resfriar:'resfriar',ventilar:'ventilar',manter:'manter o reator estável'};
    for(const k in e){
      if(e[k]&&!w[k])return{ok:false,erro:{tipo:'faltou',titulo:'Caminho errado nesta situação.',msg:'com '+w.sit.nome.replace(/^[A-Z] · /,'')+', o certo era '+T[k]+', e o programa não fez isso.'}};
      if(!e[k]&&w[k])return{ok:false,erro:{tipo:'sobrou',titulo:'Caminho errado nesta situação.',msg:'com '+w.sit.nome.replace(/^[A-Z] · /,'')+', o programa resolveu '+T[k]+', mas não precisava. Confira as condições e a ordem delas.'}};
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
      if(!p)return{erro:{tipo:'semPlanta',titulo:'Água na terra vazia.',msg:'aqui não há organismo para irrigar: a água caiu na terra vazia.'},anim:{rega:w.x,vazio:true}};
      if(p.um>=w.alvo)return{erro:{tipo:'encharcou',titulo:'O organismo encharcou.',msg:'ele já estava com umidade '+p.um+', o máximo. Regar demais afoga as raízes: a rotina precisa de uma condição de parada.'},anim:{rega:w.x,encharca:true}};
      p.um++;w.regas++;return{anim:{rega:w.x},msg:'Uma dose de água: umidade foi para '+p.um+'.'};
    }
    if(c==='avancar'){
      if(w.x>=w.fimX)return{erro:{tipo:'limite',titulo:'O trilho acabou.',msg:'não há mais caminho à frente do polinizador.'},anim:{bate:true}};
      w.x++;return{anim:{anda:w.x},msg:'O polinizador avançou uma posição.'};
    }
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    if(w.sit.demo)return{ok:true,msg:'Fim do programa.'};
    for(let i=0;i<w.pods.length;i++){const p=w.pods[i];if(p&&p.um<w.alvo)return{ok:false,erro:{tipo:'seco',titulo:'Um organismo ficou com sede.',msg:'o organismo '+(i+1)+' ficou com umidade '+p.um+'; ele precisa chegar a '+w.alvo+'.'}};}
    if(w.sit.chegar&&w.x!==w.fimX)return{ok:false,erro:{tipo:'parou',titulo:'O polinizador parou no meio.',msg:'todos foram irrigados, mas o polinizador precisa terminar no fim do trilho para voltar à base.'}};
    return{ok:true,msg:w.regas===0?'Nada precisava de água: a rotina não irrigou nenhuma vez.':'Rotina concluída com '+w.regas+(w.regas===1?' rega.':' regas.')};
  }
};

/* --- Tochas: uma fileira de tochas que acendem uma de cada vez (treino e Tumba Viva) --- */
MUNDOS.tochas={
  init(sit){return{n:sit.n,acesas:0,sit};},
  cmd(w,c){
    if(c==='tocha'){
      if(w.acesas>=w.n)return{erro:{tipo:'semTocha',titulo:'Não há mais tochas apagadas.',msg:'as '+w.n+' tochas já estavam acesas, então esta chamada de acender_tocha() não tinha tocha para acender. Conte quantas vezes a função é chamada.'},anim:{falha:true}};
      w.acesas++;return{anim:{tocha:w.acesas-1},msg:'acender_tocha(): a tocha '+w.acesas+' de '+w.n+' acendeu.'};
    }
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    if(w.acesas<w.n)return{ok:false,erro:{tipo:'faltaTocha',titulo:'Ainda há tochas apagadas.',msg:'o programa acendeu '+w.acesas+' de '+w.n+' tochas. Cada chamada de acender_tocha() acende uma.'}};
    return{ok:true,msg:w.n===1?'A tocha acendeu!':'As '+w.n+' tochas acenderam, uma depois da outra.'};
  }
};

/* --- Cidade-Jardim: canteiros com o sensor solo, contador regadas e a fonte no fim --- */
MUNDOS.jardim={
  init(sit){return{beds:sit.beds.map(b=>({solo:b,ini:b})),x:0,fimX:sit.beds.length,acesa:false,regas:0,sit};},
  sensores(w){const b=w.beds[w.x];return{solo:{t:'str',val:LV('str',b?b.solo:'fonte')}};},
  cmd(w,c,s){
    if(c==='irrigar'){
      const b=w.beds[w.x];
      if(!b)return{erro:{tipo:'semCanteiro',titulo:'Aqui não há canteiro.',msg:'o robô está na fonte, não num canteiro.'}};
      if(b.solo!=='seco')return{erro:{tipo:'encharcou',titulo:'Canteiro encharcado.',msg:'este canteiro já estava úmido. Regar de novo encharca a terra: use um if para regar só os secos.'},anim:{rega:w.x,encharca:true}};
      b.solo='úmido';w.regas++;return{anim:{rega:w.x},msg:'Canteiro '+(w.x+1)+' regado.'};
    }
    if(c==='avancar'){
      if(w.x>=w.fimX)return{erro:{tipo:'limite',titulo:'O caminho acabou.',msg:'o robô já está na fonte: não há mais nada à frente.'},anim:{bate:true}};
      w.x++;return{anim:{anda:w.x},msg:w.x>=w.fimX?'O robô jardineiro chegou à fonte.':'O robô jardineiro avançou.'};
    }
    if(c==='acender'){
      if(w.x!==w.fimX)return{erro:{tipo:'longe',titulo:'Longe da fonte.',msg:'o painel que acende o jardim fica na fonte, no fim do caminho. O robô ainda está no canteiro '+(w.x+1)+'.'}};
      const r=lerVar(s,'regadas');if(r.erro)return r;
      if(r.val.v!==w.regas)return{erro:{tipo:'contagem',titulo:'A contagem não confere.',msg:'o painel recebeu regadas = '+r.val.v+', mas o robô regou '+w.regas+(w.regas===1?' canteiro':' canteiros')+'. O contador precisa somar 1 a cada rega (regadas = regadas + 1).'}};
      w.acesa=true;return{fimOk:true,anim:{acende:true},msg:'A fonte leu regadas = '+r.val.v+' e acendeu o jardim!'};
    }
    return{erro:{tipo:'desconhecido'}};
  },
  fim(w){
    for(let i=0;i<w.beds.length;i++)if(w.beds[i].solo==='seco')return{ok:false,erro:{tipo:'seco',titulo:'Um canteiro ficou seco.',msg:'o canteiro '+(i+1)+' continuou seco.'}};
    if(!w.acesa)return{ok:false,erro:{tipo:'apagado',titulo:'O jardim não acendeu.',msg:'o programa terminou sem chamar acender_jardim() na fonte.'}};
    return{ok:true};
  }
};

/* ====================== saberes (um por relíquia) ====================== */
const SABERES={
  seq:{nome:'Sequência',tumba:'steam',relic:'Engrenagem-mestra',
    resumo:'Um programa é uma sequência de instruções que o computador executa uma de cada vez, de cima para baixo. Trocar a ordem muda o resultado; quando algo dá errado, a execução para na linha do problema.',
    exemplo:'avancar()\navancar()\nvirar_direita()\navancar()\nativar()'},
  dados:{nome:'Variáveis e tipos',tumba:'diesel',relic:'Vela de ignição',
    resumo:'Uma variável é uma caixa com nome que guarda um valor. Os tipos básicos são int (inteiro: 5), float (decimal: 2.5), string (texto entre aspas: "ABRIR") e boolean (True ou False). O = guarda um valor; guardar de novo troca o conteúdo.',
    exemplo:'energia = True\ncombustivel = 2.5\npecas = 5\nsenha = "ABRIR"'},
  decisoes:{nome:'Decisões: if, elif e else',tumba:'atom',relic:'Núcleo atômico',
    resumo:'O if testa uma condição e só executa o seu bloco quando ela dá True. O elif testa outra condição se as de cima deram False, e o else pega todos os outros casos. Só o primeiro caminho verdadeiro é executado. == compara; = guarda.',
    exemplo:'if temperatura >= 80:\n    resfriar()\nelif temperatura >= 50:\n    ventilar()\nelse:\n    manter_estavel()'},
  automacao:{nome:'Repetições: for e while',tumba:'bio',relic:'Semente da vida',
    resumo:'O for repete um bloco um número fixo de vezes: for i in range(4) dá quatro voltas, com i valendo 0, 1, 2 e 3. O while repete enquanto a condição for True e para quando ela fica False: pode executar nenhuma, uma ou várias vezes.',
    exemplo:'for i in range(4):\n    while umidade < 3:\n        irrigar()\n    avancar()'}
};
const SABER_DE={steam:'seq',diesel:'dados',atom:'decisoes',bio:'automacao'};
const ORDEM_TUMBAS=['steam','diesel','atom','bio'];

/* ====================== desafios ======================
   situacoes: o programa precisa dar certo em todas, com o mesmo programa. inicial: o código que já vem escrito
   (etapas de corrigir). dicas: as três dicas do Lume, na ordem conceito → caminho → quase a solução. */
const G1=['.G.','.#.','.#.'],G2=['...#','.#.#','.#G.','.#..'],G3=['..G','.#.','...'];
const cmd_=c=>({k:'cmd',cmd:c}),set_=(nome,expr,obj)=>({k:'set',nome,expr,obj}),lit_=v=>({k:'lit',val:v}),var_=n=>({k:'var',nome:n});
const DESAFIOS=[
  /* ---------- Pátio de treino: o primeiro comando ---------- */
  {id:'t1',tumba:'treino',saber:'treino',etapa:'guiada',titulo:'Treino · o primeiro comando',mundo:'tochas',maxLinhas:3,
    intro:['Cada linha de código é uma instrução para a máquina. acender_tocha() chama uma função: uma ação que a máquina sabe fazer.'],
    blocos:['tocha'],situacoes:[{id:'a',nome:'uma tocha',n:1}],
    passos:[{texto:'Toque em acender_tocha() (embaixo) para escrever a linha no programa.',bloco:'tocha',ok:p=>p.some(n=>n.k==='cmd')},
      {texto:'Agora toque em ▶ Executar e olhe a tocha ao lado do portão.',ok:()=>false}],
    dicas:['Um programa é uma lista de instruções. Esta máquina conhece uma só: acender_tocha().',
      'A paleta, embaixo do painel, mostra as linhas que você pode usar. Tocar numa delas escreve a linha no programa.',
      'Programa: acender_tocha(). Depois toque em ▶ Executar.'],
    sucesso:'A tocha acendeu e o portão do pátio se abriu! Programar é isso: escrever, executar e ver o resultado.',
    exemplo:{titulo:'O primeiro comando',codigo:'acender_tocha()'}},

  /* ---------- Engrenagens: sequência e lógica de execução ---------- */
  {id:'s0',tumba:'steam',saber:'seq',etapa:'demo',titulo:'Demonstração · a ordem importa',mundo:'grade',
    intro:['O computador executa o código de cima para baixo, uma linha de cada vez. Isso é uma sequência de instruções.',
      'Veja dois programas com as mesmas três linhas em ordem diferente. Observe onde o autômato termina em cada um.'],
    blocos:['fwd','right','act'],situacoes:[{id:'d',nome:'tabuleiro livre',grid:['...','...','...'],start:{x:0,y:2,dir:0},demo:true}],
    demo:[{nome:'Programa A',prog:[{id:1,k:'cmd',cmd:'fwd'},{id:2,k:'cmd',cmd:'right'},{id:3,k:'cmd',cmd:'fwd'}]},
      {nome:'Programa B',prog:[{id:1,k:'cmd',cmd:'right'},{id:2,k:'cmd',cmd:'fwd'},{id:3,k:'cmd',cmd:'fwd'}]}],
    conclusao:'As mesmas linhas, em outra ordem, levaram o autômato a outra casa. A ordem das instruções muda o resultado.',
    exemplo:{titulo:'A ordem muda o resultado',codigo:'# Programa A\navancar()\nvirar_direita()\navancar()\n\n# Programa B\nvirar_direita()\navancar()\navancar()'}},
  {id:'s1',tumba:'steam',saber:'seq',etapa:'guiada',titulo:'Prática guiada · percurso 1',mundo:'grade',maxLinhas:12,
    intro:['Monte o programa tocando nas funções da paleta. O autômato está embaixo, à esquerda, olhando para cima: veja a seta.','O destino dourado fica no alto, no meio.'],
    blocos:['fwd','right','act'],situacoes:[{id:'a',nome:'percurso 1',grid:G1,start:{x:0,y:2,dir:0}}],
    alvo:['fwd','fwd','right','fwd','act'],
    guiaTextos:['O autômato está embaixo, à esquerda, olhando para cima (veja a seta). Ele cumpre as linhas uma a uma, na ordem. Toque em avancar().',
      'Cada avancar() anda uma casa na direção da seta. Toque em avancar() de novo para chegar ao alto.',
      'No alto, o destino fica à direita. virar_direita() gira o autômato 90° na mesma casa: ele não anda.',
      'Agora a seta aponta para a direita. avancar() leva o autômato até o destino dourado.',
      'No destino, ativar() aciona o mecanismo. Coloque ativar() no final.',
      'Programa completo. Toque em ▶ Executar, ou em ⏭ Passo para ver uma linha de cada vez.'],
    dicas:['Uma sequência é executada de cima para baixo, uma linha por vez. Cada avancar() anda uma casa para onde a seta aponta.',
      'O autômato olha para cima. Suba até o canto do tabuleiro e, de lá, o destino fica à direita: é preciso girar antes de avançar.',
      'Programa: avancar(), avancar(), virar_direita(), avancar(), ativar().'],
    sucesso:'Isso! O autômato cumpriu as linhas na ordem: subiu duas casas, girou sem sair do lugar, avançou e ativou.',
    exemplo:{titulo:'Percurso 1',codigo:'avancar()\navancar()\nvirar_direita()\navancar()\nativar()'}},
  {id:'s3',tumba:'steam',saber:'seq',etapa:'corrigir',titulo:'Corrija · o autômato bateu',mundo:'grade',maxLinhas:12,
    intro:['Este programa já está escrito, mas tem um erro de ordem. Execute, observe em que linha o autômato para e corrija.',
      'Para mudar uma linha de lugar, toque nela e use ↑ Subir ou ↓ Descer.'],
    blocos:['fwd','right','act'],situacoes:[{id:'a',nome:'percurso 3',grid:G3,start:{x:0,y:2,dir:0}}],
    inicial:[cmd_('fwd'),cmd_('right'),cmd_('fwd'),cmd_('fwd'),cmd_('fwd'),cmd_('act')],
    dicas:['Corrigir um programa (depurar) começa por executar e olhar onde ele para: a linha marcada em vermelho é onde o problema apareceu.',
      'O autômato vira cedo demais e bate na pedra do meio. Ele precisa subir até a fileira de cima antes de virar.',
      'Mova virar_direita() uma linha para baixo: avancar(), avancar(), virar_direita(), avancar(), avancar(), ativar().'],
    sucesso:'Programa corrigido! Executar, observar onde para e mudar a ordem: assim se encontra um erro.',
    exemplo:{titulo:'Depurar: mudar a ordem',codigo:'avancar()\navancar()\nvirar_direita()\navancar()\navancar()\nativar()'}},
  {id:'s2',tumba:'steam',saber:'seq',etapa:'aplicacao',titulo:'Aplicação · percurso 2',mundo:'grade',maxLinhas:12,
    intro:['Um tabuleiro novo, sem guia. Planeje o caminho, monte o programa e teste. Se errar, o autômato para na linha responsável.'],
    blocos:['fwd','right','act'],situacoes:[{id:'a',nome:'percurso 2',grid:G2,start:{x:0,y:3,dir:0}}],
    dicas:['Planeje antes de escrever: conte as casas e anote quando o autômato precisa girar. Cada linha faz uma coisa só.',
      'Pela coluna da esquerda dá para subir até o alto. No alto, vire e avance até ficar acima do destino; vire de novo e desça.',
      'Um programa possível: avancar() ×3, virar_direita(), avancar() ×2, virar_direita(), avancar() ×2, ativar().'],
    sucesso:'Mecanismo ativado! O programa levou o autômato ao destino, na ordem certa, e terminou com ativar().',
    exemplo:{titulo:'Percurso 2',codigo:'avancar()\navancar()\navancar()\nvirar_direita()\navancar()\navancar()\nvirar_direita()\navancar()\navancar()\nativar()'}},

  /* ---------- Motores: variáveis e tipos ---------- */
  {id:'d0',tumba:'diesel',saber:'dados',etapa:'demo',titulo:'Demonstração · a variável e a máquina',mundo:'oficina',
    intro:['Uma variável é uma caixa com nome que guarda um valor. Aqui, cada caixa é um contêiner ligado a uma máquina.',
      'Uma variável vazia é diferente de uma com 0 ou com False: vazia quer dizer que ainda não há valor nenhum.',
      'Veja: o programa guarda 3 em quantidade e depois a separadora lê essa variável.'],
    blocos:['set','separar'],vars:[{nome:'quantidade',t:'int'}],situacoes:[{id:'d',nome:'demonstração',pedidos:[3]}],
    demo:[{nome:'Guardar e ler',prog:[{id:1,k:'set',nome:'quantidade',expr:{k:'lit',val:LV('int',3)},obj:'eng3'},{id:2,k:'cmd',cmd:'separar'}]}],
    conclusao:'quantidade = 3 guardou o valor; separar_lote() leu a variável e separou 3 peças.',
    exemplo:{titulo:'Guardar e ler',codigo:'quantidade = 3\nseparar_lote()'}},
  {id:'d1',tumba:'diesel',saber:'dados',etapa:'guiada',titulo:'Etapa 1 · os quatro tipos',mundo:'oficina',maxLinhas:6,
    intro:['Ficha da oficina: ligar o gerador · abastecer 2,5 litros · contar 5 peças · digitar a senha ABRIR.',
      'Cada máquina tem uma variável e aceita um tipo: boolean (True/False), float (decimal), int (inteiro) e string (texto entre aspas). Ao executar, cada máquina reage ao valor.'],
    blocos:['set'],vars:[{nome:'energia',t:'bool'},{nome:'combustivel',t:'float',unid:'L'},{nome:'pecas',t:'int'},{nome:'senha',t:'str'}],
    objetos:['fusOn','fusOff','plTrue','gal25','gal314','eng5','pl5','plAbrir','plAbrirMin'],
    situacoes:[{id:'a',nome:'ficha da oficina',tipos:{energia:LV('bool',true),combustivel:LV('float',2.5),pecas:LV('int',5),senha:LV('str','ABRIR')}}],
    passos:[{texto:'Toque em "variável = valor". A linha nova guarda em energia: escolha o fusível ligado (True) para ligar o gerador.',bloco:'set',ok:p=>p.some(n=>n.k==='set'&&n.nome==='energia'&&n.expr&&n.expr.val&&n.expr.val.v===true)},
      {texto:'Nova atribuição: toque de novo em "variável = valor", escolha a variável combustivel e o galão de 2,5 L (um float).',bloco:'set',ok:p=>p.some(n=>n.k==='set'&&n.nome==='combustivel'&&n.expr)},
      {texto:'Agora pecas = 5 (um int, sem aspas).',bloco:'set',ok:p=>p.some(n=>n.k==='set'&&n.nome==='pecas'&&n.expr)},
      {texto:'Por fim senha = "ABRIR" (uma string: texto entre aspas, em maiúsculas).',bloco:'set',ok:p=>p.some(n=>n.k==='set'&&n.nome==='senha'&&n.expr)},
      {texto:'Toque em ▶ Executar e veja cada máquina reagir à sua variável.',ok:()=>false}],
    dicas:['Uma variável guarda um valor de um tipo: int é número inteiro (5), float tem ponto decimal (2.5), string é texto entre aspas ("ABRIR") e boolean é True ou False.',
      'Leia a ficha e pense no tipo: ligar é sim ou não (boolean); litros têm decimal (float); peças se contam (int); senha é texto (string). "5" com aspas é texto, não número.',
      'Programa: energia = True, combustivel = 2.5, pecas = 5, senha = "ABRIR".'],
    sucesso:'As quatro máquinas funcionaram! Cada variável recebeu um valor do tipo que a máquina dela precisava.',
    exemplo:{titulo:'Os quatro tipos',codigo:'energia = True      # boolean\ncombustivel = 2.5   # float\npecas = 5           # int\nsenha = "ABRIR"     # string'}},
  {id:'d2',tumba:'diesel',saber:'dados',etapa:'guiada',titulo:'Etapa 2 · 5 ou "5"?',mundo:'oficina',maxLinhas:3,
    intro:['Guardar um valor numa variável se chama atribuição e se escreve com =.','A variável quantidade aceita int (inteiro) e está vazia.'],
    blocos:['set'],vars:[{nome:'quantidade',t:'int'}],objetos:['eng5','pl5','gal314'],situacoes:[{id:'a',nome:'pedido',atrib:{nome:'quantidade',val:LV('int',5)}}],
    passos:[{texto:'Toque em "variável = valor" para criar uma atribuição.',bloco:'set',ok:p=>p.some(n=>n.k==='set')},
      {texto:'Toque na linha nova e escolha o valor: o lote de engrenagens marcado com 5. Experimente também a placa "5" para ver a diferença.',ok:p=>p.some(n=>n.k==='set'&&n.expr&&n.expr.k==='lit'&&n.expr.val.t==='int'&&n.expr.val.v===5)},
      {texto:'Pronto: quantidade = 5. Toque em ▶ Executar e observe o contêiner receber o valor.',ok:()=>false}],
    dicas:['Atribuição: nome = valor. O valor fica guardado na variável até outra atribuição trocar.',
      'A placa "5" tem aspas: é uma string (texto). A variável quantidade só aceita int, um número sem aspas.',
      'Programa: quantidade = 5 (o lote de engrenagens, sem aspas).'],
    sucesso:'quantidade = 5. A variável deixou de estar vazia: agora guarda o int 5.',
    exemplo:{titulo:'Atribuição',codigo:'quantidade = 5'}},
  {id:'d3',tumba:'diesel',saber:'dados',etapa:'guiada',titulo:'Etapa 3 · a máquina lê a variável',mundo:'oficina',maxLinhas:4,
    intro:['A separadora não tem número próprio: ela lê a variável quantidade no momento em que separar_lote() é chamada.','Pedido: um lote de 5 peças.'],
    blocos:['set','separar'],vars:[{nome:'quantidade',t:'int'}],objetos:['eng5','eng8'],situacoes:[{id:'a',nome:'pedido de 5',pedidos:[5]}],
    passos:[{texto:'Primeiro guarde o valor: "variável = valor" e escolha o lote 5.',bloco:'set',ok:p=>p.length>0&&p[0].k==='set'&&!!p[0].expr},
      {texto:'Depois toque em separar_lote(): a máquina vai ler quantidade.',bloco:'separar',ok:p=>p.some(n=>n.k==='cmd'&&n.cmd==='separar')},
      {texto:'Execute. Se quiser ver o erro de ordem, mova separar_lote() para cima da atribuição e execute: a máquina encontra a variável vazia.',ok:()=>false}],
    dicas:['Uma função pode ler variáveis: separar_lote() olha o valor de quantidade na hora em que é chamada.',
      'A ordem importa também aqui: a máquina só encontra o 5 se ele já estiver guardado quando ela for chamada.',
      'Programa: quantidade = 5, depois separar_lote().'],
    sucesso:'A separadora leu quantidade e separou 5 peças.',
    exemplo:{titulo:'Ler uma variável',codigo:'quantidade = 5\nseparar_lote()'}},
  {id:'d4',tumba:'diesel',saber:'dados',etapa:'guiada',titulo:'Etapa 4 · mudar o valor',mundo:'oficina',maxLinhas:6,
    intro:['Chegou um segundo pedido, de 8 peças. A mesma variável pode receber outro valor: guardar de novo troca o conteúdo.',
      'Para somar, é preciso escrever a conta: quantidade = quantidade + 3. Nada soma sozinho.'],
    blocos:['set','separar'],vars:[{nome:'quantidade',t:'int'}],objetos:['eng5','eng3','eng8'],arit:['+'],situacoes:[{id:'a',nome:'pedidos 5 e 8',pedidos:[5,8]}],
    passos:[{texto:'Comece como antes: quantidade = 5 e separar_lote() para o primeiro pedido.',ok:p=>p.length>=2&&p[0].k==='set'&&p[1].k==='cmd'},
      {texto:'Para o segundo pedido, guarde um novo valor (o lote 8) ou faça a conta quantidade + 3. Depois, separar_lote() de novo.',ok:p=>p.filter(n=>n.k==='cmd'&&n.cmd==='separar').length>=2},
      {texto:'Execute e compare as duas caixas na esteira.',ok:()=>false}],
    dicas:['Uma variável guarda um valor por vez. Uma nova atribuição apaga o valor antigo e coloca o novo.',
      'Depois do primeiro separar_lote(), mude quantidade: escolha o lote 8 ou toque na conta quantidade + 3. Depois chame separar_lote() de novo.',
      'Programa: quantidade = 5, separar_lote(), quantidade = quantidade + 3, separar_lote().'],
    sucesso:'Duas caixas: 5 e 8 peças. A mesma função deu outro resultado porque o valor guardado mudou.',
    exemplo:{titulo:'Trocar o valor',codigo:'quantidade = 5\nseparar_lote()\nquantidade = quantidade + 3\nseparar_lote()'}},
  {id:'d5',tumba:'diesel',saber:'dados',etapa:'corrigir',titulo:'Corrija · a ficha do monta-cargas',mundo:'oficina',maxLinhas:8,
    intro:['Ficha de serviço do monta-cargas: carga de 12 caixas · óleo: 0,75 litro · código: MOTOR · freio: solto.',
      'Alguém escreveu o programa com erros de tipo e de valor. Execute, leia o erro e corrija linha por linha.'],
    blocos:['set','mc'],vars:[{nome:'carga',t:'int'},{nome:'oleo',t:'float',unid:'L'},{nome:'codigo',t:'str'},{nome:'freio',t:'bool'}],
    objetos:['cx12','ct12','cx7','fr075','fr05','ctMotor','ctMotorMin','alvTrue','alvFalse'],
    inicial:[set_('carga',lit_(LV('str','12')),'ct12'),set_('oleo',lit_(LV('float',0.75)),'fr075'),set_('codigo',lit_(LV('str','motor')),'ctMotorMin'),set_('freio',lit_(LV('bool',true)),'alvTrue'),cmd_('mc')],
    situacoes:[{id:'a',nome:'ficha de serviço',mc:{carga:LV('int',12),oleo:LV('float',0.75),codigo:LV('str','MOTOR'),freio:LV('bool',false)}}],
    dicas:['Cada variável aceita um tipo só: carga é int, oleo é float, codigo é string e freio é boolean. Valor com aspas é texto.',
      'Execute e leia a área de erro: a linha marcada mostra o problema. "12" com aspas é texto; "motor" em minúsculas é outro texto; freio solto é False.',
      'Programa certo: carga = 12, oleo = 0.75, codigo = "MOTOR", freio = False, ligar_monta_cargas().'],
    sucesso:'O monta-cargas subiu! Cada variável tinha o dado certo, do tipo certo.',
    exemplo:{titulo:'Configuração corrigida',codigo:'carga = 12\noleo = 0.75\ncodigo = "MOTOR"\nfreio = False\nligar_monta_cargas()'}},

  /* ---------- Reator: if, elif e else ---------- */
  {id:'a0',tumba:'atom',saber:'decisoes',etapa:'demo',titulo:'Demonstração · comparar e decidir',mundo:'reator',
    intro:['Uma comparação pergunta algo sobre os dados e responde True ou False. energia >= 5 pergunta: a energia é maior ou igual a 5?',
      'Atenção: = guarda um valor (energia = 5 troca o conteúdo); == compara (energia == 5 só pergunta).',
      'Veja o mesmo programa em duas situações: com energia 7 e com energia 3. O caminho executado muda.'],
    blocos:['sese','abrir','carregar'],sensores:[{nome:'energia',t:'int'}],
    situacoes:[{id:'A',nome:'energia 7',energia:7,demo:true},{id:'B',nome:'energia 3',energia:3,demo:true}],
    demo:[{nome:'if energia >= 5',prog:[{id:1,k:'se',cond:{a:{k:'var',nome:'energia'},op:'>=',b:{k:'lit',val:LV('int',5)}},entao:[{id:2,k:'cmd',cmd:'abrir'}],senao:[{id:3,k:'cmd',cmd:'carregar'}]}],todas:true}],
    conclusao:'Com energia 7, a condição deu True e a comporta abriu. Com energia 3, deu False e o carregador ligou pelo else.',
    exemplo:{titulo:'Decidir com if e else',codigo:'if energia >= 5:\n    abrir_comporta()\nelse:\n    ligar_carregador()'}},
  {id:'a1',tumba:'atom',saber:'decisoes',etapa:'guiada',titulo:'Prática guiada · a comporta',mundo:'reator',maxLinhas:6,
    intro:['A comporta só abre com energia 5 ou mais. Com menos, é preciso ligar o carregador.','O programa precisa funcionar nas duas situações: teste A (energia 7) e B (energia 3).'],
    blocos:['sese','abrir','carregar'],sensores:[{nome:'energia',t:'int'}],objetos:['n3','n5','n7'],ops:['>='],
    situacoes:[{id:'A',nome:'A · energia 7',energia:7,espera:{comporta:true,carregador:false}},{id:'B',nome:'B · energia 3',energia:3,espera:{comporta:false,carregador:true}}],
    passos:[{texto:'Toque em if … else para criar uma decisão com dois caminhos.',bloco:'sese',ok:p=>p.some(n=>n.k==='se')},
      {texto:'Toque na linha do if e complete a condição: energia >= 5.',ok:p=>p.some(n=>n.k==='se'&&n.cond&&n.cond.op==='>='&&n.cond.b&&n.cond.b.k==='lit'&&n.cond.b.val.v===5)},
      {texto:'O cursor está dentro do if: toque em abrir_comporta().',bloco:'abrir',ok:p=>p.some(n=>n.k==='se'&&n.entao.some(x=>x.cmd==='abrir'))},
      {texto:'Toque na linha else: para pôr o cursor lá e depois em ligar_carregador().',bloco:'carregar',ok:p=>p.some(n=>n.k==='se'&&n.senao&&n.senao.some(x=>x.cmd==='carregar'))},
      {texto:'Execute na situação A e depois na B. O programa só vale se der certo nas duas.',ok:()=>false}],
    dicas:['O if executa o seu bloco só quando a condição dá True; o else é o caminho para quando ela dá False.',
      'Só abrir_comporta() não basta: com energia 3 a comporta não tem força. Pergunte se a energia é suficiente antes de agir.',
      'Programa: if energia >= 5: abrir_comporta() · else: ligar_carregador().'],
    sucesso:'Nas duas situações o programa decidiu certo: abriu com energia 7 e carregou com energia 3.',
    exemplo:{titulo:'Decisão da comporta',codigo:'if energia >= 5:\n    abrir_comporta()\nelse:\n    ligar_carregador()'}},
  {id:'a2',tumba:'atom',saber:'decisoes',etapa:'aplicacao',titulo:'Aplicação · o portão de manutenção',mundo:'reator',maxLinhas:8,
    intro:['O portão de manutenção só abre com a água abaixo do nível 4. Com 4 ou mais, é preciso drenar o tanque.',
      'Guarde o limite numa variável (limite = …) e compare o sensor nivel com ele. Teste as três situações: nível 2, 6 e exatamente 4.'],
    blocos:['set','sese','se','portao','drenar'],vars:[{nome:'limite',t:'int'}],sensores:[{nome:'nivel',t:'int'}],objetos:['n3','n4','n5','s4','f4'],
    ops:['==','!=','<','>','<=','>='],cmpVars:true,
    situacoes:[{id:'A',nome:'A · nível 2',nivel:2,espera:{portao:true,dreno:false}},{id:'B',nome:'B · nível 6',nivel:6,espera:{portao:false,dreno:true}},{id:'C',nome:'C · nível 4',nivel:4,espera:{portao:false,dreno:true}}],
    dicas:['Uma condição pode comparar um sensor com uma variável: nivel < limite pergunta se o nível está abaixo do limite.',
      'Guarde o limite (limite = 4, um int: "4" e 4.0 não entram). Depois decida: se o nível estiver abaixo, abrir_portao(); senão, drenar_tanque().',
      'Programa: limite = 4 · if nivel < limite: abrir_portao() · else: drenar_tanque(). No nível 4, < dá False (4 não é menor que 4).'],
    sucesso:'O portão só abriu com a água abaixo do limite. Nos níveis 6 e 4, o programa drenou o tanque.',
    exemplo:{titulo:'Comparar com uma variável',codigo:'limite = 4\nif nivel < limite:\n    abrir_portao()\nelse:\n    drenar_tanque()'}},
  {id:'a3',tumba:'atom',saber:'decisoes',etapa:'guiada',titulo:'Prática guiada · três caminhos (elif)',mundo:'reator',maxLinhas:8,
    intro:['O sensor temperatura mede o reator. Acima de 80 graus é preciso resfriar; de 50 a 79, ventilar; abaixo de 50, só manter estável.',
      'Três caminhos: if para o primeiro, elif ("senão, se") para o segundo e else para o resto.'],
    blocos:['sese','elif','resfriar','ventilar','manter'],sensores:[{nome:'temperatura',t:'int'}],objetos:['n50','n80'],ops:['>=','>','<'],
    situacoes:[{id:'A',nome:'A · 90 graus',temperatura:90,espera:{resfriar:true,ventilar:false,manter:false}},{id:'B',nome:'B · 65 graus',temperatura:65,espera:{resfriar:false,ventilar:true,manter:false}},
      {id:'C',nome:'C · 30 graus',temperatura:30,espera:{resfriar:false,ventilar:false,manter:true}}],
    passos:[{texto:'Toque em if … else. Complete a condição do if: temperatura >= 80.',bloco:'sese',ok:p=>p.some(n=>n.k==='se'&&n.cond&&n.cond.op&&n.cond.b)},
      {texto:'Com o cursor dentro do if, toque em resfriar().',bloco:'resfriar',ok:p=>p.some(n=>n.k==='se'&&n.entao.some(x=>x.cmd==='resfriar'))},
      {texto:'Agora toque em elif: ele entra embaixo do if. Complete: temperatura >= 50, e coloque ventilar() dentro dele.',bloco:'elif',ok:p=>p.some(n=>n.k==='se'&&LANG.elifsDe(n).some(e=>e.corpo.some(x=>x.cmd==='ventilar')))},
      {texto:'Toque na linha else: e depois em manter_estavel().',bloco:'manter',ok:p=>p.some(n=>n.k==='se'&&n.senao&&n.senao.some(x=>x.cmd==='manter'))},
      {texto:'Execute nas três situações: só um caminho é executado em cada uma.',ok:()=>false}],
    dicas:['O elif é um "senão, se": ele só é testado quando a condição de cima deu False. O else pega tudo o que sobrou.',
      'Teste do mais quente para o mais frio: primeiro temperatura >= 80, depois temperatura >= 50. Cada caminho chama uma função.',
      'Programa: if temperatura >= 80: resfriar() · elif temperatura >= 50: ventilar() · else: manter_estavel().'],
    sucesso:'Três temperaturas, três caminhos: o reator foi resfriado, ventilado ou mantido estável conforme o sensor.',
    exemplo:{titulo:'if, elif e else',codigo:'if temperatura >= 80:\n    resfriar()\nelif temperatura >= 50:\n    ventilar()\nelse:\n    manter_estavel()'}},
  {id:'a4',tumba:'atom',saber:'decisoes',etapa:'corrigir',titulo:'Corrija · a ordem das condições',mundo:'reator',maxLinhas:8,
    intro:['O turno anterior escreveu este programa. Com 95 graus o reator só foi ventilado e quase superaqueceu.',
      'Execute cada situação, descubra por que o caminho errado foi escolhido e corrija. Atenção ao caso de exatamente 80 graus.'],
    blocos:['sese','elif','resfriar','ventilar','manter'],sensores:[{nome:'temperatura',t:'int'}],objetos:['n50','n80'],ops:['>=','>','<'],
    inicial:[{k:'se',cond:{a:var_('temperatura'),op:'>=',b:lit_(LV('int',50))},entao:[cmd_('ventilar')],elifs:[{k:'elif',cond:{a:var_('temperatura'),op:'>=',b:lit_(LV('int',80))},corpo:[cmd_('resfriar')]}],senao:[cmd_('manter')]}],
    situacoes:[{id:'A',nome:'A · 95 graus',temperatura:95,espera:{resfriar:true,ventilar:false,manter:false}},{id:'B',nome:'B · 80 graus',temperatura:80,espera:{resfriar:true,ventilar:false,manter:false}},
      {id:'C',nome:'C · 60 graus',temperatura:60,espera:{resfriar:false,ventilar:true,manter:false}},{id:'D',nome:'D · 20 graus',temperatura:20,espera:{resfriar:false,ventilar:false,manter:true}}],
    dicas:['Num if/elif/else, as condições são testadas de cima para baixo e só o PRIMEIRO caminho verdadeiro é executado. Os outros são pulados.',
      'Com 95 graus, temperatura >= 50 já dá True na primeira linha, então o elif >= 80 nunca chega a ser testado. A condição mais rigorosa precisa vir primeiro.',
      'Troque os números das condições: if temperatura >= 80: resfriar() · elif temperatura >= 50: ventilar() · else: manter_estavel(). Lembre de trocar também as funções de lugar.'],
    sucesso:'Corrigido! Agora a condição mais quente é testada primeiro, e cada temperatura cai no caminho certo.',
    exemplo:{titulo:'A ordem dos elif',codigo:'if temperatura >= 80:\n    resfriar()\nelif temperatura >= 50:\n    ventilar()\nelse:\n    manter_estavel()'}},

  /* ---------- Viva: for e while ---------- */
  {id:'b0',tumba:'bio',saber:'automacao',etapa:'guiada',titulo:'Prática guiada · as quatro tochas',mundo:'tochas',maxLinhas:2,repMax:8,
    intro:['Quatro tochas de seiva iluminam a estufa. Dá para escrever acender_tocha() quatro vezes… mas o painel tem só 2 linhas.',
      'for i in range(4): repete o bloco de baixo 4 vezes. As tochas acendem uma depois da outra.'],
    blocos:['rep','tocha'],situacoes:[{id:'a',nome:'quatro tochas',n:4}],
    passos:[{texto:'Toque em for … in range(n) para criar a repetição.',bloco:'rep',ok:p=>p.some(n=>n.k==='rep')},
      {texto:'Com o cursor dentro do for (a linha recuada), toque em acender_tocha().',bloco:'tocha',ok:p=>p.some(n=>n.k==='rep'&&n.corpo.some(x=>x.cmd==='tocha'))},
      {texto:'Toque na linha do for e ajuste range para 4 com + e −.',ok:p=>p.some(n=>n.k==='rep'&&n.n===4)},
      {texto:'Execute e conte as voltas: i vale 0, 1, 2 e 3.',ok:()=>false}],
    dicas:['Uma repetição executa o mesmo bloco várias vezes. O for conta as voltas: range(4) quer dizer 4 voltas.',
      'O que se repete é uma linha só: acender_tocha(). Ela vai dentro do for, com recuo.',
      'Programa: for i in range(4): acender_tocha().'],
    sucesso:'As quatro tochas acenderam, uma depois da outra: quatro voltas do for com um programa de 2 linhas.',
    exemplo:{titulo:'for',codigo:'for i in range(4):\n    acender_tocha()'}},
  {id:'b1',tumba:'bio',saber:'automacao',etapa:'guiada',titulo:'Prática guiada · regar 4 organismos',mundo:'estufa',maxLinhas:4,repMax:8,
    intro:['O painel desta estufa tem só 4 linhas: o programa não cabe sem repetição.','Cada organismo precisa de uma dose. Depois da última, o polinizador termina no fim do trilho.'],
    blocos:['rep','irrigar','avancar'],situacoes:[{id:'a',nome:'quatro organismos',pods:[2,2,2,2],chegar:true}],
    passos:[{texto:'Toque em for … in range(n) para criar o bloco.',bloco:'rep',ok:p=>p.some(n=>n.k==='rep')},
      {texto:'Com o cursor dentro do for, toque em irrigar() e depois em avancar().',bloco:'irrigar',ok:p=>p.some(n=>n.k==='rep'&&n.corpo.length>=2)},
      {texto:'Toque na linha do for e ajuste range para 4 com os botões − e +.',ok:p=>p.some(n=>n.k==='rep'&&n.n===4)},
      {texto:'Execute e acompanhe o contador de voltas.',ok:()=>false}],
    dicas:['Tudo o que está com recuo embaixo do for se repete a cada volta, na ordem.',
      'Dentro do for vão as linhas de UM organismo: irrigar() e avancar(). O número de voltas é o número de organismos.',
      'Programa: for i in range(4): irrigar(), avancar().'],
    sucesso:'Quatro voltas, quatro organismos irrigados, com um programa de 3 linhas.',
    exemplo:{titulo:'Repetir um bloco',codigo:'for i in range(4):\n    irrigar()\n    avancar()'}},
  {id:'b2',tumba:'bio',saber:'automacao',etapa:'corrigir',titulo:'Corrija · organismos intercalados',mundo:'estufa',maxLinhas:5,repMax:8,
    intro:['Neste trilho há um organismo a cada duas posições, com terra vazia entre eles. O programa abaixo rega a terra vazia.',
      'Execute, veja em que volta ele para e corrija o bloco e o número de voltas.'],
    blocos:['rep','irrigar','avancar'],situacoes:[{id:'a',nome:'organismos intercalados',pods:[2,null,2,null,2,null],chegar:true}],
    inicial:[{k:'rep',n:6,var:'i',corpo:[cmd_('irrigar'),cmd_('avancar')]}],
    dicas:['Para corrigir uma repetição, descubra o padrão: o que acontece igual em cada volta.',
      'De um organismo ao próximo são duas posições: cada volta precisa regar uma vez e avançar duas. Com isso, bastam 3 voltas.',
      'Programa: for i in range(3): irrigar(), avancar(), avancar().'],
    sucesso:'Três voltas iguais resolveram o trilho inteiro, sem desperdiçar água.',
    exemplo:{titulo:'Achar o padrão',codigo:'for i in range(3):\n    irrigar()\n    avancar()\n    avancar()'}},
  {id:'b3',tumba:'bio',saber:'automacao',etapa:'guiada',titulo:'Prática guiada · while',mundo:'estufa',maxLinhas:4,
    intro:['Cada organismo chega com uma umidade diferente e precisa ficar com 3. Regar demais afoga as raízes.',
      'while umidade < 3: irrigar() — a condição é testada antes de cada volta, e a repetição para quando ela dá False.',
      'Teste as três situações: umidade 3 (nenhuma rega), 2 (uma) e 0 (várias).'],
    blocos:['enq','irrigar'],sensores:[{nome:'umidade',t:'int'}],objetos:['n2','n3','n4'],ops:['<'],
    situacoes:[{id:'A',nome:'A · umidade 3',pods:[3]},{id:'B',nome:'B · umidade 2',pods:[2]},{id:'C',nome:'C · umidade 0',pods:[0]}],
    passos:[{texto:'Toque em while para criar a repetição com condição.',bloco:'enq',ok:p=>p.some(n=>n.k==='enq')},
      {texto:'Toque na linha do while e complete: umidade < 3.',ok:p=>p.some(n=>n.k==='enq'&&n.cond&&n.cond.op==='<'&&n.cond.b&&n.cond.b.k==='lit'&&n.cond.b.val.v===3)},
      {texto:'Dentro do while, coloque irrigar().',bloco:'irrigar',ok:p=>p.some(n=>n.k==='enq'&&n.corpo.some(x=>x.cmd==='irrigar'))},
      {texto:'Execute nas três situações e observe quantas voltas cada uma dá.',ok:()=>false}],
    dicas:['O while repete enquanto a condição for True. Quando ela vira False, a repetição para, e pode até não executar nenhuma vez.',
      'Um for com número fixo não serve: com umidade 3 o organismo não precisa de nenhuma dose. Pergunte antes de cada rega.',
      'Programa: while umidade < 3: irrigar(). Cada rega aumenta a umidade, até a condição dar False.'],
    sucesso:'A mesma rotina regou 0, 1 e 3 vezes: ela parou quando a umidade chegou a 3.',
    exemplo:{titulo:'Repetir enquanto for preciso',codigo:'while umidade < 3:\n    irrigar()'}},
  {id:'b4',tumba:'bio',saber:'automacao',etapa:'aplicacao',titulo:'Aplicação · rotina automática',mundo:'estufa',maxLinhas:6,repMax:8,
    intro:['Um trilho com quatro organismos, cada um com uma umidade. Crie uma rotina que deixe todos com 3, sem encharcar nenhum, e termine no fim do trilho.',
      'Uma repetição pode ficar dentro de outra. Teste as duas situações.'],
    blocos:['rep','enq','irrigar','avancar'],sensores:[{nome:'umidade',t:'int'}],objetos:['n2','n3','n4'],ops:['<','<=','=='],
    situacoes:[{id:'A',nome:'A · 0, 2, 3, 1',pods:[0,2,3,1],chegar:true},{id:'B',nome:'B · 3, 3, 0, 2',pods:[3,3,0,2],chegar:true}],
    dicas:['Repetições podem ficar uma dentro da outra: o for passa pelos organismos e o while rega cada um só o necessário.',
      'Para cada organismo: regar enquanto precisar e depois avançar. O while vai dentro do for, antes do avancar().',
      'Programa: for i in range(4): (while umidade < 3: irrigar()), avancar().'],
    sucesso:'A rotina funcionou nas duas situações: cada organismo recebeu exatamente a água que faltava.',
    exemplo:{titulo:'Automação',codigo:'for i in range(4):\n    while umidade < 3:\n        irrigar()\n    avancar()'}},

  /* ---------- Cidade-Jardim: tudo junto ---------- */
  {id:'c1',tumba:'final',saber:'tudo',etapa:'aplicacao',titulo:'Desafio final · acender o Jardim Central',mundo:'jardim',maxLinhas:12,repMax:8,
    intro:['O robô jardineiro percorre cinco canteiros até a fonte. Os secos precisam de água; os úmidos não podem ser regados de novo.',
      'Na fonte, acender_jardim() lê a variável regadas: ela precisa dizer quantos canteiros foram regados.',
      'Use tudo o que aprendeu: sequência, uma variável contadora, um if e um for. Teste os dois jardins.'],
    blocos:['set','se','sese','rep','enq','irrigar','avancar','acender'],vars:[{nome:'regadas',t:'int'}],sensores:[{nome:'solo',t:'str'}],
    objetos:['n0','n1','seco','umido'],ops:['==','!='],arit:['+'],
    situacoes:[{id:'A',nome:'Jardim A',beds:['seco','úmido','seco','seco','úmido']},{id:'B',nome:'Jardim B',beds:['úmido','seco','úmido','úmido','seco']}],
    dicas:['Um programa de verdade mistura tudo: uma variável que conta, um if que decide e um for que repete, na ordem certa.',
      'Comece com regadas = 0. Repita 5 vezes: se solo == "seco", irrigar() e somar 1 em regadas; depois avancar(). No fim, acender_jardim().',
      'Programa: regadas = 0 · for i in range(5): (if solo == "seco": irrigar(), regadas = regadas + 1), avancar() · acender_jardim().'],
    sucesso:'O Jardim Central acendeu! Sequência, variável, decisão e repetição trabalharam juntas.',
    exemplo:{titulo:'Tudo junto',codigo:'regadas = 0\nfor i in range(5):\n    if solo == "seco":\n        irrigar()\n        regadas = regadas + 1\n    avancar()\nacender_jardim()'}}
];
const DESAFIO={};for(const d of DESAFIOS)DESAFIO[d.id]=d;
const ETAPA_NOME={demo:'Demonstração',guiada:'Prática guiada',aplicacao:'Aplicação',corrigir:'Corrija o código'};
function desafiosDa(tumba){return DESAFIOS.filter(d=>d.tumba===tumba);}
/* etapas que existiam antes desta versão: quem já tinha todas de uma tumba ganha as novas (o progresso não volta) */
const ETAPAS_ANTIGAS={steam:['s0','s1','s2'],diesel:['d0','d1','d2','d3','d4','d5'],atom:['a0','a1','a2'],bio:['b0','b1','b2','b3','b4']};

/* ---------- criação de linhas pela paleta ---------- */
function novoNo(cfg,b,prog){
  /* uma atribuição nova já vem com a primeira variável que o programa ainda não usa */
  if(b==='set'){const usadas=[];if(prog)LANG.cada(prog,n=>{if(n.k==='set')usadas.push(n.nome);});const vs=cfg.vars||[];const v=vs.find(d=>usadas.indexOf(d.nome)<0)||vs[0];return{k:'set',nome:v?v.nome:'',expr:null};}
  if(b==='se'||b==='sese')return{k:'se',cond:condPadrao(cfg),entao:[],senao:b==='sese'?[]:null};
  if(b==='rep')return{k:'rep',n:2,var:'i',corpo:[]};
  if(b==='enq')return{k:'enq',cond:condPadrao(cfg),corpo:[]};
  return{k:'cmd',cmd:b};
}
function condPadrao(cfg){
  const a=(cfg.sensores&&cfg.sensores[0])||(cfg.vars&&cfg.vars[0]);
  if(a&&a.t==='bool')return{a:{k:'var',nome:a.nome},op:'bool',b:null};
  const ops=cfg.ops||LANG.OPS_CMP;
  return{a:a?{k:'var',nome:a.nome}:null,op:ops.length===1?ops[0]:null,b:null};
}
/* valores que o editor oferece: objetos da bancada, variáveis (quando o desafio permite comparar com elas) */
function opcoesValor(cfg){return(cfg.objetos||[]).map(id=>OBJ[id]).filter(Boolean);}
function nomesLeitura(cfg){return(cfg.sensores||[]).concat(cfg.vars||[]);}
/* o código que a etapa traz pronto (etapas de corrigir), com os números das linhas */
function programaInicial(cfg){return cfg.inicial?LANG.renumerar(LANG.clonar(cfg.inicial)):[];}

/* ---------- guia das etapas guiadas: texto da vez e linha sugerida ---------- */
function guiaDe(cfg,prog){
  if(cfg.alvo){
    const g=cfg.alvo,k=prog.length,igual=k<=g.length&&prog.every((n,i)=>n.k==='cmd'&&n.cmd===g[i]);
    if(!igual)return{texto:'Este programa é diferente do sugerido. Teste para ver o que acontece, ou remova linhas para seguir o guia.',bloco:null};
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
