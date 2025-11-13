import { api } from '@/lib/api';

import { TInternalApiOptions } from './types/internal-api-options';
import {
  TCancelSchedulingParams,
  TCancelSchedulingResponse,
  TConfirmSchedulingParams,
  TConfirmSchedulingResponse,
  TCreateSchedulingParams,
  TCreateSchedulingResponse,
  TGetUserSchedulingsParams,
  TGetUserSchedulingsResponse,
} from './types/schedulings';

export const schedulings = {
  async createScheduling(
    params: TCreateSchedulingParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TCreateSchedulingResponse> {
    const response = await api.post('/schedulings', params, {
      signal,
      headers,
    });
    return response.data;
  },

  async confirmScheduling(
    params: TConfirmSchedulingParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TConfirmSchedulingResponse> {
    const { id, confirmCode } = params;
    const response = await api.patch(
      `/schedulings/${id}/confirm`,
      { confirmCode },
      {
        signal,
        headers,
      },
    );
    return response.data;
  },

  async cancelScheduling(
    params: TCancelSchedulingParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TCancelSchedulingResponse> {
    const response = await api.patch(
      `/schedulings/${params.id}/cancel`,
      {},
      {
        signal,
        headers,
      },
    );
    return response.data;
  },

  async getUserSchedulings(
    params: TGetUserSchedulingsParams = {},
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TGetUserSchedulingsResponse> {
    const { page = 1, limit = 10 } = params;
    const response = await api.get('/schedulings/my', {
      params: { page, limit },
      signal,
      headers,
    });
    return response.data;
  },
};
