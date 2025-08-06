import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExternalIdColumnToQuotesTable1754396236435 implements MigrationInterface {
    name = 'AddExternalIdColumnToQuotesTable1754396236435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quotes" ADD "external_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quotes" ADD CONSTRAINT "UQ_92ca5284b9cbcc2264253ee73cb" UNIQUE ("external_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quotes" DROP CONSTRAINT "UQ_92ca5284b9cbcc2264253ee73cb"`);
        await queryRunner.query(`ALTER TABLE "quotes" DROP COLUMN "external_id"`);
    }

}
