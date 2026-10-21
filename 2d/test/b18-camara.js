// Câmara Final · o Devorador do Vale (quatro fases: sequência, variáveis, decisões, repetições): fica entre as quatro tumbas e a Cidade-Jardim e é uma prova adicional.
// Confere o caminho (porta do vale → câmara → cidade), que o chefe acorda ao chegar perto, que cada golpe avisa antes e
// só fere quem fica no círculo, que o painel aberto pausa os ataques, que a ordem errada falha com a explicação certa, que
// a ordem certa purifica o guardião e abre o portão, e que o save (inclusive o antigo, de quem já terminou o jogo) funciona.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b18-camara');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:900,height:640},dpr:1});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},240000);
  const U=ui(page),ev=U.ev;
  const esperar=async()=>{await page.waitForTimeout(650);await ev(()=>__vt.quadros(4));};
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(250);
  const prep=()=>ev(()=>{const V=__vt;V.G.treino.feito=true;for(const k of RELIC_KEYS)for(const d of desafiosDa(k))V.G.learn[d.id]=true;delete V.G.learn.k1;delete V.G.learn.c1;});

  /* ---- a porta do vale leva à câmara; depois de purificado (ou com o jogo já terminado), à cidade ---- */
  await prep();
  await ev(()=>{const V=__vt,p=V.porta('final');V.ir(p.x,p.y,'cima');usarPortaFinal();});await esperar();
  let e=await ev(()=>({a:__vt.G.area.id,c:__vt.G.curTomb,obj:objetivo()&&objetivo().t}));
  t.ok(e.a==='camara'&&e.c==='camara'&&/Câmara Final/.test(e.obj),'com os quatro saberes, a porta final do vale leva à Câmara Final (não direto à cidade)',e);
  t.ok(await ev(()=>!bossFeito()&&desafiosDa('camara').map(d=>d.id).join()==='k1,k2,k3,k4'),'a câmara tem as quatro fases (k1 a k4) e o guardião ainda não foi purificado');
  const pl=await ev(()=>G.area.interact.map(i=>{try{return typeof i.label==='function'?i.label():i.label;}catch(e){return'';}}).filter(x=>/^Ler: Placa/.test(x||'')));
  t.ok(['núcleo','sinais','selos','válvula','ressonador'].every(n=>pl.some(x=>x.indexOf(n)>=0)),'cada fase tem a sua placa legível na sala (válvula, ressonador, núcleo, sinais, selos)',pl);
  await ev(()=>{sairTumba(false);});await esperar();
  e=await ev(()=>({a:__vt.G.area.id,vale:__vt.G.area.id==='vale'}));
  t.ok(e.vale,'a escada da câmara volta ao vale',e);

  /* ---- jogo já terminado antes desta câmara existir: segue direto, sem refazer a luta ---- */
  await ev(()=>{__vt.G.learn.c1=true;const p=__vt.porta('final');__vt.ir(p.x,p.y,'cima');usarPortaFinal();});await esperar();
  e=await ev(()=>({a:__vt.G.area.id,feito:bossFeito()}));
  t.ok(e.a==='final'&&e.feito,'quem já concluiu o Jardim vai direto à cidade (o guardião conta como feito)',e);
  await ev(()=>{sairTumba(false);delete __vt.G.learn.c1;});await esperar();

  /* ---- o chefe dorme até alguém chegar perto; os golpes avisam antes ---- */
  await ev(()=>{const V=__vt,p=V.porta('final');V.ir(p.x,p.y,'cima');usarPortaFinal();});await esperar();
  await ev(()=>{G.invuln=0;G.hearts=3;__vt.quadros(30);});
  let b=await ev(()=>({ac:G.area.boss.acordou,g:G.area.boss.golpes.length,h:G.hearts}));
  t.ok(!b.ac&&b.g===0&&b.h===3,'ao entrar, a criatura pequena dorme: não há golpes nem dano',b);
  await ev(()=>{__vt.ir(14*16,13*16,'cima');__vt.quadros(5);});
  b=await ev(()=>({ac:G.area.boss.acordou,tr:G.area.boss.trans}));
  t.ok(b.ac&&b.tr!==null,'ao chegar perto, o guardião absorve a energia e começa a se transformar',b);
  await ev(()=>{__vt.quadros(120);G.area.boss.prox=999;G.area.boss.golpes=[];});
  b=await ev(()=>({tr:G.area.boss.trans}));t.ok(b.tr===null,'a transformação termina em poucos segundos',b);
  /* aviso: o golpe cai no círculo só depois de mais de 1 s; quem sai do círculo não é ferido */
  await ev(()=>{__vt.ir(14*16,15*16,'cima');G.invuln=0;G.hearts=3;G.area.boss.golpes=[{x:G.p.x,y:G.p.y,t:0,hit:false}];__vt.quadros(40);});
  b=await ev(()=>({h:G.hearts,hit:G.area.boss.golpes[0]&&G.area.boss.golpes[0].hit}));
  t.ok(b.h===3&&!b.hit,'durante o aviso (menos de 1 s) ninguém é ferido, mesmo parado no círculo',b);
  await ev(()=>{__vt.quadros(40);});
  b=await ev(()=>({h:G.hearts}));t.ok(b.h===2,'passado o aviso, o golpe fere quem ficou no círculo (1 coração)',b);
  await ev(()=>{G.invuln=0;G.hearts=3;G.area.boss.golpes=[{x:G.p.x+60,y:G.p.y,t:0,hit:false}];__vt.quadros(90);});
  b=await ev(()=>({h:G.hearts}));t.ok(b.h===3,'quem sai do círculo durante o aviso não é ferido',b);
  /* os golpes automáticos existem: sem fases concluídas, cada rodada solta 1 golpe (nas próximas fases serão 1 + fases) */
  /* o golpe só cai em lugar livre (nunca sobre mecanismos, placas ou outro golpe): conta o máximo em algumas rodadas */
  const n1=await ev(()=>{const B=G.area.boss;G.invuln=99;let n=0;for(let k=0;k<8;k++){B.golpes=[];B.graca=0;B.prox=0.01;__vt.quadros(2);n=Math.max(n,B.golpes.length);}B.golpes=[];return n;});
  t.ok(n1===1,'sem fases concluídas, cada rodada de ataques solta 1 golpe, sempre com aviso (t começa em 0)',n1);

  /* ---- com o painel aberto o chefe não ataca ---- */
  await ev(()=>{G.invuln=0;G.hearts=3;__vt.ir(14*16,16*16,'cima');G.area.boss.prox=0.01;G.area.boss.golpes=[];__vt.quadros(2);G.area.boss.golpes=[];__vt.painel('camara');__vt.quadros(1);});
  await ev(()=>{G.area.boss.prox=0.01;__vt.quadros(240);});
  b=await ev(()=>({g:G.area.boss.golpes.length,h:G.hearts,m:G.mode}));
  t.ok(b.m==='painel'&&b.g===0&&b.h===3,'com o painel aberto não há golpes nem dano',b);

  /* ---- ordem errada: falha e explica; nada é concluído ---- */
  await U.escrever('abrir_valvula()\ncortar_energia()\nalinhar_espelhos()\ndisparar_ressonador()');
  let r=await U.executar();
  t.ok(!r.ok&&r.erro==='valvulaPreso'&&!await ev(()=>!!G.learn.k1),'abrir a válvula antes de cortar a energia falha e não conclui a etapa',r);
  const caixa=await U.erro();t.ok(caixa&&/energia/i.test(caixa.txt)&&/linha 1/i.test(caixa.onde+' '+r.msg),'a caixa de erro explica que o campo de energia trava a válvula e aponta a linha',caixa);
  /* ---- ordem certa: vence ---- */
  await U.escrever('cortar_energia()\nabrir_valvula()\nalinhar_espelhos()\ndisparar_ressonador()');
  r=await U.executar();
  t.ok(r.ok&&r.prog==='cortar_energia()\nabrir_valvula()\nalinhar_espelhos()\ndisparar_ressonador()','a ordem certa (energia, válvula, espelhos, ressonador) vence a fase',r);
  let s1=await ev(()=>({k1:!!G.learn.k1,feito:bossFeito(),obj:objetivo().t}));
  t.ok(s1.k1&&!s1.feito&&/fase 2 de 4 · variáveis/.test(s1.obj),'vencer a fase 1 não basta: o objetivo passa para a fase 2 (variáveis)',s1);
  /* ---- fase 2: o pulso lê a variável na hora; o mesmo valor duas vezes não quebra a camada interna ---- */
  await U.etapa(1);await U.escrever('potencia = 2.5\nfrequencia = 7\ndisparar_pulso()\ndisparar_pulso()');
  r=await U.executar();t.ok(!r.ok&&r.erro==='freqErrada','fase 2: disparar duas vezes com frequencia 7 falha na camada interna',r);
  await U.escrever('potencia = 2.5\nfrequencia = 7\ndisparar_pulso()\nfrequencia = frequencia + 2\ndisparar_pulso()');
  r=await U.executar();t.ok(r.ok&&await ev(()=>!!G.learn.k2),'fase 2: mudar frequencia para 9 entre os pulsos vence',r);
  /* ---- fase 3: a fúria aparece sobre o núcleo; o if/elif/else precisa acertar as cinco situações ---- */
  await U.etapa(2);await U.escrever('if furia >= 7:\n    erguer_escudo()\nelif furia >= 4:\n    desviar()\nelse:\n    canalizar_luz()');
  r=await U.executarTodas();t.ok(await ev(()=>!!G.learn.k3),'fase 3: as cinco situações com o mesmo programa',r);
  /* ---- fase 4: os selos aparecem no chão; o while depende do núcleo de cada situação ---- */
  await U.etapa(3);
  let sl=await ev(()=>({f:faseCamara(),obj:objetivo().t}));t.ok(sl.f===3&&/fase 4 de 4 · repetições/.test(sl.obj),'fase 4 da vez: o objetivo fala dos selos e do núcleo',sl);
  await U.escrever('for i in range(4):\n    acender_selo()\nfor i in range(3):\n    purificar_nucleo()');
  r=await U.executarTodas();t.ok(await ev(()=>!G.learn.k4),'fase 4: um for fixo no núcleo não serve para todas as situações',r);
  await U.escrever('for i in range(4):\n    acender_selo()\nwhile nucleo > 0:\n    purificar_nucleo()');
  r=await U.executarTodas();
  s1=await ev(()=>({k4:!!G.learn.k4,feito:bossFeito(),salvo:['k1','k2','k3','k4'].every(k=>(__vt.lerSave()||{learn:{}}).learn[k]===true)}));
  await ev(()=>{fecharPainel();});
  t.ok(s1.k4&&s1.feito&&s1.salvo,'vencidas as quatro fases, o guardião pode ser purificado (bossFeito) e as fases ficam no save',s1);

  /* ---- o portão estava fechado e abre; o guardião volta ao tamanho original ---- */
  await ev(()=>{__vt.quadros(330);toastClear();});
  b=await ev(()=>({puro:G.area.boss.puro,pur:G.area.boss.pur,fim:G.diary.indexOf('camara_fim')>=0,obj:objetivo().t}));
  t.ok(b.puro&&b.pur===null&&b.fim&&/purificado/.test(b.obj),'o guardião é purificado, o diário guarda o fim da luta e o objetivo muda',b);
  const lb=await ev(()=>__vt.usarEm(14*16,2*16+22,'cima'));
  await esperar();
  e=await ev(lb=>({a:G.area.id,c:G.curTomb,lb}),lb);
  t.ok(/Cidade-Jardim/.test(lb||'')&&e.a==='final'&&e.c==='final','a passagem ao norte, agora aberta, leva à Cidade-Jardim',e);
  t.ok(await ev(()=>!G.learn.c1&&!G.done),'o desafio do Jardim continua pendente (a câmara é adicional: não o substitui)');
  const cid=await ev(()=>({obj:objetivo().t}));t.ok(/Etapa 5 de 5/.test(cid.obj),'na cidade, o objetivo continua sendo o desafio final do Jardim',cid);

  /* ---- antes de purificado, o portão ao norte é parede ---- */
  await ev(()=>{sairTumba(false);delete __vt.G.learn.k1;});await esperar();
  await ev(()=>{const p=__vt.porta('final');__vt.ir(p.x,p.y,'cima');usarPortaFinal();});await esperar();
  const w=await ev(()=>{__vt.ir(14*16,4*16+8,'cima');__vt.quadros(2);const lb=__vt.usarEm(14*16,2*16+22,'cima');__vt.ir(14*16,4*16+8,'cima');__vt.andar(0,-1,1.5);return{y:G.p.y,lb,a:G.area.id};});
  t.ok(w.a==='camara'&&w.y>=3*16&&!/Cidade/.test(w.lb||''),'com o guardião não purificado, o portão fecha a passagem (sem opção de seguir)',w);

  /* ---- save: dentro da câmara, o jogo volta para a porta do vale; o relatório e o diário conhecem a câmara ---- */
  await ev(()=>{salvar(false);});
  const sv=await ev(()=>__vt.lerSave());
  t.ok(sv&&sv.tomb==='final','salvo dentro da câmara, o jogo retoma na porta final do vale (não em área inexistente)',sv&&sv.tomb);
  const rel=await ev(()=>relatorioDados({learn:G.learn,reg:{},dicas:{},regDesde:null}).lugares.map(l=>l.k).join());
  t.ok(/bio,camara,final/.test(rel),'o relatório de aprendizagem lista a Câmara Final entre a Tumba Viva e a cidade',rel);
  await ev(()=>{G.learn.k1=true;});
  const ex=await ev(()=>exemplosVistos().filter(x=>/Câmara Final/.test(x.de)).length);
  t.ok(ex===4,'os exemplos das quatro fases vão para o diário com o nome do lugar',ex);
  /* ---- a cada fase vencida, mais golpes por rodada, no máximo 3 ---- */
  const ng=await ev(()=>{const r=[];for(const n of[0,1,2,3]){['k1','k2','k3','k4'].forEach((k,i)=>{if(i<n)G.learn[k]=true;else delete G.learn[k];});
    __vt.entrar('camara');__vt.ir(10*16,11*16,'cima');const B=G.area.boss;B.acordou=true;B.trans=null;B.fracoAte=0;G.invuln=99;
    /* um golpe só cai onde há lugar livre (nunca sobre mecanismos, placas ou outro golpe): conta o máximo em várias rodadas */
    let mx=0;for(let k=0;k<12;k++){B.graca=0;B.golpes=[];B.prox=0.001;__vt.quadros(2);mx=Math.max(mx,B.golpes.length);}r.push(mx);B.golpes=[];}
    ['k1','k2','k3','k4'].forEach(k=>{G.learn[k]=true;});return r;});
  t.ok(ng.join()==='1,2,3,3','golpes por rodada (máximo em 12 rodadas): 1 sem fases vencidas, 2 com uma, 3 com duas ou mais (nunca mais de 3)',ng);

  /* ---- morrer na câmara leva ao vale (como nas tumbas) ---- */
  await ev(()=>{delete G.learn.k1;});
  await ev(()=>{const V=__vt;V.entrar('camara');V.ir(14*16,16*16,'cima');G.invuln=0;G.hearts=1;G.area.boss.prox=999;G.area.boss.acordou=true;G.area.boss.trans=null;G.area.boss.golpes=[{x:G.p.x,y:G.p.y,t:1.2,hit:false}];V.quadros(3);});
  await esperar();
  e=await ev(()=>({a:G.area.id,c:G.curTomb,h:G.hearts}));
  t.ok(e.a==='vale'&&e.c===null&&e.h===3,'perder todos os corações na câmara leva de volta ao vale, com a vida restaurada',e);
  }catch(err){t.ok(false,'erro inesperado: '+err.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
