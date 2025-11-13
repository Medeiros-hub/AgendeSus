import { api } from '@/lib/api';

import { TInternalApiOptions } from './types/internal-api-options';
import {
  TCreateUserParams,
  TCreateUserResponse,
  TGetUserByIdParams,
  TGetUserByIdResponse,
  TGetUserProfileResponse,
  TUpdateUserParams,
  TUpdateUserResponse,
} from './types/users';

export const users = {
  async createUser(
    params: TCreateUserParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TCreateUserResponse> {
    const response = await api.post('/users', params, {
      signal,
      headers,
    });
    return response.data;
  },

  async updateUser(
    params: TUpdateUserParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TUpdateUserResponse> {
    const { id, data } = params;
    const response = await api.patch(`/users/${id}`, data, {
      signal,
      headers,
    });
    return response.data;
  },

  async getUserProfile({
    signal,
    headers,
  }: TInternalApiOptions = {}): Promise<TGetUserProfileResponse> {
    const response = await api.get('/users/me', {
      signal,
      headers,
    });
    return response.data;
  },

  async getUserById(
    params: TGetUserByIdParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TGetUserByIdResponse> {
    const response = await api.get(`/users/${params.id}`, {
      signal,
      headers,
    });
    return response.data;
  },
};
