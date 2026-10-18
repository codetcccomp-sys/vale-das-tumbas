/* ====================== relatório de aprendizagem ======================
   Monta, a partir do save, o que o estudante fez: etapas concluídas e pendentes por lugar, conceitos, tentativas,
   tentativas com erro, dicas pedidas, previsões e o dia da conclusão. Nada é inventado: o que não foi registrado
   (etapas concluídas antes desta versão) aparece como "sem registro". Tudo fica no aparelho; exportar é voluntário
   e o arquivo não leva nome, e-mail nem nenhum dado pessoal. */
const RELATORIO_ORDEM=['treino','steam','diesel','atom','bio','final'];
const PREVISAO_NOME={c:'acertou',e:'errou',p:'pulou'};
function relatorioDados(st){
  const learn=st.learn||{},reg=st.reg||{},dicas=st.dicas||{};
  const lugares=RELATORIO_ORDEM.map(k=>{
    const etapas=DESAFIOS.filter(d=>d.tumba===k).map(d=>{
      const r=reg[d.id]||{},feita=!!learn[d.id],temReg=r.t!==undefined||r.d!==undefined||r.p!==undefined;
      return{id:d.id,titulo:d.titulo,tipo:ETAPA_NOME[d.etapa]||d.etapa,demo:d.etapa==='demo',feita,
        tentativas:r.t===undefined?null:r.t,erros:r.t===undefined?null:(r.e||0),dicas:dicas[d.id]||0,
        previsao:r.p?PREVISAO_NOME[r.p]:(d.previsao?'—':null),data:r.d||null,semRegistro:feita&&!temReg&&d.etapa!=='demo'};
    });
    const S=SABER_DE[k]?SABERES[SABER_DE[k]]:null;
    return{k,nome:nomeLugar(k),conceito:S?S.nome:k==='treino'?'Primeiro comando e ordem':'Tudo junto: sequência, variável, decisão e repetição',
      resumo:S?S.resumo:null,etapas,feitas:etapas.filter(e=>e.feita).length,total:etapas.length,completo:etapas.every(e=>e.feita)};
  });
  const todas=lugares.reduce((a,l)=>a.concat(l.etapas),[]);
  const soma=f=>todas.reduce((a,e)=>a+(e[f]||0),0);
  return{desde:st.regDesde||null,lugares,feitas:todas.filter(e=>e.feita).length,total:todas.length,
    tentativas:soma('tentativas'),erros:soma('erros'),dicas:soma('dicas'),
    previsoes:{acertou:todas.filter(e=>e.previsao==='acertou').length,errou:todas.filter(e=>e.previsao==='errou').length,pulou:todas.filter(e=>e.previsao==='pulou').length},
    pendentes:todas.filter(e=>!e.feita),semRegistro:todas.filter(e=>e.semRegistro).length};
}
const relNum=v=>v===null||v===undefined?'sem registro':String(v);
function relatorioTXT(st,hoje){
  const D=relatorioDados(st),L=[];
  L.push('VALE DAS TUMBAS 2D — RELATÓRIO DE APRENDIZAGEM');
  L.push('Gerado em: '+(hoje||'')+(D.desde?' · registros desde '+D.desde:' · ainda sem registros de tentativas'));
  L.push('Etapas concluídas: '+D.feitas+' de '+D.total+' · tentativas: '+D.tentativas+' (com erro: '+D.erros+') · dicas pedidas: '+D.dicas);
  L.push('Previsões: '+D.previsoes.acertou+' certas, '+D.previsoes.errou+' erradas, '+D.previsoes.pulou+' puladas');
  if(D.semRegistro)L.push('Observação: '+D.semRegistro+' etapa(s) foram concluídas antes de o jogo registrar tentativas; aparecem como "sem registro".');
  L.push('Sem nome nem dados pessoais. As tentativas contam cada execução que chegou ao fim (Executar ou Passo a passo).');
  for(const l of D.lugares){
    L.push('');L.push('== '+l.nome+' — '+l.conceito+' ('+l.feitas+' de '+l.total+(l.completo?', concluído':'')+') ==');
    for(const e of l.etapas){
      const partes=[e.feita?'[x]':'[ ]',e.titulo,'('+e.tipo+')'];
      if(!e.demo)partes.push('· tentativas: '+relNum(e.tentativas)+(e.erros?' (com erro: '+e.erros+')':'')+' · dicas: '+e.dicas);
      if(e.previsao&&e.previsao!=='—')partes.push('· previsão: '+e.previsao);
      if(e.data)partes.push('· concluída em '+e.data);
      L.push(partes.join(' '));
    }
    if(l.completo&&l.resumo)L.push('Conhecimento: '+l.resumo);
  }
  L.push('');L.push('Pendentes: '+(D.pendentes.length?D.pendentes.map(e=>e.titulo).join('; '):'nenhuma'));
  return L.join('\n');
}
function relatorioCSV(st){
  const D=relatorioDados(st),q=v=>'"'+String(v===null||v===undefined?'':v).replace(/"/g,'""')+'"';
  const L=[['lugar','conceito','etapa_id','etapa','tipo','situacao','tentativas','tentativas_com_erro','dicas','previsao','concluida_em'].join(';')];
  for(const l of D.lugares)for(const e of l.etapas)
    L.push([l.nome,l.conceito,e.id,e.titulo,e.tipo,e.feita?'concluída':'pendente',e.demo?'':relNum(e.tentativas),e.demo||e.erros===null?'':e.erros,e.demo?'':e.dicas,e.previsao&&e.previsao!=='—'?e.previsao:'',e.data||''].map(q).join(';'));
  return L.join('\r\n');
}
