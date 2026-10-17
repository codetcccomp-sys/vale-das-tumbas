const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(-96.6,100);__vt.sim(5);__vt.use();__vt.sim(150);});
  await ev(()=>{const g=__vt.atm.gates;g[0].latched=true;g[0].open=1;g[0].g.position.y=7.6;g[0].c.on=false;});
  // pulo da margem da sala 2 para o pontão A com água em 0
  const jumps=await ev(()=>{const res=[];for(let t=0;t<6;t++){__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(0,-36.2);__vt.sim(3);__vt.key('w',true);let ok=false;for(let i=0;i<300;i++){const p=__vt.G.p;if(p.grounded&&p.z<-37.2&&p.z>-37.95)__vt.press('jump');__vt.sim(1);const s=__vt.state();if(s.z<-39.4&&s.z>-43.2&&s.y>-0.1&&s.grounded){ok=true;break;}}__vt.key('w',false);res.push(ok?'ok':'caiu');}return res.join(',');});
  P('pulo da margem da sala 2 para o pontão A (6 tentativas): '+jumps);
  // cair no fosso reinicia a água da sala
  await ev(()=>{__vt.atm.waters.W2.target=4;__vt.sim(300);__vt.tp(0,-45,-2);__vt.sim(80);});
  P('depois de cair no fosso da sala 2: água='+JSON.stringify(await ev(()=>Object.fromEntries(Object.entries(__vt.atm.waters).map(([k,w])=>[k,+w.level.toFixed(2)]))))+' hearts='+(await st()).hearts);
  // ---------- SALA 3 ----------
  await ev(()=>{const g=__vt.atm.gates;g[1].latched=true;g[1].open=1;g[1].g.position.y=7.6;g[1].c.on=false;__vt.G.hearts=3;__vt.G.invuln=0;});
  await ev(()=>{__vt.tp(5.9,-68.2);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('célula 3: '+JSON.stringify(await ev(()=>__vt.atm.cells.map(c=>c.lit))));
  await ev(()=>{__vt.tp(0,-69);__vt.cam.yaw=0;__vt.sim(20);});await shot('55-sala3');
  // gasto da lanterna: fora e dentro da zona
  await ev(()=>{__vt.G.lanternOn=true;__vt.G.lantern=100;__vt.tp(0,-69);__vt.sim(120);});const out=100-(await st()).lantern;
  await ev(()=>{__vt.G.lantern=100;__vt.tp(-3,-76);__vt.sim(120);});const inn=100-(await st()).lantern;
  P('lanterna em 2s: fora da zona gastou '+out.toFixed(2)+', dentro da zona gastou '+inn.toFixed(2)+' (esperado ~2 e ~6)');
  P('classe de alerta no HUD dentro da zona: '+await ev(()=>{__vt.renderOnce();return document.getElementById('lantern').classList.contains('rad');})+', geiger='+await ev(()=>window.AU?'?':'n/a'));
  await ev(()=>{__vt.tp(-3,-76);__vt.cam.yaw=0.5;__vt.cam.pitch=0.4;__vt.sim(20);});await shot('56-zona');
  // robô: andar devagar a 4 m não acorda; correr a 8 m acorda
  await ev(()=>{__vt.atm.bot.state='sleep';__vt.tp(2.6,-72);__vt.sim(5);__vt.key('w',true);__vt.sim(40);__vt.key('w',false);});
  P('andar devagar na faixa da direita (a ~4 m do robô): robô='+await ev(()=>__vt.atm.bot.state)+' pos='+JSON.stringify(await st()));
  await ev(()=>{__vt.atm.bot.state='sleep';__vt.tp(6.5,-70);__vt.sim(3);__vt.key('shift',true);__vt.key('w',true);__vt.sim(50);__vt.key('w',false);__vt.key('shift',false);});
  P('correr a ~8 m do robô: robô='+await ev(()=>__vt.atm.bot.state));
  await ev(()=>{__vt.atm.bot.state='sleep';__vt.tp(6.5,-75.8);__vt.sim(5);});
  P('a 2,7 m do robô (presença): robô='+await ev(()=>__vt.atm.bot.state));
  await shot('57-robo');
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;const b=__vt.atm.bot;b.state='awake';b.x=3;b.z=-80;__vt.tp(3,-72);__vt.sim(240);});
  P('contato do robô: corações='+(await st()).hearts+' (esperado menos que 3)');
  // alagar a sala: bomba acorda o robô
  await ev(()=>{__vt.G.hearts=3;__vt.G.invuln=0;const b=__vt.atm.bot;b.state='sleep';b.x=b.hx;b.z=b.hz;__vt.tp(-7,-68.2);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('bomba ligada: alvo W3='+await ev(()=>__vt.atm.waters.W3.target)+' robô='+await ev(()=>__vt.atm.bot.state)+' (esperado: awake, a 17 m)');
  await ev(()=>__vt.sim(330));
  P('depois de alagar: nível W3='+(await ev(()=>__vt.atm.waters.W3.level)).toFixed(2)+', radiação extra na zona A='+await ev(()=>{__vt.tp(-3,-76);return __vt.TOMB_AREAS.atom.drainExtra();})+' (esperado 0)');
  await shot('58-alagada');
  // sair da sala: robô dorme
  await ev(()=>{const b=__vt.atm.bot;b.state='awake';__vt.tp(0,-100.5);__vt.sim(5);});
  // alavanca final e câmara
  await ev(()=>{__vt.atm.bot.state='sleep';__vt.tp(6.8,-95.4);__vt.sim(5);__vt.use();__vt.sim(220);});
  P('alavanca final: comporta 3 aberta='+Math.round(await ev(()=>__vt.atm.gates[2].open*100))+'%');
  await ev(()=>{__vt.tp(0,-96);__vt.key('w',true);__vt.sim(120);__vt.key('w',false);});
  P('atravessou a comporta final: '+JSON.stringify(await st()));
  await ev(()=>{__vt.tp(0,-104.6);__vt.cam.yaw=0;__vt.sim(40);});await shot('59-camara');
  await ev(()=>{__vt.use();__vt.sim(5);});
  P('relíquias: '+JSON.stringify(await ev(()=>__vt.G.relics)));
  await page.waitForTimeout(2700);await ev(()=>__vt.sim(220));
  P('depois da relíquia: '+JSON.stringify(await st())+' HUD='+await ev(()=>document.getElementById('relicCount').textContent));
  P('save: '+await ev(()=>JSON.stringify(JSON.parse(localStorage.getItem('vale_das_tumbas_save')).relics)));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
