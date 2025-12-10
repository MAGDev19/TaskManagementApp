import React, { useEffect } from 'react';
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

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Tareas
          </h1>
          <p className="text-xs text-slate-400">
            Gestiona tus tareas con filtros, ordenamiento y estados.
          </p>
        </div>
        <Link to="/tasks/new" className="btn-primary text-xs">
          + Nueva tarea
        </Link>
      </header>

      {error && (
        <ErrorAlert
          message={error}
          onClose={() => dispatch(clearError())}
        />
      )}

      <div className="card p-4">
        <TaskFilters
          search={filters.search}
          stateId={filters.stateId}
          orderBy={filters.orderBy}
          onSearchChange={(value) => dispatch(setSearch(value))}
          onStateChange={(value) => dispatch(setStateFilter(value))}
          onOrderByChange={(value) => dispatch(setOrderBy(value))}
        />

        {loading ? (
          <table className="table">
            <tbody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))}
            </tbody>
          </table>
        ) : (
          <TaskTable tasks={items} onDelete={handleDelete} />
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>
              Página {pagination.pageNumber} de {totalPages} · {pagination.totalCount}{' '}
              tareas
            </span>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary text-xs"
                disabled={pagination.pageNumber <= 1}
                onClick={() => dispatch(setPageNumber(pagination.pageNumber - 1))}
              >
                Anterior
              </button>
              <button
                className="btn-secondary text-xs"
                disabled={pagination.pageNumber >= totalPages}
                onClick={() => dispatch(setPageNumber(pagination.pageNumber + 1))}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaskListPage;