import { api } from '@/lib/api';

import { TInternalApiOptions } from './types/internal-api-options';
import {
  TGetAllSchedulingsParams,
  TGetAllSchedulingsResponse,
  TUpdateSchedulingStatusParams,
  TUpdateSchedulingStatusResponse,
} from './types/receptionist';

export const receptionist = {
  async getAllSchedulings(
    params: TGetAllSchedulingsParams = {},
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TGetAllSchedulingsResponse> {
    const response = await api.get('/schedulings', {
      params,
      signal,
      headers,
    });
    return response.data;
  },

  async confirmScheduling(
    id: string,
    confirmCode: string,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TUpdateSchedulingStatusResponse> {
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

  async completeScheduling(
    id: string,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TUpdateSchedulingStatusResponse> {
    const response = await api.patch(
      `/schedulings/${id}/complete`,
      {},
      {
        signal,
        headers,
      },
    );
    return response.data;
  },

  async cancelScheduling(
    id: string,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TUpdateSchedulingStatusResponse> {
    const response = await api.patch(
      `/schedulings/${id}/cancel`,
      {},
      {
        signal,
        headers,
      },
    );
    return response.data;
  },
};
