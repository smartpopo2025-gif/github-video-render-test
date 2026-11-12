import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Faithful procedural Henry rig geometry and 15-bone layout from the user's Three.js Character Engine V2.
// Only this minimal character runtime is included; no private ZIP, GLB, cast presets or source engine are published.
export function makeHenryRig() {
  const root = new THREE.Group(); root.name='Henry';
  const bones=[], points=[];
  function addBone(name,parent,position){
    const b=new THREE.Bone(); b.name=name; b.position.set(...position);
    (parent<0?root:bones[parent]).add(b); bones.push(b);
    points.push(parent<0?new THREE.Vector3(...position):points[parent].clone().add(new THREE.Vector3(...position)));
  }
  addBone('Hips',-1,[0,1.05,0]);
  addBone('Spine',0,[0,.32,0]);
  addBone('Head',1,[0,.55,0]);
  for (const [name,x] of [['Left',-.2],['Right',.2]]) {
    let i=bones.length;addBone(name+'Thigh',0,[x,-.05,0]);
    addBone(name+'Shin',i,[0,-.46,0]);addBone(name+'Foot',i+1,[0,-.43,.04]);
  }
  for (const [name,x] of [['Left',-.31],['Right',.31]]) {
    let i=bones.length;addBone(name+'Arm',1,[x,.28,0]);
    addBone(name+'Forearm',i,[0,-.36,0]);addBone(name+'Hand',i+1,[0,-.32,0]);
  }
  const geometries=[];
  function withSkin(geo,weightFn){
    const ids=[],weights=[];
    for(let i=0;i<geo.attributes.position.count;i++){
      const p=new THREE.Vector3().fromBufferAttribute(geo.attributes.position,i);
      const a=weightFn(p);ids.push(a[0],a[1]??0,0,0);weights.push(a[2]??1,a[3]??0,0,0);
    }
    geo.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(ids,4));
    geo.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
    geometries.push(geo);
  }
  function ellipsoid(c,r,b){const g=new THREE.SphereGeometry(1,24,16);g.scale(...r);g.translate(...c);withSkin(g,()=>[b]);}
  function limb(a,b,c,r1,r2) {
    const v=[],uv=[],idx=[],n=12,rows=16,start=points[a],end=points[c];
    for(let j=0;j<=rows;j++){const t=j/rows,y=THREE.MathUtils.lerp(start.y,end.y,t),r=THREE.MathUtils.lerp(r1,r2,t);
      for(let k=0;k<=n;k++){const q=k/n*Math.PI*2;v.push(start.x+Math.cos(q)*r,y,start.z+Math.sin(q)*r);uv.push(k/n,t);}
    }
    for(let j=0;j<rows;j++)for(let k=0;k<n;k++){const p=j*(n+1)+k;idx.push(p,p+1,p+n+1,p+1,p+n+2,p+n+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    withSkin(g,p=>{const w=THREE.MathUtils.smoothstep(points[b].y-p.y,-.11,.11);return [a,b,1-w,w];});
  }
  ellipsoid([0,1.3,0],[.32,.43,.2],1);
  ellipsoid([0,1.02,0],[.29,.19,.19],0);
  ellipsoid([0,1.83,0],[.13,.22,.13],2);
  ellipsoid([0,2.21,0],[.47,.46,.42],2);
  for(const i of [3,6]){
    limb(i,i+1,i+2,.115,.075);
    ellipsoid(points[i+2].clone().add(new THREE.Vector3(0,-.035,.1)).toArray(),[.13,.09,.23],i+2);
  }
  for(const i of [9,12]){
    ellipsoid(points[i].toArray(),[.13,.13,.13],i);
    limb(i,i+1,i+2,.09,.055);
    ellipsoid(points[i+2].clone().add(new THREE.Vector3(0,-.07,0)).toArray(),[.09,.13,.065],i+2);
  }
  const mesh=new THREE.SkinnedMesh(mergeGeometries(geometries),
    new THREE.MeshStandardMaterial({color:0xd4d8d8,roughness:.67,metalness:.05,skinning:true}));
  mesh.name='HenrySkin';root.add(mesh);root.updateMatrixWorld(true);mesh.bind(new THREE.Skeleton(bones));
  mesh.castShadow=true;mesh.receiveShadow=true;
  const head=bones[2];
  function face(name,p,s,color){
    const m=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshStandardMaterial({color,roughness:.25}));
    m.name=name;m.position.set(...p);m.scale.set(...s);head.add(m);return m;
  }
  face('EyeL',[-.17,.34,.377],[.075,.1,.035],0x14232b);
  face('EyeR',[.17,.34,.377],[.075,.1,.035],0x14232b);
  face('GlintL',[-.19,.37,.409],[.019,.025,.008],0xffffff);
  face('GlintR',[.15,.37,.409],[.019,.025,.008],0xffffff);
  const mouth=face('Mouth',[0,.12,.398],[.11,.024,.018],0x293b42);
  const browL=face('BrowL',[-.17,.48,.34],[.09,.018,.022],0x536168);
  const browR=face('BrowR',[.17,.48,.34],[.09,.018,.022],0x536168);
  return {root,mesh,bones,mouth,browL,browR};
}
