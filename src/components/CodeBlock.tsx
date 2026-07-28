import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import rust from 'highlight.js/lib/languages/rust';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import { Check, Copy } from 'lucide-react';

hljs.registerLanguage('rust', rust);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);

interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
}

export function Code({ code, lang = 'rust', title }: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const trimmed = code.replace(/^\n/, '').replace(/\n\s*$/, '');

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-highlighted');
      hljs.highlightElement(ref.current);
    }
  }, [trimmed, lang]);

  function copy() {
    navigator.clipboard?.writeText(trimmed).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-border bg-[#0b1424] shadow-lg">
      <div className="flex items-center justify-between border-b border-border/70 bg-white/[0.02] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-quantum-pink/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-quantum-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-quantum-green/70" />
          <span className="ml-3 font-mono text-xs text-muted">{title ?? lang}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition hover:bg-white/5 hover:text-ink"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-quantum-green" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed">
        <code ref={ref} className={`language-${lang} font-mono`}>
          {trimmed}
        </code>
      </pre>
    </div>
  );
}
