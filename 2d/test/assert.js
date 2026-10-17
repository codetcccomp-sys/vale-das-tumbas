// Verificações com resultado: cada ok() registra uma condição; done() mostra o placar e marca o processo
// como falho (código de saída 1) se alguma condição não for atendida ou se houver erro no console da página.
function suite(name){
  const res=[];
  const s={
    ok(cond,label,detail){
      res.push({ok:!!cond,label});
      const d=detail===undefined?'':'  -> '+(typeof detail==='string'?detail:JSON.stringify(detail));
      console.log((cond?'  ok     ':'  FALHA  ')+label+d);
      return !!cond;
    },
    done(logs){
      if(logs){const errs=logs.filter(l=>!/ERR_FAILED|net::/.test(l));s.ok(errs.length===0,'sem erros no console da página',errs.slice(0,3).join(' | ')||'nenhum');}
      const f=res.filter(r=>!r.ok);
      console.log('['+name+'] '+(res.length-f.length)+'/'+res.length+' verificações passaram'+(f.length?' — FALHARAM: '+f.map(r=>r.label).join('; '):''));
      if(f.length)process.exitCode=1;
    }
  };
  return s;
}
module.exports={suite};
