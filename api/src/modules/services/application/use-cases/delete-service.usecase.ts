import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IServiceRepository,
  SERVICE_REPOSITORY,
} from '../../domain/repositories/service.repository.interface';

@Injectable()
export class DeleteServiceUseCase implements IUseCase<string, void> {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(id: string) {
    return this.serviceRepository.delete(id);
  }
}
