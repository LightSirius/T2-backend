import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class UserModifyInfoDto {
  @ApiProperty({ description: 'user_email' })
  @IsEmail()
  user_email: string;
  @ApiProperty({ description: 'user_born' })
  @IsDate()
  @Type(() => Date)
  user_born: Date;
}
