import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { EntityNotFoundException } from '../../../../@core/domain/domain.exception';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

interface UpdateUserInput {
  id: string;
  data: UpdateUserDto;
}

@Injectable()
export class UpdateUserUseCase
  implements IUseCase<UpdateUserInput, UserResponseDto>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: UpdateUserInput): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new EntityNotFoundException('User', input.id);
    }

    user.updateProfile(input.data);

    const updatedUser = await this.userRepository.update(user);

    return new UserResponseDto({
      id: updatedUser.id,
      cpf: updatedUser.cpf.getValue(),
      fullName: updatedUser.fullName,
      birthDate: updatedUser.birthDate,
      phone: updatedUser.phone,
      email: updatedUser.email.getValue(),
      type: updatedUser.type,
      zipcode: updatedUser.zipcode,
      address: updatedUser.address,
      createdAt: updatedUser.createdAt,
    });
  }
}
