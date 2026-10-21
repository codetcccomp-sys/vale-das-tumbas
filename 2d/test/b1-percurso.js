// Percurso completo no navegador, como um jogador: pátio de treino → vale → Engrenagens → Motores → Reator → Viva →
// Cidade-Jardim → final. Os desafios são montados tocando nas linhas do painel ou escrevendo o código no modo Escrever
// (nada é injetado no programa); as etapas de corrigir são executadas, o erro é lido na área de erro e corrigido.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b1-percurso');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true,hash:'#vt-treino'});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},360000);
  const U=ui(page),ev=U.ev;
  /* recarrega a página e usa Continuar: as etapas, as relíquias e os programas que resolveram cada etapa voltam iguais */
  const recarregar=async nome=>{const a=await ev(()=>({learn:JSON.stringify(__vt.G.learn),relics:JSON.stringify(__vt.G.relics),sol:Object.keys(__vt.G.solucoes).sort().join()}));
    await page.reload();await page.waitForFunction(()=>window.__vt);await ev(()=>document.getElementById('btnContinue').click());await page.waitForTimeout(150);
    const b=await ev(()=>({area:__vt.G.area.id,learn:JSON.stringify(__vt.G.learn),relics:JSON.stringify(__vt.G.relics),sol:Object.keys(__vt.G.solucoes).sort().join()}));
    t.ok(b.area==='vale'&&a.learn===b.learn&&a.relics===b.relics&&a.sol===b.sol,'recarregar depois da '+nome+': etapas, relíquias e programas restaurados',{antes:a.sol,depois:b.sol,area:b.area});};
  try{
  /* ---------- pátio de treino ---------- */
  await ev(()=>document.getElementById('btnNew').click());
  let e=await U.estado();t.ok(e.mode==='play'&&e.area==='treino','novo jogo começa no Pátio de Treino',e);
  await ev(()=>{__vt.ir(TREINO.marca.x,TREINO.marca.y+2,'cima');__vt.quadros(3);});
  let tr=await ev(()=>__vt.G.treino.passo);t.ok(tr>=1,'andar até a marca conclui o passo de movimento',tr);
  let lb=await ev(()=>__vt.usarEm(TREINO.lume.tx*16+8,TREINO.lume.ty*16+20,'cima'));await page.waitForTimeout(150);
  let d=await ev(()=>({modo:__vt.G.mode,txt:document.getElementById('dTexto').textContent,ops:[...document.querySelectorAll('#dOpcoes .btn')].map(b=>b.textContent)}));
  t.ok(/Lume/.test(lb)&&d.modo==='dialogo'&&d.ops.length>=2,'conversa com o Lume (NPC de orientação)',[lb,d.ops]);
  await U.opcao('Como');d=await ev(()=>document.getElementById('dTexto').textContent);t.ok(d.length>20,'o Lume explica os controles',d.slice(0,90));
  await U.opcao('Até logo');e=await U.estado();t.ok(e.mode==='play','fechar a conversa volta ao jogo');
  const k0=await ev(()=>__vt.R.k);t.ok(await ev(()=>!document.getElementById('bVer')),'não há botão VER na tela');
  await page.keyboard.press('KeyC');await ev(()=>__vt.quadros(2));
  /* nesta tela (412 px, densidade 2) a câmera afastada deixaria o pixel do jogo com 1 pixel da tela: o jogo mantém a normal e avisa */
  let k1=await ev(()=>({k:__vt.R.k,pode:longePossivel(__vt.R.cv.width,__vt.R.cv.height,__vt.R.dpr),av:[...document.querySelectorAll('#msgs .toast span')].map(x=>x.textContent).join(' ')}));
  t.ok(k1.pode?k1.k!==k0:(k1.k===k0&&/máximo/.test(k1.av)),'a tecla C aproxima ou afasta a câmera (ou avisa que a tela já mostra o máximo legível)',[k0,k1]);
  await page.keyboard.press('KeyC');await ev(()=>__vt.quadros(2));
  k1=await ev(()=>({k:__vt.R.k}));t.ok(k1.k===k0,'C de novo volta ao enquadramento de antes',k1);
  lb=await ev(()=>__vt.usarEm(TREINO.manivela.x,TREINO.manivela.y+10,'cima'));tr=await ev(()=>__vt.G.treino);t.ok(tr.manivela,'recolhe a manivela (coleta de objeto)',lb);
  lb=await ev(()=>__vt.usarEm(TREINO.term.tx*16+8,TREINO.term.ty*16+30,'cima'));await page.waitForTimeout(100);
  e=await U.painel();t.ok(!e.aberto,'o terminal pede o Guia antes de abrir o editor',lb);
  await ev(()=>document.getElementById('btnGuia').click());await page.waitForTimeout(100);
  let gd=await ev(()=>({modo:__vt.G.mode,vis:!document.getElementById('guia').hidden,grupos:document.querySelectorAll('#gTopicos .ggr').length,aqui:(document.querySelector('#gTopicos .ggr.aqui')||{}).textContent,tops:document.querySelectorAll('#gTopicos .gtop').length}));
  t.ok(gd.modo==='guia'&&gd.vis&&gd.grupos===5&&/Sequência/.test(gd.aqui)&&gd.tops>=2,'o Guia de Programação abre pelo botão do HUD, no grupo do lugar (★ Sequência)',gd);
  await ev(()=>document.getElementById('gFechar').click());
  await ev(()=>__vt.usarEm(TREINO.term.tx*16+8,TREINO.term.ty*16+30,'cima'));await page.waitForTimeout(100);
  e=await U.painel();t.ok(e.aberto&&e.cfg==='t1','o terminal abre o editor de código no desafio do treino',e.cfg);
  await ev(()=>__vt.velocidade(8));await U.pb('acender_tocha()');let r=await U.executar();
  e=await U.estado();t.ok(r.ok&&e.learn.t1&&/tocha acendeu/.test(r.msg),'primeiro comando: acender_tocha() acende a tocha',r.msg);
  /* a ordem importa: o código vem pronto (na ordem errada), o jogador prevê, executa, observa e corrige */
  await U.etapa(1);r=await U.painel();t.ok(r.cfg==='t2'&&/erguer_portao\(\)\ndestravar_portao\(\)/.test(r.prog),'treino, etapa 2: o programa do portão já vem escrito',r.prog);
  await ev(()=>document.getElementById('pRun').click());let pv=await ev(()=>({vis:!document.getElementById('pPrev').hidden,q:document.querySelector('#pPrev .q').textContent,run:!!PAINEL.run}));
  t.ok(pv.vis&&/Previsão/.test(pv.q)&&!pv.run,'antes da primeira tentativa, o painel pede uma previsão (e ainda não executa)',pv);
  await U.prever(0);await U.esperarFim();await page.waitForTimeout(60);r=await U.painel();let er=await U.erro();
  t.ok(!r.ok&&/Sua previsão: «O portão sobe.»/.test(r.msg)&&/resultado foi outro/.test(r.msg)&&er&&/trava/.test(er.txt),'a previsão é conferida depois: o portão não subiu porque a trava estava fechada',[r.msg,er]);
  await U.linha(2);await U.ch('↑ Subir');r=await U.executar();e=await U.estado();
  t.ok(r.ok&&e.learn.t2&&/destravar_portao\(\)\nerguer_portao\(\)/.test(r.prog),'corrigida a ordem, o portão abre',r.prog);
  await ev(()=>fecharPainel());await page.waitForTimeout(900);
  await ev(()=>{__vt.ir(13*16,3*16,'cima');});await ev(()=>__vt.andar(0,-1,1.2));await U.transicao();
  e=await U.estado();tr=await ev(()=>__vt.G.treino.feito);t.ok(e.area==='vale'&&tr,'sai do pátio pelo portão aberto e chega ao vale',[e.area,tr]);
  /* tumbas seladas fora de ordem */
  let p=await ev(()=>__vt.porta('diesel'));lb=await U.usarEm(p.x,p.y);await page.waitForTimeout(200);e=await U.estado();
  t.ok(e.area==='vale'&&/selada/.test(lb),'Tumba dos Motores selada antes do saber da Sequência',lb);
  p=await ev(()=>__vt.porta('final'));lb=await U.usarEm(p.x,p.y);e=await U.estado();t.ok(e.area==='vale','porta da Cidade-Jardim fechada sem os quatro saberes',lb);
  /* ---------- Engrenagens: sequência ---------- */
  p=await ev(()=>__vt.porta('steam'));lb=await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();
  t.ok(e.area==='steam'&&/Entrar/.test(lb),'entra na Tumba das Engrenagens pela porta',lb);
  lb=await U.usarEm(10*16+8,46*16,'cima');t.ok(/caldeira/i.test(lb),'acende a caldeira (ponto de controle)',lb);
  lb=await U.usarEm(17*16+8,13*16+6,'cima');e=await U.painel();t.ok(e.aberto&&e.cfg==='s0','abre o Computador Ancestral na demonstração',[lb,e.cfg]);
  await ev(()=>__vt.velocidade(8));
  await U.pb('Programa A');await U.esperarFim();await page.waitForTimeout(80);await U.pb('Programa B');await U.esperarFim();await page.waitForTimeout(80);
  e=await U.estado();t.ok(e.learn.s0,'demonstração assistida conclui a etapa 1');
  await U.pb('Continuar');for(const c of['avancar()','avancar()','virar_direita()','avancar()','ativar()'])await U.pb(c);
  r=await U.painel();t.ok(/avancar\(\)\navancar\(\)\nvirar_direita\(\)\navancar\(\)\nativar\(\)/.test(r.prog),'o programa aparece em Python, uma linha por instrução',r.prog);
  r=await U.executar();t.ok(r.ok&&(await U.estado()).learn.s1,'prática guiada: o autômato chega e ativa',r.msg);
  await U.etapa(2);r=await U.painel();t.ok(r.cfg==='s3'&&/virar_direita/.test(r.prog),'etapa de corrigir já vem com o código escrito',r.prog);
  r=await U.executar();er=await U.erro();t.ok(!r.ok&&er&&/linha 3/i.test(er.onde)&&/pedra/.test(er.tit+er.txt),'executar mostra onde parou: erro na linha 3, o autômato bateu',er);
  await U.linha(2);await U.ch('↓ Descer');r=await U.executar();t.ok(r.ok&&(await U.estado()).learn.s3,'corrigido descendo virar_direita(): executar → observar → corrigir',r.prog);
  await U.etapa(3);
  let w=await U.escrever('avancar()\navancar()\navancar()\nvirar_direita()\navancar()\navancar()\nvirar_direita()\navancar()\navancar()\nativar()');
  t.ok(w.aceito&&!w.erro,'modo Escrever: o código digitado é lido',w);
  r=await U.executar();t.ok(r.ok,'aplicação: percurso 2 resolvido com código escrito',r.msg);
  await ev(()=>fecharPainel());
  lb=await U.usarEm(13*16+8,4*16+12,'cima');e=await U.estado();t.ok(e.relics.steam&&e.saberes===1,'portão aberto e Engrenagem-mestra recolhida',[lb,e.relics]);
  lb=await U.usarEm(14*16,47*16+8,'baixo');await U.transicao();e=await U.estado();t.ok(e.area==='vale','sai da tumba pela escada',lb);
  await recarregar('Tumba das Engrenagens');
  /* ---------- Motores: variáveis e tipos ---------- */
  p=await ev(()=>__vt.porta('diesel'));await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();t.ok(e.area==='diesel','Tumba dos Motores aberta depois da Sequência');
  /* pátio de abastecimento: cada máquina aceita um tipo; as cápsulas parecidas de outro tipo são recusadas */
  const capP=id=>ev(id=>{const c=__vt.G.area.patio.caps[id];return __vt.usarEm(c.x,c.y+12,'cima');},id);
  const maqP=k=>ev(k=>{const m=PATIO_DIESEL.maquinas[k];return __vt.usarEm(m.tx*16+8,m.ty*16+30,'cima');},k);
  await capP('c_strue');await maqP('disjuntor');let ab=await ev(()=>__vt.G.abertas.slice());t.ok(ab.indexOf('diesel_disjuntor')<0,'pátio: o disjuntor (aceita bool) recusa a cápsula "True", que é texto',ab);
  await capP('c_true');await maqP('disjuntor');await capP('c_f25');await maqP('bomba');await ev(()=>{for(let i=0;i<60;i++)__vt.quadros(1);});
  await capP('c_abrir');await maqP('porta');await ev(()=>{for(let i=0;i<60;i++)__vt.quadros(1);});
  ab=await ev(()=>__vt.G.abertas.slice());t.ok(['diesel_disjuntor','diesel_ponte','diesel_porta'].every(f=>ab.indexOf(f)>=0),'pátio: True no disjuntor, 2.5 na bomba (a ponte desce) e "ABRIR" no painel abrem a oficina',ab);
  lb=await U.usarEm(14*16+8,13*16+6,'cima');await ev(()=>__vt.velocidade(8));e=await U.painel();t.ok(e.aberto&&e.cfg==='d0','computador dos Motores',[lb,e.cfg]);
  await U.pb('Guardar e ler');await U.esperarFim();await page.waitForTimeout(80);e=await U.estado();t.ok(e.learn.d0,'demonstração da variável e da máquina');
  await U.pb('Continuar');
  await U.pb('variável = valor');await U.ch('"True"');r=await U.painel();t.ok(/texto/.test(r.msg),'placa "True" (string) recusada na variável boolean energia',r.msg);
  await U.ch('True');await U.pb('variável = valor');await U.ch('2,5 L');
  await U.pb('variável = valor');await U.ch('"5"');r=await U.painel();t.ok(/texto/.test(r.msg),'"5" recusado na variável int pecas',r.msg);
  await U.ch('5');await U.pb('variável = valor');await U.ch('"ABRIR"');
  r=await U.painel();t.ok(/energia = True\ncombustivel = 2.5\npecas = 5\nsenha = "ABRIR"/.test(r.prog),'os quatro tipos no código: boolean, float, int e string',r.prog);
  r=await U.executar();e=await U.estado();let maq=await ev(()=>Object.keys((painelVis().ws||{}).maq||{}).length);
  t.ok(r.ok&&e.learn.d1&&maq===4,'cada máquina reage à sua variável (gerador, tanque, contador e porta)',[r.msg,maq]);
  await U.etapa(2);await U.pb('variável = valor');await U.ch('"5"');r=await U.painel();t.ok(/texto/.test(r.msg),'5 ou "5": a string é recusada no int',r.msg);
  r=await ev(()=>LANG.codigo(PAINEL.prog));t.ok(/\?/.test(r),'o "5" não entrou na variável',r);
  await U.ch('5');r=await U.executar();t.ok(r.ok,'atribuição quantidade = 5',r.prog);
  await U.etapa(3);await U.pb('separar_lote()');r=await U.executar();er=await U.erro();
  t.ok(!r.ok&&er&&/linha 1/i.test(er.onde),'ler a variável antes de guardar: erro explicado na linha 1',er);
  await U.pb('variável = valor');await U.ch('5');await U.linha(2);await U.ch('↑ Subir');r=await U.executar();t.ok(r.ok,'a atribuição sobe para antes da máquina: separadora lê quantidade',r.prog);
  await U.etapa(4);w=await U.escrever('quantidade = 5\nseparar_lote()\nquantidade = quantidade + 3\nseparar_lote()');
  r=await U.executar();t.ok(w.aceito&&r.ok,'mudar o valor com uma conta escrita: 5 e 8 peças',[w,r.msg]);
  await U.etapa(5);r=await U.executar();er=await U.erro();
  t.ok(!r.ok&&er&&/linha 1/i.test(er.onde)&&/inteiro/.test(er.tit)&&/texto/.test(er.txt),'código com erro de tipo: "12" no int carga, explicado na linha 1',er);
  await U.linha(1);await U.ch('12');r=await U.executar();er=await U.erro();t.ok(!r.ok&&er&&/maiúsculas/.test(er.txt),'próximo erro: "motor" em minúsculas',er);
  await U.linha(3);await U.ch('"MOTOR"');r=await U.executar();er=await U.erro();t.ok(!r.ok&&er&&/False/.test(er.txt),'próximo erro: freio solto é False',er);
  await U.linha(4);await U.ch('False');r=await U.executar();e=await U.estado();t.ok(r.ok&&e.learn.d5,'ficha do monta-cargas corrigida',r.prog);
  /* aplicação independente: guardar, usar e alterar dados para a bomba encher dois tanques diferentes */
  await U.etapa(6);r=await U.painel();t.ok(r.cfg==='d6'&&!r.prog,'Motores, etapa 7: a bomba de combustível começa sem código e sem guia',r);
  await U.pb('variável = valor');await U.ch('True');await U.pb('variável = valor');await U.ch('"2.5"');r=await U.painel();
  t.ok(/máquina recusou/.test(r.msg)&&/float/.test(r.msg),'"2.5" com aspas é recusado pelo contêiner float',r.msg);
  await U.ch('2,5 L');await U.pb('abastecer_tanque()');await U.pb('variável = valor');await U.ch('combustivel (float)');await U.ch('combustivel + 1,5 L');await U.pb('abastecer_tanque()');
  r=await U.executar();e=await U.estado();let tq=await ev(()=>painelVis().ws.tanques);
  t.ok(r.ok&&e.learn.d6&&tq.join()==='2.5,4','a bomba lê energia e combustivel: tanques com 2.5 L e 4.0 L',[r.prog,tq]);
  await ev(()=>fecharPainel());lb=await U.usarEm(14*16+8,4*16+12,'cima');e=await U.estado();t.ok(e.relics.diesel&&e.saberes===2,'Vela de ignição recolhida',lb);
  await U.usarEm(15*16,32*16+8,'baixo');await U.transicao();await recarregar('Tumba dos Motores');
  /* ---------- Reator: if, elif e else ---------- */
  p=await ev(()=>__vt.porta('atom'));await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();t.ok(e.area==='atom','Tumba do Reator aberta');
  await ev(()=>__vt.ir(14*16+8,21*16+8,'cima'));let mv=await ev(()=>__vt.andar(0,-1,1.6));e=await U.estado();t.ok(e.hearts===2&&e.y>21*16,'com o canal cheio, atravessar cai na água e volta à entrada',[mv,e.hearts]);
  await ev(()=>{__vt.G.hearts=3;});
  await U.usarEm(6*16+8,25*16+20,'cima');await page.waitForTimeout(2600);await ev(()=>__vt.quadros(150));
  await ev(()=>__vt.ir(14*16+8,21*16+12,'cima'));mv=await ev(()=>__vt.andar(0,-1,1.2));e=await U.estado();t.ok(e.y<17.6*16&&e.hearts===3,'canal drenado: atravessa pelos pontões',[mv,e.hearts]);
  lb=await U.usarEm(14*16+8,14*16+6,'cima');await ev(()=>__vt.velocidade(8));e=await U.painel();t.ok(e.aberto&&e.cfg==='a0','computador do Reator',[lb,e.cfg]);
  await U.pb('if energia');await U.esperarFim();await page.waitForTimeout(1700);await U.esperarFim();await page.waitForTimeout(100);e=await U.estado();t.ok(e.learn.a0,'demonstração nas duas situações');
  await U.pb('Continuar');await U.pb('if … else');await U.ch('>=');await U.ch('5');await U.pb('abrir_comporta()');await U.linhaTipo('senao');await U.pb('ligar_carregador()');
  r=await U.painel();t.ok(/if energia >= 5:\n    abrir_comporta\(\)\nelse:\n    ligar_carregador\(\)/.test(r.prog),'if/else com recuo de 4 espaços',r.prog);
  await U.sit(1);r=await U.executar();t.ok(r.ok&&!(await U.estado()).learn.a1,'situação B (energia 3) certa, mas a etapa só conclui com as duas',r.msg);
  r=await U.executarTodas();e=await U.estado();t.ok(e.learn.a1,'decisão certa nas situações A e B',r.msg);
  await U.etapa(2);w=await U.escrever('limite = 4\nif nivel < limite\n    abrir_portao()\nelse:\n    drenar_tanque()');
  t.ok(!w.aceito&&w.erro&&/linha 2/i.test(w.erro)&&/:/.test(w.erro),'texto sem os dois-pontos do if: erro de sintaxe na linha 2, com explicação',w.erro);
  w=await U.escrever('limite = 4\nif nivel <= limite:\n    abrir_portao()\nelse:\n    drenar_tanque()');
  await U.sit(2);r=await U.executar();t.ok(w.aceito&&!r.ok&&r.erro==='pressao','com <= o nível 4 tenta abrir o portão e falha (condição testada no limite)',r.msg);
  w=await U.escrever('limite = 4\nif nivel < limite:\n    abrir_portao()\nelse:\n    drenar_tanque()');
  r=await U.executarTodas();e=await U.estado();t.ok(e.learn.a2,'com < o programa acerta os níveis 2, 6 e 4',r.msg);
  await U.etapa(3);await U.pb('if … else');await U.ch('>=');await U.ch('80');await U.pb('resfriar()');
  await U.pb('elif');await U.ch('>=');await U.ch('50');await U.pb('ventilar()');await U.linhaTipo('senao');await U.pb('manter_estavel()');
  r=await U.painel();t.ok(/if temperatura >= 80:\n    resfriar\(\)\nelif temperatura >= 50:\n    ventilar\(\)\nelse:\n    manter_estavel\(\)/.test(r.prog),'if, elif e else montados por toques',r.prog);
  r=await U.executarTodas();e=await U.estado();t.ok(e.learn.a3,'três temperaturas, três caminhos (elif)',r.msg);
  await U.etapa(4);r=await U.executar();er=await U.erro();t.ok(!r.ok&&er,'a ordem errada dos elif: com 95 graus o reator só ventila',er);
  w=await U.escrever('if temperatura >= 80:\n    resfriar()\nelif temperatura >= 50:\n    ventilar()\nelse:\n    manter_estavel()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&e.learn.a4,'condição mais rigorosa primeiro: as quatro situações passam',r.msg);
  /* aplicação final do Reator: dois sensores, limite numa variável e a regra mais importante primeiro */
  await U.etapa(5);w=await U.escrever('limite = 80\nif temperatura >= limite:\n    resfriar()\nelif energia < 5:\n    ligar_carregador()\nelse:\n    manter_estavel()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&!r.ok&&!e.learn.a5&&/E · 80 graus/.test(await ev(()=>PAINEL.cfg.situacoes[PAINEL.sit].nome)),'a5: com >= o painel resfria a 80 graus (exatamente no limite) e a etapa não conclui',r.msg);
  w=await U.escrever('limite = 80\nif temperatura > limite:\n    resfriar()\nelif energia < 5:\n    ligar_carregador()\nelse:\n    manter_estavel()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&e.learn.a5,'a5: a regra mais importante primeiro e > no limite: as cinco situações passam',r.msg);
  await ev(()=>fecharPainel());lb=await U.usarEm(14*16+8,4*16+12,'cima');e=await U.estado();t.ok(e.relics.atom&&e.saberes===3,'Núcleo atômico recolhido',lb);
  await U.usarEm(15*16,31*16+8,'baixo');await U.transicao();await recarregar('Tumba do Reator');
  /* ---------- Viva: for e while ---------- */
  p=await ev(()=>__vt.porta('bio'));await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();t.ok(e.area==='bio','Tumba Viva aberta');
  await U.usarEm(14*16+8,29*16+20,'cima');await page.waitForTimeout(200);await ev(()=>{for(let i=0;i<300;i++)passoJogo(1/60,performance.now());});
  for(const i of[2,0,3,1]){const B=[[8,27],[12,26],[17,26],[21,27]][i];await U.usarEm(B[0]*16+8,B[1]*16+20,'cima');}
  ab=await ev(()=>__vt.G.abertas.indexOf('bio_canto')>=0);t.ok(ab,'canção repetida na ordem: membrana aberta');
  lb=await U.usarEm(14*16+8,14*16+6,'cima');await ev(()=>__vt.velocidade(8));e=await U.painel();t.ok(e.aberto&&e.cfg==='bd','computador da Tumba Viva: começa pela demonstração',[lb,e.cfg]);
  await U.pb('Linha a linha');await U.esperarFim();await page.waitForTimeout(80);await U.pb('Com for');await U.esperarFim();await page.waitForTimeout(80);
  e=await U.estado();let ac=await ev(()=>painelVis().ws.acesas);t.ok(e.learn.bd&&ac===4,'demonstração: com e sem for, as mesmas quatro tochas acendem',ac);
  await U.pb('Continuar');r=await U.painel();t.ok(r.cfg==='b0','depois da demonstração, a prática guiada das tochas',r.cfg);
  await U.pb('for … in range(n)');await U.pb('acender_tocha()');await U.pb('acender_tocha()');r=await U.painel();
  t.ok(/só cabem|linhas/.test(r.msg)&&!/acender_tocha\(\)\n    acender_tocha/.test(r.prog),'o painel de 2 linhas não aceita repetir a linha: precisa do for',r.msg);
  await U.linhaTipo('no',0);await U.ch('+');await U.ch('+');
  r=await U.executar();let tochas=await ev(()=>painelVis().ws.acesas);e=await U.estado();t.ok(r.ok&&e.learn.b0&&tochas===4,'for i in range(4): acender_tocha() acende as quatro tochas, uma depois da outra',[r.prog,tochas]);
  await U.etapa(2);await U.pb('for … in range(n)');await U.pb('irrigar()');await U.pb('avancar()');await U.linha(1);await U.ch('+');await U.ch('+');
  r=await U.executar();t.ok(r.ok,'for range(4) irriga os quatro organismos',r.prog);
  await U.etapa(3);r=await U.executar();er=await U.erro();t.ok(!r.ok&&er&&/vazia/.test(er.tit+er.txt),'corrigir: o for rega a terra vazia',er);
  await U.linha(1);for(let i=0;i<3;i++)await U.ch('−');await U.linha(3);await U.pb('avancar()');
  r=await U.executar();e=await U.estado();t.ok(r.ok&&e.learn.b2,'corrigido: range(3) com irrigar() e dois avancar()',r.prog);
  await U.etapa(4);await U.pb('while');await U.ch('<');await U.ch('3');await U.pb('irrigar()');r=await U.executarTodas();e=await U.estado();
  t.ok(e.learn.b3,'while umidade < 3 funciona com 0, 1 e 3 regas',r.msg);
  await U.etapa(5);w=await U.escrever('for i in range(4):\n    while umidade < 3:\n        irrigar()\n    avancar()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&e.learn.b4,'rotina automática com while dentro do for',[r.msg,r.prog]);
  await ev(()=>fecharPainel());lb=await U.usarEm(14*16+8,4*16+12,'cima');e=await U.estado();t.ok(e.relics.bio&&e.saberes===4,'Semente da vida recolhida: quatro saberes',lb);
  await U.usarEm(15*16,36*16+8,'baixo');await U.transicao();await recarregar('Tumba Viva');
  /* ---------- Cidade-Jardim ---------- */
  p=await ev(()=>__vt.porta('final'));await U.usarEm(p.x,p.y);await U.transicao();e=await U.estado();t.ok(e.area==='camara','a porta final abre com os quatro saberes e leva à Câmara Final, antes da Cidade-Jardim');
  /* ---------- Câmara Final: as quatro fases (sequência, variáveis, decisões, repetições) e a purificação do guardião ---------- */
  await U.usarEm(14*16+8,15*16+6,'cima');await ev(()=>__vt.velocidade(8));
  w=await U.escrever('cortar_energia()\nabrir_valvula()\nalinhar_espelhos()\ndisparar_ressonador()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&e.learn.k1,'Câmara Final, fase 1: a ordem certa dos quatro mecanismos desestabiliza o Devorador',[r.msg,r.prog]);
  await U.etapa(1);w=await U.escrever('potencia = 2.5\nfrequencia = 7\ndisparar_pulso()\nfrequencia = frequencia + 2\ndisparar_pulso()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&e.learn.k2,'fase 2: guardar e mudar frequencia quebra as duas camadas do núcleo',[r.msg,r.prog]);
  await U.etapa(2);w=await U.escrever('if furia >= 7:\n    erguer_escudo()\nelif furia >= 4:\n    desviar()\nelse:\n    canalizar_luz()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&e.learn.k3,'fase 3: if/elif/else escolhe a defesa nas cinco situações',[r.msg,r.prog]);
  await U.etapa(3);w=await U.escrever('for i in range(4):\n    acender_selo()\nwhile nucleo > 0:\n    purificar_nucleo()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&e.learn.k4,'fase 4: for nos selos e while no núcleo, nas três situações',[r.msg,r.prog]);
  await ev(()=>fecharPainel());await page.waitForTimeout(3800);
  lb=await U.usarEm(14*16,2*16+22,'cima');await U.transicao();e=await U.estado();t.ok(e.area==='final'&&!e.learn.c1,'guardião purificado: a passagem ao norte leva à Cidade-Jardim, com o desafio do Jardim ainda por fazer',lb);
  await U.usarEm(14*16+8,15*16+6,'cima');await ev(()=>__vt.velocidade(8));
  w=await U.escrever('regadas = 0\nfor i in range(5):\n    if solo == "seco":\n        irrigar()\n        regadas = regadas + 1\n    avancar()\nacender_jardim()');
  r=await U.executarTodas();e=await U.estado();t.ok(w.aceito&&e.learn.c1,'desafio final: sequência, variável, decisão e repetição nos dois jardins',[r.msg,r.prog]);
  await ev(()=>fecharPainel());await page.waitForTimeout(100);
  lb=await U.usarEm(14*16,5*16+4,'cima');await page.waitForTimeout(200);
  const fim=await ev(()=>({modo:__vt.G.mode,done:__vt.G.done,tela:!document.getElementById('fim').hidden}));t.ok(fim.tela&&fim.done,'árvore-matriz: cena final',[lb,fim]);
  await page.screenshot({path:require('path').join(__dirname,'shots','fim.png')});
  /* o diário mostra, em cada saber, o conceito e o programa que o jogador escreveu */
  const di=await ev(()=>{document.getElementById('fimOk')&&!document.getElementById('fim').hidden&&document.getElementById('fimOk').click();abrirDiario('saberes');
    const c=[...document.querySelectorAll('#dLista .entry')].map(e=>({t:e.querySelector('h3').textContent,cod:(e.querySelector('pre')||{}).textContent||''}));fecharDiario();return c;});
  const meus=di.filter(c=>/^Seu programa/.test(c.t));
  t.ok(meus.length===4&&meus.some(c=>/abastecer_tanque\(\)/.test(c.cod))&&meus.some(c=>/for i in range\(4\):\n    while umidade < 3:/.test(c.cod)),'o diário guarda, em cada saber, o conceito e o programa do jogador (da aplicação independente)',meus.map(c=>c.t));
  /* ---------- salvar e continuar ---------- */
  const sv=await ev(()=>__vt.lerSave());const nD=await ev(()=>__vt.DESAFIO?Object.keys(__vt.DESAFIO).length:0);t.ok(sv&&sv.done&&Object.keys(sv.learn).length===nD&&sv.relics.bio&&sv.treino.feito,'save final guarda as '+nD+' etapas, o treino, as relíquias e o final',sv&&{learn:Object.keys(sv.learn).length,done:sv.done});
  await page.reload();await page.waitForFunction(()=>window.__vt);await ev(()=>document.getElementById('btnContinue').click());
  e=await U.estado();t.ok(e.saberes===4&&e.area==='vale'&&e.relics.steam,'depois de recarregar, Continuar traz tudo de volta',e);
  }catch(err){t.ok(false,'erro no percurso: '+err.message);}
  clearTimeout(vigia);
  t.done(logs);await browser.close();
})();
