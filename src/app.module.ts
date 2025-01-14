import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "../db/data-source";
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  // 这里把数据库对应配置导入到TypeOrm中
    imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, RolesModule, CategoriesModule, ProductsModule, ReviewsModule, OrdersModule],
    controllers: [],
    providers: []
})
export class AppModule {
    // 注册中间件 在所有的请求中都经过中间件
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(CurrentUserMiddleware)
          .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
