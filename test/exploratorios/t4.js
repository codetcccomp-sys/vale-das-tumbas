const {open}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  await page.evaluate(()=>{__vt.start(true);__vt.sim(10);__vt.tp(95.2,-90);__vt.sim(5);__vt.use();__vt.sim(150);});
  const r=await page.evaluate(()=>{
    const rows=[-12,-16,-20,-24,-28],Pd=3.4;
    const rem=(i,t)=>{const ph=(((t-i*0.9)%Pd)+Pd)%Pd/Pd;return ph>=0.58?0:(0.58-ph)*Pd;};
    const res=[];
    for(let trial=0;trial<12;trial++){
      __vt.tp(0,-8.5);__vt.G.hearts=3;__vt.sim(3+Math.floor(Math.random()*400));__vt.tp(0,-8.5);__vt.sim(3);
      let ok=false,fell=false,t0=__vt.G.t;
      for(let i=0;i<2400;i++){
        const p=__vt.G.p;let cur=-1;rows.forEach((zc,k)=>{if(Math.abs(p.z-zc)<1.3)cur=k;});
        const fe=cur===-1?-10:rows[cur]-1.3,nx=cur+1,d=p.z-fe;
        const canJump=nx>=5||rem(nx,__vt.G.t)>0.95;
        // espera a plataforma da frente subir; nao fica na plataforma que vai baixar
        const curOk=cur===-1||rem(cur,__vt.G.t)>0.35;
        __vt.key('w',!(d<1.1&&d>0.35&&!canJump));
        if(p.grounded&&d<0.5&&d>-0.2&&canJump&&curOk)__vt.press('jump');
        __vt.sim(1);
        const s=__vt.state();
        if(s.z<-31&&s.y>-0.2&&s.grounded){ok=true;break;}
        if(s.z>=4.9){fell=true;break;}
      }
      __vt.key('w',false);res.push((ok?'ok':fell?'caiu':'tempo')+'('+(__vt.G.t-t0).toFixed(1)+'s)');
    }
    return res.join(' ');
  });
  console.log('Pistões, 12 tentativas com robô que espera:',r);
  console.log('LOGS',logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)');
  await browser.close();
})().catch(e=>{console.error('FALHOU',e);process.exit(1);});
