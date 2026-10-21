// Bússola: seta na borda da tela (só com o alvo fora da tela, com nome e distância, sem cobrir HUD, avisos nem botões de toque;
// some com o painel aberto). Sem marca embaixo do explorador. Celular em pé, deitado e computador.
const {open}=require('./lib');const {suite}=require('./assert');
const t=suite('b20-bussola');
const TELAS=[{n:'360×640 toque',v:{width:360,height:640},dpr:2,touch:true},{n:'640×360 toque',v:{width:640,height:360},dpr:2,touch:true},{n:'1280×800',v:{width:1280,height:800},dpr:1}];
(async()=>{
  for(const T of TELAS){
    const {browser,page,logs}=await open({viewport:T.v,dpr:T.dpr,touch:T.touch});
    const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},180000);
    const ev=(f,a)=>page.evaluate(f,a);
    try{
    await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(250);
    await ev(()=>{G.treino.feito=true;G.mode='play';__vt.quadros(10);});
    /* estado da bússola depois de posicionar o explorador num ponto relativo ao alvo */
    const ler=(d)=>ev(d=>{
      const go=objetivo();if(d)__vt.ir(go.alvo.x+d[0],go.alvo.y+d[1],'baixo');__vt.quadros(3);
      const e=document.getElementById('bordaAlvo'),k=R.k/R.dpr,s=e.firstChild.getBoundingClientRect(),l=e.lastChild.getBoundingClientRect();
      const caixas=[];for(const id of['hl','hr','bUse','bVer','bLan']){const x=document.getElementById(id);if(x&&x.offsetParent){const q=x.getBoundingClientRect();if(q.width&&q.height)caixas.push([id,q]);}}
      for(const x of document.getElementById('msgs').children){const q=x.getBoundingClientRect();if(q.width)caixas.push(['aviso',q]);}
      const cruza=(a)=>caixas.filter(([,q])=>!(a.right<=q.left||a.left>=q.right||a.bottom<=q.top||a.top>=q.bottom)).map(c=>c[0]);
      const dentro=a=>a.left>=0&&a.top>=0&&a.right<=innerWidth&&a.bottom<=innerHeight;
      const ax=s.left+s.width/2,ay=s.top+s.height/2,hx=(G.p.x+R.ox)*k,hy=(G.p.y-12+R.oy)*k,tx=(go.alvo.x+R.ox)*k,ty=(go.alvo.y+R.oy)*k;
      /* a seta está na linha explorador → alvo e aponta para o alvo */
      const dir=Math.atan2(ty-hy,tx-hx),pos=Math.atan2(ay-hy,ax-hx),daSeta=Math.atan2(ty-ay,tx-ax),dif=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
      const naTela=go.alvo.x+R.ox>4&&go.alvo.x+R.ox<R.W-4&&go.alvo.y+R.oy>10&&go.alvo.y+R.oy<R.H-4;
      return{vis:!e.hidden,naTela,dist:Math.hypot(go.alvo.x-G.p.x,go.alvo.y-G.p.y),nome:e.lastChild.firstChild.textContent,m:e.lastChild.lastChild.textContent,alvo:go.alvo.txt,
        sDentro:dentro(s),lDentro:dentro(l),sCruza:cruza(s),lCruza:e.lastChild.hidden?[]:cruza(l),lVis:!e.lastChild.hidden,difPos:dif(pos,dir),difAng:dif(+e.dataset.ang,daSeta),rot:e.firstChild.style.transform,
        cor:getComputedStyle(e).getPropertyValue('--c').trim(),corGo:go.cor||'#ffd24a',
        rotPessoa:(()=>{const l2=e.lastChild.getBoundingClientRect(),hk=10*k;return!(l2.right<=hx-hk||l2.left>=hx+hk||l2.bottom<=hy-hk||l2.top>=hy+hk);})()};},d);

    /* com avisos na tela: a seta nunca fica por baixo deles (recua, vai para outro ponto da borda ou espera) */
    const DIRS=[[0,520],[520,0],[0,-520],[-520,0],[400,400],[-400,400],[400,-400],[-400,-400]];
    let sob=[];for(const d of DIRS){await ev(()=>toast('Um aviso de teste com texto comprido o bastante para ocupar duas linhas no celular.'));const r=await ler(d);if(r.vis&&(r.sCruza.length||r.lCruza.length))sob.push({d,s:r.sCruza,l:r.lCruza});}
    t.ok(!sob.length,T.n+': com avisos na tela, em 8 direções, a seta e o rótulo não ficam por baixo de aviso, HUD nem botão',sob);
    await ev(()=>{for(const x of TOASTS.on.slice())toastOut(x,performance.now(),true);TOASTS.queue.length=0;});
    /* longe, em 8 direções em volta do alvo (sem avisos) */
    const _DIRS=[[0,520],[520,0],[0,-520],[-520,0],[400,400],[-400,400],[400,-400],[-400,-400]];
    let ok=0,falhas=[];
    for(const d of DIRS){const r=await ler(d);
      const bom=r.vis&&!r.naTela&&r.sDentro&&r.lDentro&&!r.sCruza.length&&!r.lCruza.length&&r.lVis&&r.difPos<(T.v.height<400?0.9:0.06)&&r.difAng<0.02&&!r.rotPessoa;
      if(bom)ok++;else falhas.push({d,...r});}
    t.ok(ok===DIRS.length,T.n+': com o alvo fora da tela, em 8 direções, a seta e o rótulo aparecem na borda, na linha do explorador ao alvo (deitado, até 50° dela quando o HUD cobre a linha), apontando para ele, sem cobrir HUD, avisos, botões nem o explorador',falhas.length?falhas:ok);
    let r=await ler([400,-400]);
    t.ok(r.nome===r.alvo&&/^≈ \d+ m$/.test(r.m)&&+r.m.match(/\d+/)[0]===Math.max(1,Math.round(r.dist/16)),T.n+': o rótulo da seta traz o nome do alvo e a distância em metros (1 m = 1 bloco)',{nome:r.nome,m:r.m,dist:r.dist});
    t.ok(r.cor.toLowerCase()===r.corGo.toLowerCase(),T.n+': a seta usa a cor do objetivo (a mesma da trilha)',{cor:r.cor,go:r.corGo});

    /* alvo na tela: a seta da borda some (o marcador ◆ assume) */
    r=await ler([0,60]);
    t.ok(r.naTela&&!r.vis,T.n+': alvo na tela: a seta da borda some (o marcador ◆ assume)',{naTela:r.naTela,vis:r.vis});

    /* painel aberto: nada de bússola */
    const antes=(await ler([400,-400])).vis;
    const p=await ev(()=>{__vt.painel('steam');__vt.quadros(3);return{modo:G.mode,vis:!document.getElementById('bordaAlvo').hidden};});
    t.ok(antes&&p.modo==='painel'&&!p.vis,T.n+': com o painel de programação aberto, a seta some',{antes,...p});
    await ev(()=>{fecharPainel();__vt.quadros(3);});
    t.done(logs);
    }catch(e){console.log('  FALHA  '+e.message);process.exitCode=1;}
    clearTimeout(vigia);await browser.close();
  }
})();
