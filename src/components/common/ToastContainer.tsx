import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto border-2 border-black p-3.5 shadow-[4px_4px_0px_#000000] flex items-start justify-between gap-3 text-xs font-mono font-bold animate-in slide-in-from-bottom-3 duration-200 ${
            t.type === 'success'
              ? 'bg-[#FFE600] text-black'
              : t.type === 'error'
              ? 'bg-[#FF4747] text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white dark:border-neutral-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-black shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-white shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
            <span className="leading-snug">{t.message}</span>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="p-0.5 hover:opacity-75 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
