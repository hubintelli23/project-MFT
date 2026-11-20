/* MFT 블루잉크 : 천년청묵 · js/assets/weapons.js · v0.9
   무기 — 연우의 붓·검, 연하의 피리, 매향의 침통, 청류의 수검, 백진의 검·방패, 천제혁의 참마도, 궁극기·녹기현경 검
   무기를 바꾸려면 WEAPONS 목록의 만드는 함수를 고치거나 새 함수로 바꿔 끼웁니다.
   (모델 파일 .glb로 바꿀 때도 같은 이름의 함수가 3D 오브젝트를 돌려주면 됩니다) */
'use strict';
function makeBrush(){const g=new T.Group();const sh=new T.Mesh(new T.CylinderGeometry(0.035,0.045,1.05,6),lam(0x6b4a2e));sh.position.y=-0.45;g.add(sh);const band=new T.Mesh(new T.CylinderGeometry(0.055,0.055,0.08,8),lam(0x3fae8c,0x1d5a48));band.position.y=-0.95;g.add(band);const tip=new T.Mesh(new T.ConeGeometry(0.08,0.34,8),lam(0x151515));tip.rotation.x=PI;tip.position.y=-1.15;g.add(tip);const jt=new T.Mesh(new T.SphereGeometry(0.05,6,6),new T.MeshBasicMaterial({color:0x6fe0b8}));jt.position.y=-1.3;g.add(jt);return g;}
function makeSword(len=1.25,col=0xe2f6ec,em=0x2a6650){const g=new T.Group();const bl=new T.Mesh(new T.BoxGeometry(0.075,len,0.025),lam(col,em));bl.position.y=-0.12-len/2;g.add(bl);const o=new T.Mesh(bl.geometry,OL);o.scale.set(1.5,1.03,1.6);bl.add(o);const gd=new T.Mesh(new T.BoxGeometry(0.28,0.05,0.09),lam(0x2a2a2a));gd.position.y=-0.1;g.add(gd);const hl=new T.Mesh(new T.CylinderGeometry(0.035,0.035,0.2,6),lam(0x1d3d33));hl.position.y=0.02;g.add(hl);return g;}
function makeFlute(C){
  const fl=new T.Group();const body=new T.Mesh(new T.CylinderGeometry(0.035,0.035,0.8,8),lam(C.flute,0x1d4a40));body.position.y=-0.35;fl.add(body);
  for(let i=0;i<4;i++){const h=new T.Mesh(new T.SphereGeometry(0.018,4,4),new T.MeshBasicMaterial({color:0x141414}));h.position.set(0,-0.15-i*0.13,0.03);fl.add(h);}
  const tas=new T.Mesh(new T.ConeGeometry(0.05,0.2,6),lam(0xb23a5a,0x3a0a14));tas.position.y=-0.85;tas.rotation.x=PI;fl.add(tas);
  return fl;}
function makeNeedleCase(){
  const case_=new T.Group();const tube=new T.Mesh(new T.CylinderGeometry(0.06,0.06,0.32,8),lam(0x3a2c20));tube.position.y=-0.15;case_.add(tube);
  for(let i=0;i<3;i++){const n=new T.Mesh(new T.CylinderGeometry(0.008,0.008,0.4,4),new T.MeshBasicMaterial({color:0xf2f2e8}));n.position.set(-0.03+i*0.03,-0.45,0.02);case_.add(n);}
  return case_;}
function makeShield(C){const g=new T.Group();const pl=new T.Mesh(new T.BoxGeometry(0.95,1.4,0.12),lam(C.shield,0x3a4048));g.add(pl);const o=new T.Mesh(pl.geometry,OL);o.scale.set(1.06,1.04,1.4);pl.add(o);
  const em=new T.Mesh(new T.CylinderGeometry(0.2,0.2,0.05,6),lam(C.emblem,0x6a5010));em.rotation.x=PI/2;em.position.z=0.08;g.add(em);
  const bar=new T.Mesh(new T.BoxGeometry(0.08,1.2,0.04),lam(C.emblem,0x6a5010));bar.position.z=0.08;g.add(bar);const bar2=new T.Mesh(new T.BoxGeometry(0.7,0.08,0.04),lam(C.emblem,0x6a5010));bar2.position.set(0,0.2,0.08);g.add(bar2);return g;}
function makeGreatBlade(C){const g=new T.Group();const bl=new T.Mesh(new T.BoxGeometry(0.26,1.9,0.05),lam(C.bladeColor,C.bladeGlow));bl.position.y=-1.1;g.add(bl);const o=new T.Mesh(bl.geometry,new T.MeshBasicMaterial({color:0x8a1018,side:T.BackSide}));o.scale.set(1.15,1.02,1.8);bl.add(o);
  const gd=new T.Mesh(new T.BoxGeometry(0.42,0.08,0.12),lam(0x3a0a0e));gd.position.y=-0.12;g.add(gd);const hl=new T.Mesh(new T.CylinderGeometry(0.04,0.04,0.32,6),lam(0x1a0a0a));hl.position.y=0.06;g.add(hl);return g;}
/* ---------- 무기 목록 (게임 코드는 여기서 꺼내 씁니다) ---------- */
const WEAPONS={
  yeonwooBrush:()=>makeBrush(),
  yeonwooSword:()=>makeSword(CHARACTERS.yeonwoo.swordLength,CHARACTERS.yeonwoo.swordColor,CHARACTERS.yeonwoo.swordGlow),
  yeonhaFlute:()=>makeFlute(CHARACTERS.yeonha),
  maehyangNeedles:()=>makeNeedleCase(),
  cheongryuSword:()=>makeSword(CHARACTERS.cheongryu.swordLength,CHARACTERS.cheongryu.swordColor,CHARACTERS.cheongryu.swordGlow),
  skySword:()=>makeSword(1.6,0xe8fff4,0x3fae8c),       // 천지수묵 : 떨어지는 검
  nokgiSword:()=>makeSword(1.0,0xbfffe6,0x3fae8c),     // 녹기현경 : 허상의 검
  baekjinSword:()=>makeSword(CHARACTERS.baekjin.swordLength,CHARACTERS.baekjin.swordColor,CHARACTERS.baekjin.swordGlow),  // 백진 : 백호쇄악검
  baekjinShield:()=>makeShield(CHARACTERS.baekjin),      // 백진 : 성기사 방패
  cheonjehyeokBlade:()=>makeGreatBlade(CHARACTERS.cheonjehyeok), // 천제혁 : 염라혈명검(칠흑 참마도)
  phantomSword:()=>makeSword(1.3,0xe8f0fa,0x6a7a90),    // 기사 환영의 검
};
