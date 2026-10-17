// Testes de lógica (sem navegador): tipos, atribuição, comparação, decisões, repetições, limites, edição por toques,
// equivalência Executar × Passo e as soluções de todos os desafios.
const {carregar,comLimite}=require('./vmload');
const {suite}=require('./assert');
const t=suite('l1-linguagem');
const X=carregar(['02-lang.js','03-learn.js']);
const {LANG,DESAFIO,DESAFIOS,MUNDOS,OBJ,classificar,rodarTodas,situacoesOk,guiaDe,novoNo}=X;
const L=LANG.val;
const lit=v=>({k:'lit',val:v}),vr=n=>({k:'var',nome:n}),cmd=c=>({k:'cmd',cmd:c});
const se=(a,op,b,entao,senao)=>({k:'se',cond:{a,op,b},entao,senao:senao===undefined?null:senao});
const rep=(n,corpo)=>({k:'rep',n,corpo}),enq=(a,op,b,corpo)=>({k:'enq',cond:{a,op,b},corpo});
const set=(nome,expr)=>({k:'set',nome,expr});
function ids(p){let i=0;LANG.cada(p,n=>{n.id=++i;});return p;}
const env=o=>{const e={};for(const k in o)e[k]={t:o[k]?o[k].t:'int',val:o[k],ro:false};return e;};

/* ---------- valores e tipos ---------- */
t.ok(LANG.fmt(L('int',5))==='5'&&LANG.fmt(L('str','5'))==='"5"','5 e "5" aparecem diferentes',[LANG.fmt(L('int',5)),LANG.fmt(L('str','5'))]);
t.ok(LANG.fmt(L('float',5))==='5.0'&&LANG.fmt(L('float',3.14))==='3.14','decimal sempre com ponto',[LANG.fmt(L('float',5)),LANG.fmt(L('float',3.14))]);
t.ok(LANG.fmt(L('bool',true))==='True'&&LANG.fmt(L('bool',false))==='False'&&LANG.fmt(null)==='vazio','True, False e vazio');
t.ok(LANG.fmt(L('float',0.1+0.2))==='0.3','decimal aproximado mostrado com até 4 casas',LANG.fmt(L('float',0.1+0.2)));
t.ok(!LANG.valValido(L('int',2.5))&&!LANG.valValido(L('str','a"b'))&&!LANG.valValido(L('float',Infinity))&&!LANG.valValido({t:'x',v:1})&&LANG.valValido(L('bool',false)),'valores inválidos recusados');
t.ok(LANG.compativel('int',L('str','5'))&&/texto/.test(LANG.compativel('int',L('str','5')))&&LANG.compativel('int',L('int',5))===null,'contêiner de inteiro recusa "5" e explica',LANG.compativel('int',L('str','5')));
t.ok(/5\.0/.test(LANG.compativel('float',L('int',5))),'contêiner de decimal recusa 5 e sugere 5.0');
t.ok(/disponível/.test(LANG.compativel('bool',L('str','True'))),'a explicação diz que o objeto continua disponível');

/* ---------- expressões ---------- */
const e1=env({a:L('int',5),b:L('float',2.5),s:L('str','5'),v:null,f:L('bool',false)});
t.ok(LANG.avaliar({k:'op',op:'+',a:vr('a'),b:lit(L('int',3))},e1).val.v===8,'soma explícita de inteiros');
const r2=LANG.avaliar({k:'op',op:'+',a:vr('a'),b:vr('b')},e1).val;t.ok(r2.t==='float'&&r2.v===7.5,'inteiro + decimal dá decimal',r2);
t.ok(LANG.avaliar({k:'op',op:'+',a:vr('s'),b:lit(L('int',1))},e1).erro.tipo==='tipoOp','texto + número é erro (sem conversão)');
t.ok(LANG.avaliar(vr('v'),e1).erro.tipo==='semValor','ler variável vazia é erro');
t.ok(LANG.comparar({a:vr('s'),op:'==',b:lit(L('int',5))},e1).erro.tipo==='cmpTipos','"5" == 5 é erro de tipos, não False escondido');
t.ok(LANG.comparar({a:vr('a'),op:'==',b:lit(L('int',5))},e1).res===true&&LANG.comparar({a:vr('a'),op:'<',b:lit(L('int',5))},e1).res===false,'comparações numéricas');
t.ok(LANG.comparar({a:vr('f'),op:'==',b:lit(L('bool',false))},e1).res===true,'False == False é Verdadeiro');
t.ok(LANG.comparar({a:vr('s'),op:'<',b:lit(L('str','6'))},e1).erro.tipo==='cmpOrdem','texto só com == e !=');
t.ok(LANG.comparar({a:vr('f'),op:'==',b:lit(L('int',0))},e1).erro.tipo==='cmpTipos','False não é igual a 0 (tipos diferentes)');

/* ---------- interpretador com um mundo de teste ---------- */
const M={init:s=>({n:s.n,acoes:[]}),sensores:w=>({n:{t:'int',val:L('int',w.n)}}),cmd:(w,c)=>{w.acoes.push(c);if(c==='dec')w.n--;if(c==='boom')return{erro:{tipo:'boom',msg:'explodiu'}};return{};},fim:()=>({ok:true})};
const cfg={vars:[{nome:'x',t:'int'},{nome:'txt',t:'str'}],sensores:[{nome:'n',t:'int'}],blocos:['set','se','sese','rep','enq','dec','boom','nada']};
let r=LANG.executar(cfg,M,{n:3},ids([enq(vr('n'),'>',lit(L('int',0)),[cmd('dec')])]));
t.ok(r.s.ok&&r.s.ws.acoes.length===3,'ENQUANTO executa enquanto verdadeiro e para',r.s.ws.acoes.length);
r=LANG.executar(cfg,M,{n:0},ids([enq(vr('n'),'>',lit(L('int',0)),[cmd('dec')])]));
t.ok(r.s.ok&&r.s.ws.acoes.length===0&&r.eventos[0].tipo==='enq'&&r.eventos[0].res===false,'ENQUANTO com condição falsa executa nenhuma vez');
r=LANG.executar(cfg,M,{n:1},ids([enq(vr('n'),'>',lit(L('int',0)),[cmd('dec')])]));
t.ok(r.s.ok&&r.s.ws.acoes.length===1,'ENQUANTO executa uma vez');
let t0=Date.now();r=comLimite(null,()=>LANG.executar(cfg,M,{n:3},ids([enq(vr('n'),'>',lit(L('int',0)),[cmd('nada')])])),3000);
t.ok(!r.s.ok&&r.s.erro.tipo==='semParada'&&Date.now()-t0<3000,'ENQUANTO sem parada é interrompido pelo limite de voltas, sem travar',{erro:r.s.erro.tipo,ms:Date.now()-t0});
t.ok(/continuou verdadeira/.test(LANG.explicar(r.s)),'explica a condição de parada não atingida',LANG.explicar(r.s));
r=comLimite(null,()=>LANG.executar(cfg,M,{n:3},ids([rep(20,[rep(20,[rep(20,[cmd('nada')])])])])),3000);
t.ok(!r.s.ok&&r.s.erro.tipo==='limitePassos','repetições enormes param no limite de passos',r.s.erro.tipo);
r=LANG.executar(cfg,M,{n:3},ids([rep(3,[cmd('nada')])]));
t.ok(r.s.ok&&r.eventos.filter(e=>e.tipo==='rep').map(e=>e.volta).join()==='1,2,3'&&r.s.ws.acoes.length===3,'REPETIR mostra o contador 1, 2, 3');
r=LANG.executar(cfg,M,{n:3},ids([rep(0,[cmd('nada')])]));
t.ok(r.s.ok&&r.s.ws.acoes.length===0,'REPETIR 0 vezes não executa o bloco');
r=LANG.executar(cfg,M,{n:3},ids([set('x',lit(L('str','5')))]));
t.ok(r.s.erro.tipo==='tipoIncompativel'&&/não converte/.test(LANG.explicar(r.s)),'atribuição de tipo errado para na linha e explica',LANG.explicar(r.s));
r=LANG.executar(cfg,M,{n:3},ids([set('n',lit(L('int',1)))]));
t.ok(r.s.erro.tipo==='somenteLeitura','sensor não aceita atribuição');
r=LANG.executar(cfg,M,{n:3},ids([cmd('nada'),set('x',{k:'op',op:'+',a:vr('x'),b:lit(L('int',1))})]));
t.ok(r.s.erro.tipo==='semValor'&&r.s.erro.linha===2&&/Linha 2/.test(LANG.explicar(r.s)),'x = x + 1 com x vazio: erro na linha 2',LANG.explicar(r.s));
r=LANG.executar(cfg,M,{n:3},ids([set('x',lit(L('int',1))),set('x',{k:'op',op:'+',a:vr('x'),b:lit(L('int',4))})]));
t.ok(r.s.ok&&r.s.env.x.val.v===5&&r.eventos[1].antes.v===1,'reatribuição troca o conteúdo (1 → 5)');
r=LANG.executar(cfg,M,{n:7},ids([se(vr('n'),'>=',lit(L('int',5)),[cmd('nada')],[cmd('dec')])]));
t.ok(r.s.ok&&r.eventos[0].res===true&&r.s.ws.acoes.join()==='nada','SE verdadeiro segue o ENTÃO');
r=LANG.executar(cfg,M,{n:3},ids([se(vr('n'),'>=',lit(L('int',5)),[cmd('nada')],[cmd('dec')])]));
t.ok(r.s.ok&&r.eventos[0].res===false&&r.s.ws.acoes.join()==='dec','SE falso segue o SENÃO');
r=LANG.executar(cfg,M,{n:3},ids([cmd('nada'),cmd('boom'),cmd('nada')]));
t.ok(!r.s.ok&&r.s.erro.linha===2&&r.s.ws.acoes.length===2,'erro do mundo para na placa responsável');
r=LANG.executar(cfg,M,{n:3},[]);t.ok(r.s.erro.tipo==='vazio','programa vazio explica o que fazer');
r=LANG.executar(cfg,M,{n:3},ids([set('x',null)]));t.ok(r.s.erro.tipo==='incompleta','placa incompleta é explicada');

/* ---------- Executar × Passo: o mesmo passo() com pausas no meio dá a mesma sequência ---------- */
{const p=ids([set('x',lit(L('int',2))),rep(2,[se(vr('n'),'>',lit(L('int',1)),[cmd('dec')],[cmd('nada')])]),enq(vr('n'),'>',lit(L('int',0)),[cmd('dec')])]);
  const a=LANG.executar(cfg,M,{n:3},p);
  const s=LANG.iniciar(cfg,M,{n:3},p),evs=[];let e;while((e=LANG.passo(s))){evs.push(e);JSON.stringify(s.env);}
  t.ok(JSON.stringify(a.eventos)===JSON.stringify(evs)&&JSON.stringify(a.s.ws)===JSON.stringify(s.ws),'Executar e Passo produzem os mesmos eventos e o mesmo mundo',evs.length);}

/* ---------- edição por toques ---------- */
{const p=[];let c={pai:null,ramo:null,i:0};
  c=LANG.inserir(p,c,{k:'cmd',cmd:'a'});c=LANG.inserir(p,c,{k:'rep',n:2,corpo:[]});c=LANG.inserir(p,c,{k:'cmd',cmd:'b'});
  t.ok(LANG.codigo(p).split('\n').length===4&&p[1].corpo[0].cmd==='b','inserir: depois de um bloco o cursor entra nele',LANG.codigo(p));
  const idb=p[1].corpo[0].id;LANG.mover(p,idb,-1);t.ok(p[1].cmd==='b'&&p[2].k==='rep','mover para cima sai do bloco');
  LANG.mover(p,idb,1);t.ok(p[1].corpo[0]&&p[1].corpo[0].id===idb,'mover para baixo entra no bloco vizinho');
  LANG.mover(p,p[0].id,1);t.ok(p[0].k==='rep'&&p[0].corpo[0].cmd==='a','mover uma placa para dentro de um bloco');
  LANG.remover(p,p[0].id);t.ok(p.length===0,'remover um bloco remove o que está dentro');
  const lim=[];let cc={pai:null,ramo:null,i:0};let res;for(let i=0;i<5;i++)res=LANG.inserir(lim,cc,{k:'cmd',cmd:'a'},{linhas:4});
  t.ok(typeof res==='string'&&lim.length===4,'limite de linhas do painel respeitado',res);
  const fundo=[];let cf={pai:null,ramo:null,i:0};for(let i=0;i<4;i++){const r2=LANG.inserir(fundo,cf,{k:'rep',n:2,corpo:[]},{prof:3});if(typeof r2==='string'){res=r2;break;}cf=r2;}
  t.ok(LANG.profundidade(fundo)===3&&typeof res==='string','no máximo 3 blocos um dentro do outro',LANG.profundidade(fundo));}
{const lixo=[{k:'cmd',cmd:'fwd'},{k:'cmd',cmd:'xxx'},null,{k:'rep',n:999,corpo:[]},{k:'set',nome:'naoexiste',expr:null},{k:'se',cond:{a:{k:'var',nome:'energia'},op:'>=',b:{k:'lit',val:L('int',5)}},entao:[{k:'cmd',cmd:'abrir'}],senao:[]}];
  const c={blocos:['fwd','se','abrir'],sensores:[{nome:'energia',t:'int'}],vars:[]};const r3=LANG.limpar(lixo,c);
  t.ok(r3.fixed&&r3.prog.length===2&&r3.prog[1].entao[0].cmd==='abrir','programa salvo estragado é limpo sem perder o que vale',LANG.codigo(r3.prog));}

/* ---------- soluções de cada desafio ---------- */
const SOL={
  s1:[cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('act')],
  s2:[cmd('fwd'),cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('fwd'),cmd('act')],
  d2:[set('quantidade',lit(L('int',5)))],
  d3:[set('quantidade',lit(L('int',5))),cmd('separar')],
  d4:[set('quantidade',lit(L('int',5))),cmd('separar'),set('quantidade',{k:'op',op:'+',a:vr('quantidade'),b:lit(L('int',3))}),cmd('separar')],
  d5:[set('carga',lit(L('int',12))),set('oleo',lit(L('float',0.75))),set('codigo',lit(L('str','MOTOR'))),set('freio',lit(L('bool',false))),cmd('mc')],
  a1:[se(vr('energia'),'>=',lit(L('int',5)),[cmd('abrir')],[cmd('carregar')])],
  a2:[set('limite',lit(L('int',4))),se(vr('nivel'),'<',vr('limite'),[cmd('portao')],[cmd('drenar')])],
  b1:[rep(4,[cmd('irrigar'),cmd('avancar')])],
  b2:[rep(3,[cmd('irrigar'),cmd('avancar'),cmd('avancar')])],
  b3:[enq(vr('umidade'),'<',lit(L('int',3)),[cmd('irrigar')])],
  b4:[rep(4,[enq(vr('umidade'),'<',lit(L('int',3)),[cmd('irrigar')]),cmd('avancar')])],
  c1:[set('regadas',lit(L('int',0))),rep(5,[se(vr('solo'),'==',lit(L('str','seco')),[cmd('irrigar'),set('regadas',{k:'op',op:'+',a:vr('regadas'),b:lit(L('int',1))})]),cmd('avancar')]),cmd('acender')]
};
for(const id in SOL){
  const cfgD=DESAFIO[id],p=ids(SOL[id]);
  const lin=LANG.contarLinhas(p);
  const res=rodarTodas(cfgD,p),passou={};res.forEach(x=>{if(x.ok)passou[x.sit]=LANG.assinatura(p);});
  t.ok(res.every(x=>x.ok)&&situacoesOk(cfgD,passou,p)&&lin<=(cfgD.maxLinhas||40),'solução de '+id+' passa em todas as situações ('+res.length+') e cabe no painel',{linhas:lin,max:cfgD.maxLinhas,erros:res.filter(x=>!x.ok).map(x=>LANG.explicar(x.s))});
  /* a limpeza do salvamento não muda uma solução válida */
  const lp=LANG.limpar(JSON.parse(JSON.stringify(p)),cfgD);t.ok(!lp.fixed&&LANG.assinatura(lp.prog)===LANG.assinatura(p),'solução de '+id+' sobrevive ao salvamento');
}
/* programas diferentes que também resolvem são aceitos */
{const alt=ids([cmd('right'),cmd('right'),cmd('right'),cmd('right'),cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd'),cmd('act')]);
  t.ok(rodarTodas(DESAFIO.s1,alt).every(x=>x.ok),'outro programa válido (com voltas extras) também resolve o percurso 1');
  const alt4=ids([set('quantidade',lit(L('int',5))),cmd('separar'),set('quantidade',lit(L('int',8))),cmd('separar')]);
  t.ok(rodarTodas(DESAFIO.d4,alt4).every(x=>x.ok),'pedido 8 por nova atribuição também vale');
  const alt2=ids([set('limite',lit(L('int',3))),se(vr('nivel'),'<=',vr('limite'),[cmd('portao')],[cmd('drenar')])]);
  t.ok(rodarTodas(DESAFIO.a2,alt2).every(x=>x.ok),'nivel <= 3 também resolve o portão');
  const altc=ids([set('regadas',lit(L('int',0))),rep(5,[se(vr('solo'),'!=',lit(L('str','úmido')),[set('regadas',{k:'op',op:'+',a:vr('regadas'),b:lit(L('int',1))}),cmd('irrigar')]),cmd('avancar')]),cmd('acender')]);
  t.ok(rodarTodas(DESAFIO.c1,altc).every(x=>x.ok),'final com != e o contador antes da rega também vale');}
/* erros esperados */
const ERR=[
  ['s1',[cmd('fwd'),cmd('fwd'),cmd('fwd')],'limite',3],
  ['s1',[cmd('right'),cmd('fwd'),cmd('fwd')],'parede',2],
  ['s1',[cmd('fwd'),cmd('act')],'fora',2],
  ['s1',[cmd('fwd'),cmd('fwd'),cmd('right'),cmd('fwd')],'semAtivar',null],
  ['s1',[cmd('fwd')],'incompleto',null],
  ['d3',[cmd('separar'),set('quantidade',lit(L('int',5)))],'semValor',1],
  ['d4',[set('quantidade',lit(L('int',5))),cmd('separar'),cmd('separar')],'loteErrado',null],
  ['d5',[set('carga',lit(L('int',12))),set('oleo',lit(L('float',0.75))),set('codigo',lit(L('str','motor'))),set('freio',lit(L('bool',false))),cmd('mc')],'mcErrado',null],
  ['d5',[set('carga',lit(L('str','12')))],'tipoIncompativel',1],
  ['d5',[set('carga',lit(L('int',12))),cmd('mc')],'semValor',2],
  ['a1',[cmd('abrir')],'semEnergia',1,'B'],
  ['a1',[cmd('carregar')],'faltou',null,'A'],
  ['a1',[cmd('carregar'),cmd('abrir')],'sobrou',null,'A'],
  ['a2',[set('limite',lit(L('int',4))),se(vr('nivel'),'<=',vr('limite'),[cmd('portao')],[cmd('drenar')])],'pressao',3,'C'],
  ['b1',[rep(4,[cmd('irrigar')])],'encharcou',2],
  ['b3',[rep(3,[cmd('irrigar')])],'encharcou',2,'A'],
  ['b2',[rep(6,[cmd('irrigar'),cmd('avancar')])],'semPlanta',2],
  ['b4',[rep(4,[cmd('irrigar'),cmd('avancar')])],'encharcou',2,'B'],
  ['c1',[rep(5,[cmd('irrigar'),cmd('avancar')]),cmd('acender')],'encharcou',2,'A'],
  ['c1',[set('regadas',lit(L('int',0))),rep(5,[se(vr('solo'),'==',lit(L('str','seco')),[cmd('irrigar')]),cmd('avancar')]),cmd('acender')],'contagem',8,'A'],
  ['c1',[rep(5,[se(vr('solo'),'==',lit(L('int',1)),[cmd('irrigar')]),cmd('avancar')])],'cmpTipos',2]
];
for(const[id,prog,tipo,linha,sit]of ERR){
  const cfgD=DESAFIO[id],p=ids(prog),si=sit?cfgD.situacoes.find(x=>x.id===sit):cfgD.situacoes[0];
  const rr=LANG.executar(cfgD,MUNDOS[cfgD.mundo],si,p);const n=rr.s.erro&&rr.s.erro.linha?LANG.numeroLinha(rr.s.prog,rr.s.erro.linha):null;
  t.ok(!rr.s.ok&&rr.s.erro.tipo===tipo&&n===linha,'erro de '+id+': '+tipo+(linha?' na linha '+linha:''),LANG.explicar(rr.s));
}
/* o percurso guiado sugere a próxima placa e reconhece desvios */
t.ok(guiaDe(DESAFIO.s1,[]).bloco==='fwd'&&guiaDe(DESAFIO.s1,ids([cmd('fwd'),cmd('fwd')])).bloco==='right'&&guiaDe(DESAFIO.s1,ids([cmd('act')])).bloco===null,'guia do percurso 1');
t.ok(guiaDe(DESAFIO.a1,[]).bloco==='sese'&&/condição/.test(guiaDe(DESAFIO.a1,ids([novoNo(DESAFIO.a1,'sese')])).texto),'guia da decisão avança conforme o programa');
/* classificar */
t.ok(classificar('pl5','str').ok&&!classificar('pl5','int').ok&&/aspas/.test(classificar('pl5','int').msg),'"5" é texto, com explicação');
t.ok(classificar('gal314','float').ok&&classificar('fusOff','bool').ok&&classificar('eng0','int').ok,'tipos dos objetos da bancada');
/* conferência das situações: um programa que só passa em uma não conclui */
{const p=ids([cmd('abrir')]);const res=rodarTodas(DESAFIO.a1,p);const passou={};res.forEach(x=>{if(x.ok)passou[x.sit]=LANG.assinatura(p);});
  t.ok(res[0].ok&&!res[1].ok&&!situacoesOk(DESAFIO.a1,passou,p),'passar só na situação A não conclui a decisão');}
/* todo objeto citado existe; toda situação tem id único */
let okObj=true;for(const d of DESAFIOS){for(const o of(d.objetos||[]).concat(d.itens||[]))if(!OBJ[o])okObj=false;const ids2=d.situacoes.map(s=>s.id);if(new Set(ids2).size!==ids2.length)okObj=false;}
t.ok(okObj,'objetos e situações dos desafios bem definidos');
t.done();
