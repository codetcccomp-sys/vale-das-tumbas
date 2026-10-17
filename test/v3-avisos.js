// Etapa 3: avisos sem repetição e com prioridade; motivo de cada falha; pista na porta bloqueada;
// faixas nas bordas dos vãos; sombra de pouso; objetivo e ponto de controle em destaque.
const {open}=require('./lib');const {suite}=require('./assert');
(async()=>{
  const {browser,page,logs}=await open();const ev=(f,a)=>page.evaluate(f,a);const S=suite('avisos e perigos');
  const vis=()=>ev(()=>Array.from(document.querySelectorAll('#msgs .toast:not(.out)')).map(e=>e.textContent));
  await ev(()=>{__vt.start(true);__vt.sim(5);toastClear();});
  await page.waitForTimeout(700);

  // 1) repetição: o mesmo texto vira um aviso só com contador
  await ev(()=>{for(let i=0;i<3;i++)toast('Esta tumba está selada.');});
  let v=await vis();
  S.ok(v.length===1&&/×3/.test(v[0]),'mesmo aviso 3x: um só na tela, com ×3',v);
  // 2) limite e fila: 5 dicas diferentes -> 3 na tela, o resto espera
  await ev(()=>{toastClear();});await page.waitForTimeout(600);
  await ev(()=>{for(let i=1;i<=5;i++)toast('Dica número '+i+'.');});
  v=await vis();
  S.ok(v.length===3&&v[0].startsWith('Dica número 1'),'no máximo 3 avisos; os mais antigos primeiro',v);
  // 3) prioridade: um perigo entra na hora, tirando uma dica
  await ev(()=>toast('Perigo urgente!','warn'));
  v=await vis();
  S.ok(v.length===3&&v.some(t=>t.startsWith('Perigo urgente')),'aviso de perigo entra mesmo com a tela cheia de dicas',v);
  // 4) tempo de leitura proporcional ao texto
  const ms=await ev(()=>{const long='x'.repeat(120);toastClear();toast(long);const t=TOASTS.on.find(o=>o.text===long);return t.until-t.born;});
  S.ok(ms>=7000&&ms<=9500,'texto de 120 letras fica pelo menos 7 s',ms);
  const ms2=await ev(()=>{toastClear();toast('Curto.');const t=TOASTS.on.find(o=>o.text==='Curto.');return t.until-t.born;});
  S.ok(ms2>=4000,'texto curto fica pelo menos 4 s',ms2);
  // 5) a fila anda quando um aviso expira
  /* chama o mesmo toastTick que o laço de quadros chama, sem depender do ritmo dos quadros no navegador de teste */
  await ev(()=>{toastClear();for(let i=1;i<=4;i++)toast('Fila '+i+'.');TOASTS.on[0].until=performance.now()-1;toastTick(performance.now());});
  v=await vis();
  S.ok(v.some(t=>t.startsWith('Fila 4')),'quando um aviso sai, o próximo da fila aparece',v);
  // 6) recém-saído não volta imediatamente (anti-spam), mas volta depois
  const again=await ev(async()=>{toastClear();const a=toast('Aviso repetido.');const t=TOASTS.on[0];toastOut(t,performance.now());const b=toast('Aviso repetido.');
    await new Promise(r=>setTimeout(r,1300));const c=toast('Aviso repetido.');return[!!a,!!b,!!c];});
  S.ok(again[0]&&!again[1]&&again[2],'o mesmo aviso não pisca de novo em menos de 1,2 s',again);

  // 7) porta final bloqueada: diz quantas e quais relíquias faltam e para onde ir
  const door=await ev(()=>{toastClear();__vt.G.relics={steam:true,diesel:false,atom:false,bio:true};useFinalDoor();return TOASTS.on.map(t=>t.text).concat(TOASTS.queue.map(t=>t.text));});
  S.ok(door.some(t=>/Faltam 2/.test(t)&&/Tumba dos Motores \(oeste\)/.test(t)&&/Tumba do Reator \(sudoeste\)/.test(t)&&!/Engrenagens/.test(t)),'porta final: lista as relíquias que faltam com a direção',door);

  // 8) motivo de cada falha e para onde volta
  const fails=await ev(()=>{const out={};const play=()=>{let n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}};const last=()=>{const a=TOASTS.on.concat(TOASTS.queue);return a.length?a[a.length-1].text:'';};
    __vt.G.relics={steam:false,diesel:false,atom:false,bio:false};
    __vt.enter('steam');play();
    toastClear();__vt.G.hearts=3;__vt.tp(0,-20,0);__vt.G.p.y=-6;__vt.sim(1);out.vao=last();
    /* placa sem o olho */
    const tl=__vt.tomb.tiles.find(t=>!t.safe);toastClear();__vt.G.hearts=3;__vt.tp(tl.x,tl.z,0);for(let i=0;i<150&&__vt.G.p.z!==5;i++){__vt.sim(1);if(__vt.G.p.y<-4.9)break;}__vt.sim(2);out.placa=last();
    /* pistão que desce */
    toastClear();__vt.G.hearts=3;__vt.G.cause={k:'piston',t:__vt.G.t};__vt.G.p.y=-6;__vt.sim(1);out.pistao=last();
    /* com ponto de energia aceso: volta ao ponto */
    const b=__vt.tomb.boilers[0];__vt.tp(b.x+1.7,b.z,0);__vt.sim(2);__vt.use();__vt.sim(2);toastClear();__vt.G.hearts=3;__vt.G.p.y=-6;__vt.sim(1);out.comPonto=last();
    /* guardião */
    toastClear();__vt.G.hearts=3;__vt.G.invuln=0;hurt(1,0,0,'automato');out.guarda=last();
    /* sem corações */
    toastClear();__vt.G.hearts=1;__vt.G.invuln=0;hurt(1,0,0,'automato');out.morte=last();out.vida=__vt.G.hearts;
    __vt.exit(false);play();
    /* canal da tumba do reator */
    __vt.enter('atom');play();const w=__vt.TOMB_AREAS.atom.water[0];toastClear();__vt.G.hearts=3;__vt.tp((w.x0+w.x1)/2,(w.z0+w.z1)/2,0);__vt.G.p.y=-6;__vt.sim(1);out.agua=last();
    __vt.exit(false);play();return out;});
  S.ok(/caiu no vão/.test(fails.vao)&&/entrada/.test(fails.vao),'queda no vão sem ponto: diz que volta à entrada',fails.vao);
  S.ok(/placa sem o olho cedeu/.test(fails.placa),'placa que cede: o aviso explica a causa',fails.placa);
  S.ok(/pistão desceu/.test(fails.pistao),'pistão: o aviso explica a causa',fails.pistao);
  S.ok(/último ponto de energia/.test(fails.comPonto),'com ponto aceso: diz que volta ao ponto de energia',fails.comPonto);
  S.ok(/Autômato de latão te acertou/.test(fails.guarda),'contato com guardião: diz quem e como evitar',fails.guarda);
  S.ok(/Sem corações/.test(fails.morte)&&fails.vida===3,'sem corações: avisa e recomeça com vida cheia',fails.morte);
  S.ok(/água funda do canal/.test(fails.agua),'queda no canal: o aviso fala da água',fails.agua);

  // 9) bordas perigosas marcadas onde há vão mortal
  const edges=await ev(()=>{const o={};for(const k in __vt.TOMB_AREAS)o[k]=__vt.TOMB_AREAS[k].edgeMarks||0;return o;});
  S.ok(edges.steam>=2&&edges.atom>=2&&edges.final>=2,'faixas de borda nos vãos (engrenagens, reator, cidade)',edges);
  // 10) sombra de pouso
  const sh=await ev(()=>{__vt.enter('steam');let n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}
    __vt.tp(0,-3,0);__vt.G.p.y=2.5;__vt.G.p.grounded=false;__vt.G.p.vy=0;__vt.renderOnce();const a={vis:blob.visible,y:+blob.position.y.toFixed(2),s:+blob.scale.x.toFixed(2)};
    __vt.tp(0,-3,0);__vt.renderOnce();const b={s:+blob.scale.x.toFixed(2)};
    let hz=null;for(let z=-10.5;z>-35&&hz===null;z-=0.25)for(let x=-8;x<=8&&hz===null;x+=0.5)if(groundAt(__vt.G.area,x,z,1.5)<-100)hz=[x,z];
    __vt.tp(hz[0],hz[1],1);__vt.G.p.y=1;__vt.G.p.grounded=false;__vt.renderOnce();const c={vis:blob.visible,em:hz};
    __vt.exit(false);n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}return{a,b,c};});
  S.ok(sh.a.vis&&Math.abs(sh.a.y-0.03)<0.02&&sh.a.s<sh.b.s,'no ar, a sombra fica no chão e menor que parado',sh);
  S.ok(!sh.c.vis,'sobre o vão (sem chão) a sombra some',sh.c);
  // 11) objetivo e ponto de controle em destaque
  const goal=await ev(()=>{__vt.G.relics={steam:true,diesel:true,atom:false,bio:true};__vt.tp(-60,80);__vt.renderOnce();
    const a=document.getElementById('goal').textContent,ma=Array.from(document.querySelectorAll('#compass .mk.goal')).map(e=>e.textContent);
    __vt.G.relics={steam:true,diesel:true,atom:true,bio:true};__vt.renderOnce();const b=document.getElementById('goal').textContent,mb=Array.from(document.querySelectorAll('#compass .mk.goal')).map(e=>e.textContent);
    __vt.G.relics={steam:false,diesel:false,atom:false,bio:false};
    __vt.enter('diesel');let n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}__vt.renderOnce();const c=document.getElementById('goal').textContent;
    const g=__vt.dsl.gens[0];__vt.tp(g.x+(g.x<0?1.9:-1.9),g.z,0);__vt.sim(2);__vt.use();__vt.sim(2);__vt.renderOnce();const d=document.getElementById('goal').textContent;
    __vt.exit(false);n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}return{a,ma,b,mb,c,d};});
  S.ok(/Tumba do Reator/.test(goal.a)&&goal.ma.join()==='SW','vale: objetivo aponta a tumba que falta e marca na bússola',goal);
  S.ok(/Cidade-Jardim/.test(goal.b)&&goal.mb.join()==='N','com 4 relíquias: objetivo é a porta da Cidade-Jardim',{b:goal.b,mb:goal.mb});
  S.ok(/Ponto salvo: entrada/.test(goal.c)&&/Ponto salvo: gerador/.test(goal.d),'na tumba: mostra o ponto de controle atual',{c:goal.c,d:goal.d});
  S.done(logs);await browser.close();
})();
