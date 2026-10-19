// Câmara Final · polimento do Devorador: origem fixa dos quadros, golpes justos (aviso, área, dano único, invulnerabilidade, nunca
// sobre mecanismos/terminal), sólidos do corpo, aviso de dano curto, indicador de progresso real e purificação em etapas.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b19-boss-polimento');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:900,height:640},dpr:1});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},240000);
  const U=ui(page),ev=U.ev;
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(250);
  const entrar=()=>ev(()=>{const V=__vt;V.G.treino.feito=true;for(const k of RELIC_KEYS)for(const d of desafiosDa(k))V.G.learn[d.id]=true;delete V.G.learn.k1;delete V.G.learn.c1;V.entrar('camara');V.quadros(30);});
  await entrar();

  /* ---- arte: origem fixa ---- */
  const arte=await ev(()=>{const r={};for(const k in ARTE_BOSS){const o=ARTE_BOSS[k];r[k]={n:o.img.length,w:o.w,h:o.h,ok:o.img.every(m=>m.naturalWidth===o.w&&m.naturalHeight===o.h)};}return{r,ori:ORI};});
  t.ok(Object.values(arte.r).every(x=>x.ok),'todos os quadros de um mesmo grupo têm o mesmo tamanho (mesmo recorte, sem deslocar ao trocar de quadro)',arte.r);
  t.ok(arte.ori.big.ay===arte.r.big.h&&arte.ori.peq.ay===arte.r.peq.h&&arte.ori.bol.ay===arte.r.bol.h&&arte.ori.fraco.ay===arte.r.fraco.h,'a origem vertical (o chão) de cada grupo coincide com a base do recorte: pés no mesmo ponto',arte.ori);
  const ancoras=[13+arte.ori.big.ax*2,6+arte.ori.fraco.ax*2];const base=ancoras;
  t.ok(Math.abs(ancoras[0]-160)<=2&&Math.abs(ancoras[1]-160)<=2,'o gigante e o enfraquecido ficam ancorados no mesmo ponto da célula da folha (x=160), sem deslocamento ao trocar de quadro',{base,ancoras});

  /* ---- dormindo: quadro da criatura pequena; sólido pequeno ---- */
  await ev(()=>{G.invuln=99;__vt.quadros(10);});
  let b=await ev(()=>({q:G.area.boss.quadro,sP:G.area.solidos.filter(s=>s.on).length}));
  t.ok(b.q==='peq','dormindo, aparece a criatura pequena (quadros 1 a 3)',b);

  /* ---- acorda; quadro 6 em repouso, 7 durante o golpe, 8 enfraquecido ---- */
  await ev(()=>{__vt.ir(14*16,13*16,'cima');__vt.quadros(5);__vt.quadros(120);G.area.boss.golpes=[];G.area.boss.prox=999;G.area.boss.graca=0;__vt.quadros(2);});
  b=await ev(()=>({q:G.area.boss.quadro,tr:G.area.boss.trans}));
  t.ok(b.tr===null&&b.q==='big:0','transformado e em repouso: quadro 6 (tentáculo abaixado)',b);
  await ev(()=>{G.invuln=99;G.area.boss.golpes=[{x:12*16,y:15*16,t:0.2,hit:false}];__vt.quadros(2);});
  b=await ev(()=>G.area.boss.quadro);t.ok(b==='big:1','durante o aviso do golpe aparece o quadro 7 (tentáculo erguido): ataque sincronizado com o círculo',b);
  await ev(()=>{G.area.boss.golpes=[];G.area.boss.fracoAte=G.t+9;__vt.quadros(2);});
  b=await ev(()=>G.area.boss.quadro);t.ok(b==='fraco:0','vulnerável depois de uma fase: quadro 8 (enfraquecido), diferente do ataque',b);
  await ev(()=>{G.area.boss.fracoAte=0;__vt.quadros(2);});

  /* ---- sólidos: corpo gigante bloqueia a base; a criatura pequena só o seu espaço ---- */
  const sol=await ev(()=>{const A=G.area;const on=A.solidos.filter(s=>s.on);const g=on.find(s=>s.x1-s.x0>80);return{n:on.length,gr:!!g,w:g?g.x1-g.x0:0};});
  t.ok(sol.gr&&sol.w>=90,'com o guardião gigante, o sólido do corpo é largo (cobre a base visível)',sol);
  const w1=await ev(()=>{__vt.ir(14*16,BOSS.y+14,'cima');__vt.andar(0,-1,1.2);return{y:G.p.y,x:G.p.x};});
  t.ok(w1.y>=10*16-1,'não dá para atravessar a base do guardião gigante andando para cima',w1);
  const w2=await ev(()=>{__vt.ir(14*16-60,BOSS.y+6,'cima');__vt.andar(0,-1,0.8);return{y:G.p.y};});
  t.ok(w2.y<10*16-20,'pelas laterais o caminho continua livre (não há parede invisível além do corpo)',w2);

  /* ---- golpes: área fixa, aviso, dano só no impacto, dano único, invulnerabilidade ---- */
  const R0=await ev(()=>GOLPE);
  t.ok(R0.aviso>=1.2&&R0.raio===20,'o aviso dura pelo menos 1,2 s e a área de impacto tem raio 20, igual ao círculo desenhado',R0);
  await ev(()=>{G.invuln=0;G.hearts=3;__vt.ir(14*16,15*16,'cima');G.area.boss.golpes=[{x:G.p.x+GOLPE.raio+3,y:G.p.y,t:0,hit:false}];__vt.quadros(Math.ceil(GOLPE.aviso*60)+8);});
  let h=await ev(()=>G.hearts);t.ok(h===3,'fora do círculo (a 3 px da borda) não há dano',h);
  await ev(()=>{G.invuln=0;G.hearts=3;__vt.ir(14*16,15*16,'cima');G.area.boss.golpes=[{x:G.p.x+GOLPE.raio-4,y:G.p.y,t:0,hit:false}];__vt.quadros(Math.ceil(GOLPE.aviso*60)-10);});
  h=await ev(()=>G.hearts);t.ok(h===3,'dentro do círculo, mas antes do impacto, não há dano',h);
  await ev(()=>{__vt.quadros(30);});h=await ev(()=>G.hearts);t.ok(h===2,'dentro do círculo no instante do impacto: 1 coração',h);
  await ev(()=>{__vt.quadros(60);});h=await ev(()=>G.hearts);t.ok(h===2,'o mesmo golpe não fere duas vezes',h);
  await ev(()=>{G.invuln=0;G.hearts=3;G.area.boss.golpes=[{x:G.p.x,y:G.p.y,t:GOLPE.aviso-0.01,hit:false},{x:G.p.x+4,y:G.p.y,t:GOLPE.aviso-0.01,hit:false}];__vt.quadros(4);});
  h=await ev(()=>G.hearts);t.ok(h===2,'dois golpes no mesmo instante ferem uma vez só (invulnerabilidade logo após o dano)',h);
  /* aviso de dano: curto e temporário */
  const tx=await ev(()=>{const e=document.querySelector('#msgs .toast.dano');return e?{txt:e.textContent,len:e.textContent.length}:null;});
  t.ok(tx&&tx.len<=30,'a mensagem de dano é curta (cabe em uma linha do celular)',tx);
  await page.waitForTimeout(2300);await ev(()=>__vt.quadros(3));await page.waitForTimeout(700);
  t.ok(await ev(()=>!document.querySelector('#msgs .toast.dano')),'a mensagem de dano some sozinha em poucos segundos');

  /* ---- golpes nunca caem sobre mecanismos, terminal, Lume ou saída; nem uns sobre os outros ---- */
  const bad=await ev(()=>{const B=G.area.boss;let ruim=0,total=0,juntos=0;const prot=[G.area.term,{x:18.5*16,y:16.5*16},ARENA.valvula,ARENA.espelhos[0],ARENA.espelhos[1],ARENA.resso];
    G.invuln=99;G.area.boss.fracoAte=0;
    for(const pos of [[14*16,15*16],[18*16,16*16],[14*16,12*16+10],[6*16,11*16],[22*16,9*16]]){__vt.ir(pos[0],pos[1],'cima');
      for(let r=0;r<60;r++){B.golpes=[];B.graca=0;B.prox=0.001;__vt.quadros(1);
        for(const g of B.golpes){total++;for(const q of prot)if(Math.hypot(g.x-q.x,g.y-(q.y-8))<GOLPE.raio+16)ruim++;
          for(const o of B.golpes)if(o!==g&&Math.hypot(g.x-o.x,g.y-o.y)<GOLPE.raio*2)juntos++;}}}
    B.golpes=[];return{ruim,total,juntos};});
  t.ok(bad.total>100&&bad.ruim===0&&bad.juntos===0,'em '+bad.total+' golpes sorteados, nenhum cobre mecanismo/terminal/Lume nem outro golpe',bad);

  /* ---- programando: nada ataca; ao fechar o painel, os avisos pendentes não caem de surpresa ---- */
  await ev(()=>{G.invuln=0;G.hearts=3;__vt.ir(14*16,15*16,'cima');G.area.boss.golpes=[{x:G.p.x,y:G.p.y,t:1.0,hit:false}];__vt.painel('camara');__vt.quadros(3);});
  b=await ev(()=>({g:G.area.boss.golpes.length,h:G.hearts}));
  t.ok(b.g===0&&b.h===3,'abrir o editor apaga os avisos pendentes: nenhum golpe "guardado" cai ao fechar',b);
  await ev(()=>{fecharPainel();__vt.quadros(5);});
  b=await ev(()=>({g:G.area.boss.golpes.length,graca:G.area.boss.graca>0}));
  t.ok(b.g===0&&b.graca,'ao fechar o editor há um período de calma antes do próximo ataque',b);

  /* ---- indicador de progresso real ---- */
  let o=await ev(()=>objetivo());
  t.ok(/mecanismos 0\/4/.test(o.t)&&!/fase \d de \d/i.test(o.t)&&o.d&&/válvula/.test(o.d),'o objetivo mostra "mecanismos 0/4" (a batalha tem um desafio com quatro mecanismos, não 4 fases) e o detalhe fica para o modo expandido',o);
  await ev(()=>{__vt.painel('camara');});
  await U.escrever('cortar_energia()\nabrir_valvula()');await U.executar();
  o=await ev(()=>objetivo());t.ok(/mecanismos 2\/4/.test(o.t),'com a energia cortada e a válvula aberta o indicador mostra 2/4',o.t);
  await ev(()=>{fecharPainel();});

  /* ---- vencer: dano do guardião (piscar) e purificação em etapas ---- */
  await ev(()=>{__vt.painel('camara');});
  await U.escrever('cortar_energia()\nabrir_valvula()\nalinhar_espelhos()\ndisparar_ressonador()');
  const r=await U.executar();t.ok(r.ok,'a ordem certa vence o desafio',r);
  const dn=await ev(()=>G.area.boss.danoAte>G.t);t.ok(dn,'vencer a fase aciona a animação de dano (piscar claro), diferente do ataque');
  await ev(()=>{fecharPainel();__vt.quadros(3);G.area.boss.fracoAte=0;});
  const et=await ev(()=>{const B=G.area.boss,r={};const pass=(s)=>{while(B.pur!==null&&B.pur<s)__vt.quadros(1);};
    r.golpesAntes=B.golpes.length;const e0=G.area.escuro;
    pass(0.4);r.q1=B.quadro;r.g1=B.golpes.length;
    pass(2.4);r.q2=B.quadro;
    pass(3.0);r.q3=B.quadro;
    pass(4.4);r.q4=B.quadro;r.rest=Math.round(100*(e0-G.area.escuro))/100;
    __vt.quadros(40);r.puro=B.puro;r.fim=G.diary.indexOf('camara_fim')>=0;r.esc=G.area.escuro;return r;});
  t.ok(et.q1==='fraco:0'&&et.g1===0,'1) o núcleo perde intensidade: quadro enfraquecido e nenhum golpe',et);
  t.ok(et.q2==='fraco:0','2) os tentáculos ficam enfraquecidos e o monstro não ataca',et.q2);
  t.ok(et.q4==='peq'&&et.rest>0.02,'3-4) a criatura volta à forma pequena e a energia da câmara é restaurada (câmara mais clara)',{q3:et.q3,q4:et.q4,rest:et.rest});
  t.ok(et.puro&&et.fim,'5) o guardião fica purificado e o diário registra o fim',et);
  await ev(()=>{G.area.boss.golpes=[];__vt.quadros(60);});
  t.ok(await ev(()=>G.area.boss.golpes.length===0&&G.area.boss.puro&&G.area.solidos.some(s=>s.on&&s.x1-s.x0<30)),'depois de purificado não há mais golpes e só resta o sólido da criatura pequena');

  /* ---- reentrada: a luta não recomeça ---- */
  await ev(()=>{sairTumba(false);});await page.waitForTimeout(700);await ev(()=>__vt.quadros(4));
  await ev(()=>{const p=__vt.porta('final');__vt.ir(p.x,p.y,'cima');usarPortaFinal();});await page.waitForTimeout(900);await ev(()=>__vt.quadros(4));
  const re=await ev(()=>({a:G.area.id,feito:bossFeito()}));
  t.ok(re.feito&&re.a==='final','com a câmara concluída, a porta final do vale leva direto à Cidade-Jardim (a batalha não reinicia)',re);
  }catch(err){t.ok(false,'erro inesperado: '+err.message+' | '+String(err.stack).split('\n').slice(0,4).join(' ; '));}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
