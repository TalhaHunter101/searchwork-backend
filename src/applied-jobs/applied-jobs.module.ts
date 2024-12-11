import { Module } from '@nestjs/common';
import { AppliedJobsService } from './applied-jobs.service';
import { AppliedJobsController } from './applied-jobs.controller';

@Module({
  controllers: [AppliedJobsController],
  providers: [AppliedJobsService],
})
export class AppliedJobsModule {}
