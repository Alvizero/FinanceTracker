'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseAuthReturn {
  currentUser: string;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
  getToken: () => string | null;
  getAuthHeaders: () => HeadersInit;
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token) {
      router.push('/login');
      return;
    }

    if (username) {
      setCurrentUser(username);
      checkIfAdmin(username);
    }

    setIsLoading(false);
  }, [router]);

  const checkIfAdmin = async (username: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      }
    } catch (err) {
      console.error('Errore verifica admin:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const getToken = () => localStorage.getItem('token');

  const getAuthHeaders = (): HeadersInit => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  return {
    currentUser,
    isAdmin,
    isLoading,
    logout,
    getToken,
    getAuthHeaders,
  };
};
