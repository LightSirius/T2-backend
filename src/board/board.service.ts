import { Inject, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { EntityManager, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisClientType } from 'redis';
import { User } from '../user/entities/user.entity';
import { BoardListDto } from './dto/board-list.dto';
import { BoardDetailDto } from './dto/board-detail.dto';

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

  async board_list(type: number, page: number): Promise<BoardListDto[]> {
    const sql_limit = 20;
    const sql_page = page - 1 > 0 ? page - 1 : 0;
    const sql_offset = sql_page * sql_limit;

    return await this.boardRepository
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
      .getRawMany();
  }

  async board_detail(board_id: number): Promise<BoardDetailDto> {
    if (await this.redis.hExists('board_detail_list', board_id.toString())) {
      return JSON.parse(
        await this.redis.hGet('board_detail_list', board_id.toString()),
      );
    }

    const data: BoardDetailDto = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect(User, 'user', 'board.user_uuid = user.user_uuid')
      .select([
        'board.board_id AS board_id',
        'board.board_title AS board_title',
        'board.board_contents AS board_contents',
        'user.user_name AS user_name',
        'board.update_date AS update_date',
      ])
      .where('board.board_id = :board_id', { board_id: board_id })
      .getRawOne();

    if (!data) {
      return null;
    }

    this.redis.hSet(
      'board_detail_list',
      board_id.toString(),
      JSON.stringify(data),
    );

    return data;
  }

  async board_insert(createBoardDto: CreateBoardDto) {
    this.create(createBoardDto);
  }

  async board_update(id: number, updateBoardDto: UpdateBoardDto) {
    await this.update(id, updateBoardDto);
    this.redis.hDel('board_detail_list', id.toString());
  }
}
