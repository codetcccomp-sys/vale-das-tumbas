const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const Wd=()=>ev(()=>Object.fromEntries(Object.entries(__vt.atm.waters).map(([k,w])=>[k,+w.level.toFixed(2)])));
  await ev(()=>{__vt.start(true);__vt.sim(10);__vt.tp(-96.6,100);__vt.sim(5);__vt.use();__vt.sim(150);});
  P('entrou na tumba do Reator: '+JSON.stringify(await st()));
  await shot('50-hall');
  await ev(()=>{__vt.tp(-3.6,-3.5);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('célula 1: '+JSON.stringify(await ev(()=>__vt.atm.cells.map(c=>c.lit))));
  // ---------- SALA 1: atravessar o canal no nível baixo, pulando entre pontões ----------
  await ev(()=>{__vt.tp(0,-10);__vt.sim(30);});await shot('51-sala1');
  const cross=await ev(()=>{
    const edges=[-14,-18.2,-22.4,-26.6];let res=[];
    for(let trial=0;trial<6;trial++){
      __vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(0,-10.5);__vt.sim(3);__vt.key('w',true);let ok=false;
      for(let i=0;i<500;i++){
        const p=__vt.G.p;let ne=null;for(const e of edges)if(e<=p.z+0.5&&(ne===null||e>ne))ne=e;
        if(ne!==null&&p.grounded&&p.z-ne<0.45&&p.z>=ne-0.2)__vt.press('jump');
        __vt.sim(1);const s=__vt.state();
        if(s.z<-28.5&&s.y>-0.2&&s.grounded){ok=true;break;}
        if(s.z>-5){break;}
      }
      __vt.key('w',false);res.push(ok?'ok':'caiu');
    }
    return res.join(',');
  });
  P('atravessou o canal (6 tentativas, nível baixo): '+cross);
  // com a água no nível 2 não dá para subir nos pontões
  await ev(()=>{__vt.G.hearts=3;__vt.atm.waters.W1.target=2;__vt.sim(200);__vt.tp(0,-10.5);__vt.sim(3);__vt.key('w',true);for(let i=0;i<200;i++){const p=__vt.G.p;if(p.grounded&&p.z<-12.8&&p.z>-14.4)__vt.press('jump');__vt.sim(1);}__vt.key('w',false);});
  P('nível alto (2): tentar subir no pontão: '+JSON.stringify(await st())+' (esperado: não passou do primeiro pontão)');
  await ev(()=>{__vt.G.hearts=3;__vt.atm.waters.W1.target=0;__vt.sim(240);});
  // válvula de enchimento na margem do fundo
  await ev(()=>{__vt.tp(-6.5,-29.4);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('válvula: alvo da água='+(await ev(()=>__vt.atm.waters.W1.target))+' (esperado 2)');
  await ev(()=>__vt.sim(60));
  P('durante a subida o gesto de novo é ignorado e a água sobe: '+JSON.stringify(await Wd()));
  await ev(()=>__vt.sim(200));
  P('comporta 1: aberta='+Math.round(await ev(()=>__vt.atm.gates[0].open*100))+'% colisor='+await ev(()=>__vt.atm.gates[0].c.on));
  await ev(()=>{__vt.tp(0,-31);__vt.key('w',true);__vt.sim(90);__vt.key('w',false);});
  P('atravessou a comporta 1: '+JSON.stringify(await st()));
  // ---------- SALA 2: pontões, passarelas ----------
  await ev(()=>{__vt.tp(-4.4,-36.2);__vt.sim(5);__vt.use();__vt.sim(5);});
  await ev(()=>{__vt.tp(3.5,-35.4);__vt.sim(5);__vt.use();__vt.sim(5);});  // dreno primeiro? (nível já 2 na sala 1; sala 2 é outra água)
  P('água da sala 2 (esperado 0): '+JSON.stringify(await Wd()));
  await ev(()=>{__vt.tp(0,-36);__vt.sim(30);});await shot('52-sala2');
  const toA=await ev(()=>{__vt.G.hearts=3;__vt.tp(0,-36.6);__vt.sim(3);__vt.key('w',true);let ok=false;for(let i=0;i<300;i++){const p=__vt.G.p;if(p.grounded&&p.z<-37.2&&p.z>-37.9)__vt.press('jump');__vt.sim(1);const s=__vt.state();if(s.z<-39.4&&s.z>-43.2&&s.y>-0.1&&s.grounded){ok=true;break;}}__vt.key('w',false);return{ok,s:__vt.state()};});
  P('pulo da margem para o pontão A: '+JSON.stringify(toA));
  // subir com o pontão (carona)
  await ev(()=>{__vt.tp(-1.4,-41.2,0.06);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('A: alvo='+(await ev(()=>__vt.atm.waters.W2.target)));
  await ev(()=>__vt.sim(200));
  P('carona no pontão A: água='+JSON.stringify(await Wd())+' jogador='+JSON.stringify(await st()));
  await shot('53-no-pontao');
  // pular do pontão A (y=2) para a passarela L1 (a oeste)
  const toL1=await ev(()=>{__vt.tp(-2.6,-41.5,2.06);__vt.sim(3);__vt.key('a',true);__vt.sim(3);__vt.press('jump');let ok=false;for(let i=0;i<80;i++){__vt.sim(1);const s=__vt.state();if(s.x<-4.4&&s.y>1.9&&s.grounded){ok=true;break;}}__vt.key('a',false);return{ok,s:__vt.state()};});
  P('pulo do pontão A para a passarela L1: '+JSON.stringify(toL1));
  // andar na passarela até o pontão B e pular
  const toB=await ev(()=>{__vt.tp(-5.2,-53.5,2.0);__vt.sim(3);__vt.key('d',true);__vt.sim(8);__vt.press('jump');let ok=false;for(let i=0;i<80;i++){__vt.sim(1);const s=__vt.state();if(s.x>-2.8&&s.y>1.9&&s.grounded){ok=true;break;}}__vt.key('d',false);return{ok,s:__vt.state()};});
  P('pulo da passarela L1 para o pontão B (nível 2): '+JSON.stringify(toB));
  await ev(()=>{__vt.tp(-1.4,-54,2.06);__vt.sim(5);__vt.use();__vt.sim(5);});
  await ev(()=>__vt.sim(200));
  P('carona no pontão B até o nível 4: água='+JSON.stringify(await Wd())+' jogador='+JSON.stringify(await st()));
  const toL2=await ev(()=>{__vt.tp(2.6,-54,4.06);__vt.sim(3);__vt.key('d',true);__vt.sim(3);__vt.press('jump');let ok=false;for(let i=0;i<80;i++){__vt.sim(1);const s=__vt.state();if(s.x>4.4&&s.y>3.9&&s.grounded){ok=true;break;}}__vt.key('d',false);return{ok,s:__vt.state()};});
  P('pulo do pontão B para a passarela L2: '+JSON.stringify(toL2));
  await shot('54-passarela-alta');
  await ev(()=>{__vt.tp(7.4,-59.4,4.0);__vt.sim(5);__vt.use();__vt.sim(220);});
  P('alavanca L2: comporta 2 aberta='+Math.round(await ev(()=>__vt.atm.gates[1].open*100))+'%');
  // descer da passarela e sair
  await ev(()=>{__vt.tp(6,-62.5,4.0);__vt.sim(5);__vt.key('s',true);__vt.sim(60);__vt.key('s',false);__vt.sim(30);});
  P('caiu da passarela alta no chão (sem morrer): '+JSON.stringify(await st()));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
