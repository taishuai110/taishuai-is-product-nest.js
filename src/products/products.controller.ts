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

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(+id);
  }
}
