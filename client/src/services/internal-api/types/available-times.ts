// Get Available Times
export type TGetAvailableTimesParams = {
  ubsId?: string;
  serviceId?: string;
  healthProfessionalId?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type TGetAvailableTimesResponse = {
  times: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
    healthProfessionalId: string;
    ubsId: string;
    serviceId: string;
  }[];
  total: number;
};
