import React from 'react';
import { Link } from 'react-router-dom';
import { State } from '../../types/taskState';

interface Props {
  items: State[];
  onDelete: (id: number) => void;
}

const StateTable: React.FC<Props> = ({ items, onDelete }) => {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-12 text-center">
        <p className="text-sm font-semibold text-slate-900">Sin estados</p>
        <p className="mt-1 text-sm text-slate-600">No hay estados registrados.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((st) => (
        <div key={st.id} className="card group p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60">
                  #{st.id}
                </span>
                {st.isActive ? (
                  <span className="badge-green">Activo</span>
                ) : (
                  <span className="badge-red">Inactivo</span>
                )}
              </div>
              <h3 className="mt-2 truncate text-base font-semibold text-slate-900">
                {st.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Configura cómo se clasifican y visualizan las tareas.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
              <Link to={`/states/${st.id}/edit`} className="btn-secondary">
                Editar
              </Link>
              <button
                className="btn-danger"
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Seguro que deseas eliminar este estado? Esta acción no se puede deshacer.'
                    )
                  ) {
                    onDelete(st.id);
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StateTable;
