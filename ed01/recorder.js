import {Muxer,ArrayBufferTarget} from '/node_modules/mp4-muxer/build/mp4-muxer.mjs';
const fps=24,width=1280,height=720;
let lastError=null;
window.__ED_RECORD_READY__=true;
window.recordSegment=async function(part,start,end,duration){
  if(typeof window.setFrame!=='function')throw new Error('Scene renderer has not initialized.');
  const support=await VideoEncoder.isConfigSupported({
    codec:'avc1.42001f',width,height,bitrate:2600000,framerate:fps,
    latencyMode:'quality',hardwareAcceleration:'prefer-software'
  });
  if(!support.supported)throw new Error('WebCodecs H.264 encoder not available in this Chromium.');
  const muxer=new Muxer({target:new ArrayBufferTarget(),video:{codec:'avc',width,height,frameRate:fps},fastStart:'in-memory',firstTimestampBehavior:'offset'});
  let count=0;
  lastError=null;
  const enc=new VideoEncoder({
    output:(chunk,meta)=>{muxer.addVideoChunk(chunk,meta);count++;},
    error:(e)=>{lastError=e?.message||String(e);}
  });
  enc.configure(support.config);
  const frames=Math.ceil((end-start)*fps-0.000001);
  for(let i=0;i<frames;i++){
    if(lastError)throw new Error('VideoEncoder: '+lastError);
    const t=Math.min(duration,start+i/fps);
    window.setFrame(t,duration);
    const vf=new VideoFrame(document.getElementById('cv'),{timestamp:Math.round(i*1000000/fps),duration:Math.round(1000000/fps)});
    enc.encode(vf,{keyFrame:i%48===0});
    vf.close();
    if(i%16===15 || enc.encodeQueueSize>10){
      await enc.flush();
      if(lastError)throw new Error('WebCodecs encoding failed: '+lastError);
      await new Promise(r=>setTimeout(r,0));
    }
  }
  await enc.flush();enc.close();muxer.finalize();
  const data=new Uint8Array(muxer.target.buffer);
  if(data.byteLength<4000)throw new Error('Encoded MP4 suspiciously short: '+data.byteLength);
  const result=await fetch('/upload?part='+part,{method:'POST',headers:{'Content-Type':'video/mp4'},body:data});
  if(!result.ok)throw new Error('Upload failed '+result.status+' '+await result.text());
  const receipt=await result.json();
  return {part,frames,outputChunks:count,bytes:data.byteLength,start,end,duration,encoder:support.config.codec,receipt};
};