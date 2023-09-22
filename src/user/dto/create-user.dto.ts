import { CreateUserAuthDto } from './create-user-auth.dto';

export class CreateUserDto {
  user_id: string;
  user_email: string;
  userAuth: CreateUserAuthDto;
}
