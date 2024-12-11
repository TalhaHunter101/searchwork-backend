import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPost } from './entities/job-post.entity';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { User } from '../user/entities/user.entity';
import { Role } from '../utils/constants/constants';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
  ) {}

  async create(createJobPostDto: CreateJobPostDto, user: User) {
    if (user.role !== Role.Employer) {
      throw new UnauthorizedException('Only employers can create job posts');
    }

    const jobPost = this.jobPostRepository.create({
      ...createJobPostDto,
      employer: { id: user.employerProfile.id },
    });

    return this.jobPostRepository.save(jobPost);
  }

  async findAll(query: any = {}) {
    const queryBuilder = this.jobPostRepository
      .createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.employer', 'employer')
      .leftJoinAndSelect('jobPost.location', 'location');

    if (query.type) {
      queryBuilder.andWhere('jobPost.type = :type', { type: query.type });
    }

    if (query.availability) {
      queryBuilder.andWhere('jobPost.availability = :availability', {
        availability: query.availability,
      });
    }

    if (query.minSalary) {
      queryBuilder.andWhere('jobPost.salary >= :minSalary', {
        minSalary: query.minSalary,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id },
      relations: ['employer', 'location', 'userJobs'],
    });

    if (!jobPost) {
      throw new NotFoundException(`Job post with ID ${id} not found`);
    }

    return jobPost;
  }

  async update(id: number, updateJobPostDto: UpdateJobPostDto, user: User) {
    const jobPost = await this.findOne(id);

    if (
      user.role !== Role.Employer ||
      jobPost.employer.id !== user.employerProfile.id
    ) {
      throw new UnauthorizedException('You can only update your own job posts');
    }

    await this.jobPostRepository.update(id, updateJobPostDto);
    return this.findOne(id);
  }

  async remove(id: number, user: User) {
    const jobPost = await this.findOne(id);

    if (
      user.role !== Role.Employer ||
      jobPost.employer.id !== user.employerProfile.id
    ) {
      throw new UnauthorizedException('You can only delete your own job posts');
    }

    await this.jobPostRepository.remove(jobPost);
    return { message: 'Job post deleted successfully' };
  }

  async findByEmployer(employerId: number) {
    return this.jobPostRepository.find({
      where: { employer: { id: employerId } },
      relations: ['location'],
    });
  }
}
