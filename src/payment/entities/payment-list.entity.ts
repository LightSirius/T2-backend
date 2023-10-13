import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentType {
  'portone',
  'paypal',
}

@Entity()
export class PaymentList {
  constructor(paymentList: Partial<PaymentList>) {
    Object.assign(this, paymentList);
  }

  @PrimaryGeneratedColumn()
  payment_idx: number;

  @Column()
  payment_uuid: string;

  @Column()
  user_uuid: string;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.portone })
  payment_type: PaymentType;

  @Column()
  payment_amount: number;

  @Column()
  payment_receipt_url: string;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;
}
