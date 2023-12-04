import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BoardEsScoreDto {
  @ApiProperty({ description: 'search_string' })
  @IsString()
  search_string: string;
  @ApiProperty({ description: 'search_type' })
  @IsNumber()
  search_type: number;
  @ApiProperty({ description: 'board_type' })
  @IsNumber()
  board_type: number;
  @ApiProperty({ description: 'search_from' })
  @IsNumber()
  search_from: number;
}
