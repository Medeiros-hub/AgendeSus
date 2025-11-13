import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class SearchAvailableTimesDto {
  @IsUUID('4')
  @IsOptional()
  ubsId?: string;

  @IsUUID('4')
  @IsOptional()
  serviceId?: string;

  @IsUUID('4')
  @IsOptional()
  healthProfessionalId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}
