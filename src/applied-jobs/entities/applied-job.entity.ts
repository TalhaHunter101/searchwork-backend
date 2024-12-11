import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JobPost } from 'src/job-post/entities/job-post.entity';
import { Status } from 'src/utils/constants/constants';
import { BaseEntity } from 'src/common/base/base.entity';

@Entity()
export class AppliedJob extends BaseEntity {
  // Reference to the job post being applied for
  @ManyToOne(() => JobPost, (jobPost) => jobPost.appliedJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  jobPost: JobPost;

  // Reference to the user (candidate) who applied for the job
  @ManyToOne(() => User, (user) => user.appliedJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  // Status of the job application
  @Column({ type: 'enum', enum: Status, default: Status.Applied })
  status: Status;
}
