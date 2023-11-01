import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UserModifyPasswordDto {
  @ApiProperty({ description: 'auth_password' })
  @IsString()
  // 숫자 1개 이상 포함, 문자열 1개 이상 포함, 특수문자 1개 이상 포함,8~20글자허용
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/)
  auth_password: string;
}
