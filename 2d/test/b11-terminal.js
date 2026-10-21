// Terminal e pistas: o editor amplo (padrão) com a sala numa faixa compacta no mecanismo; "Comandos e variáveis" nos
// dois modos (no modo Escrever, a paleta e a referência escrevem no cursor, com recuo e trecho para trocar); o Guia
// devolve o programa, o cursor e a seleção; as placas com ! viram pistas no diário e no terminal, e dá para fixá-las;
// com o painel aberto, guardiões, pistões e vida ficam parados.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b11-terminal');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},200000);
  const U=ui(page),ev=U.ev;
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
  /* ---------- pista: placa com ! nos Motores ---------- */
  await ev(()=>{__vt.G.learn={t1:1,t2:1,s0:1,s1:1,s3:1,s2:1,d0:1,d1:1};__vt.G.abertas.push('diesel_porta','diesel_ponte','diesel_disjuntor');__vt.entrar('diesel');toastClear();});
  let r=await ev(()=>{const p=__vt.G.area.pistas.find(p=>p.id==='diesel');__vt.ir(p.x,p.y+30+30,'cima');__vt.quadros(2);return{lb:__vt.estado().prompt,marca:__vt.G.area.pistas.length};});
  t.ok(/^Ler a pista: Placa dos contêineres/.test(r.lb||''),'a placa da oficina é uma pista marcada (Ler a pista)',r);
  r=await ev(()=>{const p=__vt.G.area.pistas.find(p=>p.id==='diesel');__vt.usarEm(p.x,p.y+60,'cima');return{modo:__vt.G.mode,nome:document.getElementById('dNome').textContent,txt:document.getElementById('dTexto').textContent,ops:[...document.querySelectorAll('#dOpcoes .btn')].map(b=>b.textContent),lida:!!__vt.G.pistas.diesel,diario:__vt.G.diary.indexOf('pista_diesel')>=0};});
  t.ok(r.modo==='dialogo'&&r.lida&&r.diario&&/Esta é uma pista/.test(r.txt),'ler a pista abre o texto, explica que é uma pista e guarda no diário',r);
  await U.opcao('📌 Fixar');r=await ev(()=>__vt.G.fixadas.slice());t.ok(r[0]==='diesel','dá para fixar a pista no alto do terminal',r);
  await U.opcao('Entendi');
  /* ---------- terminal: editor amplo, pista fixada e Comandos e variáveis ---------- */
  await ev(()=>{__vt.usarEm(14*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.d2);});await page.waitForTimeout(150);
  r=await ev(()=>{const p=document.getElementById('painel').getBoundingClientRect(),v=__vt.R.vista;return{amplo:document.body.classList.contains('pAmplo'),alto:p.height/innerHeight,lay:document.getElementById('pLayout').textContent,fixa:document.getElementById('pFixas').textContent,vista:v.h/__vt.R.dpr/innerHeight};});
  t.ok(r.amplo&&r.alto>0.7&&r.vista>0.18&&/Ver a sala/.test(r.lay),'o editor abre amplo (padrão) e a sala fica numa faixa compacta',r);
  t.ok(/📌 Placa dos contêineres/.test(r.fixa),'a pista fixada aparece no alto do painel',r.fixa);
  r=await ev(()=>{const b=document.getElementById('pRefBox');return{tem:!b.hidden,aberta:b.open,resumo:b.querySelector('summary').textContent,secoes:[...b.querySelectorAll('.rsec>b')].map(x=>x.textContent),vars:[...b.querySelectorAll('.rch')].map(x=>x.textContent)};});
  t.ok(r.tem&&r.resumo==='Comandos e variáveis'&&r.secoes.some(s=>/Variáveis/.test(s))&&r.secoes.some(s=>/Valores/.test(s))&&r.secoes.some(s=>/Pistas/.test(s)),'"Comandos e variáveis" existe no modo de blocos (recolhível)',r);
  t.ok(r.vars.some(v=>/quantidade.*aceita int.*vazia/.test(v)),'a referência mostra a variável com o tipo aceito e o valor atual',r.vars);
  /* ---------- modo Escrever: a paleta continua e a referência escreve no cursor ---------- */
  await ev(()=>document.getElementById('pModo').click());await page.waitForTimeout(100);
  r=await ev(()=>({ref:document.getElementById('pRefBox').open,pal:[...document.querySelectorAll('#pPaleta .pb')].map(b=>b.textContent)}));
  t.ok(r.ref&&r.pal.length>0,'no modo Escrever, a paleta não some e a referência abre sozinha',r);
  r=await ev(()=>{const a=document.getElementById('pTxt');a.value='';a.setSelectionRange(0,0);
    [...document.querySelectorAll('#pPaleta .pb')].find(b=>/variável = valor/.test(b.textContent)).click();
    const s1={v:a.value,sel:a.value.slice(a.selectionStart,a.selectionEnd)};
    [...document.querySelectorAll('#pRefBox .rch.val')].find(b=>/^5/.test(b.textContent)).click();
    return{s1,v:a.value};});
  t.ok(r.s1.v==='quantidade = valor'&&r.s1.sel==='valor'&&r.v==='quantidade = 5','a linha entra no cursor com o trecho "valor" selecionado; tocar em 5 troca o trecho',r);
  /* um bloco com recuo: if dentro do texto e a linha de dentro com 4 espaços */
  r=await ev(()=>{const a=document.getElementById('pTxt');a.value='energia = True';a.setSelectionRange(a.value.length,a.value.length);inserirNoTexto('if condição:\n    ',true,'condição');const s=a.value.slice(a.selectionStart,a.selectionEnd);
    inserirNoTexto('x',false);inserirNoTexto('avancar()',true);return{v:a.value,s};});
  t.ok(r.v==='energia = True\nif x:\n    avancar()'&&r.s==='condição','estruturas entram em linha nova; a linha de dentro do if ganha 4 espaços',r);
  r=await ev(()=>{const a=document.getElementById('pTxt');a.value='if x:\n    avancar()';a.setSelectionRange(a.value.length,a.value.length);inserirNoTexto({t:'elif condição:\n    ',alinhar:recuoDoIf},true,'condição');return a.value;});
  t.ok(r==='if x:\n    avancar()\nelif condição:\n    ','elif fica no recuo do if a que pertence',r);
  /* ---------- Guia no meio da digitação: volta com o programa, o cursor e a seleção ---------- */
  r=await ev(()=>{const a=document.getElementById('pTxt');a.value='quantidade = 5\n# linha dois';a.focus();a.setSelectionRange(3,10);const antes={v:a.value,s:a.selectionStart,e:a.selectionEnd};
    abrirGuia('variaveis');const noGuia=__vt.G.mode;fecharGuia();return{antes,noGuia,depois:{v:a.value,s:a.selectionStart,e:a.selectionEnd,modo:__vt.G.mode,texto:PAINEL.texto}};});
  t.ok(r.noGuia==='guia'&&r.depois.v===r.antes.v&&r.depois.s===3&&r.depois.e===10&&r.depois.modo==='painel'&&r.depois.texto,'consultar o Guia não perde o programa, o cursor nem a seleção',r);
  /* ---------- "Ver a sala" e a preferência ---------- */
  r=await ev(()=>{document.getElementById('pLayout').click();const p=document.getElementById('painel').getBoundingClientRect();return{amplo:document.body.classList.contains('pAmplo'),alto:p.height/innerHeight,cfg:cfgLer().painelAmplo};});
  t.ok(!r.amplo&&r.alto<0.7&&r.cfg===false,'"Ver a sala" diminui o painel e a escolha fica guardada',r);
  await ev(()=>{document.getElementById('pLayout').click();fecharPainel();});
  /* ---------- pista não lida aparece como aviso no terminal ---------- */
  r=await ev(()=>{__vt.G.learn={t1:1,t2:1,s0:1,s1:1};__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.s3);return[...document.querySelectorAll('#pRefC .rpista')].map(x=>({t:x.textContent,falta:x.classList.contains('falta')}));});
  t.ok(r.length===1&&r[0].falta&&/placa com ! nesta sala/.test(r[0].t),'pista ainda não lida: o terminal avisa que há uma placa com ! na sala',r);
  /* ---------- painel aberto: riscos parados ---------- */
  r=await ev(()=>{const A=__vt.G.area,e=A.guardas[0];e.estado='caca';e.x=G.p.x+30;e.y=G.p.y;const a={x:e.x,h:__vt.G.hearts,rel:A.relogio};for(let i=0;i<120;i++)passoJogo(1/60,performance.now());return{a,b:{x:e.x,h:__vt.G.hearts,rel:A.relogio},modo:__vt.G.mode};});
  t.ok(r.modo==='painel'&&r.a.x===r.b.x&&r.a.h===r.b.h&&r.a.rel===r.b.rel,'com o painel aberto, guardião acordado, pistões e vida ficam parados',r);
  await ev(()=>fecharPainel());
  /* ---------- pistas no diário e a fixada depois de recarregar ---------- */
  await ev(()=>{sairTumba(false);});await page.waitForTimeout(700);
  r=await ev(()=>{salvar(false);return 1;});
  await page.reload();await page.waitForFunction(()=>window.__vt);await ev(()=>document.getElementById('btnContinue').click());await page.waitForTimeout(200);
  r=await ev(()=>({p:__vt.G.pistas,f:__vt.G.fixadas}));t.ok(r.p.diesel&&r.f[0]==='diesel','depois de recarregar, a pista lida e a fixada continuam',r);
  }catch(e){t.ok(false,'erro no teste: '+e.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
