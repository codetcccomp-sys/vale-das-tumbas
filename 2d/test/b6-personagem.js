// Personagem principal: quadros de todas as direções e animações, linha do chão e mão na bengala coerentes, colisão só
// nos pés (a bengala não prende em portas e corredores), ordenação visual com o cenário, transições de animação e a
// folha de sprites exportada em recursos/.
const fs=require('fs'),path=require('path');
const {open,ROOT}=require('./lib');const {suite}=require('./assert');
const t=suite('b6-personagem');
(async()=>{
  const {browser,page,logs}=await open({viewport:{width:412,height:860},dpr:1,touch:false});
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>document.getElementById('btnNew').click());

  /* ---------- quadros ---------- */
  let r=await ev(()=>{const S=EXP,out={};for(const d of['baixo','cima','esquerda','direita'])for(const a of['parado','andar','usar','dano'])out[d+'.'+a]=S[d][a].map(c=>c.width+'x'+c.height);return out;});
  const qtd={parado:4,andar:8,usar:3,dano:2};
  t.ok(Object.keys(r).length===16&&Object.entries(r).every(([k,v])=>v.length===qtd[k.split('.')[1]]&&v.every(s=>s==='40x46')),'4 direções × repouso 4, caminhada 8, interação 3, dano 2; todos 40×46',Object.keys(r).length);
  /* a linha do chão (contorno sob as botas) fica sempre na linha 44 da célula: pelo menos uma bota apoiada em todo quadro */
  r=await ev(()=>{const res=[];for(const d in EXP)for(const a in EXP[d])EXP[d][a].forEach((c,i)=>{const px=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let base=-1;
    for(let y=c.height-1;y>=0&&base<0;y--)for(let x=12;x<29;x++)if(px[(y*c.width+x)*4+3]>0){base=y;break;}res.push(d+'.'+a+i+':'+base);});return res;});
  t.ok(r.every(s=>s.endsWith(':44')),'linha de contato com o chão igual em todos os quadros (âncora y=44)',r.filter(s=>!s.endsWith(':44')));
  /* altura do personagem constante: o topo da cabeça varia no máximo 2 px (respiração, passo e susto) */
  r=await ev(()=>{const tops=[];for(const d in EXP)for(const a in EXP[d])EXP[d][a].forEach(c=>{const px=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    /* coluna da cabeça: centro do corpo, longe da bengala */
    const xs=d==='direita'?[16,17,18]:d==='esquerda'?[21,22,23]:[19,20];let top=-1;for(let y=0;y<c.height&&top<0;y++)for(const x of xs)if(px[(y*c.width+x)*4+3]>0){top=y;break;}tops.push(top);});
    return{min:Math.min(...tops),max:Math.max(...tops)};});
  t.ok(r.max-r.min<=2,'altura do personagem coerente entre os quadros',r);
  /* esquerda é o espelho exato da direita */
  r=await ev(()=>{let ok=true;for(const a in EXP.direita)EXP.direita[a].forEach((c,i)=>{const e=EXP.esquerda[a][i];const A=c.getContext('2d').getImageData(0,0,40,46).data,B=e.getContext('2d').getImageData(0,0,40,46).data;
    for(let y=0;y<46;y++)for(let x=0;x<40;x++)for(let k=0;k<4;k++)if(A[(y*40+x)*4+k]!==B[(y*40+39-x)*4+k])ok=false;});return ok;});
  t.ok(r,'lateral esquerda espelha a direita pixel a pixel',r);

  /* ---------- colisão ---------- */
  r=await ev(()=>({PW,PH,cfg:HEROI_CONFIG.colisao}));
  t.ok(r.PW*2===r.cfg.largura&&r.PH*2===r.cfg.altura&&r.cfg.largura===12,'colisão é a caixa dos pés (12×6), a mesma da configuração',r);
  /* passagem de 1 tile (16 px) aberta numa parede: o personagem passa andando, de cima para baixo e de lado */
  r=await ev(()=>{const A=novaArea('teste_passagem',9,9,'steam');for(let y=0;y<9;y++)for(let x=0;x<9;x++)A.set(x,y,'chao');
    for(let x=0;x<9;x++)if(x!==4)A.set(x,4,'parede');for(let y=0;y<9;y++)if(y!==6)A.set(6,y,'parede');
    const c={x:4*16+8,y:7*16+8};for(let i=0;i<80;i++)moverCorpo(A,c,0,-1);const vert=c.y;
    const d={x:5*16+8,y:6*16+8};for(let i=0;i<60;i++)moverCorpo(A,d,1,0);
    const e={x:3*16+8,y:7*16+8};for(let i=0;i<80;i++)moverCorpo(A,e,0,-1);return{vert:vert/16,hor:d.x/16,parede:e.y/16};});
  t.ok(r.vert<4&&r.hor>7&&r.parede>4.5,'atravessa passagens de 1 tile (vertical e horizontal); a parede continua bloqueando',r);
  /* anda até a porta da tumba (sem teletransporte) e entra por ela */
  r=await ev(()=>{const d=__vt.porta('steam');__vt.ir(d.x,d.y+40,'cima');__vt.andar(0,-1,1.0);const e=__vt.estado();apertar('usar');passoJogo(1/60,performance.now());return{chegou:Math.round(d.y-__vt.G.p.y),prompt:e.prompt};});
  await page.waitForTimeout(800);r.area=await ev(()=>__vt.estado().area);
  t.ok(r.chegou>=0&&/Entrar/.test(r.prompt)&&r.area==='steam','anda até a porta da tumba e entra por ela (a bengala não prende)',r);
  r=await ev(()=>{__vt.ir(__vt.G.area.spawn.x,__vt.G.area.spawn.y,'cima');const y0=__vt.G.p.y;__vt.andar(0,-1,0.8);return{dy:y0-__vt.G.p.y,area:__vt.estado().area};});
  t.ok(r.dy>20,'anda pelo corredor da tumba',r);

  /* ---------- ordenação visual (y dos pés) ---------- */
  /* câmera presa no lugar para comparar a mesma tela com e sem o personagem perto do pilar do vale */
  r=await ev(()=>{const G=__vt.G,R=__vt.R;trocarArea(AREAS.vale,1379,2300,'baixo');G.mode='play';G.time=0.25;
    const pil=G.area.objs.find(o=>o.img&&o.img.height===44&&Math.abs(o.x-1379.2)<1);
    __vt.ir(pil.x,pil.y-8,'direita');desenharJogo();const cam={x:R.cam.x,y:R.cam.y};const salvo=window.camSeguir;window.camSeguir=function(){R.cam.x=cam.x;R.cam.y=cam.y;};
    const px=(x,y)=>Array.from(R.lg.getImageData(Math.round(x+R.ox),Math.round(y+R.oy),1,1).data).join(',');
    const ponto={x:Math.round(pil.x),y:pil.y-20};
    const p=G.p;p.vel=0;
    p.x=pil.x;p.y=pil.y-8;desenharJogo();const atras=px(ponto.x,ponto.y);
    p.x=pil.x+400;desenharJogo();const sem=px(ponto.x,ponto.y);
    p.x=pil.x;p.y=pil.y+14;desenharJogo();const frente=px(ponto.x,pil.y-6);
    p.x=pil.x+400;desenharJogo();const semF=px(ponto.x,pil.y-6);
    window.camSeguir=salvo;return{atras,sem,frente,semF};});
  t.ok(r.atras===r.sem&&r.frente!==r.semF,'atrás do pilar fica escondido; na frente, cobre o pilar',r);

  /* ---------- transições de animação ---------- */
  r=await ev(()=>{const G=__vt.G,p=G.p,S=()=>EXP[p.dir],qual=()=>{const f=frameJogador();for(const a in S()){const i=S()[a].indexOf(f);if(i>=0)return a+i;}return'?';};
    __vt.entrar('steam');__vt.ir(G.area.spawn.x,G.area.spawn.y,'cima');for(let i=0;i<30;i++)passoJogo(1/60,performance.now());const parado=qual();
    const K=__vt.IN.keys;K.KeyD=true;const andar=[];for(let i=0;i<40;i++){passoJogo(1/60,performance.now());andar.push(qual());}K.KeyD=false;
    const depois=[];for(let i=0;i<30;i++){passoJogo(1/60,performance.now());depois.push(qual());}
    p.usar=HEROI_CONFIG.animacoes.usar.duracao;const usar=[];for(let i=0;i<22;i++){usar.push(qual());passoJogo(1/60,performance.now());}
    G.invuln=0;G.hearts=3;ferir('teste');const dano=[];for(let i=0;i<40;i++){dano.push(qual());passoJogo(1/60,performance.now());}
    return{parado,dir:p.dir,andar,depois:depois.slice(-1)[0],usar,dano};});
  const andarQ=new Set(r.andar.filter(s=>s.startsWith('andar')));
  t.ok(r.parado.startsWith('parado')&&r.dir==='direita'&&andarQ.size>=6,'repouso → caminhada para a direita percorre o ciclo de 8 quadros',[r.parado,[...andarQ].join(' ')]);
  t.ok(r.depois.startsWith('parado'),'ao soltar, volta ao repouso',r.depois);
  t.ok(r.usar[0]==='usar0'&&r.usar.includes('usar1')&&r.usar.includes('usar2')&&!r.usar.slice(r.usar.indexOf('usar2')).some(s=>/usar[01]/.test(s))&&r.usar.slice(-1)[0].startsWith('parado'),'interação: 3 quadros em ordem e volta ao repouso',r.usar.join(' '));
  t.ok(r.dano.slice(0,20).every(s=>s.startsWith('dano'))&&r.dano.includes('dano1')&&r.dano.slice(-1)[0].startsWith('parado'),'dano: reação (com clarão) e depois volta ao repouso',r.dano.join(' '));

  /* ---------- folha de sprites exportada ---------- */
  const png=fs.readFileSync(path.join(ROOT,'recursos','heroi.png'));const W=png.readUInt32BE(16),H=png.readUInt32BE(20),tipo=png[25];
  const cfg=JSON.parse(fs.readFileSync(path.join(ROOT,'recursos','heroi.json'),'utf8'));
  t.ok(W===cfg.folha.colunas*cfg.celula.largura&&H===cfg.folha.linhas*cfg.celula.altura&&tipo===6,'recursos/heroi.png com células uniformes e canal de transparência (RGBA)',{W,H,tipo});
  t.ok(cfg.folha.ordem.length===16&&cfg.ancora.x===20&&cfg.ancora.y===44,'recursos/heroi.json descreve as 16 linhas e a âncora nos pés',cfg.folha.ordem.length);
  r=await ev(()=>{const f=folhaHeroi();return f.canvas.toDataURL('image/png').length;});
  t.ok(Math.abs(r-('data:image/png;base64,'.length+Math.ceil(png.length/3)*4))<8,'a folha exportada é a mesma que o jogo monta',{pagina:r,arquivo:png.length});

  t.done(logs.filter(l=>!/willReadFrequently/.test(l)));await browser.close();   // o aviso de leitura de pixels vem do próprio teste
})();
