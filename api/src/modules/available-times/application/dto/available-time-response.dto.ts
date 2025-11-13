export class AvailableTimeResponseDto {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  available: boolean;
  healthProfessionalId: string;
  ubsId: string;
  serviceId: string;

  constructor(partial: Partial<AvailableTimeResponseDto>) {
    Object.assign(this, partial);
  }
}
