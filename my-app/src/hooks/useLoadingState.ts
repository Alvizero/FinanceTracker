'use client';

import { useState } from 'react';

interface UseLoadingStateReturn {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

export function useLoadingState(): UseLoadingStateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLoading = (loading: boolean) => { setIsLoading(loading); if (loading) setError(null);};

  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Si è verificato un errore';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, error, setLoading, setError, withLoading };
}
