import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user-auth.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userAuth = new UserAuth({
      ...createUserDto.userAuth,
    });
    const user = new User({
      ...createUserDto,
      userAuth,
    });
    await this.entityManager.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(user_uuid: string) {
    return this.userRepository.findOneBy({ user_uuid });
  }

  async update(user_uuid: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ user_uuid });
    user.user_id = updateUserDto.user_id;
    user.user_email = updateUserDto.user_email;
    await this.entityManager.save(user);
  }

  async remove(user_uuid: string) {
    return this.userRepository.delete(user_uuid);
  }

  async authFindUser(auth_id: string) {
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
