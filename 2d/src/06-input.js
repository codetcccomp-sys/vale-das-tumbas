/* ====================== entrada: teclado, toque e controle ======================
   Teclado: WASD ou setas andam, Shift corre, E / Espaço / Enter interagem, J diário, T lanterna, Esc pausa.
   Toque: joystick que aparece onde o dedo encosta na metade esquerda (empurrado até o fim, corre) e botões grandes
   à direita (ação, lanterna). Andar e apertar botões funcionam ao mesmo tempo (vários dedos).
   Controle: analógico ou direcional anda, A interage, Y lanterna, X diário, Start pausa.
   Com o painel de programação aberto, nada disso move o explorador: o painel usa os próprios botões. */
const IN={mode:isTouch()?'touch':'kb',keys:Object.create(null),fila:new Set(),joy:{id:null,ox:0,oy:0,x:0,y:0,on:false},pad:null,padPrev:{},usouJoy:false};
function isTouch(){return('ontouchstart' in window)||(navigator.maxTouchPoints>0);}
function apertar(a){IN.fila.add(a);}
function take(a){if(IN.fila.has(a)){IN.fila.delete(a);return true;}return false;}
function limparEntrada(){IN.fila.clear();for(const k in IN.keys)IN.keys[k]=false;IN.joy.on=false;IN.joy.id=null;IN.joy.x=IN.joy.y=0;atualizarJoyDom();}
function modoEntrada(m){if(IN.mode===m)return;IN.mode=m;document.body.classList.toggle('touch',m==='touch');if(typeof aoMudarEntrada==='function')aoMudarEntrada();}

const TECLA_ACAO={KeyE:'usar',Space:'usar',Enter:'usar',KeyJ:'diario',KeyM:'mapa',KeyT:'lanterna',Escape:'pausa',KeyP:'pausa'};
addEventListener('keydown',e=>{
  if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
  modoEntrada('kb');
  const emTela=document.body.classList.contains('modal');
  if(!e.repeat&&TECLA_ACAO[e.code]){
    /* em menus e no painel, Espaço/Enter acionam o botão focado (comportamento normal do navegador) */
    if(emTela&&(e.code==='Space'||e.code==='Enter'))return;
    apertar(TECLA_ACAO[e.code]);
  }
  IN.keys[e.code]=true;
  if(!emTela&&['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code)>=0)e.preventDefault();
});
addEventListener('keyup',e=>{IN.keys[e.code]=false;});
addEventListener('blur',()=>limparEntrada());

/* joystick de toque: só na camada do jogo (#toque), metade esquerda; a direita fica para os botões */
function joyInit(){
  const z=document.getElementById('toque');
  const down=e=>{
    modoEntrada('touch');
    for(const t of e.changedTouches){
      if(IN.joy.id!==null)break;
      if(t.clientX>innerWidth*0.55)continue;
      IN.joy.id=t.identifier;IN.joy.ox=t.clientX;IN.joy.oy=t.clientY;IN.joy.x=0;IN.joy.y=0;IN.joy.on=true;IN.usouJoy=true;atualizarJoyDom();
    }
    e.preventDefault();
  };
  const move=e=>{for(const t of e.changedTouches){if(t.identifier!==IN.joy.id)continue;const R0=Math.min(60,innerWidth*0.12)+10;let dx=t.clientX-IN.joy.ox,dy=t.clientY-IN.joy.oy;const d=Math.hypot(dx,dy);
      if(d>R0*1.6){IN.joy.ox+=dx/d*(d-R0*1.6);IN.joy.oy+=dy/d*(d-R0*1.6);dx=t.clientX-IN.joy.ox;dy=t.clientY-IN.joy.oy;}
      IN.joy.x=clamp(dx/R0,-1.3,1.3);IN.joy.y=clamp(dy/R0,-1.3,1.3);atualizarJoyDom();}e.preventDefault();};
  const up=e=>{for(const t of e.changedTouches){if(t.identifier===IN.joy.id){IN.joy.id=null;IN.joy.on=false;IN.joy.x=IN.joy.y=0;atualizarJoyDom();}}};
  z.addEventListener('touchstart',down,{passive:false});z.addEventListener('touchmove',move,{passive:false});
  z.addEventListener('touchend',up);z.addEventListener('touchcancel',up);
  /* botões de toque: disparam no toque (não no clique), com vários dedos ao mesmo tempo */
  for(const b of document.querySelectorAll('[data-acao]')){
    b.addEventListener('touchstart',e=>{modoEntrada('touch');apertar(b.dataset.acao);b.classList.add('on');e.preventDefault();e.stopPropagation();},{passive:false});
    b.addEventListener('touchend',()=>b.classList.remove('on'));b.addEventListener('touchcancel',()=>b.classList.remove('on'));
    b.addEventListener('click',()=>{apertar(b.dataset.acao);});
  }
  document.body.classList.toggle('touch',IN.mode==='touch');
}
function atualizarJoyDom(){
  const j=document.getElementById('joy');if(!j)return;
  j.hidden=!IN.joy.on;if(!IN.joy.on)return;
  j.style.left=IN.joy.ox+'px';j.style.top=IN.joy.oy+'px';
  const R0=Math.min(60,innerWidth*0.12)+10,k=Math.min(1,Math.hypot(IN.joy.x,IN.joy.y)),a=Math.atan2(IN.joy.y,IN.joy.x);
  j.firstElementChild.style.transform='translate('+(Math.cos(a)*k*R0)+'px,'+(Math.sin(a)*k*R0)+'px)';
}
/* controle */
function lerControle(){
  const gp=navigator.getGamepads?navigator.getGamepads():null;let p=null;if(gp)for(const g of gp)if(g&&g.connected){p=g;break;}
  IN.pad=p;if(!p)return;
  const bt=i=>!!(p.buttons[i]&&p.buttons[i].pressed),map={0:'usar',3:'lanterna',2:'diario',9:'pausa'};
  for(const i in map){const on=bt(+i);if(on&&!IN.padPrev[i]){apertar(map[i]);modoEntrada('pad');}IN.padPrev[i]=on;}
  if(Math.hypot(p.axes[0]||0,p.axes[1]||0)>0.3)modoEntrada('pad');
}
/* direção de movimento: vetor (x,y) com |v| ≤ 1 e se está correndo */
function movimento(){
  let x=0,y=0,run=false;const K=IN.keys;
  if(K.KeyA||K.ArrowLeft)x-=1;if(K.KeyD||K.ArrowRight)x+=1;if(K.KeyW||K.ArrowUp)y-=1;if(K.KeyS||K.ArrowDown)y+=1;
  run=!!(K.ShiftLeft||K.ShiftRight);
  if(IN.joy.on){const d=Math.hypot(IN.joy.x,IN.joy.y);if(d>0.18){x=IN.joy.x;y=IN.joy.y;run=d>1.05;}}
  const p=IN.pad;if(p){const ax=p.axes[0]||0,ay=p.axes[1]||0;if(Math.hypot(ax,ay)>0.22){x=ax;y=ay;run=Math.hypot(ax,ay)>0.92||!!(p.buttons[4]&&p.buttons[4].pressed);}
    if(p.buttons[12]&&p.buttons[12].pressed)y=-1;if(p.buttons[13]&&p.buttons[13].pressed)y=1;if(p.buttons[14]&&p.buttons[14].pressed)x=-1;if(p.buttons[15]&&p.buttons[15].pressed)x=1;}
  const d=Math.hypot(x,y);if(d>1){x/=d;y/=d;}
  return{x,y,run};
}
