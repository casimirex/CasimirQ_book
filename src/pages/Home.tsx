import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles, Atom, Cpu, Boxes, CheckCircle2 } from 'lucide-react';
import { QuantumUniverse } from '@/components/QuantumUniverse';
import { CHAPTERS, PARTS } from '@/content/registry';
import { useProgress } from '@/lib/progress';

export function Home() {
  const { read } = useProgress();
  const pct = Math.round((read.size / CHAPTERS.length) * 100);
  const first = CHAPTERS[0];
  const resume = CHAPTERS.find((c) => !read.has(c.slug)) ?? first;

  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <QuantumUniverse className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-24 text-center sm:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-600 text-primary backdrop-blur animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" /> An interactive book · powered by the CasimirQ platform
          </div>
          <h1 className="animate-fade-up font-display text-5xl font-800 leading-[1.05] tracking-tight sm:text-7xl" style={{ animationDelay: '60ms' }}>
            Mastering
            <br />
            <span className="text-gradient">Quantum Computing</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-muted sm:text-xl" style={{ animationDelay: '120ms' }}>
            From <span className="text-ink">“what on earth is a qubit?”</span> to running{' '}
            <span className="text-ink">genuine quantum algorithms</span> — a from-scratch journey
            written so a curious beginner and a working engineer can both feel at home. Real circuits,
            live platform screenshots, runnable SDK code.
          </p>

          <div className="mt-9 flex animate-fade-up flex-wrap items-center justify-center gap-3" style={{ animationDelay: '180ms' }}>
            <Link
              to={`/ch/${resume.slug}`}
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-600 text-bg shadow-glow transition hover:brightness-110"
            >
              <BookOpen className="h-5 w-5" />
              {read.size > 0 ? 'Resume reading' : 'Start reading'}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="#contents"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-6 py-3.5 font-600 text-ink backdrop-blur transition hover:border-primary/50"
            >
              Browse the contents
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl animate-fade-up grid-cols-3 gap-4" style={{ animationDelay: '240ms' }}>
            {[
              { icon: Atom, big: '22', small: 'chapters, A → Z' },
              { icon: Cpu, big: '14', small: 'real algorithms' },
              { icon: Boxes, big: '3', small: 'surfaces: UI · SDK · API' },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl px-4 py-5">
                <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <div className="font-display text-3xl font-800 text-ink">{s.big}</div>
                <div className="text-xs text-muted">{s.small}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROGRESS ---------------- */}
      {read.size > 0 && (
        <section className="mx-auto max-w-4xl px-6">
          <div className="glass flex items-center gap-4 rounded-2xl px-6 py-4">
            <div className="flex-1">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-600 text-ink">Your progress</span>
                <span className="text-muted">{read.size}/{CHAPTERS.length} chapters · {pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div className="h-full bg-gradient-to-r from-primary to-quantum-violet" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- CONTENTS ---------------- */}
      <section id="contents" className="mx-auto max-w-4xl scroll-mt-8 px-6 py-16">
        <h2 className="mb-2 font-display text-3xl font-800">The Blueprint</h2>
        <p className="mb-10 text-muted">Five parts. Read cover to cover, or jump to the idea you need.</p>

        <div className="space-y-12">
          {PARTS.map((part) => (
            <div key={part.id}>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-display text-5xl font-800 text-primary/15">{part.id}</span>
                <div>
                  <h3 className="font-display text-xl font-700 text-ink">{part.title}</h3>
                  <p className="text-sm text-muted">{part.tag}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {CHAPTERS.filter((c) => c.part === part.id).map((c) => {
                  const Icon = c.icon;
                  const done = read.has(c.slug);
                  return (
                    <Link
                      key={c.slug}
                      to={`/ch/${c.slug}`}
                      className="group flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-4 transition hover:border-primary/50 hover:bg-surface"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-muted/60">{String(c.number).padStart(2, '0')}</span>
                          <span className="truncate font-600 text-ink group-hover:text-primary">{c.title}</span>
                          {done && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-quantum-green" />}
                        </div>
                        <p className="mt-0.5 truncate text-sm text-muted">{c.subtitle}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 border-t border-border pt-8 text-center text-sm text-muted">
          <p>
            Built on <span className="text-primary">CasimirQ</span> — a full-stack quantum computing platform
            (NestJS backend · React UI · Rust SDK). Every screenshot in this book is the live application.
          </p>
          <p className="mt-2 text-xs text-muted/60">© {new Date().getFullYear()} · Written for the curious. Turn the page, turn the universe.</p>
        </footer>
      </section>
    </div>
  );
}
