'use client';

import React from 'react';
import { User, Shield, X } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  isadmin: number;
  createdat: string;
}

interface UserModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  editingUser: UserData | null;
}

export const UserModal: React.FC<UserModalProps> = ({ show, onClose, onSubmit, editingUser }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = Boolean(editingUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <User className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            </div>
            <h2 id="user-modal-title" className="text-lg font-semibold text-gray-900">{isEditing ? 'Modifica Utente' : 'Nuovo Utente'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              defaultValue={editingUser?.username || ''}
              required
              disabled={isEditing}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder="Inserisci username"
              autoComplete="username"
              aria-describedby={isEditing ? "username-help" : undefined}
            />
            {isEditing && (
              <p id="username-help" className="text-xs text-gray-500 mt-1.5">L'username non può essere modificato</p>
            )}
          </div>

          {!isEditing && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                placeholder="Minimo 6 caratteri"
                autoComplete="new-password"
                aria-describedby="password-help"
              />
              <p id="password-help" className="text-xs text-gray-500 mt-1.5">La password deve contenere almeno 6 caratteri</p>
            </div>
          )}

          {/* Checkbox Admin */}
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="isAdmin"
                id="isAdmin"
                defaultChecked={editingUser?.isadmin === 1}
                className="mt-0.5 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              />
              <label htmlFor="isAdmin" className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                  Privilegi Amministratore
                </div>
                <p className="text-xs text-gray-600 mt-1">Gli admin possono gestire utenti e accedere a tutte le funzionalità</p>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Salvataggio...' : isEditing ? 'Salva Modifiche' : 'Crea Utente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
