import { api } from '@/lib/api';

import {
  TLoginUserParams,
  TLoginUserResponse,
  TLogoutUserResponse,
  TRegisterUserParams,
  TRegisterUserResponse,
} from './types/auth';
import { TInternalApiOptions } from './types/internal-api-options';

export const auth = {
  async loginUser(
    params: TLoginUserParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TLoginUserResponse> {
    const response = await api.post('/auth/login', params, {
      signal,
      headers,
    });
    return response.data;
  },

  async registerUser(
    params: TRegisterUserParams,
    { signal, headers }: TInternalApiOptions = {},
  ): Promise<TRegisterUserResponse> {
    const response = await api.post('/users', params, {
      signal,
      headers,
    });
    return response.data;
  },

  async logoutUser({
    signal,
    headers,
  }: TInternalApiOptions = {}): Promise<TLogoutUserResponse> {
    const response = await api.post(
      '/auth/logout',
      {},
      {
        signal,
        headers,
      },
    );
    return response.data;
  },
};
