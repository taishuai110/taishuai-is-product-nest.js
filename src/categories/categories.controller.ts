import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { UserEntity } from "../users/entities/user.entity";
import { CategoryEntity } from "./entities/category.entity";
import { CurrentUser } from "src/utility/decorators/current-user.decorator";
import { AuthenticationGuard } from "../utility/guards/authentication.guard";
import { AuthorizationGuard } from "../utility/guards/authorization.guard";
import { Roles } from "../utility/common/user-roles.ennum";
import { DeleteResult } from "typeorm";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {
  }

  // 创建category表数据  currentUser拿的是解析后的东西，里面包含用户id
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() currentUser: UserEntity): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  // 查询所有种类表
  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  // 根据id查询种类表
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<CategoryEntity> {
    return await this.categoriesService.findOne(+id);
  }

  // 根据id更新种类数据
  // 管道，用来判断当前用户是否拥有权限 AuthenticationGuard用来判断是否有jwt  AuthorizationGuard用来判断权限
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }

  // 根据id删除种类数据
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const category: DeleteResult = await this.categoriesService.remove(+id);
    // affected表示删除的行数 0时表示未删除数据
    if(!category.affected) throw new BadRequestException("未能删除种类数据");
    return {
      message: '已删除种类数据',
      code: 200,
      data: []
    };
  }
}
