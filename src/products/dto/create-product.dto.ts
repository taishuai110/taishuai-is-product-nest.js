// dto可以用来当作接收参数类型声明以及对参数接收的校验
import { IsArray, IsNotEmpty, IsNumber, Min, IsString } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty({ message: "标题一定不能为空" })
  @IsString()
  title: string;

  @IsNotEmpty({ message: "关键词一定不能为空" })
  @IsString()
  description: string;

  @IsNotEmpty({ message: "价格不能为空" })
  // number类型，且精确到两位小数
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "价格要为number且小数点最大是两位小数" })
  price: number;

  @IsNotEmpty({ message: "库存不能为空" })
  @IsNumber({}, { message: "库存要为number" })
  @Min(0, { message: "库存一定不能为负数" })
  stock: number;

  @IsNotEmpty({ message: "图片不能为空" })
  @IsArray({ message: "图片要为数组格式" })
  images: string[];

  @IsNotEmpty({ message: "类别id不能为空" })
  @IsNumber({}, { message: "类别id要为number" })
  categoryId: number;
}
