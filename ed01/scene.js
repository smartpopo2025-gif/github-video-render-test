import * as THREE from 'three';
import {makeHenryRig} from '../henry10/rig.js';
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(47,1280/720,.1,150);
scene.background=new THREE.Color('#718b99');scene.fog=new THREE.Fog('#718b99',22,95);
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('cv'),antialias:true,preserveDrawingBuffer:true});
renderer.setSize(1280,720,false);renderer.setPixelRatio(1);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.21;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
scene.add(new THREE.HemisphereLight('#d9eaff','#455962',2.1));
const sun=new THREE.DirectionalLight('#ffdfb7',3.15);sun.position.set(-6,10,7);
sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;scene.add(sun);
const rim=new THREE.DirectionalLight('#70d4e8',1.2);rim.position.set(10,8,-9);scene.add(rim);
function m(c,rough=.72){return new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:rough<.5?.23:0});}
function box(g,x,y,z,w,h,d,c,r=.75){
 const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m(c,r));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;
}
function ball(g,x,y,z,w,h,d,c){const o=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),m(c));o.position.set(x,y,z);o.scale.set(w,h,d);g.add(o);return o;}
function pole(g,x,y,z,h,c='#678184'){box(g,x,y,z,.13,h,.13,c);}
function label(g,text,x,y,z,w,h,color='#f4eee0'){
 const c=document.createElement('canvas');c.width=900;c.height=155;const q=c.getContext('2d');
 q.fillStyle='rgba(4,40,53,.93)';q.fillRect(0,0,c.width,c.height);
 q.strokeStyle='#88cbcf';q.lineWidth=7;q.strokeRect(8,8,884,139);
 q.fillStyle=color;q.font='bold 55px Arial';q.textAlign='center';q.textBaseline='middle';q.fillText(text,450,78,850);
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
 const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));
 o.position.set(x,y,z);g.add(o);return o;
}
function L(g,x,y,z,color='#d7f1f1',power=5,dist=14){const o=new THREE.PointLight(color,power,dist);o.position.set(x,y,z);g.add(o);}
const rooms={};
function room(name,w=20,d=19,c='#566e75'){
 const g=new THREE.Group();g.name=name;scene.add(g);g.visible=false;
 box(g,0,-.2,-2,w,.3,d,'#6a7778',.37);box(g,0,3.7,-d*.48,w,7.5,.2,c);
 box(g,-w/2,3,-2,.18,6,d,c);box(g,w/2,3,-2,.18,6,d,c);
 box(g,0,7.25,-2,w,.10,d,'#6c8088');
 rooms[name]=g;return g;
}
function bench(g,x,z){box(g,x,.55,z,2.8,.13,1.55,'#9b6d4f');for(let a of [-1.2,1.2])box(g,x+a,.25,z,.12,.6,1.3,'#4e5456');}
function trolley(g,x,z){box(g,x,.57,z,.85,.08,.62,'#c6d1cb');for(const a of [-.4,.4])for(const b of [-.31,.31])ball(g,x+a,.21,z+b,.09,.09,.09,'#203239');pole(g,x-.46,1,z,.65);pole(g,x+.46,1,z,.65);box(g,x,1.3,z+.23,1,.06,.08,'#c3cece');}
function van(g,x,z,scale=1){const b=new THREE.Group();b.position.set(x,0,z);b.scale.setScalar(scale);g.add(b);
 box(b,0,1.5,0,3.5,2.1,7.0,'#ecb630',.35);box(b,0,2.55,0,3.1,.17,6.5,'#bc9124');
 for(let p=-2;p<=2;p++)for(let s of [-1,1])box(b,s*1.77,1.9,p*1.1,.045,.85,.74,'#1d4352',.2);
 box(b,0,1.7,3.54,3.1,1.08,.05,'#213d47',.19);
 for(let i of [-1.3,1.3])for(let z1 of [-2.4,2.35])ball(b,i,.48,z1,.39,.41,.20,'#1b2d33');
 label(b,'ALAO POINT RELOCATION',0,2.25,3.6,2.9,.34);return b;}
function plant(g,x,z){box(g,x,.33,z,.53,.65,.53,'#986b54');for(let k=0;k<5;k++){let a=k*Math.PI*2/5;ball(g,x+Math.cos(a)*.3,1.13,z+Math.sin(a)*.2,.39,.7,.36,k%2?'#316f52':'#4c9a62');}}
// Lift: harsh emergency glow, parted doors, telephone.
{
 const g=room('lift',8,8,'#586b70');
 for(let k=-3;k<=3;k++)box(g,k*.91,2.65,-3.53,.06,5.1,.12,'#a7acac',.3);
 const left=box(g,-1.2,2,-3.36,2.32,3.9,.1,'#a6b5b3',.23);
 const right=box(g,1.2,2,-3.36,2.32,3.9,.1,'#a6b5b3',.23);
 g.userData.doors=[left,right];
 label(g,'SERVICE LIFT',0,5.4,-3.30,4,.7);
 box(g,2.95,2,-2.25,.1,1.5,.38,'#253c43');
 ball(g,3.02,2.2,-1.99,.10,.10,.08,'#eb514e');
 box(g,1,.07,.45,.28,.04,.46,'#67d6ee',.12);
 L(g,2.5,4,-1.8,'#e84f59',5,7);L(g,-2,4,-.8,'#ccecf1',5,9);
}
// Desolate loading bay.
{
 const g=room('loading',24,22,'#54666f');
 box(g,0,3.2,-9.95,15.2,6.4,.2,'#465c66');
 for(let k=0;k<19;k++)box(g,0,.3+k*.29,-9.81,14.7,.055,.13,k%2?'#718a92':'#90a0a4');
 label(g,'HARBOUR HOUSE • LOADING BAY',0,6.75,-9.68,11.5,.9);
 for(let k=0;k<7;k++)trolley(g,-8.2+k*1.3,-2+Math.sin(k)*.4);
 for(let k=0;k<4;k++){box(g,4+k*.96,.55,-5, .89,1.05,1.15,'#b28d60');box(g,4+k*.96,1.5,-5,.89,.79,1.15,'#d0b08b');}
 for(let k=0;k<4;k++)L(g,-7+k*4,6.5,0,'#d8f1f7',3.5,11);
}
// Wide modern Lagos streets, empty traffic, child's shoe, flood wall in distance.
{
 const g=new THREE.Group();g.name='street';scene.add(g);g.visible=false;rooms.street=g;
 box(g,0,-.18,-14,78,.28,105,'#4d6671',.22);
 for(let k=0;k<17;k++)box(g,0,-.015,10-k*5,.20,.013,1.9,'#e2e4d3');
 for(let s of [-1,1])for(let k=0;k<9;k++){
  const z=7-k*9.5,x=s*(16+k%3),h=7+(k*5)%16;
  box(g,x,h/2-.1,z,9,h,7,k%3===0?'#8fadb1':k%3===1?'#c4c7be':'#9caba9');
  for(let j=-1;j<=1;j++)box(g,x+j*2.35,Math.min(4.0,h-2.0),z+3.56,1.5,1.9,.05,'#265263',.25);
  if(k%2===0)label(g,k%3===0?'ALAO POINT MALL':'LAGOS SHOPPING',x,2.1,z+3.65,5.4,.64);
 }
 box(g,0,3.4,-43,27,6.8,1.2,'#536975');
 for(let k=0;k<14;k++)box(g,-12.5+k*1.92,3.2,-42.25,.23,6.3,.21,'#9da6aa');
 label(g,'BRIDGE SEALED — FLOOD CONTROL',0,5.8,-41.51,22,1.2,'#ffdfa4');
 pole(g,5,2.3,3.8,4.6);box(g,5,4.4,3.8,.60,1.2,.48,'#233a42');
 for(let k=0;k<3;k++)ball(g,5,4.73-k*.38,4.08,.18,.18,.09,['#e05958','#e4b74b','#4bba80'][k]);
 box(g,-6.1,.05,.5,.39,.13,.22,'#f4dcb9');
 for(let k=0;k<5;k++)pole(g,-8,1.5,8-k*9,3.2);
 L(g,-3,8,-6,'#f1eff2',6,24);
}
// Empty supermarket, products, breakfast abandoned.
{
 const g=room('market',27,24,'#a6b6b2');
 for(let x=-8;x<10;x+=3.3)for(let j=0;j<4;j++){
  box(g,x,1.1+j*.75,-7,2.2,.13,7.2,'#93a7ab',.4);
  for(let k=0;k<8;k++)box(g,x+.35,1.43+j*.72,-9.8+k*.84,.39,.57,.44,['#b4cb92','#e2b66b','#6caab4','#d88e7f'][(k+j)%4]);
 }
 bench(g,-5.1,4);
 box(g,-5.8,1,4,.7,.10,.48,'#e8dcc1');
 box(g,-5.1,1.15,3.9,.28,.32,.26,'#fff8df');
 label(g,'ALAO POINT SUPERMARKET',0,6.7,-11.1,12,.93);
 for(let x=-8;x<10;x+=5)L(g,x,6,0,'#ffeecb',3.7,12);
}
// Memory of brother and yellow bus.
{
 const g=new THREE.Group();scene.add(g);g.visible=false;rooms.memory=g;
 box(g,0,-.1,-3,38,.2,40,'#a7aaa1');
 box(g,0,2,-17.2,36,4,.15,'#c3ccc5');
 van(g,2,-8,1.05);
 label(g,'LOWER ROAD • AUTHORIZED VEHICLES ONLY',0,5.7,-17,24,1.2);
 L(g,-5,6,-1,'#fff2c8',8,20);
}
// Transport office with printer.
{
 const g=room('office',21,19,'#69848b');
 bench(g,1,1.8);
 box(g,2.2,1.44,1.8,1.3,.61,1.06,'#cbd4d4',.28);
 box(g,2.2,1.8,1.42,.95,.17,.43,'#283c44');
 const p=box(g,2.2,1.43,2.42,.77,.035,.56,'#fff2d1');g.userData.paper=p;
 box(g,-1.8,1.47,1.7,1.3,.87,.11,'#26383a');
 box(g,-1.8,1.47,1.79,1.13,.68,.04,'#3a92a3',.21);
 label(g,'TRANSIT CONTROL',0,6.2,-9.22,9.5,1.0);
 for(let k=0;k<5;k++)box(g,-8+k*1.3,1.2,-6.8,.87,1.7,.65,'#879499');
 for(let k=0;k<4;k++)L(g,-7+k*4,6.5,-1,'#bfeff1',4.5,11);
}
// Dangerous lower road drainage tunnel, buses below, rippling water.
{
 const g=new THREE.Group();scene.add(g);g.visible=false;rooms.tunnel=g;
 box(g,0,-.12,-21,20,.18,100,'#415764',.15);
 for(let k=0;k<12;k++){
   let z=10-k*8.5;
   box(g,-10,3.5,z,.6,7.3,6.9,'#657983');
   box(g,10,3.5,z,.6,7.3,6.9,'#657983');
   box(g,0,7.1,z,21,.7,6.9,'#556b74');
   L(g,0,6.6,z,'#aedbe2',k%3===0?5:2,13);
 }
 for(let k=0;k<12;k++)box(g,0,.01,5-k*6.7,.21,.012,2.6,'#e4d9b8');
 const vehicle=van(g,0,-27,.88);
 label(g,'LOWER ROAD',0,5.9,-14,11,1.25);
 const water=box(g,0,.02,-20,17,.03,90,'#26708c',.12);water.material.transparent=true;water.material.opacity=.39;g.userData.water=water;
}
// Closed flood barrier, outer Lagos still there beyond.
{
 const g=new THREE.Group();scene.add(g);g.visible=false;rooms.bridge=g;
 box(g,0,-.15,-2,45,.3,48,'#536d7a',.23);
 box(g,0,4,-14,44,8,1.4,'#405a69');
 for(let k=0;k<14;k++)box(g,-20+k*3.05,4,-13.05,.24,7.8,.11,'#9aabb2');
 label(g,'RESTRICTED ZONE — FLOOD GATE',0,6.35,-12.3,25,1.4);
 L(g,0,6,-12,'#edc38a',8,22);
}
// Corridor, institutional cold emptiness.
{
 const g=room('corridor',14,31,'#55707b');
 for(let k=0;k<10;k++){const z=8-k*3.25;
  box(g,-6.9,3.3,z,.1,6.5,.12,'#a8bfc3');
  box(g,6.9,3.3,z,.1,6.5,.12,'#a8bfc3');
  L(g,0,6,z,'#a5ecf1',3,7);
 }
 label(g,'AUTHORIZED STAFF ONLY',0,4,-15.3,8.4,1.0);
}
// 15-bone character engine rig: grey Tessa with maintenance vest and hair.
const tessa=makeHenryRig();tessa.root.name='Tessa';tessa.root.scale.set(.92,.92,.92);
const head=tessa.bones[2],chest=tessa.bones[1];
ball(head,0,.55,0,.47,.20,.40,'#222631');
ball(head,0,.32,-.42,.18,.28,.17,'#202731');
box(chest,0,.09,.22,.65,.63,.19,'#225a68');
box(chest,0,.08,.33,.08,.60,.06,'#d4c18b');
for(let q of [-.17,.17])box(chest,q,-.16,.34,.10,.13,.04,'#8caa9e');
const moses=makeHenryRig();moses.root.scale.set(.78,.78,.78);
box(moses.bones[1],0,.09,.20,.62,.61,.19,'#b48e41');
ball(moses.bones[2],0,.52,0,.42,.15,.40,'#263039');
rooms.memory.add(moses.root);moses.root.position.set(-3,0,-3.4);
const voiceStart=[0,18.97,45.23,48.96,70.66,74.3,81.95,84.88,103.46,115.64,129.5,146.9,164.76,169.1,182.64,187.01,202.07,211.85,227.89,234.47,240.57,242.43,249.51,251.77,253.82,258.99];
const keys=['street','lift','lift','loading','corridor','corridor','corridor','street','bridge','market','memory','office','office','tunnel','office','memory','loading','tunnel','office','office','office','office','office','office','corridor','tunnel'];
const titles=['THE EMPTY DISTRICT','6:00 AM','17 MISSED CALLS','NO ONE HERE','RECORDED MESSAGE','RESTRICTED ZONE','WHO RELOCATED?','THE EMPTY STREETS','FLOOD BARRIER','THE LAST BREAKFAST','MOSES','TRANSPORT SCHEDULE','LOWER ROAD','THE DRAINAGE TUNNEL','PLEASE, MOSES','A YELLOW BUS','THE OVERNIGHT NOTICE','ENGINES BELOW','THE PRINTER','BUS 04 ARRIVED','ANOTHER LINE','NO DEPARTURE','SILENCE','MOSES IS STILL HERE','I AM NOT LEAVING','WHERE ARE THE PASSENGERS?'];
const subs=['Everyone vanished before dawn.','The lift stopped during the power failure.','Her brother sent one last message.','No vehicles. No cleaners. No people.','An automated voice fills the hall.','Emergency relocation complete.','No one told her where they went.','Green lights change for empty roads.','The bridge is closed.','A half-eaten breakfast is still there.','She promised her mother to protect him.','Six buses were assigned to the bridge.','Someone changed the route.','Why send people down during flooding?','She hopes he stayed off the bus.','Moses was photographed beside a bus.','Everyone went below.','The building shakes; engines are running.','The paper begins to move.','Arrival confirmed at the lower road.','One final status check.','The bus never checked out.','The printer stops.','The truth changes everything.','She will find her brother.','If nobody reached the bridge, where are they?'];
const modes=['none','kneel','phone','walk','none','none','worry','walk','none','walk','none','printer','printer','none','worry','none','walk','none','printer','printer','printer','worry','worry','resolve','walk','none'];
const cameraPos={
 lift:[-2.8,2.35,6.2,0,1,-1],loading:[-6.8,3.4,10.2,-1,1.6,-4.3],
 street:[-10.1,4.2,13,0,2,-15],bridge:[-8.6,4.5,12.2,0,3,-13],
 market:[-8.8,4.7,11,-2.8,1.9,-4],memory:[-7.5,3.4,8,-.8,1.5,-5],
 office:[-4.3,3.25,7,0,1.6,-2],tunnel:[-5.9,2.8,12,0,2.5,-17],
 corridor:[-4.6,3,10.2,0,2,-7]};
const ui=id=>document.getElementById(id);
const smooth=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x);};
function acting(t,mode){
 for(const b of tessa.bones)b.rotation.set(0,0,0);
 const walk=mode==='walk'?Math.sin(t*8)*.47:0;
 tessa.bones[3].rotation.x=walk;tessa.bones[6].rotation.x=-walk;
 tessa.bones[9].rotation.x=-walk*.5;tessa.bones[12].rotation.x=walk*.5;
 tessa.bones[1].rotation.z=Math.sin(t*.9)*.022;
 tessa.bones[2].rotation.y=Math.sin(t*.8)*.09;
 if(mode==='phone'){tessa.bones[9].rotation.x=-1.2;tessa.bones[10].rotation.x=-.8;tessa.bones[2].rotation.y=-.2;}
 if(mode==='kneel'){tessa.bones[3].rotation.x=-1.12;tessa.bones[6].rotation.x=-1.12;tessa.bones[4].rotation.x=1.5;tessa.bones[7].rotation.x=1.5;}
 if(mode==='printer'){tessa.bones[9].rotation.x=-1.45;tessa.bones[2].rotation.x=.16;}
 if(mode==='resolve'||mode==='worry'){tessa.bones[12].rotation.x=-.5;tessa.bones[9].rotation.x=-.35;tessa.bones[2].rotation.y=-.25;}
 tessa.mouth.scale.y=(mode==='worry'||mode==='resolve')?.057:.022;
}
function setFrame(t,total=271.55){
 t=Math.max(0,Math.min(t,total));let index=0;
 for(let i=0;i<voiceStart.length;i++)if(t>=voiceStart[i])index=i;
 const start=voiceStart[index],end=voiceStart[index+1]??total;
 const u=smooth((t-start)/Math.max(.3,end-start));
 const key=keys[index],loc=rooms[key];
 for(const n of Object.keys(rooms))rooms[n].visible=(n===key);
 loc.add(tessa.root);
 tessa.root.visible=modes[index]!=='none';
 tessa.root.position.set(key==='office'?-1.8:key==='lift'?-.2:key==='market'?-3.5:-2.5,
  modes[index]==='kneel'?-.3:0,key==='office'?2.6:key==='lift'?-.2:key==='loading'?2.4:1.8);
 if(modes[index]==='walk'){tessa.root.position.x+=u*1.35;tessa.root.position.z-=u*.9;}
 tessa.root.rotation.y=key==='office'?.6:0;
 acting(t,modes[index]);
 const p=cameraPos[key];let cx=p[0]+1.4*u+Math.sin(t*.22)*.22,cy=p[1]-.4*u,cz=p[2]-2.3*u;
 let focus=[p[3]+.5*u,p[4],p[5]+.5*u];
 if(key==='office'&&(index===19||index===21||index===22)){cx=2.8+.18*Math.sin(t*.4);cy=2.6;cz=5.3-.5*u;focus=[1.5,1.4,1.5];}
 if(key==='lift'&&index===2){cx=-2;cy=1.7;cz=5.1;focus=[0,1.4,-1.8];}
 camera.position.set(cx,cy,cz);camera.lookAt(...focus);
 if(key==='office')loc.userData.paper.position.z=2.42+(index>=18?u*.4:0);
 if(key==='lift'){const d=loc.userData.doors;d[0].position.x=-1.2-u*.2;d[1].position.x=1.2+u*.2;}
 if(key==='tunnel')loc.userData.water.material.opacity=.3+.11*Math.sin(t*1.4);
 const dark=key==='lift'||key==='tunnel';scene.background.set(dark?'#2d4554':key==='street'||key==='memory'?'#99b4bc':'#728d93');
 scene.fog.color.copy(scene.background);
 ui('place').textContent=key==='street'?'DESERTED ALAO POINT':key.toUpperCase()+' — LAGOS';
 ui('title').textContent=titles[index];ui('desc').textContent=subs[index];
 ui('prog2').style.width=(t/total*100)+'%';
 const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s)%60).padStart(2,'0');
 ui('timer').textContent=fmt(t)+' / '+fmt(total);
 ui('alert').style.opacity=key==='bridge'||index===5?'1':'0';
 ui('phone').style.opacity=(index===2||index===15)?'1':'0';
 if(index===2){ui('phname').textContent='MOSES • 17 MISSED CALLS';ui('phmsg').textContent='They are sending us downstairs.';ui('phsmall').textContent='MESSAGE RECEIVED BEFORE DAWN';}
 else if(index===15){ui('phname').textContent='MOSES • PHOTO';ui('phmsg').textContent='YELLOW BUS';ui('phsmall').textContent='LOWER ROAD — AUTHORISED VEHICLES ONLY';}
 ui('receipt').style.opacity=key==='office'?'1':'0';
 if(key==='office'){
  const str=index===11?'BRIDGE ROUTE CANCELLED':index===12?'REVISED ROUTE: LOWER ROAD':
    index===19?'BUS 04: ARRIVED':index===21||index===22?'BUS 04: DEPARTURE NOT CONFIRMED':'PRINTING...';
  ui('rline').textContent=str;ui('rline').className='rline'+((index===21||index===22)?' rbad':'');
 }
 ui('trans').style.opacity=(u<.018?(.25*(1-u/.018)).toFixed(3):'0');
 renderer.render(scene,camera);
}
window.setFrame=setFrame;
window.__ED_READY__=true;
window.__ED_INFO__={engine:'Three.js',webgl2:renderer.capabilities.isWebGL2,characterBones:tessa.bones.length,locations:Object.keys(rooms),beats:keys.length,resolution:[1280,720],duration:271.55};
setFrame(0);
