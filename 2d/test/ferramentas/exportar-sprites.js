// Exporta folhas de sprites e de tiles (PNG) a partir do código do jogo, para a pasta recursos/.
// Todo gráfico do jogo é desenhado por código; estas folhas servem de referência visual e para edição.
// uso: node test/ferramentas/exportar-sprites.js
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
(async()=>{
  const OUT=path.resolve(__dirname,'..','..','recursos');fs.mkdirSync(OUT,{recursive:true});
  const b=await chromium.launch();const p=await b.newPage();
  await p.goto('file://'+path.resolve(__dirname,'..','..','build','vale-das-tumbas-2d.html'));
  await p.waitForTimeout(800);
  const folhas=await p.evaluate(()=>{
    const out={};
    const folha=(nome,itens,col,cel,esc)=>{esc=esc||3;const linhas=Math.ceil(itens.length/col);const c=cnv(col*cel.w,linhas*cel.h),g=ctx2(c);g.fillStyle='#6a5a48';g.fillRect(0,0,c.width,c.height);
      itens.forEach((im,i)=>{const x=(i%col)*cel.w,y=Math.floor(i/col)*cel.h;g.fillStyle=(i+Math.floor(i/col))%2?'#7a6a58':'#6a5a48';g.fillRect(x,y,cel.w,cel.h);if(im)g.drawImage(im,x+Math.floor((cel.w-im.width)/2),y+cel.h-im.height-1);});
      out[nome]=escalar(c,esc).toDataURL('image/png');};
    /* personagem principal: a folha de verdade (1 px = 1 px, fundo transparente, células de 40×46, referência nos pés),
       uma cópia ampliada 4× para ver os detalhes e a configuração das animações em JSON */
    const H=folhaHeroi();out.heroi=H.canvas.toDataURL('image/png');out.heroi_4x=escalar(H.canvas,4).toDataURL('image/png');
    out['heroi.json']=JSON.stringify(H.config,null,2);
    folha('guardioes',[sprAutomato(false,0),sprAutomato(true,1),sprVigia(0),sprVigia(1),sprRoboAtom(false,0),sprRoboAtom(true,1),sprClone(false,0),sprClone(true,1),sprMiniAutomato(0),sprMiniAutomato(1),sprMiniAutomato(2),sprMiniAutomato(3),sprPolinizador(0),sprPolinizador(1),sprJardineiro(0),sprJardineiro(1)],8,{w:20,h:26},4);
    const S=(n,...a)=>SPR.get(n,...a);
    folha('vale',[S('tenda','#d7c39a'),S('tenda','#b9533a'),S('fogueira',0),S('mesa'),S('bandeira'),S('palmeira',1),S('arbusto',0),S('arbusto',3),S('capim',1),S('cacto',1),S('pedra',0,0),S('pedra',1,1),S('pedra',2,2),
      S('coluna','steam'),S('coluna','diesel'),S('coluna','atom'),S('coluna','bio'),S('engrenagemGrande'),S('dirigivel'),S('antena',50),S('estufa'),S('caldeiraRuina'),S('torreDiesel'),S('estatuaAutomato'),S('estela',3,false),S('estela',4,true),
      S('bau',false),S('bau',true),S('fragmento'),S('marco','#c8743a'),S('placaTrilha','#6fd3ff'),S('chamine'),S('cano'),S('caminhao'),S('poste'),S('disco'),S('bunker'),S('cogumelo',0),S('arcoRaiz'),S('painelSolar'),S('cataVento',0),S('canteiro',0),S('muro',4,1),S('colunaCaida'),S('mesaRocha',1),S('arvoreSeca')],8,{w:106,h:62},2);
    folha('entradas',[S('torre','steam'),S('torre','diesel'),S('torre','atom'),S('torre','bio'),S('entrada','steam'),S('entrada','diesel'),S('entrada','atom'),S('entrada','bio')],4,{w:100,h:108},2);
    folha('piramide',[S('piramide')],1,{w:364,h:236},2);
    folha('tumbas',[S('caldeira',false,0),S('caldeira',true,0),S('pistao',0),S('pistao',1),S('pistao',2),S('placa','olho',0),S('placa','simples',1),S('computador',0),S('alavancaSteam',0),S('portaoBronze',2,0),S('engrParede',0),S('canos'),S('tabPedra'),
      S('gerador',true,0),S('holofote',1),S('sensor',true),S('pilarAco'),S('console',0),S('conteiner',1),S('separadora',0),S('caixaLote'),S('montaCargas',0.5),S('bancada'),S('portaoAco',2,0),S('barril'),S('motor',0),
      S('celula',true,0),S('valvula','#5dff7a',0),S('pontao'),S('reator',0),S('bateria',7),S('comporta',0.5),S('carregador',true,2),S('tanque',4),S('portaoManut',0),S('dreno',true,0),S('painelAtom',0),
      S('flor',true,0),S('bulbo',0,true),S('bulbo',1,false),S('coracao2',0),S('capsula',0),S('membrana',2,0),S('organismo',1,3,0),S('organismo',3,3,0),S('consoleBio',0),
      S('arvore',true,0),S('canteiro2',true),S('canteiro2',false),S('fonte',true,0),S('placaDistrito','#c8743a'),S('consoleCity',0),S('portaoVinha',2,0),S('vaso',0),S('pedestal','#c8743a'),S('escada','#8a5432'),S('lampada','#ffb455',0)],8,{w:124,h:96},2);
    /* treino, Lume, Guia, ambientação do vale e máquinas que reagem ao código (célula do tamanho do maior sprite) */
    const amb=[S('lume',0),S('lume',1),S('iconeGuia','if','#c9a6ff'),S('iconeGuia','x = 5','#6fd3ff'),S('iconeGuia','for','#b98cff'),S('tocha',false,0),S('tocha',true,0),S('tocha',true,1),S('manivela'),
      S('terminalTreino',false,0),S('terminalTreino',true,1),S('portaoMadeira',4,0),S('portaoMadeira',4,2),S('placaTreino'),S('acacia',0),S('acacia',1),S('braseiro',0),S('braseiro',1),S('estatuaEngenheira'),S('observatorio'),S('poco'),S('carroca'),
      S('tendaRasgada'),S('fogueiraFria'),S('arcoQuebrado',0),S('arcoQuebrado',1),S('ponteTabuas',3),S('cacos',0),S('pedrinhas',0),S('flores',0),S('racha',0),S('engrChao',0),
      S('tanqueDiesel',1),S('tanqueDiesel',4),S('painelSenha',false,0),S('painelSenha',true,0),S('portinhola',false),S('portinhola',true),S('ventilador',0,true),S('luzStatus',false),S('luzStatus',true),S('reator',0,'#ff5a3a'),S('reator',0,'#5dff7a')];
    folha('ambiente_e_ajuda',amb,8,{w:Math.max(...amb.map(i=>i.width))+6,h:Math.max(...amb.map(i=>i.height))+4},2);
    const vals=['engr','caixas','galao','frasco','placa','cartao','fusivel1','fusivel0','alavanca1','alavanca0','plaq','plaqDec'].map(i=>S('valor',i));
    folha('valores_e_icones',vals.concat([S('coracao',true),S('coracao',false)],['steam','diesel','atom','bio'].flatMap(k=>[0,1,2].map(e=>S('reliquia',k,e)))),7,{w:26,h:26},4);
    /* tiles de cada tema */
    for(const tema of['vale','steam','diesel','atom','bio','city']){
      const A=novaArea('folha_'+tema,12,6,tema);
      const L=tema==='vale'?['penhasco','penhasco','areia','areia','duna','duna','estrada','estrada','trilha','grama','agua','agua']:['parede','parede','parede','chao','chao','chao2','chao','vao','agua','rad','grade','raiz'];
      for(let y=0;y<6;y++)for(let x=0;x<12;x++)A.set(x,y,y<2&&x<4?(tema==='vale'?'penhasco':'parede'):L[(x+y*5)%L.length]);
      const c=cnv(12*16,6*16),g=ctx2(c);for(let y=0;y<6;y++)for(let x=0;x<12;x++)desenharTile(g,A,x,y,x*16,y*16);out['tiles_'+tema]=escalar(c,3).toDataURL('image/png');
    }
    return out;
  });
  for(const k in folhas){if(k.endsWith('.json'))fs.writeFileSync(path.join(OUT,k),folhas[k]+'\n');else fs.writeFileSync(path.join(OUT,k+'.png'),Buffer.from(folhas[k].split(',')[1],'base64'));}
  console.log('folhas:',Object.keys(folhas).join(', '));await b.close();
})();
