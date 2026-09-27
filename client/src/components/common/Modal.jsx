import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop with enhanced blur */}
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal dialog */}
        <div
          className={`relative transform overflow-hidden rounded-3xl bg-stone-900 text-stone-100 text-left shadow-2xl transition-all w-full ${maxWidth} my-8 border border-stone-800 z-10`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4 bg-stone-950/60">
            <h3 className="text-lg font-black text-white tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
