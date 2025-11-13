import { BaseEntity } from '@/@core/domain/base.entity';
import { BusinessRuleException } from '@/@core/domain/domain.exception';

export interface AvailableTimeProps {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  available: boolean;
  healthProfessionalId: string;
  ubsId: string;
  serviceId: string;
  createdAt: Date;
}

export class AvailableTime extends BaseEntity {
  private props: AvailableTimeProps;

  constructor(props: AvailableTimeProps) {
    super(props.id, props.createdAt);
    this.props = props;
    this.validate();
  }

  private validate() {
    if (this.props.startTime >= this.props.endTime) {
      throw new BusinessRuleException(
        'Horário de início deve ser anterior ao horário de fim',
      );
    }
  }

  get date(): Date {
    return this.props.date;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date {
    return this.props.endTime;
  }

  get available(): boolean {
    return this.props.available;
  }

  get healthProfessionalId(): string {
    return this.props.healthProfessionalId;
  }

  get ubsId(): string {
    return this.props.ubsId;
  }

  get serviceId(): string {
    return this.props.serviceId;
  }

  markAsAvailable(): void {
    this.props.available = true;
  }

  markAsUnavailable(): void {
    this.props.available = false;
  }

  /**
   * Verifica se o horário já passou
   */
  isPast(): boolean {
    return this.props.date < new Date();
  }

  /**
   * Calcula duração em minutos
   */
  getDurationMinutes(): number {
    return (
      (this.props.endTime.getTime() - this.props.startTime.getTime()) /
      (1000 * 60)
    );
  }

  toPersistence() {
    return {
      id: this.id,
      date: this.props.date,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      available: this.props.available,
      healthProfessionalId: this.props.healthProfessionalId,
      ubsId: this.props.ubsId,
      serviceId: this.props.serviceId,
    };
  }
}
