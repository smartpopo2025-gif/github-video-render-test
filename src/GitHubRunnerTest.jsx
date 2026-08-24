import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

export const GitHubRunnerTest = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const seconds = frame / fps;
  const progress = frame / (durationInFrames - 1);
  const titleY = interpolate(frame, [0, 30], [70, 0], clamp);
  const titleOpacity = interpolate(frame, [0, 25, durationInFrames - 40, durationInFrames - 1], [0, 1, 1, 0], clamp);
  const pulse = 1 + 0.025 * Math.sin(frame / 10);
  const orbX = 90 + progress * (width - 220);
  const orbY = 555 + Math.sin(frame / 18) * 150;
  const ringRotation = frame * 0.8;
  const segment = Math.min(4, Math.floor(seconds / 30) + 1);

  const bars = Array.from({length: 14}, (_, i) => {
    const h = 45 + 120 * (0.5 + 0.5 * Math.sin(frame / 11 + i * 0.8));
    return (
      <div
        key={i}
        style={{
          width: 28,
          height: h,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.72)',
          transform: `translateY(${Math.sin(frame / 14 + i) * 18}px)`,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #172554 46%, #312e81 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
    }}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.22, backgroundImage: 'radial-gradient(circle at 20% 20%, white 0 2px, transparent 3px), radial-gradient(circle at 80% 70%, white 0 2px, transparent 3px)', backgroundSize: '120px 120px, 150px 150px'}} />

      <div style={{position: 'absolute', left: orbX, top: orbY, width: 120, height: 120, borderRadius: '50%', background: 'rgba(96,165,250,0.9)', boxShadow: '0 0 70px rgba(96,165,250,0.75)'}} />
      <div style={{position: 'absolute', left: orbX - 34, top: orbY - 34, width: 188, height: 188, border: '5px solid rgba(255,255,255,0.3)', borderRadius: '50%', transform: `rotate(${ringRotation}deg)`, borderTopColor: 'white'}} />

      <div style={{position: 'absolute', top: 105, width: '100%', textAlign: 'center', opacity: titleOpacity, transform: `translateY(${titleY}px) scale(${pulse})`}}>
        <div style={{fontSize: 76, fontWeight: 900, letterSpacing: 2}}>GITHUB PARALLEL RENDER BENCHMARK</div>
        <div style={{fontSize: 36, marginTop: 18, opacity: 0.84}}>1920×1080 • 30 FPS • 2 minutes • 3,600 frames</div>
      </div>

      <div style={{position: 'absolute', left: 120, top: 340, fontSize: 34, lineHeight: 1.65, opacity: 0.94}}>
        <div>✓ Single-runner baseline: 4 logical CPUs</div>
        <div>✓ Parallel test: 4 runners × 30-second segments</div>
        <div>✓ Final segments merged losslessly with FFmpeg concat</div>
        <div>✓ Current segment: {segment} / 4</div>
      </div>

      <div style={{position: 'absolute', right: 130, top: 390, display: 'flex', gap: 18, alignItems: 'flex-end', height: 210}}>
        {bars}
      </div>

      <div style={{position: 'absolute', left: 120, right: 120, bottom: 125, background: 'rgba(0,0,0,0.38)', borderRadius: 26, padding: '30px 38px', backdropFilter: 'blur(8px)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 38, fontWeight: 800}}>Cloud Runner Scaling Test</div>
          <div style={{fontSize: 36, fontVariantNumeric: 'tabular-nums'}}>{seconds.toFixed(1)} / 120.0 s</div>
        </div>
        <div style={{height: 22, background: 'rgba(255,255,255,0.18)', borderRadius: 12, marginTop: 24, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${Math.min(100, progress * 100)}%`, background: 'white', borderRadius: 12}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
