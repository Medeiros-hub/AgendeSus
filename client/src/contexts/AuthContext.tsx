'use client';

import { useRouter } from 'next/navigation';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { auth } from '@/services/internal-api/auth';

export type User = {
  id: string;
  fullName: string;
  email: string;
  type: string;
};

interface IAuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  handleLogin: (
    identifier: string,
    password: string,
    redirectTo?: string,
  ) => Promise<void | string>;
  handleLogOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  async function handleLogin(
    identifier: string,
    password: string,
    redirectTo?: string,
  ) {
    try {
      const response = await auth.loginUser({ identifier, password });

      const returnedUser = response.user
        ? {
            id: response.user.id,
            fullName: response.user.fullName ?? '',
            email: response.user.email,
            type: response.user.type,
          }
        : { id: '', fullName: identifier, email: identifier, type: 'patient' };

      setUser(returnedUser);

      router.push(redirectTo ?? '/');
    } catch (error: any) {
      console.error('Erro ao logar:', error);
      toast.error(
        error?.response?.data?.error ??
          error?.response.data.message ??
          'Falha no login',
      );
      return error?.message;
    }
  }

  async function handleLogOut() {
    try {
      await auth.logoutUser();
    } catch (err) {
      console.warn('Erro ao chamar logout no servidor', err);
    }

    setUser(null);
    router.push('/');
  }

  async function getUserLogged(signal?: AbortSignal) {
    try {
      const result = await api.get('/users/logged', { signal });
      setUser(result.data);
    } catch (error: any) {
      if (error?.name === 'CanceledError') return;
      console.debug(
        'Usuário não autenticado ou erro ao obter perfil:',
        error?.message,
      );
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    getUserLogged(controller.signal);
    return () => controller.abort();
  }, []);

  const value: IAuthContext = {
    user,
    setUser,
    isAuthenticated: !!user,
    handleLogin,
    handleLogOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export const useAuth = useAuthContext;
