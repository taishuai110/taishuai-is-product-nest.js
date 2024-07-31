import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 创建装饰器 获取中间件得到的信息
export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  }
);