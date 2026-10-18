/* ====================== linguagem educativa (LANG) ======================
   Um pedaço de Python: valores tipados, programa em árvore, edição por toques, leitura de código escrito e o
   interpretador passo a passo. Não usa DOM nem canvas: os testes carregam este arquivo sozinho num vm do Node.
   Executar e Passo a passo chamam o mesmo LANG.passo(): cada chamada executa UMA instrução visível
   (uma chamada de função, uma atribuição, um teste de if/elif, uma volta de for ou de while) e devolve o que aconteceu.

   O código aparece como em Python:  avancar()   quantidade = 5   if energia >= 5:   elif …:   else:
   for i in range(4):   while umidade < 3:   — o bloco é o que está com recuo (4 espaços) embaixo do cabeçalho.
   O que é do Python e o que é regra do jogo (os erros dizem qual dos dois aconteceu):
   - quatro tipos do Python: int (inteiro) 5, float (decimal) 3.14, str (texto, a "string") "ABRIR", bool (booleano)
     True/False. Nada é convertido sozinho: "5" é texto, 5 é número;
   - REGRA DO JOGO: cada variável da sala é um contêiner ligado a uma máquina, com um contrato de tipo (como a anotação
     quantidade: int). Em Python, quantidade = "5" é permitido; aqui a máquina confere o tipo antes de guardar e recusa;
   - REGRA DO JOGO: as variáveis são as da sala (x = 5 com um nome novo não cria variável), sensores são só leitura e a
     variável do for não recebe valores;
   - Python: ler uma variável que ainda não recebeu valor é NameError (no painel ela aparece "vazia", diferente de 0 e
     de False); soma e subtração só entre números (TypeError com texto); inteiro com decimal dá decimal;
   - Python: == e != entre número e texto dão False/True (nunca são iguais) e o jogo avisa; < > <= >= entre número e
     texto dão TypeError; textos se comparam em ordem alfabética; True/False valem 1/0 nas contas e comparações;
   - Python: a condição de if, elif e while pode ser uma comparação, um booleano ou outro valor (0, 0.0 e "" contam
     como False; o resto, como True);
   - = guarda um valor (atribuição); == pergunta se dois valores são iguais (comparação);
   - o editor aceita só um pedaço do Python (SUBCONJUNTO); o que existe no Python e não é aceito aqui é dito assim.
   Decimais são guardados de forma aproximada, como em qualquer computador: o jogo mostra até 4 casas. */
/* "1 etapa", "2 etapas", "0 etapas": contagens com singular e plural certos (usado também pelo resto do jogo) */
function plural(n,um,varios){return n+' '+(n===1?um:varios);}
/* o nome da lista mais parecido com t (distância de edição até 2, e menor que metade do nome); null se nenhum */
function parecido(t,lista){
  const d=(a,b)=>{const m=a.length,n=b.length,D=[];for(let i=0;i<=m;i++){D[i]=[i];for(let j=1;j<=n;j++)D[i][j]=i?Math.min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(a[i-1]===b[j-1]?0:1)):j;}return D[m][n];};
  let melhor=null,md=99;for(const x of lista){const k=d(String(t).toLowerCase(),x.toLowerCase())||(String(t)!==x?1:0);if(k<md){md=k;melhor=x;}}
  return melhor&&md>0&&md<=2&&md<Math.max(2,melhor.length/2)?melhor:null;
}
const LANG=(function(){
  const TIPOS={
    int:{nome:'inteiro',py:'int',rot:'int',ex:'5',art:'um número inteiro',desc:'um número inteiro',guia:'int'},
    float:{nome:'decimal',py:'float',rot:'float',ex:'3.14',art:'um número decimal',desc:'um número com ponto decimal',guia:'float'},
    str:{nome:'texto, a string',py:'str',rot:'str',ex:'"ABRIR"',art:'um texto',desc:'um texto entre aspas',guia:'string'},
    bool:{nome:'booleano',py:'bool',rot:'bool',ex:'True',art:'um booleano',desc:'True ou False',guia:'boolean'}
  };
  /* "int (inteiro)", "str (texto, a string)"… para rótulos e mensagens: o nome do Python e o nome em português */
  const rotulo=t=>TIPOS[t].rot+' ('+TIPOS[t].nome+')';
  /* o que o editor aceita, numa frase (Guia, modo Escrever e Lume) */
  const SUBCONJUNTO='O editor aceita um pedaço do Python: chamar as funções da sala com parênteses vazios, guardar valores com = (números, textos entre aspas, True/False e contas com + e -), comparar com == != < > <= >=, not, if/elif/else, for i in range(n) e while, com recuo de 4 espaços. Não tem print, input, listas, def, import, and/or, * nem /.';
  /* de onde vem cada erro: do Python, do pedaço que o editor aceita, de uma regra da máquina, do limite de segurança,
     do mecanismo ou do objetivo que ainda não foi alcançado */
  const CAT={python:'Erro de Python',subconjunto:'O Python tem, o editor do jogo não',semEfeito:'Linha que não faz nada',maquina:'Regra desta máquina (não é erro do Python)',
    limite:'Limite de segurança do jogo',mecanismo:'O mecanismo não conseguiu',objetivo:'Objetivo ainda não alcançado',editor:'Programa incompleto'};
  const OPS_CMP=['==','!=','<','>','<=','>='],OPS_ARIT=['+','-'],OPS_BOOL=['bool','not'];
  const OP_NOME={'==':'é igual a','!=':'é diferente de','<':'é menor que','>':'é maior que','<=':'é menor ou igual a','>=':'é maior ou igual a','+':'mais','-':'menos'};
  const LIM={num:999999,str:16,linhas:40,prof:3,rep:20,passos:400,voltas:30};
  /* catálogo de funções do mundo (preenchido por 03-learn.js): id → {py, sim, ajuda} */
  const CMD={};
  const nomeCmd=c=>(CMD[c]?CMD[c].py:c)+'()';

  /* ---------- valores ---------- */
  const val=(t,v)=>({t,v});
  function valValido(x){
    if(!x||typeof x!=='object'||!TIPOS[x.t])return false;
    if(x.t==='int')return Number.isInteger(x.v)&&Math.abs(x.v)<=LIM.num;
    if(x.t==='float')return typeof x.v==='number'&&isFinite(x.v)&&Math.abs(x.v)<=LIM.num;
    if(x.t==='str')return typeof x.v==='string'&&x.v.length<=LIM.str&&!/["\\\n\r]/.test(x.v);
    return typeof x.v==='boolean';
  }
  function fmtDec(n){let s=String(Math.round(n*10000)/10000);if(s==='-0')s='0';if(s.indexOf('.')<0)s+='.0';return s;}
  function fmt(x){
    if(x===null||x===undefined)return'vazio';
    if(x.t==='int')return String(x.v);
    if(x.t==='float')return fmtDec(x.v);
    if(x.t==='str')return'"'+x.v+'"';
    if(x.t==='bool')return x.v?'True':'False';
    return'?';
  }
  const tipoDe=x=>x?TIPOS[x.t].art+' ('+TIPOS[x.t].rot+')':'vazio';
  const ehNum=x=>x&&(x.t==='int'||x.t==='float');
  /* em Python, bool é um número: True vale 1 e False vale 0 nas comparações */
  const comoNum=x=>x&&(ehNum(x)||x.t==='bool');const numDe=x=>x.t==='bool'?(x.v?1:0):x.v;
  /* verdade de um valor que não é bool (if x:): 0, 0.0 e "" são False; o resto é True */
  const verdadeDe=x=>x.t==='bool'?x.v:x.t==='str'?x.v!=='':x.v!==0;

  /* ---------- expressões e condições ----------
     expressão: {k:'lit',val} | {k:'var',nome} | {k:'op',op:'+'|'-',a,b}
     condição: {a, op, b} com op de comparação, ou {a, op:'bool'} (o próprio booleano) e {a, op:'not'} (o contrário) */
  function fmtExpr(e){
    if(!e)return'?';
    if(e.k==='lit')return fmt(e.val);
    if(e.k==='var')return e.nome;
    if(e.k==='op')return fmtExpr(e.a)+' '+e.op+' '+fmtExpr(e.b);
    return'?';
  }
  function fmtCond(c){
    if(!c)return'?';
    if(c.op==='bool')return fmtExpr(c.a);
    if(c.op==='not')return'not '+fmtExpr(c.a);
    return fmtExpr(c.a)+' '+(c.op||'?')+' '+fmtExpr(c.b);
  }
  function avaliar(e,env){
    if(!e)return{erro:{tipo:'incompleta'}};
    if(e.k==='lit')return valValido(e.val)?{val:e.val}:{erro:{tipo:'incompleta'}};
    if(e.k==='var'){const d=env[e.nome];if(!d)return{erro:{tipo:'naoExiste',nome:e.nome}};if(d.val===null)return{erro:{tipo:'semValor',nome:e.nome}};return{val:d.val};}
    if(e.k==='op'){
      if(OPS_ARIT.indexOf(e.op)<0)return{erro:{tipo:'incompleta'}};
      const a=avaliar(e.a,env);if(a.erro)return a;const b=avaliar(e.b,env);if(b.erro)return b;
      if(!ehNum(a.val)||!ehNum(b.val))return{erro:{tipo:'tipoOp',op:e.op,a:a.val,b:b.val}};
      const t=a.val.t==='float'||b.val.t==='float'?'float':'int',r=e.op==='+'?a.val.v+b.val.v:a.val.v-b.val.v;
      if(Math.abs(r)>LIM.num)return{erro:{tipo:'grande'}};
      return{val:val(t,t==='int'?Math.round(r):r)};
    }
    return{erro:{tipo:'incompleta'}};
  }
  function comparar(c,env){
    if(!c)return{erro:{tipo:'incompleta'}};
    if(c.op==='bool'||c.op==='not'){
      const a=avaliar(c.a,env);if(a.erro)return a;
      const v=verdadeDe(a.val);
      return{res:c.op==='bool'?v:!v,a:a.val,b:null,op:c.op,txt:fmtCond(c),verdade:a.val.t!=='bool'};
    }
    if(OPS_CMP.indexOf(c.op)<0)return{erro:{tipo:'incompleta'}};
    const a=avaliar(c.a,env);if(a.erro)return a;const b=avaliar(c.b,env);if(b.erro)return b;
    const A=a.val,B=b.val;let r,misto=false;
    const cmp=(x,y)=>c.op==='=='?x===y:c.op==='!='?x!==y:c.op==='<'?x<y:c.op==='>'?x>y:c.op==='<='?x<=y:x>=y;
    if(comoNum(A)&&comoNum(B))r=cmp(numDe(A),numDe(B));
    else if(A.t==='str'&&B.t==='str')r=cmp(A.v,B.v);
    /* número (ou bool) com texto: == dá False e != dá True (nunca são iguais); ordem não existe (TypeError) */
    else if(c.op==='=='||c.op==='!='){r=c.op==='!=';misto=true;}
    else return{erro:{tipo:'cmpOrdem',a:A,b:B,op:c.op}};
    return{res:r,a:A,b:B,op:c.op,txt:fmtCond(c),misto};
  }
  /* antes de guardar um objeto numa variável: explica a incompatibilidade (null quando pode) */
  function compativel(tipoVar,v){
    if(!v)return'Escolha um valor para guardar.';
    if(v.t===tipoVar)return null;
    return'A máquina recusou: este contêiner só aceita '+rotulo(tipoVar)+', e '+fmt(v)+' é '+tipoDe(v)+'.'+dicaTipo(tipoVar,v)+' (Em Python a atribuição seria permitida; o contrato de tipo é da máquina.) O objeto continua disponível.';
  }
  function dicaTipo(tipoVar,v){
    if(v.t==='str'&&(tipoVar==='int'||tipoVar==='float'))return' O que está entre aspas é texto, mesmo quando parece número: o jogo não converte sozinho.';
    if(v.t==='int'&&tipoVar==='float')return' Um decimal se escreve com ponto, como '+v.v+'.0.';
    if(v.t==='float'&&tipoVar==='int')return' Um inteiro não tem casas decimais.';
    if(v.t==='bool')return' True e False são booleanos: ligado ou desligado, sim ou não.';
    if(v.t==='str'&&tipoVar==='bool')return' "True" entre aspas é texto; o booleano se escreve sem aspas: True.';
    if(tipoVar==='str')return' Um texto se escreve entre aspas, como "ABRIR".';
    return'';
  }

  /* ---------- programa ----------
     nós: {id,k:'cmd',cmd}  {id,k:'set',nome,expr}  {id,k:'se',cond,entao:[],elifs:[{id,k:'elif',cond,corpo:[]}],senao:[]|null}
          {id,k:'rep',n,var,corpo:[]} (for var in range(n))  {id,k:'enq',cond,corpo:[]} (while)
     ramos de um if: 'entao', 'elif0', 'elif1'…, 'senao'; de um for/while: 'corpo'. */
  const CONT={se:1,rep:1,enq:1};
  const elifsDe=n=>(n&&n.elifs)||[];
  function ramos(n){
    if(n.k==='se'){const r=[['entao',n.entao]];elifsDe(n).forEach((e,j)=>r.push(['elif'+j,e.corpo]));if(n.senao)r.push(['senao',n.senao]);return r;}
    if(n.k==='rep'||n.k==='enq')return[['corpo',n.corpo]];
    return[];
  }
  function ramoLista(n,ramo){if(!n||!ramo)return null;if(ramo.slice(0,4)==='elif'){const e=elifsDe(n)[+ramo.slice(4)];return e?e.corpo:null;}return Array.isArray(n[ramo])?n[ramo]:null;}
  function filhos(n){return ramos(n).map(r=>r[1]);}
  function cada(prog,fn){(function w(l,nv){for(const n of l){fn(n,nv);for(const f of filhos(n))w(f,nv+1);}})(prog,0);}
  function novoId(prog){let m=0;cada(prog,n=>{if(n.id>m)m=n.id;for(const e of elifsDe(n))if(e.id>m)m=e.id;});return m+1;}
  function renumerar(prog){let id=0;cada(prog,n=>{n.id=++id;for(const e of elifsDe(n))e.id=++id;});return prog;}
  /* linhas como aparecem na tela: cabeçalhos, elif, else e, só na tela, um comentário marcando o fim de cada bloco */
  function linhas(prog){
    const out=[];
    (function w(l,nv,pai,ramo){l.forEach((n,i)=>{
      out.push({tipo:'no',no:n,nv,pai,ramo,i});
      if(n.k==='se'){
        w(n.entao,nv+1,n,'entao');
        elifsDe(n).forEach((e,j)=>{out.push({tipo:'elif',no:n,el:e,j,nv});w(e.corpo,nv+1,n,'elif'+j);});
        if(n.senao){out.push({tipo:'senao',no:n,nv});w(n.senao,nv+1,n,'senao');}
        out.push({tipo:'fim',no:n,nv});
      }
      else if(n.k==='rep'||n.k==='enq'){w(n.corpo,nv+1,n,'corpo');out.push({tipo:'fim',no:n,nv});}
    });})(prog,0,null,null);
    return out;
  }
  const nLinhas=n=>n.k==='se'?1+elifsDe(n).length+(n.senao?1:0):1;
  function contarLinhas(prog){let c=0;cada(prog,n=>{c+=nLinhas(n);});return c;}
  function profundidade(prog){let m=0;cada(prog,(n,nv)=>{if(CONT[n.k])m=Math.max(m,nv+1);});return m;}
  /* número da linha (o comentário de fim de bloco não conta, como no Python) */
  function numeroLinha(prog,id){let k=0;for(const L of linhas(prog)){if(L.tipo==='fim')continue;k++;if((L.tipo==='no'&&L.no.id===id)||(L.tipo==='elif'&&L.el.id===id))return k;}return 0;}
  /* acha um nó (ou um elif): a lista onde ele está, a posição, o pai e o ramo */
  function achar(prog,id){
    let r=null;
    (function w(l,pai,ramo,nv){for(let i=0;i<l.length&&!r;i++){const n=l[i];if(n.id===id){r={lista:l,i,no:n,pai,ramo,nv};return;}
      if(n.k==='se')elifsDe(n).forEach((e,j)=>{if(!r&&e.id===id)r={lista:n.elifs,i:j,no:e,pai:n,ramo:'elif',nv};});
      for(const[rm,lst]of ramos(n))if(!r)w(lst,n,rm,nv+1);}})(prog,null,null,0);
    return r;
  }
  function listaDe(prog,cur){if(!cur||cur.pai===null||cur.pai===undefined)return prog;const a=achar(prog,cur.pai);if(!a)return null;return ramoLista(a.no,cur.ramo);}
  function nivelDe(prog,cur){if(!cur||cur.pai===null||cur.pai===undefined)return 0;const a=achar(prog,cur.pai);return a?a.nv+1:0;}
  /* insere no cursor {pai,ramo,i}; respeita o limite de linhas e de blocos um dentro do outro.
     Devolve o cursor depois do nó inserido (ou dentro dele, se for um bloco) ou um texto explicando por que não coube. */
  function inserir(prog,cur,no,lim){
    lim=lim||{};const maxL=lim.linhas||LIM.linhas,maxP=lim.prof||LIM.prof;
    const l=listaDe(prog,cur);if(!l)return'Escolha onde a linha vai entrar.';
    if(contarLinhas(prog)+nLinhas(no)>maxL)return'O painel tem só '+maxL+' linhas. Remova uma linha ou use uma repetição.';
    if(CONT[no.k]&&nivelDe(prog,cur)+1>maxP)return'Um bloco pode ficar dentro de outro só até '+maxP+' níveis.';
    no.id=novoId(prog);{let k=no.id;for(const e of elifsDe(no))e.id=++k;}
    const i=Math.max(0,Math.min(l.length,cur.i|0));l.splice(i,0,no);
    if(CONT[no.k])return{pai:no.id,ramo:no.k==='se'?'entao':'corpo',i:0};
    return{pai:cur.pai===undefined?null:cur.pai,ramo:cur.ramo||null,i:i+1};
  }
  /* acrescenta um elif (antes do else) a um if; devolve o cursor dentro dele ou um texto explicando o limite */
  function adicionarElif(prog,seId,cond,lim){
    const a=achar(prog,seId);if(!a||a.no.k!=='se')return'Escolha uma linha if.';
    const maxL=(lim&&lim.linhas)||LIM.linhas;if(contarLinhas(prog)+1>maxL)return'O painel tem só '+maxL+' linhas.';
    const n=a.no;if(!n.elifs)n.elifs=[];const e={id:novoId(prog),k:'elif',cond:cond||null,corpo:[]};n.elifs.push(e);
    return{pai:n.id,ramo:'elif'+(n.elifs.length-1),i:0,elif:e.id};
  }
  /* liga ou desliga o else de um if (desligar apaga as linhas de dentro) */
  function alternarSenao(prog,seId,lim){
    const a=achar(prog,seId);if(!a||a.no.k!=='se')return'Escolha uma linha if.';const n=a.no;
    if(n.senao){n.senao=null;return{pai:a.pai?a.pai.id:null,ramo:a.ramo,i:a.i+1};}
    const maxL=(lim&&lim.linhas)||LIM.linhas;if(contarLinhas(prog)+1>maxL)return'O painel tem só '+maxL+' linhas.';
    n.senao=[];return{pai:n.id,ramo:'senao',i:0};
  }
  function remover(prog,id){const a=achar(prog,id);if(!a)return null;a.lista.splice(a.i,1);
    if(a.ramo==='elif')return{pai:a.pai.id,ramo:'entao',i:a.pai.entao.length};
    return{pai:a.pai?a.pai.id:null,ramo:a.ramo,i:a.i};}
  /* sobe ou desce uma linha (com o que estiver dentro dela). Encontrando um bloco vizinho, entra nele; no começo ou no fim
     de um ramo, passa para o ramo vizinho (if → elif → else) ou sai do bloco. Assim dá para levar qualquer linha a
     qualquer lugar só com toques. Devolve false se não mexeu. */
  function mover(prog,id,dir,lim){
    const a=achar(prog,id);if(!a||a.ramo==='elif')return false;const maxP=(lim&&lim.prof)||LIM.prof;
    const prof=n=>{let m=0;(function w(x,d){if(CONT[x.k]){m=Math.max(m,d);for(const f of filhos(x))for(const y of f)w(y,d+1);}})(n,1);return m;};
    const cabe=nv=>nv+prof(a.no)<=maxP;
    const l=a.lista,i=a.i,no=a.no;
    if(dir<0){
      if(i>0){
        const v=l[i-1];
        if(CONT[v.k]&&cabe(a.nv+1)){l.splice(i,1);const rs=ramos(v);rs[rs.length-1][1].push(no);return true;}
        l[i]=v;l[i-1]=no;return true;
      }
      if(!a.pai)return false;
      const rs=ramos(a.pai),k=rs.findIndex(r=>r[0]===a.ramo);
      if(k>0){l.splice(i,1);rs[k-1][1].push(no);return true;}
      const p=achar(prog,a.pai.id);l.splice(i,1);p.lista.splice(p.i,0,no);return true;
    }else{
      if(i<l.length-1){
        const v=l[i+1];
        if(CONT[v.k]&&cabe(a.nv+1)){l.splice(i,1);ramos(v)[0][1].unshift(no);return true;}
        l[i]=v;l[i+1]=no;return true;
      }
      if(!a.pai)return false;
      const rs=ramos(a.pai),k=rs.findIndex(r=>r[0]===a.ramo);
      if(k>=0&&k<rs.length-1){l.splice(i,1);rs[k+1][1].unshift(no);return true;}
      const p=achar(prog,a.pai.id);l.splice(i,1);p.lista.splice(p.i+1,0,no);return true;
    }
  }
  const clonar=x=>JSON.parse(JSON.stringify(x));
  /* uma impressão do programa (para saber se as situações foram testadas com o mesmo programa) */
  function assinatura(prog){return JSON.stringify(prog,(k,v)=>k==='id'?undefined:v);}

  /* o que cada desafio permite: funções, variáveis e estruturas (blocos: 'set','se','sese','elif','rep','enq' e funções) */
  function permite(cfg,b){const bl=cfg.blocos||[];if(b==='se')return bl.indexOf('se')>=0||bl.indexOf('sese')>=0;if(b==='senao')return bl.indexOf('sese')>=0;return bl.indexOf(b)>=0;}
  const NOME_OK=/^[a-z_][a-z0-9_]{0,15}$/;

  /* confere um programa vindo do salvamento: descarta o que não existe neste desafio e refaz os números das linhas */
  function limpar(prog,cfg){
    let fixed=false;const bad=()=>{fixed=true;};
    const vars={};for(const d of cfg.vars||[])vars[d.nome]=d.t;for(const d of cfg.sensores||[])vars[d.nome]=d.t;
    const blocos=cfg.blocos||[];
    const okExpr=(e,loc)=>{if(e===null)return true;if(!e||typeof e!=='object')return false;
      if(e.k==='lit')return valValido(e.val);if(e.k==='var')return typeof e.nome==='string'&&(!!vars[e.nome]||loc.indexOf(e.nome)>=0);
      if(e.k==='op')return OPS_ARIT.indexOf(e.op)>=0&&okExpr(e.a,loc)&&okExpr(e.b,loc);return false;};
    const okCond=(c,loc)=>{if(c===null)return true;if(!c||typeof c!=='object')return false;
      if(c.op==='bool'||c.op==='not')return okExpr(c.a===undefined?null:c.a,loc)&&(c.b===undefined||c.b===null);
      return(c.op===null||OPS_CMP.indexOf(c.op)>=0)&&okExpr(c.a===undefined?null:c.a,loc)&&okExpr(c.b===undefined?null:c.b,loc);};
    function lista(l,nv,loc){
      const out=[];if(!Array.isArray(l)){bad();return out;}
      for(const n of l){
        if(!n||typeof n!=='object'){bad();continue;}
        let m=null;
        if(n.k==='cmd'&&blocos.indexOf(n.cmd)>=0)m={k:'cmd',cmd:n.cmd};
        else if(n.k==='set'&&blocos.indexOf('set')>=0&&cfg.vars&&cfg.vars.some(d=>d.nome===n.nome)&&okExpr(n.expr===undefined?null:n.expr,loc))m={k:'set',nome:n.nome,expr:n.expr||null,obj:typeof n.obj==='string'?n.obj:undefined};
        else if(n.k==='se'&&permite(cfg,'se')&&okCond(n.cond===undefined?null:n.cond,loc)&&nv<LIM.prof){
          m={k:'se',cond:n.cond||null,entao:lista(n.entao,nv+1,loc),senao:n.senao===null||n.senao===undefined?null:lista(n.senao,nv+1,loc)};
          if(n.elifs!==undefined&&n.elifs!==null){if(!Array.isArray(n.elifs)||(n.elifs.length&&!permite(cfg,'elif')))bad();
            else{const el=[];for(const e of n.elifs){if(e&&typeof e==='object'&&okCond(e.cond===undefined?null:e.cond,loc))el.push({k:'elif',cond:e.cond||null,corpo:lista(e.corpo,nv+1,loc)});else bad();}if(el.length)m.elifs=el;}}
        }
        else if(n.k==='rep'&&blocos.indexOf('rep')>=0&&Number.isInteger(n.n)&&n.n>=0&&n.n<=LIM.rep&&nv<LIM.prof){
          const v=n.var===undefined?'i':n.var;if(typeof v!=='string'||!NOME_OK.test(v)||vars[v]){bad();continue;}
          m={k:'rep',n:n.n,var:v,corpo:lista(n.corpo,nv+1,loc.concat([v]))};}
        else if(n.k==='enq'&&blocos.indexOf('enq')>=0&&okCond(n.cond===undefined?null:n.cond,loc)&&nv<LIM.prof)m={k:'enq',cond:n.cond||null,corpo:lista(n.corpo,nv+1,loc)};
        if(!m){bad();continue;}
        out.push(m);
      }
      return out;
    }
    let p=lista(prog,0,[]);
    const maxL=cfg.maxLinhas||LIM.linhas;
    while(p.length&&contarLinhas(p)>maxL){p.pop();bad();}
    renumerar(p);
    return{prog:p,fixed};
  }

  /* ---------- texto de cada linha (como em Python) ---------- */
  function fmtNo(n){
    if(n.k==='cmd')return nomeCmd(n.cmd);
    if(n.k==='set')return n.nome+' = '+fmtExpr(n.expr);
    if(n.k==='se')return'if '+fmtCond(n.cond)+':';
    if(n.k==='elif')return'elif '+fmtCond(n.cond)+':';
    if(n.k==='rep')return'for '+(n.var||'i')+' in range('+n.n+'):';
    if(n.k==='enq')return'while '+fmtCond(n.cond)+':';
    return'?';
  }
  const NOME_BLOCO={se:'if',rep:'for',enq:'while'};
  function fmtLinha(L){if(L.tipo==='senao')return'else:';if(L.tipo==='elif')return fmtNo(L.el);if(L.tipo==='fim')return'# fim do '+NOME_BLOCO[L.no.k];return fmtNo(L.no);}
  /* o programa inteiro como código Python, com recuo de 4 espaços (diário, exemplos e o modo Escrever) */
  function codigo(prog){return linhas(prog).filter(L=>L.tipo!=='fim').map(L=>'    '.repeat(L.nv)+fmtLinha(L)).join('\n');}

  /* ---------- leitura de código escrito (modo Escrever) ----------
     Aceita o mesmo pedaço de Python que o painel mostra. Os erros dizem a linha, o nome do erro em Python e o que
     fazer, em linguagem simples. Devolve {prog} ou {erro:{tipo:'sintaxe',linha,titulo,texto}}. */
  function ler(txt,cfg){
    const vars={},sens={};for(const d of cfg.vars||[])vars[d.nome]=d.t;for(const d of cfg.sensores||[])sens[d.nome]=d.t;
    const funcs={};for(const b of cfg.blocos||[])if(CMD[b])funcs[CMD[b].py]=b;
    const listaFuncs=Object.keys(funcs).map(f=>f+'()').join(', ')||'nenhuma';
    const listaVars=(cfg.vars||[]).map(d=>d.nome).concat((cfg.sensores||[]).map(d=>d.nome+' (sensor)')).join(', ')||'nenhuma';
    /* "Você quis dizer…?": o nome da sala mais parecido com o que foi escrito (até 2 letras de diferença) */
    const nomesF=Object.keys(funcs),nomesV=(cfg.vars||[]).map(d=>d.nome).concat((cfg.sensores||[]).map(d=>d.nome));
    const quis=(t,lista,suf)=>{const p=parecido(t,lista);return p?' Você quis dizer '+p+(suf||'')+'?':'';};
    const E=(n,titulo,texto,cat,guia)=>({erro:{tipo:'sintaxe',linha:n,titulo,texto,cat:cat||'python',guia:guia||'erros'}});
    /* funções do Python que não existem nas máquinas do jogo */
    const EMBUTIDAS=['print','input','len','int','float','str','bool','type','abs','min','max','sum','round','list','range','sorted','open'];
    const SUB=(n,titulo,texto)=>E(n,titulo,texto+' O editor do jogo aceita só um pedaço do Python (veja "O que o editor aceita" no Guia).','subconjunto','editor');
    /* linhas com conteúdo: recuo e texto sem comentário (# fora de aspas) */
    const L=[];const cru=String(txt).replace(/\t/g,'    ').split(/\r?\n/);
    for(let i=0;i<cru.length;i++){let s=cru[i],q=null,corte=s.length;for(let k=0;k<s.length;k++){const ch=s[k];if(q){if(ch===q)q=null;}else if(ch==='"'||ch==='\'')q=ch;else if(ch==='#'){corte=k;break;}}
      s=s.slice(0,corte).replace(/\s+$/,'');if(!s.trim())continue;L.push({n:i+1,ind:s.match(/^ */)[0].length,s:s.trim()});}
    let erro=null;
    const nomeBloco={if:'if',elif:'elif',else:'else',for:'for',while:'while'};
    /* ---- expressões ---- */
    function tokens(s,n){
      const out=[];let i=0;
      while(i<s.length){const ch=s[i];
        if(ch===' '){i++;continue;}
        if(ch==='"'||ch==='\''){const j=s.indexOf(ch,i+1);if(j<0)return{erro:E(n,'SyntaxError: faltou fechar as aspas.','Um texto começa e termina com aspas: "ABRIR".','python','string')};out.push({t:'str',v:s.slice(i+1,j)});i=j+1;continue;}
        const num=s.slice(i).match(/^\d+(\.\d+)?/);
        if(num){if(s[i+num[0].length]===','&&/\d/.test(s[i+num[0].length+1]||''))return{erro:E(n,'Número com vírgula: em Python, o decimal usa ponto.','Em Python, '+num[0]+','+s.slice(i+num[0].length+1).match(/^\d+/)[0]+' não é um número: a vírgula separa dois valores (uma tupla, que o editor do jogo não usa). Escreva '+num[0]+'.'+s.slice(i+num[0].length+1).match(/^\d+/)[0]+'.','subconjunto','float')};
          out.push({t:num[1]?'float':'int',v:Number(num[0])});i+=num[0].length;continue;}
        const id=s.slice(i).match(/^[A-Za-z_À-ú][A-Za-z0-9_À-ú]*/);if(id){out.push({t:'id',v:id[0]});i+=id[0].length;continue;}
        const op=s.slice(i).match(/^(==|!=|<=|>=|<|>|=|\+|-|\(|\))/);if(op){out.push({t:'op',v:op[0]});i+=op[0].length;continue;}
        if('*/%[]{},.:;@&|^~'.indexOf(ch)>=0)return{erro:SUB(n,'O símbolo '+ch+' existe no Python, mas não neste editor.','Aqui as contas usam só + e -, e as comparações == != < > <= >=.')};
        return{erro:E(n,'SyntaxError: o símbolo '+ch+' não é entendido.','Use números, textos entre aspas, True/False, nomes de variáveis e os sinais + - == != < > <= >=.')};
      }
      return{t:out};
    }
    function expr(tk,n,loc){
      if(!tk.length)return{erro:E(n,'SyntaxError: falta um valor.','Depois do sinal, escreva um valor: um número, um texto entre aspas, True/False ou o nome de uma variável.')};
      let i=0;
      const termo=()=>{
        let t=tk[i];if(!t)return{erro:E(n,'SyntaxError: falta um valor no fim da conta.','Uma conta tem um valor dos dois lados: quantidade + 3.')};
        let neg=false;if(t.t==='op'&&t.v==='-'&&tk[i+1]&&(tk[i+1].t==='int'||tk[i+1].t==='float')){neg=true;i++;t=tk[i];}
        i++;
        if(t.t==='int'||t.t==='float'){const v=val(t.t,neg?-t.v:t.v);if(!valValido(v))return{erro:E(n,'Número grande demais para os mecanismos.','As máquinas aceitam números até '+LIM.num+'. O Python aceitaria números maiores.','limite','int')};return{e:{k:'lit',val:v}};}
        if(t.t==='str'){if(!valValido(val('str',t.v)))return{erro:E(n,'Texto grande demais para os mecanismos.','Os painéis das máquinas mostram até '+LIM.str+' letras.','limite','string')};return{e:{k:'lit',val:val('str',t.v)}};}
        if(t.t==='id'){
          if(t.v==='True'||t.v==='False')return{e:{k:'lit',val:val('bool',t.v==='True')}};
          if(t.v==='true'||t.v==='false'||t.v==='TRUE'||t.v==='FALSE')return{erro:E(n,'NameError: '+t.v+' não existe.','Em Python, os booleanos começam com letra maiúscula: True e False.','python','boolean')};
          if(vars[t.v]||sens[t.v]||loc.indexOf(t.v)>=0){if(tk[i]&&tk[i].v==='(')return{erro:E(n,'TypeError: '+t.v+' é uma variável, não uma função.','Variáveis não levam parênteses. Para ler o valor, escreva só '+t.v+'.','python','variaveis')};return{e:{k:'var',nome:t.v}};}
          if(funcs[t.v])return{erro:SUB(n,t.v+' é uma função, não um valor.','Em Python dá para guardar uma função numa variável, mas aqui as variáveis guardam só int, float, str e bool. Uma função é chamada sozinha numa linha: '+t.v+'().')};
          return{erro:E(n,'NameError: "'+t.v+'" não existe nesta sala.'+quis(t.v,nomesV),'Variáveis disponíveis: '+listaVars+'. Se era um texto, ele precisa de aspas: "'+t.v+'".','python','variaveis')};
        }
        if(t.v==='(')return{erro:SUB(n,'Parênteses nas contas existem no Python, mas não neste editor.','Escreva a conta direto: quantidade + 3.')};
        return{erro:E(n,'SyntaxError: faltou um valor antes de '+t.v+'.','Uma expressão começa com um valor: um número, um texto entre aspas, True/False ou uma variável.')};
      };
      let r=termo();if(r.erro)return r;let e=r.e;
      while(i<tk.length){
        const op=tk[i];
        if(op.t==='op'&&OPS_CMP.indexOf(op.v)>=0)return{erro:SUB(n,'Comparação fora de uma condição.','Em Python, x = a '+op.v+' b guardaria True ou False; neste editor, as comparações ficam na linha do if, do elif ou do while.')};
        if(op.t!=='op'||(op.v!=='+'&&op.v!=='-'))return{erro:E(n,'SyntaxError: '+op.v+' fora do lugar.',op.v==='='?'Um = sozinho só aparece na atribuição (variavel = valor). Para comparar, use ==.':'Entre dois valores vai um sinal: + ou -.')};
        i++;const b=termo();if(b.erro)return b;e={k:'op',op:op.v,a:e,b:b.e};
      }
      return{e};
    }
    function cond(s,n,loc,kw){
      const r=tokens(s,n);if(r.erro)return r.erro;const tk=r.t;
      if(!tk.length)return E(n,'SyntaxError: falta a condição do '+kw+'.','Depois de '+kw+' vem uma pergunta: '+kw+' energia >= 5:','python',kw==='while'?'while':'if');
      if(tk.some(t=>t.t==='id'&&(t.v==='and'||t.v==='or')))return SUB(n,'and e or existem no Python, mas não neste editor.','Cada condição testa uma coisa só. Para testar duas, coloque um if dentro do outro.');
      if(tk[0].t==='id'&&tk[0].v==='not'){const e=expr(tk.slice(1),n,loc);if(e.erro)return e.erro;return{c:{a:e.e,op:'not',b:null}};}
      const k=tk.findIndex(t=>t.t==='op'&&OPS_CMP.indexOf(t.v)>=0),um=tk.findIndex(t=>t.t==='op'&&t.v==='=');
      if(um>=0&&(k<0||um<k))return E(n,'SyntaxError: = dentro da condição.','Para comparar use ==. Um = sozinho guarda um valor numa variável (atribuição).','python','comparar');
      if(k<0){const e=expr(tk,n,loc);if(e.erro)return e.erro;return{c:{a:e.e,op:'bool',b:null}};}
      if(tk.slice(k+1).some(t=>t.t==='op'&&OPS_CMP.indexOf(t.v)>=0))return SUB(n,'Duas comparações seguidas: o Python aceita, este editor não.','Escreva um sinal de comparação por condição, por exemplo: nivel < limite.');
      const a=expr(tk.slice(0,k),n,loc);if(a.erro)return a.erro;const b=expr(tk.slice(k+1),n,loc);if(b.erro)return b.erro;
      return{c:{a:a.e,op:tk[k].v,b:b.e}};
    }
    /* ---- comandos e blocos ---- */
    const proibido=(n,o)=>E(n,o+' existe no Python, mas esta etapa não usa.','Use o que a etapa oferece (a paleta mostra). Funções: '+listaFuncs+'.','subconjunto','editor');
    function cabecalho(s,n){
      const m=s.match(/^(if|elif|else|for|while)\b(.*)$/);if(!m)return null;
      const kw=m[1];let resto=m[2].trim();
      if(!resto.endsWith(':'))return{erro:E(n,'SyntaxError: faltaram os dois-pontos (:) no fim da linha do '+kw+'.','Toda linha que abre um bloco termina com dois-pontos: '+(kw==='else'?'else:':kw==='for'?'for i in range(4):':kw+' energia >= 5:'),'python','recuo')};
      resto=resto.slice(0,-1).trim();return{kw,resto};
    }
    function bloco(idx,ind,nv,loc){
      const out=[];
      while(idx<L.length&&!erro){
        const ln=L[idx];
        if(ln.ind<ind)break;
        if(ln.ind>ind){erro=E(ln.n,'IndentationError: recuo inesperado.','Esta linha tem mais espaços na frente do que a anterior, mas não está dentro de nenhum bloco. Tire o recuo ou coloque-a embaixo de um if, for ou while.');break;}
        const s=ln.s,n=ln.n;
        if(/^(se|senao|senão|enquanto|repetir|para)\b/i.test(s)){erro=E(n,'SyntaxError: o Python usa palavras em inglês.','Escreva if (se), else (senão), while (enquanto) e for (repetir).');break;}
        if(/^(IF|If|ELIF|Elif|ELSE|Else|FOR|For|WHILE|While)\b/.test(s)){erro=E(n,'SyntaxError: o Python diferencia maiúsculas de minúsculas.','As palavras do Python são escritas em minúsculas: if, elif, else, for, while.');break;}
        if(/^else\s+if\b/.test(s)){erro=E(n,'SyntaxError: em Python se escreve elif.','Para testar outra condição depois de um if, use elif condição:','python','elif');break;}
        const cab=cabecalho(s,n);
        if(cab&&cab.erro){erro=cab.erro;break;}
        if(cab){
          if(cab.kw==='elif'||cab.kw==='else'){erro=E(n,'SyntaxError: '+cab.kw+' sem if.','O '+cab.kw+' precisa vir logo depois do bloco de um if, com o mesmo recuo do if.');break;}
          if(nv+1>LIM.prof){erro=E(n,'Blocos demais um dentro do outro.','Neste painel, um bloco fica dentro de outro só até '+LIM.prof+' níveis. O Python aceitaria mais.','limite','recuo');break;}
          /* o bloco embaixo de um cabeçalho (if, elif, else, for, while) da linha nl */
          const corpo=(i0,loc2,kw,nl)=>{const nx=L[i0];if(!nx||nx.ind<=ind){erro=E(nl||n,'IndentationError: o bloco do '+(kw||cab.kw)+' está vazio.','Escreva pelo menos uma linha embaixo dele, com 4 espaços a mais na frente.','python','recuo');return null;}
            return bloco(i0,nx.ind,nv+1,loc2);};
          if(cab.kw==='if'){
            if(!permite(cfg,'se')){erro=proibido(n,'if');break;}
            const c=cond(cab.resto,n,loc,'if');if(c.erro){erro=c;break;}
            const no={k:'se',cond:c.c,entao:[],senao:null};const r=corpo(idx+1,loc);if(!r)break;no.entao=r.nos;idx=r.idx;
            while(idx<L.length&&L[idx].ind===ind&&!erro){
              const c2=cabecalho(L[idx].s,L[idx].n);if(!c2||c2.erro){if(c2&&c2.erro)erro=c2.erro;break;}
              if(c2.kw==='elif'){if(!permite(cfg,'elif')){erro=proibido(L[idx].n,'elif');break;}if(no.senao){erro=E(L[idx].n,'SyntaxError: elif depois do else.','O else é sempre o último caminho: os elif vêm antes dele.');break;}
                const cc=cond(c2.resto,L[idx].n,loc,'elif');if(cc.erro){erro=cc;break;}const r2=corpo(idx+1,loc,'elif',L[idx].n);if(!r2)break;(no.elifs=no.elifs||[]).push({k:'elif',cond:cc.c,corpo:r2.nos});idx=r2.idx;}
              else if(c2.kw==='else'){if(!permite(cfg,'senao')){erro=proibido(L[idx].n,'else');break;}if(no.senao){erro=E(L[idx].n,'SyntaxError: dois else no mesmo if.','Cada if tem no máximo um else, no fim.');break;}
                if(c2.resto){erro=E(L[idx].n,'SyntaxError: else não tem condição.','O else pega todos os outros casos: escreva só else:');break;}const r2=corpo(idx+1,loc,'else',L[idx].n);if(!r2)break;no.senao=r2.nos;idx=r2.idx;}
              else break;
            }
            out.push(no);continue;
          }
          if(cab.kw==='while'){
            if(!permite(cfg,'enq')){erro=proibido(n,'while');break;}
            const c=cond(cab.resto,n,loc,'while');if(c.erro){erro=c;break;}const r=corpo(idx+1,loc);if(!r)break;out.push({k:'enq',cond:c.c,corpo:r.nos});idx=r.idx;continue;
          }
          if(cab.kw==='for'){
            if(!permite(cfg,'rep')){erro=proibido(n,'for');break;}
            const m=cab.resto.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+in\s+range\s*\((.*)\)$/);
            if(!m){erro=SUB(n,'Este editor só aceita o for com range.','O Python tem outros jeitos de usar o for (com listas, por exemplo). Aqui ele se escreve assim: for i in range(4):  (repete 4 vezes; i vale 0, 1, 2 e 3).');break;}
            const vn=m[1],arg=m[2].trim();
            if(!NOME_OK.test(vn)){erro=E(n,'Nome de variável do for inválido.','Use letras minúsculas, como i ou volta.','python','for');break;}
            if(vars[vn]||sens[vn]){erro=E(n,'O for não pode usar a variável '+vn+'.','Regra do jogo: '+vn+' é o contêiner de uma máquina. Use outro nome, como i.','maquina','for');break;}
            if(!/^\d+$/.test(arg)){erro=arg.indexOf(',')>=0||/^[A-Za-z_]/.test(arg)?SUB(n,'Este editor usa range com um número só.','O Python aceita range(2, 5) ou range(n) com uma variável; aqui se escreve o número de voltas: range(4) repete 4 vezes.'):E(n,'range() recebe um número inteiro.','Escreva quantas vezes repetir, por exemplo range(4).','python','for');break;}
            const k=+arg,mx=cfg.repMax||LIM.rep;if(k>mx){erro=E(n,'Repetição grande demais para este painel.','Aqui o for repete no máximo '+mx+' vezes.','limite','for');break;}
            const r=corpo(idx+1,loc.concat([vn]));if(!r)break;out.push({k:'rep',n:k,var:vn,corpo:r.nos});idx=r.idx;continue;
          }
        }
        /* chamada de função */
        const ch=s.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)$/);
        if(ch){const f=ch[1];
          if(!funcs[f]){if(vars[f]||sens[f]){erro=E(n,'TypeError: '+f+' é uma variável, não uma função.','Para guardar um valor, escreva '+f+' = valor.','python','variaveis');break;}
            if(EMBUTIDAS.indexOf(f)>=0){erro=SUB(n,f+'() existe no Python, mas não nas máquinas desta sala.',(f==='print'?'As máquinas não têm tela para mostrar textos: o resultado aparece no mecanismo e nas variáveis do painel.':'Aqui só existem as funções da sala.')+' Funções disponíveis: '+listaFuncs+'.');break;}
            erro=E(n,'NameError: a função '+f+'() não existe nesta sala.'+quis(f,nomesF,'()'),'Funções disponíveis: '+listaFuncs+'.','python','comandos');break;}
          if(ch[2].trim()){erro=E(n,'TypeError: '+f+'() não recebe valores.','Deixe os parênteses vazios: '+f+'(). A máquina lê o que precisar das variáveis.','python','comandos');break;}
          out.push({k:'cmd',cmd:funcs[f]});idx++;continue;}
        if(funcs[s]){erro=E(n,'Faltaram os parênteses: a função não foi chamada.','Em Python, escrever só '+s+' não dá erro, mas também não faz nada. Para a máquina executar, escreva '+s+'() com parênteses.','semEfeito','comandos');break;}
        /* atribuição */
        const at=s.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(==|=)(.*)$/);
        if(at){const nome=at[1];
          if(at[2]==='=='){erro=E(n,'== compara, não guarda.','Em Python, '+nome+' == … só faz uma pergunta, e a resposta se perde: a linha não dá erro, mas não faz nada. Para guardar um valor use um = só: '+nome+' = valor.','semEfeito','comparar');break;}
          if(!permite(cfg,'set')){erro=proibido(n,'A atribuição (=)');break;}
          if(sens[nome]){erro=E(n,'"'+nome+'" é um sensor: só dá para ler.','Regra desta sala: o programa pode ler o valor de um sensor, mas não guardar outro nele. Em Python, uma variável comum poderia receber outro valor.','maquina','variaveis');break;}
          if(loc.indexOf(nome)>=0){erro=E(n,'"'+nome+'" é a variável do for.','Regra do jogo: ela muda sozinha a cada volta e não recebe valores. Guarde valores nas variáveis da sala: '+listaVars+'.','maquina','for');break;}
          if(!vars[nome]){erro=E(n,'"'+nome+'" não é uma variável desta sala.','Em Python, '+nome+' = … criaria uma variável nova. Aqui, as variáveis são os contêineres ligados às máquinas da sala, e o programa usa só estas: '+listaVars+'.','maquina','variaveis');break;}
          const r=tokens(at[3],n);if(r.erro){erro=r.erro;break;}const e=expr(r.t,n,loc);if(e.erro){erro=e.erro;break;}
          out.push({k:'set',nome,expr:e.e});idx++;continue;}
        if(/^[a-z_][a-z0-9_]*$/i.test(s)){
          if(vars[s]||sens[s]||loc.indexOf(s)>=0){erro=E(n,'"'+s+'" sozinho não faz nada.','Em Python, escrever só o nome de uma variável não dá erro, mas a linha não muda nada. Chame uma função ('+listaFuncs+') ou guarde um valor: '+s+' = valor.','semEfeito','variaveis');break;}
          if(/^(pass|break|continue|return)$/.test(s)){erro=SUB(n,s+' existe no Python, mas não neste editor.','Cada linha aqui chama uma função, guarda um valor ou abre um bloco.');break;}
          erro=E(n,'NameError: "'+s+'" não existe nesta sala.'+(quis(s,nomesF,'()')||quis(s,nomesV)),'Chame uma função com parênteses ('+listaFuncs+') ou guarde um valor numa variável da sala: '+listaVars+'.','python','comandos');break;}
        const pal=(s.match(/^([a-z]+)\b/)||[])[1];
        if(['def','import','from','class','return','try','except','with','lambda','global','print','del','assert','raise','yield','async','await','match'].indexOf(pal)>=0){erro=SUB(n,pal+' existe no Python, mas não neste editor.','Cada linha aqui chama uma função da sala, guarda um valor (x = 5) ou abre um bloco com if, elif, else, for ou while.');break;}
        erro=E(n,'SyntaxError: esta linha não foi entendida.','Uma linha pode chamar uma função, como avancar(); guardar um valor, como x = 5; ou abrir um bloco com if, elif, else, for ou while.');break;
      }
      return{nos:out,idx};
    }
    if(L.length&&L[0].ind>0)return E(L[0].n,'IndentationError: recuo inesperado.','A primeira linha do programa começa sem espaços na frente.','python','recuo');
    const r=bloco(0,0,0,[]);
    if(erro)return erro;
    const prog=renumerar(r.nos);
    const maxL=cfg.maxLinhas||LIM.linhas,n=contarLinhas(prog);
    if(n>maxL)return E(L[L.length-1].n,'O programa tem '+n+' linhas, e este painel aceita '+maxL+'.','Encurte o programa: uma repetição pode substituir linhas iguais.','limite','for');
    return{prog};
  }

  /* ---------- interpretador ---------- */
  function iniciar(cfg,mundo,sit,prog){
    const env={};
    for(const d of cfg.vars||[])env[d.nome]={t:d.t,val:d.ini===undefined||d.ini===null?null:d.ini,ro:false,unid:d.unid||''};
    const p=clonar(prog);
    const s={cfg,mundo,sit,prog:p,env,ws:mundo.init(sit,cfg),pilha:[{k:'raiz',lista:p,i:0}],passos:0,fim:false,ok:false,erro:null,aviso:null,ultimo:null};
    sensores(s);return s;
  }
  function sensores(s){const o=s.mundo.sensores?s.mundo.sensores(s.ws,s.cfg):null;if(o)for(const k in o)s.env[k]={t:o[k].t,val:o[k].val,ro:true,unid:o[k].unid||''};}
  function ev(s,e){s.ultimo=e;e.passo=s.passos;if(e.cmp&&e.cmp.misto&&!s.aviso)s.aviso=AVISO_MISTO(e.cmp);return e;}
  const AVISO_MISTO=c=>'Atenção: '+fmt(c.a)+' '+c.op+' '+fmt(c.b)+' compara '+TIPOS[c.a.t].rot+' com '+TIPOS[c.b.t].rot+'. Em Python, um número e um texto nunca são iguais, então == dá sempre False.';
  function falha(s,erro,linha,extra){s.fim=true;s.erro=Object.assign({},erro,{linha:linha===undefined?null:linha});return ev(s,Object.assign({tipo:'erro',linha:s.erro.linha,erro:s.erro},extra||{}));}
  /* blocos ativos (para mostrar o contador de cada repetição) */
  function contadores(s){return s.pilha.filter(f=>f.k==='rep'||f.k==='enq').map(f=>({id:f.no.id,k:f.k,volta:f.volta,n:f.no.n,var:f.no.var||'i'}));}
  const laco=(s,no,volta)=>{s.env[no.var||'i']={t:'int',val:val('int',volta-1),ro:true,laco:true,unid:''};};
  function passo(s){
    if(s.fim)return null;
    if(!s.prog.length)return falha(s,{tipo:'vazio'},null);
    if(s.passos>=(s.cfg.maxPassos||LIM.passos))return falha(s,{tipo:'limitePassos',n:s.passos},null);
    s.passos++;
    /* fecha os blocos que terminaram: o fim de um if não gasta passo; o fim de uma volta testa a repetição de novo */
    for(;;){
      const f=s.pilha[s.pilha.length-1];
      if(f.k==='cadeia'||f.i<f.lista.length)break;
      if(f.k==='raiz'){
        const r=s.mundo.fim?s.mundo.fim(s.ws,s):{ok:true};s.fim=true;
        if(r.ok){s.ok=true;return ev(s,{tipo:'fim',ok:true,msg:r.msg||''});}
        s.erro=Object.assign({linha:null,origem:'objetivo'},r.erro);return ev(s,{tipo:'fim',ok:false,erro:s.erro});
      }
      if(f.k==='entao'||f.k==='senao'||f.k==='elif'){s.pilha.pop();continue;}
      if(f.k==='rep'){
        if(f.volta<f.no.n){f.volta++;f.i=0;laco(s,f.no,f.volta);return ev(s,{tipo:'rep',linha:f.no.id,volta:f.volta,n:f.no.n,var:f.no.var||'i'});}
        s.pilha.pop();return ev(s,{tipo:'repFim',linha:f.no.id,n:f.no.n});
      }
      if(f.k==='enq'){
        const c=comparar(f.no.cond,s.env);if(c.erro)return falha(s,c.erro,f.no.id);
        if(!c.res){s.pilha.pop();return ev(s,{tipo:'enq',linha:f.no.id,res:false,volta:f.volta,cmp:c,sai:true});}
        if(f.volta>=(s.cfg.maxVoltas||LIM.voltas))return falha(s,{tipo:'semParada',voltas:f.volta,cond:fmtCond(f.no.cond)},f.no.id);
        f.volta++;f.i=0;return ev(s,{tipo:'enq',linha:f.no.id,res:true,volta:f.volta,cmp:c});
      }
    }
    const f=s.pilha[s.pilha.length-1];
    /* elif: cada condição testada é um passo, na ordem, até uma dar True (ou cair no else) */
    if(f.k==='cadeia'){
      const els=elifsDe(f.no),e=els[f.j],c=comparar(e.cond,s.env);if(c.erro)return falha(s,c.erro,e.id);
      s.pilha.pop();
      if(c.res){s.pilha.push({k:'elif',lista:e.corpo,i:0,no:f.no});return ev(s,{tipo:'se',elif:true,linha:e.id,res:true,cmp:c,ramo:'elif'+f.j});}
      if(f.j+1<els.length){s.pilha.push({k:'cadeia',no:f.no,j:f.j+1,lista:[],i:0});return ev(s,{tipo:'se',elif:true,linha:e.id,res:false,cmp:c,ramo:'elif'});}
      if(f.no.senao)s.pilha.push({k:'senao',lista:f.no.senao,i:0,no:f.no});
      return ev(s,{tipo:'se',elif:true,linha:e.id,res:false,cmp:c,ramo:f.no.senao?'senao':null});
    }
    const no=f.lista[f.i];
    if(no.k==='cmd'){
      const r=s.mundo.cmd(s.ws,no.cmd,s)||{};
      if(r.erro)return falha(s,Object.assign({origem:'mecanismo'},r.erro),no.id,{cmd:no.cmd,anim:r.anim});
      f.i++;sensores(s);
      const e=Object.assign({tipo:'cmd',linha:no.id,cmd:no.cmd},r);
      if(r.fimOk){s.fim=true;s.ok=true;
        const resto=s.pilha.some(q=>q.i<q.lista.length||q.k==='cadeia')||s.pilha.some(q=>q.k==='rep'&&q.volta<q.no.n);
        if(resto)s.aviso='As linhas depois de '+nomeCmd(no.cmd)+' não foram executadas: o mecanismo já tinha sido acionado.';
      }
      return ev(s,e);
    }
    if(no.k==='set'){
      const d=s.env[no.nome];
      if(!d)return falha(s,{tipo:'naoExiste',nome:no.nome},no.id);
      if(d.ro)return falha(s,{tipo:d.laco?'variavelFor':'somenteLeitura',nome:no.nome},no.id);
      const r=avaliar(no.expr,s.env);if(r.erro)return falha(s,r.erro,no.id);
      if(r.val.t!==d.t)return falha(s,{tipo:'tipoIncompativel',nome:no.nome,esperado:d.t,val:r.val},no.id);
      const antes=d.val;d.val=r.val;f.i++;
      const mr=s.mundo.atribuiu?s.mundo.atribuiu(s.ws,no.nome,r.val,s):null;
      if(mr&&mr.erro)return falha(s,Object.assign({origem:'mecanismo'},mr.erro),no.id,{anim:mr.anim});
      sensores(s);
      return ev(s,Object.assign({tipo:'set',linha:no.id,nome:no.nome,antes,depois:r.val,conta:no.expr&&no.expr.k==='op'},mr||{}));
    }
    if(no.k==='se'){
      const c=comparar(no.cond,s.env);if(c.erro)return falha(s,c.erro,no.id);
      f.i++;
      if(c.res){s.pilha.push({k:'entao',lista:no.entao,i:0,no});return ev(s,{tipo:'se',linha:no.id,res:true,cmp:c,ramo:'entao'});}
      if(elifsDe(no).length){s.pilha.push({k:'cadeia',no,j:0,lista:[],i:0});return ev(s,{tipo:'se',linha:no.id,res:false,cmp:c,ramo:'elif'});}
      if(no.senao)s.pilha.push({k:'senao',lista:no.senao,i:0,no});
      return ev(s,{tipo:'se',linha:no.id,res:false,cmp:c,ramo:no.senao?'senao':null});
    }
    if(no.k==='rep'){
      f.i++;
      if(!(no.n>=1))return ev(s,{tipo:'repFim',linha:no.id,n:no.n,zero:true});
      s.pilha.push({k:'rep',lista:no.corpo,i:0,no,volta:1});laco(s,no,1);
      return ev(s,{tipo:'rep',linha:no.id,volta:1,n:no.n,var:no.var||'i'});
    }
    if(no.k==='enq'){
      const c=comparar(no.cond,s.env);if(c.erro)return falha(s,c.erro,no.id);
      f.i++;
      if(c.res){s.pilha.push({k:'enq',lista:no.corpo,i:0,no,volta:1});return ev(s,{tipo:'enq',linha:no.id,res:true,volta:1,cmp:c});}
      return ev(s,{tipo:'enq',linha:no.id,res:false,volta:0,cmp:c,sai:true});
    }
    return falha(s,{tipo:'desconhecido'},no.id);
  }
  /* depois da última instrução visível, o próximo passo só confere o resultado: o painel faz isso no mesmo toque */
  function soFaltaFim(s){
    if(s.fim)return false;
    for(let i=s.pilha.length-1;i>=0;i--){const f=s.pilha[i];
      if(f.k==='cadeia'||f.i<f.lista.length)return false;
      if(f.k==='rep'||f.k==='enq')return false;     /* o fim de uma volta é um passo que aparece (a condição ou o contador) */
      if(f.k==='raiz')return true;
    }
    return true;
  }
  /* roda tudo com o mesmo passo() (testes e conferência) */
  function executar(cfg,mundo,sit,prog){const s=iniciar(cfg,mundo,sit,prog),eventos=[];let e;while((e=passo(s)))eventos.push(e);return{s,eventos};}

  /* ---------- erros explicados para quem nunca programou ----------
     Cada erro tem um título curto (com o nome que o Python daria, quando existe) e uma explicação do que fazer. */
  const mai=t=>t?t[0].toUpperCase()+t.slice(1):t;
  function explicarErro(s){
    const e=s.erro;if(!e)return null;
    const n=e.linha?(e.tipo==='sintaxe'?e.linha:numeroLinha(s.prog,e.linha)):0;
    const R=(cat,guia,titulo,texto)=>({linha:n,cat,guia,titulo,texto});
    if(e.tipo==='sintaxe')return R(e.cat||'python',e.guia||'erros',e.titulo,e.texto);
    if(e.msg)return R(e.origem||'mecanismo',null,e.titulo||'O mecanismo não funcionou.',mai(e.msg));
    const vs=((s.cfg&&s.cfg.vars)||[]).map(d=>d.nome).concat(((s.cfg&&s.cfg.sensores)||[]).map(d=>d.nome)).join(', ');
    switch(e.tipo){
      case'vazio':return R('editor','comandos','O programa está vazio.','Coloque pelo menos uma instrução antes de executar.');
      case'incompleta':return R('editor','comandos','Linha incompleta.','Esta linha ainda tem um espaço vazio (?). Toque nela e escolha o que falta.');
      case'semValor':return R('python','variaveis','NameError: a variável "'+e.nome+'" ainda não recebeu valor.','Em Python, ler uma variável antes de guardar algo nela é erro. Guarde um valor primeiro, por exemplo: '+e.nome+' = … . No painel ela aparece como "vazia", que é diferente de 0 e de False.');
      case'naoExiste':return R('python','variaveis','NameError: "'+e.nome+'" não existe aqui.','Variáveis desta sala: '+(vs||'nenhuma')+'.');
      case'somenteLeitura':return R('maquina','variaveis','"'+e.nome+'" é um sensor: só dá para ler.','Regra desta sala: o sensor mede o mecanismo, e o programa pode ler o valor dele, mas não guardar outro. Em Python, uma variável comum poderia receber outro valor.');
      case'variavelFor':return R('maquina','for','"'+e.nome+'" é a variável do for.','Regra do jogo: ela muda sozinha a cada volta (0, 1, 2…) e não recebe valores. Em Python dá para mudá-la dentro do for, mas isso não muda o número de voltas, então aqui o jogo não deixa.');
      case'tipoIncompativel':{const T=TIPOS[e.esperado];
        return R('maquina',T.guia,'A máquina recusou o valor: '+e.nome+' só aceita '+rotulo(e.esperado)+'.','O programa tentou guardar '+fmt(e.val)+', que é '+tipoDe(e.val)+'. Em Python, '+e.nome+' = '+fmt(e.val)+' seria permitido: a variável passaria a guardar '+TIPOS[e.val.t].art+'. Mas aqui '+e.nome+' é o contêiner de uma máquina que só funciona com '+T.desc+' (como a anotação '+e.nome+': '+T.rot+'), então o jogo confere o tipo antes de guardar.'+dicaTipo(e.esperado,e.val));}
      case'tipoOp':return R('python','tipos','TypeError: a conta '+fmt(e.a)+' '+e.op+' '+fmt(e.b)+' mistura tipos.','Em Python, + e - entre um número e um texto dão erro.'+(e.a.t==='str'||e.b.t==='str'?' Um texto entre aspas não vira número sozinho.':''));
      case'cmpOrdem':return R('python','comparar','TypeError: '+e.op+' não compara '+TIPOS[e.a.t].rot+' com '+TIPOS[e.b.t].rot+'.','Em Python, < > <= >= entre um número e um texto dão erro: '+fmt(e.a)+' é '+tipoDe(e.a)+' e '+fmt(e.b)+' é '+tipoDe(e.b)+'. Compare valores do mesmo tipo (sem aspas, para números).');
      case'grande':return R('limite','int','Número grande demais para o mecanismo.','O resultado passou do que esta máquina aguenta ('+LIM.num+'). O Python aceitaria números maiores.');
      case'semParada':return R('limite','while','A repetição não parou: o jogo interrompeu o while.','A condição "'+e.cond+'" continuou verdadeira por '+e.voltas+' voltas. Em Python o programa ficaria rodando para sempre; aqui o jogo para por segurança. Alguma linha dentro do while precisa mudar o valor testado até a condição ficar falsa.');
      case'limitePassos':return R('limite','for','O programa ficou longo demais e foi interrompido.','Passou de '+e.n+' passos. Confira se alguma repetição está grande demais.');
      default:return R('mecanismo',null,'Esta linha não pôde ser executada.','Confira o que ela pede e tente de novo.');
    }
  }
  /* a explicação numa frase só (avisos, diário e testes) */
  function explicar(s){const r=explicarErro(s);if(!r)return'';return(r.linha?'Linha '+r.linha+': ':'')+r.titulo+' '+r.texto;}
  /* o assunto do Guia que explica um erro de leitura do texto */
  const GUIA_ERRO=x=>x&&(x.guia||'erros');
  /* o que aconteceu em um passo, numa frase curta (painel durante a execução) */
  function narrar(e,s){
    if(!e)return'';
    const verdade=c=>(c.op==='bool'||c.op==='not'?c.txt+' → '+(c.verdade?fmt(c.a)+(c.res!==(c.op==='not')?' conta como True':' conta como False')+' → ':'')+(c.res?'True':'False')
      :c.txt+' → '+fmt(c.a)+' '+c.op+' '+fmt(c.b)+' é '+(c.res?'True':'False'))+(c.misto?' (número e texto nunca são iguais)':'');
    if(e.tipo==='set')return e.nome+' agora vale '+fmt(e.depois)+(e.antes?' (antes: '+fmt(e.antes)+')':' (estava vazia)')+'.'+(e.msg?' '+e.msg:'');
    if(e.tipo==='se'){const kw=e.elif?'elif':'if';return kw+': '+verdade(e.cmp)+'. '+(e.res?'Executa o bloco do '+kw+'.':e.ramo==='elif'?'Testa o próximo elif.':e.ramo==='senao'?'Executa o else.':'Pula o bloco.');}
    if(e.tipo==='rep')return'for: volta '+e.volta+' de '+e.n+' ('+e.var+' = '+(e.volta-1)+').';
    if(e.tipo==='repFim')return e.zero?'range(0): o bloco do for não executa.':'for terminado: '+e.n+(e.n===1?' volta.':' voltas.');
    if(e.tipo==='enq')return'while: '+verdade(e.cmp)+'. '+(e.res?'Volta '+e.volta+'.':(e.volta===0?'O bloco não executa nenhuma vez.':'A repetição para depois de '+e.volta+(e.volta===1?' volta.':' voltas.')));
    if(e.tipo==='cmd')return e.msg||(nomeCmd(e.cmd)+' executada.');
    if(e.tipo==='fim')return e.ok?(e.msg||'Programa concluído.'):'';
    return'';
  }

  return{TIPOS,OPS_CMP,OPS_ARIT,OPS_BOOL,OP_NOME,LIM,CMD,SUBCONJUNTO,CAT,GUIA_ERRO,rotulo,nomeCmd,val,valValido,fmt,fmtDec,tipoDe,fmtExpr,fmtCond,avaliar,comparar,compativel,
    elifsDe,ramos,ramoLista,filhos,cada,novoId,renumerar,linhas,contarLinhas,profundidade,numeroLinha,achar,listaDe,nivelDe,inserir,adicionarElif,alternarSenao,remover,mover,clonar,assinatura,permite,limpar,
    fmtNo,fmtLinha,codigo,ler,iniciar,passo,soFaltaFim,executar,contadores,explicarErro,explicar,narrar};
})();
