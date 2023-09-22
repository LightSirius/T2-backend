import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(auth_id: string, auth_password: string): Promise<any> {
    const user = await this.userService.authFindUser(auth_id);
    if (user && user.userAuth.auth_password === auth_password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userAuth, ...result } = user;
      return result;
    }
    return null;
  }
}
