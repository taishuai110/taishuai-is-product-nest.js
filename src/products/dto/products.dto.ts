import { Expose, Transform, Type } from "class-transformer";

export class ProductsDto {
  // 商品总数
  @Expose()
  totalProducts: number;

  // 展示多少条数据
  @Expose()
  limit: number;

  @Expose()
  @Type(() => ProductList)
  products: ProductList[];
}

export class ProductList {
  // 商品id
  @Expose({ name: "product_id" })
  id: number;

  // 商品名称
  @Expose({ name: 'product_title' })
  title: string;

  // 商品描述
  @Expose({ name: "product_description" })
  description: string;

  // 商品价格
  @Expose({ name: "product_price" })
  price: number;

  // 商品库存
  @Expose({ name: "product_stock" })
  stock: number;

  // 商品图片链接
  @Expose({ name: "product_images" })
  @Transform(({ value }) => value.toString().split(','))
  images: string[];

  // 商品创建时间
  @Expose({ name: "product_createdAt" })
  createdAt: string;

  // 商品修改时间
  @Expose({ name: "product_updatedAt" })
  updatedAt: string;

  @Transform(({obj}) => {
    return {
      id: obj.category_id,
      title: obj.category_title
    }
  })

  @Expose()
  category: any;

  @Expose({ name: 'reviewcount' })
  review: number;

  @Expose({ name: "avgrating" })
  rating: number;


}