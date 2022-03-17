import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateDatabase1647542077927 implements MigrationInterface {
  name = 'CreateDatabase1647542077927'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "status" integer NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "spy" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "scrapingRateMinimum" integer NOT NULL, "scrapingRateMaximum" integer NOT NULL, "status" integer NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_948642f6f0a465f8a5a20ba6621" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "hash" character varying NOT NULL, "role" integer NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "follower_profiler" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" integer NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "profileUsername" character varying, "userId" uuid, CONSTRAINT "PK_dd8d5e2bbf61c9b8aa636406190" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "profile" ("username" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d80b94dc62f7467403009d88062" UNIQUE ("username"), CONSTRAINT "PK_d80b94dc62f7467403009d88062" PRIMARY KEY ("username"))`
    )
    await queryRunner.query(
      `CREATE TABLE "spy_profiles_profile" ("spyId" integer NOT NULL, "profileUsername" character varying NOT NULL, CONSTRAINT "PK_83e5d0443e091e8acd27a9d58c4" PRIMARY KEY ("spyId", "profileUsername"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a259c178ffd12b654a8198a3cf" ON "spy_profiles_profile" ("spyId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_87c50e7ffa93004665259ca4b1" ON "spy_profiles_profile" ("profileUsername") `
    )
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "spy" ADD CONSTRAINT "FK_b7cb8ac3e07ed71c8130c23406a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "follower_profiler" ADD CONSTRAINT "FK_52a904f80cfec35e83543013443" FOREIGN KEY ("profileUsername") REFERENCES "profile"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "follower_profiler" ADD CONSTRAINT "FK_754f5c7b84153270cc2806948ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "spy_profiles_profile" ADD CONSTRAINT "FK_a259c178ffd12b654a8198a3cf2" FOREIGN KEY ("spyId") REFERENCES "spy"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "spy_profiles_profile" ADD CONSTRAINT "FK_87c50e7ffa93004665259ca4b12" FOREIGN KEY ("profileUsername") REFERENCES "profile"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spy_profiles_profile" DROP CONSTRAINT "FK_87c50e7ffa93004665259ca4b12"`
    )
    await queryRunner.query(
      `ALTER TABLE "spy_profiles_profile" DROP CONSTRAINT "FK_a259c178ffd12b654a8198a3cf2"`
    )
    await queryRunner.query(
      `ALTER TABLE "follower_profiler" DROP CONSTRAINT "FK_754f5c7b84153270cc2806948ea"`
    )
    await queryRunner.query(
      `ALTER TABLE "follower_profiler" DROP CONSTRAINT "FK_52a904f80cfec35e83543013443"`
    )
    await queryRunner.query(`ALTER TABLE "spy" DROP CONSTRAINT "FK_b7cb8ac3e07ed71c8130c23406a"`)
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_87c50e7ffa93004665259ca4b1"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_a259c178ffd12b654a8198a3cf"`)
    await queryRunner.query(`DROP TABLE "spy_profiles_profile"`)
    await queryRunner.query(`DROP TABLE "profile"`)
    await queryRunner.query(`DROP TABLE "follower_profiler"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "spy"`)
    await queryRunner.query(`DROP TABLE "account"`)
  }
}
