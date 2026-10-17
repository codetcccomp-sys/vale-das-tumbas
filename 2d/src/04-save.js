/* ====================== salvamento da versão 2D e migração do jogo 3D ======================
   Lógica pura (sem DOM): os testes chamam estas funções num vm. A leitura e a escrita no navegador ficam em 20-game.js.
   - A versão 2D usa a própria chave (vale_das_tumbas_2d), com número de versão. O save do 3D (vale_das_tumbas_save)
     nunca é alterado nem apagado: ele só é lido para migrar as conquistas na primeira vez.
   - Cada campo é conferido. Um campo estragado volta ao valor neutro (e marca fixed) em vez de descartar tudo.
   - As relíquias trazidas do 3D voltam "adormecidas": o saber de cada tumba é controlado à parte (learn), então
     quem já venceu uma tumba no 3D pode revisitá-la e fazer os desafios educativos. */
const SAVE2D_KEY='vale_das_tumbas_2d',CFG2D_KEY='vale_das_tumbas_2d_cfg',SAVE3D_KEY='vale_das_tumbas_save',SAVE2D_VER=1;
for(const k in SABERES)ENTRIES[SABER_ENTRY[k]]={t:'Saber: '+SABERES[k].nome,s:SABERES[k].resumo,cod:SABERES[k].exemplo};
ENTRIES.saber_tudo={t:'Saber: tudo junto',s:'Um programa de verdade mistura tudo: a ordem das placas, contêineres que guardam valores, decisões que escolhem o caminho e repetições que poupam trabalho.',cod:DESAFIO.c1.exemplo.codigo};

const SAVE2D=(function(){
  const obj=o=>!!o&&typeof o==='object'&&!Array.isArray(o),num=n=>typeof n==='number'&&isFinite(n);
  const hora=t=>t>=0&&t<1?t:((t%1)+1)%1;   // hora do dia em [0,1) sem arredondar o que já está certo
  const INSC_IDS=INSC.map(i=>i.id);
  /* save novo, vazio */
  function novo(){return{v:SAVE2D_VER,relics:{steam:false,diesel:false,atom:false,bio:false},learn:{},progs:{},diary:[],insc:{},sec:{},abertas:[],done:false,time:0.12,pos:null,tomb:null,migr:null};}
  /* confere um save 2D. Devolve null quando não há nada aproveitável. */
  function limpar(d){
    if(!obj(d)||d.v!==SAVE2D_VER)return null;
    let fixed=false;const bad=()=>{fixed=true;};
    const s=novo();
    if(Array.isArray(d.diary)){for(const id of d.diary){if(typeof id==='string'&&ENTRIES[id]){if(s.diary.indexOf(id)<0)s.diary.push(id);}else bad();}}else if(d.diary!==undefined)bad();
    if(obj(d.learn)){for(const k in d.learn){if(DESAFIO[k]&&d.learn[k]===true)s.learn[k]=true;else bad();}}else if(d.learn!==undefined)bad();
    if(obj(d.relics)){for(const k of RELIC_KEYS){const v=d.relics[k];if(v!==undefined&&typeof v!=='boolean')bad();s.relics[k]=v===true;}}else if(d.relics!==undefined)bad();
    /* a anotação de cada relíquia só existe depois de pegá-la: uma relíquia perdida no save é deduzida dela */
    for(const k of RELIC_KEYS)if(!s.relics[k]&&s.diary.indexOf(RELIC_INFO[k].diary)>=0){s.relics[k]=true;bad();}
    if(obj(d.progs)){for(const k in d.progs){const cfg=DESAFIO[k];if(!cfg||cfg.etapa==='demo'||cfg.etapa==='classificar'){bad();continue;}
      const r=LANG.limpar(d.progs[k],cfg);if(r.fixed)bad();s.progs[k]=r.prog;}}else if(d.progs!==undefined)bad();
    const pick=(src,ids,val)=>{const o={};if(src===undefined)return o;if(!obj(src)){bad();return o;}for(const k in src){if(ids.indexOf(k)<0)bad();else if(src[k])o[k]=val;}return o;};
    s.insc=pick(d.insc,INSC_IDS,1);s.sec=pick(d.sec,SEC_IDS,true);
    if(Array.isArray(d.abertas)){for(const a of d.abertas){if(typeof a==='string'&&/^[a-z]+_[a-z0-9]+$/.test(a)&&a.length<=24&&s.abertas.length<60){if(s.abertas.indexOf(a)<0)s.abertas.push(a);}else bad();}}else if(d.abertas!==undefined)bad();
    if(d.done!==undefined&&typeof d.done!=='boolean')bad();s.done=d.done===true;
    if(num(d.time))s.time=hora(d.time);else if(d.time!==undefined)bad();
    if(d.pos!==undefined&&d.pos!==null){if(obj(d.pos)&&num(d.pos.x)&&num(d.pos.y)&&d.pos.x>=0&&d.pos.x<=VALE_W&&d.pos.y>=0&&d.pos.y<=VALE_H)s.pos={x:d.pos.x,y:d.pos.y};else bad();}
    if(d.tomb!==undefined&&d.tomb!==null){if(typeof d.tomb==='string'&&TOMBS[d.tomb])s.tomb=d.tomb;else bad();}
    if(obj(d.migr))s.migr={relics:num(d.migr.relics)?clamp(Math.round(d.migr.relics),0,4):0,done3d:d.migr.done3d===true};
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
    s.migr={relics:RELIC_KEYS.filter(k=>d3.relics[k]).length,done3d:!!d3.done};
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
    return{v:SAVE2D_VER,relics:Object.assign({},st.relics),learn:Object.assign({},st.learn),progs:st.progs,diary:st.diary.slice(),insc:st.insc,sec:st.sec,
      abertas:st.abertas.slice(),done:!!st.done,time:st.time,pos:st.pos?{x:st.pos.x,y:st.pos.y}:null,tomb:st.tomb||null,migr:st.migr||null};
  }
  return{novo,limpar,ler3d,migrar,posSegura,montar};
})();
