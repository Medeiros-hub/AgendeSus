import { UserType } from '@prisma/client';
import { CPF } from '../value-objects/cpf.vo';
import { Email } from '../value-objects/email.vo';
import { BaseEntity } from '@/@core/domain/base.entity';

export interface UserProps {
  id: string;
  cpf: CPF;
  fullName: string;
  birthDate: Date;
  phone: string;
  email: Email;
  password: string;
  type: UserType;
  zipcode: string;
  address: string;
  createdAt: Date;
}

export class User extends BaseEntity {
  private props: UserProps;

  constructor(props: UserProps) {
    super(props.id, props.createdAt);
    this.props = props;
  }

  get cpf(): CPF {
    return this.props.cpf;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get birthDate(): Date {
    return this.props.birthDate;
  }

  get phone(): string {
    return this.props.phone;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get type(): UserType {
    return this.props.type;
  }

  get zipcode(): string {
    return this.props.zipcode;
  }

  get address(): string {
    return this.props.address;
  }

  /**
   * Calcula idade do usuário
   */
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.props.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Verifica se é maior de idade
   */
  isAdult(): boolean {
    return this.getAge() >= 18;
  }

  /**
   * Atualiza informações do perfil
   */
  updateProfile(
    data: Partial<
      Pick<UserProps, 'fullName' | 'phone' | 'address' | 'zipcode'>
    >,
  ) {
    if (data.fullName) this.props.fullName = data.fullName;
    if (data.phone) this.props.phone = data.phone;
    if (data.address) this.props.address = data.address;
    if (data.zipcode) this.props.zipcode = data.zipcode;
  }

  toPersistence() {
    return {
      id: this.id,
      cpf: this.props.cpf.getValue(),
      fullName: this.props.fullName,
      birthDate: this.props.birthDate,
      phone: this.props.phone,
      email: this.props.email.getValue(),
      password: this.props.password,
      type: this.props.type,
      zipcode: this.props.zipcode,
      address: this.props.address,
      createdAt: this.createdAt,
    };
  }
}
