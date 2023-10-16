import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { PaymentType } from '../entities/payment-list.entity';

export class CreatePaymentDto {
  @ApiProperty({ description: 'PaymentType' })
  @IsEnum(PaymentType)
  payment_type: PaymentType;
  @ApiProperty({ description: 'payment_id' })
  @IsNumber()
  payment_id: number;
}
