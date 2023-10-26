import { Column, Entity } from 'typeorm';
import { PaymentInherit } from './payment-inherit.entity';

@Entity()
export class PaymentPortone extends PaymentInherit {
  constructor(paymentPortone: Partial<PaymentPortone>) {
    super();
    Object.assign(this, paymentPortone);
  }

  @Column()
  imp_uid: string;
}
