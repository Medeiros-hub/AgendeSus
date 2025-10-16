import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../user/domain/repositories/user-repository.interface';
import { USER_REPOSITORY_TOKEN } from '../user/user.tokens';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    let user: User | null;

    if (identifier.includes('@')) {
      user = await this.userRepository.findByEmail(identifier);
    } else {
      user = await this.userRepository.findByCpf(identifier);
    }

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user.toPlainObject();
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      cpf: user.cpf,
      fullName: user.fullName,
      email: user.email,
      type: user.type,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        cpf: user.cpf,
        fullName: user.fullName,
        email: user.email,
        type: user.type,
      },
    };
  }
}
