/* ====================== linguagem educativa (LANG) ======================
   Valores tipados, programa em blocos (uma árvore), edição por toques e o interpretador passo a passo.
   Não usa DOM nem canvas: os testes carregam este arquivo sozinho num vm do Node.
   Executar e Passo a passo chamam o mesmo LANG.passo(): cada chamada executa UMA instrução visível
   (um comando, uma atribuição, um teste de SE, uma volta de REPETIR ou de ENQUANTO) e devolve o que aconteceu.

   Regras de tipo da linguagem do jogo (iguais às do Python, mais rígidas onde o Python esconderia diferenças):
   - quatro tipos: inteiro (int) 5, decimal (float) 3.14, texto (str) "ABRIR", booleano (bool) True/False;
   - cada contêiner (variável) aceita um tipo só; o jogo NUNCA converte sozinho: "5" (texto) não entra num contêiner de inteiro,
     e 5 (inteiro) não entra num de decimal (escreve-se 5.0);
   - uma variável sem valor fica "vazia", diferente de 0 e de False; ler uma variável vazia é erro;
   - soma e subtração só entre números; inteiro com decimal dá decimal (o resultado aparece com ponto);
   - comparar número com texto é erro (não vira False escondido); texto e booleano só se comparam com == e !=;
   - = guarda um valor (atribuição); == pergunta se dois valores são iguais (comparação).
   Decimais são guardados de forma aproximada, como em qualquer computador: o jogo mostra até 4 casas. */
const LANG=(function(){
  const TIPOS={
    int:{nome:'inteiro',py:'int',ex:'5'},
    float:{nome:'decimal',py:'float',ex:'3.14'},
    str:{nome:'texto',py:'str',ex:'"ABRIR"'},
    bool:{nome:'booleano',py:'bool',ex:'True'}
  };
  const OPS_CMP=['==','!=','<','>','<=','>='],OPS_ARIT=['+','-'];
  const OP_NOME={'==':'é igual a','!=':'é diferente de','<':'é menor que','>':'é maior que','<=':'é menor ou igual a','>=':'é maior ou igual a','+':'mais','-':'menos'};
  const LIM={num:999999,str:16,linhas:40,prof:3,rep:20,passos:400,voltas:30};
  /* catálogo de comandos do mundo (preenchido por 03-learn.js): id → {nome, simbolo, ajuda} */
  const CMD={};

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
  const tipoDe=x=>x?TIPOS[x.t].nome+' ('+TIPOS[x.t].py+')':'vazio';
  const ehNum=x=>x&&(x.t==='int'||x.t==='float');

  /* ---------- expressões e condições ----------
     expressão: {k:'lit',val} | {k:'var',nome} | {k:'op',op:'+'|'-',a,b}     condição: {a, op, b} (op de comparação) */
  function fmtExpr(e){
    if(!e)return'?';
    if(e.k==='lit')return fmt(e.val);
    if(e.k==='var')return e.nome;
    if(e.k==='op')return fmtExpr(e.a)+' '+e.op+' '+fmtExpr(e.b);
    return'?';
  }
  const fmtCond=c=>c?fmtExpr(c.a)+' '+(c.op||'?')+' '+fmtExpr(c.b):'?';
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
    if(!c||OPS_CMP.indexOf(c.op)<0)return{erro:{tipo:'incompleta'}};
    const a=avaliar(c.a,env);if(a.erro)return a;const b=avaliar(c.b,env);if(b.erro)return b;
    const A=a.val,B=b.val;let r;
    if(ehNum(A)&&ehNum(B)){const x=A.v,y=B.v;r=c.op==='=='?x===y:c.op==='!='?x!==y:c.op==='<'?x<y:c.op==='>'?x>y:c.op==='<='?x<=y:x>=y;}
    else if(A.t===B.t){if(c.op!=='=='&&c.op!=='!=')return{erro:{tipo:'cmpOrdem',t:A.t,op:c.op}};r=c.op==='=='?A.v===B.v:A.v!==B.v;}
    else return{erro:{tipo:'cmpTipos',a:A,b:B}};
    return{res:r,a:A,b:B,op:c.op,txt:fmtExpr(c.a)+' '+c.op+' '+fmtExpr(c.b)};
  }
  /* antes de guardar um objeto num contêiner: explica a incompatibilidade (null quando pode) */
  function compativel(tipoVar,v){
    if(!v)return'Escolha um valor para guardar.';
    if(v.t===tipoVar)return null;
    const T=TIPOS[tipoVar];
    let s='Este contêiner aceita '+T.nome+' ('+T.py+'), mas '+fmt(v)+' é '+tipoDe(v)+'.';
    if(v.t==='str'&&(tipoVar==='int'||tipoVar==='float'))s+=' O que está entre aspas é texto, mesmo quando parece número: o jogo não converte sozinho.';
    else if(v.t==='int'&&tipoVar==='float')s+=' Um decimal se escreve com ponto, como '+v.v+'.0.';
    else if(v.t==='float'&&tipoVar==='int')s+=' Um inteiro não tem casas decimais.';
    else if(v.t==='bool')s+=' True e False são valores booleanos: ligado ou desligado, sim ou não.';
    return s+' O objeto continua disponível.';
  }

  /* ---------- programa ----------
     nós: {id,k:'cmd',cmd}  {id,k:'set',nome,expr}  {id,k:'se',cond,entao:[],senao:[]|null}
          {id,k:'rep',n,corpo:[]}  {id,k:'enq',cond,corpo:[]} */
  const CONT={se:1,rep:1,enq:1};
  function filhos(n){return n.k==='se'?(n.senao?[n.entao,n.senao]:[n.entao]):n.k==='rep'||n.k==='enq'?[n.corpo]:[];}
  function cada(prog,fn){(function w(l,nv){for(const n of l){fn(n,nv);for(const f of filhos(n))w(f,nv+1);}})(prog,0);}
  function novoId(prog){let m=0;cada(prog,n=>{if(n.id>m)m=n.id;});return m+1;}
  /* linhas como aparecem na tela: cabeçalho, SENÃO e FIM de cada bloco ocupam uma linha */
  function linhas(prog){
    const out=[];
    (function w(l,nv,pai,ramo){l.forEach((n,i)=>{
      out.push({tipo:'no',no:n,nv,pai,ramo,i});
      if(n.k==='se'){w(n.entao,nv+1,n,'entao');if(n.senao){out.push({tipo:'senao',no:n,nv});w(n.senao,nv+1,n,'senao');}out.push({tipo:'fim',no:n,nv});}
      else if(n.k==='rep'||n.k==='enq'){w(n.corpo,nv+1,n,'corpo');out.push({tipo:'fim',no:n,nv});}
    });})(prog,0,null,null);
    return out;
  }
  const nLinhas=n=>n.k==='se'?2+(n.senao?1:0):CONT[n.k]?2:1;
  function contarLinhas(prog){let c=0;cada(prog,n=>{c+=nLinhas(n);});return c;}
  function profundidade(prog){let m=0;cada(prog,(n,nv)=>{if(CONT[n.k])m=Math.max(m,nv+1);});return m;}
  function numeroLinha(prog,id){const L=linhas(prog);for(let i=0;i<L.length;i++)if(L[i].tipo==='no'&&L[i].no.id===id)return i+1;return 0;}
  /* acha um nó: a lista onde ele está, a posição, o pai e o ramo */
  function achar(prog,id){
    let r=null;
    (function w(l,pai,ramo,nv){for(let i=0;i<l.length&&!r;i++){const n=l[i];if(n.id===id){r={lista:l,i,no:n,pai,ramo,nv};return;}
      if(n.k==='se'){w(n.entao,n,'entao',nv+1);if(n.senao)w(n.senao,n,'senao',nv+1);}else if(n.k==='rep'||n.k==='enq')w(n.corpo,n,'corpo',nv+1);}})(prog,null,null,0);
    return r;
  }
  function listaDe(prog,cur){if(!cur||cur.pai===null||cur.pai===undefined)return prog;const a=achar(prog,cur.pai);if(!a)return null;return a.no[cur.ramo]||null;}
  function nivelDe(prog,cur){if(!cur||cur.pai===null||cur.pai===undefined)return 0;const a=achar(prog,cur.pai);return a?a.nv+1:0;}
  /* insere no cursor {pai,ramo,i}; respeita o limite de linhas e de blocos um dentro do outro.
     Devolve o cursor depois do nó inserido (ou dentro dele, se for um bloco) ou um texto explicando por que não coube. */
  function inserir(prog,cur,no,lim){
    lim=lim||{};const maxL=lim.linhas||LIM.linhas,maxP=lim.prof||LIM.prof;
    const l=listaDe(prog,cur);if(!l)return'Escolha onde a placa vai entrar.';
    if(contarLinhas(prog)+nLinhas(no)>maxL)return'O painel tem só '+maxL+' linhas. Remova uma placa ou use uma repetição.';
    if(CONT[no.k]&&nivelDe(prog,cur)+1>maxP)return'Um bloco pode ficar dentro de outro só até '+maxP+' níveis.';
    no.id=novoId(prog);const i=Math.max(0,Math.min(l.length,cur.i|0));l.splice(i,0,no);
    if(CONT[no.k])return{pai:no.id,ramo:no.k==='se'?'entao':'corpo',i:0};
    return{pai:cur.pai===undefined?null:cur.pai,ramo:cur.ramo||null,i:i+1};
  }
  function remover(prog,id){const a=achar(prog,id);if(!a)return null;a.lista.splice(a.i,1);return{pai:a.pai?a.pai.id:null,ramo:a.ramo,i:a.i};}
  /* sobe ou desce uma placa (com o que estiver dentro dela). Encontrando um bloco vizinho, entra nele; no começo ou no fim
     de um bloco, sai dele. Assim dá para levar qualquer placa a qualquer lugar só com toques. Devolve false se não mexeu. */
  function mover(prog,id,dir,lim){
    const a=achar(prog,id);if(!a)return false;const maxP=(lim&&lim.prof)||LIM.prof;
    const prof=n=>{let m=0;(function w(x,d){if(CONT[x.k]){m=Math.max(m,d);for(const f of filhos(x))for(const y of f)w(y,d+1);}})(n,1);return m;};
    const cabe=nv=>nv+prof(a.no)<=maxP;
    const l=a.lista,i=a.i,no=a.no;
    if(dir<0){
      if(i>0){
        const v=l[i-1];
        if(CONT[v.k]&&cabe(a.nv+1)){l.splice(i,1);const alvo=v.k==='se'?(v.senao||v.entao):v.corpo;alvo.push(no);return true;}
        l[i]=v;l[i-1]=no;return true;
      }
      if(!a.pai)return false;
      const p=achar(prog,a.pai.id);
      if(a.ramo==='senao'){l.splice(i,1);a.pai.entao.push(no);return true;}
      l.splice(i,1);p.lista.splice(p.i,0,no);return true;
    }else{
      if(i<l.length-1){
        const v=l[i+1];
        if(CONT[v.k]&&cabe(a.nv+1)){l.splice(i,1);const alvo=v.k==='se'?v.entao:v.corpo;alvo.unshift(no);return true;}
        l[i]=v;l[i+1]=no;return true;
      }
      if(!a.pai)return false;
      const p=achar(prog,a.pai.id);
      if(a.ramo==='entao'&&a.pai.senao){l.splice(i,1);a.pai.senao.unshift(no);return true;}
      l.splice(i,1);p.lista.splice(p.i+1,0,no);return true;
    }
  }
  const clonar=x=>JSON.parse(JSON.stringify(x));
  /* uma impressão do programa (para saber se as situações foram testadas com o mesmo programa) */
  function assinatura(prog){return JSON.stringify(prog,(k,v)=>k==='id'?undefined:v);}

  /* confere um programa vindo do salvamento: descarta o que não existe neste desafio e refaz os números das placas */
  function limpar(prog,cfg){
    let fixed=false,id=0;const bad=()=>{fixed=true;};
    const vars={};for(const d of cfg.vars||[])vars[d.nome]=d.t;for(const d of cfg.sensores||[])vars[d.nome]=d.t;
    const blocos=cfg.blocos||[];
    const okExpr=e=>{if(e===null)return true;if(!e||typeof e!=='object')return false;
      if(e.k==='lit')return valValido(e.val);if(e.k==='var')return typeof e.nome==='string'&&!!vars[e.nome];
      if(e.k==='op')return OPS_ARIT.indexOf(e.op)>=0&&okExpr(e.a)&&okExpr(e.b);return false;};
    const okCond=c=>c===null||(!!c&&typeof c==='object'&&(c.op===null||OPS_CMP.indexOf(c.op)>=0)&&okExpr(c.a===undefined?null:c.a)&&okExpr(c.b===undefined?null:c.b));
    function lista(l,nv){
      const out=[];if(!Array.isArray(l)){bad();return out;}
      for(const n of l){
        if(!n||typeof n!=='object'){bad();continue;}
        let m=null;
        if(n.k==='cmd'&&blocos.indexOf(n.cmd)>=0)m={k:'cmd',cmd:n.cmd};
        else if(n.k==='set'&&blocos.indexOf('set')>=0&&cfg.vars&&cfg.vars.some(d=>d.nome===n.nome)&&okExpr(n.expr===undefined?null:n.expr))m={k:'set',nome:n.nome,expr:n.expr||null,obj:typeof n.obj==='string'?n.obj:undefined};
        else if(n.k==='se'&&(blocos.indexOf('se')>=0||blocos.indexOf('sese')>=0)&&okCond(n.cond===undefined?null:n.cond)&&nv<LIM.prof)m={k:'se',cond:n.cond||null,entao:lista(n.entao,nv+1),senao:n.senao===null||n.senao===undefined?null:lista(n.senao,nv+1)};
        else if(n.k==='rep'&&blocos.indexOf('rep')>=0&&Number.isInteger(n.n)&&n.n>=0&&n.n<=LIM.rep&&nv<LIM.prof)m={k:'rep',n:n.n,corpo:lista(n.corpo,nv+1)};
        else if(n.k==='enq'&&blocos.indexOf('enq')>=0&&okCond(n.cond===undefined?null:n.cond)&&nv<LIM.prof)m={k:'enq',cond:n.cond||null,corpo:lista(n.corpo,nv+1)};
        if(!m){bad();continue;}
        m.id=++id;out.push(m);
      }
      return out;
    }
    let p=lista(prog,0);
    const maxL=cfg.maxLinhas||LIM.linhas;
    while(p.length&&contarLinhas(p)>maxL){p.pop();bad();}
    if(p.length){id=0;cada(p,n=>{n.id=++id;});}
    return{prog:p,fixed};
  }

  /* ---------- texto de cada linha ---------- */
  function fmtNo(n){
    if(n.k==='cmd')return(CMD[n.cmd]?CMD[n.cmd].nome:n.cmd);
    if(n.k==='set')return n.nome+' = '+fmtExpr(n.expr);
    if(n.k==='se')return'SE '+fmtCond(n.cond)+' ENTÃO';
    if(n.k==='rep')return'REPETIR '+n.n+(n.n===1?' VEZ':' VEZES');
    if(n.k==='enq')return'ENQUANTO '+fmtCond(n.cond);
    return'?';
  }
  function fmtLinha(L){if(L.tipo==='senao')return'SENÃO';if(L.tipo==='fim')return L.no.k==='se'?'FIM SE':L.no.k==='rep'?'FIM REPETIR':'FIM ENQUANTO';return fmtNo(L.no);}
  /* o programa inteiro como texto, com recuo (para o diário e os exemplos) */
  function codigo(prog){return linhas(prog).map(L=>'  '.repeat(L.nv)+fmtLinha(L)).join('\n');}

  /* ---------- interpretador ---------- */
  function iniciar(cfg,mundo,sit,prog){
    const env={};
    for(const d of cfg.vars||[])env[d.nome]={t:d.t,val:d.ini===undefined||d.ini===null?null:d.ini,ro:false,unid:d.unid||''};
    const p=clonar(prog);
    const s={cfg,mundo,sit,prog:p,env,ws:mundo.init(sit,cfg),pilha:[{k:'raiz',lista:p,i:0}],passos:0,fim:false,ok:false,erro:null,aviso:null,ultimo:null};
    sensores(s);return s;
  }
  function sensores(s){const o=s.mundo.sensores?s.mundo.sensores(s.ws,s.cfg):null;if(o)for(const k in o)s.env[k]={t:o[k].t,val:o[k].val,ro:true,unid:o[k].unid||''};}
  function ev(s,e){s.ultimo=e;e.passo=s.passos;return e;}
  function falha(s,erro,linha,extra){s.fim=true;s.erro=Object.assign({},erro,{linha:linha===undefined?null:linha});return ev(s,Object.assign({tipo:'erro',linha:s.erro.linha,erro:s.erro},extra||{}));}
  /* blocos ativos (para mostrar o contador de cada repetição) */
  function contadores(s){return s.pilha.filter(f=>f.k==='rep'||f.k==='enq').map(f=>({id:f.no.id,k:f.k,volta:f.volta,n:f.no.n}));}
  function passo(s){
    if(s.fim)return null;
    if(!s.prog.length)return falha(s,{tipo:'vazio'},null);
    if(s.passos>=(s.cfg.maxPassos||LIM.passos))return falha(s,{tipo:'limitePassos',n:s.passos},null);
    s.passos++;
    /* fecha os blocos que terminaram: o fim de um SE não gasta passo; o fim de uma volta testa a repetição de novo */
    for(;;){
      const f=s.pilha[s.pilha.length-1];
      if(f.i<f.lista.length)break;
      if(f.k==='raiz'){
        const r=s.mundo.fim?s.mundo.fim(s.ws,s):{ok:true};s.fim=true;
        if(r.ok){s.ok=true;return ev(s,{tipo:'fim',ok:true,msg:r.msg||''});}
        s.erro=Object.assign({linha:null},r.erro);return ev(s,{tipo:'fim',ok:false,erro:s.erro});
      }
      if(f.k==='entao'||f.k==='senao'){s.pilha.pop();continue;}
      if(f.k==='rep'){
        if(f.volta<f.no.n){f.volta++;f.i=0;return ev(s,{tipo:'rep',linha:f.no.id,volta:f.volta,n:f.no.n});}
        s.pilha.pop();return ev(s,{tipo:'repFim',linha:f.no.id,n:f.no.n});
      }
      if(f.k==='enq'){
        const c=comparar(f.no.cond,s.env);if(c.erro)return falha(s,c.erro,f.no.id);
        if(!c.res){s.pilha.pop();return ev(s,{tipo:'enq',linha:f.no.id,res:false,volta:f.volta,cmp:c,sai:true});}
        if(f.volta>=(s.cfg.maxVoltas||LIM.voltas))return falha(s,{tipo:'semParada',voltas:f.volta,cond:fmtCond(f.no.cond)},f.no.id);
        f.volta++;f.i=0;return ev(s,{tipo:'enq',linha:f.no.id,res:true,volta:f.volta,cmp:c});
      }
    }
    const f=s.pilha[s.pilha.length-1],no=f.lista[f.i];
    if(no.k==='cmd'){
      const r=s.mundo.cmd(s.ws,no.cmd,s)||{};
      if(r.erro)return falha(s,r.erro,no.id,{cmd:no.cmd,anim:r.anim});
      f.i++;sensores(s);
      const e=Object.assign({tipo:'cmd',linha:no.id,cmd:no.cmd},r);
      if(r.fimOk){s.fim=true;s.ok=true;
        const resto=s.pilha.some(q=>q.i<q.lista.length)||s.pilha.some(q=>q.k==='rep'&&q.volta<q.no.n);
        if(resto)s.aviso='As placas depois de '+(CMD[no.cmd]?CMD[no.cmd].nome:no.cmd)+' não foram executadas: o mecanismo já tinha sido acionado.';
      }
      return ev(s,e);
    }
    if(no.k==='set'){
      const d=s.env[no.nome];
      if(!d)return falha(s,{tipo:'naoExiste',nome:no.nome},no.id);
      if(d.ro)return falha(s,{tipo:'somenteLeitura',nome:no.nome},no.id);
      const r=avaliar(no.expr,s.env);if(r.erro)return falha(s,r.erro,no.id);
      if(r.val.t!==d.t)return falha(s,{tipo:'tipoIncompativel',nome:no.nome,esperado:d.t,val:r.val},no.id);
      const antes=d.val;d.val=r.val;f.i++;
      if(s.mundo.atribuiu)s.mundo.atribuiu(s.ws,no.nome,r.val,s);
      sensores(s);
      return ev(s,{tipo:'set',linha:no.id,nome:no.nome,antes,depois:r.val,conta:no.expr&&no.expr.k==='op'});
    }
    if(no.k==='se'){
      const c=comparar(no.cond,s.env);if(c.erro)return falha(s,c.erro,no.id);
      f.i++;
      if(c.res)s.pilha.push({k:'entao',lista:no.entao,i:0,no});
      else if(no.senao)s.pilha.push({k:'senao',lista:no.senao,i:0,no});
      return ev(s,{tipo:'se',linha:no.id,res:c.res,cmp:c,ramo:c.res?'entao':no.senao?'senao':null});
    }
    if(no.k==='rep'){
      f.i++;
      if(!(no.n>=1))return ev(s,{tipo:'repFim',linha:no.id,n:no.n,zero:true});
      s.pilha.push({k:'rep',lista:no.corpo,i:0,no,volta:1});
      return ev(s,{tipo:'rep',linha:no.id,volta:1,n:no.n});
    }
    if(no.k==='enq'){
      const c=comparar(no.cond,s.env);if(c.erro)return falha(s,c.erro,no.id);
      f.i++;
      if(c.res){s.pilha.push({k:'enq',lista:no.corpo,i:0,no,volta:1});return ev(s,{tipo:'enq',linha:no.id,res:true,volta:1,cmp:c});}
      return ev(s,{tipo:'enq',linha:no.id,res:false,volta:0,cmp:c,sai:true});
    }
    return falha(s,{tipo:'desconhecido'},no.id);
  }
  /* roda tudo com o mesmo passo() (testes e conferência) */
  function executar(cfg,mundo,sit,prog){const s=iniciar(cfg,mundo,sit,prog),eventos=[];let e;while((e=passo(s)))eventos.push(e);return{s,eventos};}

  /* ---------- explicações em linguagem simples ---------- */
  function explicar(s){
    const e=s.erro;if(!e)return s.ok?'':'';
    const n=e.linha?numeroLinha(s.prog,e.linha):0,ln=n?'Linha '+n+': ':'';
    if(e.msg)return ln+e.msg;
    switch(e.tipo){
      case'vazio':return'Coloque pelo menos uma placa no painel antes de executar.';
      case'incompleta':return ln+'esta placa ainda não está completa. Toque nela e escolha o que falta.';
      case'semValor':return ln+'a variável "'+e.nome+'" ainda está vazia. Guarde um valor nela antes de usá-la (por exemplo, '+e.nome+' = …).';
      case'naoExiste':return ln+'não existe um contêiner chamado "'+e.nome+'" aqui.';
      case'somenteLeitura':return ln+'"'+e.nome+'" é um sensor: o programa pode ler o valor dele, mas não guardar outro.';
      case'tipoIncompativel':{const T=TIPOS[e.esperado];return ln+'o contêiner "'+e.nome+'" aceita '+T.nome+' ('+T.py+'), mas o resultado foi '+fmt(e.val)+', que é '+tipoDe(e.val)+'. O jogo não converte um tipo no outro.';}
      case'tipoOp':return ln+'a conta '+fmt(e.a)+' '+e.op+' '+fmt(e.b)+' não existe: soma e subtração só funcionam entre números.';
      case'cmpTipos':return ln+'a comparação junta '+fmt(e.a)+' ('+TIPOS[e.a.t].nome+') e '+fmt(e.b)+' ('+TIPOS[e.b.t].nome+'). São tipos diferentes, e o jogo não converte um no outro.';
      case'cmpOrdem':return ln+'textos e booleanos só podem ser comparados com == ou !=.';
      case'grande':return ln+'o número ficou grande demais para o contêiner.';
      case'semParada':return ln+'a condição "'+e.cond+'" continuou verdadeira por '+e.voltas+' voltas, então a repetição foi interrompida. Alguma placa dentro do ENQUANTO precisa mudar o valor consultado até a condição ficar falsa.';
      case'limitePassos':return'O programa passou de '+e.n+' passos e foi interrompido. Confira se alguma repetição está grande demais.';
      default:return ln+'esta placa não pôde ser executada.';
    }
  }
  /* o que aconteceu em um passo, numa frase curta (painel durante a execução) */
  function narrar(e,s){
    if(!e)return'';
    if(e.tipo==='set')return e.nome+' agora vale '+fmt(e.depois)+(e.antes?' (antes: '+fmt(e.antes)+')':' (estava vazio)')+'.';
    if(e.tipo==='se')return'Teste: '+e.cmp.txt+' → '+fmt(e.cmp.a)+' '+e.cmp.op+' '+fmt(e.cmp.b)+' é '+(e.res?'Verdadeiro':'Falso')+'. '+(e.ramo==='entao'?'Executa o ENTÃO.':e.ramo==='senao'?'Executa o SENÃO.':'Pula o bloco.');
    if(e.tipo==='rep')return'Repetição: volta '+e.volta+' de '+e.n+'.';
    if(e.tipo==='repFim')return e.zero?'REPETIR 0 vezes: o bloco não executa.':'Repetição terminada: '+e.n+(e.n===1?' volta.':' voltas.');
    if(e.tipo==='enq')return'Condição: '+e.cmp.txt+' → '+fmt(e.cmp.a)+' '+e.cmp.op+' '+fmt(e.cmp.b)+' é '+(e.res?'Verdadeiro':'Falso')+'. '+(e.res?'Volta '+e.volta+'.':(e.volta===0?'O bloco não executa nenhuma vez.':'A repetição para depois de '+e.volta+(e.volta===1?' volta.':' voltas.')));
    if(e.tipo==='cmd')return e.msg||((CMD[e.cmd]?CMD[e.cmd].nome:e.cmd)+'.');
    if(e.tipo==='fim')return e.ok?(e.msg||'Programa concluído.'):'';
    return'';
  }

  return{TIPOS,OPS_CMP,OPS_ARIT,OP_NOME,LIM,CMD,val,valValido,fmt,fmtDec,tipoDe,fmtExpr,fmtCond,avaliar,comparar,compativel,
    filhos,cada,novoId,linhas,contarLinhas,profundidade,numeroLinha,achar,listaDe,nivelDe,inserir,remover,mover,clonar,assinatura,limpar,
    fmtNo,fmtLinha,codigo,iniciar,passo,executar,contadores,explicar,narrar};
})();
