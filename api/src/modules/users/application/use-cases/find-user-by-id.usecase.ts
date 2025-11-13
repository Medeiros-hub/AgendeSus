import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { EntityNotFoundException } from '../../../../@core/domain/domain.exception';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class FindUserByIdUseCase implements IUseCase<string, UserResponseDto> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    return new UserResponseDto({
      id: user.id,
      cpf: user.cpf.getValue(),
      fullName: user.fullName,
      birthDate: user.birthDate,
      phone: user.phone,
      email: user.email.getValue(),
      type: user.type,
      zipcode: user.zipcode,
      address: user.address,
      createdAt: user.createdAt,
    });
  }
}
