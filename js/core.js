/* MFT 블루잉크 : 천년청묵 · js/core.js · v0.4
   기본 도구 · 렌더러 · 텍스처 · 배경 · 이펙트 */
'use strict';
const $=id=>document.getElementById(id);
if(!window.THREE){$('loadErr').hidden=false;throw new Error('THREE not loaded');}
const T=THREE,PI=Math.PI,TAU=PI*2;
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const dist2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const easeOut=k=>1-(1-k)*(1-k);
function angDiff(a,b){let d=a-b;while(d>PI)d-=TAU;while(d<-PI)d+=TAU;return d;}
function lerpAng(a,b,t){return a+angDiff(b,a)*t;}
const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches;
document.body.classList.toggle('touch',isTouch);

/* ================= 렌더러 ================= */
const renderer=new T.WebGLRenderer({antialias:!isTouch});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isTouch?1.5:2));
renderer.setSize(innerWidth,innerHeight);
$('game').appendChild(renderer.domElement);
const scene=new T.Scene();
const PAPER=0xe9e3d5;
scene.background=new T.Color(PAPER);
scene.fog=new T.Fog(PAPER,22,54);
const camera=new T.PerspectiveCamera(50,innerWidth/innerHeight,0.1,140);
scene.add(new T.HemisphereLight(0xfffaf0,0x77706a,0.9));
const sun=new T.DirectionalLight(0xffffff,0.6);sun.position.set(5,12,6);scene.add(sun);
function onResize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.fov=camera.aspect<1?64:50;camera.updateProjectionMatrix();}
addEventListener('resize',onResize);onResize();

/* ================= 텍스처 ================= */
function ctex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return new T.CanvasTexture(c);}
function blot(g,x,y,r,col,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(${col},${a})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
const ARENA=CONFIG.arena;
const groundTex=ctex(1024,1024,(g,w,h)=>{
  g.fillStyle='#e4ddcc';g.fillRect(0,0,w,h);
  for(let i=0;i<90;i++)blot(g,rand(0,w),rand(0,h),rand(25,170),'28,26,24',rand(0.03,0.09));
  for(let i=0;i<26;i++){const a=rand(0,TAU),rr=rand(0,w*0.42);blot(g,w/2+Math.cos(a)*rr,h/2+Math.sin(a)*rr,rand(35,120),'84,16,22',rand(0.15,0.32));}
  g.lineCap='round';
  for(let i=0;i<18;i++){g.strokeStyle=`rgba(25,24,22,${rand(0.05,0.14)})`;g.lineWidth=rand(4,16);g.beginPath();const a=rand(0,TAU),rr=rand(80,430);const x=w/2+Math.cos(a)*rr,y=h/2+Math.sin(a)*rr;g.moveTo(x,y);g.quadraticCurveTo(x+rand(-120,120),y+rand(-120,120),x+rand(-200,200),y+rand(-200,200));g.stroke();}
  g.strokeStyle='rgba(22,22,22,0.6)';g.lineWidth=16;g.beginPath();g.arc(w/2,h/2,w/2-26,0,TAU);g.stroke();
  g.strokeStyle='rgba(22,22,22,0.3)';g.lineWidth=4;g.beginPath();g.arc(w/2,h/2,w/2-56,0,TAU);g.stroke();
});
const dotTex=ctex(64,64,g=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.5,'rgba(255,255,255,0.6)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);});
const jadeTex=ctex(256,256,g=>{blot(g,128,128,128,'70,190,150',0.55);blot(g,128,128,70,'150,230,195',0.35);
  for(let i=0;i<7;i++){const a=rand(0,TAU),r=rand(20,95);g.fillStyle=`rgba(244,190,205,${rand(0.35,0.6)})`;g.beginPath();g.ellipse(128+Math.cos(a)*r,128+Math.sin(a)*r,rand(5,10),rand(3,6),a,0,TAU);g.fill();}});
const puddleTex=ctex(256,256,g=>{blot(g,128,128,128,'40,6,10',0.85);blot(g,110,140,60,'90,14,22',0.5);});

/* ================= 환경 ================= */
const outer=new T.Mesh(new T.CircleGeometry(80,48),new T.MeshLambertMaterial({color:0xd9d1bf}));outer.rotation.x=-PI/2;outer.position.y=-0.02;scene.add(outer);
const ground=new T.Mesh(new T.CircleGeometry(ARENA+1,72),new T.MeshLambertMaterial({map:groundTex}));ground.rotation.x=-PI/2;scene.add(ground);
for(let i=0;i<16;i++){const a=i/16*TAU+rand(-0.15,0.15),r=rand(30,44),h=rand(9,22);const c=new T.Color().setHSL(0.1,0.05,rand(0.28,0.45));const m=new T.Mesh(new T.ConeGeometry(rand(5,10),h,6),new T.MeshBasicMaterial({color:c}));m.position.set(Math.cos(a)*r,h/2-0.5,Math.sin(a)*r);m.rotation.y=rand(0,TAU);scene.add(m);}
const bambooMat=new T.MeshLambertMaterial({color:0x2c3a30}),leafMat=new T.MeshLambertMaterial({color:0x1f2a24});
const bGeo=new T.CylinderGeometry(0.07,0.09,1,6);
for(let i=0;i<54;i++){const a=rand(0,TAU),r=rand(17.2,24),h=rand(4,9);const m=new T.Mesh(bGeo,bambooMat);m.scale.y=h;m.position.set(Math.cos(a)*r,h/2,Math.sin(a)*r);m.rotation.z=rand(-0.12,0.12);m.rotation.x=rand(-0.12,0.12);scene.add(m);
  if(Math.random()<0.6){const l=new T.Mesh(new T.ConeGeometry(0.5,1.4,5),leafMat);l.position.set(m.position.x,h*rand(0.7,0.95),m.position.z);l.rotation.z=rand(-1,1);scene.add(l);}}
const plumMat=new T.MeshLambertMaterial({color:0xcfe4ee}),trunkMat=new T.MeshLambertMaterial({color:0x2a2622});
for(let i=0;i<7;i++){const a=rand(0,TAU),r=rand(18,22);const g=new T.Group();const t=new T.Mesh(new T.CylinderGeometry(0.15,0.3,3,6),trunkMat);t.position.y=1.5;t.rotation.z=rand(-0.3,0.3);g.add(t);for(let k=0;k<5;k++){const s=new T.Mesh(new T.IcosahedronGeometry(rand(0.6,1.1),0),plumMat);s.position.set(rand(-1,1),rand(2.8,3.8),rand(-1,1));g.add(s);}g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);scene.add(g);}
const moteGeo=new T.BufferGeometry();const motePos=new Float32Array(90*3);for(let i=0;i<90;i++){motePos[i*3]=rand(-20,20);motePos[i*3+1]=rand(0.3,7);motePos[i*3+2]=rand(-20,20);}moteGeo.setAttribute('position',new T.BufferAttribute(motePos,3));
scene.add(new T.Points(moteGeo,new T.PointsMaterial({size:0.22,map:dotTex,color:0x2b2b2b,transparent:true,opacity:0.4,depthWrite:false})));

/* ================= 이펙트 ================= */
const MB=(color,op=1)=>new T.MeshBasicMaterial({color,transparent:op<1,opacity:op,depthWrite:!(op<1),side:T.DoubleSide});
function flatGeo(geo){geo.rotateX(-PI/2);return geo;}
function sectorGeo(r,half,inner=0){return flatGeo(inner>0?new T.RingGeometry(inner,r,32,1,-PI/2-half,half*2):new T.CircleGeometry(r,32,-PI/2-half,half*2));}
const fx=[];
function addFx(obj,life,upd,dg){scene.add(obj);fx.push({obj,life,t:0,upd,dg});return obj;}
function disposeObj(o,dg){o.traverse(c=>{if(c.material&&c.material.dispose)c.material.dispose();if(dg&&c.geometry)c.geometry.dispose();});}
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
