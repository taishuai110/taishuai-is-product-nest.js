import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductEntity } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity";
import { CategoriesService } from "../categories/categories.service";
import { OrderStatus } from "../orders/enums/order-status.enum";
import dataSource from "db/data-source";
import { OrdersService } from "../orders/orders.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService)) private readonly orderService: OrdersService
  ) {
  }

  // 创建商品数据
  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    // 根据种类id找到种类表数据
    const category = await this.categoryService.findOne(+createProductDto.categoryId);
    // 创建数据表对应的规格
    const product = this.productRepository.create(createProductDto);
    // 给商品对象表添加一个category种类id，负责对应种类表某一个
    product.category = category;
    // 获取用户id
    product.addedBy = currentUser;
    // 添加到数据库表中
    return await this.productRepository.save(product);
  }

  // 查询所有商品数据 分页查询
  async findAll(query: any): Promise<{ products: any[], totalProducts: number, limit: number }> {
    let filteredTotalProducts: number;
    let limit: number;

    if (!query.limit) {
      limit = 1;
    } else {
      limit = query.limit;
    }

    // 查询商品以及左连接种类表
    const queryBuilder = dataSource.getRepository(ProductEntity)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoin("product.reviews", "review")
      .addSelect([
        "COUNT(review.id) AS reviewCount",
        "FORMAT(AVG(review.ratings), 2) AS avgRating"
      ])
      .groupBy("product.id, category.id");

    const totalProducts = await queryBuilder.getCount();

    // 模糊查询 根据商品title
    if (query.search) {
      const search = query.search;
      queryBuilder.andWhere("product.title like :title", { title: `%${search}%` });
    }

    // 查询种类，根据种类id
    if (query.category) {
      queryBuilder.andWhere("category.id=:id", { id: query.category });
    }

    // 查询大于等于 >= 前端传递过来的价格
    if (query.minPrice) {
      queryBuilder.andWhere("product.price>=:minPrice", { minPrice: query.minPrice });
    }

    // 查询小于等于 <= 前端传递过来的价格
    if (query.maxPrice) {
      queryBuilder.andWhere("product.price<=:maxPrice", { maxPrice: query.maxPrice });
    }

    // 查询最小评分 聚合函数： AVG计算平均值
    if (query.minRating) {
      queryBuilder.andHaving("AVG(review.ratings) >= :minRating", { minRating: query.minRating });
    }

    if (query.maxRating) {
      queryBuilder.andHaving("AVG(review.ratings <= :maxRating", { maxRating: query.maxRating });
    }

    // 分页查询，limit表示一次展示几条数据
    queryBuilder.limit(limit);

    // 根据limit进行分页，page表示页数
    if (query.page) {
      if (query.page <= 0) throw new BadRequestException("page页数参数不能小于1");
      // 这里offset从0开始偏移的 需要把传递过来的参数进行 -1 才能从1开始计算 例如参数过来为1 - 1 = 0 这里offset从0开始偏移的
      queryBuilder.offset(+query.page - 1);
    }

    const products = await queryBuilder.getRawMany();

    return {
      products,
      totalProducts,
      limit
    };
  }

  // 根据id查询所有商品，并左连接其他两个关联表
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: ["addedBy", "category"],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true
        },
        category: {
          id: true,
          title: true
        }
      }
    });

    if (!product) throw new NotFoundException(`未找到id为${id}的商品`);
    return product;
  }

  // 修改商品表 Partial接收一个T类型，可以把T类型里面所有类型转为可选属性
  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity
  ): Promise<ProductEntity> {
    // 查询要被修改的商品列表
    const product = await this.findOne(id);
    // 把前端发过来的数据覆盖根据id查询到的商品数据
    Object.assign(product, updateProductDto);
    // 获取用户id
    product.addedBy = currentUser;
    if (updateProductDto.categoryId) {
      // 如果有种类id，则会根据种类id查询到相对应的种类数据 给product添加种类数据
      product.category = await this.categoryService.findOne(+updateProductDto.categoryId);
    }
    // 最后保存在数据库中
    return await this.productRepository.save(product);
  }

  // 根据id删除商品数据
  async remove(id: number) {
    const product = await this.findOne(id);
    const order = await this.orderService.findOneByProductId(product.id);
    if(order) throw new BadRequestException("商品正在使用中");
    return await this.productRepository.remove(product);
  }

  /*
  * 更新商品库存
  *
  * @param id  商品id
  * @param stock  存货
  * @param status 订单状态
  *
  * */
  async updateStock(id: number, stock: number, status: string) {
    let product: ProductEntity = await this.findOne(id);
    // 假如商品支付成功了 则减少商品的库存数
    if (status == OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      // 否则商品库存则被添加
      product.stock += stock;
    }
    // 把数据保存在数据表中
    product = await this.productRepository.save(product);
    return product;
  }
}
