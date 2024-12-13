import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { JobPostResponseDto } from './dto/job-post-response.dto';
import { JobPostFilterDto } from './dto/job-post-filter.dto';

@ApiTags('job-posts')
@ApiBearerAuth('JWT-auth')
@Controller('job-posts')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Create a new job post' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Job post created successfully',
    type: JobPostResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid token or missing authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - User is not an employer',
  })
  create(
    @Body(ValidationPipe) createJobPostDto: CreateJobPostDto,
    @GetUser() user: User,
  ) {
    return this.jobPostService.create(createJobPostDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all job posts with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated job posts',
    type: JobPostResponseDto,
  })
  findAll(
    @Query(ValidationPipe) filterDto: JobPostFilterDto,
    @GetUser() user: User,
  ) {
    return this.jobPostService.findAll(filterDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job post by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the job post',
    type: JobPostResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Job post not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobPostService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Update a job post (Employer only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Job post updated successfully',
    type: JobPostResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid token or missing authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - User is not the owner of this job post',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateJobPostDto: UpdateJobPostDto,
    @GetUser() user: User,
  ) {
    return this.jobPostService.update(id, updateJobPostDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Delete a job post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Job post deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid token or missing authentication',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - User is not the owner of this job post',
  })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.jobPostService.remove(id, user);
  }
}
