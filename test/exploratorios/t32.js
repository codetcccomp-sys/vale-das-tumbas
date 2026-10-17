const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  const look=async(name,x,z,dx,dz,yaw)=>{await ev(([x,z,dx,dz,yaw])=>{__vt.G.time=0.2;__vt.tp(x+dx,z+dz);__vt.cam.yaw=yaw;__vt.cam.pitch=0.28;__vt.sim(40);},[x,z,dx,dz,yaw]);await shot(name);};
  // yaw: câmera fica em +sin(yaw),+cos(yaw) do jogador, olhando para o jogador; para olhar na direção -z use yaw=0
  await look('112-bau-dia',-121,43,0,9,0);
  await look('113-fragmento-dia',-127,-37,0,9,0);
  await look('114-inscricao-dia',-24,98,0,9,0);
  await ev(()=>{__vt.G.time=0.75;});
  await look('115-bau-noite',-121,43,0,10,0);
  await ev(()=>{__vt.G.time=0.75;__vt.sim(5);});await shot('115b-noite');
  await look('116-fragmento-perto',93,-127,0,4,0);
  // mapa parcial: só o nordeste
  await ev(()=>{__vt.G.sec.f_ne=true;});
  await page.click('#btnDiary');await page.waitForTimeout(100);await page.click('#tabMap');await page.waitForTimeout(100);await shot('117-mapa-parcial');
  P('nota parcial: '+await ev(()=>document.getElementById('mapNote').textContent));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
