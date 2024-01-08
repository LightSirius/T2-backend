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
  comment_count?: number;
  view_count?: number;
  recommend_count?: number;
  update_date: Date;
  near_board_list: NearBoardList;
}
