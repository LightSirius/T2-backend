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

  @Column({
    nullable: true,
    default: null,
  })
  comment_sort_idx: number;

  @Column()
  board_id: number;

  @Column()
  comment_reply_id: number;

  @Column({ type: 'uuid' })
  user_uuid: string;

  @Column()
  comment_contents: string;

  @Column({ default: false })
  is_delete: boolean;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;
}
