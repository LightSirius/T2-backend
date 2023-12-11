import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BoardEsSearchDto {
  @ApiProperty({ description: 'search_string' })
  @IsString()
  search_string: string;
  @ApiProperty({ description: 'search_from' })
  @IsNumber()
  search_from: number;
  @ApiProperty({
    description:
      'search_type<br>1: board title<br>2: board contents<br>3: user name',
  })
  @IsNumber()
  search_type: number;
  @ApiProperty({ description: 'sort_type<br>0: score<br>1: newest' })
  @IsNumber()
  sort_type: number;
  @ApiProperty({ description: 'board_type' })
  @IsNumber()
  board_type: number;
}
