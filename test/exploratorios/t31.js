const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,page,logs}=await open();
  const P=s=>console.log(s);const ev=(f,a)=>page.evaluate(f,a);const st=()=>ev(()=>__vt.state());
  const shot=async n=>{await ev(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/'+n+'.png'});};
  const last=()=>ev(()=>{const t=document.querySelector('#msgs .toast:last-child');return t?t.textContent:null;});
  await ev(()=>{__vt.start(true);__vt.sim(10);});
  P('segredos no início: '+await ev(()=>__vt.G.sec&&Object.keys(__vt.G.sec).length)+' | itens: '+await ev(()=>({f:SEC_FRAGS.length,c:SEC_CHESTS.length,d:SEC_INSC.length,ids:SEC_IDS.length})).then(JSON.stringify).catch(()=>'?'));
  // cada segredo: ir até 2 m ao sul, usar, conferir
  const res=await ev(()=>{
    const out=[];const items=[].concat(SEC_FRAGS.map(f=>[f.id,f.x,f.z]),SEC_CHESTS.map(c=>[c.id,c.x,c.z]),SEC_INSC.map(d=>[d.id,d.x,d.z]));
    for(const[id,x,z]of items){
      __vt.G.invuln=0;__vt.tp(x,z+2.0);__vt.sim(5);
      const p=__vt.G.p,dist=Math.hypot(p.x-x,p.z-(z+2.0)).toFixed(2);
      const prompt=(__vt.renderOnce(),document.getElementById('prompt').textContent);
      __vt.use();__vt.sim(5);
      out.push(id+': dist da posição pedida='+dist+' prompt="'+prompt+'" marcado='+!!__vt.G.sec[id]);
    }
    return out;
  });
  res.forEach(r=>P(r));
  P('contagem: '+await ev(()=>secCount())+'/12; diário: '+await ev(()=>__vt.G.diary.filter(d=>d.startsWith('sec_')||/^insc_d/.test(d)).length)+' entradas de segredos');
  P('última mensagem: '+await last());
  await ev(()=>{__vt.G.invuln=0;});
  // segundo uso não repete
  await ev(()=>{const c=SEC_CHESTS[0];__vt.tp(c.x,c.z+2);__vt.sim(5);__vt.use();__vt.sim(5);});
  P('segundo uso do baú: contagem='+await ev(()=>secCount())+' (esperado 12) diário='+await ev(()=>__vt.G.diary.length));
  await ev(()=>{__vt.G.hearts=3;});
  // diário e mapa
  await ev(()=>{__vt.tp(0,150);__vt.sim(3);});
  await page.click('#btnDiary');await page.waitForTimeout(150);
  P('diário aberto: contador="'+await ev(()=>document.getElementById('secCount').textContent)+'"');
  await shot('110-diario');
  await page.click('#tabMap');await page.waitForTimeout(150);
  P('mapa: nota="'+await ev(()=>document.getElementById('mapNote').textContent)+'"');
  await shot('111-mapa-completo');
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e.message.split('\n').slice(0,3).join(' | '));process.exit(1);});
