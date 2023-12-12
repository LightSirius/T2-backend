import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { EntityManager, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisClientType } from 'redis';
import { User } from '../user/entities/user.entity';
import { BoardListDto } from './dto/board-list.dto';
import { BoardDetailDto } from './dto/board-detail.dto';
import { BoardInsertDto } from './dto/board-insert.dto';
import { BoardModifyDto } from './dto/board-modify.dto';
import { isEmpty } from '../utils/utill';
import { BoardSearchDto } from './dto/board-search.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  BoardEsNewestPayload,
  BoardEsScorePayload,
  BoardEsSearchPayload,
} from './payload/board-es.payload';
import { BoardEsNewestDto } from './dto/board-es-newest.dto';
import { BoardEsScoreDto } from './dto/board-es-score.dto';
import { BoardEsSearchDto } from './dto/board-es-search.dto';

@Injectable()
export class BoardService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: RedisClientType,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private readonly entityManager: EntityManager,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}
  create(createBoardDto: CreateBoardDto) {
    const board = new Board(createBoardDto);
    return this.entityManager.save(board);
  }

  async findAll() {
    return this.boardRepository.find();
  }

  async findOne(board_id: number) {
    return this.boardRepository.findOneBy({ board_id });
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.findOne(id);
    return await this.boardRepository.save({ ...board, ...updateBoardDto });
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }

  async board_list(type: number, page: number): Promise<BoardListDto> {
    const sql_limit = 20;
    const sql_page = page - 1 > 0 ? page - 1 : 0;
    const sql_offset = sql_page * sql_limit;

    return {
      total_page: Math.ceil(
        (await this.boardRepository.count({
          where: {
            board_type: type,
          },
        })) / sql_limit,
      ),
      board_list: await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect(User, 'user', 'board.user_uuid = user.user_uuid')
        .select([
          'board.board_id AS board_id',
          'board.board_title AS board_title',
          // 'board.board_contents AS board_contents',
          'user.user_name AS user_name',
        ])
        .where('board.board_type = :type', { type: type })
        .orderBy('board.board_id', 'DESC')
        .limit(20)
        .offset(sql_offset)
        .getRawMany(),
    };
  }

  async board_detail(board_id: number): Promise<BoardDetailDto> {
    let board_detail_data = new BoardDetailDto();

    if (await this.redis.hExists('board_detail_list', board_id.toString())) {
      board_detail_data = {
        ...JSON.parse(
          await this.redis.hGet('board_detail_list', board_id.toString()),
        ),
      };
    } else {
      board_detail_data = {
        ...(await this.boardRepository
          .createQueryBuilder('board')
          .leftJoinAndSelect(User, 'user', 'board.user_uuid = user.user_uuid')
          .select([
            'board.board_id AS board_id',
            'board.board_type AS board_type',
            'board.board_title AS board_title',
            'board.board_contents AS board_contents',
            'board.user_uuid AS user_uuid',
            'user.user_name AS user_name',
            'board.update_date AS update_date',
          ])
          .where('board.board_id = :board_id', { board_id: board_id })
          .getRawOne()),
      };
    }

    if (isEmpty(board_detail_data)) {
      throw new HttpException('Not Found', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.redis.hSet(
      'board_detail_list',
      board_id.toString(),
      JSON.stringify(board_detail_data),
    );

    board_detail_data.near_board_list = {
      ...(await this.entityManager.query(
        'select board_id, board_type, board_title, create_date ' +
          'from (select board_id, board_type, board_title, create_date ' +
          'from board where board_id < $1 and board_type = $2 order by board_id DESC limit 1) as before_detail ' +
          'union all ' +
          'select board_id, board_type, board_title, create_date ' +
          'from (select board_id, board_type, board_title, create_date ' +
          'from board where board_id > $1 and board_type = $2 order by board_id limit 1) as after_detail',
        [board_id, board_detail_data.board_type],
      )),
    };

    return board_detail_data;
  }

  async board_insert(
    boardInsertDto: BoardInsertDto,
    guard: { uuid: string; name: string },
  ) {
    const board = await this.create({
      user_uuid: guard.uuid,
      user_name: guard.name,
      ...boardInsertDto,
    });
    const es_result = await this.elasticsearchService.create({
      index: 'board_community',
      id: board.board_id.toString(),
      document: {
        board_id: board.board_id,
        board_title: board.board_title,
        board_contents: board.board_contents,
        board_type: board.board_type,
        user_name: board.user_name,
      },
    });
    if (!es_result) {
      throw new HttpException(
        'Generation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return board.board_id;
  }

  async board_modify(
    id: number,
    boardModifyDto: BoardModifyDto,
    guard: { uuid: string; name: string },
  ) {
    const board = await this.board_check_owner(id, guard);

    if (!board) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    boardModifyDto.user_name = guard.name;

    const change_board = await this.update(id, boardModifyDto);

    await this.redis.hDel('board_detail_list', id.toString());

    const es_result = await this.elasticsearchService.update({
      index: 'board_community',
      id: change_board.board_id.toString(),
      doc: {
        board_id: change_board.board_id,
        board_title: change_board.board_title,
        board_contents: change_board.board_contents,
        board_type: change_board.board_type,
        user_name: change_board.user_name,
      },
    });
    if (!es_result) {
      throw new HttpException(
        'Generation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return change_board.board_id;
  }

  async board_check_owner(
    board_id: number,
    guard: { uuid: string },
  ): Promise<Board> {
    const board = await this.findOne(board_id);
    if (board.user_uuid == guard.uuid) {
      return board;
    } else {
      return null;
    }
  }

  async board_search_list(
    boardSearchDto: BoardSearchDto,
  ): Promise<BoardListDto> {
    const sql_limit = 20;
    const sql_page = boardSearchDto.page - 1 > 0 ? boardSearchDto.page - 1 : 0;
    const sql_offset = sql_page * sql_limit;
    const now = Date.now();

    const search_list = {
      total_page: Math.ceil(
        (await this.boardRepository
          .createQueryBuilder('board')
          .select([
            'board.board_id AS board_id',
            'board.board_title AS board_title',
          ])
          .where('board.board_type = :type', {
            type: boardSearchDto.board_type,
          })
          .andWhere('board.board_title like :search_string')
          .orWhere('board.board_contents like :search_string')
          .setParameter(
            'search_string',
            '%' + boardSearchDto.search_string + '%',
          )
          .getCount()) / sql_limit,
      ),
      board_list: await this.boardRepository
        .createQueryBuilder('board')
        .leftJoinAndSelect(User, 'user', 'board.user_uuid = user.user_uuid')
        .select([
          'board.board_id AS board_id',
          'board.board_title AS board_title',
          'user.user_name AS user_name',
        ])
        .where('board.board_type = :type', { type: boardSearchDto.board_type })
        .andWhere('board.board_title like :search_string')
        .orWhere('board.board_contents like :search_string')
        .setParameter('search_string', '%' + boardSearchDto.search_string + '%')
        .orderBy('board.board_id', 'DESC')
        .limit(sql_limit)
        .offset(sql_offset)
        .getRawMany(),
    };

    Logger.log(`board_search_list latency ${Date.now() - now}ms`, `Board`);

    return search_list;
  }

  async board_search_list_es(boardEsSearchDto: BoardEsSearchDto) {
    if (
      boardEsSearchDto.search_type != 0 &&
      boardEsSearchDto.search_string == ''
    ) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const now = Date.now();

    const search_sql: BoardEsSearchPayload = {
      index: 'board_community',
      size: 20,
      query: {
        bool: {
          filter: [
            {
              term: {
                board_type: boardEsSearchDto.board_type,
              },
            },
          ],
        },
      },
      track_total_hits: true,
    };

    switch (boardEsSearchDto.search_type) {
      case 1: {
        search_sql.query.bool.must = {
          match: { board_title: boardEsSearchDto.search_string },
        };
        break;
      }
      case 2: {
        search_sql.query.bool.must = {
          match: { board_contents: boardEsSearchDto.search_string },
        };
        break;
      }
      case 3: {
        search_sql.query.bool.must = {
          match: { user_name: boardEsSearchDto.search_string },
        };
        break;
      }
      default: {
        if (boardEsSearchDto.sort_type == 0) {
          search_sql.query.bool.must = {
            match: { board_contents: boardEsSearchDto.search_string },
          };
        }
        break;
      }
    }

    if (boardEsSearchDto.sort_type == 1) {
      search_sql.sort = [{ board_id: { order: 'desc' } }];
    }

    if (boardEsSearchDto.search_from != 0) {
      search_sql.from = boardEsSearchDto.search_from;
    }

    const board_data = await this.elasticsearchService.search(search_sql);
    Logger.log(`board_search_list_es latency ${Date.now() - now}ms`, `Board`);

    return board_data;
  }

  async board_search_list_es_newest(boardEsNewestDto: BoardEsNewestDto) {
    const now = Date.now();

    const search_sql: BoardEsNewestPayload = {
      index: 'board_community',
      size: 20,
      sort: [
        {
          board_id: {
            order: 'desc',
          },
        },
      ],
      query: {
        bool: {
          must: {
            match: {},
          },
          filter: [
            {
              term: {
                board_type: boardEsNewestDto.board_type,
              },
            },
          ],
        },
      },
      track_total_hits: true,
    };

    if (
      boardEsNewestDto.search_type != 0 &&
      boardEsNewestDto.search_string == ''
    ) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    switch (boardEsNewestDto.search_type) {
      case 1: {
        search_sql.query.bool.must.match.board_title =
          boardEsNewestDto.search_string;
        break;
      }
      case 2: {
        search_sql.query.bool.must.match.board_contents =
          boardEsNewestDto.search_string;
        break;
      }
      case 3: {
        search_sql.query.bool.must.match.user_name =
          boardEsNewestDto.search_string;
        break;
      }
      default: {
        break;
      }
    }

    if (boardEsNewestDto.search_after != 0) {
      search_sql.search_after = [boardEsNewestDto.search_after];
    }

    const board_data = await this.elasticsearchService.search(search_sql);
    Logger.log(
      `board_search_list_es_newest latency ${Date.now() - now}ms`,
      `Board`,
    );

    return board_data;
  }

  async board_search_list_es_score(boardEsScoreDto: BoardEsScoreDto) {
    const now = Date.now();

    const search_sql: BoardEsScorePayload = {
      index: 'board_community',
      size: 20,
      query: {
        bool: {
          must: {
            match: {},
          },
          filter: [
            {
              term: {
                board_type: boardEsScoreDto.board_type,
              },
            },
          ],
        },
      },
      track_total_hits: true,
    };

    switch (boardEsScoreDto.search_type) {
      case 1: {
        search_sql.query.bool.must.match.board_title =
          boardEsScoreDto.search_string;
        break;
      }
      case 2: {
        search_sql.query.bool.must.match.board_contents =
          boardEsScoreDto.search_string;
        break;
      }
      case 3: {
        search_sql.query.bool.must.match.user_name =
          boardEsScoreDto.search_string;
        break;
      }
      default: {
        search_sql.query.bool.must.match.board_contents =
          boardEsScoreDto.search_string;
        break;
      }
    }

    if (boardEsScoreDto.search_from != 0) {
      search_sql.from = boardEsScoreDto.search_from;
    }

    const board_data = await this.elasticsearchService.search(search_sql);
    Logger.log(
      `board_search_list_es_score latency ${Date.now() - now}ms`,
      `Board`,
    );

    return board_data;
  }
}
