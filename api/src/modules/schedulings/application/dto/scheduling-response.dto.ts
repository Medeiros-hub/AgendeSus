import { SchedulingStatus } from '@prisma/client';

export class SchedulingResponseDto {
  id: string;
  availableTimeId: string;
  userId: string;
  status: SchedulingStatus;
  scheduledAt: Date;
  confirmCode: string;
  createdAt: Date;

  constructor(partial: Partial<SchedulingResponseDto>) {
    Object.assign(this, partial);
  }
}
