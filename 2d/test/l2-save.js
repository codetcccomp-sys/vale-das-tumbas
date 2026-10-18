// Testes de lógica do salvamento 2D e da migração do save 3D (sem navegador).
const {carregar}=require('./vmload');
const {suite}=require('./assert');
const t=suite('l2-save');
const fs=require('fs'),path=require('path'),vm=require('vm');
const SRC=path.resolve(__dirname,'..','src');
const ctx=vm.createContext({console,JSON,Math,Object,Array,String,Number,Boolean,Error,Map,Set});
vm.runInContext(['01-core.js','02-lang.js','03-learn.js','04-save.js'].map(f=>fs.readFileSync(path.join(SRC,f),'utf8')).join('\n;\n')+';this.S=SAVE2D;this.T=TOMBS;this.E=ENTRIES;this.D=DESAFIO;this.v3=v3;this.TP=TREINO_PASSOS;',ctx,{timeout:5000});
const S=ctx.S,TOMBS=ctx.T;
const livre=()=>true;
/* save 3D válido */
const s3={v:1,relics:{steam:true,diesel:true,atom:false,bio:false},diary:['camp','steam_relic','diesel_relic','oasis','insc_oasis','sec_c1'],insc:{oasis:1},sec:{c1:true,f_nw:true},done:false,time:0.4,pos:{x:20,z:-30},yaw:1.2};
const d3=S.ler3d(JSON.parse(JSON.stringify(s3)));
t.ok(d3&&d3.relics.steam&&d3.relics.diesel&&!d3.relics.atom&&!d3.fixed,'save 3D válido é lido sem perdas',d3&&d3.relics);
const m=S.migrar(d3,livre);
t.ok(m.relics.steam&&m.relics.diesel&&!m.relics.atom,'relíquias do 3D migram (adormecidas: learn vazio)',{relics:m.relics,learn:m.learn});
t.ok(Object.keys(m.learn).length===0,'os desafios educativos ficam à parte (nenhum concluído)');
t.ok(m.diary.indexOf('steam_relic')>=0&&m.diary.indexOf('migrado')>=0&&m.diary.indexOf('sec_c1')>=0,'diário migra e ganha a nota da migração',m.diary);
t.ok(m.sec.c1&&m.sec.f_nw&&m.insc.oasis===1&&m.time===0.4,'segredos, inscrições e hora do dia migram');
const p=ctx.v3(20,-30);t.ok(Math.abs(m.pos.x-(Math.floor(p.x)+0.5))<0.01&&Math.abs(m.pos.y-(Math.floor(p.y)+0.5))<0.01,'posição do 3D convertida para o mapa 2D (escala 0,4)',[m.pos,p]);
/* posição bloqueada: procura o tile livre mais próximo */
const bloq=(x,y)=>!(x===98&&y===78)&&!(Math.abs(x-98)<=1&&Math.abs(y-78)<=1)?(x===100&&y===78):false;
const ps=S.posSegura(98.2,78.3,(x,y)=>Math.abs(x-98)+Math.abs(y-78)>=3);t.ok(Math.abs(ps.x-98.5)+Math.abs(ps.y-78.5)>=2.9,'posição dentro de obstáculo vai para o tile livre mais próximo',ps);
const fora=S.posSegura(500,-900,livre);t.ok(Math.hypot(fora.x-90,fora.y-90)<=80,'posição fora do vale volta para dentro',fora);
const nada=S.posSegura(50,50,()=>false);t.ok(nada.x===90.5&&nada.y===147.5,'sem lugar livre: acampamento',nada);
/* dentro de tumba: volta à porta */
const m2=S.migrar(S.ler3d(Object.assign({},s3,{tomb:'atom'})),livre);t.ok(Math.abs(m2.pos.x-(TOMBS.atom.out.x+0.5))<0.01&&Math.abs(m2.pos.y-(TOMBS.atom.out.y+0.5))<0.01,'save 3D dentro de tumba: porta da tumba no 2D',m2.pos);
/* save 3D estragado: campos ruins recuperados, relíquia deduzida do diário */
const ruim=S.ler3d({v:1,relics:'xx',diary:['camp','bio_relic',5,'naoexiste'],sec:{c1:true,zz:true},insc:[],pos:{x:'a'},time:NaN});
t.ok(ruim&&ruim.fixed&&ruim.relics.bio&&ruim.sec.c1&&!ruim.sec.zz&&ruim.pos===null,'save 3D estragado: recupera o que vale',ruim);
t.ok(S.ler3d(null)===null&&S.ler3d({v:2})===null&&S.ler3d('lixo')===null&&S.ler3d({v:1})===null,'lixo no lugar do save 3D é recusado');
/* save 3D com direção enorme (o caso do wrapPi) não atrapalha */
t.ok(!!S.ler3d(Object.assign({},s3,{yaw:1e300})),'save 3D com direção enorme é lido');
/* save 2D: ida e volta */
const st={relics:{steam:true,diesel:false,atom:false,bio:false},learn:{s0:true,s1:true},progs:{s1:[{id:1,k:'cmd',cmd:'fwd'}]},diary:['camp'],insc:{},sec:{d1:true},abertas:['diesel_luz'],done:false,time:0.3,migr:null,pos:{x:91.5,y:140.2},tomb:null};
const j=JSON.parse(JSON.stringify(S.montar(st)));const l=S.limpar(j);
t.ok(l&&!l.fixed&&l.learn.s1&&l.progs.s1.length===1&&l.abertas[0]==='diesel_luz'&&l.pos.x===91.5,'save 2D: ida e volta sem perdas',l);
/* save 2D estragado campo a campo */
const r2=S.limpar({v:1,relics:{steam:'sim'},learn:{s0:true,xx:true,s1:'x'},progs:{s1:[{k:'cmd',cmd:'fwd'},{k:'cmd',cmd:'voar'}],zz:[]},diary:['camp','steam_relic',7],abertas:['ok_1','<script>',42],pos:{x:1e9,y:2},time:'x',done:'talvez',tomb:'naoexiste',sec:{d1:true,qq:true}});
t.ok(r2&&r2.fixed,'save 2D estragado é aproveitado em parte',r2&&{relics:r2.relics,learn:r2.learn,progs:r2.progs,abertas:r2.abertas,pos:r2.pos,tomb:r2.tomb});
t.ok(r2.relics.steam===true&&r2.learn.s0&&!r2.learn.s1&&!r2.learn.xx,'relíquia deduzida do diário; etapas inválidas descartadas');
t.ok(r2.progs.s1.length===1&&!r2.progs.zz&&r2.abertas.length===1&&r2.pos===null&&r2.tomb===null&&r2.sec.d1&&!r2.sec.qq,'programas, portas, posição e segredos estragados são limpos');
t.ok(S.limpar(null)===null&&S.limpar({v:99})===null&&S.limpar([])===null,'versão desconhecida ou lixo: nenhum save');
/* todas as anotações do 3D existem no 2D (o diário inteiro migra) */
const ids3d=['camp','steam_enter','steam_floor','automato','steam_relic','oasis','night','diesel_enter','diesel_beams','diesel_elev','diesel_guard','diesel_relic','atom_enter','atom_water','atom_rad','atom_guard','atom_relic','bio_enter','bio_seq','bio_spores','bio_clone','bio_relic','city_enter','city_rhythm','city_light','city_water','city_seq','city_end',
  'insc_oasis','insc_automato','insc_steam','insc_diesel','insc_atom','insc_bio','sec_f_nw','sec_f_ne','sec_f_sw','sec_f_se','sec_c1','sec_c2','sec_c3','sec_c4','sec_c5','insc_d1','insc_d2','insc_d3'];
const falta=ids3d.filter(id=>!ctx.E[id]);t.ok(!falta.length,'todas as '+ids3d.length+' anotações do diário 3D existem no 2D',falta);
t.ok(['saber_seq','saber_dados','saber_decisoes','saber_automacao'].every(k=>ctx.E[k]&&ctx.E[k].cod),'cada saber tem explicação e exemplo de código no diário');
/* save de antes das etapas novas (sem rev): tumba completa ganha as etapas novas; incompleta continua de onde parou */
const velho=S.limpar({v:1,relics:{steam:true,diesel:false,atom:false,bio:false},learn:{s0:true,s1:true,s2:true,a0:true,a1:true,a2:true,b0:true},diary:['camp'],abertas:[],time:0.2});
t.ok(velho&&velho.learn.s3&&velho.learn.a3&&velho.learn.a4&&!velho.learn.b1&&!velho.learn.t1&&velho.treino.feito,'save antigo: tumbas completas ganham as etapas novas e o treino conta como feito',velho&&{learn:Object.keys(velho.learn),treino:velho.treino});
const meio=S.limpar({v:1,relics:{},learn:{s0:true,s1:true},diary:[]});t.ok(meio&&!meio.learn.s3&&!meio.learn.s2,'save antigo pela metade: as etapas que faltam continuam por fazer');
/* save novo: não ganha etapas de graça */
const nv=S.limpar(JSON.parse(JSON.stringify(S.montar({relics:{steam:false,diesel:false,atom:false,bio:false},learn:{a0:true,a1:true,a2:true},progs:{},diary:[],insc:{},sec:{},abertas:[],done:false,time:0.1,pos:null,tomb:null,
  treino:{feito:false,passo:3,manivela:true},dicas:{s1:2,a3:3},poi:{poco:true},guia:true}))));
t.ok(nv&&!nv.fixed&&!nv.learn.a3&&nv.treino.passo===3&&nv.treino.manivela&&!nv.treino.feito&&nv.dicas.s1===2&&nv.dicas.a3===3&&nv.poi.poco&&nv.guia,'save novo: treino, dicas do Lume, lugares visitados e guia voltam iguais (sem etapas de graça)',nv);
const rv=S.limpar({v:1,rev:2,learn:{},treino:{feito:'x',passo:99},dicas:{s1:9,zz:1,s2:'a'},poi:{poco:true,nada:true},guia:'sim'});
t.ok(rv&&rv.fixed&&rv.treino.passo===ctx.TP&&!rv.treino.feito&&!Object.keys(rv.dicas).length&&rv.poi.poco&&!rv.poi.nada&&!rv.guia,'campos novos estragados são limpos',rv&&{treino:rv.treino,dicas:rv.dicas,poi:rv.poi});
t.ok(S.migrar(d3,livre).treino.feito,'quem vem do 3D não precisa do treino');
/* revisão 3: t2 (ordem no treino), d6 (bomba dos Motores) e bd (demonstração da Viva) */
const r2s=S.limpar({v:1,rev:2,learn:{t1:true,d0:true,d1:true,d2:true,d3:true,d4:true,d5:true,b0:true},treino:{feito:true,passo:8,manivela:true},diary:[]});
t.ok(r2s&&r2s.learn.t2&&r2s.learn.d6&&r2s.learn.bd&&!r2s.fixed,'save da revisão 2: treino feito ganha t2, Motores completos ganham d6, Viva começada ganha bd',r2s&&Object.keys(r2s.learn));
const r2m=S.limpar({v:1,rev:2,learn:{t1:true,d0:true,d1:true},treino:{feito:false,passo:8,manivela:true},diary:[]});
t.ok(r2m&&!r2m.learn.t2&&!r2m.learn.d6&&!r2m.learn.bd,'save da revisão 2 pela metade: as etapas novas continuam por fazer',r2m&&Object.keys(r2m.learn));
const r3=S.limpar(JSON.parse(JSON.stringify(S.montar({relics:{steam:false,diesel:false,atom:false,bio:false},learn:{t1:true},progs:{},diary:[],insc:{},sec:{},abertas:[],done:false,time:0.1,pos:null,tomb:null,
  treino:{feito:true,passo:9,manivela:true},dicas:{},poi:{},guia:true,solucoes:{t1:[{id:1,k:'cmd',cmd:'tocha'}],zz:[1]}}))));
t.ok(r3&&!r3.learn.t2&&r3.solucoes.t1&&r3.solucoes.t1.length===1&&!r3.solucoes.zz&&r3.fixed,'save da revisão 3: guarda o programa que resolveu cada etapa (e descarta o inválido), sem etapas de graça',r3&&{learn:r3.learn,sol:r3.solucoes});
t.ok(S.montar({relics:{},learn:{},progs:{},diary:[],insc:{},sec:{},abertas:[],done:false,time:0,treino:{},dicas:{},poi:{},guia:false}).rev===3,'o save gravado é da revisão 3');
t.done();
