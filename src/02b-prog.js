/* ====================== lógica de programação do Computador Ancestral ======================
   Comandos, percursos, interpretador, edição do programa e mensagens. Não usa DOM nem three.js: os testes carregam
   este arquivo sozinho (test/v7-oficina-logica.js). A tela (05g-oficina.js) só chama estas funções; Executar e
   Passo a passo usam o mesmo PROG.step(), uma instrução por chamada, sem nunca corrigir o caminho do programa.
   Tabuleiro: linhas de texto, '.' casa livre, '#' pedra, 'G' destino. Direção: 0 cima, 1 direita, 2 baixo, 3 esquerda. */
const PROG=(function(){
  const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
  const DIR_NOME=['para cima','para a direita','para baixo','para a esquerda'];
  const CMD={
    fwd:{id:'fwd',nome:'AVANÇAR',ajuda:'anda uma casa na direção da seta'},
    right:{id:'right',nome:'VIRAR À DIREITA',ajuda:'gira 90° na mesma casa, sem andar'},
    act:{id:'act',nome:'ATIVAR',ajuda:'aciona o mecanismo, só sobre o destino'}
  };
  const MAX=12;          // encaixes do painel
  const MAX_PASSOS=64;   // trava de segurança do interpretador (o programa tem no máximo 12 placas)

  /* saberes: um por tumba. Só a Sequência está pronta nesta versão; os outros ficam planejados. */
  const SABERES=[
    {id:'seq',tumba:'steam',nome:'Sequência de instruções',pronto:true,
      resumo:'Um algoritmo é uma lista de instruções executadas uma de cada vez, na ordem em que foram escritas.'},
    {id:'cond',tumba:'diesel',nome:'Condições e sensores',pronto:false,plano:'SE o sensor ver pedra à frente, ENTÃO virar.'},
    {id:'rep',tumba:'atom',nome:'Repetições',pronto:false,plano:'REPETIR um bloco de placas várias vezes.'},
    {id:'func',tumba:'bio',nome:'Funções e reutilização',pronto:false,plano:'Dar nome a um bloco de placas e usá-lo de novo.'},
    {id:'tudo',tumba:'final',nome:'Aplicação conjunta',pronto:false,plano:'Sequência, condições, repetições e funções juntas.'}
  ];

  const NIVEIS=[
    {id:'seq1',saber:'seq',titulo:'Percurso 1 de 2 · guiado',
      grid:['.G.',
            '.#.',
            '.#.'],
      start:{x:0,y:2,dir:0},cmds:['fwd','right','act'],
      guia:['fwd','fwd','right','fwd','act'],
      dicas:['O autômato olha para cima. Duas casas acima dele fica o canto do tabuleiro.',
        'Depois de subir, o destino está à direita: o autômato precisa girar com VIRAR À DIREITA antes de avançar.',
        'Programa sugerido: AVANÇAR, AVANÇAR, VIRAR À DIREITA, AVANÇAR, ATIVAR.'],
      sucesso:'Isso! O autômato cumpriu as placas na ordem: subiu duas casas, girou sem sair do lugar, avançou e ativou.'},
    {id:'seq2',saber:'seq',titulo:'Percurso 2 de 2 · desafio',
      grid:['...#',
            '.#.#',
            '.#G.',
            '.#..'],
      start:{x:0,y:3,dir:0},cmds:['fwd','right','act'],
      solucao:['fwd','fwd','fwd','right','fwd','fwd','right','fwd','fwd','act'],
      dicas:['Comece pela orientação: o autômato está embaixo, à esquerda, olhando para cima. AVANÇAR anda para onde a seta aponta.',
        'Pela coluna da esquerda dá para subir até o alto do tabuleiro. Conte as casas livres antes de virar.',
        'No alto, vire à direita e avance até ficar acima do destino. Vire à direita de novo: a seta passa a apontar para baixo.',
        'Um programa possível: AVANÇAR, AVANÇAR, AVANÇAR, VIRAR À DIREITA, AVANÇAR, AVANÇAR, VIRAR À DIREITA, AVANÇAR, AVANÇAR, ATIVAR.'],
      sucesso:'Mecanismo ativado! O programa levou o autômato até o destino, na ordem certa, e terminou com ATIVAR.'}
  ];
  NIVEIS[0].solucao=NIVEIS[0].guia.slice();

  const largura=lv=>lv.grid[0].length,altura=lv=>lv.grid.length;
  function casa(lv,x,y){if(y<0||y>=altura(lv)||x<0||x>=largura(lv))return null;return lv.grid[y][x];}
  function destino(lv){for(let y=0;y<altura(lv);y++){const x=lv.grid[y].indexOf('G');if(x>=0)return{x,y};}return null;}

  /* ---------- interpretador ---------- */
  function iniciar(lv,programa){
    return{lv,prog:programa.slice(0,MAX),x:lv.start.x,y:lv.start.y,dir:lv.start.dir,pc:0,fim:false,ok:false,erro:null,passos:0};
  }
  /* executa exatamente UMA instrução e devolve o que aconteceu (para animar e explicar). Em erro, para na placa
     responsável (pc fica nela). Depois da última placa, se não ativou o destino, o programa acabou antes do objetivo. */
  function step(s){
    if(s.fim)return null;
    if(!s.prog.length){s.fim=true;s.erro={tipo:'vazio',pc:-1};return{tipo:'erro',i:-1,cmd:null,de:pos(s),para:pos(s),erro:s.erro};}
    if(s.passos>=MAX_PASSOS){s.fim=true;s.erro={tipo:'limitePassos',pc:s.pc};return{tipo:'erro',i:s.pc,cmd:null,de:pos(s),para:pos(s),erro:s.erro};}
    const i=s.pc,c=s.prog[i],de=pos(s),ev={i,cmd:c,de,tipo:null};
    s.passos++;
    if(c==='fwd'){
      const d=DIRS[s.dir],nx=s.x+d[0],ny=s.y+d[1],k=casa(s.lv,nx,ny);
      if(k===null){s.fim=true;s.erro={tipo:'limite',pc:i};ev.tipo='erro';ev.alvo={x:nx,y:ny};}
      else if(k==='#'){s.fim=true;s.erro={tipo:'parede',pc:i};ev.tipo='erro';ev.alvo={x:nx,y:ny};}
      else{s.x=nx;s.y=ny;ev.tipo='andar';}
    }else if(c==='right'){s.dir=(s.dir+1)%4;ev.tipo='girar';}
    else if(c==='act'){
      if(casa(s.lv,s.x,s.y)==='G'){s.ok=true;s.fim=true;ev.tipo='ativar';}
      else{s.fim=true;s.erro={tipo:'fora',pc:i};ev.tipo='erro';}
    }else{s.fim=true;s.erro={tipo:'desconhecido',pc:i};ev.tipo='erro';}
    if(!s.fim){
      s.pc++;
      if(s.pc>=s.prog.length){s.fim=true;s.erro={tipo:casa(s.lv,s.x,s.y)==='G'?'semAtivar':'incompleto',pc:i};}
    }
    ev.para=pos(s);if(s.erro)ev.erro=s.erro;ev.ok=s.ok;
    return ev;
  }
  function pos(s){return{x:s.x,y:s.y,dir:s.dir};}
  /* roda tudo com o mesmo step(); devolve o estado final e a lista de eventos */
  function executar(lv,programa){const s=iniciar(lv,programa),eventos=[];let ev;while((ev=step(s)))eventos.push(ev);return{s,eventos};}

  /* ---------- edição do programa (por toques) ---------- */
  function adicionar(prog,cmd,em){
    if(prog.length>=MAX||!CMD[cmd])return -1;
    const i=(em===undefined||em===null||em<0||em>prog.length)?prog.length:em;prog.splice(i,0,cmd);return i;
  }
  function remover(prog,i){if(!(i>=0&&i<prog.length))return false;prog.splice(i,1);return true;}
  function mover(prog,i,delta){const j=i+delta;if(!(i>=0&&i<prog.length&&j>=0&&j<prog.length))return -1;const t=prog[i];prog[i]=prog[j];prog[j]=t;return j;}
  function valido(prog,lv){return Array.isArray(prog)&&prog.length<=MAX&&prog.every(c=>lv.cmds.indexOf(c)>=0);}

  /* ---------- explicações ---------- */
  function explicar(s){
    const e=s.erro;if(!e)return s.ok?'':'';
    const n=e.pc+1,nome=e.pc>=0&&s.prog[e.pc]?CMD[s.prog[e.pc]].nome:'',olhando='O autômato estava olhando '+DIR_NOME[s.dir]+'.';
    switch(e.tipo){
      case'parede':return'Placa '+n+' ('+nome+'): há uma pedra na casa à frente, e o autômato não atravessa obstáculos. '+olhando;
      case'limite':return'Placa '+n+' ('+nome+'): à frente acaba o tabuleiro, e o autômato não pode sair dele. '+olhando;
      case'fora':return'Placa '+n+' ('+nome+'): o autômato não está sobre o destino dourado. ATIVAR só aciona o mecanismo em cima dele.';
      case'incompleto':return'O programa acabou na placa '+n+' e o autômato não chegou ao destino. Faltam instruções.';
      case'semAtivar':return'O autômato chegou ao destino, mas o programa acabou sem ATIVAR. Sem ativar, o mecanismo não se move.';
      case'vazio':return'Encaixe pelo menos uma placa antes de puxar a alavanca.';
      default:return'A placa '+n+' não pôde ser executada.';
    }
  }
  /* guia do percurso guiado: texto para o programa atual e a próxima placa sugerida */
  function guia(lv,prog){
    const g=lv.guia;if(!g)return null;
    const k=prog.length,igual=k<=g.length&&prog.every((c,i)=>c===g[i]);
    if(!igual)return{texto:'Este programa é diferente do sugerido. Você pode testá-lo e ver o que acontece, ou remover placas para seguir o guia.',proximo:null};
    const T=['O autômato está embaixo, à esquerda, olhando para cima (veja a seta). Ele cumpre as placas uma a uma, na ordem. Toque em AVANÇAR.',
      'Cada AVANÇAR anda uma casa na direção da seta. Toque em AVANÇAR de novo para chegar ao alto.',
      'No alto, o destino fica à direita. VIRAR À DIREITA gira o autômato 90° na mesma casa: ele não anda.',
      'Agora a seta aponta para a direita. AVANÇAR leva o autômato até o destino dourado.',
      'No destino, ATIVAR aciona o mecanismo. Coloque ATIVAR no final.',
      'Programa completo. Puxe a alavanca EXECUTAR, ou use PASSO para ver uma placa de cada vez.'];
    return{texto:T[k],proximo:k<g.length?g[k]:null};
  }

  /* ---------- verificação dos percursos ---------- */
  /* menor programa que resolve o percurso (busca em largura sobre posição e direção) */
  function resolver(lv){
    const chave=(x,y,d)=>x+','+y+','+d,ini=lv.start,fila=[[ini.x,ini.y,ini.dir,[]]],visto={};visto[chave(ini.x,ini.y,ini.dir)]=1;
    while(fila.length){
      const[x,y,d,p]=fila.shift();
      if(casa(lv,x,y)==='G'&&lv.cmds.indexOf('act')>=0)return p.concat(['act']);
      for(const c of lv.cmds){
        if(c==='act')continue;
        let nx=x,ny=y,nd=d;
        if(c==='fwd'){nx=x+DIRS[d][0];ny=y+DIRS[d][1];const k=casa(lv,nx,ny);if(k===null||k==='#')continue;}
        else if(c==='right')nd=(d+1)%4;
        const ch=chave(nx,ny,nd);if(visto[ch])continue;visto[ch]=1;fila.push([nx,ny,nd,p.concat([c])]);
      }
    }
    return null;
  }

  return{DIRS,DIR_NOME,CMD,MAX,SABERES,NIVEIS,casa,destino,largura,altura,iniciar,step,executar,adicionar,remover,mover,valido,explicar,guia,resolver};
})();
