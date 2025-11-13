import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IUBSRepository,
  UBS_REPOSITORY,
} from '../../domain/repositories/ubs.repository.interface';

@Injectable()
export class DeleteUBSUseCase implements IUseCase<string, void> {
  constructor(
    @Inject(UBS_REPOSITORY)
    private readonly ubsRepository: IUBSRepository,
  ) {}

  async execute(id: string) {
    return this.ubsRepository.delete(id);
  }
}
