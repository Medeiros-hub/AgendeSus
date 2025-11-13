import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../users/domain/repositories/user.repository.interface';
import { JwtService } from '../services/jwt.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtConfig } from '../../../../config/jwt.config';

@Injectable()
export class LoginUseCase
  implements IUseCase<LoginDto, { response: LoginResponseDto; token: string }>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfig,
  ) {}

  async execute(
    input: LoginDto,
  ): Promise<{ response: LoginResponseDto; token: string }> {
    const isEmail = input.identifier.includes('@');

    let user;
    if (isEmail) {
      user = await this.userRepository.findByEmail(input.identifier);
    } else {
      const cleanCpf = input.identifier.replace(/\D/g, '');
      user = await this.userRepository.findByCpf(cleanCpf);
    }

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email.getValue(),
      type: user.type,
    });

    const response = new LoginResponseDto({
      user: {
        id: user.id,
        email: user.email.getValue(),
        fullName: user.fullName,
        type: user.type,
      },
      expiresIn: this.jwtConfig.expiresIn,
    });

    return { response, token };
  }
}
