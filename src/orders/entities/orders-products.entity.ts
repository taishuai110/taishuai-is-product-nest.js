// 订单表以及商品表的关联表

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/products/entities/product.entity";

@Entity({ name: "orders_products" })
export class OrdersProductsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0, comment: "订单价格" })
    product_unit_price: number;

    @Column({ comment: "产品数量" })
    product_quantity: number;

    @ManyToOne(() => OrderEntity, (order: OrderEntity) => order.products)
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, (prod: ProductEntity) => prod.products, { cascade: true })
    produce: ProductEntity;
}