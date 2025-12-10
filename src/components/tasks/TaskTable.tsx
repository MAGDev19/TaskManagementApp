import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../../types/taskState';

interface Props {
  tasks: Task[];
  onDelete: (id: number) => void;
}

const formatDate = (value: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const TaskTable: React.FC<Props> = ({ tasks, onDelete }) => {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-10 text-center text-sm text-slate-400">
        No hay tareas para mostrar con los filtros actuales.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80">
      <table className="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Vence</th>
            <th>Estado</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="max-w-[220px] truncate">{task.title}</td>
              <td className="max-w-[260px] truncate text-slate-300">
                {task.description}
              </td>
              <td>{formatDate(task.dueDate)}</td>
              <td>
                <span className="badge badge-yellow">
                  {task.stateName ?? `Estado #${task.stateId}`}
                </span>
              </td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    className="btn-secondary text-xs"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn-secondary text-xs text-rose-300 hover:text-rose-100"
                    onClick={() => {
                      if (
                        window.confirm(
                          '¿Seguro que deseas eliminar esta tarea? Esta acción no se puede deshacer.'
                        )
                      ) {
                        onDelete(task.id);
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

export default TaskTable;