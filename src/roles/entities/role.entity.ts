import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity("roles")
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "admin", comment: "角色权限：目前只有admin有权限" })
  admin: string;

  @ManyToMany(() => UserEntity, (user: UserEntity) => user.roles)
  user: UserEntity[];
}
