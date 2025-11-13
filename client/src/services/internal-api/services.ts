import { api } from '@/lib/api';

import { TInternalApiOptions } from './types/internal-api-options';
import {
  TCreateServiceParams,
  TCreateServiceResponse,
  TGetServicesParams,
  TGetServicesResponse,
} from './types/services';

export const services = {
  async getServices(
    params: TGetServicesParams = {},
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TGetServicesResponse> {
    const response = await api.get('/services', {
      params,
      signal,
      headers,
    });
    return response.data;
  },

  async createService(
    params: TCreateServiceParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TCreateServiceResponse> {
    const response = await api.post('/services', params, {
      signal,
      headers,
    });
    return response.data;
  },
};
