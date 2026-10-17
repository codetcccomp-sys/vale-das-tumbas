const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  const info=()=>ev(()=>({done:__vt.cty.done.join(','),lvl:+__vt.cty.lvl.toFixed(2),r:__vt.cty.room.state+':'+__vt.cty.room.prog,g:+__vt.cty.gates[1].open.toFixed(2),mode:__vt.G.mode}));
  const press=(x,z)=>ev(([x,z])=>{__vt.tp(x,z);__vt.sim(3);__vt.use();__vt.sim(3);},[x,z]);
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.relics.steam=__vt.G.relics.diesel=__vt.G.relics.atom=__vt.G.relics.bio=true;__vt.tp(0,-125);__vt.sim(5);__vt.use();__vt.sim(150);
    const c=__vt.cty;for(let i=0;i<3;i++)c.done[i]=true;c.gates[0].latched=true;c.gates[0].open=1;c.gates[0].fl.position.x=-4.62;c.gates[0].fr.position.x=4.62;c.gates[0].c.on=false;c.lvl=0.75;});
  // ---- SEÇÃO 4: sequência [1,3,0,2,3] -> x = -2, 6, -6, 2, 6 (z=-122)
  await ev(()=>{__vt.tp(0,-117);__vt.sim(3);});P('auto-play ao entrar: '+JSON.stringify(await info()));
  await ev(()=>__vt.sim(420));P('depois da canção: '+JSON.stringify(await info()));
  await press(-6,-120.2);P('nó errado: '+JSON.stringify(await info())+' msg='+await last());
  await press(-2,-120.2);await press(6,-120.2);await press(-6,-120.2);await press(2,-120.2);P('4/5: '+JSON.stringify(await info()));
  await press(6,-120.2);P('resolvida: '+JSON.stringify(await info())+' msg='+await last());
  await ev(()=>__vt.sim(200));P('porta final aberta: '+JSON.stringify(await info())+' col='+await ev(()=>__vt.cty.gates[1].c.on));
  await ev(()=>__vt.sim(300));P('teto da escada: slab4='+await ev(()=>__vt.cty.slabs[4].open.toFixed(2))+' lvl='+(await info()).lvl);
  // escada: andar para cima
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.35;__vt.tp(0,-131);__vt.key('w',true);__vt.sim(140);});
  await shot('98-escada');
  const a=await st();await ev(()=>{__vt.sim(1100);});const b=await st();await ev(()=>__vt.key('w',false));
  P('subindo a escada: depois de 2,3 s '+JSON.stringify({z:+a.z.toFixed(1),y:+a.y.toFixed(2)})+' | depois de ~20 s '+JSON.stringify({z:+b.z.toFixed(1),y:+b.y.toFixed(2),mode:b.mode}));
  P('modo depois de chegar ao terraço: '+await ev(()=>__vt.G.mode)+' | body.cine='+await ev(()=>document.body.classList.contains('cine')));
  await ev(()=>__vt.sim(60));await shot('99-fim-0s');
  P('HUD oculto na cena: '+await ev(()=>getComputedStyle(document.getElementById('hud')).display));
  await ev(()=>__vt.sim(60*5));await shot('100-fim-5s');
  P('texto 1: "'+await ev(()=>document.getElementById('endLine').textContent)+'"');
  await ev(()=>__vt.sim(60*7));await shot('101-fim-12s');
  P('texto 2: "'+await ev(()=>document.getElementById('endLine').textContent)+'"');
  await ev(()=>__vt.sim(60*4));await shot('102-fim-16s');
  P('texto 3: "'+await ev(()=>document.getElementById('endLine').textContent)+'"');
  await ev(()=>__vt.sim(60*6));
  P('tela FIM: modo='+await ev(()=>__vt.G.mode)+' scEnd visível='+await ev(()=>!document.getElementById('scEnd').hidden)+' save.done='+await ev(()=>JSON.parse(localStorage.getItem('vale_das_tumbas_save')).done));
  await shot('103-fim-tela');
  P('draw calls na cena final: '+await ev(()=>{__vt.renderOnce();return __vt.renderer.info.render.calls;}));
  // voltar ao vale
  await page.click('#eVale');await page.waitForFunction(()=>__vt.G.mode==='play',{timeout:8000});
  P('Voltar ao vale: '+JSON.stringify(await st())+' far='+await ev(()=>__vt.camera.far));
  // continuar com o save
  await page.reload();await page.waitForFunction(()=>window.__vt);await page.click('#btnContinue');await page.waitForFunction(()=>__vt.G.mode==='play');
  P('continuar após o fim: finished='+await ev(()=>__vt.G.finished)+' relíquias='+JSON.stringify(await ev(()=>__vt.G.relics)));
  // Jogar de novo (2 toques)
  await ev(()=>{__vt.tp(0,-125);__vt.sim(5);__vt.use();__vt.sim(150);});
  await ev(()=>{const c=__vt.cty;c.done=[true,true,true,true];__vt.G.p.y=8;__vt.tp(0,-170,8);__vt.sim(5);});
  P('reentrou e foi ao terraço: modo='+await ev(()=>__vt.G.mode));
  await ev(()=>__vt.sim(60*25));
  await page.click('#eAgain');P('1º toque em Jogar de novo: "'+await ev(()=>document.getElementById('eAgain').textContent)+'" modo='+await ev(()=>__vt.G.mode));
  await page.click('#eAgain');await page.waitForTimeout(300);
  P('2º toque: modo='+await ev(()=>__vt.G.mode)+' área='+(await st()).area+' relíquias='+JSON.stringify(await ev(()=>__vt.G.relics))+' finished='+await ev(()=>__vt.G.finished));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
