const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  const info=()=>ev(()=>({done:__vt.cty.done.join(','),lvl:+__vt.cty.lvl.toFixed(2),W:__vt.cty.W.level,h:__vt.G.hearts}));
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.relics.steam=__vt.G.relics.diesel=__vt.G.relics.atom=__vt.G.relics.bio=true;__vt.tp(0,-125);__vt.sim(5);__vt.use();__vt.sim(150);});
  P('entrou: '+(await st()).area);
  // ---- SEÇÃO 1: pistões com o robô que espera
  const r=await ev(()=>{
    const rows=[-12,-16,-20,-24],Pd=3.4;
    const rem=(i,t)=>{const ph=(((t-i*0.9)%Pd)+Pd)%Pd/Pd;return ph>=0.58?0:(0.58-ph)*Pd;};
    const res=[];
    for(let trial=0;trial<10;trial++){
      __vt.tp(0,-8.5);__vt.G.hearts=3;__vt.G.invuln=0;__vt.sim(3+Math.floor(Math.random()*400));__vt.tp(0,-8.5);__vt.sim(3);
      let ok=false,fell=false,t0=__vt.G.t;
      for(let i=0;i<2400;i++){
        const p=__vt.G.p;let cur=-1;rows.forEach((zc,k)=>{if(Math.abs(p.z-zc)<1.3)cur=k;});
        const fe=cur===-1?-10:rows[cur]-1.3,nx=cur+1,d=p.z-fe;
        const canJump=nx>=4||rem(nx,__vt.G.t)>0.95;
        const curOk=cur===-1||rem(cur,__vt.G.t)>0.35;
        __vt.key('w',!(d<1.1&&d>0.35&&!canJump));
        if(p.grounded&&d<0.5&&d>-0.2&&canJump&&curOk)__vt.press('jump');
        __vt.sim(1);
        const s=__vt.state();
        if(s.z<-27&&s.y>-0.2&&s.grounded){ok=true;break;}
        if(s.z>=4.9){fell=true;break;}
      }
      __vt.key('w',false);res.push((ok?'ok':fell?'caiu':'tempo')+'('+(__vt.G.t-t0).toFixed(1)+'s)');
    }
    return res.join(' ');
  });
  P('Pistões, 10 tentativas com robô que espera: '+r);
  // placas: caminho seguro (7 placas do olho) e placas ruins caem
  const tiles=await ev(()=>{
    const path=[[0,-33.2],[0,-35.6],[2.4,-35.6],[2.4,-38],[2.4,-40.4],[0,-40.4],[0,-42.8]];__vt.G.hearts=3;__vt.G.invuln=0;
    __vt.tp(0,-30);__vt.sim(5);let fell=false;
    for(const [x,z] of path){__vt.tp(x,z);for(let i=0;i<90;i++){__vt.sim(1);if(__vt.G.p.y<-0.3)fell=true;}}
    return {fell,y:__vt.G.p.y,z:__vt.G.p.z};
  });
  P('caminho seguro das placas: '+JSON.stringify(tiles)+' (esperado fell=false)');
  const bad=await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;const t0=__vt.cty.tiles.find(t=>!t.safe);__vt.tp(t0.x,t0.z);let st0=t0.state;__vt.sim(40);const st1=t0.state;__vt.sim(60);const st2=t0.state;__vt.sim(60);return {x:t0.x,z:t0.z,st0,st1,st2,y:__vt.G.p.y,h:__vt.G.hearts};});
  P('placa ruim: '+JSON.stringify(bad)+' (esperado: ok -> crack -> fall e queda)');
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=3;__vt.tp(0,-40);__vt.cam.yaw=0;__vt.cam.pitch=0.4;__vt.sim(30);});await shot('91-placas');
  await ev(()=>{__vt.G.invuln=0;__vt.tp(0,-14);__vt.cam.yaw=0;__vt.cam.pitch=0.4;__vt.sim(120);});await shot('92-pistoes');
  // fim da seção 1
  await ev(()=>{__vt.tp(0,-46.5);__vt.sim(5);});
  P('seção 1 concluída: '+JSON.stringify(await info())+' msg='+await last());
  await ev(()=>__vt.sim(400));P('teto abrindo (slab 1 aberto): '+await ev(()=>__vt.cty.slabs[0].open.toFixed(2))+' lvl='+(await info()).lvl);
  // ---- SEÇÃO 2: holofotes
  await ev(()=>{__vt.tp(-6,-56.4);__vt.sim(3);__vt.use();__vt.sim(60);});
  P('holofote A girou 1x: step='+await ev(()=>__vt.cty.floods[0].step)+' sensores='+await ev(()=>__vt.cty.sensors.map(s=>s.lit).join(',')));
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.5;__vt.tp(0,-52);__vt.sim(20);});await shot('93-luz-a');
  for(let i=0;i<6;i++)await ev(()=>{__vt.tp(6,-56.4);__vt.sim(3);__vt.use();__vt.sim(40);});
  P('holofote B girou 6x (ainda não): step='+await ev(()=>__vt.cty.floods[1].step)+' sensores='+await ev(()=>__vt.cty.sensors.map(s=>s.lit).join(',')));
  await ev(()=>{__vt.tp(6,-56.4);__vt.sim(3);__vt.use();__vt.sim(60);});
  P('holofote B 7x: step='+await ev(()=>__vt.cty.floods[1].step)+' sensores='+await ev(()=>__vt.cty.sensors.map(s=>s.lit).join(','))+' msg='+await last());
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.55;__vt.tp(0,-52);__vt.sim(40);});await shot('94-luz-cruzada');
  await ev(()=>__vt.sim(300));
  P('porta 2: aberta='+await ev(()=>__vt.cty.gates[0].open)+' colisor='+await ev(()=>__vt.cty.gates[0].c.on)+' '+JSON.stringify(await info()));
  await ev(()=>{__vt.tp(0,-79);__vt.key('w',true);__vt.sim(80);__vt.key('w',false);});
  P('atravessou a porta 2: '+JSON.stringify(await st()));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
