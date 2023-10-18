import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiTags } from '@nestjs/swagger';
import { TicketReserveDto } from './dto/ticket-reserve.dto';

@ApiTags('Ticket API')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }

  @Post('/tget')
  t_get(@Body() req: { key: string }) {
    return this.ticketService.redis_test_get(req.key);
  }

  @Post('/tset')
  t_set(@Body() req: { key: string; val: string }) {
    return this.ticketService.redis_test_set(req.key, req.val);
  }

  @Post('/rset')
  reserve_seat(@Body() ticketReserveDto: TicketReserveDto) {
    return this.ticketService.reserve_seat(ticketReserveDto);
  }
}
