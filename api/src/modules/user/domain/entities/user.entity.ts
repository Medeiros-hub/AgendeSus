export enum UserType {
  CITIZEN = 'CITIZEN',
  RECEPTIONIST = 'RECEPTIONIST',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  id?: string;
  cpf: string;
  fullName: string;
  birthDate: Date;
  phone: string;
  email: string;
  password?: string;
  type: UserType;
  zipcode: string;
  address: string;
  createdAt?: Date;
}

export class User {
  private _id?: string;
  private _cpf: string;
  private _fullName: string;
  private _birthDate: Date;
  private _phone: string;
  private _email: string;
  private _password?: string;
  private _type: UserType;
  private _zipcode: string;
  private _address: string;
  private _createdAt?: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._cpf = props.cpf;
    this._fullName = props.fullName;
    this._birthDate = props.birthDate;
    this._phone = props.phone;
    this._email = props.email;
    this._password = props.password;
    this._type = props.type;
    this._zipcode = props.zipcode;
    this._address = props.address;
    this._createdAt = props.createdAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get cpf(): string {
    return this._cpf;
  }

  get fullName(): string {
    return this._fullName;
  }

  get birthDate(): Date {
    return this._birthDate;
  }

  get phone(): string {
    return this._phone;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get type(): UserType {
    return this._type;
  }

  get zipcode(): string {
    return this._zipcode;
  }

  get address(): string {
    return this._address;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  setPassword(password: string): void {
    this._password = password;
  }

  updateProfile(data: Partial<UserProps>): void {
    if (data.fullName) this._fullName = data.fullName;
    if (data.phone) this._phone = data.phone;
    if (data.email) this._email = data.email;
    if (data.zipcode !== undefined) this._zipcode = data.zipcode;
    if (data.address !== undefined) this._address = data.address;
  }

  isValidCpf(): boolean {
    const cpf = this._cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  toPlainObject(): UserProps {
    return {
      id: this._id,
      cpf: this._cpf,
      fullName: this._fullName,
      birthDate: this._birthDate,
      phone: this._phone,
      email: this._email,
      password: this._password,
      type: this._type,
      zipcode: this._zipcode,
      address: this._address,
      createdAt: this._createdAt,
    };
  }
}
