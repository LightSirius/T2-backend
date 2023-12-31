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
import { UnsetReserveDto } from './dto/unset-reserve.dto';
import { TicketReserveListDto } from './dto/ticket-reserve-list.dto';
import { InitReserveDto } from './dto/init-reserve.dto';

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

  @Post('/reserve_seat')
  reserve_seat(@Body() ticketReserveDto: TicketReserveDto) {
    return this.ticketService.reserve_seat(ticketReserveDto);
  }

  @Post('/fix_seat')
  fix_seat(@Body() ticketReserveDto: TicketReserveDto) {
    return this.ticketService.fix_seat(ticketReserveDto);
  }

  @Post('/unset_seat')
  unset_seat(@Body() ticketReserveDto: TicketReserveDto) {
    return this.ticketService.unset_seat(ticketReserveDto);
  }

  @Post('/unset_reserve')
  unset_reserve(@Body() unsetReserveDto: UnsetReserveDto) {
    return this.ticketService.unset_reserve(unsetReserveDto);
  }

  @Post('/get_test')
  get_test() {
    return this.ticketService.get_test();
  }

  @Post('/reserve_seat_hash')
  reserve_seat_hash(@Body() ticketReserveDto: TicketReserveDto) {
    return this.ticketService.reserve_seat_hash(ticketReserveDto);
  }

  @Post('/unset_reserve_hash')
  unset_reserve_hash(@Body() ticketReserveDto: TicketReserveDto) {
    return this.ticketService.unset_reserve_hash(ticketReserveDto);
  }

  @Post('/reserve_seat_list_hash')
  reserve_seat_list_hash(@Body() ticketReserveListDto: TicketReserveListDto) {
    return this.ticketService.reserve_seat_list_hash(ticketReserveListDto);
  }

  @Post('/fix_reserve_hash')
  fix_reserve_hash(@Body() ticketReserveDto: TicketReserveDto) {
    return this.ticketService.fix_reserve_hash(ticketReserveDto);
  }

  @Post('/reserve_seat_init')
  reserve_seat_init(@Body() initReserveDto: InitReserveDto[]) {
    return this.ticketService.reserve_seat_init(initReserveDto);
  }
}
