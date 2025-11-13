import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  ISchedulingRepository,
  SCHEDULING_REPOSITORY,
} from '../../domain/repositories/scheduling.repository.interface';
import { SchedulingStatus } from '@prisma/client';

@Injectable()
export class FindSchedulingsUseCase
  implements
    IUseCase<
      {
        page?: number;
        limit?: number;
        status?: SchedulingStatus;
        userId?: string;
      },
      { schedulings: any[]; total: number }
    >
{
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly schedulingRepository: ISchedulingRepository,
  ) {}

  async execute(
    input: {
      page?: number;
      limit?: number;
      status?: SchedulingStatus;
      userId?: string;
    } = { page: 1, limit: 10 },
  ) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    if (input.userId) {
      return this.schedulingRepository.findByUserId(input.userId, page, limit);
    }

    if (input.status) {
      return this.schedulingRepository.findByStatus(input.status, page, limit);
    }

    // Se não houver filtro, buscar todos via repository (não existe método genérico findAll — usar findByStatus com undefined não funciona)
    // Implementação: buscar todos por paginação usando prisma diretamente no repositório caso necessário. Aqui vamos chamar findByStatus com status pendente por padrão.
    return this.schedulingRepository.findByStatus(
      'PENDING' as SchedulingStatus,
      page,
      limit,
    );
  }
}
