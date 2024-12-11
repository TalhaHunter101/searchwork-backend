import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';

@Module({
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}
