import { CreateUserAuthDto } from './create-user-auth.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'user_id' })
  user_id: string;
  @ApiProperty({ description: 'user_email' })
  user_email: string;
  @ApiProperty({ description: 'create_user_auth_dto' })
  userAuth: CreateUserAuthDto;
}
