import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user-auth.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { encodePassword } from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private authRepository: Repository<UserAuth>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.userAuth.auth_password = await encodePassword(
      createUserDto.userAuth.auth_password,
    );
    const userAuth = new UserAuth({
      ...createUserDto.userAuth,
    });
    const user = new User({
      ...createUserDto,
      userAuth,
    });
    console.log(user);
    await this.entityManager.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(user_uuid: string): Promise<User> {
    return this.userRepository.findOneBy({ user_uuid });
  }

  async findOneWithAuth(user_uuid: string): Promise<User> {
    return this.userRepository.findOne({
      where: { user_uuid },
      relations: { userAuth: true },
    });
  }

  async update(user_uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ user_uuid });
    user.user_name = updateUserDto.user_name
      ? updateUserDto.user_name
      : user.user_name;
    user.user_email = updateUserDto.user_email
      ? updateUserDto.user_email
      : user.user_email;
    user.user_born = updateUserDto.user_born
      ? updateUserDto.user_born
      : user.user_born;
    user.user_gender = updateUserDto.user_gender
      ? updateUserDto.user_gender
      : user.user_gender;
    return await this.entityManager.save(user);
  }

  async remove(user_uuid: string): Promise<DeleteResult> {
    const user = await this.findOneWithAuth(user_uuid);
    return this.authRepository.delete(user.userAuth.uuid);
  }

  async authFindUser(auth_id: string): Promise<User> {
    return this.userRepository.findOne({
      relations: { userAuth: true },
      where: {
        userAuth: {
          auth_id: auth_id,
        },
      },
    });
  }
}
