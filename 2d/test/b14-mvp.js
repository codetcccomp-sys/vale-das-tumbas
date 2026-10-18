// Melhorias do MVP 0.1 e da reanálise: história antes do treino (pulável e revisitável no menu); bússola no objetivo;
// porta selada que diz para onde ir; Guia com as mecânicas do jogo; "Você quis dizer…?" nos nomes errados; rótulos do
// cenário legíveis no celular; explorador fora da faixa dos botões na entrada das tumbas; painel no celular com o código
// visível no modo Escrever com erro, enunciado inteiro (ou "ler o resto") e duas colunas com o celular deitado.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b14-mvp');
const cruza=(a,b)=>a&&b&&a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;
(async()=>{
  let {browser,page,logs}=await open({viewport:{width:412,height:915},dpr:2.625,touch:true,hash:'#vt-treino-historia'});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},240000);
  let U=ui(page),ev=U.ev;const todosLogs=[];
  try{
  /* ---------- história: Novo jogo passa por ela; pular ou chegar ao fim começa o treino ---------- */
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(150);
  let r=await ev(()=>({modo:__vt.G.mode,vis:!document.getElementById('historia').hidden,pag:document.getElementById('hPag').textContent,tit:document.getElementById('hTit').textContent}));
  t.ok(r.modo==='historia'&&r.vis&&r.pag==='1 de 5','Novo jogo abre a história antes do treino (5 páginas)',r);
  const textos=[];for(let i=0;i<5;i++){textos.push(await ev(()=>document.getElementById('hTexto').textContent));if(i<4)await ev(()=>document.getElementById('hProx').click());}
  r=await ev(()=>({prox:document.getElementById('hProx').textContent,pular:document.getElementById('hPular').hidden}));
  t.ok(/tapa-olho/.test(textos[2])&&/Lume/.test(textos[3])&&/quatro saberes/.test(textos[4])&&/Começar/.test(r.prox)&&r.pular,'a história apresenta a cidade, a personagem (tapa-olho, gentil), o Lume e a missão; a última página tem Começar',{t:textos.map(x=>x.slice(0,40)),r});
  await ev(()=>document.getElementById('hProx').click());await page.waitForTimeout(200);
  r=await ev(()=>({modo:__vt.G.mode,area:__vt.G.area.id,vis:!document.getElementById('historia').hidden}));
  t.ok(r.modo==='play'&&r.area==='treino'&&!r.vis,'Começar fecha a história e começa o treino',r);
  /* ---------- "Você quis dizer…?" ---------- */
  await ev(()=>{__vt.G.treino.manivela=true;__vt.G.treino.passo=5;__vt.painel('treino');document.getElementById('pModo').click();});
  await page.fill('#pTxt','acender_toxa()');await ev(()=>document.getElementById('pModo').click());await page.waitForTimeout(150);
  r=await ev(()=>{const R=id=>document.getElementById(id).getBoundingClientRect();return{tit:document.querySelector('#pErro .tit').textContent,txt:R('pTxt'),pal:R('pPaleta'),rod:R('pRodape'),erro:R('pErro'),painel:R('painel')};});
  t.ok(/Você quis dizer acender_tocha\(\)\?/.test(r.tit),'nome errado: o erro sugere o nome certo ("Você quis dizer acender_tocha()?")',r.tit);
  /* ---------- painel no celular: com erro no modo Escrever, o código fica à vista ---------- */
  t.ok(r.txt.height>=80&&r.txt.bottom<=r.rod.top+1&&r.txt.top>=r.painel.top&&r.erro.top>=r.painel.top-1,'celular em pé: com o erro aberto, o campo de código fica inteiro à vista, acima da paleta e dos botões',{txt:r.txt,rod:r.rod.top,erro:r.erro.top});
  await ev(()=>{document.getElementById('pModo').click();fecharPainel();});
  /* ---------- enunciado: inteiro quando cabe; senão "ler o resto" abre ---------- */
  r=await ev(()=>{const o=[];__vt.G.learn={t1:1,t2:1,s0:1,s1:1,s3:1,s2:1,d0:1};__vt.entrar('diesel');__vt.painel('diesel');
    for(const k of['steam','diesel','atom','bio','final'])for(const d of desafiosDa(k)){escolherDesafio(d);const m=document.getElementById('pMsg'),b=document.getElementById('pMsgMais');
      const inteiro=m.scrollHeight<=m.clientHeight+2;o.push({id:d.id,inteiro,botao:!b.hidden&&/ler o resto/.test(b.textContent)});}
    return o;});
  t.ok(r.every(x=>x.inteiro||x.botao),'o enunciado aparece inteiro ou mostra "▾ ler o resto" (nunca cortado sem aviso), em todas as etapas',r.filter(x=>!x.inteiro&&!x.botao));
  r=await ev(()=>{escolherDesafio(__vt.DESAFIO.c1);const m=document.getElementById('pMsg'),b=document.getElementById('pMsgMais');const antes=m.scrollHeight<=m.clientHeight+2;if(!b.hidden)b.click();return{antes,depois:m.scrollHeight<=m.clientHeight+2,txt:b.textContent};});
  t.ok(r.depois&&(r.antes||/recolher/.test(r.txt)),'"ler o resto" mostra o enunciado inteiro e vira "recolher"',r);
  await ev(()=>fecharPainel());
  /* ---------- rótulos do cenário e câmera na entrada das tumbas ---------- */
  r=await ev(()=>({etq:__vt.R.etq,px:Math.round(5*__vt.R.etq*__vt.R.k/__vt.R.dpr*10)/10}));
  t.ok(r.etq===2&&r.px>=9,'celular: os rótulos do cenário saem em dobro ('+r.px+' px de altura na tela)',r);
  /* ---------- bússola e porta selada ---------- */
  await ev(()=>{sairTumba(false);});await page.waitForTimeout(700);
  r=await ev(()=>{__vt.G.learn={t1:1,t2:1};const T=TOMBS.atom,d=__vt.porta('atom');toastClear();__vt.usarEm(d.x,d.y,'cima');const av=TOASTS.on.concat(TOASTS.queue).map(x=>x.text).join(' ');
    __vt.quadros(2);const go=objetivo(),bs=document.querySelector('#goal .bus'),ang=parseFloat((bs.style.transform.match(/rotate\(([-\d.]+)rad\)/)||[])[1]);
    const esperado=Math.atan2(go.alvo.y-__vt.G.p.y,go.alvo.x-__vt.G.p.x);return{av,vis:!bs.hidden,ang,esperado,alvo:go.alvo.txt,texto:document.getElementById('goal').textContent};});
  t.ok(/Tumba das Engrenagens, a (nordeste|leste|norte) daqui/.test(r.av)&&/seta do objetivo/.test(r.av),'a porta selada diz qual é a tumba da vez e para que lado ela fica',r.av);
  t.ok(r.vis&&Math.abs(r.ang-r.esperado)<0.02&&/^Etapa 1 de 5/.test(r.texto),'a bússola no título do objetivo aponta do explorador para o alvo (sem mudar o texto)',r);
  /* ---------- Guia: mecânicas do jogo ---------- */
  r=await ev(()=>{const o={};for(const id of['saberes','caminho','diario','lanterna']){abrirGuia(id);const C=document.getElementById('gConteudo');o[id]={tit:C.querySelector('h3').textContent,tab:C.querySelectorAll('.gtab code').length,jogo:!!C.querySelector('.gjogo'),exemplo:[...C.querySelectorAll('.gsub')].some(x=>/^Exemplo$/i.test(x.textContent.trim()))||!!C.querySelector('pre.gcod')};fecharGuia();}return o;});
  t.ok(Object.values(r).every(x=>x.tab>=3&&x.jogo&&!x.exemplo),'o Guia explica as mecânicas do jogo (saberes, bússola e atalhos, diário, lanterna), sem exemplo de código vazio',r);
  }catch(e){t.ok(false,'erro no teste: '+e.message);}
  todosLogs.push(...logs);await browser.close();
  /* ---------- celular pequeno: entrada das tumbas e Escrever com erro ---------- */
  ({browser,page,logs}=await open({viewport:{width:360,height:740},dpr:3,touch:true,hash:'#vt-treino'}));U=ui(page);ev=U.ev;
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
  let r=await ev(()=>{const cruza=(a,b)=>a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;const o=[];for(const k of['steam','diesel','atom','bio','final']){__vt.entrar(k);__vt.quadros(30);const s=__vt.R.k/__vt.R.dpr,p=__vt.G.p,x=(p.x+__vt.R.ox)*s,y=(p.y+__vt.R.oy)*s,h={left:x-10,right:x+10,top:y-40,bottom:y};
    o.push({k,cobre:['bVer','bLan','bUse'].some(id=>cruza(h,document.getElementById(id).getBoundingClientRect()))});}return o;});
  t.ok(r.every(x=>!x.cobre),'celular pequeno: na entrada das cinco áreas o explorador fica fora dos botões VER, LUZ e AÇÃO',r);
  await ev(()=>{__vt.entrar('treino');__vt.G.treino.manivela=true;__vt.G.treino.passo=5;__vt.painel('treino');document.getElementById('pModo').click();});
  await page.fill('#pTxt','acender_toxa()');await ev(()=>document.getElementById('pModo').click());await page.waitForTimeout(150);
  r=await ev(()=>{const R=id=>document.getElementById(id).getBoundingClientRect();return{txt:R('pTxt'),rod:R('pRodape'),p:R('painel')};});
  t.ok(r.txt.height>=80&&r.txt.bottom<=r.rod.top+1&&r.txt.top>=r.p.top,'celular pequeno: com o erro aberto, o código fica à vista acima da paleta',r);
  }catch(e){t.ok(false,'erro no teste (pequeno): '+e.message);}
  todosLogs.push(...logs);await browser.close();
  /* ---------- celular deitado: duas colunas, código e erro à vista ---------- */
  ({browser,page,logs}=await open({viewport:{width:915,height:412},dpr:2.625,touch:true,hash:'#vt-treino'}));U=ui(page);ev=U.ev;
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
  let r=await ev(()=>{__vt.G.learn={t1:1,t2:1,s0:1,s1:1,s3:1,s2:1,d0:1};__vt.entrar('diesel');__vt.painel('diesel');escolherDesafio(__vt.DESAFIO.d1);
    const R=id=>document.getElementById(id).getBoundingClientRect(),P=document.getElementById('painel');return{info:R('pInfo'),prog:R('pProg'),rod:R('pRodape'),rola:P.scrollHeight>P.clientHeight+2};});
  t.ok(r.info.right<=r.prog.left&&r.prog.height>=80&&r.prog.bottom<=r.rod.top+1&&!r.rola,'deitado: o desafio fica à esquerda e o programa à direita, com 4 linhas ou mais à vista, sem rolar o painel',r);
  await ev(()=>{fecharPainel();__vt.entrar('treino');__vt.G.treino.manivela=true;__vt.G.treino.passo=5;__vt.painel('treino');document.getElementById('pModo').click();});
  await page.fill('#pTxt','acender_toxa()');await ev(()=>document.getElementById('pModo').click());await page.waitForTimeout(150);
  r=await ev(()=>{const R=id=>document.getElementById(id).getBoundingClientRect();return{txt:R('pTxt'),erro:R('pErro'),c:R('pCorpo'),i:R('pInfo')};});
  t.ok(r.txt.height>=60&&r.txt.top>=r.c.top-1&&r.txt.bottom<=r.c.bottom+1&&r.erro.top>=r.i.top-1&&r.erro.bottom<=r.i.bottom+1,'deitado, Escrever com erro: o erro à esquerda e o código à direita, ambos à vista',r);
  }catch(e){t.ok(false,'erro no teste (deitado): '+e.message);}
  todosLogs.push(...logs);await browser.close();
  /* ---------- computador: rótulos normais e História no menu ---------- */
  ({browser,page,logs}=await open({viewport:{width:1366,height:768},dpr:1}));U=ui(page);ev=U.ev;
  try{
  let r=await ev(()=>{document.getElementById('btnHistoria').click();const a=__vt.G.mode;document.getElementById('hPular').click();return{a,b:__vt.G.mode,menu:!document.getElementById('scStart').hidden,etq:__vt.R.etq};});
  t.ok(r.a==='historia'&&r.menu&&r.etq===1,'no menu, História abre a mesma história e volta ao menu; no computador os rótulos ficam no tamanho normal',r);
  }catch(e){t.ok(false,'erro no teste (computador): '+e.message);}
  todosLogs.push(...logs);
  clearTimeout(vigia);t.done(todosLogs);await browser.close();
})();
