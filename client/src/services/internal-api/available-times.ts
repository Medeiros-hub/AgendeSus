import { api } from '@/lib/api';

import {
  TGetAvailableTimesParams,
  TGetAvailableTimesResponse,
} from './types/available-times';
import { TInternalApiOptions } from './types/internal-api-options';

export const availableTimes = {
  async getAvailableTimes(
    params: TGetAvailableTimesParams = {},
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TGetAvailableTimesResponse> {
    const response = await api.get('/available-times', {
      params,
      signal,
      headers,
    });
    return response.data;
  },
};
