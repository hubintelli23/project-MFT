/* MFT 블루잉크 : 천년청묵 · js/assets/avatars.js · v1.1
   아바타(캐릭터 모델) — 연우 · 연하 · 매향 · 청류 · 백진 · 천제혁 · 탁기 궤웅 · 묵식귀 · 기사 환영 · 아크 룬
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
/* ---------- 보스 공통 장식 (기절 별 · 강체 금빛) ---------- */
function bossExtras(g){const u=g.userData;if(!u.stars){const stars=new T.Group();for(let i=0;i<3;i++){const s=new T.Mesh(new T.OctahedronGeometry(0.09,0),new T.MeshBasicMaterial({color:0xf2d36b}));s.position.set(Math.cos(i*TAU/3)*0.4,2.5,Math.sin(i*TAU/3)*0.4);stars.add(s);}stars.visible=false;g.add(stars);u.stars=stars;}
  const am=new T.Mesh(new T.SphereGeometry(1.35,18,14),MB(0xf2d36b,0.0));am.position.y=1.15;g.add(am);u.armorM=am;return g;}
function makeBaekjin(){const C=CHARACTERS.baekjin;const g=makeHuman(C);g.scale.setScalar(C.scale);const u=g.userData;u.hand.add(WEAPONS.baekjinSword());
  const sh=WEAPONS.baekjinShield();sh.position.set(-0.5,1.2,0.42);g.add(sh);u.shield=sh;
  const helm=new T.Mesh(new T.CylinderGeometry(0.22,0.26,0.26,8),lam(0xe8edf2,0x30343a));helm.position.set(0,2.12,0);g.add(helm);const pl=new T.Mesh(new T.ConeGeometry(0.06,0.4,4),lam(C.emblem));pl.position.set(0,2.42,0);g.add(pl);
  for(const s of[-1,1]){const pa=new T.Mesh(new T.SphereGeometry(0.17,8,6),lam(0xdfe5ea,0x30343a));pa.position.set(0.36*s,1.72,0);pa.scale.y=0.7;g.add(pa);}
  const dome=new T.Mesh(new T.SphereGeometry(1.7,20,16),MB(0xf2d36b,0.0));dome.position.y=1.2;g.add(dome);u.barrierM=dome;
  return bossExtras(g);}
function makeCheonjehyeok(){const C=CHARACTERS.cheonjehyeok;const g=makeHuman(C);g.scale.setScalar(C.scale);const u=g.userData;u.hand.add(WEAPONS.cheonjehyeokBlade());
  for(const s of[-1,1]){const h=new T.Mesh(new T.ConeGeometry(0.05,0.36,5),lam(0x1a0a0a,0x3a0508));h.position.set(0.12*s,2.24,0.02);h.rotation.z=-0.5*s;g.add(h);}
  const cape=new T.Mesh(new T.ConeGeometry(0.75,1.6,8,1,true),lam(0x3a0a0e));cape.position.set(0,1.0,-0.2);g.add(cape);
  const aura=new T.Mesh(new T.SphereGeometry(1.4,16,12),MB(0x5a0a10,0.12));aura.position.y=1.2;g.add(aura);u.flameAura=aura;
  return bossExtras(g);}
function makePhantom(){const C=CHARACTERS.phantom;const g=new T.Group();const mt=new T.MeshLambertMaterial({color:C.color,emissive:0x2a3240,transparent:true,opacity:0.72});
  const body=new T.Mesh(new T.CylinderGeometry(0.28,0.5,1.5,8),mt);body.position.y=0.85;g.add(body);const head=new T.Mesh(new T.SphereGeometry(0.22,10,8),mt);head.position.y=1.8;g.add(head);
  const sw=WEAPONS.phantomSword();sw.position.set(0.4,1.4,0.2);sw.rotation.x=-1.2;g.add(sw);return{g,body,mats:[mt]};}
function makeArcRune(){const g=new T.Group();const mt=lam(0xe8edf2,0x6a5010);const ped=new T.Mesh(new T.CylinderGeometry(0.55,0.75,0.5,8),lam(0x8a9098));ped.position.y=0.25;g.add(ped);
  const body=new T.Mesh(new T.OctahedronGeometry(0.62,0),mt);body.position.y=1.7;body.scale.y=1.5;g.add(body);const o=new T.Mesh(body.geometry,OL);o.scale.setScalar(1.12);body.add(o);
  const ring=new T.Mesh(flatGeo(new T.RingGeometry(0.95,1.1,32)),MB(0xf2d36b,0.7));ring.position.y=0.05;g.add(ring);return{g,body,mats:[mt]};}
/* ---------- v1.0 보스 : 자영 · 이겸 · 사현 · 월령 · 태초삼원 ---------- */
function ghostify(g,op){g.traverse(c=>{if(!c.material)return;if(c.material===OL){c.visible=false;return;}c.material.transparent=true;c.material.opacity=op;c.material.depthWrite=false;});return g;}
function makeZayeong(){const C=CHARACTERS.zayeong;const g=makeHuman(C);g.scale.setScalar(C.scale);const u=g.userData;u.hand.add(WEAPONS.zayeongBlade());
  for(const s of[-1,1]){const rib=new T.Mesh(new T.TorusGeometry(0.55,0.025,6,24,PI*1.3),lam(C.acc,0x3a1a4a));rib.position.set(0,1.35+s*0.12,-0.05);rib.rotation.set(PI/2+s*0.3,0,s);g.add(rib);}
  const crown=new T.Mesh(new T.ConeGeometry(0.12,0.28,5),lam(C.flame,0x4a1a6a));crown.position.set(0,2.3,0);g.add(crown);
  const aura=new T.Mesh(new T.SphereGeometry(1.35,16,12),MB(C.flame,0.1));aura.position.y=1.2;g.add(aura);u.flameAura=aura;return bossExtras(g);}
function makeIllusion(o){const C=CHARACTERS.zayeong;const g=makeHuman(C);g.scale.setScalar(C.scale*0.95);g.userData.hand.add(WEAPONS.zayeongBlade());ghostify(g,0.55);return{g,body:g,mats:[g.userData.robe]};}
function makeShadowYeonwoo(o){const g=makeHuman({robe:0x2a1a3a,acc:0x7a4aa8,accE:0x2a0a3a,hair:0x0a0a0a,eye:0xc060f0});g.userData.hand.add(WEAPONS.yeonwooSword());ghostify(g,0.7);return{g,body:g,mats:[g.userData.robe]};}
function makeIgyeom(){const C=CHARACTERS.igyeom;const g=makeHuman(C);g.scale.setScalar(C.scale);const u=g.userData;u.hand.add(WEAPONS.igyeomBlade());
  const helm=new T.Mesh(new T.CylinderGeometry(0.2,0.26,0.3,6),lam(0x6a7078,0x20242a));helm.position.set(0,2.12,0);g.add(helm);
  const hz=new T.Mesh(new T.ConeGeometry(0.07,0.26,4),lam(C.acc,0x4a4010));hz.position.set(0,2.38,0);g.add(hz);
  for(let i=0;i<6;i++){const l=new T.Mesh(new T.TorusGeometry(0.08,0.022,5,10),lam(C.chain,0x303030));l.position.set(-0.42,1.2-i*0.14,0.12);l.rotation.y=i%2?PI/2:0;g.add(l);}
  for(const s of[-1,1]){const pa=new T.Mesh(new T.BoxGeometry(0.3,0.14,0.32),lam(0x6a7078,0x20242a));pa.position.set(0.36*s,1.76,0);g.add(pa);}
  const halo=new T.Mesh(flatGeo(new T.RingGeometry(1.0,1.15,32)),MB(C.acc,0));halo.position.y=0.1;g.add(halo);u.ruleM=halo;return bossExtras(g);}
function makeSahyeon(){const C=CHARACTERS.sahyeon;const g=makeHuman(C);g.scale.setScalar(C.scale);const u=g.userData;u.hand.add(WEAPONS.sahyeonDagger());
  const d2=WEAPONS.sahyeonDagger();d2.position.set(-0.42,1.15,0.12);d2.rotation.x=-0.6;g.add(d2);
  const scarf=new T.Mesh(new T.TorusGeometry(0.26,0.07,6,16),lam(C.acc,0x3a0a10));scarf.position.set(0,1.78,0);scarf.rotation.x=PI/2;g.add(scarf);
  const tail=new T.Mesh(new T.ConeGeometry(0.08,0.9,6),lam(C.acc,0x3a0a10));tail.position.set(0.1,1.4,-0.32);tail.rotation.x=-0.5;g.add(tail);
  const veil=new T.Mesh(new T.SphereGeometry(1.2,14,10),MB(0x141010,0));veil.position.y=1.1;g.add(veil);u.veil=veil;return bossExtras(g);}
function makeShadowClone(o){const C=CHARACTERS.sahyeon;const g=makeHuman(C);g.scale.setScalar(C.scale*0.95);g.userData.hand.add(WEAPONS.sahyeonDagger());ghostify(g,0.5);return{g,body:g,mats:[g.userData.robe]};}
function makeWollyeong(){const C=CHARACTERS.wollyeong;const g=makeHuman(C);g.scale.setScalar(C.scale);const u=g.userData;u.hand.add(WEAPONS.wollyeongSword());
  const mir=new T.Group();const disc=new T.Mesh(new T.CircleGeometry(0.55,32),new T.MeshLambertMaterial({color:C.mirror,emissive:0x2a3a5a,side:T.DoubleSide}));mir.add(disc);
  const rim=new T.Mesh(new T.TorusGeometry(0.57,0.04,6,32),lam(0xe8eef8,0x30405a));mir.add(rim);mir.position.set(0,1.75,-0.42);g.add(mir);u.mirror=mir;u.mirrorMat=disc.material;
  const moon=new T.Mesh(new T.TorusGeometry(0.2,0.04,6,16,PI*1.2),new T.MeshBasicMaterial({color:0xf4f8ff}));moon.position.set(0,2.45,0);moon.rotation.z=0.6;g.add(moon);return bossExtras(g);}
/* ---------- v1.1 짐승형 보스 (화염의 존재 · 구야 · 백야) — kind: dragon · lion · leopard · spirit · strange · cheetah · boar · wolf · crow ---------- */
function makeBeast(C){const g=new T.Group();g.rotation.order='YXZ';const u={};const body=new T.Group();g.add(body);u.body=body;
  const bm=lam(C.color,C.emissive||0x1a1a1a);u.robe=bm;const fm=new T.MeshBasicMaterial({color:C.flame});const dark=lam(C.dark||0x141414);
  const M=(geo,mat,x,y,z,ol=true)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);body.add(m);if(ol){const o=new T.Mesh(geo,OL);o.scale.setScalar(1.07);m.add(o);}return m;};
  const k=C.kind,S=C.size||1;
  if(k==='spirit'){const gown=M(new T.ConeGeometry(0.7,2.2,10,1,true),bm,0,1.5,0);gown.material.side=T.DoubleSide;M(new T.SphereGeometry(0.32,12,10),lam(0xf4fff4,0x2a6a3a),0,2.85,0);
    for(const s of[-1,1]){const w=new T.Mesh(new T.ConeGeometry(0.35,1.6,4),new T.MeshBasicMaterial({color:C.flame,transparent:true,opacity:0.5}));w.position.set(0.6*s,2.1,-0.1);w.rotation.z=-1.1*s;body.add(w);}u.baseY=0.4;}
  else if(k==='crow'){M(new T.SphereGeometry(0.85,14,12),bm,0,1.9,0).scale.set(1,0.95,1.35);M(new T.SphereGeometry(0.45,12,10),bm,0,2.75,0.85);M(new T.ConeGeometry(0.16,0.6,6),lam(0xe8b030,0x3a2a00),0,2.7,1.45).rotation.x=PI/2;
    for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(0.07,6,6),fm);e.position.set(0.22*s,2.85,1.15);body.add(e);}
    for(const x of[-0.3,0,0.3]){M(new T.CylinderGeometry(0.06,0.05,1.2,5),lam(0xe8b030,0x3a2a00),x,0.7,0.1);}
    u.wings=[];for(const s of[-1,1]){const w=new T.Group();w.position.set(0.7*s,2.1,0);w.userData.s=s;const f=new T.Mesh(new T.BoxGeometry(2.2,0.08,0.9),bm);f.position.x=1.1*s;w.add(f);body.add(w);u.wings.push(w);}
    M(new T.ConeGeometry(0.4,1.2,5),bm,0,1.8,-1.2).rotation.x=-PI/2-0.3;}
  else{const L=(k==='dragon'?3.2:k==='boar'?2.0:k==='lion'?2.2:2.3)*S,R=(k==='boar'?0.75:k==='cheetah'||k==='leopard'||k==='wolf'?0.45:k==='dragon'?0.7:0.6)*S,H=(k==='dragon'?1.5:1.25)*S;
    const tor=M(new T.CylinderGeometry(R,R*1.05,L,12),bm,0,H,0);tor.rotation.x=PI/2;
    for(const[x,z]of[[-1,1],[1,1],[-1,-1],[1,-1]]){M(new T.CylinderGeometry(0.13*S,0.1*S,H,6),bm,x*R*0.7,H/2,z*L*0.33);}
    const neck=M(new T.CylinderGeometry(R*0.5,R*0.7,0.9*S,8),bm,0,H+0.45*S,L*0.48);neck.rotation.x=0.7;
    const head=M(new T.SphereGeometry(R*0.85,12,10),bm,0,H+0.8*S,L*0.5+0.5*S);
    const snout=M(new T.ConeGeometry(R*0.45,(k==='wolf'||k==='dragon'?1.0:0.6)*S,8),bm,0,H+0.72*S,L*0.5+1.05*S);snout.rotation.x=PI/2;
    for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(0.07*S,6,6),fm);e.position.set(0.22*S*s,H+0.95*S,L*0.5+0.95*S);body.add(e);}
    const tail=M(new T.ConeGeometry(R*0.35,(k==='dragon'?2.4:1.2)*S,6),bm,0,H+0.1,-L*0.5-0.5*S);tail.rotation.x=-PI/2-0.4;
    if(k==='lion'){const mane=M(new T.SphereGeometry(R*1.25,14,12),new T.MeshLambertMaterial({color:C.flame,emissive:C.flame,emissiveIntensity:0.5}),0,H+0.7*S,L*0.45+0.3*S,false);mane.scale.z=0.7;}
    if(k==='boar'){for(const s of[-1,1]){const t=M(new T.ConeGeometry(0.07*S,0.6*S,5),lam(0xf4efe4),0.22*S*s,H+0.55*S,L*0.5+1.15*S,false);t.rotation.x=-0.6;}const ridge=M(new T.BoxGeometry(0.2*S,0.35*S,L*0.8),fm,0,H+R,0,false);}
    if(k==='wolf'||k==='cheetah'||k==='leopard'){for(const s of[-1,1]){const ear=M(new T.ConeGeometry(0.12*S,0.35*S,4),bm,0.25*S*s,H+1.35*S,L*0.5+0.4*S,false);}}
    if(k==='leopard'||k==='cheetah'){for(let i=0;i<14;i++){const sp=new T.Mesh(new T.SphereGeometry(0.07*S,5,4),dark);const a=rand(0,TAU),zz=rand(-L*0.4,L*0.4);sp.position.set(Math.cos(a)*R,H+Math.sin(a)*R,zz);body.add(sp);}}
    if(k==='strange'){for(let i=0;i<5;i++){const e=new T.Mesh(new T.SphereGeometry(0.1*S,6,6),fm);e.position.set(rand(-0.4,0.4)*S,H+rand(0.6,1.2)*S,L*0.5+rand(0.3,0.8)*S);body.add(e);}
      for(let i=0;i<4;i++){const t=M(new T.ConeGeometry(0.1*S,1.4*S,5),bm,rand(-0.4,0.4)*S,H+0.6*S,rand(-0.6,0.6)*S,false);t.rotation.set(rand(-1,1),0,rand(-1.2,1.2));}}
    if(k==='dragon'){for(const s of[-1,1]){const h=M(new T.ConeGeometry(0.08*S,0.7*S,5),lam(C.horn||0xe8e0c8),0.22*S*s,H+1.35*S,L*0.5+0.25*S,false);h.rotation.x=-0.6;}
      u.wings=[];for(const s of[-1,1]){const w=new T.Group();w.position.set(R*s,H+0.4*S,0.2*S);w.userData.s=s;const f=new T.Mesh(new T.ConeGeometry(1.1*S,2.8*S,3),new T.MeshLambertMaterial({color:C.wing||C.color,emissive:C.emissive||0,side:T.DoubleSide}));f.rotation.z=-PI/2*s;f.position.x=1.4*S*s;f.scale.z=0.15;w.add(f);body.add(w);u.wings.push(w);}
      for(let i=0;i<5;i++){const sp=M(new T.ConeGeometry(0.1*S,0.4*S,4),lam(C.spine||C.flame),0,H+R+0.1,L*0.35-i*L*0.17,false);}}}
  const aura=new T.Mesh(new T.SphereGeometry((C.kind==='dragon'?2.4:1.6)*S,16,12),MB(C.flame,0.12));aura.position.y=1.4*S;g.add(aura);u.aura=aura;
  g.userData=u;bossExtras(g);u.stars.position.y=(S-1)*1.5+0.6;u.armorM.scale.setScalar(S*(C.kind==='dragon'?1.6:1.2));return g;}
function makeHaya(){const C=CHARACTERS.haya;const g=makeHuman(C);g.scale.setScalar(C.scale);const u=g.userData;u.hand.add(WEAPONS.hayaBlade());
  for(const s of[-1,1]){const ear=new T.Mesh(new T.CapsuleGeometry?new T.CylinderGeometry(0.06,0.09,0.75,8):new T.CylinderGeometry(0.06,0.09,0.75,8),lam(0xf4f8ff,0x30405a));ear.position.set(0.12*s,2.45,-0.02);ear.rotation.z=-0.2*s;g.add(ear);}
  const aura=new T.Mesh(new T.SphereGeometry(1.3,16,12),MB(C.flame,0.12));aura.position.y=1.2;g.add(aura);u.flameAura=aura;return bossExtras(g);}
function makeSimwon(id){const C=CHARACTERS[id];const g=makeHuman(C);g.scale.setScalar(C.scale||1.3);const u=g.userData;u.hand.add(makeSword(C.swordLength||1.3,C.swordColor||0xf4f4f4,C.swordGlow||0x3a3a3a));
  const orb=new T.Mesh(new T.OctahedronGeometry(0.16,0),new T.MeshBasicMaterial({color:C.shard||0xe8fff4}));orb.position.set(0,1.45,0.3);g.add(orb);u.shard=orb;   // 드래곤 하트 파편
  const aura=new T.Mesh(new T.SphereGeometry(1.3,16,12),MB(C.aura||C.acc,0.08));aura.position.y=1.2;g.add(aura);u.flameAura=aura;return bossExtras(g);}
/* 룬(공용) — o.col 색 */
function makeRuneStone(o){const g=new T.Group();const col=o&&o.col||0xf2d36b;const mt=lam(col,0x2a2a2a);const ped=new T.Mesh(new T.CylinderGeometry(0.55,0.75,0.5,8),lam(0x6a6a70));ped.position.y=0.25;g.add(ped);
  const body=new T.Mesh(new T.OctahedronGeometry(0.6,0),mt);body.position.y=1.7;body.scale.y=1.4;g.add(body);const ol=new T.Mesh(body.geometry,OL);ol.scale.setScalar(1.12);body.add(ol);
  const ring=new T.Mesh(flatGeo(new T.RingGeometry(0.95,1.1,32)),MB(col,0.7));ring.position.y=0.05;g.add(ring);return{g,body,mats:[mt]};}
function makeMirrorRune(o){const g=new T.Group();const col=o&&o.col||0xd8c8ff;const mt=new T.MeshLambertMaterial({color:col,emissive:0x2a2a40,side:T.DoubleSide});
  const ped=new T.Mesh(new T.CylinderGeometry(0.45,0.6,0.4,8),lam(0x6a6a70));ped.position.y=0.2;g.add(ped);
  const body=new T.Group();body.position.y=1.6;g.add(body);const disc=new T.Mesh(new T.CircleGeometry(0.8,32),mt);body.add(disc);const rim=new T.Mesh(new T.TorusGeometry(0.82,0.06,6,32),lam(0xe8e0c0,0x3a3010));body.add(rim);
  const ring=new T.Mesh(flatGeo(new T.RingGeometry(0.95,1.1,32)),MB(col,0.6));ring.position.y=0.05;g.add(ring);return{g,body,mats:[mt]};}
function makeSpiritWisp(o){const g=new T.Group();const mt=new T.MeshLambertMaterial({color:0xfff6d8,emissive:0x6a5a20,transparent:true,opacity:0.85});const b=new T.Mesh(new T.SphereGeometry(0.35,12,10),mt);b.position.y=1.0;g.add(b);
  const gl=new T.Sprite(new T.SpriteMaterial({map:dotTex,color:0xffe9a0,transparent:true,depthWrite:false}));gl.scale.set(1.4,1.4,1);b.add(gl);return{g,body:b,mats:[mt]};}
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
  cheongryu:()=>bossExtras(makeCheongryu()), baekjin:makeBaekjin, cheonjehyeok:makeCheonjehyeok,
  zayeong:makeZayeong, igyeom:makeIgyeom, sahyeon:makeSahyeon, wollyeong:makeWollyeong,
  baekrin:()=>makeBeast(CHARACTERS.baekrin), cheonghwi:()=>makeBeast(CHARACTERS.cheonghwi), jeokseom:()=>makeBeast(CHARACTERS.jeokseom), noknyeong:()=>makeBeast(CHARACTERS.noknyeong),
  jayo:()=>makeBeast(CHARACTERS.jayo), hwangroe:()=>makeBeast(CHARACTERS.hwangroe), hongak:()=>makeBeast(CHARACTERS.hongak), heukrang:()=>makeBeast(CHARACTERS.heukrang),
  wolfling:o=>{const g=makeBeast(Object.assign({},CHARACTERS.heukrang,{size:0.6}));g.remove(g.userData.armorM);return{g,body:g.userData.body,mats:[g.userData.robe]};},
  yunjae:()=>makeSimwon('yunjae'), seolryeong:()=>makeSimwon('seolryeong'), muha:()=>makeSimwon('muha'), yeonhwi:()=>makeSimwon('yeonhwi'), doyun:()=>makeSimwon('doyun'),
  guya:()=>makeBeast(CHARACTERS.guya), haya:makeHaya, baekya:()=>makeBeast(CHARACTERS.baekya),
  crowling:o=>{const g=makeBeast(Object.assign({},CHARACTERS.guya,{}));g.scale.setScalar(0.45);g.remove(g.userData.armorM);return{g,body:g.userData.body,mats:[g.userData.robe]};},
  phantom:makePhantom, arcrune:makeArcRune, runestone:makeRuneStone, mirrorrune:makeMirrorRune,
  illusion:makeIllusion, shadowYeonwoo:makeShadowYeonwoo, shadowclone:makeShadowClone, wisp:makeSpiritWisp,
  rusher:makeRusher, eater:makeEater,
};
/* ---------- 연우 아바타 배치 (무기 · 백묵화 오라 · 용뿔 · 발밑 원) ---------- */
const pMesh=AVATARS.yeonwoo();
const brushW=WEAPONS.yeonwooBrush(),swordW=WEAPONS.yeonwooSword();pMesh.userData.hand.add(brushW);pMesh.userData.hand.add(swordW);swordW.visible=false;
scene.add(pMesh);
const aura=new T.Mesh(new T.SphereGeometry(1,16,12),MB(0x7fe8c2,0.0));aura.scale.set(0.9,1.3,0.9);aura.position.y=1.1;pMesh.add(aura);
const horns=new T.Group();for(const s of[-1,1]){const h=new T.Mesh(new T.ConeGeometry(0.04,0.32,5),new T.MeshBasicMaterial({color:0x5fe8b8}));h.position.set(0.11*s,2.22,0.05);h.rotation.z=-0.4*s;horns.add(h);}horns.visible=false;pMesh.add(horns);
const pRing=new T.Mesh(flatGeo(new T.RingGeometry(0.55,0.68,32)),MB(0x3fae8c,0.7));pRing.position.y=0.03;scene.add(pRing);
