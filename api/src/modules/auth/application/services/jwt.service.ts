import { JwtConfig } from '@/config/jwt.config';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  email: string;
  type: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  constructor(private readonly jwtConfig: JwtConfig) {}

  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const options: jwt.SignOptions = {
      algorithm: 'RS256',
      expiresIn: this.jwtConfig.expiresIn as any,
    };
    return jwt.sign(payload as object, this.jwtConfig.privateKey, options);
  }

  verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtConfig.publicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
}
