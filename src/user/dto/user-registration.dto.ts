import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from '../entities/user.entity';
import { IsDate, IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class UserRegistrationDto {
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
  // @ApiProperty({ description: 'create_user_auth_dto' })
  // userAuth: CreateUserAuthDto;

  @ApiProperty({ description: 'auth_id' })
  @IsString()
  auth_id: string;
  @ApiProperty({ description: 'auth_password' })
  @IsString()
  // 숫자 1개 이상 포함, 문자열 1개 이상 포함, 특수문자 1개 이상 포함,8~20글자허용
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/)
  auth_password: string;
}
