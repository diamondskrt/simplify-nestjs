import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { GraphQLDate, JSONResolver, UUIDResolver } from 'graphql-scalars';

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
        buildSchemaOptions: {
          scalarsMap: [
            {
              type: () => Date,
              scalar: GraphQLDate,
            },
            {
              type: () => String,
              scalar: UUIDResolver,
            },
            {
              type: () => Object,
              scalar: JSONResolver,
            },
          ],
        },
        resolvers: {
          Date: GraphQLDate,
          UUID: UUIDResolver,
          JSON: JSONResolver,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class GraphQLModule {}
