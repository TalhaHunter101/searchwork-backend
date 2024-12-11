import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPointColumnToLocation17339364571122
  implements MigrationInterface
{
  name = 'AddPointColumnToLocation17339364571122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" ADD "point" geography(Point,4326) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD "zipCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_type_enum" RENAME TO "job_post_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_type_enum" AS ENUM('full_time', 'part_time', 'contract', 'freelance')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "type" TYPE "public"."job_post_type_enum" USING "type"::"text"::"public"."job_post_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "type" SET DEFAULT 'full_time'`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_post_type_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_availability_enum" RENAME TO "job_post_availability_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_availability_enum" AS ENUM('remote', 'on_site', 'hybrid')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "availability" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "availability" TYPE "public"."job_post_availability_enum" USING "availability"::"text"::"public"."job_post_availability_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "availability" SET DEFAULT 'on_site'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."job_post_availability_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_experiencelevel_enum" RENAME TO "job_post_experiencelevel_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_experiencelevel_enum" AS ENUM('entry', 'intermediate', 'senior', 'expert')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "experienceLevel" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "experienceLevel" TYPE "public"."job_post_experiencelevel_enum" USING "experienceLevel"::"text"::"public"."job_post_experiencelevel_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "experienceLevel" SET DEFAULT 'intermediate'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."job_post_experiencelevel_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_duration_enum" RENAME TO "job_post_duration_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_duration_enum" AS ENUM('temporary', 'permanent')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "duration" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "duration" TYPE "public"."job_post_duration_enum" USING "duration"::"text"::"public"."job_post_duration_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "duration" SET DEFAULT 'permanent'`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_post_duration_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_status_enum" RENAME TO "job_post_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "status" TYPE "public"."job_post_status_enum" USING "status"::"text"::"public"."job_post_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "status" SET DEFAULT 'hiring'`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_post_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('employee', 'employer')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'employee'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_gender_enum" RENAME TO "user_gender_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "gender" TYPE "public"."user_gender_enum" USING "gender"::"text"::"public"."user_gender_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_job_status_enum" RENAME TO "user_job_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_job_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" ALTER COLUMN "status" TYPE "public"."user_job_status_enum" USING "status"::"text"::"public"."user_job_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" ALTER COLUMN "status" SET DEFAULT 'applied'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_job_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_job_status_enum_old" AS ENUM('Hiring', 'Hired', 'Closed', 'Under-Review', 'Applied')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" ALTER COLUMN "status" TYPE "public"."user_job_status_enum_old" USING "status"::"text"::"public"."user_job_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" ALTER COLUMN "status" SET DEFAULT 'Applied'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_job_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_job_status_enum_old" RENAME TO "user_job_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum_old" AS ENUM('Male', 'Female', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "gender" TYPE "public"."user_gender_enum_old" USING "gender"::"text"::"public"."user_gender_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_gender_enum_old" RENAME TO "user_gender_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum_old" AS ENUM('Employee', 'Employer')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'Employee'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_status_enum_old" AS ENUM('Hiring', 'Hired', 'Closed', 'Under-Review', 'Applied')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "status" TYPE "public"."job_post_status_enum_old" USING "status"::"text"::"public"."job_post_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "status" SET DEFAULT 'Hiring'`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_post_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_status_enum_old" RENAME TO "job_post_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_duration_enum_old" AS ENUM('Short Term Contract', 'Permanent', 'One Time')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "duration" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "duration" TYPE "public"."job_post_duration_enum_old" USING "duration"::"text"::"public"."job_post_duration_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "duration" SET DEFAULT 'Permanent'`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_post_duration_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_duration_enum_old" RENAME TO "job_post_duration_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_experiencelevel_enum_old" AS ENUM('Beginner', 'Intermediate', 'Expert')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "experienceLevel" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "experienceLevel" TYPE "public"."job_post_experiencelevel_enum_old" USING "experienceLevel"::"text"::"public"."job_post_experiencelevel_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "experienceLevel" SET DEFAULT 'Intermediate'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."job_post_experiencelevel_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_experiencelevel_enum_old" RENAME TO "job_post_experiencelevel_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_availability_enum_old" AS ENUM('On-site', 'Remote', 'Hybrid')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "availability" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "availability" TYPE "public"."job_post_availability_enum_old" USING "availability"::"text"::"public"."job_post_availability_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "availability" SET DEFAULT 'On-site'`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_post_availability_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_availability_enum_old" RENAME TO "job_post_availability_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_type_enum_old" AS ENUM('Full time', 'Part time', 'Other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "type" TYPE "public"."job_post_type_enum_old" USING "type"::"text"::"public"."job_post_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ALTER COLUMN "type" SET DEFAULT 'Full time'`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_post_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."job_post_type_enum_old" RENAME TO "job_post_type_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "zipCode"`);
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "point"`);
  }
}
