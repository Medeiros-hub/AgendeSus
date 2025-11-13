import { UBS } from '../entities/ubs.entity';

export interface IUBSRepository {
  create(ubs: UBS): Promise<UBS>;
  findById(id: string): Promise<UBS | null>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ ubsList: UBS[]; total: number }>;
  update(ubs: UBS): Promise<UBS>;
  delete(id: string): Promise<void>;
}

export const UBS_REPOSITORY = Symbol('IUBSRepository');
