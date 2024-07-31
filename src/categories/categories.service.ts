import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryEntity } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepositiory: Repository<CategoryEntity>
  ) {
  }

  async create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<CategoryEntity> {
    const category: CategoryEntity = await this.categoryRepositiory.create(createCategoryDto);
    category.addedBy = currentUser;
    return await this.categoryRepositiory.save(category);
  }

  // 查询所有种类表
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepositiory.find();
  }

  // 根据id查询种类表
  async findOne(id: number): Promise<CategoryEntity> {
    // findOne不好做深层的左连接，但createQueryBuilder好做深层表连接
    return await this.categoryRepositiory.createQueryBuilder('categories')
      .leftJoinAndSelect('categories.addedBy', 'users')
      .leftJoinAndSelect('users.roles', 'roles')
      .where("categories.id = :id", { id })
      .getOne();
  }

  // 更新或修改种类表
  async update(id: number, fields: Partial<UpdateCategoryDto>): Promise<CategoryEntity> {
    // 这里查找种类表是否存在
    const category: CategoryEntity = await this.findOne(id);
    if (!category) throw new NotFoundException("找不到要修改的种类id");
    // 把前端发来的数据用field接收，然后再赋值给category变量
    Object.assign(category, fields);
    // save方法用来保存表数据的
    return await this.categoryRepositiory.save(category);
  }

  async remove(id: number) {
    const category: CategoryEntity = await this.findOne(id);
    if(!category) throw new NotFoundException('找不到要删除的种类id');
    // 注意：有两种删除方法，一种delete硬删除数据，另外一种remove软删除数据
    return await this.categoryRepositiory.delete(id);
  }
}
