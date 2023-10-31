import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user-auth.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { encodePassword } from '../utils/bcrypt';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserModifyPasswordDto } from './dto/user-modify-password.dto';
import { UserModifyInfoDto } from './dto/user-modify-info.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private authRepository: Repository<UserAuth>,
    private readonly entityManager: EntityManager,
    private readonly connection: Connection,
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.userAuth.auth_password = await encodePassword(
      createUserDto.userAuth.auth_password,
    );

    const queryRunner = await this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const userAuth = new UserAuth({
        // auth_id: createUserDto.userAuth.auth_id,
        // auth_password: createUserDto.userAuth.auth_password,
        ...createUserDto.userAuth,
      });

      const user = new User({
        ...createUserDto,
        userAuth,
      });
      if (await this.user_validate_id_duplicate(user.userAuth.auth_id)) {
        if (await this.entityManager.save(user)) {
          return user.user_uuid;
        }
      } else {
        return 0;
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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

  async user_validate_id_duplicate(auth_id: string): Promise<boolean> {
    const user = await this.authFindUser(auth_id);
    return !user;
  }

  async user_registration(userRegistrationDto: UserRegistrationDto) {
    return await this.create({
      userAuth: {
        auth_id: userRegistrationDto.auth_id,
        auth_password: userRegistrationDto.auth_password,
      },
      ...userRegistrationDto,
    });
  }

  async user_modify_info(
    userModifyInfoDto: UserModifyInfoDto,
    guard: { uuid: string },
  ) {
    const user = await this.userRepository.findOneBy({ user_uuid: guard.uuid });
    user.user_email = userModifyInfoDto.user_email
      ? userModifyInfoDto.user_email
      : user.user_email;
    user.user_born = userModifyInfoDto.user_born
      ? userModifyInfoDto.user_born
      : user.user_born;

    return await this.entityManager.save(user);
  }

  async user_modify_password(
    userModifyPasswordDto: UserModifyPasswordDto,
    guard: { uuid: string },
  ) {
    const user = await this.findOneWithAuth(guard.uuid);

    user.userAuth.auth_password = await encodePassword(
      userModifyPasswordDto.auth_password,
    );

    return await this.entityManager.save(user);
  }
}
