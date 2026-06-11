import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createRemoteJWKSet,
  FlattenedJWSInput,
  GetKeyFunction,
  JWSHeaderParameters,
  jwtVerify,
} from 'jose';

import { ISupabaseJwtPayload } from './types';

@Injectable()
export class AuthService {
  private readonly jwks: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.getOrThrow<string>('SUPABASE_URL');
    const jwksUrl = new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`);
    this.jwks = createRemoteJWKSet(jwksUrl);
  }

  async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify<ISupabaseJwtPayload>(
        token,
        this.jwks
      );

      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
