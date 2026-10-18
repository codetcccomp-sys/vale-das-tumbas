// Tela limpa no celular: interagir com vários itens não empilha avisos (o aviso de uma interação nova substitui o da
// anterior; no máximo dois por vez, compactos, logo abaixo do HUD e longe do explorador); a cápsula da mão fica no HUD;
// o objetivo encolhe depois de alguns segundos e abre com um toque (e não é refeito a cada quadro); marcas do mundo
// ficam dentro da tela e por baixo do HUD; o texto da ação não fica por baixo do botão VER; no Guia, o exemplo de
// código aparece inteiro e o conteúdo fica com a maior parte da altura.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b13-tela');
const cruza=(a,b)=>a&&b&&a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:412,height:915},dpr:2,touch:true});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},200000);
  const U=ui(page),ev=U.ev;
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
  await ev(()=>{__vt.G.learn={t1:1,t2:1,s0:1,s1:1,s3:1,s2:1,d0:1,d1:1};__vt.entrar('diesel');toastClear();__vt.quadros(2);});
  /* ---------- cápsula na mão: HUD, sem aviso ---------- */
  let r=await ev(()=>{const pat=__vt.G.area.patio,c=pat.caps.c_strue;__vt.usarEm(c.x,c.y+20,'cima');__vt.quadros(2);
    const m=document.getElementById('mao');return{mao:m.hidden?null:m.textContent,avisos:TOASTS.on.length+TOASTS.queue.length};});
  t.ok(r.mao==='Na mão"True" (str)'&&r.avisos===0,'pegar a cápsula não gera aviso: o HUD mostra o que está na mão',r);
  r=await ev(()=>{const pat=__vt.G.area.patio,c=pat.caps.c_true;__vt.usarEm(c.x,c.y+20,'cima');__vt.quadros(2);return document.getElementById('mao').textContent;});
  t.ok(r==='Na mãoTrue (bool)','trocar de cápsula atualiza o HUD',r);
  /* ---------- avisos: a interação nova substitui a anterior ---------- */
  r=await ev(()=>{const MQ=PATIO_DIESEL.maquinas,u=k=>__vt.usarEm(MQ[k].tx*16+8,MQ[k].ty*16+34,'cima');
    const pat=__vt.G.area.patio,c=pat.caps.c_strue;__vt.usarEm(c.x,c.y+20,'cima');
    u('disjuntor');const a=TOASTS.on.concat(TOASTS.queue).map(x=>x.text);
    u('bomba');__vt.quadros(2);const b=TOASTS.on.concat(TOASTS.queue).map(x=>x.text);
    u('bomba');const c2=TOASTS.on.map(x=>({t:x.text,n:x.count}));return{a,b,c:c2};});
  t.ok(r.a.length===1&&/recusou/.test(r.a[0])&&/Regra desta máquina/.test(r.a[0]),'a primeira recusa explica a regra da máquina',r.a);
  t.ok(r.b.length===1&&/sem energia/.test(r.b[0]),'ao usar outra máquina, o aviso anterior sai: fica só o da interação nova',r.b);
  t.ok(r.c.length===1&&r.c[0].n===2,'usar de novo a mesma máquina não repete o aviso (×2)',r.c);
  r=await ev(()=>{const MQ=PATIO_DIESEL.maquinas;__vt.usarEm(MQ.disjuntor.tx*16+8,MQ.disjuntor.ty*16+34,'cima');return TOASTS.on.concat(TOASTS.queue).map(x=>x.text);});
  t.ok(r.length===1&&/recusou/.test(r[0])&&!/Regra desta máquina/.test(r[0]),'a partir da segunda recusa, o aviso fica curto',r);
  r=await ev(()=>{toastClear();for(const s of['um aviso de teste','outro aviso de teste','terceiro aviso','quarto aviso'])toast(s);__vt.quadros(2);
    const els=[...document.querySelectorAll('#msgs .toast:not(.out)')],hl=document.getElementById('hl').getBoundingClientRect(),hr=document.getElementById('hr').getBoundingClientRect();
    const k=__vt.R.k/__vt.R.dpr,py=(__vt.G.p.y-40+__vt.R.oy)*k;
    return{n:els.length,topo:els.length?els[0].getBoundingClientRect().top:0,fim:els.length?els[els.length-1].getBoundingClientRect().bottom:0,hl:hl.bottom,hr:hr.bottom,heroi:py,fonte:els.length?getComputedStyle(els[0]).fontSize:''};});
  t.ok(r.n===2,'no celular, no máximo dois avisos ao mesmo tempo ('+r.n+')',r);
  t.ok(r.topo>=Math.max(r.hl,r.hr)&&r.topo<=Math.max(r.hl,r.hr)+12&&r.fim<r.heroi&&r.fonte==='13px','os avisos ficam logo abaixo do HUD, compactos e acima do explorador (não o cobrem)',r);
  await ev(()=>toastClear());
  /* ---------- objetivo: refeito só quando muda; encolhe e abre com um toque ---------- */
  r=await ev(()=>{const el=document.getElementById('goal');atualizarHud.gk=null;__vt.quadros(1);const b0=el.firstChild;const h0=el.getBoundingClientRect().height;__vt.quadros(5);
    const igual=el.firstChild===b0;GOAL.t=performance.now()-GOAL.ms-100;__vt.quadros(1);const h1=el.getBoundingClientRect().height,curto=el.classList.contains('curto');
    el.click();__vt.quadros(1);const h2=el.getBoundingClientRect().height,aberto=!el.classList.contains('curto');
    return{igual,h0,h1,curto,h2,aberto,cur:getComputedStyle(el).pointerEvents};});
  t.ok(r.igual,'o objetivo não é refeito (nem pisca) a cada quadro, só quando o texto muda',r);
  t.ok(r.curto&&r.h1<r.h0*0.75&&r.cur==='auto','depois de alguns segundos, o objetivo encolhe para o título e uma linha',r);
  t.ok(r.aberto&&r.h2===r.h0,'tocar no objetivo abre o texto inteiro de novo',r);
  /* ---------- marcas do mundo: dentro da tela e por baixo do HUD ---------- */
  r=await ev(()=>{const MQ=PATIO_DIESEL.maquinas;__vt.ir(MQ.disjuntor.tx*16+8-100,MQ.disjuntor.ty*16+60,'direita');__vt.quadros(2);
    const m=document.getElementById('marcaAlvo'),b=m.getBoundingClientRect(),hud=[...document.getElementById('hud').children];
    return{vis:!m.hidden,txt:m.textContent,l:b.left,rr:b.right,w:innerWidth,antes:hud.indexOf(m)<hud.indexOf(document.getElementById('hl'))&&hud.indexOf(m)<hud.indexOf(document.getElementById('msgs'))};});
  t.ok(r.vis&&r.l>=0&&r.rr<=r.w,'o marcador do alvo ("'+r.txt+'") fica inteiro dentro da tela',r);
  t.ok(r.antes,'marcas do mundo ficam por baixo do HUD e dos avisos',r);
  /* ---------- texto da ação x botão VER ---------- */
  r=await ev(()=>{const c=__vt.G.area.patio.caps.c_f25;__vt.ir(c.x,c.y+20,'cima');__vt.quadros(2);const p=document.getElementById('prompt');
    return{vis:!p.hidden,txt:p.textContent,p:p.getBoundingClientRect().toJSON(),ver:document.getElementById('bVer').getBoundingClientRect().toJSON(),luz:document.getElementById('bLan').getBoundingClientRect().toJSON(),usar:document.getElementById('bUse').getBoundingClientRect().toJSON()};});
  t.ok(r.vis&&!cruza(r.p,r.ver)&&!cruza(r.p,r.luz)&&!cruza(r.p,r.usar),'na tumba, o texto da ação ("'+r.txt+'") não fica por baixo dos botões VER, LUZ e AÇÃO',r);
  /* ---------- Guia no celular ---------- */
  r=await ev(()=>{abrirGuia('variaveis');const C=document.getElementById('gConteudo'),cx=document.querySelector('#guia .caixa').getBoundingClientRect();
    const pres=[...C.querySelectorAll('pre')].map(p=>({h:p.clientHeight,s:p.scrollHeight}));const ch=[...document.querySelectorAll('.gtop')];
    return{pres,cont:C.getBoundingClientRect().height,caixa:cx.height,linhas:new Set(ch.map(b=>b.offsetTop)).size,chips:ch.length};});
  t.ok(r.pres.length>0&&r.pres.every(p=>p.h>=p.s-1&&p.h>40),'o exemplo de código do Guia aparece inteiro (antes ficava esmagado numa faixa)',r.pres);
  t.ok(r.cont>=r.caixa*0.7,'o conteúdo do Guia fica com a maior parte da altura ('+Math.round(r.cont/r.caixa*100)+'% da caixa)',r);
  t.ok(r.chips>3&&r.linhas===1,'no celular, os assuntos do grupo ficam numa fileira que rola para o lado',r);
  r=await ev(()=>{[...document.querySelectorAll('.ggr')].find(b=>b.dataset.g==='dec').click();const h=document.querySelector('#gConteudo h3').textContent,on=document.querySelector('.gtop.on');
    const ch=on.parentElement,o=on.getBoundingClientRect(),c=ch.getBoundingClientRect();return{h,on:on.textContent,vis:o.left>=c.left-1&&o.right<=c.right+1};});
  t.ok(r.h===r.on&&r.h==='Comparações'&&r.vis,'tocar num grupo (Decisões) já abre o primeiro assunto dele',r);
  r=await ev(()=>{const l=[...document.querySelectorAll('.gtop')];l[l.length-1].click();const on=document.querySelector('.gtop.on'),o=on.getBoundingClientRect(),c=on.parentElement.getBoundingClientRect();return{on:on.textContent,vis:o.left>=c.left-1&&o.right<=c.right+1};});
  t.ok(r.vis,'o assunto aberto fica à vista na fileira ("'+r.on+'")',r);
  await ev(()=>fecharGuia());
  /* ---------- deitado e no computador: Guia e avisos continuam bons ---------- */
  await page.setViewportSize({width:915,height:412});await page.waitForTimeout(200);
  r=await ev(()=>{abrirGuia('tipos');const C=document.getElementById('gConteudo'),cx=document.querySelector('#guia .caixa').getBoundingClientRect();const pres=[...C.querySelectorAll('pre')].map(p=>({h:p.clientHeight,s:p.scrollHeight})),cont=C.getBoundingClientRect().height;fecharGuia();
    return{cont,caixa:cx.height,pres};});
  t.ok(r.cont>=r.caixa*0.5&&r.pres.every(p=>p.h>=p.s-1),'celular deitado: o conteúdo do Guia fica com metade ou mais da caixa e o exemplo inteiro',r);
  await page.setViewportSize({width:1280,height:800});await page.waitForTimeout(200);
  r=await ev(()=>{toastClear();for(const s of['a','b','c','d'])toast('aviso '+s);__vt.quadros(2);const n=document.querySelectorAll('#msgs .toast:not(.out)').length;
    abrirGuia('variaveis');const ch=[...document.querySelectorAll('.gtop')],pres=[...document.querySelectorAll('#gConteudo pre')].map(p=>({h:p.clientHeight,s:p.scrollHeight}));fecharGuia();toastClear();
    return{n,linhas:new Set(ch.map(b=>b.offsetTop)).size,pres};});
  t.ok(r.n===3&&r.linhas>=1&&r.pres.every(p=>p.h>=p.s-1),'no computador: até três avisos e o exemplo do Guia inteiro',r);
  }catch(e){t.ok(false,'erro no teste: '+e.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
