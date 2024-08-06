import { forwardRef, Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { CategoriesModule } from "../categories/categories.module";
import { OrdersModule } from "../orders/orders.module";

/*
  forwardRef用于两个model之间互相依赖的，但又同时需要彼此注入。
  这时如果直接在定义时引用对方，会导致 TypeScript 报错，因为此时变量还未定义
  forwardRef来延迟依赖的引用，它允许我们在构造函数中使用完全未定义的依赖类型
 */

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CategoriesModule, forwardRef(() => OrdersModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {
}
