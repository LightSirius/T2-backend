import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

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

  async comment_list(board_id: number, page: number) {
    const sql_limit = 20;
    const sql_page = page - 1 > 0 ? page - 1 : 0;
    const sql_offset = sql_page * sql_limit;

    return {
      total_page: Math.ceil(
        (await this.commentRepository.count({
          where: {
            board_id: board_id,
          },
        })) / sql_limit,
      ),
      comment_list: await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect(User, 'user', 'comment.user_uuid = user.user_uuid')
        .select([
          'comment.comment_id AS comment_id',
          'comment.comment_reply_id AS comment_reply_id',
          'comment.comment_contents AS comment_contents',
          'user.user_name AS user_name',
        ])
        .where('comment.board_id = :board_id', { board_id: board_id })
        .orderBy('comment.comment_sort_idx')
        .limit(sql_limit)
        .offset(sql_offset)
        .getRawMany(),
    };
  }
}
