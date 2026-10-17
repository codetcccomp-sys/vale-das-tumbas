/* ====================== áudio (tudo sintetizado, sem arquivos) ======================
   Os mesmos sons do jogo 3D (vento, zumbido das tumbas, motor, reator, tumba viva, cidade e os efeitos), mais os sons do
   painel de programação: encaixar placa, cada passo do programa, erro e sucesso. */
const AU={ctx:null,master:null,sfx:null,amb:null,mus:null,on:true,vol:0.8,noise:null,wind:null,hum:null,nextTick:0,flip:false,nextChord:2,last:{}};
function auInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended'){try{AU.ctx.resume();}catch(e){}}return;}
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=AU.ctx=new C();
    AU.master=c.createGain();AU.master.gain.value=AU.on?AU.vol:0;AU.master.connect(c.destination);
    for(const k of ['sfx','amb','mus']){AU[k]=c.createGain();AU[k].connect(AU.master);}
    AU.sfx.gain.value=0.9;AU.amb.gain.value=0.55;AU.mus.gain.value=0.4;
    const len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AU.noise=buf;
    // vento
    const ws=c.createBufferSource();ws.buffer=buf;ws.loop=true;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=520;bp.Q.value=0.6;
    const wg=c.createGain();wg.gain.value=0;const lfo=c.createOscillator();lfo.frequency.value=0.11;const lg=c.createGain();lg.gain.value=0.08;lfo.connect(lg);lg.connect(wg.gain);
    ws.connect(bp);bp.connect(wg);wg.connect(AU.amb);ws.start();lfo.start();AU.wind=wg;
    // zumbido grave das tumbas
    const hg=c.createGain();hg.gain.value=0;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=220;
    for(const f of [48,72.5]){const o=c.createOscillator();o.type='triangle';o.frequency.value=f;o.connect(lp);o.start();}
    lp.connect(hg);hg.connect(AU.amb);AU.hum=hg;
    // motor a diesel: serra grave com pulsos lentos
    const eg=c.createGain();eg.gain.value=0;const elp=c.createBiquadFilter();elp.type='lowpass';elp.frequency.value=150;
    const eo=c.createOscillator();eo.type='sawtooth';eo.frequency.value=34;const eo2=c.createOscillator();eo2.type='square';eo2.frequency.value=51;
    const elfo=c.createOscillator();elfo.frequency.value=6.5;const elg=c.createGain();elg.gain.value=0.35;elfo.connect(elg);const mod=c.createGain();mod.gain.value=0.65;elg.connect(mod.gain);
    eo.connect(elp);eo2.connect(elp);elp.connect(mod);mod.connect(eg);eg.connect(AU.amb);eo.start();eo2.start();elfo.start();AU.engine=eg;
    // reator atômico: zumbido agudo e estável com tremolo lento
    const rg=c.createGain();rg.gain.value=0;const rlp=c.createBiquadFilter();rlp.type='lowpass';rlp.frequency.value=600;
    const ro1=c.createOscillator();ro1.type='sine';ro1.frequency.value=112;const ro2=c.createOscillator();ro2.type='sine';ro2.frequency.value=167;const ro3=c.createOscillator();ro3.type='triangle';ro3.frequency.value=56;
    const rl=c.createOscillator();rl.frequency.value=0.35;const rlg=c.createGain();rlg.gain.value=0.25;const rm=c.createGain();rm.gain.value=0.75;rl.connect(rlg);rlg.connect(rm.gain);
    ro1.connect(rlp);ro2.connect(rlp);ro3.connect(rlp);rlp.connect(rm);rm.connect(rg);rg.connect(AU.amb);ro1.start();ro2.start();ro3.start();rl.start();AU.reactor=rg;
    // tumba viva: pad orgânico, grave e lento
    const bgn=c.createGain();bgn.gain.value=0;const blp=c.createBiquadFilter();blp.type='lowpass';blp.frequency.value=420;
    const bo1=c.createOscillator();bo1.type='triangle';bo1.frequency.value=98;const bo2=c.createOscillator();bo2.type='triangle';bo2.frequency.value=147.8;const bo3=c.createOscillator();bo3.type='sine';bo3.frequency.value=73.4;
    const bl=c.createOscillator();bl.frequency.value=0.18;const blg=c.createGain();blg.gain.value=0.3;const bm=c.createGain();bm.gain.value=0.7;bl.connect(blg);blg.connect(bm.gain);
    bo1.connect(blp);bo2.connect(blp);bo3.connect(blp);blp.connect(bm);bm.connect(bgn);bgn.connect(AU.amb);bo1.start();bo2.start();bo3.start();bl.start();AU.bio=bgn;
  }catch(e){AU.ctx=null;}
}
function auSetOn(on){AU.on=on;if(AU.master)AU.master.gain.setTargetAtTime(on?AU.vol:0,AU.ctx.currentTime,0.05);}
function auArea(inTomb,night,kind){AU.kind=kind||'steam';if(!AU.ctx)return;const t=AU.ctx.currentTime;AU.wind.gain.setTargetAtTime(inTomb?(AU.kind==='city'?0.14:0):(night?0.16:0.3),t,0.6);
  AU.hum.gain.setTargetAtTime(inTomb&&AU.kind==='steam'?0.16:0,t,0.6);AU.engine.gain.setTargetAtTime(inTomb&&AU.kind==='diesel'?0.3:0,t,0.6);AU.reactor.gain.setTargetAtTime(inTomb&&AU.kind==='atom'?0.2:0,t,0.6);AU.bio.gain.setTargetAtTime(inTomb&&AU.kind==='bio'?0.2:0,t,0.6);}
function tone(f,d,type,v,slide,delay,bus){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime+(delay||0),o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f*slide),t+d);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||0.2,t+Math.min(0.02,d/3));g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AU[bus||'sfx']);o.start(t);o.stop(t+d+0.05);}
function burst(d,ftype,f,v,delay,q){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime+(delay||0),s=c.createBufferSource();s.buffer=AU.noise;s.loopStart=0;const fl=c.createBiquadFilter();fl.type=ftype||'lowpass';fl.frequency.value=f||1000;fl.Q.value=q||0.8;
  const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v||0.2,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(fl);fl.connect(g);g.connect(AU.sfx);s.start(t,Math.random()*1.5,d+0.05);}
function once(k,gap,fn){const now=performance.now();if(AU.last[k]&&now-AU.last[k]<gap)return;AU.last[k]=now;fn();}
const SFX={
  step:(run,metal)=>once('step',90,()=>{if(metal){burst(0.07,'bandpass',run?2200:1700,run?0.12:0.07,0,2);tone(run?190:150,0.05,'square',0.02);}else burst(0.09,'lowpass',run?1100:800,run?0.16:0.09);}),
  jump:()=>{burst(0.1,'lowpass',900,0.1);tone(220,0.14,'triangle',0.05,1.5);},
  land:(hard)=>{burst(0.14,'lowpass',500,hard?0.3:0.14);},
  click:()=>{tone(1700,0.03,'square',0.05);tone(1100,0.05,'square',0.04,1,0.03);},
  use:()=>{tone(520,0.08,'triangle',0.1);tone(780,0.1,'triangle',0.08,1,0.06);},
  deny:()=>{tone(180,0.14,'sawtooth',0.07,0.7);},
  warn:()=>once('warn',3500,()=>{tone(880,0.1,'square',0.06);tone(880,0.1,'square',0.06,1,0.16);}),
  hit:()=>{burst(0.22,'lowpass',300,0.4);tone(110,0.25,'sawtooth',0.12,0.5);},
  steam:(v)=>once('steam',250,()=>burst(0.5,'highpass',2600,v||0.12,0,0.6)),
  piston:()=>once('piston',140,()=>{tone(90,0.12,'square',0.06,0.6);burst(0.09,'lowpass',700,0.12);}),
  crack:()=>once('crack',120,()=>{burst(0.12,'bandpass',1400,0.2,0,3);tone(140,0.12,'sawtooth',0.05,0.6);}),
  fall:()=>{tone(400,0.7,'sine',0.1,0.15);},
  wake:()=>{tone(90,0.45,'sawtooth',0.12,1.6);burst(0.5,'highpass',2200,0.16,0.05);tone(200,0.2,'square',0.06,0.8,0.2);},
  sleep:()=>{tone(260,0.5,'sine',0.06,0.5);},
  lamp:()=>{burst(0.18,'bandpass',900,0.12,0,1.2);tone(330,0.35,'triangle',0.08,2);tone(495,0.4,'triangle',0.06,2,0.08);},
  gate:()=>{tone(70,1.1,'sawtooth',0.08,1.4);burst(1.1,'lowpass',420,0.14);},
  lever:()=>{tone(150,0.1,'square',0.08);burst(0.3,'highpass',2400,0.14,0.04);},
  relic:()=>{[392,494,587,784,988].forEach((f,i)=>tone(f,0.9,'triangle',0.09,1,i*0.11));burst(0.8,'highpass',3000,0.05,0.2);},
  heal:()=>{tone(523,0.3,'sine',0.08);tone(659,0.35,'sine',0.07,1,0.1);tone(784,0.5,'sine',0.07,1,0.2);},
  page:()=>{burst(0.12,'bandpass',2500,0.07,0,0.7);},
  insc:()=>{tone(220,0.8,'sine',0.07);tone(330,0.9,'sine',0.05,1,0.1);},
  chest:()=>{burst(0.3,'bandpass',500,0.12,0,3);tone(180,0.25,'triangle',0.06,1.5);[660,880,1100].forEach((f,i)=>tone(f,0.5,'sine',0.07,1,0.18+i*0.09));},
  frag:()=>{burst(0.18,'bandpass',2400,0.1,0,2);tone(784,0.3,'triangle',0.07);tone(1046,0.45,'triangle',0.06,1,0.1);},
  node:(i)=>{const f=[262,330,392,523][((i%4)+4)%4];tone(f,0.6,'sine',0.17);tone(f*2,0.4,'triangle',0.05);},
  bioFail:()=>{tone(150,0.4,'sawtooth',0.1,0.5);tone(158,0.4,'sawtooth',0.1,0.5);burst(0.35,'lowpass',500,0.22);},
  bioChime:()=>{[392,494,587,784].forEach((f,i)=>tone(f,0.9,'sine',0.1,1,i*0.12));},
  membrane:()=>{burst(0.9,'bandpass',600,0.12,0,1.5);tone(180,0.9,'sine',0.08,0.4);},
  valve:()=>{tone(200,0.12,'square',0.05,0.6);burst(0.35,'highpass',2200,0.1,0.05,0.7);tone(90,0.4,'sine',0.05,1.4,0.1);},
  pump:()=>once('pump',500,()=>{burst(0.6,'lowpass',500,0.16);tone(60,0.6,'sawtooth',0.05,1.3);}),
  rotate:()=>{tone(140,0.09,'square',0.08,0.7);burst(0.12,'bandpass',1200,0.14,0.02,2);tone(520,0.05,'square',0.03,1,0.06);},
  sensor:()=>{tone(880,0.12,'triangle',0.09);tone(1320,0.22,'triangle',0.08,1,0.1);},
  elev:()=>once('elev',400,()=>{tone(70,0.7,'sawtooth',0.07,1.5);burst(0.7,'lowpass',380,0.12);}),
  alert:()=>{tone(660,0.12,'square',0.08);tone(990,0.16,'square',0.08,1,0.14);},
  /* painel de programação */
  placa:()=>{tone(420,0.05,'square',0.05);burst(0.06,'bandpass',1800,0.08,0.01,3);},
  tira:()=>{tone(300,0.06,'square',0.04,0.7);},
  passo:(i)=>once('passo',60,()=>{const f=[523,587,659,698,784][((i|0)%5+5)%5];tone(f,0.07,'triangle',0.05);tone(f*0.5,0.05,'square',0.02);}),
  decide:(v)=>{tone(v?880:330,0.12,'triangle',0.07);tone(v?1175:262,0.14,'triangle',0.05,1,0.08);},
  volta:()=>{tone(660,0.05,'sine',0.05);tone(990,0.06,'sine',0.04,1,0.05);},
  atribui:()=>{burst(0.08,'bandpass',900,0.08,0,2);tone(500,0.08,'triangle',0.05,1.5,0.03);},
  erroProg:()=>{tone(220,0.16,'square',0.06,0.8);tone(165,0.24,'square',0.06,0.8,0.14);},
  sucesso:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,0.35,'triangle',0.08,1,i*0.09));},
  maquina:()=>once('maquina',200,()=>{tone(110,0.25,'sawtooth',0.05,1.3);burst(0.3,'lowpass',600,0.1,0.02);}),
  rega:()=>{burst(0.35,'highpass',3000,0.06,0,0.5);tone(700,0.12,'sine',0.03,0.6,0.05);},
  agua:()=>once('agua',300,()=>{burst(0.5,'lowpass',700,0.12,0,0.8);})
};
const SCALE=[293.66,329.63,369.99,440,493.88,587.33];
function auUpdate(dt,inTomb,night,mode){
  if(!AU.ctx||!AU.on)return;const now=AU.ctx.currentTime;
  if(inTomb){
    if(AU.kind==='bio'){
      if(now>(AU.nextBeat||0)){AU.nextBeat=now+(AU.beatGap||1);tone(58,0.14,'sine',0.17,0.55,0,'amb');tone(50,0.16,'sine',0.12,0.55,0.2,'amb');}
      if(now>(AU.nextDrip||0)){AU.nextDrip=now+1.4+Math.random()*3.5;const f=700+Math.random()*700;tone(f,0.09,'sine',0.04,0.55,0,'amb');tone(f*0.75,0.12,'sine',0.022,0.5,0.18,'amb');}
      if(now>(AU.nextBreath||0)){AU.nextBreath=now+4.2;burst(1.6,'lowpass',420,0.05,0,0.6);}
    }
    else if(AU.kind==='city'){
      const lv=AU.cityLvl||0;
      if(now>(AU.nextCityChord||0)){AU.nextCityChord=now+(8-4.5*lv)+Math.random()*3;const n=2+Math.round(lv*2.4),base=lv>0.45?1:0.5,i=Math.floor(Math.random()*3);
        for(let j=0;j<n;j++){const k=i+j*2,f=SCALE[k%SCALE.length]*base*(k>=SCALE.length?2:1)*0.5;
          const o=AU.ctx.createOscillator(),g=AU.ctx.createGain();o.type=lv>0.6?'sine':'triangle';o.frequency.value=f;
          g.gain.setValueAtTime(0.0001,now+j*0.35);g.gain.linearRampToValueAtTime(0.04+0.03*lv,now+j*0.35+2);g.gain.linearRampToValueAtTime(0.0001,now+j*0.35+6.5);o.connect(g);g.connect(AU.mus);o.start(now+j*0.35);o.stop(now+j*0.35+6.7);}}
      if(lv>0.25&&now>(AU.nextBird||0)){AU.nextBird=now+2+Math.random()*(6-4*lv);const f=2200+Math.random()*1600;tone(f,0.07,'sine',0.03,1.25,0,'amb');tone(f*1.2,0.08,'sine',0.025,0.9,0.11,'amb');}
      if(Math.random()<dt*0.5)burst(0.5,'highpass',3500,0.025,0,0.5);
    }
    else if(AU.kind==='atom'){const rate=AU.geiger||1.2;if(Math.random()<rate*dt)burst(0.02,'highpass',3200,0.07,0,1);}
    else if(AU.kind==='diesel'){if(now>(AU.nextRadio||0)){AU.nextRadio=now+2.5+Math.random()*6;burst(0.18+Math.random()*0.5,'bandpass',1600+Math.random()*1800,0.05,0,5);if(Math.random()<0.5)tone(380+Math.random()*500,0.12,'sawtooth',0.012,0.7);}}
    else if(now>AU.nextTick){AU.nextTick=now+0.62;AU.flip=!AU.flip;tone(AU.flip?1250:980,0.025,'square',0.025,1,0,'amb');if(Math.random()<0.08)SFX.steam(0.06);}
  }
  else if(mode==='play'||mode==='menu'){ if(now>AU.nextChord){AU.nextChord=now+9+Math.random()*5;const base=night?0.5:1,i=Math.floor(Math.random()*4);[i,i+2,i+3].forEach((k,j)=>{const f=SCALE[k%SCALE.length]*base*(k>=SCALE.length?2:1)*0.5;
      const o=AU.ctx.createOscillator(),g=AU.ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0.0001,now+j*0.4);g.gain.linearRampToValueAtTime(0.045,now+j*0.4+2.2);g.gain.linearRampToValueAtTime(0.0001,now+j*0.4+7);o.connect(g);g.connect(AU.mus);o.start(now+j*0.4);o.stop(now+j*0.4+7.2);});} }
}
