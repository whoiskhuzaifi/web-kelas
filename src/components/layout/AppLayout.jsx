import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ErrorBoundary from '../common/ErrorBoundary';
import Header from './Header';
import MobileDrawer from './MobileDrawer';
import SidebarContent from './SidebarContent';

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen lg:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Lewati ke konten utama
      </a>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
        <SidebarContent />
      </aside>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setDrawerOpen(true)} />
        <main id="main" tabIndex={-1} className="flex-1 p-4 outline-none sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Error di satu halaman tidak menjatuhkan navigasi; direset otomatis saat pindah halaman. */}
            <ErrorBoundary resetKeys={[pathname]}>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
