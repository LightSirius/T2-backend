import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAuth } from './user-auth.entity';

export enum UserGender {
  a = 'a',
  b = 'b',
  c = 'c',
}

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn('uuid')
  user_uuid: string;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column()
  user_born: Date;

  @Column({ type: 'enum', enum: UserGender, default: UserGender.c })
  user_gender: UserGender;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;

  @OneToOne(() => UserAuth, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  userAuth: UserAuth;
}
