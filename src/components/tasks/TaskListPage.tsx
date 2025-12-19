import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  clearError,
  deleteTaskThunk,
  fetchTasks,
  setOrderBy,
  setPageNumber,
  setSearch,
  setStateFilter,
} from '../../features/tasks/taskSlice';
import ErrorAlert from '../common/ErrorAlert';
import SkeletonRow from '../common/SkeletonRow';
import TaskFilters from './TaskFilters';
import TaskTable from './TaskTable';

const TaskListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, filters, pagination } = useAppSelector(
    (state) => state.tasks
  );

  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch, filters.search, filters.stateId, filters.orderBy, pagination.pageNumber]);

  const totalPages = Math.max(
    1,
    Math.ceil(pagination.totalCount / (pagination.pageSize || 1))
  );

  const handleDelete = (id: number) => {
    dispatch(deleteTaskThunk(id));
  };

  const stats = useMemo(() => {
    const total = pagination.totalCount ?? items.length;
    const byState = new Map<string, number>();
    for (const t of items) {
      const key = (t.stateName ?? `Estado #${t.stateId}`).trim();
      byState.set(key, (byState.get(key) ?? 0) + 1);
    }
    const top = Array.from(byState.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    return { total, byState, top };
  }, [items, pagination.totalCount]);

  return (
    <section className="page">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Tus tareas</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Vista tipo panel para crear, buscar y mantener el control.
                </p>
              </div>
              <Link to="/tasks/new" className="btn-primary">
                + Nueva tarea
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="kpi">
                <div className="kpi-title">Total</div>
                <div className="kpi-value">{stats.total}</div>
                <div className="kpi-sub">Tareas registradas</div>
              </div>

              <div className="kpi">
                <div className="kpi-title">Principales estados</div>
                <div className="mt-2 flex flex-col gap-2">
                  {stats.top.length ? (
                    stats.top.map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-semibold text-slate-800">{name}</span>
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60">
                          {count}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-slate-600">—</span>
                  )}
                </div>
              </div>

              <div className="kpi">
                <div className="kpi-title">Filtros activos</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {filters.search?.trim() ? (
                    <span className="chip">🔎 {filters.search.trim()}</span>
                  ) : (
                    <span className="chip">🔎 Sin búsqueda</span>
                  )}
                  {filters.stateId ? (
                    <span className="chip">🏷️ Estado #{filters.stateId}</span>
                  ) : (
                    <span className="chip">🏷️ Todos</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4">
              <ErrorAlert message={error} onClose={() => dispatch(clearError())} />
            </div>
          )}

          <div className="mt-4">
            {loading ? (
              <div className="card p-4">
                <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60">
                  <table className="table">
                    <tbody>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <SkeletonRow key={idx} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <TaskTable tasks={items} onDelete={handleDelete} />
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="mt-4 card p-4">
              <div className="flex flex-col gap-2 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                <span>
                  Página <span className="font-semibold text-slate-900">{pagination.pageNumber}</span> de{' '}
                  <span className="font-semibold text-slate-900">{totalPages}</span> ·{' '}
                  <span className="font-semibold text-slate-900">{pagination.totalCount}</span> tareas
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="btn-secondary"
                    disabled={pagination.pageNumber <= 1}
                    onClick={() => dispatch(setPageNumber(pagination.pageNumber - 1))}
                  >
                    Anterior
                  </button>
                  <button
                    className="btn-secondary"
                    disabled={pagination.pageNumber >= totalPages}
                    onClick={() => dispatch(setPageNumber(pagination.pageNumber + 1))}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-[88px] lg:h-[calc(100vh-110px)]">
          <div className="card p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/60 px-3 py-2 text-left text-sm font-semibold text-slate-900 ring-1 ring-slate-200/60 hover:bg-white/70"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <span>Filtros</span>
              <span className="text-slate-500">{filtersOpen ? '—' : '+'}</span>
            </button>

            {filtersOpen && (
              <div className="mt-3">
                <TaskFilters
                  search={filters.search}
                  stateId={filters.stateId}
                  orderBy={filters.orderBy}
                  onSearchChange={(value) => dispatch(setSearch(value))}
                  onStateChange={(value) => dispatch(setStateFilter(value))}
                  onOrderByChange={(value) => dispatch(setOrderBy(value))}
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      dispatch(setSearch(''));
                      dispatch(setStateFilter(null));
                      dispatch(setOrderBy('dueDateAsc'));
                    }}
                  >
                    Limpiar
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => dispatch(fetchTasks())}
                  >
                    Refrescar
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default TaskListPage;
