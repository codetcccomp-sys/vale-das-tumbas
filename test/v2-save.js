// Etapa 2: salvamento robusto. Saves válidos antigos continuam carregando; campos estragados são
// recuperados sem travar; versões desconhecidas e lixo são recusados; mensagens explicam o que volta.
const {open}=require('./lib');const {suite}=require('./assert');
(async()=>{
  const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);const S=suite('salvamento');
  const KEY='vale_das_tumbas_save';
  const load=raw=>ev(([KEY,raw])=>{localStorage.setItem(KEY,raw);const s=readSave();return s&&JSON.parse(JSON.stringify(s));},[KEY,raw]);
  const startWith=raw=>ev(([KEY,raw])=>{localStorage.setItem(KEY,raw);toastClear();__vt.start(false);__vt.sim(2);
    const G=__vt.G;return{relics:G.relics,diary:G.diary,sec:G.sec,insc:G.insc,x:G.p.x,z:G.p.z,area:G.area.name,msgs:TOASTS.on.map(t=>t.text).concat(TOASTS.queue.map(t=>t.text)),
      saved:JSON.parse(localStorage.getItem(KEY))};},[KEY,raw]);
  const base={v:1,relics:{steam:true,diesel:false,atom:true,bio:false},diary:['camp','steam_enter','steam_relic','atom_relic'],insc:{oasis:1},sec:{f_nw:true,c2:true},done:false,time:0.4,pos:{x:30,z:60},yaw:1.2};
  const J=o=>JSON.stringify(o);

  // 1) saves válidos antigos
  let r=await load(J(base));
  S.ok(r&&r.relics.steam&&r.relics.atom&&!r.relics.diesel&&!r.fixed,'save válido atual carrega sem correções',r&&r.relics);
  const old={v:1,relics:{steam:true,diesel:false,atom:false,bio:false},diary:['camp','steam_relic'],insc:{},time:0.3,pos:{x:10,z:20},yaw:0.5};
  r=await load(J(old));
  S.ok(r&&r.relics.steam&&r.diary.length===2&&J(r.sec)==='{}'&&!r.fixed,'save antigo (sem segredos, sem fim) carrega sem correções',r);
  r=await startWith(J(old));
  S.ok(r.relics.steam&&Math.hypot(r.x-10,r.z-20)<1.5&&r.area==='vale','save antigo: jogo continua no ponto salvo do vale',{x:r.x,z:r.z});
  S.ok(r.msgs.some(m=>/1\/4 relíquias/.test(m)&&/segredos/.test(m)),'mensagem ao continuar diz o que foi recuperado',r.msgs);

  // 2) campos estragados são recuperados
  r=await load(J(Object.assign({},base,{relics:null})));
  S.ok(r&&r.fixed&&r.relics.steam&&r.relics.atom&&!r.relics.diesel&&!r.relics.bio,'relics:null — relíquias deduzidas do diário',r&&r.relics);
  r=await load(J(Object.assign({},base,{relics:null,diary:['camp']})));
  S.ok(r&&r.fixed&&!r.relics.steam&&!r.relics.atom,'relics:null sem anotações — relíquias zeradas, sem travar',r&&r.relics);
  r=await load(J(Object.assign({},base,{relics:{steam:'sim',diesel:1,atom:true,bio:null}},{diary:['camp']})));
  S.ok(r&&r.fixed&&r.relics.steam===false&&r.relics.diesel===false&&r.relics.atom===true&&r.relics.bio===false,'relíquias com tipos errados não viram verdadeiras',r&&r.relics);
  r=await load(J(Object.assign({},base,{done:true,relics:{}})));
  S.ok(r&&r.relics.steam&&r.relics.diesel&&r.relics.atom&&r.relics.bio,'jogo terminado implica as quatro relíquias',r&&r.relics);
  r=await load(J(Object.assign({},base,{diary:'abc'})));
  S.ok(r&&r.fixed&&Array.isArray(r.diary)&&r.diary.length===0&&r.relics.steam,'diário que não é lista vira lista vazia',r&&r.diary);
  r=await load(J(Object.assign({},base,{diary:['camp','camp','xyz',7,null,'steam_relic']})));
  S.ok(r&&r.fixed&&J(r.diary)==='["camp","steam_relic"]','diário: remove repetidos, ids desconhecidos e não-textos',r&&r.diary);
  r=await load(J(Object.assign({},base,{insc:{oasis:1,hack:1},sec:[]})));
  S.ok(r&&r.fixed&&J(r.insc)==='{"oasis":1}'&&J(r.sec)==='{}','inscrições e segredos só com ids conhecidos',r&&{insc:r.insc,sec:r.sec});
  r=await load('{"v":1,"relics":{"steam":true},"diary":["camp"],"sec":{"__proto__":{"x":1},"c1":true},"pos":{"x":1,"z":2},"time":0.2}');
  S.ok(r&&J(r.sec)==='{"c1":true}'&&({}).x===undefined,'chave __proto__ no save é descartada',r&&r.sec);
  r=await load(J(Object.assign({},base,{pos:{x:'a',z:3},time:null,yaw:'x'})));
  S.ok(r&&r.fixed&&r.pos.x===0&&r.pos.z===150&&r.time===0.12&&r.yaw===null,'posição, hora e direção inválidas viram o padrão',r&&{pos:r.pos,time:r.time,yaw:r.yaw});
  r=await startWith(J(Object.assign({},base,{pos:{x:1e9,z:-1e9}})));
  S.ok(Math.hypot(r.x,r.z)<=203,'posição absurda é trazida para dentro do vale',{x:r.x,z:r.z});
  r=await startWith(J(Object.assign({},base,{relics:null,diary:['camp','steam_relic']})));
  S.ok(r.msgs.some(m=>/danificada/.test(m)),'aviso de recuperação aparece ao continuar um save corrigido',r.msgs);
  S.ok(r.saved&&r.saved.relics&&r.saved.relics.steam===true&&typeof r.saved.relics==='object','o save corrigido é regravado limpo',r.saved&&r.saved.relics);

  // 3) recusados: sem botão Continuar
  for(const [lab,raw] of [['JSON quebrado','{"v":1,'],['null','null'],['lista','[]'],['versão futura',J(Object.assign({},base,{v:2}))],['sem nada aproveitável','{"v":1,"foo":1}'],['texto','"oi"']]){
    const x=await ev(([KEY,raw])=>{localStorage.setItem(KEY,raw);const s=readSave();refreshStart();return{s,hidden:document.getElementById('btnContinue').hidden};},[KEY,raw]);
    S.ok(x.s===null&&x.hidden,'recusa '+lab+' e esconde Continuar');
  }

  // 4) salvar dentro de uma tumba: ao continuar volta à porta dela, com explicação
  const t=await ev(([KEY])=>{localStorage.removeItem(KEY);__vt.start(true);__vt.sim(5);__vt.enter('diesel');let n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}
    __vt.tp(0,-40,0);__vt.G.p.face=0;__vt.saveNow();const raw=JSON.parse(localStorage.getItem(KEY));
    __vt.press('pause');__vt.sim(1);if(typeof handleGlobalInput==='function')handleGlobalInput();const info=document.getElementById('saveInfo').textContent;
    goMenu();refreshStart();const note=document.getElementById('startNote').textContent;
    toastClear();__vt.start(false);__vt.sim(2);
    const T=__vt.TOMBS.diesel;return{tomb:raw.tomb,info,note,x:__vt.G.p.x,z:__vt.G.p.z,ex:T.entry.x,ez:T.entry.z,area:__vt.G.area.name,cp:__vt.G.checkpoint,msgs:TOASTS.on.map(t=>t.text).concat(TOASTS.queue.map(t=>t.text))};},[KEY]);
  S.ok(t.tomb==='diesel','save feito dentro da tumba registra qual tumba',t.tomb);
  S.ok(/porta desta tumba/.test(t.info),'pausa dentro da tumba explica o que acontece ao sair',t.info);
  S.ok(/porta da Tumba dos Motores/.test(t.note),'tela inicial diz de onde o jogo continua',t.note);
  S.ok(t.area==='vale'&&Math.hypot(t.x-t.ex,t.z-t.ez)<1.5&&t.cp===null,'continuar: na porta da tumba, sem ponto de controle antigo',{x:t.x,z:t.z});
  S.ok(t.msgs.some(m=>/porta da Tumba dos Motores/.test(m)&&/pontos de energia/.test(m)),'mensagem ao continuar explica a volta à porta',t.msgs);
  S.done(logs);await browser.close();
})();
