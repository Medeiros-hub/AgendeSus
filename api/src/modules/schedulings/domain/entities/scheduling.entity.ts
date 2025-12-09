import { BaseEntity } from '@/@core/domain/base.entity';
import { BusinessRuleException } from '@/@core/domain/domain.exception';
import { SchedulingStatus } from '@prisma/client';

export interface SchedulingProps {
  id: string;
  availableTimeId: string;
  userId: string;
  status: SchedulingStatus;
  scheduledAt: Date;
  confirmCode: string;
  createdAt: Date;
}

export class Scheduling extends BaseEntity {
  private props: SchedulingProps;

  constructor(props: SchedulingProps) {
    super(props.id, props.createdAt);
    this.props = props;
  }

  get availableTimeId(): string {
    return this.props.availableTimeId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): SchedulingStatus {
    return this.props.status;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  get confirmCode(): string {
    return this.props.confirmCode;
  }

  /**
   * Confirma o agendamento usando código
   */
  confirm(code: string): void {
    if (this.props.confirmCode !== code) {
      throw new BusinessRuleException(
        'Código de confirmação inválido. Por favor, verifique o código fornecido pelo paciente e tente novamente.',
      );
    }

    if (this.props.status !== SchedulingStatus.SCHEDULED) {
      const statusMap = {
        CONFIRMED: 'já foi confirmado',
        CANCELLED: 'foi cancelado',
        ATTENDED: 'já foi atendido',
        MISSED: 'foi marcado como ausente',
      };
      const statusText =
        statusMap[this.props.status] || 'não pode ser confirmado';
      throw new BusinessRuleException(
        `Este agendamento ${statusText}. Apenas agendamentos pendentes podem ser confirmados.`,
      );
    }

    this.props.status = SchedulingStatus.CONFIRMED;
  }

  /**
   * Cancela o agendamento
   */
  cancel(): void {
    if (
      this.props.status === SchedulingStatus.ATTENDED ||
      this.props.status === SchedulingStatus.MISSED
    ) {
      throw new BusinessRuleException(
        'Não é possível cancelar um agendamento que já foi finalizado (atendido ou ausente).',
      );
    }

    if (this.props.status === SchedulingStatus.CANCELLED) {
      throw new BusinessRuleException(
        'Este agendamento já foi cancelado anteriormente.',
      );
    }

    // Valida se não está próximo demais do horário
    const now = new Date();
    const hoursDiff =
      (this.props.scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 2 && hoursDiff > 0) {
      throw new BusinessRuleException(
        `Não é possível cancelar com menos de 2 horas de antecedência. Faltam ${Math.round(hoursDiff * 60)} minutos para o horário agendado.`,
      );
    }

    this.props.status = SchedulingStatus.CANCELLED;
  }

  /**
   * Marca como atendido
   */
  markAsAttended(): void {
    if (
      this.props.status !== SchedulingStatus.CONFIRMED &&
      this.props.status !== SchedulingStatus.SCHEDULED
    ) {
      const statusMap = {
        CANCELLED: 'cancelado',
        ATTENDED: 'já atendido',
        MISSED: 'marcado como ausente',
      };
      const statusText = statusMap[this.props.status] || 'com status inválido';
      throw new BusinessRuleException(
        `Não é possível concluir um agendamento ${statusText}. Apenas agendamentos confirmados ou agendados podem ser marcados como atendidos.`,
      );
    }

    this.props.status = SchedulingStatus.ATTENDED;
  }

  /**
   * Marca como não compareceu
   */
  markAsMissed(): void {
    if (
      this.props.status !== SchedulingStatus.CONFIRMED &&
      this.props.status !== SchedulingStatus.SCHEDULED
    ) {
      throw new BusinessRuleException(
        'Status inválido para marcar como não compareceu',
      );
    }

    this.props.status = SchedulingStatus.MISSED;
  }

  /**
   * Verifica se pode ser cancelado
   */
  canBeCancelled(): boolean {
    if (
      this.props.status === SchedulingStatus.ATTENDED ||
      this.props.status === SchedulingStatus.MISSED ||
      this.props.status === SchedulingStatus.CANCELLED
    ) {
      return false;
    }

    const now = new Date();
    const hoursDiff =
      (this.props.scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursDiff >= 2;
  }

  toPersistence() {
    return {
      id: this.id,
      availableTimeId: this.props.availableTimeId,
      userId: this.props.userId,
      status: this.props.status,
      scheduledAt: this.props.scheduledAt,
      confirmCode: this.props.confirmCode,
    };
  }
}
