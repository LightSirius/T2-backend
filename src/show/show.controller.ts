import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { ApiTags } from '@nestjs/swagger';
import { Show } from './entities/show.entity';

@ApiTags('Show API')
@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Post('create')
  create(@Body() createShowDto: CreateShowDto) {
    return this.showService.create(createShowDto);
  }

  @Get()
  findAll(): Promise<Show[]> {
    return this.showService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Show> {
    return this.showService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto) {
    return this.showService.update(+id, updateShowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showService.remove(+id);
  }
}
