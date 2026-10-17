// Resolução: no modo normal o lado menor da imagem nunca fica abaixo de 720 pixels reais (a não ser que a própria
// tela do aparelho tenha menos); o ajuste automático desce só até esse piso e volta a subir quando o jogo fica folgado.
const {open}=require('./lib');const {suite}=require('./assert');
const CASOS=[
  {nome:'celular em pé 412×915, densidade 2,625',viewport:{width:412,height:915},dpr:2.625,touch:true},
  {nome:'celular deitado 915×412, densidade 2,625',viewport:{width:915,height:412},dpr:2.625,touch:true},
  {nome:'celular em pé 360×800, densidade 3',viewport:{width:360,height:800},dpr:3,touch:true},
  {nome:'celular antigo 360×640, densidade 1,5 (tela tem só 540 px)',viewport:{width:360,height:640},dpr:1.5,touch:true},
  {nome:'computador 1280×800, densidade 1',viewport:{width:1280,height:800},dpr:1,touch:false}
];
(async()=>{
  const S=suite('resolução');let all=[];
  for(const c of CASOS){
    const {browser,page,logs}=await open({viewport:c.viewport,dpr:c.dpr,touch:c.touch});
    const r=await page.evaluate(()=>{__vt.start(true);__vt.sim(3);__vt.renderOnce();
      const cv=__vt.renderer.domElement,lado=()=>Math.min(cv.width,cv.height),tela=Math.round(Math.min(innerWidth,innerHeight)*devicePixelRatio);
      const inicio=lado();
      for(let i=0;i<30;i++)adaptResolution(0.06);const piso=lado();       // jogo lento: desce até o piso
      for(let i=0;i<30;i++)adaptResolution(0.01);const volta=lado();      // jogo folgado: sobe de novo
      CFG.gfx='leve';pixelRatio=pixelCap();resize();const leve=lado();CFG.gfx='normal';pixelRatio=pixelCap();resize();
      return{tela,inicio,piso,volta,leve};});
    const alvo=Math.min(720,r.tela);
    S.ok(r.inicio>=alvo-1,c.nome+': começa com o lado menor ≥ '+alvo+' px',r);
    S.ok(r.piso>=alvo-1,c.nome+': com o jogo lento, o ajuste automático não desce abaixo de '+alvo+' px',r.piso);
    S.ok(r.volta>=r.inicio-1,c.nome+': quando o jogo fica folgado, a resolução volta a subir',{piso:r.piso,volta:r.volta});
    S.ok(r.leve>=Math.min(540,r.tela)-1&&r.leve<=r.inicio,c.nome+': modo leve fica em ~540 px (ou o que a tela tiver)',r.leve);
    all=all.concat(logs);await browser.close();
  }
  S.done(all);
})();
