const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  const info=()=>ev(()=>({done:__vt.cty.done.join(','),lvl:+__vt.cty.lvl.toFixed(2),W:+__vt.cty.W.level.toFixed(2),h:__vt.G.hearts}));
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.G.relics.steam=__vt.G.relics.diesel=__vt.G.relics.atom=__vt.G.relics.bio=true;__vt.tp(0,-125);__vt.sim(5);__vt.use();__vt.sim(150);
    const c=__vt.cty;c.done[0]=true;c.done[1]=true;c.gates[0].latched=true;c.gates[0].open=1;c.gates[0].fl.position.x=-4.62;c.gates[0].fr.position.x=4.62;c.gates[0].c.on=false;c.lvl=0.5;});
  // ---- SEÇÃO 3: água
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.45;__vt.tp(0,-83.5);__vt.sim(40);});await shot('95-agua-baixa');
  P('com água baixa, margem N -> pontão A: '+await ev(()=>{const res=[];for(let t=0;t<5;t++){__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(0,-86.2);__vt.sim(3);__vt.key('w',true);let ok=false;for(let i=0;i<200;i++){const p=__vt.G.p;if(p.grounded&&p.z<-86.35&&p.z>-86.9)__vt.press('jump');__vt.sim(1);const s=__vt.state();if(s.z<-88.6&&s.z>-91&&s.y>-0.1&&s.grounded){ok=true;break;}}__vt.key('w',false);res.push(ok?'ok':'caiu');}return res.join(',');}));
  // sobe a água por A (estação no pontão)
  await ev(()=>{__vt.G.hearts=3;__vt.tp(-1.5,-89.7,0.06);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('válvula de enchimento no pontão A: alvo='+await ev(()=>__vt.cty.W.target)+' msg='+await last());
  await ev(()=>__vt.sim(140));P('depois de 2,3 s: '+JSON.stringify(await info())+' jogador='+JSON.stringify(await st()));
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.45;__vt.sim(10);});await shot('96-agua-alta');
  // margem N no nível alto: pontão A fica alto demais
  P('nível alto: margem N -> A: '+await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(0,-86.2);__vt.sim(3);__vt.key('w',true);let ok=false;for(let i=0;i<160;i++){const p=__vt.G.p;if(p.grounded&&p.z<-86.35&&p.z>-86.9)__vt.press('jump');__vt.sim(1);const s=__vt.state();if(s.z<-88.6&&s.y>1.8&&s.grounded){ok=true;break;}}__vt.key('w',false);return ok?'subiu (inesperado)':'não subiu (esperado)';}));
  // sobre A no nível 2: pular para a ilha e para B
  const hop=await ev(()=>{__vt.cty.W.target=2;__vt.cty.W.level=2;__vt.sim(5);const res=[];
    for(let t=0;t<4;t++){__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(0,-90.4,2.06);__vt.sim(3);__vt.key('w',true);let ok=false;for(let i=0;i<200;i++){const p=__vt.G.p;if(p.grounded&&p.z<-91.0&&p.z>-91.7)__vt.press('jump');__vt.sim(1);const s=__vt.state();if(s.z<-92.8&&s.z>-96&&s.y>1.9&&s.grounded){ok=true;break;}}__vt.key('w',false);res.push(ok?'ok':'caiu');}
    const r2=[];for(let t=0;t<4;t++){__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(0,-95.8,2.0);__vt.sim(3);__vt.key('w',true);let ok=false;for(let i=0;i<200;i++){const p=__vt.G.p;if(p.grounded&&p.z<-95.7&&p.z>-96.3)__vt.press('jump');__vt.sim(1);const s=__vt.state();if(s.z<-97.9&&s.z>-100.5&&s.y>1.9&&s.grounded){ok=true;break;}}__vt.key('w',false);r2.push(ok?'ok':'caiu');}
    return 'A->ilha: '+res.join(',')+' | ilha->B: '+r2.join(',');});
  P(hop);
  // baixar a água por B e pular para a margem S
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(1.5,-99.1,2.06);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('dreno no pontão B: alvo='+await ev(()=>__vt.cty.W.target));
  await ev(()=>__vt.sim(140));P('depois de baixar: '+JSON.stringify(await info())+' jogador y='+(await st()).y.toFixed(2));
  P('B -> margem S: '+await ev(()=>{const res=[];for(let t=0;t<4;t++){__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(0,-98.8,0.06);__vt.sim(3);__vt.key('w',true);let ok=false;for(let i=0;i<200;i++){const p=__vt.G.p;if(p.grounded&&p.z<-99.6&&p.z>-100.2)__vt.press('jump');__vt.sim(1);const s=__vt.state();if(s.z<-102.2&&s.y>-0.1&&s.grounded){ok=true;break;}}__vt.key('w',false);res.push(ok?'ok':'caiu');}return res.join(',');}));
  // cair no canal reinicia a água
  await ev(()=>{__vt.cty.W.target=2;__vt.cty.W.level=2;__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(8,-94,-2);__vt.sim(60);});
  P('depois de cair no canal: água='+JSON.stringify(await info())+' pos='+JSON.stringify(await st()));
  // fim da seção 3
  await ev(()=>{__vt.tp(0,-104.5);__vt.sim(5);});P('seção 3: '+JSON.stringify(await info()));
  await ev(()=>{__vt.cam.yaw=0;__vt.cam.pitch=0.4;__vt.sim(400);});await shot('97-secao4-entrada');
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
