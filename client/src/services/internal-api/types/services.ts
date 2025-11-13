// Get Services
export type TGetServicesParams = {
  page?: number;
  limit?: number;
};

export type TGetServicesResponse = {
  services: {
    id: string;
    name: string;
    description: string | null;
    durationMinutes: number;
    createdAt: string;
  }[];
  total: number;
};

// Create Service
export type TCreateServiceParams = {
  name: string;
  description?: string;
  durationMinutes?: number;
};

export type TCreateServiceResponse = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  createdAt: string;
};
