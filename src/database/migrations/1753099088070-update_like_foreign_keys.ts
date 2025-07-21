import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLikeForeignKeys1753099088070 implements MigrationInterface {
    name = 'UpdateLikeForeignKeys1753099088070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_c14bec45d93f939e978b65ebffa"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP CONSTRAINT "UQ_491409c3400b198edae64e86990"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "UQ_2272f1eaff47a59db161bec1397"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "quoteId"`);
        await queryRunner.query(`ALTER TABLE "trending_quotes" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD "parent_id" character varying`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "user_id" character varying(26)`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "quote_id" character varying(26)`);
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP CONSTRAINT "FK_1d2d85ede00322857fe078d5892"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD "parentId" character varying(26)`);
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD CONSTRAINT "UQ_4033335f816929e61dde7afe176" UNIQUE ("parent_id", "name")`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "UQ_57263febc98fb97c3352b1495e2" UNIQUE ("user_id", "quote_id")`);
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD CONSTRAINT "FK_1d2d85ede00322857fe078d5892" FOREIGN KEY ("parentId") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_90947d7101005d8994a2ba5a4bb" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_90947d7101005d8994a2ba5a4bb"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP CONSTRAINT "FK_1d2d85ede00322857fe078d5892"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "UQ_57263febc98fb97c3352b1495e2"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP CONSTRAINT "UQ_4033335f816929e61dde7afe176"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD "parentId" character varying`);
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD CONSTRAINT "FK_1d2d85ede00322857fe078d5892" FOREIGN KEY ("parentId") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "quote_id"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "trending_quotes" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "quoteId" character varying(26)`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "userId" character varying(26)`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "UQ_2272f1eaff47a59db161bec1397" UNIQUE ("userId", "quoteId")`);
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD CONSTRAINT "UQ_491409c3400b198edae64e86990" UNIQUE ("name", "parentId")`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_c14bec45d93f939e978b65ebffa" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
