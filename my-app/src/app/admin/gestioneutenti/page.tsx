'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, User, Edit2, Lock, Trash2, Search, X } from 'lucide-react';
import Header from '@/app/components/Header';
import Menu from '@/app/components/Menu';
import { UserModal } from '@/app/components/modal/CreateUserModal';
import { PasswordResetModal } from '@/app/components/modal/PasswordResetModal';
import { UserStatsCard } from '@/app/components/cards/UserStatsCards';
import { DeleteUserModal } from '@/app/components/modal/DeleteUserModal';
import { useNotification } from '@/app/components/notification/NotificationContex';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { useUsersManagement } from '@/hooks/useUsersManagement';

interface UserData {
  id: number;
  username: string;
  isadmin: number;
  createdat: string;
}

const UsersManagementPage = () => {
  const { currentUser, isAdmin, logout, isLoading: authLoading } = useAuth();
  const { execute } = useApi();
  const { users, error, loadUsers } = useUsersManagement();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const [deleteUserData, setDeleteUserData] = useState<{ id: number; username: string } | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<{ id: number; username: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  // Funzione di filtro per cercare utenti per username o ID
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const matchesUsername = user.username.toLowerCase().includes(query);
    const matchesId = user.id.toString().includes(query);
    
    return matchesUsername || matchesId;
  });

  const handleSaveUser = async (formData: FormData) => {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const isAdminChecked = formData.get('isAdmin') === 'on';

    try {
      if (editingUser) {
        if ((editingUser.isadmin === 1) !== isAdminChecked) {
          await execute(`/admin/users/${editingUser.id}/toggle-admin`, {
            method: 'PUT'
          });
          showSuccess('Privilegi utente modificati correttamente!');
        } else {
          showInfo('Nessuna modifica da salvare');
        }
      } else {
        await execute('/admin/users', {
          method: 'POST',
          body: {
            username,
            password,
            isAdmin: isAdminChecked
          }
        });
        showSuccess('Utente creato correttamente!');
      }

      setShowUserModal(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error: any) {
      console.error('❌ Errore durante il salvataggio:', error);
      showError(error.message || 'Errore durante il salvataggio');
    }
  };

  const handleEditUser = (user: UserData) => { setEditingUser(user); setShowUserModal(true); };
  const handleDeleteUser = (userId: number, username: string) => { setDeleteUserData({ id: userId, username }); };

  const handleConfirmDelete = async () => {
    if (!deleteUserData) return;

    try {
      await execute(`/admin/users/${deleteUserData.id}`, {
        method: 'DELETE'
      });
      showSuccess('Utente eliminato correttamente!');
      setDeleteUserData(null);
      await loadUsers();
    } catch (err: any) {
      console.error('❌ Errore eliminazione:', err);
      showError(err.message || 'Errore durante l\'eliminazione');
      throw err;
    }
  };

  const handleResetPassword = (userId: number, username: string) => { setResetPasswordUser({ id: userId, username }); };

  const handlePasswordResetSubmit = async (newPassword: string) => {
    if (!resetPasswordUser) return;

    try {
      await execute(`/admin/users/${resetPasswordUser.id}/reset-password`, {
        method: 'PUT',
        body: { newPassword }
      });
      showSuccess('Password resettata con successo!');
      setResetPasswordUser(null);
    } catch (err: any) {
      console.error('❌ Errore reset password:', err);
      showError(err.message || 'Errore durante il reset della password');
      throw err;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Caricamento...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} isAdmin={isAdmin} handleLogout={logout} />
      <Menu />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestione Utenti</h1>
              {error && <p className="text-sm text-red-600 mt-1">⚠️ {error}</p>}
            </div>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowUserModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            <span>Nuovo Utente</span>
          </button>
        </div>

        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UserStatsCard
            title="Totale Utenti"
            value={users.length}
            icon={Users}
            iconColor="text-indigo-600"
          />
          <UserStatsCard
            title="Amministratori"
            value={users.filter(u => u.isadmin === 1).length}
            icon={Shield}
            iconColor="text-purple-600"
          />
          <UserStatsCard
            title="Utenti Standard"
            value={users.filter(u => u.isadmin === 0).length}
            icon={User}
            iconColor="text-green-600"
          />
        </div>

        {/* Tabella Utenti */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Elenco Utenti</h2>
              
              {/* Barra di ricerca */}
              <div className="relative w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cerca per username o ID.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Contatore risultati */}
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'risultato' : 'risultati'} trovato/i
              </p>
            )}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery ? 'Nessun utente trovato' : 'Nessun utente trovato'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {searchQuery 
                  ? 'Prova con un altro termine di ricerca' 
                  : error 
                    ? 'Controlla la console del browser per maggiori dettagli' 
                    : 'Inizia creando il primo utente'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ruolo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Creazione
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => {
                    const isCurrentUser = user.username === currentUser;
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.username}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs text-indigo-600 font-semibold">(Tu)</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isadmin === 1 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Utente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdat)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Modifica ruolo"
                            >
                              <Edit2 className="w-4 h-4 text-indigo-600" />
                            </button>
                            <button
                              onClick={() => handleResetPassword(user.id, user.username)}
                              className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Reset password"
                            >
                              <Lock className="w-4 h-4 text-yellow-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={isCurrentUser ? "Non puoi eliminare il tuo account" : "Elimina"}
                              disabled={isCurrentUser}
                            >
                              <Trash2 className={`w-4 h-4 ${isCurrentUser ? 'text-gray-300' : 'text-red-600'}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <UserModal
        show={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        onSubmit={handleSaveUser}
        editingUser={editingUser}
      />

      <PasswordResetModal
        show={resetPasswordUser !== null}
        onClose={() => setResetPasswordUser(null)}
        onSubmit={handlePasswordResetSubmit}
        username={resetPasswordUser?.username}
      />

      <DeleteUserModal
        show={deleteUserData !== null}
        onClose={() => setDeleteUserData(null)}
        onConfirm={handleConfirmDelete}
        username={deleteUserData?.username || ''}
        isCurrentUser={deleteUserData?.username === currentUser}
      />
    </div>
  );
};

export default UsersManagementPage;
