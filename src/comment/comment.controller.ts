import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CommentInsertDto } from './dto/comment-insert.dto';

@ApiTags('Comment API')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('insert')
  async comment_insert(
    @Body() commentInsertDto: CommentInsertDto,
    @Request() guard,
  ) {
    return await this.commentService.comment_insert(
      commentInsertDto,
      guard.user,
    );
  }

  @Get('list/:board_id/:page')
  comment_list(
    @Param('board_id') board_id: number,
    @Param('page') page: number,
  ) {
    return this.commentService.comment_list(+board_id, +page);
  }

  @Get('count/:board_id')
  comment_list_count(@Param('board_id') board_id: number) {
    return this.commentService.comment_list_count(board_id);
  }
}
