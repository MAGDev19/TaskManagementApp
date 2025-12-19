import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      <span className="ml-3 text-sm font-semibold text-slate-700">Cargando...</span>
    </div>
  );
};

export default Loader;
