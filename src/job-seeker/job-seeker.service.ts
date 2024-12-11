import { Injectable } from '@nestjs/common';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

@Injectable()
export class JobSeekerService {
  create(createJobSeekerDto: CreateJobSeekerDto) {
    return 'This action adds a new jobSeeker';
  }

  findAll() {
    return `This action returns all jobSeeker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobSeeker`;
  }

  update(id: number, updateJobSeekerDto: UpdateJobSeekerDto) {
    return `This action updates a #${id} jobSeeker`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobSeeker`;
  }
}
