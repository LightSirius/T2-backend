import { Logger, Module } from '@nestjs/common';
import { createClient } from 'redis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: 'redis://predixy:7500',
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
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
