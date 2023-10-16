import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class CreatePaymentPaypalDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({ description: 'user_uuid' })
  @IsString()
  user_uuid: string;
  @ApiProperty({ description: 'payment_amount' })
  @IsNumber()
  payment_amount: number;
}
