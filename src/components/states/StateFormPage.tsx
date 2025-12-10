import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    <section className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-slate-50">
          {isEdit ? 'Editar estado' : 'Nuevo estado'}
        </h1>
        <p className="text-xs text-slate-400">
          {isEdit
            ? 'Modifica el estado seleccionado.'
            : 'Crea un nuevo estado para las tareas.'}
        </p>
      </header>

      {error && (
        <ErrorAlert message={error} onClose={() => dispatch(clearStateError())} />
      )}

      <div className="card p-4">
        <StateForm
          mode={isEdit ? 'edit' : 'create'}
          defaultValues={isEdit ? selected : undefined}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </div>
    </section>
  );
};

export default StateFormPage;