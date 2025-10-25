'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

interface UseApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    showError?: boolean;
}

interface UseApiReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    execute: (endpoint: string, options?: UseApiOptions) => Promise<T>;
}

export function useApi<T = any>(): UseApiReturn<T> {
    const { getAuthHeaders } = useAuth();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (endpoint: string, options: UseApiOptions = {}): Promise<T> => {
        const { method = 'GET', body, showError = true } = options;

        setLoading(true);
        setError(null);

        try {
            const url = endpoint.startsWith('http') ? endpoint : `${`${process.env.NEXT_PUBLIC_API_URL}`}${endpoint}`;
            const res = await fetch(url, { method, headers: getAuthHeaders(), ...(body && { body: JSON.stringify(body) }) });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || `Errore HTTP ${res.status}`);
            }

            const responseData = await res.json();
            setData(responseData);
            return responseData;
        } catch (err: any) {
            const errorMessage = err.message || 'Errore durante la richiesta';
            setError(errorMessage);
            if (showError) {
                console.error('❌ Errore API:', errorMessage);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, execute };
}
