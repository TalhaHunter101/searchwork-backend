// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { UserJobsService } from './user-jobs.service';
// import { CreateUserJobDto } from './dto/create-user-job.dto';
// import { UpdateUserJobDto } from './dto/update-user-job.dto';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('user-jobs')
// @Controller('user-jobs')
// export class UserJobsController {
//   constructor(private readonly userJobsService: UserJobsService) {}

//   @Post()
// async applyToJob(@Body() createUserJobDto: CreateUserJobDto) {
//   return this.userJobsService.applyToJob(createUserJobDto);
// }

// @Get()
// async getAllApplications(@Body() getApplicationsDto: { userId: number }) {
//   return this.userJobsService.findByUser(getApplicationsDto.userId);
// }


// @Get(':id')
// async getApplicationDetails(@Param('id') id: number) {
//   return this.userJobsService.findOne(id);
// }

// @Delete(':id')
// async withdrawApplication(@Param('id') id: number) {
//   return this.userJobsService.remove(id);
// }

// @Get(':id/applications')
// async getAllApplicationsForJobPost(@Param('id') jobPostId: number) {
//   return this.userJobsService.findByJobPost(jobPostId);
// }

// @Patch(':id')
// async updateApplicationStatus(@Param('id') id: number, @Body() updateUserJobDto: UpdateUserJobDto) {
//   return this.userJobsService.updateStatus(id, updateUserJobDto);
// }
// }




import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserJobsService } from './user-jobs.service';
import { CreateUserJobDto } from './dto/create-user-job.dto';
import { UpdateUserJobDto } from './dto/update-user-job.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Status } from '../utils/constants/constants';

@ApiTags('user-jobs')
@Controller('user-jobs')
export class UserJobsController {
  constructor(private readonly userJobsService: UserJobsService) {}

  // Apply to a job (Create job application)
  @Post()
  @ApiOperation({ summary: 'Apply to a job post' })
  @ApiBody({ type: CreateUserJobDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully applied to the job',
  })
  @ApiResponse({
    status: 400,
    description: 'User has already applied for this job',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async applyToJob(@Body() createUserJobDto: CreateUserJobDto) {
    try {
      return await this.userJobsService.applyToJob(createUserJobDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error applying for the job',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get all applications for a user (job seeker)
  @Get()
  @ApiOperation({ summary: 'Get all job applications for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all applications',
  })
  @ApiResponse({
    status: 404,
    description: 'No applications found for the user',
  })
  async getAllApplications(@Body() getApplicationsDto: { userId: number }) {
    try {
      return await this.userJobsService.findByUser(getApplicationsDto.userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching applications for the user',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Get details of a specific job application
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific job application' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched job application details',
  })
  @ApiResponse({
    status: 404,
    description: 'Job application not found',
  })
  async getApplicationDetails(@Param('id') id: number) {
    try {
      return await this.userJobsService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching job application details',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Withdraw/Remove a job application
  @Delete(':id')
  @ApiOperation({ summary: 'Withdraw a job application' })
  @ApiResponse({
    status: 200,
    description: 'Successfully withdrew job application',
  })
  @ApiResponse({
    status: 404,
    description: 'Job application not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async withdrawApplication(@Param('id') id: number) {
    try {
      return await this.userJobsService.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error withdrawing job application',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Get all applications for a specific job post (for the employer)
  @Get(':id/applications')
  @ApiOperation({ summary: 'Get all job applications for a specific job post' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all applications for the job post',
  })
  @ApiResponse({
    status: 404,
    description: 'No applications found for the job post',
  })
  async getAllApplicationsForJobPost(@Param('id') jobPostId: number) {
    try {
      return await this.userJobsService.findByJobPost(jobPostId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching applications for the job post',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Update the status of a job application (e.g., Shortlist, Reject)
  @Patch(':id')
  @ApiOperation({ summary: 'Update the status of a job application' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated application status',
  })
  @ApiResponse({
    status: 404,
    description: 'Job application not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status provided',
  })
  async updateApplicationStatus(@Param('id') id: number, @Body() updateUserJobDto: UpdateUserJobDto) {
    try {
      return await this.userJobsService.updateStatus(id, updateUserJobDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating application status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
