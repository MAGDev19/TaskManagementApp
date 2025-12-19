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
    <section className="page">
      <div className="card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Catálogo de estados</h2>
            <p className="mt-1 text-sm text-slate-600">
              Define los estados disponibles para tus tareas.
            </p>
          </div>
          <Link to="/states/new" className="btn-primary">
            + Nuevo estado
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="kpi">
            <div className="kpi-title">Total</div>
            <div className="kpi-value">{items.length}</div>
            <div className="kpi-sub">Estados registrados</div>
          </div>
          <div className="kpi">
            <div className="kpi-title">Activos</div>
            <div className="kpi-value">{items.filter((s) => s.isActive).length}</div>
            <div className="kpi-sub">Disponibles para usar</div>
          </div>
          <div className="kpi">
            <div className="kpi-title">Acción rápida</div>
            <div className="mt-2 text-sm text-slate-600">
              Mantén activos solo los estados que realmente uses.
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => dispatch(clearStateError())} />}

      <div className="mt-4">
        {loading ? (
          <div className="card p-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60">
              <table className="table">
                <tbody>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <SkeletonRow key={idx} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <StateTable items={items} onDelete={(id) => dispatch(deleteStateThunk(id))} />
        )}
      </div>
    </section>
  );
};

export default StateListPage;
