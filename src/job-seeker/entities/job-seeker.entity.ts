import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class JobSeeker {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({ example: 'Software Engineer', description: 'Please enter your skills' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: true })
  skills: string;

  @ApiProperty({ example: 'Full Stack Developer', description: 'Professional Experience of the user' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  professionalExperience: string;

  @ApiProperty({ example: 'Bachelors', description: 'User qualification' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  qualification: string;

  @ApiProperty({ example: 'Computer Science', description: 'User degree major subjects' })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  majorSubjects: string;

  @ApiProperty({ example: '2', description: 'How much certificates does User have' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  certificates: string;
  
  @ApiProperty({ example: 'Picture of certificates', description: 'Upload certificates if User have any' })
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false })
  certificatesData: string;

  @OneToOne(() => User, (user) => user.jobSeekerProfile)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
