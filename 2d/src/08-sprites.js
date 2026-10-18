/* ====================== sprites dos guardiões e autômatos ======================
   (o personagem principal fica em 08b-heroi.js) */

/* ---------- guardiões e autômatos ---------- */
/* Autômato de latão (Engrenagens): corpo redondo, olhos de vidro, engrenagem nas costas, braços articulados. 16×20 */
function sprAutomato(acordado,f){
  const c=cnv(18,22),g=ctx2(c);const bob=f%2;
  const B='#c99a3e',b='#8e6a26',L='#f0cc70',E=acordado?'#ff5a3a':'#3a2a10';
  P.elip(g,9,12+bob,6,6,B);P.elip(g,8,11+bob,4,3,L);P.r(g,3,16+bob,12,1,b);
  P.circ(g,9,5+bob,3.6,B);P.r(g,7,3+bob,1,1,L);P.p(g,7,5+bob,E);P.p(g,11,5+bob,E);
  P.engrenagem(g,9,12+bob,3,6,b,'#5e4418',1);
  P.r(g,1,10+bob,2,5,b);P.r(g,15,10+bob,2,5,b);P.r(g,6,18,2,3,b);P.r(g,10,18,2,3,b);
  if(acordado){P.p(g,9,1+bob,'#ff9a3a');P.p(g,9,0+bob,'#ffe080');}
  return contorno(c,'#24160d');
}
/* Robô atômico de manutenção (Reator): cúpula branca, faixa laranja, antena com luz. 16×20 */
function sprRoboAtom(acordado,f){
  const c=cnv(18,22),g=ctx2(c),bob=f%2;
  P.elip(g,9,12+bob,6,6,'#e9e4d4');P.r(g,3,12+bob,12,2,'#ff9a3a');P.elip(g,9,10+bob,4,3,'#ffffff');
  P.circ(g,9,7+bob,2,acordado?'#ff4a3a':'#5dff7a');P.p(g,8,6+bob,'#ffffff');
  P.r(g,9,1+bob,1,4,'#9a968a');P.p(g,9,0+bob,acordado?'#ff4a3a':'#5dff7a');
  P.r(g,5,18,3,3,'#9a968a');P.r(g,10,18,3,3,'#9a968a');
  return contorno(c,'#1a1a14');
}
/* Clone (Viva): corpo translúcido lilás com núcleo brilhante. 14×22 */
function sprClone(acordado,f){
  const c=cnv(16,24),g=ctx2(c),bob=f%2;
  g.globalAlpha=0.85;
  P.circ(g,8,5+bob,3.5,'#c9a6ff');P.r(g,5,8+bob,7,9,'#a47ae6');P.r(g,6,9+bob,5,6,'#c9a6ff');
  P.r(g,3,9+bob,2,7,'#8e64d0');P.r(g,12,9+bob,2,7,'#8e64d0');P.r(g,5,17,3,5,'#8e64d0');P.r(g,9,17,3,5,'#8e64d0');
  g.globalAlpha=1;P.circ(g,8,12+bob,1.6,acordado?'#ff6aa0':'#f0e0ff');P.p(g,7,5+bob,acordado?'#ff2a6a':'#3a2a5a');P.p(g,10,5+bob,acordado?'#ff2a6a':'#3a2a5a');
  return contorno(c,'#2a1a40');
}
/* autômatos programáveis dos painéis: pequenos, com uma seta mostrando para onde olham. 14×14 */
function sprMiniAutomato(dir){
  const c=cnv(14,14),g=ctx2(c);
  P.circ(g,7,7.5,5.5,'#d8a24a');P.circ(g,7,7,4,'#f0cc70');P.circ(g,7,7,2,'#8e6a26');P.p(g,7,7,'#ffe9a0');
  const tip=[[7,0],[13,7],[7,13],[0,7]][dir];P.r(g,tip[0]-1+(dir===1?-1:dir===3?1:0),tip[1]-1+(dir===0?1:dir===2?-1:0),2,2,'#ff5a2a');
  return contorno(c,'#24160d');
}
function sprPolinizador(f){
  const c=cnv(16,14),g=ctx2(c);const a=f%2;
  P.elip(g,8,8,5,4,'#7a5aa8');P.elip(g,8,7,3,2,'#c9a6ff');P.r(g,7,3,2,2,'#4a3a6a');
  g.globalAlpha=0.7;P.elip(g,3,4-a,3,2,'#e8f4ff');P.elip(g,13,4-a,3,2,'#e8f4ff');g.globalAlpha=1;
  P.p(g,6,8,'#5dff7a');P.p(g,10,8,'#5dff7a');
  return contorno(c,'#2a1a40');
}
function sprJardineiro(f){
  const c=cnv(16,18),g=ctx2(c);const b=f%2;
  P.r(g,4,6+b,8,7,'#3f8a4a');P.r(g,5,7+b,6,3,'#7ad07a');P.circ(g,8,4+b,3,'#e9dcbc');P.p(g,7,4+b,'#2a4a7a');P.p(g,9,4+b,'#2a4a7a');
  P.r(g,3,14,4,3,'#6a5a3a');P.r(g,9,14,4,3,'#6a5a3a');P.r(g,12,8+b,3,2,'#6fd3ff');P.p(g,15,9+b,'#9fe0ee');
  return contorno(c,'#1a2a14');
}
