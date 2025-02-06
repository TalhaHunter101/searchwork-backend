import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserProfile } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { SortOrder } from '../common/dto/pagination.dto';
import { Role } from '../utils/constants/constants';
import { UpdateEmployerDto } from '../employer/dto/update-employer.dto';
import { UpdateJobSeekerDto } from '../job-seeker/dto/update-job-seeker.dto';
import { Employer } from '../employer/entities/employer.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async findAll(filterDto: UserFilterDto): Promise<PaginatedResponse<User>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      role,
      gender,
      isEmailVerified,
      search,
    } = filterDto;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.jobSeekerProfile', 'jobSeeker')
      .leftJoinAndSelect('user.employerProfile', 'employer');

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (gender) {
      queryBuilder.andWhere('user.gender = :gender', { gender });
    }

    if (isEmailVerified !== undefined) {
      queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(user.fullName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;

    const [items, total] = await queryBuilder
      .orderBy(`user.${sortBy}`, sortOrder)
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

  async findOne(id: number, currentUser: User): Promise<User> {
    // Users can view their own profile or admin can view any profile
    if (currentUser.id !== id && currentUser.role !== Role.Admin) {
      throw new UnauthorizedException('You can only view your own profile');
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['jobSeekerProfile', 'employerProfile', 'userPreferences'],
    });

    console.log(user, 'user-----------', id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['jobSeekerProfile', 'employerProfile'],
    });
  }

  async updateProfile(
    user: User,
    updateProfileDto: UpdateUserProfile & Partial<UpdateEmployerDto> & Partial<UpdateJobSeekerDto>,
  ): Promise<User | Employer | JobSeeker> {
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['jobSeekerProfile', 'employerProfile'],
    });
  
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
  
    // Update general user fields if provided
    const userFields = ['email', 'fullName', 'address', 'profilePicture'];
    let isUserUpdated = false;
    for (const field of userFields) {
      if (field in updateProfileDto) {
        (existingUser as any)[field] = updateProfileDto[field];
        isUserUpdated = true;
      }
    }
  
    if (updateProfileDto.email && updateProfileDto.email !== existingUser.email) {
      const emailExists = await this.findOneByEmail(updateProfileDto.email);
      if (emailExists) throw new ConflictException('Email already exists');
    }
  
    if (isUserUpdated) {
      await this.userRepository.save(existingUser);
    }
  
    // Update employer profile if user is an employer
    if (user.role === Role.Employer && existingUser.employerProfile) {
      Object.assign(existingUser.employerProfile, updateProfileDto);
      return await this.employerRepository.save(existingUser.employerProfile);
    }
  
    // Update job seeker profile if user is a job seeker
    if (user.role === Role.Employee && existingUser.jobSeekerProfile) {
      Object.assign(existingUser.jobSeekerProfile, updateProfileDto);
      return await this.jobSeekerRepository.save(existingUser.jobSeekerProfile);
    }
  
    throw new BadRequestException('Invalid update request');
  }
  

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['jobSeekerProfile', 'employerProfile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
