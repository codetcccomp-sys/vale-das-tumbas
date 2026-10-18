'use strict';
/* ====================== utilidades ====================== */
const TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
function rng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
/* ruído determinístico por coordenada (o mesmo tile sempre recebe a mesma variação) */
function hash2(x,y,s){let h=(x*374761393+y*668265263+(s|0)*2147483647)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
const TILE=16;

/* ====================== textos (pt-BR) ====================== */
const TXT={
  welcome:'Boas-vindas ao Vale das Tumbas. Os sistemas da cidade antiga dormem. Em cada tumba, conclua as etapas de programação para recuperar um saber: a relíquia da tumba desperta com ele.',
  welcomeTreino:'Boas-vindas ao Vale das Tumbas! Antes das tumbas, um treino rápido: siga o objetivo no alto da tela.',
  saved:'Progresso salvo: relíquias, saberes, programas, diário, segredos e posição no vale.',
  saveFixed:'Parte do salvamento estava danificada. O que pôde ser aproveitado foi recuperado.',
  saveFail:'Não foi possível salvar neste navegador (o armazenamento está bloqueado ou cheio). Dá para jogar normalmente, mas o progresso se perde ao fechar a página.',
  soundOn:'Som: ligado',soundOff:'Som: desligado',
  enterTomb:'Entrando na tumba...',backValley:'Voltando ao vale...',
  deathTomb:'Os perigos da tumba te venceram.',
  fall:{gap:'Você caiu no vão.',water:'Você caiu na água funda do canal.',tile:'A placa sem o olho cedeu sob seus pés.',piston:'O pistão desceu com você em baixo. Espere a luz de aviso apagar.',spore:'Os espinhos da estufa te arranharam.'},
  hit:{automato:'O Autômato de latão te acertou. Ande devagar perto dele.',sentinel:'O Robô-vigia te alcançou. Saia do facho e use os pilares.',
    bot:'O Robô atômico te acertou. Saia da sala e ele volta a dormir.',clone:'Um Clone te alcançou. Saia da sala e eles voltam a dormir.',rad:'A radiação te feriu: saia da zona verde.'},
  backPoint:'Voltando ao último ponto de energia.',backEntrance:'Voltando à entrada: use um ponto de energia para salvar mais perto.',
  pointLit:'Ponto de energia aceso. Ponto de controle salvo e lanterna recarregada.',pointAgain:'Ponto de controle salvo aqui. Lanterna recarregada.',
  nightHint:'Uma inscrição brilha ao longe...',dayInsc:'A inscrição está apagada. Volte à noite.',
  panelPause:'Painel aberto: a exploração está pausada.',
  ending:['A civilização do vale avançou do vapor à engenharia genética.','Seus sistemas funcionavam com instruções, dados, decisões e repetições. Você reuniu os quatro conhecimentos.','A Cidade-Jardim respira de novo. Ela esperou por você.'],
  tip:{touch:'Joystick à esquerda para andar. Perto de algo, toque no botão de ação à direita.',kb:'WASD ou setas para andar, E ou Espaço para interagir, Shift corre, G abre o Guia, J o diário, Esc pausa.',pad:'Analógico anda, A interage, Select abre o Guia, Start pausa.'}
};

/* ====================== o mundo: posições em tiles (1 tile = 16 px) ======================
   O vale 2D usa as mesmas posições do vale 3D na escala 0,4 (tile = 90 + coordenada × 0,4; o norte fica para cima). */
const VALE_W=180,VALE_H=180,VALE_C=90,VALE_R=80;
const v3=(x,z)=>({x:VALE_C+x*0.4,y:VALE_C+z*0.4});
const TOMBS={
  steam:{name:'Tumba das Engrenagens',era:'Steampunk',css:'#c8743a',col:'#c8743a',x:130,y:52,label:'NE',saber:'seq'},
  diesel:{name:'Tumba dos Motores',era:'Dieselpunk',css:'#6fd3ff',col:'#6fd3ff',x:34,y:84,label:'O',saber:'dados'},
  atom:{name:'Tumba do Reator',era:'Atompunk',css:'#5dff7a',col:'#5dff7a',x:50,y:128,label:'SO',saber:'decisoes'},
  bio:{name:'Tumba Viva',era:'Biopunk',css:'#b98cff',col:'#b98cff',x:134,y:124,label:'SE',saber:'automacao'},
  final:{name:'Cidade-Jardim',era:'Solarpunk',css:'#ffd24a',col:'#ffd24a',x:90,y:30,label:'N'}
};
/* porta de cada tumba (o tile da entrada) e onde o explorador aparece ao sair */
for(const k in TOMBS){const T=TOMBS[k];T.door=k==='final'?{x:90,y:40}:{x:T.x,y:T.y+3};T.out={x:T.door.x,y:T.door.y+2};}
const RELIC_INFO={
  steam:{name:'Engrenagem-mestra',art:'a',diary:'steam_relic',slot:'de cobre'},
  diesel:{name:'Vela de ignição',art:'a',diary:'diesel_relic',slot:'azul-gelo'},
  atom:{name:'Núcleo atômico',art:'o',diary:'atom_relic',slot:'verde'},
  bio:{name:'Semente da vida',art:'a',diary:'bio_relic',slot:'lilás'}
};
/* nome da relíquia com artigo: relNome('atom') → "o Núcleo atômico"; com maiúscula no começo da frase */
const relNome=(k,mai)=>{const r=RELIC_INFO[k],a=mai?r.art.toUpperCase():r.art;return a+' '+r.name;};
const relDe=k=>(RELIC_INFO[k].art==='o'?'do ':'da ')+RELIC_INFO[k].name;
const RELIC_KEYS=['steam','diesel','atom','bio'];
/* lugares que têm desafios mas não são tumbas */
const LUGARES={treino:'Pátio de Treino'};
const nomeLugar=k=>TOMBS[k]?TOMBS[k].name:LUGARES[k]||k;
const TREINO_PASSOS=9;
const mai1=t=>t?t[0].toUpperCase()+t.slice(1):t;

/* inscrições noturnas (as mesmas do 3D) e segredos do vale (4 fragmentos, 5 baús, 3 inscrições de dia) */
const INSC=[
  {id:'oasis',x:65,y:139,t:'Inscrição do oásis',s:'Antes do ferro, havia a semente. O oásis lembra o que a cidade esqueceu.'},
  {id:'automato',x:108,y:94,t:'Inscrição do Autômato',s:'Todos os caminhos sobem. A Cidade-Jardim espera ao norte, atrás de quatro encaixes.'},
  {id:'steam',x:121,y:64,t:'Inscrição do vapor',s:'Vapor e engrenagem: aprenda a ordem das coisas. Quem troca a ordem chega a outro lugar.'},
  {id:'diesel',x:43,y:95,t:'Inscrição do diesel',s:'Cada máquina lê o que está guardado. Guarde o valor certo, do tipo certo, e a máquina obedece.'},
  {id:'atom',x:58,y:119,t:'Inscrição do átomo',s:'A água esfria o que o átomo acende. Pergunte antes de agir: if, elif, else.'},
  {id:'bio',x:125,y:115,t:'Inscrição da vida',s:'O que vive repete: respira, cresce, para quando basta. Saiba quando parar.'}
];
const SEC_FRAGS=[{id:'f_nw',x:39,y:75,q:'noroeste'},{id:'f_ne',x:127,y:39,q:'nordeste'},{id:'f_sw',x:47,y:140,q:'sudoeste'},{id:'f_se',x:145,y:136,q:'sudeste'}];
const SEC_CHESTS=[{id:'c1',x:42,y:107},{id:'c2',x:55,y:152},{id:'c3',x:140,y:44},{id:'c4',x:127,y:131},{id:'c5',x:66,y:125}];
const SEC_INSC=[{id:'d1',x:80,y:129},{id:'d2',x:71,y:67},{id:'d3',x:118,y:79}];
const SEC_IDS=SEC_FRAGS.map(f=>f.id).concat(SEC_CHESTS.map(c=>c.id),SEC_INSC.map(d=>d.id));
/* pontos de interesse no caminho entre as tumbas: cada um conta uma pista sobre programação e vai para o diário */
const POIS=[
  {id:'acamp',x:104,y:79,t:'Acampamento abandonado',s:'Uma barraca rasgada e uma fogueira fria. No caderno esquecido: "O autômato das Engrenagens faz exatamente o que está escrito, na ordem escrita. Quando ele bate, o erro costuma estar numa linha antes."'},
  {id:'ponte',x:61,y:82,t:'Ponte do leito seco',s:'Uma ponte de tábuas sobre um rio que secou. Entalhado no corrimão: "energia = True liga a máquina; energia = \"True\" só escreve uma palavra."'},
  {id:'observ',x:66,y:110,t:'Observatório em ruínas',s:'A cúpula caiu, mas a luneta ainda aponta para o norte. Num caderno de medições: "temperatura 82 → resfriar · 61 → ventilar · 33 → nada. Testar do mais quente para o mais frio."'},
  {id:'estatua',x:97,y:118,t:'Estátua da Engenheira',s:'Uma estátua segura uma tábua de pedra com quatro palavras gravadas: = guarda · if pergunta · for repete · while espera.'},
  {id:'poco',x:113,y:135,t:'Poço antigo',s:'Você soltou uma pedrinha e contou: 1, 2, 3, 4... tchibum! A borda tem um aviso: "Conte as voltas antes de descer o balde: range(4) dá quatro."'},
  {id:'carroca',x:120,y:69,t:'Carroça tombada',s:'Engrenagens espalhadas pela areia, cada uma marcada com um número inteiro. Um bilhete preso na roda: "5 peças é int; 2,5 litros é float; \"MOTOR\" é str, a string."'}
];
const POI_IDS=POIS.map(p=>p.id);

/* ====================== diário ======================
   Os ids das anotações são os mesmos do jogo 3D (para o diário migrar). Os textos falam do jogo 2D. */
const ENTRIES={
  camp:{t:'Caderno de campo',s:'Cheguei ao vale ao amanhecer. Cinco torres no horizonte: cobre, azul-gelo, verde, lilás e, ao norte, o dourado. Dizem que a cidade antiga funcionava com instruções.'},
  steam_enter:{t:'Tumba das Engrenagens',s:'O chão fala em ritmo. Os pistões descem quando a luz de aviso acende: espere ela apagar antes de passar.'},
  steam_floor:{t:'Piso de engrenagens',s:'Só as placas marcadas com o olho aguentam o peso. As outras cedem logo que alguém para sobre elas.'},
  automato:{t:'Autômato de latão',s:'Dorme até ouvir passos apressados ou sentir alguém por perto. Andar devagar o mantém quieto. Se você sair da sala, ele volta a dormir.'},
  steam_relic:{t:'Engrenagem-mestra',s:'A primeira relíquia, o saber da Sequência. O encaixe de cobre na porta da Cidade-Jardim se acendeu.'},
  oasis:{t:'O oásis',s:'A água fresca fecha as feridas de quem volta das tumbas.'},
  night:{t:'À noite',s:'Algumas inscrições só brilham depois que o sol se põe. Elas guardam pistas sobre as tumbas.'},
  diesel_enter:{t:'Tumba dos Motores',s:'Um arranha-céu soterrado. Os holofotes obedecem a quem os gira: cada toque vira o facho um oitavo de volta. Quando a luz encontra o sensor, a porta responde.'},
  diesel_beams:{t:'Luz que abre portas',s:'O sensor só acende quando o facho o alcança sem nada no caminho. Pilares e motores fazem sombra.'},
  diesel_elev:{t:'Monta-cargas',s:'O monta-cargas da oficina só sobe quando os quatro contêineres guardam os valores da ficha de serviço.'},
  diesel_guard:{t:'Robô-vigia a diesel',s:'Ele patrulha varrendo o facho de luz à frente. Quem fica no facho é visto e perseguido. Os pilares escondem.'},
  diesel_relic:{t:'Vela de ignição',s:'A segunda relíquia, o saber dos Dados e variáveis. O encaixe azul-gelo da Cidade-Jardim se acendeu.'},
  atom_enter:{t:'Tumba do Reator',s:'A água de resfriamento obedece a duas válvulas: a laranja enche, a verde drena. Os pontões do canal sobem e descem com ela.'},
  atom_water:{t:'Comportas e pontões',s:'Com a água baixa, os pontões assentam no fundo do canal e formam uma passarela. Com a água alta, eles se afastam.'},
  atom_rad:{t:'Radiação',s:'As zonas verdes gastam a lanterna mais rápido e ferem quem fica nelas. Atravesse depressa.'},
  atom_guard:{t:'Robô atômico de manutenção',s:'Dorme até ouvir passos apressados ou sentir alguém por perto. Se você sair da sala, ele volta a dormir.'},
  atom_relic:{t:'Núcleo atômico',s:'A terceira relíquia, o saber das Decisões. O encaixe verde da Cidade-Jardim se acendeu.'},
  bio_enter:{t:'Tumba Viva',s:'Uma tumba que respira. Os bulbos cantam uma sequência e as portas de tecido só abrem para quem a repete na mesma ordem.'},
  bio_seq:{t:'A canção das portas',s:'Cada bulbo tem uma cor e uma nota. Errar a ordem faz um barulho que acorda quem dorme nas cápsulas.'},
  bio_spores:{t:'Sala dos Esporos',s:'Os esporos turvam a vista. O que a luz não alcança continua lá: siga as raízes brilhantes do chão.'},
  bio_clone:{t:'Os Clones',s:'Corpos translúcidos dormem nas cápsulas. Acordam com passos apressados, com a proximidade ou com a canção errada. Se você sair da sala, voltam a dormir.'},
  bio_relic:{t:'Semente da vida',s:'A quarta relíquia, o saber das Repetições e da automação. Os quatro encaixes da porta da Cidade-Jardim brilham.'},
  city_enter:{t:'Cidade-Jardim',s:'O sol volta a entrar. Aqui a lanterna não gasta. No centro, o painel do Jardim Central espera um programa que use tudo o que as tumbas ensinaram.'},
  city_rhythm:{t:'Distrito do Ritmo',s:'Placa do distrito de cobre: "Primeiro isto, depois aquilo. A cidade cresceu porque alguém escreveu a ordem das coisas."'},
  city_light:{t:'Distrito da Luz',s:'Placa do distrito azul-gelo: "Cada lâmpada lia um contêiner. Mudar o valor guardado mudava a luz da rua inteira."'},
  city_water:{t:'Distrito da Água',s:'Placa do distrito verde: "As fontes perguntavam antes de jorrar: se a cisterna está cheia, então... senão..."'},
  city_seq:{t:'Distrito da Semente',s:'Placa do distrito lilás: "Os jardins se regavam sozinhos, enquanto a terra pedia água. Ninguém precisava lembrar."'},
  city_end:{t:'A cidade acordou',s:'O Jardim Central acendeu e a árvore-matriz floresceu. A civilização do vale esperou por alguém que reunisse todas as eras.'},
  /* novas no jogo 2D */
  oficina_steam:{t:'O Computador Ancestral',s:'Uma máquina de pedra, bronze e engrenagens. Placas de comando, uma alavanca e um pequeno autômato que cumpre exatamente o que as placas mandam.'},
  oficina_diesel:{t:'A oficina dos contêineres',s:'Contêineres com nome, tipo e valor, ligados às máquinas por canos e cabos. Cada máquina consulta o seu contêiner na hora de trabalhar.'},
  oficina_atom:{t:'O painel do reator',s:'Sensores medem a energia, o nível da água e a temperatura. O painel compara cada medida e escolhe um caminho: if, elif ou else.'},
  oficina_bio:{t:'A estufa automática',s:'Um polinizador corre num trilho entre organismos artificiais, e tochas de seiva iluminam o corredor. A estufa repete a rotina que receber, e só para quando ela manda.'},
  treino:{t:'Pátio de treino',s:'O Lume me ensinou o básico: andar, olhar ao redor, interagir, pegar objetos, abrir o Guia de Programação e executar o primeiro comando, acender_tocha().'},
  lume:{t:'Lume, o autômato-guia',s:'Um pequeno autômato de latão com uma lanterna no peito. Ele conhece os mecanismos das tumbas e dá dicas aos poucos: primeiro o conceito, depois o caminho, e só por último algo bem perto da solução.'},
  migrado:{t:'Lembranças de outra viagem',s:'Trouxe do primeiro diário as relíquias, as anotações e os segredos. As relíquias voltaram adormecidas: para despertá-las, preciso reaprender o que cada tumba ensina.'}
};
for(const d of INSC)ENTRIES['insc_'+d.id]={t:d.t,s:d.s};
for(const d of POIS)ENTRIES['poi_'+d.id]={t:d.t,s:d.s};
Object.assign(ENTRIES,{
  sec_f_nw:{t:'Fragmento de mapa (noroeste)',s:'Um pedaço rasgado de um mapa antigo. A página Mapa do diário mostra o que ele revela.'},
  sec_f_ne:{t:'Fragmento de mapa (nordeste)',s:'Um pedaço rasgado de um mapa antigo. A página Mapa do diário mostra o que ele revela.'},
  sec_f_sw:{t:'Fragmento de mapa (sudoeste)',s:'Um pedaço rasgado de um mapa antigo. A página Mapa do diário mostra o que ele revela.'},
  sec_f_se:{t:'Fragmento de mapa (sudeste)',s:'Um pedaço rasgado de um mapa antigo. A página Mapa do diário mostra o que ele revela.'},
  sec_c1:{t:'Baú do dirigível',s:'Bilhete do maquinista: "A separadora não sabe contar sozinha. Ela olha o contêiner quantidade e faz o que estiver lá."'},
  sec_c2:{t:'Baú do oásis',s:'Carta do jardineiro: "Deixei as estufas abertas para o vento entrar. Se um dia voltarem, que encontrem o que sobrou da primeira semente."'},
  sec_c3:{t:'Baú da caldeira',s:'Registro do maquinista: "A caldeira nunca apagou por falta de lenha, e sim por falta de gente. A cidade se acostumou ao ruído e esqueceu o silêncio."'},
  sec_c4:{t:'Baú da estufa',s:'Bilhete sobre a Tumba Viva: "Repetir é fácil. Difícil é saber quando parar: enquanto a terra pedir água, regue; quando não pedir, siga."'},
  sec_c5:{t:'Baú da antena',s:'Bilhete sobre o Reator: "= guarda, == pergunta. Quem confundiu os dois inundou a sala de controle."'},
  insc_d1:{t:'Inscrição da semente',s:'A cidade nasceu de uma semente trazida pelo vento. Quem plantou não pediu nada em troca.'},
  insc_d2:{t:'Inscrição da muralha',s:'Cada era achou ser a última. Cada uma construiu mais alto que a anterior e esqueceu de olhar para o chão.'},
  insc_d3:{t:'Inscrição do viajante',s:'Quem chegou ao norte sem os quatro saberes voltou de mãos vazias. A cidade não tem pressa.'}
});
/* anotações de saber: explicação curta e um exemplo do conceito praticado (ficam no diário com o código) */
const SABER_ENTRY={seq:'saber_seq',dados:'saber_dados',decisoes:'saber_decisoes',automacao:'saber_automacao'};
