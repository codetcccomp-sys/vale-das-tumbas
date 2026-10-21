// Validações de uso real no navegador: armazenamento bloqueado (o jogo segue, com aviso compreensível), sair para outro
// aplicativo e voltar (pausa, salva e silencia), teclado virtual do celular (o painel e o campo de código ficam acima
// dele) e nenhuma rolagem horizontal com o painel aberto. Simulações: o teclado e a troca de aplicativo são imitados no
// Chromium de teste; num aparelho real eles precisam ser conferidos à mão (veja VALIDACAO.md).
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b9-validacoes');
(async()=>{
  /* 1) armazenamento bloqueado */
  {const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true,antes:()=>{
      const erro=()=>{throw new DOMException('bloqueado','SecurityError');};Storage.prototype.setItem=erro;Storage.prototype.getItem=erro;Storage.prototype.removeItem=erro;}});
    const ev=(f,a)=>page.evaluate(f,a);
    try{
      const ini=await ev(()=>({nota:document.getElementById('startNote').textContent,cont:!document.getElementById('btnContinue').hidden}));
      t.ok(/não deixa guardar dados/.test(ini.nota)&&!ini.cont,'armazenamento bloqueado: a tela inicial avisa que o progresso não será salvo',ini.nota);
      await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(150);
      const e=await ev(()=>({modo:__vt.G.mode,area:__vt.G.area.id,toasts:[...document.querySelectorAll('#msgs .toast')].map(x=>x.textContent)}));
      t.ok(e.modo==='play'&&e.toasts.some(x=>/Não foi possível salvar/.test(x)&&/jogar normalmente/.test(x)),'o jogo começa normalmente e explica que não consegue salvar',e);
      const mv=await ev(()=>{const y0=__vt.G.p.y;__vt.andar(0,-1,0.5);return y0-__vt.G.p.y;});t.ok(mv>5,'sem armazenamento, o explorador anda e o jogo segue',mv);
      t.ok(!logs.filter(l=>/PAGEERROR/.test(l)).length,'nenhum erro de página com o armazenamento bloqueado',logs);
    }catch(err){t.ok(false,'erro no teste (armazenamento): '+err.message);}
    await browser.close();}
  /* 2) sair para outro aplicativo e voltar */
  {const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true});const ev=(f,a)=>page.evaluate(f,a);
    try{
      await ev(()=>document.getElementById('btnNew').click());await ev(()=>{localStorage.removeItem('vale_das_tumbas_2d');});
      await ev(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
      let e=await ev(()=>({modo:__vt.G.mode,pausa:!document.getElementById('scPause').hidden,salvo:!!localStorage.getItem('vale_das_tumbas_2d')}));
      t.ok(e.modo==='paused'&&e.pausa&&e.salvo,'ao trocar de aplicativo, o jogo pausa e salva',e);
      await ev(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});
      e=await ev(()=>({modo:__vt.G.mode,pausa:!document.getElementById('scPause').hidden}));
      t.ok(e.modo==='paused'&&e.pausa,'ao voltar, o jogo espera na pausa (nada acontece sem o jogador)',e);
      await ev(()=>document.getElementById('pResume').click());e=await ev(()=>__vt.G.mode);t.ok(e==='play','Continuar retoma o jogo',e);
      /* nenhuma rolagem horizontal: no jogo e com o painel aberto (modo Escrever) */
      let sc=await ev(()=>({w:document.documentElement.scrollWidth,iw:innerWidth}));t.ok(sc.w<=sc.iw+1,'no jogo, sem rolagem horizontal',sc);
      await ev(()=>{__vt.G.learn={t1:true,t2:true,s0:true,s1:true};__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.s2);document.getElementById('pModo').click();});
      sc=await ev(()=>({w:document.documentElement.scrollWidth,iw:innerWidth,p:document.getElementById('painel').scrollWidth,pc:document.getElementById('painel').clientWidth}));
      t.ok(sc.w<=sc.iw+1&&sc.p<=sc.pc+1,'com o painel aberto no modo Escrever, sem rolagem horizontal',sc);
      t.ok(!logs.length,'sem erros',logs);
    }catch(err){t.ok(false,'erro no teste (aplicativo): '+err.message);}
    await browser.close();}
  /* 3) teclado virtual simulado: a área visível encolhe 340 px */
  {const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true,antes:()=>{
      const vv=new EventTarget();vv.height=innerHeight;vv.width=innerWidth;vv.offsetTop=0;vv.offsetLeft=0;vv.scale=1;
      Object.defineProperty(window,'visualViewport',{configurable:true,get:()=>vv});window.__vv=vv;}});
    const ev=(f,a)=>page.evaluate(f,a);
    try{
      await ev(()=>document.getElementById('btnNew').click());
      await ev(()=>{__vt.G.learn={t1:true,t2:true,s0:true,s1:true};__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.s2);document.getElementById('pModo').click();document.getElementById('pTxt').focus();});
      await ev(()=>{window.__vv.height=innerHeight-340;window.__vv.dispatchEvent(new Event('resize'));});await page.waitForTimeout(120);
      const r=await ev(()=>{const vis=innerHeight-340,q=id=>document.getElementById(id).getBoundingClientRect();const p=q('painel'),tx=q('pTxt'),run=q('pRun');
        return{teclado:document.body.classList.contains('teclado'),vis,painelBaixo:Math.round(p.bottom),txt:[Math.round(tx.top),Math.round(tx.bottom)],run:[Math.round(run.top),Math.round(run.bottom)]};});
      t.ok(r.teclado&&r.painelBaixo<=r.vis+1,'com o teclado aberto, o painel fica inteiro acima dele',r);
      t.ok(r.run[1]<=r.vis+1&&r.run[0]>=0,'o botão Executar continua visível acima do teclado',r);
      t.ok(r.txt[0]>=0&&r.txt[0]<r.vis-40,'o campo de código continua visível acima do teclado',r);
      await ev(()=>{window.__vv.height=innerHeight;window.__vv.dispatchEvent(new Event('resize'));});
      const f=await ev(()=>document.body.classList.contains('teclado'));t.ok(!f,'teclado fechado: o painel volta ao normal');
      t.ok(!logs.length,'sem erros',logs);
    }catch(err){t.ok(false,'erro no teste (teclado): '+err.message);}
    await browser.close();}
  t.done();
})();
