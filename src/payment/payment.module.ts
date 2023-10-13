import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentList } from './entities/payment-list.entity';
import { PaymentPortone } from './entities/payment-portone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentList, PaymentPortone])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
