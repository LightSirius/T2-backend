import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentPortoneDto } from './dto/create-payment-portone.dto';
import { CreatePaymentPaypalDto } from './dto/create-payment-paypal.dto';
import { validate } from 'class-validator';
import { PaymentType } from './entities/payment-list.entity';

@ApiTags('Payment API')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async create(@Body() body: CreatePaymentPortoneDto | CreatePaymentPaypalDto) {
    switch (body.payment_type) {
      case PaymentType.portone: {
        body = Object.setPrototypeOf(body, CreatePaymentPortoneDto.prototype);
        await validate(body).then(async (errors) => {
          if (errors.length > 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
          } else {
            return await this.paymentService.create(body);
          }
        });
        break;
      }
      case PaymentType.paypal: {
        body = Object.setPrototypeOf(body, CreatePaymentPaypalDto.prototype);
        await validate(body).then(async (errors) => {
          if (errors.length > 0) {
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
          } else {
            return await this.paymentService.create(body);
          }
        });
        break;
      }
      default: {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Get('user/:id')
  async getPaymentLists(@Param('id') id: string) {
    return this.paymentService.getPaymentLists(id);
  }
}
