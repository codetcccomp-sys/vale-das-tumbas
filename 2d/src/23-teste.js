/* ====================== gancho de teste ======================
   Só entra na compilação de testes (build/teste/, ver build.sh): a versão pública não leva este arquivo.
   Nela, quando a página abre com #vt no endereço, os testes automáticos usam window.__vt para ler o estado e
   para teletransportar o explorador. */
function ganchoTeste(){
  window.__vtPularTreino=location.hash.indexOf('treino')<0;
  window.__vt={G,R,AREAS,TOMBS,LANG,DESAFIO,SAVE2D,PAINEL,IN,
    ir(x,y,dir){posicionar(x,y,dir||G.p.dir);camSeguir(G.p.x,G.p.y,0,G.area,true);},
    quadros(n,dt){for(let i=0;i<(n||1);i++){passoJogo(dt||1/60,performance.now());}desenharJogo();},
    estado(){return{mode:G.mode,area:G.area&&G.area.id,x:G.p.x,y:G.p.y,hearts:G.hearts,relics:G.relics,learn:G.learn,saberes:saberesCount(),sec:Object.keys(G.sec).length,prompt:alvoInter?alvoInter.lb:null};},
    entrar(k){G.valePos={x:G.p.x,y:G.p.y};const A=areaTumba(k);G.curTomb=k;A.reiniciar&&A.reiniciar();trocarArea(A,A.spawn.x,A.spawn.y,A.spawn.dir);G.mode='play';},
    painel(k){const A=G.area;abrirPainel(k,A,A.focoPainel||{x:G.p.x,y:G.p.y});},
    /* vai até perto de um ponto e aperta o botão de ação; devolve o rótulo que estava em mira */
    usarEm(x,y,dir){posicionar(x,y,dir||'cima');camSeguir(G.p.x,G.p.y,0,G.area,true);passoJogo(1/60,performance.now());const lb=alvoInter?alvoInter.lb:null;apertar('usar');passoJogo(1/60,performance.now());return lb;},
    /* anda com o teclado simulado por um tempo (em passos de 1/60 s) */
    andar(dx,dy,seg,correr){const K=IN.keys;K.KeyA=dx<0;K.KeyD=dx>0;K.KeyW=dy<0;K.KeyS=dy>0;K.ShiftLeft=!!correr;const n=Math.round(seg*60);for(let i=0;i<n;i++)passoJogo(1/60,performance.now());K.KeyA=K.KeyD=K.KeyW=K.KeyS=K.ShiftLeft=false;for(let i=0;i<10;i++)passoJogo(1/60,performance.now());desenharJogo();return{x:G.p.x,y:G.p.y,hearts:G.hearts,area:G.area.id};},
    porta(k){const T=TOMBS[k];return k==='final'?{x:PIR.x,y:PIR.y+14}:{x:T.door.x*16+8,y:(T.door.y+1)*16+14};},
    painelEstado(){const r=PAINEL.run;return{aberto:PAINEL.aberto,cfg:PAINEL.cfg&&PAINEL.cfg.id,sit:PAINEL.sit,rodando:!!r&&!r.s.fim,fim:!!r&&r.s.fim,ok:!!r&&r.s.ok,erro:r&&r.s.erro?r.s.erro.tipo:null,msg:$('pMsg').textContent,prog:LANG.codigo(PAINEL.prog),eventos:r?r.eventos.length:0};},
    velocidade(v){PAINEL.vel=v;},
    lerSave(){return lerJson(SAVE2D_KEY);},
    escala(){return{W:R.W,H:R.H,k:R.k,dpr:R.dpr,cw:R.cv.width,ch:R.cv.height,longe:!!R.longeAtivo};}
  };
}
