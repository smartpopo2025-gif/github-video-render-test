import http from 'node:http';
import fs from 'node:fs';
import {readFile, mkdir, writeFile, rm, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {performance} from 'node:perf_hooks';
import os from 'node:os';
import {chromium} from 'playwright';

const root=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(root,'out');
const frames=path.join(out,'frames');
await mkdir(frames,{recursive:true});
const MIME={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
  try{
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname==='/')pathname='/index.html';
    const target=path.resolve(root,'.'+pathname);
    if(!target.startsWith(root+path.sep)) {res.writeHead(403);res.end('Forbidden');return;}
    const data=await readFile(target);
    res.setHeader('Content-Type',MIME[path.extname(target)]||'application/octet-stream');
    res.setHeader('Cache-Control','no-store');res.end(data);
  }catch(e){res.writeHead(404);res.end('Not found: '+e.message);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=server.address();
const errors=[],report={utc:new Date().toISOString(),cpu:os.cpus().length,ramGb:Number((os.totalmem()/1024**3).toFixed(2))};
let browser;
const start=performance.now();
try{
  const args=['--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
    '--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader',
    '--disable-gpu-sandbox','--ignore-gpu-blocklist'];
  const browserPath=process.env.CHROMIUM_BIN||undefined;
  console.log('Launching chromium:',browserPath||'Playwright managed chromium');
  try{
    browser=await chromium.launch({headless:true,executablePath:browserPath,args,timeout:60000});
  }catch(e){
    if(!browserPath)throw e;
    console.log('Requested custom browser failed; trying Playwright bundled:',e.message);
    browser=await chromium.launch({headless:true,args,timeout:60000});
    report.browserFallback=true;
  }
  report.browserVersion=browser.version();
  const context=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1,hasTouch:false});
  const page=await context.newPage();
  page.on('console',msg=>{if(msg.type()==='error')errors.push('Console: '+msg.text());});
  page.on('pageerror',err=>errors.push('JS: '+err.message));
  await page.goto('http://127.0.0.1:'+address.port+'/',{waitUntil:'load',timeout:60000});
  await page.waitForFunction('window.__READY__ === true',null,{timeout:60000});
  report.sceneInfo=await page.evaluate(()=>window.renderInfo);
  if(report.sceneInfo.bones!==15)throw new Error('Expected Henry 15-bone rig, got: '+report.sceneInfo.bones);
  console.log('WebGL READY:',JSON.stringify(report.sceneInfo));
  const fps=24,seconds=10,total=fps*seconds;
  report.fps=fps;report.frames=total;report.resolution='1280x720';
  for(let i=0;i<total;i++){
    const t=i/fps;
    await page.evaluate(async t=>{window.renderAt(t);await new Promise(r=>requestAnimationFrame(r));},t);
    const name=path.join(frames,'frame_'+String(i).padStart(4,'0')+'.jpg');
    await page.screenshot({path:name,type:'jpeg',quality:88,animations:'disabled',timeout:45000});
    if(i%24===0){console.log('Frame',i+'/'+total,'elapsed '+Math.round((performance.now()-start)/1000)+'s');}
  }
  if(errors.length)console.log('Browser errors:',errors.slice(0,15));
  report.browserErrors=errors.slice(0,40);
  const video=path.join(out,'HENRY_THREEJS_GITHUB_PUBLIC_VM_10S_720P.mp4');
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate','24',
    '-i',path.join(frames,'frame_%04d.jpg'),'-c:v','libx264','-preset','veryfast',
    '-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',video],{stdio:'inherit'});
  const duration=execFileSync('ffprobe',['-v','error','-show_entries','format=duration',
    '-of','default=noprint_wrappers=1:nokey=1',video],{encoding:'utf8'}).trim();
  report.actualDurationSeconds=Number(duration);
  report.videoBytes=(await stat(video)).size;
  report.elapsedSeconds=Number(((performance.now()-start)/1000).toFixed(2));
  if(Math.abs(report.actualDurationSeconds-10)>.05)throw new Error('Video duration is incorrect: '+duration);
  // Keep preview and metrics; remove only intermediate frames.
  await fs.promises.copyFile(path.join(frames,'frame_0150.jpg'),path.join(out,'HENRY_PREVIEW.jpg'));
  await writeFile(path.join(out,'render-report.json'),JSON.stringify(report,null,2));
  await rm(frames,{recursive:true,force:true});
  console.log('SUCCESS:',JSON.stringify(report,null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
