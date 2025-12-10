import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold">
            TM
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-50">
              Task Management
            </span>
            <span className="text-[11px] text-slate-400">
              Tareas y estados · React + TS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                'rounded-xl px-3 py-1.5',
                isActive ? 'bg-slate-800 text-slate-50' : 'text-slate-300 hover:bg-slate-900',
              ].join(' ')
            }
          >
            Tareas
          </NavLink>
          <NavLink
            to="/states"
            className={({ isActive }) =>
              [
                'rounded-xl px-3 py-1.5',
                isActive ? 'bg-slate-800 text-slate-50' : 'text-slate-300 hover:bg-slate-900',
              ].join(' ')
            }
          >
            Estados
          </NavLink>
          <NavLink
            to="/tasks/new"
            className={({ isActive }) =>
              [
                'rounded-xl px-3 py-1.5',
                isActive ? 'bg-blue-600 text-slate-50' : 'bg-blue-600/90 text-slate-50 hover:bg-blue-500',
              ].join(' ')
            }
          >
            Nueva tarea
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;