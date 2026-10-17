/* ====================== peças comuns das tumbas ======================
   Montagem da área a partir do mapa de texto, pontos de energia (salvam o ponto e recarregam a lanterna), saída para o
   vale, pedestal da relíquia, terminal do painel de programação, portões e guardiões que dormem, acordam com passos
   apressados ou com a proximidade, perseguem e voltam a dormir quando o explorador sai da sala. */
Object.assign(OBJS,{
  escada(cor){const c=cnv(32,20),g=ctx2(c);for(let i=0;i<4;i++)P.r(g,2+i*1,2+i*4,28-i*2,4,tom(cor||'#8a7a62',-i*0.12));P.r(g,2,2,28,1,'#e8d8b0');return contorno(c,'#0b0705');},
  pedestal(cor){const c=cnv(24,26),g=ctx2(c);P.r(g,3,14,18,10,'#8a7a62');P.r(g,3,14,18,2,'#bfae8c');P.r(g,6,10,12,5,'#a8987a');P.r(g,6,10,12,1,'#d8c8a4');P.r(g,5,23,14,2,'#5a4a3a');
    if(cor){P.circ(g,12,6,4.5,tom(cor,-0.3));P.circ(g,12,5,3,cor);}return contorno(c,'#0b0705');},
  lampada(cor,f){const c=cnv(10,14),g=ctx2(c);P.r(g,3,0,4,3,'#3a2a1a');P.r(g,2,3,6,8,'#5a4a3a');P.r(g,3,4,4,6,f%2?tom(cor,0.2):cor);P.r(g,4,11,2,2,'#3a2a1a');return contorno(c,'#0b0705');},
  zzz(){return sprMapa(['ooo.','..o.','.o..','ooo.'],{o:'#e9e4ff'});}
});
function tumbaArea(id,tema,linhas,leg){
  const w=linhas.reduce((m,l)=>Math.max(m,l.length),0),h=linhas.length,A=novaArea(id,w,h,tema);
  carregarMapa(A,linhas,leg);A.escuro=0.88;A.fundo=TEMA[tema].topo;A.tinta={steam:'rgb(12,6,2)',diesel:'rgb(4,6,12)',atom:'rgb(2,10,6)',bio:'rgb(10,4,14)',city:'rgb(4,10,6)'}[tema];
  A.lampadas=[];A.guardas=[];A.ents=[];A.luzes=t=>luzesTumba(A,t);
  return A;
}
function luzesTumba(A,t){
  for(const l of A.lampadas)if(naTela(l.x,l.y,90))luz(l.x,l.y,l.r+Math.sin(t*7+l.x)*1.5,l.f||1,l.cor);
  if(A.luzesExtra)A.luzesExtra(t);
}
function lampada(A,tx,ty,cor,r){const o=objeto(A,SPR.get('lampada',cor,0),tx*16+8,ty*16+14,{});o.frames=[0,1].map(f=>SPR.get('lampada',cor,f));o.fps=3;A.lampadas.push({x:tx*16+8,y:ty*16+8,r:r||46,cor});return o;}
/* ponto de energia: caldeira, gerador, célula ou flor de luz. Salva o ponto de controle e recarrega a lanterna. */
function pontoEnergia(A,tx,ty,spr,nome,diario){
  const x=tx*16+8,y=ty*16+14,pt={aceso:false,x,y};
  const o=objeto(A,SPR.get(spr,false,0),x,y,{col:[-10,-8,10,0]});
  o.desenho=(g,ob,t)=>{blit(g,SPR.get(spr,pt.aceso,Math.floor(t*4)%2),ob.x,ob.y,ob.ax,ob.ay);};
  A.lampadas.push({get x(){return x;},get y(){return y-10;},get r(){return pt.aceso?52:16;},get cor(){return pt.aceso?'#ffb060':null;}});
  interacao(A,{x,y:y+12,r:22,label:()=>pt.aceso?'Recarregar e salvar o ponto':'Acender '+nome,use:()=>{
    const novo=!pt.aceso;pt.aceso=true;G.checkpoint={x,y:y+16,dir:'baixo'};G.lantern=100;G.lanternOn=true;SFX.lamp();
    toast(novo?TXT.pointLit:TXT.pointAgain,'good');if(diario)addDiary(diario,true);if(A.id==='steam'&&novo)vapor(x,y-20,6);salvar(false);}});
  A.pontos=(A.pontos||[]).concat([pt]);return pt;
}
function saidaVale(A,tx,ty){
  objeto(A,SPR.get('escada',TEMA[A.tema].parede[0]),tx*16+16,ty*16+18,{camada:-40});
  interacao(A,{x:tx*16+16,y:ty*16+8,r:22,label:()=>'Voltar ao vale',use:()=>sairTumba(false)});
}
/* pedestal: a relíquia fica nele até ser recolhida; quem trouxe a relíquia do 3D já a carrega */
function pedestal(A,tx,ty,k){
  const x=tx*16+8,y=ty*16+14,cor=TOMBS[k].col;
  const o=objeto(A,SPR.get('pedestal',null),x,y,{col:[-10,-8,10,0]});
  o.desenho=(g,ob,t)=>{blit(g,SPR.get('pedestal',null),ob.x,ob.y,ob.ax,ob.ay);if(!G.relics[k]){const yy=ob.y-22+Math.round(Math.sin(t*2.5)*1.5);blit(g,SPR.get('reliquia',k,2),ob.x,yy,6,6);}};
  A.lampadas.push({x,y:y-16,get r(){return G.relics[k]?18:40;},cor});
  interacao(A,{x,y:y+12,r:22,label:()=>G.relics[k]?'Pedestal '+relDe(k)+' (já está com você)':'Pegar '+relNome(k),use:()=>{if(!G.relics[k])pegarReliquia(k,x,y-20);else toast(relNome(k,true)+' já está com você'+(saberOk(k)?', desperto pelo saber.':'.'));}});
}
function pegarReliquia(k,x,y){
  G.relics[k]=true;SFX.relic();faiscas(x,y,18,['#ffffff',TOMBS[k].col,'#ffd24a']);
  addDiary(RELIC_INFO[k].diary,true);addDiary(SABER_ENTRY[TOMBS[k].saber],true);
  toast('Você recuperou '+relNome(k)+': o saber '+SABERES[TOMBS[k].saber].nome+'. O diário guardou a explicação e um exemplo.','good');
  salvar(false);
}
/* chamado quando a última etapa de uma tumba é concluída: uma relíquia trazida do 3D desperta */
function saberConcluido(k){
  if(G.relics[k]){addDiary(SABER_ENTRY[TOMBS[k].saber],true);addDiary(RELIC_INFO[k].diary,true);setTimeout(()=>toast(relNome(k,true)+' que você trouxe despertou: saber '+SABERES[TOMBS[k].saber].nome+' recuperado.','good'),900);SFX.relic();}
}
/* terminal do painel de programação */
function terminal(A,tx,ty,k,foco,spr,rotulo){
  const x=tx*16+8,y=ty*16+14;
  const o=objeto(A,SPR.get(spr,0),x,y,{col:[-8,-6,8,0]});o.frames=[0,1].map(f=>SPR.get(spr,f));o.fps=2;
  interacao(A,{x,y:y+10,r:22,label:()=>rotulo,use:()=>{abrirPainel(k,A,foco);}});
  return o;
}
/* portão: objeto + caixa sólida que some quando aberto() fica verdadeiro */
function portao(A,tx,ty,larg,spr,aberto){
  const x=tx*16+larg*8,y=ty*16+16;
  const box=solido(A,tx*16,ty*16,tx*16+larg*16,ty*16+16);box.opaco=true;
  const o=objeto(A,SPR.get(spr,larg,0),x,y,{camada:1});const st={t:aberto()?1:0};
  o.desenho=(g,ob)=>{const ab=aberto();if(ab&&st.t<1){st.t=Math.min(1,st.t+1/40);if(st.t>0.05&&st.t<0.1)SFX.gate();}if(!ab)st.t=0;box.on=st.t<0.6;
    blit(g,SPR.get(spr,larg,st.t>=1?2:st.t>0?1:0),ob.x,ob.y,ob.ax,ob.ay);};
  return{box,o,st};
}
/* guardião: dorme num canto; acorda se o explorador corre por perto ou chega muito perto; persegue; volta a dormir quando
   o explorador sai da sala. Encostar tira um coração e empurra. Com o painel aberto ou em pausa, fica parado. */
function guardiao(A,o){
  const e=Object.assign({x:o.tx*16+8,y:o.ty*16+12,estado:'dorme',f:0,t:0,vel:56,perto:34,corrida:120,cd:0},o);
  e.casa={x:e.x,y:e.y};
  e.update=(dt,ativo)=>{
    e.t+=dt;e.f+=dt*(e.estado==='caca'?8:2);if(!ativo||G.p.caindo>0)return;
    const p=G.p,dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy),dentro=p.x>e.sala[0]*16&&p.x<e.sala[2]*16&&p.y>e.sala[1]*16&&p.y<e.sala[3]*16;
    if(e.cd>0)e.cd-=dt;
    if(e.estado==='dorme'){if(dentro&&(d<e.perto||(p.run&&d<e.corrida)||(e.ouve&&e.ouve()))){e.estado='acorda';e.t=0;SFX.wake();if(e.diario)addDiary(e.diario);}}
    else if(e.estado==='acorda'){if(e.t>0.7)e.estado='caca';}
    else if(e.estado==='caca'){
      if(!dentro){e.estado='volta';return;}
      const v=e.vel*dt;moverCorpo(A,e,dx/(d||1)*v,dy/(d||1)*v);
      if(d<11&&e.cd<=0){e.cd=1.2;ferir(e.msg);const k=22/(d||1);moverCorpo(A,p,dx*k,dy*k);}
    }else if(e.estado==='volta'){
      const hx=e.casa.x-e.x,hy=e.casa.y-e.y,hd=Math.hypot(hx,hy);
      if(hd<3){e.estado='dorme';SFX.sleep();}else moverCorpo(A,e,hx/hd*e.vel*dt,hy/hd*e.vel*dt);
      if(dentro&&d<e.perto)e.estado='caca';
    }
  };
  e.desenhar=()=>{if(!naTela(e.x,e.y,40))return;enfileirar(e.y,g=>{sombra(g,e.x,e.y,7,2.5);const ac=e.estado!=='dorme';blit(g,e.spr(ac,Math.floor(e.f)),e.x,e.y+2,9,22);
    if(!ac&&Math.floor(e.t*1.5)%2===0)blit(g,SPR.get('zzz'),e.x+8,e.y-26-Math.floor(e.t*3)%3,0,0);});};
  e.reiniciar=()=>{e.x=e.casa.x;e.y=e.casa.y;e.estado='dorme';};
  A.ents.push(e);A.guardas.push(e);return e;
}
function reiniciarGuardas(A){for(const e of A.guardas)e.reiniciar();}
/* tochas de progresso: uma por etapa da tumba, acesa quando a etapa é concluída (o código muda a sala) */
function tochasProgresso(A,k,pos,cor){
  A.tochas={};
  desafiosDa(k).forEach((d,i)=>{const p=pos[i];if(!p)return;const x=p[0]*16+8,y=p[1]*16+14;A.tochas[d.id]={x,y};
    const o=objeto(A,SPR.get('tocha',false,0,cor),x,y,{col:[-3,-2,3,0]});
    o.desenho=(g,ob,t)=>blit(g,SPR.get('tocha',!!G.learn[d.id],Math.floor(t*8+i)%3,cor),ob.x,ob.y,6,30);
    A.lampadas.push({x,y:y-26,get r(){return G.learn[d.id]?26:0;},cor});});
}
function acenderTochaProgresso(A,cid){const p=A&&A.tochas&&A.tochas[cid];if(!p)return;faiscas(p.x,p.y-26,10,['#fff6c0','#ffd24a','#ff9a3a']);SFX.lamp();}
/* objetivo dentro de uma tumba: guia até o terminal, depois às etapas, depois à relíquia */
function objetivoTumba(k,termNome){
  const l=desafiosDa(k),feitos=l.filter(d=>G.learn[d.id]).length;
  const S=SABERES[TOMBS[k].saber];
  if(feitos<l.length){const prox=l.find(d=>!G.learn[d.id]);return{t:'Saber: '+S.nome+' · etapa '+(feitos+1)+' de '+l.length,s:termNome+': '+prox.titulo+'.'};}
  if(!G.relics[k])return{t:'Saber recuperado',s:'O caminho para '+relNome(k)+' está aberto.'};
  return{t:'Tumba concluída',s:'Volte ao vale: '+(saberesCount()<4?'a próxima tumba espera.':'leve os quatro saberes à Cidade-Jardim.')};
}
