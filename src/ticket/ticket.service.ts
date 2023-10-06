import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { EntityManager, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketService {
  constructor(
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
}
