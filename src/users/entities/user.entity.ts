import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Timestamp } from "typeorm";
import { Roles } from "../../utility/common/user-roles.ennum";

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

  @Column({ type: "enum", enum: Roles, default: [ Roles.USER ] })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
