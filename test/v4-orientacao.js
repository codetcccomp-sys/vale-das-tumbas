// Etapa 4: orientação no deserto. Cada trilha leva da estrada à porta da tumba e dá para percorrê-la andando;
// há marcos e placas; o mapa do diário desenha as trilhas; feixes e bússola mudam com o progresso.
const {open}=require('./lib');const {suite}=require('./assert');
(async()=>{
  const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);const S=suite('orientação');
  await ev(()=>{__vt.start(true);__vt.sim(5);});
  for(const key of['steam','diesel','atom','bio']){
    const r=await ev((key)=>{
      const t=TRAILS.find(q=>q.key===key),C=t.curve,T=__vt.TOMBS[key],A=__vt.valeArea;
      /* linha central livre de colisores e sem degraus */
      let blocked=0,maxStep=0;for(let i=0;i<C.length;i++){const[x,z]=C[i];const q=pushOut(A,x,z,terrainH(x,z),PR,PH);if(Math.hypot(q[0]-x,q[1]-z)>0.01)blocked++;if(i)maxStep=Math.max(maxStep,Math.abs(terrainH(x,z)-terrainH(C[i-1][0],C[i-1][1])));}
      /* andar de verdade, com o controle do personagem, seguindo a trilha */
      const G=__vt.G,p=G.p;__vt.tp(C[0][0],C[0][1]);let k=1,steps=0,stuck=0,last=[p.x,p.z],lastT=0;
      __vt.key('w',true);
      while(k<C.length&&steps<60*90){
        while(k<C.length-1&&Math.hypot(C[k][0]-p.x,C[k][1]-p.z)<2.2)k++;
        const dx=C[k][0]-p.x,dz=C[k][1]-p.z;__vt.cam.yaw=Math.atan2(-dx,-dz);camTouched();__vt.sim(1);steps++;
        if(steps-lastT>=120){if(Math.hypot(p.x-last[0],p.z-last[1])<1.5)stuck++;last=[p.x,p.z];lastT=steps;}
        if(k===C.length-1&&Math.hypot(C[k][0]-p.x,C[k][1]-p.z)<1.2)break;
      }
      __vt.key('w',false);__vt.sim(5);
      const dEntry=Math.hypot(p.x-T.entry.x,p.z-T.entry.z);
      return{pontos:C.length,blocked,maxStep:+maxStep.toFixed(2),seg:+(steps/60).toFixed(1),stuck,dEntry:+dEntry.toFixed(1)};},key);
    S.ok(r.blocked===0,key+': a linha da trilha não atravessa nenhum colisor',r);
    S.ok(r.maxStep<0.35,key+': sem degraus no caminho (maior desnível entre amostras < 0,35 m)',r.maxStep);
    S.ok(r.stuck===0&&r.dEntry<6,key+': andando pela trilha, chega à porta da tumba sem travar',r);
  }
  const info=await ev(()=>{
    const signs=__vt.valeArea.interact.filter(i=>/^Placa:/.test(i.label()||'')).map(i=>i.label());
    /* mapa com os quatro fragmentos: a cor de cada era aparece sobre a trilha desenhada */
    __vt.G.sec={f_nw:true,f_ne:true,f_sw:true,f_se:true};const cv=document.createElement('canvas');cv.width=360;cv.height=360;drawVMap(cv);
    const W=360,k=(W/2-16)/205,hit={},img=cv.getContext('2d').getImageData(0,0,W,W).data;
    for(const t of TRAILS){const T=__vt.TOMBS[t.key],c=parseInt(T.css.slice(1),16),cr=c>>16,cg=(c>>8)&255,cb=c&255;let n=0;
      for(const p of t.curve)for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const o=((Math.round(W/2+p[1]*k)+dy)*W+Math.round(W/2+p[0]*k)+dx)*4;if(Math.abs(img[o]-cr)+Math.abs(img[o+1]-cg)+Math.abs(img[o+2]-cb)<60)n++;}
      hit[t.key]=n;}
    /* feixes: dia mais forte; tumba vencida apagada; dourado cresce com as relíquias */
    __vt.G.time=0.3;__vt.G.relics={steam:true,diesel:false,atom:false,bio:false};__vt.sim(2);
    const op={};for(const b of beams)op[b.userData.key]=+b.material.opacity.toFixed(3);
    __vt.G.relics={steam:true,diesel:true,atom:true,bio:true};__vt.sim(2);const fin4=+beams.find(b=>b.userData.key==='final').material.opacity.toFixed(3);
    __vt.G.relics={steam:true,diesel:false,atom:false,bio:false};__vt.tp(0,0);__vt.cam.yaw=Math.atan2(-100,90)*0;__vt.renderOnce();
    const mk={};document.querySelectorAll('#compass .mk').forEach(e=>{if(e.style.display!=='none')mk[e.textContent]=+(+e.style.opacity).toFixed(2);});
    __vt.G.relics={steam:false,diesel:false,atom:false,bio:false};__vt.G.sec={};
    return{signs,hit,op,fin4,mk,marcos:trailCount,secIds:SEC_IDS.length};});
  S.ok(info.signs.length===4,'quatro placas na estrada, uma por tumba',info.signs);
  S.ok(info.marcos>=12,'marcos de pedra com fita da cor da era ao longo das trilhas',info.marcos);
  S.ok(Object.values(info.hit).every(n=>n>=20),'mapa do diário desenha as quatro trilhas na cor de cada era',info.hit);
  S.ok(info.op.diesel>=0.25&&info.op.steam<info.op.diesel*0.5,'de dia os feixes são fortes; o da tumba vencida enfraquece',info.op);
  S.ok(info.fin4>info.op.final,'o feixe dourado da Cidade-Jardim cresce com as relíquias',{uma:info.op.final,quatro:info.fin4});
  S.ok(info.mk.NE!==undefined&&info.mk.NE<0.5,'na bússola, a tumba vencida fica apagada',info.mk);
  S.ok(info.secIds===12,'os 12 segredos continuam registrados',info.secIds);
  S.done(logs);await browser.close();
})();
