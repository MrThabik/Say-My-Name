// src/app/page.tsx
import CinematicVideo from "@/components/CinematicVideo";
import Certifications from "@/components/sections/Certifications";
import { profile, experience, education, skillGroups, projects, languages } from "@/lib/portfolio";

export default function Home() {
  return (
    <main className="relative z-10">
      <CinematicVideo />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="font-mono text-xs tracking-[0.5em] uppercase text-[#ff2d4d]">
          {"//"} {profile.location}
        </p>
        <h1 className="mt-4 text-5xl md:text-8xl font-black tracking-tighter">
          {profile.name}
        </h1>
        <p className="mt-3 text-xl md:text-2xl text-neutral-300">{profile.role}</p>
        <p className="mt-6 max-w-xl text-neutral-400">{profile.tagline}</p>

        <div className="mt-12 flex gap-10">
          {profile.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#ff2d4d]">{s.value}</p>
              <p className="mt-1 text-[10px] md:text-xs uppercase tracking-widest text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 font-mono text-xs">
          <a href={`mailto:${profile.email}`} className="px-5 py-3 border border-[#c40024]/60 text-[#ff2d4d] hover:bg-[#c40024]/10 transition-colors tracking-widest">
            [ EMAIL ]
          </a>
          <a href="#certifications" className="px-5 py-3 border border-white/20 text-neutral-300 hover:border-white/50 transition-colors tracking-widest">
            [ CREDENTIALS ]
          </a>
        </div>
      </section>

      {/* About / Professional Summary */}
      <section className="max-w-3xl mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold mb-6">// Professional Summary</h2>
        <p className="text-neutral-300 leading-relaxed">{profile.bio}</p>
        <p className="mt-6 font-mono text-xs text-neutral-500 tracking-widest">
          LANGUAGES: {languages.join(" · ")} — NATIONALITY: INDIAN
        </p>
      </section>

      {/* Experience */}
      <section className="max-w-4xl mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold mb-10">// Experience</h2>
        <div className="space-y-8">
          {experience.map((job) => (
            <div key={job.company} className="border-l-2 border-[#c40024] pl-6">
              <div className="flex flex-wrap items-baseline gap-x-4">
                <h3 className="text-xl font-semibold">{job.role}</h3>
                <span className="font-mono text-xs text-neutral-500">{job.period}</span>
              </div>
              <p className="text-[#ff2d4d] text-sm mt-1">
                {job.company} — <span className="text-neutral-400">{job.location}</span>
              </p>
              <ul className="mt-3 space-y-2 text-neutral-400 list-none">
                {job.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#c40024] mt-1">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.stack.map((t) => (
                  <span key={t} className="font-mono text-[10px] px-2 py-1 rounded border border-white/15 bg-white/5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="max-w-4xl mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold mb-10">// Education</h2>
        <div className="space-y-8">
          {education.map((edu) => (
            <div key={edu.title} className="border-l-2 border-[#c40024] pl-6">
              <div className="flex flex-wrap items-baseline gap-x-4">
                <h3 className="text-lg font-semibold">{edu.title}</h3>
                <span className="font-mono text-xs text-neutral-500">{edu.period}</span>
              </div>
              <p className="text-neutral-400 text-sm mt-1">{edu.school}</p>
              <p className="font-mono text-xs text-[#ff2d4d] mt-2">{edu.result}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="max-w-4xl mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold mb-10">// Technical & Practical Competencies</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skillGroups.map((g) => (
            <div key={g.group} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-sm font-semibold text-[#ff2d4d] tracking-wide">{g.group}</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {g.items.map((s) => (
                  <span key={s} className="px-2 py-1 rounded border border-white/10 bg-white/5 text-xs text-neutral-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Project */}
      <section className="max-w-4xl mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold mb-10">// Academic Engineering Project</h2>
        <div className="grid md:grid-cols-1 gap-6">
          {projects.map((p) => (
            <div key={p.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-6 hover:border-[#c40024]/50 transition-colors">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-neutral-400 text-sm mt-2">{p.summary}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {p.tech.map((t) => (
                  <span key={t} className="font-mono text-[10px] text-[#ff2d4d]">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications — 3D draggable circle gallery */}
      <Certifications />
    </main>
  );
}
