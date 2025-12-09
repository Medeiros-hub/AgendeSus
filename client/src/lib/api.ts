import axios from 'axios';

import env from '@/env';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Interceptor para tratar erros de forma mais amigável
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      const { status, data } = error.response;

      // Mapear códigos de status para mensagens amigáveis
      const statusMessages: Record<number, string> = {
        400: 'Requisição inválida',
        401: 'Não autorizado. Faça login novamente',
        403: 'Acesso negado',
        404: 'Recurso não encontrado',
        422: 'Erro de validação',
        500: 'Erro interno do servidor',
        502: 'Serviço temporariamente indisponível',
        503: 'Serviço em manutenção',
      };

      // Extrair mensagem de erro do backend
      let errorMessage =
        data?.message ||
        statusMessages[status] ||
        'Erro ao processar requisição';

      // Se a mensagem é um array (validação), juntar as mensagens
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }

      // Criar objeto de erro mais descritivo
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).status = status;
      (enhancedError as any).data = data;

      return Promise.reject(enhancedError);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      const networkError = new Error(
        'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
      );
      return Promise.reject(networkError);
    } else {
      // Algo aconteceu ao configurar a requisição
      return Promise.reject(error);
    }
  },
);
