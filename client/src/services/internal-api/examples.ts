// Exemplo de como usar os serviços internal-api implementados

import { auth } from '@/services/internal-api/auth';
import { availableTimes } from '@/services/internal-api/available-times';
import { schedulings } from '@/services/internal-api/schedulings';
import { services } from '@/services/internal-api/services';
import { ubs } from '@/services/internal-api/ubs';
import { users } from '@/services/internal-api/users';

// ===== EXEMPLO DE USO COM LOGIN =====

export const handleLogin = async (identifier: string, password: string) => {
  try {
    const response = await auth.loginUser({
      identifier,
      password,
    });

    console.log('Login realizado:', response);
    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// ===== EXEMPLO DE USO COM CRIAÇÃO DE USUÁRIO =====

export const handleCreateUser = async (userData: {
  cpf: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
  zipcode: string;
  address: string;
}) => {
  try {
    const response = await users.createUser(userData);
    console.log('Usuário criado:', response);
    return response;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// ===== EXEMPLO DE USO COM AGENDAMENTOS =====

export const handleCreateScheduling = async (availableTimeId: string) => {
  try {
    const response = await schedulings.createScheduling({
      availableTimeId,
    });
    console.log('Agendamento criado:', response);
    return response;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

export const handleConfirmScheduling = async (
  id: string,
  confirmCode: string,
) => {
  try {
    const response = await schedulings.confirmScheduling({
      id,
      confirmCode,
    });
    console.log('Agendamento confirmado:', response);
    return response;
  } catch (error) {
    console.error('Erro ao confirmar agendamento:', error);
    throw error;
  }
};

// ===== EXEMPLO DE USO COM HORÁRIOS DISPONÍVEIS =====

export const handleGetAvailableTimes = async (filters: {
  ubsId?: string;
  serviceId?: string;
  date?: string;
}) => {
  try {
    const response = await availableTimes.getAvailableTimes(filters);
    console.log('Horários disponíveis:', response);
    return response;
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
};

// ===== EXEMPLO DE USO COM useRequestApi (você mencionou) =====

/* 
import { useRequestApi } from '@/hooks/use-request-api';

export const useLogin = () => {
  return useRequestApi(
    () => auth.loginUser({ identifier: 'user@test.com', password: '123456' }),
    {
      onSuccess: (data) => {
        console.log('Login realizado com sucesso!', data);
        // Redirecionar para dashboard, salvar token, etc.
      },
      onError: (error) => {
        console.error('Erro no login:', error.message);
        // Mostrar toast de erro, etc.
      }
    }
  );
};
*/

// ===== EXEMPLO DE USO EM COMPONENTE REACT =====

/*
'use client';

import { useState } from 'react';
import { auth } from '@/services/internal-api/auth';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await auth.loginUser({
        identifier,
        password,
      });

      console.log('Login bem-sucedido:', response);
      // Redirecionar para o dashboard
      
    } catch (error) {
      console.error('Erro no login:', error);
      // Mostrar mensagem de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Email ou CPF"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
*/
