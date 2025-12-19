import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  clearError,
  createTaskThunk,
  fetchTaskById,
  fetchTaskStatesThunk,
  updateTaskThunk,
} from '../../features/tasks/taskSlice';
import ErrorAlert from '../common/ErrorAlert';
import Loader from '../common/Loader';
import TaskForm, { TaskFormValues } from './TaskForm';

const TaskFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selected, loading, error, availableStates, loadingStates } = useAppSelector(
    (state) => state.tasks
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskStatesThunk());
    if (isEdit && id) {
      dispatch(fetchTaskById(Number(id)));
    }
  }, [dispatch, id, isEdit]);

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      setSubmitting(true);
      if (isEdit && id) {
        await dispatch(
          updateTaskThunk({
            id: Number(id),
            title: values.title,
            description: values.description,
            dueDate: values.dueDate,
            stateId: values.stateId,
          })
        ).unwrap();
      } else {
        await dispatch(
          createTaskThunk({
            title: values.title,
            description: values.description,
            dueDate: values.dueDate,
            stateId: values.stateId,
          })
        ).unwrap();
      }
      navigate('/');
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
                  {isEdit ? 'Editar tarea' : 'Crear una tarea'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {isEdit
                    ? 'Actualiza los datos y guarda los cambios.'
                    : 'Completa la información básica y asigna un estado.'}
                </p>
              </div>
              <Link to="/" className="btn-secondary">
                ← Volver
              </Link>
            </div>

            {error && (
              <div className="mt-4">
                <ErrorAlert message={error} onClose={() => dispatch(clearError())} />
              </div>
            )}

            <div className="mt-4">
              <TaskForm
                mode={isEdit ? 'edit' : 'create'}
                defaultValues={isEdit ? selected : undefined}
                states={availableStates}
                loadingStates={loadingStates}
                onSubmit={handleSubmit}
                loading={submitting}
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[88px] lg:h-[calc(100vh-110px)]">
          <div className="card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Vista previa</div>
            <div className="mt-2 rounded-3xl bg-white/60 p-4 ring-1 ring-slate-200/60">
              <div className="text-sm font-semibold text-slate-900">
                {isEdit ? 'Tarea seleccionada' : 'Nueva tarea'}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Los cambios se aplican al guardar.
              </div>
              <div className="mt-4 grid gap-2 text-xs text-slate-600">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">Modo</span>
                  <span className="chip">{isEdit ? 'Editar' : 'Crear'}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">Estados</span>
                  <span className="chip">{loadingStates ? 'Cargando…' : `${availableStates.length}`}</span>
                </div>
                {isEdit && selected?.id && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">Id</span>
                    <span className="chip">#{selected.id}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-white/60 p-4 text-sm text-slate-600 ring-1 ring-slate-200/60">
              <div className="font-semibold text-slate-900">Consejo</div>
              <div className="mt-1">Usa títulos cortos y descripciones claras para que sea más fácil encontrar la tarea.</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default TaskFormPage;
