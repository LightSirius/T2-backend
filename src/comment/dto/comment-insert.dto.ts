import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentInsertDto {
  @ApiProperty({ description: 'board_id' })
  @IsNumber()
  board_id: number;
  @ApiProperty({ description: 'comment_reply_id' })
  @IsNumber()
  comment_reply_id: number;
  @ApiProperty({ description: 'user_uuid' })
  @IsString()
  user_uuid: string;
  @ApiProperty({ description: 'comment_contents' })
  @IsString()
  comment_contents: string;
}
