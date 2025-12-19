import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-xs font-extrabold text-white shadow-sm transition-transform group-hover:scale-[1.03]">
            TM
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-900">
              Task Management
            </span>
            <span className="text-[11px] text-slate-500">
              Tareas y estados · React + TS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            Tareas
          </NavLink>
          <NavLink
            to="/states"
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            Estados
          </NavLink>

          <NavLink
            to="/tasks/new"
            className={({ isActive }) =>
              [
                'ml-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition shadow-sm',
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600'
                  : 'bg-gradient-to-r from-indigo-600/95 to-blue-600/95 hover:from-indigo-500 hover:to-blue-500',
              ].join(' ')
            }
          >
            + Nueva tarea
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
