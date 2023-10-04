import { Module } from '@nestjs/common';
import { ShowController } from './show.controller';

@Module({
  controllers: [ShowController]
})
export class ShowModule {}
