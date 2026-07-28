import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Atom, Search, Check } from 'lucide-react';
import clsx from 'clsx';
import { CHAPTERS, PARTS } from '@/content/registry';
import { useProgress } from '@/lib/progress';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const { read } = useProgress();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return CHAPTERS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 border-b border-border px-5 py-5"
      >
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Atom className="h-5 w-5 text-primary" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-base font-700 text-ink">casimirQ</div>
          <div className="text-[11px] text-muted">Mastering Quantum Computing</div>
        </div>
      </Link>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters…"
            className="w-full rounded-lg border border-border bg-surface/60 py-2 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-primary/60"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-8">
        {filtered ? (
          <div className="space-y-1">
            {filtered.map((c) => (
              <ChapterLink key={c.slug} c={c} active={pathname === `/ch/${c.slug}`} done={read.has(c.slug)} onNavigate={onNavigate} />
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted">No chapters match “{query}”.</p>
            )}
          </div>
        ) : (
          PARTS.map((part) => (
            <div key={part.id} className="mb-5">
              <div className="px-3 pb-1.5 pt-2">
                <div className="font-display text-[11px] font-700 uppercase tracking-wider text-primary/70">
                  Part {part.id} · {part.title}
                </div>
                <div className="text-[11px] text-muted/70">{part.tag}</div>
              </div>
              <div className="space-y-0.5">
                {CHAPTERS.filter((c) => c.part === part.id).map((c) => (
                  <ChapterLink key={c.slug} c={c} active={pathname === `/ch/${c.slug}`} done={read.has(c.slug)} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          ))
        )}
      </nav>
    </div>
  );
}

function ChapterLink({
  c,
  active,
  done,
  onNavigate,
}: {
  c: (typeof CHAPTERS)[number];
  active: boolean;
  done: boolean;
  onNavigate?: () => void;
}) {
  const Icon = c.icon;
  return (
    <Link
      to={`/ch/${c.slug}`}
      onClick={onNavigate}
      className={clsx(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
        active ? 'nav-active font-600' : 'text-muted hover:bg-white/5 hover:text-ink',
      )}
    >
      <span className={clsx('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', active ? 'bg-primary/15' : 'bg-white/5')}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="flex-1 truncate">
        <span className="mr-1.5 font-mono text-[11px] text-muted/60">{String(c.number).padStart(2, '0')}</span>
        {c.title}
      </span>
      {done && <Check className="h-3.5 w-3.5 shrink-0 text-quantum-green" />}
    </Link>
  );
}
