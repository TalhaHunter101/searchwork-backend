import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserJobsService } from './user-jobs.service';
import { CreateUserJobDto } from './dto/create-user-job.dto';
import { UpdateUserJobDto } from './dto/update-user-job.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user-jobs')
@Controller('user-jobs')
export class UserJobsController {
  constructor(private readonly userJobsService: UserJobsService) {}

  @Post()
  create(@Body() createUserJobDto: CreateUserJobDto) {
    return this.userJobsService.create(createUserJobDto);
  }

  @Get()
  findAll() {
    return this.userJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userJobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserJobDto: UpdateUserJobDto) {
    return this.userJobsService.update(+id, updateUserJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userJobsService.remove(+id);
  }
}
