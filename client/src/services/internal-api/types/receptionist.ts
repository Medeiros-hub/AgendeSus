export type SchedulingStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'ATTENDED'
  | 'MISSED';

export type TReceptionistScheduling = {
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
};

export type TGetAllSchedulingsParams = {
  page?: number;
  limit?: number;
  status?: SchedulingStatus;
  search?: string;
};

export type TGetAllSchedulingsResponse = {
  schedulings: TReceptionistScheduling[];
  total: number;
  metrics: {
    total: number;
    scheduled: number;
    confirmed: number;
    attended: number;
    cancelled: number;
  };
};

export type TUpdateSchedulingStatusParams = {
  id: string;
  status: SchedulingStatus;
};

export type TUpdateSchedulingStatusResponse = {
  id: string;
  status: SchedulingStatus;
  message: string;
};
