import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserProfile } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: 'A successful hit can update user object',
    summary: 'Update User Profile',
  })
  @ApiResponse({
    status: 201,
    description: ' Successfully Updated User Profile.',
    type: User,
  })
  @Patch('/update-profile')
  async updateUserProfile(@Body() body: UpdateUserProfile): Promise<User> {
    try {
      const user = await this.userService.findOneByEmail(body.email);
      if (user) {
        return this.userService.create(body);
      }
      return user;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiOperation({
    description: 'A successful hit can return All users',
    summary: 'Get All Users',
  })
  @ApiResponse({
    status: 201,
    description: ' Users data successfully fetched.',
    type: User,
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserProfile) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
