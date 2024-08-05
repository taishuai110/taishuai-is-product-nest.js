import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp, ManyToMany, OneToMany
} from "typeorm";
import { RoleEntity } from "../../roles/entities/role.entity";
import { CategoryEntity } from "../../categories/entities/category.entity";
import { ProductEntity } from "../../products/entities/product.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { OrderEntity } from "src/orders/entities/order.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名' })
  name: string;

  // 设置唯一性
  @Column({ unique: true, comment: "邮箱地址" })
  email: string;

  // select: false表示查询数据表时不会查询到password字段
  @Column({ select: false, comment: "密码" })
  password: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToMany(() => RoleEntity, (role: RoleEntity) => role.user)
  // JoinTable的作用是多对多关系表时需要一个中间表确定两表之间的关系，所以这个JoinTable就用于创建关系表
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'users_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roles_id', referencedColumnName: 'id' }
  })
  roles: RoleEntity[];

  @OneToMany(() => CategoryEntity, (cat: CategoryEntity) => cat.addedBy)
  categories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (prod: ProductEntity) => prod.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.updatedBy)
  ordersUpdateBy: OrderEntity[];

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.user)
  orders: OrderEntity[];
}
