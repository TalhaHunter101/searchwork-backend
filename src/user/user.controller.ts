import {
  Controller,
  Get,
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
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserProfile } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../utils/constants/constants';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { EmployerService } from '../employer/employer.service';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { UpdateEmployerDto } from '../employer/dto/update-employer.dto';
import { UpdateJobSeekerDto } from '../job-seeker/dto/update-job-seeker.dto';
import { Employer } from '../employer/entities/employer.entity';
import { JobSeeker } from '../job-seeker/entities/job-seeker.entity';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
  private readonly employerService: EmployerService,
  private readonly jobSeekerService: JobSeekerService,
  ){}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users with pagination and filters (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated users',
    type: UserResponseDto,
  })
  findAll(@Query(ValidationPipe) filterDto: UserFilterDto) {
    return this.userService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the user profile',
    type: UserResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    // console.log(user, 'user', id);
    return this.userService.findOne(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update user profile (Employer or Job Seeker)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiBody({
    description: 'Update user profile based on role',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(UpdateUserProfile) },
        { $ref: getSchemaPath(UpdateEmployerDto) },
        { $ref: getSchemaPath(UpdateJobSeekerDto) },
      ],
    },
  })
  async updateProfile(
    @Body(ValidationPipe) updateProfileDto: UpdateUserProfile & Partial<UpdateEmployerDto> & Partial<UpdateJobSeekerDto>,
    @GetUser() user: User,
  ): Promise<User | Employer | JobSeeker> {
    return this.userService.updateProfile(user, updateProfileDto);
  }
  

}
