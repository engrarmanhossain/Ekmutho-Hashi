import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Yes, Proceed',
  cancelText = 'Cancel',
  isDestructive = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 py-2">
        <div
          className={`shrink-0 p-3 rounded-2xl ${
            isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-bold text-white rounded-xl shadow-sm transition ${
            isDestructive
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
