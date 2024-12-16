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
  ValidationPipe,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserJobsService } from './user-jobs.service';
import { CreateUserJobDto } from './dto/create-user-job.dto';
import { UpdateUserJobDto } from './dto/update-user-job.dto';
import { UserJobFilterDto } from './dto/user-job-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { UserJobResponseDto } from './dto/user-job-response.dto';

@ApiTags('user-jobs')
@ApiBearerAuth('JWT-auth')
@Controller('user-jobs')
export class UserJobsController {
  constructor(private readonly userJobsService: UserJobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Application submitted successfully',
    type: UserJobResponseDto,
  })
  create(
    @Body(ValidationPipe) createUserJobDto: CreateUserJobDto,
    @GetUser() user: User,
  ) {
    return this.userJobsService.create(createUserJobDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Employer)
  @ApiOperation({
    summary: 'Get all job applications with pagination and filters',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated job applications',
    type: UserJobResponseDto,
  })
  findAll(
    @Query(ValidationPipe) filterDto: UserJobFilterDto,
    @GetUser() user: User,
  ) {
    return this.userJobsService.findAll(filterDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get job application by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the job application',
    type: UserJobResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userJobsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({ summary: 'Update job application status (Employer only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application status updated successfully',
    type: UserJobResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserJobDto: UpdateUserJobDto,
    @GetUser() user: User,
  ) {
    return this.userJobsService.update(id, updateUserJobDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Withdraw job application' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application withdrawn successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userJobsService.remove(id, user);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employer)
  @ApiOperation({
    summary: 'Get all applications for a specific job post (Employer only)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all applications for the job post',
    type: [UserJobResponseDto],
  })
  findByJobPost(
    @Param('jobId', ParseIntPipe) jobId: number,
    @GetUser() user: User,
  ) {
    return this.userJobsService.findByJobPost(jobId, user);
  }
}
