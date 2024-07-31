// 这个针对某个权限的管道

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleEntity } from "../../roles/entities/role.entity";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>("allowedRoles", context.getHandler());
    // 拿到中间的上下文
    const request = context.switchToHttp().getRequest();
    // 根据上下文的数据里面roles角色是否存在
    const result = request?.currentUser?.roles.map((role: RoleEntity) => allowedRoles.includes(role.admin)).find((val: boolean) => val === true);
    // todo 授权通过  11集
    if(result) return true;
    // 授权没通过
    throw new UnauthorizedException("你没有该功能的授权")
    return true
  }
}