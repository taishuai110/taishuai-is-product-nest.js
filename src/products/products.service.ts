import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from "./entities/product.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService
  ) { }

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

  // 查询所有商品数据
  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  // 根据id查询所有商品，并左连接其他两个关联表
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: {
        addedBy: true,
        category: true
      },
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

    if (!product) throw new NotFoundException(`未找到id为:${id}的商品`);
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
      // 如果有种类id，则会根据种类id查询到相对应的种类数据
      const category = await this.categoryService.findOne(+updateProductDto.categoryId);
      // 给product添加种类数据
      product.category = category;
    }
    // 最后保存在数据库中
    return await this.productRepository.save(product);
  }

  // 根据id删除商品数据
  async remove(id: number) {
    const product = await this.findOne(id);
    if(!product) throw new NotFoundException("找不到你要删除的商品id");
    const productDelet: DeleteResult = await this.productRepository.delete(id);
    // affected删除的数量
    if(!productDelet.affected) throw new BadRequestException("删除数据失败"); 
    return true;
  }
}
