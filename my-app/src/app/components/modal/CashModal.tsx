import React from "react";
import { X } from "lucide-react";
import { AccountType } from "@/hooks/types";

interface CashModalProps {
  show: boolean;
  onClose: () => void;
  getAccountBalance: (type: AccountType) => number;
  updateAccountBalance: (type: AccountType, value: number) => void;
  formatCurrency: (value: number) => string;
  getCashTotal: () => number;
}

interface CashSection {
  title: string;
  accounts: { type: AccountType; label: string }[];
}

const CASH_SECTIONS: CashSection[] = [
  {
    title: "Portafoglio",
    accounts: [
      { type: "portafoglio_carte" as AccountType, label: "Carte" },
      { type: "portafoglio_monete" as AccountType, label: "Monete" },
    ],
  },
  {
    title: "Musigna",
    accounts: [
      { type: "musigna_carte" as AccountType, label: "Carte" },
      { type: "musigna_monete" as AccountType, label: "Monete" },
    ],
  },
];

export const CashModal: React.FC<CashModalProps> = ({ show, onClose, getAccountBalance, updateAccountBalance, formatCurrency, getCashTotal }) => {
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

  const getSectionTotal = (accounts: { type: AccountType }[]) => {
    return accounts.reduce((sum, { type }) => sum + getAccountBalance(type), 0);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cash-modal-title">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 id="cash-modal-title" className="text-lg font-semibold text-gray-900">Dettaglio Contanti</h3>
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
        <div className="p-6 space-y-6">
          {CASH_SECTIONS.map(({ title, accounts }) => (
            <section key={title}>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">{title}</h4>
              <div className="space-y-3 pl-4">
                {accounts.map(({ type, label }) => (
                  <div key={type} className="flex justify-between items-center gap-4">
                    <label htmlFor={type} className="text-sm text-gray-600">
                      {label}
                    </label>
                    <input
                      id={type}
                      type="text"
                      inputMode="decimal"
                      value={getAccountBalance(type)}
                      onChange={(e) => handleInputChange(type, e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-right text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                      aria-label={`Importo ${label.toLowerCase()} ${title.toLowerCase()}`}
                    />
                  </div>
                ))}

                {/* Subtotal */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Totale {title}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(getSectionTotal(accounts))}
                  </span>
                </div>
              </div>
            </section>
          ))}

          {/* Grand Total */}
          <div className="pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Totale Contanti</span>
              <span className="text-xl font-bold text-indigo-600">
                {formatCurrency(getCashTotal())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
