import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { comparePassword } from '../utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(auth_id: string, auth_password: string): Promise<any> {
    const user = await this.userService.authFindUser(auth_id);
    if (
      user &&
      (await comparePassword(auth_password, user.userAuth.auth_password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userAuth, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { uuid: user.user_uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
