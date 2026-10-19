/* ====================== Câmara Final · o Devorador do Vale ======================
   Prova final, entre as quatro tumbas e a Cidade-Jardim (adicional: não substitui nenhuma etapa). A porta do Vale leva
   primeiro a esta câmara; quando o guardião é purificado, o portão ao norte abre e leva à Cidade-Jardim. Quem já concluiu
   o desafio do Jardim (jogo salvo antes desta câmara) segue direto, sem refazer a luta.
   O chefe é uma criatura guardiã que, ao sentir o explorador, absorve a energia das relíquias e se transforma. Ele não é
   vencido pela força: cada fase é um programa que põe um saber à prova (sequência, variáveis, decisões, repetições).
   Estados visuais: dorme (pequeno) → transformado (gigante, com tentáculos) → enfraquecido (logo após cada fase) →
   purificado (volta ao tamanho original). Os golpes dos tentáculos avisam antes (círculo vermelho no chão) e ficam mais
   numerosos a cada fase concluída. Com o painel aberto o chefe não ataca.
   Arte do chefe: quadros da folha de sprites do autor (20c-bossarte.js). A origem de cada grupo de quadros é fixa (ORI), então
   trocar de quadro ou de estado nunca desloca a criatura. */
Object.assign(ENTRIES,{
  camara_enter:{t:'Câmara Final',s:'Antes da Cidade-Jardim há uma câmara fechada. Uma criatura pequena dorme no centro: é o guardião que os construtores deixaram para proteger o conhecimento das quatro tumbas.'},
  camara_fim:{t:'O guardião purificado',s:'O Devorador do Vale não precisava ser destruído, só entendido: foi o conhecimento das quatro tumbas que o acalmou. Ele voltou ao tamanho original e a passagem para a Cidade-Jardim se abriu.'}
});
const BOSS={x:14*16,y:10*16};   // pés do guardião
/* origem fixa de cada grupo de quadros: ponto (x=160 da célula de 320 px da folha, chão=287) em pixels do recorte a 50% */
const ORI={peq:{ax:17,ay:34},bol:{ax:47,ay:48},big:{ax:73,ay:122},fraco:{ax:77,ay:110}};
const GOLPE={aviso:1.3,fim:1.75,raio:20};   // segundos de aviso, vida do golpe e raio (o mesmo do círculo desenhado e da área que fere)
/* o guardião já foi purificado? (ou o jogo já tinha chegado à Cidade-Jardim antes desta câmara existir) */
function bossFeito(){return !!G.learn.c1||desafiosDa('camara').every(d=>G.learn[d.id]);}
const MAPA_CAMARA=[
  '############################',
  '############....############',
  '############....############',
  '#############..#############',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '####....................####',
  '#############..#############',
  '#############..#############',
  '#############..#############',
  '############################'
];
Object.assign(OBJS,{
  /* nuvem de bolhas e guardião vêm da arte do autor (bossArte) */
  bValvula(aberta,f){
    const c=cnv(26,28),g=ctx2(c),C=aberta?'#5dff7a':'#d8a24a',a=(aberta?f:0)*0.5;
    P.r(g,11,12,4,14,'#6a5a48');P.r(g,5,24,16,3,'#4a3a2a');P.anel(g,13,9,8,2,C);
    for(let i=0;i<4;i++){const t=i*Math.PI/2+a;P.linha(g,13,9,13+Math.cos(t)*7,9+Math.sin(t)*7,C);}
    P.circ(g,13,9,2,'#8a6a3a');return contorno(c,'#0b0705');
  },
  bEspelho(alinhado,f){
    const c=cnv(22,30),g=ctx2(c);
    P.r(g,10,18,3,10,'#6a5a48');P.r(g,5,26,13,3,'#4a3a2a');
    P.elip(g,11,10,7,9,alinhado?'#fff2b8':'#8ab0c8');P.elip(g,11,10,5,7,alinhado?'#ffffff':'#bfe6ff');
    if(alinhado&&f%2)P.p(g,16,4,'#ffffff');else P.linha(g,8,5,13,14,'#ffffff');
    return contorno(c,'#0b0705');
  },
  bRessonador(ativo,f){
    const c=cnv(26,34),g=ctx2(c);
    P.r(g,4,26,18,6,'#6a5a48');P.r(g,6,22,14,5,'#8a7a62');P.r(g,6,22,14,1,'#bfae8c');
    P.circ(g,13,13,7,ativo?'#ffffff':'#7a5aa8');P.circ(g,13,13,5,ativo?'#ffd0ff':'#c9a6ff');P.p(g,11,10,'#ffffff');
    if(ativo)for(let i=0;i<6;i++){const t=i/6*TAU+f*0.4;P.p(g,13+Math.cos(t)*10,13+Math.sin(t)*10,'#fff2b8');}
    return contorno(c,'#0b0705');
  }
});
/* posições (em pixels) dos mecanismos da arena */
const ARENA={valvula:{x:6*16+8,y:11*16+14},espelhos:[{x:22*16+8,y:9*16+14},{x:22*16+8,y:13*16+14}],resso:{x:14*16+13,y:12*16+14}};
function irParaCidade(){
  transicao(()=>{const A=areaTumba('final');G.curTomb='final';A.reiniciar&&A.reiniciar();trocarArea(A,A.spawn.x,A.spawn.y,A.spawn.dir);G.lantern=100;G.lanternOn=false;salvar(false);},'Rumo à Cidade-Jardim…');
}
CONSTRUIR.camara=function(){
  const A=tumbaArea('camara','bio',MAPA_CAMARA,{'#':'parede','.':'chao'});
  A.som='bio';A.gastaLanterna=false;A.spawn={x:14*16,y:19*16,dir:'cima'};A.escuro=0.42;
  saidaVale(A,13,20);
  for(const[x,y]of[[5,5],[22,5],[5,16],[22,16],[13,1],[15,1]])lampada(A,x,y,'#c9a6ff',46);
  const lampsParedes=A.lampadas.slice();
  const B={acordou:false,trans:null,pur:null,puro:false,fracoAte:0,danoAte:0,golpes:[],prox:3,graca:0,fase:0};A.boss=B;
  /* a energia da câmara volta aos poucos durante a purificação (0 = apagada, 1 = restaurada) */
  const restaura=()=>B.puro?1:B.pur!==null?clamp((B.pur-3.4)/1.2,0,1):0;
  for(const l of lampsParedes){const r0=l.r;Object.defineProperty(l,'r',{get:()=>r0*(1+0.4*restaura())});}
  const fases=()=>desafiosDa('camara').filter(d=>G.learn[d.id]).length;
  /* estado dos mecanismos: o que o painel mostra, ou o estado geral da sala */
  const arena=()=>{const v=PAINEL.aberto&&PAINEL.area===A?painelVis():null;
    if(v&&v.cfg.mundo==='arenaSeq')return v.ws;
    return G.learn.k1?{energia:false,valvula:true,espelhos:true,disparou:true}:{energia:true,valvula:false,espelhos:false,disparou:false};};
  const vivo=()=>!bossFeito()||(B.pur!==null);
  /* mecanismos */
  const oV=objeto(A,SPR.get('bValvula',false,0),ARENA.valvula.x,ARENA.valvula.y,{col:[-8,-5,8,0]});oV.desenho=(g,ob,t)=>blit(g,SPR.get('bValvula',!!arena().valvula,Math.floor(t*4)%8),ob.x,ob.y,ob.ax,ob.ay);
  ARENA.espelhos.forEach((p,i)=>{const o=objeto(A,SPR.get('bEspelho',false,0),p.x,p.y,{col:[-6,-5,6,0]});o.desenho=(g,ob,t)=>blit(g,SPR.get('bEspelho',!!arena().espelhos,Math.floor(t*3+i)%2),ob.x,ob.y,ob.ax,ob.ay);});
  const oR=objeto(A,SPR.get('bRessonador',false,0),ARENA.resso.x,ARENA.resso.y,{col:[-9,-5,9,0]});oR.desenho=(g,ob,t)=>blit(g,SPR.get('bRessonador',!!arena().disparou,Math.floor(t*5)%8),ob.x,ob.y,ob.ax,ob.ay);
  A.lampadas.push({x:ARENA.valvula.x,y:ARENA.valvula.y-14,get r(){return arena().valvula?30:10;},get cor(){return arena().valvula?'#5dff7a':'#d8a24a';}});
  A.lampadas.push({x:ARENA.resso.x,y:ARENA.resso.y-16,get r(){return arena().disparou?40:16;},cor:'#c9a6ff'});
  /* o corpo do guardião bloqueia a passagem (só a base) */
  const sGrande=solido(A,BOSS.x-46,BOSS.y-14,BOSS.x+46,BOSS.y),sPeq=solido(A,BOSS.x-9,BOSS.y-6,BOSS.x+9,BOSS.y);sGrande.on=false;
  /* placas com as regras dos mecanismos (as pistas desta fase) */
  placaLeitura(A,8*16+8,15*16+14,'Placa da válvula','O volante da válvula é preso pelo campo de energia: com o campo ligado ele não gira. Cortada a energia, a válvula abre e drena a seiva dos tentáculos.','#c9a6ff');
  placaLeitura(A,20*16+8,15*16+14,'Placa do ressonador','O ressonador só dispara quando a seiva já foi drenada (válvula aberta) e os espelhos estão alinhados. Os espelhos não dependem de nenhum outro mecanismo.','#c9a6ff');
  /* terminal e Lume */
  const foco={x:14*16,y:11*16};A.focoPainel=foco;
  terminal(A,14,15,'camara',foco,'consoleCity','Programar o ressonador');
  criarLume(A,18.5,16.5,'camara');
  /* saída para a Cidade-Jardim: o portão abre quando o guardião é purificado */
  portao(A,13,3,2,'portaoVinha',()=>bossFeito());
  interacao(A,{x:14*16,y:2*16+4,r:26,alto:40,nome:'Passagem para a Cidade-Jardim',label:()=>bossFeito()?'Seguir para a Cidade-Jardim':null,use:()=>irParaCidade()});
  /* a criatura pequena, depois de purificada */
  interacao(A,{x:BOSS.x,y:BOSS.y+8,r:24,alto:20,nome:'Guardião',label:()=>B.puro?'Cumprimentar a criatura':null,use:()=>{SFX.bioChime();toast('A criatura pisca devagar e esfrega o focinho na sua mão. A energia das quatro relíquias brilha de novo nas paredes.','good');}});
  /* ---------- o guardião: estados, golpes e desenho ---------- */
  const PUR={nucleo:0.8,fraco:1.8,encolhe:3.2,luz:3.4,fim:4.6};   // marcos da purificação, em segundos
  /* golpes: caem perto do explorador, mas nunca sobre os mecanismos, o terminal, o Lume ou a saída, nem uns sobre os outros */
  const protegidos=()=>[A.term,{x:18.5*16,y:16.5*16},ARENA.valvula,ARENA.espelhos[0],ARENA.espelhos[1],ARENA.resso,{x:8*16+8,y:15*16+14},{x:20*16+8,y:15*16+14}].filter(Boolean);
  const golpeLivre=(x,y)=>{
    for(const q of protegidos())if(Math.hypot(x-q.x,y-(q.y-8))<GOLPE.raio+16)return false;
    for(const o of B.golpes)if(Math.hypot(x-o.x,y-o.y)<GOLPE.raio*2+6)return false;
    return true;};
  const golpe=()=>{const p=G.p;
    for(let i=0;i<10;i++){
      const x=i<6?clamp(p.x+(Math.random()-0.5)*56,5*16,22*16):5*16+Math.random()*17*16,y=i<6?clamp(p.y+(Math.random()-0.5)*40,6*16,16*16):6*16+Math.random()*10*16;
      if(golpeLivre(x,y)){B.golpes.push({x,y,t:0,hit:false});return true;}}
    return false;};
  /* estado visual: tamanho (0 pequeno … 1 gigante), nuvem de bolhas, e se aparece enfraquecido */
  const visual=()=>{
    if(B.puro||(!B.acordou&&B.pur===null))return{g:0,bol:0,fraco:false};
    if(B.pur!==null){const t=B.pur;
      return{g:t<PUR.fraco?1:t<PUR.encolhe?1-(t-PUR.fraco)/(PUR.encolhe-PUR.fraco):0,bol:t>PUR.fraco-0.2&&t<PUR.encolhe+0.2?Math.sin(Math.PI*(t-PUR.fraco+0.2)/(PUR.encolhe-PUR.fraco+0.4)):0,fraco:true};}
    if(B.trans!==null){const p=clamp(B.trans/1.5,0,1);return{g:clamp((p-0.45)/0.4,0,1),bol:Math.sin(p*Math.PI),fraco:false};}
    return{g:1,bol:0,fraco:G.t<B.fracoAte||(PAINEL.aberto&&PAINEL.area===A&&!!arena().valvula)};   // válvula aberta: a seiva drenada deixa os tentáculos pálidos (quadro enfraquecido)
  };
  const ent={
    update(dt,ativo){
      B.fase=fases();
      const v=visual();sGrande.on=v.g>0.5;sPeq.on=!sGrande.on;A.escuro=0.42-0.1*restaura();
      if(bossFeito()){
        if(B.puro)return;
        if(B.pur===null){if(!B.acordou){B.puro=true;return;}if(!ativo)return;B.pur=0;B.golpes=[];SFX.bioChime();}
        const antes=B.pur;B.pur+=dt;const t=B.pur;
        /* 1) o núcleo perde intensidade (faíscas lilás sobem e se apagam) · 2) tentáculos pálidos pingam · 3) bolhas e volta ao tamanho original · 4) a luz volta */
        if(t<PUR.nucleo&&Math.random()<dt*10)particula({x:BOSS.x+10+(Math.random()-0.5)*16,y:BOSS.y-46,z:6,vx:(Math.random()-0.5)*8,vy:0,vz:10+Math.random()*10,vida:0.8,cor:Math.random()<0.5?'#c9a6ff':'#ffffff',tam:2,fade:true});
        else if(t<PUR.fraco&&Math.random()<dt*8)particula({x:BOSS.x+(Math.random()-0.5)*80,y:BOSS.y-14,z:10,vx:0,vy:0,vz:-4,g:30,vida:0.7,cor:'#c89a80',tam:2,fade:true});
        else if(t<PUR.encolhe+0.2&&Math.random()<dt*12)bolhas(BOSS.x+(Math.random()-0.5)*60,BOSS.y-16-Math.random()*30);
        else if(t>=PUR.luz&&Math.random()<dt*8)particula({x:BOSS.x+(Math.random()-0.5)*30,y:BOSS.y-4,z:4,vx:(Math.random()-0.5)*6,vy:0,vz:12+Math.random()*10,vida:1,cor:Math.random()<0.5?'#fff2b8':'#ffffff',tam:2,fade:true});
        if(antes<PUR.luz&&t>=PUR.luz)SFX.relic();
        if(t>PUR.fim){B.pur=null;B.puro=true;faiscas(BOSS.x,BOSS.y-12,16,['#ffffff','#cfe8ff','#ffd24a','#c9a6ff']);addDiary('camara_fim',true);
          setTimeout(()=>toast('O Devorador voltou ao tamanho original. A energia das relíquias foi restaurada e o portão ao norte se abriu.','good'),400);salvar(false);}
        return;
      }
      if(!ativo){B.golpes=[];B.graca=1.5;return;}   // programando: nada ataca, e os avisos pendentes somem (nenhum golpe "guardado" cai quando o painel fecha)
      if(!B.acordou){
        if(Math.hypot(G.p.x-BOSS.x,G.p.y-(BOSS.y-10))<150){B.acordou=true;B.trans=0;SFX.wake();R.treme=0.4;
          toast('É o Devorador do Vale! Cuidado com os círculos vermelhos.','curto');}
        return;
      }
      if(B.trans!==null){B.trans+=dt;if(Math.random()<dt*16)bolhas(BOSS.x+(Math.random()-0.5)*60,BOSS.y-14-Math.random()*30);if(B.trans>1.5){B.trans=null;B.prox=Math.max(B.prox,2.2);}return;}
      for(const g of B.golpes){g.t+=dt;
        if(!g.hit&&g.t>=GOLPE.aviso){g.hit=true;R.treme=0.25;SFX.hit();faiscas(g.x,g.y,8,['#9a5a2a','#c8743a','#ffffff']);
          /* o dano só vale no instante do impacto, para quem está dentro da área; ferir() ainda dá 1,6 s de invulnerabilidade */
          if(Math.hypot(G.p.x-g.x,G.p.y-g.y)<GOLPE.raio&&!(G.p.caindo>0))ferir('Tentáculo! −1 coração',false,'dano');}}
      B.golpes=B.golpes.filter(g=>g.t<GOLPE.fim);
      if(G.t<B.fracoAte)return;
      if(B.graca>0){B.graca-=dt;return;}
      B.prox-=dt;if(B.prox<=0){const n=1+B.fase;for(let i=0;i<n;i++)golpe();B.prox=Math.max(2.6,4.8-0.8*B.fase);}
    },
    desenhar(){
      if(!naTela(BOSS.x,BOSS.y,110))return;
      /* cópia tingida de um quadro (só para o piscar de dano), guardada para não refazer a cada frame */
      const tingido=(m,cor)=>{m.tint=m.tint||{};if(!m.tint[cor]){const c=cnv(m.width,m.height),q=ctx2(c);q.drawImage(m,0,0);q.globalCompositeOperation='source-atop';q.fillStyle=cor;q.fillRect(0,0,c.width,c.height);m.tint[cor]=c;}return m.tint[cor];};
      const peq=(g,al)=>{const m=bossArte('peq',Math.floor(G.t*3)%3);if(m)blit(g,m,BOSS.x,BOSS.y,ORI.peq.ax,ORI.peq.ay,al);};
      enfileirar(BOSS.y,g=>{
        const v=visual();B.quadro=v.g>0?B.quadro:'peq';
        sombra(g,BOSS.x,BOSS.y,9+36*v.g,3+9*v.g);
        if(v.g<1)peq(g,1-v.g);
        if(v.g>0){
          /* repouso: quadro 6. Golpe a caminho (aviso e impacto): quadro 7, o do tentáculo erguido. Fraco/purificando: quadro 8 parado. Nada se move do lugar. */
          const atq=B.golpes.some(k=>k.t<GOLPE.aviso+0.25)&&!v.fraco;
          const k=v.fraco?'fraco':'big',i=k==='big'?(atq?1:0):0;
          let m=bossArte(k,i);B.quadro=k+':'+i;
          if(m){
            let dx=0,dy=(B.pur!==null&&B.pur>PUR.nucleo+0.4&&B.pur<PUR.encolhe)?1:0;   // fraqueza: um pixel mais baixo, sem balançar
            /* dano: piscar claro e tremida de 1 px, só quando uma fase é vencida (ataque usa o quadro 7 e o círculo, nunca o piscar) */
            if(G.t<B.danoAte){const on=Math.floor(G.t*14)%2===0;if(on){m=tingido(m,'#e9dcff');dx=Math.floor(G.t*28)%2?1:-1;}}
            else if(B.pur!==null&&B.pur<PUR.fraco){m=Math.floor(G.t*5)%2?m:tingido(m,'#8a64d0');}   // núcleo perdendo força: oscila entre a cor e um lilás apagado, devagar
            blit(g,m,BOSS.x+dx,BOSS.y+dy,ORI[k].ax,ORI[k].ay,v.g);
          }
        }
        if(v.bol>0){const m=bossArte('bol',Math.floor(G.t*6)%2);if(m)blit(g,m,BOSS.x,BOSS.y,ORI.bol.ax,ORI.bol.ay,clamp(v.bol,0,1));}
      });
    }
  };
  A.ents.push(ent);
  /* ---------- chão: campo de energia, avisos e golpes ---------- */
  A.desenharChao=(g,t)=>{
    const ws=arena();
    if(ws.energia&&vivo()&&(B.acordou||PAINEL.aberto)&&!B.puro){
      for(let i=0;i<56;i++){const a=i/56*TAU+t*0.5,x=BOSS.x+Math.cos(a)*74,y=BOSS.y-6+Math.sin(a)*30;P.r(g,Math.round(x+R.ox),Math.round(y+R.oy),2,2,i%2?'#c9a6ff':'#8a64d0');}
    }
    for(const k of B.golpes){const cx=Math.round(k.x+R.ox),cy=Math.round(k.y+R.oy);
      if(!k.hit){const q=k.t/GOLPE.aviso,r=Math.round(6+(GOLPE.raio-6)*q),pisca=Math.floor(k.t*(6+10*q))%2;
        P.anel(g,cx,cy,GOLPE.raio,1,'rgba(255,90,58,0.6)');   // área que vai ser atingida (fixa)
        P.anel(g,cx,cy,r,2,pisca?'#ff5a3a':'#ffd0a0');}       // o aviso enche até o impacto
      else{const f=clamp((GOLPE.fim-k.t)/(GOLPE.fim-GOLPE.aviso),0,1);   // tentáculo cravado no chão, some devagar
        P.circ(g,cx,cy,Math.max(3,Math.round(9*f)),'#5a3a18');P.circ(g,cx,cy,Math.max(2,Math.round(6*f)),'#9a5a2a');P.p(g,cx-2,cy-2,'#c8743a');P.p(g,cx+2,cy+1,'#c8743a');}}
  };
  A.luzesExtra=t=>{
    const ws=arena(),pt=B.pur;
    if(pt!==null&&pt<PUR.nucleo)luz(BOSS.x,BOSS.y-24,96,0.55-0.35*pt/PUR.nucleo,'#c9a6ff');   // o núcleo perde intensidade
    else luz(BOSS.x,BOSS.y-24,96,B.puro?0.7:pt!==null?0.2+0.5*restaura():0.55,ws.energia&&!B.puro&&pt===null?'#c9a6ff':'#ffe9a0');
    for(const p of ARENA.espelhos)if(ws.espelhos)luz(p.x,p.y-14,24,0.6,'#fff2b8');
  };
  A.focoEvento=(ev,ws,cfg)=>{if(!ev.cmd||cfg.mundo!=='arenaSeq')return null;
    return ev.cmd==='bcorte'?{x:BOSS.x,y:BOSS.y-44}:ev.cmd==='bvalvula'?{x:ARENA.valvula.x,y:ARENA.valvula.y-20}:ev.cmd==='bespelho'?{x:ARENA.espelhos[0].x,y:ARENA.espelhos[0].y-16}:{x:ARENA.resso.x,y:ARENA.resso.y-18};};
  A.aoEvento=(ev)=>{const a=ev.anim||{};
    if(a.energia===false){SFX.sensor();faiscas(BOSS.x,BOSS.y-30,18,['#c9a6ff','#ffffff','#8fe0ff']);}
    if(a.valvula){SFX.agua();gotas(ARENA.valvula.x,ARENA.valvula.y-6,8);}
    if(a.espelhos){SFX.rotate();faiscas(ARENA.espelhos[0].x,ARENA.espelhos[0].y-18,8,['#fff2b8','#ffffff']);}
    if(a.ressonador){SFX.relic();R.treme=0.5;faiscas(BOSS.x,BOSS.y-30,24,['#ffffff','#ffd0ff','#c9a6ff']);}
    if(a.falha||ev.tipo==='erro'){SFX.deny();R.treme=0.25;}};
  A.aoConcluir=(cfg)=>{R.treme=0.4;B.danoAte=G.t+0.8;B.fracoAte=G.t+9;
    setTimeout(()=>toast(bossFeito()?'O ressonador atingiu o núcleo! Feche o painel para ver o Devorador.':'O Devorador cambaleou e ficou vulnerável por alguns instantes.','good'),700);};
  /* com o guardião gigante, a câmera sobe um pouco quando o jogador está nos andares de baixo, para o corpo dele aparecer */
  A.camDy=()=>B.acordou&&!B.puro?-clamp((G.p.y-8*16)/(9*16),0,1)*64:0;
  A.reiniciar=()=>{B.acordou=false;B.trans=null;B.pur=null;B.puro=bossFeito();B.golpes=[];B.prox=3;B.fracoAte=0;B.danoAte=0;B.graca=0;sGrande.on=false;sPeq.on=true;addDiary('camara_enter',true);};
  A.objetivo=()=>{
    if(bossFeito())return{t:'Câmara Final · guardião purificado',s:'O portão ao norte está aberto: siga para a Cidade-Jardim.',alvo:{x:14*16,y:2*16,txt:'Cidade-Jardim'}};
    /* a batalha é um único desafio (sequência) com quatro mecanismos: o indicador mostra os mecanismos, não "fases" que não existem */
    const ws=arena(),n=(ws.energia?0:1)+(ws.valvula?1:0)+(ws.espelhos?1:0)+(ws.disparou?1:0);
    return{t:'Câmara Final · mecanismos '+n+'/4',s:'Programe o terminal ◆ (a sequência).',
      d:'Corte a energia, abra a válvula, alinhe os espelhos e dispare o ressonador. Os círculos vermelhos no chão só ferem quem está dentro deles quando o golpe cai.',alvo:A.term};
  };
  return A;
};
function bolhas(x,y){particula({x,y,z:4,vx:(Math.random()-0.5)*14,vy:(Math.random()-0.5)*6,vz:14+Math.random()*16,vida:0.9,cor:Math.random()<0.5?'#cfe8ff':'#9fd0ff',tam:2,fade:true});}
