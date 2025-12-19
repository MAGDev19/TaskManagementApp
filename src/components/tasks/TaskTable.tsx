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

const badgeClassForState = (stateName?: string | null) => {
  const name = (stateName || '').toLowerCase();
  if (name.includes('complet') || name.includes('final') || name.includes('hecho')) return 'badge-green';
  if (name.includes('cancel') || name.includes('anul') || name.includes('rechaz')) return 'badge-red';
  if (name.includes('pend') || name.includes('prog') || name.includes('en') || name.includes('proceso')) return 'badge-yellow';
  return 'badge-slate';
};

const TaskTable: React.FC<Props> = ({ tasks, onDelete }) => {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-12 text-center">
        <p className="text-sm font-semibold text-slate-900">Sin resultados</p>
        <p className="mt-1 text-sm text-slate-600">
          No hay tareas para mostrar con los filtros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="card group p-4 transition hover:-translate-y-[1px] hover:shadow-[0_18px_44px_-30px_rgba(15,23,42,0.55)]"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="max-w-[540px] truncate text-base font-semibold text-slate-900">
                  {task.title}
                </h3>
                <span className={badgeClassForState(task.stateName)}>
                  {task.stateName ?? `Estado #${task.stateId}`}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                {task.description || 'Sin descripción'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="chip">📅 Vence: {formatDate(task.dueDate)}</span>
                <span className="chip"># {task.id}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
              <Link to={`/tasks/${task.id}/edit`} className="btn-secondary">
                Editar
              </Link>
              <button
                className="btn-danger"
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskTable;
