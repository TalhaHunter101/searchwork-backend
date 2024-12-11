import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserJobDto } from './dto/create-user-job.dto';
import { UpdateUserJobDto } from './dto/update-user-job.dto';
import { UserJob } from './entities/user-job.entity';

@Injectable()
export class UserJobsService {
  constructor(
    @InjectRepository(UserJob)
    private userJobRepository: Repository<UserJob>,
  ) {}

  create(createUserJobDto: CreateUserJobDto) {
    return this.userJobRepository.save(createUserJobDto);
  }

  findAll() {
    return this.userJobRepository.find();
  }

  findOne(id: number) {
    return this.userJobRepository.findOneBy({ id });
  }

  update(id: number, updateUserJobDto: UpdateUserJobDto) {
    return this.userJobRepository.update(id, updateUserJobDto);
  }

  remove(id: number) {
    return this.userJobRepository.delete(id);
  }
}
