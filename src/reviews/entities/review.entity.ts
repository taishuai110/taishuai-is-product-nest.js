import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({ name: "reviews" })
export class ReviewEntity {
    @PrimaryColumn()
    id: number

    @Column({ comment: "评论等级" })
    ratings: number;

    @Column({ comment: '评论内容' })
    comment: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.reviews)
    user: UserEntity;

    @ManyToOne(() => ProductEntity, (prod) => prod.reviews)
    product: ProductEntity;
}
