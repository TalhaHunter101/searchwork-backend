import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobSeekerService } from './job-seeker.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

@Controller('job-seeker')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Post()
  create(@Body() createJobSeekerDto: CreateJobSeekerDto) {
    return this.jobSeekerService.create(createJobSeekerDto);
  }

  @Get()
  findAll() {
    return this.jobSeekerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobSeekerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobSeekerDto: UpdateJobSeekerDto,
  ) {
    return this.jobSeekerService.update(+id, updateJobSeekerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobSeekerService.remove(+id);
  }
}
