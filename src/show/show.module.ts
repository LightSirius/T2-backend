import { Module } from '@nestjs/common';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';

@Module({
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
