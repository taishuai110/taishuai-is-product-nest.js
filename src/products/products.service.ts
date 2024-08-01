import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from "./entities/product.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService
  ) { }

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

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
