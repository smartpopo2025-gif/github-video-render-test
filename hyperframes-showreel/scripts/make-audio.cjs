// Original 15-second stereo electronic beat for the motion showreel. No third-party music.
const fs=require('fs'),path=require('path');
const rate=48000,seconds=15,frames=rate*seconds,pcm=Buffer.alloc(frames*4),TAU=2*Math.PI;
const kicks=Array.from({length:30},(_,i)=>i*.5);
const hits=[0,2.92,5.93,8.96,11.92,13.45];
let seed=1492271;function noise(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;}
function bump(t,time,len){let d=t-time;return d>=0&&d<len?d:-1;}
for(let i=0;i<frames;i++){
 const t=i/rate;let v=.102*Math.sin(TAU*(50*t+4*Math.sin(TAU*.3*t))) * (.6+.4*Math.sin(TAU*.25*t)**2);
 v+=.065*Math.sin(TAU*110*t+.36*Math.sin(TAU*1.15*t))+.033*Math.sin(TAU*220*t+.28*Math.sin(TAU*.8*t));
 for(const at of kicks){const d=bump(t,at,.32);if(d>=0)v+=.52*Math.exp(-17*d)*Math.sin(TAU*(74*d-45*d*d));}
 const beat=t%.25;if(beat<.055)v+=.045*Math.exp(-85*beat)*noise();
 const shuffle=(t+.125)%.5;if(shuffle<.05)v+=.046*Math.exp(-62*shuffle)*noise();
 for(const at of hits){const d=bump(t,at,.85);if(d>=0){v+=.28*Math.sin(TAU*(135*d+250*d*d))*Math.exp(-7*d);v+=.10*noise()*Math.exp(-17*d);}}
 for(const at of [2.56,5.59,8.61,11.59]){const d=bump(t,at,.39);if(d>=0){const p=d/.39;v+=.085*p*p*(noise()*.6+Math.sin(TAU*(90*d+900*d*d))*.4);}}
 for(const [at,f] of [[.2,440],[1.2,554],[3.18,330],[4.18,440],[6.18,494],[7.18,554],[9.17,392],[10.18,587],[12.23,554],[13.3,740]]){const d=bump(t,at,.33);if(d>=0)v+=.095*Math.sin(TAU*f*d)*Math.exp(-9*d);}
 const envelope=Math.min(1,t*7,(15-t)*7);v=Math.tanh(v*1.7)*Math.max(0,envelope)*.68;
 const a=Math.max(-1,Math.min(1,v*(.98+.02*Math.sin(TAU*.27*t))));
 const b=Math.max(-1,Math.min(1,v*(.98-.02*Math.sin(TAU*.27*t))));
 pcm.writeInt16LE(Math.round(a*32767),i*4);pcm.writeInt16LE(Math.round(b*32767),i*4+2);
}
const wav=Buffer.alloc(44);wav.write('RIFF',0);wav.writeUInt32LE(36+pcm.length,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length,40);
const dst=path.join(__dirname,'../assets/soundtrack.wav');fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,Buffer.concat([wav,pcm]));console.log('Created 15s original soundtrack:',dst);
