import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IAvailableTimeRepository,
  AVAILABLE_TIME_REPOSITORY,
} from '../../domain/repositories/available-time.repository.interface';

@Injectable()
export class DeleteAvailableTimeUseCase implements IUseCase<string, void> {
  constructor(
    @Inject(AVAILABLE_TIME_REPOSITORY)
    private readonly repo: IAvailableTimeRepository,
  ) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}
