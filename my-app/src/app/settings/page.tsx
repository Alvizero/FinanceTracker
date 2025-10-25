'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Key, Shield } from 'lucide-react';
import Header from "@/app/components/Header";
import Menu from "@/app/components/Menu";
import { PasswordResetModal } from '@/app/components/modal/PasswordResetModal';
import InfoCard from '@/app/components/cards/SettingsInfoCard';
import { useNotification } from '@/app/components/notification/NotificationContex';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { useLoadingState } from '@/hooks/useLoadingState';

interface UserSettings {
    id: number;
    username: string;
    isadmin: number;
}

const SettingsPage = () => {
    const { currentUser, isAdmin, logout } = useAuth();
    const { execute } = useApi();
    const { isLoading: loading, error, withLoading, setError } = useLoadingState();
    const { showSuccess, showError } = useNotification();
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        loadUserSettings();
    }, []);

    const loadUserSettings = async () => {
        try {
            await withLoading(async () => {
                const data = await execute('/user/settings', {
                    method: 'POST',
                    body: {}
                });
                setUserSettings(data);
                setError(null);
            });
        } catch (err: any) {
            console.error('❌ Errore caricamento impostazioni:', err);
        }
    };

    const handleResetPassword = async (newPassword: string) => {
        try {
            await execute('/user/reset-password', {
                method: 'PUT',
                body: { newPassword }
            });

            showSuccess('Password modificata con successo!');
            setShowPasswordModal(false);
        } catch (err: any) {
            console.error('❌ Errore reset password:', err);
            showError(err.message || 'Errore durante il reset della password');
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600">Caricamento...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header currentUser={currentUser} isAdmin={isAdmin} handleLogout={logout} />
            <Menu />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <User className="w-8 h-8 text-indigo-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Impostazioni Account</h1>
                            {error && <p className="text-sm text-red-600 mt-1">⚠️ {error}</p>}
                        </div>
                    </div>
                </div>

                {/* Informazioni Utente */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Informazioni Personali</h2>
                        <p className="text-sm text-gray-500 mt-1">Visualizza i tuoi dati account</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <InfoCard
                            icon={User}
                            iconColor="text-indigo-600"
                            iconBgColor="bg-indigo-100"
                            label="Username"
                            value={userSettings?.username || ''}
                        />
                        <InfoCard
                            icon={Key}
                            iconColor="text-purple-600"
                            iconBgColor="bg-purple-100"
                            label="ID Utente"
                            value={userSettings?.id.toString() || ''}
                        />
                        <InfoCard
                            icon={Shield}
                            iconColor="text-green-600"
                            iconBgColor="bg-green-100"
                            label="Ruolo"
                            value={
                                userSettings?.isadmin === 1 ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">Admin</span>
                                ) : (
                                    <span>Utente</span>
                                )
                            }
                        />

                        {/* Password */}
                        <InfoCard
                            icon={Lock}
                            iconColor="text-yellow-600"
                            iconBgColor="bg-yellow-100"
                            label="Password"
                            value="••••••••"
                        >
                            <button onClick={() => setShowPasswordModal(true)} className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                                Modifica Password
                            </button>
                        </InfoCard>
                    </div>
                </div>
            </main>

            {/* Modal Reset Password */}
            <PasswordResetModal
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSubmit={handleResetPassword}
            />
        </div>
    );
};

export default SettingsPage;
