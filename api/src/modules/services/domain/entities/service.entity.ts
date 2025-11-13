import { BaseEntity } from '../../../../@core/domain/base.entity';

export interface ServiceProps {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  createdAt: Date;
}

export class Service extends BaseEntity {
  private props: ServiceProps;

  constructor(props: ServiceProps) {
    super(props.id, props.createdAt);
    this.props = props;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get durationMinutes(): number {
    return this.props.durationMinutes;
  }

  toPersistence() {
    return {
      id: this.id,
      name: this.props.name,
      description: this.props.description,
      durationMinutes: this.props.durationMinutes,
      createdAt: this.createdAt,
    };
  }
}
