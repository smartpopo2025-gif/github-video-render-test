import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {mkdir,writeFile,stat,readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {execFileSync} from 'node:child_process';
import {performance} from 'node:perf_hooks';

const root=path.dirname(fileURLToPath(import.meta.url));
const part=Number(process.env.PART||'0');
const duration=Number(process.env.TOTAL_SECONDS||'271.55');
const segment=Number(process.env.SEGMENT_SECONDS||'30');
const start=part*segment;
const end=Math.min(duration,start+segment);
if(end<=start)throw Error('Empty segment start='+start+' total='+duration);
const out=path.join(root,'out');await mkdir(out,{recursive:true});
const name='ed01_segment_'+String(part).padStart(2,'0')+'.mp4';
const target=path.join(out,name);
const MIME={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json'};
let uploadStatus=null;
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/upload'&&req.method==='POST'){
    const p=Number(url.searchParams.get('part'));
    if(p!==part){res.writeHead(400);res.end('Wrong part');return;}
    const file=fs.createWriteStream(target);
    let size=0;
    for await (const chunk of req){size+=chunk.length;if(size>170000000)throw Error('Unexpectedly huge MP4 upload');if(!file.write(chunk))await new Promise(r=>file.once('drain',r));}
    file.end();await new Promise((r,j)=>{file.once('finish',r);file.once('error',j);});
    uploadStatus={part,size,name};
    res.setHeader('Content-Type','application/json');res.end(JSON.stringify(uploadStatus));return;
  }
  let loc=url.pathname==='/'?'/index.html':url.pathname;
  let file;
  if(loc.startsWith('/henry10/')) file=path.resolve(root,'..',loc.slice(1));
  else file=path.resolve(root,'.'+loc);
  const allowed1=file.startsWith(root+path.sep),allowed2=file.startsWith(path.resolve(root,'..','henry10')+path.sep);
  if(!allowed1&&!allowed2){res.writeHead(403);res.end('Forbidden');return;}
  const data=await readFile(file);
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');
  res.setHeader('Cache-Control','no-store');res.end(data);
 }catch(e){res.writeHead(404);res.end('Not Found: '+e.message);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const addr='http://127.0.0.1:'+server.address().port;
let browser;const started=performance.now(),errors=[];
const report={part,start,end,duration,output:name,mode:'direct WebCodecs + mp4-muxer (no screenshots per frame)',cpuCount:os.cpus().length,ramGiB:Number((os.totalmem()/1024**3).toFixed(2)),timestamp:new Date().toISOString()};
try {
 const args=['--no-sandbox','--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--disable-gpu-sandbox','--ignore-gpu-blocklist','--disable-dev-shm-usage'];
 const bin=process.env.CHROMIUM_BIN||undefined;
 browser=await chromium.launch({headless:true,executablePath:bin,args,timeout:60000});
 report.browser=browser.version();
 const ctx=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});
 const page=await ctx.newPage();
 page.on('console',m=>{if(m.type()==='error')errors.push('Browser console: '+m.text());});
 page.on('pageerror',e=>errors.push('JS error: '+e.message));
 await page.goto(addr,{waitUntil:'load',timeout:60000});
 await page.waitForFunction('window.__ED_READY__===true && window.__ED_RECORD_READY__===true',null,{timeout:120000});
 report.scene=await page.evaluate(()=>window.__ED_INFO__);
 console.log('READY scene:',JSON.stringify(report.scene));
 if(!report.scene.webgl2)throw Error('WebGL2 unavailable');
 if(report.scene.characterBones!==15 || report.scene.beats!==26)throw Error('Rig or cue setup invalid');
 await page.evaluate(t=>window.setFrame(t,271.55),Math.max(start+1,start));
 if(part===0)await page.screenshot({path:path.join(out,'ED01_PREVIEW.jpg'),type:'jpeg',quality:85});
 console.log('RENDER DIRECT WebCodecs part='+part+' start='+start+' end='+end);
 const result=await page.evaluate(({part,start,end,duration})=>window.recordSegment(part,start,end,duration),{part,start,end,duration});
 report.webcodecs=result;
 report.browserErrors=errors.slice(0,20);
 report.elapsedSeconds=Number(((performance.now()-started)/1000).toFixed(2));
 if(!uploadStatus)throw Error('MP4 was not received by local uploader');
 const check=await stat(target);report.bytes=check.size;
 const actual=execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',target],{encoding:'utf8'}).trim();
 report.actualDuration=Number(actual);
 const want=end-start;
 if(Math.abs(report.actualDuration-want)>.08)throw Error('Incorrect segment duration wanted='+want+' actual='+actual);
 if(report.browserErrors.length)console.log('Browser errors encountered',report.browserErrors);
 if(report.browserErrors.some(x=>x.startsWith('JS error')))throw Error('Page JavaScript errors');
 await writeFile(path.join(out,'report_part_'+String(part).padStart(2,'0')+'.json'),JSON.stringify(report,null,2));
 console.log('SUCCESS',JSON.stringify(report));
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
