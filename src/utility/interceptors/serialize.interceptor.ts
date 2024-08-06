// 用于后端响应给前端数据时进行拦截的拦截器
import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { plainToClass } from "class-transformer";

export function SerializeIncludes(dto: any) {
  return UseInterceptors(new SerializeIntercepor(dto));
}

export class SerializeIntercepor implements NestInterceptor {
  constructor(private dto:any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const now = Date.now();
    return next.handle().pipe(
      map((data: any) => {
        // 这里会在后端响应给前端时进行拦截，可以做一些事
        return plainToClass(this.dto, data, { exposeUnsetFields: true });
      })
    )
  }
}