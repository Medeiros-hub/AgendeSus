export interface AppointmentCreate {
  nomeCompleto: string;
  telefone: string;
  cpf: string;
  servico: string;
  medico: string;
  data: string; // ISO date string
  horario: string;
  userId?: string;
}

export interface AppointmentResponse extends AppointmentCreate {
  id: string;
  createdAt: string;
}
