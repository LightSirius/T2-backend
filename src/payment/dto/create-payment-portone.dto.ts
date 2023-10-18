import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class CreatePaymentPortoneDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({ description: 'imp_uid' })
  @IsString()
  imp_uid: string;
  @ApiProperty({ description: 'user_uuid' })
  @IsString()
  user_uuid: string;
  @ApiProperty({ description: 'payment_amount' })
  @IsNumber()
  payment_amount: number;
  @ApiProperty({ description: 'payment_receipt_url' })
  @IsString()
  payment_receipt_url: string;
}
