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
    pb:t=>U.clicar('#pPaleta .pb',t),
    ch:(t,n)=>U.clicar('#pEdit .ch',t,true,n),
    linhaTipo:async(tipo,n)=>{const ok=await ev(([tipo,n])=>{const l=[...document.querySelectorAll('#pProg .ln')].filter(e=>e.dataset.tipo===tipo);const e=l[n||0];if(!e)return false;e.click();return true;},[tipo,n]);if(!ok)throw new Error('sem linha '+tipo);},
    linha:async n=>{const ok=await ev(n=>{const l=[...document.querySelectorAll('#pProg .ln')].filter(e=>!e.dataset.cursor);const e=l[n-1];if(!e)return false;e.click();return true;},n);if(!ok)throw new Error('sem linha '+n);},
    sit:i=>ev(i=>{document.querySelectorAll('#pSits .sit')[i].click();},i),
    etapa:i=>ev(i=>{document.querySelectorAll('#pEtapas .etp')[i].click();},i),
    async esperarFim(max){for(let i=0;i<(max||400);i++){const r=await ev(()=>{const r=PAINEL.run;return!r||r.s.fim;});if(r)return;await page.waitForTimeout(50);}throw new Error('execução não terminou');},
    async executar(){await ev(()=>document.getElementById('pRun').click());await U.esperarFim();await page.waitForTimeout(60);return ev(()=>__vt.painelEstado());},
    async executarTodas(){const n=await ev(()=>PAINEL.cfg.situacoes.length);let r;for(let i=0;i<n;i++){await U.sit(i);r=await U.executar();if(!r.ok)return r;}return r;},
    estado:()=>ev(()=>__vt.estado()),
    painel:()=>ev(()=>__vt.painelEstado()),
    async usarEm(x,y,dir){return ev(([x,y,dir])=>__vt.usarEm(x,y,dir),[x,y,dir]);},
    async transicao(){await page.waitForTimeout(650);await ev(()=>__vt.quadros(3));}
  };
  return U;
}
module.exports={ui};
