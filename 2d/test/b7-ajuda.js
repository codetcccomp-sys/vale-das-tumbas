// Ajuda ao jogador no navegador: Guia de Programação (início, HUD, tecla G, pausa e painel), o Lume com dicas
// progressivas (conceito → caminho → quase a solução) que não entregam a resposta, a área de erro com o nome do erro em
// Python e uma explicação simples, o treino que pode ser pulado e revisitado, a vista ampla e os pontos de interesse.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b7-ajuda');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:1366,height:768},dpr:1,hash:'#vt-treino'});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},240000);
  const U=ui(page),ev=U.ev;
  const tecla=async k=>{await page.keyboard.press(k);await page.waitForTimeout(80);await ev(()=>__vt.quadros(1));};
  const vis=id=>ev(id=>{const e=document.getElementById(id);return!!e&&!e.hidden;},id);
  try{
  /* ---------- Guia na tela inicial ---------- */
  await ev(()=>document.getElementById('btnGuiaIni').click());
  let s=await ev(()=>({guia:!document.getElementById('guia').hidden,ini:!document.getElementById('scStart').hidden}));
  t.ok(s.guia&&!s.ini,'o Guia abre na tela inicial, antes de jogar',s);
  /* conteúdo pedido: comandos, variáveis, int, float, string, boolean, if, else, for e while, com exemplos do jogo */
  const top=await ev(()=>{const r={};for(const id of['comandos','variaveis','int','float','string','boolean','if','else','for','while']){mostrarTopico(id);
    r[id]={txt:document.querySelector('#gConteudo .gtxt').textContent,cod:[...document.querySelectorAll('#gConteudo pre.gcod')].map(p=>p.textContent).join('\n'),jogo:(document.querySelector('#gConteudo .gjogo')||{}).textContent||'',
      icone:!!document.querySelector('#gConteudo .gcab canvas')};}return r;});
  const faltam=Object.keys(top).filter(k=>!top[k].txt||!top[k].cod.trim()||!top[k].jogo||!top[k].icone);
  t.ok(Object.keys(top).length===10&&!faltam.length,'os dez assuntos têm explicação curta, ícone, exemplo de código e ligação com o jogo',faltam);
  t.ok(/caixa usada para guardar uma informação/.test(top.variaveis.txt)&&/quantidade = 5/.test(top.variaveis.cod),'variáveis: "quantidade = 5" e a caixa que guarda uma informação',top.variaveis.txt.slice(0,70));
  t.ok(/verifica uma condição antes de executar uma ação/.test(top.if.txt)&&/if porta_aberta:\n    entrar\(\)/.test(top.if.cod),'if: "if porta_aberta: entrar()" e a condição verificada antes da ação',top.if.cod);
  t.ok(/2\.5/.test(top.float.cod)&&/"ABRIR"/.test(top.string.cod)&&/True/.test(top.boolean.cod)&&/range\(4\)/.test(top.for.cod)&&/while/.test(top.while.cod),'exemplos de float, string, boolean, for e while',[top.float.cod,top.for.cod]);
  await ev(()=>document.getElementById('gFechar').click());s=await ev(()=>({guia:!document.getElementById('guia').hidden,ini:!document.getElementById('scStart').hidden}));
  t.ok(!s.guia&&s.ini,'fechar o Guia volta à tela inicial',s);
  /* ---------- treino: objetivo em passos e pular ---------- */
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(150);
  let e=await U.estado();const obj=await ev(()=>objetivo());t.ok(e.area==='treino'&&/Treino 1 de 8/.test(obj.t)&&obj.alvo&&obj.alvo.txt,'o treino mostra o passo da vez no objetivo',obj);
  await ev(()=>__vt.usarEm(TREINO.lume.tx*16+8,TREINO.lume.ty*16+20,'cima'));await U.opcao('Já sei jogar');await U.confirmar();await U.transicao();
  e=await U.estado();let tr=await ev(()=>__vt.G.treino);t.ok(e.area==='vale'&&tr.feito&&!e.learn.t1,'"Já sei jogar" pula o treino e leva ao vale',[e.area,tr]);
  /* ---------- Guia pela tecla G e vista ampla pela tecla C ---------- */
  await tecla('KeyG');e=await U.estado();let gv=await vis('guia');t.ok(e.mode==='guia'&&gv,'tecla G abre o Guia durante o jogo',e.mode);
  await tecla('KeyG');e=await U.estado();t.ok(e.mode==='play'&&!(await vis('guia')),'G de novo fecha o Guia e volta ao jogo',e.mode);
  const k0=await ev(()=>({k:__vt.R.k,l:__vt.R.longeAtivo}));await tecla('KeyC');let k1=await ev(()=>({k:__vt.R.k,l:__vt.R.longeAtivo}));t.ok(k0.l&&!k1.l&&k1.k>k0.k,'a câmera começa afastada; a tecla C aproxima',[k0,k1]);
  await tecla('KeyC');k1=await ev(()=>({k:__vt.R.k,l:__vt.R.longeAtivo}));t.ok(k1.l&&k1.k===k0.k,'C de novo volta a afastar',k1);
  /* ---------- Guia pela pausa ---------- */
  await tecla('Escape');t.ok(await vis('scPause'),'Esc abre a pausa');
  await ev(()=>document.getElementById('pGuiaPausa').click());s=await ev(()=>({guia:!document.getElementById('guia').hidden,pausa:!document.getElementById('scPause').hidden,modo:__vt.G.mode}));
  t.ok(s.guia&&!s.pausa&&s.modo==='guia','o menu de pausa abre o Guia',s);
  await ev(()=>document.getElementById('gFechar').click());s=await ev(()=>({pausa:!document.getElementById('scPause').hidden,modo:__vt.G.mode}));
  t.ok(s.pausa,'fechar o Guia volta à pausa',s);
  await ev(()=>document.getElementById('pResume').click());e=await U.estado();t.ok(e.mode==='play','continuar a partir da pausa',e.mode);
  /* ---------- Lume no acampamento e pontos de interesse ---------- */
  let lb=await ev(()=>__vt.usarEm(93.2*16+8,148*16+16,'cima'));let d=await ev(()=>document.getElementById('dTexto').textContent);
  t.ok(/Lume/.test(lb)&&/Próximo passo/.test(d),'o Lume espera no acampamento e lembra o próximo passo',[lb,d.slice(0,80)]);
  await U.opcao('Até logo');
  const pois=await ev(()=>Object.keys(VALE.pois));const vistos=[];
  for(const id of pois){const r=await ev(id=>{const p=VALE.pois[id];const lb=__vt.usarEm(p.x*16,p.y*16+24,'cima');return lb;},id);if(r&&/Examinar/.test(r))vistos.push(id);await ev(()=>{document.querySelectorAll('#msgs .toast').forEach(x=>x.remove());});}
  const poi=await ev(()=>({poi:Object.keys(__vt.G.poi),diario:__vt.G.diary.filter(x=>/^poi_/.test(x)).length}));
  t.ok(pois.length>=6&&vistos.length===pois.length&&poi.poi.length===pois.length&&poi.diario===pois.length,'os pontos de interesse entre as tumbas podem ser examinados e entram no diário',{pois,vistos,poi});
  /* ---------- voltar ao pátio pela placa e sair pelo portão ---------- */
  lb=await ev(()=>__vt.usarEm(84.2*16,148.6*16+6,'cima'));await U.transicao();e=await U.estado();t.ok(/Pátio de Treino/.test(lb)&&e.area==='treino','a placa do acampamento leva de volta ao pátio de treino',lb);
  await page.waitForTimeout(900);await ev(()=>{__vt.ir(13*16,3*16,'cima');});await ev(()=>__vt.andar(0,-1,1.2));await U.transicao();
  e=await U.estado();t.ok(e.area==='vale','numa visita depois do treino, o portão está aberto e leva ao vale',e.area);
  /* ---------- Lume dentro da tumba: dicas progressivas ---------- */
  await ev(()=>{__vt.G.learn={t1:true,s0:true,s1:true};__vt.entrar('steam');});
  lb=await ev(()=>__vt.usarEm(19*16+8,12*16+16,'cima'));let ops=await ev(()=>[...document.querySelectorAll('#dOpcoes .btn')].map(b=>b.textContent));
  t.ok(/Lume/.test(lb)&&ops.some(o=>/Dica: Corrija/.test(o)&&/1\/3/.test(o)),'na tumba, o Lume oferece dica da próxima etapa (s3)',ops);
  const ds=await ev(()=>__vt.DESAFIO.s3.dicas);const falas=[];
  await U.opcao('💡 Dica');falas.push(await ev(()=>document.getElementById('dTexto').textContent));
  await U.opcao('Outra dica');falas.push(await ev(()=>document.getElementById('dTexto').textContent));
  await U.opcao('Outra dica');falas.push(await ev(()=>document.getElementById('dTexto').textContent));
  ops=await ev(()=>[...document.querySelectorAll('#dOpcoes .btn')].map(b=>b.textContent));
  t.ok(/Dica 1 de 3 \(o conceito\)/.test(falas[0])&&falas[0].indexOf(ds[0])>=0&&/Dica 2 de 3 \(o caminho\)/.test(falas[1])&&falas[1].indexOf(ds[1])>=0&&/Dica 3 de 3 \(quase a solução\)/.test(falas[2])&&falas[2].indexOf(ds[2])>=0,
    'dicas em ordem: primeiro o conceito, depois o caminho, por último a mais próxima da solução',falas.map(x=>x.slice(0,34)));
  t.ok(falas[0].indexOf(ds[2])<0&&falas[1].indexOf(ds[2])<0&&!/avancar\(\), avancar\(\), virar/.test(falas[0]+falas[1]),'as duas primeiras dicas não entregam o programa',falas[0].slice(0,80));
  t.ok(!ops.some(o=>/Outra dica/.test(o))&&ops.some(o=>/Guia/.test(o)),'depois da terceira, o Lume oferece o Guia em vez de outra dica',ops);
  await U.opcao('Outra pergunta');await U.opcao('💡 Dica');d=await ev(()=>document.getElementById('dTexto').textContent);
  t.ok(/já ouviu as três dicas/.test(d)&&/Passo/.test(d),'pode conversar de novo: ele repete a dica mais próxima e sugere o Passo a passo',d.slice(0,80));
  await U.opcao('Abrir o Guia');s=await ev(()=>({modo:__vt.G.mode,top:(document.querySelector('#gTopicos .gtop.on')||{}).textContent}));t.ok(s.modo==='guia'&&/Sequência/.test(s.top),'o Lume abre o Guia no assunto da etapa',s);
  await ev(()=>document.getElementById('gFechar').click());
  await ev(()=>__vt.usarEm(17*16+8,13*16+6,'cima'));let pd=await ev(()=>({cfg:PAINEL.cfg.id,b:document.getElementById('pDica').textContent}));
  t.ok(pd.cfg==='s3'&&/3\/3/.test(pd.b),'as dicas do Lume e as do painel são as mesmas (contagem compartilhada)',pd);
  /* botões de ajuda do desafio */
  const bt=await ev(()=>['pRun','pStep','pReset','pDica','pGuia','pModo'].map(id=>{const b=document.getElementById(id);return{id,t:b.textContent,v:!b.hidden&&b.offsetParent!==null};}));
  t.ok(bt.every(b=>b.v)&&/Executar/.test(bt[0].t)&&/Reiniciar/.test(bt[2].t)&&/Dica/.test(bt[3].t)&&/Guia/.test(bt[4].t),'o desafio tem Executar, Passo, Reiniciar, Dica, Guia e Escrever',bt.map(b=>b.t));
  /* Reiniciar depois de um erro limpa a área de erro e volta o mecanismo */
  await ev(()=>__vt.velocidade(8));let r=await U.executar();let er=await U.erro();
  await ev(()=>document.getElementById('pReset').click());let rs=await ev(()=>({erro:!document.getElementById('pErro').hidden,run:PAINEL.run,ws:painelVis().ws,ini:PAINEL.cfg.situacoes[0].start}));
  t.ok(!r.ok&&er&&!rs.erro&&rs.ws.x===rs.ini.x&&rs.ws.y===rs.ini.y,'↺ Reiniciar apaga o erro e volta o autômato ao começo, mantendo o código',{er:er&&er.onde,ws:[rs.ws.x,rs.ws.y]});
  /* ---------- área de erro: nome do erro em Python e explicação simples ---------- */
  const erroDe=async(cfg,txt)=>{await ev(cfg=>{escolherDesafio(__vt.DESAFIO[cfg]);},cfg);const w=await U.escrever(txt);if(w.aceito){await U.executar();}const x=await U.erro();await ev(()=>{if(PAINEL.texto){PAINEL.texto=false;renderPainel();}});return x;};
  await ev(()=>{fecharPainel();__vt.G.learn=Object.assign(__vt.G.learn,{s3:true,s2:true,d0:true,d1:true});__vt.entrar('diesel');__vt.usarEm(14*16+8,13*16+6,'cima');});
  er=await erroDe('d2','quantidade = "5"');
  t.ok(er&&/linha 1/i.test(er.onde)&&/Regra desta máquina/.test(er.onde)&&/só aceita int \(inteiro\)/.test(er.tit)&&/"5", que é um texto \(str\)/.test(er.txt)&&/Em Python, quantidade = "5" seria permitido/.test(er.txt)&&!/TypeError/.test(er.tit),
    'texto no contêiner int: a área diz que é regra da máquina (não erro do Python), mostra o valor recebido e o tipo exigido',er);
  /* em até duas ações, a explicação do assunto no Guia, sem perder o programa */
  {const g=await ev(()=>{const b=document.querySelector('#pErro .gbtn');const tx=document.getElementById('pTxt').value;b.click();return{bt:b.textContent,modo:__vt.G.mode,top:(document.querySelector('#gTopicos .gtop.on')||{}).textContent,tx};});
    await ev(()=>document.getElementById('gFechar').click());const v=await ev(()=>({modo:__vt.G.mode,erro:!document.getElementById('pErro').hidden,prog:LANG.codigo(PAINEL.prog)}));
    t.ok(/Ver no Guia/.test(g.bt)&&g.modo==='guia'&&/int/.test(g.top)&&v.modo==='painel'&&v.prog==='quantidade = "5"','um toque em "📖 Ver no Guia" abre o assunto do erro; ao fechar, o painel e o programa continuam iguais',{g,v});}
  er=await erroDe('d2','quantidad = 5');t.ok(er&&/não é uma variável desta sala/.test(er.tit)&&/criaria uma variável nova/.test(er.txt)&&/Regra desta máquina/.test(er.onde),'nome de variável que não existe: explica que o Python criaria a variável, mas a sala só tem os contêineres dela',er);
  er=await erroDe('d2','quantidade = 5\nprint(quantidade)');t.ok(er&&/O Python tem, o editor do jogo não/.test(er.onde)&&/print\(\) existe no Python/.test(er.tit),'print(): o Python tem, o editor do jogo não (e diz o que o editor aceita)',er);
  er=await erroDe('d3','quantidade = 5\nseparar()');t.ok(er&&/linha 2/i.test(er.onde)&&/NameError/.test(er.tit)&&/separar_lote/.test(er.txt),'função que não existe: NameError com a função certa sugerida',er);
  er=await erroDe('d2','quantidade = 5,5');t.ok(er&&/linha 1/i.test(er.onde)&&er.txt.length>10,'vírgula no decimal: erro explicado',er);
  await ev(()=>{fecharPainel();__vt.G.learn=Object.assign(__vt.G.learn,{d2:true,d3:true,d4:true,d5:true,a0:true});__vt.entrar('atom');__vt.usarEm(14*16+8,14*16+6,'cima');});
  er=await erroDe('a1','if energia = 5:\n    abrir_comporta()');t.ok(er&&/SyntaxError/.test(er.tit)&&/==/.test(er.tit+er.txt),'= no lugar de == na condição: SyntaxError que explica a diferença',er);
  er=await erroDe('a1','if energia >= 5:\nabrir_comporta()');t.ok(er&&/IndentationError/.test(er.tit)&&/4 espaços/.test(er.txt),'bloco do if sem recuo: IndentationError com o que fazer',er);
  er=await erroDe('a1','if energia >= 5\n    abrir_comporta()');t.ok(er&&/linha 1/i.test(er.onde)&&/SyntaxError/.test(er.tit)&&/:/.test(er.tit+er.txt),'faltou o dois-pontos: SyntaxError na linha 1',er);
  /* Passo a passo: na última instrução, o resultado aparece no mesmo toque, e o mecanismo afetado fica marcado */
  await ev(()=>{escolherDesafio(__vt.DESAFIO.a1);});await U.escrever('abrir_comporta()');await U.sit(0);
  /* a1 pede uma previsão antes da primeira tentativa: a resposta vem na hora e o passo seguinte executa */
  await ev(()=>document.getElementById('pStep').click());await U.prever(1);await U.sit(0);await ev(()=>document.getElementById('pStep').click());await page.waitForTimeout(150);
  const ps=await ev(()=>({fim:!!PAINEL.run&&PAINEL.run.s.fim,ok:!!PAINEL.run&&PAINEL.run.s.ok,msg:$('pMsg').textContent,foco:__vt.R.focoEvento}));
  t.ok(ps.fim&&ps.ok&&/Deu certo em A/.test(ps.msg),'Passo a passo: no programa de uma linha, um toque executa a instrução e já mostra o resultado',ps);
  t.ok(ps.foco&&Math.abs(ps.foco.x-20*16)<4&&!ps.foco.erro,'o mecanismo que a instrução mexeu (a comporta) fica marcado na sala',ps.foco);
  const dicaTxt=await ev(()=>document.querySelector('#pErro .dica').textContent+' | '+document.querySelector('#pErro .gbtn').textContent);t.ok(/Dica/.test(dicaTxt)&&/Ver no Guia/.test(dicaTxt),'a área de erro lembra a Dica do Lume e leva ao Guia',dicaTxt);
  await page.screenshot({path:require('path').join(__dirname,'shots','erro-painel.png')});
  }catch(err){t.ok(false,'erro no teste: '+err.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
