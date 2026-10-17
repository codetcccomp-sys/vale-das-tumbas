/* ====================== Guia de Programação, Lume e vista ampla ======================
   - Guia de Programação: abre a qualquer momento (botão Guia, tecla G, menu de pausa, tela inicial e o painel).
     Cada tópico é curto e visual: um ícone, uma ou duas frases, um exemplo de código colorido, um "passo a passo"
     do que acontece e onde aquilo aparece no jogo. "Seus exemplos" junta o código das etapas já concluídas.
   - Lume: um pequeno autômato-guia de latão. Conversar com ele explica controles, interação, o editor de programação e
     como ler um desafio. As dicas vêm aos poucos (conceito → caminho → quase a solução); dá para voltar e pedir de novo.
   - Vista ampla: C (ou o botão VER) afasta a câmera um degrau para ver mais longe. */
Object.assign(OBJS,{
  lume(f){const c=cnv(16,22),g=ctx2(c);
    P.linha(g,8,1,8,4,'#8a6a3a');P.circ(g,8,1,1.5,f%2?'#fff2a0':'#ffd24a');
    P.circ(g,8,10,6,'#b07a3a');P.circ(g,7,9,5,'#d8a24a');P.r(g,4,6,4,1,'#f0c878');
    P.circ(g,8,10,3.2,'#3a2414');P.circ(g,8,10,2.4,f%2?'#ffe9a0':'#ffd24a');P.p(g,7,9,'#ffffff');
    P.r(g,1,10,3,2,'#8a5a28');P.r(g,12,10,3,2,'#8a5a28');P.r(g,0,11,2,2,'#d8a24a');P.r(g,14,11,2,2,'#d8a24a');
    P.r(g,6,15,4,2,'#7a4a2a');P.r(g,7,17,2,2+(f%2),f%2?'#ffb43a':'#ff8a2a');
    return contorno(c,'#0b0705');},
  /* ícones dos tópicos do Guia: uma etiqueta de pixel com a palavra-chave */
  iconeGuia(rot,cor){const w=Math.max(24,FONTE.larg(rot)+8),c=cnv(w,24),g=ctx2(c);P.r(g,1,1,w-2,22,'#24160d');P.r(g,2,2,w-4,20,'#3a2a1c');P.r(g,2,2,w-4,2,cor);FONTE.texto(g,rot,Math.round((w-FONTE.larg(rot))/2),10,cor);return contorno(c,'#0b0705');}
});

/* ---------- Guia de Programação ---------- */
const GUIA=[
  {id:'comandos',t:'Comandos (funções)',ic:['f()','#ffd24a'],txt:'Um comando manda a máquina fazer uma ação. Em Python ele se escreve com o nome e parênteses. Cada linha do programa é uma instrução.',
    cod:'acender_tocha()\navancar()',passos:['acender_tocha() → a tocha acende','avancar() → o autômato anda uma casa'],jogo:'No pátio de treino, acender_tocha() acende a tocha do portão. Cada tumba tem as suas funções na paleta do painel.'},
  {id:'sequencia',t:'Sequência',ic:['1 2 3','#c8743a'],txt:'O computador lê o programa de cima para baixo, uma linha de cada vez. Trocar a ordem das linhas muda o resultado.',
    cod:'avancar()\nvirar_direita()\navancar()',passos:['linha 1: anda','linha 2: gira (sem andar)','linha 3: anda na nova direção'],jogo:'Na Tumba das Engrenagens, o autômato cumpre as linhas na ordem. Se ele bate, o erro costuma estar numa linha antes.'},
  {id:'variaveis',t:'Variáveis',ic:['x = 5','#6fd3ff'],txt:'Uma variável funciona como uma caixa usada para guardar uma informação. O = coloca o valor dentro da caixa; guardar de novo troca o conteúdo.',
    cod:'quantidade = 5\nquantidade = quantidade + 3',caixa:['quantidade','5 → 8'],jogo:'Na Tumba dos Motores, cada contêiner é uma variável ligada a uma máquina, que lê o valor quando é chamada.'},
  {id:'tipos',t:'Os quatro tipos',ic:['tipos','#6fd3ff'],txt:'Todo valor tem um tipo. O tipo diz o que a informação é e o que dá para fazer com ela.',
    tipos:[['engr','int','5','número inteiro: contar'],['galao','float','2.5','número com ponto decimal: medir'],['placa','string','"ABRIR"','texto entre aspas'],['fusivel1','boolean','True','só True ou False: ligado ou desligado']],
    cod:'pecas = 5            # int\ncombustivel = 2.5    # float\nsenha = "ABRIR"      # string\nenergia = True       # boolean',jogo:'Cada máquina dos Motores aceita um tipo só. "5" com aspas é texto, não número: o jogo não converte sozinho.'},
  {id:'int',t:'int (número inteiro)',ic:['int','#ffd24a'],img:'engr',txt:'Números sem casas decimais: para contar peças, voltas, níveis. Escreve-se sem aspas.',
    cod:'pecas = 5\nnivel = 0',passos:['5 → int','"5" → string (tem aspas!)'],jogo:'quantidade, pecas, carga e regadas guardam int.'},
  {id:'float',t:'float (número decimal)',ic:['float','#ff9a3a'],img:'galao',txt:'Números com parte decimal. Em Python o decimal usa ponto, não vírgula: 2,5 litros vira 2.5.',
    cod:'combustivel = 2.5\noleo = 0.75',passos:['2.5 → float','5 → int (para float, escreva 5.0)'],jogo:'Litros de combustível e de óleo são float.'},
  {id:'string',t:'string (texto)',ic:['"abc"','#7ee08a'],img:'placa',txt:'Texto fica entre aspas. Maiúsculas e minúsculas fazem diferença: "ABRIR" e "abrir" são textos diferentes.',
    cod:'senha = "ABRIR"\ncodigo = "MOTOR"',passos:['"ABRIR" == "ABRIR" → True','"ABRIR" == "abrir" → False'],jogo:'A senha da garagem e o código do monta-cargas são strings.'},
  {id:'boolean',t:'boolean (True ou False)',ic:['True','#5dff7a'],img:'fusivel1',txt:'Só dois valores: True (verdadeiro, ligado, sim) e False (falso, desligado, não). Sem aspas e com a primeira letra maiúscula.',
    cod:'energia = True\nfreio = False',passos:['energia = True → o gerador liga','energia = "True" → erro: isso é texto'],jogo:'energia = True liga o gerador da oficina. Toda condição de if e while também dá um boolean.'},
  {id:'comparar',t:'Comparações',ic:['==','#ffd8a0'],txt:'Uma comparação faz uma pergunta e responde True ou False. Atenção: = guarda um valor; == pergunta se é igual.',
    tabela:[['==','igual'],['!=','diferente'],['<','menor'],['>','maior'],['<=','menor ou igual'],['>=','maior ou igual']],
    cod:'energia >= 5     # True se energia for 5 ou mais\nsolo == "seco"   # True se o texto for "seco"',jogo:'As comparações aparecem nas condições do if, do elif e do while.'},
  {id:'if',t:'if (se)',ic:['if','#c9a6ff'],txt:'O comando IF verifica uma condição antes de executar uma ação. O bloco embaixo dele (com recuo) só roda quando a condição dá True.',
    cod:'if porta_aberta:\n    entrar()',passos:['porta_aberta é True → entrar() roda','porta_aberta é False → pula o bloco'],jogo:'No Reator: if energia >= 5: abrir_comporta().'},
  {id:'else',t:'else (senão)',ic:['else','#c9a6ff'],txt:'O else é o caminho para quando a condição do if deu False. Ele não tem condição: pega todos os outros casos.',
    cod:'if energia >= 5:\n    abrir_comporta()\nelse:\n    ligar_carregador()',passos:['energia 7 → 7 >= 5 é True → abrir_comporta()','energia 3 → 3 >= 5 é False → ligar_carregador()'],jogo:'A comporta do Reator abre com energia; sem energia, o carregador liga.'},
  {id:'elif',t:'elif (senão, se)',ic:['elif','#c9a6ff'],txt:'O elif testa outra condição quando as de cima deram False. O Python testa de cima para baixo e executa só o PRIMEIRO caminho verdadeiro.',
    cod:'if temperatura >= 80:\n    resfriar()\nelif temperatura >= 50:\n    ventilar()\nelse:\n    manter_estavel()',passos:['90 → >= 80 é True → resfriar()','65 → >= 80 False, >= 50 True → ventilar()','30 → as duas False → else'],jogo:'No Reator, a temperatura escolhe entre resfriar, ventilar ou manter estável. A condição mais rigorosa vem primeiro.'},
  {id:'for',t:'for (repetir n vezes)',ic:['for','#b98cff'],txt:'O for repete o bloco embaixo dele um número fixo de vezes. range(4) dá 4 voltas, e a variável i vale 0, 1, 2 e 3.',
    cod:'for i in range(4):\n    acender_tocha()',passos:['volta 1 (i = 0): tocha 1','volta 2 (i = 1): tocha 2','volta 3 (i = 2): tocha 3','volta 4 (i = 3): tocha 4'],jogo:'Na Tumba Viva, o for acende as quatro tochas, uma depois da outra, e rega os organismos.'},
  {id:'while',t:'while (enquanto)',ic:['while','#b98cff'],txt:'O while repete enquanto a condição for True e para quando ela dá False. Alguma linha dentro dele precisa mudar o valor testado, senão a repetição não para.',
    cod:'while umidade < 3:\n    irrigar()',passos:['umidade 1 < 3? True → irrigar()','umidade 2 < 3? True → irrigar()','umidade 3 < 3? False → para'],jogo:'Na estufa, o while rega cada organismo só o que ele precisa: às vezes nenhuma vez.'},
  {id:'recuo',t:'Blocos e recuo',ic:['    ','#ffd24a'],txt:'Em Python, o que pertence a um if, for ou while fica embaixo dele com 4 espaços na frente (recuo). O bloco termina quando o recuo volta.',
    cod:'regadas = 0\nfor i in range(5):\n    if solo == "seco":\n        irrigar()\n        regadas = regadas + 1\n    avancar()\nacender_jardim()',passos:['for: repete as linhas com 4 espaços','if: só as linhas com 8 espaços dependem dele','acender_jardim() sem recuo: roda uma vez, no fim'],jogo:'No painel, o recuo aparece sozinho; no modo ✎ Escrever, use a tecla Tab para 4 espaços.'},
  {id:'erros',t:'Erros comuns',ic:['erro','#ff6a4a'],txt:'Errar faz parte de programar. O jogo mostra a linha do erro, o nome que o Python daria e o que fazer.',
    tabela:[['SyntaxError','algo escrito fora da regra: faltou : ou aspas'],['IndentationError','recuo errado: espaços a mais ou a menos'],['NameError','nome que não existe, ou variável ainda vazia'],['TypeError','tipo errado: texto onde a máquina queria número']],
    cod:'if energia >= 5      # faltou o :\nquantidade = "5"     # texto numa variável de int',jogo:'Leia a área vermelha do painel, observe o mecanismo e use ⏭ Passo para ver a execução linha a linha.'},
  {id:'exemplos',t:'Seus exemplos',ic:['meus','#7ee08a'],txt:'O código das etapas que você já concluiu.'}
];
const GUIA_TOPICO={t1:'comandos',s0:'sequencia',s1:'sequencia',s3:'sequencia',s2:'sequencia',d0:'variaveis',d1:'tipos',d2:'int',d3:'variaveis',d4:'variaveis',d5:'tipos',
  a0:'if',a1:'else',a2:'comparar',a3:'elif',a4:'elif',b0:'for',b1:'for',b2:'for',b3:'while',b4:'while',c1:'recuo'};
function topicoGuia(cfg){return(cfg&&GUIA_TOPICO[cfg.id])||'comandos';}
const KW=/^(if|elif|else|for|in|range|while|not|and|or|True|False)$/;
/* código colorido: palavras-chave, textos, números, funções e comentários */
function realcarCodigo(texto){
  const f=document.createDocumentFragment();
  const add=(t,cls)=>{const s=document.createElement('span');if(cls)s.className=cls;s.textContent=t;f.appendChild(s);};
  for(const linha of String(texto).split('\n')){
    let i=0;const L=linha;
    while(i<L.length){
      const r=L.slice(i);let m;
      if((m=r.match(/^#.*/))){add(m[0],'c-com');i+=m[0].length;continue;}
      if((m=r.match(/^"[^"]*"?|^'[^']*'?/))){add(m[0],'c-str');i+=m[0].length;continue;}
      if((m=r.match(/^\d+(\.\d+)?/))){add(m[0],'c-num');i+=m[0].length;continue;}
      if((m=r.match(/^[A-Za-z_][A-Za-z0-9_]*/))){const w=m[0];add(w,KW.test(w)?'c-kw':L[i+w.length]==='('?'c-fn':'c-id');i+=w.length;continue;}
      add(L[i],/[=<>!+\-]/.test(L[i])?'c-op':'');i++;
    }
    add('\n');
  }
  return f;
}
let guiaAtual='comandos',guiaVolta=null;
function abrirGuia(topico){
  if(G.mode==='guia')return;
  G.modoAntesGuia=G.mode;guiaVolta=[...document.querySelectorAll('.tela')].find(s=>!s.hidden&&s.id!=='guia');
  if(guiaVolta)guiaVolta.hidden=true;
  G.mode='guia';$('guia').hidden=false;document.body.classList.add('modal');limparEntrada();
  if(!G.guia){G.guia=true;if(G.area&&G.modoAntesGuia!=='menu')salvar(false);}
  if(G.area&&G.area.aoGuia)G.area.aoGuia();
  mostrarTopico(topico||guiaAtual);SFX.page();
  try{$('gFechar').focus({preventScroll:true});}catch(e){}
}
function fecharGuia(){
  $('guia').hidden=true;G.mode=G.modoAntesGuia||'play';limparEntrada();
  if(guiaVolta){guiaVolta.hidden=false;guiaVolta=null;}
  else if(G.mode!=='painel')document.body.classList.remove('modal');
  if(G.mode==='painel')document.body.classList.remove('modal');
}
function mostrarTopico(id){
  guiaAtual=id;const T=GUIA.find(g=>g.id===id)||GUIA[0];
  const L=$('gTopicos');L.textContent='';
  for(const g of GUIA){const b=document.createElement('button');b.className='btn gtop'+(g.id===T.id?' on':'');b.textContent=g.t;b.onclick=()=>{mostrarTopico(g.id);SFX.click();};L.appendChild(b);}
  const at=L.querySelector('.on');if(at)try{at.scrollIntoView({block:'nearest',inline:'nearest'});}catch(e){}
  const C=$('gConteudo');C.textContent='';C.scrollTop=0;
  const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;C.appendChild(e);return e;};
  const h=el('div','gcab');const ic=escalar(SPR.get('iconeGuia',T.ic[0],T.ic[1]),2);ic.className='px';h.appendChild(ic);
  if(T.img){const im=escalar(SPR.get('valor',T.img),2);im.className='px';h.appendChild(im);}
  const ht=document.createElement('h3');ht.textContent=T.t;h.appendChild(ht);
  el('p','gtxt',T.txt);
  if(T.id==='exemplos'){
    const ex=exemplosVistos();if(!ex.length)el('p','gtxt','Ainda não há exemplos: eles aparecem quando você conclui as etapas.');
    for(const e of ex){el('p','gsub',e.titulo+' · '+e.de);el('pre','gcod').appendChild(realcarCodigo(e.codigo));}
    return;
  }
  if(T.caixa){const b=el('div','gcaixa');const n=document.createElement('span');n.className='nm';n.textContent=T.caixa[0];const v=document.createElement('span');v.className='vl';v.textContent=T.caixa[1];b.appendChild(n);b.appendChild(v);}
  if(T.tipos){const g=el('div','gtipos');for(const[ico,rot,ex,d]of T.tipos){const it=document.createElement('div');it.className='gtipo';const im=escalar(SPR.get('valor',ico),2);im.className='px';it.appendChild(im);
    const tx=document.createElement('span');tx.innerHTML='<b></b><code></code><i></i>';tx.children[0].textContent=rot;tx.children[1].textContent=ex;tx.children[2].textContent=d;it.appendChild(tx);g.appendChild(it);}}
  if(T.tabela){const tb=el('div','gtab');for(const[a,b]of T.tabela){const x=document.createElement('code');x.textContent=a;const y=document.createElement('span');y.textContent=b;tb.appendChild(x);tb.appendChild(y);}}
  el('p','gsub','Exemplo');el('pre','gcod').appendChild(realcarCodigo(T.cod));
  if(T.passos){el('p','gsub','O que acontece');const p=el('div','gpassos');T.passos.forEach((s,i)=>{const d=document.createElement('span');d.textContent=s;p.appendChild(d);if(i<T.passos.length-1){const a=document.createElement('b');a.textContent='→';p.appendChild(a);}});}
  el('p','gjogo','No jogo: '+T.jogo);
}

/* ---------- conversas (Lume e placas com opções) ---------- */
const DLG={opcoes:[],volta:null};
function falar(texto,opcoes,nome){
  if(G.mode!=='dialogo'){DLG.volta=G.mode;}
  G.mode='dialogo';$('dialogo').hidden=false;document.body.classList.add('modal');limparEntrada();
  $('dNome').textContent=nome||'Lume';$('dTexto').textContent=texto;
  const O=$('dOpcoes');O.textContent='';
  for(const op of opcoes||[{t:'Até logo'}]){const b=document.createElement('button');b.className='btn'+(op.main?' main':'');b.textContent=op.t;b.onclick=()=>{SFX.click();if(op.fn)op.fn();else fecharFala();};O.appendChild(b);}
  const c=$('dRetrato'),g=ctx2(c);g.clearRect(0,0,c.width,c.height);g.drawImage(SPR.get('lume',Math.floor(G.t*4)%2),4,1);
  try{O.firstChild.focus({preventScroll:true});}catch(e){}
}
function fecharFala(){$('dialogo').hidden=true;G.mode=DLG.volta&&DLG.volta!=='dialogo'?DLG.volta:'play';if(G.mode==='play'||G.mode==='painel')document.body.classList.remove('modal');limparEntrada();}
/* textos do Lume (curtos; os controles seguem o aparelho que está sendo usado) */
function textoControles(){
  if(IN.mode==='touch')return'Toque e arraste no lado esquerdo da tela para andar; arrastando até o fim, você corre. O botão AÇÃO, à direita, interage. VER afasta a câmera, Guia abre o Guia de Programação.';
  if(IN.mode==='pad')return'O analógico anda (até o fim corre). A interage, X abre o diário, Select abre o Guia e Start pausa.';
  return'Ande com WASD ou as setas; segure Shift para correr. E (ou Espaço) interage, C afasta a câmera, G abre o Guia de Programação, J o diário e Esc pausa.';
}
const LUME_TXT={
  interagir:()=>'Quando você chega perto de algo útil, aparece um aviso embaixo da tela e uma seta amarela em cima do objeto. Aí é só apertar '+(IN.mode==='touch'?'AÇÃO':IN.mode==='pad'?'A':'E')+' para usar: ler, pegar, abrir, ligar.',
  programar:()=>'Nos terminais fica o editor. Toque nas linhas da paleta para escrever o programa, ou em ✎ Escrever para digitar código Python. ▶ Executar roda tudo; ⏭ Passo roda uma linha por vez. Se der erro, a área vermelha mostra a linha e o que fazer.',
  desafio:()=>'Leia a mensagem do painel e olhe o mecanismo da sala: ele mostra o que o código faz. As caixas mostram as variáveis. As situações (A, B…) são testes: o mesmo programa precisa funcionar em todas. Programe, execute, observe e corrija.',
  camera:()=>'Aperte '+(IN.mode==='touch'?'VER':'C')+' para afastar a câmera e enxergar mais longe. Aperte de novo para voltar ao normal.'
};
/* a etapa sobre a qual o Lume dá dicas: a do painel aberto, ou a próxima por fazer no lugar onde ele está */
function etapaDoLume(lugar){
  if(PAINEL.aberto&&PAINEL.cfg&&PAINEL.cfg.etapa!=='demo')return PAINEL.cfg;
  if(!lugar)return null;const l=desafiosDa(lugar);return l.find(d=>!G.learn[d.id]&&d.etapa!=='demo'&&desafioDisponivel(d))||null;
}
function dicaLume(cfg,volta){
  const antes=G.dicas[cfg.id]||0,n=Math.min(3,antes+1);G.dicas[cfg.id]=n;salvar(false);
  const t=antes>=3?'Você já ouviu as três dicas desta etapa. Vou repetir a mais próxima da solução: '+cfg.dicas[2]+' Se ainda não der certo, use ⏭ Passo no painel e veja em que linha o resultado muda.'
    :'Dica '+n+' de 3 ('+NIVEL_DICA[n-1]+') sobre "'+cfg.titulo+'": '+cfg.dicas[n-1];
  falar(t,[n<3?{t:'💡 Outra dica',fn:()=>dicaLume(cfg,volta),main:true}:{t:'📖 Abrir o Guia',fn:()=>{fecharFala();abrirGuia(topicoGuia(cfg));}},{t:'Outra pergunta',fn:volta},{t:'Até logo'}]);
}
/* conversa com o Lume: um menu curto de perguntas */
function conversarLume(lugar,extra){
  G.lumeFalou=true;addDiary('lume',true);SFX.lumeOi();
  const volta=()=>conversarLume(lugar,extra);
  const cfg=etapaDoLume(lugar),ops=[];
  if(cfg&&cfg.dicas)ops.push({t:'💡 Dica: '+cfg.titulo+' ('+Math.min(3,(G.dicas[cfg.id]||0)+1)+'/3)',fn:()=>dicaLume(cfg,volta),main:true});
  if(extra)for(const e of extra)ops.push(e);
  ops.push({t:'Como me movo?',fn:()=>falar(textoControles()+' '+LUME_TXT.camera(),[{t:'Outra pergunta',fn:volta},{t:'Até logo'}])});
  ops.push({t:'Como interajo com as coisas?',fn:()=>falar(LUME_TXT.interagir(),[{t:'Outra pergunta',fn:volta},{t:'Até logo'}])});
  ops.push({t:'Como funciona a programação?',fn:()=>falar(LUME_TXT.programar(),[{t:'Outra pergunta',fn:volta},{t:'Até logo'}])});
  ops.push({t:'Como leio um desafio?',fn:()=>falar(LUME_TXT.desafio(),[{t:'Outra pergunta',fn:volta},{t:'Até logo'}])});
  ops.push({t:'📖 Abrir o Guia de Programação',fn:()=>{fecharFala();abrirGuia(topicoGuia(cfg));}});
  ops.push({t:'Até logo'});
  const oi=lugar==='vale'?'Oi! Eu fico no acampamento. '+(objetivo()?'Próximo passo: '+objetivo().s:'')
    :lugar==='treino'?'Oi! Eu sou o Lume. Pode me perguntar qualquer coisa sobre o jogo.'
    :'Estou aqui na '+nomeLugar(lugar)+'. Quer uma dica ou tem alguma dúvida?';
  falar(oi,ops);
}
/* Lume como personagem do cenário: flutua, tem lanterna e conversa */
function criarLume(A,tx,ty,lugar,extra){
  const L={x:tx*16+8,y:ty*16+12,lugar};
  const o=objeto(A,SPR.get('lume',0),L.x,L.y,{});
  o.desenho=(g,ob,t)=>{const bob=Math.round(Math.sin(t*2.6+ob.x)*2);sombra(g,ob.x,ob.y,5,2,0.22);blit(g,SPR.get('lume',Math.floor(t*4)%2),ob.x,ob.y-5+bob,8,22);};
  if(A.lampadas)A.lampadas.push({x:L.x,y:L.y-14,r:30,cor:'#ffd24a'});else o.luz={r:22,cor:'#ffd24a',dy:-14};
  L.it=interacao(A,{x:L.x,y:L.y+4,r:24,alto:34,label:()=>'Conversar com o Lume',use:()=>conversarLume(lugar,extra?extra():null)});
  L.o=o;return L;
}

/* ---------- vista ampla (câmera) ---------- */
function alternarVista(){
  R.longe=!R.longe;const k0=R.k;redimensionar();
  if(R.longe&&R.k===k0){R.longe=false;toast('Esta tela já mostra o máximo que dá com pixels nítidos.');return;}
  if(G.area)camSeguir(G.p.x,G.p.y-12,0,G.area,true);
  toast(R.longe?'Vista ampla: a câmera se afastou. Aperte de novo para voltar.':'Vista normal.');SFX.click();
  if(G.area&&G.area.aoVista)G.area.aoVista(R.longe);
}
