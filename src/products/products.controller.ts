import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AuthenticationGuard } from "../utility/guards/authentication.guard";
import { AuthorizationGuard } from "../utility/guards/authorization.guard";
import { Roles } from "../utility/common/user-roles.ennum";
import { UserEntity } from '../users/entities/user.entity';
import { CurrentUser } from '../utility/decorators/current-user.decorator';
import { ProductEntity } from "./entities/product.entity";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  // 添加商品信息
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() currentUser: UserEntity): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  // 查询全部商品数据
  @Get()
  findAll(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
  }

  // 根据ID查询某一个商品
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(+id);
  }

  // 修改商品数据
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Patch(":id")
  async update(
    @Param("id") id: string, 
    @Body() updateProductDto: UpdateProductDto, 
    @CurrentUser() currentUser: UserEntity
  ): Promise<ProductEntity> {
    return await this.productsService.update(+id, updateProductDto, currentUser);
  }

  // 删除商品数据
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const flag = await this.productsService.remove(+id)
    return {
      message: flag ? "商品删除成功" : "商品删除失败，请联系管理员",
      data: [],
      code: 200
    };
  }
}
