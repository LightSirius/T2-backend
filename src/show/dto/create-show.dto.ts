import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowDto {
  @ApiProperty({ description: 'show_name' })
  @IsString()
  show_name: string;
  @ApiProperty({ description: 'show_details' })
  @IsString()
  show_details: string;
  @ApiProperty({ description: 'show_description' })
  @IsString()
  show_description: string;
  @ApiProperty({ description: 'show_start_date' })
  @IsDate()
  @Type(() => Date)
  show_start_date: Date;
  @ApiProperty({ description: 'alter_user' })
  @IsString()
  alter_user: string;
}
