// src/components/sections/Certifications.tsx
// 3D DRAGGABLE CIRCLE GALLERY FOR CERTIFICATIONS
// Cylinder at translateZ(-R) rotateY(angle); each card at
// translate(-50%,-50%) rotateY(i*step) translateZ(R) so the front
// card lands exactly at Z = 0 (scale 1.0, no ballooning).
// Unified Pointer Events, multi-sample velocity, throw inertia
// (0.945 decay), gentle auto-spin (0.06°/frame), backface culling.
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Real certifications from Thaseen Shabik N's résumé.
// credentialCode / sha256 are deterministic stylistic identifiers for the
// cybernetic verification modal — swap in real credential IDs if desired.
// ---------------------------------------------------------------------------
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialCode: string;
  sha256: string;        // "SHA256://..." verification hash
  verifiedDate: string;
  competencies: string[];
  accent: string;        // brand-colored laser top beam
}

export const CERTS: Certification[] = [
  {
    id: "cert-ai",
    title: "Artificial Intelligence Track",
    issuer: "Naan Mudhalvan × Microsoft (Infispark)",
    year: "2024",
    credentialCode: "NM-MSFT-AI-040124",
    sha256: "SHA256://4f2a…9c1d//naanmudhalvan//ai-track//verified",
    verifiedDate: "Jan 04, 2024",
    competencies: ["All About AI", "ChatGPT (Part I & II)", "AI in MS Office", "AI Tools for Design", "AI for Social Good"],
    accent: "#0078d4",
  },
  {
    id: "cert-productivity",
    title: "Digital Productivity Track",
    issuer: "Naan Mudhalvan × Microsoft (Infispark)",
    year: "2024",
    credentialCode: "NM-MSFT-DP-040124",
    sha256: "SHA256://7b19…e302//naanmudhalvan//productivity//verified",
    verifiedDate: "Jan 04, 2024",
    competencies: ["MS Word / Excel / PowerPoint", "Teams · Outlook · OneDrive · SharePoint", "Digital Payments", "Emerging Technologies"],
    accent: "#00a86b",
  },
  {
    id: "cert-entrepreneurship",
    title: "Entrepreneurship Track",
    issuer: "Naan Mudhalvan × Microsoft (Infispark)",
    year: "2024",
    credentialCode: "NM-MSFT-EN-040124",
    sha256: "SHA256://c884…51af//naanmudhalvan//entrepreneurship//verified",
    verifiedDate: "Jan 04, 2024",
    competencies: ["Startup Journey in Nutshell", "Business Ideas & Models", "Ideas to Kickstart", "Government Schemes & Business Loans"],
    accent: "#ffb800",
  },
  {
    id: "cert-employability",
    title: "Employability & Communication",
    issuer: "Naan Mudhalvan × Microsoft (Infispark)",
    year: "2024",
    credentialCode: "NM-MSFT-EC-040124",
    sha256: "SHA256://d9c2…77b4//naanmudhalvan//employability//verified",
    verifiedDate: "Jan 04, 2024",
    competencies: ["LinkedIn Profile Management", "Searching Jobs Online", "Verbal & Non-Verbal Communication"],
    accent: "#8a2be2",
  },
  {
    id: "cert-startup",
    title: "Financial Requirements & Govt. Schemes for a Startup",
    issuer: "Naan Mudhalvan — Govt. of Tamil Nadu",
    year: "2024",
    credentialCode: "NM-STATE-M4-090124",
    sha256: "SHA256://e0a7…3d96//naanmudhalvan//state-m4//verified",
    verifiedDate: "Jan 09, 2024",
    competencies: ["Startup Financial Requirements", "Government Schemes", "Module 4 — State Upskilling Course"],
    accent: "#c40024",
  },
];

// ---------------------------------------------------------------------------
const AUTO_SPIN = 0.06;   // degrees per frame when idle
const FRICTION = 0.945;   // throw inertia decay per frame
const EPSILON = 0.02;     // idle threshold (deg)

function radiusForWidth(w: number): number {
  if (w < 640) return 275;   // mobile
  if (w < 1024) return 380;  // tablet
  return 480;                // desktop
}

export default function Certifications({ items = CERTS }: { items?: Certification[] }) {
  const N = items.length;
  const step = 360 / N;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [angle, setAngle] = useState(0);
  const angleRef = useRef(0);

  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const samplesRef = useRef<{ x: number; t: number }[]>([]);
  const idleRef = useRef(true);
  const [autoSpin, setAutoSpin] = useState(true);
  const autoSpinRef = useRef(true);

  const [R, setR] = useState(480);
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<Certification | null>(null);

  useEffect(() => {
    autoSpinRef.current = autoSpin;
  }, [autoSpin]);

  useEffect(() => {
    const onResize = () => setR(radiusForWidth(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ---- main animation loop: inertia + auto-spin + angle commit ----
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > EPSILON) {
          // throw inertia with friction damping
          angleRef.current += velocityRef.current;
          velocityRef.current *= FRICTION;
          idleRef.current = false;
        } else {
          velocityRef.current = 0;
          if (autoSpinRef.current && idleRef.current) {
            angleRef.current += AUTO_SPIN;
          }
          idleRef.current = true;
        }
      }
      setAngle(angleRef.current);
      // front card index (card i is front when angle + i*step ≡ 0 mod 360)
      const front = ((Math.round(-angleRef.current / step) % N) + N) % N;
      setActive(front);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [N, step]);

  // ---- unified pointer events with setPointerCapture ----
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true;
    idleRef.current = false;
    velocityRef.current = 0;
    samplesRef.current = [];
    lastXRef.current = e.clientX;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    angleRef.current += dx * 0.25; // drag sensitivity (deg per px)

    const now = performance.now();
    samplesRef.current.push({ x: e.clientX, t: now });
    // multi-sample velocity tracking (keep last ~100ms)
    samplesRef.current = samplesRef.current.filter((s) => now - s.t <= 100);
    if (samplesRef.current.length >= 2) {
      const a = samplesRef.current[0];
      const b = samplesRef.current[samplesRef.current.length - 1];
      const dt = Math.max(1, b.t - a.t);
      velocityRef.current = ((b.x - a.x) / dt) * 4; // px/ms -> deg/frame scaled
    }
  }, []);

  const endDrag = useCallback(() => {
    draggingRef.current = false;
  }, []);

  // ---- click a card: shortest rotational delta to front ----
  const focusCard = useCallback(
    (i: number) => {
      // desired final angle: -(i * step) (mod 360)
      const desired = -i * step;
      const delta = ((desired - angleRef.current) % 360 + 540) % 360 - 180;
      // glide via a decaying velocity proportional to the delta
      const frames = 40;
      velocityRef.current = delta / frames;
    },
    [step]
  );

  const onCardClick = useCallback(
    (i: number) => {
      if (i === active) {
        setModal(items[i]); // front card -> verification modal
      } else {
        focusCard(i);
      }
    },
    [active, items, focusCard]
  );

  // backface culling: hide card when its outward normal faces away
  const visibility = useMemo(() => {
    return items.map((_, i) => {
      const phi = ((angle + i * step) % 360) * (Math.PI / 180);
      return Math.cos(phi) >= 0; // cos(phi) < 0 => facing away
    });
  }, [angle, items, step]);

  return (
    <section id="certifications" className="relative py-28 overflow-hidden">
      <div className="text-center mb-4">
        <p className="text-[#c40024] font-mono text-xs tracking-[0.4em] uppercase">// credentials</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">Certifications</h2>
        <p className="text-neutral-400 text-sm mt-3">Drag the ring · click a card to center it · click the front card to verify</p>
      </div>

      {/* auto-spin toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setAutoSpin((v) => !v)}
          className="font-mono text-[11px] tracking-widest px-4 py-2 border border-[#c40024]/50 text-[#ff2d4d] hover:bg-[#c40024]/10 transition-colors"
        >
          [ AUTO-SPIN {autoSpin ? "ON" : "PAUSED"} ]
        </button>
      </div>

      {/* 3D stage */}
      <div
        ref={stageRef}
        className="relative mx-auto select-none touch-none cursor-grab active:cursor-grabbing"
        style={{ width: "100%", height: 420, perspective: "1400px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {/* cylinder — pulled back by -R so the front card sits at Z = 0 */}
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${-R}px) rotateY(${angle}deg)`,
          }}
        >
          {items.map((cert, i) => (
            <div
              key={cert.id}
              onClick={() => onCardClick(i)}
              className="absolute left-1/2 top-1/2 w-[240px] h-[320px] rounded-lg transition-opacity duration-200"
              style={{
                transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${R}px)`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                opacity: visibility[i] ? 1 : 0,
                pointerEvents: visibility[i] ? "auto" : "none",
              }}
            >
              {/* dark obsidian glass card */}
              <div className="relative h-full w-full rounded-lg bg-[#0a0a0f]/90 backdrop-blur border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                {/* brand-colored laser top beam */}
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: cert.accent, boxShadow: `0 0 12px ${cert.accent}` }} />
                <div className="p-5 h-full flex flex-col">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">{cert.issuer}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">{cert.title}</h3>
                  <p className="mt-1 text-xs text-neutral-400">{cert.year}</p>
                  <div className="flex-1" />
                  {/* monospace credential code chip */}
                  <div className="inline-flex self-start font-mono text-[10px] px-2 py-1 rounded border border-white/15 bg-white/5 text-neutral-300">
                    {cert.credentialCode}
                  </div>
                  <button
                    className="mt-3 font-mono text-[10px] text-left tracking-widest text-[#ff2d4d]"
                    onClick={(e) => { e.stopPropagation(); onCardClick(i); }}
                  >
                    {i === active ? "[ VERIFY ]" : "[ CENTER ]"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* pagination dots */}
      <div className="flex justify-center gap-3 mt-8">
        {items.map((c, i) => (
          <button
            key={c.id}
            aria-label={`Go to ${c.title}`}
            onClick={() => focusCard(i)}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === active ? 24 : 8,
              background: i === active ? "#c40024" : "rgba(255,255,255,0.2)",
              boxShadow: i === active ? "0 0 10px rgba(196,0,36,0.8)" : "none",
            }}
          />
        ))}
      </div>

      {/* cybernetic verification modal */}
      {modal && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-md rounded-lg border border-white/10 bg-[#0a0a0f] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: modal.accent, boxShadow: `0 0 12px ${modal.accent}` }} />
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#ff2d4d]">// credential verified</p>
            <h3 className="mt-3 text-2xl font-bold">{modal.title}</h3>
            <p className="text-neutral-400 text-sm mt-1">{modal.issuer} · {modal.year}</p>

            <div className="mt-5 font-mono text-[11px] leading-relaxed border border-white/10 bg-black/40 rounded p-3 break-all text-emerald-400">
              {modal.sha256}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="border border-white/10 rounded p-3">
                <p className="text-neutral-500 uppercase tracking-widest text-[10px]">Verified</p>
                <p className="mt-1">{modal.verifiedDate}</p>
              </div>
              <div className="border border-white/10 rounded p-3">
                <p className="text-neutral-500 uppercase tracking-widest text-[10px]">Issuer Badge</p>
                <p className="mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: modal.accent, boxShadow: `0 0 8px ${modal.accent}` }} />
                  {modal.issuer}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-neutral-500 uppercase tracking-widest text-[10px] mb-2">Competencies</p>
              <div className="flex flex-wrap gap-2">
                {modal.competencies.map((c) => (
                  <span key={c} className="font-mono text-[10px] px-2 py-1 rounded border border-white/15 bg-white/5">{c}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setModal(null)}
              className="mt-6 w-full font-mono text-xs tracking-[0.3em] py-3 border border-[#c40024]/60 text-[#ff2d4d] hover:bg-[#c40024]/10 transition-colors"
            >
              [ CLOSE ]
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
