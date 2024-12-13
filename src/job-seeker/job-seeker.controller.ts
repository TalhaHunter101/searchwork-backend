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
import { JobSeekerService } from './job-seeker.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

@Controller('job-seeker')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Post(':userId') // Route parameter for userId
  async create(@Param('userId') userId: number, @Body() createJobSeekerDto: CreateJobSeekerDto) {
    try {
      // Pass userId along with the other data to the service
      return await this.jobSeekerService.create(userId, createJobSeekerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.jobSeekerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const jobSeeker = await this.jobSeekerService.findOne(+id);
    if (!jobSeeker) {
      throw new HttpException('JobSeeker not found', HttpStatus.NOT_FOUND);
    }
    return jobSeeker;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobSeekerDto: UpdateJobSeekerDto,
  ) {
    try {
      return await this.jobSeekerService.update(+id, updateJobSeekerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.jobSeekerService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}