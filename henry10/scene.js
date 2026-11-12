import * as THREE from 'three';
import {makeHenryRig} from './rig.js';

const width=1280, height=720;
const scene=new THREE.Scene();
scene.background=new THREE.Color('#dceef0');
scene.fog=new THREE.FogExp2('#dceef0',0.012);
const canvas=document.getElementById('stage');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setSize(width,height,false);
renderer.setPixelRatio(1);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.26;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const camera=new THREE.PerspectiveCamera(46,width/height,.1,100);
function mat(color,roughness=.75,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
const white=mat('#f5eee0'),dark=mat('#173c45'),teal=mat('#1e8795'),wood=mat('#966640'),gold=mat('#d6a45d',.3,.4);
function cube(x,y,z,w,h,d,color,rough=.65,metal=0,shadow=true){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,rough,metal));
 m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;scene.add(m);return m;
}
function sphere(x,y,z,sx,sy,sz,color){
 const m=new THREE.Mesh(new THREE.SphereGeometry(1,18,12),mat(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;scene.add(m);return m;
}
// Ground and clean modern Lagos interior.
cube(0,-.15,-.2,20,.3,17,'#e5dacf',.35,false,false);
cube(0,3,-6.25,20,6,.22,'#f4efe8');
cube(-7.6,3,0,.25,6,18,'#f0e9dc');
cube(7.6,3,0,.25,6,18,'#e2ece9');
cube(0,5.98,-.2,20,.10,17,'#f8f7f0');
cube(0,.025,-4.88,17,.06,.12,'#c7ab87');
// Architectural feature wall.
cube(4.45,2.65,-6.05,5.9,4.8,.16,'#1b4c56');
for(let i=0;i<15;i++)cube(1.85+i*.36,2.55,-5.91,.055,4.5,.07,i%2?'#c3a56e':'#37606a');
cube(4.4,4.85,-5.85,5.4,.05,.2,'#e0b76f');
// Giant window with warm sunlight and green outdoors.
cube(-3.0,3.4,-6.04,6.4,4.65,.12,'#e5f7fa',.16);
cube(-3.0,3.4,-6.0,6.0,4.25,.10,'#88c7d6',.18);
cube(-3.0,2.35,-5.9,5.7,.04,.1,'#d5f0ee');
cube(-3.0,4.4,-5.89,5.7,.045,.10,'#d8f2ee');
cube(-3.0,3.35,-5.89,.055,4.25,.10,'#f7fbfa');
for(let i=0;i<5;i++){
 const x=-5.8+i*1.15;
 const tree=sphere(x,1.5,-5.78,.45,.75,.12,i%2?'#4f986e':'#277654');
 tree.material.transparent=true;tree.material.opacity=.55;
}
for(const x of [-6.3,.2])cube(x,3.3,-5.72,.28,4.55,.24,'#e5cfa3',.86);
// Comfortable sofa at camera-right, textured shapes.
cube(3.35,.48,-3.2,4.25,.8,1.64,'#efddc7');
cube(3.35,1.03,-3.82,4.25,1.38,.62,'#c7b0a0');
for(const x of [1.95,3.36,4.76]){
 cube(x,.95,-2.92,1.25,.32,1.28,x===3.36?'#c3afaa':'#ded0bf');
 cube(x,1.42,-3.45,1.23,.79,.20,'#e7d7c3');
}
for(const x of [1.12,5.55])cube(x,.95,-3.2,.47,.95,1.8,'#bca99b');
sphere(2.25,1.36,-3.36,.40,.34,.13,'#da8e62');
sphere(4.3,1.39,-3.4,.39,.32,.14,'#297e78');
// Coffee table with a phone.
cube(1.42,.53,.27,2.05,.14,1.04,'#b77b4b',.30);
for(const x of [.55,2.26])for(const z of [-.09,.63])cube(x,.23,z,.075,.43,.07,'#3e3b39');
const phone=new THREE.Group();
const phoneBase=new THREE.Mesh(new THREE.BoxGeometry(.19,.025,.36),mat('#122633',.17,.3));phone.add(phoneBase);
const phoneScreen=new THREE.Mesh(new THREE.BoxGeometry(.16,.004,.31),
 new THREE.MeshStandardMaterial({color:'#47d6ef',emissive:'#2b9cb5',emissiveIntensity:1.1}));
phoneScreen.position.y=.017;phone.add(phoneScreen);phone.position.set(1.42,.63,.2);scene.add(phone);
const phoneGlow=new THREE.PointLight('#56dffa',0,3.5);phoneGlow.position.set(1.42,1.1,.2);scene.add(phoneGlow);
// Decorative floor rug, sideboard and lamps.
cube(.7,.02,.6,5.8,.025,3.8,'#c7d9d1',1);
cube(5.7,.62,-5.37,2.1,1.2,.45,'#b6946a');
for(let k=0;k<5;k++)cube(4.78+k*.45,1.33,-5.37,.33,.13,.27,k%2?'#aacdc2':'#e6c69c');
const lampStand=new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,2,12),mat('#d7b178',.25,.55));
lampStand.position.set(-5.75,1.02,-2.4);scene.add(lampStand);
const lampShade=new THREE.Mesh(new THREE.ConeGeometry(.62,.83,24),mat('#f5e2ae',.86));
lampShade.position.set(-5.75,2.20,-2.4);scene.add(lampShade);
const smallPlant=sphere(-6.8,1.17,-4.7,.50,.77,.50,'#3f936e');
const pot=new THREE.Mesh(new THREE.CylinderGeometry(.30,.24,.60,18),mat('#c67a55'));
pot.position.set(-6.8,.32,-4.7);scene.add(pot);
// Henry: same original proportions/eyes/mouth and 15-bone procedural rig.
const henry=makeHenryRig();scene.add(henry.root);
const [hips,spine,head,lt,ls,lf,rt,rs,rf,la,lfa,lh,ra,rfa,rh]=henry.bones;
const light=new THREE.HemisphereLight('#edfaff','#a7b5ad',2.35);scene.add(light);
const sun=new THREE.DirectionalLight('#fff5d8',3.6);
sun.position.set(-3.8,7,4.2);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-9,right:9,top:7,bottom:-7,near:.1,far:25});
sun.shadow.bias=-.00015;scene.add(sun);
const fill=new THREE.PointLight('#95e7e6',18,12);fill.position.set(4,4,1.5);scene.add(fill);
const headline=document.getElementById('headline'),subtitle=document.getElementById('subtitle'),clock=document.getElementById('clock'),glow=document.getElementById('phone-alert');
const lerp=(a,b,t)=>a+(b-a)*t,clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
function updateScene(t){
 t=Math.max(0,Math.min(t,10));
 const travel=ease(t/3.6),step=ease((t-5.2)/1.4);
 henry.root.position.set(lerp(-3.75,.18,travel)+.32*step,Math.sin(t*2)*.014,1.05-.40*travel);
 henry.root.rotation.y=lerp(-.16,.28,ease((t-3.5)/1.4));
 // Rebuild deterministic pose from exact timestamp, no clock-dependent drift.
 for(const b of henry.bones)b.rotation.set(0,0,0);
 const walking=t<3.6?Math.sin(t*10)*Math.sin(Math.PI*clamp(t/3.6))*.65:0;
 lt.rotation.x=walking;rt.rotation.x=-walking;ls.rotation.x=Math.max(0,-walking)*.55;rs.rotation.x=Math.max(0,walking)*.55;
 la.rotation.x=-walking*.57;ra.rotation.x=walking*.57;
 spine.rotation.z=Math.sin(t*2.3)*.026;head.rotation.y=-.12+Math.sin(t*.85)*.07;
 head.rotation.x=t>3.5&&t<6.4?-.1:0;
 if(t>3.7&&t<6.8){
   const u=ease((t-3.7)/.55);ra.rotation.z=lerp(0,2.0,u);
   rfa.rotation.z=-.48*u;head.rotation.y=-.29*u;
   henry.browL.position.y=.48+u*.055;henry.browR.position.y=.48+u*.055;
   henry.mouth.scale.y=.024+u*.066;
 }else{
   henry.browL.position.y=.48;henry.browR.position.y=.48;
   henry.mouth.scale.y=.024;
 }
 if(t>6.6){
   const u=ease((t-6.6)/.55),wave=Math.sin((t-7)*8);
   ra.rotation.z=2.35*u;rfa.rotation.z=-.30+wave*.28*u;
   henry.mouth.scale.y=.035;head.rotation.y=-.03;
 }
 if(t>3.4&&t<6.3){const pulse=.5+.5*Math.sin(t*17);phoneScreen.material.emissiveIntensity=.9+1.7*pulse;phoneGlow.intensity=1+8*pulse;glow.style.opacity='1';}
 else{phoneScreen.material.emissiveIntensity=.9;phoneGlow.intensity=.5;glow.style.opacity='0';}
 // True 3D camera motion and reframing; no static background plate.
 let k=ease(t/10);
 const cx=lerp(-2.85,2.35,k)+Math.sin(t*.32)*.3;
 const cy=lerp(3.35,2.35,k);
 const cz=lerp(8.35,6.00,k);
 camera.position.set(cx,cy,cz);
 camera.lookAt(lerp(-1.5,.15,ease((t-1)/5)),1.49,-.55);
 // Readable timed motion graphics.
 const titles=t<3.6?['HENRY','A strange sound in the living room...']:
    t<6.7?['THE MYSTERY PHONE','Henry hears a phone ringing.']:
             ['ALL CLEAR','Henry smiles and waves.'];
 headline.textContent=titles[0];subtitle.textContent=titles[1];
 clock.textContent=t.toFixed(1).padStart(4,'0')+' / 10.0';
 renderer.render(scene,camera);
}
window.renderAt=updateScene;
window.renderInfo={
 engine:'Three.js',character:'Henry',bones:henry.bones.length,
 renderer:renderer.capabilities.isWebGL2?'WebGL2':'WebGL1',
 glVendor:renderer.getContext().getParameter(renderer.getContext().VENDOR),
 glRenderer:renderer.getContext().getParameter(renderer.getContext().RENDERER),
 size:[width,height],fps:24
};
window.__READY__=true;
updateScene(0);
