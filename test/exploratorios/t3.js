const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const st=()=>page.evaluate(()=>__vt.state());
  const shot=async n=>{await page.evaluate(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const P=(s)=>console.log(s);
  await page.evaluate(()=>{__vt.start(true);__vt.sim(10);__vt.tp(95.2,-90);__vt.sim(5);__vt.use();__vt.sim(150);});
  P('entrou: '+JSON.stringify(await st()));
  // ---------- SALA 1: robô que pula de plataforma em plataforma ----------
  const bot=await page.evaluate(()=>{
    const rows=[-12,-16,-20,-24,-28],Pd=3.4;
    const rem=(i,t)=>{const ph=(((t-i*0.9)%Pd)+Pd)%Pd/Pd;return ph>=0.58?0:(0.58-ph)*Pd;};
    let wins=0,fails=0,jumps=0;const log=[];
    for(let trial=0;trial<10;trial++){
      __vt.tp(0,-9.0);__vt.G.hearts=3;__vt.sim(1+Math.floor(Math.random()*180));__vt.tp(0,-9.0);__vt.sim(3);
      __vt.key('w',true);let ok=false,fell=false;
      for(let i=0;i<900;i++){
        const p=__vt.G.p;let cur=-1;rows.forEach((zc,k)=>{if(Math.abs(p.z-zc)<1.3)cur=k;});
        const fe=cur===-1?-10:rows[cur]-1.3,nx=cur+1;
        if(p.grounded&&p.z-fe<0.5&&p.z>=fe-0.2&&(nx>=5||rem(nx,__vt.G.t)>0.95)){__vt.press('jump');jumps++;}
        __vt.sim(1);
        const s=__vt.state();
        if(s.z<-31&&s.y>-0.2&&s.grounded){ok=true;break;}
        if(s.z>=4.9){fell=true;break;}
      }
      __vt.key('w',false);if(ok)wins++;else fails++;log.push(ok?'ok':(fell?'caiu':'tempo'));
    }
    return{wins,fails,jumps,log:log.join(',')};
  });
  P('SALA 1 (robô, 10 tentativas): '+JSON.stringify(bot));
  await page.evaluate(()=>{__vt.tp(0,-9.2);__vt.sim(30);});await shot('4-sala1');
  // ---------- SALA 2 ----------
  await page.evaluate(()=>{__vt.G.hearts=3;__vt.tp(0,-37);__vt.sim(10);});
  const g0=await page.evaluate(()=>__vt.tomb.guard.state);
  await page.evaluate(()=>{__vt.key('shift',true);__vt.key('w',true);__vt.sim(70);__vt.key('w',false);__vt.key('shift',false);});
  P('Autômato: antes='+g0+', depois de CORRER perto='+await page.evaluate(()=>__vt.tomb.guard.state)+' pos='+JSON.stringify(await st()));
  await page.evaluate(()=>__vt.sim(40));await shot('5-automato');
  await page.evaluate(()=>{__vt.tp(0,-33);__vt.sim(30);});
  P('Autômato depois de sair da sala: '+await page.evaluate(()=>__vt.tomb.guard.state));
  await page.evaluate(()=>{__vt.tp(-7,-38);__vt.sim(5);__vt.key('w',true);__vt.sim(160);__vt.key('w',false);});
  P('andando devagar pela esquerda: Autômato='+await page.evaluate(()=>__vt.tomb.guard.state)+' pos='+JSON.stringify(await st()));
  await page.evaluate(()=>{__vt.tp(6.8,-64.5);__vt.sim(5);__vt.use();__vt.sim(220);});
  P('alavanca: porta aberta='+await page.evaluate(()=>__vt.tomb.gate.open)+' colisor='+await page.evaluate(()=>__vt.tomb.gate.c.on)+' Autômato='+await page.evaluate(()=>__vt.tomb.guard.state));
  const h0=(await st()).hearts;
  await page.evaluate(()=>{const g=__vt.tomb.guard;g.state='awake';g.x=__vt.G.p.x+0.6;g.z=__vt.G.p.z;__vt.sim(6);});
  P('contato com o Autômato: corações '+h0+' -> '+(await st()).hearts);
  // ---------- SALA 3 ----------
  await page.evaluate(()=>{__vt.tomb.guard.state='sleep';__vt.G.hearts=3;__vt.G.invuln=0;__vt.tp(0,-72);__vt.sim(5);});
  await shot('6-sala3');
  await page.evaluate(()=>{__vt.tp(-4.8,-78.2);__vt.sim(60);});
  P('placa frágil após 1s: '+await page.evaluate(()=>__vt.tomb.tiles[0].state)+' jogador='+JSON.stringify(await st()));
  await page.evaluate(()=>__vt.sim(120));
  P('depois de cair: '+JSON.stringify(await st()));
  const path=await page.evaluate(()=>__vt.tomb.tiles.filter(t=>t.safe).map(t=>[t.x,t.z]));
  await page.evaluate(()=>{__vt.G.hearts=3;__vt.tp(0,-75);__vt.sim(5);});
  let alive=true;
  for(const [x,z] of path){await page.evaluate(([x,z])=>{__vt.tp(x,z);__vt.sim(40);},[x,z]);const s=await st();if(s.y<-0.5){alive=false;break;}}
  P('caminho seguro (13 placas do olho), sem cair: '+alive);
  // ---------- CÂMARA ----------
  await page.evaluate(()=>{__vt.tp(0,-107.4);__vt.sim(5);});await shot('7-camara');
  await page.evaluate(()=>{__vt.use();__vt.sim(5);});
  P('relíquias: '+JSON.stringify(await page.evaluate(()=>__vt.G.relics)));
  await page.waitForTimeout(2700);await page.evaluate(()=>__vt.sim(200));
  P('depois da relíquia: '+JSON.stringify(await st()));
  await page.evaluate(()=>__vt.renderOnce());await shot('8-volta');
  P('save: '+await page.evaluate(()=>localStorage.getItem('vale_das_tumbas_save')));
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e);process.exit(1);});
