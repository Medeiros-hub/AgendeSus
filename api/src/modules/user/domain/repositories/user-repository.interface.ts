import { User } from '../entities/user.entity';
import { IRepository } from '../../../../shared/interfaces/repository.interface';

export interface IUserRepository extends IRepository<User> {
  findByCpf(cpf: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByCpf(cpf: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}
