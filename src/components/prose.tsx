import type { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, Info, Sparkles, Rocket, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

/** Turn a heading into a scroll anchor id. */
export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function H2({ children }: { children: string }) {
  return (
    <h2
      id={slug(children)}
      className="group mt-14 mb-4 scroll-mt-24 font-display text-2xl font-700 text-ink"
    >
      <span className="mr-2 select-none text-primary/40">§</span>
      {children}
    </h2>
  );
}

export function H3({ children }: { children: string }) {
  return (
    <h3 id={slug(children)} className="mt-9 mb-3 scroll-mt-24 font-display text-lg font-600 text-ink">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="mb-6 text-lg leading-relaxed text-muted">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul>{children}</ul>;
}
export function OL({ children }: { children: ReactNode }) {
  return <ol>{children}</ol>;
}
export function LI({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

const CALLOUTS = {
  idea: { icon: Lightbulb, ring: 'border-quantum-amber/30 bg-quantum-amber/[0.06]', tint: 'text-quantum-amber', label: 'Intuition' },
  warn: { icon: AlertTriangle, ring: 'border-quantum-pink/30 bg-quantum-pink/[0.06]', tint: 'text-quantum-pink', label: 'Watch out' },
  info: { icon: Info, ring: 'border-primary/30 bg-primary/[0.06]', tint: 'text-primary', label: 'Note' },
  key: { icon: Sparkles, ring: 'border-quantum-violet/30 bg-quantum-violet/[0.06]', tint: 'text-quantum-violet', label: 'Key idea' },
} as const;

export function Callout({
  kind = 'info',
  title,
  children,
}: {
  kind?: keyof typeof CALLOUTS;
  title?: string;
  children: ReactNode;
}) {
  const c = CALLOUTS[kind];
  const Icon = c.icon;
  return (
    <div className={clsx('my-6 rounded-xl border px-5 py-4', c.ring)}>
      <div className={clsx('mb-1.5 flex items-center gap-2 text-sm font-600', c.tint)}>
        <Icon className="h-4 w-4" />
        {title ?? c.label}
      </div>
      <div className="text-[15px] leading-relaxed text-ink/85 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

/** "In plain English" — a layman-friendly reframing box. */
export function PlainEnglish({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-quantum-teal/25 bg-quantum-teal/[0.05] px-5 py-4">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-600 text-quantum-teal">
        <Rocket className="h-4 w-4" />
        In plain English
      </div>
      <div className="text-[15px] italic leading-relaxed text-ink/85 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function Takeaways({ items }: { items: ReactNode[] }) {
  return (
    <div className="my-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-quantum-violet/[0.05] p-6">
      <div className="mb-3 flex items-center gap-2 font-display text-sm font-700 uppercase tracking-wider text-primary">
        <Sparkles className="h-4 w-4" /> Key takeaways
      </div>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink/90">
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A screenshot of the live CasimirQ platform. */
export function Figure({
  src,
  alt,
  caption,
  frame = true,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  frame?: boolean;
}) {
  return (
    <figure className="my-8">
      <div
        className={clsx(
          'overflow-hidden rounded-xl',
          frame && 'border border-border bg-surface shadow-2xl shadow-black/40',
        )}
      >
        {frame && (
          <div className="flex items-center gap-1.5 border-b border-border/70 bg-white/[0.02] px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-quantum-pink/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-quantum-amber/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-quantum-green/60" />
            <span className="ml-2 font-mono text-[11px] text-muted">casimirQ · localhost:8080</span>
          </div>
        )}
        <img src={src} alt={alt} className="w-full" loading="lazy" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          <span className="font-600 text-primary/80">Figure.</span> {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Simple bordered data table. */
export function DataTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-white/[0.03]">
            {head.map((h, i) => (
              <th key={i} className="border-b border-border px-4 py-2.5 font-600 text-primary/90">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white/[0.01]">
              {r.map((c, j) => (
                <td key={j} className="border-b border-border/60 px-4 py-2.5 align-top text-ink/85">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Two-column comparison, e.g. Classical vs Quantum. */
export function Versus({
  left,
  right,
}: {
  left: { title: string; points: ReactNode[] };
  right: { title: string; points: ReactNode[] };
}) {
  return (
    <div className="my-7 grid gap-4 sm:grid-cols-2">
      {[left, right].map((col, idx) => (
        <div
          key={idx}
          className={clsx(
            'rounded-xl border p-5',
            idx === 0 ? 'border-border bg-surface/60' : 'border-primary/25 bg-primary/[0.05]',
          )}
        >
          <div className={clsx('mb-3 font-display font-600', idx === 0 ? 'text-muted' : 'text-primary')}>
            {col.title}
          </div>
          <ul className="space-y-2 text-sm text-ink/85">
            {col.points.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className={clsx('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', idx === 0 ? 'bg-muted' : 'bg-primary')} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
