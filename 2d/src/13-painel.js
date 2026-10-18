/* ====================== painel de programação ======================
   O mesmo painel em todas as tumbas, liberando recursos aos poucos: funções da sala e linhas de estrutura
   (variável = valor, if, elif, else, for, while), variáveis e sensores, situações de teste, as dicas do Lume, o Guia
   de Programação e uma área que explica cada erro.
   - Por toques: tocar numa linha da paleta escreve no cursor (▸); tocar numa linha do programa seleciona e abre o
     editor dela (↑ ↓ remover, valores, condição, número de voltas, + elif, else). Nada precisa ser arrastado.
   - ✎ Escrever: o mesmo programa num campo de texto, para digitar código Python de verdade. Ao executar (ou em
     Pronto), o texto é lido; se houver erro, a área de erro diz a linha e o que fazer.
   - Executar e Passo a passo chamam o mesmo LANG.passo(); só existe uma execução por vez (PAINEL.run).
   - Enquanto o painel está aberto, a exploração fica pausada e a câmera mostra o mecanismo da sala, que reage ao
     código. Ao fechar, a execução para, o programa fica guardado e os controles voltam ao normal. */
const PAINEL={aberto:false,tumba:null,cfg:null,prog:[],cur:{pai:null,ramo:null,i:0},sel:null,sit:0,run:null,vel:1,passou:{},falhou:{},
  demoVisto:{},foco:null,area:null,msg:'',msgTipo:'',ultimoEv:null,parado:null,texto:false,erroTexto:null,previsao:{}};
const VEL=[1,2,0.5];
function painelInit(){
  $('pFechar').onclick=()=>fecharPainel();
  $('pRun').onclick=()=>painelExecutar();$('pStep').onclick=()=>painelPassoBtn();$('pStop').onclick=()=>painelParar(true);
  $('pReset').onclick=()=>painelReiniciar();$('pClear').onclick=()=>painelLimpar();$('pDica').onclick=()=>painelDica();
  $('pGuia').onclick=()=>abrirGuia(topicoGuia(PAINEL.cfg));$('pModo').onclick=()=>painelModoTexto(!PAINEL.texto);
  $('pVel').onclick=()=>{const i=(VEL.indexOf(PAINEL.vel)+1)%VEL.length;PAINEL.vel=VEL[i];$('pVel').textContent=(PAINEL.vel===0.5?'½':PAINEL.vel)+'×';};
  $('pProg').addEventListener('click',e=>{const li=e.target.closest('.ln');if(!li){if(!PAINEL.run)painelCursor({pai:null,ramo:null,i:PAINEL.prog.length});return;}painelTocarLinha(li);});
  /* no campo de texto, Tab escreve 4 espaços (o recuo do Python) */
  $('pTxt').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const a=e.target,i=a.selectionStart;a.value=a.value.slice(0,i)+'    '+a.value.slice(a.selectionEnd);a.selectionStart=a.selectionEnd=i+4;}});
  $('pTxt').addEventListener('input',()=>{PAINEL.erroTexto=null;mostrarErro(null);});
  addEventListener('resize',()=>{if(PAINEL.aberto)atualizarVista();});
}
const mundoAtual=()=>MUNDOS[PAINEL.cfg.mundo];
const sitAtual=()=>PAINEL.cfg.situacoes[PAINEL.sit]||PAINEL.cfg.situacoes[0]||{};
function desafioDisponivel(cfg){const l=desafiosDa(cfg.tumba),i=l.indexOf(cfg);return i===0||!!G.learn[l[i-1].id];}
const rodandoAgora=()=>!!PAINEL.run&&!PAINEL.run.s.fim;

/* ---------- abrir e fechar ---------- */
function abrirPainel(tumba,area,foco){
  if(G.mode!=='play')return;
  PAINEL.aberto=true;PAINEL.tumba=tumba;PAINEL.area=area;PAINEL.foco=foco;
  G.mode='painel';limparEntrada();document.body.classList.add('painel');$('painel').hidden=false;$('prompt').hidden=true;
  const l=desafiosDa(tumba);const cfg=l.find(d=>!G.learn[d.id])||l[l.length-1];
  escolherDesafio(cfg,true);atualizarVista();SFX.lever();
  if(area&&area.aoAbrirPainel)area.aoAbrirPainel();
}
function fecharPainel(silencio){
  if(!PAINEL.aberto)return;
  if(PAINEL.texto)lerTexto(true);
  painelParar(false);guardarPrograma();
  PAINEL.aberto=false;PAINEL.texto=false;$('painel').hidden=true;document.body.classList.remove('painel');R.vista=null;PAINEL.foco=null;
  if(G.mode==='painel')G.mode='play';limparEntrada();
  if(!silencio)salvar(false);
}
function atualizarVista(){
  const r=$('painel').getBoundingClientRect();
  if(r.top>40)R.vista={x:0,y:0,w:innerWidth*R.dpr,h:r.top*R.dpr};else R.vista={x:0,y:0,w:r.left*R.dpr,h:innerHeight*R.dpr};
}
function guardarPrograma(){const c=PAINEL.cfg;if(c&&c.etapa!=='demo')G.progs[c.id]=LANG.clonar(PAINEL.prog);}
function escolherDesafio(cfg,primeiro){
  painelParar(false);if(PAINEL.texto)lerTexto(true);guardarPrograma();
  $('pPrev').hidden=true;
  PAINEL.cfg=cfg;PAINEL.sit=0;PAINEL.sel=null;PAINEL.parado=null;PAINEL.ultimoEv=null;PAINEL.erroTexto=null;PAINEL.texto=false;
  if(cfg.etapa==='demo'){PAINEL.prog=LANG.clonar(cfg.demo[0].prog);PAINEL.demoIdx=0;}
  else{const p=G.progs[cfg.id];PAINEL.prog=p?LANG.limpar(p,cfg).prog:programaInicial(cfg);}
  PAINEL.cur={pai:null,ramo:null,i:PAINEL.prog.length};
  if(!PAINEL.passou[cfg.id])PAINEL.passou[cfg.id]={};if(!PAINEL.falhou[cfg.id])PAINEL.falhou[cfg.id]={};
  if(PAINEL.area&&PAINEL.area.aoEscolher)PAINEL.area.aoEscolher(cfg);
  mostrarErro(null);mensagemInicial();renderPainel();
}
function mensagemInicial(){
  const c=PAINEL.cfg;let t=c.intro.join(' ');
  if(G.learn[c.id]&&c.etapa!=='demo')t='Etapa concluída. Você pode testar de novo ou voltar às outras. '+t;
  const g=c.etapa==='guiada'?guiaDe(c,PAINEL.prog):null;
  if(g&&!G.learn[c.id])t=t+' → '+g.texto;
  painelMsg(t,'');
}
function painelMsg(t,tipo){PAINEL.msg=t;PAINEL.msgTipo=tipo||'';const m=$('pMsg');m.textContent=t;m.className=tipo||'';m.scrollTop=0;}
/* área de erro: o que deu errado (com o nome do erro em Python) e o que fazer, em linguagem simples */
/* área de erro: de onde vem o problema (Python, regra da máquina, objetivo…), a linha, o que deu errado e o que fazer;
   o botão abre o Guia no assunto do erro, sem perder o programa */
function mostrarErro(x){
  const box=$('pErro');if(!x){box.hidden=true;return;}
  const cat=x.cat||'python';box.className='cat-'+cat;
  box.hidden=false;box.querySelector('.onde').textContent=(x.linha?'Linha '+x.linha+' · ':'')+(LANG.CAT[cat]||'Erro');
  box.querySelector('.tit').textContent=x.titulo;box.querySelector('.txt').textContent=x.texto;
  box.querySelector('.dica').textContent=(PAINEL.cfg&&PAINEL.cfg.dicas?'Se precisar, peça uma 💡 Dica ao Lume.':'');
  const top=x.guia||topicoGuia(PAINEL.cfg),T=GUIA.find(g=>g.id===top),gb=box.querySelector('.gbtn');
  gb.hidden=!T;if(T){gb.textContent='📖 Ver no Guia: '+T.t;gb.onclick=()=>abrirGuia(top);}
  aVista(box);
}
/* rola o painel até o elemento ficar visível acima da barra fixa de linhas e controles (telas baixas) */
function aVista(el){
  const P=$('painel'),r=el.getBoundingClientRect(),p=P.getBoundingClientRect(),f=$('pRodape').getBoundingClientRect();
  const escondido=r.bottom+6-f.top;
  if(escondido>0)P.scrollTop+=Math.min(escondido,r.top-p.top-4);else if(r.top<p.top)P.scrollTop-=p.top-r.top+4;
}

/* ---------- desenho do painel ---------- */
function renderPainel(){
  const c=PAINEL.cfg,rodando=rodandoAgora();
  $('pTitulo').textContent=c.titulo;$('pEtapa').textContent=nomeLugar(c.tumba)+' · '+ETAPA_NOME[c.etapa];
  /* etapas da tumba */
  const E=$('pEtapas');E.textContent='';
  desafiosDa(c.tumba).forEach((d,i)=>{const b=document.createElement('button');b.className='etp'+(G.learn[d.id]?' ok':'')+(d===c?' atual':'');
    b.textContent=(G.learn[d.id]?'✔ ':desafioDisponivel(d)?'▶ ':'🔒 ')+(i+1)+' '+ETAPA_NOME[d.etapa];b.disabled=!desafioDisponivel(d)||rodando;
    b.onclick=()=>{if(d!==PAINEL.cfg)escolherDesafio(d);};E.appendChild(b);});
  /* a aba da etapa atual fica à vista rolando só a fileira das etapas (sem mexer na rolagem do painel) */
  const at=E.querySelector('.atual');if(at){const a=E.getBoundingClientRect(),b=at.getBoundingClientRect();if(b.left<a.left)E.scrollLeft-=a.left-b.left;else if(b.right>a.right)E.scrollLeft+=b.right-a.right;}
  /* situações */
  const S=$('pSits');S.textContent='';S.hidden=c.situacoes.length<2;
  c.situacoes.forEach((s,i)=>{const b=document.createElement('button');const pa=PAINEL.passou[c.id][s.id]===LANG.assinatura(PAINEL.prog),fa=PAINEL.falhou[c.id][s.id]===LANG.assinatura(PAINEL.prog);
    b.className='sit'+(i===PAINEL.sit?' atual':'')+(c.etapa!=='demo'&&pa?' ok':'')+(c.etapa!=='demo'&&!pa&&fa?' erro':'');b.textContent=s.nome;b.disabled=rodando;
    b.onclick=()=>{if(i!==PAINEL.sit){painelParar(false);PAINEL.sit=i;PAINEL.parado=null;PAINEL.ultimoEv=null;mostrarErro(null);renderPainel();}};S.appendChild(b);});
  renderVars();
  const txt=PAINEL.texto;
  $('pProg').hidden=txt;$('pTexto').hidden=!txt;
  if(txt){$('pEdit').hidden=true;$('pRef').textContent=referenciaTexto(c);}else{renderPrograma();renderEditor();}
  renderPaleta();
  /* controles */
  const demo=c.etapa==='demo';
  $('pClear').hidden=demo;$('pDica').hidden=demo||!c.dicas;$('pModo').hidden=demo;
  $('pRun').disabled=rodando&&PAINEL.run.modo==='exec';$('pStep').disabled=rodando&&PAINEL.run.modo==='exec';$('pStop').disabled=!rodando;
  $('pReset').disabled=!PAINEL.run&&!PAINEL.parado;$('pClear').disabled=rodando||(!PAINEL.prog.length&&!c.inicial);$('pModo').disabled=rodando;
  $('pClear').textContent=c.inicial?'↺ Código original':'Limpar';
  $('pModo').textContent=txt?'✔ Pronto':'✎ Escrever';
  if(c.dicas){const n=G.dicas[c.id]||0;$('pDica').textContent='💡 Dica '+(n>=3?'3/3':(n+1)+'/3');}
  $('pRun').textContent=rodando&&PAINEL.run.modo==='passo'?'▶ Continuar':'▶ Executar';
}
function renderVars(){
  const c=PAINEL.cfg,V=$('pVars');V.textContent='';
  const env=PAINEL.run?PAINEL.run.s.env:PAINEL.parado?PAINEL.parado.env:null;
  const ini=env||LANG.iniciar(c,mundoAtual(),sitAtual(),[]).env;
  const lista=(c.vars||[]).map(d=>({d,sensor:false})).concat((c.sensores||[]).map(d=>({d,sensor:true})));
  /* a variável do for aparece enquanto o for roda */
  if(env)for(const k in env)if(env[k].laco)lista.push({d:{nome:k,t:'int'},sensor:false,laco:true});
  V.hidden=!lista.length;
  for(const{d,sensor,laco}of lista){const e=ini[d.nome],v=e?e.val:null;const el=document.createElement('div');el.className='var'+(v===null?' vazio':'')+(sensor?' sensor':'')+(laco?' laco':'');
    const unid=d.unid&&v?' '+d.unid:'';
    el.innerHTML='<span class="tp"></span><span class="nm"></span><span class="vl"></span>';el.children[0].textContent=(sensor?'sensor · ':laco?'variável do for · ':'aceita ')+LANG.rotulo(d.t);el.title=sensor?'Sensor: o programa só lê o valor.':laco?'Muda sozinha a cada volta do for.':'Contêiner da máquina: aceita só '+LANG.rotulo(d.t)+'.';
    el.children[1].textContent=d.nome;el.children[2].textContent=v===null?'vazia':LANG.fmt(v)+unid;
    const ue=PAINEL.ultimoEv;if(ue&&ue.tipo==='set'&&ue.nome===d.nome){el.classList.add('mudou');el.children[2].textContent=(ue.antes?LANG.fmt(ue.antes):'vazia')+' → '+LANG.fmt(ue.depois)+unid;}
    V.appendChild(el);}
}
/* linhas do programa (como em Python) com o cursor de inserção */
function renderPrograma(){
  const c=PAINEL.cfg,ol=$('pProg');ol.textContent='';
  const rodando=rodandoAgora(),demo=c.etapa==='demo';
  const atual=PAINEL.run?PAINEL.run.linha:null,erro=(PAINEL.run&&PAINEL.run.s.erro&&PAINEL.run.s.erro.linha)||(PAINEL.parado&&PAINEL.parado.erroLinha);
  const conts={};if(PAINEL.run)for(const k of LANG.contadores(PAINEL.run.s))conts[k.id]=k;
  const cur=PAINEL.cur;let curPosto=false;
  const linhaCur=nv=>{if(demo||rodando)return;const li=document.createElement('li');li.className='ln cur';li.style.paddingLeft=(nv*20)+'px';li.textContent='▸ a próxima linha entra aqui';li.dataset.cursor='1';ol.appendChild(li);curPosto=true;};
  const ehCur=(pai,ramo,i)=>!curPosto&&(cur.pai===(pai?pai.id:null))&&((cur.ramo||null)===(ramo||null))&&cur.i===i;
  const add=(L,txt,sim,cls,id)=>{
    const li=document.createElement('li');li.className='ln'+(cls?' '+cls:'');li.style.paddingLeft=(L.nv*20)+'px';
    li.dataset.id=id;li.dataset.tipo=L.tipo;if(L.j!==undefined)li.dataset.j=L.j;
    const s=document.createElement('span');s.className='sim';s.textContent=sim;li.appendChild(s);
    const tx=document.createElement('span');tx.className='cod';tx.textContent=txt;if(/\?/.test(txt)&&L.tipo!=='fim')tx.classList.add('inc');li.appendChild(tx);
    if(id===PAINEL.sel&&!rodando&&(L.tipo==='no'||L.tipo==='elif'))li.classList.add('sel');
    if((L.tipo==='no'||L.tipo==='elif')&&id===atual)li.classList.add('atual');
    if((L.tipo==='no'||L.tipo==='elif')&&id===erro)li.classList.add('erro');
    if(L.tipo==='no'&&conts[id]){const b=document.createElement('span');b.className='cont';const k=conts[id];b.textContent=k.k==='rep'?'volta '+k.volta+'/'+k.n+' · '+k.var+' = '+(k.volta-1):'volta '+k.volta;li.appendChild(b);}
    ol.appendChild(li);return li;
  };
  const simDe=n=>n.k==='cmd'?(LANG.CMD[n.cmd]||{}).sim:n.k==='set'?BLOCO_INFO.set.sim:n.k==='se'?BLOCO_INFO[n.senao?'sese':'se'].sim:BLOCO_INFO[n.k].sim;
  (function w(l,nv,pai,ramo){
    l.forEach((n,i)=>{
      if(ehCur(pai,ramo,i))linhaCur(nv);
      add({tipo:'no',nv},LANG.fmtNo(n),simDe(n)||'',n.k!=='cmd'?'estr':'',n.id);
      if(n.k==='se'){
        w(n.entao,nv+1,n,'entao');
        LANG.elifsDe(n).forEach((e,j)=>{add({tipo:'elif',nv,j},LANG.fmtNo(e),BLOCO_INFO.elif.sim,'estr',e.id);w(e.corpo,nv+1,n,'elif'+j);});
        if(n.senao){add({tipo:'senao',nv},'else:','◈','estr',n.id);w(n.senao,nv+1,n,'senao');}
        add({tipo:'fim',nv},'# fim do if','','fimbl',n.id);
      }
      else if(n.k==='rep'||n.k==='enq'){w(n.corpo,nv+1,n,'corpo');add({tipo:'fim',nv},n.k==='rep'?'# fim do for':'# fim do while','','fimbl',n.id);}
    });
    if(ehCur(pai,ramo,l.length))linhaCur(nv);
  })(PAINEL.prog,0,null,null);
  if(!PAINEL.prog.length&&!curPosto&&!demo)linhaCur(0);
  /* com a área de erro aberta, só a lista rola (a explicação do erro continua à vista) */
  const el=ol.querySelector('.ln.atual,.ln.erro,.ln.sel,.ln.cur');
  if(el&&!$('pErro').hidden){const a=ol.getBoundingClientRect(),b=el.getBoundingClientRect();if(b.top<a.top)ol.scrollTop-=a.top-b.top;else if(b.bottom>a.bottom)ol.scrollTop+=b.bottom-a.bottom;}
  else if(el)try{el.scrollIntoView({block:'nearest'});}catch(e){}
}
/* toque numa linha: seleciona e coloca o cursor logo depois (num bloco, dentro dele) */
function painelTocarLinha(li){
  if(rodandoAgora())return;if(PAINEL.cfg.etapa==='demo'||li.dataset.cursor)return;
  const id=+li.dataset.id,tipo=li.dataset.tipo,a=LANG.achar(PAINEL.prog,id);if(!a)return;
  if(tipo==='no'){PAINEL.sel=id;PAINEL.cur=a.no.k==='cmd'||a.no.k==='set'?{pai:a.pai?a.pai.id:null,ramo:a.ramo,i:a.i+1}:{pai:id,ramo:a.no.k==='se'?'entao':'corpo',i:0};}
  else if(tipo==='elif'){PAINEL.sel=id;PAINEL.cur={pai:a.pai.id,ramo:'elif'+a.i,i:0};}
  else if(tipo==='senao'){PAINEL.sel=null;PAINEL.cur={pai:id,ramo:'senao',i:0};}
  else{PAINEL.sel=null;PAINEL.cur={pai:a.pai?a.pai.id:null,ramo:a.ramo,i:a.i+1};}
  SFX.click();painelSoltar();renderPainel();
}
function painelCursor(c){PAINEL.cur=c;PAINEL.sel=null;renderPainel();}
/* depois de editar: a execução anterior deixa de valer para a tela */
function painelSoltar(){if(PAINEL.run&&PAINEL.run.s.fim){PAINEL.run=null;}PAINEL.parado=null;PAINEL.ultimoEv=null;mostrarErro(null);}
function programaMudou(){painelSoltar();guardarPrograma();const c=PAINEL.cfg;const g=c.etapa==='guiada'&&!G.learn[c.id]?guiaDe(c,PAINEL.prog):null;if(g)painelMsg(g.texto,'');}

/* ---------- editor da linha selecionada ---------- */
function chip(txt,on,fn,cls,img){const b=document.createElement('button');b.className='ch'+(on?' on':'')+(cls?' '+cls:'');if(img){const im=document.createElement('img');im.className='px';im.src=img;b.appendChild(im);}b.appendChild(document.createTextNode(txt));b.onclick=fn;return b;}
const ICONE={};function iconeObj(o){if(!ICONE[o.id])ICONE[o.id]=escalar(SPR.get('valor',o.icone),2).toDataURL();return ICONE[o.id];}
function renderEditor(){
  const E=$('pEdit'),c=PAINEL.cfg;E.textContent='';
  const a=PAINEL.sel?LANG.achar(PAINEL.prog,PAINEL.sel):null;
  if(!a||c.etapa==='demo'||rodandoAgora()){E.hidden=true;return;}
  E.hidden=false;const n=a.no,num=LANG.numeroLinha(PAINEL.prog,n.id);
  const lbl=document.createElement('div');lbl.className='lbl';lbl.textContent='Linha '+num+': '+LANG.fmtNo(n);E.appendChild(lbl);
  const lim={linhas:c.maxLinhas||LANG.LIM.linhas,prof:LANG.LIM.prof};
  const fim=()=>{programaMudou();renderPainel();};
  if(n.k!=='elif'){
    const mv=d=>()=>{if(LANG.mover(PAINEL.prog,n.id,d,lim)){SFX.placa();PAINEL.cur={pai:null,ramo:null,i:PAINEL.prog.length};fim();}};
    E.appendChild(chip('↑ Subir',false,mv(-1),'op'));E.appendChild(chip('↓ Descer',false,mv(1),'op'));
  }
  E.appendChild(chip(n.k==='elif'?'✕ Remover elif':'✕ Remover',false,()=>{const cur=LANG.remover(PAINEL.prog,n.id);PAINEL.sel=null;if(cur)PAINEL.cur=cur;SFX.tira();fim();},'op'));
  /* o Guia no assunto da instrução selecionada */
  const tg=topicoDaLinha(n,a,c),TG=GUIA.find(g=>g.id===tg);if(TG)E.appendChild(chip('📖 '+TG.t,false,()=>abrirGuia(tg),'op gl'));
  const sep=t=>{const d=document.createElement('div');d.className='lbl';d.textContent=t;E.appendChild(d);};
  const objs=opcoesValor(c);
  if(n.k==='set'){
    sep('Variável:');for(const v of c.vars||[])E.appendChild(chip(v.nome+' ('+LANG.TIPOS[v.t].rot+')',n.nome===v.nome,()=>{n.nome=v.nome;if(n.expr&&n.expr.k==='lit'&&LANG.compativel(v.t,n.expr.val)){n.expr=null;}fim();}));
    const tipo=(c.vars.find(v=>v.nome===n.nome)||{}).t;
    sep('Valor guardado (objetos da bancada):');
    for(const o of objs)E.appendChild(chip(o.rotulo,n.expr&&n.expr.k==='lit'&&n.obj===o.id,()=>{
      const msg=LANG.compativel(tipo,o.val);if(msg){SFX.deny();painelMsg(o.nome+': '+msg,'erro');return;}
      n.expr={k:'lit',val:o.val};n.obj=o.id;SFX.atribui();fim();painelMsg(n.nome+' = '+LANG.fmt(o.val)+' ('+LANG.rotulo(o.val.t)+').','');},'',iconeObj(o)));
    if(c.arit&&c.arit.length){
      sep('Ou uma conta (o valor atual da variável mais ou menos um número):');
      for(const op of c.arit)for(const o of objs.filter(o=>o.val.t==='int'||o.val.t==='float'))
        E.appendChild(chip(n.nome+' '+op+' '+o.rotulo,n.expr&&n.expr.k==='op'&&n.expr.op===op&&n.expr.b.val.v===o.val.v,()=>{n.expr={k:'op',op,a:{k:'var',nome:n.nome},b:{k:'lit',val:o.val}};n.obj=undefined;SFX.atribui();fim();},'',iconeObj(o)));
    }
  }else if(n.k==='se'||n.k==='enq'||n.k==='elif'){
    editorCondicao(E,n,c,sep,fim);
    if(n.k==='se'){
      const extras=[];
      if(LANG.permite(c,'elif'))extras.push(chip('+ elif',false,()=>{const r=LANG.adicionarElif(PAINEL.prog,n.id,condPadrao(c),lim);if(typeof r==='string'){SFX.deny();painelMsg(r,'erro');return;}PAINEL.sel=r.elif;PAINEL.cur={pai:r.pai,ramo:r.ramo,i:0};SFX.placa();fim();painelMsg('elif entrou embaixo do if. Complete a condição dele; as linhas que você tocar agora entram dentro do elif.','');},'op'));
      if(LANG.permite(c,'senao'))extras.push(chip(n.senao?'− tirar o else':'+ else',false,()=>{
        const tira=()=>{const r=LANG.alternarSenao(PAINEL.prog,n.id,lim);if(typeof r==='string'){SFX.deny();painelMsg(r,'erro');return;}PAINEL.cur=r;SFX.placa();fim();};
        if(n.senao&&n.senao.length)confirmar('Tirar o else?','As linhas de dentro do else saem do programa.','Tirar',tira);else tira();},'op'));
      if(extras.length){sep('Mais caminhos:');extras.forEach(x=>E.appendChild(x));}
    }
  }else if(n.k==='rep'){
    const mx=c.repMax||8;
    sep('Quantas voltas (range):');
    E.appendChild(chip('−',false,()=>{if(n.n>0){n.n--;fim();}},'op'));
    E.appendChild(chip('range('+n.n+')',true,()=>{},'op'));
    E.appendChild(chip('+',false,()=>{if(n.n<mx){n.n++;fim();}},'op'));
  }
  /* o editor aparece inteiro, acima da barra fixa de linhas e controles */
  if(PAINEL.editorDe!==n.id){PAINEL.editorDe=n.id;aVista(E);}
}
function topicoDaLinha(n,a,c){
  if(n.k==='set'){const v=(c.vars||[]).find(d=>d.nome===n.nome);return v?LANG.TIPOS[v.t].guia:'variaveis';}
  if(n.k==='se')return n.senao?'else':'if';if(n.k==='elif')return'elif';if(n.k==='rep')return'for';if(n.k==='enq')return'while';
  return'comandos';
}
/* condição de if, elif e while: o que comparar, como comparar e com qual valor — ou um booleano sozinho (x / not x) */
function editorCondicao(E,n,c,sep,fim){
  const cd=n.cond||(n.cond={a:null,op:null,b:null});const objs=opcoesValor(c);
  sep('Condição: o que testar');for(const v of nomesLeitura(c))E.appendChild(chip(v.nome,cd.a&&cd.a.nome===v.nome,()=>{cd.a={k:'var',nome:v.nome};
    if(v.t==='bool'&&cd.op!=='not'){cd.op='bool';cd.b=null;}else if(v.t!=='bool'&&(cd.op==='bool'||cd.op==='not'))cd.op=(c.ops&&c.ops.length===1)?c.ops[0]:null;fim();}));
  const va=cd.a&&nomesLeitura(c).find(v=>v.nome===cd.a.nome),ehBool=va&&va.t==='bool';
  sep('Como testar:');
  if(ehBool){E.appendChild(chip(cd.a.nome+' (é True?)',cd.op==='bool',()=>{cd.op='bool';cd.b=null;fim();},'op'));E.appendChild(chip('not '+cd.a.nome,cd.op==='not',()=>{cd.op='not';cd.b=null;fim();},'op'));}
  for(const op of c.ops||LANG.OPS_CMP)E.appendChild(chip(op,cd.op===op,()=>{cd.op=op;fim();painelMsg(op+' pergunta: '+(cd.a?cd.a.nome:'…')+' '+LANG.OP_NOME[op]+' …? A resposta é True ou False.','');},'op'));
  if(cd.op==='bool'||cd.op==='not')return;
  sep('Com o valor:');
  for(const o of objs)E.appendChild(chip(o.rotulo,cd.b&&cd.b.k==='lit'&&LANG.fmt(cd.b.val)===LANG.fmt(o.val)&&cd.b.val.t===o.val.t,()=>{cd.b={k:'lit',val:o.val};fim();},'',iconeObj(o)));
  if(c.cmpVars)for(const v of c.vars||[])E.appendChild(chip(v.nome,cd.b&&cd.b.k==='var'&&cd.b.nome===v.nome,()=>{cd.b={k:'var',nome:v.nome};fim();}));
}
/* ---------- paleta ---------- */
function renderPaleta(){
  const c=PAINEL.cfg,P0=$('pPaleta');P0.textContent='';
  const rodando=rodandoAgora();
  if(c.etapa==='demo'){
    c.demo.forEach((d,i)=>{const b=document.createElement('button');b.className='pb';b.innerHTML='<span class="sim">▶</span>';b.appendChild(document.createTextNode('Ver: '+d.nome+(PAINEL.demoVisto[c.id+':'+i]?' ✔':'')));b.disabled=rodando;
      b.onclick=()=>{PAINEL.demoIdx=i;PAINEL.prog=LANG.clonar(d.prog);painelSoltar();PAINEL.run=null;renderPainel();painelExecutar();};P0.appendChild(b);});
    if(G.learn[c.id]){const prox=desafiosDa(c.tumba)[desafiosDa(c.tumba).indexOf(c)+1];if(prox){const b=document.createElement('button');b.className='pb estr';b.innerHTML='<span class="sim">➜</span>Continuar';b.onclick=()=>escolherDesafio(prox);P0.appendChild(b);}}
    return;
  }
  if(PAINEL.texto)return;
  const g=c.etapa==='guiada'&&!G.learn[c.id]?guiaDe(c,PAINEL.prog):null;
  for(const bl of c.blocos){
    const info=blocoInfo(bl),b=document.createElement('button');b.className='pb'+(LANG.CMD[bl]?'':' estr')+(g&&g.bloco===bl?' sug':'');b.title=info.ajuda;
    const s=document.createElement('span');s.className='sim';s.textContent=info.sim;b.appendChild(s);const t=document.createElement('span');t.className='cod';t.textContent=info.nome;b.appendChild(t);b.disabled=rodando;
    b.onclick=()=>painelInserir(bl);P0.appendChild(b);
  }
}
function painelInserir(bl){
  const c=PAINEL.cfg;if(rodandoAgora())return;
  const lim={linhas:c.maxLinhas||LANG.LIM.linhas,prof:LANG.LIM.prof};
  if(bl==='elif'){
    /* o elif entra no if selecionado, ou no if em que o cursor está */
    let alvo=null;const sel=PAINEL.sel&&LANG.achar(PAINEL.prog,PAINEL.sel);
    if(sel&&sel.no.k==='se')alvo=sel.no;else if(sel&&sel.no.k==='elif')alvo=sel.pai;
    else if(PAINEL.cur.pai!==null){const p=LANG.achar(PAINEL.prog,PAINEL.cur.pai);if(p&&p.no.k==='se')alvo=p.no;}
    if(!alvo){const ses=[];LANG.cada(PAINEL.prog,n=>{if(n.k==='se')ses.push(n);});if(ses.length===1)alvo=ses[0];}
    if(!alvo){SFX.deny();painelMsg('O elif é um caminho a mais de um if. Primeiro crie o if (ou toque nele) e depois toque em elif.','erro');return;}
    const r=LANG.adicionarElif(PAINEL.prog,alvo.id,condPadrao(c),lim);if(typeof r==='string'){SFX.deny();painelMsg(r,'erro');return;}
    PAINEL.sel=r.elif;PAINEL.cur={pai:r.pai,ramo:r.ramo,i:0};SFX.placa();programaMudou();renderPainel();
    painelMsg('elif entrou embaixo do if, antes do else. Complete a condição dele (abaixo); as linhas que você tocar agora entram dentro do elif.','');return;
  }
  const no=novoNo(c,bl,PAINEL.prog);
  if(no.k==='rep')no.var=['i','j','k'][Math.min(2,LANG.nivelDe(PAINEL.prog,PAINEL.cur))];
  const r=LANG.inserir(PAINEL.prog,PAINEL.cur,no,lim);
  if(typeof r==='string'){SFX.deny();painelMsg(r,'erro');return;}
  PAINEL.cur=r;SFX.placa();
  /* linhas com escolhas (valor, condição, voltas) já abrem o editor */
  PAINEL.sel=no.k==='cmd'?null:no.id;
  programaMudou();renderPainel();
  if(no.k==='set')painelMsg('Escolha o valor que vai para a variável '+no.nome+' (veja as opções abaixo da linha).','');
  else if(no.k==='se'||no.k==='enq')painelMsg('Complete a condição abaixo: o que testar, como e com qual valor. Depois toque nas linhas que vão dentro do bloco (com recuo).','');
  else if(no.k==='rep')painelMsg('Ajuste quantas voltas com − e +. As linhas que você tocar agora entram dentro do for (com recuo).','');
}

/* ---------- modo Escrever: o programa como texto ---------- */
function referenciaTexto(c){
  const f=c.blocos.filter(b=>LANG.CMD[b]).map(b=>LANG.CMD[b].py+'()');
  const v=(c.vars||[]).map(d=>d.nome+' ('+LANG.TIPOS[d.t].rot+')').concat((c.sensores||[]).map(d=>d.nome+' (sensor, '+LANG.TIPOS[d.t].rot+')'));
  const e=['set','se','sese','elif','rep','enq'].filter(b=>LANG.permite(c,b==='sese'?'senao':b)).map(b=>({set:'x = valor',se:'if',sese:'else',elif:'elif',rep:'for',enq:'while'})[b]);
  return'Funções: '+(f.join(', ')||'nenhuma')+(v.length?' · Variáveis: '+v.join(', '):'')+(e.length?' · Também: '+e.join(', '):'')+' · Recuo: 4 espaços (Tab). · Um pedaço do Python: sem print, listas, def nem and/or (📖 Guia › O que o editor aceita).';
}
function painelModoTexto(on){
  if(rodandoAgora())return;
  if(on){painelParar(false);PAINEL.texto=true;PAINEL.sel=null;$('pTxt').value=LANG.codigo(PAINEL.prog);mostrarErro(null);renderPainel();painelMsg('Escreva o código como em Python. Toque em ✔ Pronto (ou ▶ Executar) para o jogo ler o texto.','');try{$('pTxt').focus({preventScroll:true});}catch(e){}aVista($('pTxt'));SFX.click();return;}
  if(lerTexto(false)){PAINEL.texto=false;renderPainel();SFX.placa();}
}
/* lê o texto do campo. Com erro, mostra a área de erro e continua no modo Escrever (silencioso: só ao fechar) */
function lerTexto(silencioso){
  const c=PAINEL.cfg,r=LANG.ler($('pTxt').value,c);
  if(r.erro){if(silencioso){PAINEL.texto=false;return false;}PAINEL.erroTexto=r.erro;mostrarErro(r.erro);SFX.erroProg();painelMsg('O texto tem um erro na linha '+r.erro.linha+'. Veja a explicação abaixo e corrija.','erro');marcarLinhaTexto(r.erro.linha);return false;}
  PAINEL.prog=r.prog;PAINEL.cur={pai:null,ramo:null,i:PAINEL.prog.length};PAINEL.erroTexto=null;programaMudou();
  painelMsg('Código lido: '+LANG.contarLinhas(PAINEL.prog)+(LANG.contarLinhas(PAINEL.prog)===1?' linha.':' linhas.')+' Toque em ▶ Executar.','');
  return true;
}
function marcarLinhaTexto(n){const a=$('pTxt'),L=a.value.split('\n');let i=0;for(let k=0;k<n-1&&k<L.length;k++)i+=L[k].length+1;try{a.focus({preventScroll:true});a.setSelectionRange(i,i+(L[n-1]||'').length);}catch(e){}}

/* ---------- execução: Executar e Passo usam o mesmo LANG.passo() ---------- */
function novaExecucao(modo){
  const c=PAINEL.cfg;
  painelSoltar();
  const s=LANG.iniciar(c,mundoAtual(),sitAtual(),PAINEL.prog);
  PAINEL.run={s,modo,t:0,dur:0.6,linha:null,ev:null,tStep:1,eventos:[]};
  PAINEL.sel=null;
  if(PAINEL.area&&PAINEL.area.aoIniciar)PAINEL.area.aoIniciar(s);
}
/* antes de executar no modo Escrever, o texto é lido e o painel volta às linhas (para mostrar a linha da vez) */
function prepararTexto(){if(!PAINEL.texto)return true;if(!lerTexto(false))return false;PAINEL.texto=false;return true;}
/* previsão: nas etapas que trazem código pronto, antes da primeira tentativa o jogador diz o que espera que aconteça;
   no fim da tentativa, o painel confere. Dá para pular. */
function pedirPrevisao(continuar){
  const c=PAINEL.cfg;if(!c.previsao||G.learn[c.id]||PAINEL.previsao[c.id])return false;
  const box=$('pPrev'),ops=box.querySelector('.ops');box.querySelector('.q').textContent='🔮 Previsão · '+c.previsao.pergunta;ops.textContent='';
  const fim=v=>{PAINEL.previsao[c.id]=v;box.hidden=true;SFX.click();continuar();};
  c.previsao.opcoes.forEach(op=>{const b=document.createElement('button');b.className='btn';b.textContent=op.t;b.onclick=()=>fim({t:op.t,ok:op.ok,conferir:true});ops.appendChild(b);});
  const pb=document.createElement('button');pb.className='btn pular';pb.textContent='Pular';pb.onclick=()=>fim({pulou:true});ops.appendChild(pb);
  box.hidden=false;painelMsg('Antes de executar, pense: o que este programa vai fazer? Escolha uma resposta (ou pule).','');aVista(box);
  return true;
}
function conferirPrevisao(c,ok){const p=PAINEL.previsao[c.id];if(!p||!p.conferir)return'';p.conferir=false;
  return'🔮 Sua previsão: «'+p.t+'» — '+(p.ok===ok?'você acertou! ':'o resultado foi outro; observe o mecanismo para entender por quê. ');}
function painelExecutar(){
  if(rodandoAgora()){if(PAINEL.run.modo==='passo'){PAINEL.run.modo='exec';PAINEL.run.t=PAINEL.run.dur;renderPainel();}return;}
  if(pedirPrevisao(painelExecutar))return;
  if(!prepararTexto())return;
  novaExecucao('exec');PAINEL.run.t=PAINEL.run.dur*0.6;renderPainel();painelMsg('Executando…','passo');
}
function painelPassoBtn(){
  if(rodandoAgora()&&PAINEL.run.modo==='exec')return;
  if(!PAINEL.run||PAINEL.run.s.fim){if(pedirPrevisao(painelPassoBtn))return;if(!prepararTexto())return;novaExecucao('passo');}
  executarUm();
}
function painelParar(render){
  const r=PAINEL.run;if(!r)return;
  if(!r.s.fim){PAINEL.parado={env:r.s.env,ws:r.s.ws,ev:r.ev,linha:r.linha};if(render!==false)painelMsg('Tentativa parada'+(r.linha?' na linha '+LANG.numeroLinha(r.s.prog,r.linha):'')+'. Toque em ↺ Reiniciar para começar outra tentativa (o mecanismo volta ao começo e o programa fica), ou edite o programa.','');}
  else PAINEL.parado={env:r.s.env,ws:r.s.ws,ev:r.ev,linha:r.linha,erroLinha:r.s.erro&&r.s.erro.linha};
  PAINEL.run=null;if(render!==false)renderPainel();
}
function painelReiniciar(){PAINEL.run=null;PAINEL.parado=null;PAINEL.ultimoEv=null;mostrarErro(null);SFX.click();mensagemInicial();renderPainel();if(PAINEL.area&&PAINEL.area.aoReiniciar)PAINEL.area.aoReiniciar();}
function painelLimpar(){
  const c=PAINEL.cfg;
  if(c.inicial){confirmar('Voltar ao código original?','O programa desta etapa volta a ser o que veio escrito, com os erros para corrigir.','Voltar',()=>{PAINEL.prog=programaInicial(c);PAINEL.texto=false;PAINEL.cur={pai:null,ramo:null,i:PAINEL.prog.length};PAINEL.sel=null;programaMudou();PAINEL.run=null;mensagemInicial();renderPainel();});return;}
  if(!PAINEL.prog.length)return;
  confirmar('Limpar o programa?','Todas as linhas desta etapa saem do painel. As etapas já concluídas continuam concluídas.','Limpar',()=>{PAINEL.prog=[];PAINEL.texto=false;PAINEL.cur={pai:null,ramo:null,i:0};PAINEL.sel=null;programaMudou();PAINEL.run=null;mensagemInicial();renderPainel();});
}
/* dica do Lume: uma de cada vez (conceito → caminho → quase a solução); depois da terceira, ele repete e sugere o Passo */
const NIVEL_DICA=['o conceito','o caminho','quase a solução'];
function painelDica(){
  const c=PAINEL.cfg;if(!c.dicas)return;
  const antes=G.dicas[c.id]||0,n=Math.min(3,antes+1);G.dicas[c.id]=n;
  const t=antes>=3?'Lume: você já viu as três dicas. '+c.dicas.map((d,i)=>(i+1)+') '+d).join(' ')+' Experimente ⏭ Passo para ver o programa uma linha de cada vez e achar onde ele se separa do que você esperava.'
    :'Lume · Dica '+n+' de 3 ('+NIVEL_DICA[n-1]+'): '+c.dicas[n-1];
  painelMsg(t,'lume');SFX.page();renderPainel();salvar(false);
}
function executarUm(){
  const r=PAINEL.run;if(!r||r.s.fim)return;
  const ev=LANG.passo(r.s);if(!ev)return;
  r.ev=ev;r.eventos.push(ev);r.linha=ev.linha;r.tStep=0;PAINEL.ultimoEv=ev;
  /* sons e mensagem do passo */
  if(ev.tipo==='cmd')SFX.passo(r.eventos.length);else if(ev.tipo==='set')SFX.atribui();else if(ev.tipo==='se')SFX.decide(ev.res);else if(ev.tipo==='rep'||ev.tipo==='repFim'||ev.tipo==='enq')SFX.volta();
  if(PAINEL.area&&PAINEL.area.aoEvento)PAINEL.area.aoEvento(ev,r.s);
  /* a última instrução já mostra o resultado: sem um toque a mais só para "terminar" */
  if(!r.s.fim&&LANG.soFaltaFim(r.s)){const f=LANG.passo(r.s);if(f){r.eventos.push(f);r.evFim=f;}}
  if(r.s.fim)terminouExecucao();
  else painelMsg(LANG.narrar(ev,r.s),'passo');
  renderPainel();
}
function terminouExecucao(){
  const r=PAINEL.run,s=r.s,c=PAINEL.cfg,sit=sitAtual(),sig=LANG.assinatura(PAINEL.prog);
  if(c.etapa==='demo'){
    PAINEL.demoVisto[c.id+':'+PAINEL.demoIdx+(c.demo[PAINEL.demoIdx].todas?':'+sit.id:'')]=true;
    const fimMsg=s.ok?(LANG.narrar(r.evFim||r.ev,s)||'Fim do programa.'):LANG.explicar(s);
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
    PAINEL.passou[c.id][sit.id]=sig;delete PAINEL.falhou[c.id][sit.id];SFX.sucesso();mostrarErro(null);
    const falta=c.situacoes.filter(x=>PAINEL.passou[c.id][x.id]!==sig);
    /* o programa que resolveu a etapa fica guardado para o diário */
    if(!falta.length)G.solucoes[c.id]=LANG.clonar(PAINEL.prog);
    const pv=conferirPrevisao(c,true);
    let t=pv+(LANG.narrar(r.ev,s)||'')+(r.evFim&&r.evFim.msg&&r.evFim!==r.ev?' '+r.evFim.msg:'')+(s.aviso?' '+s.aviso:'');
    if(!falta.length){t=pv+c.sucesso+(s.aviso?' '+s.aviso:'');painelMsg(t,'ok');if(!G.learn[c.id])concluirDesafio(c);else salvar(false);}
    else{painelMsg((t?t+' ':'')+'Deu certo em '+sit.nome+'. Agora teste o mesmo programa em '+falta.map(x=>x.nome).join(' e ')+'.','ok');}
  }else{
    PAINEL.falhou[c.id][sit.id]=sig;SFX.erroProg();
    const x=LANG.explicarErro(s);mostrarErro(x);const pv=conferirPrevisao(c,false);
    painelMsg(pv+(x.cat==='objetivo'?'O programa rodou até o fim, mas o objetivo ainda não foi alcançado. Observe o mecanismo, leia a explicação e corrija.'+(s.aviso?' '+s.aviso:'')
      :(x.linha?'O programa parou na linha '+x.linha+'.':'O programa parou.')+' Observe o mecanismo, leia a explicação e corrija.'+(s.aviso?' '+s.aviso:'')),'erro');
  }
}
function concluirDesafio(c){
  G.learn[c.id]=true;guardarPrograma();
  if(RELIC_KEYS.indexOf(c.tumba)>=0&&saberOk(c.tumba))saberConcluido(c.tumba);
  if(PAINEL.area&&PAINEL.area.aoConcluir)PAINEL.area.aoConcluir(c);
  if(PAINEL.area)acenderTochaProgresso(PAINEL.area,c.id);
  salvar(false);renderPainel();
  const l=desafiosDa(c.tumba),prox=l[l.indexOf(c)+1];
  if(prox&&c.etapa!=='demo')setTimeout(()=>{if(PAINEL.aberto&&PAINEL.cfg===c)toast('Etapa liberada: '+prox.titulo+'. Toque nela no alto do painel.','good');},400);
  if(!prox&&RELIC_KEYS.indexOf(c.tumba)>=0)setTimeout(()=>{if(PAINEL.aberto&&PAINEL.cfg===c)toast('Todas as etapas desta tumba estão concluídas. Feche o painel e procure a relíquia.','good');},400);
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
