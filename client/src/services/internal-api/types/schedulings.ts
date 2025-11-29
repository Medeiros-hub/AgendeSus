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

export type TGetUserSchedulingsResponse = {
  schedulings: {
    id: string;
    availableTimeId: string;
    userId: string;
    status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED' | 'MISSED';
    scheduledAt: string;
    confirmCode: string;
    createdAt: string;
  }[];
  total: number;
};
