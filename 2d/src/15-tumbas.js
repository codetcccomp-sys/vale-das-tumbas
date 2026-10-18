/* ====================== peças comuns das tumbas ======================
   Montagem da área a partir do mapa de texto, pontos de energia (salvam o ponto de controle), saída para o
   vale, pedestal da relíquia, terminal do painel de programação, portões e guardiões que dormem, acordam com passos
   apressados ou com a proximidade, perseguem e voltam a dormir quando o explorador sai da sala. */
Object.assign(OBJS,{
  escada(cor){const c=cnv(32,20),g=ctx2(c);for(let i=0;i<4;i++)P.r(g,2+i*1,2+i*4,28-i*2,4,tom(cor||'#8a7a62',-i*0.12));P.r(g,2,2,28,1,'#e8d8b0');return contorno(c,'#0b0705');},
  pedestal(cor){const c=cnv(24,26),g=ctx2(c);P.r(g,3,14,18,10,'#8a7a62');P.r(g,3,14,18,2,'#bfae8c');P.r(g,6,10,12,5,'#a8987a');P.r(g,6,10,12,1,'#d8c8a4');P.r(g,5,23,14,2,'#5a4a3a');
    if(cor){P.circ(g,12,6,4.5,tom(cor,-0.3));P.circ(g,12,5,3,cor);}return contorno(c,'#0b0705');},
  lampada(cor,f){const c=cnv(10,14),g=ctx2(c);P.r(g,3,0,4,3,'#3a2a1a');P.r(g,2,3,6,8,'#5a4a3a');P.r(g,3,4,4,6,f%2?tom(cor,0.2):cor);P.r(g,4,11,2,2,'#3a2a1a');return contorno(c,'#0b0705');},
  zzz(){return sprMapa(['ooo.','..o.','.o..','ooo.'],{o:'#e9e4ff'});},
  /* placa de pista: tábua presa num poste, com a cor do lugar */
  placaPista(cor){const c=cnv(22,26),g=ctx2(c);P.r(g,10,12,2,13,'#5a4a3a');P.r(g,1,2,20,12,'#e9dcbc');P.r(g,1,2,20,3,cor||'#c89a62');P.r(g,1,13,20,1,'#8a7a62');
    for(const[y,w]of[[7,14],[9,10],[11,12]])P.r(g,4,y,w,1,'#6a5a48');return contorno(c,'#0b0705');},
  /* marca de luz: traços claros riscados na parede (cada marca tem o seu desenho) */
  marcaLuz(id){const c=cnv(14,12),g=ctx2(c),C='#fff2b8',h=hash2(id?id.length:3,id?id.charCodeAt(0):1,7);
    P.r(g,0,0,14,1,C);P.r(g,0,11,14,1,C);P.r(g,0,0,1,12,C);P.r(g,13,0,1,12,C);
    const desenhos={steam_cartao:[[3,3],[6,3],[9,5],[3,7],[7,8],[10,8]],steam_ordem:[[3,4],[4,4],[5,5],[8,6],[9,7],[10,7]],diesel_etiqueta:[[4,3],[5,3],[6,3],[4,6],[5,6],[8,6],[9,6],[4,8],[5,8],[6,8],[7,8]],diesel_aspas:[[3,3],[3,4],[5,3],[5,4],[8,6],[9,7],[10,8],[10,6],[8,8]],
      atom_primeiro:[[6,2],[5,3],[7,3],[4,4],[8,4],[5,5],[7,5],[6,6],[3,8],[6,9],[9,8]],atom_resto:[[3,4],[4,4],[5,4],[3,6],[4,6],[3,8],[4,8],[5,8],[8,4],[8,6],[8,8]],bio_zero:[[3,4],[5,4],[7,4],[9,4],[3,6],[5,6],[7,6],[9,6]],bio_parar:[[3,3],[4,4],[5,5],[9,3],[9,5],[9,7],[9,9],[7,6],[8,6],[10,6],[11,6]]};
    for(const[x,y]of(desenhos[id]||[[5,5],[7,6],[9,5]])){P.r(g,x,y,2,1,C);}if(h<0)P.p(g,0,0,C);return c;},
  /* balão em cima da placa: ! (pista ainda não lida) ou ✓ (já lida) */
  balaoPista(lida){const c=cnv(9,12),g=ctx2(c);P.r(g,0,0,9,9,'#0b0705');P.r(g,1,1,7,7,lida?'#3a4a5a':'#ffd24a');P.r(g,3,9,3,1,'#0b0705');P.r(g,4,10,1,2,'#0b0705');
    if(lida){P.p(g,2,4,'#bfe6ff');P.p(g,3,5,'#bfe6ff');P.p(g,4,4,'#bfe6ff');P.p(g,5,3,'#bfe6ff');P.p(g,6,2,'#bfe6ff');}else{P.r(g,4,2,1,4,'#24160d');P.p(g,4,7,'#24160d');}return c;}
});
/* placa de pista (PISTAS em 03-learn.js): interação para ler e o balão ! / ✓ desenhado por cima da luz (desenharPistas) */
function placaPista(A,id,x,y,op){
  op=op||{};const P0=PISTAS[id];
  if(!op.semObjeto)objeto(A,SPR.get('placaPista',op.cor),x,y,{col:[-3,-3,3,0]});
  const alto=op.alto||30;
  (A.pistas||(A.pistas=[])).push({id,x,y:y-alto});
  return interacao(A,{x,y:y+(op.dy===undefined?6:op.dy),r:op.r||20,alto,nome:P0.nome,label:()=>(G.pistas[id]?'Ler de novo: ':'Ler a pista: ')+P0.nome,use:()=>lerPista(id)});
}
function lerPista(id){
  const P0=PISTAS[id],primeira=!Object.keys(G.pistas).length,novo=!G.pistas[id];
  G.pistas[id]=true;addDiary('pista_'+id,true);if(ENTRIES['oficina_'+id])addDiary('oficina_'+id,true);SFX.page();if(novo)salvar(false);
  const fix=()=>G.fixadas.indexOf(id)>=0;
  const ops=()=>[{t:fix()?'📌 Fixada no terminal (tirar)':'📌 Fixar no alto do terminal',fn:()=>{fixarPista(id);falar(txt,ops(),P0.nome,'placaPista');}},{t:'Entendi',main:true}];
  const txt=P0.texto+(primeira?' (Esta é uma pista. Ela fica guardada no diário, aba Pistas, e no terminal, em Comandos e variáveis.)':'');
  falar(txt,ops(),P0.nome,'placaPista');
}
/* fixar ou soltar uma pista no alto do painel (no máximo 3: a mais antiga sai) */
function fixarPista(id){
  const i=G.fixadas.indexOf(id);if(i>=0)G.fixadas.splice(i,1);else{G.fixadas.push(id);while(G.fixadas.length>3)G.fixadas.shift();}
  SFX.click();salvar(false);if(PAINEL.aberto)renderPainel();
}
/* marca de luz na parede (tx,ty: tile da parede; quem lê fica no chão logo abaixo). Só aparece com a lanterna acesa e perto */
function marcaLuz(A,id,tx,ty){
  const x=tx*16+8,y=ty*16+8,m={id,x,y};(A.marcas||(A.marcas=[])).push(m);
  const visivel=()=>G.lanternOn&&Math.hypot(G.p.x-x,G.p.y-14-y)<70;
  interacao(A,{x,y:y+20,r:24,alto:18,nome:'Marca de luz',label:()=>visivel()?(G.marcas[id]?'Ver de novo a marca de luz':'Ler a marca de luz'):null,use:()=>lerMarca(id)});
  return m;
}
function lerMarca(id){
  const M=MARCAS[id],novo=!G.marcas[id];G.marcas[id]=true;addDiary('marca_'+id,true);SFX.insc();
  if(novo)salvar(false);
  falar(M.s+(novo?' (Marcas de luz encontradas: '+Object.keys(G.marcas).length+' de '+MARCA_IDS.length+'. Elas ficam no diário.)':''),[{t:'Entendi',main:true}],'Marca de luz · '+M.t,'marcaLuz');
}
function desenharMarcas(A){
  if(!A.marcas)return;const g=R.lg;
  for(const m of A.marcas){if(!naTela(m.x,m.y,30))continue;const d=Math.hypot(G.p.x-m.x,G.p.y-14-m.y);
    const a=G.lanternOn&&G.mode!=='painel'?clamp((86-d)/36,0,1):0;if(a<=0)continue;
    blit(g,SPR.get('marcaLuz',m.id),m.x,m.y,7,6,a*(G.marcas[m.id]?0.7:1));}
}
function desenharPistas(A){
  if(!A.pistas||G.mode!=='play')return;const g=R.lg;
  for(const p of A.pistas){if(!naTela(p.x,p.y,20))continue;const lida=!!G.pistas[p.id],b=lida?0:Math.round(Math.sin(G.t*5+p.x)*1.5);
    blit(g,SPR.get('balaoPista',lida),p.x,p.y-4+b,4,12,lida?0.75:1);}
}
function tumbaArea(id,tema,linhas,leg){
  const w=linhas.reduce((m,l)=>Math.max(m,l.length),0),h=linhas.length,A=novaArea(id,w,h,tema);
  carregarMapa(A,linhas,leg);A.escuro=0.6;A.fundo=TEMA[tema].topo;A.tinta={steam:'rgb(12,6,2)',diesel:'rgb(4,6,12)',atom:'rgb(2,10,6)',bio:'rgb(10,4,14)',city:'rgb(4,10,6)'}[tema];
  A.lampadas=[];A.guardas=[];A.ents=[];A.luzes=t=>luzesTumba(A,t);
  return A;
}
function luzesTumba(A,t){
  for(const l of A.lampadas)if(naTela(l.x,l.y,90))luz(l.x,l.y,l.r+Math.sin(t*7+l.x)*1.5,l.f||1,l.cor);
  if(A.luzesExtra)A.luzesExtra(t);
}
function lampada(A,tx,ty,cor,r){const o=objeto(A,SPR.get('lampada',cor,0),tx*16+8,ty*16+14,{});o.frames=[0,1].map(f=>SPR.get('lampada',cor,f));o.fps=3;A.lampadas.push({x:tx*16+8,y:ty*16+8,r:r||46,cor});return o;}
/* ponto de energia: caldeira, gerador, célula ou flor de luz. Salva o ponto de controle. */
function pontoEnergia(A,tx,ty,spr,nome,diario){
  const x=tx*16+8,y=ty*16+14,pt={aceso:false,x,y};
  const o=objeto(A,SPR.get(spr,false,0),x,y,{col:[-10,-8,10,0]});
  o.desenho=(g,ob,t)=>{blit(g,SPR.get(spr,pt.aceso,Math.floor(t*4)%2),ob.x,ob.y,ob.ax,ob.ay);};
  A.lampadas.push({get x(){return x;},get y(){return y-10;},get r(){return pt.aceso?52:16;},get cor(){return pt.aceso?'#ffb060':null;}});
  interacao(A,{x,y:y+12,r:22,nome:mai1(nome.replace(/^(a|o) /,'')),label:()=>pt.aceso?'Salvar o ponto de controle':'Acender '+nome,use:()=>{
    const novo=!pt.aceso;pt.aceso=true;G.checkpoint={x,y:y+16,dir:'baixo'};SFX.lamp();
    toast(novo?TXT.pointLit:TXT.pointAgain,'good');if(diario)addDiary(diario,true);if(A.id==='steam'&&novo)vapor(x,y-20,6);salvar(false);}});
  A.pontos=(A.pontos||[]).concat([pt]);return pt;
}
function saidaVale(A,tx,ty){
  objeto(A,SPR.get('escada',TEMA[A.tema].parede[0]),tx*16+16,ty*16+18,{camada:-40});
  interacao(A,{x:tx*16+16,y:ty*16+8,r:22,nome:'Escada para o vale',label:()=>'Voltar ao vale',use:()=>sairTumba(false)});A.saida={x:tx*16+16,y:ty*16-8,txt:'Saída'};
}
/* pedestal: a relíquia fica nele até ser recolhida; quem trouxe a relíquia do 3D já a carrega */
function pedestal(A,tx,ty,k){
  const x=tx*16+8,y=ty*16+14,cor=TOMBS[k].col;
  const o=objeto(A,SPR.get('pedestal',null),x,y,{col:[-10,-8,10,0]});
  o.desenho=(g,ob,t)=>{blit(g,SPR.get('pedestal',null),ob.x,ob.y,ob.ax,ob.ay);if(!G.relics[k]){const yy=ob.y-22+Math.round(Math.sin(t*2.5)*1.5);blit(g,SPR.get('reliquia',k,2),ob.x,yy,6,6);}};
  A.lampadas.push({x,y:y-16,get r(){return G.relics[k]?18:40;},cor});
  A.ped={x,y:y-36,txt:'Relíquia'};
  /* com o portão da câmara fechado o pedestal não oferece nada, nem através da grade */
  interacao(A,{x,y:y+12,r:22,nome:()=>G.relics[k]?'Pedestal':mai1(RELIC_INFO[k].name),label:()=>!saberOk(k)?null:G.relics[k]?'Pedestal '+relDe(k)+' (já está com você)':'Pegar '+relNome(k),use:()=>{if(reliquiaLiberada(k))pegarReliquia(k,x,y-20);else if(G.relics[k])toast(relNome(k,true)+' já está com você'+(saberOk(k)?', desperto pelo saber.':'.'));}});
}
/* regra única da recompensa: a relíquia só é entregue quando todas as etapas da tumba foram concluídas (é isso que abre o
   portão da câmara) e só uma vez. Teclado, toque e controle chegam aqui pela mesma interação. */
function reliquiaLiberada(k){return saberOk(k)&&!G.relics[k];}
function pegarReliquia(k,x,y){
  if(!reliquiaLiberada(k))return false;
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
  interacao(A,{x,y:y+10,r:22,nome:mai1(rotulo.replace(/^(Usar|Programar) (o |a )?/,'')),label:()=>rotulo,use:()=>{abrirPainel(k,A,foco);}});A.term={x,y:y-30,txt:'Programe aqui'};
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
  const A=AREAS[k];
  if(feitos<l.length){const prox=l.find(d=>!G.learn[d.id]);return{t:'Saber: '+S.nome+' · etapa '+(feitos+1)+' de '+l.length,s:termNome+': '+prox.titulo+'.',alvo:A&&A.term};}
  if(!G.relics[k])return{t:'Saber recuperado',s:'O caminho para '+relNome(k)+' está aberto.',alvo:A&&A.ped};
  return{t:'Tumba concluída',s:'Volte ao vale: '+(saberesCount()<4?'a próxima tumba espera.':'leve os quatro saberes à Cidade-Jardim.'),alvo:A&&A.saida};
}
