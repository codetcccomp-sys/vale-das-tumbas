// Leitura dos objetos e das colisões no navegador: o alvo da etapa tem símbolo e texto curto, o objeto ao alcance mostra
// o nome, o obstáculo encoberto pelo explorador (e o explorador encoberto) aparece em contorno, o terminal do pátio tem
// luz própria, as caixas de colisão de fogueiras, rochas, terminais e portas não passam do desenho, e o caminho do treino
// não tem obstáculo escondido entre a manivela e o terminal.
const {open}=require('./lib');const {suite}=require('./assert');const {ui}=require('./ui');
const t=suite('b8-leitura');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:900,height:640},dpr:1,hash:'#vt-treino'});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},180000);
  const U=ui(page),ev=U.ev;
  const marcas=()=>ev(()=>{const m=document.getElementById('marcaAlvo'),n=document.getElementById('nomeObj');return{m:m.hidden?null:m.textContent,n:n.hidden?null:n.textContent,nAlvo:n.classList.contains('alvo')};});
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(200);
  await ev(()=>{toastClear();__vt.ir(12.5*16+8,14.5*16,'cima');__vt.quadros(3);});
  let m=await marcas();t.ok(m.m==='Ande até aqui','primeiro passo: o alvo tem símbolo e texto curto (◆ Ande até aqui)',m);
  const css=await ev(()=>{const e=document.getElementById('marcaAlvo'),s=getComputedStyle(e),b=getComputedStyle(e,'::before');return{bg:s.backgroundColor,antes:b.content};});
  t.ok(/◆/.test(css.antes)&&css.bg!=='rgba(0, 0, 0, 0)','o alvo usa símbolo, texto e cor (não só cor)',css);
  await ev(()=>{__vt.ir(TREINO.marca.x,TREINO.marca.y+2,'cima');__vt.quadros(3);});
  m=await marcas();t.ok(m.m==='Lume','depois da marca, o alvo passa para o Lume',m);
  await ev(()=>{__vt.G.treino.passo=2;__vt.ir(TREINO.manivela.x,TREINO.manivela.y+12,'cima');__vt.quadros(3);});
  m=await marcas();t.ok(m.n==='Manivela de latão'&&m.nAlvo&&m.m===null,'ao alcance, o nome do objeto aparece em cima dele (destacado por ser o alvo)',m);
  await ev(()=>{__vt.ir(10.5*16,15.5*16+16,'cima');__vt.quadros(3);});
  m=await marcas();t.ok(m.n==='Placa do pátio'&&!m.nAlvo,'objeto que não é o alvo: só o nome, sem destaque',m);
  /* terminal com silhueta e luz próprias */
  const term=await ev(()=>{const o=__vt.G.area.objs.find(o=>o.img&&o.img.width===26&&o.img.height===40);return{achou:!!o};});
  t.ok(term.achou,'o terminal do pátio tem silhueta própria (mastro com lâmpada), diferente das ruínas',term);
  /* caminho do treino: em linha reta da manivela até o terminal, sem obstáculo */
  const reta=await ev(()=>{const A=__vt.G.area,a={x:TREINO.manivela.x,y:TREINO.manivela.y+8},b={x:TREINO.term.tx*16+8,y:TREINO.term.ty*16+26};const bloq=[];
    for(let i=0;i<=40;i++){const x=a.x+(b.x-a.x)*i/40,y=a.y+(b.y-a.y)*i/40;if(!livreEm(A,x,y))bloq.push([Math.round(x),Math.round(y)]);}return bloq;});
  t.ok(!reta.length,'da manivela ao terminal o caminho é livre (a fogueira saiu da frente)',reta);
  /* todos os pontos do treino são alcançáveis a pé a partir da entrada */
  const alc=await ev(()=>{const A=__vt.G.area,S=4,ini={x:A.spawn.x,y:A.spawn.y},vis=new Set(),fila=[[Math.round(ini.x/S),Math.round(ini.y/S)]];vis.add(fila[0].join());
    while(fila.length){const[x,y]=fila.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(vis.has(k)||nx<0||ny<0||nx>A.w*16/S||ny>A.h*16/S)continue;if(!livreEm(A,nx*S,ny*S))continue;vis.add(k);fila.push([nx,ny]);}}
    const perto=(x,y)=>{for(const k of vis){const[a,b]=k.split(',').map(Number);if(Math.hypot(a*S-x,b*S-y)<12)return true;}return false;};
    return{marca:perto(TREINO.marca.x,TREINO.marca.y),lume:perto(TREINO.lume.tx*16+8,TREINO.lume.ty*16+20),manivela:perto(TREINO.manivela.x,TREINO.manivela.y+10),terminal:perto(TREINO.term.tx*16+8,TREINO.term.ty*16+28)};});
  t.ok(alc.marca&&alc.lume&&alc.manivela&&alc.terminal,'marca, Lume, manivela e terminal são alcançáveis a pé',alc);
  /* contorno: o explorador encobre a fogueira; atrás de uma coluna, o explorador aparece em contorno */
  let enc=await ev(()=>{__vt.ir(4.6*16+2,10.9*16+5,'cima');__vt.quadros(2);return __vt.R.encobertos;});
  t.ok(enc&&enc.obj>=1,'obstáculo encoberto pelo explorador aparece por cima, semitransparente e com contorno',enc);
  enc=await ev(()=>{__vt.ir(3*16,3*16-3,'baixo');__vt.quadros(2);return __vt.R.encobertos;});
  t.ok(enc&&enc.heroi,'atrás de uma coluna alta, o contorno do explorador aparece por cima dela',enc);
  enc=await ev(()=>{__vt.ir(16*16,14*16,'baixo');__vt.quadros(2);return __vt.R.encobertos;});
  t.ok(enc&&enc.obj===0&&!enc.heroi,'em campo aberto, nenhum contorno extra',enc);
  /* caixas de colisão dentro do desenho, em todas as áreas */
  const caixas=await ev(()=>{const ruins=[];const areas={treino:__vt.G.area,vale:AREAS.vale};for(const k of['steam','diesel','atom','bio','final'])areas[k]=areaTumba(k);
    for(const id in areas){const A=areas[id];for(const o of A.objs){if(!o.col||!o.img)continue;const[x0,y0,x1,y1]=o.col;
      if(x0<-o.ax-1||x1>o.img.width-o.ax+1||y0<-o.ay-1||y1>3)ruins.push(id+' ('+Math.round(o.x/16)+','+Math.round(o.y/16)+') '+o.img.width+'x'+o.img.height+' col '+o.col.join(','));}}
    return{ruins,n:Object.values(areas).reduce((s,A)=>s+A.objs.filter(o=>o.col).length,0)};});
  t.ok(!caixas.ruins.length,'as '+caixas.n+' caixas de colisão (fogueiras, rochas, terminais, portas…) ficam dentro do desenho',caixas.ruins.slice(0,8));
  /* na tumba, o alvo é o terminal; no vale, a porta da próxima tumba */
  await ev(()=>{__vt.G.treino.feito=true;__vt.G.learn={t1:true,t2:true};__vt.entrar('steam');__vt.ir(17*16+8,16*16,'cima');__vt.quadros(3);});
  m=await marcas();t.ok(m.m==='Programe aqui'||m.n==='Computador Ancestral','na tumba, o alvo da etapa aponta o terminal de programação',m);
  await ev(()=>{__vt.ir(17*16+8,13*16+6,'cima');__vt.quadros(3);});m=await marcas();t.ok(m.n==='Computador Ancestral'&&m.nAlvo,'perto do terminal, o nome aparece destacado',m);
  await ev(()=>{const T=TOMBS.steam;trocarArea(AREAS.vale,T.out.x*16+8,T.out.y*16+70,'cima');__vt.quadros(3);});
  m=await marcas();t.ok(m.m==='Tumba das Engrenagens','no vale, o alvo mostra o nome da próxima tumba',m);
  await page.screenshot({path:require('path').join(__dirname,'shots','alvo-vale.png')});
  }catch(err){t.ok(false,'erro no teste: '+err.message);}
  clearTimeout(vigia);t.done(logs);await browser.close();
})();
