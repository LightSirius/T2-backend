import { CreateUserAuthDto } from './create-user-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'user_name' })
  user_name: string;
  @ApiProperty({ description: 'user_email' })
  user_email: string;
  @ApiProperty({ description: 'user_born' })
  user_born: Date;
  @ApiProperty({ description: 'user_gender' })
  user_gender: UserGender;
  @ApiProperty({ description: 'create_user_auth_dto' })
  userAuth: CreateUserAuthDto;
}
