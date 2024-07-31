import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp, ManyToMany, OneToMany
} from "typeorm";
import { Roles } from "../../utility/common/user-roles.ennum";
import { RoleEntity } from "../../roles/entities/role.entity";
import { CategoryEntity } from "../../categories/entities/category.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // 设置唯一性
  @Column({ unique: true })
  email: string;

  // select: false表示查询数据表时不会查询到password字段
  @Column({ select: false })
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
}
