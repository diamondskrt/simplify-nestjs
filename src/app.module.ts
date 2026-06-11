import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { AuthModule } from '~/core/auth';
import { GraphQLModule } from '~/core/graphql';
import { SupabaseModule } from '~/core/supabase';

import { PrismaModule } from './core/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: null, // We use Zod for validation
    }),
    AuthModule,
    PrismaModule,
    GraphQLModule,
    SupabaseModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
