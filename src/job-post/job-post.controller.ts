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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, JobType, JobAvailability } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { JobPost } from './entities/job-post.entity';

@ApiTags('job-posts')
@Controller('job-posts')
@ApiBearerAuth()
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Create a new job post' })
  @ApiResponse({
    status: 201,
    description: 'Job post created successfully',
    type: JobPost,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not an employer' })
  create(
    @Body(ValidationPipe) createJobPostDto: CreateJobPostDto,
    @GetUser() user: User,
  ) {
    return this.jobPostService.create(createJobPostDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job posts' })
  @ApiResponse({
    status: 200,
    description: 'Return all job posts',
    type: [JobPost],
  })
  @ApiQuery({ name: 'type', enum: JobType, required: false })
  @ApiQuery({ name: 'availability', enum: JobAvailability, required: false })
  @ApiQuery({ name: 'minSalary', type: Number, required: false })
  findAll(
    @Query('type') type?: JobType,
    @Query('availability') availability?: JobAvailability,
    @Query('minSalary', ParseIntPipe) minSalary?: number,
  ) {
    return this.jobPostService.findAll({ type, availability, minSalary });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job post by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the job post',
    type: JobPost,
  })
  @ApiResponse({ status: 404, description: 'Job post not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobPostService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Update a job post' })
  @ApiResponse({
    status: 200,
    description: 'Job post updated successfully',
    type: JobPost,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Job post not found' })
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
  @ApiResponse({ status: 200, description: 'Job post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner' })
  @ApiResponse({ status: 404, description: 'Job post not found' })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.jobPostService.remove(id, user);
  }

  @Get('employer/:employerId')
  @ApiOperation({ summary: 'Get all job posts by employer' })
  @ApiResponse({
    status: 200,
    description: 'Return all job posts for an employer',
    type: [JobPost],
  })
  @ApiResponse({ status: 404, description: 'Employer not found' })
  findByEmployer(@Param('employerId', ParseIntPipe) employerId: number) {
    return this.jobPostService.findByEmployer(employerId);
  }
}
