/* MFT 블루잉크 : 천년청묵 · js/assets/effects.js · v0.8
   이펙트 — 입자 · 참격 궤적 · 충격파 · 잔상 · 정화 데칼(꽃밭)
   새 이펙트는 아래 함수처럼 addFx(오브젝트, 수명, 매 프레임 갱신 함수)로 추가합니다. */
'use strict';
/* ---------- 이펙트 텍스처 ---------- */
const dotTex=ctex(64,64,g=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.5,'rgba(255,255,255,0.6)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);});
const jadeTex=ctex(256,256,g=>{blot(g,128,128,128,'70,190,150',0.55);blot(g,128,128,70,'150,230,195',0.35);
  for(let i=0;i<7;i++){const a=rand(0,TAU),r=rand(20,95);g.fillStyle=`rgba(244,190,205,${rand(0.35,0.6)})`;g.beginPath();g.ellipse(128+Math.cos(a)*r,128+Math.sin(a)*r,rand(5,10),rand(3,6),a,0,TAU);g.fill();}});
const puddleTex=ctex(256,256,g=>{blot(g,128,128,128,'40,6,10',0.85);blot(g,110,140,60,'90,14,22',0.5);});

/* ---------- 이펙트 시스템 ---------- */
const fx=[];
function addFx(obj,life,upd,dg){scene.add(obj);fx.push({obj,life,t:0,upd,dg});return obj;}
function updateFx(dt){for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.t+=dt;const p=Math.min(1,f.t/f.life);if(f.upd)f.upd(f,p,dt);if(f.t>=f.life){scene.remove(f.obj);disposeObj(f.obj,f.dg);fx.splice(i,1);}}}
function clearFx(){for(const f of fx){scene.remove(f.obj);disposeObj(f.obj,f.dg);}fx.length=0;}
function arcTrail(x,z,ang,r,half,color,y=0.9,w=0.7,life=0.3){const m=new T.Mesh(sectorGeo(r,half,Math.max(0.05,r-w)),MB(color,0.9));m.position.set(x,y,z);m.rotation.y=ang;addFx(m,life,(f,p)=>{f.obj.material.opacity=0.9*(1-p);f.obj.scale.setScalar(1+0.12*p);},true);}
function ringFx(x,z,r0,r1,color,life=0.45,y=0.08,op=0.8){const m=new T.Mesh(flatGeo(new T.RingGeometry(0.85,1,48)),MB(color,op));m.position.set(x,y,z);m.scale.setScalar(r0);addFx(m,life,(f,p)=>{f.obj.scale.setScalar(r0+(r1-r0)*easeOut(p));f.obj.material.opacity=op*(1-p);},true);}
function lineFx(x,z,a,len,w,color,life=0.3,y=0.9){const geo=new T.PlaneGeometry(w,len);geo.translate(0,-len/2,0);flatGeo(geo);const m=new T.Mesh(geo,MB(color,0.85));m.position.set(x,y,z);m.rotation.y=a;addFx(m,life,(f,p)=>{f.obj.material.opacity=0.85*(1-p);f.obj.scale.x=1-p*0.8;},true);}
function burst(x,y,z,color,n=10,spd=5,size=0.35,life=0.5){if(fx.length>360)n=Math.min(n,3);for(let i=0;i<n;i++){const s=new T.Sprite(new T.SpriteMaterial({map:dotTex,color,transparent:true,depthWrite:false}));s.position.set(x,y,z);const sz=size*rand(0.6,1.3);s.scale.set(sz,sz,1);const a=rand(0,TAU),sp=spd*rand(0.35,1);const v={x:Math.cos(a)*sp,y:rand(0.2,1)*spd*0.8,z:Math.sin(a)*sp};
  addFx(s,life*rand(0.7,1.3),(f,p,dt)=>{const o=f.obj.position;o.x+=v.x*dt;o.y+=v.y*dt;o.z+=v.z*dt;v.y-=10*dt;if(o.y<0.05){o.y=0.05;v.y=0;v.x*=0.8;v.z*=0.8;}f.obj.material.opacity=1-p;});}}
function waterBurst(x,z){burst(x,1,z,0x6cc7ff,14,6,0.4,0.5);burst(x,1,z,0xffffff,6,4,0.3,0.4);ringFx(x,z,0.4,2.4,0x5ab8f0,0.4);}
const afterGeo=new T.CylinderGeometry(0.28,0.55,1.8,8);
let afterT=0;
function afterimage(){if(afterT>0)return;afterT=0.035;const m=new T.Mesh(afterGeo,MB(P.stage>=4?0xffffff:0x141414,0.35));m.position.set(P.x,0.9,P.z);addFx(m,0.25,(f,p)=>{f.obj.material.opacity=0.35*(1-p);});}

const decalGeo=new T.PlaneGeometry(1,1);const decals=[];let decalY=0.015;
function purify(x,z,r){if(decals.length>=70){const d=decals.shift();scene.remove(d.m);d.m.material.dispose();}const m=new T.Mesh(decalGeo,new T.MeshBasicMaterial({map:jadeTex,transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-PI/2;m.rotation.z=rand(0,TAU);decalY+=0.0004;if(decalY>0.05)decalY=0.015;m.position.set(x,decalY,z);m.scale.setScalar(0.1);scene.add(m);decals.push({m,t:0,r});stats.purified++;}
function updateDecals(dt){for(const d of decals){if(d.t<1){d.t=Math.min(1,d.t+dt*1.6);const e=easeOut(d.t);d.m.scale.setScalar(d.r*2*e);d.m.material.opacity=0.85*e;}}}
