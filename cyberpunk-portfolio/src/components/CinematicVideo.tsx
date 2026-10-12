// src/components/CinematicVideo.tsx
// CINEMATIC CURSOR & SCROLL VIDEO ENGINE
// A 5–10s video is scrubbed by cursor X + scroll progress so it feels
// like an interactive 3D model. LERP-smoothed frame seeking, never
// gated on readyState, seek queue wrapped in try/catch.
"use client";

import { useEffect, useRef } from "react";

interface CinematicVideoProps {
  src?: string;
  className?: string;
}

export default function CinematicVideo({
  src = "/video/portfolio-background.mp4",
  className = "",
}: CinematicVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  // LERP state — refs so the RAF loop never re-renders
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const durationRef = useRef(5);
  const readyRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // ---- normalized cursor / scroll state ----
    const pointer = { x: 0.5, y: 0.5 }; // 0..1
    const eased = { x: 0.5, y: 0.5 };   // lerped for buttery tilt

    // Do NOT gate seeking behind readyState >= 2.
    const onMeta = () => {
      durationRef.current = video.duration || 5;
      readyRef.current = true;
      video.pause();
      try { video.currentTime = 0; } catch {}
    };
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("canplay", onMeta);

    const onMouse = (e: MouseEvent) => {
      pointer.x = e.clientX / window.innerWidth;   // 0..1 across window
      pointer.y = e.clientY / window.innerHeight;

      // dynamic cursor-tracking spotlight (.cine-glow)
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(at ${pointer.x * 100}% ${pointer.y * 100}%, rgba(196,0,36,0.18), transparent 60%)`;
      }
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ---- RAF loop: LERP seek + parallax tilt ----
    let raf = 0;
    const tick = () => {
      // scroll progress across full document height
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const scrollP = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // target time = blend of cursor X and scroll progress
      // (tune the blend to taste: cursor leads, scroll rides on top)
      const blend = pointer.x * 0.45 + scrollP * 0.55;
      targetRef.current = blend * durationRef.current;

      // frame-seeking LERP
      currentRef.current += (targetRef.current - currentRef.current) * 0.10;

      // only seek when the delta is meaningful (> 0.001s)
      if (readyRef.current && Math.abs(currentRef.current - video.currentTime) > 0.001) {
        try { video.currentTime = currentRef.current; } catch {}
      }

      // ambient scroll progress bar (2px, red glow)
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${scrollP})`;
      }

      // interactive 3D parallax tilt (lerped pointer for smoothness)
      eased.x += (pointer.x - eased.x) * 0.08;
      eased.y += (pointer.y - eased.y) * 0.08;
      const dx = eased.x - 0.5;
      const dy = eased.y - 0.5;
      container.style.transform =
        `scale(1.06) translate3d(${dx * -15}px, ${dy * -15}px, 0) ` +
        `rotateX(${dy * -2}deg) rotateY(${dx * 2}deg)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("canplay", onMeta);
    };
  }, []);

  return (
    <>
      {/* ambient scroll progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[70] pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-[#c40024] shadow-[0_0_12px_2px_rgba(196,0,36,0.8)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* cinematic stage */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          ref={containerRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <video
            ref={videoRef}
            src={src}
            playsInline
            muted
            preload="auto"
            className={`w-full h-full object-cover ${className}`}
          />
        </div>

        {/* layered cinematic overlays (defined in globals.css) */}
        <div id="cine-glow" ref={glowRef} className="cine-glow" />
        <div className="cine-vignette" />
        <div className="cine-scan" />
        <div className="cine-grain" />
      </div>
    </>
  );
}
