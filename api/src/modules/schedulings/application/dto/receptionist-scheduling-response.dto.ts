import { SchedulingStatus } from '@prisma/client';

export class ReceptionistSchedulingResponseDto {
  id: string;
  patient: {
    id: string;
    fullName: string;
    cpf: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
  };
  healthProfessional: {
    id: string;
    name: string;
    specialty: string;
  };
  ubs: {
    id: string;
    name: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: SchedulingStatus;
  confirmCode: string;
  scheduledAt: string;

  constructor(data: any) {
    this.id = data.id;
    this.patient = {
      id: data.user.id,
      fullName: data.user.fullName,
      cpf: data.user.cpf,
      phone: data.user.phone,
    };
    this.service = {
      id: data.availableTime.service.id,
      name: data.availableTime.service.name,
    };
    this.healthProfessional = {
      id: data.availableTime.healthProfessional.id,
      name: data.availableTime.healthProfessional.name,
      specialty: data.availableTime.healthProfessional.specialty,
    };
    this.ubs = {
      id: data.availableTime.ubs.id,
      name: data.availableTime.ubs.name,
    };

    // Format date as YYYY-MM-DD
    const date = new Date(data.availableTime.date);
    this.date = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;

    // Format times as HH:MM
    const startTime = new Date(data.availableTime.startTime);
    this.startTime = `${String(startTime.getUTCHours()).padStart(2, '0')}:${String(startTime.getUTCMinutes()).padStart(2, '0')}`;

    const endTime = new Date(data.availableTime.endTime);
    this.endTime = `${String(endTime.getUTCHours()).padStart(2, '0')}:${String(endTime.getUTCMinutes()).padStart(2, '0')}`;

    this.status = data.status;
    this.confirmCode = data.confirmCode;
    this.scheduledAt = data.scheduledAt.toISOString();
  }
}

export class ReceptionistSchedulingsListResponseDto {
  schedulings: ReceptionistSchedulingResponseDto[];
  total: number;
  metrics: {
    total: number;
    scheduled: number;
    confirmed: number;
    attended: number;
    cancelled: number;
  };

  constructor(
    schedulings: any[],
    total: number,
    metrics: {
      total: number;
      scheduled: number;
      confirmed: number;
      attended: number;
      cancelled: number;
    },
  ) {
    this.schedulings = schedulings.map(
      (s) => new ReceptionistSchedulingResponseDto(s),
    );
    this.total = total;
    this.metrics = metrics;
  }
}
