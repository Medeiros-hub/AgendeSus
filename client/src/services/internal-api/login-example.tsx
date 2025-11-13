'use client';

import { useState } from 'react';

import { useRequestApi } from '@/hooks/use-request-api';
import { auth } from '@/services/internal-api/auth';

export default function LoginExample() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Exemplo de uso direto do serviço
  const handleDirectLogin = async () => {
    try {
      const response = await auth.loginUser({
        identifier,
        password,
      });

      console.log('Login realizado:', response.user);
      // Aqui você pode:
      // - Salvar dados do usuário no contexto/store
      // - Redirecionar para o dashboard
      // - Mostrar toast de sucesso
    } catch (error) {
      console.error('Erro no login:', error);
      // Mostrar mensagem de erro para o usuário
    }
  };

  // Exemplo de uso com useRequestApi (quando estiver implementado corretamente)
  /*
  const { handler: handleLoginWithHook, loading } = useRequestApi(
    () => auth.loginUser({ identifier, password }),
    {
      onSuccess: (data) => {
        console.log('Login bem-sucedido:', data);
        // Lógica de sucesso aqui
      },
      onError: (error) => {
        console.error('Erro no login:', error.message);
        // Lógica de erro aqui
      }
    }
  );
  */

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login - Exemplo de Uso</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Email ou CPF"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          onClick={handleDirectLogin}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Entrar (Método Direto)
        </button>

        {/* 
        <button
          onClick={handleLoginWithHook}
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar (Com Hook)'}
        </button>
        */}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Serviços Disponíveis:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ auth.loginUser() - Login de usuário</li>
          <li>✅ auth.logoutUser() - Logout de usuário</li>
          <li>✅ users.createUser() - Criação de usuário</li>
          <li>✅ users.updateUser() - Atualização de usuário</li>
          <li>✅ users.getUserProfile() - Perfil do usuário</li>
          <li>✅ users.getUserById() - Buscar usuário por ID</li>
          <li>✅ schedulings.createScheduling() - Criar agendamento</li>
          <li>✅ schedulings.confirmScheduling() - Confirmar agendamento</li>
          <li>✅ schedulings.cancelScheduling() - Cancelar agendamento</li>
          <li>✅ schedulings.getUserSchedulings() - Agendamentos do usuário</li>
          <li>✅ availableTimes.getAvailableTimes() - Horários disponíveis</li>
          <li>✅ services.getServices() - Lista de serviços</li>
          <li>✅ services.createService() - Criar serviço</li>
          <li>✅ ubs.getUBSList() - Lista de UBS</li>
        </ul>
      </div>
    </div>
  );
}
