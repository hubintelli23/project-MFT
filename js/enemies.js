/* MFT 블루잉크 : 천년청묵 · js/enemies.js · v0.6
   적 공통 · 잡몹 AI · 공격 판정 · 투사체 */
'use strict';
/* ================= 적 공통 ================= */
const FOG_R=ENEMIES.eater.fogRadius;
function baseEnemy(type,x,z,hp,r){const e={type,x,z,y:0,hp,maxHp:hp,r,stacks:0,stackT:0,root:0,stun:0,kx:0,kz:0,pull:null,lift:0,dead:false,removed:false,flash:0,ang:0,t:0};enemies.push(e);return e;}
function setMats(e,mats){e.mats=mats;e.baseE=mats.map(m=>m.emissive.getHex());}
function barSprite(e,w){const c=document.createElement('canvas');c.width=128;c.height=40;const tex=new T.CanvasTexture(c);const s=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,depthTest:false}));s.scale.set(w,w*40/128,1);s.renderOrder=10;e.bar={s,c,tex};e.barDirty=true;scene.add(s);}
function drawBar(e){const{c,tex}=e.bar,g=c.getContext('2d');g.clearRect(0,0,128,40);g.fillStyle='rgba(20,18,16,0.75)';g.fillRect(4,26,120,10);g.fillStyle='#b8323c';g.fillRect(6,28,116*Math.max(0,e.hp/e.maxHp),6);
  for(let i=0;i<5;i++){const x=24+i*20,y=12;g.beginPath();g.arc(x,y,7,0,TAU);g.fillStyle=i<e.stacks?'#141414':'rgba(20,18,16,0.18)';g.fill();if(i<e.stacks){g.strokeStyle='#5fd6a8';g.lineWidth=2.5;g.stroke();}}tex.needsUpdate=true;e.barDirty=false;}
function rootRing(e,r){const m=new T.Mesh(flatGeo(new T.RingGeometry(r*0.9,r*1.25,24)),MB(0x141414,0.75));m.visible=false;scene.add(m);e.rootM=m;}
function spawnFx(x,z,col=0x141414){burst(x,0.6,z,col,16,6,0.5,0.6);ringFx(x,z,0.4,2.6,col,0.5);}
function spawnRusher(x,z){const e=baseEnemy('rusher',x,z,ENEMIES.rusher.hp,0.55);const g=new T.Group();const bm=new T.MeshPhongMaterial({color:0x1d1416,emissive:0x2a0508,flatShading:true,shininess:8});const b=new T.Mesh(new T.IcosahedronGeometry(0.58,0),bm);b.position.y=0.6;g.add(b);const o=new T.Mesh(b.geometry,OL);o.scale.setScalar(1.1);b.add(o);
  for(let i=0;i<5;i++){const s=new T.Mesh(new T.SphereGeometry(rand(0.14,0.24),6,6),lam(0x4a0d14,0x2a0006));s.position.set(rand(-0.4,0.4),rand(0.5,1.05),rand(-0.4,0.3));g.add(s);}
  const em=new T.MeshBasicMaterial({color:0xff3b3b});for(const sx of[-0.17,0.17]){const ey=new T.Mesh(new T.SphereGeometry(0.06,6,6),em);ey.position.set(sx,0.78,0.5);g.add(ey);}
  e.mesh=g;setMats(e,[bm]);e.body=b;scene.add(g);barSprite(e,1.2);e.barY=1.7;e.fuse=0;rootRing(e,0.7);spawnFx(x,z);return e;}
function spawnEater(x,z){const e=baseEnemy('eater',x,z,ENEMIES.eater.hp,0.6);const g=new T.Group();const bm=lam(0x161214,0x1a0204);const b=new T.Mesh(new T.SphereGeometry(0.5,14,12),bm);g.add(b);const o=new T.Mesh(b.geometry,OL);o.scale.setScalar(1.08);b.add(o);
  const mouth=new T.Mesh(new T.TorusGeometry(0.26,0.08,8,16),new T.MeshBasicMaterial({color:0xa3202c}));mouth.position.z=0.42;g.add(mouth);const inner=new T.Mesh(new T.CircleGeometry(0.24,16),new T.MeshBasicMaterial({color:0x050303}));inner.position.z=0.43;g.add(inner);
  for(let i=0;i<4;i++){const t=new T.Mesh(new T.ConeGeometry(0.12,0.7,5),bm);t.position.set(rand(-0.3,0.3),-0.5,rand(-0.3,0.1));t.rotation.x=PI+rand(-0.4,0.4);g.add(t);}
  const fog=new T.Mesh(new T.SphereGeometry(FOG_R,20,14),MB(0x2a0c12,0.1));scene.add(fog);e.fog=fog;
  e.mesh=g;setMats(e,[bm]);e.body=b;scene.add(g);barSprite(e,1.2);e.barY=1.0;e.shootT=rand(1.5,2.5);e.y=1.8;rootRing(e,0.7);spawnFx(x,z);return e;}
function spawnBoss(){const e=baseEnemy('boss',0,-11,BOSS.hp,0.95);e.mesh=makeBossMesh();setMats(e,[e.mesh.userData.robe]);scene.add(e.mesh);e.ang=0;e.cd=1.5;e.action=null;e.shield=0;e.stance=0;e.p2=false;e.runeActive=false;e.runeDone=false;e.broken=0;e.lastAct='';e.dash=null;e.walk=0;e.swingT=0;e.invulnT=0;e.pulling=0;
  boss=e;$('bhud').hidden=false;spawnFx(0,-11,0x2b6b8a);waterBurst(0,-11);return e;}
function alive(){return enemies.filter(e=>!e.dead);}
function inFog(e){for(const f of enemies)if(f.type==='eater'&&!f.dead&&Math.hypot(e.x-f.x,e.z-f.z)<FOG_R)return true;return false;}
function autoTarget(range){let best=null,bd=range;for(const e of enemies){if(e.dead)continue;const d=dist2(P,e)-e.r;if(d<bd){bd=d;best=e;}}return best;}
function inArcPt(ex,ez,er,x,z,ang,range,half){const dx=ex-x,dz=ez-z,d=Math.hypot(dx,dz);if(d>range+er)return false;if(half>=PI-0.01||d<er+0.4)return true;return Math.abs(angDiff(Math.atan2(dx,dz),ang))<=half+Math.atan2(er,Math.max(d,0.1));}
function targetsInArc(x,z,ang,range,half){return enemies.filter(e=>!e.dead&&inArcPt(e.x,e.z,e.r,x,z,ang,range,half));}
function clampArena(o,r){const d=Math.hypot(o.x,o.z),m=ARENA-0.4-r*0.5;if(d>m){o.x*=m/d;o.z*=m/d;}}

/* ================= 적 업데이트 ================= */
function updateEnemy(e,dt){
  if(e.dead){if(e.type==='boss')return;e.dying-=dt;e.mesh.scale.setScalar(Math.max(0.01,e.dying/0.4));if(e.dying<=0){scene.remove(e.mesh);e.removed=true;}return;}
  e.t+=dt;e.root-=dt;e.flash-=dt;if(e.slow>0)e.slow-=dt;if(e.vuln>0){e.vuln-=dt;if(e.vulnM){e.vulnM.visible=e.vuln>0;e.vulnM.position.set(e.x,(e.y||0)+(e.type==='boss'?3.4:2.2),e.z);}}
  if(e.stacks>0){e.stackT-=dt;if(e.stackT<=0){e.stacks=0;e.barDirty=true;}}
  if(e.type!=='boss'){e.stun-=dt;e.x+=e.kx*dt;e.z+=e.kz*dt;const k=Math.exp(-7*dt);e.kx*=k;e.kz*=k;
    if(e.pull){e.pull.t-=dt;const dx=e.pull.x-e.x,dz=e.pull.z-e.z,d=Math.hypot(dx,dz);if(d>0.3){const v=Math.min(d,d/Math.max(e.pull.t,0.05)*dt);e.x+=dx/d*v;e.z+=dz/d*v;}if(e.pull.t<=0)e.pull=null;}}
  if(e.type==='rusher')aiRusher(e,dt);else if(e.type==='eater')aiEater(e,dt);else aiBoss(e,dt);
  if(e.dead)return;
  clampArena(e,e.r);
  let ly=0;if(e.lift>0){e.lift-=dt;ly=Math.sin(clamp(1-e.lift/0.6,0,1)*PI)*1.2;}
  const by=e.type==='eater'?e.y+Math.sin(e.t*2)*0.15:0;
  e.mesh.position.set(e.x,by+ly,e.z);e.mesh.rotation.y=e.ang;
  e.mats.forEach((m,i)=>m.emissive.setHex(e.flash>0?0x777777:e.baseE[i]));
  if(e.rootM){e.rootM.visible=e.root>0;e.rootM.position.set(e.x,0.05,e.z);}
  if(e.fog)e.fog.position.set(e.x,1.2,e.z);
  if(e.bar){e.bar.s.position.set(e.x,by+ly+e.barY+(e.type==='eater'?0.6:0),e.z);if(e.barDirty)drawBar(e);}
  if(e.type==='boss')animBoss(e,dt);}
function aiRusher(e,dt){const tg=clones.length?clones[0]:P;const dx=tg.x-e.x,dz=tg.z-e.z,d=Math.hypot(dx,dz)||1;
  if(e.fuse>0){e.fuse-=dt;e.body.scale.setScalar(1+(ENEMIES.rusher.fuseTime-e.fuse)*0.9);e.flash=(Math.floor(e.fuse*14)%2)?0.05:0;if(e.fuse<=0)rusherExplode(e);return;}
  e.ang=lerpAng(e.ang,Math.atan2(dx,dz),1-Math.exp(-10*dt));
  if(e.root>0||e.stun>0||e.lift>0)return;
  if(d<1.35){e.fuse=ENEMIES.rusher.fuseTime;return;}
  const sp=ENEMIES.rusher.speed*(e.stacks>=3?0.85:1)*slowMul(e);e.x+=dx/d*sp*dt;e.z+=dz/d*sp*dt;e.body.rotation.x+=dt*8;}
function rusherExplode(e){const o={kind:'circle',x:e.x,z:e.z,r:ENEMIES.rusher.explodeRadius};if(P.y<1.0&&inShape(o,P.x,P.z))hurtPlayer(ENEMIES.rusher.explodeDamage);for(const c of clones)if(Math.hypot(c.x-e.x,c.z-e.z)<2.5)c.t=0;
  burst(e.x,0.8,e.z,0x3a0a10,18,7,0.55);burst(e.x,0.8,e.z,0x141414,12,6,0.5);ringFx(e.x,e.z,0.5,2.3,0x8a1520,0.4);shake(0.25);killE(e,true);}
function aiEater(e,dt){const dx=P.x-e.x,dz=P.z-e.z,d=Math.hypot(dx,dz)||1;e.ang=lerpAng(e.ang,Math.atan2(dx,dz),1-Math.exp(-6*dt));
  if(e.root<=0&&e.stun<=0){let mv=0;if(d<5.5)mv=-1;else if(d>8.5)mv=1;const sp=ENEMIES.eater.speed*(e.stacks>=3?0.85:1)*slowMul(e);e.x+=dx/d*mv*sp*dt;e.z+=dz/d*mv*sp*dt;const s=Math.sin(e.t*0.7)*1.2*dt;e.x+=-dz/d*s;e.z+=dx/d*s;}
  e.shootT-=dt;if(e.shootT<=0&&d<14&&e.stun<=0){e.shootT=rand(ENEMIES.eater.shootInterval[0],ENEMIES.eater.shootInterval[1]);shootOrb(e);}}
function shootOrb(e){const m=new T.Mesh(new T.SphereGeometry(0.28,10,8),new T.MeshBasicMaterial({color:0x3a0a10}));const gl=new T.Sprite(new T.SpriteMaterial({map:dotTex,color:0xc0303a,transparent:true,depthWrite:false}));gl.scale.set(1.1,1.1,1);m.add(gl);
  const a=Math.atan2(P.x-e.x,P.z-e.z),sp=ENEMIES.eater.orbSpeed,ft=Math.max(0.3,dist2(P,e)/sp);m.position.set(e.x,e.y,e.z);scene.add(m);
  projs.push({m,x:e.x,z:e.z,y:e.y,vx:Math.sin(a)*sp,vz:Math.cos(a)*sp,vy:(1.0-e.y)/ft,t:0,life:3,dmg:ENEMIES.eater.orbDamage,r:0.4});}

/* ================= 공격 판정(적) ================= */
function strike(o){const col=o.color||0xb3242f;let geo;
  if(o.kind==='cone')geo=sectorGeo(o.r,o.half);else if(o.kind==='circle')geo=flatGeo(new T.CircleGeometry(o.r,40));else{geo=new T.PlaneGeometry(o.w,o.len);geo.translate(0,-o.len/2,0);flatGeo(geo);}
  const g=new T.Group();g.add(new T.Mesh(geo,MB(col,0.2)));const inner=new T.Mesh(geo,MB(col,0.38));inner.scale.setScalar(0.01);g.add(inner);
  g.position.set(o.x,0.04+(strikes.length%10)*0.003,o.z);g.rotation.y=o.ang||0;scene.add(g);o.g=g;o.geo=geo;o.t=0;strikes.push(o);return o;}
function inShape(o,px,pz,pr=0.35){const dx=px-o.x,dz=pz-o.z,d=Math.hypot(dx,dz);if(o.kind==='circle')return d<=o.r+pr;
  if(o.kind==='cone'){if(d>o.r+pr)return false;if(d<0.9)return true;return Math.abs(angDiff(Math.atan2(dx,dz),o.ang))<=o.half+pr/Math.max(d,0.5);}
  const s=Math.sin(o.ang),c=Math.cos(o.ang),al=dx*s+dz*c,sd=dx*c-dz*s;return al>=-pr&&al<=o.len+pr&&Math.abs(sd)<=o.w/2+pr;}
function removeStrike(i){const o=strikes[i];scene.remove(o.g);o.g.children.forEach(m=>m.material.dispose());o.geo.dispose();strikes.splice(i,1);}
function cancelStrikes(owner){for(let i=strikes.length-1;i>=0;i--)if(strikes[i].owner===owner)removeStrike(i);}
function updateStrikes(dt){for(let i=strikes.length-1;i>=0;i--){if(i>=strikes.length)continue;const o=strikes[i];o.t+=dt;o.g.children[1].scale.setScalar(Math.max(0.01,Math.min(1,o.t/o.tell)));
  if(o.t>=o.tell){removeStrike(i);if(o.owner&&o.owner.type==='boss')o.owner.swingT=0.25;if(o.onFire)o.onFire(o);if(P.y<1.0&&inShape(o,P.x,P.z))hurtPlayer(o.dmg,o.opt||{});}}}

/* ================= 투사체/웅덩이/분신/영역 ================= */
function removeProj(i){const p=projs[i];scene.remove(p.m);disposeObj(p.m,true);projs.splice(i,1);}
function slowMul(e){return e.slow>0?(e.type==='boss'?0.7:0.5):1;}
function updateProj(dt){for(let i=projs.length-1;i>=0;i--){const p=projs[i];p.t+=dt;
  if(p.straight){p.x+=p.vx*dt;p.z+=p.vz*dt;p.m.position.set(p.x,p.y,p.z);let hit=null;for(const e of enemies){if(!e.dead&&Math.hypot(e.x-p.x,e.z-p.z)<e.r+0.25){hit=e;break;}}
    if(hit){const r=pdmg(p.def.dmg,p.def.critAdd||0);if(dealE(hit,r.v,r.crit,'ranged')&&!hit.dead)applyDef(hit,p.def);burst(p.x,p.y,p.z,p.def.proj.color,5,4,0.3,0.35);hitstop=Math.max(hitstop,0.02);removeProj(i);continue;}
    for(const rn of runes)if(!rn.linked&&Math.hypot(rn.x-p.x,rn.z-p.z)<rn.r+0.3){runeHint(rn);p.t=p.life;}
    if(p.t>=p.life||Math.hypot(p.x,p.z)>ARENA+1)removeProj(i);continue;}
  if(p.player){const t=p.tgt;if(!t||t.dead){removeProj(i);continue;}const ty=(t.y||0)+1,dx=t.x-p.x,dz=t.z-p.z,dy=ty-p.y,d=Math.hypot(dx,dy,dz);
    if(d<0.7){const r=pdmg(6);if(dealE(t,r.v,r.crit,'ranged')&&!t.dead&&t.stacks)bloom(t,t.stacks,1);burst(p.x,p.y,p.z,0xe8fff4,10,6,0.35);removeProj(i);continue;}
    const s=Math.min(1,p.speed*dt/d);p.x+=dx*s;p.z+=dz*s;p.y+=dy*s;p.m.position.set(p.x,p.y,p.z);p.m.lookAt(t.x,ty,t.z);continue;}
  p.x+=p.vx*dt;p.z+=p.vz*dt;p.y=Math.max(0.6,p.y+p.vy*dt);p.m.position.set(p.x,p.y,p.z);
  if(!P.dead&&Math.hypot(P.x-p.x,P.z-p.z)<p.r+0.4){hurtPlayer(p.dmg);burst(p.x,p.y,p.z,0x3a0a10,8,4,0.35);removeProj(i);continue;}
  if(p.t>p.life||Math.hypot(p.x,p.z)>ARENA+2)removeProj(i);}}
function addPuddle(x,z){const m=new T.Mesh(decalGeo,new T.MeshBasicMaterial({map:puddleTex,transparent:true,depthWrite:false,opacity:0.9}));m.rotation.x=-PI/2;m.position.set(x,0.06,z);m.scale.setScalar(3.4);scene.add(m);puddles.push({x,z,r:1.6,t:7,m});}
function updatePuddles(dt){for(let i=puddles.length-1;i>=0;i--){const p=puddles[i];p.t-=dt;if(p.t<1)p.m.material.opacity=0.9*Math.max(0,p.t);if(p.t<=0){scene.remove(p.m);p.m.material.dispose();puddles.splice(i,1);}}}
function updateClones(dt){for(let i=clones.length-1;i>=0;i--){const c=clones[i];c.t-=dt;c.mt.opacity=0.35+0.2*Math.sin(state.time*30);
  if(c.t<=0){for(const e of enemies)if(!e.dead&&Math.hypot(e.x-c.x,e.z-c.z)<3.6+e.r){const r=pdmg(6);if(dealE(e,r.v,r.crit,'clone'))mark(e,1);}
    ringFx(c.x,c.z,0.5,3.6,0x1a1a1a,0.4);burst(c.x,1,c.z,0x141414,14,6);purify(c.x,c.z,1.6);scene.remove(c.g);disposeObj(c.g,true);clones.splice(i,1);}}}
function updateZones(dt){for(let i=zones.length-1;i>=0;i--){const z=zones[i];z.t-=dt;z.m.material.opacity=0.15*Math.min(1,z.t/1.5);if(z.t<=0){scene.remove(z.m);disposeObj(z.m,true);zones.splice(i,1);}}}
function separate(){const al=alive();
  if(P.iframe<=0&&!P.dead)for(const e of al){const dx=P.x-e.x,dz=P.z-e.z,d=Math.hypot(dx,dz),min=e.r+0.4;if(d<min&&d>0.001){const push=min-d,nx=dx/d,nz=dz/d;if(e.type==='boss'){P.x+=nx*push;P.z+=nz*push;}else{P.x+=nx*push*0.5;P.z+=nz*push*0.5;e.x-=nx*push*0.5;e.z-=nz*push*0.5;}}}
  for(let i=0;i<al.length;i++)for(let j=i+1;j<al.length;j++){const a=al[i],b=al[j],dx=a.x-b.x,dz=a.z-b.z,d=Math.hypot(dx,dz),min=a.r+b.r;if(d<min&&d>0.001){const push=(min-d)/2,nx=dx/d,nz=dz/d;const wa=a.type==='boss'?0:1,wb=b.type==='boss'?0:1;a.x+=nx*push*wa*(wb?1:2);a.z+=nz*push*wa*(wb?1:2);b.x-=nx*push*wb*(wa?1:2);b.z-=nz*push*wb*(wa?1:2);}}}
