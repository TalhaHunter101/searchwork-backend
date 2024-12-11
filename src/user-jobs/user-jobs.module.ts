import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserJobsController } from './user-jobs.controller';
import { UserJob } from './entities/user-job.entity';
import { UserJobsService } from './user-jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserJob])],
  controllers: [UserJobsController],
  providers: [UserJobsService],
  exports: [UserJobsService],
})
export class UserJobsModule {}
