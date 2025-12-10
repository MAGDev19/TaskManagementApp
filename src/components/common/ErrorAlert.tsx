import React from 'react';

interface Props {
  message?: string | null;
  onClose?: () => void;
}

const ErrorAlert: React.FC<Props> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 flex items-start justify-between gap-3">
      <div>
        <p className="font-medium">Ha ocurrido un error</p>
        <p className="mt-1 text-xs text-rose-100/80">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Cerrar"
          className="text-rose-200 hover:text-rose-50 text-lg leading-none"
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;