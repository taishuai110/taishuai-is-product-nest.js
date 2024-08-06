import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductsModule } from 'src/products/products.module';

/*
  forwardRef用于两个model之间互相依赖的，但又同时需要彼此注入。
  这时如果直接在定义时引用对方，会导致 TypeScript 报错，因为此时变量还未定义
  forwardRef来延迟依赖的引用，它允许我们在构造函数中使用完全未定义的依赖类型
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, 
      OrdersProductsEntity, 
      ShippingEntity]),
      forwardRef(() => ProductsModule)
    ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule { }
