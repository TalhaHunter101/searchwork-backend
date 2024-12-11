import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigrations1733944413150 implements MigrationInterface {
  name = 'InitialMigrations1733944413150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "city" character varying NOT NULL, "state" character varying NOT NULL, "address" character varying NOT NULL, "point" geometry(Point,4326), "zipCode" character varying, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ba94dcfa1b352b0495b55ac3e0" ON "location" USING GiST ("point") `,
    );
    await queryRunner.query(
      `CREATE TABLE "job_seeker" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "skills" character varying, "professionalExperience" character varying, "qualification" character varying, "majorSubjects" character varying, "certificates" character varying NOT NULL, "certificatesData" character varying NOT NULL, "user_id" integer, CONSTRAINT "REL_0f8b08fb61217cfd889046c148" UNIQUE ("user_id"), CONSTRAINT "PK_431f9daff3d1d2acce028738586" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_job_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_job" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "status" "public"."user_job_status_enum" NOT NULL DEFAULT 'applied', "jobPostId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_7e956aacee9897fbe87c9df4cc5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_type_enum" AS ENUM('full_time', 'part_time', 'contract', 'freelance')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_availability_enum" AS ENUM('remote', 'on_site', 'hybrid')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_experiencelevel_enum" AS ENUM('entry', 'intermediate', 'senior', 'expert')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_duration_enum" AS ENUM('temporary', 'permanent')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_post_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "job_post" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying, "type" "public"."job_post_type_enum" NOT NULL DEFAULT 'full_time', "description" character varying, "requirements" character varying, "locationId" integer, "salary" integer NOT NULL, "availability" "public"."job_post_availability_enum" NOT NULL DEFAULT 'on_site', "experienceLevel" "public"."job_post_experiencelevel_enum" NOT NULL DEFAULT 'intermediate', "duration" "public"."job_post_duration_enum" NOT NULL DEFAULT 'permanent', "status" "public"."job_post_status_enum" NOT NULL DEFAULT 'hiring', "employerId" integer, "location_id" integer, CONSTRAINT "UQ_ee26d130dc420c2e35f42573ce8" UNIQUE ("title"), CONSTRAINT "PK_a70f902a85e6de57340d153c813" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employer" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "companyName" character varying NOT NULL, "industry" character varying NOT NULL, "companySize" character varying, "registrationNumber" character varying, "user_id" integer, CONSTRAINT "UQ_a26fba336d782f2265cfb17160a" UNIQUE ("companyName"), CONSTRAINT "REL_6b1262606e8e48d624fa5557b3" UNIQUE ("user_id"), CONSTRAINT "PK_74029e6b1f17a4c7c66d43cfd34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('employee', 'employer')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "phoneNumber" character varying NOT NULL, "fullName" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'employee', "gender" "public"."user_gender_enum", "isEmailVerified" boolean NOT NULL DEFAULT false, "otp" character varying, "jobSeekerProfileId" integer, "employerProfileId" integer, "locationId" integer, CONSTRAINT "REL_9a6412507a7e71a9cba3a0779c" UNIQUE ("jobSeekerProfileId"), CONSTRAINT "REL_9abc88bec7e7e9d2a5ba3da2f6" UNIQUE ("employerProfileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6f65b2c04ef9f60f92d43b5405" ON "user" ("email", "phoneNumber") `,
    );
    await queryRunner.query(
      `ALTER TABLE "job_seeker" ADD CONSTRAINT "FK_0f8b08fb61217cfd889046c1481" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" ADD CONSTRAINT "FK_2a4efc75467cf293a3e72ebb23a" FOREIGN KEY ("jobPostId") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" ADD CONSTRAINT "FK_721b04e211f9d00623724c7aa91" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ADD CONSTRAINT "FK_e77e302f34a1005e41d330c0a97" FOREIGN KEY ("employerId") REFERENCES "employer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" ADD CONSTRAINT "FK_8d9d8ffb751cf9d1b6982eec02b" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employer" ADD CONSTRAINT "FK_6b1262606e8e48d624fa5557b3e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9a6412507a7e71a9cba3a0779cc" FOREIGN KEY ("jobSeekerProfileId") REFERENCES "job_seeker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9abc88bec7e7e9d2a5ba3da2f6f" FOREIGN KEY ("employerProfileId") REFERENCES "employer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_93e37a8413a5745a9b52bc3c0c1" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_93e37a8413a5745a9b52bc3c0c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9abc88bec7e7e9d2a5ba3da2f6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9a6412507a7e71a9cba3a0779cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employer" DROP CONSTRAINT "FK_6b1262606e8e48d624fa5557b3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" DROP CONSTRAINT "FK_8d9d8ffb751cf9d1b6982eec02b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_post" DROP CONSTRAINT "FK_e77e302f34a1005e41d330c0a97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" DROP CONSTRAINT "FK_721b04e211f9d00623724c7aa91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job" DROP CONSTRAINT "FK_2a4efc75467cf293a3e72ebb23a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_seeker" DROP CONSTRAINT "FK_0f8b08fb61217cfd889046c1481"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f65b2c04ef9f60f92d43b5405"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "employer"`);
    await queryRunner.query(`DROP TABLE "job_post"`);
    await queryRunner.query(`DROP TYPE "public"."job_post_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."job_post_duration_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."job_post_experiencelevel_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_post_availability_enum"`);
    await queryRunner.query(`DROP TYPE "public"."job_post_type_enum"`);
    await queryRunner.query(`DROP TABLE "user_job"`);
    await queryRunner.query(`DROP TYPE "public"."user_job_status_enum"`);
    await queryRunner.query(`DROP TABLE "job_seeker"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ba94dcfa1b352b0495b55ac3e0"`,
    );
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
