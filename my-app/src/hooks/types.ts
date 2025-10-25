// Account types for bank management
export type AccountType = | "banca_intesa" | "revolut" | "paypal" | "portafoglio_carte" | "portafoglio_monete" | "musigna_carte" | "musigna_monete" | "sterline";

export type TransactionType = "ingresso" | "uscita";
export type PaymentMethod = "contanti" | "carta";

// Base Transaction interface
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  source: AccountType;
  description: string;
  timestamp: string;
  amountCarta: number;
  amountMonete: number;
  accountSnapshot?: any;
}

// Interface for bank account data
export interface BankAccount {
  type: AccountType;
  label: string;
  balance: number;
}

// Daily summary interface
export interface DailySummary {
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

// Props interface for components that manage accounts
export interface AccountManagementProps {
  getAccountLabel: (type: AccountType) => string;
  getAccountBalance: (type: AccountType) => number;
  updateAccountBalance: (type: AccountType, value: number) => void;
  formatCurrency: (value: number) => string;
  getBankTotal: () => number;
}
