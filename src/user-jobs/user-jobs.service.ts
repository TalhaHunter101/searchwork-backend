import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserJob } from './entities/user-job.entity';
import { CreateUserJobDto } from './dto/create-user-job.dto';
import { UpdateUserJobDto } from './dto/update-user-job.dto';
import { User } from '../user/entities/user.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
import { UserJobFilterDto } from './dto/user-job-filter.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { Role, Status } from '../utils/constants/constants';
import { SortOrder } from '../common/dto/pagination.dto';

@Injectable()
export class UserJobsService {
  constructor(
    @InjectRepository(UserJob)
    private readonly userJobRepository: Repository<UserJob>,
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
  ) {}

  async create(
    createUserJobDto: CreateUserJobDto,
    user: User,
  ): Promise<UserJob> {
    // Verify user has a job seeker profile
    if (!user.jobSeekerProfile) {
      throw new BadRequestException(
        'You must create a job seeker profile before applying to jobs',
      );
    }

    const jobPost = await this.jobPostRepository.findOne({
      where: { id: createUserJobDto.jobPostId },
      relations: ['employer'],
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    // Check if user has already applied
    const existingApplication = await this.userJobRepository.findOne({
      where: {
        jobPost: { id: createUserJobDto.jobPostId },
        user: { id: user.id },
      },
    });

    if (existingApplication) {
      throw new UnauthorizedException('You have already applied for this job');
    }

    const userJob = this.userJobRepository.create({
      jobPost,
      user,
      status: Status.Applied, //default
      appliedAt: new Date(),
    });

    return await this.userJobRepository.save(userJob);
  }

  async findAll(
    filterDto: UserJobFilterDto,
    user: User,
  ): Promise<PaginatedResponse<UserJob>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      status,
      jobPostId,
      appliedAfter,
      appliedBefore,
    } = filterDto;

    const queryBuilder = this.userJobRepository
      .createQueryBuilder('userJob')
      .leftJoinAndSelect('userJob.jobPost', 'jobPost')
      .leftJoinAndSelect('userJob.user', 'user')
      .leftJoinAndSelect('jobPost.employer', 'employer');

    // If employee, show only their applications
    if (user.role === Role.Employee) {
      queryBuilder.andWhere('userJob.user.id = :userId', { userId: user.id });
    }
    // If employer, show only applications for their job posts
    else if (user.role === Role.Employer) {
      queryBuilder.andWhere('employer.user.id = :userId', { userId: user.id });
    }

    if (status) {
      queryBuilder.andWhere('userJob.status = :status', { status });
    }

    if (jobPostId) {
      queryBuilder.andWhere('jobPost.id = :jobPostId', { jobPostId });
    }

    if (appliedAfter) {
      queryBuilder.andWhere('userJob.appliedAt >= :appliedAfter', {
        appliedAfter,
      });
    }

    if (appliedBefore) {
      queryBuilder.andWhere('userJob.appliedAt <= :appliedBefore', {
        appliedBefore,
      });
    }

    const skip = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .orderBy(`userJob.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, user: User): Promise<UserJob> {
    const userJob = await this.userJobRepository.findOne({
      where: { id },
      relations: [
        'jobPost',
        'user',
        'user.jobSeekerProfile',
        'jobPost.employer',
      ],
    });

    if (!userJob) {
      throw new NotFoundException('Job application not found');
    }

    // Verify the user has a job seeker profile
    if (!userJob.user.jobSeekerProfile) {
      throw new BadRequestException('User does not have a job seeker profile');
    }

    // Check permissions
    if (
      (user.role === Role.Employee && userJob.user.id !== user.id) ||
      (user.role === Role.Employer &&
        userJob.jobPost.employer.user.id !== user.id)
    ) {
      throw new UnauthorizedException(
        'You do not have permission to view this application',
      );
    }

    return userJob;
  }

  async update(
    id: number,
    updateUserJobDto: UpdateUserJobDto,
    user: User,
  ): Promise<UserJob> {
    const userJob = await this.findOne(id, user);

    // Only employer who owns the job post can update status
    if (userJob.jobPost.employer.user.id !== user.id) {
      throw new UnauthorizedException(
        'You can only update applications for your own job posts',
      );
    }

    Object.assign(userJob, updateUserJobDto);
    return await this.userJobRepository.save(userJob);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const userJob = await this.findOne(id, user);

    // Only the applicant can withdraw their application
    if (userJob.user.id !== user.id) {
      throw new UnauthorizedException(
        'You can only withdraw your own applications',
      );
    }

    await this.userJobRepository.remove(userJob);
    return { message: 'Application withdrawn successfully' };
  }

  async findByJobPost(jobPostId: number, user: User): Promise<UserJob[]> {
    const jobPost = await this.jobPostRepository.findOne({
      where: { id: jobPostId },
      relations: ['employer'],
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    // Only the employer who owns the job post can view all applications
    if (jobPost.employer.user.id !== user.id) {
      throw new UnauthorizedException(
        'You can only view applications for your own job posts',
      );
    }

    return this.userJobRepository.find({
      where: { jobPost: { id: jobPostId } },
      relations: ['user', 'jobPost'],
    });
  }
}
