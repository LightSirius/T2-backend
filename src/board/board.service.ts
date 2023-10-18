import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { EntityManager, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardService {
  constructor(
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
}
