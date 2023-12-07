import { Module } from '@nestjs/common';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { ShowSeatInfo } from './entities/show-seat-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, ShowSeatInfo])],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
