import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';

@Entity()
export class JobSeeker extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'User ID',
  })
  @Column({ nullable: false })
  userId: number;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'Please enter your skills',
  })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: true })
  skills: string;

  @ApiProperty({
    example: 'Full Stack Developer',
    description: 'Professional Experience of the user',
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  professionalExperience: string;

  @ApiProperty({ example: 'Bachelors', description: 'User qualification' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  qualification: string;

  @ApiProperty({
    example: 'Computer Science',
    description: 'User degree major subjects',
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  majorSubjects: string;

  @ApiProperty({
    example: '2',
    description: 'How much certificates does User have',
  })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  certificates: string;

  @ApiProperty({
    example: 'Picture of certificates',
    description: 'Upload certificates if User have any',
  })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  certificatesData: string;

  @OneToOne(() => User, (user) => user.jobSeekerProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
