import { BaseEntity } from '../../../../@core/domain/base.entity';

export interface UBSProps {
  id: string;
  name: string;
  cep: string;
  address: string;
  phone: string;
  createdAt: Date;
}

export class UBS extends BaseEntity {
  private props: UBSProps;

  constructor(props: UBSProps) {
    super(props.id, props.createdAt);
    this.props = props;
  }

  get name(): string {
    return this.props.name;
  }

  get cep(): string {
    return this.props.cep;
  }

  get address(): string {
    return this.props.address;
  }

  get phone(): string {
    return this.props.phone;
  }

  updateInfo(
    data: Partial<Pick<UBSProps, 'name' | 'address' | 'phone' | 'cep'>>,
  ) {
    if (data.name) this.props.name = data.name;
    if (data.address) this.props.address = data.address;
    if (data.phone) this.props.phone = data.phone;
    if (data.cep) this.props.cep = data.cep;
  }

  toPersistence() {
    return {
      id: this.id,
      name: this.props.name,
      cep: this.props.cep,
      address: this.props.address,
      phone: this.props.phone,
      createdAt: this.createdAt,
    };
  }
}
