import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1753337517792 implements MigrationInterface {
    name = 'Migrations1753337517792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."catalog_items_type_enum" AS ENUM('mood', 'tag')`);
        await queryRunner.query(`CREATE TABLE "catalog_items" ("id" character varying(26) NOT NULL, "name" character varying NOT NULL, "type" "public"."catalog_items_type_enum" NOT NULL, "parent_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '0', "parentId" character varying(26), CONSTRAINT "UQ_4033335f816929e61dde7afe176" UNIQUE ("parent_id", "name"), CONSTRAINT "UQ_479ad8961d62617aa8a81460844" UNIQUE ("name"), CONSTRAINT "PK_dd1c29828c10a599d894b9b6535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quotes" ("id" character varying(26) NOT NULL, "text" character varying NOT NULL, "author" character varying NOT NULL, "likeCount" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_99a0e8bcbcd8719d3a41f23c263" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying(26) NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "lastMoodSelectionAt" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_mood_selection_id" character varying(26), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" character varying(26), "quote_id" character varying(26), CONSTRAINT "UQ_57263febc98fb97c3352b1495e2" UNIQUE ("user_id", "quote_id"), CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quote_tags" ("quote_id" character varying(26) NOT NULL, "catalog_item_id" character varying(26) NOT NULL, CONSTRAINT "PK_63a5418fa23f1a48808ede13fb4" PRIMARY KEY ("quote_id", "catalog_item_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2968b353c4746c0b333ab549f8" ON "quote_tags" ("quote_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_72f9703dbbaeddc0dab999ac7d" ON "quote_tags" ("catalog_item_id") `);
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD CONSTRAINT "FK_1d2d85ede00322857fe078d5892" FOREIGN KEY ("parentId") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b9c134c6bf1207861a59ac44fbf" FOREIGN KEY ("last_mood_selection_id") REFERENCES "catalog_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_90947d7101005d8994a2ba5a4bb" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quote_tags" ADD CONSTRAINT "FK_2968b353c4746c0b333ab549f87" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quote_tags" ADD CONSTRAINT "FK_72f9703dbbaeddc0dab999ac7d5" FOREIGN KEY ("catalog_item_id") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote_tags" DROP CONSTRAINT "FK_72f9703dbbaeddc0dab999ac7d5"`);
        await queryRunner.query(`ALTER TABLE "quote_tags" DROP CONSTRAINT "FK_2968b353c4746c0b333ab549f87"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_90947d7101005d8994a2ba5a4bb"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b9c134c6bf1207861a59ac44fbf"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP CONSTRAINT "FK_1d2d85ede00322857fe078d5892"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72f9703dbbaeddc0dab999ac7d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2968b353c4746c0b333ab549f8"`);
        await queryRunner.query(`DROP TABLE "quote_tags"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "quotes"`);
        await queryRunner.query(`DROP TABLE "catalog_items"`);
        await queryRunner.query(`DROP TYPE "public"."catalog_items_type_enum"`);
    }

}
