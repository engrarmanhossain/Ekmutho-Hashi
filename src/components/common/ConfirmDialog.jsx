import React, { useState, useEffect } from 'react';
import { AlertTriangle, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Yes, Proceed',
  cancelText = 'Cancel',
  isDestructive = false,
  requirePassword = false,
  onVerifyPassword = null,
  accountName = ''
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleConfirm = (e) => {
    if (e) e.preventDefault();

    if (requirePassword) {
      if (!password.trim()) {
        setErrorMsg('Please enter your account password.');
        return;
      }

      if (onVerifyPassword) {
        const isValid = onVerifyPassword(password);
        if (!isValid) {
          setErrorMsg('Incorrect account password. Access denied.');
          return;
        }
      }
    }

    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <form onSubmit={handleConfirm} className="space-y-4">
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

        {/* Password Confirmation Field (if required) */}
        {requirePassword && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Account Password Required</span>
              </span>
              {accountName && (
                <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[170px]">
                  {accountName}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter your account password"
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-bold text-white rounded-xl shadow-sm transition cursor-pointer active:scale-95 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </form>
    </Modal>
  );
};
