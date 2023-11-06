import { BoardType } from '../entities/board.entity';

class NearBoardList {
  board_id: number;
  board_title: string;
  create_date: Date;
}

export class BoardDetailDto {
  board_id: number;
  board_type: BoardType;
  board_title: string;
  board_contents: string;
  user_name: string;
  update_date: Date;
  near_board_list: NearBoardList;
}
