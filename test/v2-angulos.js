// wrapPi() e a direção da câmera no save. A versão antiga normalizava o ângulo com laços de subtração e travava
// com valores enormes (1e20 - 2π == 1e20) ou infinitos; um save com "yaw": 1e20 congelava o jogo ao abrir.
// Parte A: a função extraída do código-fonte roda num contexto vm do Node com limite de tempo, que interrompe um
// laço infinito em vez de travar o teste. Parte B: saves no navegador, com um vigia que derruba a página se travar.
const vm=require('vm'),fs=require('fs'),path=require('path');
const {open,ROOT}=require('./lib');const {suite}=require('./assert');
const S=suite('ângulos e save');
const PI=Math.PI,TAU=2*Math.PI;

/* ---------- Parte A: wrapPi isolada, com limite de tempo ---------- */
const src=fs.readFileSync(path.join(ROOT,'src/01-core.js'),'utf8');
const linhaTau=src.match(/^const TAU=.*$/m)[0],linhaWrap=src.match(/^const wrapPi=.*$/m)[0];
const ANTIGA='const wrapPi=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a;};';
function contexto(def){const ctx=vm.createContext({});vm.runInContext(linhaTau+';'+def+';this.wrapPi=wrapPi;',ctx);return ctx;}
const novo=contexto(linhaWrap),antigo=contexto(ANTIGA);
/* roda código no contexto com limite de tempo; um laço infinito vira erro ERR_SCRIPT_EXECUTION_TIMEOUT */
function rodar(ctx,codigo,ms){const t=process.hrtime.bigint();try{const v=vm.runInContext(codigo,ctx,{timeout:ms||1000});return{v,ms:Number(process.hrtime.bigint()-t)/1e6};}
  catch(e){return{erro:e.code||e.message,ms:Number(process.hrtime.bigint()-t)/1e6};}}
const W=x=>rodar(novo,'wrapPi('+x+')');
const dist=(a,b)=>{const d=Math.abs(a-b)%TAU;return Math.min(d,TAU-d);};   // distância angular, ignora a volta em ±π
const noIntervalo=r=>typeof r==='number'&&isFinite(r)&&r>=-PI&&r<=PI;

// a) o limite de tempo realmente interrompe um travamento (prova com a versão antiga)
const velho=rodar(antigo,'wrapPi(1e20)',300);
S.ok(velho.erro==='ERR_SCRIPT_EXECUTION_TIMEOUT'&&velho.ms<2000,'o limite de tempo interrompe a versão antiga travada em 1e20 (prova de que o teste não fica preso)',velho);

// b) ângulos comuns ficam iguais
const comuns=[0,0.5,-0.5,1,-1,2,-2,PI/2,-PI/2,3,-3];
const rc=rodar(novo,'['+comuns.join(',')+'].map(wrapPi)');
S.ok(!rc.erro&&rc.v.every((r,i)=>r===comuns[i]),'ângulos comuns entre -π e π voltam exatamente iguais',rc.v);

// c) limites próximos de ±π
const lim=rodar(novo,`[wrapPi(Math.PI),wrapPi(-Math.PI),wrapPi(Math.PI+1e-12),wrapPi(-Math.PI-1e-12),wrapPi(Math.PI*(1+Math.pow(2,-52))),wrapPi(-Math.PI*(1+Math.pow(2,-52))),wrapPi(3*Math.PI),wrapPi(-3*Math.PI),wrapPi(TAU),wrapPi(-TAU)]`);
const L=lim.v||[];
S.ok(!lim.erro&&L[0]===PI&&L[1]===-PI,'π e -π continuam π e -π',L.slice(0,2));
S.ok(!lim.erro&&L.every(noIntervalo)&&dist(L[2],PI+1e-12)<1e-15&&dist(L[3],-PI-1e-12)<1e-15&&L[2]<0&&L[3]>0,'um pouco além de ±π dá a volta para o outro lado, no mesmo ângulo',L.slice(2,4));
S.ok(!lim.erro&&dist(L[4],PI)<1e-15&&dist(L[5],-PI)<1e-15&&Math.abs(Math.abs(L[6])-PI)<1e-12&&Math.abs(Math.abs(L[7])-PI)<1e-12&&L[8]===0&&L[9]===0,'±3π vira ±π e ±2π vira 0',L.slice(4));

// d) equivalência: somar voltas inteiras não muda o ângulo; positivo e negativo são simétricos
const eq=rodar(novo,`(()=>{let pior=0,fora=0,assim=0;for(let i=0;i<=2000;i++){const a=-Math.PI+2*Math.PI*i/2000;
  for(const k of[-1000,-37,-2,-1,1,2,37,1000]){const r=wrapPi(a+k*TAU);if(!(r>=-Math.PI&&r<=Math.PI))fora++;
    let d=Math.abs(r-a)%TAU;d=Math.min(d,TAU-d);if(d>pior)pior=d;}
  const x=a*7.3;if(wrapPi(-x)!==-wrapPi(x))assim++;}return{pior,fora,assim};})()`,5000);
S.ok(!eq.erro&&eq.v.fora===0&&eq.v.pior<1e-9,'somar de -1000 a +1000 voltas devolve o mesmo ângulo (16 mil casos)',eq.v||eq);
S.ok(!eq.erro&&eq.v.assim===0,'simetria: wrapPi(-x) é exatamente -wrapPi(x)',eq.v&&eq.v.assim);

// e) igual à versão antiga onde ela funcionava (o jogo não muda de comportamento)
const cmp=rodar(novo,`(()=>{const o=${ANTIGA.replace('const wrapPi=','')};let dif3=0,pior=0;for(let i=0;i<=20000;i++){const x=-50+100*i/20000,a=o(x),b=wrapPi(x);
  if(Math.abs(x)<=3*Math.PI&&a!==b)dif3++;let d=Math.abs(a-b)%TAU;d=Math.min(d,TAU-d);if(d>pior)pior=d;}return{dif3,pior};})()`,5000);
S.ok(!cmp.erro&&cmp.v.dif3===0&&cmp.v.pior<1e-12,'resultado idêntico ao da versão antiga entre -3π e 3π e equivalente até ±50',cmp.v||cmp);

// f) valores extremos terminam rápido e caem no intervalo
const ext=['1e20','-1e20','1e300','-1e300','Number.MAX_VALUE','-Number.MAX_VALUE','Number.MIN_VALUE','-Number.MIN_VALUE','-0','Math.pow(2,53)','-Math.pow(2,53)'];
const re=rodar(novo,'['+ext.map(e=>'wrapPi('+e+')').join(',')+']',1000);
S.ok(!re.erro&&re.v.every(noIntervalo),'±1e20, ±1e300, ±MAX_VALUE, ±MIN_VALUE, -0 e 2^53 dão ângulo finito entre -π e π',re.erro||re.v);
const rapido=rodar(novo,'(()=>{let s=0;for(let i=0;i<100000;i++)s+=wrapPi(i%2?1e20:-1e300);return s;})()',2000);
S.ok(!rapido.erro&&rapido.ms<500,'100 mil chamadas com valores extremos em menos de 0,5 s (tempo constante)',{ms:+rapido.ms.toFixed(1),erro:rapido.erro});

// g) entradas não numéricas e não finitas: devolvem 0, sem erro e sem travar
const nn=['null','undefined',"'abc'","'1.5'","''",'true','false','({})','[]','[1]','NaN','Infinity','-Infinity','Symbol()','10n'];
const rn=rodar(novo,'['+nn.map(e=>'wrapPi('+e+')').join(',')+']',1000);
S.ok(!rn.erro&&rn.v.every(r=>r===0),'null, undefined, textos, booleanos, objetos, NaN, ±Infinity, Symbol e BigInt devolvem 0',rn.erro||rn.v);

/* ---------- Parte B: saves no navegador ---------- */
(async()=>{
  const {browser,page,logs}=await open();
  /* vigia: se a página travar, derruba o navegador e reprova em vez de ficar preso */
  const vigia=setTimeout(()=>{console.log('  FALHA  a página travou: tempo esgotado (60 s)');try{browser.process().kill('SIGKILL');}catch(e){}process.exit(1);},60000);
  const ev=(f,a)=>Promise.race([page.evaluate(f,a),new Promise((_,rej)=>setTimeout(()=>rej(new Error('evaluate passou de 15 s')),15000))]);
  const KEY='vale_das_tumbas_save';
  const base={v:1,relics:{steam:true,diesel:false,atom:true,bio:false},diary:['camp','steam_enter','steam_relic','atom_relic'],insc:{oasis:1},sec:{f_nw:true,c2:true},done:false,time:0.4,pos:{x:30,z:60}};
  const ler=raw=>ev(([KEY,raw])=>{localStorage.setItem(KEY,raw);const t=performance.now();const s=readSave();return{ms:performance.now()-t,s:s&&JSON.parse(JSON.stringify(s))};},[KEY,raw]);
  const preservado=s=>s&&JSON.stringify(s.relics)===JSON.stringify({steam:true,diesel:false,atom:true,bio:false})&&s.diary.join()===base.diary.join()&&
    JSON.stringify(s.sec)==='{"f_nw":true,"c2":true}'&&JSON.stringify(s.insc)==='{"oasis":1}'&&s.pos.x===30&&s.pos.z===60&&Math.abs(s.time-0.4)<1e-12;   // a hora passa por ((t%1)+1)%1, que já arredondava 1e-16 antes desta correção
  try{
    await ev(()=>{__vt.start(true);__vt.sim(3);});
    let r=await ler(JSON.stringify(Object.assign({},base,{yaw:1.2})));
    S.ok(r.s&&!r.s.fixed&&r.s.yaw===1.2&&preservado(r.s),'save válido com direção 1,2 carrega igual, sem aviso de dano',r.s&&{yaw:r.s.yaw,fixed:r.s.fixed});
    r=await ler(JSON.stringify(Object.assign({},base,{yaw:7})));
    S.ok(r.s&&!r.s.fixed&&Math.abs(r.s.yaw-(7-TAU))<1e-12&&preservado(r.s),'save antigo com ângulo sem normalizar (7) carrega como 7-2π, sem aviso',r.s&&{yaw:r.s.yaw,fixed:r.s.fixed});
    r=await ler(JSON.stringify(base));
    S.ok(r.s&&!r.s.fixed&&r.s.yaw===null&&preservado(r.s),'save sem direção carrega com a direção padrão, sem aviso',r.s&&{yaw:r.s.yaw,fixed:r.s.fixed});
    r=await ler(JSON.stringify(Object.assign({},base,{yaw:1e20})));
    S.ok(r.s&&r.ms<50,'o caso que travava (yaw 1e20) termina em menos de 50 ms',{ms:+r.ms.toFixed(2)});
    S.ok(r.s&&r.s.fixed&&r.s.yaw===null&&preservado(r.s),'yaw 1e20: direção recuperada; relíquias, diário, segredos, inscrições, posição e hora preservados',r.s&&{yaw:r.s.yaw,fixed:r.s.fixed,relics:r.s.relics,pos:r.s.pos});
    for(const [nome,raw] of [['-1e20',JSON.stringify(Object.assign({},base,{yaw:-1e20}))],['null',JSON.stringify(Object.assign({},base,{yaw:null}))],
      ['texto "abc"',JSON.stringify(Object.assign({},base,{yaw:'abc'}))],['texto "1.2"',JSON.stringify(Object.assign({},base,{yaw:'1.2'}))],
      ['1e400 (vira Infinity)',JSON.stringify(Object.assign({},base,{yaw:0})).replace('"yaw":0','"yaw":1e400')],
      ['-1e400 (vira -Infinity)',JSON.stringify(Object.assign({},base,{yaw:0})).replace('"yaw":0','"yaw":-1e400')],
      ['objeto',JSON.stringify(Object.assign({},base,{yaw:{}}))],['lista',JSON.stringify(Object.assign({},base,{yaw:[1]}))],['2e6 (sem precisão útil)',JSON.stringify(Object.assign({},base,{yaw:2e6}))]]){
      r=await ler(raw);
      S.ok(r.s&&r.ms<50&&r.s.fixed&&r.s.yaw===null&&preservado(r.s),'yaw '+nome+': rápido, direção recuperada e o resto do progresso preservado',r.s&&{ms:+r.ms.toFixed(2),yaw:r.s.yaw,fixed:r.s.fixed});
    }
    /* do começo ao fim: continuar o jogo com o save problemático */
    const fim=await ev(([KEY,raw])=>{localStorage.setItem(KEY,raw);toastClear();const t=performance.now();__vt.start(false);__vt.sim(2);const ms=performance.now()-t;
      const G=__vt.G,salvo=JSON.parse(localStorage.getItem(KEY)),relido=readSave();
      return{ms,modo:G.mode,area:G.area.name,x:G.p.x,z:G.p.z,yaw:__vt.cam.yaw,relics:G.relics,sec:G.sec,diary:G.diary.length,
        msgs:TOASTS.on.map(t=>t.text).concat(TOASTS.queue.map(t=>t.text)),salvoYaw:salvo.yaw,relidoFixed:relido.fixed};},[KEY,JSON.stringify(Object.assign({},base,{yaw:1e20}))]);
    S.ok(fim.modo==='play'&&fim.ms<3000,'continuar com yaw 1e20 abre o jogo normalmente',{modo:fim.modo,ms:Math.round(fim.ms)});
    S.ok(Math.hypot(fim.x-30,fim.z-60)<1.5&&fim.relics.steam&&fim.relics.atom&&fim.sec.f_nw&&fim.diary===4,'continuar: posição, relíquias, segredos e diário do save mantidos',{x:fim.x,z:fim.z,relics:fim.relics});
    S.ok(Number.isFinite(fim.yaw)&&Math.abs(fim.yaw)<=PI&&fim.msgs.some(m=>/danificada/.test(m)),'continuar: câmera com direção válida e aviso de que parte do save foi recuperada',{yaw:fim.yaw,msgs:fim.msgs});
    S.ok(Number.isFinite(fim.salvoYaw)&&Math.abs(fim.salvoYaw)<=PI&&fim.relidoFixed===false,'o save regravado fica limpo (direção normalizada, sem correções na próxima leitura)',{yaw:fim.salvoYaw,fixed:fim.relidoFixed});
    const ok7=await ev(([KEY,raw])=>{localStorage.setItem(KEY,raw);toastClear();__vt.start(false);__vt.sim(2);
      return{yaw:__vt.cam.yaw,msgs:TOASTS.on.map(t=>t.text).concat(TOASTS.queue.map(t=>t.text))};},[KEY,JSON.stringify(Object.assign({},base,{yaw:7}))]);
    S.ok(Math.abs(ok7.yaw-(7-TAU))<1e-12&&!ok7.msgs.some(m=>/danificada/.test(m)),'continuar um save válido antigo (yaw 7): mesma direção, sem aviso de dano',ok7);
  }catch(e){S.ok(false,'parte do navegador terminou sem erro',e.message);}
  clearTimeout(vigia);
  S.done(logs);await browser.close();
})();
