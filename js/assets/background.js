/* MFT 블루잉크 : 천년청묵 · js/assets/background.js · v0.8
   배경 — 하늘·안개 색 · 조명 · 전투 지면 · 산 · 대나무 · 청매나무 · 떠다니는 먹 입자
   배경을 바꾸려면 이 파일만 수정하면 됩니다. (전투 구역 크기는 data/config.js의 arena) */
'use strict';
/* ---------- 하늘 · 안개 · 조명 ---------- */
const PAPER=0xe9e3d5;
scene.background=new T.Color(PAPER);
scene.fog=new T.Fog(PAPER,22,54);
scene.add(new T.HemisphereLight(0xfffaf0,0x77706a,0.9));
const sun=new T.DirectionalLight(0xffffff,0.6);sun.position.set(5,12,6);scene.add(sun);

/* ---------- 전투 지면 텍스처 ---------- */
const groundTex=ctex(1024,1024,(g,w,h)=>{
  g.fillStyle='#e4ddcc';g.fillRect(0,0,w,h);
  for(let i=0;i<90;i++)blot(g,rand(0,w),rand(0,h),rand(25,170),'28,26,24',rand(0.03,0.09));
  for(let i=0;i<26;i++){const a=rand(0,TAU),rr=rand(0,w*0.42);blot(g,w/2+Math.cos(a)*rr,h/2+Math.sin(a)*rr,rand(35,120),'84,16,22',rand(0.15,0.32));}
  g.lineCap='round';
  for(let i=0;i<18;i++){g.strokeStyle=`rgba(25,24,22,${rand(0.05,0.14)})`;g.lineWidth=rand(4,16);g.beginPath();const a=rand(0,TAU),rr=rand(80,430);const x=w/2+Math.cos(a)*rr,y=h/2+Math.sin(a)*rr;g.moveTo(x,y);g.quadraticCurveTo(x+rand(-120,120),y+rand(-120,120),x+rand(-200,200),y+rand(-200,200));g.stroke();}
  g.strokeStyle='rgba(22,22,22,0.6)';g.lineWidth=16;g.beginPath();g.arc(w/2,h/2,w/2-26,0,TAU);g.stroke();
  g.strokeStyle='rgba(22,22,22,0.3)';g.lineWidth=4;g.beginPath();g.arc(w/2,h/2,w/2-56,0,TAU);g.stroke();
});

/* ---------- 지형 · 소품 ---------- */
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
/* ---------- 매 프레임 배경 움직임 ---------- */
function updateBackground(dt){
  for(let i=0;i<90;i++){motePos[i*3+1]+=dt*0.25;if(motePos[i*3+1]>7)motePos[i*3+1]=0.3;}moteGeo.attributes.position.needsUpdate=true;
}
