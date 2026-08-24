import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const GitHubRunnerTest = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const seconds = frame / fps;
  const progress = frame / (durationInFrames - 1);
  const titleY = interpolate(frame, [0, 25], [50, 0], {extrapolateRight: 'clamp'});
  const titleOpacity = interpolate(frame, [0, 20, durationInFrames - 30, durationInFrames - 1], [0, 1, 1, 0]);
  const pulse = 1 + 0.03 * Math.sin(frame / 8);
  const orbX = 80 + progress * 1080;
  const orbY = 400 + Math.sin(frame / 20) * 90;

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 45%, #312e81 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{position: 'absolute', left: orbX, top: orbY, width: 90, height: 90, borderRadius: '50%', background: 'rgba(96,165,250,0.85)', boxShadow: '0 0 45px rgba(96,165,250,0.6)'}} />
      <div style={{position: 'absolute', top: 95, width: '100%', textAlign: 'center', opacity: titleOpacity, transform: `translateY(${titleY}px) scale(${pulse})`}}>
        <div style={{fontSize: 58, fontWeight: 800}}>GITHUB ACTIONS RENDER TEST</div>
        <div style={{fontSize: 28, marginTop: 12, opacity: 0.82}}>Remotion • FFmpeg • Python • 20 seconds</div>
      </div>

      <div style={{position: 'absolute', left: 90, right: 90, bottom: 120, background: 'rgba(0,0,0,0.38)', borderRadius: 18, padding: '24px 30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 30, fontWeight: 700}}>Cloud Runner Proof</div>
          <div style={{fontSize: 28, fontVariantNumeric: 'tabular-nums'}}>{seconds.toFixed(1)} / 20.0 s</div>
        </div>
        <div style={{height: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 10, marginTop: 20, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${Math.min(100, progress * 100)}%`, background: 'white', borderRadius: 10}} />
        </div>
      </div>

      <div style={{position: 'absolute', left: 90, top: 280, fontSize: 27, lineHeight: 1.6, opacity: 0.92}}>
        <div>✓ 1280×720 @ 30 FPS</div>
        <div>✓ 600 Remotion frames</div>
        <div>✓ Animated title + timer + progress</div>
        <div>✓ Rendered on GitHub-hosted Ubuntu</div>
      </div>
    </AbsoluteFill>
  );
};
