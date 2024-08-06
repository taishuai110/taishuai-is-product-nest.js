import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLCategory1722914754969 implements MigrationInterface {
    name = 'AddTBLCategory1722914754969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_936755eb88b009e7d0bcfa7b730\` ON \`orders_products\``);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_2808321e2e160a70d2d2dd46466\` FOREIGN KEY (\`produceId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_2808321e2e160a70d2d2dd46466\``);
        await queryRunner.query(`CREATE INDEX \`FK_936755eb88b009e7d0bcfa7b730\` ON \`orders_products\` (\`produceId\`)`);
    }

}
