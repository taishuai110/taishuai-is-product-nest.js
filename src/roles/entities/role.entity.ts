import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity("roles")
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "admin" })
  admin: string;

  @ManyToMany(type => UserEntity, (user: UserEntity) => user.roles)
  user: UserEntity[];
}
