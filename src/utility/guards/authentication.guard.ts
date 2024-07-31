import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// 创建管道  管道是在中间件之后，控制器之前执行的
@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    // 这里会进行token拦截，假如jwt有问题，则会把返回403权限不够
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  }
}