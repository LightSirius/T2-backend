import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserAuthDto {
  @ApiProperty({ description: 'auth_id' })
  @IsString()
  auth_id: string;
  @ApiProperty({ description: 'auth_password' })
  @IsString()
  auth_password: string;
}
