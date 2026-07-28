import katex from 'katex';
import { useMemo } from 'react';

/** Inline math: <M>{'\\alpha|0\\rangle'}</M> */
export function M({ children }: { children: string }) {
  const html = useMemo(
    () => katex.renderToString(children, { throwOnError: false, displayMode: false }),
    [children],
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Display math block. */
export function Eq({ children, label }: { children: string; label?: string }) {
  const html = useMemo(
    () => katex.renderToString(children, { throwOnError: false, displayMode: true }),
    [children],
  );
  return (
    <div className="my-6 flex items-center gap-3">
      <div
        className="flex-1 overflow-x-auto rounded-xl border border-border bg-surface/60 px-5 py-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {label && <span className="hidden shrink-0 font-mono text-xs text-muted sm:block">{label}</span>}
    </div>
  );
}
