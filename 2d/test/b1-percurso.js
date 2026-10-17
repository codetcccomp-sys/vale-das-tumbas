// Percurso completo no navegador, como um jogador: vale → Engrenagens → Motores → Reator → Viva → Cidade-Jardim → final.
// Os desafios são montados tocando nas placas e nos botões do painel (nada é injetado no programa).
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b1-percurso');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},300000);
  const U=ui(page),ev=U.ev;
  try{
  await ev(()=>document.getElementById('btnNew').click());
  let e=await U.estado();t.ok(e.mode==='play'&&e.area==='vale','novo jogo começa no vale',e);
  /* tumbas seladas fora de ordem */
  let p=await ev(()=>__vt.porta('diesel'));let lb=await U.usarEm(p.x,p.y);await page.waitForTimeout(200);e=await U.estado();
  t.ok(e.area==='vale'&&/selada/.test(lb),'Tumba dos Motores selada antes do saber da Sequência',lb);
  p=await ev(()=>__vt.porta('final'));lb=await U.usarEm(p.x,p.y);e=await U.estado();t.ok(e.area==='vale','porta da Cidade-Jardim fechada sem os quatro saberes',lb);
  /* ---------- Engrenagens ---------- */
  p=await ev(()=>__vt.porta('steam'));lb=await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();
  t.ok(e.area==='steam'&&/Entrar/.test(lb),'entra na Tumba das Engrenagens pela porta',lb);
  lb=await U.usarEm(10*16+8,46*16,'cima');t.ok(/caldeira/i.test(lb),'acende a caldeira (ponto de controle)',lb);
  lb=await U.usarEm(17*16+8,13*16+6,'cima');e=await U.painel();t.ok(e.aberto&&e.cfg==='s0','abre o Computador Ancestral na demonstração',[lb,e.cfg]);
  await ev(()=>__vt.velocidade(8));
  await U.pb('Programa A');await U.esperarFim();await page.waitForTimeout(80);await U.pb('Programa B');await U.esperarFim();await page.waitForTimeout(80);
  e=await U.estado();t.ok(e.learn.s0,'demonstração assistida conclui a etapa 1');
  await U.pb('Continuar');for(const c of['AVANÇAR','AVANÇAR','VIRAR','AVANÇAR','ATIVAR'])await U.pb(c);
  let r=await U.executar();t.ok(r.ok&&(await U.estado()).learn.s1,'prática guiada: o autômato chega e ativa',r.msg);
  await U.etapa(2);for(const c of['AVANÇAR','AVANÇAR','AVANÇAR','VIRAR','AVANÇAR','AVANÇAR','VIRAR','AVANÇAR','AVANÇAR','ATIVAR'])await U.pb(c);
  r=await U.executar();t.ok(r.ok,'aplicação: percurso 2 resolvido',r.msg);
  await ev(()=>fecharPainel());
  lb=await U.usarEm(13*16+8,4*16+12,'cima');e=await U.estado();t.ok(e.relics.steam&&e.saberes===1,'portão aberto e Engrenagem-mestra recolhida',[lb,e.relics]);
  lb=await U.usarEm(14*16,47*16+8,'baixo');await U.transicao();e=await U.estado();t.ok(e.area==='vale','sai da tumba pela escada',lb);
  /* ---------- Motores ---------- */
  p=await ev(()=>__vt.porta('diesel'));await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();t.ok(e.area==='diesel','Tumba dos Motores aberta depois da Sequência');
  for(let i=0;i<7;i++)await U.usarEm(8*16+8,24*16+20,'cima');
  await ev(()=>__vt.quadros(3));let ab=await ev(()=>__vt.G.abertas.indexOf('diesel_luz')>=0);t.ok(ab,'holofote girado até a luz alcançar o sensor: porta aberta');
  await U.usarEm(14*16+8,13*16+6,'cima');await ev(()=>__vt.velocidade(8));
  await U.pb('Guardar e consultar');await U.esperarFim();await page.waitForTimeout(80);e=await U.estado();t.ok(e.learn.d0,'demonstração do contêiner');
  await U.pb('Continuar');
  const tipos={'Lote de engrenagens marcado com 5':'inteiro','Galão com 3,14 litros':'decimal','Placa com a inscrição ABRIR':'texto','Fusível ligado':'booleano','Placa com a inscrição 5':'texto','Fusível desligado':'booleano','Lote vazio de engrenagens, marcado com 0':'inteiro','Galão com 2,5 litros':'decimal'};
  await U.clicar('#pItens .it','Placa com a inscrição 5');await U.clicar('#pTipos .btn','inteiro');r=await U.painel();t.ok(/aspas/.test(r.msg),'"5" classificado como inteiro: explicação da diferença',r.msg);
  for(const k in tipos){await U.clicar('#pItens .it',k);await U.clicar('#pTipos .btn',tipos[k]);}
  e=await U.estado();t.ok(e.learn.d1,'reconhece os quatro tipos de dados');
  await U.etapa(2);await U.pb('GUARDAR');await U.ch('"5"');r=await U.painel();t.ok(/texto/.test(r.msg)&&/disponível/.test(r.msg),'valor incompatível explicado e objeto mantido',r.msg);
  r=await ev(()=>LANG.codigo(PAINEL.prog));t.ok(/\?/.test(r),'o "5" não entrou no contêiner',r);
  await U.ch('5');r=await U.executar();t.ok(r.ok,'atribuição quantidade = 5',r.prog);
  await U.etapa(3);await U.pb('SEPARAR');await U.linha(1);await U.ch('↑ Subir');r=await U.executar();t.ok(!r.ok&&r.erro==='semValor','consultar antes de guardar: variável sem valor',r.msg);
  await ev(()=>{PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
  await U.pb('GUARDAR');await U.ch('5');await U.pb('SEPARAR');r=await U.executar();t.ok(r.ok,'a separadora consulta quantidade',r.prog);
  await U.etapa(4);await U.pb('GUARDAR');await U.ch('5');await U.pb('SEPARAR');await U.pb('GUARDAR');await U.ch('quantidade + 3');await U.pb('SEPARAR');
  r=await U.executar();t.ok(r.ok,'mudar o valor com uma conta explícita: 5 e 8 peças',r.prog);
  await U.etapa(5);
  await U.pb('GUARDAR');await U.ch('"12"');r=await U.painel();t.ok(/texto/.test(r.msg),'cartão "12" recusado no contêiner inteiro',r.msg);
  await U.ch('12');await U.pb('GUARDAR');await U.ch('oleo');await U.ch('0,75 L');await U.pb('GUARDAR');await U.ch('codigo');await U.ch('"motor"');await U.pb('GUARDAR');await U.ch('freio');await U.ch('False');await U.pb('LIGAR');
  r=await U.executar();t.ok(!r.ok&&/maiúsculas/.test(r.msg),'código "motor" em minúsculas: o monta-cargas não sobe',r.msg);
  await U.linha(3);await U.ch('"MOTOR"');r=await U.executar();t.ok(r.ok,'configuração nova resolvida',r.prog);
  await ev(()=>fecharPainel());lb=await U.usarEm(14*16+8,4*16+12,'cima');e=await U.estado();t.ok(e.relics.diesel&&e.saberes===2,'Vela de ignição recolhida',lb);
  await U.usarEm(15*16,32*16+8,'baixo');await U.transicao();
  /* ---------- Reator ---------- */
  p=await ev(()=>__vt.porta('atom'));await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();t.ok(e.area==='atom','Tumba do Reator aberta');
  await ev(()=>__vt.ir(14*16+8,21*16+8,'cima'));let mv=await ev(()=>__vt.andar(0,-1,1.6));e=await U.estado();t.ok(e.hearts===2&&e.y>21*16,'com o canal cheio, atravessar cai na água e volta à entrada',[mv,e.hearts]);
  await ev(()=>{__vt.G.hearts=3;});
  await U.usarEm(6*16+8,25*16+20,'cima');await page.waitForTimeout(2600);await ev(()=>__vt.quadros(150));
  await ev(()=>__vt.ir(14*16+8,21*16+12,'cima'));mv=await ev(()=>__vt.andar(0,-1,1.2));e=await U.estado();t.ok(e.y<17.6*16&&e.hearts===3,'canal drenado: atravessa pelos pontões',[mv,e.hearts]);
  await U.usarEm(14*16+8,14*16+6,'cima');await ev(()=>__vt.velocidade(8));
  await U.pb('SE energia');await U.esperarFim();await page.waitForTimeout(1700);await U.esperarFim();await page.waitForTimeout(100);e=await U.estado();t.ok(e.learn.a0,'demonstração nas duas situações');
  await U.pb('Continuar');await U.pb('SE … SENÃO');await U.ch('5');await U.pb('ABRIR');await U.linhaTipo('senao');await U.pb('CARREGADOR');
  await U.sit(1);r=await U.executar();t.ok(r.ok&&!(await U.estado()).learn.a1,'situação B (energia 3) certa, mas a etapa só conclui com as duas',r.msg);
  r=await U.executarTodas();e=await U.estado();t.ok(e.learn.a1,'decisão certa nas situações A e B',r.msg);
  await U.etapa(2);await U.pb('GUARDAR');await U.ch('4');await U.pb('SE … SENÃO');await U.ch('<=');await U.ch('limite',1);await U.pb('PORTÃO');await U.linhaTipo('senao');await U.pb('DRENAR');
  await U.sit(2);r=await U.executar();t.ok(!r.ok&&r.erro==='pressao','com <= o nível 4 tenta abrir o portão e falha (condição testada no limite)',r.msg);
  await U.linhaTipo('no',1);await U.ch('<');r=await U.executarTodas();e=await U.estado();t.ok(e.learn.a2,'com < o programa acerta os níveis 2, 6 e 4',r.msg);
  await ev(()=>fecharPainel());lb=await U.usarEm(14*16+8,4*16+12,'cima');e=await U.estado();t.ok(e.relics.atom&&e.saberes===3,'Núcleo atômico recolhido',lb);
  await U.usarEm(15*16,31*16+8,'baixo');await U.transicao();
  /* ---------- Viva ---------- */
  p=await ev(()=>__vt.porta('bio'));await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();t.ok(e.area==='bio','Tumba Viva aberta');
  await U.usarEm(14*16+8,29*16+20,'cima');await page.waitForTimeout(200);await ev(()=>{for(let i=0;i<300;i++)passoJogo(1/60,performance.now());});
  for(const i of[2,0,3,1]){const B=[[8,27],[12,26],[17,26],[21,27]][i];await U.usarEm(B[0]*16+8,B[1]*16+20,'cima');}
  ab=await ev(()=>__vt.G.abertas.indexOf('bio_canto')>=0);t.ok(ab,'canção repetida na ordem: membrana aberta');
  await U.usarEm(14*16+8,14*16+6,'cima');await ev(()=>__vt.velocidade(8));
  await U.pb('Sem repetição');await U.esperarFim();await page.waitForTimeout(80);await U.pb('Com REPETIR');await U.esperarFim();await page.waitForTimeout(80);
  e=await U.estado();t.ok(e.learn.b0,'demonstração da repetição');
  await U.pb('Continuar');await U.pb('REPETIR');await U.pb('IRRIGAR');await U.pb('AVANÇAR');await U.linha(1);await U.ch('+');await U.ch('+');
  r=await U.executar();t.ok(r.ok,'REPETIR 4 VEZES irriga os quatro organismos',r.prog);
  await U.etapa(2);await U.pb('REPETIR');await U.pb('IRRIGAR');await U.pb('AVANÇAR');await U.pb('AVANÇAR');await U.linha(1);await U.ch('+');r=await U.executar();t.ok(r.ok,'organismos intercalados com REPETIR 3',r.prog);
  await U.etapa(3);await U.pb('ENQUANTO');await U.ch('3');await U.pb('IRRIGAR');r=await U.executarTodas();e=await U.estado();
  t.ok(e.learn.b3,'ENQUANTO umidade < 3 funciona com 0, 1 e 3 regas',r.msg);
  await U.etapa(4);await U.pb('REPETIR');await U.ch('+');await U.ch('+');await U.pb('ENQUANTO');await U.ch('<');await U.ch('3');await U.pb('IRRIGAR');await U.linhaTipo('fim',0);await U.pb('AVANÇAR');
  r=await U.executarTodas();e=await U.estado();t.ok(e.learn.b4,'rotina automática com repetição dentro de repetição',[r.msg,r.prog]);
  await ev(()=>fecharPainel());lb=await U.usarEm(14*16+8,4*16+12,'cima');e=await U.estado();t.ok(e.relics.bio&&e.saberes===4,'Semente da vida recolhida: quatro saberes',lb);
  await U.usarEm(15*16,36*16+8,'baixo');await U.transicao();
  /* ---------- Cidade-Jardim ---------- */
  p=await ev(()=>__vt.porta('final'));await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();t.ok(e.area==='final','a porta da Cidade-Jardim abre com os quatro saberes');
  await U.usarEm(14*16+8,15*16+6,'cima');await ev(()=>__vt.velocidade(8));
  await U.pb('GUARDAR');await U.ch('0');await U.pb('REPETIR');for(let i=0;i<3;i++)await U.ch('+');
  await U.pb('SE … ENTÃO');await U.ch('==');await U.ch('"seco"');await U.pb('IRRIGAR');await U.pb('GUARDAR');await U.ch('regadas + 1');await U.linhaTipo('fim',0);await U.pb('AVANÇAR');await U.linhaTipo('fim',1);await U.pb('ACENDER');
  r=await U.executarTodas();e=await U.estado();t.ok(e.learn.c1,'desafio final: sequência, variável, decisão e repetição nos dois jardins',[r.msg,r.prog]);
  await ev(()=>fecharPainel());await page.waitForTimeout(100);
  lb=await U.usarEm(14*16,5*16+4,'cima');await page.waitForTimeout(200);
  const fim=await ev(()=>({modo:__vt.G.mode,done:__vt.G.done,tela:!document.getElementById('fim').hidden}));t.ok(fim.tela&&fim.done,'árvore-matriz: cena final',[lb,fim]);
  await page.screenshot({path:require('path').join(__dirname,'shots','fim.png')});
  /* ---------- salvar e continuar ---------- */
  const sv=await ev(()=>__vt.lerSave());const nD=await ev(()=>__vt.DESAFIO?Object.keys(__vt.DESAFIO).length:0);t.ok(sv&&sv.done&&Object.keys(sv.learn).length===nD&&sv.relics.bio,'save final guarda as '+nD+' etapas, as relíquias e o final',sv&&{learn:Object.keys(sv.learn).length,done:sv.done});
  await page.reload();await page.waitForFunction(()=>window.__vt);await ev(()=>document.getElementById('btnContinue').click());
  e=await U.estado();t.ok(e.saberes===4&&e.area==='vale'&&e.relics.steam,'depois de recarregar, Continuar traz tudo de volta',e);
  }catch(err){t.ok(false,'erro no percurso: '+err.message);}
  clearTimeout(vigia);
  t.done(logs);await browser.close();
})();
