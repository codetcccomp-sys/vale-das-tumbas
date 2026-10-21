// Celular pequeno, interações nas tumbas e legibilidade:
// 1) editor em 360×640: o programa aparece junto com a tarefa, a paleta e Executar, sem rolar; os controles em duas
//    fileiras, sem rótulo cortado; textos do painel com pelo menos 11 px;
// 2) Engrenagens: alavancas na ordem (vapor → freio → trava) param os pistões; fora de ordem voltam, sem dano;
//    Reator: o painel de blindagem segue a regra (if/else) e contém a radiação; Viva: a bomba de seiva (while) até 3
//    acalma os clones; tudo volta ao entrar de novo;
// 3) informação dos puzzles em painéis legíveis: tabuleiro e trilho em casas no painel (acompanham a execução),
//    etiqueta das máquinas dos Motores e placas de leitura num painel que fica aberto.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b17-exploracao');
(async()=>{
  /* ---------- 1) editor em 360 × 640 ---------- */
  let {browser,page,logs}=await open({viewport:{width:360,height:640},dpr:3,touch:true});
  let vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},300000);
  let U=ui(page),ev=U.ev;const todos=[];
  try{
    await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
    const medidas=[];
    for(const [k,id] of [['treino','t1'],['steam','s2'],['diesel','d1'],['atom','a3'],['atom','a5'],['bio','b4'],['final','c1']]){
      const m=await ev(([k,id])=>{const L=__vt.G.learn;for(const d of DESAFIOS){if(d.id===id)break;L[d.id]=true;}
        if(k==='treino'){__vt.entrar('treino');__vt.G.treino.manivela=true;__vt.G.treino.passo=4;__vt.painel('treino');}else{__vt.entrar(k);__vt.painel(k);}
        escolherDesafio(DESAFIO[id]);document.getElementById('painel').scrollTop=0;
        const R=e=>e.getBoundingClientRect(),$$=s=>[...document.querySelectorAll(s)];
        const prog=R(document.getElementById('pProg')),rod=R(document.getElementById('pRodape')),run=R(document.getElementById('pRun'));
        const ctl=$$('#pCtl .btn').filter(b=>!b.hidden&&b.offsetParent);
        const fontes=$$('#painel *').filter(e=>e.offsetParent&&e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).map(e=>parseFloat(getComputedStyle(e).fontSize));
        return{id,progVisivel:Math.round(rod.top-prog.top),runNaTela:run.bottom<=innerHeight&&run.top>=0,fileiras:new Set(ctl.map(b=>Math.round(R(b).top))).size,
          cortados:ctl.filter(b=>b.scrollWidth>b.clientWidth+1).map(b=>b.textContent),fmin:Math.min(...fontes),lado:document.documentElement.scrollWidth>innerWidth};},[k,id]);
      medidas.push(m);await ev(()=>fecharPainel());
    }
    t.ok(medidas.every(m=>m.progVisivel>=40),'360×640: ao abrir o painel, o programa aparece (pelo menos 40 px) acima da paleta e dos botões, sem rolar, nas 7 etapas medidas',medidas.map(m=>m.id+':'+m.progVisivel));
    t.ok(medidas.every(m=>m.runNaTela&&m.fileiras<=2&&!m.cortados.length),'360×640: Executar sempre na tela; controles em duas fileiras; nenhum rótulo cortado',medidas.map(m=>[m.id,m.fileiras,m.cortados]));
    t.ok(medidas.every(m=>m.fmin>=11&&!m.lado),'360×640: textos do painel com pelo menos 11 px e nenhuma rolagem para o lado',medidas.map(m=>m.id+':'+m.fmin));
  }catch(e){t.ok(false,'erro no teste (360×640): '+e.message);}
  todos.push(...logs);clearTimeout(vigia);await browser.close();

  /* ---------- 2) e 3) interações e painéis legíveis ---------- */
  ({browser,page,logs}=await open({viewport:{width:412,height:915},dpr:2.625,touch:true}));U=ui(page);ev=U.ev;
  vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},300000);
  const dlg=()=>ev(()=>({vis:!document.getElementById('dialogo').hidden,nome:document.getElementById('dNome').textContent,txt:document.getElementById('dTexto').textContent,ops:[...document.querySelectorAll('#dOpcoes .btn')].map(b=>b.textContent)}));
  const opcao=txt=>ev(txt=>{const b=[...document.querySelectorAll('#dOpcoes .btn')].find(b=>b.textContent===txt);if(!b)return false;b.click();return true;},txt);
  try{
    await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
    /* Engrenagens: alavancas */
    await ev(()=>{__vt.entrar('steam');__vt.G.hearts=3;});
    const AL={freio:16*16+8,trava:17.5*16+8,vapor:19*16+8},YA=45*16+14+6+4;
    let lb=await U.usarEm(AL.freio,YA,'cima');let r=await ev(()=>({l:__vt.G.area.alavancas.slice(),p:__vt.G.area.pistoesParados,h:__vt.G.hearts}));
    t.ok(/FREIO/.test(lb)&&!r.l.length&&!r.p&&r.h===3,'Engrenagens: puxar o freio primeiro faz as alavancas voltarem (sem dano)',[lb,r]);
    await U.usarEm(AL.vapor,YA,'cima');await U.usarEm(AL.freio,YA,'cima');await U.usarEm(AL.trava,YA,'cima');
    r=await ev(()=>({l:__vt.G.area.alavancas.slice(),p:__vt.G.area.pistoesParados,diario:__vt.G.diary.indexOf('steam_alavancas')>=0}));
    t.ok(r.p&&r.l.join()==='vapor,freio,trava'&&r.diario,'vapor → freio → trava: os pistões param e o diário registra',r);
    r=await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;for(const ty of[40,38,36]){__vt.ir(13*16+8,ty*16+10,'cima');for(let i=0;i<200;i++)passoJogo(1/60,performance.now());}return{h:__vt.G.hearts};});
    t.ok(r.h===3,'com os pistões parados, ficar nas três fileiras por mais de 3 s não fere',r);
    lb=await ev(()=>{const it=__vt.G.area.interact.find(i=>i.nome==='Manual dos pistões');it.use();return null;});r=await dlg();
    t.ok(r.vis&&/Manual dos pistões/.test(r.nome)&&/FREIO só segura com o VAPOR/.test(r.txt),'o manual abre num painel legível (texto do DOM, não pixel)',r);
    await opcao('Entendi');
    await ev(()=>{const A=__vt.G.area;A.reiniciar();});r=await ev(()=>({p:__vt.G.area.pistoesParados,l:__vt.G.area.alavancas.length}));
    t.ok(!r.p&&!r.l,'entrar de novo na tumba devolve os pistões e as alavancas ao começo',r);
    /* Reator: painel de blindagem */
    await ev(()=>{__vt.entrar('atom');__vt.G.hearts=3;__vt.G.area.radiacao=7;});
    lb=await U.usarEm(11*16+8,24*16+14+6+4,'cima');r=await dlg();
    t.ok(/blindagem/.test(lb)&&/radiação 7/.test(lb)&&r.vis&&/SE a radiação for 6 ou mais/.test(r.txt)&&r.ops.indexOf('Ligar a blindagem')>=0,'Reator: o painel mostra a radiação e a regra (se … senão …) num painel legível',[lb,r.txt.slice(0,60)]);
    await opcao('Abrir a ventilação');r=await dlg();let a=await ev(()=>__vt.G.area.blindado);
    t.ok(!a&&r.vis&&/7 >= 6\?" dá True/.test(r.txt)&&/ligar a blindagem/.test(r.txt),'escolha errada: nada acontece e o painel explica a comparação (7 >= 6 é True)',r.txt);
    await opcao('Ligar a blindagem');a=await ev(()=>({b:__vt.G.area.blindado,d:__vt.G.diary.indexOf('atom_blindagem')>=0,dlg:!document.getElementById('dialogo').hidden}));
    t.ok(a.b&&a.d&&!a.dlg,'escolha certa: a blindagem liga, o diário registra e o painel fecha',a);
    r=await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;__vt.ir(7*16+8,22*16+10,'cima');for(let i=0;i<240;i++)passoJogo(1/60,performance.now());return{h:__vt.G.hearts,k:__vt.G.area.kind(7,22)};});
    t.ok(r.h===3&&r.k==='rad','com a radiação contida, ficar 4 s na mancha não fere',r);
    r=await ev(()=>{const A=__vt.G.area;A.reiniciar();A.radiacao=3;return A.blindado;});
    await U.usarEm(11*16+8,24*16+14+6+4,'cima');await opcao('Abrir a ventilação');a=await ev(()=>__vt.G.area.blindado);
    t.ok(!r&&a,'com radiação 3, o caminho do senão (ventilação) é o certo',{antes:r,depois:a});
    /* Viva: bomba de seiva */
    await ev(()=>{__vt.entrar('bio');const A=__vt.G.area;A.seiva=1;A.seivaBombeadas=0;});
    lb=await U.usarEm(19*16+8,33*16+14+8+4,'cima');r=await dlg();
    t.ok(/seiva/.test(lb)&&r.vis&&/Nível da seiva: 1 de 3/.test(r.txt),'Viva: a bomba mostra o nível num painel legível',[lb,r.txt.slice(0,40)]);
    await opcao('Parar e conferir');r=await dlg();
    t.ok(/Ainda está em 1/.test(r.txt)&&/dá True/.test(r.txt),'parar antes de 3: o painel explica que a condição ainda é True',r.txt.slice(0,80));
    await opcao('Bombear uma vez');await opcao('Bombear uma vez');await opcao('Bombear uma vez');r=await dlg();a=await ev(()=>__vt.G.area.seiva);
    t.ok(/Vazou/.test(r.txt)&&a===0,'passar de 3 vaza e esvazia a cápsula (sem dano)',[r.txt.slice(0,40),a]);
    await opcao('Bombear uma vez');await opcao('Bombear uma vez');await opcao('Bombear uma vez');await opcao('Parar e conferir');
    a=await ev(()=>({c:__vt.G.area.clonesCalmos,n:__vt.G.area.seivaBombeadas,d:__vt.G.diary.indexOf('bio_seiva')>=0}));
    t.ok(a.c&&a.n===3&&a.d,'de 0 a 3 com três bombeadas: os clones ficam calmos e o diário registra',a);
    // toca os quatro bulbos pela própria interação, sem andar até eles (a proximidade é outra regra, que continua valendo)
    r=await ev(()=>{const A=__vt.G.area;document.querySelectorAll('.toast').forEach(x=>x.remove());TOASTS.queue.length=0;
      for(const it of A.interact.filter(i=>{try{return typeof i.label==='function'&&i.label()==='Tocar o bulbo';}catch(e){return false;}}))it.use();
      return{g:A.guardas.map(e=>e.estado),msg:TOASTS.queue.map(q=>q.text).concat(TOASTS.on.map(q=>q.text)).join(' | ')};});
    t.ok(r.g.every(e=>e==='dorme')&&/continuam dormindo/.test(r.msg),'com os clones calmos, errar a canção não os acorda (o aviso diz por quê)',r);
    /* 3) painéis legíveis: tabuleiro, trilho e etiqueta */
    r=await ev(()=>{const L=__vt.G.learn;for(const d of DESAFIOS){if(d.id==='s1')break;L[d.id]=true;}__vt.entrar('steam');__vt.painel('steam');escolherDesafio(DESAFIO.s1);
      const c=[...document.querySelectorAll('#pCena .tabg i')];return{n:c.length,seta:c.findIndex(i=>i.className==='a'),txt:c.map(i=>i.textContent).join('')};});
    t.ok(r.n===9&&r.seta===6&&/◆/.test(r.txt)&&/■/.test(r.txt)&&/▲/.test(r.txt),'Engrenagens: o tabuleiro aparece no painel em casas legíveis (destino, pedras e autômato com a seta)',r);
    await U.escrever('avancar()');await U.executar(1);
    r=await ev(()=>{const c=[...document.querySelectorAll('#pCena .tabg i')];return{seta:c.findIndex(i=>i.className==='a'),rastro:c.some(i=>i.className==='t')};});
    t.ok(r.seta===3&&r.rastro,'depois de executar avancar(), o autômato do painel subiu uma casa e deixou o rastro',r);
    r=await ev(()=>{fecharPainel();const L=__vt.G.learn;for(const d of DESAFIOS){if(d.id==='c1')break;L[d.id]=true;}__vt.entrar('final');__vt.painel('final');escolherDesafio(DESAFIO.c1);
      return[...document.querySelectorAll('#pCena .tabg i')].map(i=>i.textContent);});
    t.ok(r.join()==='seco,úmido,seco,seco,úmido,fonte','Cidade-Jardim: o solo de cada canteiro aparece no painel em texto (antes, só em pixels na sala)',r);
    await ev(()=>{fecharPainel();__vt.G.learn={};__vt.entrar('diesel');});
    r=await ev(()=>{const it=__vt.G.area.interact.find(i=>{try{return typeof i.label==='function'&&/Ler a etiqueta: Bomba/.test(i.label()||'');}catch(e){return false;}});if(!it)return null;it.use();return true;});
    const d=await dlg();
    t.ok(r&&d.vis&&/Etiqueta · Bomba/.test(d.nome)&&/Aceita: float/.test(d.txt)&&/Pede: 2\.5/.test(d.txt),'Motores: ler a etiqueta de uma máquina abre um painel que fica aberto, com o tipo aceito e o valor pedido',d);
  }catch(e){t.ok(false,'erro no teste (tumbas): '+e.message);}
  todos.push(...logs);clearTimeout(vigia);t.done(todos);await browser.close();
})();
