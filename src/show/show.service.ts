import { Injectable } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Show } from './entities/show.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createShowDto: CreateShowDto) {
    const show = new Show(createShowDto);
    await this.entityManager.save(show);
  }

  async findAll(): Promise<Show[]> {
    return this.showRepository.find();
  }

  async findOne(show_id: number) {
    return this.showRepository.findOneBy({ show_id });
  }

  async update(show_id: number, updateShowDto: UpdateShowDto) {
    const show = await this.findOne(show_id);
    return await this.showRepository.save({ ...show, ...updateShowDto });
  }

  remove(id: number) {
    return `This action removes a #${id} show`;
  }
}
