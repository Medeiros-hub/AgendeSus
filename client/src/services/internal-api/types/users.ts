// Create User
export type TCreateUserParams = {
  cpf: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
  type?: 'CITIZEN' | 'ADMIN' | 'RECEPTIONIST';
  zipcode: string;
  address: string;
};

export type TCreateUserResponse = {
  id: string;
  cpf: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  type: string;
  zipcode: string;
  address: string;
  createdAt: string;
};

export type TUpdateUserParams = {
  id: string;
  data: {
    fullName?: string;
    birthDate?: string;
    phone?: string;
    zipcode?: string;
    address?: string;
  };
};

export type TUpdateUserResponse = {
  id: string;
  cpf: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  type: string;
  zipcode: string;
  address: string;
  createdAt: string;
};

export type TGetUserProfileResponse = {
  id: string;
  cpf: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  type: string;
  zipcode: string;
  address: string;
  createdAt: string;
};

export type TGetUserByIdParams = {
  id: string;
};

export type TGetUserByIdResponse = {
  id: string;
  cpf: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  type: string;
  zipcode: string;
  address: string;
  createdAt: string;
};

// List Users
export type TGetUsersListParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'CITIZEN' | 'ADMIN' | 'RECEPTIONIST';
};

export type TGetUsersListResponse = {
  users: {
    id: string;
    createdAt: string;
    props: {
      id: string;
      cpf: {
        value: string;
      };
      fullName: string;
      birthDate: string;
      phone: string;
      email: {
        value: string;
      };
      type: string;
      zipcode: string;
      address: string;
      createdAt: string;
    };
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Delete User
export type TDeleteUserParams = {
  id: string;
};

export type TDeleteUserResponse = {
  message: string;
};
