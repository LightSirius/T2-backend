import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Show {
  constructor(show: Partial<Show>) {
    Object.assign(this, show);
  }

  @PrimaryGeneratedColumn()
  show_id: number;

  @Column()
  show_name: string;

  @Column()
  show_details: string;

  @Column()
  show_description: string;

  @Column()
  show_start_date: Date;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;

  @Column()
  alter_user: string;
}
