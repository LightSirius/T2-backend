class BoardList {
  board_id: string;
  board_title: string;
  user_name: string;
}

export class BoardListDto {
  total_page: number;
  board_list: BoardList[];
}
