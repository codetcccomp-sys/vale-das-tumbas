const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  P('draw calls no Vale (acampamento, olhando ao norte): '+await ev(()=>{__vt.tp(0,150);__vt.cam.yaw=0;__vt.sim(5);__vt.renderOnce();return __vt.renderer.info.render.calls;}));
  P('draw calls junto ao baú c1: '+await ev(()=>{const c=SEC_CHESTS[0];__vt.tp(c.x,c.z+6);__vt.cam.yaw=0;__vt.sim(5);__vt.renderOnce();return __vt.renderer.info.render.calls;}));
  // coleta parcial
  await ev(()=>{for(const id of['f_nw','f_se']){const f=SEC_FRAGS.find(x=>x.id===id);__vt.tp(f.x,f.z+2);__vt.sim(3);__vt.use();__vt.sim(3);}
    for(const id of['c1','c4']){const c=SEC_CHESTS.find(x=>x.id===id);__vt.tp(c.x,c.z+2);__vt.sim(3);__vt.use();__vt.sim(3);}
    const d=SEC_INSC[1];__vt.tp(d.x,d.z+2);__vt.sim(3);__vt.use();__vt.sim(3);__vt.saveNow();});
  P('antes de recarregar: '+await ev(()=>JSON.stringify(__vt.G.sec))+' contagem='+await ev(()=>secCount()));
  P('save: '+await ev(()=>JSON.stringify(JSON.parse(localStorage.getItem('vale_das_tumbas_save')).sec)));
  await page.reload();await page.waitForFunction(()=>window.__vt);await page.click('#btnContinue');await page.waitForFunction(()=>__vt.G.mode==='play');
  P('depois de continuar: '+await ev(()=>JSON.stringify(__vt.G.sec))+' contagem='+await ev(()=>secCount()));
  P('visuais: fragmentos visíveis='+await ev(()=>secObjs.frags.map(o=>o.g.visible).join(','))+' | baús abertos='+await ev(()=>secObjs.chests.map(o=>o.open).join(',')));
  P('rótulo no baú já aberto: '+await ev(()=>{const c=SEC_CHESTS[0];__vt.tp(c.x,c.z+2);__vt.sim(5);__vt.renderOnce();return document.getElementById('prompt').style.display;})+' (esperado none)');
  P('rótulo no baú fechado: '+await ev(()=>{const c=SEC_CHESTS[1];__vt.tp(c.x,c.z+2);__vt.sim(5);__vt.renderOnce();return document.getElementById('prompt').textContent;}));
  // save antigo (sem o campo sec) continua funcionando
  await ev(()=>{const s=JSON.parse(localStorage.getItem('vale_das_tumbas_save'));delete s.sec;delete s.done;localStorage.setItem('vale_das_tumbas_save',JSON.stringify(s));__vt.start(false);__vt.sim(3);});
  P('save antigo: sec='+await ev(()=>JSON.stringify(__vt.G.sec))+' modo='+await ev(()=>__vt.G.mode)+' visuais='+await ev(()=>secObjs.frags.map(o=>o.g.visible).join(',')));
  // novo jogo apaga os segredos
  await ev(()=>{__vt.start(true);});
  P('novo jogo: contagem='+await ev(()=>secCount())+' fragmentos visíveis='+await ev(()=>secObjs.frags.map(o=>o.g.visible).join(','))+' baús='+await ev(()=>secObjs.chests.map(o=>o.open).join(',')));
  // navegação do diário por teclado
  await ev(()=>{__vt.tp(0,150);});
  await page.keyboard.press('j');await page.waitForFunction(()=>__vt.G.mode==='diary');
  P('J abre o diário: modo='+await ev(()=>__vt.G.mode)+' aba ativa='+await ev(()=>document.querySelector('.tab.on').textContent));
  await page.click('#tabMap');P('aba Mapa: canvas visível='+await ev(()=>!document.getElementById('mapBox').hidden)+' lista oculta='+await ev(()=>document.getElementById('diaryList').hidden));
  await page.click('#dClose');await page.waitForFunction(()=>__vt.G.mode==='play');await page.keyboard.press('j');await page.waitForFunction(()=>__vt.G.mode==='diary');
  P('reabrir volta às anotações: '+await ev(()=>document.querySelector('.tab.on').textContent));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
