'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Building2, ChevronDown, ChevronUp, Plus, Edit2, Trash2, User } from 'lucide-react';

import Header from "@/app/components/Header";
import Menu from "@/app/components/Menu";
import { BankModal } from '@/app/components/modal/BankModal';
import { CashModal } from '@/app/components/modal/CashModal';
import { TransactionModal } from '@/app/components/modal/TransactionModal';
import DashboardCard from '@/app/components/cards/DashboardCard';
import { useNotification } from '@/app/components/notification/NotificationContex';
import { useConfirm } from '@/app/components/modal/ConfirmDialoogModal';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useDashboardData } from '@/hooks/useDashboardData';

type AccountType = 'banca_intesa' | 'revolut' | 'paypal' | 'portafoglio_carte' | 'portafoglio_monete' | 'musigna_carte' | 'musigna_monete' | 'sterline';
type TransactionType = 'ingresso' | 'uscita';
type PaymentMethod = 'contanti' | 'carta';

interface Account {
    type: AccountType;
    balance: number;
}

interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    source: AccountType;
    description: string;
    timestamp: string;
    accountSnapshot?: any;
}

interface DailySummary {
    date: string;
    totalIngressi: number;
    totalUscite: number;
    balance: number;
    count: number;
    transactions: Transaction[];
    cashIngressi: number;
    cashUscite: number;
    bankIngressi: number;
    bankUscite: number;
    cashBalance: number;
    bankBalance: number;
    totalCashAtDate: number;
    totalBankAtDate: number;
    totalAtDate: number;
}

const accountTypeMap: Record<string, AccountType> = {
    bancaintesa: 'banca_intesa',
    banca_intesa: 'banca_intesa',
    revolut: 'revolut',
    paypal: 'paypal',
    portafogliocarte: 'portafoglio_carte',
    portafoglio: 'portafoglio_carte',
    portafogliomonete: 'portafoglio_monete',
    musignacarte: 'musigna_carte',
    musigna: 'musigna_carte',
    musignamonete: 'musigna_monete',
    sterline: 'sterline'
};

const cashAccounts: AccountType[] = ['portafoglio_carte', 'portafoglio_monete', 'musigna_carte', 'musigna_monete'];
const bankAccounts: AccountType[] = ['banca_intesa', 'revolut', 'paypal'];

const formatCurrency = (amount: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const DashboardPage = () => {
    const { currentUser, isAdmin, logout } = useAuth();
    const { execute } = useApi();
    const { withLoading } = useLoadingState();
    const { accounts, dailySummaries, setAccounts, setDailySummaries, loadUserData } = useDashboardData();
    const { showSuccess, showError, showWarning } = useNotification();
    const { confirm, ConfirmDialog } = useConfirm();
    const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
    const [showBankModal, setShowBankModal] = useState(false);
    const [showCashModal, setShowCashModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [selectedSource, setSelectedSource] = useState('banca_intesa');
    const [formAmountCarta, setFormAmountCarta] = useState('');
    const [formAmountMonete, setFormAmountMonete] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const getTotalBalance = () => accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const getBankTotal = () => accounts.filter(a => bankAccounts.includes(a.type)).reduce((sum, acc) => sum + acc.balance, 0);
    const getCashTotal = () => accounts.filter(a => cashAccounts.includes(a.type)).reduce((sum, acc) => sum + acc.balance, 0);

    const getMonthlyVariation = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let monthlyIngressi = 0;
        let monthlyUscite = 0;

        dailySummaries.forEach(summary => {
            const date = new Date(summary.date);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                monthlyIngressi += summary.totalIngressi;
                monthlyUscite += summary.totalUscite;
            }
        });

        return monthlyIngressi - monthlyUscite;
    };

    const getAccountBalance = (type: AccountType) => accounts.find(a => a.type === type)?.balance || 0;

    const updateAccountBalance = async (type: AccountType, newBalance: number) => {
        try {
            const dbType = Object.entries(accountTypeMap).find(([key, val]) => val === type)?.[0] || type;

            await execute('/accounts/update', {
                method: 'PUT',
                body: {
                    accountType: dbType,
                    balance: newBalance
                }
            });

            setAccounts(prev =>
                prev.map(a => a.type === type ? { ...a, balance: newBalance } : a)
            );
        } catch (err) {
            console.error('Errore aggiornamento saldo:', err);
            showError('Errore durante l\'aggiornamento del saldo');
        }
    };

    const toggleDayExpansion = (date: string) => {
        setExpandedDays(prev => {
            const newSet = new Set(prev);
            if (newSet.has(date)) newSet.delete(date);
            else newSet.add(date);
            return newSet;
        });
    };

    const handleDeleteTransaction = async (id: string) => {
        const confirmed = await confirm({
            title: 'Elimina Transazione',
            message: 'Sei sicuro di voler eliminare definitivamente questa transazione? Questa azione non può essere annullata.',
            confirmLabel: 'Elimina',
            cancelLabel: 'Annulla',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            await execute(`/transactions/${id}`, {
                method: 'DELETE'
            });

            showSuccess('Transazione eliminata correttamente!');
            await loadUserData();
        } catch (err: any) {
            console.error("❌ Errore eliminazione:", err);
            showError(err.message || 'Errore durante l\'eliminazione');
        }
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);

        if (transaction.source.includes('portafoglio')) {
            setSelectedSource('portafoglio');
        } else if (transaction.source.includes('musigna')) {
            setSelectedSource('musigna');
        } else {
            setSelectedSource(transaction.source);
        }

        if (transaction.source.includes('portafoglio') || transaction.source.includes('musigna')) {
            if (transaction.paymentMethod === 'carta') {
                setFormAmountCarta(transaction.amount.toString());
                setFormAmountMonete('0');
            } else {
                setFormAmountCarta('0');
                setFormAmountMonete(transaction.amount.toString());
            }
        } else {
            setFormAmountCarta(transaction.amount.toString());
            setFormAmountMonete('0');
        }

        setShowTransactionModal(true);
    };

    const getAccountLabel = (type: AccountType) => {
        const labels: Record<AccountType, string> = {
            'banca_intesa': 'Banca Intesa',
            'revolut': 'Revolut',
            'paypal': 'PayPal',
            'portafoglio_carte': 'Portafoglio - Carte',
            'portafoglio_monete': 'Portafoglio - Monete',
            'musigna_carte': 'Musigna - Carte',
            'musigna_monete': 'Musigna - Monete',
            'sterline': 'Sterline'
        };
        return labels[type];
    };

    const handleSaveTransaction = async (formData: FormData) => {
        const date = formData.get("date") as string;
        const type = formData.get("type") as string;
        const description = formData.get("description") as string;
        const source = formData.get("source") as string;

        const amountCartaStr = (formData.get("amountCarta") as string || "0").replace(",", ".");
        const amountMoneteStr = (formData.get("amountMonete") as string || "0").replace(",", ".");

        const amountCarta = parseFloat(amountCartaStr) || 0;
        const amountMonete = parseFloat(amountMoneteStr) || 0;
        const totalAmount = amountCarta + amountMonete;

        if (totalAmount <= 0) {
            showWarning("Inserisci un importo valido.");
            return;
        }

        const mappedSource = accountTypeMap[source] || source;

        try {
            const endpoint = editingTransaction ? `/transactions/${editingTransaction.id}` : '/transactions';
            const method = editingTransaction ? 'PUT' : 'POST';

            await execute(endpoint, {
                method,
                body: {
                    date,
                    type,
                    description,
                    sourceAccount: mappedSource,
                    amountCarta,
                    amountMonete,
                }
            });

            showSuccess("Transazione salvata correttamente!");
            setShowTransactionModal(false);
            setEditingTransaction(null);

            await loadUserData();
        } catch (error: any) {
            console.error("❌ Errore durante il salvataggio:", error);
            showError(error.message || "Impossibile salvare la transazione");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header currentUser={currentUser} isAdmin={isAdmin} handleLogout={logout} />
            <Menu />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <DashboardCard
                        title="Totale Patrimonio"
                        value={formatCurrency(getTotalBalance())}
                    />
                    <DashboardCard
                        title="Soldi in Banca"
                        value={formatCurrency(getBankTotal())}
                        icon={<Building2 className="w-5 h-5 text-blue-500" />}
                        onClick={() => setShowBankModal(true)}
                    />
                    <DashboardCard
                        title="Soldi Cartacei"
                        value={formatCurrency(getCashTotal())}
                        icon={<Wallet className="w-5 h-5 text-green-500" />}
                        onClick={() => setShowCashModal(true)}
                    />
                    <DashboardCard
                        title="Variazione Mensile"
                        bgClass="bg-white"
                        customContent={
                            <div className={`text-2xl font-bold flex items-center ${getMonthlyVariation() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {getMonthlyVariation() >= 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                                {formatCurrency(Math.abs(getMonthlyVariation()))}
                            </div>
                        }
                    />
                    <DashboardCard
                        title="Benventuo"
                        value={currentUser}
                        icon={<User className="w-5 h-5 text-green-500" />}
                    />
                </div>

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => {
                            setEditingTransaction(null);
                            setSelectedSource('banca_intesa');
                            setFormAmountCarta('');
                            setFormAmountMonete('');
                            setShowTransactionModal(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <Plus className="w-5 h-5" />
                        <span>Nuova Transazione</span>
                    </button>
                </div>

                {/* Storico Transazioni */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Storico Transazioni</h2>
                    </div>
                    {dailySummaries.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Nessuna transazione trovata</p>
                            <p className="text-sm mt-2">Inizia creando la tua prima transazione</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {dailySummaries.map(summary => (
                                <div key={summary.date}>
                                    {/* Riga Riepilogo Giornaliero */}
                                    <div
                                        onClick={() => toggleDayExpansion(summary.date)}
                                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="font-medium text-gray-800">{formatDate(summary.date)}</div>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    {summary.count} transazioni
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                {/* Soldi Fisici */}
                                                <div className="text-right min-w-[140px]">
                                                    <div className="text-xs text-gray-500 font-semibold mb-1">Fisici</div>
                                                    <div className="text-sm mb-1">
                                                        <span className="text-green-600 font-medium">+{formatCurrency(summary.cashIngressi)}</span>
                                                        <span className="text-gray-400 mx-1">/</span>
                                                        <span className="text-red-600 font-medium">-{formatCurrency(summary.cashUscite)}</span>
                                                    </div>
                                                    <div className={`text-sm font-semibold ${summary.cashBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        Bilancio: {formatCurrency(summary.cashBalance)}
                                                    </div>
                                                    <div className="text-sm font-bold text-blue-600 mt-1">
                                                        Totale: {formatCurrency(summary.totalCashAtDate)}
                                                    </div>
                                                </div>

                                                {/* Soldi Virtuali */}
                                                <div className="text-right min-w-[140px]">
                                                    <div className="text-xs text-gray-500 font-semibold mb-1">Virtuali</div>
                                                    <div className="text-sm mb-1">
                                                        <span className="text-green-600 font-medium">+{formatCurrency(summary.bankIngressi)}</span>
                                                        <span className="text-gray-400 mx-1">/</span>
                                                        <span className="text-red-600 font-medium">-{formatCurrency(summary.bankUscite)}</span>
                                                    </div>
                                                    <div className={`text-sm font-semibold ${summary.bankBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        Bilancio: {formatCurrency(summary.bankBalance)}
                                                    </div>
                                                    <div className="text-sm font-bold text-blue-600 mt-1">
                                                        Totale: {formatCurrency(summary.totalBankAtDate)}
                                                    </div>
                                                </div>

                                                {/* Totale Generale */}
                                                <div className="text-right min-w-[140px]">
                                                    <div className="text-xs text-gray-500 font-semibold mb-1">TOTALE</div>
                                                    <div className="text-sm mb-1">
                                                        <span className="text-green-600 font-bold">+{formatCurrency(summary.totalIngressi)}</span>
                                                        <span className="text-gray-400 mx-1">/</span>
                                                        <span className="text-red-600 font-bold">-{formatCurrency(summary.totalUscite)}</span>
                                                    </div>
                                                    <div className={`text-base font-bold ${summary.balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        Bilancio: {formatCurrency(summary.balance)}
                                                    </div>
                                                    <div className="text-base font-bold text-indigo-600 mt-1">
                                                        Patrimonio: {formatCurrency(summary.totalAtDate)}
                                                    </div>
                                                </div>

                                                {expandedDays.has(summary.date) ?
                                                    <ChevronUp className="w-5 h-5 text-gray-400" /> :
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dettaglio Transazioni */}
                                    {expandedDays.has(summary.date) && (
                                        <div className="bg-gray-50 p-4">
                                            <div className="space-y-2">
                                                {summary.transactions.map(transaction => (
                                                    <div key={transaction.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-sm text-gray-600 w-16">{transaction.timestamp}</div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'ingresso'
                                                                ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}> {transaction.type === 'ingresso' ? 'Ingresso' : 'Uscita'}
                                                            </span>
                                                            <div className="font-semibold text-gray-800">{formatCurrency(transaction.amount)}</div>
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"> {transaction.paymentMethod === 'contanti' ? 'Contanti' : 'Carta'}
                                                            </span>
                                                            <div className="text-sm text-gray-600">{getAccountLabel(transaction.source)}</div>
                                                            <div className="text-sm text-gray-800">{transaction.description}</div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleEditTransaction(transaction)}
                                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <Edit2 className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <BankModal
                show={showBankModal}
                onClose={() => setShowBankModal(false)}
                getAccountLabel={getAccountLabel}
                getAccountBalance={getAccountBalance}
                updateAccountBalance={updateAccountBalance}
                formatCurrency={formatCurrency}
                getBankTotal={getBankTotal}
            />

            <CashModal
                show={showCashModal}
                onClose={() => setShowCashModal(false)}
                getAccountBalance={getAccountBalance}
                updateAccountBalance={updateAccountBalance}
                formatCurrency={formatCurrency}
                getCashTotal={getCashTotal}
            />

            <TransactionModal
                show={showTransactionModal}
                onClose={() => {
                    setShowTransactionModal(false);
                    setEditingTransaction(null);
                }}
                onSubmit={handleSaveTransaction}
                editingTransaction={editingTransaction}
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                formAmountCarta={formAmountCarta}
                setFormAmountCarta={setFormAmountCarta}
                formAmountMonete={formAmountMonete}
                setFormAmountMonete={setFormAmountMonete}
            />
            <ConfirmDialog />
        </div>
    );
}

export default DashboardPage;
