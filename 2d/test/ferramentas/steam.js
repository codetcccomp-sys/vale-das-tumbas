const {open}=require('../lib');
(async()=>{
  const out=process.argv[2];
  const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true});
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{document.getElementById('btnNew').click();__vt.entrar('steam');__vt.ir(17*16+8,13*16+8,'cima');__vt.quadros(10);__vt.painel('steam');});
  const clicaPb=async txt=>{await ev(t=>{const b=[...document.querySelectorAll('#pPaleta .pb')].find(b=>b.textContent.indexOf(t)>=0);if(!b)throw new Error('sem placa '+t);b.click();},txt);};
  const espera=async()=>{for(let i=0;i<80;i++){const r=await ev(()=>!PAINEL.run||PAINEL.run.s.fim);if(r)return;await page.waitForTimeout(150);}};
  await ev(()=>{document.getElementById('pVel').click();});  // 2×
  await clicaPb('Programa A');await espera();await page.waitForTimeout(300);
  await clicaPb('Programa B');await espera();await page.waitForTimeout(300);
  console.log('demo:',await ev(()=>[__vt.G.learn.s0,document.getElementById('pMsg').textContent]));
  await clicaPb('Continuar');
  for(const c of ['AVANÇAR','AVANÇAR','VIRAR','AVANÇAR','ATIVAR'])await clicaPb(c);
  console.log('guia:',await ev(()=>document.getElementById('pMsg').textContent));
  await ev(()=>document.getElementById('pRun').click());await page.waitForTimeout(700);
  await page.screenshot({path:out.replace('.png','-a.png')});
  await espera();
  console.log('s1:',await ev(()=>[__vt.G.learn.s1,document.getElementById('pMsg').textContent]));
  await ev(()=>{const b=[...document.querySelectorAll('.etp')].find(b=>b.textContent.indexOf('Aplicação')>=0);b.click();});
  for(const c of ['AVANÇAR','AVANÇAR','VIRAR','AVANÇAR'])await clicaPb(c);
  await ev(()=>document.getElementById('pRun').click());await espera();
  console.log('erro:',await ev(()=>[document.getElementById('pMsg').textContent,document.querySelector('.ln.erro')&&document.querySelector('.ln.erro').textContent]));
  await page.screenshot({path:out.replace('.png','-b.png')});
  /* corrige: limpa e monta a solução */
  await ev(()=>{PAINEL.prog=[];PAINEL.cur={pai:null,ramo:null,i:0};renderPainel();});
  for(const c of ['AVANÇAR','AVANÇAR','AVANÇAR','VIRAR','AVANÇAR','AVANÇAR','VIRAR','AVANÇAR','AVANÇAR','ATIVAR'])await clicaPb(c);
  /* Passo a passo até o fim */
  for(let i=0;i<12;i++){await ev(()=>document.getElementById('pStep').click());await page.waitForTimeout(80);}
  console.log('s2:',await ev(()=>[__vt.G.learn.s2,document.getElementById('pMsg').textContent,saberOk('steam')]));
  await ev(()=>fecharPainel());await ev(()=>{__vt.ir(13*16+8,7*16+8,'cima');__vt.quadros(90);});
  await ev(()=>{__vt.ir(13*16+8,5*16,'cima');__vt.quadros(5);});
  console.log('na câmara:',await ev(()=>__vt.estado()));
  await page.screenshot({path:out});
  if(logs.length)console.log('LOGS:',logs.slice(0,5).join('\n'));
  await browser.close();
})();
