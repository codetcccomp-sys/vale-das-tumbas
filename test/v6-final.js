// Cena final e teto da Cidade-Jardim. A câmera final faz um arco por cima da escada, entre as paredes do terraço,
// a 12-24 m da árvore; o explorador e a árvore ficam no quadro e acima do texto, em pé e deitado. As tampas de vidro
// do teto recolhem para dentro das paredes: nunca ficam penduradas para fora nem abaixo do topo das paredes.
const {open}=require('./lib');const {suite}=require('./assert');
(async()=>{
  const S=suite('cena final');let all=[];
  for(const [nome,vp] of [['em pé',{width:412,height:915}],['deitado',{width:915,height:412}]]){
    const {browser,page,logs}=await open({viewport:vp});const ev=(f,a)=>page.evaluate(f,a);
    const r=await ev(()=>{
      __vt.start(true);__vt.sim(5);__vt.G.relics={steam:true,diesel:true,atom:true,bio:true};__vt.enter('final');let n=0;while(__vt.G.mode!=='play'&&n<300){__vt.sim(1);n++;}
      /* teto: abre as quatro seções e confere a posição das tampas durante toda a abertura */
      const box=new THREE.Box3();let pendurado=0,amostras=0;
      for(let i=0;i<4;i++)cSectionDone(i);
      for(let f=0;f<60*9;f++){__vt.sim(1);if(f%15)continue;
        for(const s of cty.slabs)for(const g of[s.gl,s.gr]){if(!g.visible)continue;g.updateMatrixWorld(true);box.setFromObject(g);amostras++;
          if(box.min.y<9.0||Math.max(Math.abs(box.min.x),Math.abs(box.max.x))>9.85)pendurado++;}}
      const fechadas=cty.slabs.filter(s=>s.gl.visible||s.gr.visible).length;
      /* cena final */
      /* como no jogo: a câmera é desenhada a cada quadro, então ao chegar à árvore ela está atrás do explorador */
      toastClear();__vt.tp(2.5,-165.5,8);__vt.G.p.face=Math.PI;__vt.cam.yaw=0;__vt.cam.cur=__vt.cam.want;for(let i=0;i<30;i++){__vt.sim(1);__vt.renderOnce();}__vt.tp(2.5,-167,8);__vt.sim(2);
      const comecou=__vt.G.mode;const cam=__vt.camera,v=new THREE.Vector3();let fora=0,longe=0,quadro=0,texto=0,checks=0;const dists=[];
      for(let f=0;f<60*22;f++){__vt.sim(1);if(f%20)continue;__vt.renderOnce();cam.updateMatrixWorld();
        const c=cam.position,t=f/60;
        if(Math.abs(c.x)>8.6||c.z<-180.5||c.z>-134||c.y>21.5||c.y<2)fora++;
        if(t>=2.5){const d=Math.hypot(c.x,c.y-8,c.z+172.5);dists.push(+d.toFixed(1));if(d<12||d>24)longe++;}
        if(t>=3&&__vt.G.mode==='ending'){checks++;
          const p=__vt.G.p,pts=[[p.x,p.y+1.8,p.z],[p.x,p.y,p.z],[0,8,-172.5],[0,17,-173.5]];
          if(pts.some(q=>{v.set(...q).project(cam);return Math.abs(v.x)>0.97||Math.abs(v.y)>0.97||v.z>1;}))quadro++;
          const lt=document.getElementById('endLine').getBoundingClientRect().top;v.set(p.x,p.y,p.z).project(cam);
          const pes=(1-v.y)/2*innerHeight;if(document.getElementById('endLine').textContent&&pes>lt+4)texto++;}}
      const terminou=__vt.G.mode,fim=!document.getElementById('scEnd').hidden;
      /* voltar ao vale desfaz o enquadramento especial */
      document.getElementById('eVale').click();n=0;while(__vt.G.mode!=='play'&&n<400){__vt.sim(1);n++;}
      const limpo={view:!!(cam.view&&cam.view.enabled),fov:cam.fov,area:__vt.G.area.name};
      return{amostras,pendurado,fechadas,comecou,fora,longe,checks,quadro,texto,terminou,fim,limpo,dmin:Math.min(...dists),dmax:Math.max(...dists)};});
    S.ok(r.amostras>20&&r.pendurado===0,nome+': tampas do teto nunca ficam penduradas fora das paredes nem abaixo do topo',{amostras:r.amostras,pendurado:r.pendurado});
    S.ok(r.fechadas===0,nome+': com as quatro seções vencidas, o teto fica todo aberto',r.fechadas);
    S.ok(r.comecou==='ending',nome+': chegar à árvore começa a cena final',r.comecou);
    S.ok(r.fora===0,nome+': a câmera final fica entre as paredes, abaixo do topo delas',r.fora);
    S.ok(r.longe===0,nome+': a câmera final fica a 12-24 m da árvore',{min:r.dmin,max:r.dmax});
    S.ok(r.checks>20&&r.quadro===0,nome+': explorador (cabeça e pés) e árvore (base e copa) sempre no quadro',{checks:r.checks,fora:r.quadro});
    S.ok(r.texto===0,nome+': o texto da cena não cobre o explorador',r.texto);
    S.ok(r.terminou==='end'&&r.fim,nome+': a cena termina na tela FIM',{modo:r.terminou,fim:r.fim});
    S.ok(!r.limpo.view&&r.limpo.area==='vale'&&r.limpo.fov===(vp.width<vp.height?74:62),nome+': voltar ao vale desfaz o enquadramento da cena',r.limpo);
    all=all.concat(logs);await browser.close();
  }
  S.done(all);
})();
