import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Task, State } from '../../types/taskState';

export type TaskFormValues = {
  title: string;
  description: string;
  dueDate: string;
  stateId: number;
};

interface Props {
  mode: 'create' | 'edit';
  defaultValues?: Task;
  states: State[];
  loadingStates?: boolean;
  onSubmit: (values: TaskFormValues) => void;
  loading?: boolean;
}

const TaskForm: React.FC<Props> = ({
  mode,
  defaultValues,
  states,
  loadingStates,
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          dueDate: defaultValues.dueDate?.substring(0, 10),
          stateId: defaultValues.stateId,
        }
      : {
          title: '',
          description: '',
          dueDate: new Date().toISOString().substring(0, 10),
          stateId: states[0]?.id ?? 1,
        },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title,
        description: defaultValues.description,
        dueDate: defaultValues.dueDate?.substring(0, 10),
        stateId: defaultValues.stateId,
      });
    }
  }, [defaultValues, reset]);

  const submitHandler = (values: TaskFormValues) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">
          Título
        </label>
        <input
          className="input"
          {...register('title', {
            required: 'El título es obligatorio',
            minLength: {
              value: 3,
              message: 'El título debe tener al menos 3 caracteres',
            },
          })}
          placeholder="Ej: Actualizar documentación del proyecto"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-rose-300">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">
          Descripción
        </label>
        <textarea
          className="textarea"
          rows={4}
          {...register('description', {
            required: 'La descripción es obligatoria',
            minLength: {
              value: 5,
              message: 'La descripción debe tener al menos 5 caracteres',
            },
          })}
          placeholder="Describe la tarea, contexto y pasos a seguir..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-300">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Fecha de vencimiento
          </label>
          <input
            type="date"
            className="input"
            {...register('dueDate', {
              required: 'La fecha de vencimiento es obligatoria',
            })}
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs text-rose-300">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Estado
          </label>
          <select
            className="select"
            {...register('stateId', {
              required: 'El estado es obligatorio',
              valueAsNumber: true,
            })}
          >
            {loadingStates && (
              <option value="">Cargando estados...</option>
            )}
            {!loadingStates &&
              states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} - {s.name}
                </option>
              ))}
          </select>
          {errors.stateId && (
            <p className="mt-1 text-xs text-rose-300">
              {errors.stateId.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {mode === 'create' ? 'Crear tarea' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;