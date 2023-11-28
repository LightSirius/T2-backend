import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BoardSearchDto {
  @ApiProperty({ description: 'search_string' })
  @IsString()
  search_string: string;
  @ApiProperty({ description: 'board_type' })
  @IsNumber()
  board_type: number;
  @ApiProperty({ description: 'page' })
  @IsNumber()
  page: number;
}
