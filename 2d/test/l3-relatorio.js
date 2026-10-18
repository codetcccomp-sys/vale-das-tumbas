// Relatório de aprendizagem (lógica, sem navegador): só o que foi registrado, etapas antigas "sem registro",
// pendentes, conceitos, TXT e CSV sem dados pessoais.
const {carregar}=require('./vmload');const {suite}=require('./assert');
const t=suite('l3-relatorio');
const X=carregar(['01-core.js','02-lang.js','03-learn.js','13c-relatorio.js']);
const D0=X.relatorioDados({learn:{},reg:{},dicas:{},regDesde:null});
t.ok(D0.feitas===0&&D0.total===X.DESAFIOS.length&&D0.tentativas===0&&D0.pendentes.length===D0.total&&D0.desde===null,'partida nova: nada concluído, nenhuma tentativa inventada, tudo pendente',{feitas:D0.feitas,total:D0.total});
const st={learn:{t1:true,t2:true,s0:true,s1:true},reg:{t2:{t:3,e:2,p:'e',d:'2026-10-18'},s1:{t:1,p:'c',d:'2026-10-18'},s3:{t:2,e:2}},dicas:{t2:1,s3:2},regDesde:'2026-10-18'};
const D=X.relatorioDados(st),et=id=>D.lugares.reduce((a,l)=>a.concat(l.etapas),[]).find(e=>e.id===id);
t.ok(D.feitas===4&&D.tentativas===6&&D.erros===4&&D.dicas===3&&D.previsoes.acertou===1&&D.previsoes.errou===1,'totais: 4 etapas, 6 tentativas (4 com erro), 3 dicas, 1 previsão certa e 1 errada',{f:D.feitas,t:D.tentativas,e:D.erros,d:D.dicas,p:D.previsoes});
t.ok(et('t1').feita&&et('t1').tentativas===null&&et('t1').semRegistro&&D.semRegistro===1,'etapa concluída antes do registro aparece como "sem registro" (nada é deduzido)',et('t1'));
t.ok(!et('s3').feita&&et('s3').tentativas===2&&et('s3').erros===2&&et('s3').dicas===2&&D.pendentes.some(e=>e.id==='s3'),'etapa tentada e não concluída: pendente, com as tentativas e dicas que existiram',et('s3'));
const L=D.lugares.map(l=>l.k);t.ok(L.join()==='treino,steam,diesel,atom,bio,final'&&D.lugares[1].conceito==='Sequência','os seis lugares, na ordem do jogo, com o conceito de cada um',L);
const txt=X.relatorioTXT(st,'2026-10-18');
t.ok(/RELATÓRIO DE APRENDIZAGEM/.test(txt)&&/registros desde 2026-10-18/.test(txt)&&/\[x\] Treino · a ordem importa \(Corrija o código\) · tentativas: 3 \(com erro: 2\) · dicas: 1 · previsão: errou · concluída em 2026-10-18/.test(txt)&&/sem registro/.test(txt)&&/Pendentes: /.test(txt),'TXT legível: totais, uma linha por etapa, "sem registro" e pendentes',txt.split('\n').slice(0,8));
const csv=X.relatorioCSV(st),linhas=csv.split('\r\n');
t.ok(linhas.length===X.DESAFIOS.length+1&&/^lugar;conceito;etapa_id;etapa;tipo;situacao;tentativas;tentativas_com_erro;dicas;previsao;concluida_em$/.test(linhas[0])&&linhas.some(l=>/"t2";.*"concluída";"3";"2";"1";"errou";"2026-10-18"/.test(l)),'CSV: cabeçalho e uma linha por etapa, com os mesmos números',linhas.slice(0,3));
t.ok(!/@|nome do aluno|email/i.test(txt+csv),'sem dados pessoais no arquivo');
t.done();
