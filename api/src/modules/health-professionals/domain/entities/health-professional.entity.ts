import { BaseEntity } from '../../../../@core/domain/base.entity';

export interface HealthProfessionalProps {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  ubsId: string;
  createdAt: Date;
}

export class HealthProfessional extends BaseEntity {
  private props: HealthProfessionalProps;

  constructor(props: HealthProfessionalProps) {
    super(props.id, props.createdAt);
    this.props = props;
  }

  get name(): string {
    return this.props.name;
  }

  get specialty(): string {
    return this.props.specialty;
  }

  get crm(): string {
    return this.props.crm;
  }

  get ubsId(): string {
    return this.props.ubsId;
  }

  toPersistence() {
    return {
      id: this.id,
      name: this.props.name,
      specialty: this.props.specialty,
      crm: this.props.crm,
      ubsId: this.props.ubsId,
    };
  }
}
