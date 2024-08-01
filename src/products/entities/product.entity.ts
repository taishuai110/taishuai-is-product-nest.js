// 创建products数据表

import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { CategoryEntity } from "../../categories/entities/category.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";

@Entity({ name: 'products', comment: "商品表" })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "商品标题" })
  title: string;

  @Column({ comment: "商品描述" })
  description: string;

  // deciaml: 表示字段存储精确的十进制，precision进制数，scale定义了小数点的位数
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, comment: "商品价格" })
  price: number;

  @Column({ comment: "商品现货" })
  stock: number;

  // 定义简单的数组类型字段
  @Column('simple-array')
  images: string[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.products)
  addedBy: UserEntity;

  @ManyToOne(() => CategoryEntity, (cat: CategoryEntity) => cat.products)
  category: CategoryEntity;

  @OneToMany(() => ReviewEntity, (review) => review.product)
  reviews: ReviewEntity[];
}
