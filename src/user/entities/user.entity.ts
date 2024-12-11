import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
  ManyToOne,
} from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from 'src/utils/constants/constants';
import { JobSeeker } from 'src/job-seeker/entities/job-seeker.entity';
import { Employer } from 'src/employer/entities/employer.entity';
// import { JobPost } from 'src/job-post/entities/job-post.entity';
import { UserJob } from 'src/user-jobs/entities/user-job.entity';
import { Location } from 'src/location/entities/location.entity';
import { BaseEntity } from 'src/common/base/base.entity';

@Entity()
@Index(['email', 'phoneNumber'], { unique: true })
export class User extends BaseEntity {
  @ApiProperty({ example: '+971123456789' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber(null)
  @Column({ nullable: false })
  phoneNumber: string;

  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ example: 'Employee' })
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.Employee })
  role: Role;

  @ApiProperty({ example: 'Male' })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ example: '123456' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  otp: string;

  // table relations
  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.user)
  @JoinColumn()
  jobSeekerProfile: JobSeeker;

  @OneToOne(() => Employer, (employer) => employer.user)
  @JoinColumn()
  employerProfile: Employer;

  @ManyToOne(() => Location)
  @JoinColumn()
  location: Location;

  @OneToMany(() => UserJob, (userJob) => userJob.user)
  userJobs: UserJob[];
}
