const {open,ROOT}=require('../lib');
(async()=>{
  const P=s=>console.log(s);
  const {browser,page,logs}=await open();
  const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  // 1) apertar Usar muitas vezes na porta: entra uma vez só
  const spam=await ev(()=>{__vt.tp(106.6,90);__vt.sim(5);let n=0;for(let i=0;i<30;i++){__vt.use();__vt.sim(1);if(__vt.G.mode==='transition')n++;__vt.key(' ',false);__vt.press('jump');}__vt.sim(200);return {area:__vt.G.area.name,mode:__vt.G.mode,hearts:__vt.G.hearts,z:__vt.G.p.z,cur:__vt.G.curTomb};});
  P('Usar+Pular 30x na porta: '+JSON.stringify(spam));
  // 2) entrar e sair 6 vezes em cada tumba
  for(const [key,x,z] of [['steam',94,-90],['diesel',-134,-10],['atom',-94,100],['bio',104,90]]){
    const r=await ev(([key,x,z])=>{const res=[];for(let i=0;i<6;i++){
      __vt.G.mode==='play'||(__vt.G.mode='play');
      if(__vt.G.area!==__vt.valeArea){__vt.exit(false);__vt.sim(200);}
      __vt.tp(x+(x>0?-0.0:0),z);__vt.G.hearts=3;__vt.sim(5);
      // chega perto da porta: a posição de interação fica a 3,4 m da torre
      const T=__vt.TOMBS[key];__vt.tp(T.x+T.face[0]*3.4,T.z+T.face[1]*3.4);__vt.sim(5);__vt.use();__vt.sim(150);
      const inside=__vt.G.area.name===key||__vt.G.area.name===(key==='steam'?'steam':key);
      __vt.use();// sai? (na posição inicial o prompt é a saída)
      __vt.G.p.z=6.5;__vt.G.p.x=0;__vt.sim(5);__vt.use();__vt.sim(200);
      res.push(inside+'>'+__vt.G.area.name);}
      return res.join(' ');},[key,x,z]);
    P(key+': 6x entrar/sair: '+r);
  }
  // 3) ficar parado 2 minutos no Vale e depois 2 minutos dentro da tumba
  const m0=await ev(()=>({g:__vt.renderer.info.memory.geometries,t:__vt.renderer.info.memory.textures}));
  await ev(()=>{if(__vt.G.area!==__vt.valeArea){__vt.exit(false);__vt.sim(200);}__vt.G.mode='play';__vt.tp(0,150);__vt.G.time=0.1;__vt.sim(60*120);});
  P('parado 2 min no Vale: hora do dia='+await ev(()=>__vt.G.time.toFixed(3))+' modo='+await ev(()=>__vt.G.mode));
  await ev(()=>{__vt.tp(94,-90);const T=__vt.TOMBS.steam;__vt.tp(T.x+T.face[0]*3.4,T.z+T.face[1]*3.4);__vt.sim(5);__vt.use();__vt.sim(150);__vt.G.lanternOn=true;__vt.sim(60*125);});
  P('parado 2 min na tumba: lanterna='+await ev(()=>__vt.G.lantern.toFixed(1))+' acesa='+await ev(()=>__vt.G.lanternOn)+' corações='+await ev(()=>__vt.G.hearts)+' área='+await ev(()=>__vt.G.area.name));
  const m1=await ev(()=>({g:__vt.renderer.info.memory.geometries,t:__vt.renderer.info.memory.textures}));
  P('memória GPU antes/depois: '+JSON.stringify(m0)+' -> '+JSON.stringify(m1));
  // 4) varredura de travamentos no Vale
  await ev(()=>{__vt.exit(false);__vt.sim(200);__vt.G.mode='play';});
  const stuck=await ev(()=>{
    const bad=[];let seed=12345;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(let t=0;t<60;t++){
      const a=rnd()*Math.PI*2,d=Math.sqrt(rnd())*185;let x=Math.cos(a)*d,z=Math.sin(a)*d;
      const r=pushOut(__vt.valeArea,x,z,terrainH(x,z),PR,PH);x=r[0];z=r[1];__vt.tp(x,z);__vt.G.hearts=3;
      __vt.cam.yaw=rnd()*Math.PI*2;__vt.sim(3);__vt.key('w',true);
      let last=[__vt.G.p.x,__vt.G.p.z],stuckN=0,maxStuck=0;
      for(let i=0;i<420;i++){
        if(i%40===0)__vt.cam.yaw+=(rnd()-0.5)*1.2;
        if(i%25===0)__vt.press('jump');
        __vt.sim(1);
        if(i%30===29){const m=Math.hypot(__vt.G.p.x-last[0],__vt.G.p.z-last[1]);if(m<1.2)stuckN++;else stuckN=0;maxStuck=Math.max(maxStuck,stuckN);last=[__vt.G.p.x,__vt.G.p.z];}
      }
      __vt.key('w',false);
      if(maxStuck>=3)bad.push({from:[+x.toFixed(0),+z.toFixed(0)],at:[+__vt.G.p.x.toFixed(0),+__vt.G.p.z.toFixed(0)]});
    }
    return bad;});
  P('varredura do Vale (60 caminhadas aleatórias de 7 s): '+(stuck.length?stuck.length+' sem progresso: '+JSON.stringify(stuck):'nenhum travamento'));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
