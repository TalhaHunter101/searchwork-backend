import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserJobDto } from './dto/create-user-job.dto';
import { UpdateUserJobDto } from './dto/update-user-job.dto';
import { UserJob } from './entities/user-job.entity';
import { Status } from '../utils/constants/constants';

@Injectable()
export class UserJobsService {
  constructor(
    @InjectRepository(UserJob)
    private userJobRepository: Repository<UserJob>,
  ) {}


async applyToJob(createUserJobDto: CreateUserJobDto) {
  // Check if the user has already applied for this job
  const existingApplication = await this.userJobRepository.findOne({
    where: {
      jobPost: { id: createUserJobDto.jobPostId },
      user: { id: createUserJobDto.userId },
    },
  });

  if (existingApplication) {
    throw new Error('User has already applied for this job');
  }

  const userJob = this.userJobRepository.create({
    ...createUserJobDto,
    status: Status.Applied,
    appliedAt: new Date(),
  });

  return await this.userJobRepository.save(userJob);
}


async findByUser(userId: number) {
  return await this.userJobRepository.find({
    where: { user: { id: userId } },
    relations: ['jobPost'],  // Include job post details
  });
}



  async findOne(id: number) {
    return this.userJobRepository.findOne({
      where: { id },
      relations: ['jobPost', 'user'], // Include job and user details
    });
  }
  
  async updateStatus(id: number, updateUserJobDto: UpdateUserJobDto) {
    const application = await this.userJobRepository.findOneBy({ id });
  
    if (!application) {
      throw new Error('Application not found');
    }
  
    application.status = updateUserJobDto.status; // e.g., "Shortlisted" or "Rejected"
    return this.userJobRepository.save(application);
  }
  

  update(id: number, updateUserJobDto: UpdateUserJobDto) {
    return this.userJobRepository.update(id, updateUserJobDto);
  }

  async remove(id: number) {
    return await this.userJobRepository.delete(id);
  }

  async findByJobPost(jobPostId: number) {
    return await this.userJobRepository.find({
      where: { jobPost: { id: jobPostId } },
      relations: ['user'], // Include user details
    });
  }
  
  
}
