import React, { PropsWithChildren, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/70 text-slate-700 shadow-sm ring-1 ring-slate-200/60">
    {children}
  </span>
);

const AppShell: React.FC<PropsWithChildren> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = useMemo(() => {
    if (location.pathname.startsWith('/states')) return 'Estados';
    if (location.pathname.startsWith('/tasks/new')) return 'Nueva tarea';
    if (location.pathname.includes('/tasks/') && location.pathname.endsWith('/edit')) return 'Editar tarea';
    return 'Tareas';
  }, [location.pathname]);

  const nav: NavItem[] = [
    {
      to: '/',
      label: 'Tareas',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M3.5 6h.5M3.5 12h.5M3.5 18h.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      to: '/states',
      label: 'Estados',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 7h10M7 12h10M7 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM5 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={[
          'sidebar',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-4 lg:pt-6">
          <Link to="/" className="group flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-600 text-xs font-extrabold text-white shadow-sm transition-transform group-hover:scale-[1.02]">
              TM
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Task Management</div>
              <div className="text-[11px] text-slate-500">Panel</div>
            </div>
          </Link>

          <button
            className="btn-icon lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-6 px-3">
          <div className="rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200/60">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'nav-item',
                    isActive ? 'nav-item-active' : 'nav-item-idle',
                  ].join(' ')
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon>{item.icon}</Icon>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{item.label}</span>
                  <span className="nav-dot" />
                </div>
              </NavLink>
            ))}

            <div className="my-2 h-px bg-slate-200/70" />

            <Link
              to="/tasks/new"
              className="nav-cta"
              onClick={() => setMobileOpen(false)}
            >
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/70 text-slate-700 shadow-sm ring-1 ring-slate-200/60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-sm font-semibold">Nueva tarea</span>
              <span className="ml-auto rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/60">
                Ctrl + N
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-auto px-4 pb-6 pt-4">
          <div className="rounded-3xl bg-white/60 p-4 text-xs text-slate-600 ring-1 ring-slate-200/60">
            <div className="font-semibold text-slate-900">Tip</div>
            <div className="mt-1">
              Usa los filtros y el buscador para encontrar tareas más rápido.
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <div className="flex items-center gap-3">
            <button
              className="btn-icon lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Panel</div>
              <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Link to="/tasks/new" className="btn-primary">
              + Crear tarea
            </Link>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
