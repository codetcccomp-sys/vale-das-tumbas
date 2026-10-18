// Câmera, lanterna, vale e som: a câmera começa afastada (quando a tela comporta), lembra a escolha e volta ao normal
// com o painel aberto; a lanterna não gasta e revela as marcas de luz (só acesa e de perto), que ficam no diário; as
// estações de atalho acordam com o saber de cada tumba e levam ao acampamento; o quadro do acampamento diz o que há fora
// da estrada; partes do vale reagem aos saberes; a trilha sonora toca um tema por região, abaixa com o painel aberto e
// tem volume próprio (separado dos efeitos), guardado nas preferências.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b12-vale-som');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:900,height:640},dpr:1});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},240000);
  const U=ui(page),ev=U.ev;
  const avisos=()=>ev(()=>TOASTS.on.concat(TOASTS.queue).map(x=>x.text).join(' | '));
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(300);
  /* ---------- câmera ---------- */
  let r=await ev(()=>({k:__vt.R.k,l:__vt.R.longeAtivo,W:__vt.R.W}));
  t.ok(r.l&&r.k===2&&r.W>=440,'a câmera começa afastada: mostra mais do lugar ('+r.W+' pixels de jogo de largura)',r);
  r=await ev(()=>{__vt.G.learn={t1:1,t2:1,s0:1,s1:1};__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');const a={k:__vt.R.k,l:__vt.R.longeAtivo};fecharPainel();return{a,b:{k:__vt.R.k,l:__vt.R.longeAtivo}};});
  t.ok(!r.a.l&&r.a.k===3&&r.b.l&&r.b.k===2,'com o painel aberto a sala aparece de perto (detalhe do mecanismo); ao fechar, volta a afastar',r);
  /* ---------- lanterna e marcas de luz ---------- */
  r=await ev(()=>{const A=__vt.G.area,m=A.marcas.find(m=>m.id==='steam_cartao');__vt.G.lanternOn=true;__vt.ir(m.x,m.y+26,'cima');__vt.quadros(2);const com=__vt.estado().prompt;
    __vt.G.lanternOn=false;__vt.quadros(2);const sem=__vt.estado().prompt;__vt.G.lanternOn=true;
    const l0=__vt.G.lantern;for(let i=0;i<1800;i++)passoJogo(1/60,performance.now());
    return{com,sem,l0,l1:__vt.G.lantern,on:__vt.G.lanternOn,hud:document.getElementById('ltxt').textContent};});
  t.ok(r.com==='Ler a marca de luz'&&r.sem===null,'a marca de luz só aparece com a lanterna acesa e perto da parede',r);
  t.ok(r.on&&r.l1===r.l0&&r.hud==='acesa','a lanterna não gasta: 30 s acesa e continua acesa, sem recarga',r);
  r=await ev(()=>{const A=__vt.G.area,m=A.marcas.find(m=>m.id==='steam_cartao');__vt.ir(m.x,m.y+26,'cima');__vt.quadros(2);__vt.usarEm(m.x,m.y+26,'cima');
    return{modo:__vt.G.mode,txt:document.getElementById('dTexto').textContent,lida:!!__vt.G.marcas.steam_cartao,diario:__vt.G.diary.indexOf('marca_steam_cartao')>=0};});
  t.ok(r.modo==='dialogo'&&/Jacquard/.test(r.txt)&&r.lida&&r.diario,'ler a marca de luz conta a história e guarda no diário',r);
  await ev(()=>fecharFala());
  r=await ev(()=>{const x=[...document.querySelectorAll('.btn,.tbtn')].length;apertar('lanterna');passoJogo(1/60,performance.now());return{on:__vt.G.lanternOn,hud:(atualizarHud(),document.getElementById('ltxt').textContent)};});
  t.ok(!r.on&&r.hud==='apagada','LUZ (ou T) apaga e acende a lanterna; o HUD mostra acesa/apagada, sem porcentagem',r);
  r=await ev(()=>({escuro:__vt.G.area.escuro}));t.ok(r.escuro<=0.6,'as tumbas ficam mais claras (escuridão '+r.escuro+'), com bordas de luz suaves',r);
  /* ---------- estações de atalho e o vale que reage ---------- */
  await ev(()=>{sairTumba(false);});await page.waitForTimeout(700);
  r=await ev(()=>{const E=VALE.estacoes.steam;__vt.ir(E.x,E.y+22,'cima');__vt.quadros(2);const lb=__vt.estado().prompt;toastClear();__vt.usarEm(E.x,E.y+22,'cima');return{lb,av:[...document.querySelectorAll('#msgs .toast span')].map(x=>x.textContent).join(' ')};});
  t.ok(/adormecida/.test(r.lb)&&/acorda com o saber/.test(r.av),'antes do saber, a estação de atalho da tumba está adormecida e explica por quê',r);
  r=await ev(()=>{const p=VALE.A.objs.find(o=>o.luzSe&&o.img&&o.luz&&o.luz.cor==='#ffe9a0');return{antes:p?p.luzSe():null};});
  await ev(()=>{for(const k of['steam','diesel'])for(const d of desafiosDa(k))__vt.G.learn[d.id]=true;__vt.entrar('diesel');});
  await ev(()=>{sairTumba(false);});await page.waitForTimeout(1400);
  const av=await avisos();
  r=Object.assign(r,await ev(()=>{const p=VALE.A.objs.find(o=>o.luzSe&&o.img&&o.luz&&o.luz.cor==='#ffe9a0');return{depois:p?p.luzSe():null};}));
  t.ok(/estação de atalho/.test(av)&&/postes/.test(av),'ao sair da tumba concluída: a estação acorda e os postes da era dos motores voltam a acender',av);
  t.ok(r.antes===false&&r.depois===true,'as luzes do vale dependem do saber da era',r);
  r=await ev(()=>{const E=VALE.estacoes.diesel;__vt.ir(E.x,E.y+22,'cima');__vt.quadros(2);__vt.usarEm(E.x,E.y+22,'cima');return{txt:document.getElementById('dTexto').textContent,ops:[...document.querySelectorAll('#dOpcoes .btn')].map(b=>b.textContent)};});
  t.ok(/2 de 4/.test(r.txt)&&r.ops.some(o=>/acampamento/.test(o))&&r.ops.some(o=>/Engrenagens/.test(o)),'a estação acordada leva ao acampamento e às outras estações acordadas',r);
  await U.opcao('➜ Estação do acampamento');await page.waitForTimeout(700);
  r=await ev(()=>{const E=VALE.estacoes.camp;return{d:Math.hypot(__vt.G.p.x-E.x,__vt.G.p.y-E.y),modo:__vt.G.mode};});
  t.ok(r.d<40&&r.modo==='play','o atalho leva ao acampamento (a volta fica curta)',r);
  r=await ev(()=>{lerQuadroAcampamento();return document.getElementById('dTexto').textContent;});
  t.ok(/fragmentos de mapa 0\/4/.test(r)&&/estações de atalho acordadas 2\/4/.test(r)&&/marcas de luz 1\/8/.test(r)&&/Nada disso é obrigatório/.test(r),'o quadro do acampamento diz o que há fora da estrada e para que serve',r);
  await ev(()=>fecharFala());
  /* ---------- trilha sonora ---------- */
  r=await ev(()=>({ctx:!!AU.ctx,estado:AU.ctx&&AU.ctx.state}));
  if(!r.ctx||r.estado!=='running'){t.ok(true,'(o áudio deste navegador sem janela não está rodando: '+JSON.stringify(r)+'; a parte do som foi conferida só pela configuração)');}
  const notas=async ms=>{const a=await ev(()=>AU.mNotas);await page.waitForTimeout(ms);return(await ev(()=>AU.mNotas))-a;};
  r={vale:await notas(2500),tema:await ev(()=>AU.mTema)};
  t.ok(r.vale>0&&r.tema==='vale','no vale de dia toca o tema do vale ('+r.vale+' notas em 2,5 s)',r);
  r=await ev(()=>{__vt.G.time=0.75;return 1;});await page.waitForTimeout(600);r=await ev(()=>AU.mTema);t.ok(r==='noite','à noite o vale troca de tema',r);
  await ev(()=>{__vt.G.time=0.3;__vt.entrar('atom');});await page.waitForTimeout(600);r=await ev(()=>AU.mTema);t.ok(r==='atom','cada tumba tem o seu tema (Reator)',r);
  await ev(()=>{__vt.usarEm(14*16+8,14*16+6,'cima');});await page.waitForTimeout(300);r=await ev(()=>({modo:__vt.G.mode,abafa:AU.abafa}));
  t.ok(r.modo==='painel'&&r.abafa<1,'com o painel aberto a música fica mais baixa (concentração)',r);
  await ev(()=>{fecharPainel();pausar();});
  r=await ev(()=>{const m=document.getElementById('pMus'),e=document.getElementById('pEfx');m.value=0;m.dispatchEvent(new Event('input'));e.value=40;e.dispatchEvent(new Event('input'));return{mus:AU.volMus,efx:AU.volEfx,cfg:cfgLer()};});
  t.ok(r.mus===0&&Math.abs(r.efx-0.4)<1e-9&&r.cfg.mus===0&&Math.abs(r.cfg.efx-0.4)<1e-9,'Música e Efeitos têm volumes separados, guardados nas preferências',r);
  await ev(()=>retomar());r=await notas(1500);t.ok(r===0,'com a música no zero, nenhuma nota é tocada',r);
  await ev(()=>{pausar();const m=document.getElementById('pMus');m.value=70;m.dispatchEvent(new Event('input'));document.getElementById('pSound').click();});
  r=await ev(()=>({on:AU.on,btn:document.getElementById('pSound').textContent,cfg:cfgLer().sound}));t.ok(!r.on&&r.cfg===false&&/desligado/.test(r.btn),'Som desligado silencia tudo (e fica guardado)',r);
  await ev(()=>{document.getElementById('pSound').click();retomar();});
  /* ---------- a câmera escolhida continua depois de recarregar ---------- */
  await ev(()=>{__vt.entrar('steam');alternarVista();});r=await ev(()=>({l:__vt.R.longeAtivo,cfg:cfgLer().longe}));
  await page.reload();await page.waitForFunction(()=>window.__vt);await ev(()=>document.getElementById('btnContinue').click());await page.waitForTimeout(300);
  const r2=await ev(()=>({l:__vt.R.longeAtivo,k:__vt.R.k,mus:AU.volMus,efx:AU.volEfx}));
  t.ok(!r.l&&r.cfg===false&&!r2.l&&r2.k===3&&r2.mus===0.7&&Math.abs(r2.efx-0.4)<1e-9,'depois de recarregar, a câmera aproximada e os volumes escolhidos continuam',[r,r2]);
  }catch(e){t.ok(false,'erro no teste: '+e.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
