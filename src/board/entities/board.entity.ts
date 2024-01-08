import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BoardType {
  'notice',
  'update',
  'event',
  'free',
}
@Entity()
export class Board {
  constructor(board: Partial<Board>) {
    Object.assign(this, board);
  }

  @PrimaryGeneratedColumn()
  board_id: number;

  @Column({ type: 'uuid' })
  user_uuid: string;

  @Column()
  user_name: string;

  @Column({ type: 'enum', enum: BoardType, default: BoardType.free })
  board_type: BoardType;

  @Column()
  board_title: string;

  @Column()
  board_contents: string;

  @Column({ default: 0 })
  comment_count: number;

  @Column({ default: 0 })
  view_count: number;

  @Column({ default: 0 })
  recommend_count: number;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  update_date: Date;
}
