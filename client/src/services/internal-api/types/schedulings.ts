export type TCreateSchedulingParams = {
  availableTimeId: string;
};

export type TCreateSchedulingResponse = {
  id: string;
  availableTimeId: string;
  userId: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED' | 'MISSED';
  scheduledAt: string;
  confirmCode: string;
  createdAt: string;
};

export type TConfirmSchedulingParams = {
  id: string;
  confirmCode: string;
};

export type TConfirmSchedulingResponse = {
  id: string;
  availableTimeId: string;
  userId: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED' | 'MISSED';
  scheduledAt: string;
  confirmCode: string;
  createdAt: string;
};

// Cancel Scheduling
export type TCancelSchedulingParams = {
  id: string;
};

export type TCancelSchedulingResponse = {
  id: string;
  availableTimeId: string;
  userId: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED' | 'MISSED';
  scheduledAt: string;
  confirmCode: string;
  createdAt: string;
};

// Get User Schedulings
export type TGetUserSchedulingsParams = {
  page?: number;
  limit?: number;
};

export type TSchedulingStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'ATTENDED'
  | 'MISSED';

export type TUserScheduling = {
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
  status: TSchedulingStatus;
  confirmCode: string;
  scheduledAt: string;
};

export type TGetUserSchedulingsResponse = {
  schedulings: TUserScheduling[];
  total: number;
  metrics: {
    total: number;
    scheduled: number;
    confirmed: number;
    attended: number;
    cancelled: number;
  };
};
