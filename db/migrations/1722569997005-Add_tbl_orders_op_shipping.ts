import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTblOrdersOpShipping1722569997005 implements MigrationInterface {
    name = 'AddTblOrdersOpShipping1722569997005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`shippings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phone\` varchar(255) NOT NULL COMMENT '手机号码', \`name\` varchar(255) NOT NULL COMMENT '姓名', \`address\` varchar(255) NOT NULL COMMENT '详细地址', \`city\` varchar(255) NOT NULL COMMENT '居住城市', \`postCode\` varchar(255) NOT NULL COMMENT '邮政编码', \`state\` varchar(255) NOT NULL COMMENT '所在的省份/州', \`country\` varchar(255) NOT NULL COMMENT '所在的国家', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orderAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('processing', 'shipped', 'delivered', 'cancelled') NOT NULL COMMENT '订单的状态' DEFAULT 'processing', \`shippedAt\` datetime NULL COMMENT '交货日期', \`delivereAt\` datetime NULL COMMENT '支付日期', \`updatedById\` int NULL, \`shippingAddressId\` int NULL, UNIQUE INDEX \`REL_cc4e4adab232e8c05026b2f345\` (\`shippingAddressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders_products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_unit_price\` decimal(10,2) NOT NULL COMMENT '订单价格' DEFAULT '0.00', \`product_quantity\` int NOT NULL COMMENT '产品数量', \`orderId\` int NULL, \`prodcutId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1102b5a0c580f845993e2f766f6\` FOREIGN KEY (\`updatedById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_cc4e4adab232e8c05026b2f345d\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`shippings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_823bad3524a5d095453c43286bb\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_936755eb88b009e7d0bcfa7b730\` FOREIGN KEY (\`prodcutId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_936755eb88b009e7d0bcfa7b730\``);
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_823bad3524a5d095453c43286bb\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_cc4e4adab232e8c05026b2f345d\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1102b5a0c580f845993e2f766f6\``);
        await queryRunner.query(`DROP TABLE \`orders_products\``);
        await queryRunner.query(`DROP INDEX \`REL_cc4e4adab232e8c05026b2f345\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`shippings\``);
    }

}
