import { CreateUserAuthDto } from './create-user-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from '../entities/user.entity';
import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: 'user_name' })
  @IsString()
  user_name: string;
  @ApiProperty({ description: 'user_email' })
  @IsEmail()
  user_email: string;
  @ApiProperty({ description: 'user_born' })
  @IsDate()
  @Type(() => Date)
  user_born: Date;
  @ApiProperty({ description: 'user_gender' })
  @IsEnum(UserGender)
  user_gender: UserGender;
  @ApiProperty({ description: 'create_user_auth_dto' })
  userAuth: CreateUserAuthDto;
}
