import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  constructor(comment: Partial<Comment>) {
    Object.assign(this, comment);
  }

  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column()
  board_id: number;

  @Column()
  comment_reply_id: number;

  @Column({ type: 'uuid' })
  user_uuid: string;

  @Column()
  comment_contents: string;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;
}
