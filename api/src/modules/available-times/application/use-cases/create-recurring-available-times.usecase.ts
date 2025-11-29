import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { AvailableTime } from '../../domain/entities/available-time.entity';
import {
  IAvailableTimeRepository,
  AVAILABLE_TIME_REPOSITORY,
} from '../../domain/repositories/available-time.repository.interface';
import {
  CreateRecurringAvailableTimesDto,
  ConflictBehavior,
} from '../dto/create-recurring-available-times.dto';

interface ConflictInfo {
  date: string;
  time: string;
  count: number;
}

@Injectable()
export class CreateRecurringAvailableTimesUseCase
  implements
    IUseCase<
      CreateRecurringAvailableTimesDto,
      {
        created: number;
        skipped: number;
        conflicts: ConflictInfo[];
        availableTimes: AvailableTime[];
      }
    >
{
  constructor(
    @Inject(AVAILABLE_TIME_REPOSITORY)
    private readonly repository: IAvailableTimeRepository,
  ) {}

  async execute(input: CreateRecurringAvailableTimesDto): Promise<{
    created: number;
    skipped: number;
    conflicts: ConflictInfo[];
    availableTimes: AvailableTime[];
  }> {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    const slotDurationMinutes = parseInt(input.slotDuration);

    // Validações
    if (startDate >= endDate) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de fim',
      );
    }

    if (slotDurationMinutes <= 0 || slotDurationMinutes > 480) {
      throw new BadRequestException(
        'A duração do slot deve ser entre 1 e 480 minutos',
      );
    }

    if (input.daysOfWeek.length === 0) {
      throw new BadRequestException('Informe pelo menos um dia da semana');
    }

    const availableTimes: AvailableTime[] = [];
    const conflictList: ConflictInfo[] = [];
    const conflictIds: string[] = []; // IDs dos horários conflitantes (para substituir)
    let skippedCount = 0;

    const conflictBehavior = input.conflictBehavior || ConflictBehavior.SKIP;

    // Iterar por cada dia no período
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      // Verificar se este dia da semana está na lista
      if (input.daysOfWeek.includes(dayOfWeek)) {
        // Para cada time slot (ex: manhã 08:00-12:00, tarde 14:00-18:00)
        for (const timeSlot of input.timeSlots) {
          const slots = this.generateTimeSlots(
            currentDate,
            timeSlot.startTime,
            timeSlot.endTime,
            slotDurationMinutes,
          );

          for (const slot of slots) {
            // Verificar conflitos para cada slot
            const conflicts = await this.repository.findConflicts(
              input.healthProfessionalId,
              slot.startTime,
              slot.endTime,
            );

            if (conflicts.length > 0) {
              const dateStr = slot.startTime.toLocaleDateString('pt-BR');
              const timeStr = `${slot.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${slot.endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

              // Comportamento: FAIL - Cancelar tudo
              if (conflictBehavior === ConflictBehavior.FAIL) {
                throw new ConflictException(
                  `Conflito detectado em ${dateStr} às ${timeStr}. Operação cancelada.`,
                );
              }

              // Comportamento: REPLACE - Substituir
              if (conflictBehavior === ConflictBehavior.REPLACE) {
                // Guardar IDs para deletar depois
                conflicts.forEach((c) => conflictIds.push(c.id));
              }

              // Comportamento: SKIP - Pular (padrão)
              if (conflictBehavior === ConflictBehavior.SKIP) {
                skippedCount++;

                const existingConflict = conflictList.find(
                  (c) => c.date === dateStr && c.time === timeStr,
                );

                if (existingConflict) {
                  existingConflict.count++;
                } else {
                  conflictList.push({
                    date: dateStr,
                    time: timeStr,
                    count: 1,
                  });
                }

                continue; // Pular para o próximo slot
              }
            }

            // Sem conflitos ou modo REPLACE, adicionar à lista
            const availableTime = new AvailableTime({
              id: uuid(),
              date: new Date(currentDate.setHours(0, 0, 0, 0)),
              startTime: slot.startTime,
              endTime: slot.endTime,
              available: true,
              healthProfessionalId: input.healthProfessionalId,
              ubsId: input.ubsId,
              serviceId: input.serviceId,
              createdAt: new Date(),
            });

            availableTimes.push(availableTime);
          }
        }
      }

      // Avançar para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Se modo REPLACE, deletar horários conflitantes primeiro
    if (
      conflictBehavior === ConflictBehavior.REPLACE &&
      conflictIds.length > 0
    ) {
      await Promise.all(conflictIds.map((id) => this.repository.delete(id)));
    }

    // Salvar todos os horários sem conflito (ou substituindo) no banco
    const savedTimes =
      availableTimes.length > 0
        ? await this.repository.createMany(availableTimes)
        : [];

    return {
      created: savedTimes.length,
      skipped: conflictBehavior === ConflictBehavior.SKIP ? skippedCount : 0,
      conflicts: conflictBehavior === ConflictBehavior.SKIP ? conflictList : [],
      availableTimes: savedTimes,
    };
  }

  /**
   * Gera slots de tempo dentro de um período
   * Ex: 08:00-12:00 com duração de 30min = [08:00-08:30, 08:30-09:00, ...]
   */
  private generateTimeSlots(
    date: Date,
    startTimeStr: string,
    endTimeStr: string,
    durationMinutes: number,
  ): Array<{ startTime: Date; endTime: Date }> {
    const slots: Array<{ startTime: Date; endTime: Date }> = [];

    // Parse das horas
    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
    const [endHour, endMinute] = endTimeStr.split(':').map(Number);

    // Criar objetos Date para início e fim
    const currentSlotStart = new Date(date);
    currentSlotStart.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);

    // Gerar slots
    while (currentSlotStart < endTime) {
      const slotEnd = new Date(currentSlotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

      // Não adicionar se passar do horário final
      if (slotEnd <= endTime) {
        slots.push({
          startTime: new Date(currentSlotStart),
          endTime: new Date(slotEnd),
        });
      }

      // Avançar para o próximo slot
      currentSlotStart.setMinutes(
        currentSlotStart.getMinutes() + durationMinutes,
      );
    }

    return slots;
  }
}
