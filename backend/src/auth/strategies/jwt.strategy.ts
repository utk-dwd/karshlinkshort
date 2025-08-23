import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // FIX: Provide a fallback for the secret to satisfy TypeScript
      secretOrKey: configService.get('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: { sub: string; email: string }): Promise<Partial<User>> {
    // We only need to return the payload, the AuthGuard will attach it to the request
    return { id: payload.sub, email: payload.email };
  }
}
