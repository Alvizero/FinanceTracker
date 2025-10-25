'use client';

import React, { useState } from 'react';
import { X, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useConfirm } from './ConfirmDialoogModal';

interface PasswordResetModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
  username?: string;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  show,
  onClose,
  onSubmit,
  username,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { confirm, ConfirmDialog } = useConfirm();

  const validatePassword = (password: string): string[] => {
    const validationErrors: string[] = [];
    if (password.length < 6) {
      validationErrors.push('Minimo 6 caratteri richiesti');
    }
    return validationErrors;
  };

  const validateConfirmPassword = (): string[] => {
    const validationErrors: string[] = [];
    if (touched.confirm && confirmPassword && newPassword !== confirmPassword) {
      validationErrors.push('Le password non coincidono');
    }
    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });

    const passwordErrors = validatePassword(newPassword);
    const confirmErrors = validateConfirmPassword();
    const allErrors = [...passwordErrors, ...confirmErrors];

    if (allErrors.length > 0) {
      setErrors(allErrors);
      return;
    }

    // ✅ Mostra ConfirmDialog prima di procedere
    const confirmed = await confirm({
      title: 'Conferma Modifica Password',
      message: username
        ? `Sei sicuro di voler cambiare la password per l'utente "${username}"? L'utente dovrà utilizzare la nuova password per accedere.`
        : 'Sei sicuro di voler modificare la tua password? Dovrai utilizzare la nuova password per i prossimi accessi.',
      confirmLabel: 'Conferma Modifica',
      cancelLabel: 'Annulla',
      variant: 'warning',
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await onSubmit(newPassword);
      handleClose();
    } catch (error) {
      setErrors(['Errore durante il reset della password']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setErrors([]);
    setTouched({ password: false, confirm: false });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (touched.password) {
      setErrors(validatePassword(value));
    }
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirm) {
      setErrors(validateConfirmPassword());
    }
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordValid = newPassword.length >= 6;

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Lock className="w-5 h-5 text-indigo-600" aria-hidden="true" />
              </div>
              <h3 id="password-modal-title" className="text-lg font-semibold text-gray-900">
                Modifica Password
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Subtitle */}
          {username && (
            <div className="px-6 pt-4">
              <p className="text-sm text-gray-600">
                Inserisci la nuova password per <span className="font-medium text-gray-900">{username}</span>
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error Alert */}
            {errors.length > 0 && (
              <div
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-1">
                      Correggi i seguenti errori:
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Nuova Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                Nuova Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className={`w-full px-4 py-2.5 pr-11 border rounded-lg transition-shadow ${
                    touched.password && !passwordValid
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-indigo-500 focus:border-transparent'
                  } focus:ring-2`}
                  placeholder="Minimo 6 caratteri"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  aria-invalid={touched.password && !passwordValid}
                  aria-describedby="password-requirements"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={showNewPassword ? 'Nascondi password' : 'Mostra password'}
                  aria-pressed={showNewPassword}
                  disabled={isSubmitting}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p id="password-requirements" className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                {passwordValid && touched.password ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
                    <span className="text-green-700">Password valida</span>
                  </>
                ) : (
                  'La password deve contenere almeno 6 caratteri'
                )}
              </p>
            </div>

            {/* Conferma Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Conferma Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmChange(e.target.value)}
                  onBlur={() => setTouched({ ...touched, confirm: true })}
                  className={`w-full px-4 py-2.5 pr-11 border rounded-lg transition-shadow ${
                    touched.confirm && confirmPassword && !passwordsMatch
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-indigo-500 focus:border-transparent'
                  } focus:ring-2`}
                  placeholder="Ripeti la password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  aria-invalid={touched.confirm && confirmPassword && !passwordsMatch}
                  aria-describedby="password-match"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={showConfirmPassword ? 'Nascondi password' : 'Mostra password'}
                  aria-pressed={showConfirmPassword}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p id="password-match" className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                {passwordsMatch && touched.confirm ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
                    <span className="text-green-700">Le password coincidono</span>
                  </>
                ) : (
                  'Inserisci nuovamente la password'
                )}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !passwordValid || !passwordsMatch}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Salvataggio...' : 'Conferma'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Renderizza il ConfirmDialog per la conferma finale */}
      <ConfirmDialog />
    </>
  );
};
