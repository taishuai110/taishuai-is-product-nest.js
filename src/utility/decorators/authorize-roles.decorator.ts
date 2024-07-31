// 这个是针对权限用户的装饰器
import { SetMetadata } from '@nestjs/common';
import { RoleEntity } from '../../roles/entities/role.entity';

export const AuthorizeRoles = (...roles: RoleEntity[]) => SetMetadata('allowedRoles', roles);
