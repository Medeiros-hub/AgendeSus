export enum EUserType {
  CITIZEN = 'CITIZEN',
  RECEPTIONIST = 'RECEPTIONIST',
  ADMIN = 'ADMIN',
}

export type TLoginUserParams = {
  identifier: string;
  password: string;
};

export type TLoginUserResponse = {
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

export type TRegisterUserParams = {
  cpf: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
  type: EUserType;
  zipcode: string;
  address: string;
};

export type TRegisterUserResponse = {
  id: string;
  cpf: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  type: EUserType;
  zipcode: string;
  address: string;
  createdAt: Date;
};

export type TLogoutUserResponse = {
  message?: string;
};
