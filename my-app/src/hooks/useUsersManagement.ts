'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from './useApi';

interface UserData {
  id: number;
  username: string;
  isadmin: number;
  createdat: string;
}

interface UseUsersManagementReturn {
  users: UserData[];
  error: string | null;
  loading: boolean;
  loadUsers: () => Promise<void>;
  setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
}

export function useUsersManagement(): UseUsersManagementReturn {
  const { execute } = useApi();
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await execute('/admin/users', {
        method: 'GET'
      });

      console.log('✅ Utenti caricati:', data);
      setUsers(data);
      setError(null);
    } catch (err: any) {
      console.error('❌ Errore caricamento utenti:', err);
      setError(err.message || 'Errore durante il caricamento degli utenti');
    } finally {
      setLoading(false);
    }
  };

  return { users, error, loading, loadUsers, setUsers };
}
