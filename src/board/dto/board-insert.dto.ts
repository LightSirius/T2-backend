import { BoardType } from '../entities/board.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class BoardInsertDto {
  @ApiProperty({ description: 'board_type' })
  @IsEnum(BoardType)
  board_type: BoardType;
  @ApiProperty({ description: 'board_title' })
  @IsString()
  board_title: string;
  @ApiProperty({ description: 'board_contents' })
  @IsString()
  board_contents: string;
}
