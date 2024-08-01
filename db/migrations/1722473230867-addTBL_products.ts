import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLProducts1722473230867 implements MigrationInterface {
    name = 'AddTBLProducts1722473230867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL COMMENT '商品标题', \`description\` varchar(255) NOT NULL COMMENT '商品描述', \`price\` decimal(10,2) NOT NULL COMMENT '商品价格' DEFAULT '0.00', \`stock\` int NOT NULL COMMENT '商品现货', \`images\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`addedById\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="商品表"`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`admin\` \`admin\` varchar(255) NOT NULL COMMENT '角色权限：目前只有admin有权限' DEFAULT 'admin'`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`title\` \`title\` varchar(255) NOT NULL COMMENT '种类名称'`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` varchar(255) NOT NULL COMMENT '种类描述'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`name\` \`name\` varchar(255) NOT NULL COMMENT '用户名'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NOT NULL COMMENT '邮箱地址'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NOT NULL COMMENT '密码'`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_d7e7f53b786522ae18147bb853c\` FOREIGN KEY (\`addedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_d7e7f53b786522ae18147bb853c\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`name\` \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`title\` \`title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`admin\` \`admin\` varchar(255) NOT NULL DEFAULT 'admin'`);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
