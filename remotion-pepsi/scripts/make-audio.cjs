// Original 15-second stereo ice/glass/product sound design, created from synthesis only.
const fs=require('fs'),path=require('path');
const SR=48000, SEC=15, N=SR*SEC, TAU=2*Math.PI, sound=new Float32Array(N);
let seed=295681;const rng=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return (seed/4294967296)*2-1;};
for(let i=0;i<N;i++){let t=i/SR;
 sound[i]=.044*Math.sin(TAU*48*t)+.028*Math.sin(TAU*96*t+.3*Math.sin(TAU*.35*t));
 sound[i]+=.017*Math.sin(TAU*185*t)*Math.sin(TAU*.18*t);
}
const tone=(when,dur,gain,fn,decay=4)=>{const start=Math.floor(when*SR),k=Math.floor(dur*SR);for(let j=0;j<k&&start+j<N;j++){const t=j/SR;const v=Math.exp(-decay*t)*gain*fn(t,j);sound[start+j]+=v;}};
const kick=(when,volume=.40)=>tone(when,.65,volume,(t)=>Math.sin(TAU*(75*t-25*t*t)),11);
for(let t=0;t<15;t+=.5)kick(t,t%3===0?.54:.28);
for(let t=.25;t<15;t+=.5)tone(t,.075,.039,(s)=>Math.sin(TAU*2700*s)+rng()*.45,43);
for(let t=.375;t<14.9;t+=.25)tone(t,.07,.021,(s)=>rng(),50);
// A short blast of breaking ice, then fizzy falling crystal shards.
for(const burst of [1.95,3.17,6.65,10.8,11.2]){
 tone(burst,.44,.22,(t)=>rng()*.7+Math.sin(TAU*(700+2500*t)*t)*.35,12);
 for(let j=0;j<23;j++){
  const at=burst+.018+j*.018+(j%5)*.003;
  tone(at,.12,.057,(t)=>Math.sin(TAU*(1600+(j%9)*210)*t)*Math.exp(-9*t),20);
 }
}
for(const at of [0,4.05,7.3,11.05]){
 tone(at,.72,.23,(t)=>Math.sin(TAU*(120*t+470*t*t))+rng()*.22,5);
}
for(const at of [12.1,12.8,13.6]){
 tone(at,.42,.105,(t)=>Math.sin(TAU*([392,494,587][[12.1,12.8,13.6].indexOf(at)])*t),7);
}
const wav=Buffer.alloc(44);wav.write('RIFF');wav.writeUInt32LE(36+N*4,4);wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);
wav.writeUInt32LE(SR,24);wav.writeUInt32LE(SR*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);
wav.write('data',36);wav.writeUInt32LE(N*4,40);
const pcm=Buffer.alloc(N*4);
for(let i=0;i<N;i++){
 const t=i/SR;const env=Math.min(1,t*8,(15-t)*6);
 const s=Math.tanh(sound[i]*1.4)*Math.max(0,env)*.87;
 const lv=Math.max(-1,Math.min(1,s*(.98+.02*Math.sin(TAU*.5*t))));
 const rv=Math.max(-1,Math.min(1,s*(.98-.02*Math.sin(TAU*.5*t))));
 pcm.writeInt16LE(Math.round(lv*32767),i*4);pcm.writeInt16LE(Math.round(rv*32767),i*4+2);
}
const dest=path.resolve(__dirname,'../public/assets/soundtrack.wav');
fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,Buffer.concat([wav,pcm]));
console.log('Created original 15.0-second soundtrack at',dest);
