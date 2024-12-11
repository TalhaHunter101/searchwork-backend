import { Injectable } from '@nestjs/common';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';

@Injectable()
export class JobPostService {
  create(createJobPostDto: CreateJobPostDto) {
    return 'This action adds a new jobPost';
  }

  findAll() {
    return `This action returns all jobPost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobPost`;
  }

  update(id: number, updateJobPostDto: UpdateJobPostDto) {
    return `This action updates a #${id} jobPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobPost`;
  }
}
