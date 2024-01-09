import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CommentInsertDto } from './dto/comment-insert.dto';

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

  findOne(comment_id: number) {
    return this.commentRepository.findOneBy({ comment_id });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);
    return this.commentRepository.save({
      ...comment,
      ...updateCommentDto,
    });
  }

  async remove(comment_id: number) {
    const comment = await this.findOne(comment_id);
    comment.is_delete = true;
    return await this.commentRepository.save(comment);
  }

  async comment_insert(
    commentInsertDto: CommentInsertDto,
    guard: { uuid: string },
  ) {
    const comment = await this.create({
      user_uuid: guard.uuid,
      ...commentInsertDto,
    });
    comment.comment_sort_idx =
      comment.comment_reply_id == 0
        ? comment.comment_id
        : comment.comment_reply_id;
    return await this.entityManager.save(comment);
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
          'comment.is_delete AS is_delete',
          'comment.create_date AS create_date',
          'user.user_name AS user_name',
        ])
        .where('comment.board_id = :board_id', { board_id: board_id })
        .orderBy('comment.comment_sort_idx, comment.comment_id')
        .limit(sql_limit)
        .offset(sql_offset)
        .getRawMany(),
    };
  }

  async comment_list_count(board_id: number) {
    return await this.commentRepository.count({
      where: { board_id: board_id, is_delete: false },
    });
  }
}
