// 这个是针对权限用户的装饰器
import { SetMetadata } from '@nestjs/common';

export const AuthorizeRoles = (...roles: string[]) => SetMetadata('allowedRoles', roles);
