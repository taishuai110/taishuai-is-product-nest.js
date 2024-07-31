// 创建校验信息
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty({ message: '标题一定不能为空' })
  @IsString({ message: '标题要为字符串类型' })
  title: string;

  @IsNotEmpty({ message: '关键词描述一定不能为空' })
  @IsString({ message: '关键词描述要为字串类型' })
  description: string;

}
