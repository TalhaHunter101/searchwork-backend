import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth.module';
import { JobPostModule } from './job-post/job-post.module';
import { JobSeekerModule } from './job-seeker/job-seeker.module';
import { AppliedJobsModule } from './applied-jobs/applied-jobs.module';
import { EmployerModule } from './employer/employer.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    JobPostModule,
    JobSeekerModule,
    AppliedJobsModule,
    EmployerModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: Logger }],
})
export class AppModule {}
