import { Service } from '../entities/service.entity';

export interface IServiceRepository {
  create(service: Service): Promise<Service>;
  findById(id: string): Promise<Service | null>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ services: Service[]; total: number }>;
  update(service: Service): Promise<Service>;
  delete(id: string): Promise<void>;
}

export const SERVICE_REPOSITORY = Symbol('IServiceRepository');
