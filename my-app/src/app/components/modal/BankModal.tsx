import React from "react";
import { X } from "lucide-react";
import { AccountType } from "./types";

interface BankModalProps {
  show: boolean;
  onClose: () => void;
  getAccountLabel: (type: AccountType) => string;
  getAccountBalance: (type: AccountType) => number;
  updateAccountBalance: (type: AccountType, value: number) => void;
  formatCurrency: (value: number) => string;
  getBankTotal: () => number;
}

const BANK_ACCOUNTS: AccountType[] = ["banca_intesa", "revolut", "paypal"];

export const BankModal: React.FC<BankModalProps> = ({ show, onClose, getAccountLabel, getAccountBalance, updateAccountBalance, formatCurrency, getBankTotal }) => {
  const handleInputChange = (type: AccountType, value: string) => {
    const normalizedValue = value.replace(",", ".");
    updateAccountBalance(type, parseFloat(normalizedValue) || 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ",") {
      e.preventDefault();
      const input = e.currentTarget;
      const start = input.selectionStart || 0;
      const currentValue = input.value;
      input.value = `${currentValue.substring(0, start)}.${currentValue.substring(start)}`;
      input.setSelectionRange(start + 1, start + 1);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bank-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 id="bank-modal-title" className="text-lg font-semibold text-gray-900">
            Dettaglio Banche
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {BANK_ACCOUNTS.map((type) => (
            <div key={type} className="flex justify-between items-center gap-4">
              <label htmlFor={type} className="text-sm font-medium text-gray-700">
                {getAccountLabel(type)}
              </label>
              <input
                id={type}
                type="text"
                inputMode="decimal"
                value={getAccountBalance(type)}
                onChange={(e) => handleInputChange(type, e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-36 px-3 py-2 border border-gray-200 rounded-lg text-right text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                aria-label={`Saldo ${getAccountLabel(type)}`}
              />
            </div>
          ))}

          {/* Total */}
          <div className="pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Totale Banche</span>
              <span className="text-xl font-bold text-indigo-600">
                {formatCurrency(getBankTotal())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
