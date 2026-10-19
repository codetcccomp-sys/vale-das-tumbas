/* ====================== Câmara Final · o Devorador do Vale ======================
   Prova final, entre as quatro tumbas e a Cidade-Jardim (adicional: não substitui nenhuma etapa). A porta do Vale leva
   primeiro a esta câmara; quando o guardião é purificado, o portão ao norte abre e leva à Cidade-Jardim. Quem já concluiu
   o desafio do Jardim (jogo salvo antes desta câmara) segue direto, sem refazer a luta.
   O chefe é uma criatura guardiã que, ao sentir o explorador, absorve a energia das relíquias e se transforma. Ele não é
   vencido pela força: cada fase é um programa que põe um saber à prova (sequência, variáveis, decisões, repetições).
   Estados visuais: dorme (pequeno) → transformado (gigante, com tentáculos) → enfraquecido (logo após cada fase) →
   purificado (volta ao tamanho original). Os golpes dos tentáculos avisam antes (círculo vermelho no chão) e ficam mais
   numerosos a cada fase concluída. Com o painel aberto o chefe não ataca.
   Os sprites daqui são provisórios, desenhados por código; a folha de sprites do chefe entra no lugar de OBJS.bossProv. */
Object.assign(ENTRIES,{
  camara_enter:{t:'Câmara Final',s:'Antes da Cidade-Jardim há uma câmara fechada. Uma criatura pequena dorme no centro: é o guardião que os construtores deixaram para proteger o conhecimento das quatro tumbas.'},
  camara_fim:{t:'O guardião purificado',s:'O Devorador do Vale não precisava ser destruído, só entendido: foi o conhecimento das quatro tumbas que o acalmou. Ele voltou ao tamanho original e a passagem para a Cidade-Jardim se abriu.'}
});
const BOSS={x:14*16,y:10*16};   // pés do guardião
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
  /* guardião (provisório). estados: 'transf' (gigante), 'fraco' (gigante, cores apagadas, olho fechado) e 'puro' (a criatura pequena) */
  bossProv(estado,f){
    if(estado==='puro'){
      const c=cnv(30,24),g=ctx2(c),k=f%2;
      P.elip(g,14,16,11,5,'#c28a2a');P.elip(g,13,14,8,3,'#d8a24a');P.circ(g,23,13,4,'#a8741e');P.p(g,25,12,'#1a0e08');P.r(g,24,15,2,1,'#6a4410');
      P.r(g,8,20,3,2,'#8a5a14');P.r(g,17,20,3,2,'#8a5a14');P.r(g,13,6-k,1,5+k,'#5a8a3a');P.circ(g,13,5-k,1.6,'#7ac86a');
      return contorno(c,'#1a0e08');
    }
    const fraco=estado==='fraco',k=f%3,W=128,H=112,c=cnv(W,H),g=ctx2(c);
    const pele=fraco?'#a89466':'#b88a2e',claro=fraco?'#c4b484':'#d8a838',escuro=fraco?'#6a5c3c':'#7a5a14',tent=fraco?'#a8745a':'#9a5a2a',tentC=fraco?'#c89a80':'#c8743a';
    const bx=64,by=86;
    for(let i=0;i<7;i++){
      const lado=(i-3)/3,L=46+(i%2)*10,fase=i*1.7+k*1.1;
      for(let s=0;s<=18;s++){
        const t=s/18,x=bx+lado*(10+L*t)+Math.sin(t*4+fase)*4*t,y=by+14+Math.sin(t*Math.PI)*8-t*t*(26+Math.abs(lado)*8)+Math.cos(fase+t*3)*2*t;
        P.circ(g,x,y,4.4*(1-t)+1,tent);if(s%3===1&&t<0.9)P.p(g,x,y+1,tentC);
      }
    }
    P.elip(g,bx,68,38,26,pele);P.elip(g,bx-2,60,32,17,claro);
    for(let i=0;i<46;i++){const a=hash2(i,3,5)*TAU,d=Math.sqrt(hash2(i,9,5))*0.92,x=bx+Math.cos(a)*d*36,y=68+Math.sin(a)*d*24;P.r(g,x,y,2,1,escuro);}
    P.circ(g,40,40,19,escuro);P.elip(g,30,46,13,8,fraco?'#4a4030':'#5a3a10');
    P.r(g,19,48,24,3,'#2a0a0a');for(let i=0;i<5;i++)P.r(g,21+i*4,50,2,4,'#e8e0a0');P.r(g,28,52,4,7+k,fraco?'#c07a8a':'#e06a8a');
    if(fraco){P.r(g,34,31,5,1,'#c9a6ff');}else{P.r(g,34,30,4,3,'#ff3a2a');P.p(g,35,30,'#ffd0c0');}
    P.circ(g,bx+8,72,4,fraco?'#8a7ac0':'#c9a6ff');if(k!==1||fraco)P.circ(g,bx+8,72,2,'#ffffff');
    return contorno(c,'#1a0e08');
  },
  /* nuvem de bolhas azuis da transformação e da purificação */
  bossBolhas(f){
    const c=cnv(84,60),g=ctx2(c);
    for(let i=0;i<16;i++){const x=14+hash2(i,2,4)*56+((i+f)%2),y=14+hash2(i,6,4)*34,r=4+hash2(i,8,4)*6;P.circ(g,x,y,r+1,'#3a6aa8');}
    for(let i=0;i<16;i++){const x=14+hash2(i,2,4)*56+((i+f)%2),y=14+hash2(i,6,4)*34,r=4+hash2(i,8,4)*6;P.circ(g,x,y,r,'#cfe8ff');P.circ(g,x-r*0.3,y-r*0.3,Math.max(1,r*0.35),'#ffffff');}
    for(let i=0;i<8;i++)P.p(g,4+hash2(i,1,9)*76,2+hash2(i,5,9)*56,'#9fd0ff');
    return c;
  },
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
  const B={acordou:false,trans:null,pur:null,puro:false,fracoAte:0,golpes:[],prox:3,fase:0};A.boss=B;
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
  solido(A,BOSS.x-34,BOSS.y-12,BOSS.x+34,BOSS.y);
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
  const golpe=()=>{const p=G.p,x=clamp(p.x+(Math.random()-0.5)*56,5*16,22*16),y=clamp(p.y+(Math.random()-0.5)*40,6*16,17*16);B.golpes.push({x,y,t:0,hit:false});};
  const ent={
    update(dt,ativo){
      B.fase=fases();
      if(bossFeito()){
        if(B.puro)return;
        if(B.pur===null){if(!B.acordou){B.puro=true;return;}if(!ativo)return;B.pur=0;B.golpes=[];SFX.bioChime();}
        B.pur+=dt;if(Math.random()<dt*14)bolhas(BOSS.x+(Math.random()-0.5)*70,BOSS.y-20-Math.random()*40);
        if(B.pur>2.6){B.pur=null;B.puro=true;R.treme=0.5;SFX.relic();faiscas(BOSS.x,BOSS.y-12,26,['#ffffff','#cfe8ff','#ffd24a','#c9a6ff']);addDiary('camara_fim',true);
          setTimeout(()=>toast('O Devorador do Vale voltou ao tamanho original! A energia das relíquias foi restaurada e o portão ao norte se abriu.','good'),500);salvar(false);}
        return;
      }
      if(!ativo)return;
      if(!B.acordou){
        if(Math.hypot(G.p.x-BOSS.x,G.p.y-(BOSS.y-10))<150){B.acordou=true;B.trans=0;SFX.wake();R.treme=0.5;
          toast('A criatura absorveu a energia das relíquias e se transformou: é o Devorador do Vale! Programe o terminal ◆ para acalmá-lo e fique atento aos avisos vermelhos no chão.','warn');}
        return;
      }
      if(B.trans!==null){B.trans+=dt;if(Math.random()<dt*16)bolhas(BOSS.x+(Math.random()-0.5)*60,BOSS.y-14-Math.random()*30);if(B.trans>1.5)B.trans=null;return;}
      for(const g of B.golpes){g.t+=dt;
        if(!g.hit&&g.t>=1.1){g.hit=true;R.treme=0.3;SFX.hit();faiscas(g.x,g.y,10,['#9a5a2a','#c8743a','#ffffff']);
          if(Math.hypot(G.p.x-g.x,G.p.y-g.y)<22&&!(G.p.caindo>0))ferir('Um tentáculo do Devorador acertou você. Procure o círculo vermelho no chão: ele avisa onde o golpe vai cair.');}}
      B.golpes=B.golpes.filter(g=>g.t<1.7);
      if(G.t<B.fracoAte)return;
      B.prox-=dt;if(B.prox<=0){const n=1+B.fase;for(let i=0;i<n;i++)golpe();B.prox=Math.max(2.4,4.6-0.8*B.fase);}
    },
    desenhar(){
      if(!naTela(BOSS.x,BOSS.y,110))return;
      const bPeq=(g,al)=>{const m=bossArte('peq',Math.floor(G.t*3)%3);if(m)blit(g,m,BOSS.x,BOSS.y,m.width/2,m.height-1,al);};
      enfileirar(BOSS.y,g=>{
        const f=Math.floor(G.t*3)%3,fr=G.t<B.fracoAte?'fraco':'transf';
        if(B.puro||(!B.acordou&&!bossFeito())){sombra(g,BOSS.x,BOSS.y,9,3);bPeq(g,1);return;}
        let p=1;if(B.trans!==null)p=clamp(B.trans/1.5,0,1);else if(B.pur!==null)p=1-clamp(B.pur/2.6,0,1);
        const grande=p>=1?1:(B.trans!==null?clamp((p-0.45)/0.4,0,1):clamp((p-0.15)/0.4,0,1)),bol=(p>0&&p<1)?1:0;
        sombra(g,BOSS.x,BOSS.y,10+34*grande,3+9*grande);
        if(grande<1)bPeq(g,1-grande);
        if(grande>0){const k=fr==='fraco'?'fraco':'big',m=bossArte(k,fr==='fraco'?0:Math.floor(G.t*2.5)%2);if(m)blit(g,m,BOSS.x,BOSS.y,m.width/2,m.height-2,grande);}
        if(bol){const m=bossArte('bol',Math.floor(G.t*6)%2);if(m)blit(g,m,BOSS.x,BOSS.y-4,m.width/2,m.height-2,Math.sin(p*Math.PI));}
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
      if(!k.hit){const r=Math.round(6+14*(k.t/1.1));P.anel(g,cx,cy,r,2,Math.floor(k.t*8)%2?'#ff5a3a':'#ffd0a0');P.anel(g,cx,cy,20,1,'rgba(255,90,58,0.55)');}
      else{P.circ(g,cx,cy,9,'#5a3a18');P.circ(g,cx,cy,6,'#9a5a2a');P.p(g,cx-2,cy-2,'#c8743a');P.p(g,cx+2,cy+1,'#c8743a');}}
  };
  A.luzesExtra=t=>{
    const ws=arena();luz(BOSS.x,BOSS.y-24,96,B.puro?0.7:0.55,ws.energia&&!B.puro?'#c9a6ff':'#ffe9a0');
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
  A.aoConcluir=(cfg)=>{R.treme=0.5;B.fracoAte=G.t+9;
    setTimeout(()=>toast(bossFeito()?'O ressonador atingiu o núcleo corrompido! Feche o painel para ver o que acontece com o Devorador.':'O Devorador cambaleou e ficou vulnerável por alguns instantes. Prepare a próxima fase.','good'),700);};
  /* com o guardião gigante, a câmera sobe um pouco quando o jogador está nos andares de baixo, para o corpo dele aparecer */
  A.camDy=()=>B.acordou&&!B.puro?-clamp((G.p.y-8*16)/(9*16),0,1)*64:0;
  A.reiniciar=()=>{B.acordou=false;B.trans=null;B.pur=null;B.puro=bossFeito();B.golpes=[];B.prox=3;B.fracoAte=0;addDiary('camara_enter',true);};
  A.objetivo=()=>{
    if(bossFeito())return{t:'Câmara Final · guardião purificado',s:'O portão ao norte está aberto: siga para a Cidade-Jardim.',alvo:{x:14*16,y:2*16,txt:'Cidade-Jardim'}};
    const l=desafiosDa('camara'),feitos=l.filter(d=>G.learn[d.id]).length,prox=l.find(d=>!G.learn[d.id]);
    return{t:'Câmara Final · fase '+(feitos+1)+' de '+l.length,s:'No terminal ◆: '+prox.titulo+'. Cuidado com os círculos vermelhos no chão.',alvo:A.term};
  };
  return A;
};
function bolhas(x,y){particula({x,y,z:4,vx:(Math.random()-0.5)*14,vy:(Math.random()-0.5)*6,vz:14+Math.random()*16,vida:0.9,cor:Math.random()<0.5?'#cfe8ff':'#9fd0ff',tam:2,fade:true});}
