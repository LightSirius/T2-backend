import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { RedisModule } from '../redis/redis.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    RedisModule,
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        node: configService.getOrThrow('ELASTIC_HOST'),
        auth: {
          username: configService.getOrThrow('ELASTIC_USERNAME'),
          password: configService.getOrThrow('ELASTIC_PASSWORD'),
        },
        tls: {
          ca: configService.getOrThrow('ELASTIC_TLS_CRT'),
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
