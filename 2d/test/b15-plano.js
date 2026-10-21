// Plano de melhorias (P1): a versão pública não leva o gancho de teste (#vt não cria nada que altere fases, posição
// ou progresso); nas práticas guiadas, a previsão responde na hora e a execução seguinte confere; "Pular" executa direto.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const fs=require('fs'),path=require('path');
const t=suite('b15-plano');
(async()=>{
  /* ---------- A01: versão pública sem o gancho ---------- */
  const pub=fs.readFileSync(path.join(__dirname,'..','build','vale-das-tumbas-2d.html'),'utf8');
  const tst=fs.readFileSync(path.join(__dirname,'..','build','teste','vale-das-tumbas-2d.html'),'utf8');
  t.ok(!/function ganchoTeste|window\.__vt=|teletransport/.test(pub)&&/function ganchoTeste/.test(tst),'a compilação pública não contém o gancho de teste; a compilação de testes contém');
  const todosLogs=[];
  for(const hash of['#vt','#vt-treino','#vt-treino-historia']){
    const {browser,page,logs}=await open({arquivo:'build/vale-das-tumbas-2d.html',hash,semGancho:true});
    try{
      const r=await page.evaluate(()=>({vt:typeof window.__vt,gancho:typeof ganchoTeste,pular:typeof window.__vtPularTreino,menu:!document.getElementById('scStart').hidden}));
      await page.evaluate(()=>document.getElementById('btnNew').click());await page.waitForTimeout(150);
      const h=await page.evaluate(()=>!document.getElementById('historia').hidden);
      t.ok(r.vt==='undefined'&&r.gancho==='undefined'&&r.pular==='undefined'&&r.menu&&h,'versão pública aberta com '+hash+': nenhum objeto interno; o jogo abre no menu e Novo jogo segue o caminho normal (história)',{r,historia:h});
    }catch(e){t.ok(false,'erro no teste (versão pública '+hash+'): '+e.message);}
    todosLogs.push(...logs);await browser.close();
  }
  /* ---------- A04: previsão nas práticas guiadas ---------- */
  const {browser,page,logs}=await open({viewport:{width:412,height:915},dpr:2.625,touch:true});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},180000);
  const U=ui(page),ev=U.ev;
  try{
    await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
    await ev(()=>{__vt.G.learn=Object.assign(__vt.G.learn,{t1:true,t2:true,s0:true,s1:true,s3:true,s2:true,d0:true,d1:true,d2:true,d3:true,d4:true,d5:true,d6:true,a0:true});
      __vt.entrar('atom');__vt.usarEm(14*16+8,14*16+6,'cima');escolherDesafio(__vt.DESAFIO.a1);__vt.velocidade(8);});
    await U.escrever('if energia >= 5:\n    abrir_comporta()\nelse:\n    ligar_carregador()');await U.sit(1);
    await ev(()=>document.getElementById('pRun').click());
    let r=await ev(()=>({vis:!document.getElementById('pPrev').hidden,q:document.querySelector('#pPrev .q').textContent,n:document.querySelectorAll('#pPrev .ops .btn').length}));
    t.ok(r.vis&&/SEU programa/.test(r.q)&&/situação B/.test(r.q)&&r.n===5,'a1: Executar pede antes uma previsão sobre o programa do jogador (4 respostas + Pular)',r);
    await U.prever(0);
    r=await ev(()=>({msg:$('pMsg').textContent,cls:$('pMsg').className,run:!!PAINEL.run,vis:!document.getElementById('pPrev').hidden}));
    t.ok(!r.vis&&!r.run&&/Não é bem isso: a resposta é «ligar_carregador\(\)»/.test(r.msg)&&/3 >= 5 é False/.test(r.msg)&&/Executar/.test(r.msg),'resposta errada: a resposta certa e o caminho do programa aparecem na hora, e nada executa até o próximo toque',r);
    const e=await U.executar();
    t.ok(e.ok&&!(await ev(()=>!document.getElementById('pPrev').hidden)),'Executar de novo roda o programa (situação B certa) e não pergunta outra vez',e.msg);
    /* acertar: mensagem de acerto */
    await ev(()=>{PAINEL.previsao={};escolherDesafio(__vt.DESAFIO.a1);});await U.escrever('if energia >= 5:\n    abrir_comporta()\nelse:\n    ligar_carregador()');
    await ev(()=>document.getElementById('pRun').click());await U.prever(1);
    r=await ev(()=>({msg:$('pMsg').textContent,cls:$('pMsg').className}));
    t.ok(/Você acertou/.test(r.msg)&&/\bok\b/.test(r.cls),'resposta certa: "Você acertou!" com a explicação',r);
    /* Pular: executa direto */
    await ev(()=>{PAINEL.previsao={};escolherDesafio(__vt.DESAFIO.a1);});await U.escrever('if energia >= 5:\n    abrir_comporta()\nelse:\n    ligar_carregador()');
    await ev(()=>document.getElementById('pRun').click());await U.prever(4);await page.waitForTimeout(30);
    r=await ev(()=>({run:!!PAINEL.run}));await U.esperarFim();
    t.ok(r.run,'Pular: a execução começa no mesmo toque',r);
    /* if sem else: a paleta oferece, mas não resolve a situação B */
    await ev(()=>{escolherDesafio(__vt.DESAFIO.a1);});await U.escrever('if energia >= 5:\n    abrir_comporta()');await U.sit(1);
    const e2=await U.executar();
    t.ok(!e2.ok,'a1: o if sem else (agora na paleta) não resolve a energia 3',e2.msg);
  }catch(e){t.ok(false,'erro no teste (previsão): '+e.message);}
  todosLogs.push(...logs);
  clearTimeout(vigia);t.done(todosLogs);await browser.close();
})();
