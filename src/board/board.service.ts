import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class BoardService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: RedisClientType,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private readonly entityManager: EntityManager,
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
            'user.user_name AS user_name',
            'board.update_date AS update_date',
          ])
          .where('board.board_id = :board_id', { board_id: board_id })
          .getRawOne()),
      };
    }

    console.log(board_detail_data);

    if (isEmpty(board_detail_data)) {
      return null;
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

    console.log(board_detail_data);

    return board_detail_data;
  }

  async board_insert(boardInsertDto: BoardInsertDto, guard: { uuid: string }) {
    const board = await this.create({
      user_uuid: guard.uuid,
      ...boardInsertDto,
    });
    return board.board_id;
  }

  // TODO:: 본인의 게시물인지 확인하는 함수 추가할 필요가 있음. board_check_owner()
  //  프론트에서 수정하기 페이지 넘어가기 전에 해당 API 호출해서 본인 게시물이 맞는지 체크할 수 있게.
  async board_modify(
    id: number,
    boardModifyDto: BoardModifyDto,
    guard: { uuid: string },
  ) {
    const board = await this.findOne(id);
    if (board.user_uuid == guard.uuid) {
      await this.update(id, boardModifyDto);
      await this.redis.hDel('board_detail_list', id.toString());
    } else {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
