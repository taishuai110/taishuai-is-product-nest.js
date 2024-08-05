import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UserEntity } from "src/users/entities/user.entity";
import { OrderEntity } from "./entities/order.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrdersProductsEntity } from "./entities/orders-products.entity";
import { ShippingEntity } from "./entities/shipping.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { ProductsService } from "src/products/products.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrderStatus } from "./enums/order-status.enum";

@Injectable()
export class OrdersService {
  // OrderEntity, OrdersProductsEntity都是order.model模块引入的，要使用InjectReposiory
  // 而ProductsService则从productsService模块引入的
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>,
    private readonly productService: ProductsService
  ) {
  }

  // 创建订单以及地址和商品关系表
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity
  ): Promise<OrderEntity> {
    // new一个实例
    const shippingEntity = new ShippingEntity();
    // 把订单地址赋值给shipping实例
    Object.assign(shippingEntity, createOrderDto.shippingAddress);
    // 再new一个数据表实例
    const orderEntity = new OrderEntity();
    // 前端传递过来的地址赋值给order中的一个关联表
    orderEntity.shippingAddress = shippingEntity;
    // 获取用户数据
    orderEntity.user = currentUser;

    // 把订单的数据保存在数据表中 返回的是保存订单表
    const orderData = await this.orderRepository.save(orderEntity);

    // 声明一个订单与商品的关联表，该关联表还存放商品的价格以及商品数量
    const opEntity: {
      order: OrderEntity;
      product: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    // 这个循环前端传递过来的订单包含多少个商品，每个商品都是opEntity类型的对象
    for (const item of createOrderDto.orderedProducts) {
      // 订单数据
      const order = orderData;
      // 根据商品id查询商品列表
      const product = await this.productService.findOne(item.id);
      // 商品的数量
      const product_quantity = item.product_quantity;
      // 商品的价格
      const product_unit_price = item.product_unit_price;
      //赋值给opEntity数组
      opEntity.push({ order, product, product_quantity, product_unit_price });
    }

    // insert()表示插入数据, into()插入的类型, values()插入的数据, execute()进入数据库实际操作，返回一个promise对象
    const op = await this.opRepository.createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();


    return await this.findOne(orderData.id);
  }

  // 查询所有订单
  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: [ "shippingAddress", "user", "products" ]
    });
  }

  // 根据id查询订单
  async findOne(id: number): Promise<OrderEntity> {
    const orderData = await this.orderRepository.findOne({
      where: { id },
      relations: ["shippingAddress", "user", "products"]
    });
    if (!orderData) throw new NotFoundException(`找不到id为${id}的订单`);
    return orderData;
  }

  // 这里是修改订单的状态，只能传发货或交货的状态
  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser: UserEntity) {
    // 找到订单号
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException("找不到对应的订单号");

    // 判断订单如果是交付或取消的状态时
    if ((order.status === OrderStatus.DELIVERED) || (order.status == OrderStatus.CENCELLED)) {
      throw new BadRequestException(`订单已经交付或发货了`);
    }

    // 订单是正在处理还是正在发货
    if ((order.status === OrderStatus.PROCESSING) && (updateOrderStatusDto.status != OrderStatus.SHIPPED)) {
      throw new BadRequestException(`发货前付款`);
    }

    // 订单是在发货中时
    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status == OrderStatus.SHIPPED
    ) {
      return order;
    }

    // 如果是在发货中
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.delivereAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    if(updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }

    return order;
  }

  //取消订单的serivce  订单id
  async cancelled(id: number, currentUser: UserEntity) {
      let order = await this.findOne(id);
      if(!order) throw new NotFoundException('找不到订单');
      // 如果订单已被取消，则返回查询到的订单信息
      if(order.status === OrderStatus.CENCELLED) return order;

      // 订单还没被取消，则把订单状态改为取消状态
      order.status = OrderStatus.CENCELLED;
      // 获取修改订单的用户
      order.updatedBy = currentUser;
      order = await this.orderRepository.save(order);
      // 更新数据库中的商品库存
    await this.stockUpdate(order, OrderStatus.CENCELLED);
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  // 订单发生变化时 更新商品的数量以及库存
  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(op.id, op.product_quantity, status)
    }
  }
}
