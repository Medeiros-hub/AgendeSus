import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';

import { TInternalApiOptions } from '@/services/internal-api/types/internal-api-options';

interface IUseRequestApiError {
  message: string;
}

interface IUseRequestApiParams<T> {
  onSuccess?: (data: T) => void;
  onError?: (
    error: IUseRequestApiError,
    usedParams: [any, TInternalApiOptions],
  ) => void;
}

type TRequestApiFnReturn<T extends (...args: any[]) => any> = Awaited<
  ReturnType<T>
>;

export function useRequestApi<
  TApiFnType extends (
    params: any,
    options: TInternalApiOptions,
  ) => Promise<any>,
>(
  apiFunction: TApiFnType,
  {
    onSuccess,
    onError,
  }: IUseRequestApiParams<TRequestApiFnReturn<TApiFnType>> = {},
) {
  const [data, setData] = useState<TRequestApiFnReturn<TApiFnType> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const requestController = useRef<AbortController | null>(null);

  async function handler(...args: Parameters<TApiFnType>) {
    const [params, options = {}] = args;

    setIsLoading(true);
    try {
      requestController.current = new AbortController();
      const response = await apiFunction(params, options);

      setData(response);
      onSuccess && onSuccess(response);
    } catch (error: any) {
      console.error('useRequestApi error:', error.response);
      if (error.name === 'CanceledError') return error;

      const err: IUseRequestApiError = {
        message: 'Erro desconhecido, contate o administrador do sistema.',
      };

      if (isAxiosError(error) && error.response) {
        error.response.data.message &&
          (err.message = error.response.data.message);
      }

      onError && onError(error.response.data, args);
      // return Promise.reject(err);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    return () => {
      requestController.current?.abort();
    };
  }, []);

  return {
    data,
    isLoading,
    handler,
  };
}
