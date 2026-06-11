import { UUIDResolver } from 'graphql-scalars';

import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';

import { IRequestContext } from '~/core/auth';
import { UsersModule } from '~/modules/users';

@Module({
  imports: [
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (config: ConfigService) => ({
        context: ({ req }: IRequestContext) => ({ req }),
        autoSchemaFile: true,
        sortSchema: true,
        playground: config.getOrThrow('NODE_ENV') === 'development',
        resolvers: { UUID: UUIDResolver },
        buildSchemaOptions: {
          scalarsMap: [
            {
              type: () => String,
              scalar: UUIDResolver,
            },
          ],
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class GraphQLModule {}
