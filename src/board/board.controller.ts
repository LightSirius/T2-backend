import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiTags } from '@nestjs/swagger';

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

  @Post('insert')
  async board_insert(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardService.board_insert(createBoardDto);
  }

  @Post('update/:id')
  board_update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardService.board_update(+id, updateBoardDto);
  }
}
