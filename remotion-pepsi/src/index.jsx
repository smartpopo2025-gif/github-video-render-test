import React from "react";
import "@fontsource/syne/800.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import {
  AbsoluteFill, Audio, Composition, Easing, Img,
  interpolate, registerRoot, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";

const W = 1920, H = 1080, FPS = 30;
const C = (a) => Math.max(0, Math.min(1, a));
const lerp = (f, points, values) => interpolate(f, points, values, {extrapolateLeft:"clamp",extrapolateRight:"clamp"});
const rel = (f,s,e) => C((f-s)/(e-s));
const fade = (f, s, e, fs=14, fe=15) => lerp(f,[s,s+fs,e-fe,e],[0,1,1,0]);
const E = Easing.bezier(.16,1,.3,1);

const ColdParticles = ({frame, count=75, opacity=1}) => <AbsoluteFill style={{pointerEvents:"none",opacity}}>
  {Array.from({length:count},(_,i)=>{
    const n=(i*137.508)%100, x0=((i*1973)%1901), y0=((i*811)%1073);
    const r=1+(i*13%27)/5;
    const y = (y0-frame*(.25+i%8*.1)+H*6)%H;
    const x = (x0+Math.sin(frame*.012+i*2)*40+W*3)%W;
    const a=.15+((i*11)%21)/100;
    return <div key={i} style={{position:"absolute",left:x,top:y,width:r,height:r,borderRadius:"50%",background:"white",opacity:a,boxShadow:i%4===0?"0 0 16px 2px #a9eeff":"none"}}/>;
  })}
</AbsoluteFill>;

const Mist = ({frame,opacity=1})=><AbsoluteFill style={{opacity,overflow:"hidden",pointerEvents:"none"}}>
  {Array.from({length:10},(_,i)=>{
    const x=-200+i*245+Math.sin(frame*.013+i*2)*190;
    const y=620+(i%4)*100+Math.cos(frame*.015+i)*55;
    const sc=lerp(frame,[0,450],[.88,1.25]);
    return <div key={i} style={{position:"absolute",left:x,top:y,width:630,height:210,transform:"rotate(-10deg) scale("+sc+")",borderRadius:"50%",background:"radial-gradient(ellipse,#d6f3ff4a 0%,#a2d9ff2d 35%,transparent 72%)",filter:"blur(52px)"}}/>;
  })}
</AbsoluteFill>;


/*
 * TYPOGRAPHIC DESIGN SYSTEM V2
 * Three real bundled font families, no Impact/Arial fallbacks in the art direction:
 * Syne ExtraBold — confident modern campaign headlines
 * Space Grotesk Bold — crisp technical labels
 * Manrope Semibold/Bold — elegant editorial support and CTA
 */
const TypeLine = ({children,x,y,size=120,opacity=1,offset=0,tracking="-0.065em",tone="white",font="Syne",weight=800,gradient=false,outline=false,align="left",width}) => {
  const col=tone==="ice"?"#BEEFFF":tone==="blue"?"#4DAEFF":tone==="red"?"#F33452":tone==="muted"?"#C5E2F4":"#FFFFFF";
  return <div style={{
    position:"absolute",left:x,top:y,width,opacity,transform:"translate3d(0,"+offset+"px,0)",
    whiteSpace:"nowrap",textAlign:align,
    fontFamily:'"'+font+'",sans-serif',fontSize:size,fontWeight:weight,
    letterSpacing:tracking,lineHeight:.97,textTransform:"uppercase",
    color:gradient?"transparent":col,
    background:gradient?"linear-gradient(108deg,#ffffff 4%,#c5f2ff 50%,#81d9ff 100%)":undefined,
    backgroundClip:gradient?"text":undefined,WebkitBackgroundClip:gradient?"text":undefined,
    WebkitTextStroke:outline?"2px #B3EAF7":"none",
    filter:"drop-shadow(0 6px 16px rgba(0,12,28,.55))"
  }}>{children}</div>
};
const MicroLabel = ({children,x,y,opacity=1,color="#C3EFFB",size=27}) => <div style={{
  position:"absolute",left:x,top:y,display:"flex",alignItems:"center",gap:19,opacity,
  fontFamily:'"Space Grotesk",sans-serif',fontSize:size,fontWeight:700,letterSpacing:".18em",
  color,textTransform:"uppercase",textShadow:"0 2px 12px rgba(0,0,0,.45)"
}}>
  <span style={{display:"inline-block",width:43,height:5,background:"#F32D4E",boxShadow:"0 0 19px #FF3C6260"}}/>
  <span>{children}</span>
</div>;
const EditorialInfo = ({children,x,y,opacity=1,color="#D5EAF7",size=24}) => <div style={{
  position:"absolute",left:x,top:y,opacity,fontFamily:'"Manrope",sans-serif',
  fontWeight:700,fontSize:size,letterSpacing:".12em",color,
  textShadow:"0 2px 14px #001226"
}}>{children}</div>;
const DecorRule = ({x,y,w,opacity=1}) => <div style={{
  position:"absolute",left:x,top:y,width:w,height:2,opacity,
  background:"linear-gradient(90deg,#9CEFFF 0%,#C5F5FF70 60%,transparent 100%)"
}}/>;
const Photo = ({file,frame,from=0,to=450,zoom0=1.04,zoom1=1.13,x0=0,x1=0,y0=0,y1=0,objectPosition="center"}) => {
  const p=C((frame-from)/(to-from));
  return <AbsoluteFill style={{overflow:"hidden",background:"radial-gradient(circle at 50% 45%,#134d8f,#031328 80%)"}}>
    <Img src={staticFile("assets/"+file)} style={{
      width:W,height:H,objectFit:"cover",objectPosition,
      transform:"translate("+ (x0+(x1-x0)*p)+"px,"+(y0+(y1-y0)*p)+"px) scale("+(zoom0+(zoom1-zoom0)*E(p))+")",
      filter:"contrast(1.1) saturate(1.2) brightness(.95)"
    }}/>
  </AbsoluteFill>;
};

const IceBlock = ({frame}) => {
  const crack=rel(frame,37,55);
  const split=E(rel(frame,59,95));
  const opacity=1-rel(frame,83,107);
  return <AbsoluteFill style={{opacity,pointerEvents:"none"}}>
    <div style={{position:"absolute",left:550,top:50,width:820,height:960,
      borderRadius:"35px 35px 150px 150px",
      background:"linear-gradient(115deg,#ecffff59 0%,#a0e1ff55 21%,#edffff16 40%,#4bc2ff27 63%,#e8fcff55 94%)",
      boxShadow:"inset 35px 0px 60px #ffffff74,inset -30px 0 70px #b2efff6d,0 0 75px #c8faff47",
      border:"7px solid #d7faff97",backdropFilter:"blur(4px)",
      transform:"scale("+(1+split*.22)+")",
      clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)",
    }} />
    {Array.from({length:10},(_,i)=>{
      const ang=i*Math.PI*2/10;
      const tx=Math.cos(ang)*740*split,ty=Math.sin(ang)*550*split;
      const top=i%2===0?0:160;
      return <div key={i} style={{position:"absolute",left:700+(i%3)*130,top:80+((i*189)%760),
        width:150+(i%3)*100,height:200+((i*41)%160),
        clipPath:["polygon(10% 10%,95% 0%,65% 100%)","polygon(0 0,100% 10%,20% 100%)","polygon(20% 0,100% 50%,0 100%)"][i%3],
        background:"linear-gradient(105deg,#e7ffffca 0%,#d1f9ff0c 40%,#aee1ffab 95%)",
        border:"4px solid #ffffff9e",
        boxShadow:"0 0 18px #e0faff",
        transform:"translate("+tx+"px,"+ty+"px) rotate("+(split*(i%2?160:-190))+"deg)",
        opacity:crack
      }}/>;
    })}
    <svg width={W} height={H} style={{position:"absolute",inset:0,opacity:crack*(1-split),filter:"drop-shadow(0 0 12px white)"}}>
      <path d="M 957 50 L 1015 245 L 920 330 L 1028 490 L 904 568 L 1065 706 L 950 1000" fill="none" stroke="#f6feff" strokeWidth="11"/>
      <path d="M 920 330 L 740 430 L 670 585 M 1028 490 L 1190 370 L 1290 430 M 904 568 L 760 745" fill="none" stroke="#d2faff" strokeWidth="7"/>
    </svg>
  </AbsoluteFill>
}

const FrostGlass = ({frame}) => <AbsoluteFill style={{pointerEvents:"none",opacity:lerp(frame,[0,90,180,450],[.40,.25,.42,.18])}}>
  <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 54%,transparent 22%,#b8eaff2c 66%,#f3fbff79 100%)",mixBlendMode:"screen"}}/>
  {Array.from({length:58},(_,i)=>{
    let x=50+(i*229)%1840,y=40+(i*479)%960,r=(i*17%21)+7;
    const p=C((frame-10-i%30)/30);
    return <div key={i} style={{position:"absolute",left:x,top:y,width:r,height:r,transform:"rotate("+(frame*.1+i*19)+"deg) scale("+(0.5+p*.9)+")",color:"#e5faff",fontSize:r,opacity:.24+p*.42,textShadow:"0 0 8px #ecfbff"}}>✳</div>
  })}
</AbsoluteFill>;

const Droplets = ({frame,opacity=1}) => <AbsoluteFill style={{pointerEvents:"none",opacity}}>
  {Array.from({length:42},(_,i)=>{
    const x=110+((i*1373)%1700),y=90+((i*693)%940),r=2+(i*11)%12;
    const drift=frame*.2*(1+(i%4)*.2);
    return <div key={i} style={{position:"absolute",left:x,top:y+drift%140,width:r,height:r*1.22,borderRadius:"50%",background:"radial-gradient(circle at 35% 25%,#fff 0%,#b9f2ff9c 25%,#0f85ce4d 58%,#ffffff24 100%)",boxShadow:"inset -2px -2px 2px #03467280,0 0 6px #b3e7ff67"}}/>
  })}
</AbsoluteFill>;

const SceneOne = ({frame}) => {
  const a=fade(frame,0,125,7,18);
  const intro=E(rel(frame,36,55));
  const main=E(rel(frame,53,79));
  const sub=E(rel(frame,68,90));
  return <AbsoluteFill style={{opacity:a,background:"#031225"}}>
    <Photo file="pepsi_ice.jpg" frame={frame} from={0} to={115} zoom0={1.35} zoom1={1.12}/>
    <AbsoluteFill style={{background:"linear-gradient(90deg,#020919de 0%,#031027c9 27%,#06182d3d 58%,#020e2b29 100%)"}}/>
    <IceBlock frame={frame}/>
    <ColdParticles frame={frame} count={92} opacity={.85}/>
    <Mist frame={frame} opacity={.9}/>
    <FrostGlass frame={frame}/>
    <MicroLabel x={100} y={120} opacity={E(rel(frame,6,24))*(1-rel(frame,105,118))}>COLDEST MOMENT / 01</MicroLabel>
    <TypeLine x={96} y={660} size={132} opacity={intro*(1-rel(frame,105,122))} offset={(1-intro)*120} tracking="-.062em">BREAK THE</TypeLine>
    <TypeLine x={93} y={793} size={178} gradient opacity={main*(1-rel(frame,105,122))} offset={(1-main)*105} tracking="-.055em">ICE.</TypeLine>
    <DecorRule x={101} y={984} w={465*sub} opacity={sub}/>
    <EditorialInfo x={101} y={1000} opacity={sub*(1-rel(frame,105,120))} size={24}>FROM FROZEN TO ICONIC.</EditorialInfo>
    <AbsoluteFill style={{opacity:lerp(frame,[52,57,61],[0,.65,0]),background:"white",mixBlendMode:"screen"}}/>
  </AbsoluteFill>;
}

const SceneTwo = ({frame}) => {
  const a=fade(frame,109,230,14,19);
  const p=E(rel(frame,124,148));
  const q=E(rel(frame,137,166));
  const r=E(rel(frame,169,193));
  return <AbsoluteFill style={{opacity:a,background:"#03122b"}}>
    <Photo file="pepsi_dew.jpg" frame={frame} from={110} to={220} zoom0={1.22} zoom1={1.37} x0={-180} x1={-100} objectPosition="30% 48%"/>
    <AbsoluteFill style={{background:"linear-gradient(90deg,transparent 7%,#030d2838 43%,#030d28e7 68%,#030d25eb 100%)"}}/>
    <Droplets frame={frame} opacity={.46}/>
    <ColdParticles frame={frame} count={38} opacity={.42}/>
    <MicroLabel x={1095} y={174} opacity={E(rel(frame,117,137))}>DETAIL / 02</MicroLabel>
    <TypeLine x={1080} y={276} size={139} opacity={p} offset={(1-p)*110} tracking="-.065em">SO</TypeLine>
    <TypeLine x={1080} y={418} size={123} tone="ice" opacity={q} offset={(1-q)*87} tracking="-.07em">COLD.</TypeLine>
    <TypeLine x={1086} y={592} size={51} opacity={q} offset={(1-q)*65} tracking="-.04em">YOU FEEL IT.</TypeLine>
    <DecorRule x={1088} y={706} w={600*r} opacity={r}/>
    <EditorialInfo x={1088} y={741} size={23} opacity={r}>FROST. CONDENSATION. REFRESHMENT.</EditorialInfo>
    <Mist frame={frame} opacity={.42}/>
  </AbsoluteFill>;
}

const SceneThree = ({frame}) => {
  const a=fade(frame,216,351,16,17);
  const p=E(rel(frame,229,260));
  const q=E(rel(frame,248,280));
  const move=E(rel(frame,230,340));
  return <AbsoluteFill style={{opacity:a,background:"#051733"}}>
    <Photo file="pepsi_splash.jpg" frame={frame} from={218} to={348} zoom0={1.36} zoom1={1.08} x0={80} x1={-55}/>
    <AbsoluteFill style={{background:"linear-gradient(0deg,#041126dd,transparent 56%,#061b38b8)"}}/>
    <ColdParticles frame={frame} count={114} opacity={1}/>
    <FrostGlass frame={frame}/>
    <MicroLabel x={102} y={124} opacity={E(rel(frame,231,251))}>THE IMPACT / 03</MicroLabel>
    <TypeLine x={98} y={686} size={156} opacity={p} offset={(1-p)*140} tracking="-.075em">UNLOCK</TypeLine>
    <TypeLine x={98} y={836} size={119} gradient opacity={q} offset={(1-q)*110} tracking="-.06em">THE CHILL.</TypeLine>
    <DecorRule x={105} y={1007} w={440*q} opacity={q}/>
    <div style={{position:"absolute",left:1150+70*move,top:165,width:460,height:460,borderRadius:"50%",border:"8px solid #d4f5ff61",opacity:.85-p*.45,transform:"scale("+(1.55-p*.28)+")",boxShadow:"0 0 120px #0e75da77"}}/>
    <Mist frame={frame} opacity={.72}/>
  </AbsoluteFill>;
}

const SceneFour = ({frame}) => {
  const a=fade(frame,328,450,16,1);
  const p=E(rel(frame,338,367));
  const q=E(rel(frame,350,387));
  const c=E(rel(frame,366,399));
  return <AbsoluteFill style={{opacity:a,background:"#04152d"}}>
    <Photo file="pepsi_ice.jpg" frame={frame} from={330} to={450} zoom0={1.21} zoom1={1.04}/>
    <AbsoluteFill style={{background:"linear-gradient(90deg,#020b21ee 0%,#020d24e3 34%,#02182f35 65%,#020a2060 100%)"}}/>
    <ColdParticles frame={frame} count={70} opacity={.7}/>
    <Mist frame={frame} opacity={.45}/>
    <MicroLabel x={145} y={148} opacity={p}>THE FINAL SIP / 04</MicroLabel>
    <TypeLine x={142} y={263} size={183} tracking="-.072em" opacity={p} offset={(1-p)*125}>PEPSI.</TypeLine>
    <DecorRule x={149} y={486} w={630*p}/>
    <TypeLine x={151} y={531} size={77} tone="ice" opacity={q} offset={(1-q)*70} tracking="-.051em">TASTE THE</TypeLine>
    <TypeLine x={147} y={619} size={133} gradient opacity={q} offset={(1-q)*85} tracking="-.06em">CHILL.</TypeLine>
    <div style={{
      position:"absolute",left:152,top:826,width:430,height:78,
      borderRadius:13,background:"#E52A4D",
      opacity:c,display:"flex",alignItems:"center",justifyContent:"center",
      transform:"translateY("+((1-c)*70)+"px)",
      boxShadow:"0 14px 32px rgba(7,10,39,.35)"
    }}>
      <div style={{fontSize:26,fontWeight:700,fontFamily:'"Manrope",sans-serif',color:"white",letterSpacing:".16em"}}>SERVE ICE-COLD</div>
    </div>
    <EditorialInfo x={153} y={967} opacity={c*.82} size={21}>UNOFFICIAL PRODUCT AD CONCEPT</EditorialInfo>
  </AbsoluteFill>;
};

export const PepsiColdBlock = () => {
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{background:"#031225",overflow:"hidden"}}>
    <Audio src={staticFile("assets/soundtrack.wav")} volume={0.86}/>
    <SceneOne frame={frame}/>
    <SceneTwo frame={frame}/>
    <SceneThree frame={frame}/>
    <SceneFour frame={frame}/>
    <AbsoluteFill style={{pointerEvents:"none",background:"radial-gradient(ellipse at center, transparent 28%,#00091679 98%)",mixBlendMode:"multiply"}}/>
    <div style={{position:"absolute",right:44,top:35,opacity:.78,color:"#dceefa",fontFamily:'"Space Grotesk",sans-serif',fontWeight:700,fontSize:18,letterSpacing:3}}>PEPSI / COLD BLOCK • 015</div>
  </AbsoluteFill>;
};
const Root = () => <Composition id="PepsiColdBlock" component={PepsiColdBlock} durationInFrames={450} fps={30} width={W} height={H}/>;
registerRoot(Root);
