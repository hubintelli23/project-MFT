/* MFT 블루잉크 : 천년청묵 · js/assets/avatars.js · v0.8
   아바타(캐릭터 모델) — 연우 · 연하 · 매향 · 청류 · 탁기 궤웅 · 묵식귀
   캐릭터 모습을 바꾸려면 AVATARS 목록의 만드는 함수를 고칩니다. 색·크기는 data/characters.js
   (나중에 .glb 모델로 바꿀 때는 같은 이름의 함수가 3D 오브젝트를 돌려주면 됩니다.
    사람형 아바타는 userData.piv(오른팔 관절) · userData.hand(무기 쥐는 곳) · userData.robe/hair(재질)를 갖춰야 애니메이션이 동작합니다) */
'use strict';
/* ---------- 사람형 기본 몸체 ---------- */
function makeHuman(c){
  const g=new T.Group(),p={};g.rotation.order='YXZ';
  const add=(geo,mat,x,y,z,ol=true,parent=g)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);if(ol){const o=new T.Mesh(geo,OL);o.scale.setScalar(1.09);m.add(o);}return m;};
  p.robe=lam(c.robe);p.acc=lam(c.acc,c.accE||0);p.skin=lam(0xf0e2cf);p.hair=lam(c.hair);
  add(new T.CylinderGeometry(0.3,0.62,1.15,12),p.robe,0,0.58,0);
  add(new T.CylinderGeometry(0.23,0.3,0.62,10),p.robe,0,1.45,0);
  add(new T.TorusGeometry(0.29,0.055,6,16),p.acc,0,1.16,0,false).rotation.x=PI/2;
  add(new T.SphereGeometry(0.23,14,12),p.skin,0,1.98,0);
  add(new T.SphereGeometry(0.25,14,10,0,TAU,0,PI*0.62),p.hair,0,2.01,-0.02,false);
  add(new T.ConeGeometry(0.09,0.75,6),p.hair,0,1.72,-0.27,false).rotation.x=0.45;
  add(new T.CylinderGeometry(0.07,0.08,0.62,6),p.robe,-0.34,1.43,0.02).rotation.z=0.22;
  const piv=new T.Group();piv.position.set(0.34,1.7,0);piv.rotation.order='YXZ';g.add(piv);p.piv=piv;
  add(new T.CylinderGeometry(0.07,0.08,0.62,6),p.robe,0,-0.31,0,true,piv);
  const hand=new T.Group();hand.position.y=-0.62;piv.add(hand);p.hand=hand;
  const eyeL=new T.MeshBasicMaterial({color:c.eyeL||c.eye||0x111111}),eyeR=new T.MeshBasicMaterial({color:c.eyeR||c.eye||0x111111});
  add(new T.SphereGeometry(0.035,6,6),eyeL,-0.08,2.0,0.2,false);add(new T.SphereGeometry(0.035,6,6),eyeR,0.08,2.0,0.2,false);
  g.userData=p;return g;
}
/* ---------- 캐릭터별 아바타 ---------- */
function makeYeonwoo(){return makeHuman(CHARACTERS.yeonwoo);}
function makeYeonha(){const C=CHARACTERS.yeonha;const g=makeHuman(C);const u=g.userData;
  u.hand.add(WEAPONS.yeonhaFlute());
  const fl=new T.Group();const body=new T.Mesh(new T.CylinderGeometry(0.035,0.035,0.8,8),lam(C.flute,0x1d4a40));body.position.y=-0.35;fl.add(body);
  for(let i=0;i<4;i++){const h=new T.Mesh(new T.SphereGeometry(0.018,4,4),new T.MeshBasicMaterial({color:0x141414}));h.position.set(0,-0.15-i*0.13,0.03);fl.add(h);}
  const tas=new T.Mesh(new T.ConeGeometry(0.05,0.2,6),lam(0xb23a5a,0x3a0a14));tas.position.y=-0.85;tas.rotation.x=PI;fl.add(tas);
  for(const s of[-1,1]){const rib=new T.Mesh(new T.BoxGeometry(0.05,0.35,0.02),lam(s<0?0xe0303a:0x3a7ae0));rib.position.set(0.18*s,1.85,-0.22);rib.rotation.z=0.3*s;g.add(rib);}
  return g;}
function makeMaehyang(){const C=CHARACTERS.maehyang;const g=makeHuman(C);const u=g.userData;
  u.hand.add(WEAPONS.maehyangNeedles());
  const case_=new T.Group();const tube=new T.Mesh(new T.CylinderGeometry(0.06,0.06,0.32,8),lam(0x3a2c20));tube.position.y=-0.15;case_.add(tube);
  for(let i=0;i<3;i++){const n=new T.Mesh(new T.CylinderGeometry(0.008,0.008,0.4,4),new T.MeshBasicMaterial({color:0xf2f2e8}));n.position.set(-0.03+i*0.03,-0.45,0.02);case_.add(n);}
  const fm=new T.MeshBasicMaterial({color:C.flower});for(let i=0;i<5;i++){const f=new T.Mesh(new T.SphereGeometry(0.045,6,5),fm);const a=i/5*TAU;f.position.set(0.16+Math.cos(a)*0.06,2.13+Math.sin(a)*0.06,-0.08);g.add(f);}
  const ctr=new T.Mesh(new T.SphereGeometry(0.03,6,5),new T.MeshBasicMaterial({color:0xe8c24a}));ctr.position.set(0.16,2.13,-0.05);g.add(ctr);
  return g;}
function makeCheongryu(){
  const C=CHARACTERS.cheongryu;const g=makeHuman(C);g.scale.setScalar(C.scale);
  const u=g.userData;u.hand.add(WEAPONS.cheongryuSword());
  const crown=new T.Mesh(new T.CylinderGeometry(0.12,0.16,0.18,8),lam(0x1b3e52));crown.position.set(0,2.25,-0.02);g.add(crown);
  const stance=new T.Mesh(new T.SphereGeometry(1.2,18,14),MB(0x6cc7ff,0.0));stance.position.y=1.15;g.add(stance);u.stanceM=stance;
  const bubble=new T.Mesh(new T.SphereGeometry(1.5,20,16),MB(0xa8e6ff,0.0));bubble.position.y=1.15;g.add(bubble);u.bubble=bubble;
  const pts=[];for(let i=0;i<40;i++){const t=i/39;pts.push(new T.Vector3(Math.cos(t*TAU*1.6)*(1.3+t*0.4),0.3+t*2.6,Math.sin(t*TAU*1.6)*(1.3+t*0.4)));}
  const dragon=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),80,0.12,6,false),MB(C.dragonColor,0.45));dragon.visible=false;g.add(dragon);u.dragon=dragon;
  const head=new T.Mesh(new T.ConeGeometry(0.22,0.6,6),MB(0x8fd3ff,0.6));head.position.copy(pts[39]);head.rotation.z=-PI/2;dragon.add(head);
  const stars=new T.Group();for(let i=0;i<3;i++){const s=new T.Mesh(new T.OctahedronGeometry(0.09,0),new T.MeshBasicMaterial({color:0xf2d36b}));s.position.set(Math.cos(i*TAU/3)*0.4,2.5,Math.sin(i*TAU/3)*0.4);stars.add(s);}stars.visible=false;g.add(stars);u.stars=stars;
  return g;
}
/* ---------- 구해의 마물 ---------- */
function makeRusher(){const g=new T.Group();const bm=new T.MeshPhongMaterial({color:0x1d1416,emissive:0x2a0508,flatShading:true,shininess:8});const b=new T.Mesh(new T.IcosahedronGeometry(0.58,0),bm);b.position.y=0.6;g.add(b);const o=new T.Mesh(b.geometry,OL);o.scale.setScalar(1.1);b.add(o);
  for(let i=0;i<5;i++){const s=new T.Mesh(new T.SphereGeometry(rand(0.14,0.24),6,6),lam(0x4a0d14,0x2a0006));s.position.set(rand(-0.4,0.4),rand(0.5,1.05),rand(-0.4,0.3));g.add(s);}
  const em=new T.MeshBasicMaterial({color:0xff3b3b});for(const sx of[-0.17,0.17]){const ey=new T.Mesh(new T.SphereGeometry(0.06,6,6),em);ey.position.set(sx,0.78,0.5);g.add(ey);}
  return{g,body:b,mats:[bm]};}
function makeEater(){const g=new T.Group();const bm=lam(0x161214,0x1a0204);const b=new T.Mesh(new T.SphereGeometry(0.5,14,12),bm);g.add(b);const o=new T.Mesh(b.geometry,OL);o.scale.setScalar(1.08);b.add(o);
  const mouth=new T.Mesh(new T.TorusGeometry(0.26,0.08,8,16),new T.MeshBasicMaterial({color:0xa3202c}));mouth.position.z=0.42;g.add(mouth);const inner=new T.Mesh(new T.CircleGeometry(0.24,16),new T.MeshBasicMaterial({color:0x050303}));inner.position.z=0.43;g.add(inner);
  for(let i=0;i<4;i++){const t=new T.Mesh(new T.ConeGeometry(0.12,0.7,5),bm);t.position.set(rand(-0.3,0.3),-0.5,rand(-0.3,0.1));t.rotation.x=PI+rand(-0.4,0.4);g.add(t);}
  return{g,body:b,mats:[bm]};}
/* ---------- 아바타 목록 (게임 코드는 여기서 꺼내 씁니다) ---------- */
const AVATARS={
  yeonwoo:makeYeonwoo, yeonha:makeYeonha, maehyang:makeMaehyang,
  cheongryu:makeCheongryu,
  rusher:makeRusher, eater:makeEater,
};
/* ---------- 연우 아바타 배치 (무기 · 백묵화 오라 · 용뿔 · 발밑 원) ---------- */
const pMesh=AVATARS.yeonwoo();
const brushW=WEAPONS.yeonwooBrush(),swordW=WEAPONS.yeonwooSword();pMesh.userData.hand.add(brushW);pMesh.userData.hand.add(swordW);swordW.visible=false;
scene.add(pMesh);
const aura=new T.Mesh(new T.SphereGeometry(1,16,12),MB(0x7fe8c2,0.0));aura.scale.set(0.9,1.3,0.9);aura.position.y=1.1;pMesh.add(aura);
const horns=new T.Group();for(const s of[-1,1]){const h=new T.Mesh(new T.ConeGeometry(0.04,0.32,5),new T.MeshBasicMaterial({color:0x5fe8b8}));h.position.set(0.11*s,2.22,0.05);h.rotation.z=-0.4*s;horns.add(h);}horns.visible=false;pMesh.add(horns);
const pRing=new T.Mesh(flatGeo(new T.RingGeometry(0.55,0.68,32)),MB(0x3fae8c,0.7));pRing.position.y=0.03;scene.add(pRing);
