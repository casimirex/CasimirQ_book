import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[300px] border-r border-border bg-surface/70 backdrop-blur-xl lg:block">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <span className="font-display font-700">casimirQ · Book</span>
        <button onClick={() => setOpen(true)} className="rounded-md p-2 text-muted hover:bg-white/5">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[300px] border-r border-border bg-surface">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-muted hover:bg-white/5">
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-[300px]">
        <Outlet />
      </main>
    </div>
  );
}
