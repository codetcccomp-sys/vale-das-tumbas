// Recompensa das tumbas (item P0 do documento): antes de concluir as etapas, a relíquia não sai do pedestal, mesmo
// encostando no portão da câmara (no meio e nos cantos) e usando teclado, toque ou controle. Depois de concluir, a coleta
// funciona uma única vez (sem repetir o diário), continua depois de entrar de novo na tumba e depois de recarregar.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b10-recompensa');
const GATE={steam:[13,6],diesel:[14,5],atom:[14,5],bio:[14,5]};
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:900,height:640},dpr:1});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},240000);
  const U=ui(page),ev=U.ev;
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
  for(const k of Object.keys(GATE)){
    const [tx,ty]=GATE[k];
    await ev(k=>{const V=__vt;V.G.learn={};V.G.relics[k]=false;V.G.diary=[];V.entrar(k);toastClear();},k);
    /* encostar no portão por baixo: do canto esquerdo ao direito, andando reto e na diagonal */
    const tent=[];
    for(const dx of[-10,-2,4,10,16,22,28,34,42])for(const lado of[0,-1,1]){
      const r=await ev(([tx,ty,dx,lado])=>{const V=__vt;V.ir(tx*16+dx,(ty+1)*16+26,'cima');V.quadros(2);V.andar(lado,-1,1.0);V.andar(0,-1,0.4);return V.estado().prompt;},[tx,ty,dx,lado]);
      /* as três formas de apertar a ação: tecla E, botão AÇÃO da tela e a ação do controle */
      await page.keyboard.press('KeyE');await ev(()=>__vt.quadros(2));
      await ev(()=>{document.getElementById('bUse').click();__vt.quadros(2);apertar('usar');__vt.quadros(2);});
      tent.push(r);
    }
    const antes=await ev(k=>({rel:__vt.G.relics[k],diario:__vt.G.diary.filter(d=>d===RELIC_INFO[k].diary||d===SABER_ENTRY[TOMBS[k].saber]).length,salvo:(__vt.lerSave()||{relics:{}}).relics[k]===true}),k);
    const ofertas=tent.filter(p=>p&&/^Pegar|Pedestal/.test(p));
    t.ok(!ofertas.length,TOMBS_NOME[k]+': encostado no portão fechado (27 posições), o pedestal não oferece a relíquia',{tentativas:tent.length,ofertas});
    t.ok(!antes.rel&&!antes.diario&&!antes.salvo,TOMBS_NOME[k]+': teclado, toque e controle não entregam a relíquia nem o saber antes das etapas',antes);
    /* a regra também vale chamada direto (uma coleta automática futura passaria pelo mesmo lugar) */
    const direto=await ev(k=>({r:pegarReliquia(k,0,0),rel:__vt.G.relics[k]}),k);
    t.ok(direto.r===false&&!direto.rel,TOMBS_NOME[k]+': a regra central recusa a entrega sem as etapas concluídas',direto);
    /* etapas concluídas: o portão abre e a coleta acontece uma vez */
    const ped=await ev(k=>{const V=__vt;for(const d of desafiosDa(k))V.G.learn[d.id]=true;V.quadros(70);const A=V.G.area;return{x:A.ped.x,y:A.ped.y+36};},k);
    const lb=await ev(([x,y])=>__vt.usarEm(x,y+26,'cima'),[ped.x,ped.y]);
    const d1=await ev(k=>({rel:__vt.G.relics[k],n:__vt.G.diary.length,salvo:(__vt.lerSave()||{relics:{}}).relics[k]===true}),k);
    t.ok(/^Pegar/.test(lb||'')&&d1.rel&&d1.salvo,TOMBS_NOME[k]+': com as etapas concluídas, o portão abre e a relíquia é recolhida e salva',{lb,d1});
    await page.keyboard.press('KeyE');await ev(()=>{__vt.quadros(2);document.getElementById('bUse').click();__vt.quadros(2);});
    await ev(k=>{const V=__vt;V.entrar(k);const A=V.G.area;V.usarEm(A.ped.x,A.ped.y+62,'cima');},k);
    const d2=await ev(()=>({n:__vt.G.diary.length,relDiario:__vt.G.diary.filter(d=>/^rel_|^relic/.test(d)).length}));
    t.ok(d2.n===d1.n,TOMBS_NOME[k]+': repetir a ação e entrar de novo na tumba não duplica a recompensa nem o diário',{antes:d1.n,depois:d2.n});
  }
  /* recarregar: as quatro relíquias recolhidas continuam lá */
  await ev(()=>{__vt.G.area.id!=='vale'&&sairTumba(false);salvar(false);});await page.waitForTimeout(400);
  await page.reload();await page.waitForFunction(()=>window.__vt);await ev(()=>document.getElementById('btnContinue').click());await page.waitForTimeout(200);
  const fim=await ev(()=>__vt.G.relics);
  t.ok(fim.steam&&fim.diesel&&fim.atom&&fim.bio,'depois de recarregar, as relíquias recolhidas de forma legítima continuam salvas',fim);
  }catch(e){t.ok(false,'erro no teste: '+e.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
const TOMBS_NOME={steam:'Engrenagens',diesel:'Motores',atom:'Reator',bio:'Viva'};
