import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UserRegistrationDto } from './dto/user-registration.dto';

@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':user_uuid')
  async findOne(@Param('user_uuid') user_uuid: string): Promise<User> {
    return this.userService.findOne(user_uuid);
  }

  @Patch(':user_uuid')
  async update(
    @Param('user_uuid') user_uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(user_uuid, updateUserDto);
  }

  @Delete(':user_uuid')
  async remove(@Param('user_uuid') user_uuid: string): Promise<DeleteResult> {
    return this.userService.remove(user_uuid);
  }

  @Post('validate/id')
  async user_validate_id_duplicate(
    @Body('auth_id') auth_id: string,
  ): Promise<boolean> {
    return await this.userService.user_validate_id_duplicate(auth_id);
  }

  @Post('registration')
  async user_registration(@Body() userRegistrationDto: UserRegistrationDto) {
    return this.userService.user_registration(userRegistrationDto);
  }
}
