import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  ISchedulingRepository,
  SCHEDULING_REPOSITORY,
} from '../../domain/repositories/scheduling.repository.interface';

@Injectable()
export class DeleteSchedulingUseCase implements IUseCase<string, void> {
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly schedulingRepository: ISchedulingRepository,
  ) {}

  async execute(id: string) {
    return this.schedulingRepository.delete(id);
  }
}
