import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDeleteDto {
  @ApiProperty({ description: 'board_id' })
  @IsNumber()
  board_id: number;
  @ApiProperty({ description: 'comment_id' })
  @IsNumber()
  comment_id: number;
}
