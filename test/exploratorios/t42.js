const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:420,height:640}});const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.time=0.22;__vt.tp(-30,120);__vt.sim(5);document.body.classList.remove('playing');document.getElementById('msgs').innerHTML='';});
  const views=[['frente',Math.PI],['tres-quartos',Math.PI*0.78],['lado',Math.PI/2],['costas',0.0]];
  for(const[n,yaw]of views){
    await ev((yaw)=>{const p=__vt.G.p;p.face=Math.PI;p.speed=0;__vt.cam.want=2.7;__vt.cam.cur=2.7;__vt.cam.yaw=yaw;__vt.cam.pitch=0.1;__vt.sim(2);__vt.G.p.face=Math.PI;__vt.renderOnce();},yaw);
    await page.screenshot({path:ROOT+'/test/shots/140-explorador-'+n+'.png'});
  }
  // andando
  await ev(()=>{const p=__vt.G.p;p.face=Math.PI;__vt.cam.yaw=Math.PI*0.75;__vt.key('w',false);p.anim=1.2;p.speed=4.3;__vt.renderOnce();});
  await page.screenshot({path:ROOT+'/test/shots/141-explorador-andando.png'});
  console.log('draw calls (só o personagem perto, olhando para o céu): '+await ev(()=>{__vt.cam.pitch=-0.15;__vt.renderOnce();return __vt.renderer.info.render.calls;}));
  console.log('malhas do personagem: '+await ev(()=>{let n=0,tri=0;__vt.scene.traverse(o=>{});return 0;}));
  console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
  await browser.close();
})();
