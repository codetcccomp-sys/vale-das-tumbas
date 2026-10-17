// Etapa 2: pontos de controle reativáveis. Em cada tumba: ativar um ponto de energia, sair, voltar,
// usar o mesmo ponto de novo e cair. O retorno tem de acontecer no ponto reativado, em chão firme.
const {open}=require('./lib');const {suite}=require('./assert');
(async()=>{
  const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);const S=suite('pontos de controle');
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  const LIST={steam:'tomb.boilers',diesel:'dsl.gens',atom:'atm.cells',bio:'bio.flowers',final:'cty.flowers'};
  for(const key of Object.keys(LIST)){
    const r=await ev(([key,list])=>{
      const out={};const pts=list==='tomb.boilers'?__vt.tomb.boilers:list==='dsl.gens'?__vt.dsl.gens:list==='atm.cells'?__vt.atm.cells:list==='bio.flowers'?__vt.bio.flowers:__vt.cty.flowers;
      const play=()=>{let n=0;while(__vt.G.mode!=='play'&&n<400){__vt.sim(1);n++;}};
      const msgs=()=>TOASTS.on.map(t=>t.text).concat(TOASTS.queue.map(t=>t.text));
      const useAt=o=>{const A=__vt.G.area;let it=null,bd=9;for(const i of A.interact){const d=Math.hypot(i.x-o.x,i.z-o.z);if(d<bd&&d<2.2){bd=d;it=i;}}
        __vt.tp(it.x,it.z,0);__vt.sim(2);out.label=it.label();__vt.press('use');__vt.sim(2);};
      __vt.enter(key);play();
      const o=pts[Math.min(1,pts.length-1)];out.n=pts.length;
      out.cp0=__vt.G.checkpoint;useAt(o);out.lit1=o.lit;const c1=__vt.G.checkpoint;out.cp1=c1&&{x:+c1.x.toFixed(2),y:+c1.y.toFixed(2),z:+c1.z.toFixed(2)};
      __vt.exit(false);play();out.areaFora=__vt.G.area.name;
      __vt.enter(key);play();out.cpAoVoltar=__vt.G.checkpoint;out.litAoVoltar=o.lit;
      toastClear();useAt(o);const c2=__vt.G.checkpoint;out.cp2=c2&&{x:+c2.x.toFixed(2),y:+c2.y.toFixed(2),z:+c2.z.toFixed(2)};out.msg=msgs().slice(-1)[0];
      /* vai para longe (entrada) e cai no vazio */
      __vt.tp(0,5,0);__vt.sim(5);__vt.G.hearts=3;const h0=__vt.G.hearts;__vt.G.p.y=-6;__vt.G.p.vy=-10;__vt.sim(1);
      const p=__vt.G.p;out.respawn={x:+p.x.toFixed(2),y:+p.y.toFixed(2),z:+p.z.toFixed(2)};out.hearts=[h0,__vt.G.hearts];
      out.camYaw=+wrapPi(__vt.cam.yaw-(c2?c2.face:0)-Math.PI).toFixed(3);
      __vt.sim(180);out.depois3s={x:+p.x.toFixed(2),y:+p.y.toFixed(2),z:+p.z.toFixed(2),grounded:p.grounded,hearts:__vt.G.hearts,area:__vt.G.area.name};
      const A=__vt.G.area;out.chao=groundAt(A,c2.x,c2.z,c2.y+0.3);const po=pushOut(A,c2.x,c2.z,c2.y,PR,PH);out.sobreposto=Math.hypot(po[0]-c2.x,po[1]-c2.z);
      /* todos os pontos desta área: o lugar de retorno tem chão e não invade colisores */
      out.todos=pts.map(q=>{const c=checkpointNear(key==='steam'?q.x+1.9:q.x+(q.x<0?1.9:-1.9),q.z,Math.PI);const g=groundAt(A,c.x,c.z,c.y+0.3),pp=pushOut(A,c.x,c.z,c.y,PR,PH);return{ok:g>-0.3&&Math.abs(g-c.y)<0.01&&Math.hypot(pp[0]-c.x,pp[1]-c.z)<0.01,x:+c.x.toFixed(1),z:+c.z.toFixed(1)};});
      /* sem corações: a morte também devolve ao ponto reativado, com a vida cheia */
      toastClear();__vt.tp(0,5,0);__vt.sim(5);__vt.G.hearts=1;__vt.G.invuln=0;__vt.G.p.y=-6;__vt.G.p.vy=-10;__vt.sim(1);
      out.morte={x:+p.x.toFixed(2),z:+p.z.toFixed(2),hearts:__vt.G.hearts,msg:msgs().slice(-1)[0]};
      __vt.exit(false);play();
      return out;},[key,LIST[key]]);
    console.log(key+': '+JSON.stringify(r));
    S.ok(r.cp0===null,key+': ao entrar não há ponto de controle');
    S.ok(r.lit1===true&&r.cp1,key+': primeiro uso acende o ponto e grava o controle',r.cp1);
    S.ok(r.areaFora==='vale',key+': saiu para o vale');
    S.ok(r.cpAoVoltar===null&&r.litAoVoltar===true,key+': ao voltar o ponto segue aceso, mas o controle zerou');
    S.ok(/salvar/i.test(r.label||''),key+': o ponto aceso oferece salvar de novo',r.label);
    S.ok(!!r.cp2&&Math.hypot(r.cp2.x-r.cp1.x,r.cp2.z-r.cp1.z)<0.05,key+': reusar o ponto grava o controle de novo',r.cp2);
    S.ok(/Ponto de controle salvo/.test(r.msg||''),key+': mensagem confirma o salvamento',r.msg);
    S.ok(r.cp2&&Math.hypot(r.respawn.x-r.cp2.x,r.respawn.z-r.cp2.z)<0.05&&Math.abs(r.respawn.y-r.cp2.y)<0.05,key+': depois da queda volta ao ponto reativado',r.respawn);
    S.ok(r.hearts[1]===r.hearts[0]-1,key+': a queda custa um coração',r.hearts);
    S.ok(Math.abs(r.camYaw)<0.01,key+': câmera volta atrás do personagem, olhando para a frente');
    S.ok(r.depois3s.grounded&&r.depois3s.area===r.areaFora.replace('vale',r.depois3s.area)&&Math.hypot(r.depois3s.x-r.cp2.x,r.depois3s.z-r.cp2.z)<0.3&&r.depois3s.hearts===r.hearts[1],key+': 3 s parado no ponto: no chão, sem dano, sem escorregar',r.depois3s);
    S.ok(Math.hypot(r.morte.x-r.cp2.x,r.morte.z-r.cp2.z)<0.05&&r.morte.hearts===3,key+': sem corações, também volta ao ponto reativado com vida cheia',r.morte);
    S.ok(r.chao>-0.3&&r.sobreposto<0.01,key+': ponto de retorno tem chão e não invade colisores',{chao:r.chao,sobreposto:r.sobreposto});
    S.ok(r.todos.every(t=>t.ok),key+': todos os '+r.n+' pontos da área têm retorno seguro',r.todos.filter(t=>!t.ok));
  }
  S.done(logs);await browser.close();
})();
