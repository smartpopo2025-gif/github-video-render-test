# Pepsi Ice-Block — Remotion 15-second Concept Ad

A 450-frame, 1920x1080, 30 fps **Remotion** commercial created in React.

## Style
- 0–4 s: frozen can / ice-block shatters / camera reveal
- 4–7.5 s: condensation and frost macro
- 7.5–11.5 s: splash and flying ice with refractive mist
- 11.5–15 s: hero packshot / TASTE THE CHILL

Uses frame-accurate React animation with useCurrentFrame, interpolate, and easing. Original music and SFX synthesized by scripts/make-audio.cjs.

## Photo credits
Free-to-use product photos from Pexels, downloaded by the GitHub workflow:
- HS Studio By Hussnain: https://www.pexels.com/photo/pepsi-can-surrounded-by-ice-with-green-mist-30554816/
- Sahil Captures: https://www.pexels.com/photo/pepsi-can-in-dew-17461398/
- Vladimir Shipitsin: https://www.pexels.com/photo/close-up-shot-of-a-can-of-pepsi-11659356/

This is an unofficial concept ad and is not commissioned or endorsed by PepsiCo.

## Local render
From the remotion-pepsi directory:
1. npm install
2. bash scripts/fetch-assets.sh
3. node scripts/make-audio.cjs
4. npx remotion render src/index.jsx PepsiColdBlock out/PEPSI_COLD_BLOCK_REMOTION_15S.mp4 --codec=h264 --concurrency=2

## Parallel GitHub rendering
Workflow .github/workflows/remotion-pepsi-15s.yml on branch feature/remotion-pepsi-cold-block-15s.
- Three separate 5-second GitHub Ubuntu CPU jobs: frames 0-149, 150-299, 300-449.
- Two Chromium tabs per job; three jobs run in parallel.
- Final job joins segments and adds the 15-second soundtrack.
- FFprobe verification: 450 video frames, 1920x1080, 15 seconds, audio.
- Uploads downloadable MP4 and four contact-sheet stills.
