import { HealthProfessional } from '../entities/health-professional.entity';

export interface IHealthProfessionalRepository {
  create(professional: HealthProfessional): Promise<HealthProfessional>;
  findById(id: string): Promise<HealthProfessional | null>;
  findByUbsId(ubsId: string): Promise<HealthProfessional[]>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ professionals: HealthProfessional[]; total: number }>;
  update(professional: HealthProfessional): Promise<HealthProfessional>;
  delete(id: string): Promise<void>;
}

export const HEALTH_PROFESSIONAL_REPOSITORY = Symbol(
  'IHealthProfessionalRepository',
);
