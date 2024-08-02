// 货物运输表
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity({ name: "shippings" })
export class ShippingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: "手机号码" })
    phone: string;

    @Column({ comment: "姓名" })
    name: string;

    @Column({ comment: "详细地址" })
    address: string;

    @Column({ comment: "居住城市" })
    city: string;

    @Column({ comment: "邮政编码" })
    postCode: string;

    @Column({ comment: "所在的省份/州" })
    state: string;

    @Column({ comment: "所在的国家" })
    country: string;

    @OneToOne(() => OrderEntity, (order) => order.shippingAddress)
    order: OrderEntity;
}