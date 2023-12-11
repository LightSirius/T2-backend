import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BoardEsSearchDto {
  @ApiProperty({ description: 'search_string' })
  @IsString()
  search_string: string;
  @ApiProperty({ description: 'sort_type' })
  @IsNumber()
  sort_type: number;
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
