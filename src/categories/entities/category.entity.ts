import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { ProductEntity } from "../../products/entities/product.entity";

@Entity({ name: "categories" })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "种类名称" })
  title: string;

  @Column({ comment: "种类描述" })
  description: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.categories)
  addedBy: UserEntity;

  @OneToMany(() => ProductEntity, (prod: ProductEntity) => prod.category)
  products: ProductEntity[];
}
