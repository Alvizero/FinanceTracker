'use client';

import { useState } from 'react';
import { useApi } from './useApi';

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

interface UseDashboardDataReturn {
    accounts: Account[];
    dailySummaries: DailySummary[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
    setDailySummaries: React.Dispatch<React.SetStateAction<DailySummary[]>>;
    loadUserData: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
    const { execute } = useApi();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);

    const loadUserData = async () => {
        try {
            // Carica accounts
            const accountsData = await execute('/accounts');
            const mappedAccounts = accountsData.map((acc: any) => ({
                type: accountTypeMap[acc.accounttype] || acc.accounttype,
                balance: parseFloat(acc.balance)
            }));
            setAccounts(mappedAccounts);

            // Carica transactions
            const transactionsData = await execute('/transactions');

            if (!transactionsData || transactionsData.length === 0) {
                setDailySummaries([]);
                return;
            }

            // Mappa transazioni
            const mappedTransactions: Transaction[] = transactionsData.map((t: any) => ({
                id: t.id.toString(),
                date: t.date.split('T')[0],
                amount: parseFloat(t.amount),
                type: t.type,
                paymentMethod: t.paymentmethod,
                source: accountTypeMap[t.sourceaccount] || t.sourceaccount,
                description: t.description || '',
                timestamp: new Date(t.createdat).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
                accountSnapshot: t.account_snapshot ? JSON.parse(t.account_snapshot) : null
            }));

            // crea daily summaries
            const summariesMap = new Map<string, DailySummary>();
            const sortedTransactions = [...mappedTransactions].sort((a, b) => {
                const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                if (dateCompare !== 0) return dateCompare;
                return parseInt(a.id) - parseInt(b.id);
            });

            sortedTransactions.forEach((t) => {
                if (!summariesMap.has(t.date)) {
                    summariesMap.set(t.date, {
                        date: t.date,
                        totalIngressi: 0,
                        totalUscite: 0,
                        balance: 0,
                        count: 0,
                        transactions: [],
                        cashIngressi: 0,
                        cashUscite: 0,
                        bankIngressi: 0,
                        bankUscite: 0,
                        cashBalance: 0,
                        bankBalance: 0,
                        totalCashAtDate: 0,
                        totalBankAtDate: 0,
                        totalAtDate: 0
                    });
                }
                const summary = summariesMap.get(t.date)!;
                summary.transactions.push(t);
                summary.count++;

                const isCash = cashAccounts.includes(t.source);

                if (t.type === 'ingresso') {
                    summary.totalIngressi += t.amount;
                    if (isCash) {
                        summary.cashIngressi += t.amount;
                    } else {
                        summary.bankIngressi += t.amount;
                    }
                } else {
                    summary.totalUscite += t.amount;
                    if (isCash) {
                        summary.cashUscite += t.amount;
                    } else {
                        summary.bankUscite += t.amount;
                    }
                }

                summary.balance = summary.totalIngressi - summary.totalUscite;
                summary.cashBalance = summary.cashIngressi - summary.cashUscite;
                summary.bankBalance = summary.bankIngressi - summary.bankUscite;

                if (t.accountSnapshot) {
                    let totalCash = 0;
                    let totalBank = 0;

                    t.accountSnapshot.forEach((acc: any) => {
                        const balance = parseFloat(acc.balance);
                        const mappedType = accountTypeMap[acc.accounttype] || acc.accounttype;
                        if (cashAccounts.includes(mappedType)) {
                            totalCash += balance;
                        } else if (bankAccounts.includes(mappedType)) {
                            totalBank += balance;
                        }
                    });

                    summary.totalCashAtDate = totalCash;
                    summary.totalBankAtDate = totalBank;
                    summary.totalAtDate = totalCash + totalBank;
                }
            });

            setDailySummaries(Array.from(summariesMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        } catch (err) {
            console.error('Errore caricamento dati:', err);
            setDailySummaries([]);
        }
    };

    return { accounts, dailySummaries, setAccounts, setDailySummaries, loadUserData };
}
