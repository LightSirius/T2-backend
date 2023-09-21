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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':user_uuid')
  async findOne(@Param('user_uuid') user_uuid: string) {
    return this.userService.findOne(user_uuid);
  }

  @Patch(':user_uuid')
  async update(
    @Param('user_uuid') user_uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user_uuid, updateUserDto);
  }

  @Delete(':user_uuid')
  async remove(@Param('user_uuid') user_uuid: string) {
    return this.userService.remove(user_uuid);
  }
}
