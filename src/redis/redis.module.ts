import { Logger, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: configService.getOrThrow('REDIS_URL'),
          socket: {
            keepAlive: 1000,
            reconnectStrategy: (retries: number, cause: Error) => {
              Logger.error(
                `[${retries}] ${cause.name} : ${cause.message}`,
                'Redis Client',
              );
              return 1000;
            },
          },
        });
        client.on('error', function () {});
        client.on('connect', function () {
          Logger.log(`Connect to ${client.options.url}`, 'Redis Client');
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
