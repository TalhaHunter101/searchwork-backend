import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';

@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  create(@Body() createJobPostDto: CreateJobPostDto) {
    return this.jobPostService.create(createJobPostDto);
  }

  @Get()
  findAll() {
    return this.jobPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobPostDto: UpdateJobPostDto) {
    return this.jobPostService.update(+id, updateJobPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostService.remove(+id);
  }
}
