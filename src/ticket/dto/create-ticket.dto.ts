import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ description: 'user_uuid' })
  @IsString()
  user_uuid: string;
  @ApiProperty({ description: 'show_id' })
  @IsNumber()
  show_id: number;
  @ApiProperty({ description: 'ticket_area' })
  @IsString()
  ticket_area: string;
  @ApiProperty({ description: 'ticket_seat' })
  @IsNumber()
  ticket_seat: number;
}
