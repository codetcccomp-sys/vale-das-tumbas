// Regressão: roda os roteiros que resolvem as tumbas (test/exploratorios) e confere o que eles imprimem.
// Cada linha esperada vira uma verificação; qualquer erro de página também reprova.
const {execFile}=require('child_process');const path=require('path');const {suite}=require('./assert');
const S=suite('regressão');
const run=f=>new Promise(res=>execFile(process.execPath,[path.join(__dirname,'exploratorios',f+'.js')],{timeout:420000,maxBuffer:1<<24,env:process.env},(err,out,errOut)=>res((out||'')+(errOut||'')+(err&&err.killed?'\n[TEMPO ESGOTADO]':''))));
const CASES={
  t3:[['Tumba das Engrenagens: caminho seguro das placas do olho sem cair',/caminho seguro \(13 placas do olho\), sem cair: true/],
      ['Tumba das Engrenagens: placa sem olho cede',/placa frágil após 1s: fall/],
      ['Tumba das Engrenagens: alavanca abre a porta',/alavanca: porta aberta=1 colisor=false/],
      ['Tumba das Engrenagens: relíquia recolhida e volta ao vale',/relíquias: \{"steam":true[^\n]*\n[^\n]*depois da relíquia: \{"mode":"play"[^\n]*"area":"vale"/]],
  t10:[['Tumba dos Motores: fachos cruzados abrem a porta final',/porta3 aberta=100% colisor=false/],
       ['Tumba dos Motores: robô-vigia patrulha e vê o jogador',/robô-vigia viu o jogador no meio da sala/],
       ['Tumba dos Motores: relíquia recolhida, HUD 1/4',/relíquias: \{"steam":false,"diesel":true[^\n]*\n[^\n]*contador HUD=1\/4/]],
  t14:[['Tumba do Reator: pulos para o pontão',/pontão A \(6 tentativas\): ok,ok,ok,ok,ok,ok/],
       ['Tumba do Reator: radiação gasta a lanterna 3x',/fora da zona gastou 2\.00, dentro da zona gastou 6\.00/],
       ['Tumba do Reator: comporta final aberta e atravessada',/alavanca final: comporta 3 aberta=100%[\s\S]*atravessou a comporta final/],
       ['Tumba do Reator: relíquia recolhida',/relíquias: \{"steam":false,"diesel":false,"atom":true/]],
  t20:[['Tumba Viva: relíquia recolhida e salva',/save: \{"steam":true,"diesel":true,"atom":true,"bio":true\}/],
       ['Tumba Viva: quatro encaixes da porta final acesos',/encaixe final lilás: true,true,true,true/]],
  t16:[['continuar mantém 3/4 relíquias',/HUD após continuar: 3\/4/],
       ['porta final com 3/4 diz qual falta',/porta final com 3\/4: A porta tem quatro encaixes\. Falta 1: Tumba Viva \(sudeste\)/]],
  t24:[['Cidade-Jardim abre com 4/4 e a lanterna não gasta',/rótulo com 4\/4: CIDADE-JARDIM[\s\S]*lanterna: 0\.00 gasto em 5 s/]],
  t25:[['Cidade: seção 1 concluída e porta 2 aberta',/seção 1 concluída: \{"done":"true[\s\S]*porta 2: aberta=1 colisor=false/]],
  t26:[['Cidade: seção 3 (água) concluída',/seção 3: \{"done":"true,true,true,false"/]],
  t27:[['Cidade: tela FIM, voltar ao vale e jogar de novo',/tela FIM: modo=end scEnd visível=true save\.done=true[\s\S]*2º toque: modo=play área=vale relíquias=\{"steam":false/]],
  t28:[['final: texto passa e dá para pular',/22s: modo=end[\s\S]*mais Usar: modo=end/]],
  t8:[['menus: apagar pede confirmação, teclado e controle andam',/apagar pede confirmação: true[\s\S]*teclado W: andou[\s\S]*controle: analógico para frente andou/]],
  t36:[['entrar e sair 6x de cada tumba sem travar',/steam: 6x entrar\/sair: (true>vale ?){6}[\s\S]*diesel: 6x entrar\/sair: (true>vale ?){6}[\s\S]*atom: 6x entrar\/sair: (true>vale ?){6}[\s\S]*bio: 6x entrar\/sair: (true>vale ?){6}/],
       ['memória de GPU estável depois de entrar e sair',/memória GPU antes\/depois: (\{[^}]*\}) -> \1/]],
  t39:[['sem three.js: mensagem clara',/sem three\.js: texto="Não foi possível carregar o motor 3D/],
       ['sem localStorage: Continuar escondido e aviso',/sem localStorage: Continuar oculto=true[\s\S]*Não foi possível salvar/]]
};
(async()=>{
  /* dois roteiros por vez: alguns esperam tempo real e não podem disputar a CPU com muitos navegadores */
  const files=Object.keys(CASES),outs=[];let next=0;
  await Promise.all([0,1].map(async()=>{while(next<files.length){const f=files[next++];outs.push([f,await run(f)]);}}));
  outs.sort((a,b)=>files.indexOf(a[0])-files.indexOf(b[0]));
  for(const[f,out]of outs){
    for(const[label,re]of CASES[f])S.ok(re.test(out),f+' — '+label);
    const bad=/PAGEERROR|TEMPO ESGOTADO|Error:/.test(out)||(/LOGS/.test(out)&&!/LOGS \(nenhum erro\)/.test(out));
    S.ok(!bad,f+' — sem erros de página nem tempo esgotado',bad?out.split('\n').filter(l=>/PAGEERROR|TEMPO|Error|LOGS/.test(l)).slice(0,3).join(' | '):undefined);
  }
  S.done();
})();
