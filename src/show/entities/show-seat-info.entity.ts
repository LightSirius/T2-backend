import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShowSeatInfo {
  constructor(showSeatInfo: Partial<ShowSeatInfo>) {
    Object.assign(this, showSeatInfo);
  }

  @PrimaryGeneratedColumn()
  info_idx: number;

  @Column()
  show_id: number;

  @Column()
  area_id: string;

  @Column()
  seat_count: number;
}
