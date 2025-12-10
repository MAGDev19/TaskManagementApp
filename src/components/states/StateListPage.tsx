import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  clearStateError,
  deleteStateThunk,
  fetchStates,
} from '../../features/states/stateSlice';
import ErrorAlert from '../common/ErrorAlert';
import SkeletonRow from '../common/SkeletonRow';
import StateTable from './StateTable';

const StateListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.states);

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Estados
          </h1>
          <p className="text-xs text-slate-400">
            Administra los diferentes estados que pueden tomar las tareas.
          </p>
        </div>
        <Link to="/states/new" className="btn-primary text-xs">
          + Nuevo estado
        </Link>
      </header>

      {error && (
        <ErrorAlert
          message={error}
          onClose={() => dispatch(clearStateError())}
        />
      )}

      <div className="card p-4">
        {loading ? (
          <table className="table">
            <tbody>
              {Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))}
            </tbody>
          </table>
        ) : (
          <StateTable
            items={items}
            onDelete={(id) => dispatch(deleteStateThunk(id))}
          />
        )}
      </div>
    </section>
  );
};

export default StateListPage;