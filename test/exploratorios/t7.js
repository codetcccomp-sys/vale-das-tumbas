const {open,ROOT}=require('../lib');
(async()=>{
  const {browser,ctx,page,logs}=await open();
  const cdp=await ctx.newCDPSession(page);
  const touch=(type,pts)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pts.map(p=>({x:p[0],y:p[1],id:p[2]}))});
  const P=s=>console.log(s);
  const rect=id=>page.evaluate(id=>{const r=document.getElementById(id).getBoundingClientRect();return[r.x+r.width/2,r.y+r.height/2,r.width,r.height];},id);
  await page.evaluate(()=>{__vt.start(true);__vt.sim(20);});
  const s0=await page.evaluate(()=>__vt.state());
  // 1) joystick: encostar o dedo na esquerda e arrastar para cima
  await touch('touchStart',[[90,700,1]]);await touch('touchMove',[[90,650,1]]);
  P('joystick: '+JSON.stringify(await page.evaluate(()=>({x:__vt.IN.joy.x.toFixed(2),y:__vt.IN.joy.y.toFixed(2),id:__vt.IN.joy.id,base:getComputedStyle(document.getElementById('joyBase')).display}))));
  await page.evaluate(()=>__vt.sim(60));
  const s1=await page.evaluate(()=>__vt.state());P('andou para o norte: z '+s0.z.toFixed(1)+' -> '+s1.z.toFixed(1)+' (esperado diminuir)');
  // 2) segundo dedo: câmera na direita, enquanto o joystick continua pressionado
  const yaw0=await page.evaluate(()=>__vt.cam.yaw);
  await touch('touchStart',[[90,650,1],[300,500,2]]);await touch('touchMove',[[90,650,1],[360,500,2]]);await touch('touchMove',[[90,650,1],[400,470,2]]);
  const yaw1=await page.evaluate(()=>__vt.cam.yaw);
  P('câmera com 2 dedos: yaw '+yaw0.toFixed(2)+' -> '+yaw1.toFixed(2)+'; joystick ainda ativo: '+await page.evaluate(()=>__vt.IN.joy.id!==null));
  await touch('touchEnd',[[90,650,1],[400,470,2]]);
  await page.evaluate(()=>__vt.sim(30));
  P('soltou os dedos: joystick='+JSON.stringify(await page.evaluate(()=>({x:__vt.IN.joy.x,y:__vt.IN.joy.y,id:__vt.IN.joy.id}))));
  // 3) botões: Pular
  const [jx,jy]=await rect('bJump');
  await touch('touchStart',[[jx,jy,3]]);await touch('touchEnd',[]);
  const pressed=await page.evaluate(()=>!!__vt.IN.pressed.jump);
  await page.evaluate(()=>__vt.sim(12));
  P('botão Pular: registrou='+pressed+' altura depois de 12 passos='+(await page.evaluate(()=>__vt.state().y)).toFixed(2));
  // 4) Correr (liga/desliga) + andar
  const [rx,ry]=await rect('bRun');
  await touch('touchStart',[[rx,ry,4]]);await touch('touchEnd',[]);
  P('Correr ligado: '+await page.evaluate(()=>__vt.IN.runToggle)+' classe on='+await page.evaluate(()=>document.getElementById('bRun').classList.contains('on')));
  await touch('touchStart',[[90,700,5]]);await touch('touchMove',[[90,640,5]]);
  await page.evaluate(()=>__vt.sim(40));
  P('velocidade correndo (esperado ~7.4): '+(await page.evaluate(()=>{const p=__vt.G.p;return Math.hypot(p.vx,p.vz);})).toFixed(2));
  await touch('touchEnd',[]);
  // 5) o botão Usar numa porta
  await page.evaluate(()=>{__vt.tp(95.2,-90);__vt.sim(5);});
  const pr=await page.evaluate(()=>({txt:document.getElementById('prompt').textContent,disp:getComputedStyle(document.getElementById('prompt')).display}));
  const [ux,uy]=await rect('bUse');
  // o aviso não pode cobrir os botões
  const pbox=await page.evaluate(()=>{const r=document.getElementById('prompt').getBoundingClientRect();return[r.left,r.top,r.right,r.bottom];});
  const ubox=await page.evaluate(()=>{const o=[];for(const id of['bUse','bJump','bRun','bLight']){const r=document.getElementById(id).getBoundingClientRect();o.push([id,r.left,r.top,r.right,r.bottom]);}return o;});
  const overlap=ubox.filter(b=>!(pbox[2]<b[1]||pbox[0]>b[3]||pbox[3]<b[2]||pbox[1]>b[4])).map(b=>b[0]);
  P('aviso: "'+pr.txt+'" visível='+pr.disp+' sobrepõe botões: '+(overlap.length?overlap.join(','):'nenhum'));
  await touch('touchStart',[[ux,uy,6]]);await touch('touchEnd',[]);
  await page.evaluate(()=>__vt.sim(150));
  P('Usar na porta -> área: '+await page.evaluate(()=>__vt.state().area));
  // 6) a página não rola
  P('scrollTop: '+await page.evaluate(()=>(document.scrollingElement||document.documentElement).scrollTop));
  await page.evaluate(()=>__vt.renderOnce());await page.screenshot({path:ROOT+'/test/shots/20-toque.png'});
  P('LOGS '+(logs.filter(l=>!l.includes('ERR_FAILED')).join('\n')||'(nenhum erro)'));
  await browser.close();
})().catch(e=>{console.error('FALHOU',e);process.exit(1);});
