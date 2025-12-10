import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    <section className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-slate-50">
          {isEdit ? 'Editar tarea' : 'Nueva tarea'}
        </h1>
        <p className="text-xs text-slate-400">
          {isEdit
            ? 'Modifica la información de la tarea seleccionada.'
            : 'Crea una nueva tarea con título, descripción, fecha y estado.'}
        </p>
      </header>

      {error && (
        <ErrorAlert message={error} onClose={() => dispatch(clearError())} />
      )}

      <div className="card p-4">
        <TaskForm
          mode={isEdit ? 'edit' : 'create'}
          defaultValues={isEdit ? selected : undefined}
          states={availableStates}
          loadingStates={loadingStates}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </div>
    </section>
  );
};

export default TaskFormPage;