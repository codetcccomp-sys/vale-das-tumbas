// Salvamento e migração no navegador: o save do 3D é lido e migrado sem ser alterado; as relíquias voltam adormecidas e
// despertam com o saber; save 2D estragado é aproveitado; save dentro de tumba volta à porta; posição dentro de
// obstáculo vai para um lugar livre.
const {open}=require('./lib');const {suite}=require('./assert');
const t=suite('b3-save');
const S3={v:1,relics:{steam:true,diesel:true,atom:false,bio:false},diary:['camp','steam_enter','steam_relic','diesel_relic','oasis','insc_oasis','sec_c1','sec_f_nw'],insc:{oasis:1},sec:{c1:true,f_nw:true},done:false,time:0.3,pos:{x:20,z:-30},yaw:2.1};
(async()=>{
  /* 1) migração do 3D */
  {const txt=JSON.stringify(S3);
    const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true});
    const ev=(f,a)=>page.evaluate(f,a);
    /* põe o save do 3D no armazenamento deste endereço e recarrega, como se o 3D tivesse sido jogado aqui */
    await ev(t=>{localStorage.clear();localStorage.setItem('vale_das_tumbas_save',t);},txt);await page.reload();await page.waitForFunction(()=>window.__vt);
    const ini=await ev(()=>({bt:document.getElementById('btnContinue').textContent,vis:!document.getElementById('btnContinue').hidden,nota:document.getElementById('startNote').textContent}));
    t.ok(ini.vis&&/3D/.test(ini.bt)&&/adormecidas/.test(ini.nota),'tela inicial oferece trazer o progresso do 3D',ini);
    await ev(()=>document.getElementById('btnContinue').click());await page.waitForTimeout(200);
    let e=await ev(()=>({...__vt.estado(),rel:['steam','diesel','atom','bio'].map(relicEstado),diario:__vt.G.diary.slice(),titulo:[...document.querySelectorAll('#relics img')].map(i=>i.title)}));
    t.ok(e.relics.steam&&e.relics.diesel&&!e.relics.atom&&e.rel.join()==='1,1,0,0','relíquias do 3D chegam adormecidas',e.rel);
    t.ok(e.titulo[0].indexOf('adormecida')>=0,'o HUD mostra a relíquia adormecida',e.titulo[0]);
    t.ok(e.diario.indexOf('steam_relic')>=0&&e.diario.indexOf('migrado')>=0&&e.sec===2,'diário e segredos migrados',{diario:e.diario.length,sec:e.sec});
    const p=await ev(()=>({x:__vt.G.p.x/16,y:__vt.G.p.y/16,livre:livreEm(__vt.G.area,__vt.G.p.x,__vt.G.p.y)}));t.ok(Math.abs(p.x-98.5)<3&&Math.abs(p.y-78.5)<3&&p.livre,'posição convertida do 3D para o mapa 2D, num lugar livre',p);
    const s3depois=await ev(()=>localStorage.getItem('vale_das_tumbas_save'));t.ok(s3depois===txt,'o save do 3D continua exatamente igual');
    /* a tumba das Engrenagens continua com os desafios: a relíquia desperta só com o saber */
    t.ok(await ev(()=>!saberOk('steam')&&tumbaAberta('steam')&&!tumbaAberta('diesel')),'relíquia trazida do 3D não pula os desafios: Motores segue selada');
    await ev(()=>{__vt.entrar('steam');__vt.usarEm(17*16+8,13*16+6,'cima');for(const id of['s0','s1','s3','s2']){escolherDesafio(__vt.DESAFIO[id]);concluirDesafio(__vt.DESAFIO[id]);}fecharPainel();});
    e=await ev(()=>({rel:relicEstado('steam'),diario:__vt.G.diary.indexOf('saber_seq')>=0}));t.ok(e.rel===2&&e.diario,'concluir os desafios desperta a relíquia e registra o saber no diário',e);
    const sv=await ev(()=>__vt.lerSave());t.ok(sv&&sv.v===1&&sv.migr&&sv.migr.relics===2&&sv.learn.s2,'save 2D versionado guarda a migração e as etapas',sv&&{v:sv.v,migr:sv.migr});
    /* sai do jogo dentro da tumba e continua: volta à porta */
    const gravou=await ev(()=>salvar(false)&&!!localStorage.getItem('vale_das_tumbas_2d'));t.ok(gravou,'o jogo grava o save 2D dentro da tumba');
    await page.reload();await page.waitForFunction(()=>window.__vt);
    const bt=await ev(()=>document.getElementById('btnContinue').textContent);t.ok(bt==='Continuar','com save 2D, Continuar usa o save 2D',bt);
    await ev(()=>document.getElementById('btnContinue').click());e=await ev(()=>({a:__vt.G.area.id,x:__vt.G.p.x/16,y:__vt.G.p.y/16}));
    t.ok(e.a==='vale'&&Math.abs(e.x-130.5)<1&&Math.abs(e.y-57.5)<1,'salvo dentro da tumba: continua na porta dela no vale',e);
    t.ok(await ev(()=>localStorage.getItem('vale_das_tumbas_save'))===txt,'o save do 3D segue intacto depois de jogar e salvar');
    t.done(logs.length?logs:undefined);await browser.close();
  }
  /* 2) save 2D estragado e posição dentro de obstáculo */
  {const ruim=JSON.stringify({v:1,relics:{steam:'sim'},learn:{s0:true,qq:true},diary:['camp','steam_relic',5],sec:{c2:true,zz:1},pos:{x:90.5,y:39.2},time:'x',progs:{s1:[{k:'cmd',cmd:'fwd'},{k:'voar'}]}});
    const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:2,touch:true});
    const t2=require('./assert').suite('b3-save (estragado)');const ev=(f,a)=>page.evaluate(f,a);
    await ev(t=>{localStorage.clear();localStorage.setItem('vale_das_tumbas_2d',t);},ruim);await page.reload();await page.waitForFunction(()=>window.__vt);
    await ev(()=>document.getElementById('btnContinue').click());await page.waitForTimeout(200);
    const e=await ev(()=>({...__vt.estado(),toasts:[...document.querySelectorAll('#msgs .toast')].map(x=>x.textContent),livre:livreEm(__vt.G.area,__vt.G.p.x,__vt.G.p.y),progs:__vt.G.progs}));
    t2.ok(e.relics.steam&&e.learn.s0&&!e.learn.qq&&e.sec===1,'o que vale do save estragado é aproveitado',{relics:e.relics,learn:e.learn,sec:e.sec});
    t2.ok(e.toasts.some(x=>/danificada/.test(x)),'avisa que parte do save estava danificada',e.toasts);
    t2.ok(e.livre&&e.y/16>40,'posição salva dentro da pirâmide vai para um lugar livre',{x:e.x/16,y:e.y/16});
    t2.ok(e.progs.s1&&e.progs.s1.length===1,'programa salvo é limpo sem perder as placas válidas',e.progs);
    await ev(()=>localStorage.setItem('vale_das_tumbas_2d','{lixo'));await page.reload();await page.waitForFunction(()=>window.__vt);
    const ini=await ev(()=>({cont:!document.getElementById('btnContinue').hidden}));t2.ok(!ini.cont,'save ilegível: o jogo abre normalmente, sem Continuar',ini);
    t2.done(logs);await browser.close();
  }
})();
