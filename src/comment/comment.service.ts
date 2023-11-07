import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private readonly entityManager: EntityManager,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    const comment = new Comment(createCommentDto);
    return this.entityManager.save(comment);
  }

  findAll() {
    return this.commentRepository.find();
  }

  async findOne(comment_id: number) {
    return this.commentRepository.findOneBy({ comment_id });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);
    return await this.commentRepository.save({
      ...comment,
      ...updateCommentDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
