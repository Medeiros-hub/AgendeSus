import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
  private readonly _privateKey: string;
  private readonly _publicKey: string;
  private readonly _expiresIn: string;
  private readonly _cookieName: string;

  constructor(private configService: ConfigService) {
    const privateKeyEnv = this.configService.get<string>('JWT_PRIVATE_KEY');
    const publicKeyEnv = this.configService.get<string>('JWT_PUBLIC_KEY');

    this._privateKey = this.isBase64(privateKeyEnv)
      ? Buffer.from(privateKeyEnv, 'base64').toString('utf-8')
      : privateKeyEnv;
    this._publicKey = this.isBase64(publicKeyEnv)
      ? Buffer.from(publicKeyEnv, 'base64').toString('utf-8')
      : publicKeyEnv;

    this._expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '8h');
    this._cookieName = this.configService.get<string>(
      'JWT_COOKIE_NAME',
      'auth_token',
    );

    this.validateKeys();
  }

  private isBase64(str: string): boolean {
    try {
      return Buffer.from(str, 'base64').toString('base64') === str;
    } catch {
      return false;
    }
  }

  private validateKeys() {
    if (!this._privateKey.includes('PRIVATE KEY')) {
      throw new Error('Invalid private key format');
    }
    if (!this._publicKey.includes('PUBLIC KEY')) {
      throw new Error('Invalid public key format');
    }
  }

  get privateKey(): string {
    return this._privateKey;
  }

  get publicKey(): string {
    return this._publicKey;
  }

  get expiresIn(): string {
    return this._expiresIn;
  }

  get cookieName(): string {
    return this._cookieName;
  }

  get cookieOptions() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      domain: 'agendesus.onrender.com',
      maxAge: this.parseExpiresIn(this._expiresIn),
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 8 * 60 * 60 * 1000; // 8h default

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return value * multipliers[unit];
  }
}
