'use client';

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useConfirm } from './ConfirmDialoogModal';
import { Transaction } from '@/hooks/types';
import { Dispatch, SetStateAction } from 'react';

interface TransactionModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  editingTransaction: Transaction | null;
  selectedSource: string;
  setSelectedSource: Dispatch<SetStateAction<string>>;
  formAmountCarta: string;
  setFormAmountCarta: Dispatch<SetStateAction<string>>;
  formAmountMonete: string;
  setFormAmountMonete: Dispatch<SetStateAction<string>>;
}

const SOURCES = [
  { value: "banca_intesa", label: "Banca Intesa" },
  { value: "revolut", label: "Revolut" },
  { value: "paypal", label: "PayPal" },
  { value: "portafoglio", label: "Portafoglio" },
  { value: "musigna", label: "Musigna" },
] as const;

const WALLET_SOURCES = ["portafoglio", "musigna"];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  show,
  onClose,
  onSubmit,
  editingTransaction,
  selectedSource,
  setSelectedSource,
  formAmountCarta,
  setFormAmountCarta,
  formAmountMonete,
  setFormAmountMonete
}) => {
  const { confirm, ConfirmDialog } = useConfirm();

  const showSplitAmount = WALLET_SOURCES.includes(selectedSource);
  const isEditing = Boolean(editingTransaction);

  // Stati per gli altri campi del form
  const [formDate, setFormDate] = React.useState(getLocalDateString());
  const [formType, setFormType] = React.useState("uscita");
  const [formDescription, setFormDescription] = React.useState("");

  // Sincronizza i valori quando editingTransaction cambia
  useEffect(() => {
    if (editingTransaction) {
      setFormDate(getLocalDateString(new Date(editingTransaction.date)));
      setFormType(editingTransaction.type);
      setFormDescription(editingTransaction.description || "");
    } else {
      // Reset per nuova transazione
      setFormDate(getLocalDateString());
      setFormType("uscita");
      setFormDescription("");
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditing) {
      const confirmed = await confirm({
        title: 'Conferma Modifica',
        message: 'Sei sicuro di voler modificare questa transazione? Le modifiche non possono essere annullate.',
        confirmLabel: 'Conferma Modifica',
        cancelLabel: 'Annulla',
        variant: 'info',
      });

      if (!confirmed) return;
    }

    // Crea FormData manualmente con i valori degli stati
    const formData = new FormData();
    formData.append('date', formDate);
    formData.append('type', formType);
    formData.append('description', formDescription);
    formData.append('source', selectedSource);
    formData.append('amountCarta', formAmountCarta || '0');
    formData.append('amountMonete', formAmountMonete || '0');

    await onSubmit(formData);
  };

  const handleAmountCartaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormAmountCarta(e.target.value);
  };

  const handleAmountMoneteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormAmountMonete(e.target.value);
  };

  function getLocalDateString(date = new Date()) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  }

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
              {isEditing ? "Modifica Transazione" : "Nuova Transazione"}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Data */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                required
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["ingresso", "uscita"].map((type) => (
                  <label
                    key={type}
                    className={`relative flex items-center justify-center px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all hover:border-indigo-300 ${formType === type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                      }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formType === type}
                      onChange={(e) => setFormType(e.target.value)}
                      className="sr-only"
                      required
                    />
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fonte */}
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                Fonte
              </label>
              <select
                id="source"
                name="source"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow appearance-none bg-white"
                required
              >
                {SOURCES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Importi */}
            {showSplitAmount ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="amountCarta" className="block text-sm font-medium text-gray-700 mb-2">
                    Carte (€)
                  </label>
                  <input
                    id="amountCarta"
                    type="number"
                    step="0.01"
                    min="0"
                    name="amountCarta"
                    value={formAmountCarta}
                    onChange={handleAmountCartaChange}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-right"
                  />
                </div>
                <div>
                  <label htmlFor="amountMonete" className="block text-sm font-medium text-gray-700 mb-2">
                    Monete (€)
                  </label>
                  <input
                    id="amountMonete"
                    type="number"
                    step="0.01"
                    min="0"
                    name="amountMonete"
                    value={formAmountMonete}
                    onChange={handleAmountMoneteChange}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-right"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="amountCarta" className="block text-sm font-medium text-gray-700 mb-2">
                  Importo (€)
                </label>
                <input
                  id="amountCarta"
                  type="number"
                  step="0.01"
                  min="0"
                  name="amountCarta"
                  value={formAmountCarta}
                  onChange={handleAmountCartaChange}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-right"
                  required
                />
              </div>
            )}

            {/* Descrizione */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrizione
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Inserisci una descrizione..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
              />
            </div>

            {/* Bottoni */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                {isEditing ? "Aggiorna" : "Salva"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Renderizza il ConfirmDialog */}
      <ConfirmDialog />
    </>
  );
};
