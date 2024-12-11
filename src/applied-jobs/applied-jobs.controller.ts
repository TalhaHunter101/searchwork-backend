import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppliedJobsService } from './applied-jobs.service';
import { CreateAppliedJobDto } from './dto/create-applied-job.dto';
import { UpdateAppliedJobDto } from './dto/update-applied-job.dto';

@Controller('applied-jobs')
export class AppliedJobsController {
  constructor(private readonly appliedJobsService: AppliedJobsService) {}

  @Post()
  create(@Body() createAppliedJobDto: CreateAppliedJobDto) {
    return this.appliedJobsService.create(createAppliedJobDto);
  }

  @Get()
  findAll() {
    return this.appliedJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appliedJobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppliedJobDto: UpdateAppliedJobDto) {
    return this.appliedJobsService.update(+id, updateAppliedJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appliedJobsService.remove(+id);
  }
}
