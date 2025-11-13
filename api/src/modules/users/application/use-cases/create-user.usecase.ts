import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { CPF } from '../../domain/value-objects/cpf.vo';
import { Email } from '../../domain/value-objects/email.vo';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { IUseCase } from '@/@core/domain/use-case.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase
  implements IUseCase<CreateUserDto, UserResponseDto>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserDto): Promise<UserResponseDto> {
    // Verifica duplicação
    const cpf = new CPF(input.cpf);
    const email = new Email(input.email);

    const existingUserByCpf = await this.userRepository.findByCpf(
      cpf.getValue(),
    );
    if (existingUserByCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    const existingUserByEmail = await this.userRepository.findByEmail(
      email.getValue(),
    );
    if (existingUserByEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Cria entidade
    const user = new User({
      id: uuid(),
      cpf,
      fullName: input.fullName,
      birthDate: new Date(input.birthDate),
      phone: input.phone,
      email,
      password: hashedPassword,
      type: input.type,
      zipcode: input.zipcode,
      address: input.address,
      createdAt: new Date(),
    });

    const savedUser = await this.userRepository.create(user);

    return new UserResponseDto({
      id: savedUser.id,
      cpf: savedUser.cpf.getValue(),
      fullName: savedUser.fullName,
      birthDate: savedUser.birthDate,
      phone: savedUser.phone,
      email: savedUser.email.getValue(),
      type: savedUser.type,
      zipcode: savedUser.zipcode,
      address: savedUser.address,
      createdAt: savedUser.createdAt,
    });
  }
}
