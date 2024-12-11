import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JobPost } from '../../job-post/entities/job-post.entity';
import { Status } from '../../utils/constants/constants';
import { BaseEntity } from '../../common/base/base.entity';

@Entity()
export class UserJob extends BaseEntity {
  @ManyToOne(() => JobPost, (jobPost) => jobPost.userJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  jobPost: JobPost;

  @ManyToOne(() => User, (user) => user.userJobs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column({ type: 'enum', enum: Status, default: Status.Applied })
  status: Status;
}