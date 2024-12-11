import { Injectable } from '@nestjs/common';
import { CreateAppliedJobDto } from './dto/create-applied-job.dto';
import { UpdateAppliedJobDto } from './dto/update-applied-job.dto';

@Injectable()
export class AppliedJobsService {
  create(createAppliedJobDto: CreateAppliedJobDto) {
    return 'This action adds a new appliedJob';
  }

  findAll() {
    return `This action returns all appliedJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appliedJob`;
  }

  update(id: number, updateAppliedJobDto: UpdateAppliedJobDto) {
    return `This action updates a #${id} appliedJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} appliedJob`;
  }
}
