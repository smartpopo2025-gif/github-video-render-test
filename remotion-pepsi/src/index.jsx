import React from "react";
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

const Text = ({children,x,y,size=120,align="left",color="white",tracking="-4px",opacity=1,scale=1,transform="",shadow=true,weight=950,italic=false}) => <div style={{
  position:"absolute",left:x,top:y,whiteSpace:"nowrap",fontFamily:'Impact,"Arial Black",sans-serif',fontWeight:weight,letterSpacing:tracking,
  lineHeight:1,color,opacity,fontSize:size,textAlign:align,fontStyle:italic,
  transform:"scale("+scale+") "+transform,
  textShadow:shadow?"0 8px 30px rgba(0,18,56,.65)":"none",
}}>{children}</div>;

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
  const a=fade(frame,0,125,7,18), drift=E(rel(frame,0,100)), pop=E(rel(frame,58,88));
  return <AbsoluteFill style={{opacity:a,background:"#031225"}}>
    <Photo file="pepsi_ice.jpg" frame={frame} from={0} to={115} zoom0={1.35} zoom1={1.12}/>
    <AbsoluteFill style={{background:"linear-gradient(90deg,#020b1dba,transparent 55%,#020e2b23)"}}/>
    <IceBlock frame={frame}/>
    <ColdParticles frame={frame} count={92} opacity={.85}/>
    <Mist frame={frame} opacity={.9}/>
    <FrostGlass frame={frame}/>
    <Text x={92} y={115} size={40} tracking="7px" color="#c6f3ff" opacity={lerp(frame,[0,13,100,119],[0,1,1,0])}>STRAIGHT FROM THE ICE</Text>
    <Text x={82} y={720} size={144} tracking="-7px" opacity={lerp(frame,[35,51,90,118],[0,1,1,0])} transform={"translateY("+(1-pop)*170+"px)"}>BREAK THE ICE.</Text>
    <Text x={94} y={900} size={39} tracking="8px" opacity={lerp(frame,[65,79,105,119],[0,1,1,0])} color="#cceeff">INSTANTLY COLDER.</Text>
    <AbsoluteFill style={{opacity:lerp(frame,[52,57,61],[0,.65,0]),background:"white",mixBlendMode:"screen"}}/>
  </AbsoluteFill>;
}

const SceneTwo = ({frame}) => {
  const local=frame-111, a=fade(frame,109,230,14,19),start=E(rel(frame,115,139));
  return <AbsoluteFill style={{opacity:a,background:"#03122b"}}>
    <Photo file="pepsi_dew.jpg" frame={frame} from={110} to={220} zoom0={1.22} zoom1={1.37} x0={-180} x1={-100} objectPosition="30% 48%"/>
    <AbsoluteFill style={{background:"linear-gradient(90deg,transparent 20%,#030d28c4 60%,#030d25e3 100%)"}}/>
    <Droplets frame={frame} opacity={.48}/>
    <ColdParticles frame={frame} count={38} opacity={.42}/>
    <Text x={1095} y={218} size={137} opacity={start} color="#ffffff" transform={"translateY("+(1-start)*95+"px)"}>SO COLD.</Text>
    <Text x={1110} y={385} size={113} opacity={E(rel(frame,129,152))} color="#a0ebff" transform={"translateY("+(1-E(rel(frame,129,152)))*90+"px)"}>YOU FEEL IT.</Text>
    <div style={{position:"absolute",left:1108,top:552,width:600*E(rel(frame,154,184)),height:8,background:"#e6faff",boxShadow:"0 0 24px #95e6ff"}}/>
    <Text x={1110} y={620} size={42} tracking="7px" color="#effcff" opacity={E(rel(frame,165,194))}>FROST • DROPS • FRESHNESS</Text>
    <Mist frame={frame} opacity={.45}/>
  </AbsoluteFill>;
}

const SceneThree = ({frame}) => {
  const a=fade(frame,216,351,16,17), p=E(rel(frame,226,277)),move=E(rel(frame,230,340));
  return <AbsoluteFill style={{opacity:a,background:"#051733"}}>
    <Photo file="pepsi_splash.jpg" frame={frame} from={218} to={348} zoom0={1.36} zoom1={1.08} x0={80} x1={-55}/>
    <AbsoluteFill style={{background:"linear-gradient(0deg,#0411269a,transparent 56%,#061b3890)"}}/>
    <ColdParticles frame={frame} count={114} opacity={1}/>
    <FrostGlass frame={frame}/>
    <Text x={82} y={110} size={46} tracking="8px" color="#d0faff" opacity={p}>THE MOMENT THE ICE BREAKS.</Text>
    <Text x={76} y={712} size={154} tracking="-8px" opacity={p} transform={"translateY("+(1-p)*180+"px)"}>UNLOCK</Text>
    <Text x={72} y={877} size={127} tracking="-6px" opacity={E(rel(frame,248,277))} color="#b7f5ff">THE CHILL.</Text>
    <div style={{position:"absolute",left:1150+70*move,top:165,width:460,height:460,borderRadius:"50%",border:"8px solid #d4f5ff61",opacity:.85-p*.45,transform:"scale("+(1.55-p*.28)+")",boxShadow:"0 0 120px #0e75da77"}}/>
    <Mist frame={frame} opacity={.72}/>
  </AbsoluteFill>;
}

const SceneFour = ({frame}) => {
  const a=fade(frame,328,450,16,0),p=E(rel(frame,336,379)),can=E(rel(frame,337,378));
  return <AbsoluteFill style={{opacity:a,background:"#04152d"}}>
    <Photo file="pepsi_ice.jpg" frame={frame} from={330} to={450} zoom0={1.21} zoom1={1.04}/>
    <AbsoluteFill style={{background:"linear-gradient(90deg,#020b21d9 0%,#020d249a 33%,transparent 58%,#020a20a0 100%)"}}/>
    <ColdParticles frame={frame} count={70} opacity={.7}/>
    <Mist frame={frame} opacity={.45}/>
    <div style={{position:"absolute",top:150,left:140,width:725,height:650,borderLeft:"8px solid #a5eeff",opacity:p,transform:"scaleY("+p+")",transformOrigin:"top left",boxShadow:"0 0 18px #77ddff"}}/>
    <Text x={205} y={200} size={203} tracking="-8px" opacity={p} transform={"translateY("+(1-p)*120+"px)"}>PEPSI.</Text>
    <Text x={209} y={435} size={81} tracking="-3px" opacity={E(rel(frame,350,386))} color="#c8f4ff">TASTE THE</Text>
    <Text x={205} y={531} size={153} tracking="-6px" opacity={E(rel(frame,356,390))}>CHILL.</Text>
    <div style={{position:"absolute",left:212,top:742,width:425,height:65,borderRadius:35,background:"#e5f9ff",opacity:can,display:"flex",alignItems:"center",justifyContent:"center",transform:"translateY("+(1-can)*50+"px)",boxShadow:"0 0 45px #5ac8ff66"}}>
      <div style={{fontSize:28,fontWeight:900,fontFamily:"Arial,sans-serif",color:"#062a5e",letterSpacing:5}}>SERVE ICE-COLD</div>
    </div>
    <Text x={198} y={951} size={25} tracking="6px" opacity={p*.83} color="#d6efff">UNOFFICIAL PRODUCT AD CONCEPT</Text>
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
    <div style={{position:"absolute",right:44,top:35,opacity:.78,color:"#dceefa",font:"bold 17px Arial,sans-serif",letterSpacing:4}}>PEPSI / COLD BLOCK • 015</div>
  </AbsoluteFill>;
};
const Root = () => <Composition id="PepsiColdBlock" component={PepsiColdBlock} durationInFrames={450} fps={30} width={W} height={H}/>;
registerRoot(Root);
