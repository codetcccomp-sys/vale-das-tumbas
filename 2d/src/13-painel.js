/* ====================== painel de programação ======================
   O mesmo painel em todas as tumbas, liberando recursos aos poucos: placas de comando e de estrutura (GUARDAR, SE, REPETIR,
   ENQUANTO), contêineres e sensores, situações de teste, dicas graduais e exemplos.
   - Edição só por toques: tocar numa placa da paleta insere no cursor (▸); tocar numa linha seleciona e abre o editor
     dela (↑ ↓ remover, valores, condição, número de voltas). Nada precisa ser arrastado.
   - Executar e Passo a passo chamam o mesmo LANG.passo(); só existe uma execução por vez (PAINEL.run).
   - Enquanto o painel está aberto, a exploração fica pausada (perigos, guardiões e lanterna param) e a câmera mostra o
     mecanismo da sala. Ao fechar, a execução para, o programa fica guardado e os controles voltam ao normal. */
const PAINEL={aberto:false,tumba:null,cfg:null,prog:[],cur:{pai:null,ramo:null,i:0},sel:null,sit:0,run:null,vel:1,passou:{},falhou:{},dicas:{},
  demoVisto:{},classOk:{},classSel:null,foco:null,area:null,msg:'',msgTipo:'',ultimoEv:null,parado:null};
const VEL=[1,2,0.5];
function painelInit(){
  $('pFechar').onclick=()=>fecharPainel();
  $('pRun').onclick=()=>painelExecutar();$('pStep').onclick=()=>painelPassoBtn();$('pStop').onclick=()=>painelParar(true);
  $('pReset').onclick=()=>painelReiniciar();$('pClear').onclick=()=>painelLimpar();$('pDica').onclick=()=>painelDica();$('pEx').onclick=()=>painelExemplos();
  $('pVel').onclick=()=>{const i=(VEL.indexOf(PAINEL.vel)+1)%VEL.length;PAINEL.vel=VEL[i];$('pVel').textContent=(PAINEL.vel===0.5?'½':PAINEL.vel)+'×';};
  $('pProg').addEventListener('click',e=>{const li=e.target.closest('.ln');if(!li){if(!PAINEL.run)painelCursor({pai:null,ramo:null,i:PAINEL.prog.length});return;}painelTocarLinha(li);});
  addEventListener('resize',()=>{if(PAINEL.aberto)atualizarVista();});
}
const mundoAtual=()=>MUNDOS[PAINEL.cfg.mundo];
const sitAtual=()=>PAINEL.cfg.situacoes[PAINEL.sit]||PAINEL.cfg.situacoes[0]||{};
function desafioDisponivel(cfg){const l=desafiosDa(cfg.tumba),i=l.indexOf(cfg);return i===0||!!G.learn[l[i-1].id];}

/* ---------- abrir e fechar ---------- */
function abrirPainel(tumba,area,foco){
  if(G.mode!=='play')return;
  PAINEL.aberto=true;PAINEL.tumba=tumba;PAINEL.area=area;PAINEL.foco=foco;
  G.mode='painel';limparEntrada();document.body.classList.add('painel');$('painel').hidden=false;$('prompt').hidden=true;
  const l=desafiosDa(tumba);const cfg=l.find(d=>!G.learn[d.id])||l[l.length-1];
  escolherDesafio(cfg,true);atualizarVista();SFX.lever();
}
function fecharPainel(silencio){
  if(!PAINEL.aberto)return;
  painelParar(false);guardarPrograma();
  PAINEL.aberto=false;$('painel').hidden=true;document.body.classList.remove('painel');R.vista=null;PAINEL.foco=null;
  if(G.mode==='painel')G.mode='play';limparEntrada();
  if(!silencio)salvar(false);
}
function atualizarVista(){
  const r=$('painel').getBoundingClientRect();
  if(r.top>40)R.vista={x:0,y:0,w:innerWidth*R.dpr,h:r.top*R.dpr};else R.vista={x:0,y:0,w:r.left*R.dpr,h:innerHeight*R.dpr};
}
function guardarPrograma(){const c=PAINEL.cfg;if(c&&c.etapa!=='demo'&&c.etapa!=='classificar')G.progs[c.id]=LANG.clonar(PAINEL.prog);}
function escolherDesafio(cfg,primeiro){
  painelParar(false);guardarPrograma();
  PAINEL.cfg=cfg;PAINEL.sit=0;PAINEL.sel=null;PAINEL.parado=null;PAINEL.ultimoEv=null;PAINEL.classSel=null;
  if(cfg.etapa==='demo'){PAINEL.prog=LANG.clonar(cfg.demo[0].prog);PAINEL.demoIdx=0;}
  else if(cfg.etapa==='classificar'){PAINEL.prog=[];PAINEL.classOk=PAINEL.classOk||{};}
  else{const p=G.progs[cfg.id];PAINEL.prog=p?LANG.limpar(p,cfg).prog:[];}
  PAINEL.cur={pai:null,ramo:null,i:PAINEL.prog.length};
  if(!PAINEL.passou[cfg.id])PAINEL.passou[cfg.id]={};if(!PAINEL.falhou[cfg.id])PAINEL.falhou[cfg.id]={};
  if(PAINEL.area&&PAINEL.area.aoEscolher)PAINEL.area.aoEscolher(cfg);
  mensagemInicial();renderPainel();
}
function mensagemInicial(){
  const c=PAINEL.cfg;let t=c.intro.join(' ');
  if(G.learn[c.id]&&c.etapa!=='demo')t='Etapa concluída. Você pode testar de novo ou voltar às outras. '+t;
  const g=c.etapa==='guiada'?guiaDe(c,PAINEL.prog):null;
  if(g&&!G.learn[c.id])t=t+' → '+g.texto;
  painelMsg(t,'');
}
function painelMsg(t,tipo){PAINEL.msg=t;PAINEL.msgTipo=tipo||'';const m=$('pMsg');m.textContent=t;m.className=tipo||'';m.scrollTop=0;}

/* ---------- desenho do painel ---------- */
function renderPainel(){
  const c=PAINEL.cfg,rodando=!!PAINEL.run&&!PAINEL.run.s.fim;
  $('pTitulo').textContent=c.titulo;$('pEtapa').textContent=TOMBS[c.tumba].name+' · '+ETAPA_NOME[c.etapa];
  /* etapas da tumba */
  const E=$('pEtapas');E.textContent='';
  desafiosDa(c.tumba).forEach((d,i)=>{const b=document.createElement('button');b.className='etp'+(G.learn[d.id]?' ok':'')+(d===c?' atual':'');
    b.textContent=(G.learn[d.id]?'✔ ':desafioDisponivel(d)?'▶ ':'🔒 ')+(i+1)+' '+ETAPA_NOME[d.etapa];b.disabled=!desafioDisponivel(d)||rodando;
    b.onclick=()=>{if(d!==PAINEL.cfg)escolherDesafio(d);};E.appendChild(b);});
  const at=E.querySelector('.atual');if(at)try{at.scrollIntoView({block:'nearest',inline:'nearest'});}catch(e){}
  /* situações */
  const S=$('pSits');S.textContent='';S.hidden=c.situacoes.length<2;
  c.situacoes.forEach((s,i)=>{const b=document.createElement('button');const pa=PAINEL.passou[c.id][s.id]===LANG.assinatura(PAINEL.prog),fa=PAINEL.falhou[c.id][s.id]===LANG.assinatura(PAINEL.prog);
    b.className='sit'+(i===PAINEL.sit?' atual':'')+(c.etapa!=='demo'&&pa?' ok':'')+(c.etapa!=='demo'&&!pa&&fa?' erro':'');b.textContent=s.nome;b.disabled=rodando;
    b.onclick=()=>{if(i!==PAINEL.sit){painelParar(false);PAINEL.sit=i;PAINEL.parado=null;PAINEL.ultimoEv=null;renderPainel();}};S.appendChild(b);});
  renderVars();
  const classe=c.etapa==='classificar';
  $('pCorpo').hidden=classe;$('pClass').hidden=!classe;
  if(classe)renderClassificar();else{renderPrograma();renderEditor();}
  renderPaleta();
  /* controles */
  const demo=c.etapa==='demo';
  $('pRun').hidden=classe;$('pStep').hidden=classe;$('pStop').hidden=classe;$('pReset').hidden=classe;$('pVel').hidden=classe;
  $('pClear').hidden=demo||classe;$('pDica').hidden=demo||!c.dicas;$('pEx').hidden=false;
  $('pRun').disabled=rodando&&PAINEL.run.modo==='exec';$('pStep').disabled=rodando&&PAINEL.run.modo==='exec';$('pStop').disabled=!rodando;
  $('pReset').disabled=!PAINEL.run&&!PAINEL.parado;$('pClear').disabled=rodando||!PAINEL.prog.length;
  if(c.dicas){const n=PAINEL.dicas[c.id]||0;$('pDica').textContent='? Dica '+Math.min(n+1,c.dicas.length)+'/'+c.dicas.length;}
  $('pRun').textContent=rodando&&PAINEL.run.modo==='passo'?'▶ Continuar':'▶ Executar';
}
function renderVars(){
  const c=PAINEL.cfg,V=$('pVars');V.textContent='';
  const env=PAINEL.run?PAINEL.run.s.env:PAINEL.parado?PAINEL.parado.env:null;
  const ini=env||LANG.iniciar(c,mundoAtual(),sitAtual(),[]).env;
  const lista=(c.vars||[]).map(d=>({d,sensor:false})).concat((c.sensores||[]).map(d=>({d,sensor:true})));
  V.hidden=!lista.length;
  for(const{d,sensor}of lista){const e=ini[d.nome],v=e?e.val:null;const el=document.createElement('div');el.className='var'+(v===null?' vazio':'')+(sensor?' sensor':'');
    const unid=d.unid&&v?' '+d.unid:'';
    el.innerHTML='<span class="tp"></span><span class="nm"></span><span class="vl"></span>';el.children[0].textContent=(sensor?'sensor · ':'')+LANG.TIPOS[d.t].nome+' ('+LANG.TIPOS[d.t].py+')';
    el.children[1].textContent=d.nome;el.children[2].textContent=v===null?'vazio':LANG.fmt(v)+unid;
    if(PAINEL.ultimoEv&&PAINEL.ultimoEv.tipo==='set'&&PAINEL.ultimoEv.nome===d.nome)el.classList.add('mudou');
    V.appendChild(el);}
}
/* linhas do programa com o cursor de inserção */
function renderPrograma(){
  const c=PAINEL.cfg,ol=$('pProg');ol.textContent='';
  const rodando=PAINEL.run&&!PAINEL.run.s.fim,demo=c.etapa==='demo';
  const atual=PAINEL.run?PAINEL.run.linha:null,erro=(PAINEL.run&&PAINEL.run.s.erro&&PAINEL.run.s.erro.linha)||(PAINEL.parado&&PAINEL.parado.erroLinha);
  const conts={};if(PAINEL.run)for(const k of LANG.contadores(PAINEL.run.s))conts[k.id]=k;
  const cur=PAINEL.cur;let curPosto=false;
  const linhaCur=nv=>{if(demo||rodando)return;const li=document.createElement('li');li.className='ln cur';li.style.paddingLeft=(nv*18)+'px';li.textContent='▸ a próxima placa entra aqui';li.dataset.cursor='1';ol.appendChild(li);curPosto=true;};
  const ehCur=(pai,ramo,i)=>!curPosto&&(cur.pai===(pai?pai.id:null))&&((cur.ramo||null)===(ramo||null))&&cur.i===i;
  const add=(L,txt,sim,estr)=>{
    const li=document.createElement('li');li.className='ln'+(estr?' estr':'');li.style.paddingLeft=(L.nv*18)+'px';
    li.dataset.id=L.no.id;li.dataset.tipo=L.tipo;
    const s=document.createElement('span');s.className='sim';s.textContent=sim;li.appendChild(s);
    const tx=document.createElement('span');tx.textContent=txt;if(/\?/.test(txt)&&L.tipo==='no')tx.className='inc';li.appendChild(tx);
    if(L.tipo==='no'&&L.no.id===PAINEL.sel&&!rodando)li.classList.add('sel');
    if(L.tipo==='no'&&L.no.id===atual)li.classList.add('atual');
    if(L.tipo==='no'&&L.no.id===erro)li.classList.add('erro');
    if(L.tipo==='no'&&conts[L.no.id]){const b=document.createElement('span');b.className='cont';const k=conts[L.no.id];b.textContent=k.k==='rep'?'volta '+k.volta+'/'+k.n:'volta '+k.volta;li.appendChild(b);}
    ol.appendChild(li);return li;
  };
  (function w(l,nv,pai,ramo){
    l.forEach((n,i)=>{
      if(ehCur(pai,ramo,i))linhaCur(nv);
      const info=n.k==='cmd'?LANG.CMD[n.cmd]:n.k==='set'?BLOCO_INFO.set:n.k==='se'?BLOCO_INFO[n.senao?'sese':'se']:BLOCO_INFO[n.k];
      add({tipo:'no',no:n,nv},LANG.fmtNo(n),info?info.sim:'',n.k!=='cmd');
      if(n.k==='se'){w(n.entao,nv+1,n,'entao');if(n.senao){add({tipo:'senao',no:n,nv},'SENÃO','◈',true);w(n.senao,nv+1,n,'senao');}add({tipo:'fim',no:n,nv},'FIM SE','',true);}
      else if(n.k==='rep'||n.k==='enq'){w(n.corpo,nv+1,n,'corpo');add({tipo:'fim',no:n,nv},n.k==='rep'?'FIM REPETIR':'FIM ENQUANTO','',true);}
    });
    if(ehCur(pai,ramo,l.length))linhaCur(nv);
  })(PAINEL.prog,0,null,null);
  if(!PAINEL.prog.length&&!curPosto&&!demo)linhaCur(0);
  const el=ol.querySelector('.ln.atual,.ln.erro,.ln.sel,.ln.cur');if(el)try{el.scrollIntoView({block:'nearest'});}catch(e){}
}
/* toque numa linha: seleciona e coloca o cursor logo depois (num bloco, dentro dele) */
function painelTocarLinha(li){
  if(PAINEL.run&&!PAINEL.run.s.fim)return;if(PAINEL.cfg.etapa==='demo'||li.dataset.cursor)return;
  const id=+li.dataset.id,tipo=li.dataset.tipo,a=LANG.achar(PAINEL.prog,id);if(!a)return;
  if(tipo==='no'){PAINEL.sel=id;PAINEL.cur=a.no.k==='cmd'||a.no.k==='set'?{pai:a.pai?a.pai.id:null,ramo:a.ramo,i:a.i+1}:{pai:id,ramo:a.no.k==='se'?'entao':'corpo',i:0};}
  else if(tipo==='senao'){PAINEL.sel=null;PAINEL.cur={pai:id,ramo:'senao',i:0};}
  else{PAINEL.sel=null;PAINEL.cur={pai:a.pai?a.pai.id:null,ramo:a.ramo,i:a.i+1};}
  SFX.click();painelSoltar();renderPainel();
}
function painelCursor(c){PAINEL.cur=c;PAINEL.sel=null;renderPainel();}
/* depois de editar: a execução anterior deixa de valer para a tela */
function painelSoltar(){if(PAINEL.run&&PAINEL.run.s.fim){PAINEL.run=null;}PAINEL.parado=null;PAINEL.ultimoEv=null;}
function programaMudou(){painelSoltar();guardarPrograma();const c=PAINEL.cfg;const g=c.etapa==='guiada'&&!G.learn[c.id]?guiaDe(c,PAINEL.prog):null;if(g)painelMsg(g.texto,'');}

/* ---------- editor da linha selecionada ---------- */
function chip(txt,on,fn,cls,img){const b=document.createElement('button');b.className='ch'+(on?' on':'')+(cls?' '+cls:'');if(img){const im=document.createElement('img');im.className='px';im.src=img;b.appendChild(im);}b.appendChild(document.createTextNode(txt));b.onclick=fn;return b;}
const ICONE={};function iconeObj(o){if(!ICONE[o.id])ICONE[o.id]=escalar(SPR.get('valor',o.icone),2).toDataURL();return ICONE[o.id];}
function renderEditor(){
  const E=$('pEdit'),c=PAINEL.cfg;E.textContent='';
  const a=PAINEL.sel?LANG.achar(PAINEL.prog,PAINEL.sel):null;
  if(!a||c.etapa==='demo'||(PAINEL.run&&!PAINEL.run.s.fim)){E.hidden=true;return;}
  E.hidden=false;const n=a.no,num=LANG.numeroLinha(PAINEL.prog,n.id);
  const lbl=document.createElement('div');lbl.className='lbl';lbl.textContent='Linha '+num+': '+LANG.fmtNo(n);E.appendChild(lbl);
  const mv=d=>()=>{if(LANG.mover(PAINEL.prog,n.id,d,{prof:LANG.LIM.prof})){SFX.placa();PAINEL.cur={pai:null,ramo:null,i:PAINEL.prog.length};programaMudou();renderPainel();}};
  E.appendChild(chip('↑ Subir',false,mv(-1),'op'));E.appendChild(chip('↓ Descer',false,mv(1),'op'));
  E.appendChild(chip('✕ Remover',false,()=>{const cur=LANG.remover(PAINEL.prog,n.id);PAINEL.sel=null;if(cur)PAINEL.cur=cur;SFX.tira();programaMudou();renderPainel();},'op'));
  const sep=t=>{const d=document.createElement('div');d.className='lbl';d.textContent=t;E.appendChild(d);};
  const objs=opcoesValor(c);
  if(n.k==='set'){
    sep('Contêiner:');for(const v of c.vars||[])E.appendChild(chip(v.nome,n.nome===v.nome,()=>{n.nome=v.nome;if(n.expr&&n.expr.k==='lit'&&LANG.compativel(v.t,n.expr.val)){n.expr=null;}programaMudou();renderPainel();}));
    const tipo=(c.vars.find(v=>v.nome===n.nome)||{}).t;
    sep('Valor guardado (objetos da bancada):');
    for(const o of objs)E.appendChild(chip(o.rotulo,n.expr&&n.expr.k==='lit'&&n.obj===o.id,()=>{
      const msg=LANG.compativel(tipo,o.val);if(msg){SFX.deny();painelMsg(o.nome+': '+msg,'erro');return;}
      n.expr={k:'lit',val:o.val};n.obj=o.id;SFX.atribui();programaMudou();renderPainel();painelMsg(n.nome+' = '+LANG.fmt(o.val)+' ('+LANG.TIPOS[o.val.t].nome+').','');},'',iconeObj(o)));
    if(c.arit&&c.arit.length){
      sep('Ou uma conta (o valor atual do contêiner mais ou menos um número):');
      for(const op of c.arit)for(const o of objs.filter(o=>o.val.t==='int'||o.val.t==='float'))
        E.appendChild(chip(n.nome+' '+op+' '+o.rotulo,n.expr&&n.expr.k==='op'&&n.expr.op===op&&n.expr.b.val.v===o.val.v,()=>{n.expr={k:'op',op,a:{k:'var',nome:n.nome},b:{k:'lit',val:o.val}};n.obj=undefined;SFX.atribui();programaMudou();renderPainel();},'',iconeObj(o)));
    }
  }else if(n.k==='se'||n.k==='enq'){
    const cd=n.cond||(n.cond={a:null,op:null,b:null});
    sep('Condição: o que comparar');for(const v of nomesLeitura(c))E.appendChild(chip(v.nome,cd.a&&cd.a.nome===v.nome,()=>{cd.a={k:'var',nome:v.nome};programaMudou();renderPainel();}));
    sep('Comparação:');for(const op of c.ops||LANG.OPS_CMP)E.appendChild(chip(op,cd.op===op,()=>{cd.op=op;programaMudou();renderPainel();painelMsg(op+' pergunta: '+(cd.a?cd.a.nome:'…')+' '+LANG.OP_NOME[op]+' …? A resposta é Verdadeiro ou Falso.','');},'op'));
    sep('Com o valor:');
    for(const o of objs)E.appendChild(chip(o.rotulo,cd.b&&cd.b.k==='lit'&&LANG.fmt(cd.b.val)===LANG.fmt(o.val)&&cd.b.val.t===o.val.t,()=>{cd.b={k:'lit',val:o.val};programaMudou();renderPainel();},'',iconeObj(o)));
    if(c.cmpVars)for(const v of c.vars||[])E.appendChild(chip(v.nome,cd.b&&cd.b.k==='var'&&cd.b.nome===v.nome,()=>{cd.b={k:'var',nome:v.nome};programaMudou();renderPainel();}));
  }else if(n.k==='rep'){
    const mx=c.repMax||8;
    sep('Quantas vezes:');
    E.appendChild(chip('−',false,()=>{if(n.n>0){n.n--;programaMudou();renderPainel();}},'op'));
    const b=chip(String(n.n),true,()=>{},'op');E.appendChild(b);
    E.appendChild(chip('+',false,()=>{if(n.n<mx){n.n++;programaMudou();renderPainel();}},'op'));
  }
  /* o editor aparece inteiro, acima da barra fixa de placas e controles */
  E.style.scrollMarginBottom=($('pRodape').offsetHeight+6)+'px';
  if(PAINEL.editorDe!==n.id){PAINEL.editorDe=n.id;try{E.scrollIntoView({block:'nearest'});}catch(e){}}
}
/* ---------- paleta ---------- */
function renderPaleta(){
  const c=PAINEL.cfg,P0=$('pPaleta');P0.textContent='';
  const rodando=PAINEL.run&&!PAINEL.run.s.fim;
  if(c.etapa==='demo'){
    c.demo.forEach((d,i)=>{const b=document.createElement('button');b.className='pb';b.innerHTML='<span class="sim">▶</span>';b.appendChild(document.createTextNode('Ver: '+d.nome+(PAINEL.demoVisto[c.id+':'+i]?' ✔':'')));b.disabled=rodando;
      b.onclick=()=>{PAINEL.demoIdx=i;PAINEL.prog=LANG.clonar(d.prog);painelSoltar();PAINEL.run=null;renderPainel();painelExecutar();};P0.appendChild(b);});
    if(G.learn[c.id]){const prox=desafiosDa(c.tumba)[desafiosDa(c.tumba).indexOf(c)+1];if(prox){const b=document.createElement('button');b.className='pb estr';b.innerHTML='<span class="sim">➜</span>Continuar';b.onclick=()=>escolherDesafio(prox);P0.appendChild(b);}}
    return;
  }
  if(c.etapa==='classificar')return;
  const g=c.etapa==='guiada'&&!G.learn[c.id]?guiaDe(c,PAINEL.prog):null;
  for(const bl of c.blocos){
    const info=blocoInfo(bl),b=document.createElement('button');b.className='pb'+(LANG.CMD[bl]?'':' estr')+(g&&g.bloco===bl?' sug':'');b.title=info.ajuda;
    const s=document.createElement('span');s.className='sim';s.textContent=info.sim;b.appendChild(s);b.appendChild(document.createTextNode(info.nome));b.disabled=rodando;
    b.onclick=()=>painelInserir(bl);P0.appendChild(b);
  }
}
function painelInserir(bl){
  const c=PAINEL.cfg;if(PAINEL.run&&!PAINEL.run.s.fim)return;
  const no=novoNo(c,bl);const r=LANG.inserir(PAINEL.prog,PAINEL.cur,no,{linhas:c.maxLinhas||LANG.LIM.linhas,prof:LANG.LIM.prof});
  if(typeof r==='string'){SFX.deny();painelMsg(r,'erro');return;}
  PAINEL.cur=r;SFX.placa();
  /* placas com escolhas (valor, condição, voltas) já abrem o editor */
  PAINEL.sel=no.k==='cmd'?null:no.id;
  programaMudou();renderPainel();
  if(no.k==='set')painelMsg('Escolha o valor que vai para o contêiner '+no.nome+' (veja as opções abaixo da linha).','');
  else if(no.k==='se'||no.k==='enq')painelMsg('Complete a condição abaixo: o que comparar, como comparar e com qual valor. Depois toque nas placas que vão dentro do bloco.','');
  else if(no.k==='rep')painelMsg('Ajuste quantas vezes o bloco repete com − e +. As placas que você tocar agora entram dentro do REPETIR.','');
}

/* ---------- classificar tipos ---------- */
function renderClassificar(){
  const c=PAINEL.cfg,I=$('pItens'),T=$('pTipos');I.textContent='';T.textContent='';
  for(const id of c.itens){const o=OBJ[id],ok=PAINEL.classOk[id];const b=document.createElement('button');b.className='it'+(ok?' ok':'')+(PAINEL.classSel===id?' sel':'');
    const im=document.createElement('img');im.className='px';im.src=iconeObj(o);b.appendChild(im);const d=document.createElement('span');d.textContent=o.nome;
    if(ok){const t=document.createElement('span');t.className='tp';t.textContent=LANG.TIPOS[o.val.t].nome+' ('+LANG.TIPOS[o.val.t].py+') · '+LANG.fmt(o.val);d.appendChild(t);}
    b.appendChild(d);b.onclick=()=>{if(ok)return;PAINEL.classSel=id;SFX.click();renderClassificar();painelMsg(o.nome+'. Que tipo de dado é este?','');};I.appendChild(b);}
  for(const t of['int','float','str','bool']){const T0=LANG.TIPOS[t];const b=document.createElement('button');b.className='btn';b.textContent=T0.nome+' ('+T0.py+') · ex.: '+T0.ex;b.disabled=!PAINEL.classSel;
    b.onclick=()=>{const id=PAINEL.classSel;if(!id)return;const r=classificar(id,t);
      if(r.ok){PAINEL.classOk[id]=true;PAINEL.classSel=null;SFX.sensor();painelMsg('Certo! '+r.msg,'ok');
        if(c.itens.every(x=>PAINEL.classOk[x]))concluirDesafio(c);}
      else{SFX.erroProg();painelMsg(r.msg,'erro');}
      renderClassificar();renderPainel();};T.appendChild(b);}
}

/* ---------- execução: Executar e Passo usam o mesmo LANG.passo() ---------- */
function novaExecucao(modo){
  const c=PAINEL.cfg;
  painelSoltar();
  const s=LANG.iniciar(c,mundoAtual(),sitAtual(),PAINEL.prog);
  PAINEL.run={s,modo,t:0,dur:0.6,linha:null,ev:null,tStep:1,eventos:[]};
  PAINEL.sel=null;
  if(PAINEL.area&&PAINEL.area.aoIniciar)PAINEL.area.aoIniciar(s);
}
function painelExecutar(){
  if(PAINEL.cfg.etapa==='classificar')return;
  if(PAINEL.run&&!PAINEL.run.s.fim){if(PAINEL.run.modo==='passo'){PAINEL.run.modo='exec';PAINEL.run.t=PAINEL.run.dur;renderPainel();}return;}
  novaExecucao('exec');PAINEL.run.t=PAINEL.run.dur*0.6;renderPainel();painelMsg('Executando…','passo');
}
function painelPassoBtn(){
  if(PAINEL.cfg.etapa==='classificar')return;
  if(PAINEL.run&&!PAINEL.run.s.fim&&PAINEL.run.modo==='exec')return;
  if(!PAINEL.run||PAINEL.run.s.fim)novaExecucao('passo');
  executarUm();
}
function painelParar(render){
  const r=PAINEL.run;if(!r)return;
  if(!r.s.fim){PAINEL.parado={env:r.s.env,ws:r.s.ws,ev:r.ev,linha:r.linha};if(render!==false)painelMsg('Execução parada'+(r.linha?' na linha '+LANG.numeroLinha(r.s.prog,r.linha):'')+'. Toque em Reiniciar para voltar o mecanismo ao começo, ou edite o programa.','');}
  else PAINEL.parado={env:r.s.env,ws:r.s.ws,ev:r.ev,linha:r.linha,erroLinha:r.s.erro&&r.s.erro.linha};
  PAINEL.run=null;if(render!==false)renderPainel();
}
function painelReiniciar(){PAINEL.run=null;PAINEL.parado=null;PAINEL.ultimoEv=null;SFX.click();mensagemInicial();renderPainel();}
function painelLimpar(){
  if(!PAINEL.prog.length)return;
  confirmar('Limpar o programa?','Todas as placas desta etapa saem do painel. As etapas já concluídas continuam concluídas.','Limpar',()=>{PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};PAINEL.sel=null;programaMudou();PAINEL.run=null;mensagemInicial();renderPainel();});
}
function painelDica(){
  const c=PAINEL.cfg;if(!c.dicas)return;const n=PAINEL.dicas[c.id]||0;const i=Math.min(n,c.dicas.length-1);PAINEL.dicas[c.id]=Math.min(c.dicas.length,n+1);
  painelMsg('Dica '+(i+1)+' de '+c.dicas.length+': '+c.dicas[i]+(i>0?' (Dicas anteriores: '+c.dicas.slice(0,i).join(' · ')+')':''),'');SFX.page();renderPainel();
}
function painelExemplos(){
  const ex=exemplosVistos();
  const t=ex.length?ex.map(e=>e.titulo+':\n'+e.codigo).join('\n\n'):'Ainda não há exemplos. Eles aparecem depois das demonstrações e de cada etapa concluída.';
  const m=$('pMsg');m.className='';m.textContent='';const h=document.createElement('b');h.textContent='Exemplos já apresentados';m.appendChild(h);
  const pre=document.createElement('pre');pre.style.cssText='margin:4px 0 0;white-space:pre-wrap;font:600 13px/1.35 var(--mono)';pre.textContent=t;m.appendChild(pre);m.scrollTop=0;
}
function executarUm(){
  const r=PAINEL.run;if(!r||r.s.fim)return;
  const ev=LANG.passo(r.s);if(!ev)return;
  r.ev=ev;r.eventos.push(ev);r.linha=ev.linha;r.tStep=0;PAINEL.ultimoEv=ev;
  const c=PAINEL.cfg;
  /* sons e mensagem do passo */
  if(ev.tipo==='cmd')SFX.passo(r.eventos.length);else if(ev.tipo==='set')SFX.atribui();else if(ev.tipo==='se')SFX.decide(ev.res);else if(ev.tipo==='rep'||ev.tipo==='repFim'||ev.tipo==='enq')SFX.volta();
  if(PAINEL.area&&PAINEL.area.aoEvento)PAINEL.area.aoEvento(ev,r.s);
  if(r.s.fim)terminouExecucao();
  else painelMsg(LANG.narrar(ev,r.s),'passo');
  renderPainel();
}
function terminouExecucao(){
  const r=PAINEL.run,s=r.s,c=PAINEL.cfg,sit=sitAtual(),sig=LANG.assinatura(PAINEL.prog);
  if(c.etapa==='demo'){
    PAINEL.demoVisto[c.id+':'+PAINEL.demoIdx+(c.demo[PAINEL.demoIdx].todas?':'+sit.id:'')]=true;
    const fimMsg=s.ok?(LANG.narrar(r.ev,s)||'Fim do programa.'):LANG.explicar(s);
    /* com "todas", a demonstração passa sozinha para a próxima situação */
    const d=c.demo[PAINEL.demoIdx];
    if(d.todas&&PAINEL.sit<c.situacoes.length-1){painelMsg(fimMsg+' Agora a mesma demonstração na situação '+c.situacoes[PAINEL.sit+1].nome+'…','ok');
      setTimeout(()=>{if(PAINEL.aberto&&PAINEL.cfg===c){PAINEL.sit++;PAINEL.run=null;renderPainel();painelExecutar();}},1500);return;}
    const vistos=c.demo.every((d2,i)=>d2.todas?c.situacoes.every(x=>PAINEL.demoVisto[c.id+':'+i+':'+x.id]):PAINEL.demoVisto[c.id+':'+i]);
    if(vistos&&!G.learn[c.id]){painelMsg(fimMsg+' '+c.conclusao,'ok');concluirDesafio(c);}
    else painelMsg(fimMsg+(vistos?' '+c.conclusao:' Veja também o outro programa.'),'ok');
    return;
  }
  if(s.ok){
    PAINEL.passou[c.id][sit.id]=sig;delete PAINEL.falhou[c.id][sit.id];SFX.sucesso();
    const falta=c.situacoes.filter(x=>PAINEL.passou[c.id][x.id]!==sig);
    let t=(LANG.narrar(r.ev,s)||'')+(s.aviso?' '+s.aviso:'');
    if(!falta.length){t=c.sucesso+(s.aviso?' '+s.aviso:'');painelMsg(t,'ok');if(!G.learn[c.id])concluirDesafio(c);else salvar(false);}
    else{painelMsg((t?t+' ':'')+'Deu certo em '+sit.nome+'. Agora teste a mesma solução em '+falta.map(x=>x.nome).join(' e ')+'.','ok');}
  }else{
    PAINEL.falhou[c.id][sit.id]=sig;SFX.erroProg();
    painelMsg(LANG.explicar(s)+(c.dicas?' Se quiser, toque em Dica.':''),'erro');
  }
}
function concluirDesafio(c){
  G.learn[c.id]=true;guardarPrograma();
  if(RELIC_KEYS.indexOf(c.tumba)>=0&&saberOk(c.tumba))saberConcluido(c.tumba);
  if(PAINEL.area&&PAINEL.area.aoConcluir)PAINEL.area.aoConcluir(c);
  salvar(false);renderPainel();
  const l=desafiosDa(c.tumba),prox=l[l.indexOf(c)+1];
  if(prox&&c.etapa!=='demo')setTimeout(()=>{if(PAINEL.aberto&&PAINEL.cfg===c)toast('Etapa liberada: '+prox.titulo+'. Toque nela no alto do painel.','good');},400);
  if(!prox)setTimeout(()=>{if(PAINEL.aberto&&PAINEL.cfg===c)toast('Todas as etapas desta tumba estão concluídas. Feche o painel e procure a relíquia.','good');},400);
}
/* a cada quadro com o painel aberto: anda a execução automática e a animação do passo */
function painelPasso(dt){
  const r=PAINEL.run;if(!r)return;
  r.tStep=Math.min(1,r.tStep+dt/(r.dur/PAINEL.vel));
  if(r.modo==='exec'&&!r.s.fim){r.t+=dt*PAINEL.vel;if(r.t>=r.dur){r.t=0;executarUm();}}
}
/* o que a sala deve desenhar: estado do mundo (da execução, da última parada ou o inicial da situação) */
function painelVis(){
  const c=PAINEL.cfg;if(!c)return null;
  if(PAINEL.run)return{cfg:c,ws:PAINEL.run.s.ws,ev:PAINEL.run.ev,t:PAINEL.run.tStep,s:PAINEL.run.s,rodando:!PAINEL.run.s.fim};
  if(PAINEL.parado)return{cfg:c,ws:PAINEL.parado.ws,ev:PAINEL.parado.ev,t:1,s:null,rodando:false};
  return{cfg:c,ws:mundoAtual().init(sitAtual(),c),ev:null,t:1,s:null,rodando:false};
}
