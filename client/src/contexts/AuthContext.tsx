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
import { TGetUserProfileResponse } from '@/services/internal-api/types/users';

export type UserState = TGetUserProfileResponse;

interface IAuthContext {
  user: UserState | null;
  setUser: (user: UserState | null) => void;
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
  const [user, setUser] = useState<UserState | null>(null);
  const router = useRouter();

  async function handleLogin(
    identifier: string,
    password: string,
    redirectTo?: string,
  ) {
    try {
      const response = await auth.loginUser({ identifier, password });
      setUser({
        id: response.id,
        cpf: response.cpf,
        fullName: response.fullName,
        birthDate: response.birthDate,
        phone: response.phone,
        email: response.email,
        type: response.type,
        zipcode: response.zipcode,
        address: response.address,
        createdAt: response.createdAt,
      });

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
