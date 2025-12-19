import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  clearStateError,
  createStateThunk,
  fetchStateByIdThunk,
  updateStateThunk,
} from '../../features/states/stateSlice';
import ErrorAlert from '../common/ErrorAlert';
import Loader from '../common/Loader';
import StateForm, { StateFormValues } from './StateForm';

const StateFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, loading, error } = useAppSelector((state) => state.states);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchStateByIdThunk(Number(id)));
    }
  }, [dispatch, id, isEdit]);

  const handleSubmit = async (values: StateFormValues) => {
    try {
      setSubmitting(true);
      if (isEdit && id) {
        await dispatch(
          updateStateThunk({
            id: Number(id),
            dto: {
              name: values.name,
              isActive: values.isActive,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createStateThunk({
            name: values.name,
            isActive: values.isActive,
          })
        ).unwrap();
      }
      navigate('/states');
    } catch {
      // error manejado en slice
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !selected) {
    return <Loader />;
  }

  return (
    <section className="page">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {isEdit ? 'Editar estado' : 'Crear estado'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {isEdit
                    ? 'Actualiza el nombre y la disponibilidad.'
                    : 'Crea un estado que ayude a organizar tus tareas.'}
                </p>
              </div>
              <Link to="/states" className="btn-secondary">
                ← Volver
              </Link>
            </div>

            {error && (
              <div className="mt-4">
                <ErrorAlert message={error} onClose={() => dispatch(clearStateError())} />
              </div>
            )}

            <div className="mt-4">
              <StateForm
                mode={isEdit ? 'edit' : 'create'}
                defaultValues={isEdit ? selected : undefined}
                onSubmit={handleSubmit}
                loading={submitting}
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[88px] lg:h-[calc(100vh-110px)]">
          <div className="card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Sugerencias</div>
            <div className="mt-2 rounded-3xl bg-white/60 p-4 text-sm text-slate-600 ring-1 ring-slate-200/60">
              <div className="font-semibold text-slate-900">Nombres claros</div>
              <div className="mt-1">
                Ejemplos: “Pendiente”, “En proceso”, “Completado”, “Bloqueado”.
              </div>
            </div>

            {isEdit && selected?.id && (
              <div className="mt-4 rounded-3xl bg-white/60 p-4 ring-1 ring-slate-200/60">
                <div className="text-sm font-semibold text-slate-900">Referencia</div>
                <div className="mt-2 flex items-center justify-between gap-2 text-sm text-slate-600">
                  <span>Id</span>
                  <span className="chip">#{selected.id}</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default StateFormPage;
