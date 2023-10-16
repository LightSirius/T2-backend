import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class PaymentInherit {
  @PrimaryGeneratedColumn('uuid')
  payment_uuid: string;

  @Column()
  payment_id: number;
}
