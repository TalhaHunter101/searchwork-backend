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
import { Employer } from '../employer/entities/employer.entity';
import { Location } from '../location/entities/location.entity';
import { SortOrder } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { JobPostFilterDto } from './dto/job-post-filter.dto';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private jobPostRepository: Repository<JobPost>,
    @InjectRepository(Employer)
    private employerRepository: Repository<Employer>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createJobPostDto: CreateJobPostDto, user: User) {    
    if (user.role !== 'employer') {
      throw new NotFoundException('User is not an employer');
    }
    const employer = await this.employerRepository.findOne({
      where: { user: { id: user.id } }, // Match the user ID from the request
      relations: ['user'], // Include the related user if needed
    });

    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    // Create a new job post
    const jobPost = new JobPost();
    jobPost.title = createJobPostDto.title;
    jobPost.salary = createJobPostDto.salary;
    jobPost.description = createJobPostDto.description;
    jobPost.requirements = createJobPostDto.requirements;
    jobPost.type = createJobPostDto.type;
    jobPost.availability = createJobPostDto.availability;
    jobPost.experienceLevel = createJobPostDto.experienceLevel;
    jobPost.duration = createJobPostDto.duration;
    jobPost.employerId = employer.id;

    if (createJobPostDto.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: createJobPostDto.locationId },
      });
      if (!location) {
        throw new NotFoundException('Location not found');
      }
      jobPost.locationId = createJobPostDto.locationId;
    }
    return await this.jobPostRepository.save(jobPost);
  }

  async findAll(
    filterDto: JobPostFilterDto,
    user: User,
  ): Promise<PaginatedResponse<JobPost>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      type,
      availability,
      minSalary,
      maxSalary,
      experienceLevel,
      duration,
      status,
      search,
      locationId,
      radius,
    } = filterDto;

    const queryBuilder = this.jobPostRepository
      .createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.employer', 'employer')
      .leftJoinAndSelect('jobPost.location', 'location');

    // Add filters
    if (type) {
      queryBuilder.andWhere('jobPost.type = :type', { type });
    }

    if (availability) {
      queryBuilder.andWhere('jobPost.availability = :availability', {
        availability,
      });
    }

    if (minSalary) {
      queryBuilder.andWhere('jobPost.salary >= :minSalary', { minSalary });
    }

    if (maxSalary) {
      queryBuilder.andWhere('jobPost.salary <= :maxSalary', { maxSalary });
    }

    if (experienceLevel) {
      queryBuilder.andWhere('jobPost.experienceLevel = :experienceLevel', {
        experienceLevel,
      });
    }

    if (duration) {
      queryBuilder.andWhere('jobPost.duration = :duration', { duration });
    }

    if (status) {
      queryBuilder.andWhere('jobPost.status = :status', { status });
    }

    if (locationId) {
      queryBuilder.andWhere('jobPost.location.id = :locationId', {
        locationId,
      });
    }

    if (search) {
      queryBuilder.andWhere('jobPost.title ILIKE :search', { search });
    }

    // Add radius search if radius is provided and user has a location
    if (radius && user.location) {
      // Haversine formula for calculating distance
      queryBuilder
        .addSelect(
          `(
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(location.latitude)) *
            cos(radians(location.longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(location.latitude))
          )
        )`,
          'distance',
        )
        .having('distance <= :radius')
        .setParameters({
          latitude: user.location.latitude,
          longitude: user.location.longitude,
          radius,
        })
        .orderBy('distance', 'ASC');
    }

    const skip = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .orderBy(`jobPost.${sortBy}`, sortOrder)
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
    if (!jobPost) {
      throw new NotFoundException(`Job post with ID ${id} not found`);
    }

    if (
      user.role !== Role.Employer ||
      jobPost.employerId !== user.employerProfile.id
    ) {
      throw new UnauthorizedException('You can only update your own job posts');
    }

    await this.jobPostRepository.update(id, updateJobPostDto);
  }

  async remove(id: number, user: User) {
    const jobPost = await this.findOne(id);
    if (!jobPost) {
      throw new NotFoundException(`Job post with ID ${id} not found`);
    }

    if (
      user.role !== Role.Employer ||
      jobPost.employer.id !== user.employerProfile.id
    ) {
      throw new UnauthorizedException('You can only delete your own job posts');
    }

    await this.jobPostRepository.remove(jobPost);
    return { message: 'Job post deleted successfully' };
  }
}
