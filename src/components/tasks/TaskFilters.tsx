import React from 'react';

interface Props {
  search: string;
  stateId: number | null;
  orderBy: 'dueDateAsc' | 'dueDateDesc';
  onSearchChange: (value: string) => void;
  onStateChange: (value: number | null) => void;
  onOrderByChange: (value: 'dueDateAsc' | 'dueDateDesc') => void;
}

const TaskFilters: React.FC<Props> = ({
  search,
  stateId,
  orderBy,
  onSearchChange,
  onStateChange,
  onOrderByChange,
}) => {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          Buscar
        </label>
        <input
          className="input"
          placeholder="Título o descripción…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          Estado (Id)
        </label>
        <input
          className="input"
          type="number"
          placeholder="Ej: 1, 2, 3…"
          value={stateId ?? ''}
          onChange={(e) =>
            onStateChange(e.target.value === '' ? null : Number(e.target.value))
          }
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          Orden
        </label>
        <select
          className="select"
          value={orderBy}
          onChange={(e) =>
            onOrderByChange(e.target.value as 'dueDateAsc' | 'dueDateDesc')
          }
        >
          <option value="dueDateAsc">Más próximas primero</option>
          <option value="dueDateDesc">Más lejanas primero</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
