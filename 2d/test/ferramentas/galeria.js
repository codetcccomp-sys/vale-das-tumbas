// Galeria de capturas: cada área e cada tipo de painel, em pé e deitado.
const {open}=require('../lib');const {ui}=require('../ui');const path=require('path');
(async()=>{
  const dir=process.argv[2];const W=+process.argv[3]||412,H=+process.argv[4]||860,dpr=+process.argv[5]||2,pref=process.argv[6]||'r';
  const {browser,page,logs}=await open({viewport:{width:W,height:H},dpr,touch:true});
  const U=ui(page),ev=U.ev;const foto=async n=>{await page.waitForTimeout(250);await page.screenshot({path:path.join(dir,pref+'_'+n+'.png')});};
  await ev(()=>document.getElementById('btnNew').click());await ev(()=>{__vt.G.learn={s0:true,s1:true,s2:true,d0:true,d1:true,d2:true,d3:true,d4:true,d5:true,a0:true,a1:true,a2:true,b0:true,b1:true,b2:true,b3:true,b4:true};toastClear();});
  await ev(()=>{__vt.ir(91*16,138*16,'cima');__vt.quadros(30);});await foto('vale');
  await ev(()=>{__vt.G.time=0.75;__vt.ir(66*16,140*16,'cima');__vt.quadros(10);});await foto('noite');
  await ev(()=>{__vt.G.time=0.2;__vt.ir(130*16+8,60*16,'cima');__vt.quadros(10);});await foto('portaSteam');
  await ev(()=>{__vt.ir(90*16+8,46*16,'cima');__vt.quadros(10);});await foto('piramide');
  for(const[k,x,y,cfg,extra]of[['steam',17*16+8,13*16+6,'s2',''],['diesel',14*16+8,13*16+6,'d5',''],['atom',14*16+8,14*16+6,'a1',''],['bio',14*16+8,14*16+6,'b4',''],['final',14*16+8,15*16+6,'c1','']]){
    await ev(k=>{fecharPainel();__vt.entrar(k);__vt.G.lanternOn=true;toastClear();},k);
    await ev(([x,y])=>{__vt.ir(x,y+40,'cima');__vt.quadros(20);},[x,y]);await foto(k);
    await ev(([x,y,cfg])=>{__vt.usarEm(x,y,'cima');const d=__vt.DESAFIO[cfg];escolherDesafio(d);},[x,y,cfg]);
    await ev(()=>__vt.velocidade(1));await foto(k+'_painel');
  }
  await ev(()=>{fecharPainel();__vt.entrar('diesel');__vt.usarEm(14*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.d1);toastClear();});await foto('classificar');
  if(logs.length)console.log('LOGS',logs.slice(0,4).join('\n'));
  await browser.close();console.log('ok');
})();
