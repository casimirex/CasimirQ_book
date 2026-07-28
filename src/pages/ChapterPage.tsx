import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { CHAPTERS, PARTS, chapterBySlug, chapterIndex } from '@/content/registry';
import { markRead, useProgress } from '@/lib/progress';

export function ChapterPage() {
  const { slug = '' } = useParams();
  const chapter = chapterBySlug(slug);
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { read } = useProgress();

  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight + 200;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(total, 1)));
      setProgress(p);
      if (p > 0.82 && chapter) markRead(chapter.slug);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [chapter]);

  if (!chapter) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-3 font-display text-2xl font-700">Chapter not found</h1>
        <Link to="/" className="text-primary hover:underline">← Back to the cover</Link>
      </div>
    );
  }

  const idx = chapterIndex(slug);
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null;
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
  const part = PARTS.find((p) => p.id === chapter.part);
  const Icon = chapter.icon;
  const Body = chapter.Component;
  const isRead = read.has(chapter.slug);

  return (
    <div>
      {/* reading progress bar */}
      <div className="fixed left-0 top-0 z-40 h-0.5 w-full bg-transparent lg:pl-[300px]">
        <div className="h-full bg-gradient-to-r from-primary to-quantum-violet transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>

      <div ref={bodyRef} className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:px-8">
        {/* header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-primary/70">
            <span>Part {chapter.part} · {part?.title}</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-glow-soft">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-mono text-sm text-muted">Chapter {String(chapter.number).padStart(2, '0')}</div>
              <h1 className="font-display text-3xl font-800 leading-tight text-ink sm:text-4xl">{chapter.title}</h1>
              <p className="mt-1 text-lg text-muted">{chapter.subtitle}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {chapter.minutes} min read</span>
            {isRead && <span className="flex items-center gap-1.5 text-quantum-green"><CheckCircle2 className="h-3.5 w-3.5" /> Completed</span>}
          </div>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/40 via-border to-transparent" />
        </div>

        {/* body */}
        <article className="prose-book">
          <Body />
        </article>

        {/* prev / next */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link to={`/ch/${prev.slug}`} className="group rounded-xl border border-border bg-surface/50 p-4 transition hover:border-primary/50 hover:bg-surface">
              <div className="flex items-center gap-1.5 text-xs text-muted"><ArrowLeft className="h-3.5 w-3.5" /> Previous</div>
              <div className="mt-1 font-600 text-ink group-hover:text-primary">{prev.title}</div>
            </Link>
          ) : <div />}
          {next ? (
            <Link to={`/ch/${next.slug}`} className="group rounded-xl border border-border bg-surface/50 p-4 text-right transition hover:border-primary/50 hover:bg-surface">
              <div className="flex items-center justify-end gap-1.5 text-xs text-muted">Next <ArrowRight className="h-3.5 w-3.5" /></div>
              <div className="mt-1 font-600 text-ink group-hover:text-primary">{next.title}</div>
            </Link>
          ) : (
            <Link to="/" className="group rounded-xl border border-primary/30 bg-primary/5 p-4 text-right transition hover:bg-primary/10">
              <div className="flex items-center justify-end gap-1.5 text-xs text-muted">Finish <ArrowRight className="h-3.5 w-3.5" /></div>
              <div className="mt-1 font-600 text-primary">Back to the cover</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
