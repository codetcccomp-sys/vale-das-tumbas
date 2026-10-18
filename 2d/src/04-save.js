/* ====================== salvamento da versão 2D e migração do jogo 3D ======================
   Lógica pura (sem DOM): os testes chamam estas funções num vm. A leitura e a escrita no navegador ficam em 20-game.js.
   - A versão 2D usa a própria chave (vale_das_tumbas_2d), com número de versão. O save do 3D (vale_das_tumbas_save)
     nunca é alterado nem apagado: ele só é lido para migrar as conquistas na primeira vez.
   - Cada campo é conferido. Um campo estragado volta ao valor neutro (e marca fixed) em vez de descartar tudo.
   - As relíquias trazidas do 3D voltam "adormecidas": o saber de cada tumba é controlado à parte (learn), então
     quem já venceu uma tumba no 3D pode revisitá-la e fazer os desafios educativos.
   - rev conta as revisões do conteúdo: um save sem rev é de antes das etapas novas (treino, corrigir, elif, tochas).
     Nele, uma tumba que já estava completa ganha as etapas novas, e o treino conta como feito: o progresso não volta.
     A revisão 3 trouxe a ordem no treino (t2), a bomba dos Motores (d6) e a demonstração da Viva (bd): quem já tinha
     terminado o treino ganha t2, quem completou as outras etapas dos Motores ganha d6 e quem já começou a Viva ganha bd.
   - solucoes guarda o último programa que resolveu cada etapa (o diário mostra o programa do jogador).
   - pistas guarda as placas com ! já lidas; fixadas, as pistas que o jogador fixou no alto do painel (no máximo 3);
     marcas, as marcas de luz encontradas com a lanterna. */
const SAVE2D_KEY='vale_das_tumbas_2d',CFG2D_KEY='vale_das_tumbas_2d_cfg',SAVE3D_KEY='vale_das_tumbas_save',SAVE2D_VER=1,SAVE2D_REV=4;
for(const k in SABERES)ENTRIES[SABER_ENTRY[k]]={t:'Saber: '+SABERES[k].nome,s:SABERES[k].resumo,cod:SABERES[k].exemplo};
for(const k in PISTAS)ENTRIES['pista_'+k]={t:'Pista: '+PISTAS[k].nome,s:PISTAS[k].texto};
for(const k in MARCAS)ENTRIES['marca_'+k]={t:'Marca de luz: '+MARCAS[k].t,s:MARCAS[k].s};
ENTRIES.saber_tudo={t:'Saber: tudo junto',s:'Um programa de verdade mistura tudo: a ordem das linhas, variáveis que guardam valores, decisões que escolhem o caminho e repetições que poupam trabalho.',cod:DESAFIO.c1.exemplo.codigo};

const SAVE2D=(function(){
  const obj=o=>!!o&&typeof o==='object'&&!Array.isArray(o),num=n=>typeof n==='number'&&isFinite(n);
  const hora=t=>t>=0&&t<1?t:((t%1)+1)%1;   // hora do dia em [0,1) sem arredondar o que já está certo
  const INSC_IDS=INSC.map(i=>i.id);
  /* save novo, vazio */
  function novo(){return{v:SAVE2D_VER,rev:SAVE2D_REV,relics:{steam:false,diesel:false,atom:false,bio:false},learn:{},progs:{},diary:[],insc:{},sec:{},abertas:[],done:false,time:0.12,pos:null,tomb:null,migr:null,
    treino:{feito:false,passo:0,manivela:false},dicas:{},poi:{},guia:false,solucoes:{},pistas:{},fixadas:[],marcas:{},reg:{},regDesde:null};}
  /* registro de aprendizagem (revisão 4): por etapa, tentativas (t), tentativas com erro (e), resposta da previsão
     (p: c certa, e errada, p pulou) e o dia da conclusão (d). Só existe o que foi jogado desde esta versão. */
  const DIA=/^\d{4}-\d\d-\d\d$/;
  function limparReg(src,bad){const o={};if(src===undefined)return o;if(!obj(src)){bad();return o;}
    for(const k in src){const r=src[k];if(!DESAFIO[k]||!obj(r)){bad();continue;}const x={};
      for(const f of['t','e']){if(r[f]===undefined)continue;if(Number.isInteger(r[f])&&r[f]>=0&&r[f]<=99999)x[f]=r[f];else bad();}
      if(r.p!==undefined){if(['c','e','p'].indexOf(r.p)>=0)x.p=r.p;else bad();}
      if(r.d!==undefined){if(typeof r.d==='string'&&DIA.test(r.d))x.d=r.d;else bad();}
      o[k]=x;}
    return o;}
  /* confere um save 2D. Devolve null quando não há nada aproveitável. */
  function limpar(d){
    if(!obj(d)||d.v!==SAVE2D_VER)return null;
    let fixed=false;const bad=()=>{fixed=true;};
    const s=novo();
    if(Array.isArray(d.diary)){for(const id of d.diary){if(typeof id==='string'&&ENTRIES[id]){if(s.diary.indexOf(id)<0)s.diary.push(id);}else bad();}}else if(d.diary!==undefined)bad();
    if(obj(d.learn)){for(const k in d.learn){if(DESAFIO[k]&&d.learn[k]===true)s.learn[k]=true;else bad();}}else if(d.learn!==undefined)bad();
    const antigo=d.rev===undefined;
    if(antigo)for(const k in ETAPAS_ANTIGAS)if(ETAPAS_ANTIGAS[k].every(id=>s.learn[id]))for(const c of desafiosDa(k))s.learn[c.id]=true;
    if(obj(d.relics)){for(const k of RELIC_KEYS){const v=d.relics[k];if(v!==undefined&&typeof v!=='boolean')bad();s.relics[k]=v===true;}}else if(d.relics!==undefined)bad();
    /* a anotação de cada relíquia só existe depois de pegá-la: uma relíquia perdida no save é deduzida dela */
    for(const k of RELIC_KEYS)if(!s.relics[k]&&s.diary.indexOf(RELIC_INFO[k].diary)>=0){s.relics[k]=true;bad();}
    const progsDe=(src,dst)=>{if(obj(src)){for(const k in src){const cfg=DESAFIO[k];if(!cfg||cfg.etapa==='demo'||cfg.etapa==='classificar'){bad();continue;}
      const r=LANG.limpar(src[k],cfg);if(r.fixed)bad();dst[k]=r.prog;}}else if(src!==undefined)bad();};
    progsDe(d.progs,s.progs);progsDe(d.solucoes,s.solucoes);
    const pick=(src,ids,val)=>{const o={};if(src===undefined)return o;if(!obj(src)){bad();return o;}for(const k in src){if(ids.indexOf(k)<0)bad();else if(src[k])o[k]=val;}return o;};
    s.insc=pick(d.insc,INSC_IDS,1);s.sec=pick(d.sec,SEC_IDS,true);
    if(Array.isArray(d.abertas)){for(const a of d.abertas){if(typeof a==='string'&&/^[a-z]+_[a-z0-9]+$/.test(a)&&a.length<=24&&s.abertas.length<60){if(s.abertas.indexOf(a)<0)s.abertas.push(a);}else bad();}}else if(d.abertas!==undefined)bad();
    if(d.done!==undefined&&typeof d.done!=='boolean')bad();s.done=d.done===true;
    if(num(d.time))s.time=hora(d.time);else if(d.time!==undefined)bad();
    if(d.pos!==undefined&&d.pos!==null){if(obj(d.pos)&&num(d.pos.x)&&num(d.pos.y)&&d.pos.x>=0&&d.pos.x<=VALE_W&&d.pos.y>=0&&d.pos.y<=VALE_H)s.pos={x:d.pos.x,y:d.pos.y};else bad();}
    if(d.tomb!==undefined&&d.tomb!==null){if(typeof d.tomb==='string'&&TOMBS[d.tomb])s.tomb=d.tomb;else bad();}
    if(obj(d.migr))s.migr={relics:num(d.migr.relics)?clamp(Math.round(d.migr.relics),0,4):0,done3d:d.migr.done3d===true};
    /* treino: quem já jogava antes desta versão não precisa refazer */
    if(antigo)s.treino.feito=true;
    else if(d.treino!==undefined){if(obj(d.treino)){s.treino.feito=d.treino.feito===true;s.treino.manivela=d.treino.manivela===true;
      if(num(d.treino.passo))s.treino.passo=clamp(Math.round(d.treino.passo),0,TREINO_PASSOS);else if(d.treino.passo!==undefined)bad();}else bad();}
    if(obj(d.dicas)){for(const k in d.dicas){const n=d.dicas[k];if(DESAFIO[k]&&Number.isInteger(n)&&n>=0&&n<=3)s.dicas[k]=n;else bad();}}else if(d.dicas!==undefined)bad();
    s.poi=pick(d.poi,POI_IDS,true);
    if(d.guia!==undefined&&typeof d.guia!=='boolean')bad();s.guia=d.guia===true;
    s.pistas=pick(d.pistas,PISTA_IDS,true);s.marcas=pick(d.marcas,MARCA_IDS,true);
    if(Array.isArray(d.fixadas)){for(const id of d.fixadas){if(PISTA_IDS.indexOf(id)>=0&&s.pistas[id]){if(s.fixadas.indexOf(id)<0&&s.fixadas.length<3)s.fixadas.push(id);}else bad();}}else if(d.fixadas!==undefined)bad();
    /* revisão 3: etapas novas para quem já tinha passado do ponto onde elas entram */
    const rev=num(d.rev)?d.rev:1;
    if(rev<3){
      if(s.treino.feito)s.learn[ETAPAS_REV3.treino]=true;
      if(desafiosDa('diesel').every(c=>c.id===ETAPAS_REV3.diesel||s.learn[c.id]))s.learn[ETAPAS_REV3.diesel]=true;
      if(desafiosDa('bio').some(c=>s.learn[c.id]))s.learn[ETAPAS_REV3.bio]=true;
    }
    s.reg=limparReg(d.reg,bad);
    if(d.regDesde!==undefined&&d.regDesde!==null){if(typeof d.regDesde==='string'&&DIA.test(d.regDesde))s.regDesde=d.regDesde;else bad();}
    if(rev<4&&desafiosDa('atom').every(c=>c.id===ETAPAS_REV4.atom||s.learn[c.id]))s.learn[ETAPAS_REV4.atom]=true;
    s.fixed=fixed;
    return s;
  }
  /* confere um save do jogo 3D (mesmas regras do cleanSave de lá) */
  function ler3d(d){
    if(!obj(d)||d.v!==1)return null;
    if(!obj(d.relics)&&!Array.isArray(d.diary)&&!obj(d.pos))return null;
    let fixed=false;const bad=()=>{fixed=true;};
    const diary=[];
    if(Array.isArray(d.diary)){for(const id of d.diary){if(typeof id==='string'&&ENTRIES[id]){if(diary.indexOf(id)<0)diary.push(id);}else bad();}}else bad();
    const done=d.done===true,relics={};
    for(const k of RELIC_KEYS){const v=obj(d.relics)?d.relics[k]:undefined;if(v!==undefined&&typeof v!=='boolean')bad();relics[k]=v===true||diary.indexOf(RELIC_INFO[k].diary)>=0||done;}
    const pick=(src,ids,val)=>{const o={};if(src===undefined)return o;if(!obj(src)){bad();return o;}for(const k in src){if(ids.indexOf(k)<0)bad();else if(src[k])o[k]=val;}return o;};
    const insc=pick(d.insc,INSC_IDS,1),sec=pick(d.sec,SEC_IDS,true);
    let pos=null;if(obj(d.pos)&&num(d.pos.x)&&num(d.pos.z))pos={x:d.pos.x,z:d.pos.z};else bad();
    let time=0.12;if(num(d.time))time=hora(d.time);else bad();
    const tomb=typeof d.tomb==='string'&&TOMBS[d.tomb]?d.tomb:null;
    return{relics,diary,insc,sec,done,time,pos,tomb,fixed};
  }
  /* converte um save 3D conferido num save 2D. livre(x,y) diz se o tile está livre no vale 2D (posição segura) */
  function migrar(d3,livre){
    const s=novo();
    for(const k of RELIC_KEYS)s.relics[k]=!!d3.relics[k];
    s.diary=d3.diary.slice();if(s.diary.indexOf('migrado')<0)s.diary.push('migrado');
    s.insc=Object.assign({},d3.insc);s.sec=Object.assign({},d3.sec);s.time=d3.time;
    s.migr={relics:RELIC_KEYS.filter(k=>d3.relics[k]).length,done3d:!!d3.done};s.treino.feito=true;
    if(d3.tomb){const T=TOMBS[d3.tomb];s.pos={x:T.out.x+0.5,y:T.out.y+0.5};}
    else if(d3.pos){const p=v3(d3.pos.x,d3.pos.z);s.pos=posSegura(p.x,p.y,livre);}
    s.fixed=d3.fixed;
    return s;
  }
  /* o tile livre mais próximo (procura em anéis crescentes; fora do vale ou sem lugar livre: o acampamento) */
  function posSegura(x,y,livre){
    const r=Math.hypot(x-VALE_C,y-VALE_C);if(!(r<=VALE_R-3)){const k=(VALE_R-3)/(r||1);x=VALE_C+(x-VALE_C)*k;y=VALE_C+(y-VALE_C)*k;}
    const cx=Math.floor(x),cy=Math.floor(y);
    for(let d=0;d<=12;d++)for(let dy=-d;dy<=d;dy++)for(let dx=-d;dx<=d;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==d)continue;
      if(livre(cx+dx,cy+dy))return{x:cx+dx+0.5,y:cy+dy+0.5};
    }
    return{x:VALE_C+0.5,y:147.5};
  }
  /* o que entra no save a partir do estado do jogo */
  function montar(st){
    const tr=st.treino||{feito:true,passo:0,manivela:false};
    return{v:SAVE2D_VER,rev:SAVE2D_REV,relics:Object.assign({},st.relics),learn:Object.assign({},st.learn),progs:st.progs,diary:st.diary.slice(),insc:st.insc,sec:st.sec,
      abertas:st.abertas.slice(),done:!!st.done,time:st.time,pos:st.pos?{x:st.pos.x,y:st.pos.y}:null,tomb:st.tomb||null,migr:st.migr||null,
      treino:{feito:!!tr.feito,passo:tr.passo|0,manivela:!!tr.manivela},dicas:Object.assign({},st.dicas||{}),poi:Object.assign({},st.poi||{}),guia:!!st.guia,solucoes:st.solucoes||{},
      pistas:Object.assign({},st.pistas||{}),fixadas:(st.fixadas||[]).slice(),marcas:Object.assign({},st.marcas||{}),reg:st.reg||{},regDesde:st.regDesde||null};
  }
  return{novo,limpar,ler3d,migrar,posSegura,montar};
})();
