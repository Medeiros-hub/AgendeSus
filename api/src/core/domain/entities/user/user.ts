import { randomUUID } from 'node:crypto';

export enum UserType {
  CITIZEN = 'CITIZEN',
  RECEPTIONIST = 'RECEPTIONIST',
  ADMIN = 'ADMIN',
}

export type UserProps = {
  cpf: string;
  fullName: string;
  birthDate: Date;
  phone: string;
  email: string;
  password: string;
  type: UserType;
  zipcode: string;
  address: string;
};

export class User {
  public readonly id?: string;
  public props: Required<UserProps>;

  private constructor(props: UserProps, id?: string) {
    this.props = { ...props };
    this.id = id || randomUUID();
  }

  static create(props: UserProps, id?: string): User {
    return new User(props, id);
  }

  toJSON(user: User) {
    return {
      id: user.id,
      ...user.props,
    };
  }
}
