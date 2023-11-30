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
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { BoardInsertDto } from './dto/board-insert.dto';
import { BoardSearchDto } from './dto/board-search.dto';
import { BoardEsNewestDto } from './dto/board-es-newest.dto';
import { BoardEsScoreDto } from './dto/board-es-score.dto';

@ApiTags('Board API')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('create')
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }

  @Get('list/:type/:page')
  board_list(@Param('type') type: number, @Param('page') page: number) {
    return this.boardService.board_list(+type, +page);
  }

  @Get('detail/:board_id')
  board_detail(@Param('board_id') board_id: number) {
    return this.boardService.board_detail(board_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('insert')
  async board_insert(@Body() boardInsertDto: BoardInsertDto, @Request() guard) {
    return await this.boardService.board_insert(boardInsertDto, guard.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('modify/:board_id')
  board_modify(
    @Param('board_id') board_id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() guard,
  ) {
    return this.boardService.board_modify(
      +board_id,
      updateBoardDto,
      guard.user,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('check-owner/:board_id')
  board_check_owner(@Param('board_id') board_id: string, @Request() guard) {
    return this.boardService.board_check_owner(+board_id, guard.user);
  }

  @Post('search')
  board_search_list(@Body() boardSearchDto: BoardSearchDto) {
    return this.boardService.board_search_list(boardSearchDto);
  }

  @Post('search-es-newest')
  board_search_list_es_newest(@Body() boardEsNewestDto: BoardEsNewestDto) {
    return this.boardService.board_search_list_es_newest(boardEsNewestDto);
  }

  @Post('search-es-score')
  board_search_list_es_score(@Body() boardEsScoreDto: BoardEsScoreDto) {
    return this.boardService.board_search_list_es_score(boardEsScoreDto);
  }
}
