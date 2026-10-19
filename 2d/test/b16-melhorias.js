// Melhorias de jogabilidade e aprendizagem: previsão a partir do programa do jogador (b3, d3 com o código da variação),
// variáveis e sensores que mudam marcados no Passo a passo, situação já testada que precisa de novo teste, tarefa de
// cada etapa, botões de execução e atalhos do teclado, dica sugerida depois de erros seguidos, funções do jogo × Python,
// relatório de aprendizagem (números registrados, TXT e CSV baixados) e lembrete quando o jogador fica sem progresso.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const fs=require('fs');
const t=suite('b16-melhorias');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:412,height:915},dpr:2.625,touch:true});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},240000);
  const U=ui(page),ev=U.ev;
  try{
    await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
    const tudoAte=ids=>ev(ids=>{for(const id of ids)__vt.G.learn[id]=true;},ids);
    /* ---------- b3: a previsão conta as regas do programa que está no painel ---------- */
    await tudoAte(['t1','t2','s0','s1','s3','s2','d0','d1','d2','d3','d4','d5','d6','a0','a1','a2','a3','a4','a5','bd','b0','b1','b2']);
    await ev(()=>{__vt.entrar('bio');__vt.usarEm(14*16+8,14*16+6,'cima');escolherDesafio(__vt.DESAFIO.b3);__vt.velocidade(8);});
    let r=await ev(()=>({tar:document.getElementById('pTarefa').textContent,vis:!document.getElementById('pTarefa').hidden}));
    t.ok(/TAREFA/.test(r.tar)&&/umidade 3/.test(r.tar),'cada etapa mostra a tarefa numa linha própria, separada do enunciado',r.tar);
    await U.escrever('for i in range(2):\n    irrigar()');await U.sit(2);
    await ev(()=>document.getElementById('pRun').click());
    r=await ev(()=>({q:document.querySelector('#pPrev .q').textContent,ops:[...document.querySelectorAll('#pPrev .ops .btn')].map(b=>b.textContent)}));
    t.ok(/SEU programa/.test(r.q)&&/situação A/.test(r.q)&&r.ops.length===5,'b3: a previsão pergunta sobre o programa do jogador, numa situação definida',r);
    await U.prever(0);
    r=await ev(()=>({msg:$('pMsg').textContent,sit:PAINEL.sit}));
    t.ok(/a resposta é «Uma vez\.»/.test(r.msg)&&/encharcou/.test(r.msg)&&r.sit===0,'com um for de 2 voltas, a resposta certa é "uma vez" (a segunda rega encharca): o feedback mostra o caminho, e a situação A fica escolhida',r);
    /* ---------- Passo a passo: o sensor que mudou fica marcado com antes → depois ---------- */
    await U.escrever('while umidade < 3:\n    irrigar()');await U.sit(2);
    await ev(()=>document.getElementById('pStep').click());await ev(()=>document.getElementById('pStep').click());
    r=await ev(()=>{const m=[...document.querySelectorAll('#pVars .var.mudou')].map(e=>e.textContent);return m;});
    t.ok(r.length===1&&/umidade/.test(r[0])&&/0 → 1/.test(r[0]),'Passo a passo: depois de irrigar(), o sensor umidade aparece marcado com 0 → 1',r);
    await ev(()=>document.getElementById('pStop').click());
    /* ---------- situação que passou com outro programa: ↻ (testar de novo) ---------- */
    await U.sit(1);let e=await U.executar();
    await U.escrever('while umidade < 3:\n    irrigar()\n');
    r=await ev(()=>[...document.querySelectorAll('#pSits .sit')].map(b=>({t:b.textContent,c:b.className})));
    t.ok(e.ok&&r[1].c.indexOf('ok')>=0,'situação B passou com o programa',[e.msg,r]);
    await U.escrever('while umidade <= 2:\n    irrigar()');
    r=await ev(()=>[...document.querySelectorAll('#pSits .sit')].map(b=>({t:b.textContent,c:b.className})));
    t.ok(/velho/.test(r[1].c)&&/↻/.test(r[1].t),'mudou o programa: a situação que já tinha passado fica marcada ↻ para testar de novo (nada é perdido em silêncio)',r);
    /* ---------- atalhos de teclado e botões de execução ---------- */
    r=await ev(()=>['pRun','pStep','pStop','pReset'].map(id=>document.getElementById(id).className));
    t.ok(r.every(c=>/\bex\b/.test(c))&&/verde/.test(r[0])&&/azul/.test(r[1])&&/vermelho/.test(r[2])&&/ambar/.test(r[3]),'Executar, Passo, Parar e Reiniciar com cores próprias, numa fileira à parte',r);
    await U.sit(0);await page.keyboard.press('Control+Enter');await U.esperarFim();
    r=await ev(()=>({fim:!!PAINEL.run&&PAINEL.run.s.fim}));
    t.ok(r.fim,'Ctrl+Enter executa o programa (teclado físico)',r);
    /* ---------- dica sugerida depois de três tentativas seguidas com erro ---------- */
    await U.escrever('irrigar()');await U.sit(0);
    for(let i=0;i<3;i++){await ev(()=>document.getElementById('pReset').click());await U.executar();}
    r=await ev(()=>({chama:document.getElementById('pDica').classList.contains('chama'),msg:$('pMsg').textContent}));
    t.ok(r.chama&&/3 tentativas com erro/.test(r.msg)&&/Dica/.test(r.msg),'três tentativas seguidas com erro: o botão Dica pisca e a mensagem sugere a Dica e o Passo (sem dar a resposta)',r);
    /* ---------- funções do jogo × Python ---------- */
    r=await ev(()=>[...document.querySelectorAll('#pRefC .rsec > b')].map(b=>b.textContent));
    t.ok(r.some(x=>/🎮 Funções das máquinas \(só existem no jogo/.test(x))&&r.some(x=>/🐍 Estruturas do Python/.test(x)),'Comandos e variáveis separa as funções do jogo das estruturas do Python',r);
    r=await ev(()=>{fecharPainel();abrirGuia('pythonreal');return{t:document.getElementById('gConteudo').textContent};});
    t.ok(/Python de verdade/.test(r.t)&&/print/.test(r.t)&&/def/.test(r.t),'Guia: "Do jogo para o Python de verdade", com o que é do jogo, o que é Python e um exemplo com print()',r.t.slice(0,80));
    await ev(()=>{fecharGuia&&fecharGuia();});
    /* ---------- relatório de aprendizagem ---------- */
    r=await ev(()=>{abrirDiario('relatorio');return{info:$('dInfo').textContent,cards:[...document.querySelectorAll('#dLista .entry h3')].map(h=>h.textContent),btns:[...document.querySelectorAll('.relBar .btn')].map(b=>b.textContent)};});
    const reg=await ev(()=>JSON.parse(JSON.stringify(__vt.G.reg.b3||{})));
    t.ok(/tentativas: \d+/.test(r.info)&&reg.t>=5&&reg.e>=3&&reg.p==='e'&&r.cards.length===7&&r.btns.length===3,'relatório no Diário: totais, os sete lugares e Baixar TXT/CSV e Copiar; b3 registra tentativas, erros e a previsão errada',{info:r.info.slice(0,90),reg,btns:r.btns});
    const [dl]=await Promise.all([page.waitForEvent('download'),ev(()=>document.querySelectorAll('.relBar .btn')[1].click())]);
    const csv=fs.readFileSync(await dl.path(),'utf8');
    t.ok(/\.csv$/.test(dl.suggestedFilename())&&/^﻿?lugar;conceito;etapa_id/.test(csv)&&/"b3";"Prática guiada · while"/.test(csv),'Baixar CSV entrega o arquivo com cabeçalho e a linha de cada etapa',dl.suggestedFilename());
    const [dt]=await Promise.all([page.waitForEvent('download'),ev(()=>document.querySelectorAll('.relBar .btn')[0].click())]);
    const txt=fs.readFileSync(await dt.path(),'utf8');
    t.ok(/RELATÓRIO DE APRENDIZAGEM/.test(txt)&&/Viva/.test(txt)&&/Prática guiada · while/.test(txt),'Baixar TXT entrega o relatório legível',txt.split('\n')[0]);
    const salvo=await ev(()=>{salvar(false);const s=__vt.lerSave();return{t:s.reg.b3&&s.reg.b3.t,desde:s.regDesde,rev:s.rev};});
    t.ok(salvo.t>=5&&/^\d{4}-\d\d-\d\d$/.test(salvo.desde)&&salvo.rev===4,'o registro fica no save (revisão 4), só no aparelho',salvo);
    await ev(()=>fecharDiario());
    /* ---------- sem progresso: um lembrete gentil, sem resolver nada ---------- */
    await ev(()=>{__vt.entrar('atom');__vt.G.learn.a5=false;document.querySelectorAll('.toast').forEach(x=>x.remove());});
    r=await ev(()=>{for(let i=0;i<60*152;i++)passoJogo(1/60,performance.now());return TOASTS.queue.map(q=>q.text).concat(TOASTS.on.map(q=>q.text));});
    t.ok(r.some(x=>/Sem rumo\?/.test(x)&&/objetivo/.test(x)),'depois de uns 2 minutos e meio sem progresso, um lembrete aponta o objetivo e a bússola',r);
  }catch(e){t.ok(false,'erro no teste: '+e.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
