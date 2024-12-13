import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSeeker } from './entities/job-seeker.entity';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class JobSeekerService {
  constructor(
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, createJobSeekerDto: CreateJobSeekerDto): Promise<JobSeeker> {
    // Find user by userId passed as a route parameter
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create new JobSeeker using the provided data
    const newJobSeeker = this.jobSeekerRepository.create({
      ...createJobSeekerDto,
      user, // Associate the user with the job seeker
    });

    return await this.jobSeekerRepository.save(newJobSeeker);
  }

  async findAll(): Promise<JobSeeker[]> {
    return await this.jobSeekerRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<JobSeeker> {
    return await this.jobSeekerRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async update(
    id: number,
    updateJobSeekerDto: UpdateJobSeekerDto,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.jobSeekerRepository.findOne({ where: { id } });
    if (!jobSeeker) {
      throw new Error('JobSeeker not found');
    }
    Object.assign(jobSeeker, updateJobSeekerDto);
    return await this.jobSeekerRepository.save(jobSeeker);
  }

  async remove(id: number): Promise<{ message: string }> {
    const jobSeeker = await this.jobSeekerRepository.findOne({ where: { id } });
    if (!jobSeeker) {
      throw new Error('JobSeeker not found');
    }
    await this.jobSeekerRepository.remove(jobSeeker);
    return { message: 'JobSeeker removed successfully' };
  }
}