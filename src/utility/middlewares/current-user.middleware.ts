// 设置中间件
import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { isArray } from "class-validator";
import { verify } from "jsonwebtoken";
import { UsersService } from "src/users/users.service";
import { UserEntity } from "../../users/entities/user.entity";

// 全局注册
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // 这里可以拿到参数 req, 也可以判断token是否失效
    // authorization 和 Authorization 用来区别前端和客户端的
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // 判断请求头是否存在，authHeader可能是string | string[]  第三个判断是请求头前面是否包含 "Bearer "的字段
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith("Bearer ")) {
      // 不存在
      // 放到express框架的上下文中，让逻辑层知道req.currentUser没有携带token询问
      req.currentUser = null
      next();
    } else {
      // 存在  对token进行分割处理，只要token另外一边，”Bearer “不要
      const token = authHeader.split(" ")[1];
      // 开始解密
      try {
        // 这里是根据token里jwt获取的id 然后id走管道，判断这个id用户是否有权限
        const { id } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        // 这里+id表示把string类型的id转为number类型
        const currentUser: UserEntity = await this.usersService.findOne(+id);
        // 放到上下文中，让逻辑层知道携带了token访问
        req.currentUser = currentUser;
        next();
      } catch (error) {
        console.log(error);
        if(error.response) throw new BadRequestException(error.response);
        // 这里会抛出异常 最常见是token头过期
        throw new BadRequestException(error);
      }
    }
  }
}

// 校验jwt后可以拿到的参数
interface JwtPayload {
  id: string;
}