import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentList, PaymentType } from './entities/payment-list.entity';
import { Connection, EntityManager, Repository } from 'typeorm';
import { PaymentPortone } from './entities/payment-portone.entity';
import { CreatePaymentPortoneDto } from './dto/create-payment-portone.dto';
import { CreatePaymentPaypalDto } from './dto/create-payment-paypal.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentList)
    private paymentListRepository: Repository<PaymentList>,
    @InjectRepository(PaymentPortone)
    private paymentPortoneRepository: Repository<PaymentPortone>,
    private readonly entityManager: EntityManager,
    private readonly connection: Connection,
  ) {}
  async create(body: CreatePaymentPortoneDto | CreatePaymentPaypalDto) {
    const queryRunner = await this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      switch (body.payment_type) {
        case PaymentType.portone: {
          const paymentPortone = new PaymentPortone({
            payment_id: body.payment_id,
          });
          await this.paymentPortoneRepository.save(paymentPortone);

          const paymentList = new PaymentList({
            payment_uuid: paymentPortone.payment_uuid,
            ...body,
          });
          await this.paymentListRepository.save(paymentList);

          return paymentList.payment_uuid;
        }
        default: {
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getPaymentLists(user_uuid: string) {
    return await this.paymentListRepository.findBy({ user_uuid });
  }
}
