import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { Service } from '../../domain/entities/service.entity';
import {
  IServiceRepository,
  SERVICE_REPOSITORY,
} from '../../domain/repositories/service.repository.interface';
import { CreateServiceDto } from '../dto/create-service.dto';

@Injectable()
export class CreateServiceUseCase
  implements IUseCase<CreateServiceDto, Service>
{
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(input: CreateServiceDto): Promise<Service> {
    const service = new Service({
      id: uuid(),
      name: input.name,
      description: input.description || null,
      durationMinutes: input.durationMinutes || 30,
      createdAt: new Date(),
    });

    return this.serviceRepository.create(service);
  }
}
