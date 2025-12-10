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
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-10 text-center text-sm text-slate-400">
        No hay estados registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Activo</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {items.map((st) => (
            <tr key={st.id}>
              <td>{st.id}</td>
              <td>{st.name}</td>
              <td>
                {st.isActive ? (
                  <span className="badge badge-green">Activo</span>
                ) : (
                  <span className="badge badge-red">Inactivo</span>
                )}
              </td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/states/${st.id}/edit`}
                    className="btn-secondary text-xs"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn-secondary text-xs text-rose-300 hover:text-rose-100"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StateTable;