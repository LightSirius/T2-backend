import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAuth {
  constructor(userAuth: Partial<UserAuth>) {
    Object.assign(this, userAuth);
  }

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  auth_id: string;

  @Column()
  auth_password: string;
}
