// Ajudantes de interface para os testes no navegador: tocam nos botões do painel como um jogador faria.
function ui(page){
  const ev=(f,a)=>page.evaluate(f,a);
  const U={
    ev,
    async clicar(sel,txt,exato,n){
      const ok=await ev(([sel,txt,exato,n])=>{
        const els=[...document.querySelectorAll(sel)].filter(e=>!e.disabled&&e.offsetParent!==null);
        const norm=s=>s.replace(/\s+/g,' ').trim();
        const e=els.filter(e=>exato?norm(e.textContent)===txt:norm(e.textContent).indexOf(txt)>=0)[n||0];
        if(!e)return'sem '+sel+' '+txt+' entre: '+els.map(e=>norm(e.textContent)).join(' | ');
        e.click();return true;
      },[sel,txt,!!exato,n||0]);
      if(ok!==true)throw new Error(ok);
    },
    /* linha da paleta: pelo código exato (ex.: "if", "for … in range(n)"); demonstrações e Continuar, pelo texto */
    async pb(t){
      const ok=await ev(t=>{const l=[...document.querySelectorAll('#pPaleta .pb')].filter(e=>!e.disabled);const norm=s=>s.replace(/\s+/g,' ').trim();
        const e=l.find(e=>e.querySelector('.cod')&&norm(e.querySelector('.cod').textContent)===t)||l.find(e=>norm(e.textContent).indexOf(t)>=0);
        if(!e)return'sem linha na paleta '+t+' entre: '+l.map(e=>norm(e.textContent)).join(' | ');e.click();return true;},t);
      if(ok!==true)throw new Error(ok);
    },
    /* modo Escrever: digita o código e toca em Pronto; devolve se o texto foi aceito e o erro mostrado */
    async escrever(txt){
      await ev(()=>{if(!PAINEL.texto)document.getElementById('pModo').click();});
      await page.fill('#pTxt',txt);
      await ev(()=>document.getElementById('pModo').click());
      return ev(()=>({aceito:!PAINEL.texto,erro:document.getElementById('pErro').hidden?null:document.getElementById('pErro').textContent,prog:LANG.codigo(PAINEL.prog)}));
    },
    erro:()=>ev(()=>{const b=document.getElementById('pErro');return b.hidden?null:{onde:b.querySelector('.onde').textContent,tit:b.querySelector('.tit').textContent,txt:b.querySelector('.txt').textContent};}),
    confirmar:()=>ev(()=>document.getElementById('cfYes').click()),
    opcao:t=>U.clicar('#dOpcoes .btn',t),
    ch:(t,n)=>U.clicar('#pEdit .ch',t,true,n),
    linhaTipo:async(tipo,n)=>{const ok=await ev(([tipo,n])=>{const l=[...document.querySelectorAll('#pProg .ln')].filter(e=>e.dataset.tipo===tipo);const e=l[n||0];if(!e)return false;e.click();return true;},[tipo,n]);if(!ok)throw new Error('sem linha '+tipo);},
    linha:async n=>{const ok=await ev(n=>{const l=[...document.querySelectorAll('#pProg .ln')].filter(e=>!e.dataset.cursor);const e=l[n-1];if(!e)return false;e.click();return true;},n);if(!ok)throw new Error('sem linha '+n);},
    sit:i=>ev(i=>{document.querySelectorAll('#pSits .sit')[i].click();},i),
    etapa:i=>ev(i=>{document.querySelectorAll('#pEtapas .etp')[i].click();},i),
    async esperarFim(max){for(let i=0;i<(max||400);i++){const r=await ev(()=>{const r=PAINEL.run;return!r||r.s.fim;});if(r)return;await page.waitForTimeout(50);}throw new Error('execução não terminou');},
    /* responde a previsão, se o painel pedir uma (por padrão, a primeira opção) */
    async prever(i){return ev(i=>{const b=document.getElementById('pPrev');if(b.hidden)return null;const o=[...b.querySelectorAll('.ops .btn')];const e=o[i===undefined?0:i];const t=e.textContent;e.click();return t;},i);},
    async executar(prev){await ev(()=>document.getElementById('pRun').click());const p=await U.prever(prev);if(p!==null)await page.waitForTimeout(20);await U.esperarFim();await page.waitForTimeout(60);return ev(()=>__vt.painelEstado());},
    async executarTodas(){const n=await ev(()=>PAINEL.cfg.situacoes.length);let r;for(let i=0;i<n;i++){await U.sit(i);r=await U.executar();if(!r.ok)return r;}return r;},
    estado:()=>ev(()=>__vt.estado()),
    painel:()=>ev(()=>__vt.painelEstado()),
    async usarEm(x,y,dir){return ev(([x,y,dir])=>__vt.usarEm(x,y,dir),[x,y,dir]);},
    async transicao(){await page.waitForTimeout(650);await ev(()=>__vt.quadros(3));}
  };
  return U;
}
module.exports={ui};
