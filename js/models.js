/* MFT 블루잉크 : 천년청묵 · js/models.js · v0.6
   캐릭터·무기 3D 모델 (색상은 data/characters.js) */
'use strict';
/* ================= 캐릭터 모델 ================= */
const OL=new T.MeshBasicMaterial({color:0x121110,side:T.BackSide});
function lam(c,e=0){return new T.MeshLambertMaterial({color:c,emissive:e});}
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
function makeBrush(){const g=new T.Group();const sh=new T.Mesh(new T.CylinderGeometry(0.035,0.045,1.05,6),lam(0x6b4a2e));sh.position.y=-0.45;g.add(sh);const band=new T.Mesh(new T.CylinderGeometry(0.055,0.055,0.08,8),lam(0x3fae8c,0x1d5a48));band.position.y=-0.95;g.add(band);const tip=new T.Mesh(new T.ConeGeometry(0.08,0.34,8),lam(0x151515));tip.rotation.x=PI;tip.position.y=-1.15;g.add(tip);const jt=new T.Mesh(new T.SphereGeometry(0.05,6,6),new T.MeshBasicMaterial({color:0x6fe0b8}));jt.position.y=-1.3;g.add(jt);return g;}
function makeSword(len=1.25,col=0xe2f6ec,em=0x2a6650){const g=new T.Group();const bl=new T.Mesh(new T.BoxGeometry(0.075,len,0.025),lam(col,em));bl.position.y=-0.12-len/2;g.add(bl);const o=new T.Mesh(bl.geometry,OL);o.scale.set(1.5,1.03,1.6);bl.add(o);const gd=new T.Mesh(new T.BoxGeometry(0.28,0.05,0.09),lam(0x2a2a2a));gd.position.y=-0.1;g.add(gd);const hl=new T.Mesh(new T.CylinderGeometry(0.035,0.035,0.2,6),lam(0x1d3d33));hl.position.y=0.02;g.add(hl);return g;}

const pMesh=makeHuman(CHARACTERS.yeonwoo);
const brushW=makeBrush(),swordW=makeSword(CHARACTERS.yeonwoo.swordLength,CHARACTERS.yeonwoo.swordColor,CHARACTERS.yeonwoo.swordGlow);pMesh.userData.hand.add(brushW);pMesh.userData.hand.add(swordW);swordW.visible=false;
scene.add(pMesh);
const aura=new T.Mesh(new T.SphereGeometry(1,16,12),MB(0x7fe8c2,0.0));aura.scale.set(0.9,1.3,0.9);aura.position.y=1.1;pMesh.add(aura);
const horns=new T.Group();for(const s of[-1,1]){const h=new T.Mesh(new T.ConeGeometry(0.04,0.32,5),new T.MeshBasicMaterial({color:0x5fe8b8}));h.position.set(0.11*s,2.22,0.05);h.rotation.z=-0.4*s;horns.add(h);}horns.visible=false;pMesh.add(horns);
const pRing=new T.Mesh(flatGeo(new T.RingGeometry(0.55,0.68,32)),MB(0x3fae8c,0.7));pRing.position.y=0.03;scene.add(pRing);

function makeBossMesh(){
  const C=CHARACTERS.cheongryu;const g=makeHuman(C);g.scale.setScalar(C.scale);
  const u=g.userData;u.hand.add(makeSword(C.swordLength,C.swordColor,C.swordGlow));
  const crown=new T.Mesh(new T.CylinderGeometry(0.12,0.16,0.18,8),lam(0x1b3e52));crown.position.set(0,2.25,-0.02);g.add(crown);
  const stance=new T.Mesh(new T.SphereGeometry(1.2,18,14),MB(0x6cc7ff,0.0));stance.position.y=1.15;g.add(stance);u.stanceM=stance;
  const bubble=new T.Mesh(new T.SphereGeometry(1.5,20,16),MB(0xa8e6ff,0.0));bubble.position.y=1.15;g.add(bubble);u.bubble=bubble;
  const pts=[];for(let i=0;i<40;i++){const t=i/39;pts.push(new T.Vector3(Math.cos(t*TAU*1.6)*(1.3+t*0.4),0.3+t*2.6,Math.sin(t*TAU*1.6)*(1.3+t*0.4)));}
  const dragon=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),80,0.12,6,false),MB(C.dragonColor,0.45));dragon.visible=false;g.add(dragon);u.dragon=dragon;
  const head=new T.Mesh(new T.ConeGeometry(0.22,0.6,6),MB(0x8fd3ff,0.6));head.position.copy(pts[39]);head.rotation.z=-PI/2;dragon.add(head);
  const stars=new T.Group();for(let i=0;i<3;i++){const s=new T.Mesh(new T.OctahedronGeometry(0.09,0),new T.MeshBasicMaterial({color:0xf2d36b}));s.position.set(Math.cos(i*TAU/3)*0.4,2.5,Math.sin(i*TAU/3)*0.4);stars.add(s);}stars.visible=false;g.add(stars);u.stars=stars;
  return g;
}
