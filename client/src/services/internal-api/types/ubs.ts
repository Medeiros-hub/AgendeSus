// Get UBS List
export type TGetUBSListParams = {
  page?: number;
  limit?: number;
};

export type TGetUBSListResponse = {
  ubsList: {
    id: string;
    createdAt: string;
    props: {
      id: string;
      name: string;
      cep: string;
      address: string;
      phone: string;
      createdAt: string;
    };
  }[];
  total: number;
};
