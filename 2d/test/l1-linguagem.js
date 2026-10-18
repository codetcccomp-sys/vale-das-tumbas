// Testes de lógica (sem navegador): tipos, atribuição, comparação, if/elif/else, for/while, limites, edição por toques,
// leitura de código escrito (com erros explicados), equivalência Executar × Passo e as soluções de todos os desafios.
const {carregar,comLimite}=require('./vmload');
const {suite}=require('./assert');
const t=suite('l1-linguagem');
const X=carregar(['02-lang.js','03-learn.js']);
const {LANG,DESAFIO,DESAFIOS,MUNDOS,OBJ,rodarTodas,situacoesOk,guiaDe,novoNo,desafiosDa}=X;
const L=LANG.val;
const lit=v=>({k:'lit',val:v}),vr=n=>({k:'var',nome:n}),cmd=c=>({k:'cmd',cmd:c});
const se=(a,op,b,entao,senao,elifs)=>{const n={k:'se',cond:{a,op,b},entao,senao:senao===undefined?null:senao};if(elifs)n.elifs=elifs.map(([a2,op2,b2,corpo])=>({k:'elif',cond:{a:a2,op:op2,b:b2},corpo}));return n;};
const rep=(n,corpo,v)=>({k:'rep',n,var:v||'i',corpo}),enq=(a,op,b,corpo)=>({k:'enq',cond:{a,op,b},corpo});
const set=(nome,expr)=>({k:'set',nome,expr});
const ids=p=>LANG.renumerar(p);
const env=o=>{const e={};for(const k in o)e[k]={t:o[k]?o[k].t:'int',val:o[k],ro:false};return e;};
const E=s=>LANG.explicarErro(s);

/* ---------- valores e tipos ---------- */
t.ok(LANG.fmt(L('int',5))==='5'&&LANG.fmt(L('str','5'))==='"5"','5 e "5" aparecem diferentes',[LANG.fmt(L('int',5)),LANG.fmt(L('str','5'))]);
t.ok(LANG.fmt(L('float',5))==='5.0'&&LANG.fmt(L('float',3.14))==='3.14','decimal sempre com ponto',[LANG.fmt(L('float',5)),LANG.fmt(L('float',3.14))]);
t.ok(LANG.fmt(L('bool',true))==='True'&&LANG.fmt(L('bool',false))==='False'&&LANG.fmt(null)==='vazio','True, False e vazio');
t.ok(LANG.fmt(L('float',0.1+0.2))==='0.3','decimal aproximado mostrado com até 4 casas',LANG.fmt(L('float',0.1+0.2)));
t.ok(['int','float','str','bool'].map(LANG.rotulo).join('|')==='int (inteiro)|float (decimal)|str (texto, a string)|bool (booleano)','os quatro tipos com os nomes do Python (int, float, str, bool) e em português');
t.ok(!LANG.valValido(L('int',2.5))&&!LANG.valValido(L('str','a"b'))&&!LANG.valValido(L('float',Infinity))&&!LANG.valValido({t:'x',v:1})&&LANG.valValido(L('bool',false)),'valores inválidos recusados');
{const m=LANG.compativel('int',L('str','5'));t.ok(/máquina recusou/.test(m)&&/só aceita int/.test(m)&&/"5" é um texto \(str\)/.test(m)&&/Em Python a atribuição seria permitida/.test(m)&&LANG.compativel('int',L('int',5))===null,'contêiner int recusa "5": mostra o valor recebido, o tipo exigido e que a regra é da máquina, não do Python',m);}
t.ok(/5\.0/.test(LANG.compativel('float',L('int',5))),'variável de decimal recusa 5 e sugere 5.0');
t.ok(/sem aspas/.test(LANG.compativel('bool',L('str','True')))&&/disponível/.test(LANG.compativel('bool',L('str','True'))),'"True" com aspas é texto, não booleano');

/* ---------- expressões e condições ---------- */
const e1=env({a:L('int',5),b:L('float',2.5),s:L('str','5'),v:null,f:L('bool',false)});
t.ok(LANG.avaliar({k:'op',op:'+',a:vr('a'),b:lit(L('int',3))},e1).val.v===8,'soma explícita de inteiros');
const r2=LANG.avaliar({k:'op',op:'+',a:vr('a'),b:vr('b')},e1).val;t.ok(r2.t==='float'&&r2.v===7.5,'inteiro + decimal dá decimal',r2);
t.ok(LANG.avaliar({k:'op',op:'+',a:vr('s'),b:lit(L('int',1))},e1).erro.tipo==='tipoOp','texto + número é erro (sem conversão)');
t.ok(LANG.avaliar(vr('v'),e1).erro.tipo==='semValor','ler variável vazia é erro');
{const c=LANG.comparar({a:vr('s'),op:'==',b:lit(L('int',5))},e1),d=LANG.comparar({a:vr('s'),op:'!=',b:lit(L('int',5))},e1);
  t.ok(c.res===false&&c.misto&&d.res===true,'como no Python: "5" == 5 é False e "5" != 5 é True (com aviso de tipos misturados)',[c,d]);}
t.ok(LANG.comparar({a:vr('a'),op:'==',b:lit(L('int',5))},e1).res===true&&LANG.comparar({a:vr('a'),op:'<',b:lit(L('int',5))},e1).res===false,'comparações numéricas');
t.ok(LANG.comparar({a:vr('f'),op:'==',b:lit(L('bool',false))},e1).res===true,'False == False é True');
t.ok(LANG.comparar({a:vr('s'),op:'<',b:lit(L('str','6'))},e1).res===true&&LANG.comparar({a:lit(L('str','abrir')),op:'<',b:lit(L('str','ABRIR'))},e1).res===false,'como no Python: textos se comparam em ordem alfabética ("5" < "6")');
t.ok(LANG.comparar({a:vr('s'),op:'<',b:lit(L('int',6))},e1).erro.tipo==='cmpOrdem','como no Python: < entre texto e número é TypeError');
t.ok(LANG.comparar({a:vr('f'),op:'==',b:lit(L('int',0))},e1).res===true&&LANG.comparar({a:lit(L('bool',true)),op:'>',b:lit(L('int',0))},e1).res===true,'como no Python: False == 0 e True > 0 (bool vale 0 e 1)');
t.ok(LANG.comparar({a:vr('f'),op:'bool'},e1).res===false&&LANG.comparar({a:vr('f'),op:'not'},e1).res===true,'condição booleana: f e not f');
t.ok(LANG.comparar({a:vr('a'),op:'bool'},e1).res===true&&LANG.comparar({a:lit(L('int',0)),op:'bool'},e1).res===false&&LANG.comparar({a:lit(L('str','')),op:'not'},e1).res===true,'como no Python: if 5 é True, if 0 é False, not "" é True');
{const s=LANG.iniciar({vars:[{nome:'s',t:'str',ini:L('str','5')}]},{init:()=>({}),fim:()=>({ok:true})},{},LANG.renumerar([{k:'se',cond:{a:vr('s'),op:'==',b:lit(L('int',5))},entao:[],senao:null}]));const ev=LANG.passo(s);
  t.ok(ev.res===false&&/nunca são iguais/.test(LANG.narrar(ev,s))&&/nunca são iguais/.test(s.aviso||''),'comparar texto com número avisa que em Python eles nunca são iguais',[LANG.narrar(ev,s),s.aviso]);}
t.ok(LANG.fmtCond({a:vr('f'),op:'not'})==='not f'&&LANG.fmtCond({a:vr('f'),op:'bool'})==='f'&&LANG.fmtCond({a:vr('a'),op:'>=',b:lit(L('int',5))})==='a >= 5','condições escritas como em Python');

/* ---------- interpretador com um mundo de teste ---------- */
Object.assign(LANG.CMD,{dec:{py:'diminuir'},boom:{py:'explodir'},nada:{py:'esperar'},liga:{py:'ligar'}});
const M={init:s=>({n:s.n,acoes:[]}),sensores:w=>({n:{t:'int',val:L('int',w.n)}}),cmd:(w,c)=>{w.acoes.push(c);if(c==='dec')w.n--;if(c==='boom')return{erro:{tipo:'boom',msg:'explodiu'}};return{};},fim:()=>({ok:true})};
const cfg={vars:[{nome:'x',t:'int'},{nome:'txt',t:'str'},{nome:'ok',t:'bool'}],sensores:[{nome:'n',t:'int'}],blocos:['set','se','sese','elif','rep','enq','dec','boom','nada','liga'],maxLinhas:40};
let r=LANG.executar(cfg,M,{n:3},ids([enq(vr('n'),'>',lit(L('int',0)),[cmd('dec')])]));
t.ok(r.s.ok&&r.s.ws.acoes.length===3,'while executa enquanto True e para',r.s.ws.acoes.length);
r=LANG.executar(cfg,M,{n:0},ids([enq(vr('n'),'>',lit(L('int',0)),[cmd('dec')])]));
t.ok(r.s.ok&&r.s.ws.acoes.length===0&&r.eventos[0].tipo==='enq'&&r.eventos[0].res===false,'while com condição falsa executa nenhuma vez');
r=LANG.executar(cfg,M,{n:1},ids([enq(vr('n'),'>',lit(L('int',0)),[cmd('dec')])]));
t.ok(r.s.ok&&r.s.ws.acoes.length===1,'while executa uma vez');
let t0=Date.now();r=comLimite(null,()=>LANG.executar(cfg,M,{n:3},ids([enq(vr('n'),'>',lit(L('int',0)),[cmd('nada')])])),3000);
t.ok(!r.s.ok&&r.s.erro.tipo==='semParada'&&Date.now()-t0<3000,'while sem parada é interrompido pelo limite de voltas, sem travar',{erro:r.s.erro.tipo,ms:Date.now()-t0});
t.ok(/não parou/.test(E(r.s).titulo)&&/continuou verdadeira/.test(E(r.s).texto),'explica a condição de parada não atingida',E(r.s));
r=comLimite(null,()=>LANG.executar(cfg,M,{n:3},ids([rep(20,[rep(20,[rep(20,[cmd('nada')],'k')],'j')])])),3000);
t.ok(!r.s.ok&&r.s.erro.tipo==='limitePassos','repetições enormes param no limite de passos',r.s.erro.tipo);
r=LANG.executar(cfg,M,{n:3},ids([rep(3,[cmd('nada')])]));
t.ok(r.s.ok&&r.eventos.filter(e=>e.tipo==='rep').map(e=>e.volta).join()==='1,2,3'&&r.s.ws.acoes.length===3,'for mostra o contador 1, 2, 3');
r=LANG.executar(cfg,M,{n:3},ids([rep(3,[se(vr('i'),'==',lit(L('int',1)),[cmd('liga')])])]));
t.ok(r.s.ok&&r.s.ws.acoes.join()==='liga'&&r.s.env.i.val.v===2,'a variável do for vale 0, 1, 2 (range(3)) e pode ser lida',r.s.ws.acoes);
r=LANG.executar(cfg,M,{n:3},ids([rep(2,[set('i',lit(L('int',5)))])]));
t.ok(r.s.erro&&r.s.erro.tipo==='variavelFor','guardar na variável do for é recusado',r.s.erro);
r=LANG.executar(cfg,M,{n:3},ids([rep(0,[cmd('nada')])]));
t.ok(r.s.ok&&r.s.ws.acoes.length===0,'range(0) não executa o bloco');
r=LANG.executar(cfg,M,{n:3},ids([set('x',lit(L('str','5')))]));
{const x=E(r.s);t.ok(r.s.erro.tipo==='tipoIncompativel'&&x.cat==='maquina'&&/x só aceita int \(inteiro\)/.test(x.titulo)&&/"5", que é um texto \(str\)/.test(x.texto)&&/Em Python, x = "5" seria permitido/.test(x.texto)&&x.guia==='int'&&!/TypeError/.test(x.titulo),'texto no contêiner int: regra da máquina (não TypeError do Python), com valor recebido e tipo exigido',x);}
{const c={vars:[{nome:'x',t:'int'}],blocos:['set']};const q=LANG.ler('x = "5"',c);const r3=LANG.executar(c,{init:()=>({}),fim:()=>({ok:true})},{},q.prog);
  t.ok(!q.erro&&r3.s.erro.tipo==='tipoIncompativel','x = "5" é Python válido: o texto é lido; quem recusa é a máquina, ao executar',q.erro);}
r=LANG.executar(cfg,M,{n:3},ids([set('n',lit(L('int',1)))]));
t.ok(r.s.erro.tipo==='somenteLeitura','sensor não aceita atribuição');
r=LANG.executar(cfg,M,{n:3},ids([cmd('nada'),set('x',{k:'op',op:'+',a:vr('x'),b:lit(L('int',1))})]));
t.ok(r.s.erro.tipo==='semValor'&&E(r.s).linha===2&&/NameError/.test(E(r.s).titulo)&&E(r.s).cat==='python','x = x + 1 com x vazio: NameError (erro de Python) na linha 2',E(r.s));
r=LANG.executar(cfg,M,{n:3},ids([set('x',lit(L('int',1))),set('x',{k:'op',op:'+',a:vr('x'),b:lit(L('int',4))})]));
t.ok(r.s.ok&&r.s.env.x.val.v===5&&r.eventos[1].antes.v===1,'reatribuição troca o conteúdo (1 → 5)');
r=LANG.executar(cfg,M,{n:7},ids([se(vr('n'),'>=',lit(L('int',5)),[cmd('nada')],[cmd('dec')])]));
t.ok(r.s.ok&&r.eventos[0].res===true&&r.s.ws.acoes.join()==='nada','if verdadeiro segue o bloco do if');
r=LANG.executar(cfg,M,{n:3},ids([se(vr('n'),'>=',lit(L('int',5)),[cmd('nada')],[cmd('dec')])]));
t.ok(r.s.ok&&r.eventos[0].res===false&&r.s.ws.acoes.join()==='dec','if falso segue o else');
/* if / elif / elif / else: só o primeiro caminho verdadeiro; cada condição testada é um passo */
const cadeia=()=>ids([se(vr('n'),'>=',lit(L('int',80)),[cmd('boom')],[cmd('nada')],[[vr('n'),'>=',lit(L('int',50)),[cmd('dec')]],[vr('n'),'>=',lit(L('int',20)),[cmd('liga')]]])]);
const caminho=n=>{const x=LANG.executar(cfg,M,{n},cadeia());return{ac:x.s.ws.acoes.join(),testes:x.eventos.filter(e=>e.tipo==='se').length,ok:x.s.ok};};
t.ok(caminho(60).ac==='dec'&&caminho(60).testes===2&&caminho(30).ac==='liga'&&caminho(30).testes===3&&caminho(5).ac==='nada'&&caminho(5).testes===3&&caminho(90).testes===1,'if/elif/else: testa de cima para baixo e executa só o primeiro caminho verdadeiro',[caminho(60),caminho(30),caminho(5)]);
r=LANG.executar(cfg,M,{n:30},cadeia());t.ok(r.eventos[1].elif&&r.eventos[1].linha===LANG.elifsDe(r.s.prog[0])[0].id&&LANG.numeroLinha(r.s.prog,r.eventos[2].linha)===5,'cada elif tem a própria linha (para marcar no painel)',r.eventos.map(e=>e.linha));
r=LANG.executar(cfg,M,{n:3},ids([cmd('nada'),cmd('boom'),cmd('nada')]));
t.ok(!r.s.ok&&r.s.erro.linha===2&&r.s.ws.acoes.length===2&&E(r.s).cat==='mecanismo','erro do mundo para na linha responsável (o mecanismo não conseguiu)',E(r.s));
{const Mf={init:()=>({}),cmd:()=>({}),fim:()=>({ok:false,erro:{tipo:'x',titulo:'Faltou chegar.',msg:'o autômato parou antes.'}})};const rf=LANG.executar(cfg,Mf,{},ids([cmd('nada')]));
  t.ok(E(rf.s).cat==='objetivo'&&!E(rf.s).linha,'programa que roda até o fim sem resolver: "objetivo ainda não alcançado", sem culpar uma linha',E(rf.s));}
r=LANG.executar(cfg,M,{n:3},[]);t.ok(r.s.erro.tipo==='vazio','programa vazio explica o que fazer');
r=LANG.executar(cfg,M,{n:3},ids([set('x',null)]));t.ok(r.s.erro.tipo==='incompleta','linha incompleta é explicada');

/* ---------- Executar × Passo: o mesmo passo() com pausas no meio dá a mesma sequência ---------- */
{const p=ids([set('x',lit(L('int',2))),rep(2,[se(vr('n'),'>',lit(L('int',1)),[cmd('dec')],[cmd('nada')],[[vr('n'),'==',lit(L('int',1)),[cmd('liga')]]])]),enq(vr('n'),'>',lit(L('int',0)),[cmd('dec')])]);
  const a=LANG.executar(cfg,M,{n:3},p);
  const s=LANG.iniciar(cfg,M,{n:3},p),evs=[];let e;while((e=LANG.passo(s))){evs.push(e);JSON.stringify(s.env);}
  t.ok(JSON.stringify(a.eventos)===JSON.stringify(evs)&&JSON.stringify(a.s.ws)===JSON.stringify(s.ws),'Executar e Passo produzem os mesmos eventos e o mesmo mundo',evs.length);}

/* ---------- fim do Passo a passo: depois da última instrução visível só falta conferir o resultado ---------- */
{const s=LANG.iniciar(cfg,M,{n:3},ids([cmd('nada')]));t.ok(!LANG.soFaltaFim(s),'antes de executar, ainda há instrução');LANG.passo(s);
  t.ok(LANG.soFaltaFim(s)&&!s.fim,'programa de uma linha: depois dela só falta conferir (o painel faz isso no mesmo toque)');
  const s2=LANG.iniciar(cfg,M,{n:3},ids([rep(2,[cmd('nada')])]));const seq=[];let e;while(!s2.fim){e=LANG.passo(s2);seq.push(e.tipo+(LANG.soFaltaFim(s2)?'*':''));}
  t.ok(seq.join()==='rep,cmd,rep,cmd,repFim*,fim','no for, o fim da volta aparece como passo e só depois dele falta conferir',seq.join());
  const s3=LANG.iniciar(cfg,M,{n:7},ids([se(vr('n'),'>=',lit(L('int',5)),[cmd('nada')],[cmd('dec')])]));const q=[];while(!s3.fim){e=LANG.passo(s3);q.push(e.tipo+(LANG.soFaltaFim(s3)?'*':''));}
  t.ok(q.join()==='se,cmd*,fim','no if, o fim do bloco não gasta passo: depois da última instrução só falta conferir',q.join());}

/* ---------- como o código aparece ---------- */
{const p=ids([set('x',lit(L('int',0))),rep(4,[cmd('liga')]),se(vr('n'),'>=',lit(L('int',80)),[cmd('dec')],[cmd('nada')],[[vr('n'),'>=',lit(L('int',50)),[cmd('liga')]]]),enq({k:'var',nome:'ok'},'not',null,[set('ok',lit(L('bool',true)))])]);
  const c=LANG.codigo(p);
  t.ok(c==='x = 0\nfor i in range(4):\n    ligar()\nif n >= 80:\n    diminuir()\nelif n >= 50:\n    ligar()\nelse:\n    esperar()\nwhile not ok:\n    ok = True','o programa aparece como código Python (recuo de 4 espaços)',c);
  const telas=LANG.linhas(p).map(LANG.fmtLinha);t.ok(telas.indexOf('# fim do for')>=0&&telas.indexOf('# fim do if')>=0,'na tela, um comentário marca o fim de cada bloco',telas);
  t.ok(LANG.contarLinhas(p)===11&&LANG.numeroLinha(p,p[3].id)===10,'o comentário de fim não conta como linha',[LANG.contarLinhas(p),LANG.numeroLinha(p,p[3].id)]);
  const lido=LANG.ler(c,cfg);t.ok(!lido.erro&&LANG.assinatura(lido.prog)===LANG.assinatura(p),'o mesmo texto lido de volta dá o mesmo programa',lido.erro);}

/* ---------- leitura de código escrito: erros explicados ---------- */
{const ERRS=[
  ['avancar_x()','NameError',1],['diminuir','parênteses',1],['if n > 1\n    ligar()','dois-pontos',1],['  ligar()','IndentationError',1],['for i in range(2):\nligar()','vazio',1],
  ['x = "5','aspas',1],['x = 0,75','vírgula',1],['ok = true','maiúscula',1],['else:\n    ligar()','else sem if',1],['n = 3','sensor',1],['ligar(3)','não recebe',1],['If n > 1:\n    ligar()','minúsculas',1],
  ['x == 5','== compara',1],['if x = 5:\n    ligar()','= dentro da condição',1],['while x < 3:\n    ligar()\n  ligar()','IndentationError',3],['y = 2','não é uma variável desta sala',1],['se n > 1:\n    ligar()','inglês',1],
  ['if n > 1:\n    ligar()\nelse:\n    ligar()\nelif n > 2:\n    ligar()','elif depois do else',5],['for i in range(2, 5):\n    ligar()','range',1],['for x in range(2):\n    ligar()','não pode usar',1],['if n and ok:\n    ligar()','and e or',1]];
  const falhas=[];for(const[src,txt,ln]of ERRS){const q=LANG.ler(src,cfg);const m=q.erro&&(q.erro.titulo+' '+q.erro.texto);if(!q.erro||q.erro.linha!==ln||m.indexOf(txt)<0)falhas.push([src,q.erro&&q.erro.linha,m]);}
  t.ok(!falhas.length,'código escrito com erro: '+ERRS.length+' erros comuns explicados na linha certa',falhas);
  /* de onde vem cada erro: do Python, do pedaço que o editor aceita, de uma regra da máquina ou uma linha sem efeito */
  const CATS=[['avancar_x()','python'],['if n > 1\n    ligar()','python'],['  ligar()','python'],['ok = true','python'],['ligar(3)','python'],['if x = 5:\n    ligar()','python'],
    ['print("oi")','subconjunto'],['if n and ok:\n    ligar()','subconjunto'],['for i in range(2, 5):\n    ligar()','subconjunto'],['x = 2 * 3','subconjunto'],['def f():\n    ligar()','subconjunto'],['x = 0,75','subconjunto'],['if 1 < n < 5:\n    ligar()','subconjunto'],
    ['n = 3','maquina'],['y = 2','maquina'],['for x in range(2):\n    ligar()','maquina'],['x == 5','semEfeito'],['diminuir','semEfeito'],['x','semEfeito']];
  const cf=[];for(const[src,cat]of CATS){const q=LANG.ler(src,cfg);if(!q.erro||q.erro.cat!==cat||!LANG.CAT[cat])cf.push([src,q.erro&&q.erro.cat,cat,q.erro&&q.erro.titulo]);}
  t.ok(!cf.length,'cada erro escrito diz de onde vem: Python, o que o editor não tem, regra da máquina ou linha sem efeito ('+CATS.length+' casos)',cf);
  {const q=LANG.ler('y = 2',cfg);t.ok(/Em Python, y = … criaria uma variável nova/.test(q.erro.texto),'y = 2 com nome novo: explica que o Python criaria a variável e que a regra é do jogo',q.erro);}
  {const q=LANG.ler('print("oi")',cfg);t.ok(/print\(\) existe no Python/.test(q.erro.titulo)&&q.erro.guia==='editor','print() existe no Python, mas não neste editor (e o Guia abre em "O que o editor aceita")',q.erro);}
  {const q=LANG.ler('x = 0,75',cfg);t.ok(/tupla/.test(q.erro.texto)&&/0\.75/.test(q.erro.texto),'0,75: explica que em Python a vírgula separa valores e sugere 0.75',q.erro);}
  {const q=LANG.ler('if n:\n    ligar()',cfg);t.ok(!q.erro,'if n: (um número como condição) é Python válido',q.erro);}
  t.ok(/pedaço do Python/.test(LANG.SUBCONJUNTO)&&/print/.test(LANG.SUBCONJUNTO),'uma frase diz qual pedaço do Python o editor aceita',LANG.SUBCONJUNTO);
  const semElif={vars:cfg.vars,sensores:cfg.sensores,blocos:['se','liga','nada']};
  const q=LANG.ler('if n > 1:\n    ligar()\nelif n > 0:\n    esperar()',semElif);t.ok(q.erro&&/elif existe no Python, mas esta etapa não usa/.test(q.erro.titulo)&&q.erro.cat==='subconjunto','estrutura que a etapa ainda não usa é recusada com explicação',q.erro);
  const q2=LANG.ler('# comentário\nx = 5  # guarda 5\n\nligar()',cfg);t.ok(!q2.erro&&q2.prog.length===2,'comentários e linhas vazias são ignorados',q2.erro);
  const q3=LANG.ler('ligar()\nligar()\nligar()',{blocos:['liga'],maxLinhas:2});t.ok(q3.erro&&/aceita 2/.test(q3.erro.titulo),'limite de linhas também no código escrito',q3.erro);}

/* ---------- edição por toques ---------- */
{const p=[];let c={pai:null,ramo:null,i:0};
  c=LANG.inserir(p,c,{k:'cmd',cmd:'a'});c=LANG.inserir(p,c,{k:'rep',n:2,var:'i',corpo:[]});c=LANG.inserir(p,c,{k:'cmd',cmd:'b'});
  t.ok(LANG.contarLinhas(p)===3&&p[1].corpo[0].cmd==='b','inserir: depois de um bloco o cursor entra nele',LANG.codigo(p));
  const idb=p[1].corpo[0].id;LANG.mover(p,idb,-1);t.ok(p[1].cmd==='b'&&p[2].k==='rep','mover para cima sai do bloco');
  LANG.mover(p,idb,1);t.ok(p[1].corpo[0]&&p[1].corpo[0].id===idb,'mover para baixo entra no bloco vizinho');
  LANG.mover(p,p[0].id,1);t.ok(p[0].k==='rep'&&p[0].corpo[0].cmd==='a','mover uma linha para dentro de um bloco');
  LANG.remover(p,p[0].id);t.ok(p.length===0,'remover um bloco remove o que está dentro');
  const lim=[];let cc={pai:null,ramo:null,i:0};let res;for(let i=0;i<5;i++)res=LANG.inserir(lim,cc,{k:'cmd',cmd:'a'},{linhas:4});
  t.ok(typeof res==='string'&&lim.length===4,'limite de linhas do painel respeitado',res);
  const fundo=[];let cf={pai:null,ramo:null,i:0};for(let i=0;i<4;i++){const r3=LANG.inserir(fundo,cf,{k:'rep',n:2,var:'i',corpo:[]},{prof:3});if(typeof r3==='string'){res=r3;break;}cf=r3;}
  t.ok(LANG.profundidade(fundo)===3&&typeof res==='string','no máximo 3 blocos um dentro do outro',LANG.profundidade(fundo));}
/* elif e else por toques: acrescentar, andar entre os ramos e remover */
{const p=[];let c={pai:null,ramo:null,i:0};c=LANG.inserir(p,c,{k:'se',cond:null,entao:[],senao:null});c=LANG.inserir(p,c,{k:'cmd',cmd:'a'});
  const seId=p[0].id;let c2=LANG.adicionarElif(p,seId,null);LANG.inserir(p,c2,{k:'cmd',cmd:'b'});const c3=LANG.alternarSenao(p,seId);LANG.inserir(p,c3,{k:'cmd',cmd:'c'});
  const txt=LANG.linhas(p).map(LANG.fmtLinha).filter(x=>x[0]!=='#').join(' | ');
  t.ok(txt==='if ?: | a() | elif ?: | b() | else: | c()','elif e else entram no if certo',txt);
  const idb=p[0].elifs[0].corpo[0].id;LANG.mover(p,idb,-1);t.ok(p[0].entao.length===2&&p[0].elifs[0].corpo.length===0,'subir no começo do elif leva a linha para o fim do if');
  LANG.mover(p,idb,1);t.ok(p[0].elifs[0].corpo.length===1,'descer no fim do if leva a linha para o elif');
  const idc=p[0].senao[0].id;LANG.mover(p,idc,-1);t.ok(p[0].elifs[0].corpo.length===2&&p[0].senao.length===0,'subir no começo do else leva para o elif');
  LANG.remover(p,p[0].elifs[0].id);t.ok(!p[0].elifs.length&&LANG.contarLinhas(p)===3,'remover o elif remove o ramo inteiro',LANG.codigo(p));
  LANG.alternarSenao(p,seId);t.ok(p[0].senao===null,'tirar o else');}
{const lixo=[{k:'cmd',cmd:'fwd'},{k:'cmd',cmd:'xxx'},null,{k:'rep',n:999,corpo:[]},{k:'set',nome:'naoexiste',expr:null},{k:'se',cond:{a:{k:'var',nome:'energia'},op:'>=',b:{k:'lit',val:L('int',5)}},entao:[{k:'cmd',cmd:'abrir'}],senao:[]},{k:'rep',n:2,var:'Bad Name',corpo:[]}];
  const c={blocos:['fwd','se','abrir'],sensores:[{nome:'energia',t:'int'}],vars:[]};const r3=LANG.limpar(lixo,c);
  t.ok(r3.fixed&&r3.prog.length===2&&r3.prog[1].entao[0].cmd==='abrir','programa salvo estragado é limpo sem perder o que vale',LANG.codigo(r3.prog));
  const c4={blocos:['se','sese','abrir'],sensores:[{nome:'energia',t:'int'}]};const r4=LANG.limpar([{k:'se',cond:null,entao:[],senao:null,elifs:[{k:'elif',cond:null,corpo:[]}]}],c4);
  t.ok(r4.fixed&&!r4.prog[0].elifs,'elif salvo numa etapa sem elif é descartado');}

/* ---------- soluções de cada desafio ---------- */
const SOL={
  t1:[cmd('tocha')],
  t2:[cmd('destravar'),cmd('erguer')],
  s1:[cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('act')],
  s3:[cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('fwd'),cmd('act')],
  s2:[cmd('fwd'),cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('fwd'),cmd('act')],
  d1:[set('energia',lit(L('bool',true))),set('combustivel',lit(L('float',2.5))),set('pecas',lit(L('int',5))),set('senha',lit(L('str','ABRIR')))],
  d2:[set('quantidade',lit(L('int',5)))],
  d3:[set('quantidade',lit(L('int',5))),cmd('separar')],
  d4:[set('quantidade',lit(L('int',5))),cmd('separar'),set('quantidade',{k:'op',op:'+',a:vr('quantidade'),b:lit(L('int',3))}),cmd('separar')],
  d5:[set('carga',lit(L('int',12))),set('oleo',lit(L('float',0.75))),set('codigo',lit(L('str','MOTOR'))),set('freio',lit(L('bool',false))),cmd('mc')],
  d6:[set('energia',lit(L('bool',true))),set('combustivel',lit(L('float',2.5))),cmd('abastecer'),set('combustivel',{k:'op',op:'+',a:vr('combustivel'),b:lit(L('float',1.5))}),cmd('abastecer')],
  a1:[se(vr('energia'),'>=',lit(L('int',5)),[cmd('abrir')],[cmd('carregar')])],
  a2:[set('limite',lit(L('int',4))),se(vr('nivel'),'<',vr('limite'),[cmd('portao')],[cmd('drenar')])],
  a3:[se(vr('temperatura'),'>=',lit(L('int',80)),[cmd('resfriar')],[cmd('manter')],[[vr('temperatura'),'>=',lit(L('int',50)),[cmd('ventilar')]]])],
  a4:[se(vr('temperatura'),'>=',lit(L('int',80)),[cmd('resfriar')],[cmd('manter')],[[vr('temperatura'),'>=',lit(L('int',50)),[cmd('ventilar')]]])],
  b0:[rep(4,[cmd('tocha')])],
  b1:[rep(4,[cmd('irrigar'),cmd('avancar')])],
  b2:[rep(3,[cmd('irrigar'),cmd('avancar'),cmd('avancar')])],
  b3:[enq(vr('umidade'),'<',lit(L('int',3)),[cmd('irrigar')])],
  b4:[rep(4,[enq(vr('umidade'),'<',lit(L('int',3)),[cmd('irrigar')]),cmd('avancar')])],
  c1:[set('regadas',lit(L('int',0))),rep(5,[se(vr('solo'),'==',lit(L('str','seco')),[cmd('irrigar'),set('regadas',{k:'op',op:'+',a:vr('regadas'),b:lit(L('int',1))})]),cmd('avancar')]),cmd('acender')]
};
/* soluções alternativas válidas também passam (o jogo confere o resultado, não uma resposta única) */
{const alt={d6:[set('energia',lit(L('bool',true))),set('combustivel',lit(L('float',2.5))),cmd('abastecer'),set('combustivel',lit(L('float',4))),cmd('abastecer')],
  t2:[cmd('destravar'),cmd('destravar'),cmd('erguer')],s1:[cmd('right'),cmd('right'),cmd('right'),cmd('right'),cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('act')]};
  const ruins=[];for(const id in alt){const res=rodarTodas(DESAFIO[id],ids(alt[id]));if(!res.every(x=>x.ok))ruins.push([id,res.map(x=>LANG.explicar(x.s))]);}
  t.ok(!ruins.length,'soluções alternativas que cumprem as regras também são aceitas (d6 com 4.0 direto, t2, s1 girando)',ruins);}
{const r=rodarTodas(DESAFIO.d6,ids([set('energia',lit(L('bool',false))),set('combustivel',lit(L('float',2.5))),cmd('abastecer')]))[0];
  t.ok(!r.ok&&r.s.erro.tipo==='semEnergia'&&E(r.s).cat==='mecanismo','bomba com energia False não liga (o mecanismo não conseguiu)',E(r.s));
  const r2=rodarTodas(DESAFIO.d6,ids([set('energia',lit(L('bool',true))),set('combustivel',lit(L('float',2.5))),cmd('abastecer'),cmd('abastecer')]))[0];
  t.ok(!r2.ok&&r2.s.erro.tipo==='tanqueErrado'&&/combustivel no momento/.test(E(r2.s).texto),'sem alterar combustivel, o segundo tanque recebe 2.5 L: o erro explica que a máquina lê a variável na hora',E(r2.s));}
{const d=DESAFIO.bd;t.ok(d&&d.etapa==='demo'&&d.demo.length===2&&d.demo.every(x=>{const r=LANG.executar(d,MUNDOS[d.mundo],d.situacoes[0],x.prog);return r.s.ok&&r.s.ws.acesas===4;})&&LANG.contarLinhas(d.demo[1].prog)===2&&LANG.contarLinhas(d.demo[0].prog)===4,'Tumba Viva: demonstração com e sem for acende as mesmas 4 tochas (4 linhas × 2 linhas)');}
{const ruins=['t2','s3','d5','a4','b2'].filter(id=>{const p=DESAFIO[id].previsao;return!p||!p.pergunta||p.opcoes.length<2||!p.opcoes.some(o=>o.ok)||!p.opcoes.some(o=>!o.ok);});
  t.ok(!ruins.length,'as etapas com código pronto pedem uma previsão antes de executar (com uma resposta certa e uma errada)',ruins);}
/* cada tumba tem demonstração, prática guiada e um desafio independente (aplicação) */
{const falta=['steam','diesel','atom','bio'].filter(k=>{const e=desafiosDa(k).map(d=>d.etapa);return!(e.indexOf('demo')>=0&&e.indexOf('guiada')>=0&&e.indexOf('aplicacao')>=0);});
  t.ok(!falta.length,'as quatro tumbas têm demonstração, prática guiada e aplicação independente',falta);}
const semSol=DESAFIOS.filter(d=>d.etapa!=='demo'&&!SOL[d.id]).map(d=>d.id);t.ok(!semSol.length,'toda etapa jogável tem solução conferida',semSol);
for(const id in SOL){
  const cfgD=DESAFIO[id],p=ids(SOL[id]);
  const lin=LANG.contarLinhas(p);
  const res=rodarTodas(cfgD,p),passou={};res.forEach(x=>{if(x.ok)passou[x.sit]=LANG.assinatura(p);});
  t.ok(res.every(x=>x.ok)&&situacoesOk(cfgD,passou,p)&&lin<=(cfgD.maxLinhas||40),'solução de '+id+' passa em todas as situações ('+res.length+') e cabe no painel',{linhas:lin,max:cfgD.maxLinhas,erros:res.filter(x=>!x.ok).map(x=>LANG.explicar(x.s))});
  /* a limpeza do salvamento não muda uma solução válida, e o código escrito dela é lido de volta igual */
  const lp=LANG.limpar(JSON.parse(JSON.stringify(p)),cfgD);t.ok(!lp.fixed&&LANG.assinatura(lp.prog)===LANG.assinatura(p),'solução de '+id+' sobrevive ao salvamento');
  const tx=LANG.ler(LANG.codigo(p),cfgD);t.ok(!tx.erro&&LANG.assinatura(tx.prog)===LANG.assinatura(p),'solução de '+id+' escrita como texto é entendida',tx.erro);
}
/* o exemplo de cada etapa (que vai para o diário) é código que a própria etapa entende */
{const ruins=[];for(const d of DESAFIOS)if(d.exemplo&&d.etapa!=='demo'){const q=LANG.ler(d.exemplo.codigo,d);if(q.erro)ruins.push([d.id,q.erro.titulo]);}
  t.ok(!ruins.length,'os exemplos das etapas são código válido',ruins);}
/* cada etapa jogável tem exatamente três dicas: conceito, caminho e quase a solução */
{const ruins=DESAFIOS.filter(d=>d.etapa!=='demo'&&!(Array.isArray(d.dicas)&&d.dicas.length===3)).map(d=>d.id);t.ok(!ruins.length,'três dicas por etapa (conceito → caminho → quase a solução)',ruins);}
/* etapas de corrigir: o código que vem pronto falha, e a correção passa */
for(const d of DESAFIOS.filter(x=>x.etapa==='corrigir')){
  const p=X.programaInicial(d);
  const res=rodarTodas(d,p);t.ok(res.some(x=>!x.ok)&&!LANG.limpar(JSON.parse(JSON.stringify(p)),d).fixed,'corrigir '+d.id+': o código que vem escrito tem erro para achar',res.map(x=>x.ok?'ok':x.s.erro.tipo));
}
/* programas diferentes que também resolvem são aceitos */
{const alt=ids([cmd('right'),cmd('right'),cmd('right'),cmd('right'),cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('act')]);
  t.ok(rodarTodas(DESAFIO.s1,alt).every(x=>x.ok),'outro programa válido (com voltas extras) também resolve o percurso 1');
  const alt4=ids([set('quantidade',lit(L('int',5))),cmd('separar'),set('quantidade',lit(L('int',8))),cmd('separar')]);
  t.ok(rodarTodas(DESAFIO.d4,alt4).every(x=>x.ok),'pedido 8 por nova atribuição também vale');
  const alt2=ids([set('limite',lit(L('int',3))),se(vr('nivel'),'<=',vr('limite'),[cmd('portao')],[cmd('drenar')])]);
  t.ok(rodarTodas(DESAFIO.a2,alt2).every(x=>x.ok),'nivel <= 3 também resolve o portão');
  const alt3=ids([se(vr('temperatura'),'<',lit(L('int',50)),[cmd('manter')],[cmd('resfriar')],[[vr('temperatura'),'<',lit(L('int',80)),[cmd('ventilar')]]])]);
  t.ok(rodarTodas(DESAFIO.a4,alt3).every(x=>x.ok),'testar do mais frio para o mais quente (com <) também resolve');
  const altc=ids([set('regadas',lit(L('int',0))),rep(5,[se(vr('solo'),'!=',lit(L('str','úmido')),[set('regadas',{k:'op',op:'+',a:vr('regadas'),b:lit(L('int',1))}),cmd('irrigar')]),cmd('avancar')]),cmd('acender')]);
  t.ok(rodarTodas(DESAFIO.c1,altc).every(x=>x.ok),'final com != e o contador antes da rega também vale');}
/* erros esperados */
const ERR=[
  ['t1',[cmd('tocha'),cmd('tocha')],'semTocha',2],
  ['s1',[cmd('fwd'),cmd('fwd'),cmd('fwd')],'limite',3],
  ['s1',[cmd('right'),cmd('fwd'),cmd('fwd')],'parede',2],
  ['s1',[cmd('fwd'),cmd('act')],'fora',2],
  ['s1',[cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd')],'semAtivar',null],
  ['s1',[cmd('fwd')],'incompleto',null],
  ['s3',DESAFIO.s3.inicial,'parede',3],
  ['d1',[set('energia',lit(L('str','True')))],'tipoIncompativel',1],
  ['d1',[set('energia',lit(L('bool',true))),set('combustivel',lit(L('float',2.5))),set('pecas',lit(L('int',5))),set('senha',lit(L('str','abrir')))],'valor',null],
  ['d1',[set('energia',lit(L('bool',true)))],'semValor',null],
  ['d3',[cmd('separar'),set('quantidade',lit(L('int',5)))],'semValor',1],
  ['d4',[set('quantidade',lit(L('int',5))),cmd('separar'),cmd('separar')],'loteErrado',null],
  ['d5',DESAFIO.d5.inicial,'tipoIncompativel',1],
  ['d5',[set('carga',lit(L('int',12))),set('oleo',lit(L('float',0.75))),set('codigo',lit(L('str','motor'))),set('freio',lit(L('bool',false))),cmd('mc')],'mcErrado',null],
  ['d5',[set('carga',lit(L('int',12))),cmd('mc')],'semValor',2],
  ['a1',[cmd('abrir')],'semEnergia',1,'B'],
  ['a1',[cmd('carregar')],'faltou',null,'A'],
  ['a1',[cmd('carregar'),cmd('abrir')],'sobrou',null,'A'],
  ['a2',[set('limite',lit(L('int',4))),se(vr('nivel'),'<=',vr('limite'),[cmd('portao')],[cmd('drenar')])],'pressao',3,'C'],
  ['a3',[se(vr('temperatura'),'>=',lit(L('int',80)),[cmd('resfriar')],[cmd('ventilar')])],'sobrou',null,'C'],
  ['a4',DESAFIO.a4.inicial,'faltou',null,'A'],
  ['a4',[se(vr('temperatura'),'>',lit(L('int',80)),[cmd('resfriar')],[cmd('manter')],[[vr('temperatura'),'>=',lit(L('int',50)),[cmd('ventilar')]]])],'faltou',null,'B'],
  ['b0',[rep(5,[cmd('tocha')])],'semTocha',2],
  ['b0',[rep(3,[cmd('tocha')])],'faltaTocha',null],
  ['b1',[rep(4,[cmd('irrigar')])],'encharcou',2],
  ['b3',[rep(3,[cmd('irrigar')])],'encharcou',2,'A'],
  ['b2',DESAFIO.b2.inicial,'semPlanta',2],
  ['b4',[rep(4,[cmd('irrigar'),cmd('avancar')])],'encharcou',2,'B'],
  ['c1',[rep(5,[cmd('irrigar'),cmd('avancar')]),cmd('acender')],'encharcou',2,'A'],
  ['c1',[set('regadas',lit(L('int',0))),rep(5,[se(vr('solo'),'==',lit(L('str','seco')),[cmd('irrigar')]),cmd('avancar')]),cmd('acender')],'contagem',6,'A'],
  ['c1',[rep(5,[se(vr('solo'),'==',lit(L('int',1)),[cmd('irrigar')]),cmd('avancar')])],'seco',null]
];
/* solo == 1 compara texto com número: em Python dá False sempre; o programa não rega e o jogo avisa o motivo */
{const rr=LANG.executar(DESAFIO.c1,MUNDOS.jardim,DESAFIO.c1.situacoes[0],ids([rep(5,[se(vr('solo'),'==',lit(L('int',1)),[cmd('irrigar')]),cmd('avancar')])]));
  t.ok(!rr.s.ok&&E(rr.s).cat==='objetivo'&&/nunca são iguais/.test(rr.s.aviso||''),'solo == 1: o if nunca entra (como no Python) e o aviso explica',rr.s.aviso);}
for(const[id,prog,tipo,linha,sit]of ERR){
  const cfgD=DESAFIO[id],p=ids(JSON.parse(JSON.stringify(prog))),si=sit?cfgD.situacoes.find(x=>x.id===sit):cfgD.situacoes[0];
  const rr=LANG.executar(cfgD,MUNDOS[cfgD.mundo],si,p);const x=E(rr.s);
  t.ok(!rr.s.ok&&rr.s.erro.tipo===tipo&&(x.linha||null)===linha&&x.titulo&&x.texto,'erro de '+id+': '+tipo+(linha?' na linha '+linha:''),x);
}
/* o percurso guiado sugere a próxima linha e reconhece desvios */
t.ok(guiaDe(DESAFIO.s1,[]).bloco==='fwd'&&guiaDe(DESAFIO.s1,ids([cmd('fwd'),cmd('fwd')])).bloco==='right'&&guiaDe(DESAFIO.s1,ids([cmd('act')])).bloco===null,'guia do percurso 1');
t.ok(guiaDe(DESAFIO.a1,[]).bloco==='sese'&&/condição/.test(guiaDe(DESAFIO.a1,ids([novoNo(DESAFIO.a1,'sese')])).texto),'guia da decisão avança conforme o programa');
t.ok(novoNo(DESAFIO.d1,'set',ids([set('energia',lit(L('bool',true)))])).nome==='combustivel','uma atribuição nova já vem com a próxima variável ainda não usada');
t.ok(novoNo(DESAFIO.d1,'set',[]).nome==='energia'&&novoNo(DESAFIO.b0,'rep').var==='i','padrões das linhas novas');
/* conferência das situações: um programa que só passa em uma não conclui */
{const p=ids([cmd('abrir')]);const res=rodarTodas(DESAFIO.a1,p);const passou={};res.forEach(x=>{if(x.ok)passou[x.sit]=LANG.assinatura(p);});
  t.ok(res[0].ok&&!res[1].ok&&!situacoesOk(DESAFIO.a1,passou,p),'passar só na situação A não conclui a decisão');}
/* todo objeto citado existe; toda situação tem id único; toda função da paleta tem nome Python */
let okObj=true;for(const d of DESAFIOS){for(const o of(d.objetos||[]))if(!OBJ[o])okObj=false;const ids2=d.situacoes.map(s=>s.id);if(new Set(ids2).size!==ids2.length)okObj=false;for(const b of d.blocos)if(!X.LANG.CMD[b]&&['set','se','sese','elif','rep','enq'].indexOf(b)<0)okObj=false;}
t.ok(okObj,'objetos, situações e funções dos desafios bem definidos');
t.ok(Object.keys(LANG.CMD).every(k=>/^[a-z_]+$/.test(LANG.CMD[k].py)),'nomes de função em estilo Python (minúsculas e _)');
t.done();
