'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType, ToastProps } from '@/app/components/notification/NotificationToast';

interface NotificationOptions {
  message: string;
  description?: string;
  duration?: number;
}

interface NotificationContextType {
  showSuccess: (options: NotificationOptions | string) => void;
  showError: (options: NotificationOptions | string) => void;
  showWarning: (options: NotificationOptions | string) => void;
  showInfo: (options: NotificationOptions | string) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface ToastData extends Omit<ToastProps, 'onClose'> {}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showNotification = useCallback(
    (type: ToastType, options: NotificationOptions | string) => {
      const normalizedOptions =
        typeof options === 'string' ? { message: options } : options;

      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastData = {
        id,
        type,
        ...normalizedOptions,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const showSuccess = useCallback(
    (options: NotificationOptions | string) => {
      showNotification('success', options);
    },
    [showNotification]
  );

  const showError = useCallback(
    (options: NotificationOptions | string) => {
      showNotification('error', options);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (options: NotificationOptions | string) => {
      showNotification('warning', options);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (options: NotificationOptions | string) => {
      showNotification('info', options);
    },
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        dismiss,
        dismissAll,
      }}
    >
      {children}

      {/* Toast Container */}
      <div
        className="fixed top-4 right-4 z-[9999] pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={dismiss} />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification deve essere usato all\'interno di NotificationProvider'
    );
  }
  return context;
};
