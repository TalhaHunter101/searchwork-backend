import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserProfile } from './dto/update-user.dto';

@Injectable()
export class UserService {
  @InjectRepository(User) private userRepository: Repository<User>

  async create(body: UpdateUserProfile): Promise<User> {
    const user= await this.userRepository.save(this.userRepository.create(body)).catch((err: any) => {
      throw new HttpException(
        {
          message: `${err}`,
        },
        HttpStatus.CONFLICT,
      );
    });
    return user;
  }

  findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (e) {
      throw new HttpException(e.message, e.statusCode);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserProfile) {
    const user= await this.userRepository.save(this.userRepository.create(updateUserDto)).catch((err: any) => {
      throw new HttpException(
        {
          message: `${err}`,
        },
        HttpStatus.CONFLICT,
      );
    });
    return user;  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    })

    if (user) {
      return user;
    }

    return null;
  }
}
