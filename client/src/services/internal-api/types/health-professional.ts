// Create Health Professional
export type TCreateHealthProfessionalParams = {
  name: string;
  specialty: string;
  crm: string;
  ubsId: string;
  serviceId?: string;
};

export type TCreateHealthProfessionalResponse = {
  id: string;
  createdAt: string;
  props: {
    id: string;
    name: string;
    specialty: string;
    crm: string;
    ubsId: string;
    serviceId: string;
    createdAt: string;
  };
};

// Get Health Professionals List
export type TGetHealthProfessionalsListParams = {
  page?: number;
  limit?: number;
};

export type TGetHealthProfessionalsListResponse = {
  professionals: {
    id: string;
    createdAt: string;
    props: {
      id: string;
      name: string;
      specialty: string;
      crm: string;
      ubsId: string;
      serviceId: string;
      createdAt: string;
    };
  }[];
  total: number;
};

// Delete Health Professional
export type TDeleteHealthProfessionalParams = {
  id: string;
};

export type TDeleteHealthProfessionalResponse = void;
