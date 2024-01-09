export class BoardEsSearchPayload {
  index: string;
  size: number;
  from?: number;
  sort?: [
    {
      board_id?: {
        order: string;
      };
    },
  ];
  query: {
    bool: {
      must?: {
        match?: {
          board_title?: string;
          board_contents?: string;
          user_name?: string;
        };
      };
      filter: [
        {
          term: {
            board_type: number;
          };
        },
      ];
    };
  };
  track_total_hits: boolean;
}

export class BoardEsNewestPayload {
  index: string;
  size: number;
  sort: [
    {
      board_id: {
        order: string;
      };
    },
  ];
  query: {
    bool: {
      must?: {
        match?: {
          board_title?: string;
          board_contents?: string;
          user_name?: string;
        };
      };
      filter: [
        {
          term: {
            board_type: number;
          };
        },
      ];
    };
  };
  search_after?: [number];
  track_total_hits: boolean;
}

export class BoardEsScorePayload {
  index: string;
  size: number;
  from?: number;
  query: {
    bool: {
      must: {
        match: {
          board_title?: string;
          board_contents?: string;
          user_name?: string;
        };
      };
      filter: [
        {
          term: {
            board_type: number;
          };
        },
      ];
    };
  };
  track_total_hits: boolean;
}

export class BoardListPayload {
  board_id: number;
  board_title: string;
  board_contents: string;
  board_type: number;
  user_name: string;
}
