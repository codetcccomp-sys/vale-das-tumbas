// Painel de programação no navegador: Executar × Passo a passo (mesmo resultado), uma execução por vez, Parar,
// Reiniciar mantendo o programa, Limpar separado (com confirmação), dicas do Lume em três níveis, Guia aberto do painel,
// limites, repetição sem parada interrompida, exploração pausada com o painel aberto e controles restaurados ao fechar.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b2-painel');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},240000);
  const U=ui(page),ev=U.ev;
  try{
  await ev(()=>document.getElementById('btnNew').click());
  await ev(()=>{__vt.G.learn={t1:true,s0:true,s1:true,s3:true,d0:true,d1:true,d2:true,d3:true,d4:true,d5:true,a0:true,a1:true,a2:true,a3:true,a4:true,b0:true,b1:true,b2:true,b3:true};});
  /* ---------- Executar × Passo ---------- */
  const comparar=async(k,x,y,cfg,montar,sits)=>{
    await ev(([k,x,y,cfg])=>{fecharPainel();__vt.entrar(k);__vt.usarEm(x,y,'cima');escolherDesafio(__vt.DESAFIO[cfg]);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();},[k,x,y,cfg]);
    await montar();await ev(()=>__vt.velocidade(8));
    for(const si of sits){
      await U.sit(si);
      await ev(()=>document.getElementById('pRun').click());await U.esperarFim();
      const a=await ev(()=>({e:JSON.stringify(PAINEL.run.eventos),w:JSON.stringify(PAINEL.run.s.ws),v:JSON.stringify(PAINEL.run.s.env),ok:PAINEL.run.s.ok}));
      await ev(()=>document.getElementById('pReset').click());
      let n=0;for(;n<500;n++){const fim=await ev(()=>{document.getElementById('pStep').click();return PAINEL.run.s.fim;});if(fim)break;}
      const b=await ev(()=>({e:JSON.stringify(PAINEL.run.eventos),w:JSON.stringify(PAINEL.run.s.ws),v:JSON.stringify(PAINEL.run.s.env),ok:PAINEL.run.s.ok}));
      t.ok(a.e===b.e&&a.w===b.w&&a.v===b.v&&a.ok===b.ok,cfg+' situação '+(si+1)+': Executar e Passo a passo dão os mesmos '+JSON.parse(a.e).length+' passos, o mesmo mundo e as mesmas variáveis',{passosPasso:n+1,ok:a.ok});
    }
  };
  await comparar('steam',17*16+8,13*16+6,'s2',async()=>{for(const c of['avancar()','avancar()','avancar()','virar_direita()','avancar()','avancar()','virar_direita()','avancar()','avancar()','ativar()'])await U.pb(c);},[0]);
  await comparar('bio',14*16+8,14*16+6,'b4',async()=>{await U.pb('for … in range(n)');await U.ch('+');await U.ch('+');await U.pb('while');await U.ch('<');await U.ch('3');await U.pb('irrigar()');await U.linhaTipo('fim',0);await U.pb('avancar()');},[0,1]);
  await ev(()=>{__vt.G.learn.b4=true;});
  await comparar('final',14*16+8,15*16+6,'c1',async()=>{await U.pb('variável = valor');await U.ch('0');await U.pb('for … in range(n)');for(let i=0;i<3;i++)await U.ch('+');await U.pb('if');await U.ch('==');await U.ch('"seco"');await U.pb('irrigar()');await U.pb('variável = valor');await U.ch('regadas + 1');await U.linhaTipo('fim',0);await U.pb('avancar()');await U.linhaTipo('fim',1);await U.pb('acender_jardim()');},[0,1]);
  /* erro também é igual nos dois modos (para na mesma linha) */
  await comparar('atom',14*16+8,14*16+6,'a1',async()=>{await U.pb('abrir_comporta()');},[1]);
  /* ---------- uma execução por vez, Parar, Reiniciar ---------- */
  await ev(()=>{fecharPainel();__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.s2);__vt.velocidade(1);});
  const prog0=await ev(()=>LANG.codigo(PAINEL.prog));
  t.ok(/avancar\(\)/.test(prog0),'o programa montado antes continua no painel ao reabrir',prog0.split('\n').length+' linhas');
  await ev(()=>document.getElementById('pRun').click());await page.waitForTimeout(700);
  const r1=await ev(()=>{const r=PAINEL.run;const n=r.eventos.length;document.getElementById('pRun').click();document.getElementById('pStep').click();return{mesmo:PAINEL.run===r,n,depois:PAINEL.run.eventos.length,dis:document.getElementById('pRun').disabled,pal:[...document.querySelectorAll('#pPaleta .pb')].every(b=>b.disabled)};});
  t.ok(r1.mesmo&&r1.depois===r1.n&&r1.dis&&r1.pal,'durante a execução: Executar e Passo não abrem outra execução, e a paleta fica travada',r1);
  await ev(()=>document.getElementById('pStop').click());
  let st=await ev(()=>({run:PAINEL.run,parado:!!PAINEL.parado,msg:$('pMsg').textContent,prog:LANG.codigo(PAINEL.prog)}));
  t.ok(st.run===null&&st.parado&&/parada/.test(st.msg)&&st.prog===prog0,'Parar interrompe e mostra onde parou, sem mexer no programa',st.msg);
  await ev(()=>document.getElementById('pReset').click());
  st=await ev(()=>{const v=painelVis();const i=MUNDOS.grade.init(PAINEL.cfg.situacoes[0]);return{igual:v.ws.x===i.x&&v.ws.y===i.y&&v.ws.dir===i.dir,prog:LANG.codigo(PAINEL.prog)};});
  t.ok(st.igual&&st.prog===prog0,'Reiniciar volta o mecanismo ao começo e mantém o programa');
  /* ---------- Limpar com confirmação ---------- */
  await ev(()=>document.getElementById('pClear').click());let cf=await ev(()=>!document.getElementById('scConfirm').hidden);
  await ev(()=>document.getElementById('cfNo').click());st=await ev(()=>({n:PAINEL.prog.length,painel:!document.getElementById('painel').hidden,modo:__vt.G.mode}));
  t.ok(cf&&st.n>0&&st.painel&&st.modo==='painel','Limpar pede confirmação; cancelar mantém o programa e o painel',st);
  await ev(()=>document.getElementById('pClear').click());await ev(()=>document.getElementById('cfYes').click());st=await ev(()=>({n:PAINEL.prog.length,modo:__vt.G.mode}));
  t.ok(st.n===0&&st.modo==='painel','confirmar limpa o programa',st);
  /* ---------- dicas do Lume em três níveis e Guia aberto do painel ---------- */
  const d=[];for(let i=0;i<4;i++){await ev(()=>document.getElementById('pDica').click());d.push(await ev(()=>({m:$('pMsg').textContent,c:$('pMsg').className,b:$('pDica').textContent})));}
  t.ok(/Dica 1 de 3 \(o conceito\)/.test(d[0].m)&&/Dica 2 de 3 \(o caminho\)/.test(d[1].m)&&/Dica 3 de 3 \(quase a solução\)/.test(d[2].m)&&d[0].c==='lume','o Lume dá uma dica por vez: conceito → caminho → quase a solução',d.map(x=>x.m.slice(0,40)));
  t.ok(d[2].m.indexOf(DESAFIO_S2_D0)<0&&d[0].m.indexOf(DESAFIO_S2_D0)>=0,'a primeira dica fala do conceito, sem entregar o programa',d[0].m.slice(0,90));
  t.ok(/já viu as três dicas/.test(d[3].m)&&/Passo/.test(d[3].m)&&/3\/3/.test(d[3].b),'depois da terceira, o Lume recapitula e sugere o Passo a passo',d[3].m.slice(0,80));
  const dsv=await ev(()=>__vt.lerSave().dicas);t.ok(dsv&&dsv.s2===3,'as dicas vistas entram no salvamento',dsv);
  await ev(()=>document.getElementById('pGuia').click());st=await ev(()=>({modo:__vt.G.mode,guia:!document.getElementById('guia').hidden,top:(document.querySelector('#gTopicos .gtop.on')||{}).textContent,cod:document.querySelectorAll('#gConteudo pre.gcod').length}));
  t.ok(st.modo==='guia'&&st.guia&&st.cod>0,'📖 Guia no painel abre o Guia no assunto do desafio, com exemplo de código',st);
  await ev(()=>document.getElementById('gFechar').click());st=await ev(()=>({modo:__vt.G.mode,painel:!document.getElementById('painel').hidden,guia:!document.getElementById('guia').hidden}));
  t.ok(st.modo==='painel'&&st.painel&&!st.guia,'fechar o Guia volta ao painel do jeito que estava',st);
  /* ---------- limite de linhas e repetição sem parada ---------- */
  await ev(()=>{escolherDesafio(__vt.DESAFIO.b1);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
  for(let i=0;i<5;i++)await U.pb('irrigar()');st=await ev(()=>({n:LANG.contarLinhas(PAINEL.prog),msg:$('pMsg').textContent}));
  t.ok(st.n===4&&/só 4 linhas/.test(st.msg),'painel com 4 linhas recusa a quinta e explica',st);
  await ev(()=>{escolherDesafio(__vt.DESAFIO.b3);PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();__vt.velocidade(8);});
  await U.pb('while');await U.ch('<');await U.ch('3');await U.sit(2);
  const t0=Date.now();const rr=await U.executar();const er=await U.erro();
  t.ok(rr.erro==='semParada'&&Date.now()-t0<20000,'while sem nada que mude a umidade para no limite de voltas (sem travar)',rr.erro);
  t.ok(er&&/não parou/.test(er.tit)&&/Limite de segurança/.test(er.onde)&&/continuou verdadeira/.test(er.txt)&&/mudar o valor testado/.test(er.txt),'a área de erro explica por que a repetição não parou e o que fazer',er);
  /* ---------- exploração pausada com o painel aberto ---------- */
  await ev(()=>{fecharPainel();__vt.entrar('steam');__vt.G.lanternOn=true;__vt.G.lantern=50;});
  await ev(()=>{__vt.ir(19*16,31*16,'cima');__vt.andar(-1,0,0.4,true);});
  let g0=await ev(()=>{const e=__vt.G.area.guardas[0];return{estado:e.estado,x:e.x,y:e.y};});
  await ev(()=>{__vt.ir(17*16+8,13*16+6,'cima');});
  /* volta o guardião para perto e abre o painel: nada pode se mexer */
  await ev(()=>{const e=__vt.G.area.guardas[0];e.estado='caca';e.x=17*16;e.y=16*16;__vt.usarEm(17*16+8,13*16+6,'cima');});
  const a=await ev(()=>({e:{x:__vt.G.area.guardas[0].x,y:__vt.G.area.guardas[0].y},l:__vt.G.lantern,rel:__vt.G.area.relogio,h:__vt.G.hearts,m:__vt.G.mode}));
  await page.waitForTimeout(1500);
  const b=await ev(()=>({e:{x:__vt.G.area.guardas[0].x,y:__vt.G.area.guardas[0].y},l:__vt.G.lantern,rel:__vt.G.area.relogio,h:__vt.G.hearts}));
  t.ok(a.m==='painel'&&a.e.x===b.e.x&&a.e.y===b.e.y&&a.l===b.l&&a.rel===b.rel&&a.h===b.h,'com o painel aberto, guardião, pistões, lanterna e vida ficam parados',{a,b,g0});
  /* ---------- fechar no meio da execução ---------- */
  await ev(()=>{escolherDesafio(__vt.DESAFIO.s2);__vt.velocidade(1);});
  if(!(await ev(()=>PAINEL.prog.length)))for(const c of['avancar()','avancar()'])await U.pb(c);
  await ev(()=>document.getElementById('pRun').click());await page.waitForTimeout(500);
  await ev(()=>{__vt.IN.keys.KeyW=true;});await ev(()=>document.getElementById('pFechar').click());
  st=await ev(()=>({run:PAINEL.run,modo:__vt.G.mode,painel:!document.getElementById('painel').hidden,salvo:!!__vt.G.progs.s2&&__vt.G.progs.s2.length>0,tecla:!!__vt.IN.keys.KeyW}));
  t.ok(st.run===null&&st.modo==='play'&&!st.painel&&st.salvo&&!st.tecla,'fechar no meio: a execução para, o programa fica guardado e os controles voltam limpos',st);
  const mv=await ev(()=>{const y0=__vt.G.p.y;const r=__vt.andar(0,1,0.3);return r.y-y0;});t.ok(mv>5,'depois de fechar, o explorador anda de novo',mv);
  const sv=await ev(()=>__vt.lerSave());t.ok(sv&&sv.progs&&sv.progs.s2&&sv.progs.s2.length>0,'o programa entra no salvamento',sv&&sv.progs&&Object.keys(sv.progs));
  }catch(err){t.ok(false,'erro no teste: '+err.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
const DESAFIO_S2_D0='Planeje antes de escrever';
