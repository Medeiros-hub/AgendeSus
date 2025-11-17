export class AvailableTimeResponseDto {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  healthProfessionalId: string;
  ubsId: string;
  serviceId: string;

  constructor(partial: Partial<AvailableTimeResponseDto>) {
    Object.assign(this, partial);
  }
}
