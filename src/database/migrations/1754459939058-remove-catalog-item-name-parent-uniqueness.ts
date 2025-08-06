import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCatalogItemNameParentUniqueness1754459939058 implements MigrationInterface {
    name = 'RemoveCatalogItemNameParentUniqueness1754459939058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog_items" DROP CONSTRAINT "UQ_479ad8961d62617aa8a81460844"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog_items" ADD CONSTRAINT "UQ_479ad8961d62617aa8a81460844" UNIQUE ("name")`);
    }

}
