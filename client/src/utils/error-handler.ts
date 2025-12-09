/**
 * Formata mensagens de erro do backend para exibição amigável ao usuário
 */

interface ApiError {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Extrai e formata a mensagem de erro de uma resposta da API
 */
export function getErrorMessage(error: any): string {
  // Se já é uma string, retorna direto
  if (typeof error === 'string') {
    return error;
  }

  // Se é um erro do Axios/fetch
  if (error?.response?.data) {
    const data: ApiError = error.response.data;
    return extractMessage(data);
  }

  // Se é um objeto Error padrão
  if (error?.message) {
    return error.message;
  }

  // Fallback genérico
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

/**
 * Extrai mensagem de um objeto de erro da API
 */
function extractMessage(data: ApiError): string {
  if (!data.message) {
    return getDefaultMessage(data.statusCode);
  }

  // Se é um array de mensagens (erros de validação)
  if (Array.isArray(data.message)) {
    return formatValidationErrors(data.message);
  }

  // Se é uma string simples
  return data.message;
}

/**
 * Formata múltiplos erros de validação
 */
function formatValidationErrors(messages: string[]): string {
  if (messages.length === 1) {
    return messages[0];
  }

  return messages.join('\n• ');
}

/**
 * Retorna mensagem padrão baseada no código de status
 */
function getDefaultMessage(statusCode?: number): string {
  const messages: Record<number, string> = {
    400: 'Requisição inválida. Verifique os dados e tente novamente.',
    401: 'Sessão expirada. Por favor, faça login novamente.',
    403: 'Você não tem permissão para realizar esta ação.',
    404: 'O recurso solicitado não foi encontrado.',
    422: 'Erro de validação. Verifique os dados informados.',
    500: 'Erro no servidor. Tente novamente mais tarde.',
    502: 'Serviço temporariamente indisponível.',
    503: 'Sistema em manutenção. Tente novamente em alguns minutos.',
  };

  return (
    messages[statusCode || 0] ||
    'Erro ao processar requisição. Tente novamente.'
  );
}

/**
 * Verifica se o erro é de autenticação/autorização
 */
export function isAuthError(error: any): boolean {
  const statusCode = error?.response?.data?.statusCode || error?.status;
  return statusCode === 401 || statusCode === 403;
}

/**
 * Verifica se o erro é de validação
 */
export function isValidationError(error: any): boolean {
  const statusCode = error?.response?.data?.statusCode || error?.status;
  return statusCode === 400 || statusCode === 422;
}

/**
 * Verifica se o erro é de servidor
 */
export function isServerError(error: any): boolean {
  const statusCode = error?.response?.data?.statusCode || error?.status;
  return statusCode >= 500;
}

/**
 * Formata erro para exibição em toast
 */
export function formatErrorForToast(error: any): {
  title: string;
  message: string;
  duration?: number;
} {
  const message = getErrorMessage(error);

  if (isAuthError(error)) {
    return {
      title: 'Acesso Negado',
      message,
      duration: 5000,
    };
  }

  if (isValidationError(error)) {
    return {
      title: 'Erro de Validação',
      message,
      duration: 6000,
    };
  }

  if (isServerError(error)) {
    return {
      title: 'Erro no Servidor',
      message,
      duration: 5000,
    };
  }

  return {
    title: 'Erro',
    message,
    duration: 4000,
  };
}
