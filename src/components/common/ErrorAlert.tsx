import React from 'react';

interface Props {
  message?: string | null;
  onClose?: () => void;
}

const ErrorAlert: React.FC<Props> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-rose-900">Ha ocurrido un error</p>
        <p className="mt-1 text-sm text-rose-800/90">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Cerrar"
          className="rounded-xl px-2 py-1 text-rose-700 hover:bg-rose-100 hover:text-rose-900 transition"
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
