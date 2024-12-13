import { Module } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { EmployerController } from './employer.controller';
import { User } from '../user/entities/user.entity';
import { Employer } from './entities/employer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Employer, User])],
  controllers: [EmployerController],
  providers: [EmployerService],
})
export class EmployerModule {}
