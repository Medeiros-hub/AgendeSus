import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { UBS } from '../../domain/entities/ubs.entity';
import {
  IUBSRepository,
  UBS_REPOSITORY,
} from '../../domain/repositories/ubs.repository.interface';
import { CreateUBSDto } from '../dto/create-ubs.dto';

@Injectable()
export class CreateUBSUseCase implements IUseCase<CreateUBSDto, UBS> {
  constructor(
    @Inject(UBS_REPOSITORY)
    private readonly ubsRepository: IUBSRepository,
  ) {}

  async execute(input: CreateUBSDto): Promise<UBS> {
    const ubs = new UBS({
      id: uuid(),
      name: input.name,
      cep: input.cep,
      address: input.address,
      phone: input.phone,
      createdAt: new Date(),
    });

    return this.ubsRepository.create(ubs);
  }
}
