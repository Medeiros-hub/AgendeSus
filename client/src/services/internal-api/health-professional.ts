import { api } from '@/lib/api';

import {
  TCreateHealthProfessionalParams,
  TCreateHealthProfessionalResponse,
  TDeleteHealthProfessionalParams,
  TDeleteHealthProfessionalResponse,
  TGetHealthProfessionalsListParams,
  TGetHealthProfessionalsListResponse,
} from './types/health-professional';
import { TInternalApiOptions } from './types/internal-api-options';

export const healthProfessionals = {
  async createHealthProfessional(
    params: TCreateHealthProfessionalParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TCreateHealthProfessionalResponse> {
    const response = await api.post('/health-professionals', params, {
      signal,
      headers,
    });
    return response.data;
  },

  async getHealthProfessionalsList(
    params: TGetHealthProfessionalsListParams = {},
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TGetHealthProfessionalsListResponse> {
    const response = await api.get('/health-professionals', {
      params,
      signal,
      headers,
    });
    return response.data;
  },

  async getHealthProfessionalsByService(
    serviceId: string,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TGetHealthProfessionalsListResponse> {
    const response = await api.get(
      `/health-professionals/by-service/${serviceId}`,
      {
        signal,
        headers,
      },
    );
    return response.data;
  },

  async deleteHealthProfessional(
    params: TDeleteHealthProfessionalParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TDeleteHealthProfessionalResponse> {
    const response = await api.delete(`/health-professionals/${params.id}`, {
      signal,
      headers,
    });
    return response.data;
  },
};
