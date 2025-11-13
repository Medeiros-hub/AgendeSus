import { api } from '@/lib/api';

import { TInternalApiOptions } from './types/internal-api-options';
import { TGetUBSListParams, TGetUBSListResponse } from './types/ubs';

export const ubs = {
  async getUBSList(
    params: TGetUBSListParams = {},
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TGetUBSListResponse> {
    const response = await api.get('/ubs', {
      params,
      signal,
      headers,
    });
    return response.data;
  },
};
