// Telas de vários tamanhos (em pé e deitado, toque e teclado): pixels nítidos em escala inteira, HUD sem sobreposição,
// botões grandes, textos legíveis e o painel de programação inteiro alcançável.
const {open}=require('./lib');const {suite}=require('./assert');const path=require('path');
const t=suite('b4-telas');
const TAM=[[320,568,2,true],[360,640,3,true],[390,844,3,true],[412,915,2.625,true],[640,360,2,true],[844,390,3,true],[915,412,2.625,true],[768,1024,2,true],[1366,768,1,false],[1920,1080,1,false]];
const inter=(a,b)=>a&&b&&a.w>0&&b.w>0&&a.x<b.x+b.w-1&&b.x<a.x+a.w-1&&a.y<b.y+b.h-1&&b.y<a.y+a.h-1;
(async()=>{
  for(const[w,h,dpr,toque]of TAM){
    const nome=w+'x'+h+(toque?' toque':' teclado');
    const {browser,page,logs}=await open({viewport:{width:w,height:h},dpr,touch:toque});
    const ev=(f,a)=>page.evaluate(f,a);
    await ev(()=>document.getElementById('btnNew').click());
    await ev(()=>{__vt.ir(87.6*16,151.6*16,'cima');__vt.quadros(5);toast('Um aviso de teste para medir a pilha de mensagens na tela.');});
    await page.waitForTimeout(250);
    const m=await ev(()=>{
      const r=id=>{const e=document.getElementById(id);if(!e||e.hidden||e.offsetParent===null)return null;const b=e.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height};};
      const es=__vt.escala();
      return{es,iw:innerWidth,ih:innerHeight,hl:r('hl'),hr:r('hr'),prompt:r('prompt'),use:r('bUse'),ver:r('bVer'),zona:r('zoneHint'),guia:r('btnGuia'),msgs:[...document.querySelectorAll('#msgs .toast')].map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height};}),
        fontes:[...document.querySelectorAll('#hud *')].filter(e=>e.offsetParent!==null&&e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).map(e=>parseFloat(getComputedStyle(e).fontSize))};
    });
    const k=m.es.k;
    t.ok(Number.isInteger(k)&&k>=1&&m.es.cw===Math.round(w*dpr)&&m.es.W*k>=m.es.cw&&(m.es.W-1)*k<m.es.cw,nome+': escala inteira '+k+'× e canvas no tamanho real da tela',m.es);
    const curto=Math.min(m.es.W,m.es.H);t.ok(curto>=180&&curto<=(m.es.longe?400:340),nome+': lado menor com '+curto+' pixels de jogo'+(m.es.longe?' (câmera afastada)':''),curto);
    t.ok(!inter(m.hl,m.hr),nome+': vida/objetivo não encostam nos botões do alto',[m.hl,m.hr]);
    if(toque){t.ok(m.use&&m.use.w>=60&&m.use.h>=60,nome+': botão de ação grande',m.use);
      t.ok(!m.prompt||!inter(m.prompt,m.use),nome+': aviso de interação não cobre o botão',[m.prompt,m.use]);
      t.ok(m.msgs.every(b=>!inter(b,m.use)&&!inter(b,m.prompt)),nome+': avisos não cobrem os botões nem a interação',m.msgs);
      t.ok(m.ver&&m.ver.w>=44&&!inter(m.ver,m.use)&&!inter(m.ver,m.prompt)&&m.msgs.every(b=>!inter(b,m.ver)),nome+': botão VER (vista ampla) livre, sem cobrir ação nem avisos',[m.ver,m.prompt]);}
    if(toque)t.ok(!m.zona||(!inter(m.zona,m.ver)&&!inter(m.zona,m.use)&&!inter(m.zona,m.prompt)),nome+': dica do lado de andar não cobre VER, AÇÃO nem o aviso de interação',[m.zona,m.ver,m.prompt]);
    t.ok(m.guia&&m.guia.h>=40&&m.guia.x+m.guia.w<=w+1,nome+': botão Guia no alto, inteiro na tela',m.guia);
    t.ok(m.msgs.every(b=>!inter(b,m.hl)&&!inter(b,m.hr)),nome+': avisos não cobrem a vida, o objetivo nem os botões do alto',[m.msgs,m.hl]);
    t.ok(Math.min(...m.fontes)>=11,nome+': textos do HUD com pelo menos 11 px',Math.min(...m.fontes));
    await page.screenshot({path:path.join(__dirname,'shots','tela-'+w+'x'+h+'.png')});
    /* painel de programação aberto */
    await ev(()=>{__vt.G.learn={s0:true,s1:true};__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');escolherDesafio(__vt.DESAFIO.s2);for(let i=0;i<6;i++)painelInserir(i%3===1?'right':'fwd');PAINEL.sel=PAINEL.prog[0].id;renderPainel();});
    await page.waitForTimeout(200);
    const p=await ev(()=>{
      const pn=document.getElementById('painel').getBoundingClientRect();
      const vis=[...document.querySelectorAll('#painel button')].filter(b=>b.offsetParent!==null);
      const rolam=b=>!!b.closest('#pEtapas,#pSits,#pPaleta,#pVars');   // fileiras que rolam de lado: basta a parte visível
      const fora=vis.filter(b=>{const r=b.getBoundingClientRect();return!rolam(b)&&(r.right>innerWidth+1||r.left<-1);}).map(b=>b.textContent);
      const at=document.querySelector('#pEtapas .atual').getBoundingClientRect();if(at.right>innerWidth+1||at.left<-1)fora.push('etapa atual fora da vista');
      const ctl=[...document.querySelectorAll('#pCtl .btn')].filter(b=>b.offsetParent!==null).map(b=>{const r=b.getBoundingClientRect();return{t:b.textContent,h:r.height,w:r.width,cortado:b.scrollWidth>b.clientWidth+1};});
      const pal=[...document.querySelectorAll('#pPaleta .pb')].map(b=>b.getBoundingClientRect().height);
      const prog=document.getElementById('pProg').getBoundingClientRect();
      const fontes=[...document.querySelectorAll('#painel .ln, #painel .btn, #painel .pb, #pMsg, .ch')].filter(e=>e.offsetParent!==null).map(e=>parseFloat(getComputedStyle(e).fontSize));
      const p0=document.getElementById('painel');
      return{pn:{x:pn.x,y:pn.y,w:pn.width,h:pn.height},fora,ctl,pal,prog:{h:prog.height,w:prog.width},fmin:Math.min(...fontes),rola:p0.scrollHeight>p0.clientHeight+2,ultimo:(()=>{p0.scrollTop=1e6;const b=document.getElementById('pCtl').getBoundingClientRect();return b.bottom<=innerHeight+1;})()};
    });
    /* editor amplo (padrão): a sala vira uma faixa compacta, mas o mecanismo continua dentro dela */
    const mundo=p.pn.y>40?p.pn.y/h:p.pn.x/w;
    const fv=await ev(()=>{__vt.quadros(2);const R0=__vt.R,v=R0.vista,k=R0.k/R0.dpr,f=PAINEL.foco;return{x:(f.x+R0.ox)*k,y:(f.y+R0.oy)*k,v:{x:v.x/R0.dpr,y:v.y/R0.dpr,w:v.w/R0.dpr,h:v.h/R0.dpr}};});
    const dentro=fv.x>=fv.v.x&&fv.x<=fv.v.x+fv.v.w&&fv.y>=fv.v.y-8&&fv.y<=fv.v.y+fv.v.h;
    t.ok(mundo>=0.2&&dentro,nome+': editor amplo: o mecanismo fica à vista na faixa da sala ('+Math.round(mundo*100)+'% da tela)',{pn:p.pn,fv});
    t.ok(!p.fora.length,nome+': nenhum botão do painel sai da tela',p.fora);
    t.ok(p.ctl.every(b=>b.h>=40),nome+': controles do painel com pelo menos 40 px de altura',p.ctl.map(b=>Math.round(b.h)));
    t.ok(p.ctl.every(b=>!b.cortado),nome+': nenhum rótulo dos controles do painel cortado (Executar, Passo, Parar, Reiniciar…)',p.ctl.filter(b=>b.cortado).map(b=>b.t));
    t.ok(p.pal.every(x=>x>=46),nome+': placas da paleta com pelo menos 46 px',p.pal.map(Math.round));
    t.ok(p.prog.h>=80,nome+': lista do programa com espaço ('+Math.round(p.prog.h)+' px)',p.prog);
    t.ok(p.fmin>=11,nome+': textos do painel com pelo menos 11 px',p.fmin);
    t.ok(p.ultimo,nome+': os controles do fim do painel são alcançáveis'+(p.rola?' (o painel rola)':''),p.rola);
    const ve=await ev(()=>{document.getElementById('painel').scrollTop=0;mostrarErro({linha:3,titulo:'Erro de teste (TypeError): era esperado um número inteiro (int).',texto:'Explicação do erro de teste, com duas ou três linhas de texto para ocupar o espaço que uma explicação de verdade ocupa.'});
      const b=document.getElementById('pErro').getBoundingClientRect(),f=document.getElementById('pRodape').getBoundingClientRect(),inf=document.getElementById('pInfo'),i=inf.getBoundingClientRect();
      /* deitado (duas colunas): a área de erro fica na coluna da esquerda, inteira à vista dentro dela */
      const duas=getComputedStyle(inf).display!=='contents';return{duas,topo:b.top,fim:b.bottom,rodape:f.top,iTopo:i.top,iFim:i.bottom,dir:b.right<=f.left+1};});
    t.ok(ve.duas?(ve.topo>=ve.iTopo-1&&ve.fim<=ve.iFim+1&&ve.dir):(ve.topo>=0&&ve.fim<=ve.rodape+1),nome+': a área de erro aparece inteira'+(ve.duas?' na coluna do desafio, ao lado do programa':', acima dos botões fixos do painel'),ve);
    /* "Ver a sala": a sala ganha espaço; depois volta ao editor amplo */
    const sala=await ev(()=>{document.getElementById('pLayout').click();const r=document.getElementById('painel').getBoundingClientRect();const m=r.y>40?r.y/innerHeight:r.x/innerWidth;document.getElementById('pLayout').click();return m;});
    t.ok(sala>=0.3,nome+': "Ver a sala" deixa a sala com '+Math.round(sala*100)+'% da tela',sala);
    await page.screenshot({path:path.join(__dirname,'shots','painel-'+w+'x'+h+'.png')});
    t.ok(!logs.length,nome+': sem erros',logs.slice(0,2));
    await browser.close();
  }
  t.done();
})();
