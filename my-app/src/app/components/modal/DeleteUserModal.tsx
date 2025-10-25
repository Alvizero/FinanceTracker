'use client';

import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { useConfirm } from './ConfirmDialoogModal';

interface DeleteUserModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  username: string;
  isCurrentUser?: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ show, onClose, onConfirm, username, isCurrentUser = false }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const handleConfirm = async () => {
    const confirmed = await confirm({
      title: 'Conferma Finale',
      message: `Sei assolutamente sicuro di voler eliminare l'utente "${username}"? Questa azione non può essere annullata.`,
      confirmLabel: 'Sì, elimina',
      cancelLabel: 'No, torna indietro',
      variant: 'danger',
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
              </div>
              <h3 id="delete-modal-title" className="text-lg font-semibold text-gray-900">Conferma Eliminazione</h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isCurrentUser ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4" role="alert">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-900 mb-1">Azione non consentita</h4>
                    <p className="text-sm text-yellow-700">Non puoi eliminare il tuo account mentre sei autenticato.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Warning Alert */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6" role="alert">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-900 mb-1">Attenzione: Questa azione è irreversibile</h4>
                      <p className="text-sm text-red-700">L'eliminazione comporterà la rimozione permanente di tutti i dati associati.</p>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Stai per eliminare l'utente:</p>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{username}</p>
                      <p className="text-xs text-gray-500">Tutte le transazioni associate verranno eliminate</p>
                    </div>
                  </div>
                </div>

                {/* Confirmation Message */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">Questa operazione eliminerà definitivamente:</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Account utente
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Tutte le transazioni associate
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Cronologia e dati personali
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Annulla
              </button>
              {!isCurrentUser && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Eliminazione...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Elimina Definitivamente</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog />
    </>
  );
};
