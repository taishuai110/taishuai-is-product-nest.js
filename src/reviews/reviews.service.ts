import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productService: ProductsService
  ) { }

  // 创建评论区
  async create(createReviewDto: CreateReviewDto, currentUser: UserEntity): Promise<ReviewEntity> {
    // 查找是否存在这个商品id
    const product = await this.productService.findOne(createReviewDto.productId);
    // 根据用户id和商品id查询是否有这个用户及其商品 
    let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.productId);
    // 假如没有用户对应的商品
    if (!review) {
      // 则开始记录评论内容跟评论等级，并对评论表关联用户跟商品
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      // 假如用户有对应的商品 则开始记录用户评论跟评论等级
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }
    // 开始把前端传递过来的值保存到数据库中
    return await this.reviewRepository.save(review);
  }

  findAll() {
    return `This action returns all reviews`;
  }

  // 查询商品下所有评论  商品id
  async findAllByProduct(id: number): Promise<ReviewEntity[]> {
    // 这里查询是否存在该商品 productService.findOne里面的方法已经做了商品判断
    await this.productService.findOne(id);
    // 返回该商品下所有评论
    return await this.reviewRepository.find({
      where: { product: { id } },
      relations: {
        user: true,
        product: {
          category: true
        }
      }
    })
  }

  /**
   *  根据id查找评论内容
   * @param id 评论id
   * @returns 
   */
  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true
        }
      }
    });
    if (!review) throw new NotFoundException("找不到评论内容");
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return this.reviewRepository.remove(review);
  }

  /**
   * 创建异步查询用户跟商品的数据
   * @param userId 用户id
   * @param productId 商品id
   */
  async findOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewRepository.findOne({
      where: {
        user: {
          id: userId
        },
        product: {
          id: productId
        }
      },
      relations: {
        user: true,
        product: {
          category: true
        }
      }
    })
  }
}
