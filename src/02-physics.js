/* ====================== estado do jogo ====================== */
const G={
  mode:'menu',               // menu | play | paused | diary | transition
  area:null,hearts:3,invuln:0,lantern:130,lanternOn:false,
  relics:{steam:false,diesel:false,atom:false,bio:false},
  diary:[],diaryNew:0,insc:{},sec:{},tombs:{},time:0.12,
  p:{x:0,y:0,z:150,vx:0,vz:0,vy:0,kx:0,kz:0,face:Math.PI,grounded:true,coyote:0,anim:0,stepAcc:0,speed:0,run:false},
  checkpoint:null,valePos:{x:0,z:150},trans:null,t:0,menuT:0,nightSeen:false
};
const PR=0.38,PH=1.75,STEP=0.42,GRAV=24,JUMPH=1.3,WALK=4.3,RUN=7.4;

/* ====================== áreas e colisores ======================
   Cada área (o Vale, cada tumba) é carregada separadamente e tem a própria lista de colisores.
   Caixas e cilindros verticais. O jogador é um cilindro; paredes empurram para fora, então
   mesmo com queda de quadros não dá para atravessar (passos de 60 Hz e deslocamento < espessura). */
function makeArea(name){return{name,group:new THREE.Group(),cols:[],terrain:null,bound:0,interact:[],lamps:[],dyn:[],guards:[],killY:-1e9,spawn:{x:0,y:0,z:0,face:0},metal:false};}
function colBox(a,x0,x1,z0,z1,y0,y1){const c={t:'b',x0,x1,z0,z1,y0,y1,on:true};a.cols.push(c);return c;}
function colCyl(a,x,z,r,y0,y1){const c={t:'c',x,z,r,y0,y1,on:true};a.cols.push(c);return c;}

function pushOut(a,x,z,y,r,h){
  for(let it=0;it<4;it++){
    let moved=false;
    for(let i=0;i<a.cols.length;i++){
      const c=a.cols[i];
      if(!c.on||y+STEP>=c.y1||y+h<=c.y0)continue;
      if(c.t==='b'){
        const cx=clamp(x,c.x0,c.x1),cz=clamp(z,c.z0,c.z1),dx=x-cx,dz=z-cz,d2=dx*dx+dz*dz;
        if(d2<r*r){
          if(d2>1e-9){const d=Math.sqrt(d2),p=r-d;x+=dx/d*p;z+=dz/d*p;}
          else{const pl=x-c.x0,pr=c.x1-x,pu=z-c.z0,pd=c.z1-z,m=Math.min(pl,pr,pu,pd);
            if(m===pl)x=c.x0-r;else if(m===pr)x=c.x1+r;else if(m===pu)z=c.z0-r;else z=c.z1+r;}
          moved=true;
        }
      }else{
        const dx=x-c.x,dz=z-c.z,rr=r+c.r,d2=dx*dx+dz*dz;
        if(d2<rr*rr){const d=Math.sqrt(d2)||1e-4,p=rr-d;x+=dx/d*p;z+=dz/d*p;moved=true;}
      }
    }
    if(!moved)break;
  }
  return[x,z];
}
/* altura do chão em (x,z) para quem está na altura y (só conta o que está até STEP acima dos pés) */
function groundAt(a,x,z,y){
  let g=a.terrain?a.terrain(x,z):-1e9;
  for(let i=0;i<a.cols.length;i++){
    const c=a.cols[i];if(!c.on||c.y1>y+STEP||c.y1<=g)continue;
    if(c.t==='b'){if(x>=c.x0-0.04&&x<=c.x1+0.04&&z>=c.z0-0.04&&z<=c.z1+0.04)g=c.y1;}
    else{const dx=x-c.x,dz=z-c.z;if(dx*dx+dz*dz<=c.r*c.r)g=c.y1;}
  }
  return g;
}
/* raio contra os colisores (para a câmera não entrar nas paredes). Devolve a fração livre do segmento.
   Caixas pelo método das placas; cilindros pelo círculo exato (a caixa envolvente bloqueava cantos livres). */
function rayBlock(a,ox,oy,oz,tx,ty,tz){
  const dx=tx-ox,dy=ty-oy,dz=tz-oz;let best=1;
  for(let i=0;i<a.cols.length;i++){
    const c=a.cols[i];if(!c.on||c.y1<oy-0.3||c.y1-c.y0<0.25)continue;
    let tmin=0,tmax=1;
    if(Math.abs(dy)<1e-9){if(oy<c.y0||oy>c.y1)continue;}
    else{let t1=(c.y0-oy)/dy,t2=(c.y1-oy)/dy;if(t1>t2){const s=t1;t1=t2;t2=s;}tmin=Math.max(tmin,t1);tmax=Math.min(tmax,t2);if(tmin>tmax)continue;}
    if(c.t==='b'){
      let miss=false;
      for(const[o,d,mn,mx]of[[ox,dx,c.x0,c.x1],[oz,dz,c.z0,c.z1]]){
        if(Math.abs(d)<1e-9){if(o<mn||o>mx){miss=true;break;}}
        else{let t1=(mn-o)/d,t2=(mx-o)/d;if(t1>t2){const s=t1;t1=t2;t2=s;}tmin=Math.max(tmin,t1);tmax=Math.min(tmax,t2);if(tmin>tmax){miss=true;break;}}
      }
      if(miss)continue;
    }else{
      const px=ox-c.x,pz=oz-c.z,A=dx*dx+dz*dz,B=px*dx+pz*dz,C=px*px+pz*pz-c.r*c.r;
      if(A<1e-9){if(C>0)continue;}
      else{const disc=B*B-A*C;if(disc<0)continue;const q=Math.sqrt(disc);tmin=Math.max(tmin,(-B-q)/A);tmax=Math.min(tmax,(-B+q)/A);if(tmin>tmax)continue;}
    }
    if(tmin<best)best=tmin;
  }
  return best;
}

/* ====================== jogador ====================== */
function updatePlayer(dt){
  const p=G.p,a=G.area,playing=G.mode==='play';
  const mv=playing?moveInput():{x:0,y:0,run:false};
  const len=Math.hypot(mv.x,mv.y);
  let wx=0,wz=0;
  /* direção de controle: quando a câmera gira sozinha (procurando espaço ou voltando para trás do personagem), o "para
     frente" do direcional continua o mesmo até soltar o direcional ou mexer na câmera; depois acompanha devagar */
  if(len<=0.02||CAMX.ctl===null||G.t-CAMX.lastInput<0.1)CAMX.ctl=cam.yaw;
  else CAMX.ctl+=clamp(wrapPi(cam.yaw-CAMX.ctl),-0.6*dt,0.6*dt);
  if(len>0.02){const sy=Math.sin(CAMX.ctl),cy=Math.cos(CAMX.ctl);wx=-sy*mv.y+cy*mv.x;wz=-cy*mv.y-sy*mv.x;const wl=Math.hypot(wx,wz)||1;wx/=wl;wz/=wl;}
  const run=mv.run&&len>0.35;
  const spd=(run?RUN:WALK)*Math.min(1,len);
  const k=1-Math.exp(-(p.grounded?16:5)*dt);
  p.vx+=(wx*spd-p.vx)*k;p.vz+=(wz*spd-p.vz)*k;
  p.kx*=Math.exp(-7*dt);p.kz*=Math.exp(-7*dt);
  let nx=p.x+(p.vx+p.kx)*dt,nz=p.z+(p.vz+p.kz)*dt;
  const r=pushOut(a,nx,nz,p.y,PR,PH);nx=r[0];nz=r[1];
  if(a.bound){const d=Math.hypot(nx,nz);if(d>a.bound){nx*=a.bound/d;nz*=a.bound/d;}}
  p.x=nx;p.z=nz;
  p.speed=Math.hypot(p.vx,p.vz);p.run=run&&p.speed>3;
  if(p.speed>0.4&&len>0.02)p.face+=wrapPi(Math.atan2(wx,wz)-p.face)*(1-Math.exp(-16*dt));
  /* vertical */
  if(p.grounded)p.coyote=0.1;else p.coyote-=dt;
  if(playing&&take('jump')&&(p.grounded||p.coyote>0)){p.vy=Math.sqrt(2*GRAV*JUMPH);p.grounded=false;p.coyote=0;SFX.jump();}
  p.vy=Math.max(-20,p.vy-GRAV*dt);
  const was=p.grounded,g=groundAt(a,p.x,p.z,p.y);let ny=p.y+p.vy*dt;
  if(p.vy<=0&&ny<=g+(was?0.25:0.001)){if(!was&&p.vy<-5)SFX.land(p.vy<-12);ny=g;p.vy=0;p.grounded=true;}else p.grounded=false;
  p.y=ny;
  if(p.y<a.killY&&playing)fellOff();
  /* passos e animação */
  p.stepAcc+=p.speed*dt;const stride=p.run?2.3:1.75;
  if(p.grounded&&p.speed>1.2&&p.stepAcc>stride){p.stepAcc=0;SFX.step(p.run,a.metal);}
  p.anim+=p.speed*dt*(p.run?1.35:1.6);
}

/* ====================== câmera em terceira pessoa com colisão ======================
   - Mede o espaço livre com três raios saindo da cabeça (centro e dois laterais, em leque) contra os colisores
     e contra o teto da área (a.camCeil). A câmera nunca passa desse espaço: não há distância mínima que a empurre
     para dentro de uma parede.
   - Se o espaço é curto, procura outra direção livre (girando e/ou subindo para olhar por cima) e vai até ela
     suavemente; se está colada, vai mais rápido. Não briga com o jogador: só age quando ele não mexe na câmera.
   - Com o personagem andando e sem toque na câmera, ela volta devagar para trás dele (câmera automática).
   - Diante de um vão ou no ar sobre um buraco, inclina para baixo e mira à frente, mostrando a borda e o pouso. */
const CAMX={lastInput:-9,ap:0,gap:0,look:0,best:null,scanT:0,space:9,ctl:null};
function camTouched(){CAMX.lastInput=G.t;}
function camCeil(a,x,z){const c=a.camCeil;return typeof c==='function'?c(x,z):c;}
function camSpace(a,tx,ty,tz,yaw,pitch,d,rays){
  const cp=Math.cos(pitch),dy=Math.sin(pitch),D=d+0.32;let f=1;   // o raio vai 0,32 m além: a margem até a parede vale também no limite
  for(const k of rays?[0,0.06,-0.06]:[0]){
    const yy=yaw+k*(1+1/(d*0.4)),ex=tx+Math.sin(yy)*cp*D,ez=tz+Math.cos(yy)*cp*D;
    const r=rayBlock(a,tx,ty,tz,ex,ty+dy*D,ez);if(r<f)f=r;}
  let L=Math.min(d,D*f-0.32*Math.min(1,D*f/0.9));
  const ce=camCeil(a,tx,tz);if(ce!==undefined&&dy>0.01){const lim=(ce-ty)/dy-0.1;if(lim<L)L=lim;}
  /* enfeites presos às paredes (canos, pilastras, jardins) não têm colisor: a câmera fica dentro de uma faixa lateral */
  const bx=a.camBoundX,hx=Math.sin(yaw)*cp;if(bx&&Math.abs(hx)>1e-3){const lim=((hx>0?bx:-bx)-tx)/hx;if(lim<L)L=lim;}
  return Math.max(0.02,L);
}
function updateCamera(dt,playerModel){
  const p=G.p,a=G.area,playing=G.mode==='play';
  if(playing&&IN.pad.on&&Math.abs(IN.pad.rx||0)+Math.abs(IN.pad.ry||0)>0.01){cam.yaw-=(IN.pad.rx||0)*dt*2.6;cam.pitch=clamp(cam.pitch+(IN.pad.ry||0)*dt*1.8,-0.15,1.2);camTouched();}
  const idle=G.t-CAMX.lastInput;
  if(playing&&CFG.autoCam&&idle>1.4&&p.speed>1.2&&p.grounded){
    const dYaw=wrapPi(p.face+Math.PI-cam.yaw),rate=0.85*Math.min(1,p.speed/4.3)*(Math.abs(dYaw)>2.5?0.25:1);
    cam.yaw+=clamp(dYaw,-rate*dt,rate*dt);
  }
  let gapT=0;const fx=Math.sin(p.face),fz=Math.cos(p.face);
  if(playing&&a!==valeArea){
    if(p.speed>0.5&&groundAt(a,p.x+fx*2.4,p.z+fz*2.4,p.y+0.5)<p.y-1.2)gapT=1;
    if(!p.grounded&&groundAt(a,p.x,p.z,p.y+0.3)<p.y-1.4)gapT=1;
  }
  CAMX.gap+=(gapT-CAMX.gap)*(1-Math.exp(-3*dt));
  const tx=p.x,ty=p.y+1.45,tz=p.z,d=cam.want;
  let pitch=clamp(cam.pitch+CAMX.gap*0.24+CAMX.ap,-0.15,1.3);
  let L=camSpace(a,tx,ty,tz,cam.yaw,pitch,d,true);
  /* pouco espaço: procura (a cada 4 quadros) uma direção melhor, girando e/ou subindo */
  const want=Math.min(d,3.2);let apT=0;
  if(L<want){
    if(--CAMX.scanT<=0||!CAMX.best){
      CAMX.scanT=4;let best=null,bs=-1e9;
      for(const pp of[pitch,Math.max(pitch,0.75),1.1])for(const off of[0,0.45,-0.45,0.9,-0.9,1.5,-1.5,2.3,-2.3,Math.PI]){
        const l=Math.min(camSpace(a,tx,ty,tz,cam.yaw+off,pp,d,true),want),sc=l-Math.abs(off)*0.55-(pp-pitch)*0.9;
        if(sc>bs){bs=sc;best={off,pp,l};}
      }
      CAMX.best=best;
    }
    const b=CAMX.best;
    if(b&&b.l>L+0.3&&idle>0.35){
      const urgent=L<1.0,yr=urgent?3.2:1.6;
      if(b.off){const st=clamp(b.off,-yr*dt,yr*dt);cam.yaw+=st;b.off-=st;}
      apT=Math.max(0,b.pp-cam.pitch-CAMX.gap*0.24);
    }
  }else{CAMX.best=null;
    /* já há espaço: a subida automática só é desfeita quando a altura mais baixa também está livre (evita vaivém) */
    if(CAMX.ap>0.01){const lo=Math.max(0,CAMX.ap-0.25);apT=camSpace(a,tx,ty,tz,cam.yaw,clamp(cam.pitch+CAMX.gap*0.24+lo,-0.15,1.3),d,true)>=want?lo:CAMX.ap;}
  }
  CAMX.ap+=(apT-CAMX.ap)*(1-Math.exp(-(apT>CAMX.ap?(L<1?6:2.5):1.0)*dt));
  pitch=clamp(cam.pitch+CAMX.gap*0.24+CAMX.ap,-0.15,1.3);
  L=camSpace(a,tx,ty,tz,cam.yaw,pitch,d,true);CAMX.space=L;
  /* nunca além do espaço livre; afastar de novo é suave */
  if(L<cam.cur)cam.cur=L;else cam.cur=Math.min(L,cam.cur+dt*(1.5+(L-cam.cur)*2.5));
  const cp=Math.cos(pitch),sp=Math.sin(pitch);
  let cx=tx+Math.sin(cam.yaw)*cp*cam.cur,cy=ty+sp*cam.cur,cz=tz+Math.cos(cam.yaw)*cp*cam.cur;
  const gy=groundAt(a,cx,cz,cy+4);if(cy<gy+0.4)cy=gy+0.4;
  CAMX.look+=(CAMX.gap-CAMX.look)*(1-Math.exp(-4*dt));
  camera.position.set(cx,cy,cz);camera.lookAt(tx+fx*1.4*CAMX.look,ty+0.15-0.55*CAMX.look,tz+fz*1.4*CAMX.look);
  if(playerModel)playerModel.visible=cam.cur>0.85;
}
