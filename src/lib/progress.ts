import { useCallback, useEffect, useState } from 'react';

const KEY = 'casimirq-book-progress';

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

// Simple cross-component store via a module-level set + event.
let store = load();
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

export function markRead(slug: string) {
  if (store.has(slug)) return;
  store = new Set(store).add(slug);
  localStorage.setItem(KEY, JSON.stringify([...store]));
  emit();
}

export function useProgress() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  const mark = useCallback((slug: string) => markRead(slug), []);
  return { read: store, mark };
}
