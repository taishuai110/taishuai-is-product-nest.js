import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AuthenticationGuard } from "../utility/guards/authentication.guard";
import { AuthorizationGuard } from "../utility/guards/authorization.guard";
import { Roles } from "../utility/common/user-roles.ennum";
import { UserEntity } from "../users/entities/user.entity";
import { CurrentUser } from "../utility/decorators/current-user.decorator";
import { ProductEntity } from "./entities/product.entity";
import { SerializeIncludes } from "../utility/interceptors/serialize.interceptor";
import { ProductList, ProductsDto } from "./dto/products.dto";

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

  // 查询全部商品数据 分页查询 @UseInterceptors(SerializeIntercepor)用于拦截响应前端时的生命周期
  @SerializeIncludes(ProductsDto)
  @Get()
  findAll(@Query() query: any): Promise<ProductsDto> {
    return this.productsService.findAll(query);
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
    return await this.productsService.remove(+id);
  }
}
