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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JobSeekerService } from './job-seeker.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { JobSeekerFilterDto } from './dto/job-seeker-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('job-seekers')
@ApiBearerAuth('JWT-auth')
@Controller('job-seekers')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Employee)
  @ApiOperation({ summary: 'Create a job seeker profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile created successfully',
  })
  create(
    @Body(ValidationPipe) createJobSeekerDto: CreateJobSeekerDto,
    @GetUser() user: User,
  ) {
    return this.jobSeekerService.create(user.id, createJobSeekerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job seekers with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated job seekers',
  })
  findAll(@Query(ValidationPipe) filterDto: JobSeekerFilterDto) {
    return this.jobSeekerService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job seeker by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the job seeker profile',
  })
  findOne(@Param('id') id: string) {
    return this.jobSeekerService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update job seeker profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateJobSeekerDto: UpdateJobSeekerDto,
    @GetUser() user: User,
  ) {
    return this.jobSeekerService.update(+id, updateJobSeekerDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete job seeker profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile deleted successfully',
  })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.jobSeekerService.remove(+id, user);
  }
}
