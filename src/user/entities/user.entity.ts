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
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '../../utils/constants/constants';
import { JobSeeker } from '../../job-seeker/entities/job-seeker.entity';
import { Employer } from '../../employer/entities/employer.entity';
import { UserJob } from '../../user-jobs/entities/user-job.entity';
import { Location } from '../../location/entities/location.entity';
import { BaseEntity } from '../../common/base/base.entity';

@Entity()
@Index(['email', 'phoneNumber'], { unique: true })
export class User extends BaseEntity {
  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @IsPhoneNumber()
  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @Column({ nullable: false, unique: true })
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
