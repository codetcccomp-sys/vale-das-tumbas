// Desempenho sem mudar a imagem: o pontilhado em padrão desenha o mesmo que pixel a pixel; os carimbos de luz dão a mesma
// transparência que os degraus desenhados linha a linha; o mundo não é redesenhado por baixo do Guia, do diário e da pausa
// (e volta ao fechar); os pedaços do chão em volta da tela ficam prontos antes; e um quadro custa pouco nas áreas escuras.
const {open}=require('./lib');const {suite}=require('./assert');
const t=suite('b21-desempenho');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:360,height:640},dpr:3,touch:true});
  const vigia=setTimeout(()=>{console.log('  FALHA  tempo esgotado');process.exitCode=1;browser.close();},180000);
  const ev=(f,a)=>page.evaluate(f,a);
  try{
  await ev(()=>document.getElementById('btnNew').click());await page.waitForTimeout(250);
  await ev(()=>{G.treino.feito=true;G.mode='play';});

  /* ---- pontilhado: padrão 2×2 = o laço antigo, pixel a pixel (cores com e sem transparência, as duas fases, transparência global) ---- */
  const pt=await ev(()=>{
    const velho=(g,x,y,w,h,c,fase)=>{g.fillStyle=c;for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(((i+j+(fase|0))&1)===0)g.fillRect(x+i,y+j,1,1);};
    let dif=0,casos=0;
    for(const [x,y,w,h,c,f,al] of [[0,0,16,16,'#4aa04a',0,1],[3,5,10,2,'#2a2a2a',0,1],[7,2,16,3,'rgba(0,0,0,0.28)',0,1],[1,1,37,23,'#b98cff',1,0.22],[4,9,30,11,'#b98cff',0,0.26],[0,0,1,1,'#fff',1,1],[5,4,0,6,'#fff',0,1]]){
      const a=cnv(48,40),ga=ctx2(a),b=cnv(48,40),gb=ctx2(b);ga.fillStyle=gb.fillStyle='#35281c';ga.fillRect(0,0,48,40);gb.fillRect(0,0,48,40);
      ga.globalAlpha=gb.globalAlpha=al;velho(ga,x,y,w,h,c,f);P.ponti(gb,x,y,w,h,c,f);
      const da=ga.getImageData(0,0,48,40).data,db=gb.getImageData(0,0,48,40).data;for(let i=0;i<da.length;i++)if(da[i]!==db[i])dif++;casos++;}
    return{dif,casos};});
  t.ok(pt.dif===0,'o pontilhado em padrão desenha exatamente o mesmo que o pontilhado pixel a pixel ('+pt.casos+' casos, inclusive a névoa da Viva)',pt);

  /* ---- carimbos de luz = os quatro degraus desenhados linha a linha (diferença de arredondamento de no máximo 2 em 255) ---- */
  const lz=await ev(()=>{let max=0,casos=0;
    for(const [r,f,e] of [[84,1,0.6],[46,1,0.62],[34,0.8,0.55],[52,0.9,0.7],[12,1,0.6],[120,1,0.42],[28,1,0.6]]){
      const mk=()=>{const c=cnv(260,260),g=ctx2(c);g.fillStyle='rgba(6,4,12,1)';g.globalAlpha=e;g.fillRect(0,0,260,260);g.globalAlpha=1;g.globalCompositeOperation='destination-out';return[c,g];};
      const [a,ga]=mk();for(const[rr,al]of DEGRAUS_LUZ){ga.globalAlpha=al*f;P.circ(ga,130,130,r*rr,'#000');}
      const [b,gb]=mk();const s=carimboLuz(r,f);gb.drawImage(s.img,130-s.o,130-s.o);
      /* compara a cor já multiplicada pela transparência (o que vai para a tela): com transparência quase zero, a cor isolada não significa nada */
      const da=ga.getImageData(0,0,260,260).data,db=gb.getImageData(0,0,260,260).data;for(let i=0;i<da.length;i+=4)for(let k=0;k<4;k++){const va=k<3?da[i+k]*da[i+3]/255:da[i+3],vb=k<3?db[i+k]*db[i+3]/255:db[i+3];max=Math.max(max,Math.round(Math.abs(va-vb)));}casos++;}
    return{max,casos};});
  t.ok(lz.max<=2,'cada carimbo de luz recorta a escuridão como os quatro degraus desenhados linha a linha ('+lz.casos+' raios, diferença máxima '+lz.max+' em 255)',lz);
  const nc=await ev(()=>{CARIMBOS.clear();for(let i=0;i<600;i++)carimboLuz(46+Math.sin(i*0.37)*1.5,1);return CARIMBOS.size;});
  t.ok(nc<=16,'uma luz que tremula reaproveita poucos carimbos (raio em 1/4 de pixel): '+nc+' para 600 quadros',nc);

  /* ---- mundo parado por baixo do Guia, do diário e da pausa ---- */
  const par=await ev(()=>{__vt.entrar('steam');G.mode='play';G.lanternOn=true;__vt.quadros(3);
    let n=0;const dc=desenharChao;window.desenharChao=function(){n++;return dc.apply(this,arguments);};
    const q=k=>{for(let i=0;i<k;i++)__vt.quadros(1);};
    const conta=(abrir,fechar)=>{n=0;abrir();q(1);const primeiro=n;q(30);const depois=n-primeiro;fechar();q(1);const fechou=n-primeiro-depois;return{primeiro,depois,fechou};};
    const r={guia:conta(()=>abrirGuia(),()=>{fecharGuia();G.mode='play';}),diario:conta(()=>abrirDiario(),()=>{fecharDiario();G.mode='play';}),pausa:conta(()=>pausar(),()=>retomar()),
      jogo:(()=>{n=0;q(10);return n;})(),painel:(()=>{__vt.painel('steam');n=0;q(10);const k=n;fecharPainel();G.mode='play';return k;})()};
    window.desenharChao=dc;return r;});
  t.ok(['guia','diario','pausa'].every(k=>par[k].primeiro===1&&par[k].depois===0&&par[k].fechou===1),'com o Guia, o diário ou a pausa abertos, o mundo é desenhado uma vez e fica parado; ao fechar, volta a ser desenhado',par);
  t.ok(par.jogo===10&&par.painel===10,'jogando e com o painel de programação aberto, o mundo continua sendo desenhado a cada quadro (a sala reage ao programa)',{jogo:par.jogo,painel:par.painel});
  /* com o laço de verdade (requestAnimationFrame): em 1,5 s com o Guia aberto, só um ou dois quadros do mundo (um por segundo,
     para o caso de o navegador descartar a imagem), e um a mais logo que a tela muda de tamanho */
  await ev(()=>{abrirGuia();window.__nDC=0;const dc=desenharChao;window.__dc=dc;window.desenharChao=function(){__nDC++;return dc.apply(this,arguments);};});
  await page.waitForTimeout(1500);const parado=await ev(()=>__nDC);
  await ev(()=>{__nDC=0;});await page.setViewportSize({width:640,height:360});await page.waitForTimeout(250);
  const res=await ev(()=>{const n=__nDC;window.desenharChao=__dc;fecharGuia();G.mode='play';return{desenhos:n};});res.parado15s=parado;
  await page.setViewportSize({width:360,height:640});await page.waitForTimeout(300);
  t.ok(res.parado15s<=4&&res.desenhos>=1&&res.desenhos<=2,'com o Guia aberto, o laço do jogo desenha o mundo no máximo uma vez por segundo (antes, 60); se a tela muda de tamanho, desenha de novo na hora',res);

  /* ---- chão: os pedaços em volta ficam prontos antes de entrar na tela ---- */
  const ch=await ev(()=>{__vt.entrar('vale');G.mode='play';G.time=0.25;R.chunks.clear();__vt.ir(1448,2200,'baixo');__vt.quadros(1);
    const antes=R.chunks.size;for(let i=0;i<40;i++)__vt.quadros(1);const depois=R.chunks.size;
    /* anda um pedaço inteiro para baixo, aos poucos: nenhum quadro monta mais de um pedaço */
    let pior=0;for(let i=0;i<64;i++){const n0=R.chunks.size,k0=[...R.chunks.keys()].join();__vt.ir(1448,2200+i*4,'baixo');__vt.quadros(1);let novos=0;for(const k of R.chunks.keys())if(k0.indexOf(k)<0)novos++;pior=Math.max(pior,novos);}
    return{antes,depois,pior};});
  t.ok(ch.depois>ch.antes&&ch.pior<=1,'os pedaços do chão em volta da tela são montados antes, um por quadro: andando, nenhum quadro monta mais de um ('+ch.antes+' → '+ch.depois+' pedaços prontos)',ch);

  /* ---- custo de um quadro nas áreas escuras (só o desenho da luz e da névoa; antes eram centenas a milhares de desenhos) ---- */
  const cu=await ev(()=>{const r={};for(const k of ['vale','steam','bio','camara']){__vt.entrar(k);G.mode='play';G.lanternOn=true;if(k==='vale')G.time=0.75;if(k==='bio')__vt.ir(14*16,19*16,'cima');for(let i=0;i<40;i++)__vt.quadros(1);
    let n=0,dentro=false;const fr=CanvasRenderingContext2D.prototype.fillRect;CanvasRenderingContext2D.prototype.fillRect=function(){if(dentro)n++;return fr.apply(this,arguments);};
    const dl=desenharLuz,A=G.area,ch=A.desenharChao;window.desenharLuz=function(){dentro=true;try{return dl.apply(this,arguments);}finally{dentro=false;}};
    if(ch)A.desenharChao=function(){dentro=true;try{return ch.apply(this,arguments);}finally{dentro=false;}};
    for(let i=0;i<10;i++)__vt.quadros(1);CanvasRenderingContext2D.prototype.fillRect=fr;window.desenharLuz=dl;if(ch)A.desenharChao=ch;r[k]=Math.round(n/10);}
    __vt.entrar('vale');G.mode='play';return r;});
  t.ok(cu.vale<=60&&cu.steam<=60&&cu.bio<=80&&cu.camara<=60,'a luz e a névoa custam poucos retângulos por quadro (antes: vale à noite ~1.500, Engrenagens ~2.700, Viva ~20 mil, câmara ~3.600)',cu);

  t.done(logs);
  }catch(e){console.log('  FALHA  '+e.message);process.exitCode=1;}
  clearTimeout(vigia);await browser.close();
})();
