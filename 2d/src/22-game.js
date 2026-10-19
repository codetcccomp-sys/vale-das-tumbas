/* ====================== estado do jogo ====================== */
const $=id=>document.getElementById(id);
const G={
  mode:'menu',   // menu | historia | play | paused | painel | diario | guia | dialogo | trans | fim
  area:null,curTomb:null,hearts:3,invuln:0,danoT:0,lantern:100,lanternOn:false,
  relics:{steam:false,diesel:false,atom:false,bio:false},learn:{},progs:{},diary:[],diaryNew:0,insc:{},sec:{},abertas:[],done:false,time:0.12,migr:null,
  treino:{feito:true,passo:0,manivela:false},dicas:{},poi:{},guia:false,lumeFalou:false,pistas:{},fixadas:[],marcas:{},
  p:{x:0,y:0,vx:0,vy:0,dir:'baixo',anim:0,parado:0,usar:0,run:false,caindo:0,vel:0,passoAcc:0},
  checkpoint:null,valePos:null,t:0,nightSeen:false,salvoEm:0
};
const DAY_LEN=480,WALK=74,RUN=118;
let EXP=null;
function saberOk(k){const d=desafiosDa(k);return d.length>0&&d.every(x=>G.learn[x.id]);}
function saberesCount(){return RELIC_KEYS.filter(saberOk).length;}
function relicEstado(k){return!G.relics[k]?0:saberOk(k)?2:1;}

/* ====================== avisos (mesmo sistema do 3D: sem repetição, com prioridade e tempo de leitura) ====================== */
/* acao: número da ação do jogador (AÇÃO, VER, LUZ) que gerou o aviso; o aviso de uma ação nova tira os das anteriores */
const TOASTS={on:[],queue:[],last:new Map(),acao:0,naAcao:false};
function toastMs(text,kind){if(kind==='dano')return 1900;if(kind==='curto')return 3200;return Math.min(9500,Math.max(kind==='warn'?5200:4300,text.length*62));}
const telaCompacta=()=>innerWidth<=620||innerHeight<=520;
function toast(text,kind){
  R.hudTopo=0;const now=performance.now(),pri=kind==='warn'||kind==='dano'||kind==='curto'?2:kind==='good'?1:0,acao=TOASTS.naAcao?TOASTS.acao:0;
  /* o jogador já passou para outro item: o aviso do item anterior sai em vez de empilhar */
  if(acao){for(const t of TOASTS.on.slice())if(t.acao&&t.acao<acao&&t.text!==text)toastOut(t,now,true);
    for(let i=TOASTS.queue.length-1;i>=0;i--)if(TOASTS.queue[i].acao&&TOASTS.queue[i].acao<acao)TOASTS.queue.splice(i,1);}
  const same=TOASTS.on.find(t=>t.text===text);
  if(same){if(acao)same.acao=acao;same.count++;same.until=Math.max(same.until,now+Math.max(2500,toastMs(text,kind)*0.6));same.n.textContent='×'+same.count;same.n.hidden=false;return same.el;}
  const q=TOASTS.queue.find(t=>t.text===text);if(q){if(acao)q.acao=acao;q.count++;return null;}
  const lt=TOASTS.last.get(text);if(!acao&&lt!==undefined&&now-lt<1200)return null;
  TOASTS.queue.push({text,kind,pri,t:now,count:1,acao});TOASTS.queue.sort((a,b)=>b.pri-a.pri||(b.acao?1:0)-(a.acao?1:0)||a.t-b.t);
  while(TOASTS.queue.length>4)TOASTS.queue.pop();
  toastPump(now);const shown=TOASTS.on.find(t=>t.text===text);return shown?shown.el:null;
}
function toastShow(it,now){
  const el=document.createElement('div');el.className='toast'+(it.kind?' '+it.kind:'');el.setAttribute('role',it.pri===2?'alert':'status');
  const tx=document.createElement('span');tx.textContent=it.text;const n=document.createElement('b');n.className='n';n.hidden=it.count<2;n.textContent='×'+it.count;
  el.appendChild(tx);el.appendChild(n);$('msgs').appendChild(el);
  TOASTS.on.push({el,n,text:it.text,kind:it.kind,pri:it.pri,born:now,until:now+toastMs(it.text,it.kind),count:it.count,acao:it.acao||0});
}
/* ja: sai na hora (trocado por outro aviso), sem a animação que deixaria o novo aviso aparecer mais abaixo e depois subir */
function toastOut(t,now,ja){const i=TOASTS.on.indexOf(t);if(i>=0)TOASTS.on.splice(i,1);TOASTS.last.set(t.text,now);if(ja){t.el.remove();return;}t.el.classList.add('out');setTimeout(()=>{if(t.el.parentNode)t.el.parentNode.removeChild(t.el);},450);}
function toastPump(now){
  while(TOASTS.queue.length){
    const nx=TOASTS.queue[0],max=telaCompacta()?2:3;
    /* sai o de menor prioridade e mais antigo; o aviso de uma ação aparece na hora, sem tirar outro aviso da mesma ação */
    if(TOASTS.on.length>=max){let v=null;for(const t of TOASTS.on)if((nx.acao?t.acao!==nx.acao:now-t.born>2000)&&t.pri<=nx.pri&&(!v||t.pri<v.pri||(t.pri===v.pri&&t.born<v.born)))v=t;
      if(!v&&nx.pri===2)for(const t of TOASTS.on)if(t.pri<2&&(!v||t.pri<v.pri))v=t;if(!v)break;toastOut(v,now,true);}
    TOASTS.queue.shift();toastShow(nx,now);
  }
}
function toastTick(now){for(const t of TOASTS.on.slice())if(now>=t.until)toastOut(t,now);if(TOASTS.queue.length)toastPump(now);if(TOASTS.last.size>40)for(const[k,v]of TOASTS.last)if(now-v>10000)TOASTS.last.delete(k);}
/* uma ação do jogador (AÇÃO, VER, LUZ): os avisos que ela gerar substituem os das ações anteriores e aparecem na hora */
function comoAcao(f){TOASTS.acao++;TOASTS.naAcao=true;try{f();}finally{TOASTS.naAcao=false;}}
function toastClear(){for(const t of TOASTS.on.slice())toastOut(t,performance.now(),true);TOASTS.queue.length=0;TOASTS.last.clear();}

/* ====================== HUD ====================== */
const HUDI={};
function hudInit(){
  const url=c=>c.toDataURL();
  HUDI.cheio=url(escalar(SPR.get('coracao',true),3));HUDI.vazio=url(escalar(SPR.get('coracao',false),3));
  const h=$('hearts');for(let i=0;i<3;i++){const im=document.createElement('img');im.className='px';im.alt='';h.appendChild(im);}
  const r=$('relics');for(const k of RELIC_KEYS){const im=document.createElement('img');im.className='px';im.alt=RELIC_INFO[k].name;im.dataset.k=k;r.appendChild(im);}
  HUDI.rel={};for(const k of RELIC_KEYS)HUDI.rel[k]=[0,1,2].map(e=>url(escalar(SPR.get('reliquia',k,e),2)));
  $('goal').onclick=alternarObjetivo;
}
function escalar(c,k){const o=cnv(c.width*k,c.height*k),g=ctx2(o);g.drawImage(c,0,0,o.width,o.height);return o;}
let hudKey='';
function atualizarHud(){
  if((G.t%0.5)<0.02||!R.hudTopo){const r=$('hl').getBoundingClientRect();R.hudTopo=r.bottom>0?Math.round(r.bottom*R.dpr/R.k):0;
    /* a pilha de avisos começa logo abaixo do HUD de cima, longe do explorador (nas telas baixas o CSS a põe ao lado) */
    const m=$('msgs');if(innerHeight>520)m.style.top=Math.round(Math.max(r.bottom,$('hr').getBoundingClientRect().bottom)+8)+'px';else m.style.top='';}
  const rel=RELIC_KEYS.map(relicEstado).join('');
  const key=G.hearts+'|'+rel+'|'+(G.area&&G.area.id);
  if(key!==hudKey){hudKey=key;
    [...$('hearts').children].forEach((im,i)=>{im.src=i<G.hearts?HUDI.cheio:HUDI.vazio;});
    [...$('relics').children].forEach(im=>{const e=relicEstado(im.dataset.k);im.src=HUDI.rel[im.dataset.k][e];im.title=RELIC_INFO[im.dataset.k].name+(e===2?' (desperta)':e===1?' (adormecida)':'');});
    $('relicTxt').textContent=saberesCount()+'/4 saberes';
  }
  if(G.area&&G.area.id!=='vale'){$('lantern').classList.toggle('off',!G.lanternOn);$('ltxt').textContent=G.lanternOn?'acesa':'apagada';}
  /* o que o explorador leva na mão (cápsula do pátio dos Motores): fica no HUD em vez de virar aviso */
  const nm=G.area&&G.area.naMao?G.area.naMao():null,nk=nm?nm.t:'';
  if(nk!==atualizarHud.nk){atualizarHud.nk=nk;const e=$('mao');e.hidden=!nm;e.textContent='';if(nm){const s=document.createElement('span');s.textContent='Na mão';const b=document.createElement('b');b.textContent=nm.t;b.style.color=nm.cor||'';e.appendChild(s);e.appendChild(b);}}
  /* objetivo: refeito (e pisca) só quando o texto muda; nas telas pequenas encolhe para o título e uma linha depois de
     alguns segundos, e tocar nele abre de novo */
  const go=objetivo(),gk=go?go.t+'\n'+go.s+(go.d?'\n'+go.d:''):'',el=$('goal');
  if(gk!==atualizarHud.gk){atualizarHud.gk=gk;el.textContent='';el.classList.remove('curto','aberto','comdet');GOAL.t=performance.now();
    if(go){const b=document.createElement('b');const bs=document.createElement('i');bs.className='bus';bs.title='Direção do objetivo';b.appendChild(bs);b.appendChild(document.createTextNode(go.t));const s=document.createElement('span');s.className='gs';s.textContent=go.s;el.appendChild(b);el.appendChild(s);el.classList.toggle('comdet',!!go.d);if(go.d){const d=document.createElement('span');d.className='gd';d.textContent=go.d;el.appendChild(d);}el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}}
  else if(go&&!el.classList.contains('curto')&&telaCompacta()&&performance.now()-GOAL.t>GOAL.ms){el.classList.remove('aberto');el.classList.add('curto');R.hudTopo=0;}
  /* bússola: a seta no título do objetivo aponta do explorador para o alvo da etapa (some quando ele já está perto) */
  const bs=el.querySelector('.bus');if(bs){const al=go&&go.alvo;if(al){const dx=al.x-G.p.x,dy=al.y-G.p.y;bs.hidden=Math.hypot(dx,dy)<40;bs.style.transform='rotate('+Math.atan2(dy,dx).toFixed(2)+'rad)';}else bs.hidden=true;}
}
const GOAL={t:0,ms:9000};
function alternarObjetivo(){const el=$('goal'),det=!!el.querySelector('.gd');
  /* toques no objetivo (telas pequenas): recolhido → normal → (se houver detalhe) expandido → recolhido */
  if(el.classList.contains('curto')){el.classList.remove('curto');GOAL.t=performance.now();}
  else if(det&&!el.classList.contains('aberto')){el.classList.add('aberto');GOAL.t=performance.now();}
  else{el.classList.remove('aberto');if(telaCompacta())el.classList.add('curto');}
  R.hudTopo=0;SFX.click();}
/* objetivo: sempre a próxima etapa de aprendizagem */
function objetivo(){
  if(!G.area)return null;
  const prox=ORDEM_TUMBAS.find(k=>!saberOk(k));
  if(G.area.id==='vale'){
    if(prox){const T=TOMBS[prox],S=SABERES[T.saber],n=ORDEM_TUMBAS.indexOf(prox)+1;return{t:'Etapa '+n+' de 5 · '+S.nome,s:T.name+' ('+({NE:'nordeste',O:'oeste',SO:'sudoeste',SE:'sudeste'}[T.label])+'), siga a trilha '+NOME_TRILHA[prox]+'.',alvo:{x:T.out.x*16+8,y:T.out.y*16-20,txt:T.name},cor:T.col};}
    if(!G.done)return{t:'Etapa 5 de 5 · Tudo junto',s:'Leve os quatro saberes à porta ao norte: um guardião protege o caminho até a Cidade-Jardim.',alvo:{x:PIR.x,y:PIR.y-10,txt:'Cidade-Jardim'},cor:'#ffd24a'};
    return{t:'Vale restaurado',s:'Explore os segredos do vale: '+secCount()+'/12.'};
  }
  if(G.area.objetivo)return G.area.objetivo();
  return null;
}
function secCount(){return SEC_IDS.filter(k=>G.sec[k]).length;}
function secFragCount(){return SEC_FRAGS.filter(f=>G.sec[f.id]).length;}

/* ====================== diário ====================== */
function addDiary(id,silent){
  if(G.diary.indexOf(id)>=0||!ENTRIES[id])return;
  G.diary.push(id);G.diaryNew++;$('btnDiary').classList.add('new');
  if(!silent){toast('Diário atualizado: '+ENTRIES[id].t);SFX.page();salvar(false);}
}
let abaDiario='notas';
function abrirDiario(aba){
  if(G.mode!=='play'&&G.mode!=='paused')return;
  G.modoAntes=G.mode==='paused'?'play':G.mode;G.mode='diario';esconderTelas();$('diario').hidden=false;document.body.classList.add('modal');limparEntrada();
  mostrarAba(aba||abaDiario);SFX.page();
}
function fecharDiario(){$('diario').hidden=true;document.body.classList.remove('modal');G.mode='play';G.diaryNew=0;$('btnDiary').classList.remove('new');limparEntrada();}
function mostrarAba(a){
  abaDiario=a;for(const b of document.querySelectorAll('.aba'))b.classList.toggle('on',b.dataset.aba===a);
  const L=$('dLista'),mapa=$('mapCv');L.textContent='';mapa.hidden=a!=='mapa';L.hidden=a==='mapa';
  const card=(t,s,cod,cls,novo)=>{const d=document.createElement('div');d.className='entry'+(cls?' '+cls:'');const h=document.createElement('h3');h.textContent=t;if(novo){const tg=document.createElement('span');tg.className='tag';tg.textContent='novo';h.appendChild(tg);}
    const p=document.createElement('p');p.textContent=s;d.appendChild(h);d.appendChild(p);if(cod){const pr=document.createElement('pre');pr.textContent=cod;d.appendChild(pr);}L.appendChild(d);};
  if(a==='notas'){
    $('dInfo').textContent='Anotações: '+G.diary.length+' · segredos: '+secCount()+'/12 · marcas de luz: '+Object.keys(G.marcas).length+'/'+MARCA_IDS.length;
    const lst=G.diary.slice().reverse();if(!lst.length)card('Ainda não há anotações','Explore o vale.');
    lst.forEach((id,i)=>{const e=ENTRIES[id];if(e)card(e.t,e.s,e.cod,e.cod?'saber':'',i<G.diaryNew);});
  }else if(a==='saberes'){
    $('dInfo').textContent='Cada tumba guarda um saber, e cada saber tem a sua relíquia: ela desperta quando todas as etapas da tumba são concluídas. Aqui ficam o conceito e o programa que você escreveu.';
    for(const k of RELIC_KEYS){const S=SABERES[TOMBS[k].saber],ok=saberOk(k),feitos=desafiosDa(k).filter(d=>G.learn[d.id]).length,tot=desafiosDa(k).length;
      if(ok){card(S.nome+' · '+RELIC_INFO[k].name,S.resumo,S.exemplo,'saber');const m=meuPrograma(k);if(m)card('Seu programa · '+m.cfg.titulo,'O programa que você escreveu e que resolveu esta etapa'+(m.cfg.etapa==='aplicacao'?', sem guia, numa situação nova.':'.'),m.cod,'saber');}
      else card(S.nome+' · '+TOMBS[k].name,(G.relics[k]?'Relíquia adormecida. ':'')+'Etapas concluídas: '+plural(feitos,'etapa','etapas')+' de '+tot+'.',null,'bloq');}
    if(G.done)card(ENTRIES.saber_tudo.t,ENTRIES.saber_tudo.s,ENTRIES.saber_tudo.cod,'saber');
  }else if(a==='pistas'){
    /* pistas lidas (placas com !) e marcas de luz: o que foi encontrado, onde, e o botão para fixar a pista no terminal */
    $('dInfo').textContent='Pistas lidas: '+Object.keys(G.pistas).length+' de '+PISTA_IDS.length+' · marcas de luz: '+Object.keys(G.marcas).length+' de '+MARCA_IDS.length+'. Uma pista fixada aparece no alto do painel de programação.';
    const lidas=PISTA_IDS.filter(id=>G.pistas[id]);if(!lidas.length)card('Nenhuma pista lida ainda','As placas com ! guardam pistas para os desafios. A primeira fica no pátio de treino.');
    for(const id of lidas){const P0=PISTAS[id];card(P0.nome+' · '+nomeLugar(P0.lugar),P0.texto,null,'saber');
      const b=document.createElement('button');b.className='btn';b.textContent=G.fixadas.indexOf(id)>=0?'📌 Fixada no terminal (tirar)':'📌 Fixar no terminal';b.onclick=()=>{fixarPista(id);mostrarAba('pistas');};L.lastChild.appendChild(b);}
    for(const id of MARCA_IDS.filter(id=>G.marcas[id]))card('Marca de luz · '+MARCAS[id].t+' · '+TOMBS[MARCAS[id].tumba].name,MARCAS[id].s,null,'');
  }else if(a==='exemplos'){
    $('dInfo').textContent='Os exemplos das etapas que você já concluiu. Eles também ficam no Guia, em Ajuda › Seus exemplos.';
    const ex=exemplosVistos();if(!ex.length)card('Nenhum exemplo ainda','Os exemplos aparecem depois das demonstrações e de cada etapa concluída.');
    for(const e of ex)card(e.titulo,e.de,e.codigo,'saber');
  }else if(a==='relatorio'){
    /* relatório de aprendizagem: o que foi feito, com os números registrados neste aparelho; exportar é opcional */
    const st={learn:G.learn,reg:G.reg,dicas:G.dicas,regDesde:G.regDesde},D=relatorioDados(st);
    $('dInfo').textContent='Etapas concluídas: '+D.feitas+' de '+D.total+' · tentativas: '+D.tentativas+' (com erro: '+D.erros+') · dicas: '+D.dicas+' · previsões certas: '+D.previsoes.acertou+'. '+
      (D.desde?'Registros desde '+D.desde+'.':'Os números começam a ser registrados a partir da próxima tentativa.')+' Fica só neste aparelho; o arquivo exportado não tem nome nem dados pessoais.';
    const bar=document.createElement('div');bar.className='relBar';
    const baixar=(nome,tipo,txt)=>{try{const u=URL.createObjectURL(new Blob([txt],{type:tipo}));const l=document.createElement('a');l.href=u;l.download=nome;document.body.appendChild(l);l.click();setTimeout(()=>{URL.revokeObjectURL(u);l.remove();},500);toast('Relatório salvo: '+nome);}catch(e){toast('Não foi possível salvar o arquivo neste navegador. Use Copiar.','warn');}};
    const bt=(t,f)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=f;bar.appendChild(b);};
    const dia=hojeISO();
    bt('⬇ Baixar TXT',()=>baixar('vale-das-tumbas-relatorio-'+dia+'.txt','text/plain;charset=utf-8',relatorioTXT(st,dia)));
    bt('⬇ Baixar CSV',()=>baixar('vale-das-tumbas-relatorio-'+dia+'.csv','text/csv;charset=utf-8','\ufeff'+relatorioCSV(st)));
    bt('📋 Copiar',()=>{const t=relatorioTXT(st,dia);(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Relatório copiado.'),()=>toast('Não foi possível copiar neste navegador.','warn'));});
    L.appendChild(bar);
    for(const l of D.lugares){
      const linhas=l.etapas.map(e=>(e.feita?'✔ ':'○ ')+e.titulo+(e.demo?'':' — tentativas: '+relNum(e.tentativas)+(e.erros?' (com erro: '+e.erros+')':'')+' · dicas: '+e.dicas)+(e.previsao&&e.previsao!=='—'?' · previsão: '+e.previsao:'')).join('\n');
      card(l.nome+' · '+l.conceito+' ('+l.feitas+'/'+l.total+')',l.completo?(l.resumo||'Concluído.'):'Pendentes: '+l.etapas.filter(e=>!e.feita).map(e=>e.titulo).join('; ')+'.',linhas,l.completo?'saber':'');
    }
  }else{
    $('dInfo').textContent=(secFragCount()>=4?'O mapa completo do vale.':'Reúna os fragmentos de mapa escondidos pelo vale: cada um revela um quarto ('+secFragCount()+'/4).')+' As trilhas coloridas saem da estrada e levam a cada tumba.';
    desenharMapaVale(mapa);
  }
}
/* o programa do jogador que melhor mostra o saber: o da etapa de aplicação (sem guia), ou o da última etapa resolvida */
function meuPrograma(k){
  const l=desafiosDa(k).filter(d=>d.etapa!=='demo'&&G.solucoes&&G.solucoes[d.id]&&G.solucoes[d.id].length);if(!l.length)return null;
  const cfg=l.find(d=>d.etapa==='aplicacao')||l[l.length-1];return{cfg,cod:LANG.codigo(G.solucoes[cfg.id])};
}
function exemplosVistos(){const out=[];for(const d of DESAFIOS)if(G.learn[d.id]&&d.exemplo)out.push({titulo:d.exemplo.titulo,codigo:d.exemplo.codigo,de:nomeLugar(d.tumba)+' · '+d.titulo});return out;}

/* ====================== personagem ====================== */
function posicionar(x,y,dir){const p=G.p;p.x=x;p.y=y;p.vx=p.vy=0;p.dir=dir||p.dir;p.caindo=0;p.anim=0;}
function atualizarJogador(dt){
  const p=G.p,A=G.area,m=G.mode==='play'&&!p.caindo?movimento():{x:0,y:0,run:false};
  const d=Math.hypot(m.x,m.y);
  if(p.caindo>0){p.caindo-=dt;if(p.caindo<=0)aposQueda();return;}
  const sp=(m.run?RUN:WALK)*Math.min(1,d*1.15)*(A.lento&&A.lento(p.x,p.y)?0.55:1);
  const k=1-Math.exp(-14*dt);p.vx+=(m.x/(d||1)*sp-p.vx)*k;p.vy+=(m.y/(d||1)*sp-p.vy)*k;
  if(d<0.05){p.vx*=Math.exp(-18*dt);p.vy*=Math.exp(-18*dt);}
  moverCorpo(A,p,p.vx*dt,p.vy*dt);
  p.vel=Math.hypot(p.vx,p.vy);p.run=m.run&&p.vel>WALK*1.05;
  if(d>0.2){if(Math.abs(m.x)>Math.abs(m.y)*1.05)p.dir=m.x<0?'esquerda':'direita';else if(Math.abs(m.y)>Math.abs(m.x)*1.05)p.dir=m.y<0?'cima':'baixo';}
  p.anim+=p.vel*dt*(p.run?HEROI_CONFIG.animacoes.andar.correndoPorPixel:HEROI_CONFIG.animacoes.andar.porPixel);p.parado=p.vel<8?p.parado+dt:0;if(p.usar>0)p.usar-=dt;
  p.passoAcc+=p.vel*dt;if(p.passoAcc>(p.run?26:20)){p.passoAcc=0;SFX.step(p.run,A.metal);if(A.id==='vale'&&p.run)poeira(p.x,p.y,2);}
  /* perigos do chão */
  const s=soloEm(A,p.x,p.y);
  if(s.k==='vao'||s.k==='agua'&&A.id!=='vale'){cair(s.k==='vao'?'gap':'water');}
}
function cair(causa){const p=G.p;if(p.caindo>0||G.invuln>2)return;p.caindo=0.7;p.causa=causa;SFX.fall();}
function aposQueda(){
  const causa=G.p.causa;G.p.caindo=0;
  ferir(TXT.fall[causa]||TXT.fall.gap,true);
  if(G.mode!=='play')return;
  const c=G.checkpoint||G.area.spawn;posicionar(c.x,c.y,c.dir);toast(G.checkpoint?TXT.backPoint:TXT.backEntrance);camSeguir(G.p.x,G.p.y,0,G.area,true);
}
function ferir(msg,semInvuln,tipo){
  if(!semInvuln&&G.invuln>0)return;
  G.hearts--;G.invuln=1.6;G.danoT=HEROI_CONFIG.animacoes.dano.duracao;SFX.hit();R.treme=tipo==='dano'?0.3:0.5;toast(msg,tipo||'warn');
  if(G.hearts<=0){G.hearts=3;toast(TXT.deathTomb,'warn');if(G.area.id!=='vale'){sairTumba(true);return;}posicionar(G.area.spawn.x,G.area.spawn.y,'baixo');}
}
function curarOasis(){if(G.hearts<3){G.hearts=3;SFX.heal();toast('A água fresca do oásis fechou as feridas.','good');}else toast('A água está fresca. Você já está bem.');addDiary('oasis');}
/* quadro atual: dano > interação > caminhada (avança com a distância andada) > repouso */
function frameJogador(){
  const p=G.p,S=EXP[p.dir],A=HEROI_CONFIG.animacoes;
  if(G.danoT>0)return S.dano[Math.floor(G.t*A.dano.fps)%S.dano.length];
  if(p.usar>0)return S.usar[Math.min(S.usar.length-1,Math.floor((1-p.usar/A.usar.duracao)*S.usar.length))];
  if(p.vel>10)return S.andar[Math.floor(p.anim)%S.andar.length];
  return S.parado[Math.floor(G.t*A.parado.fps)%S.parado.length];
}
function desenharJogador(){
  const p=G.p;
  enfileirar(p.y,g=>{
    /* queda: encolhe em torno do ponto de referência dos pés */
    if(p.caindo>0){const k=p.caindo/0.7;const img=frameJogador();const w=Math.max(2,Math.round(img.width*k)),h=Math.max(2,Math.round(img.height*k));g.globalAlpha=k;g.drawImage(img,Math.round(p.x-HEROI.ax*k+R.ox),Math.round(p.y-HEROI.ay*k+R.oy+(1-k)*6),w,h);g.globalAlpha=1;return;}
    sombra(g,p.x,p.y,7,2.5);
    /* depois da reação ao dano, pisca enquanto ainda está protegido */
    if(G.invuln>0&&G.danoT<=0&&Math.floor(G.t*14)%2===0)return;
    blit(g,frameJogador(),p.x,p.y,HEROI.ax,HEROI.ay);
  });
}

/* ====================== interação ====================== */
let alvoInter=null;
function procurarInteracao(){
  const p=G.p,A=G.area;let best=null,bd=1e9;
  const fx={baixo:[0,1],cima:[0,-1],esquerda:[-1,0],direita:[1,0]}[p.dir];
  for(const it of A.interact){
    if(it.on===false)continue;const lb=it.label();if(!lb)continue;
    const dx=it.x-p.x,dy=it.y-(p.y-4),d=Math.hypot(dx,dy);if(d>it.r)continue;
    const frente=(dx*fx[0]+dy*fx[1])/(d||1);const sc=d-frente*6;
    if(sc<bd){bd=sc;best={it,lb};}
  }
  alvoInter=best;
  const pr=$('prompt');
  if(best&&G.mode==='play'){pr.hidden=false;const kb=IN.mode==='pad'?'A':'E';pr.innerHTML='<kbd>'+kb+'</kbd>';pr.appendChild(document.createTextNode(best.lb));$('bUse').classList.remove('vazio');}
  else{pr.hidden=true;$('bUse').classList.add('vazio');}
}

/* ====================== áreas e transições ====================== */
function fade(on){$('fade').classList.toggle('on',on);}
function trocarArea(A,x,y,dir){
  if(G.area&&G.area.sair)G.area.sair();
  G.area=A;posicionar(x,y,dir);G.checkpoint=null;
  document.body.classList.toggle('intomb',A.id!=='vale');document.body.classList.toggle('semLanterna',A.gastaLanterna===false);
  if(A.entrar)A.entrar();
  auArea(!areaExterna(A),noiteAgora()>0.5,A.som||A.id);
  camSeguir(x,y,0,A,true);alvoInter=null;
}
function transicao(fn,msg){
  if(G.mode==='trans')return;const antes=G.mode;G.mode='trans';limparEntrada();fade(true);if(msg)toast(msg);
  setTimeout(()=>{fn();setTimeout(()=>{fade(false);if(G.mode==='trans')G.mode='play';},120);},380);
}
function entrarTumba(k){
  G.valePos={x:G.p.x,y:G.p.y};
  transicao(()=>{const A=areaTumba(k);G.curTomb=k;A.reiniciar&&A.reiniciar();trocarArea(A,A.spawn.x,A.spawn.y,A.spawn.dir);G.lantern=100;G.lanternOn=k!=='final'&&k!=='camara';salvar(false);
    if(k!=='final'&&k!=='camara'&&G.diary.indexOf('lanterna')<0){addDiary('lanterna',true);setTimeout(()=>{if(G.mode==='play')toast('A lanterna está acesa. Perto das paredes, ela revela marcas de luz dos construtores (opcionais). LUZ ou T acende e apaga.');},1600);}},TXT.enterTomb);
}
function sairTumba(derrota){
  const k=G.curTomb;
  transicao(()=>{const T=TOMBS[k]||(k==='camara'?TOMBS.final:TOMBS.steam);G.curTomb=null;trocarArea(AREAS.vale,T.out.x*16+8,T.out.y*16+8,'baixo');G.lanternOn=false;
    /* a primeira saída depois do saber: a estação de atalho acordou e uma parte do vale voltou a funcionar */
    if(RELIC_KEYS.indexOf(k)>=0&&saberOk(k)&&G.abertas.indexOf('atalho_'+k)<0){G.abertas.push('atalho_'+k);
      setTimeout(()=>{if(G.mode==='play')toast('A estação de atalho ao lado da porta acordou com o saber: ela leva ao acampamento e às outras estações acordadas. '+VALE_REAGE[k],'good');},700);}
    salvar(false);},derrota?null:TXT.backValley);
}
const VALE_REAGE={steam:'As chaminés da era do vapor voltaram a fumegar.',diesel:'Os postes da era dos motores voltaram a acender.',atom:'As antenas da era atômica voltaram a piscar.',bio:'Os cogumelos da era viva voltaram a brilhar.'};
function areaTumba(k){if(!AREAS[k])AREAS[k]=CONSTRUIR[k]();return AREAS[k];}
const areaExterna=A=>!!A&&(A.id==='vale'||A.id==='treino');

/* ====================== salvamento no navegador ====================== */
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}
function lsDel(k){try{localStorage.removeItem(k);}catch(e){}}
/* o navegador deixa guardar? (janela privada, armazenamento bloqueado ou cheio: o jogo segue, com aviso) */
function armazenamentoOk(){try{localStorage.setItem('vt2d_teste','1');localStorage.removeItem('vt2d_teste');return true;}catch(e){return false;}}
function lerJson(k){const r=lsGet(k);if(!r)return null;try{return JSON.parse(r);}catch(e){return null;}}
function lerSave(){return SAVE2D.limpar(lerJson(SAVE2D_KEY));}
/* preferências deste aparelho (separadas do progresso): som, volumes, câmera, painel e referência */
function cfgLer(){const c=lerJson(CFG2D_KEY);return c&&typeof c==='object'&&!Array.isArray(c)?c:{};}
function cfgGravar(patch){const c=Object.assign(cfgLer(),patch);lsSet(CFG2D_KEY,JSON.stringify(c));return c;}
function ler3d(){return SAVE2D.ler3d(lerJson(SAVE3D_KEY));}
let saveAvisou=false;
function salvar(mostrar){
  if(G.mode==='menu')return false;
  const naTumba=G.area&&G.area.id!=='vale';
  const st={relics:G.relics,learn:G.learn,progs:G.progs,diary:G.diary,insc:G.insc,sec:G.sec,abertas:G.abertas,done:G.done,time:G.time,migr:G.migr,
    pos:naTumba?null:{x:G.p.x/16,y:G.p.y/16},tomb:naTumba?(G.curTomb==='camara'?'final':G.curTomb):null,treino:G.treino,dicas:G.dicas,poi:G.poi,guia:G.guia,solucoes:G.solucoes,pistas:G.pistas,fixadas:G.fixadas,marcas:G.marcas,reg:G.reg,regDesde:G.regDesde};
  const ok=lsSet(SAVE2D_KEY,JSON.stringify(SAVE2D.montar(st)));
  if(!ok&&!saveAvisou){saveAvisou=true;toast(TXT.saveFail,'warn');}else if(ok&&mostrar)toast(TXT.saved);
  G.salvoEm=G.t;return ok;
}
function aplicarSave(s){
  G.relics=Object.assign({},s.relics);G.learn=Object.assign({},s.learn);G.progs=s.progs||{};G.diary=s.diary.slice();G.insc=s.insc;G.sec=s.sec;G.abertas=s.abertas.slice();
  G.done=s.done;G.time=s.time;G.migr=s.migr;
  G.treino=Object.assign({},s.treino);G.dicas=Object.assign({},s.dicas);G.poi=Object.assign({},s.poi);G.guia=!!s.guia;G.lumeFalou=G.treino.passo>1;G.solucoes=s.solucoes||{};
  G.pistas=Object.assign({},s.pistas||{});G.fixadas=(s.fixadas||[]).slice();G.marcas=Object.assign({},s.marcas||{});
  G.reg=JSON.parse(JSON.stringify(s.reg||{}));G.regDesde=s.regDesde||null;
}
function resetEstado(){
  G.hearts=3;G.invuln=0;G.danoT=0;G.lantern=100;G.lanternOn=false;G.relics={steam:false,diesel:false,atom:false,bio:false};G.learn={};G.progs={};G.diary=[];G.diaryNew=0;
  G.insc={};G.sec={};G.abertas=[];G.done=false;G.time=0.12;G.migr=null;G.checkpoint=null;G.curTomb=null;G.nightSeen=false;$('btnDiary').classList.remove('new');
  G.treino={feito:false,passo:0,manivela:false};G.dicas={};G.poi={};G.guia=false;G.lumeFalou=false;G.solucoes={};G.pistas={};G.fixadas=[];G.marcas={};G.reg={};G.regDesde=null;
}
/* começa: novo jogo, continuar o save 2D ou migrar o save do 3D (sem mexer nele) */
function iniciarJogo(modo){
  auInit();resetEstado();
  let s=null,avisos=[];
  if(modo==='novo')lsDel(SAVE2D_KEY);
  else{s=lerSave();
    if(!s&&modo==='migrar'){const d3=ler3d();if(d3){s=SAVE2D.migrar(d3,(tx,ty)=>posLivreVale(tx,ty));avisos.push('Progresso do jogo 3D trazido: '+s.migr.relics+' relíquia'+(s.migr.relics===1?'':'s')+' (adormecida'+(s.migr.relics===1?'':'s')+'), diário e '+Object.keys(s.sec).length+'/12 segredos. O save do 3D continua intacto.');}}}
  if(s)aplicarSave(s);
  /* nos testes automáticos (#vt), um jogo novo pula o treino, a não ser que o endereço peça (#vt-treino) */
  if(!s&&window.__vtPularTreino)G.treino.feito=true;
  aplicarSegredos();
  const A=AREAS.vale;let x=A.spawn.x,y=A.spawn.y,dir='cima';
  if(s&&s.tomb){const T=TOMBS[s.tomb];x=T.out.x*16+8;y=T.out.y*16+8;dir='baixo';}
  else if(s&&s.pos){const q=SAVE2D.posSegura(s.pos.x,s.pos.y,posLivreVale);x=q.x*16;y=q.y*16;}
  if(!G.treino.feito){if(!AREAS.treino)AREAS.treino=CONSTRUIR.treino();const T=AREAS.treino;T.reiniciar();trocarArea(T,T.spawn.x,T.spawn.y,'cima');}
  else trocarArea(A,x,y,dir);
  G.curTomb=null;
  esconderTelas();document.body.classList.add('jogando');G.mode='play';limparEntrada();hudKey='';atualizarHud.go=null;
  if(!s){addDiary('camp',true);toast(G.treino.feito?TXT.welcome:TXT.welcomeTreino);setTimeout(()=>{if(G.mode==='play')toast(TXT.tip[IN.mode==='pad'?'pad':IN.mode==='touch'?'touch':'kb']);},2600);mostrarDicaToque();for(const a of avisos)toast(a,'good');}
  else{if(!avisos.length)toast('Progresso carregado: '+saberesCount()+'/4 saberes, '+secCount()+'/12 segredos.'+(s.tomb?' Você está na porta da '+TOMBS[s.tomb].name+'.':''),'good');for(const a of avisos)toast(a,'good');if(s.fixed)toast(TXT.saveFixed,'warn');}
  salvar(false);
}
function posLivreVale(tx,ty){const A=AREAS.vale;if(tx<1||ty<1||tx>=A.w-1||ty>=A.h-1)return false;const k=A.kind(tx,ty);if(TK[k].solido||TK[k].perigo||k==='agua')return false;return livreEm(A,tx*16+8,ty*16+8);}

/* ====================== telas ====================== */
function mostrarTela(id){for(const s of document.querySelectorAll('.tela'))s.hidden=s.id!==id;document.body.classList.toggle('modal',!!id);$('prompt').hidden=true;}
function esconderTelas(){for(const s of document.querySelectorAll('.tela'))s.hidden=true;document.body.classList.remove('modal');}
function focoPrimeiro(id){const b=document.querySelector('#'+id+' .btn:not([hidden])');if(b)try{b.focus({preventScroll:true});}catch(e){}}
function ctlHtml(){
  const rows=IN.mode==='touch'?[['Joystick (lado esquerdo)','andar; empurre até o fim para correr'],['AÇÃO','interagir'],['VER','aproximar ou afastar a câmera'],['LUZ','lanterna nas tumbas'],['Guia','Guia de Programação'],['Diário · II','diário e pausa']]
    :[['WASD ou setas','andar'],['Shift','correr'],['E, Espaço ou Enter','interagir'],['C','aproximar ou afastar a câmera'],['G','Guia de Programação'],['T','lanterna'],['J','diário'],['Esc','pausa']];
  return rows.map(r=>'<b>'+r[0]+'</b><span>'+r[1]+'</span>').join('');
}
function atualizarInicio(){
  const s=lerSave(),d3=s?null:ler3d();
  $('btnContinue').hidden=!s&&!d3;$('btnContinue').textContent=s?'Continuar':'Continuar com o progresso do 3D';
  $('btnNew').className=s||d3?'btn':'btn main';
  $('startNote').textContent=s?'Continuar traz '+RELIC_KEYS.filter(k=>desafiosDa(k).every(d=>s.learn[d.id])).length+'/4 saberes (cada um com a sua relíquia), '+plural(Object.keys(s.learn).length,'etapa concluída','etapas concluídas')+', '+Object.keys(s.sec).length+'/12 segredos e o diário'+(s.tomb?', a partir da porta da '+TOMBS[s.tomb].name:'')+'.'
    :d3?'Encontramos um progresso do jogo 3D neste navegador: '+RELIC_KEYS.filter(k=>d3.relics[k]).length+'/4 relíquias e '+Object.keys(d3.sec).length+'/12 segredos. Dá para trazê-lo: as relíquias voltam adormecidas e despertam quando você recuperar o saber de cada tumba. O save do 3D não é alterado.'
    :'Os sistemas da cidade antiga funcionavam com instruções. Explore o vale, entre nas quatro tumbas e aprenda a programar as máquinas da civilização. O jogo salva sozinho.';
  if(!armazenamentoOk())$('startNote').textContent+=' Atenção: este navegador não deixa guardar dados aqui, então o progresso não será salvo.';
  $('ctlStart').innerHTML=ctlHtml();$('ctlPause').innerHTML=ctlHtml();
  $('pSound').textContent=AU.on?TXT.soundOn:TXT.soundOff;$('pMus').value=Math.round(AU.volMus*100);$('pEfx').value=Math.round(AU.volEfx*100);atualizarTelaCheia();
}
function irMenu(){salvar(false);G.mode='menu';document.body.classList.remove('jogando','intomb');fecharPainel(true);atualizarInicio();mostrarTela('scStart');focoPrimeiro('scStart');}
function pausar(){if(G.mode!=='play')return;G.mode='paused';atualizarInicio();$('saveInfo').textContent=G.area.id==='vale'?'O jogo salva sozinho: relíquias, saberes, programas, diário, segredos e a sua posição no vale.':'Tudo está salvo. Se sair agora, você volta à porta desta tumba; os programas e as etapas concluídas ficam guardados.';mostrarTela('scPause');focoPrimeiro('scPause');}
function retomar(){esconderTelas();G.mode='play';limparEntrada();}
let acaoConfirma=null;
function confirmar(t,txt,sim,acao){$('cfTitle').textContent=t;$('cfText').textContent=txt;$('cfYes').textContent=sim;acaoConfirma=acao;G.modoConfirma=G.mode;mostrarTela('scConfirm');focoPrimeiro('scConfirm');}
const fsOK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
function telaCheiaOn(){return!!(document.fullscreenElement||document.webkitFullscreenElement);}
function alternarTelaCheia(){try{if(telaCheiaOn())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const el=document.documentElement,rq=el.requestFullscreen||el.webkitRequestFullscreen;const r=rq&&rq.call(el,{navigationUI:'hide'});if(r&&r.catch)r.catch(()=>toast('O navegador não permitiu a tela cheia aqui.','warn'));}}catch(e){toast('O navegador não permitiu a tela cheia aqui.','warn');}}
function atualizarTelaCheia(){for(const id of['pFull','btnFull']){const b=$(id);b.hidden=!fsOK;b.textContent=telaCheiaOn()?'Sair da tela cheia':'Tela cheia';}}
let dicaTimer=0;
function mostrarDicaToque(){const z=$('zoneHint');if(IN.mode!=='touch'){z.hidden=true;return;}z.hidden=false;clearTimeout(dicaTimer);dicaTimer=setTimeout(()=>{z.hidden=true;},14000);}
function aoMudarEntrada(){if(G.mode==='paused'||G.mode==='menu')atualizarInicio();if(IN.mode!=='touch')$('zoneHint').hidden=true;}
function ligarBotoes(){
  $('btnContinue').onclick=()=>iniciarJogo(lerSave()?'continuar':'migrar');
  /* novo jogo: primeiro a história (pulável); nos testes automáticos ela só aparece com #vt-historia */
  const novo=()=>{if(window.__vt&&location.hash.indexOf('historia')<0)iniciarJogo('novo');else abrirHistoria(()=>iniciarJogo('novo'));};
  $('btnNew').onclick=()=>{if(lerSave())confirmar('Começar de novo?','Isso apaga o progresso da versão 2D (o save do jogo 3D não é tocado).','Apagar e começar',novo);else novo();};
  $('btnHistoria').onclick=()=>abrirHistoria(()=>{mostrarTela('scStart');focoPrimeiro('scStart');},'Fechar');
  $('pResume').onclick=retomar;$('pFull').onclick=alternarTelaCheia;$('btnFull').onclick=alternarTelaCheia;
  $('btnGuiaIni').onclick=()=>abrirGuia();$('pGuiaPausa').onclick=()=>abrirGuia();$('gFechar').onclick=fecharGuia;
  $('pSound').onclick=()=>{auInit();auSetOn(!AU.on);cfgGravar({sound:AU.on});$('pSound').textContent=AU.on?TXT.soundOn:TXT.soundOff;};
  $('pMus').oninput=e=>{auInit();auVolumes(e.target.value/100,null);cfgGravar({mus:AU.volMus});};
  $('pEfx').oninput=e=>{auInit();auVolumes(null,e.target.value/100);cfgGravar({efx:AU.volEfx});SFX.click();};
  $('pDiary').onclick=()=>{esconderTelas();G.mode='play';abrirDiario();};
  $('pRelat').onclick=()=>{esconderTelas();G.mode='play';abrirDiario('relatorio');};
  $('pErase').onclick=()=>confirmar('Apagar o progresso?','Isso apaga o progresso da versão 2D: relíquias, saberes, programas, diário e segredos. O save do jogo 3D não é tocado.','Apagar',()=>{lsDel(SAVE2D_KEY);iniciarJogo('novo');});
  $('pHome').onclick=irMenu;
  $('cfYes').onclick=()=>{const a=acaoConfirma;acaoConfirma=null;esconderTelas();if(a)a();};
  $('cfNo').onclick=()=>{acaoConfirma=null;if(G.modoConfirma==='menu')mostrarTela('scStart');else if(G.modoConfirma==='paused')mostrarTela('scPause');else{esconderTelas();if(G.mode!=='painel')G.mode=G.modoConfirma||'play';}};
  $('dFechar').onclick=fecharDiario;for(const b of document.querySelectorAll('.aba'))b.onclick=()=>mostrarAba(b.dataset.aba);
  $('fimOk').onclick=()=>{esconderTelas();G.mode='play';};
  /* voltar de outro aplicativo: ao sair, o jogo pausa, salva e silencia; ao voltar, espera na pausa e o som retoma */
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(G.mode==='play')pausar();if(G.mode!=='menu')salvar(false);limparEntrada();if(AU.ctx&&AU.ctx.state==='running')try{AU.ctx.suspend();}catch(e){}}
    else if(AU.ctx&&AU.on&&AU.ctx.state==='suspended')try{AU.ctx.resume();}catch(e){}});
  /* teclado virtual: quando a parte visível encolhe (o navegador não redimensiona a página), o painel sobe junto */
  if(window.visualViewport){const vv=window.visualViewport,aj=()=>{const kb=Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop));
    document.documentElement.style.setProperty('--kb',kb+'px');document.body.classList.toggle('teclado',kb>80);if(kb>80&&PAINEL.aberto){atualizarVista();const a=document.activeElement;if(a&&a.id==='pTxt')aVista(a);}};
    vv.addEventListener('resize',aj);vv.addEventListener('scroll',aj);}
  document.addEventListener('fullscreenchange',atualizarTelaCheia);document.addEventListener('webkitfullscreenchange',atualizarTelaCheia);
}

/* ====================== laço principal ====================== */
let ultimo=0,acSalvar=0;
function quadro(now){
  requestAnimationFrame(quadro);
  const dt=Math.min(0.05,Math.max(0,(now-ultimo)/1000)||0.016);ultimo=now;
  try{passoJogo(dt,now);desenharJogo();}catch(e){console.error(e);}
}
/* sem progresso: se o objetivo fica igual por muito tempo andando pelo jogo, um lembrete gentil diz onde olhar
   (o objetivo, a bússola, o ◆ do terminal, o Lume) sem resolver nada. No máximo dois por objetivo. */
const SEMPROG={gk:'',t:0,n:0,primeiro:150,depois:240};
function ajudaSemProgresso(dt){
  const go=objetivo();if(!go)return;const gk=go.t+'|'+go.s+'|'+(G.area&&G.area.id);
  if(gk!==SEMPROG.gk){SEMPROG.gk=gk;SEMPROG.t=0;SEMPROG.n=0;return;}
  SEMPROG.t+=dt;if(SEMPROG.n>=2||SEMPROG.t<(SEMPROG.n?SEMPROG.depois:SEMPROG.primeiro))return;
  SEMPROG.t=0;SEMPROG.n++;
  const naTumba=G.area&&G.area.id!=='vale';
  toast(SEMPROG.n===1?'Sem rumo? O objetivo, no alto, diz o próximo passo: '+go.s+(go.alvo?' A seta no título aponta para lá.':'')
    :naTumba?'Os desafios desta tumba ficam no terminal: chegue perto do marcador ◆ e use AÇÃO. As placas com ! guardam pistas, e o 📖 Guia explica cada comando.'
    :'Siga a trilha colorida que sai da estrada até a tumba da vez. No acampamento, o Lume ajuda; no 📖 Guia, "Objetivo, bússola e atalhos" explica a navegação.');
}
function passoJogo(dt,now){
  lerControle();
  G.t+=dt;R.treme=Math.max(0,R.treme-dt*2);
  const A=G.area;
  if(G.mode==='play'){
    ajudaSemProgresso(dt);
    if(take('pausa')){pausar();return;}
    if(take('diario')){abrirDiario();return;}
    if(take('mapa')){abrirDiario('mapa');return;}
    if(take('guia')){abrirGuia();return;}
    if(take('vista'))comoAcao(alternarVista);
    if(take('lanterna')&&A.id!=='vale'&&A.id!=='final'&&A.id!=='camara')comoAcao(()=>{G.lanternOn=!G.lanternOn;SFX.click();toast(G.lanternOn?'Lanterna acesa: perto das paredes, ela revela marcas de luz.':'Lanterna apagada.');});
    if(A.id==='vale'){G.time=(G.time+dt/DAY_LEN)%1;const n=noiteAgora();if(n>0.6&&!G.nightSeen){G.nightSeen=true;toast(TXT.nightHint);addDiary('night',true);}}
    if(G.invuln>0)G.invuln-=dt;
    if(G.danoT>0)G.danoT-=dt;
    atualizarJogador(dt);
    procurarInteracao();
    if(take('usar')&&alvoInter){G.p.usar=HEROI_CONFIG.animacoes.usar.duracao;SFX.use();const it=alvoInter.it;comoAcao(()=>it.use());}
    acSalvar+=dt;if(acSalvar>20&&A.id==='vale'){acSalvar=0;salvar(false);}
  }else if(G.mode==='diario'){if(take('pausa')||take('diario'))fecharDiario();}
  else if(G.mode==='paused'){if(take('pausa'))retomar();}
  else if(G.mode==='painel'){painelPasso(dt);if(take('pausa'))fecharPainel();else if(take('guia'))abrirGuia(topicoGuia(PAINEL.cfg));}
  else if(G.mode==='guia'){if(take('pausa')||take('guia'))fecharGuia();}
  else if(G.mode==='dialogo'){if(take('pausa'))fecharFala();}
  IN.fila.delete('usar');IN.fila.delete('lanterna');IN.fila.delete('mapa');IN.fila.delete('vista');IN.fila.delete('guia');
  if(A){if(A.update)A.update(dt,G.t);atualizarGuardas(dt);}
  atualizarParticulas(dt);
  toastTick(now);
  if(G.mode!=='menu')atualizarHud();
  auUpdate(dt,A&&!areaExterna(A),A?noiteAgora()>0.5:false,G.mode);
}
function atualizarGuardas(dt){const A=G.area;if(!A.ents)return;for(const e of A.ents)if(e.update)e.update(dt,G.mode==='play');}
function desenharJogo(){
  const A=G.area;if(!A){R.g.fillStyle='#000';R.g.fillRect(0,0,R.cv.width,R.cv.height);return;}
  if(G.mode==='painel'&&PAINEL.foco){const f=focoCamPainel(A);camSeguir(f.x,f.y,1/60,A);}else camSeguir(G.p.x,G.p.y-12,1/60,A);
  camPixel();
  desenharChao(A);desenharAgua(A,G.t);
  if(A.desenharChao)A.desenharChao(R.lg,G.t);
  for(const o of A.objs){
    if(!o.on||!naTela(o.x,o.y-o.ay/2,Math.max(o.img.width,o.img.height)))continue;
    enfileirar(o.y+(o.camada||0),g=>{
      if(o.sombra)sombra(g,o.x,o.y,o.sombra[0],o.sombra[1],o.sombra[2]);
      if(o.desenho){o.desenho(g,o,G.t);return;}
      let img=o.img;if(o.frames)img=o.frames[Math.floor(G.t*o.fps)%o.frames.length];
      blit(g,img,o.x,o.y,o.ax,o.ay,o.alfa);
      if(o.brilha&&A.id==='vale'){const a=0.35+0.3*Math.sin(G.t*2.4+o.x);if(Math.floor(G.t*3+o.x)%5===0){g.fillStyle=o.brilha;g.globalAlpha=a;g.fillRect(Math.round(o.x+R.ox+Math.sin(G.t*3+o.y)*5),Math.round(o.y-o.ay-3+R.oy),1,1);g.globalAlpha=1;}}
    });
  }
  if(A.ents)for(const e of A.ents)if(e.desenhar)e.desenhar();
  if(A.id==='vale'||A.mostraJogador!==false)desenharJogador();
  desenharFila();
  desenharEncobertos(A);
  desenharParticulas();
  if(A.desenharTopo)A.desenharTopo(R.lg,G.t);
  /* luz */
  const p=G.p;
  if(A.id==='vale'){
    const n=noiteAgora();
    for(const o of VALE.fogo)luz(o.x,o.y-6,46+Math.sin(G.t*9)*2,1,'#ff9a40');
    for(const o of A.objs)if(o.luz&&(!o.luzSe||o.luzSe())&&naTela(o.x,o.y,80))luz(o.x,o.y+(o.luz.dy||0),o.luz.r,0.9,o.luz.cor);
    for(const v of VALE.insc)if(n>0.5)luz(v.o.x,v.o.y-12,18,1,'#ffb455');
    for(const f of VALE.feixes)luz(f.x,f.y,22,0.8,f.k==='final'?'#ffd24a':TOMBS[f.k].col);
    luz(p.x,p.y-14,34,0.8);
    if(n>0.01)desenharLuz(n*0.62,'rgb(10,16,52)');else LUZES.length=0;
    tintaDia(R.lg,n,tardeAgora());
  }else{
    if(G.mode!=='painel'||!PAINEL.foco)luz(p.x,p.y-14,G.lanternOn?84:28,1,G.lanternOn?'#ffe6b0':null);
    if(A.luzes)A.luzes(G.t);
    /* com o painel aberto, a sala clareia: o mecanismo precisa ser lido */
    desenharLuz(G.mode==='painel'?Math.min(A.escuro,0.42):A.escuro,A.tinta);
  }
  desenharFocoEvento(A);desenharPistas(A);desenharMarcas(A);
  if(A.desenharUi)A.desenharUi(R.lg,G.t);
  desenharSetaObjetivo();
  if(alvoInter&&G.mode==='play'){const it=alvoInter.it,y=Math.round(it.y-(it.alto||26)+R.oy+Math.sin(G.t*6)*1.5);R.lg.drawImage(SPR.get('seta','#ffd24a'),Math.round(it.x+R.ox-3),y);}
  apresentar();
  atualizarMarcas();
}
/* durante a execução, um anel pulsante marca o mecanismo que a instrução da vez mexeu (vermelho quando deu erro) */
function desenharFocoEvento(A){
  if(G.mode!=='painel'||!A.focoEvento||!PAINEL.cfg)return;
  const r=PAINEL.run,ev=r?r.ev:(PAINEL.parado?PAINEL.parado.ev:null);if(!ev)return;
  const v=painelVis();if(!v)return;const p=A.focoEvento(ev,v.ws,v.cfg);if(!p)return;
  const x=Math.round(p.x+R.ox),y=Math.round(p.y+R.oy),k=Math.floor(G.t*5)%2,cor=ev.tipo==='erro'?'#ff6a4a':'#ffd24a',g=R.lg;
  P.anel(g,x,y+8,7+k,1,'#0b0705');P.anel(g,x,y+8,6+k,1,cor);
  g.fillStyle='#0b0705';g.fillRect(x-3,y-6-k,7,2);g.fillRect(x-2,y-4-k,5,2);g.fillRect(x-1,y-2-k,3,2);
  g.fillStyle=cor;g.fillRect(x-2,y-6-k,5,1);g.fillRect(x-1,y-4-k,3,1);g.fillRect(x,y-2-k,1,1);
  R.focoEvento={x:p.x,y:p.y,erro:ev.tipo==='erro'};
}
/* contorno de 1 px por fora de um sprite (para mostrar o que está encoberto); calculado uma vez por sprite e cor */
const CONTORNOS=new WeakMap();
function contornoDe(img,cor){
  let m=CONTORNOS.get(img);if(!m){m={};CONTORNOS.set(img,m);}if(m[cor])return m[cor];
  const w=img.width,h=img.height,a=img.getContext('2d').getImageData(0,0,w,h).data,c=cnv(w+2,h+2),g=ctx2(c);g.fillStyle=cor;
  const cheio=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&a[(y*w+x)*4+3]>40;
  for(let y=-1;y<=h;y++)for(let x=-1;x<=w;x++)if(!cheio(x,y)&&(cheio(x-1,y)||cheio(x+1,y)||cheio(x,y-1)||cheio(x,y+1)))g.fillRect(x+1,y+1,1,1);
  return(m[cor]=c);
}
/* o explorador encobre um obstáculo (que fica atrás dele): o contorno do obstáculo aparece por cima;
   o explorador está atrás de um objeto alto: o contorno dele aparece por cima do objeto */
function desenharEncobertos(A){
  const p=G.p;R.encobertos={obj:0,heroi:false};if(p.caindo>0||G.mode!=='play')return;
  const hx0=p.x-11,hx1=p.x+11,hy0=p.y-40,hy1=p.y,g=R.lg;let atras=false;R.encobertos={obj:0,heroi:false};
  for(const o of A.objs){
    if(!o.on||!o.box||!o.box.on||!o.img)continue;
    const x0=o.x-o.ax,y0=o.y-o.ay,ix=Math.min(hx1,x0+o.img.width)-Math.max(hx0,x0),iy=Math.min(hy1,y0+o.img.height)-Math.max(hy0,y0);
    if(ix<=0||iy<=0)continue;
    if(o.y+(o.camada||0)<=p.y){if(ix*iy>=o.img.width*o.img.height*0.25){
      const img=o.frames?o.frames[Math.floor(G.t*o.fps)%o.frames.length]:o.img,px=Math.round(x0+R.ox),py=Math.round(y0+R.oy);
      g.globalAlpha=0.5;g.drawImage(img,px,py);g.globalAlpha=0.9;g.drawImage(contornoDe(o.img,'#7ff0ff'),px-1,py-1);g.globalAlpha=1;R.encobertos.obj++;}}
    else if(ix*iy>=260)atras=true;
  }
  if(atras){R.encobertos.heroi=true;const img=frameJogador();g.globalAlpha=0.8;g.drawImage(contornoDe(img,'#ffd24a'),Math.round(p.x-HEROI.ax+R.ox)-1,Math.round(p.y-HEROI.ay+R.oy)-1);g.globalAlpha=1;}
}
/* marcador do alvo da etapa e nome do objeto ao alcance (DOM, por cima do canvas, com texto legível e acentos) */
const nomeDe=(it,lb)=>{const n=typeof it.nome==='function'?it.nome():it.nome;if(n)return n;const i=lb?lb.indexOf(': '):-1;return i>0?lb.slice(i+2):null;};
function atualizarMarcas(){
  const m=$('marcaAlvo'),n=$('nomeObj');
  if(G.mode!=='play'||!G.area){m.hidden=true;n.hidden=true;return;}
  /* a etiqueta não passa da borda da tela (o centro é preso a meia largura dela) */
  const k=R.k/R.dpr,pos=(el,x,y)=>{const w=(el._w||0)/2+4;el.style.left=Math.round(clamp((x+R.ox)*k,w,Math.max(w,innerWidth-w)))+'px';el.style.top=Math.round((y+R.oy)*k)+'px';};
  const ok=(x,y)=>x+R.ox>4&&x+R.ox<R.W-4&&y+R.oy>10&&y+R.oy<R.H-4;
  const it=alvoInter&&alvoInter.it,nome=it?nomeDe(it,alvoInter.lb):null;
  const go=objetivo(),a=go&&go.alvo&&go.alvo.txt?go.alvo:null;
  const mesmo=a&&it&&Math.hypot(it.x-a.x,it.y-a.y)<64;
  if(nome){const y=it.y-(it.alto||26)-4;n.hidden=false;if(n.textContent!==nome||!n._w){n.textContent=nome;n._w=n.offsetWidth;}n.classList.toggle('alvo',!!mesmo);pos(n,it.x,y);}else n.hidden=true;
  if(a&&!mesmo&&ok(a.x,a.y)){m.hidden=false;if(m.textContent!==a.txt||!m._w){m.textContent=a.txt;m._w=m.offsetWidth;}pos(m,a.x,a.y+Math.round(Math.sin(G.t*4)*1.5));}else m.hidden=true;
}
/* seta na borda da tela apontando para o objetivo (só no vale e quando ele está fora da tela) */
function desenharSetaObjetivo(){
  if(G.mode!=='play'||!G.area||G.area.id!=='vale')return;const go=objetivo();if(!go||!go.alvo)return;
  const x=go.alvo.x+R.ox,y=go.alvo.y+R.oy;if(x>8&&y>8&&x<R.W-8&&y<R.H-8)return;
  const cx=R.W/2,cy=R.H/2,dx=x-cx,dy=y-cy,a=Math.atan2(dy,dx),m=14;
  const k=Math.min((R.W/2-m)/Math.abs(Math.cos(a)||1e-6),(R.H/2-m)/Math.abs(Math.sin(a)||1e-6));
  const px=Math.round(cx+Math.cos(a)*k),py=Math.round(cy+Math.sin(a)*k),g=R.lg;
  const pul=Math.floor(G.t*4)%2;
  g.fillStyle='#0b0705';P.circ(g,px,py,6+pul,'#0b0705');P.circ(g,px,py,5+pul,go.cor||'#ffd24a');
  g.fillStyle='#0b0705';for(let i=1;i<=4;i++){g.fillRect(Math.round(px+Math.cos(a)*(i+1))-1,Math.round(py+Math.sin(a)*(i+1))-1,2,2);}
}

/* ====================== início ====================== */
function boot(){
  try{const c=cfgLer();if(typeof c.sound==='boolean')AU.on=c.sound;R.longe=c.longe!==false;auVolumes(typeof c.mus==='number'?c.mus:null,typeof c.efx==='number'?c.efx:null);}catch(e){}
  renderInit();joyInit();EXP=montarHeroi();hudInit();ligarBotoes();painelInit();
  AREAS.vale=construirVale();
  desenharLogo();
  G.area=AREAS.vale;posicionar(AREAS.vale.spawn.x,AREAS.vale.spawn.y-40,'cima');camSeguir(G.p.x,G.p.y,0,G.area,true);
  atualizarInicio();mostrarTela('scStart');focoPrimeiro('scStart');
  $('boot').hidden=true;
  /* o gancho de teste só existe na compilação de testes (build/teste/); a versão pública não o contém */
  if(typeof ganchoTeste==='function'&&location.hash.indexOf('vt')>=0)ganchoTeste();
  requestAnimationFrame(t=>{ultimo=t;requestAnimationFrame(quadro);});
}
function desenharLogo(){
  const c=$('logo'),g=ctx2(c);g.clearRect(0,0,c.width,c.height);
  const t1='VALE DAS TUMBAS',w=FONTE.larg(t1);
  g.save();g.scale(3,3);const x=Math.round((70-w)/2);
  for(const[dx,dy]of[[1,1],[0,1],[1,0]])FONTE.texto(g,t1,x+dx,3+dy,'#24160d');FONTE.texto(g,t1,x,3,'#d8a24a');g.restore();
  g.drawImage(EXP.direita.parado[0],85,21);
  ['#c8743a','#6fd3ff','#5dff7a','#b98cff'].forEach((c2,i)=>P.r(g,40+i*34,69,20,3,c2));
  const t2='pixel art e lógica de programação',w2=FONTE.larg(t2);FONTE.texto(g,t2,Math.round((210-w2)/2),78,'#bfa97a');
}
