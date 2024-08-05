// 订单表

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductsEntity } from "./orders-products.entity";

@Entity({ name: "orders" })
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    orderAt: Timestamp;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING, comment: "订单的状态" })
    status: string;

    // nullbale表示该字符可以为空
    @Column({ nullable: true, comment: "交货日期" })
    shippedAt: Date;

    @Column({ nullable: true, comment: "支付日期" })
    delivereAt: Date;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.ordersUpdateBy)
    updatedBy: UserEntity;

    // cascade表示强依赖了，操作对应关系其中一个表，另外一个表也会跟着操作 
    @OneToOne(() => ShippingEntity, (ship: ShippingEntity) => ship.order, { cascade: true })
    // 指定外键列
    @JoinColumn()
    shippingAddress: ShippingEntity;

    @OneToMany(() => OrdersProductsEntity, (op: OrdersProductsEntity) => op.order, { cascade: true })
    products: OrdersProductsEntity[];

    @ManyToOne(() => UserEntity, (user:UserEntity) => user.orders)
    user: UserEntity;
}
