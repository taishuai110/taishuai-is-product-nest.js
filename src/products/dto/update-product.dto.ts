import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// 这里不用标注类型，这里使用了继承创建DTO的
export class UpdateProductDto extends PartialType(CreateProductDto) {}
