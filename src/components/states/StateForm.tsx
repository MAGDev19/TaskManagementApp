import React from 'react';
import { useForm } from 'react-hook-form';
import { State } from '../../types/taskState';

export type StateFormValues = {
  name: string;
  isActive: boolean;
};

interface Props {
  mode: 'create' | 'edit';
  defaultValues?: State;
  onSubmit: (values: StateFormValues) => void;
  loading?: boolean;
}

const StateForm: React.FC<Props> = ({ mode, defaultValues, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StateFormValues>({
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          isActive: defaultValues.isActive ?? true,
        }
      : {
          name: '',
          isActive: true,
        },
  });

  const submitHandler = (values: StateFormValues) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">
          Nombre
        </label>
        <input
          className="input"
          {...register('name', {
            required: 'El nombre es obligatorio',
            minLength: {
              value: 2,
              message: 'El nombre debe tener al menos 2 caracteres',
            },
          })}
          placeholder="Ej: Pendiente"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-300">{errors.name.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          className="h-4 w-4 rounded border-slate-600 bg-slate-800"
          {...register('isActive')}
        />
        <label
          htmlFor="isActive"
          className="text-xs font-medium text-slate-300"
        >
          Estado activo
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {mode === 'create' ? 'Crear estado' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
};

export default StateForm;