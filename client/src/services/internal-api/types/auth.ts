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
  user: {
    id: string;
    email: string;
    fullName: string;
    type: EUserType;
  };
  expiresIn: string;
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
