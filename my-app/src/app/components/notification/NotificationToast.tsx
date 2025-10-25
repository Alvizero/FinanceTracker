'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    textColor: 'text-green-900',
    descColor: 'text-green-700',
    progressColor: 'bg-green-600',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
    descColor: 'text-red-700',
    progressColor: 'bg-red-600',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900',
    descColor: 'text-yellow-700',
    progressColor: 'bg-yellow-600',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
    descColor: 'text-blue-700',
    progressColor: 'bg-blue-600',
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  description,
  duration = 5000,
  onClose,
}) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor}
        border rounded-xl shadow-lg
        p-4 pr-10 mb-3 min-w-[320px] max-w-md
        animate-in slide-in-from-right duration-300
        hover:shadow-xl transition-shadow
        relative overflow-hidden
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-1 ${config.progressColor}`}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${config.textColor}`}>
            {message}
          </p>
          {description && (
            <p className={`text-sm mt-1 ${config.descColor}`}>
              {description}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => onClose(id)}
          className={`
            flex-shrink-0 p-1 rounded-lg
            hover:bg-black/5 transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${config.iconColor}
          `}
          aria-label="Chiudi notifica"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};
