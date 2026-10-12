# Thaseen Shabik N — Cyberpunk Portfolio

Dark, cinematic portfolio for Thaseen Shabik N (Electrical & Electronics
Diploma Engineer — FANUC robotics / VMC / HPDC, TVS Sundaram-Clayton).
The signature engine turns a short video (`public/video/portfolio-background.mp4`)
into an interactive 3D-feeling background scrubbed by cursor + scroll.

## Quick start

```bash
npm install
npm run dev
```

## Architecture

- `src/components/CinematicVideo.tsx` — cursor + scroll video scrub engine.
  Cursor X (0–1) and scroll progress are blended into a target time; a RAF
  loop LERPs `current += (target - current) * 0.10` and only seeks when
  delta > 0.001s (wrapped in try/catch, never gated on readyState).
  Also drives the 3D parallax tilt and the cursor-tracking spotlight.
- `src/components/sections/Certifications.tsx` — 3D draggable cylinder
  gallery of the résumé's Naan Mudhalvan / Microsoft certifications.
  Cylinder at `translateZ(-R) rotateY(angle)`, cards at
  `translate(-50%,-50%) rotateY(i*step) translateZ(R)` so the front card
  sits at Z = 0. Pointer Events + setPointerCapture, multi-sample velocity,
  throw inertia at 0.945 decay, auto-spin 0.06°/frame with ON/PAUSED toggle,
  backface culling via cos(phi) < 0, clickable pagination dots, and a
  verification modal per cert.
- `src/app/globals.css` — `.cine-vignette`, `.cine-glow`, `.cine-grain`,
  `.cine-scan` overlays and the red glowing 2px scroll progress bar.
- `src/lib/portfolio.ts` — all résumé data (profile, experience, education,
  skills, projects).

Note: the credential codes / SHA256 strings in the verification modals are
deterministic stylistic identifiers, not real certificate hashes — swap in
real credential IDs if you have them.
