import { Inject, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { EntityManager, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisClientType } from 'redis';
import { TicketReserveDto } from './dto/ticket-reserve.dto';
import { UnsetReserveDto } from './dto/unset-reserve.dto';
import { TicketReserveListDto } from './dto/ticket-reserve-list.dto';
import { InitReserveDto } from './dto/init-reserve.dto';

@Injectable()
export class TicketService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: RedisClientType,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createTicketDto: CreateTicketDto) {
    const ticket = new Ticket(createTicketDto);
    await this.entityManager.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  findOne(ticket_id: number): Promise<Ticket> {
    return this.ticketRepository.findOneBy({ ticket_id });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.findOne(id);
    return await this.ticketRepository.save({ ...ticket, ...updateTicketDto });
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }

  async reserve_seat(ticketReserveDto: TicketReserveDto) {
    const ticket_reserve_key_payload = `ticket_reserve:${ticketReserveDto.user_uuid}`;
    const show_reserve_key_payload = `show_reserve:${ticketReserveDto.show_id}-${ticketReserveDto.ticket_area}-${ticketReserveDto.ticket_seat}`;

    if (
      await this.redis.set(
        show_reserve_key_payload,
        ticketReserveDto.user_uuid,
        {
          EX: 180,
          NX: true,
        },
      )
    ) {
      if (
        await this.redis.set(
          ticket_reserve_key_payload,
          `show-${ticketReserveDto.show_id}-${ticketReserveDto.ticket_area}-${ticketReserveDto.ticket_seat}`,
          {
            EX: 180,
            NX: true,
          },
        )
      ) {
        if (await this.redis.get(ticket_reserve_key_payload)) {
          // console.log(show_reserve_key_payload);
          return show_reserve_key_payload;
        }
        // return await this.redis.get(ticket_reserve_key_payload);
      } else {
        return 2;
      }
    } else {
      return 1;
    }
  }

  async fix_seat(ticketReserveDto: TicketReserveDto) {
    const show_reserve_key_payload = `show_reserve:${ticketReserveDto.show_id}-${ticketReserveDto.ticket_area}-${ticketReserveDto.ticket_seat}`;
    if (
      await this.redis.set(show_reserve_key_payload, ticketReserveDto.user_uuid)
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  async unset_seat(ticketReserveDto: TicketReserveDto) {
    const show_reserve_key_payload = `show_reserve:${ticketReserveDto.show_id}-${ticketReserveDto.ticket_area}-${ticketReserveDto.ticket_seat}`;
    if (await this.redis.del(show_reserve_key_payload)) {
      return 1;
    } else {
      return 0;
    }
  }

  async unset_reserve(unsetReserveDto: UnsetReserveDto) {
    const ticket_reserve_key_payload = `ticket_reserve:${unsetReserveDto.user_uuid}`;
    if (await this.redis.del(ticket_reserve_key_payload)) {
      return 1;
    } else {
      return 0;
    }
  }

  redis_test_get(key: string) {
    return this.redis.get(key);
  }

  redis_test_set(key: string, val: any) {
    return this.redis.set(key, val);
  }

  async get_test() {
    const A = [];
    for await (const key of this.redis.scanIterator({
      MATCH: 'show_reserve:1-*',
      COUNT: 500,
    })) {
      A.push(key);
    }
    return A;
  }

  // # Strings to Hash
  async reserve_seat_hash(ticketReserveDto: TicketReserveDto) {
    const show_reserve_key_payload = `show_reserve:${ticketReserveDto.show_id}`;
    const ticket_reserve_key_payload = `ticket_reserve:${ticketReserveDto.user_uuid}`;
    const reserve_seat_val_payload = `${ticketReserveDto.ticket_area}-${ticketReserveDto.ticket_seat}`;

    const ticket_reserve_time = Number(
      await this.redis.hGet(show_reserve_key_payload, reserve_seat_val_payload),
    );

    if (ticket_reserve_time < Date.now()) {
      if (
        await this.redis.set(
          ticket_reserve_key_payload,
          ticketReserveDto.user_uuid,
          {
            EX: 180,
            NX: true,
          },
        )
      ) {
        await this.redis.hSet(
          show_reserve_key_payload,
          reserve_seat_val_payload,
          Date.now() + 180000,
        );
        console.log(reserve_seat_val_payload);
        return reserve_seat_val_payload;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  }

  async reserve_seat_list_hash(ticketReserveListDto: TicketReserveListDto) {
    return await this.redis.hGetAll(
      `show_reserve:${ticketReserveListDto.show_id}`,
    );
  }

  async fix_reserve_hash(ticketReserveDto: TicketReserveDto) {
    const show_reserve_key_payload = `show_reserve:${ticketReserveDto.show_id}`;
    const reserve_seat_val_payload = `${ticketReserveDto.ticket_area}-${ticketReserveDto.ticket_seat}`;
    if (
      await this.redis.hSet(
        show_reserve_key_payload,
        reserve_seat_val_payload,
        9000000000000,
      )
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  async unset_reserve_hash(unsetReserveDto: UnsetReserveDto) {
    const ticket_reserve_key_payload = `ticket_reserve:${unsetReserveDto.user_uuid}`;
    if (await this.redis.del(ticket_reserve_key_payload)) {
      return 1;
    } else {
      return 0;
    }
  }

  async reserve_seat_init(initReserveDtoArray: InitReserveDto[]) {
    for (const initReserveDto of initReserveDtoArray) {
      for (let i = 1; i <= initReserveDto.seat_count; i++) {
        this.redis.hSet(
          `show_reserve:${initReserveDto.show_id}`,
          `${initReserveDto.area_id}-${i}`,
          Date.now() + 180000,
        );
      }
    }
  }
}
