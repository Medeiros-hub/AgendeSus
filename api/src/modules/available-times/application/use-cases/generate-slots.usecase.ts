import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../@core/infra/prisma.service';
import { GenerateSlotsDto } from '../dto/generate-slots.dto';

@Injectable()
export class GenerateSlotsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GenerateSlotsDto) {
    const {
      date,
      startHour,
      endHour,
      intervalMinutes,
      healthProfessionalId,
      ubsId,
      serviceId,
    } = dto;

    const [year, month, day] = date.split('-').map(Number);
    const baseDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

    const [startH, startM] = startHour.split(':').map(Number);
    const [endH, endM] = endHour.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes >= endMinutes) {
      throw new Error('Hora inicial deve ser menor que hora final');
    }

    const slots = [];
    let currentMinutes = startMinutes;

    while (currentMinutes + intervalMinutes <= endMinutes) {
      const startH = Math.floor(currentMinutes / 60);
      const startM = currentMinutes % 60;
      const endH = Math.floor((currentMinutes + intervalMinutes) / 60);
      const endM = (currentMinutes + intervalMinutes) % 60;

      const startTime = new Date(
        Date.UTC(year, month - 1, day, startH, startM, 0, 0),
      );
      const endTime = new Date(
        Date.UTC(year, month - 1, day, endH, endM, 0, 0),
      );

      slots.push({
        date: baseDate,
        startTime,
        endTime,
        available: true,
        healthProfessionalId,
        ubsId,
        serviceId,
      });

      currentMinutes += intervalMinutes;
    }

    const created = await this.prisma.availableTime.createMany({
      data: slots,
      skipDuplicates: true,
    });

    return {
      message: `${created.count} horários criados com sucesso`,
      count: created.count,
      slots: slots.map((slot) => {
        const year = slot.date.getUTCFullYear();
        const month = String(slot.date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(slot.date.getUTCDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        return {
          date: dateStr,
          startTime: `${String(slot.startTime.getUTCHours()).padStart(2, '0')}:${String(slot.startTime.getUTCMinutes()).padStart(2, '0')}`,
          endTime: `${String(slot.endTime.getUTCHours()).padStart(2, '0')}:${String(slot.endTime.getUTCMinutes()).padStart(2, '0')}`,
        };
      }),
    };
  }
}
