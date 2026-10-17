// Carrega arquivos de src/ num contexto vm do Node (sem navegador), com limite de tempo: um laço infinito reprova o teste.
const fs=require('fs'),path=require('path'),vm=require('vm');
const SRC=path.resolve(__dirname,'..','src');
function carregar(arquivos,extra){
  const ctx=vm.createContext(Object.assign({console,JSON,Math,Object,Array,String,Number,Boolean,Error,Map,Set},extra||{}));
  const codigo=arquivos.map(f=>fs.readFileSync(path.join(SRC,f),'utf8')).join('\n;\n')+
    '\n;this.__exp={LANG:typeof LANG!=="undefined"?LANG:null,DESAFIOS:typeof DESAFIOS!=="undefined"?DESAFIOS:null,DESAFIO:typeof DESAFIO!=="undefined"?DESAFIO:null,'+
    'MUNDOS:typeof MUNDOS!=="undefined"?MUNDOS:null,OBJ:typeof OBJ!=="undefined"?OBJ:null,classificar:typeof classificar!=="undefined"?classificar:null,'+
    'novoNo:typeof novoNo!=="undefined"?novoNo:null,guiaDe:typeof guiaDe!=="undefined"?guiaDe:null,rodarTodas:typeof rodarTodas!=="undefined"?rodarTodas:null,'+
    'situacoesOk:typeof situacoesOk!=="undefined"?situacoesOk:null,SAVE2D:typeof SAVE2D!=="undefined"?SAVE2D:null};';
  vm.runInContext(codigo,ctx,{timeout:5000,filename:'src2d.js'});
  return ctx.__exp;
}
// roda uma função dentro do limite de tempo (para os testes de laço infinito)
function comLimite(ctx,fn,ms){const c=vm.createContext({fn});return vm.runInContext('fn()',c,{timeout:ms||3000});}
module.exports={carregar,comLimite};
