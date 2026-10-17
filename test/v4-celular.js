// Etapa 4: celular. HUD sem sobreposição em pé e deitado (inclusive 300 px de largura), textos legíveis,
// toque simultâneo (andar + olhar + botão), dica das zonas de toque, instruções do método de entrada, tela cheia.
const {open}=require('./lib');const {suite}=require('./assert');
const VPS=[{width:412,height:860},{width:360,height:740},{width:300,height:640},{width:844,height:390},{width:740,height:360},{width:640,height:360}];
const HUD=['hearts','relics','goal','compass','lantern','btnDiary','btnMenu','prompt','bUse','bJump','bRun','bLight'];
(async()=>{
  const S=suite('celular');let allLogs=[];
  for(const vp of VPS){
    const {browser,page,logs}=await open({viewport:vp});const ev=(f,a)=>page.evaluate(f,a);
    await ev(()=>{__vt.start(true);__vt.sim(5);});
    for(const where of['vale','steam','final']){
      await ev(([where,HUD])=>{
        if(where!=='vale'){__vt.enter(where);let n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}}
        toastClear();toast('Você caiu no vão. Voltando à entrada: use um ponto de energia para salvar mais perto.','warn');toast('Diário atualizado: Tumba das Engrenagens');toast('Gerador ligado. Ponto de controle salvo e lanterna recarregada.','good');
        /* um aviso de interação visível */
        const it=__vt.G.area.interact[0];__vt.tp(it.x,it.z+(where==='vale'?0:-0.5));__vt.sim(2);__vt.renderOnce();},[where,HUD]);
      await page.waitForTimeout(700);
      const r=await ev(([where,HUD])=>{
        const W=innerWidth,H=innerHeight,R={},small=[];
        for(const id of HUD.concat(['msgs'])){let el=document.getElementById(id);if(id==='hearts'||id==='relics')el=el.parentElement;const cs=getComputedStyle(el);const b=el.getBoundingClientRect();
          if(b.width>0&&cs.display!=='none'&&cs.visibility!=='hidden')R[id]=[b.left,b.top,b.right,b.bottom];}
        for(const el of document.querySelectorAll('#hud .chip, #hud .toast, #prompt, .tbtn')){const cs=getComputedStyle(el);if(el.getBoundingClientRect().width>0&&parseFloat(cs.fontSize)<11.5)small.push(el.id||el.className);}
        const ov=[],out=[];const k=Object.keys(R);
        for(let i=0;i<k.length;i++){const a=R[k[i]];if(a[0]<-0.5||a[1]<-0.5||a[2]>W+0.5||a[3]>H+0.5)out.push(k[i]);
          for(let j=i+1;j<k.length;j++){const b=R[k[j]];if(a[0]<b[2]-1&&b[0]<a[2]-1&&a[1]<b[3]-1&&b[1]<a[3]-1)ov.push(k[i]+'×'+k[j]);}}
        const tap=['bUse','bJump','bRun','bLight'].filter(id=>{const b=document.getElementById(id).getBoundingClientRect();return b.width<44||b.height<44;});
        const res={ov:ov.map(p=>p+' '+p.split('×').map(k=>R[k].map(Math.round).join(',')).join(' | ')+' n='+document.querySelectorAll('#msgs .toast').length+' lim='+msgsLimit()),out,small,tap,prompt:!!R.prompt,toasts:document.querySelectorAll('#msgs .toast').length};
        if(where!=='vale'){__vt.exit(false);let n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}}
        return res;},[where,HUD]);
      const tag=vp.width+'×'+vp.height+' '+where;
      S.ok(r.ov.length===0,tag+': nenhum elemento do HUD sobreposto (com avisos e aviso de interação)',r.ov);
      S.ok(r.out.length===0,tag+': tudo dentro da tela',r.out);
      S.ok(r.small.length===0&&r.tap.length===0,tag+': textos ≥ 11,5 px e botões de toque ≥ 44 px',{small:r.small,tap:r.tap});
    }
    allLogs=allLogs.concat(logs);
    await browser.close();
  }

  // toque simultâneo: joystick + câmera + botão Pular, pelos eventos de toque do navegador (CDP)
  {
    const {browser,page,logs}=await open({viewport:{width:412,height:860}});const ev=(f,a)=>page.evaluate(f,a);
    await ev(()=>{__vt.start(true);__vt.sim(5);__vt.tp(0,120);__vt.G.p.face=Math.PI;__vt.cam.yaw=0;});
    const hint0=await ev(()=>({shown:!document.getElementById('zoneHint').hidden,l:document.querySelector('#zoneHint .zl').classList.contains('off'),r:document.querySelector('#zoneHint .zr').classList.contains('off')}));
    S.ok(hint0.shown&&!hint0.l&&!hint0.r,'ao começar no toque, a dica das duas zonas aparece',hint0);
    const cdp=await page.context().newCDPSession(page);
    const T=(type,pts)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pts});
    const s0=await ev(()=>({x:__vt.G.p.x,z:__vt.G.p.z,yaw:__vt.cam.yaw}));
    const A={x:90,y:640,id:1},B={x:300,y:330,id:2};
    await T('touchStart',[A]);await T('touchStart',[A,B]);
    for(let i=1;i<=8;i++){await T('touchMove',[{x:90,y:640-i*8,id:1},{x:300-i*8,y:330,id:2}]);await page.waitForTimeout(30);}
    const mid=await ev(()=>({joy:__vt.IN.joy.y,yaw:__vt.cam.yaw,cams:__vt.IN.cams.size}));
    const jb=await ev(()=>{const b=document.getElementById('bJump').getBoundingClientRect();return{x:b.left+b.width/2,y:b.top+b.height/2};});
    const y0=await ev(()=>__vt.G.p.y);
    await T('touchStart',[{x:90,y:576,id:1},{x:236,y:330,id:2},{x:jb.x,y:jb.y,id:3}]);
    await page.waitForTimeout(120);
    const air=await ev(()=>({vy:__vt.G.p.vy,y:__vt.G.p.y,joy:__vt.IN.joy.y,cams:__vt.IN.cams.size}));
    await page.waitForTimeout(600);
    const moved=await ev(()=>({x:__vt.G.p.x,z:__vt.G.p.z,yaw:__vt.cam.yaw}));
    await T('touchEnd',[]);await page.waitForTimeout(100);
    const end=await ev(()=>({joy:[__vt.IN.joy.x,__vt.IN.joy.y,__vt.IN.joy.id],cams:__vt.IN.cams.size,l:document.querySelector('#zoneHint .zl').classList.contains('off'),r:document.querySelector('#zoneHint .zr').classList.contains('off')}));
    S.ok(mid.joy>0.5&&mid.cams===1&&Math.abs(mid.yaw-s0.yaw)>0.2,'dois dedos ao mesmo tempo: joystick e câmera respondem juntos',mid);
    S.ok((air.vy>0.5||air.y>y0+0.2)&&air.joy>0.5&&air.cams===1,'terceiro dedo no Pular: pula sem soltar joystick nem câmera',air);
    S.ok(Math.hypot(moved.x-s0.x,moved.z-s0.z)>1.5,'o personagem andou enquanto olhava e pulava',{de:s0,para:moved});
    S.ok(end.joy[0]===0&&end.joy[1]===0&&end.joy[2]===null&&end.cams===0,'ao soltar, nada fica preso',end);
    S.ok(end.l&&end.r,'a dica de cada zona some depois de usada',end);
    const ctl=await ev(()=>({start:document.getElementById('ctlStart').textContent,fs:!!(document.fullscreenEnabled||document.webkitFullscreenEnabled),
      fsBtn:!document.getElementById('pFull').hidden}));
    S.ok(/Joystick esquerdo/.test(ctl.start)&&/Arrastar à direita/.test(ctl.start),'instruções de toque no modo toque',ctl.start.slice(0,80));
    S.ok(ctl.fsBtn===ctl.fs,'botão de tela cheia só aparece quando a página permite',ctl);
    allLogs=allLogs.concat(logs);await browser.close();
  }
  {
    const {browser,page,logs}=await open({viewport:{width:1280,height:800},touch:false});const ev=(f,a)=>page.evaluate(f,a);
    await page.keyboard.press('w');
    const kb=await ev(()=>{__vt.start(true);__vt.sim(5);return{ctl:document.getElementById('ctlStart').textContent,hint:document.getElementById('zoneHint').hidden,body:document.body.classList.contains('touch')};});
    S.ok(/W A S D/.test(kb.ctl)&&kb.hint&&!kb.body,'no teclado: instruções de teclado, sem dica de toque',kb);
    allLogs=allLogs.concat(logs);await browser.close();
  }
  S.done(allLogs);
})();
