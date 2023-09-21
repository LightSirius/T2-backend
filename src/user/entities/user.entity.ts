import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn('uuid')
  user_uuid: string;

  @Column()
  user_id: string;

  @Column()
  user_email: string;
}
